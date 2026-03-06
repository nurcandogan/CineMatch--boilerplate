import { RefreshCcw } from 'lucide-react';
import { useMovieStore } from '#/stores/useMovieStore';
import { HeroSlider } from '../components/hero-slider';
import { MovieCard } from '../components/movie-card';
import { useMovies } from '../hooks/use-movies';
import type { Movie } from '../types';

export function ExplorePage() {
    const { mood, maxDuration } = useMovieStore();
    const {
        movies,
        trendingMovies,
        interactions,
        topRatedMovies,
        upcomingMovies,
        popularMovies,
        isDiscoverLoading,
        isDiscoverFetching,
        discoverPage,
        setDiscoverPage,
        discoverTotalPages,
        handleWatchToggle,
        handleRate
    } = useMovies();

    return (
        <div className="w-full flex-1 animate-in fade-in duration-500 pb-12">
            {/* HEROSLIDER DELEGATION */}
            <HeroSlider trendingMovies={trendingMovies} />

            {/* MAIN CONTENT AREA */}
            <div className="space-y-6">
                {isDiscoverLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <RefreshCcw className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                ) : movies.length > 0 ? (
                    <div className="animate-in slide-in-from-bottom-4 duration-500 pt-24 md:pt-32 pb-12">

                        {!mood && !maxDuration && (
                            <div className="space-y-16 mb-12">
                                {/* Popular */}
                                {popularMovies?.length > 0 && (
                                    <div className="space-y-4">
                                        <h2 className="text-xl md:text-2xl font-bold px-4 md:px-8 text-white drop-shadow-md">Popüler Filmler</h2>
                                        <div className="flex overflow-x-auto gap-4 px-4 md:px-8 pb-6 pt-2 snap-x scroll-smooth no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                            {popularMovies.map((movie: Movie) => {
                                                const interaction = interactions?.find(i => i.tmdbMovieId === movie.id);
                                                return (
                                                    <div key={movie.id} className="min-w-[160px] md:min-w-[200px] lg:min-w-[240px] snap-start">
                                                        <MovieCard
                                                            movie={movie}
                                                            isWatched={interaction?.isWatched || false}
                                                            userRating={interaction?.rating || 0}
                                                            onWatchToggle={() => handleWatchToggle(movie, interaction?.isWatched || false, interaction?.rating || 0)}
                                                            onRate={(rating) => handleRate(movie, rating)}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Top Rated */}
                                {topRatedMovies?.length > 0 && (
                                    <div className="space-y-4">
                                        <h2 className="text-xl md:text-2xl font-bold px-4 md:px-8 text-white drop-shadow-md">En Çok Oy Alanlar</h2>
                                        <div className="flex overflow-x-auto gap-4 px-4 md:px-8 pb-6 pt-2 snap-x scroll-smooth no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                            {topRatedMovies.map((movie: Movie) => {
                                                const interaction = interactions?.find(i => i.tmdbMovieId === movie.id);
                                                return (
                                                    <div key={movie.id} className="min-w-[160px] md:min-w-[200px] lg:min-w-[240px] snap-start">
                                                        <MovieCard
                                                            movie={movie}
                                                            isWatched={interaction?.isWatched || false}
                                                            userRating={interaction?.rating || 0}
                                                            onWatchToggle={() => handleWatchToggle(movie, interaction?.isWatched || false, interaction?.rating || 0)}
                                                            onRate={(rating) => handleRate(movie, rating)}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Upcoming */}
                                {upcomingMovies?.length > 0 && (
                                    <div className="space-y-4">
                                        <h2 className="text-xl md:text-2xl font-bold px-4 md:px-8 text-white drop-shadow-md">Yakında Beklenenler</h2>
                                        <div className="flex overflow-x-auto gap-4 px-4 md:px-8 pb-6 pt-2 snap-x scroll-smooth no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                            {upcomingMovies.map((movie: Movie) => {
                                                const interaction = interactions?.find(i => i.tmdbMovieId === movie.id);
                                                return (
                                                    <div key={movie.id} className="min-w-[160px] md:min-w-[200px] lg:min-w-[240px] snap-start">
                                                        <MovieCard
                                                            movie={movie}
                                                            isWatched={interaction?.isWatched || false}
                                                            userRating={interaction?.rating || 0}
                                                            onWatchToggle={() => handleWatchToggle(movie, interaction?.isWatched || false, interaction?.rating || 0)}
                                                            onRate={(rating) => handleRate(movie, rating)}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* FILTRELENMIŞ GRID LISTESI (AŞAĞI SCROLL) */}
                        <div className="px-4 md:px-8">
                            <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-md mb-6">Senin İçin Bulduklarımız</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
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

                            {/* PAGINATION CONTROLS */}
                            {discoverTotalPages > 1 && (
                                <div className="flex justify-center items-center gap-4 mt-12 mb-8">
                                    <button
                                        disabled={discoverPage === 1 || isDiscoverFetching}
                                        onClick={() => { setDiscoverPage((prev: number) => Math.max(1, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 disabled:opacity-50 transition-colors backdrop-blur-sm"
                                    >
                                        Önceki
                                    </button>
                                    <span className="text-white/60 font-medium whitespace-nowrap hidden">...</span>
                                    <button
                                        disabled={discoverPage >= discoverTotalPages || isDiscoverFetching}
                                        onClick={() => { setDiscoverPage((prev: number) => Math.min(discoverTotalPages, prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 disabled:opacity-50 transition-colors backdrop-blur-sm"
                                    >
                                        Sonraki
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-64 items-center justify-center gap-4 bg-muted/30 border border-border rounded-2xl mx-4 md:mx-8">
                        <div className="text-4xl">🍿</div>
                        <p className="text-muted-foreground font-medium">Aradığın kriterlere uygun film bulamadık.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
