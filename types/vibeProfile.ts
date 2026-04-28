/**
 * Vibe Profile v2 — replaces Recipe as the user's creative identity.
 *
 * ArtStyle and Aesthetic are medium/vibe keys from the dream_mediums
 * and dream_vibes DB tables. Validated at runtime via DB fetch.
 */

/** Medium key from dream_mediums table. Validated at runtime via DB fetch. */
export type ArtStyle = string;

/** Vibe key from dream_vibes table. Validated at runtime via DB fetch. */
export type Aesthetic = string;

/** 4 bipolar mood sliders, each 0.0–1.0 */
export interface MoodAxes {
  /** 0 = peaceful, 1 = chaotic */
  peaceful_chaotic: number;
  /** 0 = cute, 1 = terrifying */
  cute_terrifying: number;
  /** 0 = minimal, 1 = maximal */
  minimal_maximal: number;
  /** 0 = realistic, 1 = surreal */
  realistic_surreal: number;
}

/** Dream seeds — three categories of ingredients the engine mashes up */
export interface DreamSeeds {
  /** Who shows up — my cat, astronauts, tiny monsters, grandma */
  characters: string[];
  /** Where dreams happen — Disneyland, abandoned malls, Tokyo at night */
  places: string[];
  /** Objects that appear, transform, or become something else — donuts, guitars, neon signs */
  things: string[];
}

/** Relationship type for the +1 cast member — affects how they appear in dreams */
export type CastRelationship = 'partner' | 'friend' | 'family';

/** A person or pet the user uploads — photo gets described once, description used in dreams */
export interface DreamCastMember {
  /** 'self' | 'plus_one' | 'pet' */
  role: 'self' | 'plus_one' | 'pet';
  /** Thumbnail URL stored in Supabase storage */
  thumb_url: string;
  /** AI-generated text description of appearance (set once at save time) */
  description: string;
  /** Explicit gender from vision describe — used by castResolver for gender lock. Pets have no gender. */
  gender?: 'male' | 'female';
  /** Concise physical traits summary from Haiku vision — hair, skin, build, eyes. Used for trait enforcement in prompts. */
  physical_summary?: string;
  /** Relationship to the user — only for plus_one role. Affects dream context (romantic vs platonic). */
  relationship?: CastRelationship;
}

/** The complete vibe profile stored in user_recipes.recipe JSONB */
export interface VibeProfile {
  version: 2;
  aesthetics: Aesthetic[];
  art_styles: ArtStyle[];
  moods: MoodAxes;
  /** Three categories of dream ingredients the engine remixes */
  dream_seeds: DreamSeeds;
  /** Photos described as text — randomly appear in dreams as stylized characters */
  dream_cast: DreamCastMember[];
  avoid: string[];
}

export const DEFAULT_DREAM_SEEDS: DreamSeeds = {
  characters: [],
  places: [],
  things: [],
};

export const DEFAULT_VIBE_PROFILE: VibeProfile = {
  version: 2,
  aesthetics: [],
  art_styles: [],
  moods: {
    peaceful_chaotic: 0.5,
    cute_terrifying: 0.3,
    minimal_maximal: 0.5,
    realistic_surreal: 0.5,
  },
  dream_seeds: { ...DEFAULT_DREAM_SEEDS },
  dream_cast: [],
  avoid: ['text', 'watermarks'],
};

/** Prompt mode — adjusts weighting and creative direction */
export type PromptMode =
  | 'dream_me'
  | 'chaos'
  | 'cinematic_poster'
  | 'minimal_mood'
  | 'nature_escape'
  | 'character_study'
  | 'nostalgia_trip';

/** Structured concept output from Pass 1 */
export interface ConceptRecipe {
  subject: string;
  environment: string;
  lighting: string;
  camera: string;
  style: string;
  palette: string;
  twist: string;
  composition: string;
  mood: string;
}
