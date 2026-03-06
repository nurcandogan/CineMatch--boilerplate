import { Main } from '#/components/layout/main';
import { ExplorePage } from '#/features/movies/pages/explore-page';
import { MoviesPage } from '#/features/movies/pages/movies-page';
import { PopularPage } from '#/features/movies/pages/popular-page';
import { ProfilePage } from '#/features/movies/pages/profile-page';
import { SearchPage } from '#/features/movies/pages/search-page';
import { useMovieStore } from '#/stores/useMovieStore';
import { useEffect, useState } from 'react';
import { useMovieDetails } from '#/features/movies/hooks/use-movie-details';
import { MovieDetailsModal } from '#/features/movies/components/movie-details-modal';

import { Navbar } from '#/features/movies/components/navbar';

export default function Dashboard() {
  const { activeTab } = useMovieStore();
  const movieDetails = useMovieDetails();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search if we want (actually, maybe keep it open until closed manually)
  // Let's remove click outside because search is full page now
  // We can just add ESC key to close search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col font-sans">
      <Navbar
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* MAIN CONTENT */}
      <Main className="pt-0 px-4 md:px-10 lg:px-16 mx-auto w-full max-w-[1920px] bg-transparent flex-1 pb-20 lg:pb-0">
        {isSearchOpen && (searchQuery || debouncedQuery) ? (
          <SearchPage query={debouncedQuery || searchQuery} />
        ) : (
          <>
            {activeTab === 'discover' && <ExplorePage />}
            {activeTab === 'movies' && <MoviesPage />}
            {activeTab === 'popular' && <PopularPage />}
            {activeTab === 'profile' && <ProfilePage />}
          </>
        )}
      </Main>

      <MovieDetailsModal
        isOpen={!!movieDetails.selectedMovieId}
        movie={movieDetails.movie}
        isLoading={movieDetails.isLoading}
        isWatched={movieDetails.isWatched}
        isInWatchlist={movieDetails.isInWatchlist}
        onClose={movieDetails.closeDetails}
        onWatchToggle={movieDetails.toggleWatch}
        onWatchlistToggle={movieDetails.toggleWatchlist}
      />
    </div >
  );
}