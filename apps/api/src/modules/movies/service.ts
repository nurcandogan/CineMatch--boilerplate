import prisma from '@onlyjs/db';

export abstract class MoviesService {
    static async discover(query: { mood?: string; maxDuration?: number; page?: number }) {
        let url = "https://api.themoviedb.org/3/discover/movie?language=tr-TR&sort_by=popularity.desc";

        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        // Auth configuration
        if (process.env.TMDB_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.TMDB_TOKEN}`;
        } else if (process.env.TMDB_API_KEY) {
            url += `&api_key=${process.env.TMDB_API_KEY}`;
        }

        if (query.page) url += `&page=${query.page}`;
        if (query.maxDuration) url += `&with_runtime.lte=${query.maxDuration}`;

        // TMDB genre mapping
        if (query.mood) {
            const moodMap: Record<string, string> = {
                'rahat': '35,10751', // Comedy, Family
                'hareketli': '28,53', // Action, Thriller
                'duygusal': '18,10749', // Drama, Romance
                'gizemli': '9648,878' // Mystery, Sci-Fi
            };
            const mood = query.mood.toLowerCase();
            const genres = moodMap[mood];
            if (genres) url += `&with_genres=${genres}`;
        }

        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error('TMDB API Error: ' + response.statusText);
        }
        return response.json();
    }

    static async interact(userId: string, tmdbMovieId: number, data: { isWatched: boolean; rating?: number }) {
        return prisma.userMovieInteraction.upsert({
            where: {
                userId_tmdbMovieId: {
                    userId,
                    tmdbMovieId
                }
            },
            update: {
                isWatched: data.isWatched,
                rating: data.rating
            },
            create: {
                userId,
                tmdbMovieId,
                isWatched: data.isWatched,
                rating: data.rating
            }
        });
    }

    static async getMovieById(id: number) {
        let url = `https://api.themoviedb.org/3/movie/${id}?language=tr-TR`;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        if (process.env.TMDB_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.TMDB_TOKEN}`;
        } else if (process.env.TMDB_API_KEY) {
            url += `&api_key=${process.env.TMDB_API_KEY}`;
        }

        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error('TMDB API Error: ' + response.statusText);
        }
        return response.json();
    }

    static async getInteractionsWithDetails(userId: string) {
        const interactions = await prisma.userMovieInteraction.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            select: {
                tmdbMovieId: true,
                isWatched: true,
                rating: true,
                updatedAt: true
            }
        });

        // Enrich with TMDB Data
        const enriched = await Promise.all(
            interactions.map(async (interaction) => {
                try {
                    const movieDetails = await this.getMovieById(interaction.tmdbMovieId);
                    return {
                        ...interaction,
                        movie: movieDetails
                    };
                } catch (err) {
                    return {
                        ...interaction,
                        movie: null
                    };
                }
            })
        );
        return enriched;
    }
}
