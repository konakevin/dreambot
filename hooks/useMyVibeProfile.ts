/**
 * useMyVibeProfile — reads the current authed user's `user_recipes.recipe`
 * JSONB and exposes the slices the profile screen surfaces inline:
 * aesthetics + art_styles (for the VibeProfilePeek) and dream_cast (for
 * the CastPeek).
 *
 * Owner-only by design — user_recipes RLS (migration 050) allows reads
 * only when auth.uid() = user_id, so this hook is never used for other
 * users' profiles. Cross-user vibe peek would need a dedicated SECURITY
 * DEFINER RPC that returns just the sanitized public fields; not built
 * yet.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { DreamCastMember } from '@/types/vibeProfile';

export interface MyVibeProfile {
  aesthetics: string[];
  art_styles: string[];
  cast: DreamCastMember[];
}

const EMPTY: MyVibeProfile = { aesthetics: [], art_styles: [], cast: [] };

export function useMyVibeProfile() {
  const user = useAuthStore((s) => s.user);

  return useQuery<MyVibeProfile>({
    queryKey: ['myVibeProfile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_recipes')
        .select('recipe')
        .eq('user_id', user!.id)
        .maybeSingle();
      if (error) throw error;
      const recipe = (data?.recipe ?? {}) as {
        aesthetics?: string[];
        art_styles?: string[];
        dream_cast?: DreamCastMember[];
      };
      return {
        aesthetics: recipe.aesthetics ?? [],
        art_styles: recipe.art_styles ?? [],
        cast: recipe.dream_cast ?? [],
      };
    },
    enabled: !!user,
    staleTime: 60_000,
    initialData: EMPTY,
  });
}
