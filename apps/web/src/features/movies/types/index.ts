import type { ElementType } from 'react';

// ==================== MOVIE DATA TYPES ====================

export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
}

export interface MovieDetails extends Movie {
    genres: { id: number; name: string }[];
    runtime: number;
    credits: {
        cast: Cast[];
    };
    videos: {
        results: Video[];
    };
}

export interface MovieInteraction {
    tmdbMovieId: number;
    isWatched: boolean;
    rating?: number;
    isInWatchlist?: boolean;
    movie: Movie;
    updatedAt?: string;
}

export interface DiscoverResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

// ==================== COMPONENT PROPS ====================

export interface GenreRowProps {
    title: string;
    genreId: number;
}

export interface HeroSliderProps {
    trendingMovies: Movie[];
}

export interface MoodButtonProps {
    label: string;
    icon: ElementType;
    isActive: boolean;
    onClick: () => void;
}

export interface MovieCardProps {
    movie: Movie;
    isWatched: boolean;
    userRating: number;
    onWatchToggle: () => void;
    onRate: (rating: number) => void;
}

export interface MovieDetailsModalProps {
    isOpen: boolean;
    movie: MovieDetails | null | undefined;
    isLoading: boolean;
    isWatched: boolean;
    isInWatchlist: boolean;
    onClose: () => void;
    onWatchToggle: () => void;
    onWatchlistToggle: () => void;
}

export interface MovieRatingProps {
    userRating: number;
    onRate: (rating: number) => void;
    onClose?: () => void;
}

// ==================== HOOK TYPES ====================

export interface UseInfiniteScrollOptions {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
}

export interface UseMovieCardProps {
    movie: Movie;
    onWatchToggle: () => void;
}

export interface UseMovieRatingProps {
    onRate: (rating: number) => void;
    onClose?: () => void;
}

export interface UseSliderOptions {
    totalItems: number;
    intervalDuration?: number;
    isEnabled?: boolean;
}

// ==================== PAGE PROPS ====================

export interface SearchPageProps {
    query: string;
}
