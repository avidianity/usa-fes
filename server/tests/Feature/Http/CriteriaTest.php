<?php

namespace Tests\Feature\Http;

use App\Models\Answer;
use App\Models\Criteria;
use App\Models\Question;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
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
    $data = collect(Criteria::factory()->data())->except('order')->toArray();

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

it('reorders criterias', function () {
    Criteria::factory(3)->create();

    $orders = [
        [
            'id' => 1,
            'order' => 3,
        ],
        [
            'id' => 2,
            'order' => 1,
        ],
        [
            'id' => 3,
            'order' => 2
        ]
    ];

    $data = [
        'criterias' => $orders
    ];

    putJson(route('criterias.reorder'), $data)
        ->assertOk();

    collect($orders)->each(function ($order) {
        $criteria = Criteria::findOrFail($order['id']);

        expect($criteria->order)->toBe($order['order']);
    });
});

it('fetches criterias for faculty', function () {
    $faculty = User::factory()->faculty()->create();

    $criterias = collect(Criteria::factory(3)->create());

    $criterias->map(fn (Criteria $criteria) => Question::factory(5)->for($criteria)->create())
        ->map(
            fn (Collection $questions) => $questions->map(
                fn (Question $question) => Answer::factory(25)
                    ->forStudent()
                    ->for($faculty, 'faculty')
                    ->for($question)
                    ->create()
            )
        );

    getJson(route('criterias.for-faculty', ['faculty' => $faculty->id]))
        ->assertOk();
});
