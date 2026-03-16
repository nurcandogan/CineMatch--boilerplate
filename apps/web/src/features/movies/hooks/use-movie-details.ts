import { useQuery } from '@tanstack/react-query';
import { useMovieStore } from '#/stores/useMovieStore';
import { tmdb } from '#/lib/tmdb';
import { useMovieInteractions, useMovieMutations } from '../hooks';
import type { Movie } from '../types';

export function useMovieDetails() {
    const { selectedMovieId, setSelectedMovieId } = useMovieStore();
    const { interactions } = useMovieInteractions();
    const { handleWatchToggle, handleWatchlistToggle } = useMovieMutations();

    const { data: movie, isLoading } = useQuery({
        queryKey: ['movie-details', selectedMovieId],
        queryFn: async () => {
            if (!selectedMovieId) return null;
            return await tmdb.getMovieDetails(selectedMovieId);
        },
        enabled: !!selectedMovieId,
    });

    const interaction = interactions?.find(i => i.tmdbMovieId === selectedMovieId);
    const isWatched = interaction?.isWatched || false;
    const userRating = interaction?.rating || 0;
    const isInWatchlist = interaction?.isInWatchlist || false;

    const closeDetails = () => setSelectedMovieId(null);

    const toggleWatch = () => {
        if (movie) {
            handleWatchToggle(movie as Movie, isWatched, userRating);
        }
    };

    const toggleWatchlist = () => {
        if (movie) {
            handleWatchlistToggle(movie as Movie, isInWatchlist);
        }
    };

    return {
        selectedMovieId,
        movie,
        isLoading,
        isWatched,
        userRating,
        isInWatchlist,
        closeDetails,
        toggleWatch,
        toggleWatchlist,
    };
}
