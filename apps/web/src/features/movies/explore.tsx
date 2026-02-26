import { useQuery } from '@tanstack/react-query';
import { Flame, Laugh, Ghost, Heart, Clock, Clapperboard, RefreshCcw, UserCircle, PlaySquare, Eye, Star } from 'lucide-react';
import { tmdb } from '#/lib/tmdb';
import { useMovieStore } from '#/stores/useMovieStore';
import { MovieCard } from './movie-card';
import { cn } from '#/lib/utils';
import { useState } from 'react';

const MOODS = [
    { id: 'rahat', label: 'Eğlenceli & Komik', icon: Laugh, color: 'from-orange-400 to-yellow-400' },
    { id: 'hizli', label: 'Aksiyon Dolu', icon: Flame, color: 'from-red-500 to-rose-600' },
    { id: 'duygusal', label: 'Duygusal & Dram', icon: Heart, color: 'from-pink-500 to-purple-500' },
    { id: 'gizemli', label: 'Gizem & Bilimkurgu', icon: Ghost, color: 'from-indigo-500 to-blue-600' },
];

export function ExploreMovies() {
    const { mood, maxDuration, setMood, setMaxDuration } = useMovieStore();
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState<'discover' | 'profile'>('discover');

    // Discover Query
    const { data: discoverResponse, isLoading: isDiscoverLoading } = useQuery({
        queryKey: ['movies-discover', mood, maxDuration, page],
        queryFn: async () => {
            const res = await tmdb.discover({ mood, maxDuration: maxDuration || undefined, page });
            return res;
        },
        enabled: activeTab === 'discover',
    });

    // User Interactions Query
    const { data: interactionsResponse, refetch: refetchInteractions } = useQuery({
        queryKey: ['movies-interactions'],
        queryFn: async () => {
            const res = tmdb.getMovieInteractions();
            return res;
        },
    });

    const movies = discoverResponse?.results || [];
    // Ensure we get an array, and handle cases where it might be structured differently due to generic types
    const interactions = Array.isArray(interactionsResponse) ? interactionsResponse : [];

    const watchedMovies = interactions.filter(i => i.isWatched && i.movie);
    const ratedMovies = interactions.filter(i => i.rating && i.movie);

    return (
        <div className="w-full flex-1 space-y-8 animate-in fade-in duration-700 pb-12">
            {/* 🔮 HERO & TABS WIDGET */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-neutral-900 to-black p-8 md:p-12 border border-white/5 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-end justify-between">
                    <div className="space-y-4 max-w-xl">
                        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50 tracking-tight">
                            {activeTab === 'discover' ? 'Bugün ne izlesek? 🍿' : 'Senin Film Günlüğün 📝'}
                        </h1>
                        <p className="text-lg text-white/50 font-medium">
                            {activeTab === 'discover'
                                ? 'Ruh halini seç, zamanını belirle; gerisini senin için yapay zeka harikası CineMatch\'e bırak.'
                                : 'CineMatch aracılığıyla izlediğin ve puanladığın filmleri burada görebilirsin.'}
                        </p>
                    </div>

                    <div className="flex bg-white/5 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10">
                        <button
                            onClick={() => setActiveTab('discover')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                                activeTab === 'discover' ? "bg-white/10 text-white shadow-lg" : "text-white/50 hover:text-white"
                            )}
                        >
                            <PlaySquare className="w-5 h-5" /> Keşfet
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                                activeTab === 'profile' ? "bg-white/10 text-white shadow-lg" : "text-white/50 hover:text-white"
                            )}
                        >
                            <UserCircle className="w-5 h-5" /> Profilim
                        </button>
                    </div>
                </div>

                {/* DISCOVER TOOLS (Only visible in discover tab) */}
                {activeTab === 'discover' && (
                    <div className="relative z-10 mt-10 animate-in slide-in-from-top-4 fade-in duration-500">
                        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                            <div className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                                <Clock className="w-5 h-5 text-indigo-400" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-wider text-white/40">Zamanım Var</span>
                                    <select
                                        className="bg-transparent text-white font-medium outline-none appearance-none cursor-pointer"
                                        value={maxDuration || ''}
                                        onChange={(e) => setMaxDuration(e.target.value ? Number(e.target.value) : undefined)}
                                    >
                                        <option value="" className="text-black">Farketmez</option>
                                        <option value="90" className="text-black">En fazla 1.5 saat</option>
                                        <option value="120" className="text-black">En fazla 2 saat</option>
                                        <option value="150" className="text-black">En fazla 2.5 saat</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar">
                            {MOODS.map((m) => {
                                const Icon = m.icon;
                                const isActive = mood === m.id;

                                return (
                                    <button
                                        key={m.id}
                                        onClick={() => setMood(isActive ? undefined : m.id)}
                                        className={cn(
                                            "group relative flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 snap-center border overflow-hidden",
                                            isActive
                                                ? "bg-white/10 border-white/20 scale-105 shadow-xl"
                                                : "bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/20"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-40 bg-gradient-to-r",
                                            m.color
                                        )} />
                                        <div className={cn(
                                            "relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br shadow-lg",
                                            m.color
                                        )}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="relative z-10 font-bold text-white tracking-wide">
                                            {m.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* 🎬 MAIN CONTENT AREA */}
            <div className="space-y-6">
                {activeTab === 'discover' ? (
                    <>
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Clapperboard className="w-6 h-6 text-purple-500" />
                                Senin İçin Öneriler
                            </h2>
                        </div>

                        {isDiscoverLoading ? (
                            <div className="flex h-64 items-center justify-center">
                                <RefreshCcw className="w-8 h-8 animate-spin text-purple-500" />
                            </div>
                        ) : movies.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {movies.map((movie: any) => (
                                        <MovieCard
                                            key={movie.id}
                                            movie={movie}
                                            interactions={interactions}
                                            onInteract={() => refetchInteractions()}
                                        />
                                    ))}
                                </div>

                                <div className="flex justify-center mt-12 mb-8">
                                    <button
                                        onClick={() => setPage(p => p + 1)}
                                        className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors backdrop-blur-md"
                                    >
                                        Daha Fazla Göster
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col h-64 items-center justify-center gap-4 bg-white/5 border border-white/5 rounded-2xl">
                                <div className="text-4xl">🍿</div>
                                <p className="text-white/50 font-medium">Aradığın kriterlere uygun film bulamadık.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="space-y-12 animate-in slide-in-from-bottom-8 fade-in duration-500">
                        {/* İZLEDİKLERİM */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2 px-2">
                                <Eye className="w-6 h-6 text-green-500" />
                                İzlediğin Filmler ({watchedMovies.length})
                            </h2>
                            {watchedMovies.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {watchedMovies.map((interaction: any) => (
                                        <MovieCard
                                            key={interaction.tmdbMovieId}
                                            movie={interaction.movie}
                                            interactions={interactions}
                                            onInteract={() => refetchInteractions()}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-32 items-center justify-center bg-white/5 border border-white/5 rounded-2xl">
                                    <p className="text-white/50 font-medium">Henüz izlediğin bir film yok.</p>
                                </div>
                            )}
                        </div>

                        {/* PUANLADIKLARIM */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2 px-2">
                                <Star className="w-6 h-6 text-yellow-500" />
                                Puanladığın Filmler ({ratedMovies.length})
                            </h2>
                            {ratedMovies.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {ratedMovies.map((interaction: any) => (
                                        <MovieCard
                                            key={interaction.tmdbMovieId}
                                            movie={interaction.movie}
                                            interactions={interactions}
                                            onInteract={() => refetchInteractions()}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-32 items-center justify-center bg-white/5 border border-white/5 rounded-2xl">
                                    <p className="text-white/50 font-medium">Henüz puanladığın bir film yok.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


