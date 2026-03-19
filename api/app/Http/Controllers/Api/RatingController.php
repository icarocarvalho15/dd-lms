<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseRating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RatingController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();

            $ratings = CourseRating::with(['course:id,title', 'user:id,name'])
                ->whereHas('course', function($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($ratings);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request, $courseId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500'
        ]);

        $rating = CourseRating::updateOrCreate(
            [
                'course_id' => $courseId,
                'user_id' => Auth::id()
            ],
            [
                'rating' => $request->rating,
                'comment' => $request->comment
            ]
        );

        return response()->json([
            'message' => 'Avaliação enviada com sucesso!',
            'rating' => $rating
        ]);
    }
}
