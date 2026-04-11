/**
 * Migrate legacy Recipe to VibeProfile v2.
 * Runs lazily on app launch when a legacy recipe is detected.
 */

import type { Recipe } from '@/types/recipe';
import type { VibeProfile, Aesthetic, ArtStyle, MoodAxes } from '@/types/vibeProfile';

const TAG_TO_AESTHETIC: Record<string, Aesthetic> = {
  dreamy: 'dreamy',
  cozy: 'cozy',
  edgy: 'dark',
  mysterious: 'dark',
  futuristic: 'epic',
  nostalgic: 'nostalgic',
  raw: 'chaos',
  whimsical: 'whimsical',
  bold: 'epic',
  gentle: 'minimal',
  peaceful: 'peaceful',
  chaotic: 'psychedelic',
  elegant: 'cinematic',
  playful: 'whimsical',
};

const ERA_TO_AESTHETIC: Record<string, Aesthetic> = {
  synthwave: 'psychedelic',
  steampunk: 'epic',
  victorian: 'dark',
  art_deco: 'cinematic',
  far_future: 'epic',
  medieval: 'dark',
  retro: 'nostalgic',
  ancient: 'epic',
};

export function migrateRecipeToVibeProfile(recipe: Recipe): VibeProfile {
  // Map personality_tags + eras → aesthetics
  const aesthetics = new Set<Aesthetic>();
  for (const tag of recipe.personality_tags ?? []) {
    const mapped = TAG_TO_AESTHETIC[tag];
    if (mapped) aesthetics.add(mapped);
  }
  for (const era of recipe.eras ?? []) {
    const mapped = ERA_TO_AESTHETIC[era];
    if (mapped) aesthetics.add(mapped);
  }
  // Pad to minimum 3
  const defaults: Aesthetic[] = ['dreamy', 'cozy', 'whimsical'];
  for (const d of defaults) {
    if (aesthetics.size >= 3) break;
    aesthetics.add(d);
  }

  // Infer art styles from realism axis
  const artStyles: ArtStyle[] = [];
  if (recipe.axes.realism > 0.6) {
    artStyles.push('photography', 'animation');
  } else if (recipe.axes.realism < 0.4) {
    artStyles.push('watercolor', 'anime');
  } else {
    artStyles.push('canvas', 'watercolor');
  }

  // Map axes → mood axes
  const moods: MoodAxes = {
    peaceful_chaotic: recipe.axes.energy,
    cute_terrifying: 1 - recipe.axes.brightness,
    minimal_maximal: recipe.axes.complexity,
    realistic_surreal: recipe.axes.weirdness,
  };

  // Map legacy interests to world_tags
  const worldTags = (recipe.interests ?? []).map((i: string) => i.replace(/_/g, ' '));

  return {
    version: 2,
    aesthetics: [...aesthetics].slice(0, 6),
    art_styles: artStyles,
    moods,
    dream_seeds: { characters: [], places: [], things: worldTags },
    dream_cast: [],
    avoid: ['text', 'watermarks'],
  };
}

export function isVibeProfile(data: unknown): data is VibeProfile {
  return (
    typeof data === 'object' && data !== null && (data as Record<string, unknown>).version === 2
  );
}

export function isLegacyRecipe(data: unknown): data is Recipe {
  return (
    typeof data === 'object' &&
    data !== null &&
    'axes' in (data as Record<string, unknown>) &&
    !('version' in (data as Record<string, unknown>))
  );
}
