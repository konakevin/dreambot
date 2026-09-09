/**
 * useAnnouncement — the DB-driven announcement system (migration 333,
 * ANNOUNCEMENTS_PLAN.md).
 *
 * On home mount (+ periodic staleness) fetch active announcements the user
 * hasn't seen, filter by audience + min_build + min_app_version, and surface
 * the highest-priority one. At most ONE announcement is shown per app
 * session (module latch) so stacked rows can't spam — the next one shows
 * next session.
 *
 * min_build (native build number, migration 333) and min_app_version
 * (marketing version string, e.g. "1.2.0", migration 487) are two
 * independent floors — either or both may be set on a row. min_app_version
 * exists because a marketing version can be known and set AHEAD of a
 * release (it's literally what app.config.js is about to be bumped to),
 * where min_build can't be known until EAS actually mints that build's
 * number. Both fail OPEN (never gate) on a null/malformed value — see
 * lib/appVersion.ts's compareVersions doc.
 *
 * The supreme admin (lib/superAdmin.ts) is exempt from BOTH version gates
 * client-side, mirroring migration 483's RLS preview carve-out (which only
 * bypasses is_active/starts_at/existing_users_only — it says nothing about
 * min_build/min_app_version, so without this a draft announcement gated to
 * an unreleased version would be invisible even to the admin's own preview,
 * on whatever build they happen to be running day to day).
 *
 * Seen-state is account-bound (announcement_seen), so dismissals survive
 * reinstalls and fresh accounts see current announcements.
 */

import { useCallback } from 'react';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { isSupremeAdmin } from '@/lib/superAdmin';
import { selectEligibleAnnouncement, type AnnouncementRow } from '@/lib/announcementEligibility';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  cta_label: string | null;
  cta_route: string | null;
  style: string;
}

export type { AnnouncementRow };

// One announcement per session, across remounts.
let shownThisSession = false;
/** Test hook / dev reset. */
export function resetAnnouncementSessionLatch() {
  shownThisSession = false;
}

const BUILD = Number(Application.nativeBuildVersion) || 0;
const APP_VERSION = Constants.expoConfig?.version ?? null;

export function useAnnouncement() {
  const user = useAuthStore((s) => s.user);
  const isPro = useAuthStore((s) => s.isPro);
  const qc = useQueryClient();

  const { data: announcement = null } = useQuery({
    queryKey: ['announcement', user?.id],
    queryFn: async (): Promise<Announcement | null> => {
      // At most one announcement per app session (module latch).
      if (shownThisSession) return null;
      // RLS already scopes to active rows inside the live window.
      const [{ data: rows, error }, { data: seen }] = await Promise.all([
        supabase
          .from('announcements')
          .select(
            'id,title,body,image_url,cta_label,cta_route,style,audience,min_build,min_app_version,priority'
          )
          .order('priority', { ascending: false }),
        supabase.from('announcement_seen').select('announcement_id'),
      ]);
      if (error || !rows) return null;
      const seenIds = new Set((seen ?? []).map((s) => s.announcement_id));
      return selectEligibleAnnouncement(rows, {
        seenIds,
        isPro,
        isAdmin: isSupremeAdmin(user?.id),
        build: BUILD,
        appVersion: APP_VERSION,
      });
    },
    enabled: !!user,
    staleTime: 10 * 60_000,
  });

  const markSeen = useCallback(
    (id: string) => {
      shownThisSession = true;
      qc.setQueryData(['announcement', user?.id], null);
      if (!user) return;
      // Persist "seen" so the announcement never re-shows for this account.
      supabase
        .from('announcement_seen')
        .insert({ user_id: user.id, announcement_id: id })
        .then(({ error }) => {
          if (error && __DEV__) console.warn('[announcement] seen insert failed:', error.message);
        });
    },
    [qc, user]
  );

  return { announcement, markSeen };
}
