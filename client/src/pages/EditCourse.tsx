import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

interface Lesson {
    id: number;
    title: string;
}

interface Module {
    id: number;
    title: string;
    lessons: Lesson[];
}

interface CourseData {
    id: number;
    title: string;
    is_published: boolean;
    modules: Module[];
}

const EditCourse = () => {
    const { slug } = useParams<{ slug: string }>();
    const [course, setCourse] = useState<CourseData | null>(null);
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
    const [lessonTitle, setLessonTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [lessonLoading, setLessonLoading] = useState(false);

    const fetchCourseData = useCallback(async () => {
        try {
            const res = await api.get(`/courses/${slug}`);
            setCourse(res.data.course); 
        } catch {
            alert("Erro ao carregar dados do curso.");
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchCourseData();
    }, [fetchCourseData]);

    const handleAddModule = async () => {
        if (!newModuleTitle || !course) return;
        try {
            await api.post(`/courses/${course.id}/modules`, { title: newModuleTitle });
            setNewModuleTitle('');
            fetchCourseData();
        } catch {
            alert("Erro ao adicionar módulo.");
        }
    };

    const handleOpenModal = (moduleId: number) => {
        setSelectedModuleId(moduleId);
        setShowModal(true);
    };

    const handleAddLesson = async () => {
        if (!lessonTitle || !selectedModuleId) return;
        setLessonLoading(true);

        try {
            await api.post(`/modules/${selectedModuleId}/lessons`, { 
                title: lessonTitle, 
                video_url: videoUrl 
            });
            setLessonTitle('');
            setVideoUrl('');
            setShowModal(false);
            fetchCourseData();
        } catch {
            alert("Erro ao adicionar aula.");
        } finally {
            setLessonLoading(false);
        }
    };

    const handleTogglePublish = async () => {
        if (!course) return;
        try {
            await api.patch(`/courses/${course.id}/toggle-publish`);
            fetchCourseData();
        } catch {
            alert("Erro ao alterar status de publicação.");
        }
    };

    if (loading) return <div className="pt-28 text-center">Carregando dados do Curso...</div>;
    
    if (!course) {
        return (
            <div className="pt-28 text-center">
                <Navbar />
                <p>Curso não encontrado ou você não tem permissão.</p>
                <Link to="/instrutor/meus-cursos" className="text-blue-500 underline">Voltar para meus cursos</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-28 pb-12 max-w-[1000px] mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                            Editando: <span className="text-purple-600">{course.title}</span>
                        </h1>
                        <div className="mt-2 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full animate-pulse ${course.is_published ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Status: {course.is_published ? 'Publicado' : 'Rascunho'}
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={handleTogglePublish}
                        className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95
                        ${course.is_published 
                            ? 'bg-white text-red-500 border border-red-100 hover:bg-red-50 shadow-red-500/5' 
                            : 'bg-green-600 text-white hover:bg-green-700 shadow-green-500/20'}`}
                    >
                        {course.is_published ? '⛔ Retirar da Página Inicial' : '🚀 Publicar Agora'}
                    </button>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex gap-4">
                    <input 
                        type="text" 
                        placeholder="Nome do novo módulo (ex: Começando do Zero)"
                        className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                    />
                    <button 
                        onClick={handleAddModule}
                        className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
                    >
                        + Módulo
                    </button>
                </div>
                <div className="space-y-6">
                    {course.modules.map((module) => (
                        <div key={module.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                            <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-black italic uppercase text-gray-700">📦 {module.title}</h3>
                                <button 
                                    onClick={() => handleOpenModal(module.id)}
                                    className="text-[10px] font-black uppercase text-purple-600 hover:text-white hover:bg-purple-600 border border-purple-600 px-3 py-1 rounded-lg transition-all"
                                >
                                    + Nova Aula
                                </button>
                            </div>
                            <div className="p-4 space-y-2">
                                {module.lessons.map((lesson) => (
                                    <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-transparent hover:border-purple-200 transition-all">
                                        <span className="text-sm font-bold text-gray-600">🎥 {lesson.title}</span>
                                        <div className="flex gap-2">
                                            <button className="text-xs grayscale hover:grayscale-0">✏️</button>
                                            <button className="text-xs grayscale hover:grayscale-0">🗑️</button>
                                        </div>
                                    </div>
                                ))}
                                {module.lessons.length === 0 && (
                                    <p className="text-xs text-gray-400 italic text-center py-4">Nenhuma aula neste módulo.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-gray-900">
                            Nova <span className="text-purple-600">Aula</span>
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-2">Título da Aula</label>
                                <input 
                                    type="text" 
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                    placeholder="Ex: Introdução ao Projeto"
                                    value={lessonTitle}
                                    onChange={(e) => setLessonTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-2">URL do Vídeo (YouTube/Vimeo)</label>
                                <input 
                                    type="text" 
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                    placeholder="https://youtube.com/..."
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-10">
                            <button 
                                onClick={handleAddLesson}
                                disabled={lessonLoading}
                                className="flex-1 bg-purple-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
                            >
                                {lessonLoading ? 'Salvando...' : 'Adicionar Aula'}
                            </button>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="px-6 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditCourse;