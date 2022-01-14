<?php

namespace Tests\Feature\Http;

use App\Models\AcademicYear;
use App\Models\Section;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\getJson;

uses(RefreshDatabase::class);

it('fetches analytics', function () {
    actingAs();

    User::factory(25)->active()->create();
    Section::factory(15)->create();

    getJson(route('analytics'))
        ->assertOk()
        ->assertJson([
            'faculties' => User::role(User::FACULTY)->active()->count(),
            'administrators' => User::role(User::ADMIN)->active()->count(),
            'students' => User::role(User::STUDENT)->active()->count(),
            'sections' => Section::count(),
            'academic_year' => AcademicYear::active()->first(),
        ]);
});
