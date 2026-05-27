import { supabase } from '@/lib/supabase';
import type { VibeProfile } from '@/types/vibeProfile';

/**
 * Persist a user's Vibe Profile to `user_recipes` (the single source of truth —
 * see CLAUDE.md) and flag the account as having an AI recipe. Idempotent upsert
 * keyed on user_id.
 *
 * Extracted from RevealStep so the onboarding UI doesn't issue raw Supabase
 * writes (logic belongs out of components), and so the three call sites stop
 * duplicating the exact same upsert. Unlike the old inline copies, this throws
 * on error instead of silently ignoring it — callers already run inside
 * try/catch on the reveal flow.
 */
export async function saveVibeProfile(userId: string, profile: VibeProfile): Promise<void> {
  const { error } = await supabase.from('user_recipes').upsert(
    {
      user_id: userId,
      // Deep clone so we persist a plain JSON snapshot, not a live store ref.
      recipe: JSON.parse(JSON.stringify(profile)),
      onboarding_completed: true,
      ai_enabled: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
  if (error) throw error;

  const { error: flagError } = await supabase
    .from('users')
    .update({ has_ai_recipe: true })
    .eq('id', userId);
  if (flagError) throw flagError;
}
