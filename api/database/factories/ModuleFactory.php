<?php

namespace Database\Factories;

use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

class ModuleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'course_id' => Course::factory(),
            'title' => 'Módulo: ' . $this->faker->word(),
            'order' => $this->faker->numberBetween(1, 5),
        ];
    }
}
