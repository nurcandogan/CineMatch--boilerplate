import { useState } from 'react';
import { useMovieStore } from '#/stores/useMovieStore';
import type { Movie } from '../types';

interface UseMovieCardProps {
    movie: Movie;
    onWatchToggle: () => void;
}

export function useMovieCard({ movie, onWatchToggle }: UseMovieCardProps) {
    const [isImgLoaded, setIsImgLoaded] = useState(false);
    const { setSelectedMovieId } = useMovieStore();

    const handleCardClick = (e: React.MouseEvent) => {
        // Detay açma işlemini eğer herhangi bir .action-btn elementine tıklandıysa engelle (ikinci bir güvenlik katmanı)
        if ((e.target as HTMLElement).closest('.action-btn')) return;

        setSelectedMovieId(movie.id);
    };

    const handleWatchClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onWatchToggle();
    };

    const handleImgLoad = () => {
        setIsImgLoaded(true);
    };

    return {
        isImgLoaded,
        handleCardClick,
        handleWatchClick,
        handleImgLoad,
    };
}
