import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { CheckCircle, EyeOff, GripVertical, Pencil, PlayCircle, Plus, RefreshCw, Rocket, Save, Settings, Target, Trash2, XCircle } from 'lucide-react';
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

interface QuizOption {
    option_text: string;
    is_correct: boolean;
}

interface QuizQuestion {
    question_text: string;
    options: QuizOption[];
}

interface QuizData {
    id: number;
    min_score: number;
    max_attempts: number;
    questions: QuizQuestion[];
}

interface CourseData {
    id: number;
    title: string;
    is_published: boolean;
    modules: Module[];
    image: string | null;
    duration_minutes: number;
    description: string;
    quiz?: QuizData;
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
    const [hasQuiz, setHasQuiz] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [quizMinScore, setQuizMinScore] = useState(70);
    const [quizMaxAttempts, setQuizMaxAttempts] = useState(3);

    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
        { question_text: '', options: [
            { option_text: '', is_correct: true },
            { option_text: '', is_correct: false }
        ]}
    ]);

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
            setHasQuiz(!!res.data.course.quiz);
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

    const openQuizModal = () => {
        if (course?.quiz) {
            setQuizMinScore(course.quiz.min_score);
            setQuizMaxAttempts(course.quiz.max_attempts || 3);
            const mappedQuestions: QuizQuestion[] = course.quiz.questions.map((q) => ({
                question_text: q.question_text,
                options: q.options.map((o) => ({
                    option_text: o.option_text,
                    is_correct: !!o.is_correct
                }))
            }));
            setQuizQuestions(mappedQuestions);
        } else {
            setQuizMinScore(70);
            setQuizMaxAttempts(3);
            setQuizQuestions([{ 
                question_text: '', 
                options: [{ option_text: '', is_correct: true }, { option_text: '', is_correct: false }] 
            }]);
        }
        setShowQuizModal(true);
    };

    const addQuestion = () => {
        setQuizQuestions([...quizQuestions, { 
            question_text: '', 
            options: [{ option_text: '', is_correct: true }, { option_text: '', is_correct: false }] 
        }]);
    };

    const addOption = (qIndex: number) => {
        const newQuestions = [...quizQuestions];
        newQuestions[qIndex].options.push({ option_text: '', is_correct: false });
        setQuizQuestions(newQuestions);
    };

    const setCorrectOption = (qIndex: number, oIndex: number) => {
        const newQuestions = [...quizQuestions];
        newQuestions[qIndex].options = newQuestions[qIndex].options.map((opt, i) => ({
            ...opt,
            is_correct: i === oIndex
        }));
        setQuizQuestions(newQuestions);
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
                            className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                            <Pencil size={14} /> Editar Dados
                        </button>
                        <button 
                            onClick={handleTogglePublish}
                            className={`px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2
                            ${course?.is_published 
                                ? 'bg-red-50 text-red-500 border border-red-100 hover:bg-red-100' 
                                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105 shadow-purple-500/20'}`}
                        >
                            {course?.is_published ? (
                                <><EyeOff size={14} /> Desativar</>
                            ) : (
                                <><Rocket size={14} /> Publicar</>
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
                        className="flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
                    >
                        <Plus size={16} /> Módulo
                    </button>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${hasQuiz ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                            {hasQuiz ? <CheckCircle size={24} /> : <XCircle size={24} />}
                        </div>
                        <div>
                            <h4 className="font-black uppercase text-xs tracking-widest text-gray-700">Avaliação de Certificação</h4>
                            <p className="text-sm text-gray-500">
                                {hasQuiz ? "Configurada e ativa" : "Nenhuma prova criada"}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={openQuizModal}
                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-purple-600 transition-all"
                    >
                        <Settings size={14} /> {hasQuiz ? "Editar Avaliação" : "Configurar Avaliação"}
                    </button>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="space-y-6">
                        {course?.modules.map((module) => (
                            <div key={module.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                                <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-black uppercase text-gray-700 flex items-center gap-3">
                                        <div className="bg-purple-100 p-2 rounded-lg"><Plus size={14} className="text-purple-600" /></div>
                                        {module.title}
                                        <button onClick={() => handleRenameModule(module.id, module.title)} className="text-gray-400 hover:text-purple-600 transition-colors">
                                            <Pencil size={12} />
                                        </button>
                                    </h3>
                                    <div className="flex gap-3">
                                        <button onClick={() => handleOpenModal(module.id)} className="flex items-center gap-1 text-[10px] font-black uppercase text-purple-600 hover:text-white hover:bg-purple-600 border border-purple-600 px-4 py-2 rounded-xl transition-all">
                                            <Plus size={12} /> Aula
                                        </button>
                                        <button onClick={() => handleDeleteModule(module.id)} className="flex items-center gap-1 text-[10px] font-black uppercase text-red-500 hover:text-white hover:bg-red-500 border border-red-200 px-4 py-2 rounded-xl transition-all">
                                            <Trash2 size={12} /> Excluir
                                        </button>
                                    </div>
                                </div>
                                <Droppable droppableId={module.id.toString()}>
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="p-4 space-y-2">
                                            {module.lessons.map((lesson, index) => (
                                                <Draggable key={lesson.id} draggableId={lesson.id.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div 
                                                            ref={provided.innerRef} 
                                                            {...provided.draggableProps} 
                                                            {...provided.dragHandleProps}
                                                            className={`flex items-center justify-between p-4 bg-white rounded-xl border transition-all ${
                                                                snapshot.isDragging ? 'shadow-2xl border-purple-400 z-50 scale-[1.02]' : 'border-gray-50 hover:border-purple-100'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <GripVertical size={16} className="text-gray-300" />
                                                                <PlayCircle size={16} className="text-blue-500" />
                                                                <span className="text-sm font-bold text-gray-600">{lesson.title}</span>
                                                            </div>
                                                            <div className="flex gap-4">
                                                                <button onClick={() => handleOpenEditModal(module, lesson)} className="text-gray-400 hover:text-blue-600 transition-colors">
                                                                    <Pencil size={14} />
                                                                </button>
                                                                <button onClick={() => handleDeleteLesson(lesson.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
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
                        <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                            <Settings className="text-blue-600" /> Editar Curso
                        </h2>
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
                                {editImage && (
                                    <div className="mt-4 relative h-20 w-32 rounded-lg overflow-hidden border-2 border-blue-500">
                                        <img 
                                            src={URL.createObjectURL(editImage)} 
                                            className="w-full h-full object-cover" 
                                            alt="Preview" 
                                        />
                                        <button 
                                            onClick={() => setEditImage(null)}
                                            className="absolute top-0 right-0 bg-red-500 text-white text-[8px] p-1 uppercase font-black"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3 mt-10">
                            <button onClick={handleUpdateCourse} disabled={courseUpdateLoading} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase">
                                <Save size={16} /> {courseUpdateLoading ? 'Salvando...' : 'Atualizar Curso'}
                            </button>
                            <button onClick={() => setShowCourseModal(false)} className="px-6 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black text-[10px] uppercase">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                            <PlayCircle className="text-purple-600" /> {isEditing ? 'Editar' : 'Nova'} Aula
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
                                className="flex items-center gap-2 px-6 bg-purple-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
                            >
                                <Save size={16} /> {lessonLoading ? 'Salvando...' : 'Salvar Aula'}
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
            {showQuizModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl rounded-[2.5rem] p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                                <Target className="text-purple-600" /> Avaliação Final
                            </h2>
                            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl">
                                <RefreshCw size={14} className="text-gray-400" />
                                <span className="text-[10px] font-black uppercase text-gray-400">Tentativas</span>
                                <input 
                                    type="number" 
                                    className="w-12 bg-transparent font-bold text-purple-600 outline-none"
                                    value={quizMaxAttempts}
                                    onChange={(e) => setQuizMaxAttempts(parseInt(e.target.value))}
                                />
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl">
                                <Target size={14} className="text-gray-400" />
                                <span className="text-[10px] font-black uppercase text-gray-400">Nota Mínima (%)</span>
                                <input 
                                    type="number" 
                                    className="w-12 bg-transparent font-bold text-purple-600 outline-none"
                                    value={quizMinScore}
                                    onChange={(e) => setQuizMinScore(parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="space-y-8">
                            {quizQuestions.map((q, qIndex) => (
                                <div key={qIndex} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 relative">
                                    <button 
                                        onClick={() => setQuizQuestions(quizQuestions.filter((_, i) => i !== qIndex))}
                                        className="absolute top-6 right-6 text-red-400 hover:text-red-600 font-bold text-xs uppercase"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <div className="mb-4">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2">Pergunta {qIndex + 1}</label>
                                        <input 
                                            type="text"
                                            className="w-full p-4 bg-white rounded-2xl border-none shadow-sm outline-none focus:ring-2 focus:ring-purple-500/20"
                                            placeholder="Ex: Qual o comando para criar uma migration no Laravel?"
                                            value={q.question_text}
                                            onChange={(e) => {
                                                const newQuestions = [...quizQuestions];
                                                newQuestions[qIndex].question_text = e.target.value;
                                                setQuizQuestions(newQuestions);
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2">Alternativas (Marque a correta)</label>
                                        {q.options.map((opt, oIndex) => (
                                            <div key={oIndex} className="flex items-center gap-3">
                                                <input 
                                                    type="radio"
                                                    name={`correct-${qIndex}`}
                                                    checked={opt.is_correct}
                                                    onChange={() => setCorrectOption(qIndex, oIndex)}
                                                    className="w-5 h-5 accent-purple-600"
                                                />
                                                <input 
                                                    type="text"
                                                    className={`flex-1 p-3 rounded-xl border-none text-sm transition-all ${opt.is_correct ? 'bg-purple-50 ring-1 ring-purple-200' : 'bg-white'}`}
                                                    placeholder={`Alternativa ${oIndex + 1}`}
                                                    value={opt.option_text}
                                                    onChange={(e) => {
                                                        const newQuestions = [...quizQuestions];
                                                        newQuestions[qIndex].options[oIndex].option_text = e.target.value;
                                                        setQuizQuestions(newQuestions);
                                                    }}
                                                />
                                                {q.options.length > 2 && (
                                                    <button onClick={() => {
                                                        const newQuestions = [...quizQuestions];
                                                        newQuestions[qIndex].options.splice(oIndex, 1);
                                                        setQuizQuestions(newQuestions);
                                                    }} className="text-gray-300 hover:text-red-500">✕</button>
                                                )}
                                            </div>
                                        ))}
                                        <button 
                                            onClick={() => addOption(qIndex)}
                                            className="text-[10px] font-black uppercase text-purple-600 mt-2 ml-8 hover:underline"
                                        >
                                            + Adicionar Alternativa
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 flex gap-4">
                            <button 
                                onClick={addQuestion}
                                className="flex-1 border-2 border-dashed border-gray-200 text-gray-400 py-4 rounded-3xl font-black uppercase text-[10px] hover:border-purple-300 hover:text-purple-400 transition-all"
                            >
                                + Adicionar Pergunta
                            </button>
                        </div>
                        <div className="mt-10 pt-8 border-t flex gap-3">
                            <button 
                                onClick={async () => {
                                    try {
                                        await api.post(`/courses/${course?.id}/quiz`, {
                                            min_score: quizMinScore,
                                            max_attempts: quizMaxAttempts,
                                            questions: quizQuestions
                                        });
                                        setShowQuizModal(false);
                                        fetchCourseData();
                                    } catch (error) {
                                        console.error("Erro ao buscar cursos:", error);
                                        alert("Erro ao salvar quiz.");
                                    }
                                }}
                                className="flex items-center gap-2 px-6 bg-purple-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
                            >
                                <Save size={16} /> Salvar Avaliação
                            </button>
                            <button 
                                onClick={() => setShowQuizModal(false)}
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