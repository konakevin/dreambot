/**
 * Multi-cast +1 roll (MULTI_CAST_PLUS_ONE_PLAN.md).
 *
 * A user's Dream Cast roster (`partner_library`, up to 5) can have SEVERAL
 * members marked eligible to star alongside them. This module picks ONE of them
 * per render and mirrors it into `dream_cast`'s `plus_one` slot, so every
 * downstream reader (castResolver, dualBriefBuilder, the swap pipeline, the
 * relationship gate) keeps reading `plus_one` with zero engine change.
 *
 * Pure + deterministic given its rng — the render path calls it once, before
 * cast photos are hydrated to signed URLs.
 */

/** Ceiling on how many roster members can be eligible at once (client enforces
 *  the same number when adding; re-checked here so a hand-edited or stale-client
 *  recipe can't widen the pool). */
export const MAX_ENABLED_PARTNERS = 5;

/** A roster entry — the server mirror of `DreamPartner` in types/vibeProfile.ts. */
export interface RosterPartner {
  id: string;
  storage_path?: string;
  thumb_url?: string;
  description: string;
  gender?: 'male' | 'female';
  age?: number;
  physical_summary?: string;
  ethnicity?: string;
  relationship: 'partner' | 'friend';
  /** Eligible to be rolled as the +1. Absent → fall back to the legacy
   *  single-active model (see isPartnerEnabled). */
  enabled?: boolean;
}

/** Minimal cast-member shape this module writes (matches DreamCastMember). */
export interface MirrorCastMember {
  role: 'self' | 'plus_one' | 'pet';
  thumb_url?: string;
  storage_path?: string;
  description: string;
  gender?: 'male' | 'female';
  age?: number;
  physical_summary?: string;
  ethnicity?: string;
  relationship?: string;
}

/**
 * THE eligibility rule. Mirrored 1:1 in `lib/dreamCastRoster.ts` (client) and
 * locked by `__tests__/lib/partnerRoll.test.ts` — change both together.
 *
 * `enabled` absent means the recipe predates multi-cast, so the ONE member the
 * user had selected (`active_partner_id`) is the only eligible one: a legacy
 * profile rolls exactly what it rolls today.
 */
export function isPartnerEnabled(p: RosterPartner, activeId: string | null | undefined): boolean {
  return p.enabled ?? p.id === activeId;
}

/**
 * The photo that IS the user — whatever the `self` cast member points at.
 * `storage_path` for current uploads, `thumb_url` for un-migrated legacy members.
 */
export function selfPhotoKey(cast: MirrorCastMember[] | null | undefined): string | null {
  const self = (cast ?? []).find((m) => m && m.role === 'self');
  if (!self) return null;
  return self.storage_path || self.thumb_url || null;
}

/** Is this roster member the user's OWN cast photo? */
export function isSelfPhoto(
  p: Pick<RosterPartner, 'storage_path' | 'thumb_url'>,
  selfKey: string | null | undefined
): boolean {
  if (!selfKey) return false;
  return p.storage_path === selfKey || p.thumb_url === selfKey;
}

/**
 * The eligible roster members, capped at MAX_ENABLED_PARTNERS (stable order).
 *
 * Pass `selfKey` (from `selfPhotoKey`) and a member that is the user's OWN photo is
 * dropped: uploading yourself as a cast member is allowed, but you never get cast
 * beside yourself (Kevin, 2026-09-15: "we should never roll a self with self
 * render"). Everyone ticked being the self photo therefore means a self-only dream.
 */
export function enabledPartners(
  library: RosterPartner[] | null | undefined,
  activeId: string | null | undefined,
  selfKey?: string | null
): RosterPartner[] {
  return (library ?? [])
    .filter((p) => p && typeof p.id === 'string' && isPartnerEnabled(p, activeId))
    .filter((p) => !isSelfPhoto(p, selfKey))
    .slice(0, MAX_ENABLED_PARTNERS);
}

export type PartnerRollReason = 'none_enabled' | 'only_one' | 'rotation' | 'rotation_starved';

export interface PartnerRoll {
  partner: RosterPartner | null;
  reason: PartnerRollReason;
  /** How many were eligible — stamped for forensics. */
  poolSize: number;
}

/**
 * Pick the +1 for this render.
 *
 * Recency-avoiding, the same way the nightly engine already de-dupes mediums,
 * vibes and locations: everyone eligible gets a turn before anyone repeats. With
 * N enabled we exclude the last N-1 partners rolled, so N=2 strictly alternates
 * and N=5 completes a full rotation. If that filter starves (a shorter history
 * than expected, or ids that changed), fall back to the whole pool rather than
 * failing the render.
 *
 * `recentIds` is newest-first.
 */
export function rollPartner(
  enabled: RosterPartner[],
  recentIds: string[],
  rnd: () => number
): PartnerRoll {
  if (enabled.length === 0) return { partner: null, reason: 'none_enabled', poolSize: 0 };
  if (enabled.length === 1) return { partner: enabled[0], reason: 'only_one', poolSize: 1 };

  const window = recentIds.slice(0, enabled.length - 1);
  const fresh = enabled.filter((p) => !window.includes(p.id));
  const pool = fresh.length > 0 ? fresh : enabled;
  const picked = pool[Math.min(pool.length - 1, Math.floor(rnd() * pool.length))];
  return {
    partner: picked,
    reason: fresh.length > 0 ? 'rotation' : 'rotation_starved',
    poolSize: enabled.length,
  };
}

/**
 * Write the rolled partner into the cast's `plus_one` slot (self + pet are left
 * alone). `null` removes the slot entirely → a self-only dream, which is exactly
 * what "nobody enabled" means. Order matches the client mirror: plus_one last.
 */
export function mirrorPartnerIntoCast(
  cast: MirrorCastMember[] | null | undefined,
  partner: RosterPartner | null
): MirrorCastMember[] {
  const others = (cast ?? []).filter((m) => m && m.role !== 'plus_one');
  if (!partner) return others;
  return [
    ...others,
    {
      role: 'plus_one',
      ...(partner.storage_path ? { storage_path: partner.storage_path } : {}),
      ...(partner.thumb_url ? { thumb_url: partner.thumb_url } : {}),
      description: partner.description,
      ...(partner.gender ? { gender: partner.gender } : {}),
      ...(typeof partner.age === 'number' ? { age: partner.age } : {}),
      ...(partner.physical_summary ? { physical_summary: partner.physical_summary } : {}),
      ...(partner.ethnicity ? { ethnicity: partner.ethnicity } : {}),
      relationship: partner.relationship,
    },
  ];
}

/**
 * Last line of defence for the self-with-self rule: drop a `plus_one` that is
 * literally the user's own cast photo, whatever put it there. Runs on EVERY render,
 * including the ones where the roll is skipped entirely (a recipe with no roster
 * still carries whatever plus_one onboarding wrote), so the guarantee does not
 * depend on the roster being in any particular state.
 */
export function dropSelfDuplicatePlusOne(cast: MirrorCastMember[] | null | undefined): {
  cast: MirrorCastMember[];
  dropped: boolean;
} {
  const list = (cast ?? []).filter(Boolean);
  const selfKey = selfPhotoKey(list);
  if (!selfKey) return { cast: list, dropped: false };
  const kept = list.filter((m) => m.role !== 'plus_one' || !isSelfPhoto(m, selfKey));
  return { cast: kept, dropped: kept.length !== list.length };
}
