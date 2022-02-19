<?php

namespace Tests\Feature\Http;

use App\Models\Otp;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;

use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

it('verifies otp', function () {
    $factory = Otp::make();

    $factory->otpable_id = mt_rand(0, 100000);
    $factory->otpable_type = '\App\Models\Otp';

    $factory->save();

    $otp = $factory->fresh();

    $data = [
        'otp' => $otp->code,
        'verification' => $otp->verification
    ];

    postJson(route('otps.verify'), $data)
        ->assertOk()
        ->assertJson(['uuid' => $otp->uuid]);
});

it('throws error on verifying expired otp', function () {
    $factory = Otp::make();

    $factory->otpable_id = mt_rand(0, 100000);
    $factory->otpable_type = '\App\Models\Otp';

    $factory->save();

    $otp = $factory->fresh();

    Carbon::setTestNow(now()->addMinutes(config('otp.expiration')));

    $data = [
        'otp' => $otp->code,
        'verification' => $otp->verification
    ];

    postJson(route('otps.verify'), $data)
        ->assertForbidden()
        ->assertJson(['message' => 'Otp is expired.']);

    expect($otp->fresh()->used)->toBeTrue();
});

it('throws error on verifying used otp', function () {
    $factory = Otp::make();

    $factory->otpable_id = mt_rand(0, 100000);
    $factory->otpable_type = '\App\Models\Otp';
    $factory->used = true;

    $factory->save();

    $otp = $factory->fresh();

    $data = [
        'otp' => $otp->code,
        'verification' => $otp->verification
    ];

    postJson(route('otps.verify'), $data)
        ->assertStatus(400)
        ->assertJson(['message' => 'Verification is invalid.']);
});

it('throws error on verifying invalid otp', function () {
    $factory = Otp::make();

    $factory->otpable_id = mt_rand(0, 100000);
    $factory->otpable_type = '\App\Models\Otp';
    $factory->code = mt_rand(555555, 999999);

    $factory->save();

    $otp = $factory->fresh();

    $data = [
        'otp' => mt_rand(111111, 444444),
        'verification' => $otp->verification
    ];

    postJson(route('otps.verify'), $data)
        ->assertStatus(400)
        ->assertJson(['message' => 'Otp is invalid.']);
});
