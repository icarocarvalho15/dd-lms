import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const CreateCourse = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/courses', { title, description });
            navigate(`/instrutor/editar/${res.data.course.slug}`);
        } catch (error) {
            console.error("Erro ao criar curso:", error);
            alert("Erro ao criar curso. Verifique se os campos estão preenchidos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-28 px-4">
            <Navbar />
            <div className="max-w-3xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">Criar Novo Treinamento</h1>
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
                    <div className="flex gap-4">
                        <button 
                            type="button"
                            onClick={() => navigate('/instructor')}
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