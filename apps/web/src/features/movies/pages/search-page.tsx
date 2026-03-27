import { RefreshCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { movieQueries } from '../queries';
import type { Movie, SearchPageProps } from '../types';
import { useMovieInteractions, useMovieMutations } from '../hooks';
import { MovieCard, MovieGridSection, ErrorState } from '../components';

export function SearchPage({ query }: SearchPageProps) {
    const { data: searchResults, isLoading, isError, refetch } = useQuery({
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
                ) : isError ? (
                    <ErrorState onRetry={() => refetch()} />
                ) : (
                    <MovieGridSection
                        isEmpty={movies.length === 0}
                        emptyMessage="Buna benzer bir film veya dizi bulamadık."
                        emptyIcon={<div className="text-4xl text-white/50">🔍</div>}
                    >
                        {movies.map((movie: Movie) => {
                            const interaction = interactions?.find((i: any) => i.tmdbMovieId === movie.id);
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
                )}
            </div>
        </div>
    );
}
