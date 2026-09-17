/**
 * persist.test.ts — the whole /persist pipeline against a MOCKED Storage client and a real JPEG fixture.
 * No network. Run: cd services/image-ops/src && deno test --allow-read --allow-net=esm.sh,deno.land
 * (--allow-net only so esm.sh deps can be cached on first run; nothing here fetches an image).
 */
import {
  assert,
  assertEquals,
  assertRejects,
  assertMatch,
} from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { encodeBase64 } from 'https://deno.land/std@0.224.0/encoding/base64.ts';
import {
  MAX_SOURCE_BYTES,
  PersistError,
  loadSource,
  objectKeyFor,
  persist,
  sniff,
  validateRequest,
} from './persist.ts';
import { aHashFromDecoded, sha256Hex } from './hashes.ts';
import { decodeImage } from './imageCodec.ts';

const USER = '11111111-2222-4333-8444-555555555555';
const fixture = await Deno.readFile(new URL('./fixtures/solo.jpg', import.meta.url));

/** A Storage client that records uploads instead of doing them. */
function mockSupabase() {
  const uploads: {
    key: string;
    bytes: number;
    contentType: string;
    cacheControl: string;
    upsert: boolean;
  }[] = [];
  const sb = {
    storage: {
      from: (_bucket: string) => ({
        upload: (
          key: string,
          data: Uint8Array,
          o: { contentType: string; cacheControl: string; upsert?: boolean }
        ) => {
          uploads.push({
            key,
            bytes: data.length,
            contentType: o.contentType,
            cacheControl: o.cacheControl,
            upsert: !!o.upsert,
          });
          return Promise.resolve({ error: null });
        },
        getPublicUrl: (key: string) => ({
          data: { publicUrl: `https://x.supabase.co/storage/v1/object/public/uploads/${key}` },
        }),
      }),
    },
  };
  // deno-lint-ignore no-explicit-any
  return { sb: sb as any, uploads };
}

Deno.test(
  'validateRequest — exactly one source, uuid user, mode, objectKey under the user prefix',
  () => {
    assertRejects; // (sync API; keep the import used for the async cases below)
    const good = validateRequest({
      sourceUrl: 'https://r.example/a.jpg',
      userId: USER,
      mode: 'final',
    });
    assertEquals(good.mode, 'final');
    for (const bad of [
      {},
      { sourceUrl: 'https://a', sourceBase64: 'AA==', userId: USER, mode: 'final' },
      { sourceUrl: 'http://insecure', userId: USER, mode: 'final' },
      { sourceUrl: 'https://a', userId: 'not-a-uuid', mode: 'final' },
      { sourceUrl: 'https://a', userId: USER, mode: 'weird' },
      { sourceUrl: 'https://a', userId: USER, mode: 'final', objectKey: 'someone-else/x.png' },
      { sourceUrl: 'https://a', userId: USER, mode: 'final', objectKey: `${USER}/../x.png` },
      { sourceUrl: 'https://a', userId: USER, mode: 'temp', objectKey: `${USER}/x.png` },
    ]) {
      let threw: PersistError | null = null;
      try {
        validateRequest(bad);
      } catch (e) {
        threw = e as PersistError;
      }
      assert(threw instanceof PersistError, `expected PersistError for ${JSON.stringify(bad)}`);
      assertEquals(threw!.status, 400);
    }
  }
);

Deno.test('sniff — magic bytes decide the container, never the declared mime', () => {
  assertEquals(sniff(fixture).contentType, 'image/jpeg');
  assertEquals(sniff(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0])).ext, 'png');
  let threw = false;
  try {
    sniff(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));
  } catch (e) {
    threw = (e as PersistError).code === 'unsupported_image';
  }
  assert(threw);
});

Deno.test('loadSource — base64 path decodes to the exact fixture bytes', async () => {
  const src = await loadSource({ sourceBase64: encodeBase64(fixture), userId: USER, mode: 'temp' });
  assertEquals(src.bytes.length, fixture.length);
  assertEquals(src.ext, 'jpg');
});

Deno.test('loadSource — a source over the cap is refused with 413, not decoded', async () => {
  const big = new Uint8Array(MAX_SOURCE_BYTES + 1);
  big.set([0xff, 0xd8, 0xff]);
  await assertRejects(
    () => loadSource({ sourceBase64: encodeBase64(big), userId: USER, mode: 'temp' }),
    PersistError,
    'bytes'
  );
});

Deno.test(
  'loadSource — URL path: a non-2xx source is a 502, and a throwing fetch is a 502',
  async () => {
    const notOk = () => Promise.resolve(new Response('nope', { status: 404 }));
    await assertRejects(
      () =>
        loadSource(
          { sourceUrl: 'https://r/x.jpg', userId: USER, mode: 'final' },
          notOk as typeof fetch
        ),
      PersistError,
      '404'
    );
    const boom = () => Promise.reject(new Error('ECONNRESET'));
    await assertRejects(
      () =>
        loadSource(
          { sourceUrl: 'https://r/x.jpg', userId: USER, mode: 'final' },
          boom as typeof fetch
        ),
      PersistError,
      'ECONNRESET'
    );
  }
);

Deno.test('objectKeyFor — paths are byte-identical to what the isolate writes today', () => {
  const final = objectKeyFor({ userId: USER, mode: 'final' }, 'jpg');
  assertMatch(final.key, new RegExp(`^${USER}/\\d+\\.jpg$`));
  assertEquals(final.cacheControl, '2592000');
  assertEquals(final.upsert, false);
  const temp = objectKeyFor({ userId: USER, mode: 'temp' }, 'png');
  assertMatch(temp.key, new RegExp(`^${USER}/swap-target-\\d+-[a-z0-9]{6}\\.png$`));
  assertEquals(temp.cacheControl, '300');
  const pinned = objectKeyFor(
    { userId: USER, mode: 'final', objectKey: `${USER}/hq/abc.png` },
    'png'
  );
  assertEquals(pinned.key, `${USER}/hq/abc.png`);
  assertEquals(pinned.upsert, true);
});

Deno.test(
  'persist — final mode: original + display uploaded, thumbhash + both hashes returned',
  async () => {
    const { sb, uploads } = mockSupabase();
    const r = await persist(sb, {
      sourceBase64: encodeBase64(fixture),
      userId: USER,
      mode: 'final',
      traceId: 't1',
    });
    assertEquals(uploads.length, 2, 'original + display');
    assertMatch(uploads[0].key, new RegExp(`^${USER}/\\d+\\.jpg$`));
    assertEquals(uploads[0].bytes, fixture.length);
    assertMatch(uploads[1].key, /\.display\.jpg$/);
    assert(
      uploads[1].bytes > 1000 && uploads[1].bytes < fixture.length * 2,
      'a real re-encoded JPEG'
    );
    assertMatch(r.url!, /\/uploads\/.+\.jpg$/);
    assertMatch(r.displayUrl!, /\.display\.jpg$/);
    assert(r.thumbhash && r.thumbhash.length > 10, 'thumbhash present');
    assertMatch(r.sha256!, /^[0-9a-f]{64}$/);
    assertMatch(r.ahash!, /^[0-9a-f]{16}$/);
    assert(r.width! > 0 && r.height! > 0);
    assert(r.ms.total >= 0);
  }
);

Deno.test(
  'persist — hashes are IDENTICAL to the isolate algorithms on the same bytes',
  async () => {
    const { sb } = mockSupabase();
    const r = await persist(sb, {
      sourceBase64: encodeBase64(fixture),
      userId: USER,
      mode: 'final',
    });
    assertEquals(r.sha256, await sha256Hex(fixture));
    assertEquals(r.ahash, aHashFromDecoded(await decodeImage(fixture)));
  }
);

Deno.test(
  'persist — temp mode: original only, short cache, no variants, nothing decoded',
  async () => {
    const { sb, uploads } = mockSupabase();
    const r = await persist(sb, {
      sourceBase64: encodeBase64(fixture),
      userId: USER,
      mode: 'temp',
    });
    assertEquals(uploads.length, 1);
    assertEquals(uploads[0].cacheControl, '300');
    assertEquals(r.displayUrl, null);
    assertEquals(r.thumbhash, null);
    assertEquals(r.sha256, null);
    assertEquals(r.ahash, null);
    assertEquals(r.ms.decode, 0);
  }
);

Deno.test(
  'persist — a failing display upload is best-effort: original URL still returned, display null',
  async () => {
    const { sb, uploads } = mockSupabase();
    let n = 0;
    sb.storage.from = (_b: string) => ({
      upload: (key: string, data: Uint8Array, o: { contentType: string; cacheControl: string }) => {
        n++;
        uploads.push({
          key,
          bytes: data.length,
          contentType: o.contentType,
          cacheControl: o.cacheControl,
          upsert: false,
        });
        return Promise.resolve({ error: n === 2 ? { message: 'quota' } : null });
      },
      getPublicUrl: (key: string) => ({ data: { publicUrl: `https://x/${key}` } }),
    });
    const r = await persist(sb, {
      sourceBase64: encodeBase64(fixture),
      userId: USER,
      mode: 'final',
    });
    assert(r.url!.length > 0);
    assertEquals(r.displayUrl, null);
    assert(r.thumbhash, 'thumbhash survives a display upload failure');
  }
);

Deno.test('persist — a failing ORIGINAL upload is the one hard failure', async () => {
  const { sb } = mockSupabase();
  sb.storage.from = () => ({
    upload: () => Promise.resolve({ error: { message: 'bucket gone' } }),
    getPublicUrl: (k: string) => ({ data: { publicUrl: `https://x/${k}` } }),
  });
  await assertRejects(
    () => persist(sb, { sourceBase64: encodeBase64(fixture), userId: USER, mode: 'final' }),
    PersistError,
    'original upload failed'
  );
});

Deno.test(
  'persist — hash mode: NOTHING uploaded, both hashes + dims returned, url null',
  async () => {
    const { sb, uploads } = mockSupabase();
    const r = await persist(sb, {
      sourceBase64: encodeBase64(fixture),
      userId: USER,
      mode: 'hash',
    });
    assertEquals(uploads.length, 0, 'hash mode must never write an object');
    assertEquals(r.url, null);
    assertEquals(r.displayUrl, null);
    assertEquals(r.thumbhash, null);
    assertEquals(r.sha256, await sha256Hex(fixture));
    assertEquals(r.ahash, aHashFromDecoded(await decodeImage(fixture)));
    assert(r.width! > 0 && r.height! > 0);
    assertEquals(r.ms.upload, 0);
  }
);
