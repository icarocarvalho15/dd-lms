<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Option;
use App\Models\QuizResult;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuizController extends Controller
{
    public function store(Request $request, $courseId)
    {
        $request->validate([
            'min_score' => 'required|integer|min:0|max:100',
            'max_attempts' => 'required|integer|min:1',
            'questions' => 'required|array',
        ]);

        try {
            $quiz = Quiz::updateOrCreate(
                ['course_id' => $courseId],
                ['min_score' => $request->min_score, 'max_attempts' => $request->max_attempts]
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
            return response()->json([
                'message' => 'Avaliação salva com sucesso!'
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function submit(Request $request, $courseId)
    {
        $user = Auth::user();
        $quiz = Quiz::where('course_id', $courseId)->firstOrFail();

        $alreadyPassed = QuizResult::where('user_id', $user->id)->where('quiz_id', $quiz->id)->where('passed', true)->exists();

        if ($alreadyPassed) {
            return response()->json(['error' => 'Você já foi aprovado e não pode repetir a prova.'], 403);
        }

        $attemptsCount = QuizResult::where('user_id', $user->id)->where('quiz_id', $quiz->id)->count();
        
        if ($attemptsCount >= ($quiz->max_attempts ?? 3)) {
            return response()->json(['error' => 'Limite de tentativas atingido.'], 403);
        }

        $correctCount = 0;
        $answers = $request->input('answers', []);
        $totalQuestions = $quiz->questions()->count();

        foreach ($answers as $answer) {
            $option = Option::where('id', $answer['option_id'])->where('question_id', $answer['question_id'])->first();
            if ($option && $option->is_correct) {
                $correctCount++;
            }
        }

        $score = $totalQuestions > 0 ? ($correctCount / $totalQuestions) * 100 : 0;
        $passed = $score >= $quiz->min_score;

        $attemptsCount = QuizResult::where('user_id', $user->id)->where('quiz_id', $quiz->id)->count();
        
        $result = new QuizResult();
        $result->user_id = $user->id;
        $result->quiz_id = $quiz->id;
        $result->score = $score;
        $result->passed = $passed;
        $result->attempt_number = $attemptsCount + 1;
        $result->save();

        if ($passed) {
            Certificate::firstOrCreate(
                ['user_id' => $user->id, 'course_id' => $quiz->course_id],
                ['hash' => bin2hex(random_bytes(32))]
            );
        }
        
        return response()->json([
            'score' => round($score, 2),
            'passed' => $passed,
            'min_score' => $quiz->min_score,
            'attempts_left' => ($quiz->max_attempts ?? 3) - ($attemptsCount + 1)
        ]);
    }
}
