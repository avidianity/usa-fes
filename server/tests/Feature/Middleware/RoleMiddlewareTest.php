<?php

namespace Tests\Feature\Middleware;

use App\Exceptions\InvalidRoleException;
use App\Http\Middleware\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Mockery;
use Throwable;

it('throws an exception on a non-valid role', function () {
    $middleware = new Role();

    $request = new Request();

    try {
        $middleware->handle($request, function () {
            return true;
        }, 'not-a-valid-role,eyoooo');
    } catch (Throwable $exception) {
        expect($exception)->toBeInstanceOf(InvalidRoleException::class);
    }
});

it('returns an unauthorized response on a non-specified role', function () {
    $middleware = new Role();

    /**
     * @var \Mockery\MockInterface|\Mockery\LegacyMockInterface
     */
    $request = Mockery::mock(Request::class);
    $request->shouldReceive('user')->once()->andReturn(new User(['role' => User::ADMIN]));

    $roles = collect([User::STUDENT, User::FACULTY])->join(', ');

    $response = $middleware->handle($request, function () {
        return true;
    }, $roles);

    expect($response)->toBeInstanceOf(Response::class);
    expect($response->getStatusCode())->toBe(401);
    expect($response->headers->get('Auth-Expected-Role'))->toBe($roles);
});
