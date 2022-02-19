<?php

namespace Tests\Feature\Http;

use App\Models\Section;
use App\Models\User;
use App\Notifications\ForgotPasswordNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\postJson;
use function Pest\Faker\faker;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;

uses(RefreshDatabase::class);

it('registers a user', function () {
    $section = Section::factory()->create();
    $faker = faker();

    $password = $faker->password;

    Storage::fake();

    $data = [
        'password' => $password,
        'password_confirmation' => $password,
        'section_id' => $section->id,
        'picture' => UploadedFile::fake()->image('picture.jpg'),
        'role' => $faker->randomElement([User::FACULTY, User::STUDENT])
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

it('logs out a user', function () {
    actingAs();

    deleteJson(route('auth.logout'))
        ->assertNoContent();
});

it('fails to send forgot password notification when mailing is disabled', function () {
    config()->set('mail.enabled', false);

    $user = User::factory()->create();

    postJson(route('auth.forgot-password.send'), ['email' => $user->email])
        ->assertStatus(400);
});

it('sends a forgot password notification with otp', function () {
    config()->set('mail.enabled', true);
    Notification::fake();

    $user = User::factory()->create();

    $response = postJson(route('auth.forgot-password.send'), ['email' => $user->email])
        ->assertOk();

    $otp = $user->otps()->firstOrFail();

    $response->assertJson(['verification' => $otp->verification]);

    Notification::assertSentTo(
        $user,
        ForgotPasswordNotification::class,
        function (ForgotPasswordNotification $event) use ($otp) {
            return invade($event)->otp->id === $otp->id;
        }
    );
});

it('changes a user\'s password with valid otp', function () {
    $user = User::factory()->create();

    $otp = $user->otps()->create();

    $password = faker()->password;

    $data = [
        'uuid' => $otp->uuid,
        'verification' => $otp->verification,
        'password' => $password,
        'password_confirmation' => $password,
    ];

    postJson(route('auth.forgot-password.complete'), $data)
        ->assertNoContent();

    expect(Hash::check($password, $user->fresh()->password))->toBeTrue();
});

it('throws otp expired error on completing forgot password', function () {
    $user = User::factory()->create();

    $otp = $user->otps()->create();

    Carbon::setTestNow(now()->addMinutes(config('otp.expiration')));

    $password = faker()->password;

    $data = [
        'uuid' => $otp->uuid,
        'verification' => $otp->verification,
        'password' => $password,
        'password_confirmation' => $password,
    ];

    postJson(route('auth.forgot-password.complete'), $data)
        ->assertForbidden()
        ->assertJson(['message' => 'Otp is expired.']);
});
