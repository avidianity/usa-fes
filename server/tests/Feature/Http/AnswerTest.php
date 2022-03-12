<?php

namespace Tests\Feature\Http;

use App\Models\AcademicYear;
use App\Models\Question;
use App\Models\Answer;
use App\Models\Evaluation;
use App\Models\Subject;
use App\Models\User;
use App\Rules\StudentHasNotVotedFaculty;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Faker\faker;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

beforeEach(fn () => actingAs());

it('fetches answers', function () {
    $question = Question::factory()
        ->forCriteria()
        ->create();

    $year = AcademicYear::factory()
        ->active()
        ->ongoing()
        ->create();

    $evaluation = Evaluation::factory()
        ->forStudent()
        ->forFaculty()
        ->forSubject()
        ->create(['academic_year_id' => $year->id]);

    Answer::factory(5)
        ->for($question)
        ->forStudent()
        ->forFaculty()
        ->for($evaluation)
        ->create();

    $response = getJson(route('questions.answers.index', ['question' => $question->id]))
        ->assertOk();

    $data = collect($response->json());

    expect($data->count())->toBe(Answer::count());
});

it('fetches an answer', function () {
    $question = Question::factory()
        ->forCriteria()
        ->create();

    $year = AcademicYear::factory()
        ->active()
        ->ongoing()
        ->create();

    $evaluation = Evaluation::factory()
        ->forStudent()
        ->forFaculty()
        ->forSubject()
        ->create(['academic_year_id' => $year->id]);

    $answers = Answer::factory(5)
        ->for($question)
        ->forStudent()
        ->forFaculty()
        ->for($evaluation)
        ->create();

    $answer = $answers->random();

    $response = getJson(route('questions.answers.show', [
        'question' => $question->id,
        'answer' => $answer->id
    ]))
        ->assertOk();

    expect($response->json('id'))->toBe($answer->id);
});

it('fails to fetch an answer', function () {
    actingAs(User::FACULTY);

    $question = Question::factory()
        ->forCriteria()
        ->create();

    $year = AcademicYear::factory()
        ->active()
        ->ongoing()
        ->create();

    $evaluation = Evaluation::factory()
        ->forStudent()
        ->forFaculty()
        ->forSubject()
        ->create(['academic_year_id' => $year->id]);

    $answers = Answer::factory(5)
        ->for($question)
        ->forStudent()
        ->forFaculty()
        ->for($evaluation)
        ->create();

    $answer = $answers->random();

    getJson(route('questions.answers.show', [
        'question' => $question->id,
        'answer' => $answer->id
    ]))->assertNotFound();
});

it('deletes an answer', function () {
    $question = Question::factory()
        ->forCriteria()
        ->create();

    $year = AcademicYear::factory()
        ->active()
        ->ongoing()
        ->create();

    $evaluation = Evaluation::factory()
        ->forStudent()
        ->forFaculty()
        ->forSubject()
        ->create(['academic_year_id' => $year->id]);


    $answers = Answer::factory(5)
        ->for($question)
        ->forStudent()
        ->forFaculty()
        ->for($evaluation)
        ->create();

    $answer = $answers->random();

    deleteJson(route('questions.answers.destroy', ['question' => $question->id, 'answer' => $answer->id]))
        ->assertNoContent();

    assertDatabaseMissing(Answer::class, ['id' => $answer->id]);
});

it('fetches answers for a student', function () {
    $user = actingAs(User::STUDENT);

    $question = Question::factory()
        ->forCriteria()
        ->create();

    $faculty = User::factory()->faculty()->create();

    $year = AcademicYear::factory()
        ->active()
        ->ongoing()
        ->create();

    $subject =  Subject::factory()->create();

    $evaluation = Evaluation::factory()
        ->for($user, 'student')
        ->for($faculty, 'faculty')
        ->for($subject)
        ->create(['academic_year_id' => $year->id]);

    Answer::factory(5)
        ->for($question)
        ->forStudent()
        ->forFaculty()
        ->for($evaluation)
        ->create();

    Answer::factory(5)
        ->for($question)
        ->for($user, 'student')
        ->forFaculty()
        ->for($evaluation)
        ->create();

    $response = getJson(route('questions.answers.index', ['question' => $question->id]))
        ->assertOk();

    collect($response->json())
        ->map(fn ($item) => new Answer($item))
        ->each(function (Answer $answer) use ($user) {
            expect($answer->student_id)->toBe($user->id);
        });
});

it('fails to create an answer when given faculty id is not of faculty role', function () {
    actingAs(User::STUDENT);

    AcademicYear::factory()
        ->active()
        ->ongoing()
        ->create();

    $faculty = User::factory()->student()->create();

    Question::factory(25)
        ->forCriteria()
        ->create();

    $questions = Question::all();

    $data = [
        'faculty_id' => $faculty->id,
        'answers' => $questions->map(fn (Question $question) => [
            'question_id' => $question->id,
            'rating' => faker()->randomElement(Answer::RATINGS)
        ])->toArray()
    ];

    postJson(route('answers.store-many'), $data)
        ->assertUnprocessable();

    $faculty = User::factory()->admin()->create();

    $data['faculty_id'] = $faculty->id;

    postJson(route('answers.store-many'), $data)
        ->assertUnprocessable();
});

it('creates answers for a student', function () {
    $student = actingAs(User::STUDENT);

    AcademicYear::factory()
        ->active()
        ->ongoing()
        ->create();

    $subject = Subject::factory()->create();

    $student->subjects()->sync($subject);

    $faculty = User::factory()->faculty()->create();

    Question::factory(25)
        ->forCriteria()
        ->create();

    $questions = Question::all();

    $data = [
        'faculty_id' => $faculty->id,
        'subject_id' => $subject->id,
        'answers' => $questions->map(fn (Question $question) => [
            'question_id' => $question->id,
            'rating' => faker()->randomElement(Answer::RATINGS)
        ])->toArray()
    ];

    postJson(route('answers.store-many'), $data)
        ->assertOk();
});

it('fails to create answers for a student', function () {
    $user = actingAs(User::STUDENT);

    $academicYear = AcademicYear::factory()
        ->active()
        ->ongoing()
        ->create();

    $faculty = User::factory()->faculty()->create();

    $subject = Subject::factory()->create();

    $user->subjects()->sync($subject);

    Evaluation::create([
        'academic_year_id' => $academicYear->id,
        'faculty_id' => $faculty->id,
        'student_id' => $user->id,
        'subject_id' => $subject->id,
    ]);

    Question::factory(5)
        ->forCriteria()
        ->create();

    $questions = Question::all();

    $data = [
        'faculty_id' => $faculty->id,
        'subject_id' => $subject->id,
        'answers' => $questions->map(fn (Question $question) => [
            'question_id' => $question->id,
            'rating' => faker()->randomElement(Answer::RATINGS)
        ])->toArray()
    ];

    $message = (new StudentHasNotVotedFaculty($user, $subject->id))->message();

    postJson(route('answers.store-many'), $data)
        ->assertUnprocessable()
        ->assertJson([
            'message' => $message,
            'errors' => [
                'faculty_id' => [
                    $message,
                ]
            ]
        ]);
});
