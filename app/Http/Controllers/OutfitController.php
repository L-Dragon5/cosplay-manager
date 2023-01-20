<?php

namespace App\Http\Controllers;

use App\Http\Requests\OutfitStoreRequest;
use App\Http\Requests\OutfitUpdateRequest;
use App\Models\Outfit;
use App\Services\CharacterService;
use App\Services\OutfitService;
use App\Services\SeriesService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OutfitController extends Controller
{
    public function __construct(
        public OutfitService $outfitService,
        public SeriesService $seriesService,
        public CharacterService $characterService
    ) {
    }

    /**
     * Display a listing of the resource.
     * Used for All Cosplays Page.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $outfits = $this->outfitService->retrieveAll();
        $series = $this->seriesService->retrieveAll();
        $characters = $this->characterService->retrieveAll();

        return Inertia::render('Authenticated/CosplayManagement/CosplayList', [
            'outfits' => $outfits,
            'series' => $series,
            'characters' => $characters,
        ]);
    }

    /**
     * Display a listing of the resource by character.
     * Used for Cosplay Grid.
     *
     * @param  int  $characterId
     * @return \Illuminate\Http\Response
     */
    public function indexByCharacter($characterId)
    {
        $outfits = $this->outfitService->retrieveByCharacter($characterId);

        return Inertia::render('Outfits/Character', ['outfits' => $outfits]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\OutfitStoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(OutfitStoreRequest $request)
    {
        return $this->outfitService->create(Auth::user()->id, $request->validated());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\OutfitUpdateRequest  $request
     * @param  string  $outfit
     * @return \Illuminate\Http\Response
     */
    public function update(OutfitUpdateRequest $request, $outfit)
    {
        $outfit = Outfit::findOrFail($outfit);

        return $this->outfitService->update(Auth::user()->id, $outfit, $request->validated());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $outfit
     * @return \Illuminate\Http\Response
     */
    public function destroy($outfit)
    {
        $outfit = Outfit::findOrFail($outfit);

        return $this->outfitService->delete(Auth::user()->id, $outfit);
    }

    /**
     * Remove image from outfit.
     *
     * @param  string  $outfit
     * @param  int  $index
     * @return \Illuminate\Http\Response
     */
    public function deleteImage($outfit, int $index)
    {
        $outfit = Outfit::findOrFail($outfit);

        return $this->outfitService->deleteImage(Auth::user()->id, $outfit, $index);
    }
}
