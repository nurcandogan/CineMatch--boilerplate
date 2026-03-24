import { Eye, Star, Plus } from 'lucide-react';
import { useMovieInteractions, useMovieMutations } from '../hooks';
import { MovieCard, MovieGridSection } from '../components';
import type { MovieInteraction } from '../types';

export function ProfilePage() {
    const { watchedMovies, ratedMovies, watchlistMovies } = useMovieInteractions();
    const { handleWatchToggle, handleRate } = useMovieMutations();

    return (
        <div className="w-full flex-1 animate-in fade-in duration-500 pb-12">
            {/* PROFILE HEADER */}
            <div className="px-4 md:px-8 space-y-2 animate-in slide-in-from-top-4 duration-500 pt-20">
                <h1 className="text-3xl md:text-4xl font-black text-foreground drop-shadow-md">Listem</h1>
                <p className="text-sm font-medium text-muted-foreground">İzlediğin, puanladığın ve izleyeceğin filmler.</p>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="px-4 md:px-8 space-y-12 animate-in slide-in-from-bottom-8 fade-in duration-500 pt-8">
                {/* İZLEYECEKLERİM */}
                <MovieGridSection
                    title={`İzleyeceklerim (${watchlistMovies.length})`}
                    icon={<Plus className="w-6 h-6 text-blue-500" />}
                    isEmpty={watchlistMovies.length === 0}
                    emptyMessage="Henüz izleyeceklerim listesine film eklemedin."
                >
                    {watchlistMovies.map((interaction: MovieInteraction) => (
                        <MovieCard
                            key={`watchlist-${interaction.tmdbMovieId}`}
                            movie={interaction.movie}
                            isWatched={interaction.isWatched}
                            userRating={interaction.rating || 0}
                            onWatchToggle={() => handleWatchToggle(interaction.movie, interaction.isWatched, interaction.rating || 0)}
                            onRate={(rating) => handleRate(interaction.movie, rating)}
                        />
                    ))}
                </MovieGridSection>

                {/* İZLEDİKLERİM */}
                <MovieGridSection
                    title={`İzlediğin Filmler (${watchedMovies.length})`}
                    icon={<Eye className="w-6 h-6 text-green-500" />}
                    isEmpty={watchedMovies.length === 0}
                    emptyMessage="Henüz izlediğin bir film yok."
                >
                    {watchedMovies.map((interaction: MovieInteraction) => (
                        <MovieCard
                            key={interaction.tmdbMovieId}
                            movie={interaction.movie}
                            isWatched={interaction.isWatched}
                            userRating={interaction.rating || 0}
                            onWatchToggle={() => handleWatchToggle(interaction.movie, interaction.isWatched, interaction.rating || 0)}
                            onRate={(rating) => handleRate(interaction.movie, rating)}
                        />
                    ))}
                </MovieGridSection>

                {/* PUANLADIKLARIM */}
                <MovieGridSection
                    title={`Puanladığın Filmler (${ratedMovies.length})`}
                    icon={<Star className="w-6 h-6 text-yellow-500" />}
                    isEmpty={ratedMovies.length === 0}
                    emptyMessage="Henüz puanladığın bir film yok."
                >
                    {ratedMovies.map((interaction: MovieInteraction) => (
                        <MovieCard
                            key={interaction.tmdbMovieId}
                            movie={interaction.movie}
                            isWatched={interaction.isWatched}
                            userRating={interaction.rating || 0}
                            onWatchToggle={() => handleWatchToggle(interaction.movie, interaction.isWatched, interaction.rating || 0)}
                            onRate={(rating) => handleRate(interaction.movie, rating)}
                        />
                    ))}
                </MovieGridSection>
            </div>
        </div>
    );
}
