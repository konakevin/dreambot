// castPhotoNotify.ts — pure copy + culprit logic for the "your dream face needs a
// new photo" auto-notify (DREAM_CAST_HARDENING_PLAN.md, Lever B backstop).
//
// When a nightly face swap is UNUSABLE, nightly-dreams re-probes the actual cast
// source photos with the /analyze detector and calls planCastPhotoNotify() to
// decide WHO to nudge (self vs partner/friend) and with WHAT copy. Kept pure (no
// Deno/network APIs at module scope) so it runs in the fast jest lane via
// @engine/*. The DB probe + dedup + insert are done by the caller.

export interface CastCandidate {
  /** 'self' | 'plus_one' (partner/friend) | 'pet'. */
  role: string;
  /** plus_one relationship: 'partner' | 'friend' | ... — drives the possessive noun. */
  relationship?: string | null;
  /** The photo's Storage path — the stable dedup key ("once per bad photo"). */
  storagePath?: string | null;
  /**
   * /analyze verdict: true = clears the swap detector, false = genuinely
   * unusable, null = couldn't be probed (Fly outage) — treated as "not a
   * confirmed culprit" so an outage never nags a user about a good photo.
   */
  suitable: boolean | null;
}

export interface CastNotifyPlan {
  /** Notification subtype → drives the fixed title in send-push + the inbox row. */
  subtype: 'self' | 'partner';
  relationship: string | null;
  storagePath: string | null;
  /** The full inbox/push body (relationship word already baked in). */
  body: string;
}

/**
 * The possessive noun for the "other person" copy, keyed by the cast member's
 * relationship. Unknown / missing → the gentle generic "dream partner" (most
 * plus-ones are partners) rather than an awkward blank.
 */
export function relationshipWord(relationship: string | null | undefined): string {
  const rel = (relationship || '').toLowerCase().trim();
  if (rel === 'partner') return 'partner';
  if (rel === 'friend') return 'friend';
  return 'dream partner';
}

/**
 * The notification body. Self variant needs no relationship; the other-person
 * variant names the relationship ("your partner's photo" / "your friend's
 * photo"). Warm "we" voice, no emojis, no em dashes — locked with Kevin.
 */
export function buildCastNotifyBody(
  subtype: 'self' | 'partner',
  relationship?: string | null
): string {
  if (subtype === 'self') {
    return "We couldn't get a clear read on your photo, so you've been sitting out your dreams. Add a clear selfie and you'll drift right back in.";
  }
  const who = relationshipWord(relationship);
  return `We couldn't get a clear read on your ${who}'s photo, so they've been sitting out your dreams. Pop in a clear solo selfie and they'll drift right back in.`;
}

/**
 * Decide who (if anyone) to nudge. A "culprit" is a candidate the probe
 * CONFIRMED unusable (suitable === false); null/true never triggers a nudge, so
 * a transient/compositional swap failure over two good photos stays quiet.
 *
 * Precedence when more than one is bad: the partner (plus_one) first — the most
 * common real failure (a partner's group photo, the "tiffany" case) — with self
 * surfacing on a later night if it's also bad. One nudge per run, never both.
 * Pets are never face-swapped this way, so they're ignored upstream.
 */
export function planCastPhotoNotify(candidates: CastCandidate[]): CastNotifyPlan | null {
  const bad = candidates.filter((c) => c.suitable === false && c.role !== 'pet');
  if (bad.length === 0) return null;
  const culprit = bad.find((c) => c.role === 'plus_one') ?? bad[0];
  const subtype: 'self' | 'partner' = culprit.role === 'self' ? 'self' : 'partner';
  return {
    subtype,
    relationship: culprit.relationship ?? null,
    storagePath: culprit.storagePath ?? null,
    body: buildCastNotifyBody(subtype, culprit.relationship),
  };
}

/**
 * Deterministic UUID from a photo's Storage path, for the notification's uuid
 * `reference_id` — the per-bad-photo dedup key. Same path always yields the same
 * id (nudge once per photo, ever); a re-upload changes the path → a fresh id, so
 * a photo that fails AGAIN after being replaced can nudge again. SHA-256 of the
 * namespaced path, formatted as a v5-shaped UUID (version + variant bits set).
 */
export async function castPhotoDedupId(storagePath: string): Promise<string> {
  const data = new TextEncoder().encode(`cast_photo:${storagePath}`);
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', data));
  const b = digest.slice(0, 16);
  b[6] = (b[6] & 0x0f) | 0x50; // version 5 nibble
  b[8] = (b[8] & 0x3f) | 0x80; // RFC-4122 variant
  const hex = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
