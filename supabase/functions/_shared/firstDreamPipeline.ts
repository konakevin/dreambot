/**
 * First Dream Pipeline — orchestrates the persona × location matrix
 * lookup + Sonnet brief construction for the very first dream a user
 * sees at the end of onboarding.
 *
 * Spec: memory/project_first_dream_engine_spec.md
 *
 * Flow:
 *   1. Caller passes vibeProfile + selected location/object cards (with
 *      classifications) + ANTHROPIC_KEY + supabase service client.
 *   2. routeArchetype() → ArchetypeRoll
 *   3. Fetch first_dream_cells row by (persona, location_class), fall
 *      back to (persona, 'base') if missing.
 *   4. Filter object via cell.allowed_object_classes.
 *   5. Build Sonnet brief from cell + roll. Force chaos<0.3, lush sensory
 *      mode, blocked mediums/vibes/phrases.
 *   6. Caller runs Sonnet, post-processes, generates Flux render.
 *
 * Returns the assembled brief + metadata; caller does the actual Sonnet/
 * Flux/face-swap orchestration so this module stays a pure brief builder.
 */

import type {
  ArchetypeRoll,
  FirstDreamCell,
  DbFirstDreamCell,
  Persona,
  LocationClass,
  ObjectClass,
} from './firstDream.ts';
import { dbCellToCell, FIRST_DREAM_GUARDRAILS } from './firstDream.ts';

export interface ResolvedLocationCard {
  name: string;
  location_class: LocationClass;
}

export interface ResolvedObjectCard {
  name: string;
  object_class: ObjectClass;
}

interface CastMember {
  role: 'self' | 'plus_one' | 'pet';
  thumb_url?: string;
  description?: string;
}

interface VibeProfileLike {
  dream_cast?: CastMember[];
  avoid?: string[];
}

export interface BuildFirstDreamBriefInput {
  profile: VibeProfileLike;
  selectedLocations: ResolvedLocationCard[];
  selectedObjects: ResolvedObjectCard[];
  /** When true, force the no-cast variant (face-swap retry exhausted) */
  forceNoCast?: boolean;
}

export interface FirstDreamBrief {
  /** Final archetype roll used (after object filtering applied) */
  roll: ArchetypeRoll;
  /** The cell used (could be the persona-base fallback if specific missing) */
  cell: FirstDreamCell;
  /** Whether we fell back to no-cast variant due to forceNoCast or no real cast */
  isNoCast: boolean;
  /** Cast members the engine should pass to compilePrompt (may be empty if no-cast) */
  castMembers: CastMember[];
  /** Selected medium for this render (random pick from cell.allowedMediums) */
  resolvedMediumKey: string;
  /** Vibe key forced by the cell */
  resolvedVibeKey: string;
  /** Sonnet brief sections — caller assembles into final compilePrompt input */
  sceneInstructions: string;
  /** Banner caption (interpolated with {place}) for the bot message */
  bannerCaption: string;
  /** For telemetry/logging */
  fallbackReasons: string[];
}

// ── Persona/cast routing (pure) ───────────────────────────────────────

function routePersona(cast: CastMember[]): {
  persona: Persona;
  castRoles: ('self' | 'plus_one' | 'pet')[];
  fallbackReasons: string[];
} {
  const fallbackReasons: string[] = [];
  const hasReal = (m: CastMember | undefined) => !!(m && m.thumb_url && m.description);
  const self = cast.find((m) => m.role === 'self');
  const plusOne = cast.find((m) => m.role === 'plus_one');

  if (hasReal(self) && hasReal(plusOne)) {
    return { persona: 'couple', castRoles: ['self', 'plus_one'], fallbackReasons };
  }
  if (hasReal(self)) {
    return { persona: 'portrait', castRoles: ['self'], fallbackReasons };
  }
  if (hasReal(plusOne)) {
    fallbackReasons.push('no_self_using_plus_one');
    return { persona: 'portrait', castRoles: ['plus_one'], fallbackReasons };
  }
  fallbackReasons.push('no_cast_routing_to_vista');
  return { persona: 'vista', castRoles: [], fallbackReasons };
}

// ── Cell fetch ─────────────────────────────────────────────────────────

async function fetchCell(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  persona: Persona,
  locationClass: LocationClass
): Promise<{ cell: FirstDreamCell; usedFallback: boolean }> {
  const { data: specific } = await supabase
    .from('first_dream_cells')
    .select(
      'persona,location_class,composition_brief,lighting_recipe,camera_recipe,sensory_anchor_keys,allowed_mediums,allowed_object_classes,banned_phrases,banner_caption_template,forced_vibe_key,is_base_fallback'
    )
    .eq('persona', persona)
    .eq('location_class', locationClass)
    .maybeSingle();

  if (specific) {
    return { cell: dbCellToCell(specific as DbFirstDreamCell), usedFallback: false };
  }

  // Fall through to (persona, 'base')
  const { data: base, error } = await supabase
    .from('first_dream_cells')
    .select(
      'persona,location_class,composition_brief,lighting_recipe,camera_recipe,sensory_anchor_keys,allowed_mediums,allowed_object_classes,banned_phrases,banner_caption_template,forced_vibe_key,is_base_fallback'
    )
    .eq('persona', persona)
    .eq('location_class', 'base')
    .single();
  if (error || !base) {
    throw new Error(`No cell found for ${persona}:${locationClass} or ${persona}:base`);
  }
  return { cell: dbCellToCell(base as DbFirstDreamCell), usedFallback: true };
}

// ── Object filtering against the cell ─────────────────────────────────

function pickObjectForCell(
  selectedObjects: ResolvedObjectCard[],
  cell: FirstDreamCell
): { primaryObject: string | null; objectClass: ObjectClass | null } {
  if (selectedObjects.length === 0 || cell.allowedObjectClasses.length === 0) {
    return { primaryObject: null, objectClass: null };
  }
  const allowed = new Set(cell.allowedObjectClasses);
  const matched = selectedObjects.find((o) => allowed.has(o.object_class));
  if (!matched) return { primaryObject: null, objectClass: null };
  return { primaryObject: matched.name, objectClass: matched.object_class };
}

// ── Medium picker — curated subset, never bot-only ────────────────────

function pickMedium(cell: FirstDreamCell): string {
  // Filter out any blocked mediums (defensive — seed already does this)
  const blocked = new Set<string>(FIRST_DREAM_GUARDRAILS.BLOCKED_MEDIUMS);
  const safe = cell.allowedMediums.filter((m) => !blocked.has(m));
  if (safe.length === 0) {
    // Should be unreachable per seed-time validation; fall back to canvas
    console.warn('[firstDream] cell has no safe mediums after filter, using canvas');
    return 'canvas';
  }
  return safe[Math.floor(Math.random() * safe.length)];
}

// ── Phrase scrubber for Sonnet output ─────────────────────────────────

export function scrubBlockedPhrases(prompt: string, cellBanned: string[]): string {
  const allBanned = [...FIRST_DREAM_GUARDRAILS.BLOCKED_PHRASES, ...cellBanned].map((p) =>
    p.toLowerCase()
  );
  // Remove sentences containing any banned phrase
  const sentences = prompt.split(/(?<=[.!?])\s+/);
  const cleaned = sentences.filter((s) => {
    const lower = s.toLowerCase();
    return !allBanned.some((b) => lower.includes(b));
  });
  return cleaned.join(' ').trim();
}

// ── Main brief builder ───────────────────────────────────────────────

export async function buildFirstDreamBrief(
  input: BuildFirstDreamBriefInput,
  // deno-lint-ignore no-explicit-any
  supabase: any
): Promise<FirstDreamBrief> {
  const { profile, selectedLocations, selectedObjects, forceNoCast = false } = input;

  // Persona routing
  const cast = profile.dream_cast ?? [];
  const personaRoute = routePersona(cast);

  // Location routing (first selected = primary)
  const primary = selectedLocations[0];
  const locationClass: LocationClass = primary?.location_class ?? 'base';
  const primaryLocation = primary?.name ?? '';

  // Cell fetch with fallback
  const { cell, usedFallback } = await fetchCell(supabase, personaRoute.persona, locationClass);

  // Object filtering
  const { primaryObject, objectClass } = pickObjectForCell(selectedObjects, cell);

  // No-cast variant decision
  const isNoCast = forceNoCast || personaRoute.castRoles.length === 0;

  // Resolve cast — only inject if not no-cast variant
  const castMembers: CastMember[] = isNoCast
    ? []
    : personaRoute.castRoles.flatMap((role) => {
        const m = cast.find((c) => c.role === role);
        return m ? [m] : [];
      });

  // Pick medium (force no-cast → vista mediums for cleaner pure-scene render)
  const mediumKey =
    isNoCast && personaRoute.persona !== 'vista'
      ? pickMedium({
          ...cell,
          allowedMediums: ['canvas', 'watercolor', 'illustration', 'fairytale', 'storybook'],
        })
      : pickMedium(cell);

  // Build the scene instruction block for the Sonnet brief
  const sceneInstructions = [
    `═══ FIRST DREAM RECIPE ═══`,
    `Composition: ${cell.compositionBrief}`,
    `Lighting: ${cell.lightingRecipe}`,
    `Camera: ${cell.cameraRecipe}`,
    cell.sensoryAnchorKeys.length > 0
      ? `Sensory anchors (must include): ${cell.sensoryAnchorKeys.join(', ')}`
      : '',
    primaryLocation ? `Setting: ${primaryLocation}` : '',
    isNoCast
      ? 'Render this as a pure-environment scene with no human characters at all.'
      : `Subjects: ${castMembers.map((m) => `${m.role} (${m.description})`).join(' + ')}`,
    primaryObject
      ? `Featured object: ${primaryObject} (${objectClass}) — natural placement, not forced.`
      : '',
    cell.bannedPhrases.length > 0
      ? `NEVER use these words/themes: ${cell.bannedPhrases.join(', ')}`
      : '',
    `Vibe: ${cell.forcedVibeKey} — first impression favors wonder, beauty, awe over weirdness or edge.`,
    `Sensory mode: lush — render rich tactile detail in every layer.`,
  ]
    .filter(Boolean)
    .join('\n');

  // Banner caption — interpolate {place} and {medium}
  const bannerCaption = cell.bannerCaptionTemplate
    .replace('{place}', primaryLocation || 'a place imagined just for you')
    .replace('{medium}', mediumKey);

  const fallbackReasons = [
    ...personaRoute.fallbackReasons,
    usedFallback ? `cell_fallback:${personaRoute.persona}:${locationClass}->base` : '',
    isNoCast ? 'no_cast_variant' : '',
  ].filter(Boolean);

  const roll: ArchetypeRoll = {
    persona: personaRoute.persona,
    locationClass,
    objectClass,
    primaryLocation,
    primaryObject,
    castRoles: personaRoute.castRoles,
    fallbackReasons,
  };

  return {
    roll,
    cell,
    isNoCast,
    castMembers,
    resolvedMediumKey: mediumKey,
    resolvedVibeKey: cell.forcedVibeKey,
    sceneInstructions,
    bannerCaption,
    fallbackReasons,
  };
}
