import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { tmdb } from '#/lib/tmdb';
import type { DiscoverResponse } from '../types';

export const movieQueries = {
    discover: (mood?: string | null, maxDuration?: number | undefined) =>
        infiniteQueryOptions({
            queryKey: ['movies-discover', mood, maxDuration],
            queryFn: async ({ pageParam = 1 }) => {
                return await tmdb.discover({ mood: mood || undefined, maxDuration: maxDuration || undefined, page: pageParam as number });
            },
            getNextPageParam: (lastPage: DiscoverResponse) => {
                return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
            },
            initialPageParam: 1,
        }),

    interactions: () =>
        queryOptions({
            queryKey: ['movies-interactions'],
            queryFn: () => tmdb.getMovieInteractions(),
        }),

    trending: () =>
        queryOptions({
            queryKey: ['movies-trending'],
            queryFn: () => tmdb.discover({}),
        }),

    topRated: () =>
        queryOptions({
            queryKey: ['movies-top-rated'],
            queryFn: () => tmdb.getTopRated(),
        }),

    upcoming: () =>
        queryOptions({
            queryKey: ['movies-upcoming'],
            queryFn: () => tmdb.getUpcoming(),
        }),

    popular: () =>
        queryOptions({
            queryKey: ['movies-popular'],
            queryFn: () => tmdb.getPopular(),
        }),

    search: (query: string) =>
        queryOptions({
            queryKey: ['movies-search', query],
            queryFn: () => tmdb.searchMovies(query),
            enabled: !!query,
        }),

    byGenre: (genreId: number) =>
        infiniteQueryOptions({
            queryKey: ['movies-genre', genreId],
            queryFn: async ({ pageParam = 1 }) => {
                return await tmdb.getMoviesByGenre(genreId, pageParam as number);
            },
            getNextPageParam: (lastPage: DiscoverResponse) => {
                return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
            },
            initialPageParam: 1,
        }),
};
