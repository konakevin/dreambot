/**
 * Archetype Router — maps a user's VibeProfile + curated card selections
 * onto a (persona × location_class × object_class) archetype.
 *
 * Pure function. No DB calls — caller passes in the resolved location and
 * object cards (with their classifications) so this layer is fast and
 * deterministic for any given profile.
 *
 * Spec: memory/project_first_dream_engine_spec.md
 */

import type { VibeProfile, DreamCastMember } from '@/types/vibeProfile';
import type { ArchetypeRoll, Persona, LocationClass, ObjectClass } from '@/types/firstDream';

/** A location card with its classification — what callers must pass in. */
export interface ResolvedLocationCard {
  name: string;
  location_class: LocationClass;
}

/** An object card with its classification. */
export interface ResolvedObjectCard {
  name: string;
  object_class: ObjectClass;
}

export interface RouteArchetypeInput {
  profile: VibeProfile;
  /** All locations the user picked, with their classes. First entry is treated as primary. */
  selectedLocations: ResolvedLocationCard[];
  /** All objects the user picked, with their classes. First entry is treated as primary. */
  selectedObjects: ResolvedObjectCard[];
}

/**
 * Decide persona based on cast availability + vibe.
 *
 * - Couple: both self + plus_one exist → use them as a pair (highest impact)
 * - Portrait: self exists (with or without pet) → solo heroic shot
 * - Vista: no self at all → epic landscape with no figure
 *
 * Pet-only is rare and underwhelming as a first impression, so we route
 * pet-only users to vista (location-led) rather than a "pet portrait."
 */
function routePersona(cast: DreamCastMember[]): {
  persona: Persona;
  castRoles: ('self' | 'plus_one' | 'pet')[];
  fallbackReasons: string[];
} {
  const fallbackReasons: string[] = [];
  const hasReal = (m: DreamCastMember | undefined) => !!(m && m.thumb_url && m.description);

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

/**
 * Pick the primary location. If the user has multiple, use the first one
 * they selected (their "favorite"). If they have no locations at all
 * (shouldn't happen given onboarding mins, but defensive), return null.
 */
function routeLocation(selected: ResolvedLocationCard[]): {
  primaryLocation: string;
  locationClass: LocationClass;
  fallbackReasons: string[];
} {
  const fallbackReasons: string[] = [];
  if (selected.length === 0) {
    fallbackReasons.push('no_location_selected');
    return { primaryLocation: '', locationClass: 'base', fallbackReasons };
  }
  const primary = selected[0];
  return {
    primaryLocation: primary.name,
    locationClass: primary.location_class,
    fallbackReasons,
  };
}

/**
 * Pick a primary object whose class is allowed by the cell. Caller passes
 * the cell's allowed_object_classes to filter. If no allowed object exists,
 * return null and the cell renders without an object.
 */
function routeObject(
  selected: ResolvedObjectCard[],
  allowedClasses: readonly ObjectClass[]
): { primaryObject: string | null; objectClass: ObjectClass | null } {
  if (selected.length === 0 || allowedClasses.length === 0) {
    return { primaryObject: null, objectClass: null };
  }
  const allowedSet = new Set(allowedClasses);
  const matched = selected.find((o) => allowedSet.has(o.object_class));
  if (!matched) return { primaryObject: null, objectClass: null };
  return { primaryObject: matched.name, objectClass: matched.object_class };
}

/**
 * Main router. Returns a fully-resolved archetype roll the engine can use
 * to build a Sonnet brief from the corresponding first_dream_cells row.
 *
 * Note: object routing happens AFTER the cell is fetched (since it needs
 * cell.allowedObjectClasses). The router returns objectClass=null and
 * primaryObject=null here; the caller should call resolveObjectForCell()
 * separately once the cell is loaded.
 */
export function routeArchetype(input: RouteArchetypeInput): ArchetypeRoll {
  const { profile, selectedLocations, selectedObjects } = input;
  const cast = profile.dream_cast ?? [];

  const { persona, castRoles, fallbackReasons: personaFb } = routePersona(cast);
  const {
    primaryLocation,
    locationClass,
    fallbackReasons: locFb,
  } = routeLocation(selectedLocations);

  return {
    persona,
    locationClass,
    objectClass: null, // resolved later by resolveObjectForCell()
    primaryLocation,
    primaryObject: null,
    castRoles,
    fallbackReasons: [...personaFb, ...locFb, `selected_objects:${selectedObjects.length}`],
  };
}

/**
 * Once a cell is loaded, finalize the object choice using the cell's
 * allowed_object_classes filter. Returns updated roll with primaryObject
 * and objectClass set (or both null if no qualifying object).
 */
export function resolveObjectForCell(
  roll: ArchetypeRoll,
  selectedObjects: ResolvedObjectCard[],
  allowedClasses: readonly ObjectClass[]
): ArchetypeRoll {
  const { primaryObject, objectClass } = routeObject(selectedObjects, allowedClasses);
  return { ...roll, primaryObject, objectClass };
}
