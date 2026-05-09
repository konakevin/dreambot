/**
 * First-Dream Banger Engine — types + ranking constants + persona overrides.
 *
 * Source of truth. The Edge Function imports a mirror of this file from
 * `supabase/functions/_shared/firstDream.ts` (kept in sync manually — Deno
 * can't import from the project's types/ directory).
 *
 * See FIRST_DREAM_BANGER_SPEC.md for design rationale.
 */

// ─── Personas ────────────────────────────────────────────────────────────

/**
 * Derived from cast composition only. Three render templates + the
 * no-cast pure-scene fallback.
 *
 * - `no_cast`     — no self/plus_one photo (pet only also lands here)
 * - `solo_male`   — single face-swap, male
 * - `solo_female` — single face-swap, female (forces coquette vibe)
 * - `duo`         — dual face-swap, "friends" tone (relationship-agnostic)
 */
export type FirstDreamPersona = 'no_cast' | 'solo_male' | 'solo_female' | 'duo';

// ─── Global Rankings ─────────────────────────────────────────────────────

/**
 * Ordered by reliability of delivering a banger first impression.
 * Positions 1-12 are face-swap eligible (used for solo + duo personas).
 * Positions 13-18 are embodied (used for no_cast OR fallback when user
 * picked zero face-swap mediums).
 */
export const GLOBAL_MEDIUM_RANKING: readonly string[] = [
  // Face-swap eligible (1-12)
  'canvas',
  'render',
  'illustration',
  'anime',
  'watercolor',
  'fairytale',
  'pencil',
  'comics',
  'storybook',
  'pop_art',
  'vaporwave',
  'photography',
  // Embodied / non-face-swap (13-18)
  'lego',
  'animation',
  'pixels',
  'claymation',
  'vinyl',
  'handcrafted',
] as const;

/**
 * Number of mediums in the face-swap eligible portion of the ranking.
 * Positions [0, FACE_SWAP_MEDIUM_COUNT) face-swap; the rest are embodied.
 */
export const FACE_SWAP_MEDIUM_COUNT = 12;

/**
 * Ordered by wonder/awe — first impression should skew toward grand,
 * dreamy, magical. Subdued/horror-coded vibes sink to the bottom.
 */
export const GLOBAL_VIBE_RANKING: readonly string[] = [
  'cinematic',
  'epic',
  'enchanted',
  'shimmer',
  'whimsical',
  'nostalgic',
  'peaceful',
  'cozy',
  'ethereal',
  'arcane',
  'ancient',
  'surreal',
  'psychedelic',
  'coquette',
  'voltage',
  'minimal',
  'fierce',
  'dark',
  'nightshade',
  'macabre',
] as const;

// ─── Persona Overrides ───────────────────────────────────────────────────

export interface PersonaOverride {
  /** Hard-force this medium regardless of user picks. */
  forceMedium?: string;
  /** Hard-force this vibe regardless of user picks. */
  forceVibe?: string;
  /** Persona-preferred medium ranking; overlaps with user picks first, falls back to global. */
  mediumRanking?: readonly string[];
  /** Persona-preferred vibe ranking; same fallback semantics as mediumRanking. */
  vibeRanking?: readonly string[];
  /** Vibes to filter OUT of the user's picks before ranking. */
  bannedVibes?: readonly string[];
  /** Mediums to filter OUT of the user's picks before ranking. */
  bannedMediums?: readonly string[];
}

export const PERSONA_OVERRIDES: Record<FirstDreamPersona, PersonaOverride> = {
  no_cast: {
    // Use global rankings.
  },
  solo_male: {
    vibeRanking: [
      'epic',
      'cinematic',
      'fierce',
      'ancient',
      'voltage',
      'enchanted',
      'peaceful',
      'nostalgic',
      'arcane',
      'surreal',
      'shimmer',
      'whimsical',
      'ethereal',
      'nightshade',
      'psychedelic',
      'minimal',
      'cozy',
      'dark',
      'macabre',
    ],
    bannedVibes: ['coquette'],
    // Medium uses global ranking.
  },
  solo_female: {
    forceVibe: 'coquette',
    mediumRanking: ['fairytale', 'anime', 'canvas', 'storybook', 'watercolor'],
  },
  duo: {
    // Both medium and vibe use global rankings.
    // "Friends" tone is applied via the Sonnet brief, not via vibe choice.
  },
};

// ─── Composition Knobs (Locked Per Template) ────────────────────────────

/** Composition mode — must match the seven modes in dreamAlgorithm.ts. */
export type FirstDreamCompositionMode =
  | 'balanced'
  | 'open_vista'
  | 'layered_depth'
  | 'negative_space'
  | 'low_angle_hero'
  | 'overhead'
  | 'intimate_close';

export interface PersonaCompositionConfig {
  /** Top-level composition. */
  composition: 'character' | 'epic_tiny' | 'pure_scene';
  /** Weighted composition mode picker — entries summed for weighted random. */
  compositionModeWeights: ReadonlyArray<readonly [FirstDreamCompositionMode, number]>;
  /** Probability of including a personal object (0-1). */
  objectIncludePct: number;
  /** Action pool tilt — null when composition has no character. */
  actionPool:
    | null
    | {
        kind: 'single';
        /** Bias toward poses that demand a strong scenic backdrop. */
        epicBackdropBias: boolean;
      }
    | {
        kind: 'dual';
        /** Sub-pool tilt for two-character scenes. */
        subPool: 'companion' | 'partner' | 'friends' | 'random';
      };
}

export const PERSONA_COMPOSITION: Record<FirstDreamPersona, PersonaCompositionConfig> = {
  no_cast: {
    composition: 'pure_scene',
    compositionModeWeights: [
      ['open_vista', 60],
      ['layered_depth', 40],
    ],
    objectIncludePct: 0.7,
    actionPool: null,
  },
  solo_male: {
    composition: 'character',
    compositionModeWeights: [
      ['low_angle_hero', 50],
      ['intimate_close', 30],
      ['balanced', 20],
    ],
    objectIncludePct: 0.5,
    actionPool: { kind: 'single', epicBackdropBias: true },
  },
  solo_female: {
    composition: 'character',
    compositionModeWeights: [
      ['balanced', 40],
      ['intimate_close', 40],
      ['low_angle_hero', 20],
    ],
    objectIncludePct: 0.5,
    actionPool: { kind: 'single', epicBackdropBias: true },
  },
  duo: {
    composition: 'character',
    compositionModeWeights: [
      ['balanced', 60],
      ['intimate_close', 40],
    ],
    objectIncludePct: 0.3,
    // "Friends" tone — never partner pool (which skews romantic).
    actionPool: { kind: 'dual', subPool: 'companion' },
  },
};

// ─── Hard Guardrails ─────────────────────────────────────────────────────

/**
 * Phrases banned from the final Flux prompt regardless of user picks.
 * First-impression dreams skew toward wonder, never horror.
 */
export const FIRST_DREAM_BANNED_PHRASES: readonly string[] = [
  'horror',
  'demon',
  'demonic',
  'vampire',
  'halloween',
  'gore',
  'blood',
  'bloody',
  'skull',
  'corpse',
  'rotting',
  'decay',
  'undead',
  'ghoul',
  'zombie',
] as const;

/** Max chaos intensity for first dream (vs nightly's 0.5+ allowance). */
export const FIRST_DREAM_MAX_CHAOS = 0.3;
