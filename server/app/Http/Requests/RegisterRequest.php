<?php

namespace App\Http\Requests;

use App\Models\Section;
use App\Models\User;
use App\Regex;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
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
            'school_id' => ['required', 'string', 'max:255'],
            'section_id' => [sprintf('required_if:role,%s', User::STUDENT), Rule::exists(Section::class, 'id')],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', Rule::unique(User::class)],
            'password' => ['required', 'string', 'max:255', 'confirmed'],
            'picture' => ['nullable', 'file'],
            'role' => ['required', Rule::in(User::FACULTY, User::STUDENT)]
        ];
    }
}
