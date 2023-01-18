<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemStoreRequest;
use App\Http\Requests\ItemUpdateRequest;
use App\Models\Item;
use App\Models\Tag;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    /**
     * Get all items associated with User.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user_id = Auth::user()->id;
        $items = Item::where('user_id', $user_id)->orderBy('created_at', 'DESC')->get();

        foreach ($items as $item) {
            // If local image, add / for root directory
            if (filter_var($item->image_url, FILTER_VALIDATE_URL) === false) {
                $item->image_url = Storage::url($item->image_url);
            }

            $tags = DB::table('items_tags')->where('items_tags.item_id', $item->id)->pluck('tag_id');

            if (!empty($tags)) {
                $final_tags = [];
                foreach ($tags as $tag_id) {
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
        }

        return $items;
    }

    /**
     * Given a URL, scrape and store information into database.
     *
     * @param  \App\Http\Requests\ItemStoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ItemStoreRequest $request)
    {
        $validated = $request->validated();

        $info = [];

        // Verify value validates and isn't empty.
        if (!empty($validated['url'])) {
            $url = $validated['url'];

            // If url is actually a JSON object.
            if ($this->isJson($url)) {
                $info = json_decode($url, true);
            }
            // If "taobao" is in the URL, it's a Taobao link
            // Check for tmall as well.
            elseif (strpos($url, 'taobao') !== false) {
                $content = $this->get_page($url);

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
                    $value = '';    // Some keys don't have values.
                    if (!empty($colonSplit[1])) {
                        $value = trim($colonSplit[1]);
                    }

                    $product_array[$key] = $this->getValueInQuotes($value); // Get value without the quotes.
                }

                $info['image_url'] = 'http:' . $product_array['pic'];
                $info['seller_name'] = $product_array['sellerNick'];
                $info['original_price'] = (!empty($product_array['price']) ? $product_array['price'] : '-1.00');
                $info['listing_url'] = $url;

                $title = str_replace('\\', '', preg_replace('/u([0-9A-F]+)/', '&#x$1;', $product_array['title']));
                $info['original_title'] = html_entity_decode($title, ENT_COMPAT, 'UTF-8');
            } elseif (strpos($url, 'tmall') !== false) {
                $content = $this->get_page($url);

                if (!empty($content)) {
                    $shop_setup_text_dirty = $this->get_string_between($content, 'TShop.Setup(', '})();');
                    $shop_setup_text = $this->get_string_between('$5' . $shop_setup_text_dirty, '$5', ');');
                    $shop_setup_json = json_decode($shop_setup_text);

                    $item_json = $shop_setup_json->itemDO;
                    $detail_json = $shop_setup_json->detail;
                    $property_pics_json = $shop_setup_json->propertyPics;

                    $info['original_title'] = $item_json->title;
                    $info['seller_name'] = $item_json->brand;
                    $info['image_url'] = 'http:' . $property_pics_json->default[0];
                    $info['original_price'] = (!empty($detail_json->defaultItemPrice) ? $detail_json->defaultItemPrice : '-1.00');
                    $info['listing_url'] = $url;
                } else {
                    return return_json_message('Could not retrieve information from TMall. Please try again later.', self::STATUS_UNPROCESSABLE);
                }
            } else {
                return return_json_message('URL not recognized', self::STATUS_BAD_REQUEST);
            }
        }

        if (empty($info)) {
            return return_json_message('Could not retrieve item information', self::STATUS_UNPROCESSABLE);
        } else {
            $item = Item::create([
                'user_id' => Auth::user()->id,
                ...$info,
            ]);

            $success = $item->save();

            if ($success) {
                return return_json_message('Item added successfully', self::STATUS_SUCCESS);
            } else {
                return return_json_message('Something went wrong while adding item', self::STATUS_UNPROCESSABLE);
            }
        }
    }

    /**
     * Check for duplicate item before adding.
     *
     * @param  \App\Http\Requests\ItemStoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function checkItem(ItemStoreRequest $request)
    {
        $validated = $request->validated();

        $user_id = Auth::user()->id;

        // Verify value validates and isn't empty.
        if (!empty($validated['url'])) {
            $url = $validated['url'];

            // If url is actually a JSON object.
            if ($this->isJson($url)) {
                $info = json_decode($url, true);
                $url = $info['url'];
            }

            $split_url = explode('&', $url)[0];
            $item = Item::where([['user_id', '=', $user_id], ['listing_url', 'LIKE', '%' . $split_url . '%']])->first();

            if ($item === null) {
                return return_json_message(['exists' => false], self::STATUS_SUCCESS);
            } else {
                return return_json_message(['exists' => true], self::STATUS_SUCCESS);
            }
        }

        return return_json_message('Something went wrong while trying to check for duplicate items', self::STATUS_UNPROCESSABLE);
    }

    /**
     * Update the specified item in storage.
     *
     * @param  \App\Http\Requests\ItemUpdateRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ItemUpdateRequest $request, $id)
    {
        $user_id = Auth::user()->id;

        try {
            $item = Item::findOrFail($id);
            $validated = $request->validated();

            // Check if user has access.
            if ($item->user_id !== $user_id) {
                return return_json_message('You do not have permission to archive this item', self::STATUS_UNAUTHORIZED);
            }

            $item->fill([
                ...$request->safe()->except(['tags']),
            ]);

            // If they want to change tags.
            if ($request->filled('tags')) {
                $old_tags = DB::table('items_tags')->where('item_id', $item->id)->pluck('tag_id')->toArray();
                $old_tags = (!is_array($old_tags)) ? [$old_tags] : $old_tags;
                $incoming_tags = (!is_array($validated['tags'])) ? [$validated['tags']] : $validated['tags'];

                $tags_to_remove = array_diff($old_tags, $incoming_tags);
                $tags_to_insert = array_diff($incoming_tags, $old_tags);

                if (!empty($tags_to_insert)) {
                    foreach ($tags_to_insert as $tag_id) {
                        if (!empty($tag_id)) {
                            $tag = Tag::find($tag_id);

                            // Tag doesn't exist
                            if (empty($tag)) {
                                $new_tag = Tag::create([
                                    'user_id' => $user_id,
                                    'title' => $tag_id,
                                ]);

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

                if (!empty($tags)) {
                    $final_tags = [];
                    foreach ($tags as $tag_id) {
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

            $item->is_archived = true;
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

            $item->is_archived = false;
            $item->archived_at = null;
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
        if (empty($id)) {
            return response()->json(['message' => 'Item not found.'], 400);
        }

        $item = Item::find($id);
        $item->delete();

        return response()->json(['message' => 'Item removed succesfully.'], 200);
    }

    /**
     * Used to remove quotes and get the value within it.
     */
    private function getValueInQuotes($val)
    {
        preg_match('/".*?"|\'.*?\'/', $val, $matches);
        if (!empty($matches)) {
            $return = $matches[0];
            $return = str_replace("'", '', $return);
            $return = str_replace('"', '', $return);

            return $return;
        }

        return null;
    }

    private function get_string_between($string, $start, $end)
    {
        $string = ' ' . $string;
        $ini = strpos($string, $start);
        if ($ini == 0) {
            return '';
        }
        $ini += strlen($start);
        $len = strpos($string, $end, $ini) - $ini;

        return trim(substr($string, $ini, $len));
    }

    private function isJson($string)
    {
        json_decode($string);

        return json_last_error() === JSON_ERROR_NONE;
    }

    private function get_page($url)
    {
        $user_agent = [
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.7 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.7',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/601.1.56 (KHTML, like Gecko) Version/9.0 Safari/601.1.56',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
            'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:41.0) Gecko/20100101 Firefox/41.0',
            'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
            'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
            'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36',
            'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
            'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko',
            'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13',
            'Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko',
            'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/5.0)',
        ];

        /*
        let cookies = document.cookie;
        cookies = cookies.split(";");
        cookies = cookies.map(cookie => cookie.replace(" ", ""));
        copy(cookies);
        */
        $options = [
            CURLOPT_RETURNTRANSFER => true, 	// return web page
            CURLOPT_HEADER => true, 	// return headers in addition to content
            CURLOPT_FOLLOWLOCATION => true, 	// follow redirects
            CURLOPT_ENCODING => '', 		// handle all encodings
            CURLOPT_AUTOREFERER => true, 	// set referer on redirect
            CURLOPT_CONNECTTIMEOUT => 120, 		// timeout on connect
            CURLOPT_TIMEOUT => 120, 		// timeout on response
            CURLOPT_MAXREDIRS => 10, 		// stop after 10 redirects
            CURLINFO_HEADER_OUT => true,
            CURLOPT_SSL_VERIFYPEER => false, 	// Disabled SSL Cert checks
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_COOKIE => 't=790766c71d5d9bd5cdc3c45a8be55e56; _tb_token_=755b38eee3f93; csg=548b8a07; lgc=ldragon5; cancelledSubSites=empty; dnk=ldragon5; existShop=MTY0MTM1MDAwNQ%3D%3D; tracknick=ldragon5; _cc_=UtASsssmfA%3D%3D; _l_g_=Ug%3D%3D; sg=55e; _nk_=ldragon5; mt=ci=0_1; uc1=cookie15=W5iHLLyFOGW7aA%3D%3D&existShop=false&cookie16=VT5L2FSpNgq6fDudInPRgavC%2BQ%3D%3D&pas=0&cookie21=W5iHLLyFfoaZ&cookie14=UoewAeY0P8oV%2Bg%3D%3D; thw=us; l=eBMsyl9Ig0zVzMyyKOfZnurza779LIRfguPzaNbMiOCP_L5y5i5fW6pWUXT2CnMNnsieR35T8LLDBWLidyzhCk_ErAcBs2JZndLh.; isg=BG5uuTiSg4x3I_foygyQFxdev8QwbzJpscUlrZg3iHEsew_VAPyxeO-xN_-XoyqB',
            CURLOPT_USERAGENT => $user_agent[array_rand($user_agent)],
            CURLOPT_HTTPHEADER => ['Content-Type: text/plain; charset=UTF-8'],
        ];

        $ch = curl_init($url);
        curl_setopt_array($ch, $options);
        $content = curl_exec($ch);
        curl_close($ch);

        return mb_convert_encoding($content, 'utf-8', 'gb2312');
    }
}
