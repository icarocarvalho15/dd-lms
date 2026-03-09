<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

namespace Database\Factories;

use App\Models\Module;
use Illuminate\Database\Eloquent\Factories\Factory;

class LessonFactory extends Factory
{
    public function definition(): array
    {
        return [
            'module_id' => Module::factory(),
            'title' => 'Aula: ' . $this->faker->words(3, true),
            'video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
            'order' => $this->faker->numberBetween(1, 10),
            'content' => $this->faker->text(),
        ];
    }
}