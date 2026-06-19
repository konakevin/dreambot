/**
 * Vibe Profile v2 — the user's creative identity stored as JSONB on
 * user_recipes.recipe.
 *
 * The ArtStyle (mediums) + Aesthetic (vibes) favorite arrays were
 * removed 2026-06-02 — see VibeProfile interface docstring + memory
 * project_vibe_profile_favorites_removed_2026-06-02.
 */

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
  /** Legacy public URL (PUBLIC `avatars` bucket). Present on un-migrated members;
   *  new uploads use `storage_path` (private bucket) instead. Optional now that
   *  cast photos are private — display/describe resolve a signed URL on demand. */
  thumb_url?: string;
  /** Object path in the PRIVATE `cast-photos` bucket (migration 292), e.g.
   *  `<userId>/cast-self-<ts>.jpg`. The source of truth for new uploads; a signed
   *  URL is minted from it for display, describe, and the face-swap render. */
  storage_path?: string;
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
 * favorites captured at onboarding. Kevin pivoted away from that 2026-05-29
 * (the nightly engine rolls mediums/vibes from the curated dream_eligible
 * pool regardless; the Create screen exposes the full catalog every render)
 * and the fields stopped being written. The matching server-side reader
 * branches in resolveMediumFromDb / resolveVibeFromDb (surprise_me,
 * my_mediums, my_vibes — userArtStyles/userAesthetics params) were ripped
 * out 2026-06-02 along with the type field itself. Migration 218 strips
 * the now-dead keys from existing JSONB rows.
 */
export interface VibeProfile {
  version: 2;
  moods: MoodAxes;
  /** Two categories of dream ingredients the engine remixes (objects/things
   *  were removed 2026-06-02 — see project_objects_removed_2026-06-02). */
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
