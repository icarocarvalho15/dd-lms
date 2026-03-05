import { Link } from 'react-router-dom';

const Navbar = () => {
    const userName = localStorage.getItem('userName') || 'Usuário';
    const userRole = localStorage.getItem('userRole') || 'aluno';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
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
                        <Link to="/" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Cursos</Link>
                        <Link to="/dashboard" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Meu Painel</Link>
                        {(userRole === 'instrutor' || userRole === 'admin') && (
                            <Link to="/instrutor/meus-cursos" className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1">
                                <span className="text-lg">⚡</span> Área do Instrutor
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-end border-r border-gray-200 pr-6">
                        <span className="text-sm font-bold text-gray-900">{userName}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                            userRole === 'admin' ? 'text-red-500' : 
                            userRole === 'instrutor' ? 'text-purple-600' : 'text-blue-600'
                        }`}>
                            {userRole === 'admin' ? 'Administrador' : 
                             userRole === 'instrutor' ? 'Instrutor Pro' : 'Aluno Pro'}
                        </span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all border border-gray-100 flex items-center gap-2 group"
                    >
                        <span>Sair</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;