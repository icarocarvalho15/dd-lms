import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

interface DashboardCourse {
    id: number;
    title: string;
    slug: string;
    image: string | null;
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
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        api.get<DashboardData>('/dashboard')
            .then(res => {
                setData(res.data);
                setLoading(false);
                setError(null);
            })
            .catch(err => {
                console.error("Erro ao carregar dashboard", err);
                setLoading(false);
                setError("Não foi possível carregar os dados do Painel. Por favor, tente novamente mais tarde.");
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

    if (!data) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
            <Navbar />
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md">
                <h3 className="text-2xl font-bold mb-4">{!data}</h3>
                <Link to="/" className="text-blue-600 font-bold uppercase text-xs tracking-widest">Voltar ao início.</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-28 max-w-7xl mx-auto px-4">
                <header className="mb-10">
                    <h1 className="text-4xl font-black  uppercase tracking-tighter text-gray-900">
                        Olá, {data.user.name.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-gray-500 font-medium">Continue de onde você parou.</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cursos Iniciados</span>
                        <div className="text-5xl font-black  text-blue-600">{data.stats.started}</div>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Certificados Conquistados</span>
                        <div className="text-5xl font-black  text-yellow-500">{data.stats.completed}</div>
                    </div>
                </div>
                <h2 className="text-xl font-bold uppercase  mb-6">Meus Treinamentos</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                    {data.courses.map((course: DashboardCourse) => (
                        <div key={course.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col hover:scale-[1.02] transition-transform duration-300">
                            <div className="h-48 bg-gray-200 relative overflow-hidden flex items-center justify-center shadow-inner">
                                {course.image ? (
                                    <img 
                                        src={`${api.defaults.baseURL?.replace('/api', '')}/storage/${course.image}`} 
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-6xl font-black">
                                        {course.title.charAt(0)}
                                    </div>
                                )}
                                <div className="absolute bottom-4 left-4 z-10">
                                    <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-widest">
                                        {course.progress_percentage === 100 ? 'Concluído' : 'Em Andamento'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold leading-tight mb-4 text-gray-800">{course.title}</h3>
                                <div className="mb-6">
                                    <div className="flex justify-between text-xs font-bold mb-2 uppercase">
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
                                        {course.progress_percentage === 100 ? 'Rever Treinamento' : 'Continuar Estudando'}
                                    </Link>
                                    {course.progress_percentage === 100 && course.certificate_hash && (
                                        <button 
                                            onClick={() => {
                                                const rootURL = api.defaults.baseURL?.replace('/api', '');
                                                window.open(`${rootURL}/certificate/${course.certificate_hash}`, '_blank');
                                            }}
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