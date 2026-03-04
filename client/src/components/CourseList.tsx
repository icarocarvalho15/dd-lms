import { useEffect, useState, type ReactNode } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Course {
    progress_percentage: ReactNode;
    id: number;
    title: string;
    description: string;
    slug: string;
}

const CourseList = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/courses')
            .then(response => {
                setCourses(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar cursos:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="p-10 text-center">Carregando treinamentos...</div>;
    }

    return (
        <div className="p-10 bg-gray-50 min-h-screen">            
            {courses.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                    Nenhum curso encontrado no banco de dados. 
                    <br/>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map(course => (
                        <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                            <div className="h-48 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white relative">
                               <span className="text-6xl font-bold opacity-20 group-hover:scale-110 transition-transform">{course.title[0]}</span>
                               <div className="absolute bottom-4 left-4">
                                   <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">Vídeo Aula</span>
                               </div>
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">{course.title}</h2>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">{course.description}</p>
                                <Link 
                                    to={`/curso/${course.slug}`} 
                                    className="block text-center w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-all active:scale-95"
                                >
                                    Iniciar Curso
                                </Link>
                                <div className="mt-4 px-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Progresso
                                        </span>
                                        <span className="text-xs font-bold text-blue-600">
                                            {course.progress_percentage || 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-blue-600 h-full transition-all duration-700" 
                                            style={{ width: `${course.progress_percentage || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseList;