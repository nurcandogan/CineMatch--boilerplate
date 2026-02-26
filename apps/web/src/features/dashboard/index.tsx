import { Header } from '#/components/layout/header';
import { Main } from '#/components/layout/main';
import { ProfileDropdown } from '#/components/profile-dropdown';
import { Search } from '#/components/search';
import { ThemeSwitch } from '#/components/theme-switch';
import { ExploreMovies } from '#/features/movies/explore';
import { Clapperboard } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
      <Header fixed className="bg-transparent border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3 mr-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/20">
            <Clapperboard className="h-5 w-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            CineMatch
          </span>
        </div>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="pt-24 px-4 md:px-8 max-w-7xl mx-auto bg-transparent">
        <ExploreMovies />
      </Main>
    </div>
  );
}