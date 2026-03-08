import { createFileRoute } from '@tanstack/react-router';
import Dashboard from '#/features/dashboard';
import { useMovieStore } from '#/stores/useMovieStore';

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: () => {
    useMovieStore.getState().setActiveTab('discover');
  },
  component: Dashboard,
});
