/**
 * Unit tests for the cast-photo auto-notify logic (_shared/castPhotoNotify.ts).
 *
 * This picks WHO gets nudged when a nightly face swap is unusable, and with what
 * copy. The invariants that matter:
 *   - never nag a photo that PROBED FINE (suitable !== false) — a transient miss
 *     must stay quiet, or good-photo users get told to re-upload for no reason;
 *   - a Fly-outage verdict (suitable === null) is NOT a culprit (fail-quiet);
 *   - the partner variant names the relationship; unknown → "dream partner";
 *   - the dedup id is deterministic per photo path (nudge once per bad photo).
 * These are locked here so a future edit can't silently regress them.
 */

import {
  relationshipWord,
  buildCastNotifyBody,
  planCastPhotoNotify,
  castPhotoDedupId,
  type CastCandidate,
} from '@engine/castPhotoNotify';

const NO_EMOJI = /^[\p{L}\p{N}\p{P}\p{Z}]*$/u; // letters/numbers/punct/space only
const HAS_EMDASH = /—/;

describe('relationshipWord', () => {
  it('maps partner + friend to their own noun', () => {
    expect(relationshipWord('partner')).toBe('partner');
    expect(relationshipWord('friend')).toBe('friend');
  });
  it('is case/whitespace insensitive', () => {
    expect(relationshipWord(' Partner ')).toBe('partner');
    expect(relationshipWord('FRIEND')).toBe('friend');
  });
  it('falls back to "dream partner" for unknown/missing', () => {
    expect(relationshipWord(null)).toBe('dream partner');
    expect(relationshipWord(undefined)).toBe('dream partner');
    expect(relationshipWord('')).toBe('dream partner');
    expect(relationshipWord('spouse')).toBe('dream partner');
  });
});

describe('buildCastNotifyBody', () => {
  it('self copy needs no relationship and speaks in second person', () => {
    const body = buildCastNotifyBody('self');
    expect(body).toContain('your photo');
    expect(body).toContain("you'll drift right back in");
  });
  it('partner copy names the relationship possessively', () => {
    expect(buildCastNotifyBody('partner', 'partner')).toContain("your partner's photo");
    expect(buildCastNotifyBody('partner', 'friend')).toContain("your friend's photo");
    expect(buildCastNotifyBody('partner', null)).toContain("your dream partner's photo");
  });
  it('carries no emoji and no em dash (locked copy style)', () => {
    for (const body of [
      buildCastNotifyBody('self'),
      buildCastNotifyBody('partner', 'partner'),
      buildCastNotifyBody('partner', null),
    ]) {
      expect(body).toMatch(NO_EMOJI);
      expect(body).not.toMatch(HAS_EMDASH);
    }
  });
});

describe('planCastPhotoNotify', () => {
  const self = (suitable: boolean | null): CastCandidate => ({
    role: 'self',
    storagePath: 'cast/self.jpg',
    suitable,
  });
  const partner = (suitable: boolean | null, relationship = 'partner'): CastCandidate => ({
    role: 'plus_one',
    relationship,
    storagePath: 'cast/partner.jpg',
    suitable,
  });

  it('nudges nobody when every candidate probed fine', () => {
    expect(planCastPhotoNotify([self(true), partner(true)])).toBeNull();
  });

  it('nudges nobody when probes were unavailable (null verdicts)', () => {
    expect(planCastPhotoNotify([self(null), partner(null)])).toBeNull();
  });

  it('nudges self when only the self photo is confirmed bad (solo)', () => {
    const plan = planCastPhotoNotify([self(false)]);
    expect(plan?.subtype).toBe('self');
    expect(plan?.storagePath).toBe('cast/self.jpg');
  });

  it('nudges the partner (with relationship) when the partner photo is bad', () => {
    const plan = planCastPhotoNotify([self(true), partner(false, 'friend')]);
    expect(plan?.subtype).toBe('partner');
    expect(plan?.relationship).toBe('friend');
    expect(plan?.body).toContain("your friend's photo");
  });

  it('prefers the partner when BOTH are bad (self surfaces a later night)', () => {
    const plan = planCastPhotoNotify([self(false), partner(false)]);
    expect(plan?.subtype).toBe('partner');
    expect(plan?.storagePath).toBe('cast/partner.jpg');
  });

  it('never treats a pet as a culprit', () => {
    const pet: CastCandidate = { role: 'pet', storagePath: 'cast/pet.jpg', suitable: false };
    expect(planCastPhotoNotify([pet])).toBeNull();
    // pet bad + partner bad → still the partner
    expect(planCastPhotoNotify([pet, partner(false)])?.subtype).toBe('partner');
  });
});

describe('castPhotoDedupId', () => {
  it('is deterministic per photo path', async () => {
    const a = await castPhotoDedupId('cast/abc.jpg');
    const b = await castPhotoDedupId('cast/abc.jpg');
    expect(a).toBe(b);
  });
  it('differs for a different path (a re-upload can nudge again)', async () => {
    const a = await castPhotoDedupId('cast/abc.jpg');
    const b = await castPhotoDedupId('cast/xyz.jpg');
    expect(a).not.toBe(b);
  });
  it('is a valid RFC-4122 UUID', async () => {
    const id = await castPhotoDedupId('cast/abc.jpg');
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });
});
