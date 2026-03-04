import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white border-b border-gray-200 fixed w-full z-50 top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center">
                        <span className="text-2xl font-black text-gray-800 tracking-tighter">
                            DravDev <span className="text-blue-600">Academy</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            IC
                        </div>
                        <span className="text-sm font-medium text-gray-700 hidden md:block">Ícaro Carvalho</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;