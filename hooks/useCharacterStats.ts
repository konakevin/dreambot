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
    supabase.from('votes').select('vote').eq('voter_id', userId),
  ]);

  if (postsRes.error) throw postsRes.error;
  if (affinityRes.error) throw affinityRes.error;

  const posts = postsRes.data ?? [];
  const votes = affinityRes.data ?? [];

  const radVotesCast = votes.filter((v) => v.vote === 'rad').length;
  const badVotesCast = votes.filter((v) => v.vote === 'bad').length;

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
