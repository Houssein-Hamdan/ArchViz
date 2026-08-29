<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Exception;

class GeminiService
{
    protected string $apiKey;
    protected string $apiUrl;

    public function __construct()
    {
        $this->apiKey = config(
            'services.gemini.api_key',
            env('GEMINI_API_KEY')
        );

        $this->apiUrl =
            "https://generativelanguage.googleapis.com/v1/models/gemini-3.6-flash:generateContent?key={$this->apiKey}";
    }

    public function generateArchitecture(
        string $promptInput,
        ?string $techStack = null
    ): array {

        set_time_limit(120);

        $prompt = $this->buildSystemPrompt(
            $promptInput,
            $techStack
        );

        $response = Http::timeout(90)
            ->withHeaders([
                'Content-Type' => 'application/json',
            ])
            ->post($this->apiUrl, [
                'contents' => [
                    [
                        'parts' => [
                            [
                                'text' => $prompt
                            ]
                        ]
                    ]
                ],

                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                    'maxOutputTokens' => 4096,
                ]
            ]);

        if ($response->failed()) {
            throw new Exception(
                'Gemini API Error: ' . $response->body()
            );
        }

        $responseData = $response->json();

        $rawText =
            $responseData['candidates'][0]['content']['parts'][0]['text']
            ?? '{}';

        $decoded = json_decode(
            trim($rawText),
            true
        );

        if (
            json_last_error() !== JSON_ERROR_NONE ||
            !is_array($decoded)
        ) {
            throw new Exception(
                'Failed to parse Gemini JSON: '
                . json_last_error_msg()
            );
        }

        return $decoded;
    }

    protected function buildSystemPrompt(
        string $promptInput,
        ?string $techStack
    ): string {

        $stack = $techStack ?: 'Choose a suitable stack';

        return <<<PROMPT
You are a software architect.

Design a practical architecture for this project.

Requirement:
{$promptInput}

Preferred stack:
{$stack}

Goals:
- Keep it simple.
- Avoid unnecessary technologies.
- Prefer modular monoliths for small/medium projects.
- Show the main data flow.
- Make it understandable to beginners and useful to senior developers.
- Explain only important decisions.

Return ONLY valid JSON:

{
  "title": "Short title",
  "summary": "1-2 sentences",
  "nodes": [
    {
      "id": "unique-id",
      "label": "Human readable name",
      "type": "frontend|backend|database|cache|queue|external|storage|gateway|service",
      "technology": "Technology",
      "role": "One short sentence",
      "why": "Short reason"
    }
  ],
  "edges": [
    {
      "source": "node-id",
      "target": "node-id",
      "label": "HTTP|data|event|response",
      "description": "Short explanation"
    }
  ],
  "flow": [
    "Step 1",
    "Step 2",
    "Step 3",
    "Step 4"
  ],
  "decisions": [
    {
      "decision": "Decision",
      "reason": "Short reason"
    }
  ],
  "tradeoffs": {
    "pros": [],
    "cons": [],
    "cost": "Low|Medium|High"
  },
 
  
  "implementation": {
    "phases": [
      {
        "phase": 1,
        "name": "Setup & Database",
        "duration": "1 week",
        "tasks": [
          {
            "task": "Initialize Laravel & React",
            "description": "Create projects and configure",
            "checklist": ["Create Laravel project", "Create React project", "Setup database"]
          }
        ]
      }
    ]
  },
  
  "database": {
    "entities": [
      {
        "name": "users",
        "description": "User accounts",
        "columns": [
          {"name": "id", "type": "int", "pk": true},
          {"name": "name", "type": "string"},
          {"name": "email", "type": "string", "unique": true}
        ]
      }
    ],
    "relationships": [
      {
        "from": "users",
        "to": "posts",
        "type": "1:N",
        "foreign_key": "user_id"
      }
    ]
  }
}
}

Rules:
- Maximum 7 nodes.
- Maximum 8 edges.
- Maximum 6 flow steps.
- Maximum 4 decisions.
- Maximum 3 pros and 3 cons.
- Keep descriptions under 20 words.
- generate max 6 entities specifically to the requirement
- generate 2-4 phase only specifically to the requirement
- Do not add Redis, queues, microservices, gateways, etc. without justification.
- Do not over-engineer.
- Use the preferred stack when appropriate.
- The flow must represent the main request/data path.
- Return raw JSON only.
PROMPT;
    }
}