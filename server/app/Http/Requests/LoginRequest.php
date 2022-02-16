<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LoginRequest extends FormRequest
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
            'email' => ['required', 'string', 'email', Rule::exists(User::class)],
            'password' => ['required', 'string', 'max:255'],
            'role' => ['nullable', Rule::in(User::ROLES)]
        ];
    }

    public function messages()
    {
        return [
            'email.exists' => 'Email does not exist.'
        ];
    }
}
