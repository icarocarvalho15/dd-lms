import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, User, Book, ArrowLeft, TrendingUp } from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';

interface Rating {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    course: { title: string };
    user: { name: string };
}

const InstructorRatings = () => {
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/instructor/ratings')
            .then(res => setRatings(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const averageGeneral = ratings.length > 0 
        ? (ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length).toFixed(1)
        : 0;

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
            <div className="max-w-5xl mx-auto pb-20">
                <Link to="/instrutor/meus-cursos" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 mb-6 transition-colors">
                    <ArrowLeft size={14} /> Voltar aos Cursos
                </Link>
                <header className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Feedback dos <span className="text-blue-600">Alunos</span></h1>
                        <p className="text-gray-500 font-medium">O que estão dizendo sobre seus treinamentos.</p>
                    </div>
                    <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Média Geral</span>
                            <span className="text-2xl font-black text-gray-900">{averageGeneral} <span className="text-sm text-gray-300">/ 5.0</span></span>
                        </div>
                    </div>
                </header>
                <div className="grid gap-6">
                    {ratings.length === 0 ? (
                        <div className="bg-white p-20 rounded-[3rem] text-center border border-gray-100">
                            <MessageSquare size={48} className="mx-auto text-gray-100 mb-4" />
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Nenhuma avaliação recebida ainda.</p>
                        </div>
                    ) : (
                        ratings.map(r => (
                            <div key={r.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 transition-all hover:shadow-md">
                                <div className="md:w-48 shrink-0">
                                    <StarRating rating={r.rating} size={16} />
                                    <span className="block mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {new Date(r.created_at).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            <User size={12} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">{r.user.name}</span>
                                        <span className="text-gray-300">•</span>
                                        <div className="flex items-center gap-1.5 text-blue-600">
                                            <Book size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-tight">{r.course.title}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 italic leading-relaxed">
                                        "{r.comment || "O aluno não deixou um comentário por escrito, apenas a nota."}"
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorRatings;