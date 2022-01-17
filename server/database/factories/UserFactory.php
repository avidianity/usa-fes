<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $gender = $this->faker->randomElement(['male', 'female']);
        return [
            'first_name' => $this->faker->firstName($gender),
            'last_name' => $this->faker->lastName($gender),
            'email' => $this->faker->unique()->email,
            'password' => 'password',
            'role' => $this->faker->randomElement(User::ROLES),
            'active' => $this->faker->boolean
        ];
    }

    public function active()
    {
        return $this->state(fn () => [
            'active' => true
        ]);
    }

    public function admin()
    {
        return $this->state(fn () => [
            'role' => User::ADMIN
        ]);
    }

    public function student()
    {
        return $this->state(fn () => [
            'role' => User::STUDENT,
            'school_id' => $this->faker->text(10)
        ]);
    }

    public function faculty()
    {
        return $this->state(fn () => [
            'role' => User::FACULTY
        ]);
    }
}
