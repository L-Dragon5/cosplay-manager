<?php

namespace App\Http\Controllers;

use App\Models\PublicLink;
use App\Services\OutfitService;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function __construct(public OutfitService $outfitService)
    {
    }

    /**
     * Get all outfits associated with User.
     *
     * @param  \App\Models\PublicLink  $publicLink
     * @return \Illuminate\Http\Response
     */
    public function index(PublicLink $publicLink)
    {
        $outfits = $this->outfitService->retrieveAll($publicLink->user_id);

        return Inertia::render('Public/Index', ['outfits' => $outfits]);
    }
}
