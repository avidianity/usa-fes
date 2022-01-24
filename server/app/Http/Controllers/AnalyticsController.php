<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Section;
use App\Models\User;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function __invoke(Request $request)
    {
        $data = [
            'academic_year' => AcademicYear::active()->first(),
        ];

        if ($request->user()->role === User::ADMIN) {
            $data += [
                'faculties' => User::role(User::FACULTY)->active()->count(),
                'administrators' => User::role(User::ADMIN)->active()->count(),
                'students' => User::role(User::STUDENT)->active()->count(),
                'sections' => Section::count()
            ];
        }

        return $data;
    }
}
