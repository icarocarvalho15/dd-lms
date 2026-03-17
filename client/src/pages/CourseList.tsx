import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Search, Trophy, Rocket, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

interface Course {
    id: number;
    title: string;
    slug: string;
    description: string;
    image: string | null;
    progress_percentage: number;
    instructor?: { name: string };
}

const CourseList = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/courses')
        .then(response => {
            setCourses(response.data);
            setLoading(false);
            setError(null);
        })
        .catch(error => {
            console.error("Erro ao buscar cursos:", error);
            setLoading(false);
            setError("Não foi possível carregar os cursos. Por favor, tente novamente mais tarde.");
        });
    }, []);

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
            <Navbar />
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md border border-red-100">
                <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4 text-gray-800">{error}</h3>
                <Link to="/" className="text-blue-600 font-black uppercase text-xs tracking-widest hover:underline">Tentar novamente</Link>
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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-28 pb-12 max-w-[1200px] mx-auto px-6">
                <header className="mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">
                        Explore nossos <span className="text-blue-600">Treinamentos</span>
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">Escolha uma trilha e comece a evoluir hoje mesmo.</p>
                </header>
                {courses.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] shadow-sm border border-gray-100 text-center">
                        <Search size={48} className="text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Nenhum curso disponível no momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map(course => (
                            <div key={course.id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                                <div className="h-52 bg-gray-200 relative overflow-hidden flex items-center justify-center">
                                    {course.image ? (
                                        <img 
                                            src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/storage/${course.image}`} 
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white">
                                            <BookOpen size={64} className="opacity-20 group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className={`px-3 py-1.5 rounded-full text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-md flex items-center gap-2 ${course.progress_percentage === 100 ? 'bg-green-500/80' : 'bg-black/30'}`}>
                                            {course.progress_percentage === 100 ? <Trophy size={10} /> : <Rocket size={10} />}
                                            {course.progress_percentage === 100 ? 'Concluído' : 'Disponível'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h2 className="text-xl font-black mb-3 text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">
                                        {course.title}
                                    </h2>
                                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-1 italic">
                                        {course.description}
                                    </p>
                                    <Link 
                                        to={`/curso/${course.slug}`} 
                                        className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.15em] hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
                                    >
                                        <span>{course.progress_percentage > 0 ? 'Continuar Trilha' : 'Iniciar Treinamento'}</span>
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <div className="mt-8 border-t border-gray-50 pt-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Seu Progresso</span>
                                            <span className="text-xs font-bold text-blue-600">{course.progress_percentage ?? 0}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden shadow-inner">
                                            <div 
                                                className="bg-blue-600 h-full transition-all duration-1000 ease-out" 
                                                style={{ width: `${course.progress_percentage ?? 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default CourseList;