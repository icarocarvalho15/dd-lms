import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import api from '../api/axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Navbar from '../components/Navbar';

interface Lesson {
    id: number;
    title: string;
    video_url?: string;
    content?: string;
}

interface Module {
    id: number;
    title: string;
    lessons: Lesson[];
}

interface CourseData {
    image: string | null;
    id: number;
    title: string;
    is_published: boolean;
    modules: Module[];
    duration_minutes: number;
    description: string;
}

const EditCourse = () => {
    const { slug } = useParams<{ slug: string }>();
    const [course, setCourse] = useState<CourseData | null>(null);
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
    const [lessonTitle, setLessonTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [lessonLoading, setLessonLoading] = useState(false);
    const [lessonContent, setLessonContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editDuration, setEditDuration] = useState('');
    const [editImage, setEditImage] = useState<File | null>(null);
    const [courseUpdateLoading, setCourseUpdateLoading] = useState(false);

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            [{ 'font': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const fetchCourseData = useCallback(async () => {
        try {
            const res = await api.get(`/courses/${slug}`);
            setCourse(res.data.course); 
        } catch {
            alert("Erro ao carregar dados do curso.");
            setError("Não foi possível editar o curso. Por favor, tente novamente mais tarde.");
        } finally {
            setLoading(false);
            setError(null);
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
        setIsEditing(false);
        setLessonTitle('');
        setVideoUrl('');
        setLessonContent('');
        setShowModal(true);
    };

    const handleOpenEditModal = (module: Module, lesson: Lesson) => {
        setSelectedModuleId(module.id);
        setSelectedLessonId(lesson.id);
        setLessonTitle(lesson.title);
        setVideoUrl(lesson.video_url || '');
        setLessonContent(lesson.content || '');
        setIsEditing(true);
        setShowModal(true);
    };

    const handleSaveLesson = async () => {
        if (!lessonTitle || !selectedModuleId) return;
        setLessonLoading(true);
        try {
            if (isEditing && selectedLessonId) {
                await api.put(`/lessons/${selectedLessonId}`, { 
                    title: lessonTitle, 
                    video_url: videoUrl,
                    content: lessonContent
                });
            } else {
                await api.post(`/modules/${selectedModuleId}/lessons`, { 
                    title: lessonTitle, 
                    video_url: videoUrl,
                    content: lessonContent
                });
            }
            setShowModal(false);
            fetchCourseData();
        } catch (error) {
            console.error("Erro ao salvar aula:", error);
            alert("Erro ao salvar aula.");
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

    const handleDeleteModule = async (moduleId: number) => {
        if (!window.confirm("Tem certeza que deseja excluir este módulo e todas as suas aulas?")) return;
        try {
            await api.delete(`/modules/${moduleId}`);
            fetchCourseData();
        } catch {
            alert("Erro ao excluir módulo.");
        }
    };

    const handleDeleteLesson = async (lessonId: number) => {
        if (!window.confirm("Deseja excluir esta aula?")) return;
        try {
            await api.delete(`/lessons/${lessonId}`);
            fetchCourseData();
        } catch {
            alert("Erro ao excluir aula.");
        }
    };

    const openCourseEdit = () => {
        setEditTitle(course?.title || '');
        setEditDescription(course?.description || '');
        setEditDuration(course?.duration_minutes?.toString() || '');
        setShowCourseModal(true);
    };

    const handleUpdateCourse = async () => {
        if (!course) return;
        setCourseUpdateLoading(true);
        const formData = new FormData();
        formData.append('title', editTitle);
        formData.append('description', editDescription);
        formData.append('duration_minutes', editDuration);
        if (editImage) {
            formData.append('image', editImage);
        }
        try {
            await api.post(`/courses/${course.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowCourseModal(false);
            setEditImage(null);
            fetchCourseData();
        } catch (error) {
            console.error("Erro ao atualizar curso:", error);
            alert("Erro ao atualizar dados do curso.");
        } finally {
            setCourseUpdateLoading(false);
        }
    };

    const handleRenameModule = async (moduleId: number, oldTitle: string) => {
        const newTitle = prompt("Novo nome do módulo:", oldTitle);
        if (!newTitle || newTitle === oldTitle) return;
        try {
            await api.put(`/modules/${moduleId}`, { title: newTitle });
            fetchCourseData();
        } catch { alert("Erro ao renomear módulo."); }
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;
        const sourceModuleId = parseInt(source.droppableId);
        const destModuleId = parseInt(destination.droppableId);
        const updatedCourse = { ...course! };
        const sourceModuleIndex = updatedCourse.modules.findIndex(m => m.id === sourceModuleId);
        const destModuleIndex = updatedCourse.modules.findIndex(m => m.id === destModuleId);
        const sourceModule = updatedCourse.modules[sourceModuleIndex];
        const destModule = updatedCourse.modules[destModuleIndex];
        const sourceLessons = Array.from(sourceModule.lessons);
        const [movedLesson] = sourceLessons.splice(source.index, 1);
        if (sourceModuleId === destModuleId) {
            sourceLessons.splice(destination.index, 0, movedLesson);
            updatedCourse.modules[sourceModuleIndex].lessons = sourceLessons;
        } else {
            const destLessons = Array.from(destModule.lessons);
            destLessons.splice(destination.index, 0, movedLesson);
            updatedCourse.modules[sourceModuleIndex].lessons = sourceLessons;
            updatedCourse.modules[destModuleIndex].lessons = destLessons;
        }
        setCourse(updatedCourse);
        try {
            await api.post(`/modules/${destModuleId}/reorder-lessons`, {
                lessons: updatedCourse.modules.find(m => m.id === destModuleId)?.lessons.map(l => l.id)
            });
            if (sourceModuleId !== destModuleId) {
                await api.post(`/modules/${sourceModuleId}/reorder-lessons`, {
                    lessons: updatedCourse.modules.find(m => m.id === sourceModuleId)?.lessons.map(l => l.id)
                });
            }
        } catch (error) {
            console.error("Erro ao salvar ordem:", error);
            fetchCourseData();
        }
    };

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
            <Navbar />
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md">
                <h3 className="text-2xl font-bold mb-4">{error}</h3>
                <Link to="/instrutor/meus-cursos" className="text-blue-600 font-bold uppercase text-xs tracking-widest">Voltar aos Cursos.</Link>
            </div>
        </div>
    );

    if (loading) return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="text-blue-600 font-bold animate-pulse">
            DravDev Academy...
          </span>
        </div>
      </div>
    );
    
    if (!course) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
            <Navbar />
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md">
                <h3 className="text-2xl font-bold mb-4">{error}</h3>
                <Link to="/instrutor/meus-cursos" className="text-blue-600 font-bold uppercase text-xs tracking-widest">Voltar aos Cursos.</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-28 pb-12 max-w-[1000px] mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter">
                            <span className="text-purple-600">{course.title}</span>
                        </h3>
                        <div className="mt-2 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full animate-pulse ${course.is_published ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Status: {course.is_published ? 'Publicado' : 'Rascunho'}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={openCourseEdit}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                            ✏️ Editar Dados do Curso
                        </button>
                        <button 
                            onClick={handleTogglePublish}
                            className={`px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2
                            ${course.is_published 
                                ? 'bg-red-50 text-red-500 border border-red-100 hover:bg-red-100' 
                                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105 shadow-purple-500/20'}`}
                        >
                            {course.is_published ? (
                                <><span>⛔</span> Retirar Curso do Ar</>
                            ) : (
                                <><span>🚀</span> Publicar</>
                            )}
                        </button>
                    </div>
                </div>
                {course.image && (
                    <div className="mb-8 rounded-[2rem] overflow-hidden h-48 border border-gray-100 shadow-inner">
                        <img 
                            src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/storage/${course.image}`} 
                            className="w-full h-full object-cover" 
                            alt="Capa" 
                        />
                    </div>
                )}
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
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="space-y-6">
                        {course.modules.map((module) => (
                            <div key={module.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                                <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-black uppercase text-gray-700 flex items-center gap-2">📦 {module.title}
                                        <button onClick={() => handleRenameModule(module.id, module.title)} className="text-xs opacity-50 hover:opacity-100">✏️</button>
                                    </h3>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleOpenModal(module.id)}
                                            className="text-[10px] font-black uppercase text-purple-600 hover:text-white hover:bg-purple-600 border border-purple-600 px-4 py-2 rounded-xl transition-all"
                                        >
                                            + Nova Aula
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteModule(module.id)}
                                            className="text-[10px] font-black uppercase text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 px-4 py-2 rounded-xl transition-all duration-200"
                                        >
                                            Excluir Módulo
                                        </button>
                                    </div>
                                </div>
                                <Droppable droppableId={module.id.toString()}>
                                    {(provided) => (
                                        <div 
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="p-4 space-y-2"
                                        >
                                            {module.lessons.map((lesson, index) => (
                                                <Draggable key={lesson.id} draggableId={lesson.id.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div 
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`flex items-center justify-between p-4 bg-white rounded-xl border transition-all ${
                                                                snapshot.isDragging ? 'shadow-2xl border-purple-400 z-50 scale-[1.02]' : 'border-gray-100 hover:border-purple-200'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-gray-300">☰</span>
                                                                <span className="text-sm font-bold text-gray-600">🎥 {lesson.title}</span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button onClick={() => handleOpenEditModal(module, lesson)} className="text-xs grayscale hover:grayscale-0">✏️</button>
                                                                <button onClick={() => handleDeleteLesson(lesson.id)} className="text-xs grayscale hover:grayscale-0">🗑️</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            {module.lessons.length === 0 && (
                                                <p className="text-xs text-gray-400 text-center py-4">Nenhuma aula neste módulo.</p>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </main>
            {showCourseModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h2 className="text-2xl font-black  uppercase mb-6">Editar <span className="text-blue-600">Curso</span></h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-2">Título</label>
                                <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-2">Duração (Minutos)</label>
                                <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl" value={editDuration} onChange={(e) => setEditDuration(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-2">Descrição</label>
                                <textarea rows={4} className="w-full p-4 bg-gray-50 rounded-2xl resize-none" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-2">Trocar Capa</label>
                                <input type="file" className="w-full p-4 bg-gray-50 rounded-2xl text-xs" onChange={(e) => setEditImage(e.target.files?.[0] || null)} />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-10">
                            <button onClick={handleUpdateCourse} disabled={courseUpdateLoading} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase">
                                {courseUpdateLoading ? 'Salvando...' : 'Atualizar Curso'}
                            </button>
                            <button onClick={() => setShowCourseModal(false)} className="px-6 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black text-[10px] uppercase">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 text-gray-900">
                            {isEditing ? 'Editar' : 'Nova'} <span className="text-purple-600">Aula</span>
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
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-2">Conteúdo da Aula (Texto Rico)</label>
                                <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                                    <ReactQuill 
                                        theme="snow"
                                        value={lessonContent}
                                        onChange={setLessonContent}
                                        modules={quillModules}
                                        placeholder="Escreva e formate o conteúdo da aula aqui..."
                                        className="bg-white min-h-[200px]"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-10">
                            <button 
                                onClick={handleSaveLesson}
                                disabled={lessonLoading}
                                className="px-6 bg-purple-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
                            >
                                {lessonLoading ? 'Salvando...' : 'Salvar Aula'}
                            </button>
                            <button 
                                onClick={() => {
                                    setShowModal(false);
                                    setIsEditing(false);
                                    setLessonTitle('');
                                    setVideoUrl('');
                                    setLessonContent('');
                                }}
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