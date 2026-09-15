/**
 * Dream Cast roster helpers (client).
 *
 * The roster (`partner_library`, up to 5) is the source of truth for a user's
 * loved ones; ONE of them is MIRRORED into `dream_cast`'s `plus_one` slot so
 * the render pipeline (nightly / create / dual swap) keeps reading `plus_one`
 * with zero engine change (Phase 1 — DREAM_PARTNERS_PLAN.md).
 *
 * Multi-cast (MULTI_CAST_PLUS_ONE_PLAN.md): several members can be `enabled` at
 * once. The NIGHTLY engine rolls among them per render, server-side
 * (`_shared/partnerRoll.ts`). The client mirror below is the deterministic
 * default the Create path reads — the active member if it is still enabled,
 * otherwise the first enabled one.
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
 * Is this roster member eligible to star as the +1?
 *
 * MIRROR OF `supabase/functions/_shared/partnerRoll.ts:isPartnerEnabled` — the
 * engine and the app must agree on who is eligible, so change both together
 * (`__tests__/lib/partnerRoll.test.ts` asserts they match on a shared matrix).
 *
 * `enabled` absent means the profile predates multi-cast, so the one member the
 * user had picked (`active_partner_id`) is the only eligible one — a legacy
 * roster keeps behaving exactly as it does today, with no migration.
 */
export function isPartnerEnabled(p: DreamPartner, activeId: string | null | undefined): boolean {
  return p.enabled ?? p.id === activeId;
}

/**
 * The photo that IS the user — whatever the `self` cast member points at.
 * MIRROR OF `_shared/partnerRoll.ts:selfPhotoKey`.
 */
export function selfPhotoKey(profile: VibeProfile): string | null {
  const self = profile.dream_cast.find((m) => m.role === 'self');
  if (!self) return null;
  return self.storage_path || self.thumb_url || null;
}

/**
 * Is this roster member the user's OWN cast photo? Uploading yourself is allowed,
 * you just never get cast beside yourself (Kevin, 2026-09-15: "we should never roll
 * a self with self render"), so such a member is never eligible here OR in the
 * engine (`_shared/partnerRoll.ts`).
 */
export function isSelfPhoto(p: DreamPartner, profile: VibeProfile): boolean {
  const key = selfPhotoKey(profile);
  if (!key) return false;
  return p.storage_path === key || p.thumb_url === key;
}

/** The roster members eligible to be rolled as the +1 (stable roster order). */
export function enabledPartners(profile: VibeProfile): DreamPartner[] {
  const lib = profile.partner_library ?? [];
  return lib.filter(
    (p) => isPartnerEnabled(p, profile.active_partner_id) && !isSelfPhoto(p, profile)
  );
}

/**
 * Sync `dream_cast`'s `plus_one` slot (the render mirror) + re-point
 * `active_partner_id` at whoever is mirrored, so the pointer never names a
 * member the user has switched off. Nobody enabled → no plus_one member
 * (self-only dreams). `self` + `pet` are left untouched. Call after any
 * roster/enabled change, before persisting.
 */
export function syncActivePartnerMirror(profile: VibeProfile): VibeProfile {
  const eligible = enabledPartners(profile);
  const mirrored = eligible.find((p) => p.id === profile.active_partner_id) ?? eligible[0] ?? null;
  const others = profile.dream_cast.filter((m) => m.role !== 'plus_one');
  const dream_cast = mirrored ? [...others, partnerToPlusOne(mirrored)] : others;
  return { ...profile, dream_cast, active_partner_id: mirrored?.id ?? null };
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
    // Explicitly eligible: this IS the +1 they dream with today.
    enabled: true,
  };
  // Rebuild the plus_one mirror from the (mapped) partner so the two agree.
  return syncActivePartnerMirror({
    ...profile,
    partner_library: [partner],
    active_partner_id: partner.id,
  });
}
