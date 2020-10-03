<?php

use Illuminate\Http\Request;

use App\Http\Controllers\AccountSettingsController;
use App\Http\Controllers\CharacterController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\OutfitController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\SeriesController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// User Routes
Route::post('login', [UserController::class, 'login']);
Route::post('register', [UserController::class, 'register']);
Route::post('forgot-password', [UserController::class, 'forgotPassword']);
Route::post('checkUser', [UserController::class, 'checkUser']);

// Public Shared Route
Route::get('all/{uuid}', [PublicController::class, 'index']);

Route::middleware('auth:api')->group(function () {
    // User Routes
    Route::post('update-password', [UserController::class, 'updatePassword']);

    // Series Routes
    Route::get('series', [SeriesController::class, 'index']);
    Route::get('series/{id}', [SeriesController::class, 'show']);
    Route::post('series/create', [SeriesController::class, 'store']);
    Route::post('series/update/{id}', [SeriesController::class, 'update']);
    Route::get('series/destroy/{id}', [SeriesController::class, 'destroy']);

    // Character Routes
    Route::get('characters', [CharacterController::class, 'index']);
    Route::get('characters/{id}', [CharacterController::class, 'indexBySeries']);
    Route::get('character/{id}', [CharacterController::class, 'show']);
    Route::post('character/create', [CharacterController::class, 'store']);
    Route::post('character/update/{id}', [CharacterController::class, 'update']);
    Route::get('character/destroy/{id}', [CharacterController::class, 'destroy']);

    // Outfit Routes
    Route::get('outfits', [OutfitController::class, 'index']);
    Route::get('outfits/{id}', [OutfitController::class, 'indexByCharacter']);
    Route::post('outfit/create', [OutfitController::class, 'store']);
    Route::post('outfit/update/{id}', [OutfitController::class, 'update']);
    Route::get('outfit/destroy/{id}', [OutfitController::class, 'destroy']);
    Route::get('outfit/{id}/deleteImage/{index}', [OutfitController::class, 'deleteImage']);

    // Tag Routes
    Route::get('tags', [TagController::class, 'index']);
    Route::get('tagsForSelect', [TagController::class, 'tagsForSelect']);
    Route::get('tagsByItemSelect/{id}', [TagController::class, 'tagsByItemSelect']);
    Route::get('tagsByOutfitSelect/{id}', [TagController::class, 'tagsByOutfitSelect']);
    Route::get('tag/{id}', [TagController::class, 'show']);
    Route::post('tag/create', [TagController::class, 'store']);
    Route::post('tag/update/{id}', [TagController::class, 'update']);
    Route::get('tag/destroy/{id}', [TagController::class, 'destroy']);

    // Item Routes
    Route::get('items', [ItemController::class, 'index']);
    Route::post('item/create', [ItemController::class, 'store']);
    Route::post('item/check', [ItemController::class, 'checkItem']);
    Route::post('item/update/{id}', [ItemController::class, 'update']);
    Route::get('item/archive/{id}', [ItemController::class, 'archive']);
    Route::get('item/unarchive/{id}', [ItemController::class, 'unarchive']);
    Route::get('item/destroy/{id}', [ItemController::class, 'destroy']);

    // Account Setting Routes
    Route::get('account/getCSV', [AccountSettingsController::class, 'getCSV']);
    Route::get('account/getPublicLink', [AccountSettingsController::class, 'getPublicLink']);
});
