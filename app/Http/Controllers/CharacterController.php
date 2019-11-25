<?php

namespace App\Http\Controllers;

use App\Character;
use App\Outfit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;

class CharacterController extends Controller
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
        $characters = Character::where('user_id', $user_id)->orderBy('name', 'ASC')->get();

        foreach ($characters as $c) {
            $c->outfit_count = Outfit::where('character_id', '=', $c->id)->count();
            $c->image = '/storage/' . $c->image;
        }

        return $characters;
    }

    /**
     * Display a listing of the resource by series.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function indexBySeries($id)
    {
        $user_id = Auth::user()->id;
        $characters = Character::where([['user_id', $user_id], ['series_id', $id]])->orderBy('name', 'ASC')->get();

        foreach ($characters as $c) {
            $c->outfit_count = Outfit::where('character_id', '=', $c->id)->count();
            $c->image = '/storage/' . $c->image;
        }

        return $characters;
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
            'name' => 'string|required',
            'series_id' => 'integer|required',
            'image' => 'file|image|nullable',
            'image_url' => 'url|nullable'
        ]);

        if($validator->fails()) {
            return return_json_message($validator->errors(), $this->errorStatus);
        }

        $user_id = Auth::user()->id;

        if (check_for_duplicate($user_id, $request->name, 'characters', 'name')) {
            return return_json_message('Character already exists with this name', $this->errorStatus);
        }

        $character = new Character;
        $character->user_id = $user_id;
        $character->series_id = $request->series_id;
        $character->name = trim($request->name);

        if ($request->hasFile('image')) {
            $character->image = save_image_uploaded($request->file('image'), 'character', 400);
        } else if ($request->has('image_url') && !empty($request->image_url)) {
            $character->image = save_image_url($request->image_url, 'character', 400);
        } else {
            $character->image = '200x400.png';
        }

        $success = $character->save();

        if ($success) {
            return return_json_message('Created new character succesfully', $this->successStatus);
        } else {
            return return_json_message('Something went wrong while trying to create a new character', 401);
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
        $character = null;

        try {
            $character = Character::findOrFail($id);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid character id', 401);
        }
        
        return $character;
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
            'name' => 'string|required',
            'image' => 'file|image|nullable',
            'image_url' => 'url|nullable'
        ]);

        if($validator->fails()) {
            return return_json_message($validator->errors(), $this->errorStatus);
        }

        $user_id = Auth::user()->id;

        try {
            $character = Character::findOrFail($id);

            if ($character->user_id === $user_id) {
                // If they want to change name
                if ($request->has('name')) {
                    $trimmed_name = trim($request->name);

                    // Check if new name is same as old name
                    if ($trimmed_name === $character->name) {
                        // Do nothing
                    } else if(check_for_duplicate($user_id, $request->name, 'characters', 'name')) {
                        return return_json_message('Character name already exists.', $this->errorStatus);
                    } else {
                        $character->name = $trimmed_name;
                    }
                }

                // If they want to change image
                if ($request->hasFile('image')) {
                    $character->image = save_image_uploaded($request->file('image'), 'character', 400, $character->image);
                } else if ($request->has('image_url') && !empty($request->image_url)) {
                    $character->image = save_image_url($request->image_url, 'character', 400, $character->image);
                }

                $success = $character->save();

                if ($success) {
                    $character->image = '/storage/' . $character->image;
                    return return_json_message('Updated character succesfully', $this->successStatus, ['character' => $character]);
                } else {
                    return return_json_message('Something went wrong while trying to update character', 401);
                }
            } else {
                return return_json_message('You do not have permission to edit this character', $this->errorStatus);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid character id', 401);
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
            $character = Character::findOrFail($id);

            if ($character->user_id === $user_id) {
                // Delete all images from related outfits
                $outfits = Outfit::where('character_id', $character->id)->get();

                foreach ($outfits as $outfit) {
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
                }

                // Delete character image
                if ($character->image !== '200x400.png') {
                    $image_path = storage_path('app/public/' . $character->image);

                    if (file_exists($image_path)) {
                        unlink($image_path);
                    }
                }

                $success = $character->delete();
            } else {
                return return_json_message('You do not have permission to delete this character', $this->errorStatus);
            }
    
            if ($success) {
                return return_json_message('Deleted character succesfully', $this->successStatus);
            } else {
                return return_json_message('Something went wrong while trying to remove character', 401);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid character id', 401);
        }
    }
}
