<?php

namespace App\Services;

use App\Models\Character;
use App\Models\Outfit;
use App\Models\Series;
use App\Traits\UploadedImageSave;
use Illuminate\Support\Facades\Storage;

class SeriesService
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
        return Series::where($column, '=', $search)->exists();
    }

    /**
     * Retrieve all series associated with user.
     */
    public function retrieveAll()
    {
        return Series::with('characters')
            ->orderBy('title', 'ASC')
            ->get();
    }

    /**
     * Create new Series.
     *
     * @param  string  $userId
     * @param  array  $validated
     */
    public function create(string $userId, array $validated)
    {
        if ($this->checkForDuplicate($validated['title'], 'title')) {
            return back()->withErrors(['title' => 'Series already exists with this title']);
        }

        @['image' => $image] = $validated;
        unset($validated['image']);

        $series = new Series([
            ...$validated,
            'user_id' => $userId,
        ]);

        // Store image.
        if (!empty($image)) {
            $series->image = $this->saveUploadedImage($image, 'series', 200);
        } else {
            $series->image = '300x200.png';
        }

        $success = $series->save();

        if ($success) {
            return to_route('series.index');
        } else {
            return back()->withErrors('Something went wrong while trying to create a new series');
        }
    }

    /**
     * Update existing series.
     *
     * @param  string  $userId
     * @param  \App\Models\Series  $series
     * @param  array  $validated
     */
    public function update(string $userId, Series $series, array $validated)
    {
        if ($series->user_id === $userId) {
            @['title' => $title, 'image' => $image] = $validated;
            unset($validated['title']);
            unset($validated['image']);

            $series->fill($validated);

            // If they want to change title
            if (!empty($title)) {
                // Check if new title is same as old title
                if ($title === $series->title) {
                    // Do nothing
                } elseif ($this->checkForDuplicate($title, 'title')) {
                    return back()->withErrors(['title' => 'Series already exists with this title']);
                } else {
                    $series->title = $title;
                }
            }

            // If they want to change image
            if (!empty($image)) {
                $series->image = $this->saveUploadedImage($image, 'series', 200, $series->image);
            }

            $success = $series->save();

            if ($success) {
                return to_route('series.index');
            } else {
                return back()->withErrors('Something went wrong while trying to update series');
            }
        } else {
            return back()->withErrors('You do not have permission');
        }
    }

    /**
     * Remove existing series.
     *
     * @param  string  $userId
     * @param  \App\Models\Series  $series
     */
    public function delete(string $userId, Series $series)
    {
        if ($series->user_id === $userId) {
            // Delete all images from related characters and outfits
            $characters = Character::where('series_id', $id)->get();
            foreach ($characters as $character) {
                $outfits = Outfit::where('character_id', $character->id)->get();

                foreach ($outfits as $outfit) {
                    $images = explode('||', $outfit->images);
                    array_shift($images);

                    foreach ($images as $image) {
                        if ($image !== '300x400.png' && Storage::exists($image)) {
                            Storage::delete($image);
                        }
                    }
                }

                if ($character->image !== '200x400.png' && Storage::exists($character->image)) {
                    Storage::delete($series->image);
                }
            }

            // Delete series image
            if ($series->image !== '300x200.png' && Storage::exists($series->image)) {
                Storage::delete($series->image);
            }

            $success = $series->delete();
        } else {
            return back()->withErrors('You do not have permission');
        }

        if ($success) {
            return to_route('series.index');
        } else {
            return back()->withErrors('Something went wrong while trying to remove series');
        }
    }
}
