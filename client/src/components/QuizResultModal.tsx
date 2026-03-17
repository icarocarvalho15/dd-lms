import { Trophy, BookOpen, GraduationCap, RotateCcw, XCircle, ArrowLeft } from 'lucide-react';

interface QuizResultModalProps {
    isOpen: boolean;
    passed: boolean;
    score: number;
    minScore: number;
    attemptsLeft: number;
    onClose: () => void;
    onRetry: () => void;
    onGenerate: () => void;
}

const QuizResultModal = ({ isOpen, passed, score, minScore, attemptsLeft, onClose, onRetry, onGenerate }: QuizResultModalProps ) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl text-center animate-in zoom-in duration-300 border border-gray-100">
                <div className="flex justify-center mb-6">
                    {passed ? (
                        <div className="p-5 bg-green-50 rounded-full animate-bounce">
                            <Trophy size={60} className="text-green-500" />
                        </div>
                    ) : (
                        <div className="p-5 bg-gray-50 rounded-full">
                            <BookOpen size={60} className="text-gray-400" />
                        </div>
                    )}
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-gray-900">
                    {passed ? 'Aprovado!' : 'Quase lá...'}
                </h2>
                <div className="flex justify-center gap-8 my-8 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                    <div>
                        <span className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Sua Nota</span>
                        <span className={`text-4xl font-black ${passed ? 'text-green-500' : 'text-red-500'}`}>{score}%</span>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div>
                        <span className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Mínimo</span>
                        <span className="text-4xl font-black text-gray-800">{minScore}%</span>
                    </div>
                </div>
                <p className="text-gray-500 text-sm mb-10 leading-relaxed px-4 font-medium italic text-balance">
                    {passed 
                        ? "Parabéns! Você demonstrou domínio sobre o conteúdo e seu certificado oficial já está disponível para emissão." 
                        : `Infelizmente você não atingiu a nota mínima. Não desista! Você ainda possui ${attemptsLeft} tentativa(s).`}
                </p>
                <div className="space-y-3">
                    {passed ? (
                        <button 
                            onClick={onGenerate}
                            className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.1em] shadow-xl shadow-orange-500/30 hover:scale-[1.02] transition-all"
                        >
                            <GraduationCap size={18} />
                            Gerar Meu Certificado
                        </button>
                    ) : (
                        <>
                            {attemptsLeft > 0 ? (
                                <button 
                                    onClick={onRetry}
                                    className="flex items-center justify-center gap-3 w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-600 transition-all shadow-lg active:scale-95"
                                >
                                    <RotateCcw size={18} />
                                    Tentar Novamente
                                </button>
                            ) : (
                                <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-left">
                                    <XCircle size={24} className="text-red-500 shrink-0" />
                                    <div>
                                        <p className="text-red-600 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Bloqueado</p>
                                        <p className="text-red-500 text-[11px] font-bold leading-tight">Tentativas esgotadas. Contate seu instrutor.</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <button 
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all"
                    >
                        <ArrowLeft size={14} />
                        Voltar ao Treinamento
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizResultModal;