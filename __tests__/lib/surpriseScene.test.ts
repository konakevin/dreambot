/**
 * Surprise dreams (Create tapped with no prompt) must be ANCHORED, not invented.
 *
 * The rule this defends is the engine's oldest lesson: never hand the model the
 * varying element. With nothing to vary against, Sonnet pigeonholes and rhymes, so
 * every "surprise" converges on the same few ideas. Authored pools only.
 *
 * Drawn from the WHOLE location pool, not the user's saved places (Kevin
 * 2026-09-16) — a surprise should be able to land somewhere they would never have
 * picked; their own places are what the nightly dream is for.
 */
import { randomOffset, surprisePromptFor } from '@engine/surpriseScene';

describe('sampling the pool', () => {
  // The reason this is an OFFSET and not a .limit(): rows were inserted per location
  // in batches, so the first N rows are all one or two places. Taking the head of the
  // table would quietly confine every surprise dream to Amsterdam.
  it('can reach the very first and very last row', () => {
    expect(randomOffset(16028, () => 0)).toBe(0);
    expect(randomOffset(16028, () => 0.9999999)).toBe(16027);
  });

  it('never runs off the end, even at rnd() === 1', () => {
    // Math.random() is documented as < 1, but a caller-supplied rng might not be,
    // and an out-of-range offset returns an empty page and no dream.
    expect(randomOffset(10, () => 1)).toBe(9);
    expect(randomOffset(1, () => 1)).toBe(0);
  });

  it('spreads across the whole table rather than clustering', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 100; i++) seen.add(randomOffset(16028, () => i / 100));
    expect(seen.size).toBe(100);
    expect(Math.max(...seen)).toBeGreaterThan(15000);
    expect(Math.min(...seen)).toBeLessThan(200);
  });

  it('survives an empty pool instead of producing a negative index', () => {
    expect(randomOffset(0)).toBe(0);
    expect(randomOffset(-5)).toBe(0);
  });
});

describe('the prompt it produces', () => {
  it('carries the place, because a spot alone is ambiguous', () => {
    expect(surprisePromptFor('Oosterpark rolling lawns and monuments', 'amsterdam')).toBe(
      'Oosterpark rolling lawns and monuments, amsterdam'
    );
  });

  it('trims pool text rather than emitting ragged whitespace', () => {
    expect(surprisePromptFor('  a quiet tide pool  ', 'kauai')).toBe('a quiet tide pool, kauai');
  });

  it('names no people', () => {
    // The no-photo route draws from pure_scene_eligible for exactly this reason:
    // those anchors stand on their own with no subject in frame.
    const out = surprisePromptFor(
      'Daintree Rainforest ancient tree canopy seen from below',
      'australia'
    );
    expect(out.toLowerCase()).not.toMatch(
      /\b(me|my|we|us|couple|partner|friend|person|people|man|woman|standing|walking)\b/
    );
  });
});
