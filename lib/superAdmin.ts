/**
 * Supreme admin — the single "super user" designation, held by the app owner
 * ONLY. Distinct from `is_admin`, the DB-granted "ADMIN LITE" moderator tier
 * (e.g. sunnysteph, 2026-07-03): lite admins get moderation only — the
 * Reports screen + one-tap/anywhere delete of others' posts and comments
 * (admin_delete_upload/comment, reports RPCs, admin_ban_user), plus report
 * push notifications and the nightly-eligibility bypass. Supreme-admin gates
 * everything else: dev/QA tools in Settings (Dream Generator, previews,
 * resets, Refresh App), the /dreamTest route, and the AI model badge.
 *
 * Identified by user id today (no DB column needed). To make it DB-driven later,
 * add an `is_super_admin` column and resolve it in store/auth.ts — every consumer
 * reads `useAuthStore((s) => s.isSuperAdmin)`, so nothing else has to change.
 */
export const SUPREME_ADMIN_USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

export function isSupremeAdmin(userId: string | null | undefined): boolean {
  return !!userId && userId === SUPREME_ADMIN_USER_ID;
}
