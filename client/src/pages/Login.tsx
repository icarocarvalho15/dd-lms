import { useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);
        try {
            const res = await api.post('/login', { email, password });
            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('userName', res.data.user.name);
            localStorage.setItem('userRole', res.data.user.role);
            navigate('/');
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const message = axiosError.response?.data?.message || "Credenciais inválidas ou erro no servidor.";
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/5 w-full max-w-md border border-gray-100 animate-in fade-in zoom-in duration-300">
                <form onSubmit={handleLogin}>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">
                            DravDev <span className="text-blue-600 not-italic font-normal">Academy</span>
                        </h2>
                        <p className="text-gray-400 text-sm mt-2 font-medium text-balance italic">
                            Acesse sua conta para continuar seus treinamentos.
                        </p>
                    </div>
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-in slide-in-from-top-2">
                            <AlertCircle size={18} />
                            <span>{errorMessage}</span>
                        </div>
                    )}
                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="email" 
                                placeholder="E-mail corporativo" 
                                required
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400" 
                                onChange={e => setEmail(e.target.value)} 
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="password" 
                                placeholder="Sua senha secreta" 
                                required
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400" 
                                onChange={e => setPassword(e.target.value)} 
                            />
                        </div>
                    </div>
                    <button 
                        disabled={loading} 
                        className={`w-full mt-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-white transition-all shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] 
                        ${loading 
                            ? 'bg-blue-400 cursor-not-allowed shadow-none' 
                            : 'bg-gray-900 hover:bg-blue-600 shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                        }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Autenticando...</span>
                            </>
                        ) : (
                            <>
                                <LogIn size={18} />
                                <span>Entrar na Plataforma</span>
                            </>
                        )}
                    </button>
                </form>
                <div className="mt-8 text-center text-[10px] text-gray-400 font-black uppercase tracking-wider">
                    Problemas com o acesso? <a href="mailto:suporte@dravdev.com" className="text-blue-500 hover:underline">Contate o suporte</a>
                </div>
            </div>
        </div>
    );
};

export default Login;