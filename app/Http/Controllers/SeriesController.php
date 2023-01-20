<?php

namespace App\Http\Controllers;

use App\Http\Requests\SeriesStoreRequest;
use App\Http\Requests\SeriesUpdateRequest;
use App\Models\Series;
use App\Services\SeriesService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SeriesController extends Controller
{
    public function __construct(public SeriesService $seriesService)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $series = $this->seriesService->retrieveAll();

        return Inertia::render('Series/Index', ['series' => $series]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\SeriesStoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SeriesStoreRequest $request)
    {
        return $this->seriesService->create(Auth::user()->id, $request->validated());
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $series
     * @return \Illuminate\Http\Response
     */
    public function show($series)
    {
        $series = Series::findOrFail($series);

        return $series;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\SeriesUpdateRequest  $request
     * @param  string  $series
     * @return \Illuminate\Http\Response
     */
    public function update(SeriesUpdateRequest $request, $series)
    {
        $series = Series::findOrFail($series);

        return $this->seriesService->update(Auth::user()->id, $series, $request->validated());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $series
     * @return \Illuminate\Http\Response
     */
    public function destroy($series)
    {
        $series = Series::findOrFail($series);

        return $this->seriesService->delete(Auth::user()->id, $series);
    }
}
