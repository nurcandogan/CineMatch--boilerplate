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
    movie: Movie;
}

export interface DiscoverResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}
