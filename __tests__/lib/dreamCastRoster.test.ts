/**
 * Locks the Dream Cast roster invariants that feed the RENDER pipeline: the
 * active partner must mirror into the dream_cast `plus_one` slot (nightly/create
 * read `plus_one`), and a legacy single +1 must migrate into the roster as the
 * active partner. A regression here silently changes who appears in dreams.
 */

import { syncActivePartnerMirror, migrateLegacyPlusOne, newPartnerId } from '@/lib/dreamCastRoster';
import { DEFAULT_VIBE_PROFILE } from '@/types/vibeProfile';
import type { VibeProfile, DreamPartner } from '@/types/vibeProfile';

const base = (over: Partial<VibeProfile> = {}): VibeProfile => ({
  ...DEFAULT_VIBE_PROFILE,
  dream_cast: [],
  ...over,
});

const partner = (id: string, relationship: 'partner' | 'friend' = 'friend'): DreamPartner => ({
  id,
  storage_path: `p-${id}.jpg`,
  description: 'a described face '.repeat(3),
  gender: 'female',
  age: 30,
  physical_summary: 'brown hair, olive skin',
  relationship,
});

const plusOne = (profile: VibeProfile) => profile.dream_cast.find((m) => m.role === 'plus_one');

describe('syncActivePartnerMirror', () => {
  it('mirrors the active partner into the plus_one slot and preserves self', () => {
    const out = syncActivePartnerMirror(
      base({
        dream_cast: [{ role: 'self', description: 'me' }],
        partner_library: [partner('a', 'partner')],
        active_partner_id: 'a',
      })
    );
    expect(plusOne(out)?.storage_path).toBe('p-a.jpg');
    expect(plusOne(out)?.relationship).toBe('partner');
    expect(out.dream_cast.find((m) => m.role === 'self')).toBeTruthy();
  });

  it('removes the plus_one when there is no active partner', () => {
    const out = syncActivePartnerMirror(
      base({
        dream_cast: [
          { role: 'self', description: 'me' },
          { role: 'plus_one', description: 'old' },
        ],
        partner_library: [partner('a')],
        active_partner_id: null,
      })
    );
    expect(plusOne(out)).toBeUndefined();
  });

  it('replaces a stale plus_one with the active partner (never duplicates)', () => {
    const out = syncActivePartnerMirror(
      base({
        dream_cast: [{ role: 'plus_one', description: 'stale' }],
        partner_library: [partner('a'), partner('b')],
        active_partner_id: 'b',
      })
    );
    const plusOnes = out.dream_cast.filter((m) => m.role === 'plus_one');
    expect(plusOnes).toHaveLength(1);
    expect(plusOnes[0]?.storage_path).toBe('p-b.jpg');
  });
});

describe('migrateLegacyPlusOne', () => {
  it('seeds the roster from a legacy plus_one as the active partner + keeps the mirror', () => {
    const out = migrateLegacyPlusOne(
      base({
        dream_cast: [
          { role: 'self', description: 'me' },
          {
            role: 'plus_one',
            storage_path: 'old.jpg',
            description: 'legacy face '.repeat(3),
            gender: 'male',
            age: 40,
            relationship: 'partner',
          },
        ],
      })
    );
    const lib = out.partner_library ?? [];
    expect(lib).toHaveLength(1);
    expect(out.active_partner_id).toBe(lib[0]?.id);
    expect(lib[0]?.relationship).toBe('partner');
    expect(lib[0]?.storage_path).toBe('old.jpg');
    expect(plusOne(out)?.storage_path).toBe('old.jpg');
  });

  it('maps legacy family relationship down to friend', () => {
    const out = migrateLegacyPlusOne(
      base({
        dream_cast: [{ role: 'plus_one', description: 'x'.repeat(30), relationship: 'family' }],
      })
    );
    expect((out.partner_library ?? [])[0]?.relationship).toBe('friend');
  });

  it('is a no-op when the roster is already populated (idempotent)', () => {
    const out = migrateLegacyPlusOne(
      base({
        dream_cast: [{ role: 'plus_one', description: 'x' }],
        partner_library: [partner('a')],
        active_partner_id: 'a',
      })
    );
    const lib = out.partner_library ?? [];
    expect(lib).toHaveLength(1);
    expect(lib[0]?.id).toBe('a');
  });

  it('empties cleanly when there is no plus_one', () => {
    const out = migrateLegacyPlusOne(base({ dream_cast: [{ role: 'self', description: 'me' }] }));
    expect(out.partner_library).toEqual([]);
    expect(out.active_partner_id).toBeNull();
  });
});

describe('newPartnerId', () => {
  it('generates unique, v4-shaped ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => newPartnerId()));
    expect(ids.size).toBe(100);
    expect(newPartnerId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });
});
