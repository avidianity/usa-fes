<?php

namespace Tests\Feature\Http;

use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

beforeEach(fn () => actingAs());

it('assigns subjects to students', function () {
    $students = User::factory(10)
        ->student()
        ->create();

    $subjects = Subject::factory(25)->create();

    $data = [
        'entries' => $students->map(fn ($student) => [
            'student_id' => $student->id,
            'subject_ids' => $subjects->map->id
        ]),
    ];

    postJson(route('student-subjects.assign'), $data)
        ->assertOk();
});
