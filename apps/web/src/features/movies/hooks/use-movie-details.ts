import { useQuery } from '@tanstack/react-query';
import { useMovieStore } from '#/stores/useMovieStore';
import { tmdb } from '#/lib/tmdb';
import { useMovies } from './use-movies';

export function useMovieDetails() {
    const { selectedMovieId, setSelectedMovieId } = useMovieStore();
    const { interactions, handleWatchToggle } = useMovies();

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

    const closeDetails = () => setSelectedMovieId(null);

    const toggleWatch = () => {
        if (movie) {
            handleWatchToggle(movie as any, isWatched, userRating);
        }
    };

    return {
        selectedMovieId,
        movie,
        isLoading,
        isWatched,
        userRating,
        closeDetails,
        toggleWatch,
    };
}
