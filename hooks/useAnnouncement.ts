/**
 * useAnnouncement — the DB-driven announcement system (migration 333,
 * ANNOUNCEMENTS_PLAN.md).
 *
 * On home mount (+ periodic staleness) fetch active announcements the user
 * hasn't seen, filter by audience + min_build, and surface the highest-
 * priority one. At most ONE announcement is shown per app session (module
 * latch) so stacked rows can't spam — the next one shows next session.
 *
 * Seen-state is account-bound (announcement_seen), so dismissals survive
 * reinstalls and fresh accounts see current announcements.
 */

import { useCallback } from 'react';
import * as Application from 'expo-application';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  cta_label: string | null;
  cta_route: string | null;
  style: string;
}

// One announcement per session, across remounts.
let shownThisSession = false;
/** Test hook / dev reset. */
export function resetAnnouncementSessionLatch() {
  shownThisSession = false;
}

const BUILD = Number(Application.nativeBuildVersion) || 0;

export function useAnnouncement() {
  const user = useAuthStore((s) => s.user);
  const isPro = useAuthStore((s) => s.isPro);
  const qc = useQueryClient();

  const { data: announcement = null } = useQuery({
    queryKey: ['announcement', user?.id],
    queryFn: async (): Promise<Announcement | null> => {
      if (shownThisSession) return null;
      // RLS already scopes to active rows inside the live window.
      const [{ data: rows, error }, { data: seen }] = await Promise.all([
        supabase
          .from('announcements')
          .select('id,title,body,image_url,cta_label,cta_route,style,audience,min_build,priority')
          .order('priority', { ascending: false }),
        supabase.from('announcement_seen').select('announcement_id'),
      ]);
      if (error || !rows) return null;
      const seenIds = new Set((seen ?? []).map((s) => s.announcement_id));
      const candidate = rows.find(
        (a) =>
          !seenIds.has(a.id) &&
          a.style === 'sheet' &&
          (a.audience === 'all' || (a.audience === 'pro') === isPro) &&
          (a.min_build == null || BUILD === 0 || BUILD >= a.min_build)
      );
      return candidate ?? null;
    },
    enabled: !!user,
    staleTime: 10 * 60_000,
  });

  const markSeen = useCallback(
    (id: string) => {
      shownThisSession = true;
      qc.setQueryData(['announcement', user?.id], null);
      if (!user) return;
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
