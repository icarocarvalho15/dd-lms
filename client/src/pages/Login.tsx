import { useState } from 'react';
import { AxiosError } from 'axios';
import api from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('http://127.0.0.1:8000/api/login', { email, password });
            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('userName', res.data.user.name);
            localStorage.setItem('userRole', res.data.user.role);
            window.location.href = '/';
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const message = axiosError.response?.data?.message || "Erro ao conectar com o servidor.";
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-blue-900/5 w-full max-w-md border border-gray-100">
                <form onSubmit={handleLogin}>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">
                            DravDev <span className="text-blue-600 not-italic font-normal">Login</span>
                        </h2>
                        <p className="text-gray-400 text-sm mt-2 font-medium">Bem-vindo de volta, aluno!</p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <input 
                                type="email" 
                                placeholder="E-mail" 
                                required
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400" 
                                onChange={e => setEmail(e.target.value)} 
                            />
                        </div>
                        <div>
                            <input 
                                type="password" 
                                placeholder="Senha" 
                                required
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400" 
                                onChange={e => setPassword(e.target.value)} 
                            />
                        </div>
                    </div>
                    <button 
                        disabled={loading} 
                        className={`w-full mt-8 py-4 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-[0.98] 
                        ${loading 
                            ? 'bg-blue-400 cursor-not-allowed shadow-none' 
                            : 'bg-gray-900 hover:bg-blue-600 shadow-blue-500/20 hover:shadow-blue-500/40'
                        }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Autenticando...</span>
                            </div>
                        ) : 'Entrar na Plataforma'}
                    </button>
                </form>
                <div className="mt-8 text-center text-xs text-gray-400 font-medium">
                    Problemas com o acesso? <a href="#" className="text-blue-500 hover:underline">Contate o suporte</a>
                </div>
            </div>
        </div>
    );
};

export default Login;