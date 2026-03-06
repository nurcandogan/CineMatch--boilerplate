import { X, Play, Plus, ThumbsUp, Check } from 'lucide-react';
import { TMDB_IMAGE_BASE_URL } from '#/lib/tmdb';
import type { Video, MovieDetailsModalProps } from '../types';

export function MovieDetailsModal({
    isOpen,
    movie,
    isLoading,
    isWatched,
    isInWatchlist,
    onClose,
    onWatchToggle,
    onWatchlistToggle
}: MovieDetailsModalProps) {
    if (!isOpen) return null;

    const trailer = movie?.videos?.results?.find(
        (v: Video) => v.site === 'YouTube' && v.type === 'Trailer'
    ) || movie?.videos?.results?.[0];

    const cast = movie?.credits?.cast?.slice(0, 8) || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 md:p-6 lg:p-8">
            {/* Backdrop Overlay */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative z-10 w-full h-full sm:h-auto max-h-screen sm:max-h-[95vh] sm:w-[95vw] lg:w-[90vw] max-w-[1200px] bg-zinc-950 sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/10 animate-in fade-in zoom-in-95 duration-300">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-white/20 transition-colors border border-white/20"
                >
                    <X className="h-5 w-5" />
                </button>

                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : movie ? (
                    <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
                        {/* Header Banner (Image or Video) */}
                        <div className="relative w-full aspect-video md:aspect-[21/9] bg-zinc-900">
                            {trailer ? (
                                <iframe
                                    className="w-full h-full pointer-events-none"
                                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}&modestbranding=1`}
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                            ) : (
                                <img
                                    src={`${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                            )}

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent" />

                            {/* Banner Content */}
                            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-2/3">
                                <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-xl mb-4">
                                    {movie.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <button
                                        className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-md font-bold hover:bg-white/80 transition-colors"
                                    >
                                        <Play className="h-5 w-5 fill-current" /> Oynat
                                    </button>

                                    <button
                                        onClick={onWatchlistToggle}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/80 text-white backdrop-blur-md border border-white/30 hover:bg-zinc-700 transition-colors"
                                        title={isInWatchlist ? "İzleyeceklerimden Çıkar" : "İzleyeceklerime Ekle"}
                                    >
                                        {isInWatchlist ? <Check className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5" />}
                                    </button>

                                    <button
                                        onClick={onWatchToggle}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/80 text-white backdrop-blur-md border border-white/30 hover:bg-zinc-700 transition-colors"
                                        title={isWatched ? "İzlediklerimden Çıkar" : "İzledim Olarak İşaretle"}
                                    >
                                        <ThumbsUp className={`h-5 w-5 ${isWatched ? "fill-green-500 text-green-500" : ""}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Details Content */}
                        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/80">
                                    <span className="text-green-500 font-bold">{Math.round(movie.vote_average * 10)}% Eşleşme</span>
                                    <span>{new Date(movie.release_date).getFullYear()}</span>
                                    {movie.runtime > 0 && (
                                        <span className="flex items-center gap-1 border border-white/20 px-2 py-0.5 rounded text-xs">
                                            {Math.floor(movie.runtime / 60)}s {movie.runtime % 60}dk
                                        </span>
                                    )}
                                    <span className="border border-white/20 px-2 py-0.5 rounded text-xs uppercase">HD</span>
                                </div>

                                <p className="text-base md:text-lg text-white/90 leading-relaxed">
                                    {movie.overview || "Bu film için henüz Türkçe bir özet bulunmuyor."}
                                </p>

                                {/* Trailer Video if available and not used as banner */}
                                {!trailer && movie.videos?.results?.length > 0 && (
                                    <div className="mt-8 space-y-4">
                                        <h3 className="text-xl font-bold text-white">Fragmanlar</h3>
                                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/50 border border-white/10">
                                            <iframe
                                                className="w-full h-full"
                                                src={`https://www.youtube.com/embed/${movie.videos.results[0].key}?rel=0`}
                                                allow="encrypted-media"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <span className="text-white/50 text-sm">Türler: </span>
                                    <span className="text-white/90 text-sm hover:underline cursor-pointer">
                                        {movie.genres.map(g => g.name).join(', ')}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-white/50 text-sm">Oyuncular: </span>
                                    <span className="text-white/90 text-sm">
                                        {cast.map((c, i) => (
                                            <span key={c.id}>
                                                <span className="hover:underline cursor-pointer">{c.name}</span>
                                                {i < cast.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </span>
                                </div>

                                {/* Cast Pictures */}
                                {cast.length > 0 && (
                                    <div className="pt-4 border-t border-white/10">
                                        <h3 className="text-sm font-bold text-white mb-3">Oyuncu Kadrosu</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {cast.slice(0, 4).map(person => (
                                                <div key={person.id} className="flex items-center gap-2">
                                                    {person.profile_path ? (
                                                        <img
                                                            src={`${TMDB_IMAGE_BASE_URL}/w185${person.profile_path}`}
                                                            alt={person.name}
                                                            loading="lazy"
                                                            decoding="async"
                                                            className="h-10 w-10 rounded-full object-cover border border-white/10"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                                                            <span className="text-xs font-bold">{person.name.charAt(0)}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-white truncate max-w-[80px]">{person.name}</span>
                                                        <span className="text-[10px] text-white/50 truncate max-w-[80px]">{person.character}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-white/50">Film bilgileri bulunamadı.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
