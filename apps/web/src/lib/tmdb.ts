export const TMDB_API_KEY = import.meta.env['VITE_TMDB_API_KEY'] || '';
export const TMDB_TOKEN = import.meta.env['VITE_TMDB_TOKEN'] || '';
export const TMDB_API_BASE_URL = import.meta.env['VITE_TMDB_API_BASE_URL'] || 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = import.meta.env['VITE_TMDB_IMAGE_BASE_URL'] || 'https://image.tmdb.org/t/p';
import type { Movie, MovieInteraction } from '#/features/movies/types';

const getHeaders = () => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (TMDB_TOKEN) {
        headers['Authorization'] = `Bearer ${TMDB_TOKEN}`;
    }
    return headers;
};

export const tmdb = {
    discover: async (query: { mood?: string; maxDuration?: number; page?: number }) => {
        const fetchPage = async (pageNumber: number) => {
            let url = `${TMDB_API_BASE_URL}/discover/movie?language=tr-TR&sort_by=popularity.desc`;

            if (!TMDB_TOKEN && TMDB_API_KEY) {
                url += `&api_key=${TMDB_API_KEY}`;
            }

            url += `&page=${pageNumber}`;
            if (query.maxDuration) url += `&with_runtime.lte=${query.maxDuration}`;

            if (query.mood) {
                const moodMap: Record<string, string> = {
                    'keyifli': '35,10751',
                    'heyecanli': '28,53',
                    'romantik': '10749',
                    'melankolik': '18',
                    'gizemli': '9648',
                    'sakin': '99,36',
                    'eglenceli': '12,16',
                    'zihin_acici': '878,14'
                };
                const mood = query.mood.toLowerCase();
                const genres = moodMap[mood];
                if (genres) url += `&with_genres=${genres}`;
            }

            const response = await fetch(url, { headers: getHeaders() });
            if (!response.ok) {
                throw new Error('TMDB API Error: ' + response.statusText);
            }
            return response.json();
        };

        const targetPage = query.page || 1;
        const [page1, page2] = await Promise.all([
            fetchPage((targetPage * 2) - 1),
            fetchPage(targetPage * 2)
        ]);

        return {
            page: targetPage,
            results: [...page1.results, ...page2.results].slice(0, 36),
            total_pages: Math.ceil(page1.total_pages / 2),
            total_results: page1.total_results
        };
    },

    getMovieById: async (id: number) => {
        let url = `${TMDB_API_BASE_URL}/movie/${id}?language=tr-TR`;

        if (!TMDB_TOKEN && TMDB_API_KEY) {
            url += `&api_key=${TMDB_API_KEY}`;
        }

        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
            throw new Error('TMDB API Error: ' + response.statusText);
        }
        return response.json();
    },

    getTopRated: async () => {
        let url = `${TMDB_API_BASE_URL}/movie/top_rated?language=tr-TR&page=1`;
        if (!TMDB_TOKEN && TMDB_API_KEY) url += `&api_key=${TMDB_API_KEY}`;
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error('TMDB API Error: ' + response.statusText);
        return response.json();
    },

    getUpcoming: async () => {
        let url = `${TMDB_API_BASE_URL}/movie/upcoming?language=tr-TR&page=1`;
        if (!TMDB_TOKEN && TMDB_API_KEY) url += `&api_key=${TMDB_API_KEY}`;
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error('TMDB API Error: ' + response.statusText);
        return response.json();
    },

    getPopular: async () => {
        let url = `${TMDB_API_BASE_URL}/movie/popular?language=tr-TR&page=1`;
        if (!TMDB_TOKEN && TMDB_API_KEY) url += `&api_key=${TMDB_API_KEY}`;
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error('TMDB API Error: ' + response.statusText);
        return response.json();
    },

    searchMovies: async (query: string) => {
        let url = `${TMDB_API_BASE_URL}/search/movie?language=tr-TR&query=${encodeURIComponent(query)}&page=1`;
        if (!TMDB_TOKEN && TMDB_API_KEY) url += `&api_key=${TMDB_API_KEY}`;
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error('TMDB API Error: ' + response.statusText);
        return response.json();
    },

    getMoviesByGenre: async (genreId: number, page: number = 1) => {
        let url = `${TMDB_API_BASE_URL}/discover/movie?language=tr-TR&sort_by=popularity.desc&page=${page}&with_genres=${genreId}`;
        if (!TMDB_TOKEN && TMDB_API_KEY) url += `&api_key=${TMDB_API_KEY}`;
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error('TMDB API Error: ' + response.statusText);
        return response.json();
    },

    getMovieDetails: async (id: number) => {
        let url = `${TMDB_API_BASE_URL}/movie/${id}?language=tr-TR&append_to_response=credits,videos`;

        if (!TMDB_TOKEN && TMDB_API_KEY) {
            url += `&api_key=${TMDB_API_KEY}`;
        }

        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
            throw new Error('TMDB API Error: ' + response.statusText);
        }
        return response.json();
    },

    getMovieInteractions: () => {
        const data = localStorage.getItem('cinematch_interactions');
        return data ? JSON.parse(data) : [];
    },

    saveMovieInteraction: (tmdbMovieId: number, data: Partial<MovieInteraction>, movieDetails: Movie) => {
        const interactions: MovieInteraction[] = tmdb.getMovieInteractions();
        const existingIndex = interactions.findIndex((i: MovieInteraction) => i.tmdbMovieId === tmdbMovieId);

        if (existingIndex > -1) {
            interactions[existingIndex] = {
                ...interactions[existingIndex],
                ...data,
                movie: movieDetails, // cached minimal details
                updatedAt: new Date().toISOString()
            };
        } else {
            interactions.push({
                tmdbMovieId,
                isWatched: false,
                ...data,
                movie: movieDetails, // cached minimal details
                updatedAt: new Date().toISOString()
            });
        }

        localStorage.setItem('cinematch_interactions', JSON.stringify(interactions));
        return interactions;
    }
};
