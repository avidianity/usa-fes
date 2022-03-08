<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFacultySubjectRequest;
use App\Http\Requests\UpdateFacultySubjectRequest;
use App\Models\Faculty;
use App\Models\FacultySubject;
use App\Models\User;

class FacultySubjectController extends Controller
{
    public function __construct()
    {
        $this->middleware(sprintf('role:%s', User::ADMIN));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreFacultySubjectRequest  $request
     * @param  \App\Models\Faculty  $faculty
     * @return \Illuminate\Http\Response
     */
    public function store(StoreFacultySubjectRequest $request, Faculty $faculty)
    {
        $data = $request->validated();

        $model = $faculty->subjects()
            ->where('section_id', $data['section_id'])
            ->where('subject_id', $data['subject_id'])
            ->first();

        if ($model) {
            return response($model, 201);
        }

        return $faculty->subjects()->create($data);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\FacultySubject  $facultySubject
     * @return \Illuminate\Http\Response
     */
    public function destroy(FacultySubject $facultySubject)
    {
        $facultySubject->delete();

        return response('', 204);
    }
}
