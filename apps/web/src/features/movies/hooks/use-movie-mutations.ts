import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { tmdb } from '#/lib/tmdb';
import type { Movie, MovieInteraction } from '../types';
import { movieQueries } from '../queries/movie-queries';

export function useMovieMutations() {
    const queryClient = useQueryClient();

    const updateInteractionOptimistically = useCallback((movie: Movie, newData: Partial<MovieInteraction>) => {
        queryClient.setQueryData(movieQueries.interactions().queryKey, (old: MovieInteraction[] | undefined) => {
            const oldArr = Array.isArray(old) ? old : [];
            const index = oldArr.findIndex((i) => i.tmdbMovieId === movie.id);
            if (index > -1) {
                const newArr = [...oldArr];
                newArr[index] = { ...newArr[index], ...newData, movie };
                return newArr;
            } else {
                return [...oldArr, { tmdbMovieId: movie.id, isWatched: false, ...newData, movie } as MovieInteraction];
            }
        });

        tmdb.saveMovieInteraction(movie.id, newData, movie);
    }, [queryClient]);

    const handleWatchToggle = useCallback((movie: Movie, isWatched: boolean, userRating: number) => {
        updateInteractionOptimistically(movie, { isWatched: !isWatched, rating: userRating || undefined });
    }, [updateInteractionOptimistically]);

    const handleRate = useCallback((movie: Movie, rating: number) => {
        updateInteractionOptimistically(movie, { isWatched: true, rating });
    }, [updateInteractionOptimistically]);

    const handleWatchlistToggle = useCallback((movie: Movie, isInWatchlist: boolean) => {
        updateInteractionOptimistically(movie, { isInWatchlist: !isInWatchlist });
    }, [updateInteractionOptimistically]);

    return {
        handleWatchToggle,
        handleRate,
        handleWatchlistToggle
    };
}
