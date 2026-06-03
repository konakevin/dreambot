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

/**
 * Dream seeds — places where the user's nightly + first dreams are set.
 *
 * `characters` is vestigial — the cast lives in `dream_cast` (richer
 * photo-described entries) and nothing reads `characters` post-2026-05.
 * Kept on the type so existing recipes deserialize without explosion;
 * the engine ignores it.
 *
 * `things` (personal-anchor objects) was removed 2026-06-02 — the
 * onboarding Objects step, the engine's object roll + object_card
 * compat filter, and the underlying object_cards table were all ripped
 * out at once. See project_objects_removed_2026-06-02 memory + the
 * migration that drops dream_seeds.things + object_cards table.
 */
export interface DreamSeeds {
  /** Vestigial — nothing reads this post-2026-05; cast lives in dream_cast */
  characters: string[];
  /** Where dreams happen — Disneyland, abandoned malls, Tokyo at night */
  places: string[];
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
  /** Numeric age estimate from vision describe (integer, 1–120). Front-loaded
   * in dual face-swap prompts so Flux doesn't drift older. Pets have no age. */
  age?: number;
  /** Concise physical traits summary from Haiku vision — hair, skin, build, eyes. Used for trait enforcement in prompts. */
  physical_summary?: string;
  /** Relationship to the user — only for plus_one role. Affects dream context (romantic vs platonic). */
  relationship?: CastRelationship;
}

/**
 * The complete vibe profile stored in user_recipes.recipe JSONB.
 *
 * `aesthetics` (vibes) and `art_styles` (mediums) used to be user-curated
 * selections captured at onboarding. Kevin pivoted away from that
 * 2026-05-29: the nightly engine rolls mediums/vibes from the curated
 * dream_eligible pool regardless, and the Create screen exposes the full
 * catalog every render. Those fields stopped being written — existing
 * recipes in the DB may still carry them as vestigial keys (JSONB
 * tolerates extras), and engine code that legitimately needs them
 * (generate-dream's surprise_me fallback) reads via optional access on
 * the raw row, not via this type.
 */
export interface VibeProfile {
  version: 2;
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
};

export const DEFAULT_VIBE_PROFILE: VibeProfile = {
  version: 2,
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

/**
 * Type guard for runtime-validated VibeProfile shape. Used by code paths that
 * load `user_recipes.recipe` JSON from the DB and need to confirm it's the
 * current v2 format before passing to the engine.
 */
export function isVibeProfile(data: unknown): data is VibeProfile {
  return (
    typeof data === 'object' && data !== null && (data as Record<string, unknown>).version === 2
  );
}
