<?php

namespace App\Services;

use App\Models\Tag;
use App\Traits\DuplicateCheck;
use Illuminate\Support\Facades\DB;

class TagService
{
    use DuplicateCheck;

    /**
     * Retrieve all tags associated with user.
     */
    public function retrieveAll()
    {
        $tags = Tag::orderBy('title', 'ASC')
            ->get();

        $temp_tags = [];
        foreach ($tags as $tag) {
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

    public function retrieveByItemSelect($itemId)
    {
        $all_tags = Tag::orderBy('title', 'ASC')
            ->get();
        $item_tags = DB::table('items_tags')->where('items_tags.item_id', $itemId)->pluck('tag_id')->toArray();

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

    public function retrieveByOutfitSelect($outfitId)
    {
        $all_tags = Tag::orderBy('title', 'ASC')
            ->get();
        $outfit_tags = DB::table('outfits_tags')->where('outfits_tags.outfit_id', $outfitId)->pluck('tag_id')->toArray();

        $temp_tags = [];
        foreach ($all_tags as $tag) {
            $tag->label = $tag->title;
            $tag->value = $tag->id;

            if (in_array($tag->id, $outfit_tags)) {
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
     * Create new Tag.
     *
     * @param  int  $userId
     * @param  array  $validated
     */
    public function create(int $userId, array $validated)
    {
        if ($this->checkForDuplicate($userId, $validated['title'], 'title')) {
            return back()->withErrors('Tag already exists with this title');
        }

        $tag = Tag::create([
            ...$validated,
            'user_id' => $userId,
        ]);

        if (!empty($tag)) {
            return to_route('tags.index');
        } else {
            return back()->withErrors('Something went wrong while trying to create a new tag');
        }
    }

    /**
     * Update existing tag.
     *
     * @param  int  $userId
     * @param  \App\Models\Tag  $tag
     * @param  array  $validated
     */
    public function update(int $userId, Tag $tag, array $validated)
    {
        if ($tag->user_id === $userId) {
            ['title' => $title] = $validated;

            // If they want to change title
            if (!empty($title)) {
                // Check if new title is same as old title
                if ($this->checkForDuplicate($userId, $title, 'title')) {
                    return back()->withErrors('Tag already exists with this title');
                } else {
                    $tag->title = $title;
                }
            }

            $success = $tag->save();

            if ($success) {
                return to_route('tags.index');
            } else {
                return back()->withErrors('Something went wrong while trying to update tag');
            }
        } else {
            return back()->withErrors('You do not have permission');
        }
    }

    /**
     * Remove existing tag.
     *
     * @param  int  $userId
     * @param  \App\Models\Tag  $tag
     */
    public function delete(int $userId, Tag $tag)
    {
        if ($tag->user_id === $userId) {
            $success = $tag->delete();
        } else {
            return back()->withErrors('You do not have permission');
        }

        if ($success) {
            return to_route('tags.index');
        } else {
            return back()->withErrors('Something went wrong while trying to remove tag');
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
