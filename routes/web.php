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
Route::inertia('/', 'Index');
Route::inertia('/s/{any}', 'PublicSchedule');
Route::inertia('404', '404');
Route::redirect('/{any}', '/');

Route::middleware('auth.basic')->group(function () {
    Route::inertia('dashboard', 'Authenticated/Index');

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
    Route::get('tags/item/{itemId}', [TagController::class, 'tagsByItemSelect']);
    Route::get('tagss/outfit{outfitId}', [TagController::class, 'tagsByOutfitSelect']);
    Route::put('items/{item}/archive', [ItemController::class, 'archive']);
    Route::put('items/{item}/unarchive', [ItemController::class, 'unarchive']);

    // Account Setting Routes
    Route::get('account/getCSV', [AccountSettingsController::class, 'getCSV']);
    Route::get('account/getPublicLink', [AccountSettingsController::class, 'getPublicLink']);
});

Route::fallback(fn () => to_route('404'));
