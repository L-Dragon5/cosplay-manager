<?php

namespace App\Http\Controllers;

use App\Http\Requests\CharacterStoreRequest;
use App\Http\Requests\CharacterUpdateRequest;
use App\Models\Character;
use App\Models\Outfit;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CharacterController extends Controller
{
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
            $c->image_url = Storage::url($c->image);
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

        foreach ($characters as &$c) {
            $c->outfit_count = Outfit::where('character_id', '=', $c->id)->count();
            $c->image_url = Storage::url($c->image);
        }

        return $characters;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\CharacterStoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CharacterStoreRequest $request)
    {
        $user_id = Auth::user()->id;
        $validated = $request->validated();

        if (check_for_duplicate($user_id, $validated['name'], 'characters', 'name')) {
            return return_json_message('Character already exists with this name', self::STATUS_BAD_REQUEST);
        }

        $character = new Character([
            ...$request->safe()->except(['image']),
            'user_id' => $user_id,
        ]);

        if ($request->filled('image')) {
            $character->image = save_image_uploaded($validated['image'], 'character', 400);
        } else {
            $character->image = '200x400.png';
        }

        $success = $character->save();

        if ($success) {
            return return_json_message('Created new character succesfully', self::STATUS_SUCCESS);
        } else {
            return return_json_message('Something went wrong while trying to create a new character', self::STATUS_UNPROCESSABLE);
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
            return return_json_message('Invalid character id', self::STATUS_BAD_REQUEST);
        }

        return $character;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\CharacterUpdateRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CharacterUpdateRequest $request, $id)
    {
        $user_id = Auth::user()->id;

        try {
            $character = Character::findOrFail($id);
            $validated = $request->validated();

            if ($character->user_id === $user_id) {
                // If they want to change name
                if ($request->filled('name')) {
                    $name = $validated['name'];

                    // Check if new name is same as old name
                    if ($name === $character->name) {
                        // Do nothing
                    } elseif (check_for_duplicate($user_id, $name, 'characters', 'name')) {
                        return return_json_message('Character name already exists.', self::STATUS_BAD_REQUEST);
                    } else {
                        $character->name = $name;
                    }
                }

                // If they want to change image
                if ($request->filled('image')) {
                    $character->image = save_image_uploaded($validated['image'], 'character', 400, $character->image);
                }

                $success = $character->save();

                if ($success) {
                    $character->image_url = Storage::url($character->image);

                    return return_json_message('Updated character succesfully', self::STATUS_SUCCESS, ['character' => $character]);
                } else {
                    return return_json_message('Something went wrong while trying to update character', self::STATUS_UNPROCESSABLE);
                }
            } else {
                return return_json_message('You do not have permission to edit this character', self::STATUS_UNAUTHORIZED);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid character id', self::STATUS_BAD_REQUEST);
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
                            if (Storage::exists($image)) {
                                Storage::delete($image);
                            }
                        }
                    }
                }

                // Delete character image
                if ($character->image !== '200x400.png') {
                    if (Storage::exists($character->image)) {
                        Storage::delete($character->$image);
                    }
                }

                $success = $character->delete();
            } else {
                return return_json_message('You do not have permission to delete this character', self::STATUS_UNAUTHORIZED);
            }

            if ($success) {
                return return_json_message('Deleted character succesfully', self::STATUS_SUCCESS);
            } else {
                return return_json_message('Something went wrong while trying to remove character', self::STATUS_UNPROCESSABLE);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid character id', self::STATUS_BAD_REQUEST);
        }
    }
}
