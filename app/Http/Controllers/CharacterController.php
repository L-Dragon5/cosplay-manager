<?php

namespace App\Http\Controllers;

use App\Character;
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
     * @return \Illuminate\Http\Response
     */
    public function indexBySeries($id)
    {
        $user_id = Auth::user()->id;
        $characters = Character::where([['user_id', $user_id], ['series_id', $id]])->orderBy('name', 'ASC')->get();

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
        /*
        id, user_id, series_id, name, image
        */
        $validator = Validator::make($request->all(), [
            'name' => 'string|required',
            'series_id' => 'integer|required',
            'image' => 'file|image',
        ]);

        if($validator->fails()) {
            return return_json_message($validator->errors(), $this->errorStatus);
        }

        $user_id = Auth::user()->id;

        $character = new Character;
        $character->user_id = $user_id;
        $character->series_id = $request->series_id;
        $character->name = $request->name;

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
     * @param  \App\Character  $character
     * @return \Illuminate\Http\Response
     */
    public function show($id, Character $character)
    {
        $character = Character::find($id);
        return $character;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Character  $character
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Character $character)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Character  $character
     * @return \Illuminate\Http\Response
     */
    public function destroy(Character $character)
    {
        //
    }
}
