/**
 * useAutoSaveProfile — debounced auto-save for vibe profile changes.
 *
 * Used by both the onboarding flow and the Settings sub-screens. Watches the
 * profile in the onboarding store and upserts to user_recipes with a 1.5s
 * debounce, plus an immediate save on unmount so navigating back never loses
 * changes.
 *
 * DATA-LOSS GUARD (2026-05-26): the save only fires once the store is
 * `isHydrated`. A Settings sub-screen reached WITHOUT going through
 * settings/index (deep link, push-notification tap, hot reload) mounts with the
 * empty DEFAULT_VIBE_PROFILE; without this guard the debounce/unmount save would
 * overwrite the user's real recipe with empty defaults — wiping their locations,
 * objects, cast, etc. and breaking their nightly dreams. So on mount we first
 * load the existing recipe from the DB (returning user) or mark the store
 * hydrated when there is none (new user mid-onboarding has nothing to clobber).
 */

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useOnboardingStore } from '@/store/onboarding';
import { isVibeProfile } from '@/types/vibeProfile';

const DEBOUNCE_MS = 1500;

export function useAutoSaveProfile() {
  const user = useAuthStore((s) => s.user);
  const isEditing = useOnboardingStore((s) => s.isEditing);
  const isHydrated = useOnboardingStore((s) => s.isHydrated);
  const profile = useOnboardingStore((s) => s.profile);

  // Fresh refs for the unmount save (empty-deps effect would otherwise capture
  // stale values from mount time).
  const latestProfile = useRef(profile);
  latestProfile.current = profile;
  const isEditingRef = useRef(isEditing);
  isEditingRef.current = isEditing;
  const isHydratedRef = useRef(isHydrated);
  isHydratedRef.current = isHydrated;
  const userRef = useRef(user);
  userRef.current = user;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ensure the store is hydrated before any save can fire. Loads the user's
  // existing recipe from the DB; if there is none (new user), marks hydrated so
  // a fresh onboarding profile can still be saved (nothing to overwrite).
  useEffect(() => {
    if (!user || useOnboardingStore.getState().isHydrated) return;
    let cancelled = false;
    supabase
      .from('user_recipes')
      .select('recipe')
      .eq('user_id', user.id)
      .single()
      .then(({ data, error }) => {
        if (cancelled || useOnboardingStore.getState().isHydrated) return;
        const recipe = (data as { recipe?: unknown } | null)?.recipe;
        if (isVibeProfile(recipe)) {
          useOnboardingStore.getState().loadProfile(recipe);
        } else if (!error || error.code === 'PGRST116') {
          // Confirmed: no row (PGRST116) or a row whose recipe isn't a valid
          // profile — nothing real to clobber, safe to allow saves.
          useOnboardingStore.getState().setHydrated(true);
        }
        // Read FAILED (network / timeout / DB jam) → we don't know what
        // exists. Stay un-hydrated: auto-save stays disabled rather than
        // risking a default-profile overwrite of the user's real recipe
        // (2026-07-06: the DB connection jam made exactly this reachable).
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Debounced save.
  useEffect(() => {
    if (!isEditing || !user || !isHydrated) return;

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await supabase.from('user_recipes').upsert(
        {
          user_id: user.id,
          recipe: JSON.parse(JSON.stringify(latestProfile.current)),
          onboarding_completed: true,
          ai_enabled: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
    }, DEBOUNCE_MS);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [isEditing, user, isHydrated, profile]);

  // Immediate save on unmount — catches navigating back before the debounce
  // fires. Gated on hydration so an un-hydrated screen never persists defaults.
  useEffect(() => {
    return () => {
      if (!isEditingRef.current || !userRef.current || !isHydratedRef.current) return;
      supabase.from('user_recipes').upsert(
        {
          user_id: userRef.current.id,
          recipe: JSON.parse(JSON.stringify(latestProfile.current)),
          onboarding_completed: true,
          ai_enabled: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
    };
  }, []);
}
