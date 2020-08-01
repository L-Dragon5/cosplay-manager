<?php

use Illuminate\Http\Request;

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
Route::post('login', 'UserController@login');
Route::post('register', 'UserController@register');
Route::post('forgot-password', 'UserController@forgotPassword');
Route::post('checkUser', 'UserController@checkUser');

Route::middleware('auth:api')->group(function () {
    // User Routes
    Route::post('update-password', 'UserController@updatePassword');

    // Series Routes
    Route::get('series', 'SeriesController@index');
    Route::get('series/{id}', 'SeriesController@show');
    Route::post('series/create', 'SeriesController@store');
    Route::post('series/update/{id}', 'SeriesController@update');
    Route::get('series/destroy/{id}', 'SeriesController@destroy');

    // Character Routes
    Route::get('characters', 'CharacterController@index');
    Route::get('characters/{id}', 'CharacterController@indexBySeries');
    Route::get('character/{id}', 'CharacterController@show');
    Route::post('character/create', 'CharacterController@store');
    Route::post('character/update/{id}', 'CharacterController@update');
    Route::get('character/destroy/{id}', 'CharacterController@destroy');

    // Outfit Routes
    Route::get('outfits', 'OutfitController@index');
    Route::get('outfits/{id}', 'OutfitController@indexByCharacter');
    Route::post('outfit/create', 'OutfitController@store');
    Route::post('outfit/update/{id}', 'OutfitController@update');
    Route::get('outfit/destroy/{id}', 'OutfitController@destroy');
    Route::get('outfit/{id}/deleteImage/{index}', 'OutfitController@deleteImage');

    // Tag Routes
    Route::get('tags', 'TagController@index');
    Route::get('tagsForSelect', 'TagController@tagsForSelect');
    Route::get('tagsByItemSelect/{id}', 'TagController@tagsByItemSelect');
    Route::get('tagsByOutfitSelect/{id}', 'TagController@tagsByOutfitSelect');
    Route::get('tag/{id}', 'TagController@show');
    Route::post('tag/create', 'TagController@store');
    Route::post('tag/update/{id}', 'TagController@update');
    Route::get('tag/destroy/{id}', 'TagController@destroy');

    // Item Routes
    Route::get('items', 'ItemController@index');
    Route::post('item/create', 'ItemController@store');
    Route::post('item/check', 'ItemController@checkItem');
    Route::post('item/update/{id}', 'ItemController@update');
    Route::get('item/archive/{id}', 'ItemController@archive');
    Route::get('item/unarchive/{id}', 'ItemController@unarchive');
    Route::get('item/destroy/{id}', 'ItemController@destroy');

    // Account Setting Route
    Route::get('account/getCSV', 'AccountSettingsController@getCSV');
});
