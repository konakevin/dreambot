import { create } from 'zustand';
import type {
  VibeProfile,
  Aesthetic,
  ArtStyle,
  MoodAxes,
  DreamSeeds,
  DreamCastMember,
} from '@/types/vibeProfile';
import { DEFAULT_VIBE_PROFILE } from '@/types/vibeProfile';

const MAX_SEEDS_PER_CATEGORY = 10;

type SeedCategory = keyof DreamSeeds;

interface OnboardingStore {
  step: number;
  setStep: (step: number) => void;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  /** True once the store reflects a deliberate load from the DB (a returning
   *  user editing in Settings) OR a confirmed fresh onboarding session (no
   *  existing recipe). The auto-save refuses to write until this is set, so a
   *  cold-mounted editing screen still holding the empty DEFAULT_VIBE_PROFILE
   *  can never overwrite the user's real recipe. */
  isHydrated: boolean;
  setHydrated: (v: boolean) => void;

  profile: VibeProfile;

  // Personality
  setMoodAxis: (axis: keyof MoodAxes, value: number) => void;

  // Dream seeds (characters, places, things)
  addSeed: (category: SeedCategory, value: string) => void;
  removeSeed: (category: SeedCategory, value: string) => void;

  // Dream cast (photo descriptions)
  setCastMember: (member: DreamCastMember) => void;
  removeCastMember: (role: DreamCastMember['role']) => void;

  // Location/object toggles (for curated pickers)
  toggleLocation: (key: string) => void;
  toggleObject: (key: string) => void;
  addLocationPack: (keys: string[]) => void;
  addObjectPack: (keys: string[]) => void;
  toggleAllLocations: (keys: string[]) => void;
  toggleAllObjects: (keys: string[]) => void;

  // Avoid list
  addAvoid: (value: string) => void;
  removeAvoid: (value: string) => void;

  // Scroll lock (sliders disable FlatList paging during drag)
  scrollLocked: boolean;
  setScrollLocked: (v: boolean) => void;

  // Load existing profile for editing
  loadProfile: (profile: VibeProfile) => void;

  reset: () => void;
}

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  step: 1,
  setStep: (step) => set({ step }),

  isEditing: false,
  setIsEditing: (v) => set({ isEditing: v }),
  isHydrated: false,
  setHydrated: (v) => set({ isHydrated: v }),

  profile: { ...DEFAULT_VIBE_PROFILE },

  setMoodAxis: (axis, value) =>
    set((s) => ({
      profile: { ...s.profile, moods: { ...s.profile.moods, [axis]: clamp(value) } },
    })),

  addSeed: (category, value) =>
    set((s) => {
      const trimmed = value.trim();
      const current = s.profile.dream_seeds[category];
      if (!trimmed || current.length >= MAX_SEEDS_PER_CATEGORY) return s;
      if (current.includes(trimmed)) return s;
      return {
        profile: {
          ...s.profile,
          dream_seeds: { ...s.profile.dream_seeds, [category]: [...current, trimmed] },
        },
      };
    }),

  removeSeed: (category, value) =>
    set((s) => ({
      profile: {
        ...s.profile,
        dream_seeds: {
          ...s.profile.dream_seeds,
          [category]: s.profile.dream_seeds[category].filter((t) => t !== value),
        },
      },
    })),

  setCastMember: (member) =>
    set((s) => {
      const filtered = s.profile.dream_cast.filter((m) => m.role !== member.role);
      return { profile: { ...s.profile, dream_cast: [...filtered, member] } };
    }),

  removeCastMember: (role) =>
    set((s) => ({
      profile: { ...s.profile, dream_cast: s.profile.dream_cast.filter((m) => m.role !== role) },
    })),

  toggleLocation: (key) =>
    set((s) => ({
      profile: {
        ...s.profile,
        dream_seeds: {
          ...s.profile.dream_seeds,
          places: toggle(s.profile.dream_seeds.places, key),
        },
      },
    })),

  toggleObject: (key) =>
    set((s) => ({
      profile: {
        ...s.profile,
        dream_seeds: {
          ...s.profile.dream_seeds,
          things: toggle(s.profile.dream_seeds.things, key),
        },
      },
    })),

  addLocationPack: (keys) =>
    set((s) => {
      const current = s.profile.dream_seeds.places;
      const newKeys = keys.filter((k) => !current.includes(k));
      if (newKeys.length === 0) return s;
      return {
        profile: {
          ...s.profile,
          dream_seeds: { ...s.profile.dream_seeds, places: [...current, ...newKeys].slice(0, 25) },
        },
      };
    }),

  toggleAllLocations: (keys) =>
    set((s) => {
      const current = s.profile.dream_seeds.places;
      const allSelected = keys.every((k) => current.includes(k));
      const newPlaces = allSelected
        ? current.filter((k) => !keys.includes(k))
        : [...current, ...keys.filter((k) => !current.includes(k))].slice(0, 25);
      return {
        profile: {
          ...s.profile,
          dream_seeds: { ...s.profile.dream_seeds, places: newPlaces },
        },
      };
    }),

  addObjectPack: (keys) =>
    set((s) => {
      const current = s.profile.dream_seeds.things;
      const newKeys = keys.filter((k) => !current.includes(k));
      if (newKeys.length === 0) return s;
      return {
        profile: {
          ...s.profile,
          dream_seeds: { ...s.profile.dream_seeds, things: [...current, ...newKeys].slice(0, 25) },
        },
      };
    }),

  toggleAllObjects: (keys) =>
    set((s) => {
      const current = s.profile.dream_seeds.things;
      const allSelected = keys.every((k) => current.includes(k));
      const newThings = allSelected
        ? current.filter((k) => !keys.includes(k))
        : [...current, ...keys.filter((k) => !current.includes(k))].slice(0, 25);
      return {
        profile: {
          ...s.profile,
          dream_seeds: { ...s.profile.dream_seeds, things: newThings },
        },
      };
    }),

  addAvoid: (value) =>
    set((s) => {
      const trimmed = value.trim().toLowerCase();
      if (!trimmed || s.profile.avoid.includes(trimmed)) return s;
      return { profile: { ...s.profile, avoid: [...s.profile.avoid, trimmed] } };
    }),

  removeAvoid: (value) =>
    set((s) => ({
      profile: { ...s.profile, avoid: s.profile.avoid.filter((v) => v !== value) },
    })),

  scrollLocked: false,
  setScrollLocked: (v) => set({ scrollLocked: v }),

  loadProfile: (profile) => set({ profile, isHydrated: true }),

  reset: () =>
    set({
      step: 1,
      isEditing: false,
      isHydrated: false,
      scrollLocked: false,
      profile: { ...DEFAULT_VIBE_PROFILE },
    }),
}));
