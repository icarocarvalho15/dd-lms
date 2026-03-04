<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        return Course::with('instructor')
            ->where('is_published', true)
            ->get();
    }

    public function show(string $slug)
    {
        $course = Course::with(['modules.lessons', 'instructor'])
            ->where('slug', $slug)
            ->first();

        if (!$course) {
            return response()->json(['message' => 'Curso não encontrado'], 404);
        }

        return response()->json($course);
    }
}
