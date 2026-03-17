import { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, ShieldAlert, CheckCircle2, AlertTriangle, Save, ArrowRight, ShieldCheck } from 'lucide-react';
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
                setError("Não foi possível carregar os dados do perfil.");
            } finally {
                setLoading(false);
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
            console.error("Erro ao atualizar perfil", err);
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
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md border border-red-100">
                <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">{error}</h3>
                <Link to="/" className="text-blue-600 font-bold uppercase text-xs tracking-widest hover:underline">Voltar ao início.</Link>
            </div>
        </div>
    );

    if (loading) return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className=" text-blue-600 font-bold animate-pulse uppercase tracking-widest text-xs">
            DravDev Academy...
          </span>
        </div>
      </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-32 pb-12 max-w-[800px] mx-auto px-6">
                <header className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-500">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">
                        Meu <span className="text-blue-600">Perfil</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Gerencie suas informações de acesso e contato.</p>
                </header>
                <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                    <div className="mb-10 p-5 bg-amber-50 border border-amber-100 rounded-3xl flex items-start gap-4">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-amber-500">
                            <AlertTriangle size={20} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-amber-700 leading-relaxed">
                            Nome e E-mail são vinculados à autenticidade dos seus certificados e <span className="underline decoration-amber-300">não podem ser alterados</span>.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">
                                <User size={12} /> Nome Completo
                            </label>
                            <input 
                                type="text" 
                                value={name} 
                                readOnly 
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-400 cursor-not-allowed outline-none"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">
                                <Mail size={12} /> E-mail
                            </label>
                            <input 
                                type="email" 
                                value={email} 
                                readOnly 
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-400 cursor-not-allowed outline-none"
                            />
                        </div>
                    </div>
                    <div className="relative w-full mb-8">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">
                            <Phone size={12} /> Telefone / WhatsApp
                        </label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={phone} 
                                onChange={handlePhoneChange}
                                placeholder="(00) 00000-0000"
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-800 focus:ring-0 focus:border-blue-600 focus:bg-white outline-none transition-all"
                            />
                            {phone.length >= 14 && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-green-500 bg-white px-3 py-1 rounded-full shadow-sm border border-green-50">
                                    <CheckCircle2 size={12} />
                                    <span className="font-black text-[9px] tracking-widest">VÁLIDO</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="my-12 flex items-center gap-4">
                        <hr className="flex-1 border-gray-100" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-300 flex items-center gap-2">
                            <Lock size={14} /> Segurança
                        </h3>
                        <hr className="flex-1 border-gray-100" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Nova Senha</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-800 focus:ring-0 focus:border-blue-600 focus:bg-white outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Confirmar Senha</label>
                                <input 
                                    type="password" 
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-800 focus:ring-0 focus:border-blue-600 focus:bg-white outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-3">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ShieldCheck size={14} className="text-blue-500" /> Requisitos de Senha
                            </h4>
                            <Requirement label="Pelo menos 8 caracteres" met={passwordRequirements.length} />
                            <Requirement label="Letra Maiúscula" met={passwordRequirements.hasUpper} />
                            <Requirement label="Letra Minúscula" met={passwordRequirements.hasLower} />
                            <Requirement label="Um número" met={passwordRequirements.hasNumber} />
                            <Requirement label="Caractere Especial" met={passwordRequirements.hasSymbol} />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={!canSubmit}
                        className="group w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Save size={18} />
                                <span>Salvar Alterações</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </main>
        </div>
    );
};

const Requirement = ({ label, met }: { label: string; met: boolean }) => (
    <div className={`flex items-center gap-3 p-1 transition-all ${met ? 'translate-x-1' : ''}`}>
        {met ? (
            <div className="p-1 bg-green-500 rounded-full shadow-sm shadow-green-200">
                <CheckCircle2 size={10} className="text-white" />
            </div>
        ) : (
            <div className="w-4 h-4 border-2 border-gray-200 rounded-full" />
        )}
        <span className={`text-[10px] font-bold uppercase tracking-tight ${met ? 'text-green-600' : 'text-gray-400'}`}>
            {label}
        </span>
    </div>
);

export default Profile;