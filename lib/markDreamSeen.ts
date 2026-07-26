import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/store/auth';

/**
 * Marks one of the user's OWN dreams as witnessed (migration 399 `owner_seen_at`),
 * so it stops counting as a "new/unseen" album dream — the red dot on the Profile
 * + Dreams tabs and the per-tile "New" pill. Called when the user SEES a dream's
 * reveal or POSTS it, i.e. dreams they created and directly witnessed. Dreams that
 * land without them witnessing (nightly, or a create dream they queued and left)
 * are never marked, so they correctly stay "new" (Kevin 2026-07-25).
 *
 * Idempotent + owner-scoped server-side. Fire-and-forget; invalidates the unseen
 * count + the album grids so the dot/pill clear promptly.
 */
export async function markDreamSeen(uploadId: string | null | undefined): Promise<void> {
  if (!uploadId) return;
  const { error } = await supabase.rpc('mark_dream_seen', { p_upload_id: uploadId });
  if (error) {
    if (__DEV__) console.warn('[dreams] mark_dream_seen failed:', error.message);
    return;
  }
  const userId = useAuthStore.getState().user?.id;
  if (userId) {
    queryClient.invalidateQueries({ queryKey: ['unseenDreamsCount', userId] });
  }
  // Refetch the album grids so the tile's owner_seen_at updates (drops the pill).
  queryClient.invalidateQueries({ queryKey: ['my-dreams'] });
}
