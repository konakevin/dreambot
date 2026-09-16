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
import fs from 'fs';
import path from 'path';

import { pickSurpriseScene, randomOffset, surprisePromptFor } from '@engine/surpriseScene';

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
  it('is the authored spot text, and nothing else', () => {
    expect(surprisePromptFor('Oosterpark rolling lawns and monuments')).toBe(
      'Oosterpark rolling lawns and monuments'
    );
  });

  it('trims pool text rather than emitting ragged whitespace', () => {
    expect(surprisePromptFor('  a quiet tide pool  ')).toBe('a quiet tide pool');
  });

  // THE REGRESSION THIS FILE EXISTS FOR. The prompt used to be `spot, location_key`,
  // and an imagined world's key is a NARRATIVE phrase rather than a place name — so
  // a people-free spot arrived at Flux as "…, desert canyon standoff" and rendered
  // two gunslingers squaring up (QA 2026-09-15). The spot text alone is what nightly
  // has anchored on for months; the place belongs in the forensic stamp, not the
  // prompt. If someone re-appends it, these fail.
  it('does not let a narrative world name leak in and cast people', () => {
    expect(surprisePromptFor('Bryce Canyon Amphitheater at blue hour')).toBe(
      'Bryce Canyon Amphitheater at blue hour'
    );
    for (const key of ['desert canyon standoff', 'outlaw hideout', 'epic battlefield']) {
      expect(surprisePromptFor('a quiet sandstone gorge at dawn')).not.toContain(key);
    }
  });

  it('names no people', () => {
    // The no-photo route draws from pure_scene_eligible for exactly this reason:
    // those anchors stand on their own with no subject in frame.
    const out = surprisePromptFor('Daintree Rainforest ancient tree canopy seen from below');
    expect(out.toLowerCase()).not.toMatch(
      /\b(me|my|we|us|couple|partner|friend|person|people|man|woman|standing|walking)\b/
    );
  });
});

/**
 * The photo route (Create tapped with a photo and no prompt) draws from the
 * CHARACTER half of the pool and runs a live face swap, which makes one filter
 * load-bearing: ~1% of those rows depict a COLOSSAL human face (a giant Buddha,
 * the Sphinx, Mount Rushmore). Flux renders the huge face, YuNet picks the
 * largest face in the frame — the STATUE'S — and the swap pastes the user onto
 * the monument. Nightly has filtered its own cast anchors this way since the
 * Longmen Grottoes render (2026-09-01); this path needed the same gate.
 */
describe('vetoing a spot the swap cannot survive', () => {
  type Row = { spot_text: string; location_key: string };
  /** pickSurpriseScene's first arg. Typed here rather than imported so the fast
   *  jest lane never has to resolve the Deno/esm.sh supabase URL. */
  type SupabaseLike = Parameters<typeof pickSurpriseScene>[0];

  /** Minimal stand-in for the PostgREST builder pickSurpriseScene actually uses:
   *  awaited directly for the head count, or `.range()`d for a single row. */
  function fakeSupabase(rows: Row[]) {
    // The rows are handed out IN ORDER rather than by the requested offset, so a
    // test can script the exact sequence of candidates the pick has to walk past.
    let next = 0;
    return {
      from: () => ({
        select: (_cols: string, opts?: { head?: boolean }) => {
          const builder = {
            eq: () => builder,
            range: () => Promise.resolve({ data: rows[next] ? [rows[next++]] : [] }),
            then: (resolve: (v: { count: number }) => unknown) =>
              resolve({ count: opts?.head ? rows.length : 0 }),
          };
          return builder;
        },
      }),
    };
  }

  const MONUMENT = { spot_text: 'Mount Rushmore presidential granite faces', location_key: 'usa' };
  const SAFE = { spot_text: 'Zabriskie Point badlands at first light', location_key: 'usa' };

  it('re-rolls past a monumental face instead of returning it', async () => {
    // Every offset but the last is the monument, so the pick MUST keep going.
    const client = fakeSupabase([MONUMENT, MONUMENT, SAFE]);
    const picked = await pickSurpriseScene(client as unknown as SupabaseLike, 'character', {
      reject: (t) => t.includes('Rushmore'),
      attempts: 5,
    });
    expect(picked?.prompt).toBe(SAFE.spot_text);
  });

  it('gives up rather than handing back a vetoed spot', async () => {
    // A null here means the caller keeps its old unanchored behaviour, which is
    // merely bland. Returning the monument would paste a face onto it.
    const client = fakeSupabase([MONUMENT, MONUMENT]);
    const picked = await pickSurpriseScene(client as unknown as SupabaseLike, 'character', {
      reject: () => true,
      attempts: 3,
    });
    expect(picked).toBeNull();
  });

  it('leaves the pure-scene route alone when no veto is passed', async () => {
    const client = fakeSupabase([MONUMENT]);
    const picked = await pickSurpriseScene(client as unknown as SupabaseLike, 'pure_scene');
    // A giant carved face is a fine SCENE — there is no face to protect.
    expect(picked?.prompt).toBe(MONUMENT.spot_text);
  });
});

/**
 * Source guards on the CALLER. The library above can veto monumental-face spots and
 * re-roll a portrait-shaped medium, but only if generate-dream asks it to — and both
 * asks are one deletable line in a file nobody re-reads. Neither failure shows up in
 * forensics: the seed stamp still looks correct while the render carries a person it
 * should not, or the user's face pasted onto a monument.
 */
describe('generate-dream actually asks for the protections', () => {
  const SRC = fs.readFileSync(
    path.join(__dirname, '..', '..', 'supabase', 'functions', 'generate-dream', 'index.ts'),
    'utf8'
  );

  it('passes the monumental-face veto on the photo (swap) route, and only there', () => {
    expect(SRC).toContain("pickSurpriseScene(supabase, 'character', {");
    expect(SRC).toContain('reject: isMonumentalFaceSpot,');
    // The people-free route deliberately does NOT filter: a giant carved face is a
    // perfectly good scene when there is no face to protect.
    expect(SRC).toContain("pickSurpriseScene(supabase, 'pure_scene')");
  });

  it('re-rolls a person-shaped medium on the people-free route', () => {
    // A people-free anchor rendered through `glamour` ("dreamy glamour-shot portrait
    // ... lifelike recognizable face") still puts a person in frame — and the sticky
    // default medium is surprise_me_face, so this is the DEFAULT no-input state.
    expect(SRC).toContain('if (isSurpriseSceneRoute && !medium.isSceneEligible) {');
    expect(SRC).toContain("resolveMediumFromDb('dream_eligible_scene')");
  });

  it('anchors the photo route only when the user typed nothing', () => {
    // `photoScene` must prefer the user's own words; the anchor is the empty-prompt
    // fallback, never an override of what they asked for.
    expect(SRC).toContain("const photoScene = (hint ?? '').trim() || photoSurprise?.prompt || '';");
  });
});
