<?php

namespace App\Http\Controllers;

use App\Character;
use App\Outfit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use Intervention\Image\Facades\Image;

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
            $filename_with_ext = $request->file('image')->getClientOriginalName();
            $filename = pathinfo($filename_with_ext, PATHINFO_FILENAME);
            $extension = $request->file('image')->getClientOriginalExtension();
            $filename_to_store = $filename . '_' . time() . '.' . $extension;

            if (!file_exists(storage_path('app/public/character/'))) {
                mkdir(storage_path('app/public/character/'), 666, true);
            }

            $img = Image::make($request->file('image'))->resize(null, 400, function ($constraint) {
                $constraint->aspectRatio();
            });
            $img->save(storage_path('app/public/character/' . $filename_to_store), 80);

            $character->image = 'character/' . $filename_to_store;
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
        $character = Character::find($id);
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
        //
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
        $character = Character::find($id);

        if ($character->user_id === $user_id) {
            $success = $character->delete();
        } else {
            $success = false;
        }

        if ($success) {
            return return_json_message('Deleted character succesfully', $this->successStatus);
        } else {
            return return_json_message('Did not find a character to remove', 401);
        }
    }
}
