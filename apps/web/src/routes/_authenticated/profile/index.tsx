import Dashboard from '#/features/dashboard';
import { useMovieStore } from '#/stores/useMovieStore';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/profile/')({
    beforeLoad: () => {
        useMovieStore.getState().setActiveTab('profile');
    },
    component: Dashboard,
});
