import { RefreshCcw, Eye, Star } from 'lucide-react';
import { useMovieStore } from '#/stores/useMovieStore';
import { HeroSlider } from '../components/hero-slider';
import { MovieCard } from '../components/movie-card';
import { MovieDetailsModal } from '../components/movie-details-modal';
import { useMovies } from '../hooks/use-movies';
import { useInfiniteScroll } from '../hooks/use-infinite-scroll';
import type { Movie, MovieInteraction } from '../types';

export function ExplorePage() {
    const { activeTab } = useMovieStore();
    const {
        movies,
        trendingMovies,
        interactions,
        watchedMovies,
        ratedMovies,
        isDiscoverLoading,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        handleWatchToggle,
        handleRate
    } = useMovies();

    const { loadMoreRef } = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage
    });

    return (
        <div className="w-full flex-1 animate-in fade-in duration-500 pb-12">

            {/* HEROSLIDER DELEGATION */}
            {activeTab === 'discover' && <HeroSlider trendingMovies={trendingMovies} />}

            {/* PROFILE HEADER */}
            {activeTab === 'profile' && (
                <div className="px-2 space-y-2 animate-in slide-in-from-top-4 duration-500 pt-20">
                    <h1 className="text-3xl md:text-4xl font-black text-foreground drop-shadow-md">Listem</h1>
                    <p className="text-sm font-medium text-muted-foreground">İzlediğin ve listene eklediğin filmler.</p>
                </div>
            )}

            {/* MAIN CONTENT AREA */}
            <div className="space-y-6">
                {activeTab === 'discover' ? (
                    <>
                        {isDiscoverLoading ? (
                            <div className="flex h-64 items-center justify-center">
                                <RefreshCcw className="w-8 h-8 animate-spin text-purple-500" />
                            </div>
                        ) : movies.length > 0 ? (
                            <div className="animate-in slide-in-from-bottom-4 duration-500 pt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {movies.map((movie: Movie, idx: number) => {
                                        const interaction = interactions?.find(i => i.tmdbMovieId === movie.id);
                                        const isWatched = interaction?.isWatched || false;
                                        const userRating = interaction?.rating || 0;
                                        return (
                                            <MovieCard
                                                key={`${movie.id}-${idx}`}
                                                movie={movie}
                                                isWatched={isWatched}
                                                userRating={userRating}
                                                onWatchToggle={() => handleWatchToggle(movie, isWatched, userRating)}
                                                onRate={(rating) => handleRate(movie, rating)}
                                            />
                                        )
                                    })}
                                </div>

                                {hasNextPage && (
                                    <div ref={loadMoreRef} className="flex justify-center mt-12 mb-8">
                                        <div className="px-8 py-3 rounded-full bg-black/5 dark:bg-white/5 border border-border text-foreground font-bold backdrop-blur-md flex items-center gap-2 shadow-2xl">
                                            <RefreshCcw className="w-5 h-5 animate-spin" /> Yükleniyor...
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col h-64 items-center justify-center gap-4 bg-muted/30 border border-border rounded-2xl">
                                <div className="text-4xl">🍿</div>
                                <p className="text-muted-foreground font-medium">Aradığın kriterlere uygun film bulamadık.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="space-y-12 animate-in slide-in-from-bottom-8 fade-in duration-500 pt-8">
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
                )}
            </div>
            {/* Render Modal */}
            <MovieDetailsModal />
        </div>
    );
}
