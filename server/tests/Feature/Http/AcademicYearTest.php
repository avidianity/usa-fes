<?php

namespace Tests\Feature\Http;

use App\Models\AcademicYear;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

uses(RefreshDatabase::class);

beforeEach(fn () => actingAs());

it('fetches academic years', function () {
    AcademicYear::factory(5)->create();
    $response = getJson(route('academic-years.index'))
        ->assertOk();

    $data = collect($response->json());

    expect($data->count())->toBe(AcademicYear::count());
});

it('fetches an academic year', function () {
    $academicYears = AcademicYear::factory(5)->create();

    $academicYear = $academicYears->random();

    $response = getJson(route('academic-years.show', ['academic_year' => $academicYear->id]))
        ->assertOk();

    expect($response->json('id'))->toBe($academicYear->id);
});

it('creates an academic year', function () {
    $response = postJson(route('academic-years.store'), AcademicYear::factory()->data())
        ->assertCreated();

    assertDatabaseHas(AcademicYear::class, ['id' => $response->json('id')]);
});

it('updates an academic year', function () {
    $data = AcademicYear::factory()
        ->active()
        ->ongoing()
        ->data();

    $academicYear = AcademicYear::factory()->create();

    putJson(route('academic-years.update', ['academic_year' => $academicYear->id]), $data)
        ->assertOk();
});

it('deletes an academic year', function () {
    $academicYears = AcademicYear::factory(5)->create();

    $academicYear = $academicYears->random();

    deleteJson(route('academic-years.destroy', ['academic_year' => $academicYear->id]))
        ->assertNoContent();

    assertDatabaseMissing(AcademicYear::class, ['id' => $academicYear->id]);
});

it('creates an active academic year', function () {
    $previous = AcademicYear::factory()
        ->active()
        ->ongoing()
        ->create();

    $response = postJson(route('academic-years.store'), AcademicYear::factory()
        ->active()
        ->ongoing()
        ->data())
        ->assertCreated();

    assertDatabaseHas(AcademicYear::class, ['id' => $response->json('id')]);

    $fresh = $previous->fresh();

    expect($fresh->active)->toBeFalse();
    expect($fresh->status)->toBe(AcademicYear::EVALUATION_CLOSED);
});
