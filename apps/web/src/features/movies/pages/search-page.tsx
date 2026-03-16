import { RefreshCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { movieQueries } from '../queries';
import { MovieCard } from '../components/movie-card';
import type { Movie, SearchPageProps } from '../types';
import { useMovieInteractions, useMovieMutations } from '../hooks';

export function SearchPage({ query }: SearchPageProps) {
    const { data: searchResults, isLoading } = useQuery({
        ...movieQueries.search(query),
        enabled: !!query,
    });

    const { interactions } = useMovieInteractions();
    const { handleWatchToggle, handleRate } = useMovieMutations();

    const movies = searchResults?.results || [];

    return (
        <div className="w-full flex-1 animate-in fade-in duration-500 pb-12 pt-24 md:pt-32">
            <div className="px-4 md:px-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-md mb-8">
                    "{query}" için arama sonuçları
                </h1>

                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <RefreshCcw className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                ) : movies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {movies.map((movie: Movie) => {
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
                    </div>
                ) : (
                    <div className="flex flex-col h-64 items-center justify-center gap-4 bg-muted/30 border border-border rounded-2xl">
                        <div className="text-4xl text-white/50">🔍</div>
                        <p className="text-muted-foreground font-medium text-lg">Buna benzer bir film veya dizi bulamadık.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
