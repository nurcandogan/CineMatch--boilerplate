import { SearchIcon, Bell, X, Home, Film, Flame, Bookmark } from 'lucide-react';
import { cn } from '#/lib/utils';
import { useRef } from 'react';
import { Link } from '@tanstack/react-router';
import type { NavbarProps } from '../types';
import { useScroll } from '../hooks/use-scroll';

export function Navbar({ isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery }: NavbarProps) {
    const { isScrolled } = useScroll();
    const searchRef = useRef<HTMLDivElement>(null);

    return (
        <>
            {/* NAVBAR */}
            <header
                className={cn(
                    "fixed top-0 w-full z-50 flex items-center justify-between px-4 md:px-12 h-16 transition-colors duration-300",
                    isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50" : "bg-gradient-to-b from-black/80 to-transparent"
                )}
            >
                <div className="flex items-center gap-8 lg:gap-12">
                    {/* LOGO */}
                    <Link to="/" className="font-black text-2xl md:text-3xl tracking-tighter text-red-600 cursor-pointer select-none">
                        CineMatch
                    </Link>

                    {/* DESKTOP NAV LINKS */}
                    <nav className="hidden lg:flex items-center gap-4 text-sm font-medium">
                        <Link
                            to="/"
                            className="transition-colors text-muted-foreground hover:text-foreground/80 [&.active]:text-foreground [&.active]:font-bold"
                            activeOptions={{ exact: true }}
                        >
                            Anasayfa
                        </Link>
                        <Link
                            to="/movies"
                            className="transition-colors text-muted-foreground hover:text-foreground/80 [&.active]:text-foreground [&.active]:font-bold"
                        >
                            Filmler
                        </Link>
                        <Link
                            to="/populer-movies"
                            className="transition-colors text-muted-foreground hover:text-foreground/80 [&.active]:text-foreground [&.active]:font-bold"
                        >
                            Yeni ve Popüler
                        </Link>
                        <Link
                            to="/profile"
                            className="transition-colors text-muted-foreground hover:text-foreground/80 [&.active]:text-foreground [&.active]:font-bold"
                        >
                            Listem
                        </Link>
                    </nav>
                </div>

                {/* RIGHT SIDE ICONS */}
                <div className="flex items-center gap-4 sm:gap-6 text-foreground">
                    {/* SEARCH COMPONENT */}
                    <div ref={searchRef} className="relative flex items-center justify-end">
                        <div
                            className={cn(
                                "flex items-center bg-background/5 border-border/50 text-foreground overflow-hidden transition-all duration-300 ease-in-out",
                                isSearchOpen ? "w-48 sm:w-64 md:w-80 h-10 px-3 rounded-full border bg-background/90 shadow-lg backdrop-blur-md" : "w-10 h-10 px-0 rounded-full border-transparent bg-transparent"
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

                    <button className="hover:scale-110 transition-transform hover:text-foreground text-foreground/80">
                        <Bell className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* MOBILE BOTTOM NAVIGATION */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/10 flex lg:hidden items-center justify-around h-16 px-4">
                <Link
                    to="/"
                    activeOptions={{ exact: true }}
                    className="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-white/50 [&.active]:text-white"
                >
                    <Home className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Anasayfa</span>
                </Link>
                <Link
                    to="/movies"
                    className="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-white/50 [&.active]:text-white"
                >
                    <Film className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Filmler</span>
                </Link>
                <Link
                    to="/populer-movies"
                    className="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-white/50 [&.active]:text-white"
                >
                    <Flame className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Popüler</span>
                </Link>
                <Link
                    to="/profile"
                    className="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-white/50 [&.active]:text-white"
                >
                    <Bookmark className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Listem</span>
                </Link>
            </nav>
        </>
    );
}
