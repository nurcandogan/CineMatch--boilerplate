import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { RefreshCcw } from 'lucide-react';
import { movieQueries } from '../queries/movie-queries';
import { MovieCard } from './movie-card';
import { useInfiniteScroll } from '../hooks/use-infinite-scroll';
import { useMovies } from '../hooks/use-movies';
import type { Movie, GenreRowProps } from '../types';

export function GenreRow({ title, genreId }: GenreRowProps) {
    const { interactions, handleWatchToggle, handleRate } = useMovies();
    const {
        data,
        isLoading,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage
    } = useInfiniteQuery({
        ...movieQueries.byGenre(genreId),
    });

    const movies = useMemo(() => {
        return data?.pages.flatMap(page => page.results) || [];
    }, [data]);

    const { loadMoreRef } = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold px-4 md:px-8 text-white drop-shadow-md">{title}</h2>
                <div className="flex justify-center items-center h-48">
                    <RefreshCcw className="w-8 h-8 animate-spin text-purple-500" />
                </div>
            </div>
        );
    }

    if (!movies.length) return null;

    return (
        <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold px-4 md:px-8 text-white drop-shadow-md">{title}</h2>

            <div className="relative group">
                <div className="flex overflow-x-auto gap-4 px-4 md:px-8 pb-6 pt-2 snap-x scroll-smooth no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {movies.map((movie: Movie, idx: number) => {
                        const interaction = interactions?.find(i => i.tmdbMovieId === movie.id);
                        return (
                            <div key={`${movie.id}-${idx}`} className="min-w-[160px] md:min-w-[200px] lg:min-w-[240px] snap-start">
                                <MovieCard
                                    movie={movie}
                                    isWatched={interaction?.isWatched || false}
                                    userRating={interaction?.rating || 0}
                                    onWatchToggle={() => handleWatchToggle(movie, interaction?.isWatched || false, interaction?.rating || 0)}
                                    onRate={(rating) => handleRate(movie, rating)}
                                />
                            </div>
                        );
                    })}

                    {/* Infinite scroll trigger block */}
                    {hasNextPage && (
                        <div ref={loadMoreRef} className="min-w-[50px] flex justify-center items-center">
                            <RefreshCcw className="w-6 h-6 animate-spin text-white/50" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
