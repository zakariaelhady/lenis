<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\FunctionalityController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

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

Route::get('/', function () {
    return view('welcome');
});

Route::get('/features', [FunctionalityController::class, 'index']);
Route::get('/partners', [ProjectController::class, 'index']);
Route::post('/contact-us', [ContactController::class, 'store']);