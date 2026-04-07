import { CURATED_MEDIUMS, CURATED_VIBES, MEDIUM_KEYS, VIBE_KEYS } from '@/constants/dreamEngine';
import type { ArtStyle, Aesthetic } from '@/types/vibeProfile';

/** Mediums: Art style tiles — derived from the engine's curated mediums */
export const ART_STYLE_TILES: { key: ArtStyle; label: string }[] = CURATED_MEDIUMS.map((m) => ({
  key: m.key as ArtStyle,
  label: m.label,
}));

/** Vibes: Aesthetic tiles — derived from the engine's curated vibes */
export const AESTHETIC_TILES: { key: Aesthetic; label: string }[] = CURATED_VIBES.map((v) => ({
  key: v.key as Aesthetic,
  label: v.label,
}));

/** Minimum selections per step */
export const LIMITS = {
  aesthetics: { min: 3 },
  art_styles: { min: 2 },
} as const;

/** Total steps in the onboarding flow (excluding welcome) */
export const TOTAL_STEPS = 6;
