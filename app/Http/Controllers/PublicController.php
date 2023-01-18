<?php

namespace App\Http\Controllers;

use App\Models\Character;
use App\Models\Outfit;
use App\Models\PublicLink;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    /**
     * Get all outfits associated with User.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $uuid)
    {
        try {
            $public_link = PublicLink::findOrFail($uuid);
            $user_id = $public_link->user_id;

            $outfits = Outfit::where('user_id', $user_id)->orderBy('title', 'ASC')->get();

            foreach ($outfits as $outfit) {
                $images = explode('||', $outfit->images);
                array_shift($images);

                foreach ($images as &$image) {
                    $image = '/storage/' . $image;
                }
                unset($image);

                $outfit->images = $images;
                $outfit->character_name = Character::find($outfit->character_id)->name;
            }

            // Convert Eloquent object to array for sorting.
            $outfits_array = $outfits->toArray();

            // Sort based on character name alphabetically.
            usort($outfits_array, fn ($a, $b) => strcmp($a['character_name'], $b['character_name']));

            return $outfits_array;
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return return_json_message('Invalid link', self::STATUS_BAD_REQUEST);
        }
    }
}
