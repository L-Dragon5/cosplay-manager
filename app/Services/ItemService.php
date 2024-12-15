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
            ->get()
            ->each(function ($item) {
                $item->images = $item->images;
            });
    }

    /**
     * Create new Item.
     *
     * @param  int  $userId
     * @param  array  $validated
     */
    public function create(int $userId, array $validated)
    {
        $info = [];

        // Verify value validates and isn't empty.
        if (!empty($validated['url'])) {
            $url = $validated['url'];

            // If url is actually a JSON object.
            if ($this->isJson($url)) {
                $info = json_decode($url, true);
            } else {
                return back()->withErrors(['url' => 'URL not recognized']);
            }
        }

        if (empty($info)) {
            return back()->withErrors(['url' => 'Could not retrieve item information']);
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
                return back()->withErrors(['url' => 'Item already exists']);
            } else {
                $item = Item::create([
                    'user_id' => $userId,
                    'image_url' => implode('||', $info['images'] ?? []),
                    'original_title' => $info['title'] ?? '',
                    'seller_name' => $info['seller'] ?? '',
                    'listing_url' => $info['url'] ?? '',
                    'original_price' => $info['price'] ?? -1,
                ]);

                if (!empty($item)) {
                    return to_route('taobao-organizer');
                } else {
                    return back()->withErrors(['url' => 'Something went wrong while adding item']);
                }
            }
        }
    }

    /**
     * Update existing item.
     *
     * @param  int  $userId
     * @param  \App\Models\Item  $item
     * @param  array  $validated
     */
    public function update(int $userId, Item $item, array $validated)
    {
        if ($item->user_id === $userId) {
            @['tags' => $incoming_tags] = $validated;
            unset($validated['tags']);

            $item->fill($validated);

            // If they want to change tags.
            if (!empty($incoming_tags)) {
                $old_tags = $item->tags()->pluck('id')->toArray();
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
     * @param  int  $userId
     * @param  \App\Models\Item  $item
     */
    public function delete(int $userId, Item $item)
    {
        if ($item->user_id === $userId) {
            // Delete image associated with item
            $images = explode('||', $item->image_url);
            foreach ($images as $image) {
                if (!filter_var($image, FILTER_VALIDATE_URL)) {
                        if (Storage::exists($image)) {
                            Storage::delete($image);
                        }
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
     * @param  int  $userId
     * @param  \App\Models\Item  $item
     */
    public function archive(int $userId, Item $item)
    {
        if ($item->user_id === $userId) {
            $item->is_archived = true;
            $item->archived_at = now();
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
     * @param  int  $userId
     * @param  \App\Models\Item  $item
     */
    public function unarchive(int $userId, Item $item)
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
}
