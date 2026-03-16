import type React from 'react';
import { useState } from 'react';
import type { UseMovieRatingProps } from '../types';

export function useMovieRating({ onRate, onClose }: UseMovieRatingProps) {
    const [isRatingOpen, setIsRatingOpen] = useState(false);

    const handleRating = (rating: number) => {
        onRate(rating);
        setIsRatingOpen(false);
    };

    const handleRatingToggleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsRatingOpen((prev) => !prev);
    };

    const handleStarRateClick = (e: React.MouseEvent, star: number) => {
        e.preventDefault();
        e.stopPropagation();
        handleRating(star);
    };

    const handleMouseLeave = () => {
        setIsRatingOpen(false);
        onClose?.();
    };

    return {
        isRatingOpen,
        handleRatingToggleClick,
        handleStarRateClick,
        handleMouseLeave,
    };
}
