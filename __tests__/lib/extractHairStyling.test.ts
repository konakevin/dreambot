/**
 * extractHair — day-of STYLING must never reach the Flux prompt.
 *
 * Why this exists (2026-09-17). The cast scanner used to be instructed to always
 * report how the hair was worn, and — when there were no bangs — to add a
 * "positive hairline" phrase. The 2026-09-01 fleet re-scan
 * (scripts/reprocess-cast-photos.mjs) then rewrote physical_summary for 43 of 48
 * cast members with that prompt. Measured against the script's own backups, the
 * share of hair clauses carrying a worn-style/hairline phrase went 13% -> 38%,
 * while the share carrying useful detail (length/texture/bangs) went 13% -> 6%.
 * Concretely: 61% of men ended up with the identical "swept back from the
 * forehead", and women were pinned into a "low bun" from a single photo — in
 * EVERY render, forever, because extractHair injects the clause into the
 * identity block on every render and the create path never varies hair.
 *
 * The scanner prompt no longer asks for styling, but the already-stored rows
 * still carry it, so extractHair strips it at prompt time (no re-scan needed).
 *
 * The strings below are REAL values pulled from production cast rows.
 *
 * Rules locked here:
 *   - a haircut survives (length, colour, texture, bangs)
 *   - day-of styling is removed (bun, ponytail, braids, pin curls, "swept back",
 *     part/hairline wording, barber-cut names)
 *   - stripping never leaves a dangling fragment ("brown hair with subtle")
 *   - length words are never eaten by the cleanup
 *   - facial hair is untouched
 *   - it NEVER returns null where a clause existed (resolveIdentity silently
 *     falls back to the archetype-pulling prose description on null)
 */
import { extractHair } from '@engine/characterSlotPrompt';

describe('extractHair — strips day-of styling, keeps the haircut', () => {
  it('removes the "swept back from the forehead" filler that hit 61% of men', () => {
    expect(extractHair('dark brown hair swept back from the forehead')).toBe('dark brown hair');
    expect(extractHair('white hair swept back from the forehead')).toBe('white hair');
    expect(extractHair('dark brown hair swept back')).toBe('dark brown hair');
  });

  it('removes worn-styles that would pin someone into one photo forever', () => {
    expect(extractHair('dark brown hair worn in a low bun')).toBe('dark brown hair');
    expect(extractHair('black hair pulled back into a ponytail')).toBe('black hair');
    expect(extractHair('auburn hair in two front-draped Dutch braids')).toBe('auburn hair');
    expect(extractHair('brown hair with pin curls at crown')).toBe('brown hair');
  });

  it('removes part / hairline wording', () => {
    expect(extractHair('brown hair with subtle center-part bowl cut')).toBe('brown hair');
    expect(extractHair('blonde hair, center-parted')).toBe('blonde hair');
  });

  it('never leaves a dangling connector fragment', () => {
    // The naive token-strip produced "brown hair with subtle" / "...with a" /
    // "...two front-draped Dutch". Nothing may end on a connector or adjective.
    for (const input of [
      'brown hair with subtle center-part bowl cut',
      'dark brown hair cropped short with a fade',
      'auburn hair in two front-draped Dutch braids',
      'dark brown hair swept upward from the forehead with a tousled spiked cut',
    ]) {
      const out = extractHair(input) as string;
      expect(out).not.toMatch(/\b(with|and|in|into|a|an|the|subtle|soft|loose)\s*$/i);
      expect(out).not.toMatch(/[\s,]$/);
    }
  });

  it('keeps LENGTH — the detail the re-scan destroyed', () => {
    expect(extractHair('dark brown hair cropped short with a fade')).toBe(
      'dark brown hair cropped short'
    );
    expect(extractHair('short dark brown hair')).toBe('short dark brown hair');
    expect(extractHair('long auburn wavy hair with soft wispy bangs')).toBe(
      'long auburn wavy hair with soft wispy bangs'
    );
  });

  it('keeps bangs and texture — those are a CUT, not styling', () => {
    expect(
      extractHair(
        'dark brown hair with caramel highlights and soft wispy curtain bangs worn in loose waves'
      )
    ).toBe('dark brown hair with caramel highlights and soft wispy curtain bangs');
    expect(
      extractHair('dark brown hair with tight vintage curls swept back from the forehead')
    ).toBe('dark brown hair with tight vintage curls');
  });

  it('leaves facial hair and bald/stubble clauses untouched', () => {
    expect(extractHair('salt and pepper hair, full reddish-brown beard')).toBe(
      'salt and pepper hair, full reddish-brown beard'
    );
    expect(extractHair('bald head, brown stubble')).toBe('bald head, brown stubble');
    expect(extractHair('light brown hair with silver streaks')).toBe(
      'light brown hair with silver streaks'
    );
  });

  it('never returns null where a clause existed (resolveIdentity falls back to prose on null)', () => {
    // A clause that is ONLY styling would strip to nothing — we must still
    // return something rather than let the render fall back to free prose.
    // These DO match the hair-clause filter but strip to nothing, so the
    // fallback has to kick in. (A clause with no hair word at all — "center-parted"
    // alone — was never picked up by extractHair in the first place, so it is not
    // a regression and is covered by the null case below.)
    for (const input of ['hair swept back from the forehead', 'receding hairline']) {
      const summary = `${input}, olive skin, average build`;
      expect(extractHair(summary)).not.toBeNull();
    }
  });

  it('returns null only when there is genuinely no hair clause', () => {
    expect(extractHair('olive skin, average build, brown eyes')).toBeNull();
    expect(extractHair('')).toBeNull();
    expect(extractHair(null)).toBeNull();
    expect(extractHair(undefined)).toBeNull();
  });
});
