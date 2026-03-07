<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CertificateController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/certificate/{hash}', [CertificateController::class, 'viewPublic'])->name('certificate.public');
