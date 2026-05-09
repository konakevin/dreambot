/**
 * First-Dream Banger Engine — Edge Function mirror of `types/firstDream.ts`.
 * Keep these in sync. See FIRST_DREAM_BANGER_SPEC.md for design rationale.
 */

// ─── Personas ────────────────────────────────────────────────────────────

export type FirstDreamPersona = 'no_cast' | 'solo_male' | 'solo_female' | 'duo';

// ─── Global Rankings ─────────────────────────────────────────────────────

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

export const FACE_SWAP_MEDIUM_COUNT = 12;

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
  forceMedium?: string;
  forceVibe?: string;
  mediumRanking?: readonly string[];
  vibeRanking?: readonly string[];
  bannedVibes?: readonly string[];
  bannedMediums?: readonly string[];
}

export const PERSONA_OVERRIDES: Record<FirstDreamPersona, PersonaOverride> = {
  no_cast: {},
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
  },
  solo_female: {
    forceVibe: 'coquette',
    mediumRanking: ['fairytale', 'anime', 'canvas', 'storybook', 'watercolor'],
  },
  duo: {},
};

// ─── Composition Knobs (Locked Per Template) ────────────────────────────

export type FirstDreamCompositionMode =
  | 'balanced'
  | 'open_vista'
  | 'layered_depth'
  | 'negative_space'
  | 'low_angle_hero'
  | 'overhead'
  | 'intimate_close';

export interface PersonaCompositionConfig {
  composition: 'character' | 'epic_tiny' | 'pure_scene';
  compositionModeWeights: ReadonlyArray<readonly [FirstDreamCompositionMode, number]>;
  objectIncludePct: number;
  actionPool:
    | null
    | {
        kind: 'single';
        epicBackdropBias: boolean;
      }
    | {
        kind: 'dual';
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
    actionPool: { kind: 'dual', subPool: 'companion' },
  },
};

// ─── Hard Guardrails ─────────────────────────────────────────────────────

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

export const FIRST_DREAM_MAX_CHAOS = 0.3;
