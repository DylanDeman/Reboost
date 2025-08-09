import type { Prisma } from '@prisma/client';

export function normalizeRoles(roles: Prisma.JsonValue): string[] {
  if (Array.isArray(roles)) {
    return roles as string[];
  }
  if (typeof roles === 'string') {
    try {
      return JSON.parse(roles);
    } catch {
      return roles.split(',').map((r) => r.trim());
    }
  }
  return [];
}
