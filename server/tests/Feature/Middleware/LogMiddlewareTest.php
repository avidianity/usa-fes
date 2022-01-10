<?php

namespace Tests\Feature\Middleware;

use App\Http\Middleware\Log;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Config;
use Mockery;

it('logs a request and response', function () {
    $default = Config::get('logging.requests');

    Config::set('logging.requests', true);

    $middleware = new Log();

    $middleware->handle(new Request(), function () {
        $response = Mockery::mock(Response::class);
        $response->shouldReceive('header')->once();

        return $response;
    });

    Config::set('logging.requests', $default);
});
