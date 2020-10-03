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
Route::get('/dashboard', fn() => view('authenticated'));
Route::get('/dashboard/{any}', fn($any) => view('authenticated'))->where('any', '.*');

// Authentication Routes
Route::get('/login', fn() => view('auth.login'))->name('login');
Route::get('/register', fn() => view('auth.register'))->name('register');
Route::get('/forgot-password', fn() => view('auth.forget-password'))->name('forgot-password');

// Public Routes
Route::get('/', fn() => view('public'));
Route::get('/s/{any}', fn() => view('public-shared'));
Route::get('/{any}', fn() => redirect('/'));
