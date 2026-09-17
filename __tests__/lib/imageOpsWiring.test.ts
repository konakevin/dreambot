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
  // generate-dream carries a second call: the Create swap SOURCE (a data: cast photo) → mode 'temp' (3b)
  ['generate-dream', 'supabase/functions/generate-dream/index.ts', 'tempUrl', 2],
  ['restyle-photo', 'supabase/functions/restyle-photo/index.ts', 'genResult.url', 1],
])('phase 2 wiring — %s', (_name, rel, src, calls) => {
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

  it('every call is gated on imageOpsEnabled()', () => {
    expect((T.match(/persistViaFly\(/g) || []).length).toBe(calls);
    expect((T.match(/if \(imageOpsEnabled\(\)\) \{/g) || []).length).toBe(calls);
  });
});

describe('phase 3b wiring — generate-dream swap source (the data: cast photo)', () => {
  const T = strip(
    fs.readFileSync(
      path.join(__dirname, '..', '..', 'supabase', 'functions', 'generate-dream', 'index.ts'),
      'utf8'
    )
  );

  it('asks Fly (temp) BEFORE the atob loop, and the loop remains as the fallback', () => {
    const fly = T.indexOf("sourceUrl: faceSwapSource, userId, mode: 'temp'");
    const loop = T.indexOf('Uint8Array.from(atob(base64Data)');
    expect(fly).toBeGreaterThan(-1);
    expect(loop).toBeGreaterThan(fly);
  });

  it('the Fly key becomes swapFileName so the existing cleanup removes it', () => {
    expect(T).toContain('if (flyTemp) { swapFileName = flyTemp.key; sourceUrl = flyTemp.url; }');
    expect(T).toContain('.remove([swapFileName])');
  });
});

describe('phase 3b + 4 wiring — faceSwap.ts (swap-target atob loop + the single-swap perturb)', () => {
  const F = strip(
    fs.readFileSync(
      path.join(__dirname, '..', '..', 'supabase', 'functions', '_shared', 'faceSwap.ts'),
      'utf8'
    )
  );

  it('imports the client', () => {
    expect(F).toContain("import { imageOpsEnabled, persistViaFly } from './imageOps.ts';");
  });

  it('ensureHttpsImageUrl asks Fly (temp) BEFORE the atob loop, and the loop remains as the fallback', () => {
    const fn = F.indexOf('export async function ensureHttpsImageUrl(');
    const fly = F.indexOf("mode: 'temp'");
    const loop = F.indexOf('const bin = atob(b64);');
    expect(fn).toBeGreaterThan(-1);
    expect(fly).toBeGreaterThan(fn);
    expect(loop).toBeGreaterThan(fly);
  });

  it('perturbSourceImage asks Fly (perturb) BEFORE the in-isolate decode, and the decode remains as the fallback', () => {
    const fn = F.indexOf('async function perturbSourceImage(');
    const fly = F.indexOf("mode: 'perturb'");
    const dec = F.indexOf('const decoded = await decodeImage(buf);');
    expect(fn).toBeGreaterThan(-1);
    expect(fly).toBeGreaterThan(fn);
    expect(dec).toBeGreaterThan(fly);
  });

  it('a Fly result is used only when it carries the key the cleanup needs, and it is returned AS that key', () => {
    expect(F).toContain(
      'if (r.ok && r.result.url && r.result.key) { console.log(`[ensureHttpsImageUrl] ${r.stamp}`); return { url: r.result.url, tempPath: r.result.key }; }'
    );
    expect(F).toContain(
      'if (r.ok && r.result.url && r.result.key) { console.log(`[perturbSource] ${r.stamp}`); return { url: r.result.url, path: r.result.key }; }'
    );
  });

  it('both calls are bounded to 10 s — a hung service must not eat the swap deadline', () => {
    expect((F.match(/timeoutMs: 10_000/g) || []).length).toBe(2);
  });

  it('every Fly call is gated on imageOpsEnabled()', () => {
    expect((F.match(/persistViaFly\(/g) || []).length).toBe(2);
    expect((F.match(/imageOpsEnabled\(\)\) \{/g) || []).length).toBe(2);
  });
});

describe('phase 4b wiring — holiday-postcard', () => {
  const H = strip(
    fs.readFileSync(
      path.join(__dirname, '..', '..', 'supabase', 'functions', 'holiday-postcard', 'index.ts'),
      'utf8'
    )
  );

  it('imports the client', () => {
    expect(H).toContain(
      "import { compositeViaFly, imageOpsEnabled } from '../_shared/imageOps.ts';"
    );
  });

  it('asks Fly AFTER the holidays row is read (the isolate stays the DB reader) and BEFORE any decode', () => {
    const row = H.indexOf(".from('holidays')");
    const fly = H.indexOf('compositeViaFly({');
    const dec = H.indexOf('const base = await decodeImage(srcBytes);');
    expect(row).toBeGreaterThan(-1);
    expect(fly).toBeGreaterThan(row);
    expect(dec).toBeGreaterThan(fly);
  });

  it("overwrites the render's OWN key and answers the dispatcher's contract (ok + placed + path)", () => {
    expect(H).toContain('objectKey: objectPath,');
    expect(H).toContain(
      'if (r.ok) { console.log(`[holiday-postcard] ${r.stamp} ${holiday} ${objectPath}`); return json({ ok: true, ms: Date.now() - t0, placed: r.result.placed, path: objectPath }); }'
    );
  });

  it('the in-isolate path (with its pixel-cap deferral) remains as the fallback', () => {
    expect(H).toContain('if (dims && dims.width * dims.height > MAX_INLINE_PIXELS) {');
    expect((H.match(/compositeViaFly\(/g) || []).length).toBe(1);
    expect((H.match(/if \(imageOpsEnabled\(\)\) \{/g) || []).length).toBe(1);
  });
});
