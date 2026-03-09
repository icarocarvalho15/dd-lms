<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::get('/dashboard', [CourseController::class, 'dashboard']);
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{slug}', [CourseController::class, 'show']);
    Route::post('/lessons/{id}/complete', [CourseController::class, 'toggleComplete']);
    Route::get('/courses/{slug}/certificate', [CertificateController::class, 'generate']);
    Route::get('/courses/{slug}/certificate-link', [CertificateController::class, 'getPermanentLink']);
});

Route::middleware(['auth:sanctum', 'role:admin,instrutor'])->group(function () {
    Route::get('/instructor/courses', [CourseController::class, 'instructorCourses']);
    Route::post('/courses', [CourseController::class, 'store']);
    Route::patch('/courses/{id}/toggle-publish', [CourseController::class, 'togglePublish']);
    Route::post('/courses/{courseId}/modules', [CourseController::class, 'addModule']);
    Route::delete('/modules/{id}', [CourseController::class, 'deleteModule']);
    Route::post('/modules/{moduleId}/lessons', [CourseController::class, 'addLesson']);
    Route::put('/lessons/{id}', [CourseController::class, 'updateLesson']);
    Route::delete('/lessons/{id}', [CourseController::class, 'deleteLesson']);
});

Route::get('/certificate/{hash}', [CertificateController::class, 'viewPublic'])->name('certificate.public');