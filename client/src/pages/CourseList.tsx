import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md">
                <h3 className="text-2xl font-bold mb-4">{error}</h3>
                <Link to="/" className="text-blue-600 font-bold uppercase text-xs tracking-widest">Voltar ao início.</Link>
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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-28 pb-12 max-w-[1200px] mx-auto px-6">
                {courses.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                        Nenhum curso encontrado no banco de dados.<br/>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map(course => (
                            <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                                <div className="h-48 bg-gray-200 relative overflow-hidden flex items-center justify-center">
                                    {course.image ? (
                                        <img 
                                            src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/storage/${course.image}`} 
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white">
                                            <span className="text-6xl font-bold opacity-20 group-hover:scale-110 transition-transform">{course.title[0]}</span>
                                        </div>
                                    )}
                                    
                                    <div className="absolute bottom-4 left-4 z-10">
                                        <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                                            Treinamento
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">{course.title}</h2>
                                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">{course.description}</p>
                                    <Link to={`/curso/${course.slug}`} className="block text-center w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-all active:scale-95">
                                        Iniciar Curso
                                    </Link>
                                    <div className="mt-6 border-t border-gray-100 pt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                Minha Progressão
                                            </span>
                                            <span className="text-xs font-bold text-blue-600">
                                                {course.progress_percentage ?? 0}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden shadow-inner">
                                            <div 
                                                className="bg-blue-600 h-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(37,99,235,0.4)]" 
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