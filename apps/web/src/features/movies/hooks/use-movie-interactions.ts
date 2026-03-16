import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { movieQueries } from '../queries/movie-queries';

export function useMovieInteractions() {
    const { data: interactionsResponse } = useQuery(movieQueries.interactions());

    const interactions = useMemo(() => {
        return Array.isArray(interactionsResponse) ? interactionsResponse : [];
    }, [interactionsResponse]);

    const watchedMovies = useMemo(() => {
        return interactions.filter(i => i.isWatched && i.movie);
    }, [interactions]);

    const ratedMovies = useMemo(() => {
        return interactions.filter(i => i.rating && i.movie);
    }, [interactions]);

    const watchlistMovies = useMemo(() => {
        return interactions.filter(i => i.isInWatchlist && i.movie);
    }, [interactions]);

    return {
        interactions,
        watchedMovies,
        ratedMovies,
        watchlistMovies,
    };
}
