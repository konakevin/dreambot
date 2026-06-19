/** Vibe Profile v2 — server-side mirror of types/vibeProfile.ts.
 *
 * Aesthetic + ArtStyle types + the aesthetics/art_styles favorite arrays
 * were removed 2026-06-02 (Kevin pivoted away from user-curated favorites
 * 2026-05-29 — the nightly engine rolls from dream_eligible curation, the
 * Create screen shows the full catalog every render). Companion strip:
 * resolveMediumFromDb / resolveVibeFromDb lost their userArtStyles /
 * userAesthetics params + the surprise_me / my_mediums / my_vibes
 * branches that consumed them. Migration 218 clears the now-dead
 * `aesthetics` + `art_styles` keys from existing user_recipes.recipe
 * JSONB rows.
 *
 * `dream_seeds.things` was removed 2026-06-02 with the entire objects
 * feature — see project_objects_removed_2026-06-02 memory + migration 216.
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

/** Dream seeds — locations where dreams happen.
 *
 * `characters` is vestigial — cast lives in `dream_cast`. Kept on the
 * type so old JSONB rows deserialize; engine ignores it.
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
  /** Legacy public URL (un-migrated members). New uploads use `storage_path`. */
  thumb_url?: string;
  /** Object path in the PRIVATE `cast-photos` bucket (migration 292). */
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

/** The complete vibe profile stored in user_recipes.recipe JSONB */
export interface VibeProfile {
  version: 2;
  moods: MoodAxes;
  /** Locations + vestigial characters slot */
  dream_seeds: DreamSeeds;
  /** Photos described as text — randomly appear in dreams as stylized characters */
  dream_cast: DreamCastMember[];
  avoid: string[];
  /**
   * Legacy V1 fields — still present on some user_recipes.recipe JSON blobs.
   * Read-only from the server side; the V1 two-pass engine in vibeEngine.ts
   * still dereferences them until Phase 3 deletes that file.
   */
  personal_anchors?: {
    place?: string;
    object?: string;
    era?: string;
    dream_vibe?: string;
  };
  /** Legacy V1: one of 12 spirit creature keys (e.g. 'fox', 'owl'). */
  spirit_companion?: string;
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
