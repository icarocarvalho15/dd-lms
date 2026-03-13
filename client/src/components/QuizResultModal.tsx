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
            <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl text-center animate-in zoom-in duration-300">
                <div className={`text-6xl mb-6 ${passed ? 'animate-bounce' : 'grayscale'}`}>
                    {passed ? '🎓' : '📚'}
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">
                    {passed ? 'Aprovado!' : 'Quase lá...'}
                </h2>
                <div className="flex justify-center gap-8 my-8">
                    <div>
                        <span className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Sua Nota</span>
                        <span className={`text-4xl font-black ${passed ? 'text-green-500' : 'text-red-500'}`}>{score}%</span>
                    </div>
                    <div className="w-px bg-gray-100"></div>
                    <div>
                        <span className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Mínimo</span>
                        <span className="text-4xl font-black text-gray-800">{minScore}%</span>
                    </div>
                </div>
                <p className="text-gray-500 text-sm mb-10 leading-relaxed px-4">
                    {passed 
                        ? "Parabéns! Você demonstrou domínio sobre o conteúdo e seu certificado já está disponível." 
                        : `Infelizmente você não atingiu a nota mínima. Você ainda tem ${attemptsLeft} tentativas.`}
                </p>
                <div className="space-y-3">
                    {passed ? (
                        <button 
                            onClick={onGenerate}
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-500/20"
                        >
                            Gerar Meu Certificado
                        </button>
                    ) : (
                        <>
                            {attemptsLeft > 0 ? (
                                <button 
                                    onClick={onRetry}
                                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-600 transition-all"
                                >
                                    Tentar Novamente
                                </button>
                            ) : (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                    🚫 Limite de tentativas esgotado!<br/> 
                                    Aguarde as orientações do instrutor.
                                </div>
                            )}
                        </>
                    )}

                    <button 
                        onClick={onClose}
                        className="w-full bg-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all"
                    >
                        Voltar ao Curso
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizResultModal;