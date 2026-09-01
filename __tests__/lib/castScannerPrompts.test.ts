/**
 * Cast-photo scanner — prompt + parsing locks (fast, offline).
 *
 * These are the DETERMINISTIC guards for the cast scanner. The ACCURACY of the
 * scanner (does it read hair/age/ethnicity right on real faces) is measured by the
 * gated eval `scripts/eval-cast-scanner.mjs` against a labeled corpus — that needs a
 * live model, so it runs on demand, not here. What THIS file locks is the thing a
 * future edit could silently break: the de-biased hair prompt (the fleet over-greying
 * came from a prompt that PRIMED grey) and the summary-rewrite behavior.
 */

import {
  HAIR_COLOR_PROMPT,
  replaceHairColorInSummary,
  CAST_ETHNICITY_BUCKETS,
} from '@engine/vision';

describe('HAIR_COLOR_PROMPT — de-bias lock (regression guard)', () => {
  it('does NOT prime grey (the exact bias that over-greyed the fleet)', () => {
    // The old prompt said: "...(say 'greying' or 'salt-and-pepper' if grey is present)"
    expect(HAIR_COLOR_PROMPT).not.toMatch(/if grey is present/i);
    expect(HAIR_COLOR_PROMPT).not.toMatch(/say\s+'?(greying|salt-and-pepper)'?\s+(or|if)/i);
  });

  it('actively de-biases: grey only when clearly/mostly grey, strands are not grey', () => {
    expect(HAIR_COLOR_PROMPT).toMatch(/only if/i);
    expect(HAIR_COLOR_PROMPT).toMatch(/not grey/i);
  });

  it('offers the full plain-color palette (not just grey vocabulary)', () => {
    for (const c of ['black', 'brown', 'blonde', 'red', 'auburn']) {
      expect(HAIR_COLOR_PROMPT.toLowerCase()).toContain(c);
    }
  });

  it('handles bald explicitly (bald must not read as a hair color)', () => {
    expect(HAIR_COLOR_PROMPT.toLowerCase()).toContain('bald');
  });
});

describe('CAST_ETHNICITY_BUCKETS — the 6 intended buckets', () => {
  it('is exactly the 6 broad buckets (SE-Asian + Pacific Islander merge into East Asian)', () => {
    expect([...CAST_ETHNICITY_BUCKETS]).toEqual([
      'White',
      'Black',
      'East Asian',
      'South Asian',
      'Hispanic/Latino',
      'Middle Eastern',
    ]);
    expect(CAST_ETHNICITY_BUCKETS).not.toContain('Southeast Asian');
    expect(CAST_ETHNICITY_BUCKETS).not.toContain('Pacific Islander');
  });
});

describe('replaceHairColorInSummary — inject the focused color, keep everything else', () => {
  it('replaces the hair-clause color, keeps cut/style + skin + build', () => {
    const out = replaceHairColorInSummary(
      'Chestnut brown hair in a modern tapered cut, warm medium skin tone, athletic build',
      'black'
    );
    expect(out).toContain('black hair');
    expect(out).not.toMatch(/chestnut/i);
    expect(out).toContain('modern tapered cut'); // style preserved
    expect(out).toContain('warm medium skin tone'); // skin preserved
    expect(out).toContain('athletic build');
  });

  it('does NOT touch a beard/facial-hair clause (only head hair)', () => {
    const out = replaceHairColorInSummary(
      'dark brown hair swept back, full reddish-brown beard, fair skin',
      'blonde'
    );
    expect(out).toContain('blonde hair');
    expect(out).toContain('full reddish-brown beard'); // beard color untouched
  });

  it('prepends a hair clause when the summary has none', () => {
    const out = replaceHairColorInSummary('athletic build, brown eyes', 'auburn');
    expect(out).toBe('auburn hair, athletic build, brown eyes');
  });

  it('is a no-op on empty inputs (null-safe)', () => {
    expect(replaceHairColorInSummary('', 'black')).toBe('');
    expect(replaceHairColorInSummary('brown hair, tan skin', '')).toBe('brown hair, tan skin');
  });
});
