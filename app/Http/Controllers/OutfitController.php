<?php

namespace App\Http\Controllers;

use App\Outfit;
use App\Character;
use App\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OutfitController extends Controller
{
    /**
     * Display a listing of the resource.
     * Used for All Cosplays Page.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user_id = Auth::user()->id;
        $outfits = Outfit::where('user_id', $user_id)->orderBy('title', 'ASC')->get();

        foreach ($outfits as $outfit) {
            $images = explode('||', $outfit->images);
            array_shift($images);

            foreach ($images as &$image) {
                $image = '/storage/' . $image;
            }
            unset($image);

            $outfit->images = $images;
            $outfit->character_name = Character::find($outfit->character_id)->name;

            // Setup format of tags
            $tags = DB::table('outfits_tags')->where('outfit_id', $outfit->id)->pluck('tag_id');
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

                $outfit->tags = $final_tags;
            }
        }

        return $outfits;
    }

    /**
     * Display a listing of the resource by character.
     * Used for Cosplay Grid.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function indexByCharacter($id)
    {
        $user_id = Auth::user()->id;
        $outfits = Outfit::where([['user_id', $user_id], ['character_id', $id]])->orderBy('title', 'ASC')->get();

        foreach ($outfits as $outfit) {
            $images = explode('||', $outfit->images);
            array_shift($images);

            foreach ($images as &$image) {
                $image = '/storage/' . $image;
            }
            unset($image);

            $outfit->images = $images;

            // Setup format of tags
            $tags = DB::table('outfits_tags')->where('outfit_id', $outfit->id)->pluck('tag_id');
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

                $outfit->tags = $final_tags;
            }
        }

        return $outfits;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'string|required',
            'character_id' => 'integer|required',
            'image' => 'string|nullable',
            'status' => 'integer|required',
            'obtained_on' => 'date_format:Y-m-d|nullable',
            'creator' => 'string|nullable',
            'storage_location' => 'string|nullable',
            'times_worn' => 'string|nullable',
            'tags' => 'nullable',
            'tags.*' => 'string|nullable'
        ]);

        if($validator->fails()) {
            return return_json_message($validator->errors(), self::STATUS_BAD_REQUEST);
        }

        $user_id = Auth::user()->id;

        if (check_for_duplicate($user_id, $request->title, 'outfits', 'title')) {
            return return_json_message('Outfit already exists with this title', self::STATUS_BAD_REQUEST);
        }

        $outfit = new Outfit;
        $outfit->user_id = $user_id;
        $outfit->character_id = $request->character_id;
        $outfit->title = trim($request->title);
        $outfit->status = $request->status;
        $outfit->obtained_on = $request->obtained_on;
        $outfit->creator = trim($request->creator);
        $outfit->storage_location = trim($request->storage_location);
        $outfit->times_worn = $request->times_worn;

        // Store images
        if ($request->has('image')) {
            $outfit->images = save_image_uploaded($request->image, 'outfit', 400);
        } else {
            $outfit->images = '||300x400.png';
        }

        $success = $outfit->save();

        // Store tags
        if ($request->has('tags') && !empty($request->tags)) {
            $incoming_tags = (!is_array($request->tags)) ? [$request->tags] : $request->tags;

            foreach ($incoming_tags as $tag_id) {
                if(!empty($tag_id)) {
                    $tag = Tag::find($tag_id);

                    // Tag doesn't exist
                    if (empty($tag)) {
                        $new_tag = new Tag;
                        $new_tag->user_id = $user_id;
                        $new_tag->title = $tag_id;
                        $new_tag->save();

                        DB::table('outfits_tags')->insertOrIgnore(
                            ['outfit_id' => $outfit->id, 'tag_id' => $new_tag->id]
                        );
                    } else {
                        DB::table('outfits_tags')->insertOrIgnore(
                            ['outfit_id' => $outfit->id, 'tag_id' => $tag->id]
                        );
                    }
                }
            }
        }

        $success = $outfit->save();

        if ($success) {
            return return_json_message('Created new outfit succesfully', self::STATUS_SUCCESS);
        } else {
            return return_json_message('Something went wrong while trying to create a new outfit', self::STATUS_UNPROCESSABLE);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'string',
            'images' => 'string|nullable',
            'status' => 'integer',
            'obtained_on' => 'date_format:Y-m-d|nullable',
            'creator' => 'string|nullable',
            'storage_location' => 'string|nullable',
            'times_worn' => 'string|nullable',
            'tags' => 'nullable',
            'tags.*' => 'string|nullable',
        ]);

        if($validator->fails()) {
            return return_json_message($validator->errors(), self::STATUS_BAD_REQUEST);
        }

        $user_id = Auth::user()->id;

        try {
            $outfit = Outfit::findOrFail($id);

            if ($outfit->user_id === $user_id) {
                // If they want to change title
                if ($request->has('title')) {
                    $trimmed_title = trim($request->title);

                    // Check if new title is same as old title
                    if ($trimmed_title === $outfit->title) {
                        // Do nothing
                    } else if(check_for_duplicate($user_id, $request->title, 'outfits', 'title')) {
                        return return_json_message('Outfit already exists with this title.', self::STATUS_BAD_REQUEST);
                    } else {
                        $outfit->title = $trimmed_title;
                    }
                }

                // If they want to change image
                if ($request->has('image')) {
                    $outfit->images = save_image_uploaded($request->image, 'outfit', 400, $outfit->images);
                }

                // If they want to change status
                if ($request->has('status')) {
                    $outfit->status = $request->status;
                }

                // If they want to change obtained_on
                if ($request->has('obtained_on')) {
                    $outfit->obtained_on = $request->obtained_on;
                }

                // If they want to change creator
                if ($request->has('creator')) {
                    $outfit->creator = trim($request->creator);
                }

                // If they want to change storage location
                if ($request->has('storage_location')) {
                    $outfit->storage_location = trim($request->storage_location);
                }

                // If they want to change times worn
                if ($request->has('times_worn')) {
                    $outfit->times_worn = $request->times_worn;
                }

                // If they want to change tags
                if ($request->has('tags') && !empty($request->tags)) {
                    $old_tags = DB::table('outfits_tags')->where('outfit_id', $outfit->id)->pluck('tag_id')->toArray();
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
                
                                    DB::table('outfits_tags')->insertOrIgnore(
                                        ['outfit_id' => $outfit->id, 'tag_id' => $new_tag->id]
                                    );
                                } else {
                                    DB::table('outfits_tags')->insertOrIgnore(
                                        ['outfit_id' => $outfit->id, 'tag_id' => $tag->id]
                                    );
                                }
                            }
                        }
                    }

                    if (!empty($tags_to_remove)) {
                        foreach ($tags_to_remove as $tag_id) {
                            DB::table('outfits_tags')->where(['outfit_id' => $outfit->id, 'tag_id' => $tag_id])->delete();
                        }
                    }
                }

                $success = $outfit->save();

                if ($success) {
                    $images = explode('||', $outfit->images);
                    array_shift($images);
        
                    foreach ($images as &$image) {
                        $image = '/storage/' . $image;
                    }
                    unset($image);
        
                    $outfit->images = $images;

                    $tags = DB::table('outfits_tags')->where('outfit_id', $outfit->id)->pluck('tag_id');
                    if(!empty($tags)) {
                        $final_tags = [];
                        foreach($tags as $tag_id) {
                            $tag = Tag::find($tag_id);
                            if (!empty($tag)) {
                                $final_tags[] = ['value' => $tag_id, 'label' => $tag->title];
                            }
                        }
                        $outfit->tags = $final_tags;
                    }

                    return return_json_message('Updated character succesfully', self::STATUS_SUCCESS, ['outfit' => $outfit]);
                } else {
                    return return_json_message('Something went wrong while trying to update outfit', self::STATUS_BAD_REQUEST);
                }
            } else {
                return return_json_message('You do not have permission to edit this outfit', self::STATUS_UNAUTHORIZED);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid outfit id', self::STATUS_BAD_REQUEST);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user_id = Auth::user()->id;
        $success = false;

        try {
            $outfit = Outfit::findOrFail($id);

            if ($outfit->user_id === $user_id) {
                // Delete outfit images
                $images = explode('||', $outfit->images);
                array_shift($images);

                foreach ($images as $image) {
                    if ($image !== '300x400.png') {
                        $image_path = storage_path('app/public/' . $image);

                        if (file_exists($image_path)) {
                            unlink($image_path);
                        }
                    }
                }
                
                $success = $outfit->delete();
            } else {
                return return_json_message('You do not have permission to delete this outfit', self::STATUS_UNAUTHORIZED);
            }
    
            if ($success) {
                return return_json_message('Deleted outfit succesfully', self::STATUS_SUCCESS);
            } else {
                return return_json_message('Did not find an outfit to remove', self::STATUS_NOT_FOUND);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid outfit id', self::STATUS_BAD_REQUEST);
        }
    }

    /**
     * Remove image from outfit.
     * 
     * @param  int  $id
     * @param  int  $path
     * @return \Illuminate\Http\Response
     */
    public function deleteImage($id, $index) {
        $user_id = Auth::user()->id;
        $success = false;

        try {
            $outfit = Outfit::findOrFail($id);

            if ($outfit->user_id === $user_id) {
                // Get stored images as an array
                $stored_images = explode('||', $outfit->images);
                array_shift($stored_images);

                // Get path of image
                $path = $stored_images[$index];
                if($path == '300x400.png') {
                    return return_json_message('Cannot delete placeholder image.', self::STATUS_BAD_REQUEST);
                }

                // Remove image from stored images array
                unset($stored_images[$index]);

                // Get storage path for image
                $image_stored_path = storage_path('app/public/' . $path);

                // Remove image from storage
                if (file_exists($image_stored_path)) {
                    unlink($image_stored_path);
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
            } else {
                return return_json_message('You do not have permission to delete this outfit', self::STATUS_UNAUTHORIZED);
            }

            if ($success) {
                foreach ($stored_images as &$image) {
                    $image = '/storage/' . $image;
                }
                unset($image);
                return return_json_message('Deleted image from outfit succesfully', self::STATUS_SUCCESS, ['images' => $stored_images]);
            } else {
                return return_json_message('Did not find an image to remove', self::STATUS_NOT_FOUND);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid outfit id', self::STATUS_BAD_REQUEST);
        }
    }
}
