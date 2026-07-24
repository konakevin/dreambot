import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * Marks the Dreams album as viewed (migration 397): advances
 * `users.last_dreams_view_at` to the SERVER's now() and RETURNS the previous
 * value. Mirrors useMarkInboxViewed, with one addition — the previous timestamp
 * is the caller's "session baseline" for the per-tile New markers (tiles newer
 * than it stay flagged for this visit), while the advanced value clears the dots.
 *
 * Server clock (RPC), NOT a client `new Date()`: the unseen set is
 * uploads.created_at > last_dreams_view_at, and created_at is server-stamped, so
 * a skewed phone clock could otherwise mark future renders seen or leave seen
 * ones "new" (identical reasoning to mark_inbox_viewed).
 *
 * Optimistically zeroes the count cache so the dots clear the instant the album
 * opens, then the query refetch reconciles.
 */
export function useMarkDreamsViewed() {
  const userId = useAuthStore((s) => s.user?.id);
  const qc = useQueryClient();

  return useCallback(async (): Promise<string | null> => {
    if (!userId) return null;
    qc.setQueryData<number>(['unseenDreamsCount', userId], 0);
    const { data, error } = await supabase.rpc('mark_dreams_viewed', {
      p_user_id: userId,
    });
    if (error) {
      if (__DEV__) console.warn('[dreams] mark_dreams_viewed failed', error.message);
      return null;
    }
    // The PREVIOUS last_dreams_view_at (baseline for the New markers).
    return (data as string | null) ?? null;
  }, [userId, qc]);
}
