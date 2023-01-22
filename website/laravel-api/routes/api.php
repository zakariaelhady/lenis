<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\FunctionalityController;
use App\Http\Controllers\UtilizationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/functionalities', [FunctionalityController::class, 'index']);
Route::get('/use', [UtilizationController::class, 'index']);
Route::post('/contact-us', [ContactController::class, 'store']);