import { memo } from 'react';
import { Eye, Star, Info } from 'lucide-react';
import { cn } from '#/lib/utils';
import { MovieRating } from './movie-rating';
import { useMovieCard } from '../hooks/use-movie-card';
import type { Movie } from '../types';

export interface MovieCardProps {
    movie: Movie;
    isWatched: boolean;
    userRating: number;
    onWatchToggle: () => void;
    onRate: (rating: number) => void;
}

export const MovieCard = memo(function MovieCard({ movie, isWatched, userRating, onWatchToggle, onRate }: MovieCardProps) {
    const {
        isImgLoaded,
        handleCardClick,
        handleWatchClick,
        handleImgLoad,
    } = useMovieCard({ movie, onWatchToggle });

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
                    onLoad={handleImgLoad}
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
                >
                    <button
                        onClick={handleWatchClick}
                        className={cn(
                            "action-btn flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-110 shadow-xl",
                            isWatched ? "bg-green-500 text-white" : "bg-white/20 text-white backdrop-blur-md border border-white/30 hover:bg-white/30"
                        )}
                    >
                        <Eye className="h-5 w-5" />
                    </button>

                    <MovieRating userRating={userRating} onRate={onRate} />
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
}, (prev: MovieCardProps, next: MovieCardProps) => {
    return prev.movie?.id === next.movie?.id &&
        prev.isWatched === next.isWatched &&
        prev.userRating === next.userRating;
});
