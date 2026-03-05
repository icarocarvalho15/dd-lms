<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $instrutor = User::factory()->create([
            'role' => 'instrutor',
            'name' => 'Instrutor DravDev',
            'email' => 'instrutor@dravdev.com',
            'password' => bcrypt('password'),
        ]);

        Course::factory(6)->create(['user_id' => $instrutor->id])->each(function ($course) {
            
            Module::factory(3)->create(['course_id' => $course->id])->each(function ($module) {
                
                Lesson::factory(4)->create(['module_id' => $module->id]);
            });
        });
    }
}