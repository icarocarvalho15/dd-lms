import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

interface Course {
    id: number;
    title: string;
    slug: string;
    progress_percentage: number;
}

interface DashboardData {
    user: { name: string; email: string };
    stats: { started: number; completed: number };
    courses: Course[];
}

const Dashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/dashboard');
                setData(res.data);
            } catch (err) {
                console.error("Erro ao carregar dashboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const handleDownloadCertificate = async (slug: string) => {
        try {
            const response = await api.get(`/courses/${slug}/certificate`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Certificado-${slug}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Detalhes do erro no certificado:", err);
            alert("Erro ao gerar certificado. Verifique se concluiu todas as aulas.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center italic font-bold text-blue-600">
                <Navbar />
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-28 pb-12 max-w-[1200px] mx-auto px-6">
                <header className="mb-10">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                        Meu <span className="text-blue-600">Painel</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Olá, {data.user.name}. Acompanhe sua evolução abaixo.</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex justify-between items-center group hover:shadow-md transition-all">
                        <div>
                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">Em Andamento</p>
                            <h3 className="text-5xl font-black mt-2 italic">{data.stats.started}</h3>
                        </div>
                        <div className="text-5xl opacity-20 group-hover:opacity-100 transition-opacity">🚀</div>
                    </div>
                    <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/20 flex justify-between items-center text-white group">
                        <div>
                            <p className="text-blue-200 font-black text-[10px] uppercase tracking-[0.2em]">Concluídos</p>
                            <h3 className="text-5xl font-black mt-2 italic">{data.stats.completed}</h3>
                        </div>
                        <div className="text-5xl opacity-40 group-hover:opacity-100 transition-opacity">🎓</div>
                    </div>
                </div>
                <h2 className="text-xl font-bold mb-6 italic uppercase tracking-tight text-gray-800">Meus Treinamentos</h2>
                <div className="space-y-4">
                    {data.courses.length === 0 ? (
                        <div className="bg-white p-10 rounded-3xl text-center border border-dashed border-gray-300">
                            <p className="text-gray-400 font-medium">Você ainda não iniciou nenhum curso.</p>
                            <Link to="/" className="text-blue-600 font-bold mt-2 inline-block hover:underline">Ir para lista de Cursos →</Link>
                        </div>
                    ) : (
                        data.courses.map(course => (
                            <div key={course.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition-all gap-6">
                                <div className="flex-1 w-full">
                                    <h4 className="font-bold text-lg text-gray-900 italic tracking-tight">{course.title}</h4>
                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                                            <div 
                                                className="bg-blue-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(37,99,235,0.4)]" 
                                                style={{ width: `${course.progress_percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-black text-blue-600 w-8">{course.progress_percentage}%</span>
                                    </div>
                                </div>
                                <div className="flex shrink-0">
                                    {course.progress_percentage === 100 ? (
                                        <button 
                                            onClick={() => handleDownloadCertificate(course.slug)}
                                            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-950 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-yellow-500/20 active:scale-95 flex items-center gap-2"
                                        >
                                            <span>📜</span> Gerar Certificado
                                        </button>
                                    ) : (
                                        <Link to={`/curso/${course.slug}`} className="bg-gray-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95">
                                            Continuar Curso
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;