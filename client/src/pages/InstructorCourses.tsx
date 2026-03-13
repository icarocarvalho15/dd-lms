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
    students_count: number;
}

const InstructorDashboard = () => {
    const [courses, setCourses] = useState<InstructorCourse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        api.get<InstructorCourse[]>('/instructor/courses')
            .then(res => {
                setCourses(res.data);
                setLoading(false);
                setError(null);
            })
            .catch(() => {
                setLoading(false);
                setError("Não foi possível carregar a lista de cursos. Por favor, tente novamente mais tarde.");
            });
    }, []);

    const handleDeleteCourse = async (id: number) => {
        if (!window.confirm("Você deseja excluir este curso permanentemente? Esta ação não pode ser desfeita.")) {
            return;
        }
        try {
            await api.delete(`/courses/${id}`);
            setCourses(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error("Erro ao deletar curso:", error);
            alert("Erro ao excluir curso. Verifique se ele possui módulos vinculados.");
        }
    };
    
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

    if (!courses) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
            <Navbar />
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md">
                <h3 className="text-2xl font-bold mb-4">{!courses}</h3>
                <Link to="/" className="text-blue-600 font-bold uppercase text-xs tracking-widest">Voltar ao início.</Link>
            </div>
        </div>
    );
    
    return (
        <div className="min-h-screen bg-gray-50 pt-28 px-4">
            <Navbar />
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black  uppercase tracking-tighter">Área do Instrutor</h1>
                        <p className="text-gray-500">Gerencie seus treinamentos e acompanhe seus alunos.</p>
                    </div>
                    <Link 
                        to="/instrutor/novo-curso"
                        className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
                    >
                        + Novo Curso
                    </Link>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Curso</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Conteúdo</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Alunos Formados</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {courses.map(course => (
                                <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6 font-bold text-gray-900">{course.title}</td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${course.is_published ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                            {course.is_published ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-gray-500 text-center">{course.modules_count} Módulos</td>
                                    <td className="px-8 py-6 text-sm font-bold text-blue-600 text-center">{course.students_count}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center items-center gap-2">
                                            <Link 
                                                to={`/curso/${course.slug}`} 
                                                title="Visualizar como Aluno"
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <span className="text-lg">👁️</span>
                                            </Link>
                                            <Link 
                                                to={`/instrutor/editar/${course.slug}`}
                                                title="Editar Conteúdo"
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <span className="text-lg">✏️</span>
                                            </Link>
                                            <button 
                                                onClick={() => handleDeleteCourse(course.id)}
                                                title="Excluir Curso"
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <span className="text-lg">🗑️</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;