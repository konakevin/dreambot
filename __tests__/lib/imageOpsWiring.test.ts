/**
 * Phase 1 of NO_PIXELS_IN_ISOLATE_PLAN.md — nightly-dreams hands its pixel work to the Fly image-ops
 * service, and keeps every in-isolate path as the fail-open fallback.
 *
 * These are source guards on the ORDER and SHAPE of the wiring, because the failure modes here are
 * ordering bugs a unit test of either side cannot see:
 *
 *  - the hash call must run BEFORE the in-isolate fetch/decode and short-circuit it (else the isolate
 *    still decodes and nothing was gained);
 *  - the final persist must be awaited BEFORE the generation-log insert (else its stamp never lands in
 *    fallback_reasons and the rollout is unmeasurable — the exact blind spot that hid three fixes behind
 *    LOOKS_MINIMAL);
 *  - the display block must prefer the Fly result, then the decoded buffer, then the in-isolate variant;
 *  - the old paths must still exist, because the client fails open into them.
 */
import fs from 'fs';
import path from 'path';

const SRC = fs.readFileSync(
  path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
  'utf8'
);
const strip = (s: string) => s.replace(/\s+/g, ' ');
const S = strip(SRC);

describe('phase 1 wiring — dup-detect hash', () => {
  it('imports the client', () => {
    expect(SRC).toContain(
      "import { imageOpsEnabled, persistViaFly } from '../_shared/imageOps.ts';"
    );
  });

  it('asks Fly for the hash BEFORE the in-isolate fetch/decode, and the fallback is gated on its failure', () => {
    const hashCall = S.indexOf("mode: 'hash'");
    const fallbackFetch = S.indexOf('if (!hashedOnFly) { const fetchResp = await fetch(tempUrl);');
    expect(hashCall).toBeGreaterThan(-1);
    expect(fallbackFetch).toBeGreaterThan(-1);
    expect(hashCall).toBeLessThan(fallbackFetch);
  });

  it('a Fly hash clears the in-isolate buffers so nothing downstream re-decodes', () => {
    expect(S).toContain(
      'outPhash = h.result.ahash; outBuf = null; decodedOut = null; hashedOnFly = true;'
    );
  });

  it('stamps the hash outcome distinctly from the persist outcome', () => {
    expect(S).toContain("h.stamp.replace('image_ops:', 'image_ops_hash:')");
  });
});

describe('phase 1 wiring — final persist', () => {
  it('awaits the Fly persist BEFORE insertGenerationLog, so the stamp is in the log row', () => {
    const flyPersist = S.indexOf("mode: 'final'");
    const stamp = S.indexOf('fallbackReasons.push(p.stamp);');
    const logInsert = S.indexOf('insertGenerationLog(supabase, { id: genLogId');
    expect(flyPersist).toBeGreaterThan(-1);
    expect(stamp).toBeGreaterThan(flyPersist);
    expect(logInsert).toBeGreaterThan(stamp);
  });

  it('the in-isolate persist paths remain as the fallback', () => {
    expect(S).toContain(
      'const persistPromise = flyPersisted ? Promise.resolve(flyPersisted.url) : outBuf ? persistBufferToStorage(outBuf, userId, supabase) : persistToStorage(tempUrl, userId, supabase);'
    );
  });

  it('the display block prefers the Fly result, then the decoded buffer, then the in-isolate variant', () => {
    const a = S.indexOf('if (flyPersisted) {');
    const b = S.indexOf('} else if (decodedOut) {');
    const c = S.indexOf('const dv = await buildDisplayVariant(imageUrl, userId, supabase);');
    expect(a).toBeGreaterThan(-1);
    expect(b).toBeGreaterThan(a);
    expect(c).toBeGreaterThan(b);
    expect(S).toContain(
      'displayUrl = flyPersisted.displayUrl; thumbhash = flyPersisted.thumbhash;'
    );
  });

  it('every Fly call is gated on imageOpsEnabled() — unset the secret and the wiring is inert', () => {
    const calls = (S.match(/persistViaFly\(/g) || []).length;
    const gates = (S.match(/if \(imageOpsEnabled\(\)\) \{/g) || []).length;
    expect(calls).toBe(2);
    expect(gates).toBe(2);
  });
});

describe.each([
  ['generate-dream', 'supabase/functions/generate-dream/index.ts', 'tempUrl'],
  ['restyle-photo', 'supabase/functions/restyle-photo/index.ts', 'genResult.url'],
])('phase 2 wiring — %s', (_name, rel, src) => {
  const T = strip(fs.readFileSync(path.join(__dirname, '..', '..', rel), 'utf8'));

  it('imports the client', () => {
    expect(T).toContain("import { imageOpsEnabled, persistViaFly } from '../_shared/imageOps.ts';");
  });

  it('awaits the Fly persist BEFORE the persist/log Promise.all, so the stamp is in the log row', () => {
    const fly = T.indexOf("mode: 'final'");
    const all = T.indexOf(
      `flyPersisted ? Promise.resolve(flyPersisted.url) : persistToStorage(${src}, userId, supabase)`
    );
    expect(fly).toBeGreaterThan(-1);
    expect(all).toBeGreaterThan(fly);
  });

  it('the uploads row is inserted with the display variant + thumbhash already filled when Fly delivered', () => {
    expect(T).toContain(
      'image_url_display: flyPersisted ? flyPersisted.displayUrl : null, thumbhash: flyPersisted ? flyPersisted.thumbhash : null,'
    );
  });

  it('no background pixel work is scheduled when Fly delivered — that scheduleBackground is the dropped waitUntil', () => {
    expect(T).toMatch(
      /if \((uploadId && )?!flyPersisted\)( \{ const displayUploadId = uploadId;)?\s*scheduleBackground\( buildDisplayVariant\(/
    );
  });

  it('the call is gated on imageOpsEnabled()', () => {
    expect((T.match(/persistViaFly\(/g) || []).length).toBe(1);
    expect((T.match(/if \(imageOpsEnabled\(\)\) \{/g) || []).length).toBe(1);
  });
});
