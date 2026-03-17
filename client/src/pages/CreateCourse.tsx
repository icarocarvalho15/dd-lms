import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Type, FileText, Clock, Image as ImageIcon, ArrowRight, X, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const CreateCourse = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [durationMinutes, setDurationMinutes] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('duration_minutes', durationMinutes);
        if (image) {
            formData.append('image', image);
        }
        try {
            const res = await api.post('/courses', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate(`/instrutor/editar/${res.data.course.slug}`);
        } catch (error) {
            console.error("Erro ao criar curso:", error);
            setError("Não foi possível criar o curso. Por favor, tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
            <Navbar />
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md border border-red-100">
                <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{error}</h3>
                <Link to="/instrutor/meus-cursos" className="text-blue-600 font-black uppercase text-xs tracking-widest hover:underline">Voltar aos Cursos</Link>
            </div>
        </div>
    );

    if (loading) return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className=" text-blue-600 font-bold animate-pulse uppercase tracking-widest text-xs">
            DravDev Academy...
          </span>
        </div>
      </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-28 px-4">
            <Navbar />
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header className="mb-10 text-center">
                    <div className="inline-flex p-3 bg-purple-100 text-purple-600 rounded-2xl mb-4">
                        <PlusCircle size={32} />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Criar Novo Treinamento</h1>
                    <p className="text-gray-500 font-medium mt-1">Preencha as informações básicas para começar o conteúdo.</p>
                </header>
                <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                    <div className="mb-8">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">
                            <Type size={12} /> Título do Curso
                        </label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Laravel Masterclass: Do Zero ao Pro"
                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all placeholder:font-normal"
                            required
                        />
                    </div>
                    <div className="mb-10">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">
                            <FileText size={12} /> Descrição / Resumo
                        </label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                            placeholder="Descreva brevemente o que o aluno vai aprender..."
                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-medium text-gray-600 focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all resize-none"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">
                                <Clock size={12} /> Duração (Minutos)
                            </label>
                            <input 
                                type="number" 
                                value={durationMinutes}
                                onChange={(e) => setDurationMinutes(e.target.value)}
                                placeholder="Ex: 120"
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">
                                <ImageIcon size={12} /> Capa do Curso
                            </label>
                            <div className="relative group">
                                <input 
                                    type="file" 
                                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-dashed border-gray-200 rounded-2xl font-bold text-gray-400 text-xs cursor-pointer hover:bg-gray-100 transition-all file:hidden"
                                    accept="image/*"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] uppercase font-black tracking-wider text-gray-400">
                                    {image ? image.name : "Selecionar arquivo..."}
                                </span>
                            </div>
                            {image && (
                                <div className="mt-4 relative h-24 w-full rounded-2xl overflow-hidden border-2 border-blue-500 animate-in zoom-in duration-300">
                                    <img 
                                        src={URL.createObjectURL(image)} 
                                        className="w-full h-full object-cover" 
                                        alt="Preview" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setImage(null)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <button 
                            type="button"
                            onClick={() => navigate('/instrutor/meus-cursos')}
                            className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex-[2] flex items-center justify-center gap-3 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Processando...' : (
                                <>
                                    Criar e Adicionar Aulas
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;