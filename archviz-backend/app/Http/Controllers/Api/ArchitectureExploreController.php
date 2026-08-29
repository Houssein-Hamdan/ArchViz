<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Architecture;
use Illuminate\Http\Request;

class ArchitectureExploreController extends Controller
{
    /**
     * Get all public architectures with pagination, search, tech filtering, sorting, and user interaction flags
     * GET /api/architectures/public
     */
    public function publicArchitectures(Request $request)
    {
        $userId = $request->user()?->id;

        $query = Architecture::where('is_public', true)
            ->with('user')
            ->withCount([
                'likes as is_liked' => function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                },
                'bookmarks as is_bookmarked' => function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                },
            ])
            ->latest('created_at');

        // Apply text search on title or prompt input
        if ($request->has('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('prompt_input', 'like', "%{$search}%");
            });
        }

        // Apply technology stack filter
        if ($request->has('tech')) {
            $tech = $request->input('tech');

            $query->where('tech_stack', 'like', "%{$tech}%");
        }

        // Apply sorting strategy (popular by views, trending by likes)
        if ($request->has('sort')) {
            $sort = $request->input('sort');

            if ($sort === 'popular') {
                $query->orderByDesc('views_count');
            } elseif ($sort === 'trending') {
                $query->orderByDesc('likes_count');
            }
        }

        $architectures = $query->paginate(12);

        return response()->json($architectures);
    }

    /**
     * Get top trending architectures sorted by likes count
     * GET /api/architectures/trending
     */
    public function trending(Request $request)
    {
        $architectures = Architecture::where('is_public', true)
            ->with('user')
            ->orderByDesc('likes_count')
            ->limit(10)
            ->get();

        return response()->json($architectures);
    }

    /**
     * Attach a like to the target architecture by the authenticated user
     * POST /api/architectures/{id}/like
     */
    public function like(Architecture $architecture, Request $request)
    {
        $user = $request->user();

        // Check if the user has already liked this architecture
        if ($architecture->isLikedBy($user)) {
            return response()->json([
                'message' => 'Already liked'
            ], 409);
        }

        // Attach like relationship and increment total count
        $architecture->likes()->attach($user->id);
        $architecture->increment('likes_count');

        return response()->json([
            'message' => 'Architecture liked',
            'likes_count' => $architecture->likes_count
        ]);
    }

    /**
     * Detach a like from the target architecture by the authenticated user
     * POST /api/architectures/{id}/unlike
     */
    public function unlike(Architecture $architecture, Request $request)
    {
        $user = $request->user();

        // Check if the user hasn't liked this architecture yet
        if (!$architecture->isLikedBy($user)) {
            return response()->json([
                'message' => 'Not liked yet'
            ], 409);
        }

        // Detach like relationship and decrement total count
        $architecture->likes()->detach($user->id);
        $architecture->decrement('likes_count');

        return response()->json([
            'message' => 'Like removed',
            'likes_count' => $architecture->likes_count
        ]);
    }

    /**
     * Bookmark an architecture for the authenticated user
     * POST /api/architectures/{id}/bookmark
     */
    public function bookmark(Architecture $architecture, Request $request)
    {
        $user = $request->user();

        // Check if the architecture is already bookmarked
        if ($architecture->isBookmarkedBy($user)) {
            return response()->json([
                'message' => 'Already bookmarked'
            ], 409);
        }

        // Attach bookmark relationship and increment total count
        $architecture->bookmarks()->attach($user->id);
        $architecture->increment('bookmarks_count');

        return response()->json([
            'message' => 'Architecture bookmarked',
            'bookmarks_count' => $architecture->bookmarks_count
        ]);
    }

    /**
     * Remove a bookmark from an architecture for the authenticated user
     * POST /api/architectures/{id}/unbookmark
     */
    public function unbookmark(Architecture $architecture, Request $request)
    {
        $user = $request->user();

        // Check if the architecture isn't bookmarked
        if (!$architecture->isBookmarkedBy($user)) {
            return response()->json([
                'message' => 'Not bookmarked yet'
            ], 409);
        }

        // Detach bookmark relationship and decrement total count
        $architecture->bookmarks()->detach($user->id);
        $architecture->decrement('bookmarks_count');

        return response()->json([
            'message' => 'Bookmark removed',
            'bookmarks_count' => $architecture->bookmarks_count
        ]);
    }

    /**
     * Retrieve all bookmarked architectures for the current authenticated user
     * GET /api/bookmarks
     */
    public function userBookmarks(Request $request)
    {
        $user = $request->user();
        $bookmarks = $user->bookmarkedArchitectures()
            ->with('user')
            ->latest('created_at')
            ->get();

        return response()->json($bookmarks);
    }

    /**
     * Fetch a public architecture by its share slug and increment its view counter
     * GET /api/architectures/share/{slug}
     */
    public function viewArchitecture($slug, Request $request)
    {
        $architecture = Architecture::where('share_slug', $slug)
            ->where('is_public', true)
            ->with('user')
            ->firstOrFail();

        // Increment overall view counter
        $architecture->incrementViews();

        // Resolve user interaction status for the current session
        $currentUser = $request->user();
        $isLiked = $currentUser ? $architecture->isLikedBy($currentUser) : false;
        $isBookmarked = $currentUser ? $architecture->isBookmarkedBy($currentUser) : false;

        return response()->json([
            'data' => $architecture,
            'user_interactions' => [
                'liked' => $isLiked,
                'bookmarked' => $isBookmarked
            ]
        ]);
    }
}