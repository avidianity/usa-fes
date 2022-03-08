<?php

namespace App\Http\Controllers;

use App\Http\Requests\GetUsersRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Faculty;
use App\Models\File;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware(sprintf('role:%s', User::ADMIN))->only('store', 'update', 'destroy', 'comments');
    }

    /**
     * Display a listing of the resource.
     *
     * @param  \App\Http\Requests\GetUsersRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function index(GetUsersRequest $request)
    {
        $builder = User::with('picture');

        if ($request->has('role')) {
            $role = $request->input('role');

            $builder->where('role', $role);

            if ($role === User::STUDENT) {
                $builder = Student::with('picture', 'section', 'subjects')
                    ->where('role', $role);
            } else if ($role === User::FACULTY) {
                $builder = Faculty::with('picture', 'subjects.subject', 'subjects.section')
                    ->where('role', $role);
            }
        }

        return $builder->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreUserRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreUserRequest $request)
    {
        $user = User::create($request->all());

        if ($request->hasFile('picture')) {
            $user->picture()->save(File::process($request->file('picture')));
        }

        return $user;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        $user->load('picture');
        return $user;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateUserRequest  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update($request->all());

        if ($request->hasFile('picture')) {
            optional($user->picture)->delete();
            $user->picture()->save(File::process($request->file('picture')));
        }

        return $user;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response('', 204);
    }

    public function faculties(Request $request)
    {
        $user = $request->user();

        $builder = Faculty::role(Faculty::ROLE)
            ->with([
                'answers',
                'evaluations',
                'subjects.subject',
                'subjects.section'
            ]);

        if ($user->role === User::STUDENT) {
            $builder->whereDoesntHave('evaluations', function (Builder $builder) use ($user) {
                return $builder->where('student_id', $user->id);
            });

            $builder->whereHas('subjects', function (Builder $builder) use ($user) {
                return $builder->whereIn('subject_id', $user->subjects->map->id)
                    ->where('section_id', $user->section_id);
            });
        }

        return $builder->get();
    }

    public function comments(Faculty $faculty)
    {
        return $faculty->evaluations->map->comments;
    }
}
