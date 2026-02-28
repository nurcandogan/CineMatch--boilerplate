import { ExplorePage, movieQueries } from '#/features/movies';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/movies/')({
    loader: ({ context }) => {
        // Sadece statik olanı (slider vb.) cache'lemeyi deneyebiliriz. 
        // Ancak infinite scroll sayfası için temel veriyi (discover) çekiyoruz.
        return context.queryClient.ensureInfiniteQueryData(movieQueries.discover(undefined, undefined));
    },
    component: ExplorePage,
});
