import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const formatPhoneNumber = (value: string) => {
    if (!value) return "";
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
        return numbers
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .substring(0, 15);
    }
    return numbers.substring(0, 11);
};

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const passwordRequirements = {
        length: password.length >= 8,
        hasUpper: /[A-Z]/.test(password),
        hasLower: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSymbol: /[!@#$%^&*]/.test(password),
    };

    const isPasswordValid = !password || (
        passwordRequirements.length && 
        passwordRequirements.hasUpper && 
        passwordRequirements.hasLower && 
        passwordRequirements.hasNumber && 
        passwordRequirements.hasSymbol
    );

    const canSubmit = !saving && isPasswordValid && (password === passwordConfirmation);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await api.get('/me');
                setName(res.data.name);
                setEmail(res.data.email);
                setPhone(formatPhoneNumber(res.data.phone || ''));
            } catch (err) {
                console.error("Erro ao carregar perfil", err);
                setError("Não foi possível carregar os dados do perfil. Por favor, tente novamente mais tarde.");
            } finally {
                setLoading(false);
                setError(null);
            }
        };
        fetchUserData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/profile/update', {
                phone,
                password,
                password_confirmation: passwordConfirmation
            });
            alert("Perfil atualizado com sucesso!");
            setPassword('');
            setPasswordConfirmation('');
        } catch (err) {
            console.error("Erro ao carregar perfil", err);
            alert("Erro ao atualizar perfil. Verifique os dados.");
        } finally {
            setSaving(false);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhone(formatted);
    };

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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-32 pb-12 max-w-[800px] mx-auto px-6">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-black  uppercase tracking-tighter text-gray-900">Meu <span className="text-blue-600">Perfil</span></h1>
                    <p className="text-gray-500 mt-2">Gerencie suas informações de acesso e contato.</p>
                </header>
                <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                    <div className="mb-10 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                        <span className="text-xl">⚠️</span>
                        <p className="text-[11px] font-bold uppercase tracking-tight text-amber-700 leading-tight">
                            Nome e E-mail não podem ser alterados, pois são vinculados à autenticidade dos seus certificados emitidos.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Nome Completo</label>
                            <input 
                                type="text" 
                                value={name} 
                                readOnly 
                                className="w-full px-6 py-4 bg-gray-100 border-none rounded-2xl font-bold text-gray-400 cursor-not-allowed outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">E-mail</label>
                            <input 
                                type="email" 
                                value={email} 
                                readOnly 
                                className="w-full px-6 py-4 bg-gray-100 border-none rounded-2xl font-bold text-gray-400 cursor-not-allowed outline-none"
                            />
                        </div>
                    </div>
                    <div className="relative w-full mb-8">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Telefone / WhatsApp</label>
                        <input 
                            type="text" 
                            value={phone} 
                            onChange={handlePhoneChange}
                            placeholder="(00) 00000-0000"
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                        />
                        {phone.length >= 14 && (
                            <span className="absolute right-4 top-2/3 -translate-y-1/2 text-green-500 font-black text-[9px] tracking-tighter bg-white px-2 py-1 rounded-lg shadow-sm">
                                ✓ VÁLIDO
                            </span>
                        )}
                    </div>
                    <hr className="my-10 border-gray-100" />
                    <h3 className="text-lg font-black  uppercase tracking-tight mb-6 text-gray-700">Alterar Senha</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Nova Senha</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mínimo 8 caracteres"
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Confirmar Nova Senha</label>
                            <input 
                                type="password" 
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                placeholder="Repita a senha"
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-2">
                            <Requirement label="8+ caracteres" met={passwordRequirements.length} />
                            <Requirement label="Maiúscula" met={passwordRequirements.hasUpper} />
                            <Requirement label="Minúscula" met={passwordRequirements.hasLower} />
                            <Requirement label="Número" met={passwordRequirements.hasNumber} />
                            <Requirement label="Símbolo" met={passwordRequirements.hasSymbol} />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={!canSubmit}
                        className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                    >
                        {saving ? 'Atualizando...' : 'Salvar Alterações ➔'}
                    </button>
                </form>
            </main>
        </div>
    );
};

const Requirement = ({ label, met }: { label: string; met: boolean }) => (
    <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter transition-colors ${met ? 'text-green-500' : 'text-gray-300'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-green-500' : 'bg-gray-300'}`}></span>
        {label}
    </div>
);

export default Profile;