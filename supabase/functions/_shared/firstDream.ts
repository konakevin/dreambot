/**
 * First Dream Engine — Edge Function mirror of types/firstDream.ts.
 * Keep these in sync.
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
  objectClass: ObjectClass | null;
  primaryLocation: string;
  primaryObject: string | null;
  castRoles: ('self' | 'plus_one' | 'pet')[];
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

export const FIRST_DREAM_GUARDRAILS = {
  MAX_CHAOS_INTENSITY: 0.3,
  SENSORY_MODE: 'lush' as const,
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
  BLOCKED_VIBES: ['macabre', 'dark', 'fierce', 'nightshade', 'arcane'],
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
  FACE_SWAP_MAX_RETRIES: 3,
} as const;
