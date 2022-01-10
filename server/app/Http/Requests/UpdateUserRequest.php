<?php

namespace App\Http\Requests;

use App\Models\Section;
use App\Models\User;
use App\Regex;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
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
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', Rule::unique(User::class)],
            'password' => ['nullable', 'string', 'max:255', 'confirmed'],
            'picture' => ['nullable', 'file'],
            'role' => ['nullable', Rule::in(User::ROLES)],
            'school_id' => [sprintf('required_if:role,%s,%s', User::FACULTY, User::STUDENT), 'string', 'max:255'],
            'section_id' => [sprintf('required_if:role,%s', User::STUDENT), Rule::exists(Section::class, 'id')]
        ];
    }
}
