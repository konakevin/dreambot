import { supabase } from '@/lib/supabase';
import { migrateLegacyPlusOne } from '@/lib/dreamCastRoster';
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
  // NORMALISE AT THE ONE CHOKE POINT. Onboarding writes the +1 straight into
  // `dream_cast` and never mints a `partner_library` row; migrateLegacyPlusOne seeds one,
  // but it ran only in the STORE's loadProfile, so the roster existed in memory and never
  // reached the database until the user happened to open Settings and change something.
  // Everything that reads the roster from the DB — Create's cast picker, name matching,
  // the engine's cast_partner_id lookup — saw an empty roster in the meantime. Measured
  // 2026-09-22: 13 of 79 recipes had a plus_one and no roster row.
  //
  // Doing it here rather than at each save site means no future write can reintroduce it.
  // Idempotent: a non-empty roster short-circuits, so this is a no-op on every save that
  // already has one.
  const normalized = migrateLegacyPlusOne(profile);
  const { error } = await supabase.from('user_recipes').upsert(
    {
      user_id: userId,
      // Deep clone so we persist a plain JSON snapshot, not a live store ref.
      recipe: JSON.parse(JSON.stringify(normalized)),
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
