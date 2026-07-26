import { useMemo } from 'react';
import { useAuthStore } from '@/store/auth';
import { useFollowingList } from '@/hooks/useFollowingList';
import { useSearchUsers } from '@/hooks/useSearchUsers';
import { useBlockedIds } from '@/hooks/useBlockUser';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export interface MentionCandidate {
  id: string;
  username: string;
  avatarUrl: string | null;
  /** True when the current user follows this person — drives the "following" hint. */
  isFollowing: boolean;
}

const MAX = 6;
// Broaden past your follows only once follow matches thin out, so the popup stays
// snappy on the common case (mentioning a friend) and only pays a network hop when
// it needs to reach someone you don't follow.
const BROADEN_WHEN_LOCAL_UNDER = 5;

/**
 * @-mention suggestion source — HYBRID, follows pinned on top (Kevin 2026-07-25).
 *
 * People you follow are filtered IN-MEMORY from the already-cached following list
 * (zero network → the popup appears instantly as you type). A global username
 * search streams in UNDERNEATH a beat later, but only when follow matches are thin,
 * so you can still mention someone you don't follow. Prefix match throughout
 * (matches "@sun" → "sunnysteph"/"sunny"). Excludes self, blocked users, and
 * private bots (mirrors the useFollowingList / useSearchUsers runtime filters).
 */
export function useMentionCandidates(query: string, active: boolean): MentionCandidate[] {
  const meId = useAuthStore((s) => s.user?.id);
  const { data: following = [] } = useFollowingList(meId ?? '');
  const { data: blocked } = useBlockedIds();

  const q = query.trim().toLowerCase();

  // 1. Instant: prefix-filter the cached following list in memory.
  const local = useMemo<MentionCandidate[]>(() => {
    if (!active) return [];
    return following
      .filter((u) => u.id !== meId && !blocked?.has(u.id))
      .filter((u) => (u.username ?? '').toLowerCase().startsWith(q))
      .slice(0, MAX)
      .map((u) => ({
        id: u.id,
        username: u.username,
        avatarUrl: u.avatar_url,
        isFollowing: true,
      }));
  }, [active, following, blocked, q, meId]);

  // 2. Broaden: global username search, debounced (follows are instant; only the
  //    network half waits) and gated so it fires only when follows are thin.
  const wantGlobal = active && q.length >= 2 && local.length < BROADEN_WHEN_LOCAL_UNDER;
  const debouncedQuery = useDebouncedValue(wantGlobal ? query : '', 150);
  const { data: global = [] } = useSearchUsers(debouncedQuery);

  return useMemo<MentionCandidate[]>(() => {
    if (!active) return [];
    const seen = new Set(local.map((u) => u.id));
    const extra = global
      .filter((u) => !u.isMe && !seen.has(u.id))
      // useSearchUsers is substring; keep the prefix bias so results match the
      // follows half + Kevin's "@sun → sunnysteph" mental model.
      .filter((u) => u.username.toLowerCase().startsWith(q))
      .map((u) => ({
        id: u.id,
        username: u.username,
        avatarUrl: u.avatarUrl,
        isFollowing: false,
      }));
    return [...local, ...extra].slice(0, MAX);
  }, [active, local, global, q]);
}
