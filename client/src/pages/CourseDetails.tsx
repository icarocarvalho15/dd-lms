import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import api from '../api/axios';
import Navbar from '../components/Navbar';

interface Lesson {
    id: number;
    title: string;
    video_url: string;
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

    const handleToggleComplete = useCallback(async (lessonId: number) => {
        try {
            await api.post(`/lessons/${lessonId}/complete`);
            setCompletedLessons(prev => prev.includes(lessonId) ? prev : [...prev, lessonId]);
        } catch {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    }, []);

    const handleVideoEnd = () => {
        setShowFinishedOverlay(true);
        if (currentLesson && !completedLessons.includes(currentLesson.id)) {
            handleToggleComplete(currentLesson.id);
        }
    };

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
                    if (courseData.modules?.[0]?.lessons?.[0]) {
                        setCurrentLesson(courseData.modules[0].lessons[0]);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    const axiosError = err as AxiosError;
                    if (axiosError.response?.status !== 401) {
                         setError("Erro ao carregar curso.");
                    }
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchCourse();
        return () => { isMounted = false; };
    }, [slug]);

    useEffect(() => {
        if (!currentLesson || currentLesson.video_url || completedLessons.includes(currentLesson.id)) {
            return;
        }
        const timer = setInterval(() => {
            if (document.hasFocus()) {
                setSecondsRead(prev => {
                    const nextValue = prev + 1;
                    if (nextValue >= requiredReadingTime) {
                        handleToggleComplete(currentLesson.id);
                        setShowFinishedOverlay(true);
                        clearInterval(timer);
                    }
                    return nextValue;
                });
            }
        }, 1000);
        return () => {
            clearInterval(timer);
            setSecondsRead(0);
        };
    }, [currentLesson, completedLessons, handleToggleComplete]);

    const totalLessons = course?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
    const progressPercentage = totalLessons > 0 
        ? Math.round((completedLessons.length / totalLessons) * 100) 
        : 0;

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center italic">
            <Navbar />
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md">
                <h2 className="text-2xl font-bold mb-4">{error}</h2>
                <Link to="/" className="text-blue-600 underline font-bold uppercase text-xs tracking-widest">Voltar ao início</Link>
            </div>
        </div>
    );

    if (loading || !course) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center italic font-bold text-blue-600">
            <Navbar />
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                            {currentLesson?.video_url ? (
                                <>
                                    <video 
                                        key={currentLesson.video_url}
                                        controls 
                                        className="w-full h-full"
                                        src={currentLesson.video_url}
                                        onPlay={() => setShowFinishedOverlay(false)}
                                        onEnded={handleVideoEnd}
                                    />
                                    {showFinishedOverlay && (
                                        <div className="absolute inset-0 bg-blue-900/90 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10 animate-in fade-in duration-500 text-center p-4">
                                            <div className="text-6xl mb-4 animate-bounce">🎉</div>
                                            <h2 className="text-3xl font-bold mb-2 uppercase italic tracking-tighter">Aula Concluída!</h2>
                                            <p className="text-blue-200 mb-6 font-medium">Seu progresso foi registrado com sucesso.</p>
                                            <button 
                                                onClick={() => setShowFinishedOverlay(false)}
                                                className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all uppercase text-xs"
                                            >
                                                Continuar assistindo
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-white p-10 text-center bg-gray-900">
                                    <div className="text-5xl mb-4 animate-pulse">📖</div>
                                    <h2 className="text-2xl font-bold mb-4 italic uppercase tracking-tighter">{currentLesson?.title}</h2>
                                    <p className="text-gray-400 max-w-md">
                                        Módulo de leitura. Mantenha o foco nesta aba por {requiredReadingTime}s para concluir.
                                    </p>
                                    {currentLesson && !completedLessons.includes(currentLesson.id) && (
                                        <div className="mt-8 flex flex-col items-center gap-3">
                                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Validando: {requiredReadingTime - secondsRead}s</span>
                                            <div className="w-64 bg-gray-800 h-1 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-blue-500 h-full transition-all duration-1000 ease-linear"
                                                    style={{ width: `${(secondsRead / requiredReadingTime) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold mt-6 italic tracking-tight">{currentLesson?.title}</h1>
                    </div>
                    <div className="w-full lg:w-96 bg-white rounded-2xl shadow-sm border border-gray-200 h-fit overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-bold text-lg uppercase italic tracking-tighter">Conteúdo do Treinamento</h3>
                        </div>
                        <div className="p-6 bg-gray-50/50">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progresso Geral</span>
                                <span className="text-sm font-bold text-blue-600 italic">{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 shadow-inner">
                                <div 
                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-700 ease-out" 
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                            {course?.modules?.map((module) => (
                                <div key={module.id}>
                                    <div className="p-4 bg-gray-50/80 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-y border-gray-100">
                                        {module.title}
                                    </div>
                                    {module?.lessons?.map((lesson) => (
                                        <div 
                                            key={lesson.id} 
                                            className={`flex items-center justify-between p-4 transition-all border-l-4 ${
                                                currentLesson?.id === lesson.id 
                                                ? 'bg-blue-50/50 border-blue-600' 
                                                : 'border-transparent hover:bg-gray-50'
                                            }`}
                                        >
                                            <button 
                                                onClick={() => {
                                                    setCurrentLesson(lesson);
                                                    setSecondsRead(0);
                                                    setShowFinishedOverlay(false);
                                                }} 
                                                className="flex items-center gap-4 text-left flex-1"
                                            >
                                                <span className="opacity-50 text-xs">{lesson.video_url ? '🎥' : '📄'}</span>
                                                <span className={`text-sm ${currentLesson?.id === lesson.id ? 'text-blue-700 font-bold italic' : 'text-gray-600'}`}>
                                                    {lesson.title}
                                                </span>
                                            </button>
                                            <input 
                                                type="checkbox" 
                                                checked={completedLessons.includes(lesson.id)} 
                                                readOnly
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 cursor-not-allowed transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CourseDetails;