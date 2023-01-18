<?php

namespace App\Http\Controllers;

use App\Http\Requests\TagStoreRequest;
use App\Http\Requests\TagUpdateRequest;
use App\Models\Tag;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user_id = Auth::user()->id;
        $tags = Tag::where('user_id', $user_id)->orderBy('title', 'ASC')->get();

        $temp_tags = [];
        foreach ($tags as $tag) {
            $temp_tags[$tag['parent_id']][] = $tag;
        }

        if (!empty($temp_tags)) {
            $tags_tree = $this->createTree($temp_tags, $temp_tags[0]);
        } else {
            $tags_tree = [];
        }

        return $tags_tree;
    }

    /**
     * Display tags for Select.
     *
     * @return \Illuminate\Http\Response
     */
    public function tagsForSelect()
    {
        $user_id = Auth::user()->id;
        $all_tags = Tag::where('user_id', $user_id)->orderBy('title', 'ASC')->get();

        $temp_tags = [];
        foreach ($all_tags as $tag) {
            $tag->label = $tag->title;
            $tag->value = $tag->id;
            $tag->checked = true;

            $temp_tags[$tag['parent_id']][] = $tag;
        }

        if (!empty($temp_tags)) {
            $tags_tree = $this->createTree($temp_tags, $temp_tags[0]);
        } else {
            $tags_tree = [];
        }

        return $tags_tree;
    }

    /**
     * Display tags for selected item for Select.
     *
     * @return \Illuminate\Http\Response
     */
    public function tagsByItemSelect($id)
    {
        $user_id = Auth::user()->id;
        $all_tags = Tag::where('user_id', $user_id)->orderBy('title', 'ASC')->get();
        $item_tags = DB::table('items_tags')->where('items_tags.item_id', $id)->pluck('tag_id')->toArray();

        $temp_tags = [];
        foreach ($all_tags as $tag) {
            $tag->label = $tag->title;
            $tag->value = $tag->id;

            if (in_array($tag->id, $item_tags)) {
                $tag->checked = true;
            }

            $temp_tags[$tag['parent_id']][] = $tag;
        }

        if (!empty($temp_tags)) {
            $tags_tree = $this->createTree($temp_tags, $temp_tags[0]);
        } else {
            $tags_tree = [];
        }

        return $tags_tree;
    }

    /**
     * Display tags for selected outfit for Select.
     *
     * @return \Illuminate\Http\Response
     */
    public function tagsByOutfitSelect($id)
    {
        $user_id = Auth::user()->id;
        $all_tags = Tag::where('user_id', $user_id)->orderBy('title', 'ASC')->get();
        $item_tags = DB::table('outfits_tags')->where('outfits_tags.outfit_id', $id)->pluck('tag_id')->toArray();

        $temp_tags = [];
        foreach ($all_tags as $tag) {
            $tag->label = $tag->title;
            $tag->value = $tag->id;

            if (in_array($tag->id, $item_tags)) {
                $tag->checked = true;
            }

            $temp_tags[$tag['parent_id']][] = $tag;
        }

        if (!empty($temp_tags)) {
            $tags_tree = $this->createTree($temp_tags, $temp_tags[0]);
        } else {
            $tags_tree = [];
        }

        return $tags_tree;
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
     * @param  \App\Http\Requests\TagStoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TagStoreRequest $request)
    {
        $user_id = Auth::user()->id;

        if (check_for_duplicate($user_id, $request->title, 'tags', 'title')) {
            return return_json_message('Tag already exists with this title', self::STATUS_BAD_REQUEST);
        }

        $tag = Tag::create([
            ...$request->validated(),
            'user_id' => $user_id,
        ]);

        if (!empty($tag)) {
            return return_json_message('Created new tag succesfully', self::STATUS_SUCCESS);
        } else {
            return return_json_message('Something went wrong while trying to create a new tag', self::STATUS_UNPROCESSABLE);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\TagUpdateRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(TagUpdateRequest $request, $id)
    {
        $user_id = Auth::user()->id;

        try {
            $tag = Tag::findOrFail($id);
            $validated = $request->validated();

            if ($tag->user_id === $user_id) {
                // If they want to change title
                if ($request->filled('title')) {
                    $title = $validated['title'];

                    // Check if new title is same as old title
                    if ($trimmed_title === $tag->title) {
                        // Do nothing
                    } elseif (check_for_duplicate($user_id, $title, 'tags', 'title')) {
                        return return_json_message('Tag title already exists.', self::STATUS_BAD_REQUEST);
                    } else {
                        $tag->title = $title;
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

    /**
     * Create tree tag array from tags array.
     */
    private function createTree(&$list, $parent)
    {
        $tree = [];
        foreach ($parent as $k => $v) {
            if (isset($list[$v['id']])) {
                $v['children'] = $this->createTree($list, $list[$v['id']]);
            }

            $tree[] = $v;
        }

        return $tree;
    }
}
