import { useState, memo } from 'react';
import { Eye, Star, Info } from 'lucide-react';
import { cn } from '#/lib/utils';
import { useMovieStore } from '#/stores/useMovieStore';
import type { Movie } from '../types';

export interface MovieCardProps {
    movie: Movie;
    isWatched: boolean;
    userRating: number;
    onWatchToggle: () => void;
    onRate: (rating: number) => void;
}

export const MovieCard = memo(function MovieCard({ movie, isWatched, userRating, onWatchToggle, onRate }: MovieCardProps) {
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const [isImgLoaded, setIsImgLoaded] = useState(false);
    const { setSelectedMovieId } = useMovieStore();

    const handleRating = (rating: number) => {
        onRate(rating);
        setIsRatingOpen(false);
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Detay açma işlemini eğer herhangi bir .action-btn elementine tıklandıysa engelle (ikinci bir güvenlik katmanı)
        if ((e.target as HTMLElement).closest('.action-btn')) return;

        setSelectedMovieId(movie.id);
    };

    const onWatchClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onWatchToggle();
    };

    const onRatingToggleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsRatingOpen((prev) => !prev);
    };

    const onStarRateClick = (e: React.MouseEvent, star: number) => {
        e.preventDefault();
        e.stopPropagation();
        handleRating(star);
    };

    const posterUrl = movie?.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Poster';

    return (
        <div
            onClick={handleCardClick}
            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-muted/20 dark:bg-black/40 border border-border hover:border-primary/50 shadow-sm hover:shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
        >
            {/* Aspect Ratio 2:3 */}
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted/40 dark:bg-muted/10">
                {!isImgLoaded && (
                    <div className="absolute inset-0 bg-muted-foreground/10 animate-pulse z-0" />
                )}
                <img
                    src={posterUrl}
                    alt={movie?.title || 'Movie'}
                    onLoad={() => setIsImgLoaded(true)}
                    className={cn(
                        "h-full w-full object-cover transition-all duration-700 z-0 relative",
                        isImgLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0 scale-95"
                    )}
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Floating Rating Badge */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 backdrop-blur-md border border-white/10 shadow-lg">
                    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-bold text-white tracking-wide">{movie?.vote_average?.toFixed(1) || '0.0'}</span>
                </div>

                {/* Hover Actions */}
                <div
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-black/50 backdrop-blur-[2px]"
                    onMouseLeave={() => setIsRatingOpen(false)}
                >
                    <button
                        onClick={onWatchClick}
                        className={cn(
                            "action-btn flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-110 shadow-xl",
                            isWatched ? "bg-green-500 text-white" : "bg-white/20 text-white backdrop-blur-md border border-white/30 hover:bg-white/30"
                        )}
                    >
                        <Eye className="h-5 w-5" />
                    </button>

                    <div className="relative flex items-center justify-center w-12 h-12">
                        <button
                            onClick={onRatingToggleClick}
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
                                        onClick={(e) => onStarRateClick(e, star)}
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
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full z-30 p-4 md:p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-bold text-white line-clamp-1 mb-1 drop-shadow-md">
                    {movie?.title}
                </h3>
                <p className="text-xs font-medium text-white/80 line-clamp-2 mb-2 drop-shadow-sm">
                    {movie?.overview || "Filmin açıklaması bulunmuyor."}
                </p>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-white/60 font-semibold uppercase tracking-wider">
                    <span>{movie?.release_date ? new Date(movie.release_date).getFullYear() : 'Bilinmiyor'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-primary-400 dark:text-purple-400">
                        <Info className="h-3 w-3" /> Detaylar
                    </span>
                </div>
            </div>
        </div>
    );
}, (prev, next) => {
    return prev.movie?.id === next.movie?.id &&
        prev.isWatched === next.isWatched &&
        prev.userRating === next.userRating;
});
