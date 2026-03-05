<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class CertificateController extends Controller
{
    public function generate(string $slug)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $course = Course::with('modules.lessons')->where('slug', $slug)->firstOrFail();

        $lessonIds = $course->modules->flatMap->lessons->pluck('id');
        $completedCount = $user->completedLessons()->whereIn('lesson_id', $lessonIds)->count();
        
        if ($completedCount < $lessonIds->count() || $lessonIds->count() === 0) {
            return response()->json(['message' => 'Curso incompleto.'], 403);
        }

        $data = [
            'student_name' => $user->name,
            'course_title' => $course->title,
            'date'         => now()->format('d/m/Y'),
            'certificate_id' => strtoupper(substr(md5($user->id . $course->id), 0, 10))
        ];

        $pdf = Pdf::loadView('pdf.certificate', $data)->setPaper('a4', 'landscape');

        return $pdf->download("Certificado-{$course->slug}.pdf");
    }
}