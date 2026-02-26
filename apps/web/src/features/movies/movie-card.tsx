import { useState } from 'react';
import { Eye, Star, Info } from 'lucide-react';
import { cn } from '#/lib/utils';
import { api } from '#/lib/api';

export function MovieCard({ movie, interactions, onInteract }: { movie: any, interactions: any[], onInteract: () => void }) {
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const interaction = interactions.find(i => i.tmdbMovieId === movie.id);
    const isWatched = interaction?.isWatched || false;
    const userRating = interaction?.rating || 0;

    const handleWatchToggle = async () => {
        await api.movies({ tmdbMovieId: movie.id }).interact.post({
            isWatched: !isWatched,
            rating: userRating || undefined,
        });
        onInteract();
    };

    const handleRating = async (rating: number) => {
        await api.movies({ tmdbMovieId: movie.id }).interact.post({
            isWatched: true, // Auto watch if rated
            rating: rating,
        });
        setIsRatingOpen(false);
        onInteract();
    };

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Poster';

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-black/40 border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_8px_40px_rgba(120,0,255,0.2)]">
            {/* Aspect Ratio 2:3 */}
            <div className="relative aspect-[2/3] w-full overflow-hidden">
                <img
                    src={posterUrl}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

                {/* Floating Rating Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 backdrop-blur-md border border-white/10">
                    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-medium text-white">{movie.vote_average?.toFixed(1)}</span>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 transition-all duration-300 group-hover:opacity-100 bg-black/40 backdrop-blur-[2px]">
                    <button
                        onClick={handleWatchToggle}
                        className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-110 shadow-lg",
                            isWatched ? "bg-green-500/90 text-white" : "bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20"
                        )}
                    >
                        <Eye className="h-5 w-5" />
                    </button>

                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => setIsRatingOpen(!isRatingOpen)}
                            className={cn(
                                "flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-110 shadow-lg",
                                userRating > 0 ? "bg-yellow-500/90 text-black" : "bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20"
                            )}
                        >
                            <Star className={cn("h-5 w-5", userRating > 0 && "fill-current")} />
                        </button>

                        {/* Rating Stars Expandable */}
                        {isRatingOpen && (
                            <div className="flex gap-1 rounded-full bg-black/80 px-3 py-2 backdrop-blur-xl border border-white/10 animate-in fade-in zoom-in duration-200">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => handleRating(star)}
                                        className="hover:scale-125 transition-transform"
                                    >
                                        <Star className={cn(
                                            "h-4 w-4",
                                            star <= userRating ? "fill-yellow-500 text-yellow-500" : "text-white/40 hover:text-yellow-400"
                                        )} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold text-white line-clamp-1 mb-1 shadow-black drop-shadow-md">
                    {movie.title}
                </h3>
                <p className="text-sm font-medium text-white/70 line-clamp-2 md:line-clamp-3 mb-2">
                    {movie.overview}
                </p>
                <div className="flex items-center gap-2 text-xs text-white/50 font-medium">
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-purple-400">
                        <Info className="h-3 w-3" /> Info
                    </span>
                </div>
            </div>
        </div>
    );
}
