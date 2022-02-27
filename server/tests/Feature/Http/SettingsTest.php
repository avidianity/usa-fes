<?php

namespace Tests\Feature\Http;

use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\getJson;

uses(RefreshDatabase::class);

it('fetches settings', function () {
    config(['mail.enabled' => false]);

    getJson(route('settings'))
        ->assertOk()
        ->assertJson([
            'mailing_enabled' => false
        ]);

    config(['mail.enabled' => true]);

    getJson(route('settings'))
        ->assertOk()
        ->assertJson([
            'mailing_enabled' => true
        ]);
});
