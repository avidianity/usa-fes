<?php

namespace Database\Factories;

use App\Models\AcademicYear;
use Illuminate\Database\Eloquent\Factories\Factory;

class AcademicYearFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'year' => sprintf('%s-%s', $this->faker->year, $this->faker->year),
            'semester' => $this->faker->randomElement(AcademicYear::SEMESTERS),
            'status' => $this->faker->randomElement(AcademicYear::EVALUATION_STATUSES)
        ];
    }

    public function active()
    {
        return $this->state(fn () => ['active' => true]);
    }

    public function ongoing()
    {
        return $this->state(fn () => ['status' => AcademicYear::EVALUATION_ONGOING]);
    }

    public function pending()
    {
        return $this->state(fn () => ['status' => AcademicYear::EVALUATION_PENDING]);
    }

    public function closed()
    {
        return $this->state(fn () => ['status' => AcademicYear::EVALUATION_CLOSED]);
    }
}
