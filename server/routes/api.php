<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CriteriaController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserController;
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

Route::group(['prefix' => 'auth', 'as' => 'auth.'], function () {
    Route::get('check', [AuthController::class, 'check'])
        ->middleware('auth:sanctum')
        ->name('check');
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('register', [AuthController::class, 'register'])->name('register');
});

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::apiResources([
        'subjects' => SubjectController::class,
        'academic-years' => AcademicYearController::class,
        'criterias' => CriteriaController::class,
        'criterias.questions' => QuestionController::class,
        'users' => UserController::class
    ]);

    Route::apiResource('sections', SectionController::class)->except('index');

    Route::apiResource('questions.answers', AnswerController::class)->except('update', 'store');
    Route::post('answers/many', [AnswerController::class, 'storeMany'])->name('answers.store-many');
});

Route::apiResource('sections', SectionController::class)->only('index');
