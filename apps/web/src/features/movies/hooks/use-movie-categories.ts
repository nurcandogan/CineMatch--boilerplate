import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useMovieStore } from '#/stores/useMovieStore';
import { movieQueries } from '../queries/movie-queries';

export function useMovieCategories() {
    const { mood, maxDuration, activeTab } = useMovieStore();

    // Trending Movies for background slider
    const { data: trendingResponse } = useQuery(movieQueries.trending());
    const trendingMovies = useMemo(() => {
        return trendingResponse?.results?.slice(0, 10) || [];
    }, [trendingResponse]);

    // Categories
    const { data: topRatedResponse } = useQuery({
        ...movieQueries.topRated(),
        enabled: activeTab === 'discover' && !mood && !maxDuration
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

    return {
        trendingMovies,
        topRatedMovies,
        upcomingMovies,
        popularMovies,
    };
}
