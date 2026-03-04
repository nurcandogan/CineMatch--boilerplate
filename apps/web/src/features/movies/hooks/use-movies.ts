import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { tmdb } from '#/lib/tmdb';
import { useMovieStore } from '#/stores/useMovieStore';
import type { Movie, MovieInteraction } from '../types';
import { movieQueries } from '../queries/movie-queries';

export function useMovies() {
    const { mood, maxDuration, activeTab } = useMovieStore();
    const queryClient = useQueryClient();

    const {
        data: discoverResponse,
        isLoading: isDiscoverLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery({
        ...movieQueries.discover(mood, maxDuration),
        enabled: activeTab === 'discover',
    });

    const movies = useMemo(() => {
        return discoverResponse?.pages.flatMap(page => page.results) || [];
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
    const updateInteractionOptimistically = useCallback((movie: Movie, newData: { isWatched: boolean; rating?: number }) => {
        queryClient.setQueryData(movieQueries.interactions().queryKey, (old: MovieInteraction[] | undefined) => {
            const oldArr = Array.isArray(old) ? old : [];
            const index = oldArr.findIndex((i) => i.tmdbMovieId === movie.id);
            if (index > -1) {
                const newArr = [...oldArr];
                newArr[index] = { ...newArr[index], ...newData, movie };
                return newArr;
            } else {
                return [...oldArr, { tmdbMovieId: movie.id, ...newData, movie } as MovieInteraction];
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

    return {
        // State and queries
        movies,
        trendingMovies,
        interactions,
        watchedMovies,
        ratedMovies,
        topRatedMovies,
        upcomingMovies,
        popularMovies,

        // Loaders & Pagination
        isDiscoverLoading,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,

        // Actions
        handleWatchToggle,
        handleRate
    };
}
