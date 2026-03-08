import Dashboard from '#/features/dashboard';
import { useMovieStore } from '#/stores/useMovieStore';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/populer-movies/')({
  beforeLoad: () => {
    useMovieStore.getState().setActiveTab('popular');
  },
  component: Dashboard,
});


