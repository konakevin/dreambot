/**
 * Guards the profile-wipe data-loss fix (2026-05-26): the onboarding store's
 * `isHydrated` flag is what gates useAutoSaveProfile so a cold / un-loaded
 * editing screen (deep link, push-notification tap, hot reload) can never
 * overwrite a user's real recipe with empty defaults.
 *
 * The hook's effects need a React harness, but the invariant the guard relies
 * on is pure store state — tested here.
 */

import { useOnboardingStore } from '@/store/onboarding';
import { DEFAULT_VIBE_PROFILE } from '@/types/vibeProfile';

describe('onboarding store — isHydrated gate', () => {
  beforeEach(() => useOnboardingStore.getState().reset());

  it('starts un-hydrated (a fresh/cold store must not be trusted to save)', () => {
    expect(useOnboardingStore.getState().isHydrated).toBe(false);
  });

  it('loadProfile (returning user / Settings) hydrates the store', () => {
    // Was checking aesthetics roundtrip; that field was removed when
    // Kevin pivoted away from user-curated vibes. dream_seeds.places is
    // a comparable string[] slot on the live shape.
    useOnboardingStore.getState().loadProfile({
      ...DEFAULT_VIBE_PROFILE,
      dream_seeds: { ...DEFAULT_VIBE_PROFILE.dream_seeds, places: ['kauai'] },
    });
    expect(useOnboardingStore.getState().isHydrated).toBe(true);
    expect(useOnboardingStore.getState().profile.dream_seeds.places).toEqual(['kauai']);
  });

  it('setHydrated(true) marks hydrated without mutating the profile (new-user onboarding path)', () => {
    const before = useOnboardingStore.getState().profile;
    useOnboardingStore.getState().setHydrated(true);
    expect(useOnboardingStore.getState().isHydrated).toBe(true);
    expect(useOnboardingStore.getState().profile).toBe(before);
  });

  it('reset clears hydration (sign-out) so the next session must re-load before saving', () => {
    useOnboardingStore.getState().setHydrated(true);
    useOnboardingStore.getState().reset();
    expect(useOnboardingStore.getState().isHydrated).toBe(false);
  });
});
