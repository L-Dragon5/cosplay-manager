<?php

namespace App\Services;

use App\Models\Character;
use App\Traits\DuplicateCheck;
use App\Traits\UploadedImageSave;
use Illuminate\Support\Facades\Storage;

class CharacterService
{
    use DuplicateCheck, UploadedImageSave;

    /**
     * Retrieve all characters associated with user.
     */
    public function retrieveAll()
    {
        return Character::withCount('outfits')
            ->orderBy('name', 'ASC')
            ->get();
    }

    /**
     * Retrieve all characters asociated with user and series.
     */
    public function retrieveBySeries(int $seriesId)
    {
        return Character::where('series_id', $seriesId)
            ->withCount('outfits')
            ->orderBy('name', 'ASC')
            ->get();
    }

    /**
     * Create new Character.
     *
     * @param  int  $userId
     * @param  array  $fields
     */
    public function create(int $userId, array $fields)
    {
        if ($this->checkForDuplicate($userId, $fields['name'], 'name')) {
            return back()->withErrors('Character already exists with this name');
        }

        if (isset($fields['image'])) {
            $image = $fields['image'];
            unset($fields['image']);
        }

        $character = new Character([
            ...$fields,
            'user_id' => $userId,
        ]);

        if (!empty($image)) {
            $character->image = $this->saveUploadedImage($image, 'character', 400);
        } else {
            $character->image = '200x400.png';
        }

        $success = $character->save();

        if ($success) {
            return to_route('characters.index');
        } else {
            return back()->withErrors('Something went wrong while trying to create a new character');
        }
    }

    /**
     * Update existing character.
     *
     * @param  int  $userId
     * @param  \App\Models\Character  $character
     * @param  array  $fields
     */
    public function update(int $userId, Character $character, array $fields)
    {
        if ($character->user_id === $userId) {
            // If they want to change name
            if (!empty($fields['name'])) {
                $name = $fields['name'];

                // Check if new name is same as old name
                if ($name === $character->name) {
                    // Do nothing
                } elseif ($this->checkForDuplicate($userId, $name, 'name')) {
                    return back()->withErrors('Character name already exists');
                } else {
                    $character->name = $name;
                }
            }

            // If they want to change image
            if (!empty($fields['image'])) {
                $character->image = $this->saveUploadedImage($fields['image'], 'character', 400, $character->image);
            }

            $success = $character->save();

            if ($success) {
                return to_route('characters.index');
            } else {
                return back()->withErrors('Something went wrong while trying to update character');
            }
        } else {
            return back()->withErrors('You do not have permission to edit this character');
        }
    }

    /**
     * Remove existing character.
     *
     * @param  int  $userId
     * @param  \App\Models\Character  $character
     */
    public function delete(int $userId, Character $character)
    {
        if ($character->user_id === $userId) {
            // Delete all images from related outfits
            $outfits = $character->outfits;

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
                    Storage::delete($character->image);
                }
            }

            $success = $character->delete();
        } else {
            return back()->withErrors('You do not have permission to delete this character');
        }

        if ($success) {
            return to_route('characters.index');
        } else {
            return back()->withErrors('Something went wrong while trying to remove character');
        }
    }
}
