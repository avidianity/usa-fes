<?php

namespace App\Http\Requests;

use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignStudentSubjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'entries' => ['required', 'array', 'min:1'],
            'entries.*.student_id' => ['required', Rule::exists(User::class, 'id')->where('role', User::STUDENT)],
            'entries.*.subject_ids' => ['required', 'array', 'min:1'],
            'entries.*.subject_ids.*' => ['required', Rule::exists(Subject::class, 'id')],
        ];
    }
}
