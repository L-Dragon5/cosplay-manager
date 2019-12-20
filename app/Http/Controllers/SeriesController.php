<?php

namespace App\Http\Controllers;

use App\Series;
use App\Character;
use App\Outfit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;

class SeriesController extends Controller
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
        $series = Series::where('user_id', $user_id)->orderBy('title', 'ASC')->get();

        foreach ($series as $s) {
            $s->character_count = Character::where('series_id', '=', $s->id)->count();
            $s->image = '/storage/' . $s->image;
        }

        return $series;
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
            'image' => 'nullable'
        ]);

        if($validator->fails()) {
            return return_json_message($validator->errors(), $this->errorStatus);
        }

        $user_id = Auth::user()->id;

        if (check_for_duplicate($user_id, $request->title, 'series', 'title')) {
            return return_json_message('Series already exists with this title', $this->errorStatus);
        }

        $series = new Series;
        $series->user_id = $user_id;
        $series->title = trim($request->title);

        if ($request->has('image')) {
            $series->image = save_image_uploaded($request->image, 'series', 200);
        } else {
            $series->image = '300x200.png';
        }

        $success = $series->save();

        if ($success) {
            return return_json_message('Created new series succesfully', $this->successStatus);
        } else {
            return return_json_message('Something went wrong while trying to create a new series', 401);
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
        $series = null;

        try {
            $series = Series::findOrFail($id);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid series id', 401);
        }
        
        return $series;
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
            'image' => 'nullable'
        ]);

        if($validator->fails()) {
            return return_json_message($validator->errors(), $this->errorStatus);
        }

        $user_id = Auth::user()->id;

        try {
            $series = Series::findOrFail($id);

            if ($series->user_id === $user_id) {
                // If they want to change title
                if ($request->has('title')) {
                    $trimmed_title = trim($request->title);

                    // Check if new title is same as old title
                    if ($trimmed_title === $series->title) {
                        // Do nothing
                    } else if(check_for_duplicate($user_id, $request->title, 'series', 'title')) {
                        return return_json_message('Series title already exists.', $this->errorStatus);
                    } else {
                        $series->title = $trimmed_title;
                    }
                }

                // If they want to change image
                if ($request->has('image')) {
                    $series->image = save_image_uploaded($request->image, 'series', 200, $series->image);
                }

                $success = $series->save();

                if ($success) {
                    $series->image = '/storage/' . $series->image;
                    return return_json_message('Updated series succesfully', $this->successStatus, ['series' => $series]);
                } else {
                    return return_json_message('Something went wrong while trying to update series', 401);
                }
            } else {
                return return_json_message('You do not have permission to edit this series', $this->errorStatus);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid series id', 401);
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

        try {
            $series = Series::findOrFail($id);
            $success = false;

            if ($series->user_id === $user_id) {
                // Delete all images from related characters and outfits
                $characters = Character::where('series_id', $id)->get();
                foreach ($characters as $character) {
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

                    if ($character->image !== '200x400.png') {
                        $image_path = storage_path('app/public/' . $character->image);

                        if (file_exists($image_path)) {
                            unlink($image_path);
                        }
                    }
                }

                // Delete series image
                if ($series->image !== '300x200.png') {
                    $image_path = storage_path('app/public/' . $series->image);

                    if (file_exists($image_path)) {
                        unlink($image_path);
                    }
                }

                $success = $series->delete();
            } else {
                return return_json_message('You do not have permission to delete this series', $this->errorStatus);
            }
    
            if ($success) {
                return return_json_message('Deleted series succesfully', $this->successStatus);
            } else {
                return return_json_message('Something went wrong while trying to remove series', 401);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid series id', 401);
        }
    }
}
