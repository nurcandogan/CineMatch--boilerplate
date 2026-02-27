import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Flame, Laugh, Ghost, Heart, Clock, Clapperboard, RefreshCcw, UserCircle, PlaySquare, Eye, Star, ChevronLeft, ChevronRight, Zap, Cloud, Coffee, Lightbulb, PartyPopper, Smile } from 'lucide-react';
import { tmdb } from '#/lib/tmdb';
import { useMovieStore } from '#/stores/useMovieStore';
import { MovieCard } from './components/movie-card';
import { MoodButton } from './components/mood-button';
import { cn } from '#/lib/utils';
import { useState, useEffect, useRef, useCallback } from 'react';

const MOODS = [
    { id: 'keyifli', label: 'Keyifli', icon: Smile, color: 'from-orange-400 to-yellow-400' },
    { id: 'heyecanli', label: 'Heyecanlı', icon: Zap, color: 'from-red-500 to-rose-600' },
    { id: 'romantik', label: 'Romantik', icon: Heart, color: 'from-pink-500 to-rose-400' },
    { id: 'melankolik', label: 'Melankolik', icon: Cloud, color: 'from-purple-500 to-indigo-500' },
    { id: 'gizemli', label: 'Gizemli', icon: Ghost, color: 'from-indigo-600 to-blue-700' },
    { id: 'sakin', label: 'Sakin', icon: Coffee, color: 'from-teal-400 to-emerald-500' },
    { id: 'eglenceli', label: 'Eğlenceli', icon: PartyPopper, color: 'from-yellow-400 to-orange-500' },
    { id: 'zihin_acici', label: 'Zihin Açıcı', icon: Lightbulb, color: 'from-blue-400 to-cyan-500' },
];

export function ExploreMovies() {
    const { mood, maxDuration, activeTab, setMood, setMaxDuration } = useMovieStore();
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    // Discover Query with Infinite Scrolling
    const {
        data: discoverResponse,
        isLoading: isDiscoverLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery({
        queryKey: ['movies-discover', mood, maxDuration],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await tmdb.discover({ mood, maxDuration: maxDuration || undefined, page: pageParam });
            return res;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: activeTab === 'discover',
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1, rootMargin: '400px' }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    // User Interactions Query
    const { data: interactionsResponse } = useQuery({
        queryKey: ['movies-interactions'],
        queryFn: async () => {
            const res = tmdb.getMovieInteractions();
            return res;
        },
    });

    // Trending Query for Background Slider
    const { data: trendingResponse } = useQuery({
        queryKey: ['movies-trending'],
        queryFn: async () => {
            const res = await tmdb.discover({});
            return res;
        },
    });

    const trendingMovies = trendingResponse?.results?.slice(0, 10) || [];
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slider
    useEffect(() => {
        if (trendingMovies.length === 0 || activeTab !== 'discover') return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % trendingMovies.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [trendingMovies.length, activeTab]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % trendingMovies.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + trendingMovies.length) % trendingMovies.length);

    const handleWatchToggle = useCallback((movie: any, isWatched: boolean, userRating: number) => {
        const newData = { isWatched: !isWatched, rating: userRating || undefined };

        // 1. Optimistic UI Update (Anında arayüzü kasmadan günceller)
        queryClient.setQueryData(['movies-interactions'], (old: any) => {
            const oldArr = Array.isArray(old) ? old : [];
            const index = oldArr.findIndex((i: any) => i.tmdbMovieId === movie.id);
            if (index > -1) {
                const newArr = [...oldArr];
                newArr[index] = { ...newArr[index], ...newData, movie };
                return newArr;
            } else {
                return [...oldArr, { tmdbMovieId: movie.id, ...newData, movie }];
            }
        });

        // 2. Background Task (Sessizce LocalStorage veya API'ye yazar)
        tmdb.saveMovieInteraction(movie.id, newData, movie);
    }, [queryClient]);

    const handleRate = useCallback((movie: any, rating: number) => {
        const newData = { isWatched: true, rating };

        // 1. Optimistic UI Update
        queryClient.setQueryData(['movies-interactions'], (old: any) => {
            const oldArr = Array.isArray(old) ? old : [];
            const index = oldArr.findIndex((i: any) => i.tmdbMovieId === movie.id);
            if (index > -1) {
                const newArr = [...oldArr];
                newArr[index] = { ...newArr[index], ...newData, movie };
                return newArr;
            } else {
                return [...oldArr, { tmdbMovieId: movie.id, ...newData, movie }];
            }
        });

        // 2. Background Task
        tmdb.saveMovieInteraction(movie.id, newData, movie);
    }, [queryClient]);

    const movies = discoverResponse?.pages.flatMap(page => page.results) || [];
    // Ensure we get an array, and handle cases where it might be structured differently due to generic types
    const interactions = Array.isArray(interactionsResponse) ? interactionsResponse : [];

    const watchedMovies = interactions.filter(i => i.isWatched && i.movie);
    const ratedMovies = interactions.filter(i => i.rating && i.movie);

    return (
        <div className="w-full flex-1 animate-in fade-in duration-500 pb-12">

            {/* 🎥 FULLSCREEN HOME HERO SLIDER */}
            {activeTab === 'discover' && (
                <div className="-mx-4 md:-mx-10 lg:-mx-16 -mt-16 relative min-h-screen flex items-center justify-center overflow-hidden bg-black">

                    {/* Background Images */}
                    {trendingMovies.map((movie: any, idx: number) => {
                        const bgUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
                        return (
                            <div
                                key={movie.id}
                                className={cn(
                                    "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out",
                                    idx === currentSlide ? "opacity-100 z-0" : "opacity-0 -z-10"
                                )}
                            >
                                <img src={bgUrl} alt={movie.title} className="w-full h-full object-cover object-center" />
                            </div>
                        )
                    })}

                    {/* Heavy Vignette & Overlay for Netflix feel */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-background z-0" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 z-0" />

                    {/* Slider Controls */}
                    {trendingMovies.length > 0 && (
                        <>
                            <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-colors">
                                <ChevronLeft className="w-12 h-12 md:w-16 md:h-16 drop-shadow-2xl" />
                            </button>
                            <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-colors">
                                <ChevronRight className="w-12 h-12 md:w-16 md:h-16 drop-shadow-2xl" />
                            </button>
                        </>
                    )}

                    {/* HERO FOREGROUND CONTENT */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-5xl mt-20">
                        <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] tracking-tight mb-4">
                            Bugün nasıl hissediyorsun ?
                        </h1>
                        <p className="text-base md:text-lg text-white/90 drop-shadow-xl font-medium mb-10 max-w-2xl">
                            Moduna eşlik edecek en iyi hikayeyi senin için bulalım. Keşfetmeye hazır mısın?
                        </p>

                        {/* CATEGORIES & CONTROLS */}
                        <div className="flex flex-col items-center gap-6 w-full">
                            <div className="flex flex-wrap items-center justify-center max-w-[800px] gap-2 md:gap-3">
                                {MOODS.map((m) => {
                                    const isActive = mood === m.id;
                                    return (
                                        <MoodButton
                                            key={m.id}
                                            label={m.label}
                                            icon={m.icon}
                                            isActive={isActive}
                                            onClick={() => setMood(isActive ? undefined : m.id)}
                                        />
                                    );
                                })}
                            </div>

                            {/* Duration Dropdown */}
                            <div className="flex items-center gap-2 bg-black/40 border border-white/20 rounded-full px-5 py-2.5 backdrop-blur-md mt-2 hover:bg-white/10 transition-colors">
                                <Clock className="w-4 h-4 text-white/80" />
                                <span className="text-white/80 text-sm font-medium">Süre: </span>
                                <select
                                    className="bg-transparent text-white text-sm font-bold outline-none appearance-none cursor-pointer"
                                    value={maxDuration || ''}
                                    onChange={(e) => setMaxDuration(e.target.value ? Number(e.target.value) : undefined)}
                                >
                                    <option value="" className="text-black">Farketmez</option>
                                    <option value="90" className="text-black">Kısa (Max 1.5s)</option>
                                    <option value="120" className="text-black">Orta (Max 2s)</option>
                                    <option value="150" className="text-black">Uzun (Max 2.5s)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PROFILE HEADER */}
            {activeTab === 'profile' && (
                <div className="px-2 space-y-2 animate-in slide-in-from-top-4 duration-500 pt-20">
                    <h1 className="text-3xl md:text-4xl font-black text-foreground drop-shadow-md">Listem</h1>
                    <p className="text-sm font-medium text-muted-foreground">İzlediğin ve listene eklediğin filmler.</p>
                </div>
            )}

            {/* 🎬 MAIN CONTENT AREA */}
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
                                    {movies.map((movie: any, idx: number) => {
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
                                    {watchedMovies.map((interaction: any) => (
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
                                    {ratedMovies.map((interaction: any) => (
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
        </div>
    );
}

