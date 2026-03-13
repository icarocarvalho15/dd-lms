<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Certificate;
use App\Models\QuizResult;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class CertificateController extends Controller
{
    public function getPermanentLink(Request $request, $slug)
    {
        try {
            $course = Course::where('slug', $slug)->firstOrFail();
            $user = $request->user();
            
            if ($course->quiz) {
                $passed = QuizResult::where('user_id', $user->id)
                    ->where('quiz_id', $course->quiz->id)
                    ->where('passed', true)
                    ->exists();
                if (!$passed) {
                    return response()->json(['message' => 'Você precisa ser aprovado na avaliação primeiro.'], 403);
                }
            }

            $cert = Certificate::firstOrCreate(
                ['user_id' => $user->id, 'course_id' => $course->id],
                ['hash' => bin2hex(random_bytes(32))]
            );

            return response()->json([
                'url' => url("/certificate/{$cert->hash}")
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro interno: ' . $e->getMessage()], 500);
        }
    }

    public function viewPublic($hash)
    {
        $cert = Certificate::with('course')->where('hash', $hash)->firstOrFail();

        $cert->course->refresh(); 
        
        $data = [
            'user_name' => $cert->user->name,
            'course_name' => $cert->course->title,
            'date' => $cert->created_at->format('d/m/Y'),
            'duration' => $cert->course->duration_minutes, //
            'certificate_code' => strtoupper(substr($hash, 0, 10))
        ];

        $pdf = Pdf::loadView('pdf.certificate', $data)->setPaper('a4', 'landscape');
        
        return $pdf->stream("Certificado-{$cert->course->slug}.pdf", [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="Certificado.pdf"'
        ]);
    }

    public function generate(Request $request, $slug)
    {
        if ($request->has('token')) {
            $request->headers->set('Authorization', 'Bearer ' . $request->token);
        }
        
        /** @var \App\Models\User $user */
        $user = Auth::guard('sanctum')->user();
        
        if (!$user) {
            return response()->json(['message' => 'Não autenticado'], 401);
        }
        
        $course = Course::with('modules.lessons')->where('slug', $slug)->firstOrFail();

        $lessonIds = $course->modules->flatMap(function ($module) {
            return $module->lessons->pluck('id');
        })->toArray();

        $totalRequired = count($lessonIds);

        $completedCount = $user->completedLessons()
            ->whereIn('lesson_id', $lessonIds)
            ->count();

        if ($totalRequired === 0 || $completedCount < $totalRequired) {
            return response()->json([
                'message' => 'Conclua todas as aulas para liberar o certificado.',
                'status' => "{$completedCount}/{$totalRequired}"
            ], 403);
        }

        $data = [
            'user_name' => $user->name,
            'course_name' => $course->title,
            'date' => now()->format('d/m/Y'),
            'duration' => $course->duration_minutes,
            'certificate_code' => strtoupper(Str::random(10))
        ];

        $pdf = Pdf::loadView('pdf.certificate', $data)->setPaper('a4', 'landscape');
        
        return $pdf->stream("Certificado-{$course->slug}.pdf", [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="Certificado.pdf"'
        ]);
    }
}