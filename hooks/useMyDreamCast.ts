/**
 * useMyDreamCast — reads the current authed user's `user_recipes.recipe`
 * JSONB and exposes just the `dream_cast` array (self / plus_one / pet
 * thumbnails + descriptions). Used by the profile's CastPeek.
 *
 * Owner-only by the existing RLS on user_recipes (migration 050).
 *
 * Previously this hook also returned `aesthetics` and `art_styles` for a
 * VibeProfilePeek; that peek was removed when Kevin pivoted away from
 * user-curated mediums/vibes (the nightly engine and create screen own
 * those now, no onboarding selection). The dormant
 * `get_public_vibe_summary` RPC in migration 208 is left in place but
 * has no callers.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { DreamCastMember } from '@/types/vibeProfile';

export interface MyDreamCast {
  cast: DreamCastMember[];
}

const EMPTY: MyDreamCast = { cast: [] };

export function useMyDreamCast() {
  const user = useAuthStore((s) => s.user);

  return useQuery<MyDreamCast>({
    queryKey: ['myDreamCast', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_recipes')
        .select('recipe')
        .eq('user_id', user!.id)
        .maybeSingle();
      if (error) throw error;
      const recipe = (data?.recipe ?? {}) as { dream_cast?: DreamCastMember[] };
      return { cast: recipe.dream_cast ?? [] };
    },
    enabled: !!user,
    staleTime: 60_000,
    initialData: EMPTY,
  });
}
