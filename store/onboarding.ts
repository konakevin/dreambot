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

  // Vibes
  toggleAesthetic: (key: Aesthetic) => void;

  // Personality
  setMoodAxis: (axis: keyof MoodAxes, value: number) => void;

  // Dream seeds (characters, places, things)
  addSeed: (category: SeedCategory, value: string) => void;
  removeSeed: (category: SeedCategory, value: string) => void;

  // Dream cast (photo descriptions)
  setCastMember: (member: DreamCastMember) => void;
  removeCastMember: (role: DreamCastMember['role']) => void;

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

  toggleAesthetic: (key) =>
    set((s) => ({ profile: { ...s.profile, aesthetics: toggle(s.profile.aesthetics, key) } })),

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

  loadProfile: (profile) => set({ profile }),

  reset: () => set({ step: 1, isEditing: false, profile: { ...DEFAULT_VIBE_PROFILE } }),
}));
