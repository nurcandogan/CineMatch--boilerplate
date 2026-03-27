import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useMovieStore } from '#/stores/useMovieStore';
import { movieQueries } from '../queries/movie-queries';

export function useMovieCategories() {
    const { mood, maxDuration, activeTab } = useMovieStore();

    // Trending Movies for background slider
    const { data: trendingResponse, isError: isTrendingError, refetch: refetchTrending } = useQuery(movieQueries.trending());
    const trendingMovies = useMemo(() => {
        return trendingResponse?.results?.slice(0, 10) || [];
    }, [trendingResponse]);

    // Categories
    const { data: topRatedResponse, isError: isTopRatedError, refetch: refetchTopRated } = useQuery({
        ...movieQueries.topRated(),
        enabled: activeTab === 'discover' && !mood && !maxDuration
    });

    const { data: upcomingResponse, isError: isUpcomingError, refetch: refetchUpcoming } = useQuery({
        ...movieQueries.upcoming(),
        enabled: activeTab === 'discover' && !mood && !maxDuration
    });

    const { data: popularResponse, isError: isPopularError, refetch: refetchPopular } = useQuery({
        ...movieQueries.popular(),
        enabled: activeTab === 'popular' || (activeTab === 'discover' && !mood && !maxDuration)
    });

    const topRatedMovies = useMemo(() => topRatedResponse?.results || [], [topRatedResponse]);
    const upcomingMovies = useMemo(() => upcomingResponse?.results || [], [upcomingResponse]);
    const popularMovies = useMemo(() => popularResponse?.results || [], [popularResponse]);

    const isCategoriesError = isTrendingError || isTopRatedError || isUpcomingError || isPopularError;
    const refetchCategories = () => {
        refetchTrending();
        refetchTopRated();
        refetchUpcoming();
        refetchPopular();
    };

    return {
        trendingMovies,
        topRatedMovies,
        upcomingMovies,
        popularMovies,
        isCategoriesError,
        refetchCategories
    };
}
