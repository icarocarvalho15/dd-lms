<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;

class CourseController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::guard('sanctum')->user();
        
        $courses = Course::with(['instructor', 'modules.lessons'])
            ->where('is_published', true)
            ->orderBy('id', 'desc')
            ->get();

        if ($user) {
            $userCompletedLessons = $user->completedLessons()->pluck('lesson_id')->toArray();

            foreach ($courses as $course) {
                $courseLessonIds = $course->modules->flatMap(function ($module) {
                    return $module->lessons->pluck('id');
                })->toArray();

                $totalLessons = count($courseLessonIds);

                if ($totalLessons > 0) {
                    $completedInThisCourse = count(array_intersect($courseLessonIds, $userCompletedLessons));
                    
                    $course->progress_percentage = (int) round(($completedInThisCourse / $totalLessons) * 100);
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

        /** @var \App\Models\User $user */
        $user = Auth::guard('sanctum')->user();

        $completedIds = [];
        $canGenerate = false;

        if ($user) {
            $allCourseLessonIds = $course->modules->flatMap(function ($module) {
                return $module->lessons->pluck('id');
            })->toArray();

            $completedIds = $user->completedLessons()
                ->whereIn('lesson_id', $allCourseLessonIds)
                ->pluck('lesson_id')
                ->toArray();

            $totalLessons = count($allCourseLessonIds);
            $completedCount = count($completedIds);

            $canGenerate = ($totalLessons > 0 && $completedCount === $totalLessons);
        }

        return response()->json([
            'course' => $course,
            'completed_lessons' => $completedIds,
            'can_generate_certificate' => $canGenerate
        ]);
    }

    public function toggleComplete($id)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $user->completedLessons()->syncWithoutDetaching([$id]);

        return response()->json(['message' => 'Progresso salvo automaticamente']);
    }

    public function dashboard()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user) return response()->json(['message' => 'User not found'], 401);

        $courses = Course::with(['modules.lessons', 'instructor', 'certificates' => function($q) use ($user) {
            $q->where('user_id', $user->id);
        }])
        ->where('is_published', true)
        ->get();

        $enrolledCourses = [];
        $stats = ['started' => 0, 'completed' => 0];

        foreach ($courses as $course) {
            $lessonIds = $course->modules->flatMap->lessons->pluck('id')->toArray();
            $totalLessons = count($lessonIds);

            if ($totalLessons > 0) {
                $completedCount = $user->completedLessons()
                    ->whereIn('lesson_id', $lessonIds)
                    ->distinct()
                    ->count();

                $progress = (int) round(($completedCount / $totalLessons) * 100);

                if ($progress > 0) {
                    $course->progress_percentage = $progress;
                    $course->certificate_hash = $course->certificates->first()?->hash;
                    $enrolledCourses[] = $course;
                    $stats['started']++;
                    if ($progress === 100) $stats['completed']++;
                }
            }
        }

        return response()->json([
            'user' => $user,
            'stats' => $stats,
            'courses' => $enrolledCourses
        ]);
    }

    public function instructorCourses(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $courses = Course::withCount(['modules', 'certificates'])->orderBy('title', 'asc')->get();

        return response()->json($courses);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'duration_minutes' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();

        $imagePath = null;
        if ($request->hasFile('image')) {
            // Salva em storage/app/public/courses
            $imagePath = $request->file('image')->store('courses', 'public');
        }

        $course = Course::create([
            'user_id' => $user->id,
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . Str::random(5),
            'description' => $request->description,
            'is_published' => false,
            'duration_minutes' => $request->duration_minutes ?? 0,
            'image' => $imagePath, // Salva o caminho no banco
        ]);

        return response()->json([
            'message' => 'Curso criado com sucesso!',
            'course' => $course
        ], 201);
    }

    public function addModule(Request $request, $courseId)
    {
        $request->validate(['title' => 'required|string|max:255']);
        
        $course = Course::where('id', $courseId)
                        ->where('user_id', $request->user()->id)
                        ->firstOrFail();

        $module = $course->modules()->create([
            'title' => $request->title,
            'order' => $course->modules()->count() + 1
        ]);

        return response()->json($module, 201);
    }

    public function addLesson(Request $request, $moduleId)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'video_url' => 'nullable|string',
            'content' => 'nullable|string',
        ]);

        $module = Module::with('course')->findOrFail($moduleId);
        
        if (!$module->course || $module->course->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Não autorizado ou curso não encontrado'], 403);
        }

        $lesson = $module->lessons()->create([
            'title' => $request->title,
            'video_url' => $request->video_url,
            'content' => $request->content,
            'order' => $module->lessons()->count() + 1
        ]);

        return response()->json($lesson, 201);
    }

    public function togglePublish(Request $request, $id)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $course = Course::where('id', $id)
                        ->where('user_id', $user->id)
                        ->firstOrFail();

        $course->is_published = !$course->is_published;
        $course->save();

        return response()->json([
            'message' => $course->is_published ? 'Curso publicado com sucesso!' : 'Curso movido para rascunhos.',
            'is_published' => $course->is_published
        ]);
    }

    public function deleteModule($id)
    {
        $module = Module::findOrFail($id);
        
        $module->delete();

        return response()->json(['message' => 'Módulo excluído com sucesso']);
    }

    public function deleteLesson($id)
    {
        $lesson = Lesson::findOrFail($id);
        $lesson->delete();

        return response()->json(['message' => 'Aula excluída com sucesso']);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'duration_minutes' => 'nullable|integer',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['title', 'description', 'duration_minutes']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('courses', 'public');
        }

        $course->update($data);

        return response()->json([
            'message' => 'Curso atualizado com sucesso!',
            'course' => $course
        ]);
    }
    
    public function updateModule(Request $request, $id)
    {
        $request->validate(['title' => 'required|string|max:255']);
        $module = Module::findOrFail($id);
        $module->update(['title' => $request->title]);

        return response()->json($module);
    }

    public function updateLesson(Request $request, $id)
    {
        $lesson = Lesson::findOrFail($id);
        
        $request->validate([
            'title' => 'required|string|max:255',
            'video_url' => 'nullable|string',
            'content' => 'nullable|string',
        ]);

        $lesson->update($request->all());

        return response()->json($lesson);
    }
}