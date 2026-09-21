/**
 * The Create screen's cast pick, end to end as pure logic: what the chip SAYS
 * (castPreviewLabel) and what the request SENDS (castChoiceRequest).
 *
 * Both failures here are silent. A wrong label means the chip confidently names the
 * wrong person and the user ships the dream anyway; a wrong request means the chip is
 * right and the render is not. Neither throws, so only tests catch them.
 */

import { castPreviewLabel } from '@/lib/castPreviewLabel';
import { castChoiceRequest, castChoiceEquals, type CastChoice } from '@/lib/castChoiceRequest';

describe('castPreviewLabel', () => {
  it('names the person when they have a name', () => {
    expect(castPreviewLabel(true, { name: 'Steph', relationship: 'partner' })).toBe(
      'You and Steph'
    );
  });

  it('falls back to the relationship when they do not', () => {
    // Still true and still useful. What it CANNOT do is be summoned by name, which is
    // what the Settings roster's "Add a name" prompt exists to fix.
    expect(castPreviewLabel(true, { relationship: 'partner' })).toBe('You and your partner');
    expect(castPreviewLabel(true, { relationship: 'friend' })).toBe('You and your friend');
  });

  it('keeps a real name exactly as the user capitalised it', () => {
    // Sentence-casing is for the FALLBACK only — "mcKenna" is how they typed it.
    expect(castPreviewLabel(false, { name: 'mcKenna' })).toBe('mcKenna');
    expect(castPreviewLabel(true, { name: 'mcKenna' })).toBe('You and mcKenna');
  });

  it('sentence-cases a leading fallback but not a trailing one', () => {
    expect(castPreviewLabel(false, { relationship: 'partner' })).toBe('Your partner');
    expect(castPreviewLabel(true, { relationship: 'partner' })).toBe('You and your partner');
  });

  it('handles the solo and empty states', () => {
    expect(castPreviewLabel(true, null)).toBe('You');
    expect(castPreviewLabel(false, null)).toBe('');
  });

  it('ignores a name that is only whitespace', () => {
    expect(castPreviewLabel(true, { name: '   ', relationship: 'friend' })).toBe(
      'You and your friend'
    );
  });
});

describe('castChoiceRequest', () => {
  it('auto sends NOTHING, so the untouched path is unchanged', () => {
    // This is the guarantee that adding a picker did not alter the default flow: with
    // no fields set, the engine detects cast roles from the prompt exactly as before.
    expect(castChoiceRequest({ kind: 'auto' })).toEqual({});
  });

  it('solo forces a self-only render', () => {
    expect(castChoiceRequest({ kind: 'solo' })).toEqual({ force_cast_role: 'self' });
  });

  it('a picked partner forces a dual render and names them', () => {
    expect(castChoiceRequest({ kind: 'partner', id: 'p1' })).toEqual({
      force_cast_role: 'dual',
      cast_partner_id: 'p1',
    });
  });

  it('never emits an undefined cast_partner_id alongside a forced role', () => {
    // An undefined id would reach the engine as "dual with nobody specified", which
    // silently falls back to the default partner — the wrong person, not an error.
    for (const choice of [{ kind: 'auto' }, { kind: 'solo' }] as CastChoice[]) {
      expect('cast_partner_id' in castChoiceRequest(choice)).toBe(false);
    }
  });

  it('only ever uses roles the engine already understands', () => {
    const roles = (['auto', 'solo'] as const)
      .map((kind) => castChoiceRequest({ kind }).force_cast_role)
      .concat(castChoiceRequest({ kind: 'partner', id: 'x' }).force_cast_role);
    for (const role of roles) {
      expect(role === undefined || role === 'self' || role === 'dual').toBe(true);
    }
  });
});

describe('castChoiceEquals', () => {
  it('matches the fixed kinds', () => {
    expect(castChoiceEquals({ kind: 'auto' }, { kind: 'auto' })).toBe(true);
    expect(castChoiceEquals({ kind: 'solo' }, { kind: 'solo' })).toBe(true);
    expect(castChoiceEquals({ kind: 'auto' }, { kind: 'solo' })).toBe(false);
  });

  it('compares partners by id, so two different people are never equal', () => {
    expect(castChoiceEquals({ kind: 'partner', id: 'a' }, { kind: 'partner', id: 'a' })).toBe(true);
    expect(castChoiceEquals({ kind: 'partner', id: 'a' }, { kind: 'partner', id: 'b' })).toBe(
      false
    );
    expect(castChoiceEquals({ kind: 'partner', id: 'a' }, { kind: 'auto' })).toBe(false);
  });
});
