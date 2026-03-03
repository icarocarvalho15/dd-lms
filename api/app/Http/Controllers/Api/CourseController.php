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

    public function show($slug)
    {
        return Course::with(['modules.lessons', 'instructor'])
            ->where('slug', $slug)
            ->firstOrFail();
    }
}
