<?php

namespace App\Http\Requests;

use App\Models\AcademicYear;
use App\Regex;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAcademicYearRequest extends FormRequest
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
            'year' => ['nullable', 'string', sprintf('regex:%s', Regex::ACADEMIC_YEAR)],
            'semester' => ['nullable', 'string', Rule::in(AcademicYear::SEMESTERS)],
            'active' => ['nullable', 'boolean'],
            'status' => ['nullable', 'string', Rule::in(AcademicYear::EVALUATION_STATUSES)]
        ];
    }
}
