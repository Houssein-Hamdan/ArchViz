<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        error_log('CORS Middleware is running! Method: ' . $request->getMethod());
        $allowed_origins = [
            'http://localhost:5173',
            'https://arch-viz-nine.vercel.app',
        ];

        $origin = $request->header('Origin') ?? $request->header('origin');

        // Handle OPTIONS (preflight)
        if ($request->isMethod('OPTIONS')) {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
                ->header('Access-Control-Max-Age', '3600')
                ->header('Access-Control-Allow-Credentials', 'true');
        }

        // Handle actual request
        $response = $next($request);

        if ($origin && in_array($origin, $allowed_origins)) {
            $response->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        }

        return $response;
    }
}