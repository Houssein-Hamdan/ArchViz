<?php

namespace App\Http\Controllers\Api;

use App\Services\GeminiService;
use App\Http\Controllers\Controller;
use App\Models\Architecture;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArchitectureController extends Controller
{
    // Fetch all architectures belonging to the currently authenticated user
    public function index(Request $request)
    {
        $architectures = $request->user()
            ? $request->user()->architectures()->latest()->get()
            : [];

        return response()->json($architectures);
    }

    // Fetch a specific public architecture using its unique share slug
    public function show($slug)
    {
        $architecture = Architecture::where('share_slug', $slug)
            ->where('is_public', true)
            ->firstOrFail();

        return response()->json($architecture);
    }

    // Validate and store a newly generated architecture in the database
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'prompt_input' => 'required|string|min:20|max:300',
            'tech_stack' => 'nullable|string',
            'diagram_json' => 'required|array',
            'tradeoffs_json' => 'nullable|array',
        ]);

        $architecture = Architecture::create([
            'user_id' => $request->user()?->id,
            'title' => $validated['title'],
            'prompt_input' => $validated['prompt_input'],
            'tech_stack' => $validated['tech_stack'] ?? null,
            'diagram_json' => $validated['diagram_json'],
            'tradeoffs_json' => $validated['tradeoffs_json'] ?? null,
            'share_slug' => Str::random(10), // Generate a unique slug for public sharing
            'is_public' => true,
        ]);

        return response()->json([
            'message' => 'Architecture saved successfully!',
            'data' => $architecture
        ], 201);
    }

    // Generate a new architecture using the integrated Gemini AI service
    public function generate(Request $request, GeminiService $geminiService)
    {
        $validated = $request->validate([
            'prompt_input' => 'required|string|min:15|max:500',
            'tech_stack' => 'nullable|string|max:255',
        ]);

        try {
            // Call the external Gemini service to process the prompt
            $result = $geminiService->generateArchitecture(
                $validated['prompt_input'],
                $validated['tech_stack'] ?? null
            );

            return response()->json([
                'status' => 'success',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to generate architecture diagram.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}