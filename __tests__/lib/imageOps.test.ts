/**
 * imageOps — the isolate's client for the Fly image-ops service (NO_PIXELS_IN_ISOLATE_PLAN.md).
 *
 * Two things are locked here and both are safety properties, not features:
 *
 * 1. FAIL-OPEN. `persistViaFly` never throws and never blocks a render. Every failure shape a network
 *    call can have — no secret, timeout, 5xx, 4xx with a code, non-JSON body, a body without a URL —
 *    returns `{ ok: false, reason }` and a stamp, so the caller runs today's in-isolate path. A dream
 *    must never fail BECAUSE we added a faster way to persist it.
 *
 * 2. DRIFT. The service carries copies of imageCodec.ts and thumbhashGen.ts and a port of the aHash.
 *    Its hashes must equal the isolate's on the same bytes or dedup silently stops working across the
 *    two paths. The copies are pinned byte-identical to their sources; the aHash port is pinned to the
 *    exact function body.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..', '..');
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');

describe('drift guard — the service copies are byte-identical to their sources', () => {
  it('imageCodec.ts equals the proven Fly copy in face-swap-dual', () => {
    expect(read('services/image-ops/src/imageCodec.ts')).toBe(
      read('services/face-swap-dual/src/imageCodec.ts')
    );
  });

  it('thumbhashGen.ts equals _shared/thumbhashGen.ts', () => {
    expect(read('services/image-ops/src/thumbhashGen.ts')).toBe(
      read('supabase/functions/_shared/thumbhashGen.ts')
    );
  });

  it('aHashFromDecoded body equals persistence.ts:aHashFromDecoded', () => {
    const body = (src: string) => {
      const m = src.match(
        /export function aHashFromDecoded\(decoded: DecodedImage\): string \{([\s\S]*?)\n\}/
      );
      expect(m).toBeTruthy();
      // Comments are documentation, not algorithm — strip them so a port may annotate itself.
      return m![1]
        .replace(/\/\/[^\n]*/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    };
    expect(body(read('services/image-ops/src/hashes.ts'))).toBe(
      body(read('supabase/functions/_shared/persistence.ts'))
    );
  });
});

describe('persistViaFly — fail-open under every failure shape', () => {
  // The module reads secrets through a typeof-Deno guard; give it a Deno with the two secrets set.
  const envVars: Record<string, string | undefined> = {};
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).Deno = { env: { get: (k: string) => envVars[k] } };
  });
  afterAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).Deno;
  });
  beforeEach(() => {
    envVars.IMAGE_OPS_FLY_URL = 'https://image-ops.test';
    envVars.IMAGE_OPS_FLY_TOKEN = 'tok';
  });

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { persistViaFly, imageOpsEnabled } = require('@engine/imageOps');
  const opts = { sourceUrl: 'https://r/x.jpg', userId: 'u', mode: 'final' as const, traceId: 't' };

  it('no URL secret → disabled, immediately, no fetch', async () => {
    envVars.IMAGE_OPS_FLY_URL = undefined;
    const f = jest.fn();
    const r = await persistViaFly(opts, f);
    expect(r.ok).toBe(false);
    expect(r.stamp).toBe('image_ops:fallback:disabled');
    expect(f).not.toHaveBeenCalled();
    expect(imageOpsEnabled()).toBe(false);
  });

  it('URL but no token → no_token, no fetch', async () => {
    envVars.IMAGE_OPS_FLY_TOKEN = undefined;
    const f = jest.fn();
    const r = await persistViaFly(opts, f);
    expect(r).toMatchObject({ ok: false, reason: 'no_token' });
    expect(f).not.toHaveBeenCalled();
  });

  it('fetch throws → fetch_error', async () => {
    const f = jest.fn(async () => {
      throw new Error('ECONNRESET');
    });
    const r = await persistViaFly(opts, f);
    expect(r).toMatchObject({
      ok: false,
      reason: 'fetch_error',
      stamp: 'image_ops:fallback:fetch_error',
    });
  });

  it('timeout → timeout (the TimeoutError name is what AbortSignal.timeout throws)', async () => {
    const f = jest.fn(async () => {
      const e = new Error('signal timed out');
      e.name = 'TimeoutError';
      throw e;
    });
    const r = await persistViaFly(opts, f);
    expect(r).toMatchObject({ ok: false, reason: 'timeout' });
  });

  it('5xx with a JSON code → http_500:<code>', async () => {
    const f = jest.fn(
      async () =>
        new Response(JSON.stringify({ error: 'x', code: 'upload_failed' }), { status: 500 })
    );
    const r = await persistViaFly(opts, f);
    expect(r).toMatchObject({ ok: false, reason: 'http_500:upload_failed' });
  });

  it('4xx with a non-JSON body → http_413 (status survives a body we cannot parse)', async () => {
    const f = jest.fn(async () => new Response('too big', { status: 413 }));
    const r = await persistViaFly(opts, f);
    expect(r).toMatchObject({ ok: false, reason: 'http_413' });
  });

  it('200 without an https url → bad_response', async () => {
    const f = jest.fn(async () => new Response(JSON.stringify({ url: 'nope' }), { status: 200 }));
    const r = await persistViaFly(opts, f);
    expect(r).toMatchObject({ ok: false, reason: 'bad_response' });
  });

  it('success → the result, an ms, and the fly stamp — and the request carried the token + body', async () => {
    const f = jest.fn(async (_url: string, init: RequestInit) => {
      expect(_url).toBe('https://image-ops.test/persist');
      expect((init.headers as Record<string, string>).Authorization).toBe('Bearer tok');
      const sent = JSON.parse(String(init.body));
      expect(sent).toMatchObject({
        sourceUrl: 'https://r/x.jpg',
        userId: 'u',
        mode: 'final',
        traceId: 't',
      });
      expect(sent.timeoutMs).toBeUndefined();
      return new Response(
        JSON.stringify({
          url: 'https://x/u/1.jpg',
          displayUrl: 'https://x/u/1.display.jpg',
          thumbhash: 'AAA',
          sha256: 'ab',
          ahash: 'cd',
          width: 1,
          height: 2,
          bytes: 3,
          contentType: 'image/jpeg',
          ms: { fetch: 1, decode: 1, encode: 1, upload: 1, total: 4 },
        }),
        { status: 200 }
      );
    });
    const r = await persistViaFly(opts, f);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.result.url).toBe('https://x/u/1.jpg');
      expect(r.stamp).toMatch(/^image_ops:fly:\d+$/);
    }
  });

  it('hash mode: a 200 with a url but no ahash is bad_response; a valid ahash is ok even with url null', async () => {
    const hopts = { sourceUrl: 'https://r/x.jpg', userId: 'u', mode: 'hash' as const };
    const noHash = jest.fn(
      async () => new Response(JSON.stringify({ url: 'https://x/u/1.jpg' }), { status: 200 })
    );
    expect(await persistViaFly(hopts, noHash)).toMatchObject({ ok: false, reason: 'bad_response' });
    const good = jest.fn(
      async () =>
        new Response(
          JSON.stringify({
            url: null,
            ahash: '0fefcf1f07215c47',
            sha256: 'ab',
            width: 1,
            height: 1,
            bytes: 1,
            contentType: 'image/jpeg',
            ms: {},
          }),
          { status: 200 }
        )
    );
    const r = await persistViaFly(hopts, good);
    expect(r.ok).toBe(true);
  });
});
