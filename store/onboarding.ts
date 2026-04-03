import { create } from 'zustand';
import type {
  Recipe, RecipeAxes, Interest, SpiritCompanion,
} from '@/types/recipe';
import { DEFAULT_RECIPE } from '@/types/recipe';
import { VIBE_TILES, WORLD_TILES } from '@/constants/onboarding';
import type { VibeTile, WorldTile } from '@/constants/onboarding';

interface OnboardingStore {
  step: number;
  setStep: (step: number) => void;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;

  recipe: Recipe;

  selectedVibes: string[];
  toggleVibe: (key: string) => void;

  selectedWorlds: string[];
  toggleWorld: (key: string) => void;

  toggleInterest: (interest: Interest) => void;
  setSpiritCompanion: (companion: SpiritCompanion | null) => void;
  setWildness: (value: number) => void;
  adjustAxis: (axis: keyof RecipeAxes, delta: number) => void;
  reset: () => void;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function dedupe<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  step: 1,
  setStep: (step) => set({ step }),

  recipe: { ...DEFAULT_RECIPE },

  selectedVibes: [],
  toggleVibe: (key) =>
    set((s) => {
      const current = s.selectedVibes;
      const next = current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key];

      const selectedData = VIBE_TILES.filter((v: VibeTile) => next.includes(v.key));

      if (selectedData.length === 0) {
        return {
          selectedVibes: next,
          recipe: {
            ...s.recipe,
            personality_tags: [],
            scene_atmospheres: [],
            color_palettes: [],
          },
        };
      }

      const personality_tags = dedupe(selectedData.flatMap((v: VibeTile) => v.personality_tags));
      const scene_atmospheres = dedupe(selectedData.flatMap((v: VibeTile) => v.scene_atmospheres));
      const color_palettes = dedupe(selectedData.flatMap((v: VibeTile) => v.color_palettes));

      const avgEnergy = selectedData.reduce((sum: number, v: VibeTile) => sum + v.energy, 0) / selectedData.length;
      const avgBrightness = selectedData.reduce((sum: number, v: VibeTile) => sum + v.brightness, 0) / selectedData.length;
      const avgWarmth = selectedData.reduce((sum: number, v: VibeTile) => sum + v.warmth, 0) / selectedData.length;

      return {
        selectedVibes: next,
        recipe: {
          ...s.recipe,
          personality_tags,
          scene_atmospheres,
          color_palettes,
          axes: {
            ...s.recipe.axes,
            energy: clamp(avgEnergy),
            brightness: clamp(avgBrightness),
            color_warmth: clamp(avgWarmth),
          },
        },
      };
    }),

  selectedWorlds: [],
  toggleWorld: (key) =>
    set((s) => {
      const current = s.selectedWorlds;
      const next = current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key];

      const selectedData = WORLD_TILES.filter((w: WorldTile) => next.includes(w.key));

      const eras = dedupe(selectedData.flatMap((w: WorldTile) => w.eras));
      const settings = dedupe(selectedData.flatMap((w: WorldTile) => w.settings));

      return {
        selectedWorlds: next,
        recipe: { ...s.recipe, eras, settings },
      };
    }),

  toggleInterest: (interest) =>
    set((s) => {
      const current = s.recipe.interests;
      const next = current.includes(interest)
        ? current.filter((i) => i !== interest)
        : [...current, interest];
      return { recipe: { ...s.recipe, interests: next } };
    }),

  setSpiritCompanion: (companion) =>
    set((s) => ({ recipe: { ...s.recipe, spirit_companion: companion } })),

  setWildness: (value) =>
    set((s) => ({
      recipe: {
        ...s.recipe,
        axes: {
          ...s.recipe.axes,
          chaos: clamp(value),
          weirdness: clamp(0.1 + value * 0.6),
          scale: clamp(0.3 + value * 0.5),
        },
      },
    })),

  adjustAxis: (axis, delta) =>
    set((s) => ({
      recipe: {
        ...s.recipe,
        axes: { ...s.recipe.axes, [axis]: clamp(s.recipe.axes[axis] + delta) },
      },
    })),

  isEditing: false,
  setIsEditing: (v) => set({ isEditing: v }),
  reset: () => set({ step: 1, isEditing: false, selectedVibes: [], selectedWorlds: [], recipe: { ...DEFAULT_RECIPE } }),
}));
