import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapToDreamPost } from '@/lib/mapPost';
import { isSupremeAdmin } from '@/lib/superAdmin';
import type { DreamPostItem } from '@/components/DreamCard';

/**
 * Admin-only reader for a bot's DARK-LAUNCH shadow renders (uploads.shadow=true,
 * is_public=false) — the tiles shown at the TOP of a bot's profile grid so the
 * supreme admin can review a dark-launched path in isolation while it stays
 * hidden from every public surface. See BOT_DARK_LAUNCH_PLAN.md + migration 376.
 *
 * The `get_shadow_feed` RPC is SECURITY DEFINER and returns zero rows to anyone
 * but the supreme admin (`auth.uid()` check inside the function), so this is
 * defense-in-depth: the `isSupremeAdmin` gate just avoids a pointless round-trip
 * for everyone else — the DB is the real authority.
 *
 * `get_shadow_feed` returns `SETOF uploads` (no `users` join), so we inject the
 * bot's author info before mapping — `mapToDreamPost` dereferences `row.users`
 * and would crash on a join-less row.
 */
export function useShadowPosts(
  botUserId: string,
  viewerId: string | null | undefined,
  author: { username: string; avatar_url: string | null } | undefined,
  enabled = true
) {
  const gated = enabled && !!botUserId && isSupremeAdmin(viewerId);
  return useQuery({
    queryKey: ['shadowPosts', botUserId],
    queryFn: async (): Promise<DreamPostItem[]> => {
      const { data, error } = await supabase.rpc('get_shadow_feed', {
        p_bot_user_id: botUserId,
        p_limit: 60,
        p_offset: 0,
      });
      if (error) throw error;
      const synthUser = {
        username: author?.username ?? '',
        avatar_url: author?.avatar_url ?? null,
      };
      return (data ?? []).map((row) => {
        const r = row as Record<string, unknown>;
        // Inject the bot's author so mapToDreamPost's `row.users` deref is safe.
        const withUser = r.users ? r : { ...r, users: synthUser };
        return { ...mapToDreamPost(withUser), shadow: true };
      });
    },
    enabled: gated,
    staleTime: 30_000,
  });
}
