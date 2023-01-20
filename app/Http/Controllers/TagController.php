<?php

namespace App\Http\Controllers;

use App\Http\Requests\TagStoreRequest;
use App\Http\Requests\TagUpdateRequest;
use App\Models\Tag;
use App\Services\TagService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TagController extends Controller
{
    public function __construct(public TagService $tagService)
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tags = $this->tagService->retrieveAll();

        return Inertia::render('Authenticated/TagManager/TagManager', ['tags' => $tags]);
    }

    public function retrieveAll(string $itemId = null, string $outfitId = null)
    {
        return $this->tagService->retrieveAll($itemId, $outfitId);
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $tag
     * @return \Illuminate\Http\Response
     */
    public function show($tag)
    {
        $tag = Tag::findOrFail($tag);

        return $tag;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\TagStoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TagStoreRequest $request)
    {
        return $this->tagService->create(Auth::user()->id, $request->validated());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\TagUpdateRequest  $request
     * @param  string  $tag
     * @return \Illuminate\Http\Response
     */
    public function update(TagUpdateRequest $request, $tag)
    {
        $tag = Tag::findOrFail($tag);

        return $this->tagService->update(Auth::user()->id, $tag, $request->validated());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $tag
     * @return \Illuminate\Http\Response
     */
    public function destroy($tag)
    {
        $tag = Tag::findOrFail($tag);

        return $this->tagService->delete(Auth::user()->id, $tag);
    }
}
