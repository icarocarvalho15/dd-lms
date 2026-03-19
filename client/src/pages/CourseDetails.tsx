import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, FileText, Lock, Ban, PartyPopper, GraduationCap, ArrowRight, Trophy, CircleCheck } from 'lucide-react';
import { AxiosError } from 'axios';
import 'react-quill-new/dist/quill.snow.css';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import confetti from 'canvas-confetti';
import QuizPlayer, { type Quiz } from '../components/QuizPlayer';
import CourseRatingModal from '../components/CourseRatingModal';

interface Lesson {
    id: number;
    title: string;
    video_url: string;
    content?: string;
}

interface Module {
    id: number;
    title: string;
    lessons: Lesson[];
}

interface Course {
    id: number;
    title: string;
    modules: Module[];
    duration_minutes: number;
    quiz?: Quiz;
}

const CourseDetails = () => {
    const { slug } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [error, setError] = useState<string | null>(null);    
    const [loading, setLoading] = useState<boolean>(true);
    const [completedLessons, setCompletedLessons] = useState<number[]>([]);
    const [showFinishedOverlay, setShowFinishedOverlay] = useState(false);
    const [secondsRead, setSecondsRead] = useState(0);
    const requiredReadingTime = 30;
    const [canGenerate, setCanGenerate] = useState(false);
    const [isQuizActive, setIsQuizActive] = useState(false);
    const [quizPassed, setQuizPassed] = useState(false);
    const [noAttemptsLeft, setNoAttemptsLeft] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    
    const allCourseLessonIds = course?.modules?.flatMap(m => m.lessons.map(l => l.id)) || [];
    const totalLessonsCount = allCourseLessonIds.length;
    const lessonsCompletedInThisCourse = completedLessons.filter(id => allCourseLessonIds.includes(id));
    const progressPercentage = totalLessonsCount > 0 ? Math.round((lessonsCompletedInThisCourse.length / totalLessonsCount) * 100) : 0;

    useEffect(() => {
        let isMounted = true;
        const fetchCourse = async () => {
            try {
                if (isMounted) {
                    setLoading(true);
                    setError(null);
                }
                const res = await api.get(`/courses/${slug}`);
                if (isMounted) {
                    const courseData = res.data.course;
                    setCourse(courseData);
                    setCompletedLessons(res.data.completed_lessons || []);
                    setCanGenerate(res.data.can_generate_certificate);
                    setQuizPassed(res.data.quiz_passed);
                    setNoAttemptsLeft(res.data.no_attempts_left);
                    if (courseData.modules?.[0]?.lessons?.[0]) {
                        setCurrentLesson(courseData.modules[0].lessons[0]);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    const axiosError = err as AxiosError;
                    if (axiosError.response?.status !== 401) {
                        setError("Não foi possível carregar o curso.");
                    }
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchCourse();
        return () => { isMounted = false; };
    }, [slug]);

    const handleToggleComplete = useCallback(async (lessonId: number) => {
        try {
            await api.post(`/lessons/${lessonId}/complete`);
            setCompletedLessons(prev => {
                const isAlreadyCompleted = prev.includes(lessonId);
                const newCompleted = isAlreadyCompleted ? prev : [...prev, lessonId];
                if (!isAlreadyCompleted && newCompleted.length === allCourseLessonIds.length && allCourseLessonIds.length > 0) {
                    setTimeout(() => setShowRatingModal(true), 1500);
                }
                
                return newCompleted;
            });
            setShowFinishedOverlay(true);
            const res = await api.get(`/courses/${slug}`);
            setCanGenerate(res.data.can_generate_certificate);
        } catch (error) {
            console.error("Erro ao salvar progresso:", error);
        }
    }, [slug, allCourseLessonIds.length]);

    const handleNextLesson = useCallback(() => {
        if (!course || !currentLesson) return;
        const allLessons = course.modules.flatMap(m => m.lessons);
        const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
        const nextLesson = allLessons[currentIndex + 1];
        if (nextLesson) {
            setIsQuizActive(false);
            setCurrentLesson(nextLesson);
            setSecondsRead(0);
            setShowFinishedOverlay(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [course, currentLesson]);

    const handleDownloadCertificate = async () => {
        try {
            const res = await api.get(`/courses/${slug}/certificate-link`);
            let finalUrl = res.data.url;
            if (finalUrl.includes('/api/certificate/')) {
                finalUrl = finalUrl.replace('/api/certificate/', '/certificate/');
            }
            window.open(finalUrl, '_blank');
        } catch (error) {
            console.error("Erro ao preparar certificado:", error);
            alert("Erro ao preparar certificado.");
        }
    };

    const handleVideoEnd = () => {
        if (currentLesson && !completedLessons.includes(currentLesson.id)) {
            handleToggleComplete(currentLesson.id);
        }
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        const shouldStartTimer = 
            currentLesson && 
            !completedLessons.includes(currentLesson.id) && 
            !currentLesson.video_url;
        if (shouldStartTimer) {
            interval = setInterval(() => {
                setSecondsRead((prev) => {
                    if (prev + 1 >= requiredReadingTime) {
                        if (interval) clearInterval(interval);
                        handleToggleComplete(currentLesson.id);
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [currentLesson, completedLessons, handleToggleComplete]);

    useEffect(() => {
        const shouldCelebrate = 
            progressPercentage === 100 && 
            !loading && 
            course && 
            (!course.quiz || quizPassed);
        if (shouldCelebrate) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#2563eb', '#9333ea', '#10b981']
            });
        }
    }, [progressPercentage, loading, course, quizPassed]);

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
            <Navbar />
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md">
                <h3 className="text-2xl font-bold mb-4">{error}</h3>
                <Link to="/" className="text-blue-600 font-bold uppercase text-xs tracking-widest">Voltar ao início.</Link>
            </div>
        </div>
    );

    if (loading || !course || (!currentLesson && !isQuizActive)) return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className=" text-blue-600 font-bold animate-pulse">
            DravDev Academy...
          </span>
        </div>
      </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pt-6">
            <Navbar />
            <main className="pt-20 pb-10 max-w-[1600px] mx-auto px-4">
                <nav className="flex mb-6 text-sm text-gray-500 gap-2 items-center">
                    <Link to="/" className="hover:text-blue-600">Início</Link>
                    <span>/</span>
                    <span className="font-semibold text-gray-800">{course.title}</span>
                </nav>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        {isQuizActive && course?.quiz ? (
                            <QuizPlayer 
                                quiz={course.quiz} 
                                courseId={course.id} 
                                handleDownloadCertificate={handleDownloadCertificate} 
                                setIsQuizActive={setIsQuizActive}
                                onComplete={(score) => {
                                    if (score === -1) {
                                        setIsQuizActive(false);
                                        if (course.modules?.[0]?.lessons?.[0]) {
                                            setCurrentLesson(course.modules[0].lessons[0]);
                                        }
                                        return;
                                    }
                                    if (score >= (course.quiz?.min_score || 70)) {
                                        setQuizPassed(true);
                                        setCanGenerate(true);
                                        setIsQuizActive(false);
                                        setNoAttemptsLeft(false);
                                        if (course.modules?.[0]?.lessons?.[0]) {
                                            setCurrentLesson(course.modules[0].lessons[0]);
                                        }
                                    }
                                }}
                            />
                        ) : (
                            <>
                                {currentLesson ? (
                                    <>
                                        {currentLesson.video_url && (
                                            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mb-8">
                                                <video 
                                                    key={currentLesson.video_url}
                                                    src={currentLesson.video_url}
                                                    controls 
                                                    className="w-full h-full"
                                                    onEnded={handleVideoEnd}
                                                />
                                                {showFinishedOverlay && (
                                                    <div className="absolute inset-0 bg-blue-900/90 backdrop-blur-sm flex flex-col items-center justify-center text-white z-30 text-center p-4 animate-in fade-in">
                                                        <div className="text-6xl mb-4 animate-bounce"><PartyPopper size={80} /></div>
                                                        <h2 className="text-3xl font-bold mb-4 uppercase">Aula Concluída!</h2>
                                                        <button 
                                                            onClick={() => {
                                                                const videoElement = document.querySelector('video');
                                                                if (videoElement) {
                                                                    videoElement.currentTime = 0;
                                                                    videoElement.play();
                                                                }
                                                                setShowFinishedOverlay(false);
                                                            }}
                                                            className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold text-xs uppercase"
                                                        >
                                                            Assistir novamente
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
                                            {!currentLesson.video_url && !completedLessons.includes(currentLesson.id) && (
                                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 z-20">
                                                    <div 
                                                        className="h-full bg-blue-600 transition-all duration-1000 ease-linear"
                                                        style={{ width: `${(secondsRead / requiredReadingTime) * 100}%` }}
                                                    />
                                                </div>
                                            )}
                                            <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mb-6">
                                                {currentLesson.title}
                                            </h1>
                                            <div className="ql-snow mt-8">
                                                <div 
                                                    className="ql-editor prose prose-blue max-w-none text-gray-600 border-t pt-8 mt-4 leading-relaxed"
                                                    style={{ padding: '20px 0', minHeight: 'auto', lineHeight: '1.8' }}
                                                    dangerouslySetInnerHTML={{ 
                                                        __html: currentLesson.content || '<span class=" text-gray-400">Sem material de texto.</span>' 
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-12 pt-8 border-t flex justify-end items-center">
                                                {canGenerate ? (
                                                    <button onClick={handleDownloadCertificate}
                                                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl"
                                                    >
                                                        <GraduationCap size={20} className="mr-2" />
                                                        <span>Gerar Certificado</span>
                                                    </button>
                                                ) : (
                                                    progressPercentage === 100 && course.quiz ? (
                                                        !noAttemptsLeft ? (
                                                            <button onClick={() => setIsQuizActive(true)}
                                                                className="flex items-center justify-center gap-3 bg-purple-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl"
                                                            >
                                                                <FileText size={20} className="mr-2" />
                                                                <span>Realizar Avaliação Final</span>
                                                            </button>
                                                        ) : (
                                                            <div className="flex items-center justify-center gap-3 text-red-500 font-black uppercase text-[10px]">
                                                                <Ban size={20} className="text-red" /><span>Tentativas Esgotadas</span>
                                                            </div>
                                                        )
                                                    ) : (
                                                        completedLessons.includes(currentLesson?.id) && (
                                                            <button onClick={handleNextLesson}
                                                                className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest"
                                                            >
                                                                <span>Próxima Aula</span>
                                                                <ArrowRight size={20} className="ml-2" />
                                                            </button>
                                                        )
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-white p-20 rounded-[3rem] text-center shadow-sm border border-gray-100">
                                        <div className="text-6xl mb-6 flex justify-center"><Trophy size={80} className="text-yellow-500" /></div>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Você concluiu as aulas!</h2>
                                        <p className="text-gray-500 mb-8">Agora realize a avaliação final para liberar seu certificado.</p>
                                        <button 
                                            onClick={() => setIsQuizActive(true)}
                                            className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all"
                                        >
                                            Iniciar Avaliação Final
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="w-full lg:w-96">
                        <div className="sticky top-24 space-y-4">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="font-bold text-lg uppercase  tracking-tighter">Conteúdo do Treinamento</h3>
                                </div>
                                <div className="p-6 bg-gray-50/50">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progresso Geral</span>
                                        <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 shadow-inner">
                                        <div 
                                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-700 ease-out" 
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
                                    {course.modules.map((module) => (
                                        <div key={module.id}>
                                            <div className="p-4 bg-gray-50/80 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-y border-gray-100">
                                                {module.title}
                                            </div>
                                            {module.lessons.map((lesson) => {
                                                const allLessons = course.modules.flatMap(m => m.lessons);
                                                const lessonIndex = allLessons.findIndex(l => l.id === lesson.id);
                                                const isCompleted = completedLessons.includes(lesson.id);
                                                const previousCompleted = lessonIndex > 0 && completedLessons.includes(allLessons[lessonIndex - 1].id);
                                                const isLocked = !canGenerate && lessonIndex > 0 && !previousCompleted && !isCompleted;
                                                return (
                                                    <div 
                                                        key={lesson.id} 
                                                        className={`flex items-center justify-between p-4 transition-all border-l-4 ${
                                                            currentLesson?.id === lesson.id 
                                                            ? 'bg-blue-50/50 border-blue-600' 
                                                            : isLocked ? 'opacity-40 cursor-not-allowed' : 'border-transparent hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <button 
                                                            disabled={isLocked}
                                                            onClick={() => {
                                                                if (!isLocked) {
                                                                    setCurrentLesson(lesson);
                                                                    setSecondsRead(0);
                                                                    setShowFinishedOverlay(false);
                                                                }
                                                            }} 
                                                            className="flex items-center gap-4 text-left flex-1"
                                                        >
                                                            <span className="opacity-50 text-xs">
                                                                {isLocked ? (
                                                                    <Lock size={16} className="text-gray-400" />
                                                                    ) : lesson.video_url ? (
                                                                    <PlayCircle size={16} className="text-blue-500" />
                                                                    ) : (
                                                                    <FileText size={16} className="text-purple-500" />
                                                                )}
                                                            </span>
                                                            <span className={`text-sm ${currentLesson?.id === lesson.id ? 'text-blue-700 font-bold' : 'text-gray-600'}`}>
                                                                {lesson.title}
                                                            </span>
                                                        </button>
                                                        {isLocked ? (
                                                            <div className="h-4 w-4 flex items-center justify-center">
                                                                <Ban size={16} className="text-red-600" />
                                                            </div>
                                                        ) : (
                                                            <input 
                                                                type="checkbox" 
                                                                checked={completedLessons.includes(lesson.id)} 
                                                                readOnly
                                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 cursor-not-allowed transition-all"
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                    {course.quiz && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 px-4 pb-4">
                                            <button
                                                disabled={progressPercentage < 100 || quizPassed || noAttemptsLeft}
                                                onClick={() => {
                                                    setIsQuizActive(true);
                                                    setCurrentLesson(null);
                                                }}
                                                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border-2 ${
                                                    isQuizActive 
                                                        ? 'bg-purple-600 border-purple-600 text-white shadow-lg' 
                                                        : (progressPercentage < 100 || quizPassed || noAttemptsLeft)
                                                            ? 'opacity-40 cursor-not-allowed bg-gray-50 border-transparent'
                                                            : 'bg-white border-dashed border-purple-200 text-purple-700 hover:bg-purple-50'
                                                }`}
                                            >
                                                <span className="text-lg">
                                                    {quizPassed ? (
                                                        <CircleCheck size={20} className="text-green-500" />
                                                    ) : noAttemptsLeft ? (
                                                        <Ban size={20} className="text-red-500" />
                                                    ) : progressPercentage < 100 ? (
                                                        <Lock size={20} className="text-gray-400" />
                                                    ) : (
                                                        <GraduationCap size={20} className="text-purple-600" />
                                                    )}
                                                </span>
                                                <div className="text-left flex-1">
                                                    <span className="block text-[9px] font-black uppercase tracking-widest opacity-60">
                                                        {quizPassed ? 'Aprovado' : noAttemptsLeft ? 'Bloqueado' : 'Conclusão'}
                                                    </span>
                                                    <span className="font-bold text-sm">
                                                        {quizPassed ? 'Avaliação Concluída' : noAttemptsLeft ? 'Tentativas Esgotadas' : 'Avaliação Final'}
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {course && (
                <CourseRatingModal 
                    isOpen={showRatingModal}
                    courseId={course.id}
                    courseTitle={course.title}
                    onClose={() => setShowRatingModal(false)}
                />
            )}
        </div>
    );
};

export default CourseDetails;