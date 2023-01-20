<?php

namespace App\Services;

use App\Models\Outfit;
use App\Models\Tag;
use App\Traits\UploadedImageSave;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class OutfitService
{
    use UploadedImageSave;

    /**
     * Check current service's assigned class for duplicates.
     *
     * @param  string  $search
     * @param  string  $column
     * @return  bool
     */
    public function checkForDuplicate($search, $column): bool
    {
        return Outfit::where($column, '=', $search)->exists();
    }

    /**
     * Retrieve all outfits associated with user.
     */
    public function retrieveAll($userId = null)
    {
        if (!empty($userId)) {
            return Outfit::withoutGlobalScopes()
                ->where('user_id', $userId)
                ->with(['tags' => fn ($query) => $query->orderBy('title', 'ASC'), 'character'])
                ->orderBy('title', 'ASC')
                ->get();
        }

        return Outfit::with(['tags' => fn ($query) => $query->orderBy('title', 'ASC')])
            ->orderBy('title', 'ASC')
            ->get();
    }

    /**
     * Retrieve all outfits asociated with user and series.
     */
    public function retrieveByCharacter(int $characterId)
    {
        return Outfit::with(['tags' => fn ($query) => $query->orderBy('title', 'ASC'), 'character'])
            ->where('character_id', $characterId)
            ->orderBy('title', 'ASC')
            ->get();
    }

    /**
     * Create new Outfit.
     *
     * @param  string  $userId
     * @param  array  $validated
     */
    public function create(string $userId, array $validated)
    {
        if ($this->checkForDuplicate($userId, $validated['title'], 'title')) {
            return back()->withErrors('Outfit already exists with this title');
        }

        ['image' => $image, 'tags' => $tags] = $validated;
        unset($validated['image']);
        unset($validated['tags']);

        $outfit = new Outfit([
            ...$validated,
            'user_id' => $userId,
        ]);

        // Store image.
        if (!empty($image)) {
            $outfit->images = $this->saveUploadedImage($image, 'outfit', 400);
        } else {
            $outfit->images = '200x400.png';
        }

        // Store tags
        if (!empty($tags)) {
            $incoming_tags = (!is_array($tags)) ? [$tags] : $tags;

            foreach ($incoming_tags as $tag_id) {
                if (!empty($tag_id)) {
                    $tag = Tag::find($tag_id);

                    // Tag doesn't exist
                    if (empty($tag)) {
                        $new_tag = Tag::create(['user_id' => $userId, 'title' => $tag_id]);

                        DB::collection('outfits_tags')->update(
                            ['outfit_id' => $outfit->id, 'tag_id' => $new_tag->id],
                            ['upsert' => true]
                        );
                    } else {
                        DB::collection('outfits_tags')->update(
                            ['outfit_id' => $outfit->id, 'tag_id' => $tag->id],
                            ['upsert' => true]
                        );
                    }
                }
            }
        }

        $success = $outfit->save();

        if ($success) {
            return to_route('outfits.index');
        } else {
            return back()->withErrors('Something went wrong while trying to create a new outfit');
        }
    }

    /**
     * Update existing outfit.
     *
     * @param  string  $userId
     * @param  \App\Models\Outfit  $outfit
     * @param  array  $validated
     */
    public function update(string $userId, Outfit $outfit, array $validated)
    {
        if ($outfit->user_id === $userId) {
            ['title' => $title, 'image' => $image, 'tags' => $tags] = $validated;
            unset($validated['title']);
            unset($validated['image']);
            unset($validated['tags']);

            $outfit->fill($validated);

            // If they want to change title
            if (!empty($title)) {
                // Check if new title is same as old title
                if ($title === $outfit->title) {
                    // Do nothing
                } elseif ($this->checkForDuplicate($userId, $title, 'title')) {
                    return back()->withErrors('Outfit already exists with this title');
                } else {
                    $outfit->title = $title;
                }
            }

            // If they want to change image
            if (!empty($image)) {
                $outfit->images = $this->saveUploadedImage($image, 'outfit', 400, $outfit->images);
            }

            // If they want to change tags
            if (!empty($tags)) {
                $old_tags = DB::collection('outfits_tags')->where('outfit_id', $outfit->id)->pluck('tag_id')->toArray();
                $old_tags = (!is_array($old_tags)) ? [$old_tags] : $old_tags;
                $incoming_tags = (!is_array($tags)) ? [$tags] : $tags;

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

                                DB::collection('outfits_tags')->update(
                                    ['outfit_id' => $outfit->id, 'tag_id' => $new_tag->id],
                                    ['upsert' => true]
                                );
                            } else {
                                DB::collection('outfits_tags')->update(
                                    ['outfit_id' => $outfit->id, 'tag_id' => $tag->id],
                                    ['upsert' => true]
                                );
                            }
                        }
                    }
                }

                if (!empty($tags_to_remove)) {
                    foreach ($tags_to_remove as $tag_id) {
                        DB::collection('outfits_tags')->where(['outfit_id' => $outfit->id, 'tag_id' => $tag_id])->delete();
                    }
                }
            }

            $success = $outfit->save();

            if ($success) {
                return to_route('outfits.index');
            } else {
                return back()->withErrors('Something went wrong while trying to update outfit');
            }
        } else {
            return back()->withErrors('You do not have permission');
        }
    }

    /**
     * Remove existing outfit.
     *
     * @param  string  $userId
     * @param  \App\Models\Outfit  $outfit
     */
    public function delete(string $userId, Outfit $outfit)
    {
        if ($outfit->user_id === $userId) {
            // Delete outfit images
            $images = explode('||', $outfit->images);
            array_shift($images);

            foreach ($images as $image) {
                if ($image !== '300x400.png') {
                    if (Storage::exists($image)) {
                        Storage::delete($image);
                    }
                }
            }

            $success = $outfit->delete();
        } else {
            return back()->withErrors('You do not have permission');
        }

        if ($success) {
            return to_route('outfits.index');
        } else {
            return back()->withErrors('Something went wrong while trying to remove outfit');
        }
    }

    /**
     * Delete image associated to outfit.
     *
     * @param  string  $userId
     * @param  \App\Models\Outfit  $outfit
     * @param  int  $index
     */
    public function deleteImage(string $userId, Outfit $outfit, int $index)
    {
        if ($outfit->user_id === $userId) {
            // Get stored images as an array
            $stored_images = explode('||', $outfit->images);
            array_shift($stored_images);

            // Get path of image
            $path = $stored_images[$index];
            if ($path == '300x400.png') {
                return back()->withErrors('Cannot delete placeholder image.');
            }

            // Remove image from stored images array
            unset($stored_images[$index]);

            // Remove image from storage
            if (Storage::exists($path)) {
                Storage::delete($path);
            }

            // If no more images exist, put placeholder
            // If they do, put them back together and store
            if (empty($stored_images)) {
                $stored_images = ['300x400.png'];
                $outfit->images = '||300x400.png';
            } else {
                $outfit->images = '||' . implode('||', $stored_images);
            }

            $success = $outfit->save();

            if ($success) {
                return to_route('outfits.index');
            } else {
                return back()->withErrors('Did not find an image to remove');
            }
        } else {
            return back()->withErrors('You do not have permission');
        }
    }
}
