import { Main } from '#/components/layout/main';
import { ExplorePage } from '#/features/movies/pages/explore-page';
import { MoviesPage } from '#/features/movies/pages/movies-page';
import { PopularPage } from '#/features/movies/pages/popular-page';
import { ProfilePage } from '#/features/movies/pages/profile-page';
import { SearchPage } from '#/features/movies/pages/search-page';
import { SearchIcon, Bell, X } from 'lucide-react';
import { ThemeSwitch } from '#/components/theme-switch';
import { useMovieStore } from '#/stores/useMovieStore';
import { cn } from '#/lib/utils';
import { useEffect, useState, useRef } from 'react';
import { useMovieDetails } from '#/features/movies/hooks/use-movie-details';
import { MovieDetailsModal } from '#/features/movies/components/movie-details-modal';

export default function Dashboard() {
  const { activeTab, setActiveTab, reset } = useMovieStore();
  const movieDetails = useMovieDetails();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col font-sans">
      {/* NAVBAR */}
      <header
        className={cn(
          "fixed top-0 w-full z-50 flex items-center justify-between px-4 md:px-12 h-16 transition-colors duration-300",
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50" : "bg-gradient-to-b from-black/80 to-transparent"
        )}
      >
        <div className="flex items-center gap-8 lg:gap-12">
          {/* LOGO */}
          <span className="font-black text-2xl md:text-3xl tracking-tighter text-red-600 cursor-pointer select-none"
            onClick={() => reset()}>
            CineMatch
          </span>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-4 text-sm font-medium">
            <button
              onClick={() => reset()}
              className={cn("transition-colors hover:text-foreground/80", activeTab === 'discover' ? "text-foreground font-bold" : "text-muted-foreground")}
            >
              Anasayfa
            </button>
            <button
              onClick={() => setActiveTab('movies')}
              className={cn("transition-colors hover:text-foreground/80", activeTab === 'movies' ? "text-foreground font-bold" : "text-muted-foreground")}
            >
              Filmler
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={cn("transition-colors hover:text-foreground/80", activeTab === 'popular' ? "text-foreground font-bold" : "text-muted-foreground")}
            >
              Yeni ve Popüler
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={cn("transition-colors hover:text-foreground/80", activeTab === 'profile' ? "text-foreground font-bold" : "text-muted-foreground")}
            >
              Listem
            </button>
          </nav>
        </div>

        {/* RIGHT SIDE ICONS */}
        <div className="flex items-center gap-4 sm:gap-6 text-foreground">
          {/* SEARCH COMPONENT */}
          <div ref={searchRef} className="relative flex items-center justify-end">
            <div
              className={cn(
                "hidden sm:flex items-center bg-background/5 border-border/50 text-foreground overflow-hidden transition-all duration-300 ease-in-out",
                isSearchOpen ? "w-64 md:w-80 h-10 px-3 rounded-full border bg-background/90 shadow-lg backdrop-blur-md" : "w-10 h-10 px-0 rounded-full border-transparent bg-transparent"
              )}
            >
              {!isSearchOpen ? (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-full h-full flex items-center justify-center hover:scale-110 transition-transform hover:text-foreground text-foreground/80 outline-none"
                >
                  <SearchIcon className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <SearchIcon className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Film veya dizi ara..."
                    className="flex-1 bg-transparent outline-none border-none text-sm placeholder:text-muted-foreground w-full py-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 hover:bg-muted p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <ThemeSwitch />
          <button className="hover:scale-110 transition-transform hover:text-foreground text-foreground/80">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <Main className="pt-0 px-4 md:px-10 lg:px-16 mx-auto w-full max-w-[1920px] bg-transparent flex-1">
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
        onClose={movieDetails.closeDetails}
        onWatchToggle={movieDetails.toggleWatch}
      />
    </div>
  );
}