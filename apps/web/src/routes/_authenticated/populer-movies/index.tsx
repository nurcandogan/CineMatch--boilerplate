import { createFileRoute } from '@tanstack/react-router';
import MoviesDashboard from '#/features/movies-dashboard';
import { useMovieStore } from '#/stores/useMovieStore';

export const Route = createFileRoute('/_authenticated/populer-movies/')({
  beforeLoad: () => {
    useMovieStore.getState().setActiveTab('popular');
  },
  component: MoviesDashboard,
});
