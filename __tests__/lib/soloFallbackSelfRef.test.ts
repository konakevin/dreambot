/**
 * THE SOLO FALLBACK'S FACE AND ITS GENDER MUST NAME THE SAME PERSON.
 *
 * When a dual (couple) face swap fails, both render paths degrade to a SOLO rebuild: re-render one
 * person alone and paste the self face onto it. That hand-off needs two things about the same cast
 * member — the source PHOTO (`selfSource`) and the GENDER the guard grades the rebuild against
 * (`castGender`).
 *
 * Both edge functions derived those from two SEPARATE `.find((s) => s.role === 'self')` calls, and
 * only the photo carried a positional fallback (`?? s0`). So on a two-member face-swap cast with no
 * member in the `self` role, the rebuild pasted s0's face while telling the guard the cast gender
 * was unknown.
 *
 * That is not a cosmetic mismatch. `singleSwapGuard`'s judge() treats 2+ faces as safe ONLY when
 * every readable face matches a NON-NULL cast gender — locked deliberately by
 * `singleSwapGuard.test.ts` ("two same-gender faces but cast gender UNKNOWN → not safe (cannot
 * prove a match)"). The guard was right; it was being handed null. With no gender it can never
 * soft-accept, so it re-rendered to exhaustion, reported unsafe, and the cascade threw — REFUNDING
 * a dream that was perfectly renderable. Single-face renders were unaffected (judge() skips the
 * mismatch check when the gender is null), which is why it stayed quiet.
 *
 * Source guards, because the wiring lives in edge functions the unit lane cannot execute — the same
 * reason `createEngineWiring.test.ts` and `minimalEngineWiring.test.ts` exist.
 */
import fs from 'fs';
import path from 'path';

const fn = (name: string) =>
  fs.readFileSync(
    path.join(__dirname, '..', '..', 'supabase', 'functions', name, 'index.ts'),
    'utf8'
  );

const PATHS: [string, string][] = [
  ['generate-dream', 'Create / DLT / redream'],
  ['nightly-dreams', 'nightly + the onboarding first dream'],
];

describe.each(PATHS)('%s (%s) resolves the self member ONCE', (name) => {
  const SRC = fn(name);

  it('binds it to a single const with a positional fallback', () => {
    // `?? s0` is the load-bearing half: a two-member cast with no `self` role still yields a real
    // member, so the gender is a measured value rather than "unknown".
    expect(SRC).toMatch(
      /const selfRef = faceSwapSources\.find\(\(s\) => s\.role === 'self'\) \?\? s0;/
    );
  });

  it('derives BOTH the swap source and the cast gender from that one const', () => {
    expect(SRC).toContain('selfRef.sourceUrl');
    // generate-dream reads the gender through genderFromLock(genderLock); nightly reads the
    // resolved `.gender` field. Either way it comes off selfRef.
    expect(SRC).toMatch(/selfRef\.(genderLock|gender)/);
  });

  it('never re-runs the self lookup to get one of them independently', () => {
    // The actual regression shape: a second `.find(role === 'self')` whose result feeds a gender or
    // a source. One lookup, one member, no way for the two to disagree.
    const lookups = SRC.match(/\.find\(\(s\) => s\.role === 'self'\)/g) ?? [];
    expect(lookups).toHaveLength(1);
  });
});

describe('the fallback is a real member, not a synthesized blank', () => {
  it.each(PATHS)('%s falls back to s0, which is always present here', (name) => {
    const SRC = fn(name);
    // s0/s1 are destructured from a length-checked pair, so s0 is a genuine cast member with a
    // photo and a gender — which is what makes it a safe stand-in for a missing `self`.
    expect(SRC).toContain('const s0 = faceSwapSources[0];');
    expect(SRC).toMatch(/faceSwapSources && faceSwapSources\.length === 2 && tempUrl/);
  });
});
