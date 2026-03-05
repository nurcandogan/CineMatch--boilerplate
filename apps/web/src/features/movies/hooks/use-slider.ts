import { useState, useEffect } from 'react';
import type { UseSliderOptions } from '../types';

export function useSlider({ totalItems, intervalDuration = 4000, isEnabled = true }: UseSliderOptions) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slider
    useEffect(() => {
        if (!isEnabled || totalItems === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalItems);
        }, intervalDuration);

        return () => clearInterval(interval);
    }, [totalItems, intervalDuration, isEnabled]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalItems);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalItems) % totalItems);

    return {
        currentSlide,
        nextSlide,
        prevSlide
    };
}
