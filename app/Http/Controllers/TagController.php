<?php

namespace App\Http\Controllers;

use App\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;

class TagController extends Controller
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
        $tags = Tag::where('user_id', $user_id)->orderBy('title', 'ASC')->get();

        return $tags;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $tag = null;

        try {
            $tag = Tag::findOrFail($id);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid tag id', self::STATUS_BAD_REQUEST);
        }
        
        return $tag;
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
        ]);

        if($validator->fails()) {
            return return_json_message($validator->errors(), self::STATUS_BAD_REQUEST);
        }

        $user_id = Auth::user()->id;

        if (check_for_duplicate($user_id, $request->title, 'tags', 'title')) {
            return return_json_message('Tag already exists with this title', self::STATUS_BAD_REQUEST);
        }

        $tag = new Tag;
        $tag->user_id = $user_id;
        $tag->title = trim($request->title);

        $success = $tag->save();

        if ($success) {
            return return_json_message('Created new tag succesfully', self::STATUS_SUCCESS);
        } else {
            return return_json_message('Something went wrong while trying to create a new tag', self::STATUS_UNPROCESSABLE);
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
            'title' => 'string|required',
        ]);

        if($validator->fails()) {
            return return_json_message($validator->errors(), self::STATUS_BAD_REQUEST);
        }

        $user_id = Auth::user()->id;

        try {
            $tag = Tag::findOrFail($id);

            if ($tag->user_id === $user_id) {
                // If they want to change title
                if ($request->has('title')) {
                    $trimmed_title = trim($request->title);

                    // Check if new title is same as old title
                    if ($trimmed_title === $tag->title) {
                        // Do nothing
                    } else if(check_for_duplicate($user_id, $request->title, 'tags', 'title')) {
                        return return_json_message('Tag title already exists.', self::STATUS_BAD_REQUEST);
                    } else {
                        $tag->title = $trimmed_title;
                    }
                }

                $success = $tag->save();

                if ($success) {
                    return return_json_message('Updated tag succesfully', self::STATUS_SUCCESS, ['tag' => $tag]);
                } else {
                    return return_json_message('Something went wrong while trying to update tag', self::STATUS_UNPROCESSABLE);
                }
            } else {
                return return_json_message('You do not have permission to edit this tag', self::STATUS_UNAUTHORIZED);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid tag id', self::STATUS_BAD_REQUEST);
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
            $tag = Tag::findOrFail($id);
            $success = false;

            if ($tag->user_id === $user_id) {
                $success = $tag->delete();
            } else {
                return return_json_message('You do not have permission to delete this tag', self::STATUS_UNAUTHORIZED);
            }
    
            if ($success) {
                return return_json_message('Deleted tag succesfully', self::STATUS_SUCCESS);
            } else {
                return return_json_message('Something went wrong while trying to remove tag', self::STATUS_UNPROCESSABLE);
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid tag id', self::STATUS_BAD_REQUEST);
        }
    }
}
