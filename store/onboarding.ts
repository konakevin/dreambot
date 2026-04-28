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

  profile: VibeProfile;

  // Mediums
  toggleArtStyle: (key: ArtStyle) => void;
  setAllArtStyles: (keys: ArtStyle[]) => void;

  // Vibes
  toggleAesthetic: (key: Aesthetic) => void;
  setAllAesthetics: (keys: Aesthetic[]) => void;

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

  profile: { ...DEFAULT_VIBE_PROFILE },

  toggleArtStyle: (key) =>
    set((s) => ({ profile: { ...s.profile, art_styles: toggle(s.profile.art_styles, key) } })),

  setAllArtStyles: (keys) =>
    set((s) => {
      const allSelected = keys.every((k) => s.profile.art_styles.includes(k));
      return { profile: { ...s.profile, art_styles: allSelected ? [] : [...keys] } };
    }),

  toggleAesthetic: (key) =>
    set((s) => ({ profile: { ...s.profile, aesthetics: toggle(s.profile.aesthetics, key) } })),

  setAllAesthetics: (keys) =>
    set((s) => {
      const allSelected = keys.every((k) => s.profile.aesthetics.includes(k));
      return { profile: { ...s.profile, aesthetics: allSelected ? [] : [...keys] } };
    }),

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

  loadProfile: (profile) => set({ profile }),

  reset: () => set({ step: 1, isEditing: false, profile: { ...DEFAULT_VIBE_PROFILE } }),
}));
