import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
}

export function useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage }: UseInfiniteScrollOptions) {
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1, rootMargin: '400px' }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return { loadMoreRef };
}
