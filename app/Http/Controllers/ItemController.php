<?php

namespace App\Http\Controllers;

use App\Item;
use App\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use DateTime;
use DateTimeZone;

class ItemController extends Controller
{
    private $stream_opts = [
        "ssl" => [
            "verify_peer" => FALSE,
            "verify_peer_name" => FALSE,
        ]
    ];

    /**
    * Get all items associated with User.
    * 
    * @return \Illuminate\Http\Response
    */
    public function index() {
        $user_id = Auth::user()->id;
        $items = Item::where('user_id', $user_id)->orderBy('created_at', 'DESC')->get();
        
        foreach($items as $item) {
            $tags = DB::table('items_tags')->where('items_tags.item_id', $item->id)->pluck('tag_id');

            if(!empty($tags)) {
                $final_tags = [];
                foreach($tags as $tag_id) {
                    $tag = Tag::find($tag_id);
                    if (!empty($tag)) {
                        $final_tags[] = ['value' => $tag_id, 'label' => $tag->title];
                    }
                }
                
                usort($final_tags, function ($item1, $item2) {
                    return $item1['label'] <=> $item2['label'];
                });
                
                $item->tags = $final_tags;
            }
            
            if ($item->created_at !== NULL) {
                $converted_time_added = new DateTime($item->created_at);
                $item->created_at_est = $converted_time_added->setTimezone(new DateTimeZone('America/New_York'));
            }

            if ($item->archived_at !== NULL) {
                $converted_time_archived = new DateTime($item->archived_at);
                $item->archived_at_est = $converted_time_archived->setTimezone(new DateTimeZone('America/New_York'));
            }
        }
        
        return $items;
    }

    /**
     * TODO: Might not need this function.
     * Get all items associated with User based on Tag ID.
     * 
     * @return \Illuminate\Http\Response
     */
    public function indexByTag($id) {
        $user_id = Auth::user()->id;
        $items = Item::where([
            ['user_id', $user_id],
            ['tag_id', $id],
        ])->orderBy('created_at', 'DESC')->get();
        
        foreach($items as $item) {
            $converted_time_added = new DateTime($item->created_at);
            $item->created_at_est = $converted_time_added->setTimezone(new DateTimeZone('America/New_York'));
            
            $converted_time_archived = new DateTime($item->archived_at);
            $item->archived_at_est = $converted_time_archived->setTimezone(new DateTimeZone('America/New_York'));
        }
        
        return $items;
    }
    
    /**
     * Given a URL, scrape and store information into database.
     * 
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'url' => 'url|required',
        ]);

        if ($validator->fails()) {
            return return_json_message($validator->errors(), self::STATUS_BAD_REQUEST);
        }
        
        $info = [];
        
        // If "taobao" is in the URL, it's a Taobao link
        // Check for tmall as well.
        if (strpos($request->url, 'taobao') !== FALSE) {
            $content = $this->get_page($request->url);

            preg_match('#<script(.*?)</script>#is', $content, $matches);
            $base_script = strip_tags($matches[0]); // The <script> tag that contains all the config variables.

            $script_parts = explode('};', $base_script);    // Separate script.
            $first_curly_bracket = strpos($script_parts[0], '{');   // Get position of first curly bracket of object.
            $json = substr($script_parts[0], $first_curly_bracket + 1); // Get JSON object from first curly bracket.
            $json_split = explode(',', $json);  // Separate json by commas.
    
            $product_array = [];    // Turning json object values into a php array for use.
            foreach ($json_split as $entry) {
                $colonSplit = explode(':', $entry); // Separate by the colon for key and value.
                $key = trim($colonSplit[0]);
                $value = "";    // Some keys don't have values.
                if (!empty($colonSplit[1])) {
                    $value = trim($colonSplit[1]);
                }
    
                $product_array[$key] = $this->getValueInQuotes($value); // Get value without the quotes.
            }
    
            $info['image'] = 'http:' . $product_array['pic'];
            $info['seller'] = $product_array['sellerNick'];
            $info['price'] = (!empty($product_array['price']) ? $product_array['price'] : '-1.00');
            $info['url'] = $request->url;
    
            $title = str_replace('\\', '', preg_replace('/u([0-9A-F]+)/', '&#x$1;', $product_array['title']));
            $info['title'] = html_entity_decode($title, ENT_COMPAT, 'UTF-8');
        } else if (strpos($request->url, 'tmall') !== FALSE) {
            // TODO: Figure out a way to scrape TMall
            /*
            $content = $this->get_page($request->url);
            preg_match('#<script(.*?)</script>#is', $content, $matches);
            $shop_setup_json = $this->get_string_between($content, 'TShop.Setup(', '})();');
            //$shop_setup_json = json_decode($this->get_string_between($content, 'TShop.Setup(', '})();'));
            
            var_dump($content);
            var_dump($matches);
            var_dump($shop_setup_json);
            */
            return return_json_message('TMall links are not currently supported', self::STATUS_BAD_REQUEST);
        } else {
            return return_json_message('URL not recognized', self::STATUS_BAD_REQUEST);
        }

        if(empty($info)) {
            return return_json_message('Could not retrieve item information', self::STATUS_UNPROCESSABLE);
        } else {
            $item = new Item;
            
            $item->user_id = Auth::user()->id;
            $item->image_url = $info['image'];
            $item->original_title = $info['title'];
            $item->seller_name = $info['seller'];
            $item->listing_url = $info['url'];
            $item->original_price = $info['price'];
            
            $success = $item->save();
            
            if($success) {
                return return_json_message('Item added successfully', self::STATUS_SUCCESS);
            } else {
                return return_json_message('Something went wrong while adding item', self::STATUS_UNPROCESSABLE);
            }
        }
    }
    
    /**
     * Check for duplicate item before adding.
     * 
     * return \Illuminate\Http\Response
     */
    public function checkItem(Request $request) {
        $validator = Validator::make($request->all(), [
            'url' => 'url|required',
        ]);

        if ($validator->fails()) {
            return return_json_message($validator->errors(), self::STATUS_BAD_REQUEST);
        }

        $user_id = Auth::user()->id;

        $split_url = explode('&', $request->url)[0];
        $item = Item::where([['user_id', '=', $user_id], ['listing_url', 'LIKE', '%' . $split_url . '%']])->first();

        if ($item === NULL) {
            return return_json_message(['exists' => FALSE], self::STATUS_SUCCESS);
        } else {
            return return_json_message(['exists' => TRUE], self::STATUS_SUCCESS);
        }

        return return_json_message('Something went wrong while trying to check for duplicate items', self::STATUS_UNPROCESSABLE);
    }
    
    /**
     * Update the specified item in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'custom_title'  => 'string|nullable',
            'quantity'      => 'numeric|nullable',
            'notes'         => 'string|nullable',
            'tags'          => 'array|nullable',
        ]);
        
        if($validator->fails()) {
            return return_json_message($validator->errors(), self::STATUS_BAD_REQUEST);
        }

        $user_id = Auth::user()->id;

        try {
            $item = Item::findOrFail($id);

            // Check if user has access.
            if ($item->user_id !== $user_id) {
                return return_json_message('You do not have permission to archive this item', self::STATUS_UNAUTHORIZED);
            }

            // If they want to change custom title.
            if ($request->has('custom_title')) {
                $item->custom_title = $request->custom_title;
            }

            // If they want to change quantity.
            if ($request->has('quantity')) {
                $item->quantity = $request->quantity;
            }

            // If they want to change notes.
            if ($request->has('notes')) {
                $item->notes = $request->notes;
            }

            // If they want to change tags.
            if ($request->has('tags') && !empty($request->tags)) {
                $old_tags = DB::table('items_tags')->where('item_id', $item->id)->pluck('tag_id')->toArray();
                $old_tags = (!is_array($old_tags)) ? [$old_tags] : $old_tags;
                $incoming_tags = (!is_array($request->tags)) ? [$request->tags] : $request->tags;

                $tags_to_remove = array_diff($old_tags, $incoming_tags);
                $tags_to_insert = array_diff($incoming_tags, $old_tags);

                if (!empty($tags_to_insert)) {
                    foreach ($tags_to_insert as $tag_id) {
                        if(!empty($tag_id)) {
                            $tag = Tag::find($tag_id);
        
                            // Tag doesn't exist
                            if (empty($tag)) {
                                $new_tag = new Tag;
                                $new_tag->user_id = $user_id;
                                $new_tag->title = $tag_id;
                                $new_tag->save();
            
                                DB::table('items_tags')->insertOrIgnore(
                                    ['item_id' => $item->id, 'tag_id' => $new_tag->id]
                                );
                            } else {
                                DB::table('items_tags')->insertOrIgnore(
                                    ['item_id' => $item->id, 'tag_id' => $tag->id]
                                );
                            }
                        }
                    }
                }

                if (!empty($tags_to_remove)) {
                    foreach ($tags_to_remove as $tag_id) {
                        DB::table('items_tags')->where(['item_id' => $item->id, 'tag_id' => $tag_id])->delete();
                    }
                }
            }

            $success = $item->save();

            if ($success) {
                $tags = DB::table('items_tags')->where('items_tags.item_id', $item->id)->pluck('tag_id');

                if(!empty($tags)) {
                    $final_tags = [];
                    foreach($tags as $tag_id) {
                        $tag = Tag::find($tag_id);
                        if (!empty($tag)) {
                            $final_tags[] = ['value' => $tag_id, 'label' => $tag->title];
                        }
                    }
                    
                    usort($final_tags, function ($item1, $item2) {
                        return $item1['label'] <=> $item2['label'];
                    });
                    
                    $item->tags = $final_tags;
                }
                
                if ($item->created_at !== NULL) {
                    $converted_time_added = new DateTime($item->created_at);
                    $item->created_at_est = $converted_time_added->setTimezone(new DateTimeZone('America/New_York'));
                }

                if ($item->archived_at !== NULL) {
                    $converted_time_archived = new DateTime($item->archived_at);
                    $item->archived_at_est = $converted_time_archived->setTimezone(new DateTimeZone('America/New_York'));
                }
                
                return return_json_message('Updated item succesfully', self::STATUS_SUCCESS, ['item' => $item]);
            } else {
                return return_json_message('Something went wrong while trying to update item', self::STATUS_BAD_REQUEST);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid item id', self::STATUS_BAD_REQUEST);
        }
    }
    
    /**
     * Archive selected item.
     * 
     * @return \Illuminate\Http\Response
     */
    public function archive($id)
    {
        $user_id = Auth::user()->id;

        try {
            $item = Item::findOrFail($id);

            if ($item->user_id !== $user_id) {
                return return_json_message('You do not have permission to archive this item', self::STATUS_UNAUTHORIZED);
            }
            
            $item->is_archived = TRUE;
            $item->archived_at = DB::raw('now()');
            $success = $item->save();

            if ($success) {
                return return_json_message('Item archived successfully', self::STATUS_SUCCESS);
            } else {
                return return_json_message('Something went wrong while trying to archive item', self::UNPROCESSABLE);
            }
        } catch (\Illuminate\Database\Eolquent\ModelNotFoundException $e) {
            return return_json_message('Invalid item id', self::STATUS_BAD_REQUEST);
        }
    }
    
    /**
     * Unarchived selected item.
     * 
     * @return \Illuminate\Http\Response
     */
    public function unarchive($id)
    {
        $user_id = Auth::user()->id;

        try {
            $item = Item::findOrFail($id);

            if ($item->user_id !== $user_id) {
                return return_json_message('You do not have permission to unarchive this item', self::STATUS_UNAUTHORIZED);
            }
            
            $item->is_archived = FALSE;
            $item->archived_at = NULL;
            $success = $item->save();

            if ($success) {
                return return_json_message('Item unarchived successfully', self::STATUS_SUCCESS);
            } else {
                return return_json_message('Something went wrong while trying to archive item', self::UNPROCESSABLE);
            }
        } catch (\Illuminate\Database\Eolquent\ModelNotFoundException $e) {
            return return_json_message('Invalid item id', self::STATUS_BAD_REQUEST);
        }
    }
    
    /**
     * Remove selected item.
     * 
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user_id = Auth::user()->id;
        $success = false;

        try {
            $item = Item::findOrFail($id);

            if ($item->user_id === $user_id) {
                // Delete image associated with item
                if (!filter_var($item->image_url, FILTER_VALIDATE_URL)) {
                    $image_path = storage_path('app/public/' . str_replace('/storage', '', $item->image_url));

                    if (file_exists($image_path)) {
                        unlink($image_path);
                    }
                }
                
                $success = $item->delete();
            } else {
                return return_json_message('You do not have permission to delete this item', self::STATUS_UNAUTHORIZED);
            }

            if ($success) {
                return return_json_message('Deleted item successfully', self::STATUS_SUCCESS);
            } else {
                return return_json_message('Did not find an item to remove', self::STATUS_NOT_FOUND);
            }
        } catch (\Illuminate\Database\Eolquent\ModelNotFoundException $e) {
            return return_json_message('Invalid item id', self::STATUS_BAD_REQUEST);
        }
        $id = $request->input('id');
        if(empty($id)) {
            return response()->json(array('message' => 'Item not found.'), 400);
        }
        
        $item = Item::find($id);
        $item->delete();
        
        return response()->json(array('message' => 'Item removed succesfully.'), 200);
    }

    /**
     * Used to remove quotes and get the value within it.
     */
    private function getValueInQuotes($val) {
        preg_match('/".*?"|\'.*?\'/', $val , $matches);
        if (!empty($matches)) {
            $return = $matches[0];
            $return = str_replace("'", '', $return);
            $return = str_replace('"', '', $return);

            return $return;
        }

        return NULL;
    }

    private function get_string_between($string, $start, $end) {
        $string = ' ' . $string;
        $ini = strpos($string, $start);
        if ($ini == 0) return '';
        $ini += strlen($start);
        $len = strpos($string, $end, $ini) - $ini;
        return substr($string, $ini, $len);
    }

    private function get_page($url) {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, True);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($curl, CURLOPT_ENCODING ,"");
        curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: text/plain; charset=UTF-8']); 
        curl_setopt($curl,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36');
        $return = curl_exec($curl);
        curl_close($curl);
        return mb_convert_encoding($return, 'utf-8', 'gb2312');
    }
}