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

        return Inertia::render('Tags/Index', ['tags' => $tags]);
    }

    /**
     * Display tags for selected item for Select.
     *
     * @param  int  $itemId
     * @return \Illuminate\Http\Response
     */
    public function tagsByItemSelect($itemId)
    {
        return $this->tagService->retrieveByItemSelect($itemId);
    }

    /**
     * Display tags for selected outfit for Select.
     *
     * @param  int  $outfitId
     * @return \Illuminate\Http\Response
     */
    public function tagsByOutfitSelect($outfitId)
    {
        return $this->tagService->retrieveByOutfitSelect($outfitId);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $tag
     * @return \Illuminate\Http\Response
     */
    public function show(int $tag)
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
     * @param  int  $tag
     * @return \Illuminate\Http\Response
     */
    public function update(TagUpdateRequest $request, int $tag)
    {
        $tag = Tag::findOrFail($tag);
        return $this->tagService->update(Auth::user()->id, $tag, $request->validated());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $tag
     * @return \Illuminate\Http\Response
     */
    public function destroy(int $tag)
    {
        $tag = Tag::findOrFail($tag);
        return $this->tagService->delete(Auth::user()->id, $tag);
    }
}
