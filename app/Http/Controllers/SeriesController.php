<?php

namespace App\Http\Controllers;

use App\Series;
use App\Character;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use Intervention\Image\Facades\Image;

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
            'image' => 'file|image|nullable',
        ]);

        if($validator->fails()) {
            return return_json_message($validator->errors(), $this->errorStatus);
        }

        $user_id = Auth::user()->id;

        $series = new Series;
        $series->user_id = $user_id;
        $series->title = $request->title;

        if ($request->hasFile('image')) {
            $filename_with_ext = $request->file('image')->getClientOriginalName();
            $filename = pathinfo($filename_with_ext, PATHINFO_FILENAME);
            $extension = $request->file('image')->getClientOriginalExtension();
            $filename_to_store = $filename . '_' . time() . '.' . $extension;

            if (!file_exists(storage_path('app/public/series/'))) {
                mkdir(storage_path('app/public/series/'), 666, true);
            }

            $img = Image::make($request->file('image'))->resize(null, 200, function ($constraint) {
                $constraint->aspectRatio();
            });
            $img->save(storage_path('app/public/series/' . $filename_to_store), 80);

            $series->image = 'series/' . $filename_to_store;
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
     * @param  \App\Series  $series
     * @return \Illuminate\Http\Response
     */
    public function show($id, Series $series)
    {
        $series = Series::find($id);
        return $series;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Series  $series
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Series $series)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Series  $series
     * @return \Illuminate\Http\Response
     */
    public function destroy(Series $series)
    {
        //
    }
}
