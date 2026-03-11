import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
          <span className=" text-blue-600 font-bold animate-pulse">
            DravDev Academy...
          </span>
        </div>
      </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-28 px-4">
            <Navbar />
            <div className="max-w-3xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-black  uppercase tracking-tighter">Criar Novo Treinamento</h1>
                    <p className="text-gray-500">Defina o nome e a proposta do seu curso.</p>
                </header>
                <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                    <div className="mb-8">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                            Título do Curso
                        </label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Laravel Masterclass: Do Zero ao Pro"
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                            required
                        />
                    </div>
                    <div className="mb-10">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                            Descrição / Resumo
                        </label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                            placeholder="O que o aluno vai aprender neste treinamento?"
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-medium text-gray-600 focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                                Duração Total (Minutos)
                            </label>
                            <input 
                                type="number" 
                                value={durationMinutes}
                                onChange={(e) => setDurationMinutes(e.target.value)}
                                placeholder="Ex: 120"
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                                Capa do Curso (Imagem)
                            </label>
                            <input 
                                type="file" 
                                onChange={(e) => setImage(e.target.files?.[0] || null)}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl font-bold text-gray-400 text-xs"
                                accept="image/*"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            type="button"
                            onClick={() => navigate('/instrutor/meus-cursos')}
                            className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                        >
                            {loading ? 'Criando...' : 'Criar e Adicionar Aulas ➔'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;