import MoviesDashboard from '#/features/movies-dashboard';
import { useMovieStore } from '#/stores/useMovieStore';
import { movieQueries } from '#/features/movies';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/movies/')({
    loader: ({ context }) => {
        // Sadece statik olanı (slider vb.) cache'lemeyi deneyebiliriz. 
        // Ancak infinite scroll sayfası için temel veriyi (discover) çekiyoruz.
        return context.queryClient.ensureQueryData(movieQueries.discover(undefined, undefined, 1));
    },
    beforeLoad: () => {
        useMovieStore.getState().setActiveTab('movies');
    },
    component: MoviesDashboard,
});
