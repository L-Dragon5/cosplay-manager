<?php

namespace App\Http\Controllers;

use App\Outfit;
use App\Character;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;

class OutfitController extends Controller
{
    private $successStatus = 200;
    private $errorStatus = 422;

    /**
     * Display a listing of the resource.
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
        }

        return $outfits;
    }

    /**
     * Display a listing of the resource by character.
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
            'images' => 'nullable',
            'images.*' => 'file|image',
            'image_url' => 'url|nullable',
            'status' => 'integer|required',
            'bought_date' => 'date_format:Y-m-d|nullable',
            'storage_location' => 'string|nullable',
            'times_worn' => 'string|nullable'
        ]);

        if($validator->fails()) {
            return return_json_message($validator->errors(), $this->errorStatus);
        }

        $user_id = Auth::user()->id;

        if (check_for_duplicate($user_id, $request->title, 'outfits', 'title')) {
            return return_json_message('Outfit already exists with this title', $this->errorStatus);
        }

        $outfit = new Outfit;
        $outfit->user_id = $user_id;
        $outfit->character_id = $request->character_id;
        $outfit->title = trim($request->title);
        $outfit->status = $request->status;
        $outfit->bought_date = $request->bought_date;
        $outfit->storage_location = trim($request->storage_location);
        $outfit->times_worn = $request->times_worn;

        if ($request->hasFile('images')) {
            $outfit->images = save_image_uploaded($request->file('images'), 'outfit', 400);
        } else if ($request->has('image_url') && !empty($request->image_url)) {
            $outfit->images = save_image_url($request->image_url, 'outfit', 400);
        } else {
            $outfit->images = '||300x400.png';
        }

        $success = $outfit->save();

        if ($success) {
            return return_json_message('Created new outfit succesfully', $this->successStatus);
        } else {
            return return_json_message('Something went wrong while trying to create a new outfit', 401);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        /*
        id, user_id, character_id, title, images, status, bought_date, storage_location, times_worn
        */
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
            'title' => 'string|required',
            'images' => 'nullable',
            'images.*' => 'file|image',
            'image_url' => 'url|nullable',
            'status' => 'integer|required',
            'bought_date' => 'date_format:Y-m-d|nullable',
            'storage_location' => 'string|nullable',
            'times_worn' => 'string|nullable'
        ]);

        if($validator->fails()) {
            return return_json_message($validator->errors(), $this->errorStatus);
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
                        return return_json_message('Outfit already exists with this title.', $this->errorStatus);
                    } else {
                        $outfit->title = $trimmed_title;
                    }
                }

                // If they want to change image
                if ($request->hasFile('images')) {
                    $outfit->images = save_image_uploaded($request->file('images'), 'outfit', 400, $outfit->images);
                } else if ($request->has('image_url') && !empty($request->image_url)) {
                    $outfit->images = save_image_url($request->image_url, 'outfit', 400, $outfit->images);
                }

                // If they want to change status
                if ($request->has('status')) {
                    $outfit->status = $request->status;
                }

                // If they want to change bought_date
                if ($request->has('bought_date')) {
                    $outfit->bought_date = $request->bought_date;
                }

                // If they want to change storage location
                if ($request->has('storage_location')) {
                    $outfit->storage_location = trim($request->storage_location);
                }

                // If they want to change times worn
                if ($request->has('times_worn')) {
                    $outfit->times_worn = $request->times_worn;
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
                    return return_json_message('Updated character succesfully', $this->successStatus, ['outfit' => $outfit]);
                } else {
                    return return_json_message('Something went wrong while trying to update outfit', 401);
                }
            } else {
                return return_json_message('You do not have permission to edit this outfit', $this->errorStatus);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid outfit id', 401);
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
                return return_json_message('You do not have permission to delete this outfit', $this->errorStatus);
            }
    
            if ($success) {
                return return_json_message('Deleted outfit succesfully', $this->successStatus);
            } else {
                return return_json_message('Did not find a outfit to remove', 401);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid outfit id', 401);
        }
    }
}
