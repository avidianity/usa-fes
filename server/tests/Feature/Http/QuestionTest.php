<?php

namespace Tests\Feature\Http;

use App\Models\Criteria;
use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

uses(RefreshDatabase::class);

beforeEach(fn () => actingAs());

it('fetches questions', function () {
    $criteria = Criteria::factory()->create();

    Question::factory(5)
        ->for($criteria)
        ->create();

    $response = getJson(route('criterias.questions.index', ['criteria' => $criteria->id]))
        ->assertOk();

    $data = collect($response->json());

    expect($data->count())->toBe(Question::count());
});

it('fetches a question', function () {
    $criteria = Criteria::factory()->create();

    $questions = Question::factory(5)
        ->for($criteria)
        ->create();

    $question = $questions->random();

    $response = getJson(route('criterias.questions.show', [
        'criteria' => $criteria->id,
        'question' => $question->id
    ]))
        ->assertOk();

    expect($response->json('id'))->toBe($question->id);
});

it('creates a question', function () {
    $criteria = Criteria::factory()->create();

    $response = postJson(route('criterias.questions.store', ['criteria' => $criteria->id]), Question::factory()->data())
        ->assertCreated();

    assertDatabaseHas(Question::class, ['id' => $response->json('id')]);
});

it('updates a question', function () {
    $data = Question::factory()->data();

    $criteria = Criteria::factory()->create();

    $question = Question::factory()
        ->for($criteria)
        ->create();

    putJson(route('criterias.questions.update', [
        'criteria' => $criteria->id,
        'question' => $question->id
    ]), $data)
        ->assertOk();

    assertDatabaseHas(Question::class, ['id' => $question->id] + $data);
});

it('deletes a question', function () {
    $criteria = Criteria::factory()->create();

    $questions = Question::factory(5)
        ->for($criteria)
        ->create();

    $question = $questions->random();

    deleteJson(route('criterias.questions.destroy', ['criteria' => $criteria->id, 'question' => $question->id]))
        ->assertNoContent();

    assertDatabaseMissing(Question::class, ['id' => $question->id]);
});

it('reorders questions', function () {
    $criteria = Criteria::factory()->create();

    Question::factory(3)
        ->for($criteria)
        ->create();

    $orders = [
        [
            'id' => 1,
            'questions' => [
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
            ]
        ],
    ];

    $data = [
        'criterias' => $orders
    ];

    putJson(route('criterias.questions.reorder'), $data)
        ->assertOk();

    collect($orders)->each(function ($order) {
        collect($order['questions'])->each(function ($order) {
            $question = Question::findOrFail($order['id']);

            expect($question->order)->toBe($order['order']);
        });
    });
});
