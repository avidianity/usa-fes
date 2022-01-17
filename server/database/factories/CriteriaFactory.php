<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CriteriaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->text(10),
            'order' => $this->faker->unique->numberBetween(1, 255),
        ];
    }
}
