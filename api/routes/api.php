<?php

use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Models\User;

Route::post('/login', [AuthController::class, 'login']);

Route::get('/courses', [CourseController::class, 'index']);

Route::get('/courses/{slug}', [CourseController::class, 'show']);

Route::post('/lessons/{id}/complete', function ($id) {
    $user = User::first();
    $user->completedLessons()->toggle($id);
    return response()->json(['message' => 'Progresso atualizado']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/lessons/{id}/complete', [CourseController::class, 'toggleComplete']);
});