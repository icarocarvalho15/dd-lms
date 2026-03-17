import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, ShieldCheck, ChevronDown, BookOpen, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Usuário';
    const userRole = localStorage.getItem('userRole') || 'aluno';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 fixed w-full z-50 top-0 shadow-sm">
            <div className="max-w-[1600px] mx-auto px-6 h-20 flex justify-between items-center">
                <div className="flex items-center gap-10">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/30">
                            <span className="text-white font-bold text-xl italic px-1">D</span>
                        </div>
                        <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">
                            DravDev <span className="text-blue-600 not-italic font-normal">Academy</span>
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
                            <BookOpen size={16} />
                            Cursos
                        </Link>
                        <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
                            <LayoutDashboard size={16} />
                            Meu Painel
                        </Link>
                        {(userRole === 'instrutor' || userRole === 'admin') && (
                            <Link 
                                to="/instrutor/meus-cursos" 
                                className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100"
                            >
                                <ShieldCheck size={16} className="fill-purple-200" />
                                Área do Instrutor
                            </Link>
                        )}
                    </div>
                </div>
                <div className="relative">
                    <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all group"
                    >
                        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                            {userName.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-gray-700 hidden sm:block">{userName}</span>
                        <ChevronDown 
                            size={14} 
                            className={`text-gray-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} 
                        />
                    </button>
                    {showDropdown && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-[1.5rem] shadow-2xl border border-gray-50 py-3 z-20 animate-in fade-in zoom-in duration-200">
                                <div className="px-6 py-2 mb-2 border-b border-gray-50">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Sua Conta</p>
                                </div>
                                <Link 
                                    to="/perfil" 
                                    className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <User size={18} className="text-gray-400" />
                                    Meu Perfil
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-6 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                                >
                                    <LogOut size={18} />
                                    Sair
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;