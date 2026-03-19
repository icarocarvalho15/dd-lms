import { useState } from 'react';
import { Star, Send, X, CheckCircle } from 'lucide-react';
import api from '../api/axios';

interface CourseRatingModalProps {
    isOpen: boolean;
    courseId: number;
    courseTitle: string;
    onClose: () => void;
}

const CourseRatingModal = ({ isOpen, courseId, courseTitle, onClose }: CourseRatingModalProps) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) return;
        setLoading(true);
        try {
            await api.post(`/courses/${courseId}/rate`, { 
                rating, 
                comment 
            });
            setSent(true);
            setTimeout(() => onClose(), 2500);
        } catch (err) {
            console.error(err);
            alert("Erro ao enviar sua avaliação.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={20} />
                </button>
                {!sent ? (
                    <div className="text-center">
                        <div className="bg-yellow-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Star size={32} className="text-yellow-500 fill-yellow-500" />
                        </div>
                        
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-900 mb-2">
                            O que você achou?
                        </h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                            Você concluiu <span className="text-blue-600 font-bold">{courseTitle}</span>. 
                            Sua avaliação ajuda a DravDev a evoluir.
                        </p>
                        <div className="flex justify-center gap-2 mb-8">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setRating(num)}
                                    className="transition-transform hover:scale-125 active:scale-95"
                                >
                                    <Star 
                                        size={36} 
                                        className={`${num <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} transition-colors`} 
                                    />
                                </button>
                            ))}
                        </div>
                        <textarea
                            placeholder="Conte-nos mais sobre sua experiência (opcional)..."
                            className="w-full p-5 bg-gray-50 rounded-3xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none resize-none mb-6 border border-transparent focus:bg-white transition-all min-h-[100px]"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                        <button
                            onClick={handleSubmit}
                            disabled={rating === 0 || loading}
                            className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send size={18} />
                                    <span>Enviar Feedback</span>
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Valeu!</h3>
                        <p className="text-gray-500 font-medium mt-2">Sua nota foi registrada com sucesso.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseRatingModal;