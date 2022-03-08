<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssignStudentSubjectRequest;
use App\Models\Subject;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StudentSubjectController extends Controller
{
    public function __construct()
    {
        $this->middleware(sprintf('role:%s', User::ADMIN));
    }

    public function assign(AssignStudentSubjectRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $data = collect($request->validated()['entries']);

            return $data->map(function ($entry) {
                $student = Student::role(Student::ROLE)->findOrFail($entry['student_id']);

                $subjects = Subject::findMany($entry['subject_ids']);

                $student->subjects()->sync($subjects);

                return [
                    'student' => $student,
                    'subjects' => $subjects,
                ];
            });
        });
    }
}
