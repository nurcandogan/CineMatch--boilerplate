import { create } from 'zustand';

interface MovieState {
    mood: string | undefined;
    maxDuration: number | undefined;
    setMood: (mood: string | undefined) => void;
    setMaxDuration: (duration: number | undefined) => void;
    reset: () => void;
}

export const useMovieStore = create<MovieState>((set) => ({
    mood: undefined,
    maxDuration: undefined,
    setMood: (mood) => set({ mood }),
    setMaxDuration: (maxDuration) => set({ maxDuration }),
    reset: () => set({ mood: undefined, maxDuration: undefined }),
}));
