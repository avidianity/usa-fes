<?php

namespace App\Http\Middleware;

use App\Models\AcademicYear;
use Closure;
use Illuminate\Http\Request;

class ShouldHaveActiveAcademicYear
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
        if (AcademicYear::active()->status(AcademicYear::EVALUATION_ONGOING)->count() === 0) {
            return response(['message' => 'No academic year currently ongoing or active.'], 400);
        }

        return $next($request);
    }
}
