<?php

namespace Tests\Feature\Middleware;

use App\Http\Middleware\Log;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Config;
use Mockery;

it('logs a request and response', function () {
    config()->set('logging.requests', true);

    $middleware = new Log();

    $response = Mockery::mock(Response::class);
    $response->shouldReceive('header')->once();

    $middleware->handle(new Request(), function () use ($response) {
        return $response;
    });
});
