<?php

namespace App\Http\Controllers;

use App\Http\Requests\CharacterStoreRequest;
use App\Http\Requests\CharacterUpdateRequest;
use App\Models\Character;
use App\Services\CharacterService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CharacterController extends Controller
{
    public function __construct(public CharacterService $characterService)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $characters = $this->characterService->retrieveAll();

        return Inertia::render('Characters/Index', ['characters' => $characters]);
    }

    /**
     * Display a listing of the resource by series.
     *
     * @param  int  $seriesId
     * @return \Illuminate\Http\Response
     */
    public function indexBySeries($seriesId)
    {
        $characters = $this->characterService->retrieveBySeries($seriesId);

        return Inertia::render('Characters/Series', ['characters' => $characters]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\CharacterStoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CharacterStoreRequest $request)
    {
        return $this->characterService->create(Auth::user()->id, $request->validated());
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Character  $character
     * @return \Illuminate\Http\Response
     */
    public function show(Character $character)
    {
        return Inertia::render('Characters/Show', ['character' => $character]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\CharacterUpdateRequest  $request
     * @param  \App\Models\Character  $character
     * @return \Illuminate\Http\Response
     */
    public function update(CharacterUpdateRequest $request, Character $character)
    {
        return $this->characterService->update(Auth::user()->id, $character, $request->validated());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Character  $character
     * @return \Illuminate\Http\Response
     */
    public function destroy(Character $character)
    {
        return $this->characterService->delete(Auth::user()->id, $character);
    }
}
