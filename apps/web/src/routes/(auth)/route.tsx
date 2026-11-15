import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import AuthLayout from '#components/layout/auth-layout.tsx';
import { api } from '#lib/api.ts';
import { AUTH_BYPASS_ENABLED } from '#lib/auth/guest-session.ts';

export const Route = createFileRoute('/(auth)')({
  beforeLoad: async ({ context }) => {
    // TEMP: login kapalı — sign-in/sign-up sayfalarına düşmesin
    if (AUTH_BYPASS_ENABLED) {
      throw redirect({ to: '/' });
    }

    const { queryClient } = context;
    const session = await queryClient.ensureQueryData({
      queryKey: ['session'],
      queryFn: () => api.auth.me.get(),
    });
    if (session.data) {
      throw redirect({ to: '/' });
    }
  },
  component: () => {
    return (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    );
  },
});
