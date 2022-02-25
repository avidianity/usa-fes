<?php

namespace App\Http\Requests;

use App\Models\Answer;
use App\Models\Question;
use App\Models\User;
use App\Rules\StudentHasNotVotedFaculty;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreManyAnswersRequest extends FormRequest
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
            'faculty_id' => [
                'required',
                Rule::exists(User::class, 'id')->where('role', User::FACULTY),
                new StudentHasNotVotedFaculty($this->user())
            ],
            'answers' => ['required', 'array'],
            'answers.*.question_id' => Rule::forEach(fn () => ['required', Rule::exists(Question::class, 'id'), 'distinct']),
            'answers.*.rating' => Rule::forEach(fn () => ['required', Rule::in(Answer::RATINGS)]),
            'comments' => ['nullable', 'string']
        ];
    }
}
