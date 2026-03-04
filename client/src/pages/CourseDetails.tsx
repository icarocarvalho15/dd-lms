import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
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

    useEffect(() => {
        setLoading(true);
        setError(null);
        axios.get(`http://127.0.0.1:8000/api/courses/${slug}`)
            .then(res => {
                setCourse(res.data);
                if (res.data.modules?.[0]?.lessons?.[0]) {
                    setCurrentLesson(res.data.modules[0].lessons[0]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro na requisição:", err);
                setLoading(false);
                if (err.response?.status === 404) {
                    setError("Ops! Esse treinamento não foi encontrado ou ainda não está disponível.");
                } else {
                    setError("Houve um problema de conexão com o servidor. Tente novamente mais tarde.");
                }
            });
    }, [slug]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <Navbar />
                <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center max-w-md">
                    <div className="text-6xl mb-4"></div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Algo deu errado</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link to="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                        Voltar para a Vitrine
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Navbar />
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Preparando sua aula...</p>
                </div>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-20 pb-10 max-w-[1600px] mx-auto px-4">
                <nav className="flex mb-6 text-sm text-gray-500 gap-2 items-center">
                    <Link to="/" className="hover:text-blue-600">Início</Link>
                    <span>/</span>
                    <span className="font-semibold text-gray-800">{course?.title}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                            {currentLesson ? (
                                <video 
                                    key={currentLesson.video_url}
                                    controls 
                                    className="w-full h-full"
                                    src={currentLesson.video_url}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white">
                                    Selecione uma aula
                                </div>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold mt-6 text-gray-900">
                            {currentLesson?.title || "Bem-vindo ao curso"}
                        </h1>
                    </div>

                    <div className="w-full lg:w-96 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-800">Conteúdo do Curso</h3>
                        </div>
                        <div className="max-h-[600px] overflow-y-auto">
                            {course?.modules.map((module) => (
                                <div key={module.id} className="border-b border-gray-50 last:border-0">
                                    <div className="p-4 bg-gray-50/30 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        {module.title}
                                    </div>
                                    {module.lessons.map((lesson) => (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setCurrentLesson(lesson)}
                                            className={`w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-blue-50 ${
                                                currentLesson?.id === lesson.id ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-700 font-semibold' : 'text-gray-600'
                                            }`}
                                        >
                                            <div className="min-w-[24px]">
                                                {currentLesson?.id === lesson.id ? '▶️' : '📁'}
                                            </div>
                                            <span className="text-sm">{lesson.title}</span>
                                        </button>
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