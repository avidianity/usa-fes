<?php

namespace App\Http\Middleware;

use App\Exceptions\InvalidRoleException;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class Role
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @param string[] $roles
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $roles = collect($roles)
            ->flatMap(fn (string $role) => explode(',', $role))
            ->map(fn (string $role) => trim($role));

        $roles->each(function (string $role) {
            if (!in_array($role, User::ROLES)) {
                throw new InvalidRoleException(sprintf('%s is not a valid role.', $role));
            }
        });

        if (!in_array($request->user()->role, $roles->toArray())) {
            return response(['message' => 'Unauthorized'], 401, ['Auth-Expected-Role' => $roles->join(', ')]);
        }

        return $next($request);
    }
}
