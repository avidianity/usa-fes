<?php

namespace Tests\Feature\Http;

use App\Models\Faculty;
use App\Models\FacultySubject;
use App\Models\Section;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\deleteJson;
use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

beforeEach(fn () => actingAs());

it('assigns subjects to faculty', function () {
    $faculty = User::factory()
        ->faculty()
        ->create();

    $subject = Subject::factory()->create();

    $section = Section::factory()->create();

    $data = [
        'section_id' => $section->id,
        'subject_id' => $subject->id,
    ];

    postJson(route('faculty-subjects.store', ['faculty' => $faculty->id]), $data)
        ->assertCreated();
});

it('unassigns subjects to faculty', function () {
    $model = FacultySubject::factory()
        ->for(
            User::factory()
                ->faculty(),
            'faculty'
        )
        ->for(Section::factory())
        ->for(Subject::factory())
        ->create();

    deleteJson(route('faculty-subjects.destroy', ['faculty_subject' => $model->id]))
        ->assertNoContent();

    expect(Faculty::role(Faculty::ROLE)->withCount('subjects')->firstOrFail()->subjects_count)->toBe(0);
});
