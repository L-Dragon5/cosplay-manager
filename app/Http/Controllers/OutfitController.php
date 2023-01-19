<?php

namespace App\Http\Controllers;

use App\Http\Requests\OutfitStoreRequest;
use App\Http\Requests\OutfitUpdateRequest;
use App\Models\Outfit;
use App\Services\OutfitService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OutfitController extends Controller
{
    public function __construct(public OutfitService $outfitService)
    {
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

        return Inertia::render('Outfits/Index', ['outfits' => $outfits]);
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
     * @param  int  $outfit
     * @return \Illuminate\Http\Response
     */
    public function update(OutfitUpdateRequest $request, int $outfit)
    {
        $outfit = Outfit::findOrFail($outfit);
        return $this->outfitService->update(Auth::user()->id, $outfit, $request->validated());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $outfit
     * @return \Illuminate\Http\Response
     */
    public function destroy(int $outfit)
    {
        $outfit = Outfit::findOrFail($outfit);
        return $this->outfitService->delete(Auth::user()->id, $outfit);
    }

    /**
     * Remove image from outfit.
     *
     * @param  int  $outfit
     * @param  int  $index
     * @return \Illuminate\Http\Response
     */
    public function deleteImage(int $outfit, $index)
    {
        $outfit = Outfit::findOrFail($outfit);
        return $this->outfitService->deleteImage(Auth::user()->id, $outfit, $index);
    }
}
