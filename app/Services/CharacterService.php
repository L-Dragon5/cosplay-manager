<?php

namespace App\Services;

use App\Models\Character;
use App\Traits\UploadedImageSave;
use Illuminate\Support\Facades\Storage;

class CharacterService
{
    use UploadedImageSave;

    /**
     * Check current service's assigned class for duplicates.
     *
     * @param  string  $search
     * @param  string  $column
     * @return  bool
     */
    public function checkForDuplicate($search, $column): bool
    {
        return Character::where($column, '=', $search)->exists();
    }

    /**
     * Retrieve all characters associated with user.
     */
    public function retrieveAll()
    {
        return Character::with('outfits')
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
     * @param  string  $userId
     * @param  array  $validated
     */
    public function create(string $userId, array $validated)
    {
        if ($this->checkForDuplicate($validated['name'], 'name')) {
            return back()->withErrors(['name' => 'Character already exists with this name']);
        }

        @['image' => $image] = $validated;
        unset($validated['image']);

        $character = new Character([
            ...$validated,
            'user_id' => $userId,
        ]);

        if (!empty($image)) {
            $character->image = $this->saveUploadedImage($image, 'character', 400);
        } else {
            $character->image = '200x400.png';
        }

        $success = $character->save();

        if ($success) {
            return to_route('cosplay-management');
        } else {
            return back()->withErrors('Something went wrong while trying to create a new character');
        }
    }

    /**
     * Update existing character.
     *
     * @param  string  $userId
     * @param  \App\Models\Character  $character
     * @param  array  $validated
     */
    public function update(string $userId, Character $character, array $validated)
    {
        if ($character->user_id === $userId) {
            // If they want to change name
            if (!empty($validated['name'])) {
                $name = $validated['name'];

                // Check if new name is same as old name
                if ($name === $character->name) {
                    // Do nothing
                } elseif ($this->checkForDuplicate($name, 'name')) {
                    return back()->withErrors(['name' => 'Character name already exists']);
                } else {
                    $character->name = $name;
                }
            }

            // If they want to change image
            if (!empty($validated['image'])) {
                $character->image = $this->saveUploadedImage($validated['image'], 'character', 400, $character->image);
            }

            $success = $character->save();

            if ($success) {
                return to_route('cosplay-management');
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
     * @param  string  $userId
     * @param  \App\Models\Character  $character
     */
    public function delete(string $userId, Character $character)
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
            return to_route('cosplay-management');
        } else {
            return back()->withErrors('Something went wrong while trying to remove character');
        }
    }
}