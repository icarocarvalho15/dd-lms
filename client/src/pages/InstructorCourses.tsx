import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

interface InstructorCourse {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    modules_count: number;
    created_at: string;
}

const InstructorCourses = () => {
    const [courses, setCourses] = useState<InstructorCourse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInstructorCourses = async () => {
            try {
                const res = await api.get('/instructor/courses');
                setCourses(res.data);
            } catch {
                //
            } finally {
                setLoading(false);
            }
        };
        fetchInstructorCourses();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center italic font-bold text-purple-600">
                <Navbar />
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-28 pb-12 max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                            Área do <span className="text-purple-600">Instrutor</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Gerencie seus conteúdos e acompanhe seu desempenho.</p>
                    </div>
                    <Link 
                        to="/instrutor/novo-curso" 
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20 active:scale-95"
                    >
                        + Criar Novo Treinamento
                    </Link>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Treinamento</th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Módulos</th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center text-gray-400 font-medium italic">
                                        Você ainda não possui cursos cadastrados.
                                    </td>
                                </tr>
                            ) : (
                                courses.map(course => (
                                    <tr key={course.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-6">
                                            <div className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors italic">
                                                {course.title}
                                            </div>
                                            <div className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tight">
                                                Criado em: {new Date(course.created_at).toLocaleDateString('pt-BR')}
                                            </div>
                                        </td>
                                        <td className="p-6 text-center font-bold text-gray-600">
                                            {course.modules_count}
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                                course.is_published 
                                                ? 'bg-green-100 text-green-600' 
                                                : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                                {course.is_published ? 'Publicado' : 'Rascunho'}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link 
                                                    to={`/instrutor/editar/${course.slug}`}
                                                    className="p-3 bg-gray-100 hover:bg-purple-100 text-gray-500 hover:text-purple-600 rounded-xl transition-all"
                                                    title="Editar Curso"
                                                >
                                                    ✏️
                                                </Link>
                                                <Link 
                                                    to={`/curso/${course.slug}`}
                                                    className="p-3 bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 rounded-xl transition-all"
                                                    title="Visualizar como Aluno"
                                                >
                                                    👁️
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default InstructorCourses;