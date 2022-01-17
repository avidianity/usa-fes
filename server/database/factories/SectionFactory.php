<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class SectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->unique()->text(10),
            'level' => $this->faker->numberBetween(1, 5),
            'section' => Str::upper($this->faker->randomLetter)
        ];
    }
}
