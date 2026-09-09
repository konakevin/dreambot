/**
 * announcementEligibility — pure candidate-selection logic for the DB-driven
 * announcement system (migration 333, hooks/useAnnouncement.ts). Lives in its
 * own file with ZERO native/RN imports (same reason lib/appVersion.ts is
 * standalone) so it's directly unit-testable via fast jest, no mocking needed.
 */
import { isUpdateRequired } from '@/lib/appVersion';

export interface AnnouncementRow {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  cta_label: string | null;
  cta_route: string | null;
  style: string;
  audience: string;
  min_build: number | null;
  min_app_version: string | null;
}

/**
 * PURE candidate-selection predicate. Rows are assumed pre-sorted by priority
 * descending (the live query does `.order('priority', {ascending: false})`);
 * returns the first one that clears every gate, or null.
 *
 * Gate order matches the live query exactly:
 *   1. not already seen (announcement_seen)
 *   2. style === 'sheet' (banners render elsewhere)
 *   3. audience matches (all, or pro-status matches)
 *   4. ADMIN PREVIEW BYPASSES 5+6 entirely (mirrors migration 483's RLS
 *      carve-out, which the client-side version gates would otherwise
 *      contradict for the admin's own preview)
 *   5. min_build (native build number) — fails open on null/unreadable build
 *   6. min_app_version (marketing version string) — fails open on null/malformed,
 *      via compareVersions
 *
 * NOT covered here (server-side only, needs a live DB — see the *.dbspec.ts
 * lane): is_active / starts_at / ends_at / existing_users_only, all enforced
 * by RLS (migrations 333, 445) before a row ever reaches this function.
 */
export function selectEligibleAnnouncement(
  rows: AnnouncementRow[],
  opts: {
    seenIds: Set<string>;
    isPro: boolean;
    isAdmin: boolean;
    build: number;
    appVersion: string | null;
  }
): AnnouncementRow | null {
  const { seenIds, isPro, isAdmin, build, appVersion } = opts;
  const candidate = rows.find(
    (a) =>
      !seenIds.has(a.id) &&
      a.style === 'sheet' &&
      (a.audience === 'all' || (a.audience === 'pro') === isPro) &&
      (isAdmin ||
        ((a.min_build == null || build === 0 || build >= a.min_build) &&
          !isUpdateRequired(appVersion, a.min_app_version)))
  );
  return candidate ?? null;
}
