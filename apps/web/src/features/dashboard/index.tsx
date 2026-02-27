import { Main } from '#/components/layout/main';
import { ThemeSwitch } from '#/components/theme-switch';
import { ExploreMovies } from '#/features/movies/explore';
import { SearchIcon, Bell } from 'lucide-react';
import { useMovieStore } from '#/stores/useMovieStore';
import { cn } from '#/lib/utils';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { activeTab, setActiveTab } = useMovieStore();
  const [isScrolled, setIsScrolled] = useState(false);

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
            onClick={() => setActiveTab('discover')}>
            CineMatch
          </span>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-4 text-sm font-medium">
            <button
              onClick={() => setActiveTab('discover')}
              className={cn("transition-colors hover:text-foreground/80", activeTab === 'discover' ? "text-foreground font-bold" : "text-muted-foreground")}
            >
              Anasayfa
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className="text-muted-foreground hover:text-foreground/80 transition-colors"
            >
              Filmler
            </button>
            <button className="text-muted-foreground hover:text-foreground/80 transition-colors">Yeni ve Popüler</button>
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
          <button className="hidden sm:block hover:scale-110 transition-transform hover:text-foreground text-foreground/80">
            <SearchIcon className="w-5 h-5" />
          </button>
          <ThemeSwitch />
          <button className="hover:scale-110 transition-transform hover:text-foreground text-foreground/80">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <Main className="pt-0 px-4 md:px-10 lg:px-16 mx-auto w-full max-w-[1920px] bg-transparent flex-1">
        <ExploreMovies />
      </Main>
    </div>
  );
}