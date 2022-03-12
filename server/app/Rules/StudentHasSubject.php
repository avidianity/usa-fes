<?php

namespace App\Rules;

use App\Models\Student;
use Illuminate\Contracts\Validation\Rule;

class StudentHasSubject implements Rule
{
    /**
     * The student making the answer request
     *
     * @var \App\Models\Student
     */
    protected $student;

    /**
     * Create a new rule instance.
     *
     * @param  \App\Models\Student  $student
     * @return void
     */
    public function __construct(Student $student)
    {
        $this->student = $student;
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
        return $this->student
            ->subjects()
            ->where('subjects.id', $value)
            ->count() === 1;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Subject is not assigned to current user.';
    }
}
