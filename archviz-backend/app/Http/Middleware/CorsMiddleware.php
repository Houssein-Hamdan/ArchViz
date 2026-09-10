<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $allowed_origins = [
            'http://localhost:5173',
            'https://arch-viz-nine.vercel.app',
        ];

        $origin = $request->header('Origin');

        // Handle preflight requests
        if ($request->getMethod() === 'OPTIONS') {
            if (in_array($origin, $allowed_origins)) {
                return response('', 200)
                    ->header('Access-Control-Allow-Origin', $origin)
                    ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
                    ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
                    ->header('Access-Control-Max-Age', '3600')
                    ->header('Access-Control-Allow-Credentials', 'true');
            }
            return response('', 403);
        }

        // Handle actual requests
        $response = $next($request);

        if (in_array($origin, $allowed_origins)) {
            $response->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        return $response;
    }
}