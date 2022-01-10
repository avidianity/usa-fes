<?php

namespace App\Rules;

use App\Models\AcademicYear;
use App\Models\Evaluation;
use App\Models\User;
use Illuminate\Contracts\Validation\Rule;

class StudentHasNotVotedFaculty implements Rule
{
    /**
     * The student making the answer request
     *
     * @var \App\Models\User
     */
    protected $user;

    /**
     * Create a new rule instance.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $currentAcademicYear = AcademicYear::active()
            ->status(AcademicYear::EVALUATION_ONGOING)
            ->firstOrFail();

        return Evaluation::where('academic_year_id', $currentAcademicYear->id)
            ->where('faculty_id', $value)
            ->where('student_id', $this->user->id)
            ->count() === 0;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'You have already evaluated this faculty.';
    }
}
