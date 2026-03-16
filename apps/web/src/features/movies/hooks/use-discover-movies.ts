import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useMovieStore } from '#/stores/useMovieStore';
import { movieQueries } from '../queries/movie-queries';

export function useDiscoverMovies() {
    const { mood, maxDuration, activeTab } = useMovieStore();
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
        return discoverResponse?.results || [];
    }, [discoverResponse]);

    return {
        movies,
        isDiscoverLoading,
        isDiscoverFetching,
        discoverPage,
        setDiscoverPage,
        discoverTotalPages,
    };
}
