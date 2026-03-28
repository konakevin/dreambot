// ─────────────────────────────────────────────────────────────────────────────
// SHELVED — not in use. See components/CharacterSheet.tsx for rationale.
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { computeCharacterSheet } from '@/lib/characterSheet';
import type { CharacterSheet } from '@/lib/characterSheet';

async function fetchCharacterStats(userId: string): Promise<CharacterSheet> {
  const [postsRes, affinityRes] = await Promise.all([
    supabase
      .from('uploads')
      .select('total_votes, rad_votes, wilson_score, categories')
      .eq('user_id', userId)
      .eq('is_active', true),
    supabase
      .from('user_category_affinity')
      .select('rad_count, bad_count')
      .eq('user_id', userId),
  ]);

  if (postsRes.error)    throw postsRes.error;
  if (affinityRes.error) throw affinityRes.error;

  const posts    = postsRes.data    ?? [];
  const affinity = affinityRes.data ?? [];

  const radVotesCast = affinity.reduce((s, a) => s + (a.rad_count ?? 0), 0);
  const badVotesCast = affinity.reduce((s, a) => s + (a.bad_count ?? 0), 0);

  return computeCharacterSheet({
    postCount: posts.length,
    posts,
    radVotesCast,
    badVotesCast,
  });
}

export function useCharacterStats(userId: string) {
  return useQuery({
    queryKey: ['characterStats', userId],
    queryFn: () => fetchCharacterStats(userId),
    enabled: !!userId,
    staleTime: 300_000,
  });
}
