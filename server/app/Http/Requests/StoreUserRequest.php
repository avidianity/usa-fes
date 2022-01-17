<?php

namespace App\Http\Requests;

use App\Models\Section;
use App\Models\User;
use App\Regex;
use App\Rules\Boolean;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
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
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique(User::class)],
            'password' => ['required', 'string', 'max:255', 'confirmed'],
            'picture' => ['nullable', 'file'],
            'role' => ['required', Rule::in(User::ROLES)],
            'school_id' => [sprintf('required_if:role,%s,%s', User::FACULTY, User::STUDENT), 'string', 'max:255'],
            'section_id' => [sprintf('required_if:role,%s', User::STUDENT), Rule::exists(Section::class, 'id')],
            'active' => ['nullable', new Boolean()]
        ];
    }

    protected function passedValidation()
    {
        parent::passedValidation();

        $active = $this->input('active');

        if (is_string($active)) {
            $this->merge(['active' => $active === 'true']);
        }
    }
}
