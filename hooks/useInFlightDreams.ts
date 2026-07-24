/**
 * useInFlightDreams — the current user's queued / in-progress dreams, kept live.
 *
 * The single source of truth behind the render dock pill and the Dreams-album
 * pending tiles (the loading screen keeps its own per-job subscription). Reads
 * the user's non-terminal `dream_queue` rows (RLS scopes to the owner) and is
 * refreshed by (a) the `dream_queue` binding on the shared `user-<id>` realtime
 * channel in `app/_layout.tsx` and (b) refetch-on-mount / on-focus, because iOS
 * drops the socket in background and postgres_changes does not replay. See
 * DREAM_TRACKING_PLAN.md.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export interface InFlightDream {
  /** dream_queue.id === dream_jobs.id === the shared job UUID. */
  id: string;
  /** 'queued' | 'in_progress' (terminal rows are excluded). */
  status: string;
  /** Latest render stage breadcrumb (migration 272), null before the first mark. */
  currentStage: string | null;
  stageUpdatedAt: string | null;
  model: string | null;
  createdAt: string;
  attemptCount: number;
}

export function useInFlightDreams() {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: ['inFlightDreams', userId],
    queryFn: async (): Promise<InFlightDream[]> => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('dream_queue')
        .select('id, status, current_stage, stage_updated_at, model, created_at, attempt_count')
        .eq('user_id', userId)
        .in('status', ['queued', 'in_progress'])
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []).map((r) => ({
        id: r.id,
        status: r.status,
        currentStage: r.current_stage ?? null,
        stageUpdatedAt: r.stage_updated_at ?? null,
        model: r.model ?? null,
        createdAt: r.created_at,
        attemptCount: r.attempt_count ?? 0,
      }));
    },
    enabled: !!userId,
    // staleTime 0 so EVERY foreground / mount / reconnect refetches — the
    // realtime `dream_queue` binding drives live updates while active, but iOS
    // drops the socket in background and postgres_changes never replays missed
    // events. A non-zero staleTime would skip the return-to-foreground refetch
    // for short (<staleTime) backgrounds, leaving a stale/ghost pending tile.
    // The query is tiny (<=5 rows), so refetching on every resume is cheap and
    // makes the dock + album resume accurately regardless of how the user
    // backgrounded/killed the app. Absolute-time progress (stage_updated_at)
    // means the ring also jumps to the correct fill after a background gap.
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
