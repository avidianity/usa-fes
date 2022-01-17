<?php

namespace Tests\Feature\Http;

use App\Models\Section;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

uses(RefreshDatabase::class);

beforeEach(fn () => actingAs());

it('fetches sections', function () {
    Section::factory(5)->create();
    $response = getJson(route('sections.index'))
        ->assertOk();

    $data = collect($response->json());

    expect($data->count())->toBe(Section::count());
});

it('fetches a section', function () {
    $sections = Section::factory(5)->create();

    $section = $sections->random();

    $response = getJson(route('sections.show', ['section' => $section->id]))
        ->assertOk();

    expect($response->json('id'))->toBe($section->id);
});

it('creates a section', function () {
    $response = postJson(route('sections.store'), Section::factory()->data())
        ->assertCreated();

    assertDatabaseHas(Section::class, ['id' => $response->json('id')]);
});

it('updates a section', function () {
    $data = Section::factory()->data();

    $section = Section::factory()->create();

    unset($data['title']);

    putJson(route('sections.update', ['section' => $section->id]), $data)
        ->assertOk();

    assertDatabaseHas(Section::class, ['id' => $section->id] + $data);
});

it('deletes a section', function () {
    $sections = Section::factory(5)->create();

    $section = $sections->random();

    deleteJson(route('sections.destroy', ['section' => $section->id]))
        ->assertNoContent();

    assertDatabaseMissing(Section::class, ['id' => $section->id]);
});
