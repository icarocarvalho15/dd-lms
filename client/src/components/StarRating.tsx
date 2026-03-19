import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    maxStars?: number;
    size?: number;
    onRate?: (rating: number) => void;
}

const StarRating = ({ rating, maxStars = 5, size = 18, onRate }: StarRatingProps) => {
    return (
        <div className="flex items-center gap-1">
            {[...Array(maxStars)].map((_, i) => {
                const starValue = i + 1;
                const isFull = starValue <= Math.floor(rating);
                const isHalf = !isFull && starValue <= Math.ceil(rating) && (rating % 1 !== 0);
                return (
                    <button
                        key={i}
                        type="button"
                        disabled={!onRate}
                        onClick={() => onRate?.(starValue)}
                        className={`${onRate ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'} transition-all`}
                    >
                        {isFull ? (
                            <Star size={size} className="text-yellow-400 fill-yellow-400" />
                        ) : isHalf ? (
                            <div className="relative">
                                <Star size={size} className="text-gray-300" />
                                <div className="absolute inset-0 overflow-hidden w-[50%]">
                                    <Star size={size} className="text-yellow-400 fill-yellow-400" />
                                </div>
                            </div>
                        ) : (
                            <Star size={size} className="text-gray-300" />
                        )}
                    </button>
                );
            })}
            {!onRate && rating > 0 && (
                <span className="text-[10px] font-black text-gray-400 ml-1 mt-0.5 tracking-tighter">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default StarRating;