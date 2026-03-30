import { create } from 'zustand';
import type { Recipe, RecipeAxes, Interest, ColorPalette, PersonalityTag } from '@/types/recipe';
import { DEFAULT_RECIPE } from '@/types/recipe';

interface OnboardingStore {
  /** Current step (1-7) */
  step: number;
  setStep: (step: number) => void;

  /** Accumulated recipe being built across screens */
  recipe: Recipe;

  /** Step 1: Toggle an interest on/off */
  toggleInterest: (interest: Interest) => void;

  /** Step 2: Set realism axis from style spectrum slider */
  setRealism: (value: number) => void;

  /** Step 3: Set mood board position (energy + brightness) */
  setMoodPosition: (energy: number, brightness: number) => void;

  /** Step 4: Toggle a color palette on/off */
  toggleColorPalette: (palette: ColorPalette) => void;

  /** Step 5: Toggle a personality tag on/off */
  togglePersonalityTag: (tag: PersonalityTag) => void;

  /** Step 6: Set chaos/surprise factor */
  setChaos: (value: number) => void;

  /** Apply a partial axes update (for image pair taps or slider changes) */
  adjustAxis: (axis: keyof RecipeAxes, delta: number) => void;

  /** Reset everything (on "Try again" or re-do onboarding) */
  reset: () => void;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  step: 1,
  setStep: (step) => set({ step }),

  recipe: { ...DEFAULT_RECIPE },

  toggleInterest: (interest) =>
    set((s) => {
      const current = s.recipe.interests;
      const next = current.includes(interest)
        ? current.filter((i) => i !== interest)
        : [...current, interest];
      return { recipe: { ...s.recipe, interests: next } };
    }),

  setRealism: (value) =>
    set((s) => ({
      recipe: { ...s.recipe, axes: { ...s.recipe.axes, realism: clamp(value) } },
    })),

  setMoodPosition: (energy, brightness) =>
    set((s) => ({
      recipe: {
        ...s.recipe,
        axes: { ...s.recipe.axes, energy: clamp(energy), brightness: clamp(brightness) },
      },
    })),

  toggleColorPalette: (palette) =>
    set((s) => {
      const current = s.recipe.color_palettes;
      const next = current.includes(palette)
        ? current.filter((p) => p !== palette)
        : current.length >= 2
          ? [current[1], palette]
          : [...current, palette];
      return { recipe: { ...s.recipe, color_palettes: next } };
    }),

  togglePersonalityTag: (tag) =>
    set((s) => {
      const current = s.recipe.personality_tags;
      const next = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag];
      return { recipe: { ...s.recipe, personality_tags: next } };
    }),

  setChaos: (value) =>
    set((s) => ({
      recipe: { ...s.recipe, axes: { ...s.recipe.axes, chaos: clamp(value) } },
    })),

  adjustAxis: (axis, delta) =>
    set((s) => ({
      recipe: {
        ...s.recipe,
        axes: { ...s.recipe.axes, [axis]: clamp(s.recipe.axes[axis] + delta) },
      },
    })),

  reset: () => set({ step: 1, recipe: { ...DEFAULT_RECIPE } }),
}));
