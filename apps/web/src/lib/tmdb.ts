export const TMDB_API_KEY = import.meta.env['VITE_TMDB_API_KEY'] || '';
export const TMDB_TOKEN = import.meta.env['VITE_TMDB_TOKEN'] || '';

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
        let url = "https://api.themoviedb.org/3/discover/movie?language=tr-TR&sort_by=popularity.desc";

        if (!TMDB_TOKEN && TMDB_API_KEY) {
            url += `&api_key=${TMDB_API_KEY}`;
        }

        if (query.page) url += `&page=${query.page}`;
        if (query.maxDuration) url += `&with_runtime.lte=${query.maxDuration}`;

        // TMDB genre mapping
        if (query.mood) {
            const moodMap: Record<string, string> = {
                'keyifli': '35,10751', // Comedy, Family
                'heyecanli': '28,53', // Action, Thriller
                'romantik': '10749', // Romance
                'melankolik': '18', // Drama
                'gizemli': '9648', // Mystery
                'sakin': '99,36', // Documentary, History
                'eglenceli': '12,16', // Adventure, Animation
                'zihin_acici': '878,14' // Sci-Fi, Fantasy
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
    },

    getMovieById: async (id: number) => {
        let url = `https://api.themoviedb.org/3/movie/${id}?language=tr-TR`;

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
        let url = "https://api.themoviedb.org/3/movie/top_rated?language=tr-TR&page=1";
        if (!TMDB_TOKEN && TMDB_API_KEY) url += `&api_key=${TMDB_API_KEY}`;
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error('TMDB API Error: ' + response.statusText);
        return response.json();
    },

    getUpcoming: async () => {
        let url = "https://api.themoviedb.org/3/movie/upcoming?language=tr-TR&page=1";
        if (!TMDB_TOKEN && TMDB_API_KEY) url += `&api_key=${TMDB_API_KEY}`;
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error('TMDB API Error: ' + response.statusText);
        return response.json();
    },

    getPopular: async () => {
        let url = "https://api.themoviedb.org/3/movie/popular?language=tr-TR&page=1";
        if (!TMDB_TOKEN && TMDB_API_KEY) url += `&api_key=${TMDB_API_KEY}`;
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error('TMDB API Error: ' + response.statusText);
        return response.json();
    },

    getMovieDetails: async (id: number) => {
        let url = `https://api.themoviedb.org/3/movie/${id}?language=tr-TR&append_to_response=credits,videos`;

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

    saveMovieInteraction: (tmdbMovieId: number, data: { isWatched: boolean; rating?: number }, movieDetails: any) => {
        const interactions = tmdb.getMovieInteractions();
        const existingIndex = interactions.findIndex((i: any) => i.tmdbMovieId === tmdbMovieId);

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
                ...data,
                movie: movieDetails, // cached minimal details
                updatedAt: new Date().toISOString()
            });
        }

        localStorage.setItem('cinematch_interactions', JSON.stringify(interactions));
        return interactions;
    }
};
