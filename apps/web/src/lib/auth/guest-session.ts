import type { AuthMeResponse } from '#types/api';
import { UserScope } from '@onlyjs/db/enums';

/**
 * TEMP: Login kapalıyken kullanılan misafir oturumu.
 * VITE_AUTH_BYPASS=false yapınca gerçek auth tekrar devreye girer.
 */
export const AUTH_BYPASS_ENABLED = import.meta.env.VITE_AUTH_BYPASS !== 'false';

export const GUEST_SESSION: AuthMeResponse = {
  id: 'guest',
  email: 'guest@cinematch.local',
  name: 'Misafir',
  firstName: 'Misafir',
  lastName: 'Kullanıcı',
  scope: UserScope.SYSTEM,
  isActive: true,
  createdAt: new Date(0),
  updatedAt: new Date(0),
  image: null,
  roles: [],
  claims: {
    global: [],
    organizations: {},
  },
  globalRoles: [],
  organizationMemberships: [],
};
