<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemStoreRequest;
use App\Http\Requests\ItemUpdateRequest;
use App\Models\Item;
use App\Services\ItemService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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
        $items = Item::with(['tags' => fn ($query) => $query->orderBy('title', 'ASC')])
            ->orderBy('created_at', 'DESC')
            ->paginate(20);
        //$items = $this->itemService->retrieveAll();

        return Inertia::render('Authenticated/TaobaoOrganizer/TaobaoItems', [
            'items' => Inertia::scroll(fn () => $items)
        ]);
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
     * @param  \App\Models\Item  $item
     * @return \Illuminate\Http\Response
     */
    public function unarchive(Item $item)
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
