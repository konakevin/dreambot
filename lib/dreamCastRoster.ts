/**
 * Dream Cast roster helpers (client).
 *
 * The roster (`partner_library`, up to 5) is the source of truth for a user's
 * loved ones; the ACTIVE one is MIRRORED into `dream_cast`'s `plus_one` slot so
 * the render pipeline (nightly / create / dual swap) keeps reading `plus_one`
 * with zero engine change (Phase 1 — DREAM_PARTNERS_PLAN.md).
 *
 * These are pure transforms over a VibeProfile — used by the onboarding store's
 * roster setters + the lazy legacy migration on load.
 */

import type { VibeProfile, DreamPartner, DreamCastMember } from '@/types/vibeProfile';

/**
 * A UUID v4 for a roster entry. Uses Math.random (NOT crypto) on purpose: a
 * partner id is an internal collection key, not a secret, and importing
 * expo-crypto here would pull a native module into the store's import graph and
 * break the node/jest test environment (onboardingHydration.test loads the store).
 */
export function newPartnerId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** The plus_one cast member that mirrors a partner (drops the roster-only id). */
function partnerToPlusOne(p: DreamPartner): DreamCastMember {
  return {
    role: 'plus_one',
    ...(p.storage_path ? { storage_path: p.storage_path } : {}),
    ...(p.thumb_url ? { thumb_url: p.thumb_url } : {}),
    description: p.description,
    ...(p.gender ? { gender: p.gender } : {}),
    ...(typeof p.age === 'number' ? { age: p.age } : {}),
    ...(p.physical_summary ? { physical_summary: p.physical_summary } : {}),
    ...(p.ethnicity ? { ethnicity: p.ethnicity } : {}),
    relationship: p.relationship,
  };
}

/**
 * Sync `dream_cast`'s `plus_one` slot to the active partner (the render mirror).
 * No active partner → no plus_one member (self-only dreams). `self` + `pet` are
 * left untouched. Call after any roster/active change, before persisting.
 */
export function syncActivePartnerMirror(profile: VibeProfile): VibeProfile {
  const lib = profile.partner_library ?? [];
  const active = lib.find((p) => p.id === profile.active_partner_id) ?? null;
  const others = profile.dream_cast.filter((m) => m.role !== 'plus_one');
  const dream_cast = active ? [...others, partnerToPlusOne(active)] : others;
  return { ...profile, dream_cast };
}

/**
 * Lazy one-time migration: if the roster is empty but a legacy `plus_one` exists
 * in `dream_cast`, seed the roster from it as the (active) first partner. Runs on
 * profile load; idempotent (a non-empty roster short-circuits). Legacy
 * `relationship: 'family'` collapses to 'friend' (Phase 1 only tags partner/friend).
 */
export function migrateLegacyPlusOne(profile: VibeProfile): VibeProfile {
  if ((profile.partner_library?.length ?? 0) > 0) return profile;
  const plusOne = profile.dream_cast.find((m) => m.role === 'plus_one');
  if (!plusOne) {
    return {
      ...profile,
      partner_library: profile.partner_library ?? [],
      active_partner_id: profile.active_partner_id ?? null,
    };
  }
  const partner: DreamPartner = {
    id: newPartnerId(),
    ...(plusOne.storage_path ? { storage_path: plusOne.storage_path } : {}),
    ...(plusOne.thumb_url ? { thumb_url: plusOne.thumb_url } : {}),
    description: plusOne.description,
    ...(plusOne.gender ? { gender: plusOne.gender } : {}),
    ...(typeof plusOne.age === 'number' ? { age: plusOne.age } : {}),
    ...(plusOne.physical_summary ? { physical_summary: plusOne.physical_summary } : {}),
    ...(plusOne.ethnicity ? { ethnicity: plusOne.ethnicity } : {}),
    relationship: plusOne.relationship === 'partner' ? 'partner' : 'friend',
  };
  // Rebuild the plus_one mirror from the (mapped) partner so the two agree.
  return syncActivePartnerMirror({
    ...profile,
    partner_library: [partner],
    active_partner_id: partner.id,
  });
}
