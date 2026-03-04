import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-200 fixed w-full z-50 top-0 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-xl font-black text-gray-800 tracking-tighter uppercase italic">
                            DravDev <span className="text-blue-600 font-normal">Academy</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end sm:flex">
                            <span className="text-xs font-bold text-gray-900">Ícaro Carvalho</span>
                            <span className="text-[10px] text-gray-400 font-medium">Aluno</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 p-2 rounded-lg transition-all"
                            title="Sair do sistema"
                        >
                            <span className="text-sm font-bold">Sair</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;