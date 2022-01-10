<?php

namespace Tests\Feature\Http;

use App\Models\Subject;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

uses(RefreshDatabase::class);

beforeEach(fn () => actingAs());

it('fetches subjects', function () {
    Subject::factory(5)->create();
    $response = getJson(route('subjects.index'))
        ->assertOk();

    $data = collect($response->json());

    expect($data->count())->toBe(Subject::count());
});

it('fetches a subject', function () {
    $subjects = Subject::factory(5)->create();

    $subject = $subjects->random();

    $response = getJson(route('subjects.show', ['subject' => $subject->id]))
        ->assertOk();

    expect($response->json('id'))->toBe($subject->id);
});

it('creates a subject', function () {
    $response = postJson(route('subjects.store'), Subject::factory()->data())
        ->assertCreated();

    assertDatabaseHas(Subject::class, ['id' => $response->json('id')]);
});

it('updates a subject', function () {
    $data = Subject::factory()->data();

    $subject = Subject::factory()->create();

    putJson(route('subjects.update', ['subject' => $subject->id]), $data)
        ->assertOk();

    assertDatabaseHas(Subject::class, ['id' => $subject->id] + $data);
});

it('deletes a subject', function () {
    $subjects = Subject::factory(5)->create();

    $subject = $subjects->random();

    deleteJson(route('subjects.destroy', ['subject' => $subject->id]))
        ->assertNoContent();

    assertDatabaseMissing(Subject::class, ['id' => $subject->id]);
});
