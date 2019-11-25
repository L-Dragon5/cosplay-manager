<?php

namespace App\Http\Controllers;

use App\Outfit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use Intervention\Image\Facades\Image;

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
        $outfit->storage_location = $request->storage_location;
        $outfit->times_worn = $request->times_worn;

        if ($request->hasFile('images')) {
            $images = $request->file('images');

            if (!file_exists(storage_path('app/public/outfit/'))) {
                mkdir(storage_path('app/public/outfit/'), 666, true);
            }

            if (is_array($images)) { // multiple images
                foreach ($images as $img) {
                    $filename_with_ext = $img->getClientOriginalName();
                    $filename = pathinfo($filename_with_ext, PATHINFO_FILENAME);
                    $extension = $img->getClientOriginalExtension();
                    $filename_to_store = $filename . '_' . time() . '.' . $extension;

                    $final_img = Image::make($img)->resize(null, 400, function ($constraint) {
                        $constraint->aspectRatio();
                    });
                    $final_img->save(storage_path('app/public/outfit/' . $filename_to_store), 80);

                    $outfit->images .= '||outfit/' . $filename_to_store;
                }
            } else { // single image
                $filename_with_ext = $images->getClientOriginalName();
                $filename = pathinfo($filename_with_ext, PATHINFO_FILENAME);
                $extension = $images->getClientOriginalExtension();
                $filename_to_store = $filename . '_' . time() . '.' . $extension;

                $img = Image::make($images)->resize(null, 400, function ($constraint) {
                    $constraint->aspectRatio();
                });
                $img->save(storage_path('app/public/outfit/' . $filename_to_store), 80);

                $outfit->images .= '||outfit/' . $filename_to_store;
            }
        } else {
            $outfit->image = '||300x400.png';
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
            'character_id' => 'integer|required',
            'images' => 'nullable',
            'images.*' => 'file|image',
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
        $outfit->storage_location = $request->storage_location;
        $outfit->times_worn = $request->times_worn;

        if ($request->hasFile('images')) {
            $images = $request->file('images');

            if (!file_exists(storage_path('app/public/outfit/'))) {
                mkdir(storage_path('app/public/outfit/'), 666, true);
            }

            if (is_array($images)) { // multiple images
                foreach ($images as $img) {
                    $filename_with_ext = $img->getClientOriginalName();
                    $filename = pathinfo($filename_with_ext, PATHINFO_FILENAME);
                    $extension = $img->getClientOriginalExtension();
                    $filename_to_store = $filename . '_' . time() . '.' . $extension;

                    $final_img = Image::make($img)->resize(null, 400, function ($constraint) {
                        $constraint->aspectRatio();
                    });
                    $final_img->save(storage_path('app/public/outfit/' . $filename_to_store), 80);

                    $outfit->images .= '||outfit/' . $filename_to_store;
                }
            } else { // single image
                $filename_with_ext = $images->getClientOriginalName();
                $filename = pathinfo($filename_with_ext, PATHINFO_FILENAME);
                $extension = $images->getClientOriginalExtension();
                $filename_to_store = $filename . '_' . time() . '.' . $extension;

                $img = Image::make($images)->resize(null, 400, function ($constraint) {
                    $constraint->aspectRatio();
                });
                $img->save(storage_path('app/public/outfit/' . $filename_to_store), 80);

                $outfit->images .= '||outfit/' . $filename_to_store;
            }
        } else {
            $outfit->image = '||300x400.png';
        }

        $success = $outfit->save();

        if ($success) {
            return return_json_message('Created new outfit succesfully', $this->successStatus);
        } else {
            return return_json_message('Something went wrong while trying to create a new outfit', 401);
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
