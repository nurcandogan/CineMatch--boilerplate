import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { tmdb } from '#/lib/tmdb';
import { useMovieStore } from '#/stores/useMovieStore';
import type { Movie, MovieInteraction } from '../types';
import { movieQueries } from '../queries/movie-queries';

export function useMovies() {
    const { mood, maxDuration, activeTab } = useMovieStore();
    const queryClient = useQueryClient();

    const [discoverPage, setDiscoverPage] = useState(1);

    const {
        data: discoverResponse,
        isLoading: isDiscoverLoading,
        isFetching: isDiscoverFetching
    } = useQuery({
        ...movieQueries.discover(mood, maxDuration, discoverPage),
        enabled: activeTab === 'discover',
    });

    const discoverTotalPages = discoverResponse?.total_pages || 1;

    const movies = useMemo(() => {
        const allMovies = discoverResponse?.results || [];
        return allMovies;
    }, [discoverResponse]);

    // 2. Fetch User Interactions (Watched & Rated)
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

    // 3. Fetch Trending Movies for background slider
    const { data: trendingResponse } = useQuery(movieQueries.trending());

    const trendingMovies = useMemo(() => {
        return trendingResponse?.results?.slice(0, 10) || [];
    }, [trendingResponse]);

    // 3.5. Fetch Categories
    const { data: topRatedResponse } = useQuery({
        ...movieQueries.topRated(),
        enabled: activeTab === 'discover' && !mood && !maxDuration // Sadece filtreleme yokken çek
    });
    const { data: upcomingResponse } = useQuery({
        ...movieQueries.upcoming(),
        enabled: activeTab === 'discover' && !mood && !maxDuration
    });
    const { data: popularResponse } = useQuery({
        ...movieQueries.popular(),
        enabled: activeTab === 'popular' || (activeTab === 'discover' && !mood && !maxDuration)
    });

    const topRatedMovies = useMemo(() => topRatedResponse?.results || [], [topRatedResponse]);
    const upcomingMovies = useMemo(() => upcomingResponse?.results || [], [upcomingResponse]);
    const popularMovies = useMemo(() => popularResponse?.results || [], [popularResponse]);

    // 4. Optimistic Mutators helper
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
        // State and queries
        movies,
        trendingMovies,
        interactions,
        watchedMovies,
        ratedMovies,
        watchlistMovies,
        topRatedMovies,
        upcomingMovies,
        popularMovies,

        // Loaders & Pagination
        isDiscoverLoading,
        isDiscoverFetching,
        discoverPage,
        setDiscoverPage,
        discoverTotalPages,

        // Actions
        handleWatchToggle,
        handleRate,
        handleWatchlistToggle
    };
}
