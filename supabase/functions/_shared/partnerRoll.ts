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
  /** The user's own label for this person. Carried on the recipe but DISPLAY
   *  ONLY: `mirrorPartnerIntoCast` copies fields explicitly and deliberately
   *  omits it, so a user-typed string never reaches a brief or a Flux prompt. */
  name?: string;
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

/** The eligible roster members, capped at MAX_ENABLED_PARTNERS (stable order). */
export function enabledPartners(
  library: RosterPartner[] | null | undefined,
  activeId: string | null | undefined
): RosterPartner[] {
  return (library ?? [])
    .filter((p) => p && typeof p.id === 'string' && isPartnerEnabled(p, activeId))
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

// ── A relationship word picks the +1's gender (2026-09-26) ─────────────────
//
// "Show me and my husband by Niagara Falls" rendered two women: cleanSelfReferences turns "my husband" into
// "a companion" and nothing ever read the word for a gender, so the starred +1 (a woman on that account) was
// cast whatever the prompt said. When the prompt names ONE gendered relationship and the default +1
// contradicts it, the roster member who fits is cast instead. A chip pick or a name match still wins (the
// caller only asks when neither picked anyone); no fitting member → keep the default and stamp the mismatch.

const MALE_RELATIONSHIP =
  /\b(husband|hubby|boyfriend|bf|dad|daddy|father|son|brother|grandpa|grandfather|granddad|uncle|nephew)\b/i;
const FEMALE_RELATIONSHIP =
  /\b(wife|wifey|girlfriend|gf|mom|mommy|mum|mother|daughter|sister|grandma|grandmother|granny|aunt|niece)\b/i;
const SPOUSE_WORD = /^(husband|hubby|boyfriend|bf|wife|wifey|girlfriend|gf)$/i;

export interface RelationshipGender {
  word: string;
  gender: 'male' | 'female';
  /** A spouse word: prefer a roster member marked 'partner' (family is stored as 'friend'). */
  spouse: boolean;
}

/** The one gendered relationship the prompt names, or null (none, or both kinds: "my wife and her dad"). */
export function relationshipGender(prompt: string | null | undefined): RelationshipGender | null {
  if (!prompt) return null;
  const m = prompt.match(MALE_RELATIONSHIP);
  const f = prompt.match(FEMALE_RELATIONSHIP);
  if (!!m === !!f) return null;
  const word = (m ?? f)![1].toLowerCase();
  return { word, gender: m ? 'male' : 'female', spouse: SPOUSE_WORD.test(word) };
}

/**
 * The roster member to cast instead of a default +1 whose gender contradicts the prompt's relationship word.
 * null = nothing to do (no word, or the default already fits, or the default's gender is unknown). Otherwise
 * `partner` is the fitting member (null when the roster has none) plus the forensic stamp.
 */
export function partnerForRelationship(
  prompt: string | null | undefined,
  defaultGender: 'male' | 'female' | null | undefined,
  library: RosterPartner[] | null | undefined,
  activeId: string | null | undefined
): { partner: RosterPartner | null; stamp: string } | null {
  const rel = relationshipGender(prompt);
  if (!rel || !defaultGender || defaultGender === rel.gender) return null;
  const wantRel = rel.spouse ? 'partner' : 'friend';
  const score = (p: RosterPartner): number =>
    (p.relationship === wantRel ? 2 : 0) + (isPartnerEnabled(p, activeId) ? 1 : 0);
  const fits = (library ?? [])
    .filter(
      (p) =>
        !!p &&
        typeof p.id === 'string' &&
        p.gender === rel.gender &&
        !!p.description &&
        (!!p.thumb_url || !!p.storage_path)
    )
    .sort((a, b) => score(b) - score(a));
  const partner = fits[0] ?? null;
  return {
    partner,
    stamp: `cast_relationship_gender:${rel.word}:${partner ? 'swapped' : 'kept_mismatch'}`,
  };
}
