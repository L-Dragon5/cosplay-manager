<?php

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

// Authenticated Routes
Route::get('/dashboard', function() {
    return view('authenticated');
});

Route::get('/dashboard/{any}/{all?}', function () {
    return view('authenticated');
});

// Authentication Routes
Route::get('/auth/login', function () {
    return view('auth.login');
})->name('login');

Route::get('/auth/register', function () {
    return view('auth.register');
})->name('register');

Route::get('/auth/forgot', function () {
    return view('auth.forgot');
})->name('forgot');

// Go to Home Page
Route::get('/', function () {
    return view('public');
});

Route::get('/{any}', function () {
    return redirect('/');
});