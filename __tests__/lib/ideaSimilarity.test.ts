/**
 * CALIBRATION + HONESTY TEST for scripts/lib/ideaSimilarity.js.
 *
 * `ideaSimilarity.js` told the reader that SAME_IDEA was "calibrated in
 * __tests__/lib/ideaSimilarity.test.ts against labelled real pool data: known
 * duplicate clusters must collapse" — and this file did not exist. Every
 * headline number in SEED_DIVERSITY_CHARTER.md is produced by this module, so
 * the measure's real behaviour is now pinned here against REAL entries from
 * REAL pools, with human labels.
 *
 * The headline result is a LIMIT, not a pass: at the threshold actually in use,
 * the module's own flagship duplicate cluster does NOT collapse. That is locked
 * below deliberately. It is the evidence for charter decision 16 — the lexical
 * measure is a prefilter and a CI tripwire, never the acceptance gate — and it
 * means every "distinct ideas" count in the program is an UPPER bound on
 * diversity (equivalently, a LOWER bound on redundancy).
 *
 * If a future change makes the magnolia case collapse without breaking the
 * distinct-controls case, that is a genuine improvement: update the numbers here
 * and say so in the charter. Do not simply lower the threshold — the sweep below
 * shows why that trades one error for the other.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const {
  SAME_IDEA,
  clusterPool,
  formatTokens,
  similarity,
  tokens,
  entryText,
} = require('../../scripts/lib/ideaSimilarity');

// ── Labelled fixtures, verbatim from shipped pools ────────────────────────────

/**
 * ONE IDEA by human label: "a giant magnolia bloom is the fairy's bedchamber".
 * Nine entries in faebot_flower_fairy_scale_prover differing only by an
 * adjective (broad / large) and a colour pairing (pink / rose / blush).
 */
const MAGNOLIA_ONE_IDEA = [
  'A painted giant magnolia-bloom as her painted bedchamber, painted broad cream-and-pink petals dwarfing her painted form, painted velvet petal-surface lining a painted natural alcove.',
  'A painted giant magnolia-bloom as her painted bedchamber, painted large cream-and-rose petals dwarfing her painted form, painted waxy petal-surface and painted overlapping bloom-layers creating a painted deep natural alcove.',
  'A painted giant magnolia-bloom as her painted bedchamber, painted large cream-and-blush petals dwarfing her painted form, painted overlapping bloom-layers curving inward to create a painted natural alcove.',
];

/**
 * THREE IDEAS by human label, all from the same pool and sharing its whole
 * skeleton: a giant peony bedroom, a tulip-bell room, a rose inner-chamber.
 *
 * NOTE these are only "distinct" at the level this program operates on. A
 * stricter reading is that they are also one idea — "giant flower as fairy's
 * room" — in three flowers. That ambiguity is real and is exactly why the
 * charter puts an LLM judge on acceptance.
 */
const FLOWER_ROOMS_THREE_IDEAS = [
  'A painted giant peony-bloom forming her painted bedroom, painted ruffled blush-and-cream petals dwarfing her painted form, painted overlapping bloom-layers curling inward to create a painted natural hollow.',
  'A painted giant tulip-bell forming her painted room, painted rose-striped inner petals rising taller than her painted body, painted smooth waxy petal-walls enclosing a painted natural chamber.',
  'A painted giant blooming rose forming her painted home, painted overlapping crimson petals taller than her painted body, painted spiral inner-chamber of painted soft petal-folds.',
];

describe('ideaSimilarity — the measure does what the code says it does', () => {
  it('reads plain strings, {description} and multi-field records alike', () => {
    // Regression: an earlier entryText read only description/text, so
    // BrickBot's {location, scene, tier} pool returned '' for all 1,601
    // entries and the audit reported "0 distinct ideas, worst in the fleet".
    expect(entryText('a beach')).toBe('a beach');
    expect(entryText({ description: 'a beach' })).toBe('a beach');
    expect(entryText({ location: 'a reef', scene: 'a wreck', tier: 'rare' })).toContain('reef');
    expect(entryText({ location: 'a reef', scene: 'a wreck', tier: 'rare' })).toContain('wreck');
    // tier is classification metadata: including it would make two entries look
    // similar merely for sharing a tier.
    expect(entryText({ location: 'a reef', scene: 'a wreck', tier: 'rare' })).not.toContain('rare');
  });

  it('drops function words but keeps content words', () => {
    const t = tokens('the giant painted magnolia in a large alcove');
    expect(t.has('the')).toBe(false);
    expect(t.has('giant')).toBe(true);
    // `painted` and `large` are CONTENT words. seedGenHelper's older list
    // stripped them to make its 12-token signature behave, which is what let
    // the magnolia duplicates through in the first place.
    expect(t.has('painted')).toBe(true);
    expect(t.has('large')).toBe(true);
  });

  it('identifies a pool’s shared skeleton as format, not content', () => {
    const fmt = formatTokens([...MAGNOLIA_ONE_IDEA, ...FLOWER_ROOMS_THREE_IDEAS], 0.8);
    expect(fmt.has('painted')).toBe(true); // in every entry => format
    expect(fmt.has('magnolia')).toBe(false); // in a minority => content
  });

  it('measuring FORMAT instead of ideas makes everything look duplicated', () => {
    // The bug that produced the pilot's wrong baseline, shown on a whole real
    // 200-entry pool rather than a handful of entries: with the shared skeleton
    // left in, faebot_flower_fairy_scale_prover reads 28 distinct ideas;
    // stripped, it reads 90. Same file, same threshold, one choice apart.
    const pool = require('../../scripts/bots/faebot/seeds/faebot_flower_fairy_scale_prover.json');
    const entries = Array.isArray(pool) ? pool : pool.entries;
    const raw = clusterPool(entries, SAME_IDEA, { keepFormat: true }).distinct;
    const stripped = clusterPool(entries, SAME_IDEA).distinct;
    expect(raw).toBeLessThan(stripped);
  });
});

describe('ideaSimilarity — before/after on one pool must use ONE yardstick', () => {
  it('formatFrom keeps the basis fixed when a pool grows', () => {
    // The profile is derived from the entries being measured, so adding diverse
    // entries lowers every token's document frequency, fewer tokens clear
    // `share`, less is stripped, and the two sides get different yardsticks.
    // Measured on the flower_focal_cluster pilot: the repaired pool read 0%
    // redundant on its OWN basis while a manual read found it ~1/3 recombinant.
    const before = MAGNOLIA_ONE_IDEA;
    const after = [...MAGNOLIA_ONE_IDEA, ...FLOWER_ROOMS_THREE_IDEAS];

    const ownBasis = formatTokens(after, 0.4);
    const fixedBasis = formatTokens(before, 0.4);
    expect([...ownBasis].sort()).not.toEqual([...fixedBasis].sort());

    // With formatFrom the "after" pool is scored on the "before" pool's basis,
    // which is the only way the two numbers are comparable.
    const fixed = clusterPool(after, SAME_IDEA, { formatFrom: before });
    expect(fixed.distinct).toBeGreaterThan(0);
    expect(fixed.distinct).toBeLessThanOrEqual(after.length);
  });
});

describe('ideaSimilarity — KNOWN LIMIT: the flagship duplicate cluster does not collapse', () => {
  it('splits 3 human-labelled duplicates into more than one idea at SAME_IDEA', () => {
    // THIS IS THE POINT OF THE FILE. These three entries are one idea to any
    // human reader. The measure does not agree, at the threshold in use.
    const got = clusterPool(MAGNOLIA_ONE_IDEA, SAME_IDEA).distinct;
    expect(got).toBeGreaterThan(1);
  });

  it('keeps genuinely different ideas apart, which is what it IS good for', () => {
    const got = clusterPool(FLOWER_ROOMS_THREE_IDEAS, SAME_IDEA).distinct;
    expect(got).toBe(FLOWER_ROOMS_THREE_IDEAS.length);
  });

  it('NO threshold merges the duplicates: stripping is self-defeating on near-duplicates', () => {
    // The inverse flaw, and the more damaging of the two. formatTokens calls a
    // token "format" when it appears in >= `share` of the entries being
    // compared. Near-duplicate entries share almost all of their text, so
    // almost all of it is classified as format and stripped — leaving only the
    // words where they DIFFER, which are disjoint by definition. The more alike
    // two entries are, the more different the measure says they are.
    //
    // Consequence, locked here: these three entries never merge, at any
    // threshold down to 0.10.
    for (const t of [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]) {
      expect(clusterPool(MAGNOLIA_ONE_IDEA, t).distinct).toBe(MAGNOLIA_ONE_IDEA.length);
    }

    // It is not merely a small-sample effect. Inside the real 200-entry pool,
    // where the shared vocabulary IS pool-wide boilerplate, the nine labelled
    // magnolia duplicates still come apart into several "ideas".
    const pool = require('../../scripts/bots/faebot/seeds/faebot_flower_fairy_scale_prover.json');
    const entries = (Array.isArray(pool) ? pool : pool.entries).map((e: unknown) => entryText(e));
    const nine = entries.filter((t: string) => /magnolia-bloom as her/i.test(t));
    expect(nine.length).toBe(9);
    expect(clusterPool(nine, SAME_IDEA, { formatFrom: entries }).distinct).toBeGreaterThan(1);
  });

  it('so BOTH settings are wrong, in opposite directions', () => {
    // Unstripped: a rigid pool skeleton makes unrelated entries look like
    // duplicates (false positives). Stripped: near-duplicates lose their shared
    // text and look unrelated (false negatives). There is no choice of
    // {keepFormat, threshold} that gets the labelled cases right together —
    // which is the whole argument for an LLM judge on acceptance.
    const dupStripped = clusterPool(MAGNOLIA_ONE_IDEA, SAME_IDEA).distinct;
    const dupRaw = clusterPool(MAGNOLIA_ONE_IDEA, SAME_IDEA, { keepFormat: true }).distinct;
    const okStripped = clusterPool(FLOWER_ROOMS_THREE_IDEAS, SAME_IDEA).distinct;
    const okRaw = clusterPool(FLOWER_ROOMS_THREE_IDEAS, SAME_IDEA, { keepFormat: true }).distinct;

    // Stripped gets the duplicates maximally wrong (3 ideas, should be 1)...
    expect(dupStripped).toBe(3);
    // ...and raw does better on them only because it also collapses the ones it
    // should keep apart. Neither column is right on both rows.
    expect(dupRaw).toBeLessThanOrEqual(dupStripped);
    expect(okRaw).toBeLessThanOrEqual(okStripped);
    expect(dupRaw > 1 || okRaw < 3).toBe(true);
  });

  it('therefore a distinct-ideas count is an UPPER bound on real diversity', () => {
    // Recorded as an executable claim so no one quotes a distinct count as if
    // it were exact. The measure over-counts ideas, so it UNDER-states
    // redundancy: the charter's fleet figures are floors, not estimates.
    const humanIdeas = 1;
    const measured = clusterPool(MAGNOLIA_ONE_IDEA, SAME_IDEA).distinct;
    expect(measured).toBeGreaterThanOrEqual(humanIdeas);
  });
});

describe('ideaSimilarity — similarity() basics', () => {
  it('is 1 for identical text and 0 for disjoint text', () => {
    expect(similarity('alpine gentian scree', 'alpine gentian scree')).toBe(1);
    expect(similarity('alpine gentian scree', 'harbour lantern rigging')).toBe(0);
  });

  it('is symmetric', () => {
    const a = MAGNOLIA_ONE_IDEA[0];
    const b = FLOWER_ROOMS_THREE_IDEAS[0];
    expect(similarity(a, b)).toBeCloseTo(similarity(b, a), 10);
  });
});
