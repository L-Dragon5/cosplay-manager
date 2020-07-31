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
    
    // Given a url, store item information into database
    public function store(Request $request)
    {
        require(app_path('Scripts/simple_html_dom.php'));
        $url = $request->input('url');
        $url = filter_var($url, FILTER_SANITIZE_URL);
        
        $info = array();
        if(filter_var($url, FILTER_VALIDATE_URL, FILTER_FLAG_SCHEME_REQUIRED) !== FALSE) {
            if(!empty($url)) {
                $root = file_get_html($url);
                
                if($root) {
                    $detail = $root->find('#detail', 0);
                    
                    if($detail) {
                        // Taobao
                        $imageViewer = $root->find('.tb-main-pic', 0);
                        // Check if TMall
                        if(!$imageViewer) {
                            $imageViewer = $root->find('.tb-booth', 0);
                        }
                        
                        // Get user id
                        $info['uid'] = Auth::id();
                        
                        // Get image of item
                        if($imageViewer && !empty($image = $imageViewer->find('img#J_ImgBooth', 0)->src)) {
                            $info['image'] = 'http:' . $image;
                        }
                        
                        // Get title of item
                        $title = $detail->find('h3.tb-main-title', 0);
                        if(!$title) { // TMall
                            $title = $detail->find('h1', 0);
                        }
                        
                        if($title && !empty($title)) {
                            $children = $title->children;
                            foreach($children as $child) {
                                $child->outertext = '';
                            }
                            $info['title'] = trim(mb_convert_encoding($title->innertext, 'utf-8', 'gb2312'));
                        }
                        
                        // Get seller of item
                        $seller = $detail->find('a.tb-seller-name', 0);
                        $sellerSub = 0;
                        if(!$seller) { // TMall
                            $seller = $root->find('li#J_attrBrandName', 0);
                            $sellerSub = 11;
                        }
                        
                        if($seller && !empty($seller)) {
                            $children = $seller->children;
                            foreach($children as $child) {
                                $child->outertext = '';
                            }
                            $info['seller'] = trim(mb_convert_encoding(substr($seller->innertext, $sellerSub), 'utf-8', 'gb2312'));
                        } else {
                            $info['seller'] = 'N/A';
                        }
                        
                        // Get price of item
                        $price = $detail->find('em.tb-rmb-num', 0);
                        if(!$price) { // TMall
                            $price = $detail->find('span.tm-price', 0);
                        }
                        
                        if($price && !empty($price)) {
                            $children = $title->children;
                            foreach($children as $child) {
                                $child->outertext = '';
                            }
                            $info['price'] = trim($price->innertext);
                        } else {
                            // Issue with TMall loading speed
                            $info['price'] = '-1.00';
                        }
                        
                        // Set URL of item
                        $info['url'] = $url;
                    }
                }
            }
        }
        
        if(empty($info)) {
            return response()->json(array('message' => 'Please enter valid urls.'), 400);
        } else {
            $item = new Item;
            
            $item->user_id = $info['uid'];
            $item->image_url = $info['image'];
            $item->original_title = $info['title'];
            $item->seller_name = $info['seller'];
            $item->listing_url = $info['url'];
            $item->original_price = $info['price'];
            
            $result = $item->save();
            
            if($result) {
                return response()->json(array('message' => 'Item added successfully.', 200));
            } else {
                return response()->json(array('message' => 'Something went wrong while adding item.', 400));
            }
        }
    }
    
    // Check Item before adding to DB
    public function checkItem(Request $request) {
        $url = $request->input('url');
        $url = filter_var($url, FILTER_SANITIZE_URL);
        if(filter_var($url, FILTER_VALIDATE_URL, FILTER_FLAG_SCHEME_REQUIRED) !== FALSE) {
            if(!empty($url)) {
                $split_url = explode('&', $url)[0];
                $item = Item::where('listing_url', 'LIKE', '%' . $split_url . '%')->first();
                
                // If item doesn't exist
                if($item === NULL) {
                    return response()->json(array('exists' => false, 200));
                } else {
                    return response()->json(array('exists' => true, 200));
                }
            }
        }
        
        return response()->json(array('message' => 'Please enter valid urls.'), 400);
    }
    
    // Get Item by its ID
    public function getItem($id)
    {
        $item = Item::find($id);
        $item->price = $this->convertCurrency($item->original_price);
        $tags = DB::table('items_tags')
        ->join('tags', 'items_tags.tag_id', '=', 'tags.id')
        ->where('items_tags.item_id', '=', $item->id)
        ->select('tags.id', 'tags.name')
        ->get();
        $item->tags = $tags;
        
        $converted_time_added = new DateTime($item->created_at);
        $item->created_at_est = $converted_time_added->setTimezone(new DateTimeZone('America/New_York'));
        
        $converted_time_archived = new DateTime($item->archived_at);
        $item->archived_at_est = $converted_time_archived->setTimezone(new DateTimeZone('America/New_York'));
        
        
        return response()->json(array('item' => $item), 200);
    }
    
    // Get tags associated with item
    public function getItemTagID($id)
    {
        $tags = DB::table('items_tags')
        ->join('tags', 'items_tags.tag_id', '=', 'tags.id')
        ->where('items_tags.item_id', '=', $id)
        ->select('tags.id', 'tags.name')
        ->get();
        
        return response()->json(array('tags' => $tags), 200);
    }
    
    // Update item given data from edit form
    public function update(Request $request)
    {
        $id = $request->input('id');
        
        if(empty($id)) {
            return response()->json(array('message' => 'Item not found.'), 400);
        }
        
        $rules = array(
            'custom_title'  => 'string|nullable',
            'quantity'      => 'numeric|nullable',
            'notes'         => 'string|nullable'
        );
        $validator = Validator::make($request->all(), $rules);
        
        if($validator->fails()) {
            return response()->json(array('message' => $validator), 400);
        } else {
            $item = Item::find($id);
            $item->custom_title = $request->input('custom_title');
            $item->quantity = $request->input('quantity');
            $item->notes = $request->input('notes');
            $item->save();
            
            $tags = $request->input('tags');
            if(!isset($tags)) { $tags = array(); }
            
            $item_tagged = DB::table('items_tags')->select('tag_id')->where('item_id', '=', $id)->get();
            foreach($item_tagged as $tag) {
                if(in_array($tag, $tags)) {
                    unset($tags[array_search($tag->tag_id, $tags)]);
                } else {
                    DB::table('items_tags')->where([ ['tag_id', '=', $tag->tag_id], ['item_id', '=', $id] ])->delete();
                }
            }
            
            if(!empty($tags)) {
                foreach($tags as $tag) {
                    DB::table('items_tags')->insert([ ['item_id' => $id, 'tag_id' => $tag] ]);
                }
            }
            
            return response()->json(array('message' => 'Item updated successfully.', 200));
        }
    }
    
    // Archive selected item
    public function archive(Request $request)
    {
        $id = $request->input('id');
        if(empty($id)) {
            return response()->json(array('message' => 'Item not found.'), 400);
        }
        
        $item = Item::find($id);
        $item->is_archived = true;
        $item->archived_at = DB::raw('now()');
        $item->save();
        
        return response()->json(array('message' => 'Item archived successfully.'), 200);
    }
    
    // Unarchive selected item
    public function unarchive(Request $request)
    {
        $id = $request->input('id');
        if(empty($id)) {
            return response()->json(array('message' => 'Item not found.'), 400);
        }
        
        $item = Item::find($id);
        $item->is_archived = false;
        $item->archived_at = NULL;
        $item->save();
        
        return response()->json(array('message' => 'Item unarchived successfully.'), 200);
    }
    
    // Remove selected item
    public function destroy(Request $request)
    {
        $id = $request->input('id');
        if(empty($id)) {
            return response()->json(array('message' => 'Item not found.'), 400);
        }
        
        $item = Item::find($id);
        $item->delete();
        
        return response()->json(array('message' => 'Item removed succesfully.'), 200);
    }
}
