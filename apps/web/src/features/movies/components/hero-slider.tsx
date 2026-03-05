import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { cn } from '#/lib/utils';
import { useMovieStore } from '#/stores/useMovieStore';
import { MOODS } from '../constants';
import { MoodButton } from './mood-button';
import { useSlider } from '../hooks/use-slider';
import type { Movie, HeroSliderProps } from '../types';

export function HeroSlider({ trendingMovies }: HeroSliderProps) {
    const { mood, maxDuration, setMood, setMaxDuration } = useMovieStore();

    const { currentSlide, nextSlide, prevSlide } = useSlider({
        totalItems: trendingMovies.length,
        isEnabled: true,
    });

    return (
        <div className="-mx-4 md:-mx-10 lg:-mx-16 -mt-16 relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Background Images */}
            {trendingMovies.map((movie: Movie, idx: number) => {
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
                    <div className="flex items-center gap-3 bg-black/40 border border-white/20 rounded-full px-6 py-3 backdrop-blur-md mt-2 md:mt-4 hover:bg-white/10 transition-colors">
                        <Clock className="w-5 h-5 text-white/80" />
                        <span className="text-white/80 text-base font-medium">Süre: </span>
                        <select
                            className="bg-transparent text-white text-base font-bold outline-none appearance-none cursor-pointer"
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
    );
}
