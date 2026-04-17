/**
 * useAutoSaveProfile — debounced auto-save for vibe profile changes.
 *
 * Used by both the onboarding flow and the settings sub-screens.
 * Watches the profile in the onboarding store and upserts to user_recipes
 * with a 1.5s debounce. Also fires an immediate save on unmount so
 * navigating back never loses changes.
 */

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useOnboardingStore } from '@/store/onboarding';

const DEBOUNCE_MS = 1500;

export function useAutoSaveProfile() {
  const user = useAuthStore((s) => s.user);
  const isEditing = useOnboardingStore((s) => s.isEditing);
  const profile = useOnboardingStore((s) => s.profile);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestProfile = useRef(profile);
  latestProfile.current = profile;

  useEffect(() => {
    if (!isEditing || !user) return;

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
  }, [isEditing, user, profile]);

  // Immediate save on unmount — catches navigating back before debounce fires
  useEffect(() => {
    return () => {
      if (!isEditing || !user) return;
      supabase.from('user_recipes').upsert(
        {
          user_id: user.id,
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
