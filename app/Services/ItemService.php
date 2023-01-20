<?php

namespace App\Services;

use App\Models\Item;
use App\Models\Tag;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ItemService
{
    /**
     * Retrieve all items associated with user.
     */
    public function retrieveAll()
    {
        return Item::with(['tags' => fn ($query) => $query->orderBy('title', 'ASC')])
            ->orderBy('created_at', 'DESC')
            ->get();
    }

    /**
     * Create new Item.
     *
     * @param  string  $userId
     * @param  array  $validated
     */
    public function create(string $userId, array $validated)
    {
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
                $content = $this->getPage($url);

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

                $info['image'] = 'http:' . $product_array['pic'];
                $info['seller'] = $product_array['sellerNick'];
                $info['price'] = (!empty($product_array['price']) ? $product_array['price'] : '-1.00');
                $info['url'] = $url;

                $title = str_replace('\\', '', preg_replace('/u([0-9A-F]+)/', '&#x$1;', $product_array['title']));
                $info['title'] = html_entity_decode($title, ENT_COMPAT, 'UTF-8');
            } elseif (strpos($url, 'tmall') !== false) {
                $content = $this->getPage($url);

                if (!empty($content)) {
                    $shop_setup_text_dirty = $this->getStringBetween($content, 'TShop.Setup(', '})();');
                    $shop_setup_text = $this->getStringBetween('$5' . $shop_setup_text_dirty, '$5', ');');
                    $shop_setup_json = json_decode($shop_setup_text);

                    $item_json = $shop_setup_json->itemDO;
                    $detail_json = $shop_setup_json->detail;
                    $property_pics_json = $shop_setup_json->propertyPics;

                    $info['title'] = $item_json->title;
                    $info['seller'] = $item_json->brand;
                    $info['image'] = 'http:' . $property_pics_json->default[0];
                    $info['price'] = (!empty($detail_json->defaultItemPrice) ? $detail_json->defaultItemPrice : '-1.00');
                    $info['url'] = $url;
                } else {
                    return back()->withErrors('Could not retrieve information from TMall. Please try again later.');
                }
            } else {
                return back()->withErrors('URL not recognized');
            }
        }

        if (empty($info)) {
            return back()->withErrors('Could not retrieve item information');
        } else {
            $exists = false;

            // If duplication check hasn't happened yet, check for duplicate listings.
            if (!isset($validated['override'])) {
                $split_url = explode('&', $url)[0];
                if (Item::where('listing_url', 'LIKE', '%' . $split_url . '%')->exists()) {
                    $exists = true;
                }
            }

            // Item exists. Add if it doesn't.
            if ($exists) {
                return back()->withErrors('Item already exists');
            } else {
                $item = Item::create([
                    'user_id' => $userId,
                    'image_url' => $info['image'],
                    'original_title' => $info['title'],
                    'seller_name' => $info['seller'],
                    'listing_url' => $info['url'],
                    'original_price' => $info['price'],
                ]);

                if (!empty($item)) {
                    return to_route('taobao-organizer');
                } else {
                    return back()->withErrors('Something went wrong while adding item');
                }
            }
        }
    }

    /**
     * Update existing item.
     *
     * @param  string  $userId
     * @param  \App\Models\Item  $item
     * @param  array  $validated
     */
    public function update(string $userId, Item $item, array $validated)
    {
        if ($item->user_id === $userId) {
            ['tags' => $incoming_tags] = $validated;
            unset($validated['tags']);

            $item->fill($validated);

            // If they want to change tags.
            if (!empty($incoming_tags)) {
                $old_tags = $item->tags()->pluck('_id')->toArray();
                $tags_to_remove = array_diff($old_tags, $incoming_tags);
                $tags_to_insert = array_diff($incoming_tags, $old_tags);

                if (!empty($tags_to_insert)) {
                    $item->tags()->attach($tags_to_insert);
                }

                if (!empty($tags_to_remove)) {
                    $item->tags()->detach($tags_to_remove);
                }
            }

            $success = $item->save();

            if ($success) {
                return to_route('taobao-organizer');
            } else {
                return back()->withErrors('Something went wrong while trying to update item');
            }
        } else {
            return back()->withErrors('You do not have permission to edit this item');
        }
    }

    /**
     * Remove existing item.
     *
     * @param  string  $userId
     * @param  \App\Models\Item  $item
     */
    public function delete(string $userId, Item $item)
    {
        if ($item->user_id === $userId) {
            // Delete image associated with item
            if (!filter_var($item->image_url, FILTER_VALIDATE_URL)) {
                if (Storage::exists($item->image_url)) {
                    Storage::delete($item->image_url);
                }
            }

            $success = $item->delete();
        } else {
            return back()->withErrors('You do not have permission to delete this item');
        }

        if ($success) {
            return to_route('taobao-organizer');
        } else {
            return back()->withErrors('Something went wrong while trying to remove item');
        }
    }

    /**
     * Archive item.
     *
     * @param  string  $userId
     * @param  \App\Models\Item  $item
     */
    public function archive(string $userId, Item $item)
    {
        if ($item->user_id === $userId) {
            $item->is_archived = true;
            $item->archived_at = DB::raw('now()');
            $success = $item->save();

            if ($success) {
                return to_route('taobao-organizer');
            } else {
                return back()->withErrors('Something went wrong while trying to archive item');
            }
        } else {
            return back()->withErrors('You do not have permission to archive this item');
        }
    }

    /**
     * Unarchive item.
     *
     * @param  string  $userId
     * @param  \App\Models\Item  $item
     */
    public function unarchive(string $userId, Item $item)
    {
        if ($item->user_id === $userId) {
            $item->is_archived = false;
            $item->archived_at = null;
            $success = $item->save();

            if ($success) {
                return to_route('taobao-organizer');
            } else {
                return back()->withErrors('Something went wrong while trying to unarchive item');
            }
        } else {
            return back()->withErrors('You do not have permission to unarchive this item');
        }
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

    private function getStringBetween($string, $start, $end)
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

    private function getPage($url)
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
