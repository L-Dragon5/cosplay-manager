<?php

use App\Http\Controllers\AccountSettingsController;
use App\Http\Controllers\CharacterController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\OutfitController;
use App\Http\Controllers\SeriesController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Authentication Routes
Route::inertia('/login', 'Login')->name('login');
Route::inertia('/register', 'Register')->name('register');
Route::inertia('/forgot-password', 'ForgotPassword')->name('forgot-password');
Route::post('login', [UserController::class, 'login']);
Route::post('register', [UserController::class, 'register']);
Route::post('forgot-password', [UserController::class, 'forgotPassword']);

// Public Routes
Route::inertia('/', 'Home')->name('home');
Route::inertia('/s/{any}', 'PublicShare');
Route::inertia('404', '404');

Route::middleware('auth')->group(function () {
    Route::get('cosplay-management', [OutfitController::class, 'index'])->name('cosplay-management');
    Route::get('taobao-organizer', [ItemController::class, 'index'])->name('taobao-organizer');
    Route::get('tag-manager', [TagController::class, 'index'])->name('tag-manager');
    /*
    Route::inertia('cosplay-management/all-cosplays', 'Authenticated/CosplayManagement/AllCosplays');
    Route::inertia('cosplay-management/s-{series}', 'Authenticated/CosplayManagement/CharactersGrid');
    Route::inertia('cosplay-management/s-{series}/c-{character}', 'Authenticated/CosplayManagement/OutfitGrid');
    */

    // User Routes
    Route::post('update-password', [UserController::class, 'updatePassword']);

    // Series Routes
    Route::apiResources([
        'series' => SeriesController::class,
        'characters' => CharacterController::class,
        'outfits' => OutfitController::class,
        'tags' => TagController::class,
        'items' => ItemController::class,
    ]);

    Route::get('characters/series/{seriesId}', [CharacterController::class, 'indexBySeries']);
    Route::get('outfits/character/{characterId}', [OutfitController::class, 'indexByCharacter']);
    Route::delete('outfits/{outfit}/deleteImage/{index}', [OutfitController::class, 'deleteImage']);
    Route::put('items/{item}/archive', [ItemController::class, 'archive']);
    Route::put('items/{item}/unarchive', [ItemController::class, 'unarchive']);
    Route::get('tags/item/{itemId}', [TagController::class, 'retrieveAll']);
    Route::get('tags/outfit/{outfitId}', [TagController::class, 'retrieveAll']);

    // Account Setting Routes
    Route::get('account/getCSV', [AccountSettingsController::class, 'getCSV']);
    Route::get('account/getPublicLink', [AccountSettingsController::class, 'getPublicLink']);
});

Route::redirect('/{any}', '/');
Route::fallback(fn () => to_route('404'));
