import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

interface DashboardCourse {
    id: number;
    title: string;
    slug: string;
    progress_percentage: number;
    certificate_hash: string | null;
}

interface DashboardData {
    user: {
        id: number;
        name: string;
        email: string;
    };
    stats: {
        started: number;
        completed: number;
    };
    courses: DashboardCourse[];
}

const Dashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        api.get<DashboardData>('/dashboard')
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao carregar dashboard", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center pt-20 font-bold italic text-blue-600 animate-pulse">Carregando Painel...</div>;

    if (!data) return <div className="text-center pt-20">Nenhum dado encontrado.</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-28 max-w-7xl mx-auto px-4">
                <header className="mb-10">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">
                        Olá, {data.user.name.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-gray-500 font-medium">Continue de onde você parou.</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cursos Iniciados</span>
                        <div className="text-5xl font-black italic text-blue-600">{data.stats.started}</div>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Certificados Conquistados</span>
                        <div className="text-5xl font-black italic text-yellow-500">{data.stats.completed}</div>
                    </div>
                </div>
                <h2 className="text-xl font-bold uppercase italic mb-6">Meus Treinamentos</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                    {data.courses.map((course: DashboardCourse) => (
                        <div key={course.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col hover:scale-[1.02] transition-transform duration-300">
                            <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-6xl font-black italic shadow-inner">
                                {course.title.charAt(0)}
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold leading-tight mb-4 text-gray-800">{course.title}</h3>
                                <div className="mb-6">
                                    <div className="flex justify-between text-xs font-bold mb-2 uppercase italic">
                                        <span className="text-gray-400">Seu Progresso</span>
                                        <span className="text-blue-600">{course.progress_percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-blue-600 h-full transition-all duration-1000 ease-out" 
                                            style={{ width: `${course.progress_percentage}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="mt-auto space-y-3">
                                    <Link 
                                        to={`/curso/${course.slug}`}
                                        className="block w-full text-center bg-gray-900 text-white py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-md"
                                    >
                                        Continuar Estudando
                                    </Link>
                                    {course.progress_percentage === 100 && course.certificate_hash && (
                                        <button 
                                            onClick={() => window.open(`${api.defaults.baseURL}/certificate/${course.certificate_hash}`, '_blank')}
                                            className="block w-full text-center bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-orange-500/20 items-center justify-center gap-2"
                                        >
                                            🎓 Baixar Certificado
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;