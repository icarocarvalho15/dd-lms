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
            await api.post('/courses', { title, description });
            navigate('/instrutor/meus-cursos');
        } catch {
            alert("Erro ao criar o curso. Verifique sua conexão ou se o título é válido.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-28 pb-12 max-w-[800px] mx-auto px-6">
                <div className="mb-10">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                        Novo <span className="text-purple-600">Treinamento</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Preencha as informações básicas para começar seu curso.</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Título do Curso</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Masterizando React 19"
                                required
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Descrição Curta</label>
                            <textarea 
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Descreva o que o aluno vai aprender..."
                                required
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
                            />
                        </div>
                    </div>
                    <div className="mt-10 flex gap-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all shadow-lg 
                            ${loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20 hover:shadow-purple-500/40 active:scale-[0.98]'}`}
                        >
                            {loading ? 'Criando...' : 'Confirmar e Criar'}
                        </button>
                        <button 
                            type="button"
                            onClick={() => navigate('/instrutor/meus-cursos')}
                            className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default CreateCourse;