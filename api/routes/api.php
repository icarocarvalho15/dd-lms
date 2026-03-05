<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\CertificateController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', [CourseController::class, 'dashboard']);
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{slug}', [CourseController::class, 'show']);
    Route::get('/courses/{slug}/certificate', [CertificateController::class, 'generate']);
    Route::post('/lessons/{id}/complete', [CourseController::class, 'toggleComplete']);
});

Route::middleware(['auth:sanctum', 'role:admin,instrutor'])->group(function () {
    Route::get('/instructor/courses', [CourseController::class, 'instructorCourses']);
    Route::post('/courses', [CourseController::class, 'store']);
    Route::post('/courses/{courseId}/modules', [CourseController::class, 'addModule']);
    Route::post('/modules/{moduleId}/lessons', [CourseController::class, 'addLesson']);
    Route::delete('/modules/{id}', [CourseController::class, 'deleteModule']);
    Route::delete('/lessons/{id}', [CourseController::class, 'deleteLesson']);
    Route::patch('/courses/{id}/toggle-publish', [CourseController::class, 'togglePublish']);
});