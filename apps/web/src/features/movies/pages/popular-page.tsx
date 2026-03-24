import { useMovieInteractions, useMovieCategories, useMovieMutations } from '../hooks';
import { MovieCard, MovieGridSection } from '../components';
import { RefreshCcw } from 'lucide-react';

import type { Movie } from '../types';

export function PopularPage() {
    const { popularMovies } = useMovieCategories();
    const { interactions } = useMovieInteractions();
    const { handleWatchToggle, handleRate } = useMovieMutations();

    return (
        <div className="w-full flex-1 animate-in fade-in duration-500 pb-12">
            {/* POPULAR HEADER */}
            <div className="px-4 md:px-8 space-y-2 animate-in slide-in-from-top-4 duration-500 pt-20">
                <h1 className="text-3xl md:text-4xl font-black text-foreground drop-shadow-md">Yeni ve Popüler</h1>
                <p className="text-sm font-medium text-muted-foreground">Şu anda dünya çapında trend olan ve en çok ilgi gören filmler.</p>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="px-4 md:px-8 space-y-12 animate-in slide-in-from-bottom-8 fade-in duration-500 pt-8">
                {popularMovies?.length > 0 ? (
                    <MovieGridSection isEmpty={false}>
                        {popularMovies.map((movie: Movie) => {
                            const interaction = interactions?.find(i => i.tmdbMovieId === movie.id);
                            const isWatched = interaction?.isWatched || false;
                            const userRating = interaction?.rating || 0;
                            return (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    isWatched={isWatched}
                                    userRating={userRating}
                                    onWatchToggle={() => handleWatchToggle(movie, isWatched, userRating)}
                                    onRate={(rating) => handleRate(movie, rating)}
                                />
                            );
                        })}
                    </MovieGridSection>
                ) : (
                    <div className="flex h-64 items-center justify-center">
                        <RefreshCcw className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                )}
            </div>
        </div>
    );
}
