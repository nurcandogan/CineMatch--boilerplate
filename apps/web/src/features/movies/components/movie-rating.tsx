import { Star } from 'lucide-react';
import { cn } from '#/lib/utils';
import { useMovieRating } from '../hooks/use-movie-rating';

interface MovieRatingProps {
    userRating: number;
    onRate: (rating: number) => void;
    onClose?: () => void;
}

export function MovieRating({ userRating, onRate, onClose }: MovieRatingProps) {
    const {
        isRatingOpen,
        handleRatingToggleClick,
        handleStarRateClick,
        handleMouseLeave,
    } = useMovieRating({ onRate, onClose });

    return (
        <div
            className="relative flex items-center justify-center w-12 h-12"
            onMouseLeave={handleMouseLeave}
        >
            <button
                onClick={handleRatingToggleClick}
                className={cn(
                    "action-btn flex h-12 w-12 items-center justify-center rounded-full transition-transform shadow-xl",
                    userRating > 0 ? "bg-yellow-500 text-black" : "bg-white/20 text-white backdrop-blur-md border border-white/30 hover:bg-white/30",
                    isRatingOpen ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100 hover:scale-110"
                )}
            >
                <Star className={cn("h-5 w-5", userRating > 0 && "fill-current")} />
            </button>

            {/* Rating Stars Expandable */}
            {isRatingOpen && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center h-14 gap-2 rounded-full bg-black/95 px-5 py-2 backdrop-blur-xl border border-white/20 animate-in zoom-in-95 fade-in duration-200 shadow-[0_10_40px_rgba(0,0,0,0.8)] z-50">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={(e) => handleStarRateClick(e, star)}
                            className="action-btn group/star p-1 hover:scale-125 transition-transform"
                        >
                            <Star className={cn(
                                "h-6 w-6 transition-all duration-200",
                                star <= userRating
                                    ? "fill-yellow-500 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]"
                                    : "text-white/40 group-hover/star:text-yellow-400 group-hover/star:drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                            )} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
