<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemStoreRequest;
use App\Http\Requests\ItemUpdateRequest;
use App\Models\Item;
use App\Services\ItemService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function __construct(public ItemService $itemService)
    {
    }

    /**
     * Get all items associated with User.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $items = $this->itemService->retrieveAll();

        return Inertia::render('Items/Index', ['items' => $items]);
    }

    /**
     * Given a URL, scrape and store information into database.
     *
     * @param  \App\Http\Requests\ItemStoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ItemStoreRequest $request)
    {
        return $this->itemService->create(Auth::user()->id, $request->validated());
    }

    /**
     * Update the specified item in storage.
     *
     * @param  \App\Http\Requests\ItemUpdateRequest  $request
     * @param  \App\Models\Item  $item
     * @return \Illuminate\Http\Response
     */
    public function update(ItemUpdateRequest $request, Item $item)
    {
        return $this->itemService->update(Auth::user()->id, $item, $request->validated());
    }

    /**
     * Archive selected item.
     *
     * @param  \App\Models\Item  $item
     * @return \Illuminate\Http\Response
     */
    public function archive(Item $item)
    {
        return $this->itemService->archive(Auth::user()->id, $item);
    }

    /**
     * Unarchived selected item.
     *
     * @return \Illuminate\Http\Response
     */
    public function unarchive($id)
    {
        return $this->itemService->unarchive(Auth::user()->id, $item);
    }

    /**
     * Remove selected item.
     *
     * @param  \App\Models\Item  $item
     * @return \Illuminate\Http\Response
     */
    public function destroy(Item $item)
    {
        return $this->itemService->delete(Auth::user()->id, $item);
    }
}
