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

        return Inertia::render('Authenticated/TaobaoOrganizer/TaobaoItems', ['items' => $items]);
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
     * @param  string  $item
     * @return \Illuminate\Http\Response
     */
    public function update(ItemUpdateRequest $request, $item)
    {
        $item = Item::findOrFail($item);

        return $this->itemService->update(Auth::user()->id, $item, $request->validated());
    }

    /**
     * Archive selected item.
     *
     * @param  string  $item
     * @return \Illuminate\Http\Response
     */
    public function archive($item)
    {
        $item = Item::findOrFail($item);

        return $this->itemService->archive(Auth::user()->id, $item);
    }

    /**
     * Unarchived selected item.
     *
     * @param  string  $item
     * @return \Illuminate\Http\Response
     */
    public function unarchive($item)
    {
        $item = Item::findOrFail($item);

        return $this->itemService->unarchive(Auth::user()->id, $item);
    }

    /**
     * Remove selected item.
     *
     * @param  string  $item
     * @return \Illuminate\Http\Response
     */
    public function destroy($item)
    {
        $item = Item::findOrFail($item);

        return $this->itemService->delete(Auth::user()->id, $item);
    }
}
