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

/** Longest name we keep. Long enough for "Mom" or "Sarah Jane", short enough that
 *  a roster card's title never wraps. */
export const PARTNER_NAME_MAX = 24;

/**
 * As-you-type clean for a roster name: strip control, zero-width and bidi
 * characters plus line breaks, and cap the length. Spaces survive so the user can
 * keep typing; `finalizePartnerName` tidies them when the field loses focus.
 *
 * NOT `_shared/sanitizeUserText.ts` — that is a Deno edge module the app cannot
 * import, and it is aimed at text that reaches an LLM. This name never does: it is
 * display-only and `partnerToPlusOne` omits it from the cast mirror by
 * construction, which is the real guarantee (and what the test asserts).
 */
export function cleanPartnerNameInput(raw: string): string {
  return raw
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, '')
    .slice(0, PARTNER_NAME_MAX);
}

/** On blur: trim, collapse whitespace runs, and treat an empty result as "no name"
 *  so the card falls back to the relationship word. */
export function finalizePartnerName(raw: string | null | undefined): string | undefined {
  const cleaned = cleanPartnerNameInput(raw ?? '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.length > 0 ? cleaned : undefined;
}

/**
 * The plus_one cast member that mirrors a partner (drops the roster-only id AND the
 * user-typed `name` — the render pipeline must never see either).
 *
 * `prev` is the plus_one member being replaced, and it exists for ONE reason: a roster row
 * must carry a relationship (the type requires it, so migrateLegacyPlusOne invents
 * 'friend' for a legacy +1 that never had one), while a dream_cast member need not. Copying
 * the invention onto the mirror silently ANSWERED a question the user still had to answer:
 * onboarding shows the Friend/Partner pills unselected with "(Choose one)" beside them, and
 * typing a name was enough to seed the roster, sync the mirror, and light up Friend on its
 * own (Kevin, 2026-09-22: "once they fill it in, the relationship is getting auto selected,
 * but it should remain unselected").
 *
 * So an absence is preserved as an absence. A member who HAS a relationship keeps it, and a
 * fresh mirror with no predecessor takes the roster's value as before.
 */
function partnerToPlusOne(p: DreamPartner, prev?: DreamCastMember): DreamCastMember {
  const keepUnset = !!prev && !prev.relationship;
  return {
    role: 'plus_one',
    ...(p.storage_path ? { storage_path: p.storage_path } : {}),
    ...(p.thumb_url ? { thumb_url: p.thumb_url } : {}),
    description: p.description,
    ...(p.gender ? { gender: p.gender } : {}),
    ...(typeof p.age === 'number' ? { age: p.age } : {}),
    ...(p.physical_summary ? { physical_summary: p.physical_summary } : {}),
    ...(p.ethnicity ? { ethnicity: p.ethnicity } : {}),
    ...(keepUnset ? {} : { relationship: p.relationship }),
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
 * Is `name` already taken by a DIFFERENT roster member?
 *
 * Names must be unique per account (Kevin, 2026-09-21). This reverses his 2026-09-15
 * call that "i can have multiple friends named 'steph' or whatever", and the reversal is
 * deliberate: names were display-only decoration then, and they are load-bearing now —
 * "show me and Steph" has to resolve to exactly one person, or the feature is a coin
 * flip the user cannot see. Two Stephs made first-match-wins the only possible rule, and
 * first-match-wins is indistinguishable from a bug when it picks the wrong one.
 *
 * Case-insensitive, because "steph" and "Steph" are the same person to everyone except a
 * string comparison.
 */
export function isNameTaken(profile: VibeProfile, name: string, exceptId: string): boolean {
  const wanted = name.trim().toLowerCase();
  if (!wanted) return false;
  return (profile.partner_library ?? []).some(
    (p) => p.id !== exceptId && (p.name ?? '').trim().toLowerCase() === wanted
  );
}

/** Roster members still missing a name. Empty = every member can be summoned by name. */
export function unnamedPartners(profile: VibeProfile): DreamPartner[] {
  return (profile.partner_library ?? []).filter((p) => !p.name?.trim());
}

/** The roster members eligible to be rolled as the +1 (stable roster order). */
export function enabledPartners(profile: VibeProfile): DreamPartner[] {
  const lib = profile.partner_library ?? [];
  return lib.filter((p) => isPartnerEnabled(p, profile.active_partner_id));
}

/**
 * THE primary rule, in one place: who a Create dream casts when the prompt asks
 * for the +1 in general terms ("me and my partner", "me and my +1").
 *
 * The starred member if they are still switched on, otherwise the first one who
 * is, otherwise nobody (a self-only dream). `active_partner_id` is a POINTER,
 * not the eligibility rule, so it is only honoured while it names someone
 * eligible — which is what keeps a stale pointer from casting a member the user
 * has switched off.
 *
 * Exported because the Settings roster draws the star from it: the UI and the
 * mirror must never disagree about who is primary, and the only way to
 * guarantee that is for both to read the same function.
 */
export function primaryPartnerOf(
  eligible: DreamPartner[],
  activeId: string | null | undefined
): DreamPartner | null {
  return eligible.find((p) => p.id === activeId) ?? eligible[0] ?? null;
}

/** `primaryPartnerOf` over a whole profile. The Settings roster has the eligible
 *  list in hand already and calls the other form; both are the same rule. */
export function primaryPartner(profile: VibeProfile): DreamPartner | null {
  return primaryPartnerOf(enabledPartners(profile), profile.active_partner_id);
}

/**
 * Sync `dream_cast`'s `plus_one` slot (the render mirror) + re-point
 * `active_partner_id` at whoever is mirrored, so the pointer never names a
 * member the user has switched off. Nobody enabled → no plus_one member
 * (self-only dreams). `self` + `pet` are left untouched. Call after any
 * roster/enabled change, before persisting.
 */
export function syncActivePartnerMirror(profile: VibeProfile): VibeProfile {
  const mirrored = primaryPartner(profile);
  const prev = profile.dream_cast.find((m) => m.role === 'plus_one');
  const others = profile.dream_cast.filter((m) => m.role !== 'plus_one');
  const dream_cast = mirrored ? [...others, partnerToPlusOne(mirrored, prev)] : others;
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
