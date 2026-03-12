<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Option;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class QuizController extends Controller
{
    public function store(Request $request, $courseId)
    {
        $request->validate([
            'min_score' => 'required|integer|min:0|max:100',
            'questions' => 'required|array',
        ]);

        try {
            $quiz = Quiz::updateOrCreate(
                ['course_id' => $courseId],
                ['min_score' => $request->min_score]
            );

            $quiz->questions()->delete();

            foreach ($request->questions as $qData) {
                $question = $quiz->questions()->create([
                    'question_text' => $qData['question_text']
                ]);

                foreach ($qData['options'] as $oData) {
                    $question->options()->create([
                        'option_text' => $oData['option_text'],
                        'is_correct' => filter_var($oData['is_correct'], FILTER_VALIDATE_BOOLEAN)
                    ]);
                }
            }

            return response()->json(['message' => 'Avaliação salva com sucesso!']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function submit(Request $request, $courseId)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Usuário não autenticado'], 401);
            }

            $quiz = Quiz::where('course_id', $courseId)->first();
            
            if (!$quiz) {
                return response()->json(['error' => 'Quiz não encontrado para este curso'], 404);
            }

            $answers = $request->input('answers');
            if (!$answers || !is_array($answers)) {
                return response()->json(['error' => 'Formato de respostas inválido'], 400);
            }

            $correctCount = 0;
            $totalQuestions = Question::where('quiz_id', $quiz->id)->count();

            foreach ($answers as $answer) {
                // Verificação segura para evitar erro de índice
                $qId = $answer['question_id'] ?? null;
                $oId = $answer['option_id'] ?? null;

                if ($qId && $oId) {
                    $isCorrect = Option::where('id', $oId)
                                     ->where('question_id', $qId)
                                     ->where('is_correct', true)
                                     ->exists();
                    
                    if ($isCorrect) {
                        $correctCount++;
                    }
                }
            }

            $score = $totalQuestions > 0 ? ($correctCount / $totalQuestions) * 100 : 0;
            $passed = $score >= $quiz->min_score;

            return response()->json([
                'score' => round($score, 2),
                'passed' => (bool)$passed,
                'min_score' => (int)$quiz->min_score
            ]);

        } catch (\Exception $e) {
            // Isso escreve o erro no arquivo storage/logs/laravel.log
            Log::error("Erro no Quiz Submit: " . $e->getMessage());
            
            return response()->json([
                'error' => 'Erro interno',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
