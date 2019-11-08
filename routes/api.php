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
Route::post('checkUser', 'UserController@checkUser');

Route::middleware('auth:api')->group(function () {
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
    Route::get('outfit/{id}', 'OutfitController@show');
    Route::post('outfit/create', 'OutfitController@store');
    Route::post('outfit/update/{id}', 'OutfitController@update');
    Route::get('outfit/destroy/{id}', 'OutfitController@destroy');
});