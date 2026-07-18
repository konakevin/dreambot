import {
  firstDreamMediumMode,
  firstDreamAllowedMediums,
  FIRST_DREAM_BASE_MEDIUMS,
  FACE_SWAP_BANNED_MEDIUMS,
  type FirstDreamMediumFlags,
} from '@engine/firstDreamMediums';

// Mirrors the live dream_mediums flags relevant to first-dream curation.
const m = (
  key: string,
  characterRenderMode = 'natural',
  isDreamEligible = true
): FirstDreamMediumFlags => ({ key, characterRenderMode, isDreamEligible });

// A realistic snapshot of the active mediums (the fetchMediums() result shape).
const FIXTURE: FirstDreamMediumFlags[] = [
  // ── Base curated styles (natural, dream-eligible) ──
  m('canvas'),
  m('glamour'),
  m('illustration'),
  m('pencil'),
  m('photography'),
  m('vintage_film'),
  m('watercolor'),
  // ── Other natural dream-eligible styles that are NOT approved for first dreams
  //    (must NEVER appear in either list) — incl. the ones Kevin pulled. ──
  m('comics'),
  m('pop_art'),
  m('film_noir'),
  m('heirloom'),
  m('double_exposure'),
  m('hyperreal'),
  // ── Active Dream Art (embodied, dream-eligible) ──
  m('animation', 'embodied'),
  m('anime', 'embodied'),
  m('claymation', 'embodied'),
  m('fairytale', 'embodied'),
  m('handcrafted', 'embodied'),
  m('lego', 'embodied'),
  m('pixels', 'embodied'),
  m('vinyl', 'embodied'),
  // ── Embodied but NOT dream-eligible (bot-only, e.g. action_figure) — must be
  //    excluded from the scene fallback. ──
  m('action_figure', 'embodied', false),
  // NOTE: inactive Dream Art (kawaii/storybook) is represented by ABSENCE from
  // this list, mirroring fetchMediums (which omits inactive non-bot mediums).
];

const CAST_EXPECTED = ['canvas', 'glamour', 'illustration', 'pencil', 'vintage_film', 'watercolor'];
const DREAM_ART = [
  'animation',
  'anime',
  'claymation',
  'fairytale',
  'handcrafted',
  'lego',
  'pixels',
  'vinyl',
];
const SCENE_EXPECTED = [...FIRST_DREAM_BASE_MEDIUMS, ...DREAM_ART];

const NEVER_ALLOWED = [
  'comics',
  'pop_art',
  'film_noir',
  'heirloom',
  'double_exposure',
  'hyperreal',
  'action_figure',
];

describe('firstDreamMediumMode — the gate (locks nightly/create OUT of curation)', () => {
  it('cast tiers (force_face_swap_eligible) → "cast"', () => {
    expect(firstDreamMediumMode({ forceFaceSwapEligible: true })).toBe('cast');
    expect(firstDreamMediumMode({ forceFaceSwapEligible: true, forceCastRole: 'dual' })).toBe(
      'cast'
    );
    expect(firstDreamMediumMode({ forceFaceSwapEligible: true, forceCastRole: 'self' })).toBe(
      'cast'
    );
  });

  it('scene fallback tier (force_cast_role === null) → "scene"', () => {
    expect(firstDreamMediumMode({ forceCastRole: null })).toBe('scene');
  });

  it('NORMAL NIGHTLY (no first-dream signals) → null → NO restriction', () => {
    // The regression guard: a normal nightly render must not be curated.
    expect(firstDreamMediumMode({})).toBeNull();
    expect(firstDreamMediumMode({ forceCastRole: undefined })).toBeNull();
    expect(firstDreamMediumMode({ forceFaceSwapEligible: false })).toBeNull();
    expect(
      firstDreamMediumMode({ forceFaceSwapEligible: false, forceCastRole: undefined })
    ).toBeNull();
  });

  it('QA force_medium always wins → null (no curation), even with cast signals', () => {
    expect(firstDreamMediumMode({ forceMedium: 'kawaii', forceFaceSwapEligible: true })).toBeNull();
    expect(firstDreamMediumMode({ forceMedium: 'photography', forceCastRole: null })).toBeNull();
  });

  it('undefined (absent) is distinct from null — only explicit null is the scene tier', () => {
    // force_cast_role is `undefined` on a normal nightly and `null` only on the
    // scene fallback tier — this distinction is load-bearing.
    expect(firstDreamMediumMode({ forceCastRole: undefined })).toBeNull();
    expect(firstDreamMediumMode({ forceCastRole: null })).toBe('scene');
  });
});

describe('firstDreamAllowedMediums — CAST (uploaded photo → face swap)', () => {
  const allow = firstDreamAllowedMediums('cast', FIXTURE);

  it('is exactly the 6 approved face-swap styles', () => {
    expect([...allow].sort()).toEqual([...CAST_EXPECTED].sort());
  });

  it('EXCLUDES photography (and every realistic style) from the face-swap path', () => {
    expect(allow).not.toContain('photography');
    for (const k of FACE_SWAP_BANNED_MEDIUMS) expect(allow).not.toContain(k);
  });

  it('excludes every non-approved and Dream Art style', () => {
    for (const k of [...NEVER_ALLOWED, ...DREAM_ART]) expect(allow).not.toContain(k);
  });
});

describe('firstDreamAllowedMediums — SCENE (no photo → fallback)', () => {
  const allow = firstDreamAllowedMediums('scene', FIXTURE);

  it('is the 7 base styles + the 8 active Dream Art styles (15)', () => {
    expect([...allow].sort()).toEqual([...SCENE_EXPECTED].sort());
    expect(allow).toHaveLength(15);
  });

  it('INCLUDES photography (works fine as a scene — no face to swap)', () => {
    expect(allow).toContain('photography');
  });

  it('includes every active Dream Art style', () => {
    for (const k of DREAM_ART) expect(allow).toContain(k);
  });

  it('excludes non-approved styles and bot-only (non-dream-eligible) embodied', () => {
    for (const k of NEVER_ALLOWED) expect(allow).not.toContain(k);
  });
});

describe('firstDreamAllowedMediums — respects the ACTIVE set', () => {
  it('drops a de-activated base style (absent from the mediums list)', () => {
    const withoutGlamour = FIXTURE.filter((x) => x.key !== 'glamour');
    expect(firstDreamAllowedMediums('cast', withoutGlamour)).not.toContain('glamour');
    expect(firstDreamAllowedMediums('scene', withoutGlamour)).not.toContain('glamour');
  });

  it('drops a de-activated Dream Art style from the scene list', () => {
    const withoutFairytale = FIXTURE.filter((x) => x.key !== 'fairytale');
    expect(firstDreamAllowedMediums('scene', withoutFairytale)).not.toContain('fairytale');
  });

  it('a newly-activated Dream Art style auto-joins the scene list', () => {
    // e.g. Kevin re-activates storybook → it appears without a code change.
    const withStorybook = [...FIXTURE, m('storybook', 'embodied', true)];
    expect(firstDreamAllowedMediums('scene', withStorybook)).toContain('storybook');
    // ...but never the face-swap (cast) list.
    expect(firstDreamAllowedMediums('cast', withStorybook)).not.toContain('storybook');
  });

  it('never returns a key that is not in the provided mediums list', () => {
    for (const mode of ['cast', 'scene'] as const) {
      const keys = new Set(FIXTURE.map((x) => x.key));
      for (const k of firstDreamAllowedMediums(mode, FIXTURE)) expect(keys.has(k)).toBe(true);
    }
  });
});
