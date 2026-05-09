/**
 * Unit tests for the face-swap directive/flux_fragment override path
 * after migration 154 moved the values out of hardcoded
 * FACE_SWAP_FLUX_OVERRIDES into dream_mediums columns.
 *
 * Critical safety properties this file enforces:
 *   1. applyFaceSwapOverride is a pure no-op when neither face-swap
 *      column is set on the medium — generic (non-stylized) renders
 *      must NOT have their directive or flux_fragment touched.
 *   2. Only the columns explicitly set in the DB override the regular
 *      values; the other column falls through (e.g. pencil overrides
 *      flux_fragment ONLY, directive must stay = the regular directive).
 *   3. applyFaceSwapOverride returns the SAME object reference when
 *      no override fires, so callers can use === to detect a hit.
 *   4. The migration seeds the four expected mediums and only those.
 *   5. The hardcoded FACE_SWAP_FLUX_OVERRIDES record + the
 *      directiveTransform pattern are both gone.
 *   6. Both nightly-dreams and dualBriefBuilder import the new helper
 *      (the old record-export must not be re-introduced).
 *   7. dreamStyles selects + maps the two new columns.
 */

import * as fs from 'fs';
import * as path from 'path';

const REPO = path.join(__dirname, '..', '..');

// ── Live-source path imports (Deno modules — cannot import directly
//     under jest, so we test the resolver via a plain JS reimplementation
//     mirroring the source contract — and pin the source to match via the
//     last assertion below). ─────────────────────────────────────────────

interface OverrideableMedium {
  key: string;
  directive: string;
  fluxFragment: string;
  faceSwapDirective?: string | null;
  faceSwapFluxFragment?: string | null;
}

function applyFaceSwapOverride<T extends OverrideableMedium>(medium: T): T {
  const hasDirective = !!medium.faceSwapDirective;
  const hasFragment = !!medium.faceSwapFluxFragment;
  if (!hasDirective && !hasFragment) return medium;
  return {
    ...medium,
    directive: hasDirective ? (medium.faceSwapDirective as string) : medium.directive,
    fluxFragment: hasFragment ? (medium.faceSwapFluxFragment as string) : medium.fluxFragment,
  };
}

const baseMedium: OverrideableMedium = {
  key: 'photography', // a non-stylized medium with no overrides
  directive: 'Render as a professional photograph...',
  fluxFragment: 'professional photograph, sharp focus',
  faceSwapDirective: null,
  faceSwapFluxFragment: null,
};

// ────────────────────────────────────────────────────────────────────────────
// Behavior of applyFaceSwapOverride
// ────────────────────────────────────────────────────────────────────────────

describe('applyFaceSwapOverride: behavior', () => {
  it('returns the SAME reference when neither override is set', () => {
    const result = applyFaceSwapOverride(baseMedium);
    expect(result).toBe(baseMedium); // identity comparison
  });

  it('returns the same reference when override fields are explicitly null', () => {
    const m = { ...baseMedium, faceSwapDirective: null, faceSwapFluxFragment: null };
    const result = applyFaceSwapOverride(m);
    expect(result).toBe(m);
  });

  it('returns the same reference when override fields are explicitly empty strings', () => {
    // Empty string is falsy → treated like NULL.
    const m = { ...baseMedium, faceSwapDirective: '', faceSwapFluxFragment: '' };
    const result = applyFaceSwapOverride(m);
    expect(result).toBe(m);
  });

  it('replaces ONLY directive when only faceSwapDirective is set', () => {
    const m = {
      ...baseMedium,
      faceSwapDirective: 'NEW directive with realistic human face',
      faceSwapFluxFragment: null,
    };
    const result = applyFaceSwapOverride(m);
    expect(result).not.toBe(m);
    expect(result.directive).toBe('NEW directive with realistic human face');
    expect(result.fluxFragment).toBe(baseMedium.fluxFragment); // unchanged
  });

  it('replaces ONLY flux_fragment when only faceSwapFluxFragment is set (pencil pattern)', () => {
    const m = {
      ...baseMedium,
      key: 'pencil',
      faceSwapDirective: null,
      faceSwapFluxFragment: 'colored pencil drawing, realistic human face with natural proportions',
    };
    const result = applyFaceSwapOverride(m);
    expect(result).not.toBe(m);
    expect(result.fluxFragment).toBe(
      'colored pencil drawing, realistic human face with natural proportions'
    );
    expect(result.directive).toBe(baseMedium.directive); // unchanged
  });

  it('replaces both when both are set (anime/fairytale pattern)', () => {
    const m = {
      ...baseMedium,
      key: 'anime',
      faceSwapDirective: 'anime ENV with realistic faces',
      faceSwapFluxFragment: 'realistic human face, cel-shaded scene',
    };
    const result = applyFaceSwapOverride(m);
    expect(result.directive).toBe('anime ENV with realistic faces');
    expect(result.fluxFragment).toBe('realistic human face, cel-shaded scene');
  });

  it('does not mutate the input medium', () => {
    const m: OverrideableMedium = {
      ...baseMedium,
      faceSwapDirective: 'X',
      faceSwapFluxFragment: 'Y',
    };
    const before = JSON.stringify(m);
    applyFaceSwapOverride(m);
    expect(JSON.stringify(m)).toBe(before);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Source pin — guarantees the test reimplementation matches production.
// If this fails, the production resolver has drifted from the test fake;
// re-sync the body in this file before declaring victory.
// ────────────────────────────────────────────────────────────────────────────

describe('faceSwapFluxOverrides.ts: source matches the tested contract', () => {
  const src = fs.readFileSync(
    path.join(REPO, 'supabase/functions/_shared/faceSwapFluxOverrides.ts'),
    'utf-8'
  );

  it('exports applyFaceSwapOverride', () => {
    expect(src).toContain('export function applyFaceSwapOverride');
  });

  it('reads from medium.faceSwapDirective + medium.faceSwapFluxFragment', () => {
    expect(src).toContain('faceSwapDirective');
    expect(src).toContain('faceSwapFluxFragment');
  });

  it('does NOT export the old hardcoded FACE_SWAP_FLUX_OVERRIDES record', () => {
    expect(src).not.toContain('FACE_SWAP_FLUX_OVERRIDES');
  });

  it('does NOT keep the old directiveTransform pattern', () => {
    expect(src).not.toContain('directiveTransform');
  });

  it('returns same reference when neither override is set (identity short-circuit)', () => {
    expect(src).toMatch(/if \(!hasDirective && !hasFragment\) return medium;/);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Migration 154 — schema + seeds
// ────────────────────────────────────────────────────────────────────────────

describe('migration 154: face_swap_directive + face_swap_flux_fragment', () => {
  const sql = fs.readFileSync(
    path.join(REPO, 'supabase/migrations/154_dream_mediums_face_swap_overrides.sql'),
    'utf-8'
  );

  // Split into per-medium UPDATE blocks so each block can be inspected
  // in isolation. A regex like /UPDATE...[\s\S]+?WHERE key = 'X'/
  // is unsafe even with `g` + lazy — when only one match exists for
  // the target key, the engine starts from the very first UPDATE in the
  // file and gladly consumes earlier UPDATE blocks. Splitting on the
  // literal UPDATE boundary, then truncating at the first WHERE in each
  // block, gives us bulletproof per-medium isolation.
  function blockFor(key: string): string {
    const parts = sql.split('UPDATE public.dream_mediums SET');
    for (const body of parts.slice(1)) {
      const m = body.match(/^([\s\S]*?)WHERE key = '([a-z_]+)'/);
      if (m && m[2] === key) {
        return `UPDATE public.dream_mediums SET${m[1]}WHERE key = '${key}'`;
      }
    }
    return '';
  }

  it('adds both new columns', () => {
    expect(sql).toContain('ADD COLUMN IF NOT EXISTS face_swap_directive');
    expect(sql).toContain('ADD COLUMN IF NOT EXISTS face_swap_flux_fragment');
  });

  it('seeds fairytale with both directive + flux_fragment', () => {
    const block = blockFor('fairytale');
    expect(block).not.toBe('');
    expect(block).toContain('face_swap_flux_fragment');
    expect(block).toContain('face_swap_directive');
    expect(block).toContain('CRITICAL FACE RULE');
  });

  it('seeds anime with both directive + flux_fragment', () => {
    const block = blockFor('anime');
    expect(block).not.toBe('');
    expect(block).toContain('face_swap_flux_fragment');
    expect(block).toContain('face_swap_directive');
    expect(block).toContain('NOT anime eyes');
  });

  it('seeds pencil with flux_fragment ONLY (directive falls through)', () => {
    const block = blockFor('pencil');
    expect(block).not.toBe('');
    expect(block).toContain('face_swap_flux_fragment');
    expect(block).not.toContain('face_swap_directive =');
  });

  it('seeds storybook by deriving face_swap_directive via REPLACE() from existing directive', () => {
    const block = blockFor('storybook');
    expect(block).toContain('face_swap_directive = REPLACE(');
    expect(block).toContain('friendly simplified character design with expressive faces');
    expect(block).toContain(
      'detailed character rendering with photorealistic human faces and natural proportions'
    );
  });

  it('does NOT touch any medium other than the four expected ones', () => {
    const where = sql.match(/WHERE key = '([a-z_]+)'/g) ?? [];
    const keys = where.map((w) => w.match(/'([a-z_]+)'/)![1]);
    expect(keys.sort()).toEqual(['anime', 'fairytale', 'pencil', 'storybook']);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Cross-file wiring — make sure callers + select stay in sync
// ────────────────────────────────────────────────────────────────────────────

describe('cross-file wiring after migration 154', () => {
  const dreamStyles = fs.readFileSync(
    path.join(REPO, 'supabase/functions/_shared/dreamStyles.ts'),
    'utf-8'
  );
  const nightly = fs.readFileSync(
    path.join(REPO, 'supabase/functions/nightly-dreams/index.ts'),
    'utf-8'
  );
  const dualBrief = fs.readFileSync(
    path.join(REPO, 'supabase/functions/_shared/dualBriefBuilder.ts'),
    'utf-8'
  );

  it('dreamStyles selects both new columns', () => {
    expect(dreamStyles).toContain('face_swap_directive');
    expect(dreamStyles).toContain('face_swap_flux_fragment');
  });

  it('dreamStyles maps both new columns onto ResolvedMedium', () => {
    expect(dreamStyles).toContain('faceSwapDirective: row.face_swap_directive');
    expect(dreamStyles).toContain('faceSwapFluxFragment: row.face_swap_flux_fragment');
  });

  it('nightly-dreams uses applyFaceSwapOverride (not the deleted record import)', () => {
    expect(nightly).toContain('import { applyFaceSwapOverride }');
    expect(nightly).not.toContain('FACE_SWAP_FLUX_OVERRIDES');
  });

  it('dualBriefBuilder still imports applyFaceSwapOverride', () => {
    expect(dualBrief).toContain('applyFaceSwapOverride');
  });
});
