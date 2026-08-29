<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ArchitectureController;
use App\Http\Controllers\Api\ArchitectureExploreController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\OtpController;

/*
|--------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------
*/

Route::post('/auth/send-otp', [OtpController::class, 'sendOtp']);
Route::post('/auth/verify-otp', [OtpController::class, 'verifyOtp']);
Route::post('/auth/complete-registration', [OtpController::class, 'completeRegistration']);
Route::post('/auth/resend-otp', [OtpController::class, 'resendOtp']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rate Limiter AI Key
Route::middleware('throttle:ai-generator')->group(function () {
    Route::post('/architectures/generate', [ArchitectureController::class, 'generate']);
});

/*
    |--------------------------------------------------------------
    | Protected Routes (Requires Bearer Token)
    |--------------------------------------------------------------
    */

Route::middleware('auth:sanctum')->group(function () {
    // Auth Routes
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Architecture Management (Save & List)
    Route::get('/architectures', [ArchitectureController::class, 'index']);
    Route::post('/architectures', [ArchitectureController::class, 'store']);

    // Like & Bookmark Routes
    Route::post('/architectures/{architecture}/like', [ArchitectureExploreController::class, 'like']);
    Route::post('/architectures/{architecture}/unlike', [ArchitectureExploreController::class, 'unlike']);
    Route::post('/architectures/{architecture}/bookmark', [ArchitectureExploreController::class, 'bookmark']);
    Route::post('/architectures/{architecture}/unbookmark', [ArchitectureExploreController::class, 'unbookmark']);

    Route::get('/architectures/share/{slug}', [ArchitectureExploreController::class, 'viewArchitecture']); 
    Route::get('/architectures/public', [ArchitectureExploreController::class, 'publicArchitectures']);
    Route::get('/architectures/trending', [ArchitectureExploreController::class, 'trending']);
    // Bookmarks List
    Route::get('/bookmarks', [ArchitectureExploreController::class, 'userBookmarks']);
});
