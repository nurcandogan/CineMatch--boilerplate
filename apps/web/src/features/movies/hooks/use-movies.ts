import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { tmdb } from '#/lib/tmdb';
import { useMovieStore } from '#/stores/useMovieStore';

export function useMovies() {
    const { mood, maxDuration, activeTab } = useMovieStore();
    const queryClient = useQueryClient();

    // 1. Discover movies with infinite scrolling
    const {
        data: discoverResponse,
        isLoading: isDiscoverLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery({
        queryKey: ['movies-discover', mood, maxDuration],
        queryFn: async ({ pageParam = 1 }) => {
            return await tmdb.discover({ mood, maxDuration: maxDuration || undefined, page: pageParam });
        },
        getNextPageParam: (lastPage) => {
            return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: activeTab === 'discover',
    });

    const movies = discoverResponse?.pages.flatMap(page => page.results) || [];

    // 2. Fetch User Interactions (Watched & Rated)
    const { data: interactionsResponse } = useQuery({
        queryKey: ['movies-interactions'],
        queryFn: () => tmdb.getMovieInteractions(),
    });

    const interactions = Array.isArray(interactionsResponse) ? interactionsResponse : [];
    const watchedMovies = interactions.filter(i => i.isWatched && i.movie);
    const ratedMovies = interactions.filter(i => i.rating && i.movie);

    // 3. Fetch Trending Movies for background slider
    const { data: trendingResponse } = useQuery({
        queryKey: ['movies-trending'],
        queryFn: () => tmdb.discover({}),
    });

    const trendingMovies = trendingResponse?.results?.slice(0, 10) || [];

    // 4. Optimistic Mutators
    const handleWatchToggle = useCallback((movie: any, isWatched: boolean, userRating: number) => {
        const newData = { isWatched: !isWatched, rating: userRating || undefined };

        queryClient.setQueryData(['movies-interactions'], (old: any) => {
            const oldArr = Array.isArray(old) ? old : [];
            const index = oldArr.findIndex((i: any) => i.tmdbMovieId === movie.id);
            if (index > -1) {
                const newArr = [...oldArr];
                newArr[index] = { ...newArr[index], ...newData, movie };
                return newArr;
            } else {
                return [...oldArr, { tmdbMovieId: movie.id, ...newData, movie }];
            }
        });

        tmdb.saveMovieInteraction(movie.id, newData, movie);
    }, [queryClient]);

    const handleRate = useCallback((movie: any, rating: number) => {
        const newData = { isWatched: true, rating };

        queryClient.setQueryData(['movies-interactions'], (old: any) => {
            const oldArr = Array.isArray(old) ? old : [];
            const index = oldArr.findIndex((i: any) => i.tmdbMovieId === movie.id);
            if (index > -1) {
                const newArr = [...oldArr];
                newArr[index] = { ...newArr[index], ...newData, movie };
                return newArr;
            } else {
                return [...oldArr, { tmdbMovieId: movie.id, ...newData, movie }];
            }
        });

        tmdb.saveMovieInteraction(movie.id, newData, movie);
    }, [queryClient]);

    return {
        // State and queries
        movies,
        trendingMovies,
        interactions,
        watchedMovies,
        ratedMovies,

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
