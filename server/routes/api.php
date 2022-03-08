<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CriteriaController;
use App\Http\Controllers\FacultySubjectController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\OtpController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\StudentSubjectController;
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

Route::get('settings', function () {
    return [
        'mailing_enabled' => config('mail.enabled'),
    ];
})->name('settings');

Route::group(['prefix' => 'auth', 'as' => 'auth.'], function () {
    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::get('check', [AuthController::class, 'check'])
            ->name('check');
        Route::delete('logout', [AuthController::class, 'logout'])
            ->name('logout');
    });

    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('register', [AuthController::class, 'register'])->name('register');

    Route::group(['prefix' => 'forgot-password', 'as' => 'forgot-password.'], function () {
        Route::post('send', [ForgotPasswordController::class, 'send'])->name('send');
        Route::post('complete', [ForgotPasswordController::class, 'complete'])->name('complete');
    });
});

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::get('analytics', AnalyticsController::class)->name('analytics');

    Route::controller(CriteriaController::class)
        ->as('criterias.')
        ->prefix('criterias')
        ->group(function () {
            Route::put('reorder', 'reorder')->name('reorder');
            Route::patch('reorder', 'reorder')->name('reorder');
            Route::get('for-faculty/{faculty}', 'forFaculty')->name('for-faculty');
        });

    Route::controller(QuestionController::class)
        ->as('criterias.')
        ->prefix('criterias')
        ->group(function () {
            Route::put('questions/reorder', 'reorder')->name('questions.reorder');
            Route::patch('questions/reorder', 'reorder')->name('questions.reorder');
        });

    Route::get('users/faculties', [UserController::class, 'faculties'])->name('users.faculties');
    Route::get('users/{faculty}/comments', [UserController::class, 'comments'])->name('users.faculty.comments');

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

    Route::controller(StudentSubjectController::class)
        ->as('student-subjects.')
        ->prefix('student-subjects')
        ->group(function () {
            Route::post('assign', 'assign')->name('assign');
        });

    Route::controller(FacultySubjectController::class)
        ->as('faculty-subjects.')
        ->prefix('faculty-subjects')
        ->group(function () {
            Route::post('/{faculty}', 'store')->name('store');
            Route::delete('/{faculty_subject}', 'destroy')->name('destroy');
        });
});

Route::apiResource('sections', SectionController::class)->only('index');
Route::post('otps/verify', [OtpController::class, 'verify'])->name('otps.verify');
