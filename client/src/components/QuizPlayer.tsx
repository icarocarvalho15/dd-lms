import { useState } from 'react';
import api from '../api/axios';
import QuizResultModal from '../components/QuizResultModal';
import type { AxiosError } from 'axios';
import { ClipboardCheck, Send, CheckCircle2, HelpCircle } from 'lucide-react';

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
    setIsQuizActive: (active: boolean) => void;
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
                attemptsLeft: res.data.attempts_left ?? 0
            });
            setShowResultModal(true);
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string, error?: string }>;
            if (axiosError.response?.status === 403) {
                alert(axiosError.response.data.error || "Limite de tentativas esgotado.");
                onComplete(-1);
            } else {
                alert("Erro ao processar sua avaliação.");
            }
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
                <div className="mb-12 text-center">
                    <div className="inline-flex p-3 bg-purple-100 text-purple-600 rounded-2xl mb-4">
                        <ClipboardCheck size={32} />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900">
                        Avaliação <span className="text-purple-600">Final</span>
                    </h2>
                    <p className="text-gray-500 text-sm mt-2 flex items-center justify-center gap-2">
                        <HelpCircle size={14} className="text-purple-400" />
                        Você precisa de no mínimo <strong>{quiz.min_score}%</strong> de acerto para aprovação.
                    </p>
                </div>
                <div className="space-y-12">
                    {quiz.questions.map((q, idx) => (
                        <div key={q.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-start gap-4 mb-6">
                                <span className="bg-gray-900 text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-lg shadow-gray-200">
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                                <h4 className="text-lg font-bold text-gray-800 leading-tight pt-1">
                                    {q.question_text}
                                </h4>
                            </div>
                            <div className="grid gap-3 ml-10">
                                {q.options.map((opt) => {
                                    const isSelected = answers[q.id] === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleSelect(q.id, opt.id)}
                                            className={`group relative p-5 rounded-[1.25rem] text-left text-sm font-bold transition-all border-2 flex items-center justify-between ${
                                                isSelected
                                                    ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-md shadow-purple-500/10'
                                                    : 'border-gray-100 bg-gray-50/50 text-gray-600 hover:border-purple-200 hover:bg-white'
                                            }`}
                                        >
                                            <span>{opt.option_text}</span>
                                            {isSelected && (
                                                <CheckCircle2 size={18} className="text-purple-600 animate-in zoom-in duration-300" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-16 pt-8 border-t">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-purple-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Send size={18} />
                                <span>Finalizar e Ver Resultado</span>
                            </>
                        )}
                    </button>
                    <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mt-6">
                        Verifique suas respostas antes de confirmar o envio.
                    </p>
                </div>
            </div>
            <QuizResultModal 
                isOpen={showResultModal}
                passed={resultData.passed}
                score={resultData.score}
                minScore={resultData.minScore}
                attemptsLeft={resultData.attemptsLeft}
                onRetry={handleRetry}
                onGenerate={() => {
                    setShowResultModal(false);
                    onComplete(resultData.score);
                    handleDownloadCertificate();
                }}
                onClose={() => {
                    setShowResultModal(false);
                    onComplete(resultData.passed ? resultData.score : -1);
                }}
            />
        </div>
    );
};

export default QuizPlayer;