import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
            localStorage.setItem('token', res.data.access_token);
            navigate('/'); 
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                alert(error.response.data.message || "Erro ao realizar login");
            } else {
                alert("Não foi possível conectar ao servidor.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="p-8 bg-white rounded-2xl shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">DravDev <span className="text-blue-600">Login</span></h2>
                <input type="email" placeholder="E-mail" className="w-full p-3 border rounded-xl mb-4" onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Senha" className="w-full p-3 border rounded-xl mb-6" onChange={e => setPassword(e.target.value)} />
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700">Entrar</button>
            </form>
        </div>
    );
};

export default Login;
