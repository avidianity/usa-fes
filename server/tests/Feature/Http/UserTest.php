<?php

namespace Tests\Feature\Http;

use App\Models\AcademicYear;
use App\Models\Evaluation;
use App\Models\Section;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Faker\faker;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

uses(RefreshDatabase::class);

beforeEach(fn () => actingAs());

it('fetches users', function () {
    User::factory(5)->create();
    $response = getJson(route('users.index'))
        ->assertOk();

    $data = collect($response->json());

    expect($data->count())->toBe(User::count());
});

it('fetches a user', function () {
    $users = User::factory(5)->create();

    $user = $users->random();

    $response = getJson(route('users.show', ['user' => $user->id]))
        ->assertOk();

    expect($response->json('id'))->toBe($user->id);
});

it('creates a user', function () {
    $faker = faker();
    $password = $faker->password;

    Storage::fake();

    $data = [
        'password' => $password,
        'password_confirmation' => $password,
        'picture' => UploadedFile::fake()->image('picture.jpg')
    ] + User::factory()->student()->data();

    if (in_array($data['role'], [User::STUDENT, User::FACULTY])) {
        $data['school_id'] = $faker->text;

        if ($data['role'] === User::STUDENT) {
            $data['section_id'] = Section::factory()->create()->id;
        }
    }

    $response = postJson(route('users.store'), $data)
        ->assertCreated();

    assertDatabaseHas(User::class, ['id' => $response->json('id')]);

    $picture = User::findOrFail($response->json('id'))->picture;

    Storage::assertExists($picture->path);
});

it('updates a user', function () {
    $data = User::factory()->data();

    $user = User::factory()->create(['active' => false]);

    unset($data['name']);

    if (in_array($data['role'], [User::STUDENT, User::FACULTY])) {
        $data['school_id'] = faker()->text;

        if ($data['role'] === User::STUDENT) {
            $data['section_id'] = Section::factory()->create()->id;
        }
    }

    putJson(route('users.update', ['user' => $user->id]), $data)
        ->assertOk();

    assertDatabaseHas(User::class, ['id' => $user->id] + $data);
});

it('deletes a user', function () {
    $users = User::factory(5)->create();

    $user = $users->random();

    deleteJson(route('users.destroy', ['user' => $user->id]))
        ->assertNoContent();

    assertDatabaseMissing(User::class, ['id' => $user->id]);
});

it('fetches faculties', function () {
    User::factory(25)->create();

    $response = getJson(route('users.faculties'))
        ->assertOk();

    collect($response->json())->map(fn ($item) => new User($item))
        ->each(function (User $user) {
            expect($user->role)->toBe(User::FACULTY);
        });
});

it('fetches comments for a faculty', function () {
    $faculty = User::factory()
        ->faculty()
        ->active()
        ->create();

    $student = User::factory()
        ->student()
        ->active();

    $year = AcademicYear::factory()
        ->active()
        ->ongoing()
        ->create();

    Evaluation::factory(10)
        ->for($faculty, 'faculty')
        ->for($student, 'student')
        ->create(['academic_year_id' => $year->id]);

    $response = getJson(route('users.faculty.comments', ['faculty' => $faculty->id]))
        ->assertOk();

    $comments = collect($response->json());

    expect($comments->count())->toBe(10);
});
