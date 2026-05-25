/**
 * DLT cleaned-medium resolution — applyCleanMedium (pure) + fetchCleanMedium.
 *
 * Core contract: when a bot medium has a cleaned (subject-stripped) row, DLT
 * uses it; when it doesn't (or the row is empty / the fetch errors), DLT falls
 * back to the raw bot medium unchanged.
 */

import {
  applyCleanMedium,
  fetchCleanMedium,
  type CleanMediumRow,
} from '../../supabase/functions/_shared/cleanMedium';

const botMedium = {
  key: 'toybox_chaos_mixed',
  label: 'ToyBot Mixed Toybox',
  directive:
    'RAW bot directive — toy cast captured mid-story-beat, action playing out across the scene',
  fluxFragment: 'RAW bot flux — mixed-medium toy cast mid-story-beat, NOT a Pop Mart collection',
  faceSwaps: false,
  characterRenderMode: 'embodied' as const,
};

describe('applyCleanMedium (pure)', () => {
  it('overrides directive + fluxFragment when a clean row has both', () => {
    const clean: CleanMediumRow = {
      medium_key: 'toybox_chaos_mixed',
      clean_flux_fragment: 'stop-motion diorama, plush fabric, die-cast chrome, glossy paint',
      clean_directive: 'stop-motion diorama style, mixed toy materials',
    };
    const out = applyCleanMedium(botMedium, clean);
    expect(out.fluxFragment).toBe(clean.clean_flux_fragment);
    expect(out.directive).toBe(clean.clean_directive);
  });

  it('preserves all other medium fields (only directive/fluxFragment change)', () => {
    const clean: CleanMediumRow = {
      medium_key: 'toybox_chaos_mixed',
      clean_flux_fragment: 'clean flux',
      clean_directive: 'clean directive',
    };
    const out = applyCleanMedium(botMedium, clean);
    expect(out.key).toBe('toybox_chaos_mixed');
    expect(out.label).toBe('ToyBot Mixed Toybox');
    expect(out.faceSwaps).toBe(false);
    expect(out.characterRenderMode).toBe('embodied');
  });

  it('does not mutate the input medium', () => {
    const clean: CleanMediumRow = {
      medium_key: 'x',
      clean_flux_fragment: 'clean flux',
      clean_directive: 'clean directive',
    };
    const snapshot = { ...botMedium };
    applyCleanMedium(botMedium, clean);
    expect(botMedium).toEqual(snapshot);
  });

  // ── Fallback contract ──
  it('falls back to the bot medium when clean row is null', () => {
    expect(applyCleanMedium(botMedium, null)).toBe(botMedium);
  });

  it('falls back when clean row is undefined', () => {
    expect(applyCleanMedium(botMedium, undefined)).toBe(botMedium);
  });

  it('falls back when both clean fields are empty strings', () => {
    const clean: CleanMediumRow = {
      medium_key: 'x',
      clean_flux_fragment: '',
      clean_directive: '',
    };
    expect(applyCleanMedium(botMedium, clean)).toBe(botMedium);
  });

  it('falls back when both clean fields are whitespace-only', () => {
    const clean: CleanMediumRow = {
      medium_key: 'x',
      clean_flux_fragment: '   ',
      clean_directive: '\n\t ',
    };
    expect(applyCleanMedium(botMedium, clean)).toBe(botMedium);
  });

  it('falls back when both clean fields are null', () => {
    const clean: CleanMediumRow = {
      medium_key: 'x',
      clean_flux_fragment: null,
      clean_directive: null,
    };
    expect(applyCleanMedium(botMedium, clean)).toBe(botMedium);
  });

  // ── Per-field independence ──
  it('overrides flux but keeps base directive when only clean_flux_fragment is set', () => {
    const clean: CleanMediumRow = {
      medium_key: 'x',
      clean_flux_fragment: 'clean flux only',
      clean_directive: null,
    };
    const out = applyCleanMedium(botMedium, clean);
    expect(out.fluxFragment).toBe('clean flux only');
    expect(out.directive).toBe(botMedium.directive); // base kept
  });

  it('overrides directive but keeps base flux when only clean_directive is set', () => {
    const clean: CleanMediumRow = {
      medium_key: 'x',
      clean_flux_fragment: '',
      clean_directive: 'clean directive only',
    };
    const out = applyCleanMedium(botMedium, clean);
    expect(out.directive).toBe('clean directive only');
    expect(out.fluxFragment).toBe(botMedium.fluxFragment); // base kept
  });
});

describe('fetchCleanMedium (fail-safe DB fetch)', () => {
  const fakeSb = (result: { data: unknown; error: unknown }) => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => result,
        }),
      }),
    }),
  });

  it('returns the clean row when found', async () => {
    const row = { medium_key: 'k', clean_flux_fragment: 'f', clean_directive: 'd' };
    const out = await fetchCleanMedium(fakeSb({ data: row, error: null }), 'k');
    expect(out).toEqual(row);
  });

  it('returns null when no row exists (→ caller falls back)', async () => {
    const out = await fetchCleanMedium(fakeSb({ data: null, error: null }), 'k');
    expect(out).toBeNull();
  });

  it('returns null on DB error (fail-safe → fallback, never throws)', async () => {
    const out = await fetchCleanMedium(fakeSb({ data: null, error: { message: 'boom' } }), 'k');
    expect(out).toBeNull();
  });

  it('returns null without querying when key is missing', async () => {
    let queried = false;
    const spySb = {
      from: () => {
        queried = true;
        return {
          select: () => ({
            eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }),
          }),
        };
      },
    };
    expect(await fetchCleanMedium(spySb, undefined)).toBeNull();
    expect(await fetchCleanMedium(spySb, null)).toBeNull();
    expect(queried).toBe(false);
  });

  it('returns null if the client throws (fail-safe)', async () => {
    const throwingSb = {
      from: () => {
        throw new Error('network down');
      },
    };
    const out = await fetchCleanMedium(throwingSb, 'k');
    expect(out).toBeNull();
  });
});
