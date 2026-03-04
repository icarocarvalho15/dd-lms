import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Course {
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
            <h1 className="text-4xl font-black mb-10 text-gray-800 tracking-tight">
                DravDev <span className="text-blue-600">Academy</span>
            </h1>
            
            {courses.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                    Nenhum curso encontrado no banco de dados. 
                    <br/> 
                    <span className="text-sm">Dica: Rode "php artisan migrate:fresh --seed" no terminal do Laravel.</span>
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
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseList;