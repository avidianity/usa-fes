<?php

namespace App\Http\Requests;

use App\Models\Criteria;
use App\Models\Question;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateQuestionOrderRequest extends FormRequest
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
            'criterias' => ['required', 'array'],
            'criterias.*.id' => Rule::forEach(fn () => ['required', Rule::exists(Criteria::class, 'id'), 'distinct']),
            'criterias.*.questions' => ['required', 'array'],
            'criterias.*.questions.*.id' => Rule::forEach(fn () => ['required', Rule::exists(Question::class, 'id'), 'distinct']),
            'criterias.*.questions.*.order' => Rule::forEach(fn () => ['required', 'numeric'])
        ];
    }
}
