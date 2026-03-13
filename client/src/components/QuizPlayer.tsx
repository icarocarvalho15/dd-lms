import { useState } from 'react';
import api from '../api/axios';
import QuizResultModal from '../components/QuizResultModal';

export interface Option {
    id: number;
    option_text: string;
}

export interface Question {
    id: number;
    question_text: string;
    options: Option[];
}

export interface Quiz {
    id: number;
    min_score: number;
    questions: Question[];
}

interface QuizPlayerProps {
    quiz: Quiz;
    courseId: number;
    onComplete: (score: number) => void;
    handleDownloadCertificate: () => void;
}

const QuizPlayer = ({ quiz, courseId, onComplete, handleDownloadCertificate }: QuizPlayerProps) => {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultData, setResultData] = useState({ 
        passed: false, 
        score: 0, 
        minScore: 0, 
        attemptsLeft: 0 
    });

    const handleSelect = (questionId: number, optionId: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < quiz.questions.length) {
            alert("Por favor, responda todas as perguntas antes de enviar.");
            return;
        }
        setIsSubmitting(true);
        const formattedAnswers = Object.entries(answers).map(([qId, oId]) => ({
            question_id: parseInt(qId),
            option_id: oId
        }));
        try {
            const res = await api.post(`/courses/${courseId}/quiz/submit`, { answers: formattedAnswers });
            setResultData({
                passed: res.data.passed,
                score: res.data.score,
                minScore: res.data.min_score,
                attemptsLeft: res.data.attempts_left
            });
            setShowResultModal(true);
        } catch (error) {
            console.error(error);
            alert("Erro ao processar sua avaliação.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRetry = () => {
        setAnswers({});
        setShowResultModal(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="relative">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900">
                        Avaliação <span className="text-purple-600">Final</span>
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        Você precisa de no mínimo <strong>{quiz.min_score}%</strong> para ser aprovado.
                    </p>
                </div>
                <div className="space-y-12">
                    {quiz.questions.map((q, idx) => (
                        <div key={q.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h4 className="text-lg font-bold text-gray-800 mb-6 flex gap-3">
                                <span className="bg-purple-100 text-purple-600 w-7 h-7 rounded-lg flex items-center justify-center text-xs">
                                    {idx + 1}
                                </span>
                                {q.question_text}
                            </h4>
                            <div className="grid gap-3 ml-10">
                                {q.options.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleSelect(q.id, opt.id)}
                                        className={`p-4 rounded-2xl text-left text-sm font-medium transition-all border-2 ${
                                            answers[q.id] === opt.id
                                                ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-md'
                                                : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                                        }`}
                                    >
                                        {opt.option_text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-16 pt-8 border-t">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-gray-900 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] hover:bg-purple-600 transition-all shadow-xl disabled:opacity-50"
                    >
                        {isSubmitting ? 'Enviando...' : 'Finalizar e Ver Resultado ➔'}
                    </button>
                </div>
            </div>
            <QuizResultModal 
                isOpen={showResultModal}
                passed={resultData.passed}
                score={resultData.score}
                minScore={resultData.minScore}
                attemptsLeft={resultData.attemptsLeft}
                onClose={() => setShowResultModal(false)}
                onRetry={handleRetry}
                onGenerate={() => {
                    setShowResultModal(false);
                    onComplete(resultData.score);
                    handleDownloadCertificate();
                }}
            />
        </div>
    );
};

export default QuizPlayer;