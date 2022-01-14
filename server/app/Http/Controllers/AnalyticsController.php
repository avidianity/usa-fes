<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Section;
use App\Models\User;

class AnalyticsController extends Controller
{
    public function __construct()
    {
        $this->middleware(sprintf('role:%s', User::ADMIN));
    }

    public function __invoke()
    {
        return [
            'faculties' => User::role(User::FACULTY)->active()->count(),
            'administrators' => User::role(User::ADMIN)->active()->count(),
            'students' => User::role(User::STUDENT)->active()->count(),
            'sections' => Section::count(),
            'academic_year' => AcademicYear::active()->first(),
        ];
    }
}
