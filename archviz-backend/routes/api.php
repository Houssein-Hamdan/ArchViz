
<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ArchitectureController;
use App\Http\Controllers\Api\ArchitectureExploreController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rate Limiter AI Key
Route::middleware('throttle:ai-generator')->group(function () {
    Route::post('/architectures/generate', [ArchitectureController::class, 'generate']);
});

// Public Share Route
Route::get(
    '/architectures/share/{slug}',
    [ArchitectureExploreController::class, 'viewArchitecture']
);

/*
|--------------------------------------------------------------------------
| Protected Routes (Requires Bearer Token)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Auth Routes
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Architecture Management
    Route::get('/architectures', [ArchitectureController::class, 'index']);
    Route::post('/architectures', [ArchitectureController::class, 'store']);
    Route::delete(
        '/architectures/{architecture}',
        [ArchitectureController::class, 'destroy']
    );

    // Like & Bookmark Routes
    Route::post(
        '/architectures/{architecture}/like',
        [ArchitectureExploreController::class, 'like']
    );

    Route::post(
        '/architectures/{architecture}/unlike',
        [ArchitectureExploreController::class, 'unlike']
    );

    Route::post(
        '/architectures/{architecture}/bookmark',
        [ArchitectureExploreController::class, 'bookmark']
    );

    Route::post(
        '/architectures/{architecture}/unbookmark',
        [ArchitectureExploreController::class, 'unbookmark']
    );

    // Public Architectures
    Route::get(
        '/architectures/public',
        [ArchitectureExploreController::class, 'publicArchitectures']
    );

    // Trending
    Route::get(
        '/architectures/trending',
        [ArchitectureExploreController::class, 'trending']
    );

    // Bookmarks
    Route::get(
        '/bookmarks',
        [ArchitectureExploreController::class, 'userBookmarks']
    );
});

Route::options('/cors-test', function () {
    return response()->json([
        'server' => 'laravel',
        'method' => request()->method(),
        'origin' => request()->header('Origin'),
    ]);
});