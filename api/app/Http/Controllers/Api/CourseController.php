<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\Course;

class CourseController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::guard('sanctum')->user();
        
        $courses = Course::with(['instructor', 'modules.lessons'])
            ->where('is_published', true)
            ->get();

        if ($user) {
            foreach ($courses as $course) {
                $lessonIds = $course->modules->flatMap(function ($module) {
                    return $module->lessons->pluck('id');
                });

                $total = $lessonIds->count();

                if ($total > 0) {
                    $completedCount = $user->completedLessons()
                        ->whereIn('lesson_id', $lessonIds)
                        ->count();

                    $course->progress_percentage = round(($completedCount / $total) * 100);
                } else {
                    $course->progress_percentage = 0;
                }
            }
        }

        return response()->json($courses);
    }

    public function show(string $slug)
    {
        $course = Course::with(['modules.lessons'])->where('slug', $slug)->firstOrFail();

        $completedIds = [];
        /** @var \App\Models\User $user */
        $user = Auth::guard('sanctum')->user();

        if ($user) {
            $lessonIdsInThisCourse = $course->modules->flatMap(function ($module) {
                return $module->lessons->pluck('id');
            });

            $completedIds = $user->completedLessons()
                ->whereIn('lesson_id', $lessonIdsInThisCourse)
                ->pluck('lesson_id')
                ->toArray();
        }

        return response()->json([
            'course' => $course,
            'completed_lessons' => $completedIds
        ]);
    }

    public function toggleComplete($id)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $user->completedLessons()->syncWithoutDetaching([$id]);

        return response()->json(['message' => 'Progresso salvo automaticamente']);
    }
}