/**
 * Supreme admin — the single "super user" designation, held by the app owner
 * ONLY. Distinct from `is_admin` (a broader, DB-granted moderator role that may
 * be given to others): supreme-admin gates owner-only debug/diagnostic UI such
 * as the AI model badge on cards.
 *
 * Identified by user id today (no DB column needed). To make it DB-driven later,
 * add an `is_super_admin` column and resolve it in store/auth.ts — every consumer
 * reads `useAuthStore((s) => s.isSuperAdmin)`, so nothing else has to change.
 */
export const SUPREME_ADMIN_USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

export function isSupremeAdmin(userId: string | null | undefined): boolean {
  return !!userId && userId === SUPREME_ADMIN_USER_ID;
}
