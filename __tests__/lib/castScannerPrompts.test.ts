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
  VISION_PROMPTS,
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

  /**
   * The focused read answers from a flat ~10-word natural palette, so letting it
   * clobber an ALREADY-distinctive clause averages the person away. The 2026-09-01
   * fleet re-scan did exactly that: "Long purple-to-teal ombre wavy hair" became
   * "blonde hair", and "salt-and-pepper white hair" became "dark brown hair".
   * Dyed / multi-tone hair is the identity signal we least want flattened.
   */
  it('does NOT repaint dyed / multi-tone / ombre hair', () => {
    expect(
      replaceHairColorInSummary('long purple-to-teal ombre wavy hair, fair skin', 'blonde')
    ).toBe('long purple-to-teal ombre wavy hair, fair skin');
    expect(replaceHairColorInSummary('salt-and-pepper hair, tan skin', 'dark brown')).toBe(
      'salt-and-pepper hair, tan skin'
    );
    expect(replaceHairColorInSummary('brown hair with caramel highlights', 'black')).toBe(
      'brown hair with caramel highlights'
    );
  });

  it('still corrects a plain natural colour (the de-bias fix must keep working)', () => {
    expect(replaceHairColorInSummary('dark brown hair, olive skin', 'auburn')).toBe(
      'auburn hair, olive skin'
    );
  });
});

/**
 * The cast scanner must ask for a HAIRCUT, never a hairstyle.
 *
 * Regression guard for the 2026-09-01 fleet re-scan. The prompt used to say
 * "ALWAYS the CUT ... say how the hair is worn (loose, ponytail, bun, braids,
 * half-up). If there are no bangs, describe the hairline positively (e.g.
 * 'center-parted', 'swept back from the forehead')". That instruction is a
 * FILLER GENERATOR: it stamped 61% of men with the identical "swept back from
 * the forehead" and pinned women into whatever they wore in one photo — which
 * then rides every render forever. Measured against the re-scan's own backups,
 * worn-style phrases went 13% -> 38% while length/texture/bangs fell 13% -> 6%.
 *
 * Kevin's bar (2026-09-17): length + colour + type (wavy/curly/coily) + bangs
 * incl. the bangs kind, for both genders. Never the day-of styling.
 */
describe('VISION_PROMPTS.castPerson — haircut, not hairstyle (regression guard)', () => {
  const p = VISION_PROMPTS.castPerson;

  it('does NOT instruct the model to report how the hair is worn', () => {
    expect(p).not.toMatch(/say how the hair is worn/i);
    expect(p).not.toMatch(/ALWAYS the CUT/i);
  });

  it('does NOT instruct the model to invent a positive hairline phrase', () => {
    expect(p).not.toMatch(/describe the hairline positively/i);
    // the exact filler string that ended up on 61% of men
    expect(p).not.toMatch(/e\.g\. "center-parted", "swept back from the forehead"/i);
  });

  it('explicitly forbids the worn-style vocabulary', () => {
    for (const banned of ['ponytail', 'bun', 'half-up', 'updo', 'braids', 'pin curls']) {
      expect(p.toLowerCase()).toContain(banned);
    }
    expect(p).toMatch(/do NOT write ponytail/i);
    expect(p).toMatch(/NEVER include how the hair is worn/i);
  });

  it('requires the detail the re-scan destroyed: length, colour, type, bangs', () => {
    expect(p).toMatch(/give the LENGTH \(short, medium, or long\)/i);
    expect(p).toMatch(/the TYPE if it is not straight \(wavy, curly, or tightly coily\)/i);
    expect(p).toMatch(/BANGS with their kind/i);
    // the TRAITS line is what becomes physical_summary — it must lead with length
    expect(p).toMatch(/hair clause must ALWAYS start with a length word/i);
  });

  it('still never uses negative phrasing (AI generators read negatives as positives)', () => {
    expect(p).toMatch(/never write "no bangs"/i);
  });
});
