import { Outlet } from '@tanstack/react-router';
import Cookies from 'js-cookie';
import { SidebarProvider } from '#/components/ui/sidebar';
import { SearchProvider } from '#/context/search-context';


interface Props {
  children?: React.ReactNode;
}

export function AuthenticatedLayout({ children }: Props) {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false';
  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <main className="w-full flex h-svh flex-col">
          {children ? children : <Outlet />}
        </main>
      </SidebarProvider>
    </SearchProvider>
  );
}
