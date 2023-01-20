<?php

namespace App\Services;

use App\Models\Item;
use App\Models\Outfit;
use App\Models\Tag;

class TagService
{
    /**
     * Check current service's assigned class for duplicates.
     *
     * @param  string  $search
     * @param  string  $column
     * @return  bool
     */
    public function checkForDuplicate($search, $column): bool
    {
        return Tag::where($column, '=', $search)->exists();
    }

    /**
     * Retrieve all tags associated with user.
     */
    public function retrieveAll($itemId = null, $outfitId = null)
    {
        $tags = Tag::orderBy('title', 'ASC')
            ->get();

        if (!empty($itemId)) {
            $item_tags = Item::findOrFail($itemId)->tags()->pluck('_id')->toArray();
        }
        if (!empty($outfitId)) {
            $outfit_tags = Outfit::findOrFail($outfitId)->tags()->pluck('_id')->toArray();
        }

        $temp_tags = [];
        foreach ($tags as $tag) {
            $tag->name = $tag->title;
            $tag->label = $tag->title;
            $tag->value = $tag->_id;

            if (!empty($item_tags) && in_array($tag->_id, $item_tags)) {
                $tag->checked = true;
            }
            if (!empty($outfit_tags) && in_array($tag->_id, $outfit_tags)) {
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
     * @param  string  $userId
     * @param  array  $validated
     */
    public function create(string $userId, array $validated)
    {
        if ($this->checkForDuplicate($validated['title'], 'title')) {
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
     * @param  string  $userId
     * @param  \App\Models\Tag  $tag
     * @param  array  $validated
     */
    public function update(string $userId, Tag $tag, array $validated)
    {
        if ($tag->user_id === $userId) {
            ['title' => $title] = $validated;

            // If they want to change title
            if (!empty($title)) {
                // Check if new title is same as old title
                if ($this->checkForDuplicate($title, 'title')) {
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
     * @param  string  $userId
     * @param  \App\Models\Tag  $tag
     */
    public function delete(string $userId, Tag $tag)
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
            } else {
                $v['children'] = [];
            }

            $tree[] = $v;
        }

        return $tree;
    }
}
