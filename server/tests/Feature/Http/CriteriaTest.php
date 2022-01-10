<?php

namespace Tests\Feature\Http;

use App\Models\Criteria;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

uses(RefreshDatabase::class);

beforeEach(fn () => actingAs());

it('fetches criterias', function () {
    Criteria::factory(5)->create();
    $response = getJson(route('criterias.index'))
        ->assertOk();

    $data = collect($response->json());

    expect($data->count())->toBe(Criteria::count());
});

it('fetches a criteria', function () {
    $criterias = Criteria::factory(5)->create();

    $criteria = $criterias->random();

    $response = getJson(route('criterias.show', ['criteria' => $criteria->id]))
        ->assertOk();

    expect($response->json('id'))->toBe($criteria->id);
});

it('creates a criteria', function () {
    $response = postJson(route('criterias.store'), Criteria::factory()->data())
        ->assertCreated();

    assertDatabaseHas(Criteria::class, ['id' => $response->json('id')]);
});

it('updates a criteria', function () {
    $data = Criteria::factory()->data();

    $criteria = Criteria::factory()->create();

    putJson(route('criterias.update', ['criteria' => $criteria->id]), $data)
        ->assertOk();

    assertDatabaseHas(Criteria::class, ['id' => $criteria->id] + $data);
});

it('deletes a criteria', function () {
    $criterias = Criteria::factory(5)->create();

    $criteria = $criterias->random();

    deleteJson(route('criterias.destroy', ['criteria' => $criteria->id]))
        ->assertNoContent();

    assertDatabaseMissing(Criteria::class, ['id' => $criteria->id]);
});
