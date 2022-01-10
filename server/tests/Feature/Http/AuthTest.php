<?php

namespace Tests\Feature\Http;

use App\Models\Section;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\postJson;
use function Pest\Faker\faker;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\getJson;

uses(RefreshDatabase::class);

it('registers a user', function () {
    $section = Section::factory()->create();

    $password = faker()->password;

    Storage::fake();

    $data = [
        'password' => $password,
        'password_confirmation' => $password,
        'section_id' => $section->id,
        'picture' => UploadedFile::fake()->image('picture.jpg')
    ] + User::factory()->student()->data();

    $response = postJson(route('auth.register'), $data)
        ->assertCreated();

    assertDatabaseHas(User::class, ['id' => $response->json('id')]);

    $picture = User::findOrFail($response->json('id'))->picture;

    Storage::assertExists($picture->path);
});

it('logs in a user', function () {
    $password = faker()->password;

    $user = User::factory()
        ->active()
        ->create(['password' => $password]);

    $data = [
        'email' => $user->email,
        'password' => $password,
    ];

    postJson(route('auth.login'), $data)
        ->assertOk();
});

it('checks a user', function () {
    $user = actingAs();

    $response = getJson(route('auth.check'))
        ->assertOk();

    expect($response->json('id') === $user->id)->toBeTrue();
});
