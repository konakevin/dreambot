/**
 * First Dream Engine — types for the persona × location matrix.
 *
 * Spec: memory/project_first_dream_engine_spec.md
 * Phase 0 locked 2026-05-01.
 */

export type Persona = 'portrait' | 'vista' | 'couple';

export type LocationClass =
  | 'urban'
  | 'coastal'
  | 'forest'
  | 'mountain'
  | 'desert'
  | 'interior'
  | 'architectural'
  | 'garden'
  | 'aquatic'
  | 'sky_cosmic'
  | 'base';

export type ObjectClass =
  | 'personal'
  | 'companion'
  | 'vehicle'
  | 'magical'
  | 'natural'
  | 'tech'
  | 'food';

export interface ArchetypeRoll {
  persona: Persona;
  locationClass: LocationClass;
  /** null when no object selected or no qualifying object */
  objectClass: ObjectClass | null;
  /** the specific location card chosen for the prompt */
  primaryLocation: string;
  /** the specific object chosen for the prompt, when objectClass is set */
  primaryObject: string | null;
  /** cast roles to inject — empty for vista, [self] for portrait, [self,plus_one] for couple */
  castRoles: ('self' | 'plus_one' | 'pet')[];
  /** records why the persona/class fell back, for telemetry */
  fallbackReasons: string[];
}

export interface FirstDreamCell {
  persona: Persona;
  locationClass: LocationClass;
  compositionBrief: string;
  lightingRecipe: string;
  cameraRecipe: string;
  sensoryAnchorKeys: string[];
  allowedMediums: string[];
  allowedObjectClasses: ObjectClass[];
  bannedPhrases: string[];
  bannerCaptionTemplate: string;
  forcedVibeKey: string;
  isBaseFallback: boolean;
}

/** Database row format (snake_case) for fetching cells from supabase */
export interface DbFirstDreamCell {
  persona: Persona;
  location_class: LocationClass;
  composition_brief: string;
  lighting_recipe: string;
  camera_recipe: string;
  sensory_anchor_keys: string[];
  allowed_mediums: string[];
  allowed_object_classes: ObjectClass[];
  banned_phrases: string[];
  banner_caption_template: string;
  forced_vibe_key: string;
  is_base_fallback: boolean;
}

export function dbCellToCell(row: DbFirstDreamCell): FirstDreamCell {
  return {
    persona: row.persona,
    locationClass: row.location_class,
    compositionBrief: row.composition_brief,
    lightingRecipe: row.lighting_recipe,
    cameraRecipe: row.camera_recipe,
    sensoryAnchorKeys: row.sensory_anchor_keys,
    allowedMediums: row.allowed_mediums,
    allowedObjectClasses: row.allowed_object_classes,
    bannedPhrases: row.banned_phrases,
    bannerCaptionTemplate: row.banner_caption_template,
    forcedVibeKey: row.forced_vibe_key,
    isBaseFallback: row.is_base_fallback,
  };
}

/** Hard guardrails applied to every first-dream render regardless of cell */
export const FIRST_DREAM_GUARDRAILS = {
  /** Maximum chaos intensity (0-1). First impressions favor wonder over weirdness */
  MAX_CHAOS_INTENSITY: 0.3,
  /** sensory_anchors mode — locked to lush regardless of user vibe */
  SENSORY_MODE: 'lush' as const,
  /** Mediums NEVER used on first dream even if user picked them */
  BLOCKED_MEDIUMS: [
    'gothic',
    'gothic_realistic',
    'gothic_whimsy',
    'gothic_painted',
    'gothic_architecture',
    'gothic_oil_garden',
    'vampire_portrait',
    'real_astro',
  ],
  /** Vibes NEVER used on first dream even if user picked them */
  BLOCKED_VIBES: ['macabre', 'dark', 'fierce', 'nightshade', 'arcane'],
  /** Phrase blacklist applied to the final Sonnet brief */
  BLOCKED_PHRASES: [
    'gothic',
    'horror',
    'demon',
    'demonic',
    'vampire',
    'halloween',
    'macabre',
    'dark fantasy',
    'jack skellington',
    'creepy',
    'sinister',
  ],
  /** Max face-swap retry attempts before falling back to no-cast */
  FACE_SWAP_MAX_RETRIES: 3,
} as const;
