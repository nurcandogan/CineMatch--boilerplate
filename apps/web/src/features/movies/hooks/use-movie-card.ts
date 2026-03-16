import type React from 'react';
import { useMovieStore } from '#/stores/useMovieStore';
import type { UseMovieCardProps } from '../types';

export function useMovieCard({ movie, onWatchToggle }: UseMovieCardProps) {
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

    return {
        handleCardClick,
        handleWatchClick,
    };
}
