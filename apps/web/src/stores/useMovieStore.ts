import { create } from 'zustand';

interface MovieState {
    mood: string | undefined;
    maxDuration: number | undefined;
    activeTab: 'discover' | 'popular' | 'profile' | 'movies';
    setMood: (mood: string | undefined) => void;
    setMaxDuration: (duration: number | undefined) => void;
    setActiveTab: (tab: 'discover' | 'popular' | 'profile' | 'movies') => void;
    selectedMovieId: number | null;
    setSelectedMovieId: (id: number | null) => void;
    reset: () => void;
}

export const useMovieStore = create<MovieState>((set) => ({
    mood: undefined,
    maxDuration: undefined,
    activeTab: 'discover',
    setMood: (mood) => set({ mood }),
    setMaxDuration: (maxDuration) => set({ maxDuration }),
    setActiveTab: (activeTab) => set({ activeTab }),
    selectedMovieId: null,
    setSelectedMovieId: (id) => set({ selectedMovieId: id }),
    reset: () => set({ mood: undefined, maxDuration: undefined, activeTab: 'discover', selectedMovieId: null }),
}));
