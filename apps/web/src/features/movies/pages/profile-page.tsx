import { Eye, Star, Plus } from 'lucide-react';
import { useMovies } from '../hooks/use-movies';
import { MovieCard } from '../components/movie-card';
import type { MovieInteraction } from '../types';

export function ProfilePage() {
    const { watchedMovies, ratedMovies, watchlistMovies, handleWatchToggle, handleRate } = useMovies();

    return (
        <div className="w-full flex-1 animate-in fade-in duration-500 pb-12">
            {/* PROFILE HEADER */}
            <div className="px-2 space-y-2 animate-in slide-in-from-top-4 duration-500 pt-20">
                <h1 className="text-3xl md:text-4xl font-black text-foreground drop-shadow-md">Listem</h1>
                <p className="text-sm font-medium text-muted-foreground">İzlediğin, puanladığın ve izleyeceğin filmler.</p>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="space-y-12 animate-in slide-in-from-bottom-8 fade-in duration-500 pt-8">
                {/* İZLEYECEKLERİM */}
                <div className="space-y-6">
                    <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 px-2 text-foreground">
                        <Plus className="w-6 h-6 text-blue-500" />
                        İzleyeceklerim ({watchlistMovies.length})
                    </h2>
                    {watchlistMovies.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
                        </div>
                    ) : (
                        <div className="flex h-32 items-center justify-center bg-muted/30 border border-border rounded-2xl">
                            <p className="text-muted-foreground font-medium">Henüz izleyeceklerim listesine film eklemedin.</p>
                        </div>
                    )}
                </div>

                {/* İZLEDİKLERİM */}
                <div className="space-y-6">
                    <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 px-2 text-foreground">
                        <Eye className="w-6 h-6 text-green-500" />
                        İzlediğin Filmler ({watchedMovies.length})
                    </h2>
                    {watchedMovies.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
                        </div>
                    ) : (
                        <div className="flex h-32 items-center justify-center bg-muted/30 border border-border rounded-2xl">
                            <p className="text-muted-foreground font-medium">Henüz izlediğin bir film yok.</p>
                        </div>
                    )}
                </div>

                {/* PUANLADIKLARIM */}
                <div className="space-y-6">
                    <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 px-2 text-foreground">
                        <Star className="w-6 h-6 text-yellow-500" />
                        Puanladığın Filmler ({ratedMovies.length})
                    </h2>
                    {ratedMovies.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
                        </div>
                    ) : (
                        <div className="flex h-32 items-center justify-center bg-muted/30 border border-border rounded-2xl">
                            <p className="text-muted-foreground font-medium">Henüz puanladığın bir film yok.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
