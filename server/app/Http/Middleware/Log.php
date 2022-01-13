<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log as FacadesLog;
use Illuminate\Support\Str;

class Log
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if (config('logging.requests')) {
            $id = Str::uuid()->toString();

            FacadesLog::withContext([
                'request-id' => $id
            ]);

            FacadesLog::info($request->toArray() + [
                'request' => [
                    'url' => $request->url(),
                    'ip' => $request->ip(),
                    'headers' => collect($request->headers->all())->map(fn ($header) => $header[0])->toArray()
                ]
            ]);

            /**
             * @var \Illuminate\Http\Response
             */
            $response = $next($request);

            $response->header('Request-ID', $id);

            FacadesLog::info($response);

            return $response;
        }

        return $next($request);
    }
}
