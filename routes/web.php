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

Route::get('/dashboard/{any}', function ($any) {
    return view('authenticated');
})->where('any', '.*');

// Authentication Routes
Route::get('/login', function () {
    return view('auth.login');
})->name('login');

Route::get('/register', function () {
    return view('auth.register');
})->name('register');

Route::get('/forgot-password', function () {
    return view('auth.forgot-password');
})->name('forgot-password');

// Go to Home Page
Route::get('/', function () {
    return view('public');
});

Route::get('/{any}', function () {
    return redirect('/');
});