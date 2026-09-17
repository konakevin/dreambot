/**
 * composite.test.ts — the /composite pipeline against a MOCKED Storage client and a stubbed fetch.
 * The overlay is the fixture itself (opaque; the compositor blends alpha 255 like any PNG) — this tests
 * the plumbing and the write, not the artwork.
 */
import {
  assert,
  assertEquals,
  assertRejects,
  assertThrows,
} from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { composite, validateCompositeRequest } from './composite.ts';
import { PersistError } from './persist.ts';
import { decodeImage } from './imageCodec.ts';

const fixture = await Deno.readFile(new URL('./fixtures/solo.jpg', import.meta.url));
const KEY = '11111111-2222-4333-8444-555555555555/1789000000000.jpg';
const REQ = {
  imageUrl: 'https://x.supabase.co/storage/v1/object/public/uploads/' + KEY,
  overlayUrl: 'https://x.supabase.co/storage/v1/object/public/holidays/halloween.png',
  objectKey: KEY,
  layout: { anchor: 'bottom', widthPct: 0.82, marginPct: 0.05, scrim: true },
};

function mockSupabase() {
  const uploads: {
    key: string;
    data: Uint8Array;
    contentType: string;
    upsert: boolean;
  }[] = [];
  const sb = {
    storage: {
      from: (_b: string) => ({
        upload: (key: string, data: Uint8Array, o: { contentType: string; upsert?: boolean }) => {
          uploads.push({
            key,
            data,
            contentType: o.contentType,
            upsert: !!o.upsert,
          });
          return Promise.resolve({ error: null });
        },
      }),
    },
  };
  // deno-lint-ignore no-explicit-any
  return { sb: sb as any, uploads };
}
const serveFixture = ((_url: string) =>
  Promise.resolve(new Response(fixture))) as unknown as typeof fetch;

Deno.test('validateCompositeRequest — https URLs, a relative key, a sane layout', () => {
  const r = validateCompositeRequest(REQ);
  assertEquals(r.layout, {
    anchor: 'bottom',
    widthPct: 0.82,
    marginPct: 0.05,
    scrim: true,
  });
  assertThrows(
    () => validateCompositeRequest({ ...REQ, imageUrl: 'http://x/y.jpg' }),
    PersistError,
    'https'
  );
  assertThrows(
    () => validateCompositeRequest({ ...REQ, objectKey: '../etc' }),
    PersistError,
    'relative'
  );
  assertThrows(
    () => validateCompositeRequest({ ...REQ, objectKey: '/abs' }),
    PersistError,
    'relative'
  );
  assertThrows(
    () =>
      validateCompositeRequest({
        ...REQ,
        layout: { ...REQ.layout, anchor: 'left' },
      }),
    PersistError,
    'anchor'
  );
  assertThrows(
    () =>
      validateCompositeRequest({
        ...REQ,
        layout: { ...REQ.layout, widthPct: 1.5 },
      }),
    PersistError,
    'widthPct'
  );
  assertThrows(
    () =>
      validateCompositeRequest({
        ...REQ,
        layout: { ...REQ.layout, marginPct: 0.5 },
      }),
    PersistError,
    'marginPct'
  );
  assertEquals(
    validateCompositeRequest({
      ...REQ,
      layout: { ...REQ.layout, scrim: false },
    }).layout.scrim,
    false
  );
});

Deno.test(
  'composite — overwrites the render key with a JPEG of the same dims; overlay placed in-bounds',
  async () => {
    const { sb, uploads } = mockSupabase();
    const r = await composite(sb, validateCompositeRequest(REQ), {
      fetchImpl: serveFixture,
    });
    const src = await decodeImage(fixture);
    assertEquals(uploads.length, 1);
    assertEquals(uploads[0].key, KEY);
    assertEquals(uploads[0].contentType, 'image/jpeg');
    assertEquals(uploads[0].upsert, true);
    assertEquals(r.key, KEY);
    assertEquals([r.width, r.height], [src.width, src.height]);
    const out = await decodeImage(uploads[0].data);
    assertEquals([out.width, out.height], [src.width, src.height]);
    assertEquals(r.placed.width, Math.round(src.width * 0.82));
    assert(r.placed.x >= 0 && r.placed.x + r.placed.width <= src.width, 'x in bounds');
    assert(r.placed.y >= 0 && r.placed.y + r.placed.height <= src.height, 'y in bounds');
    assert(r.ms.total >= r.ms.encode);
  }
);

Deno.test('composite — a failing source fetch is 502, nothing written', async () => {
  const { sb, uploads } = mockSupabase();
  const failing = ((url: string) =>
    Promise.resolve(
      url.endsWith('.png') ? new Response(fixture) : new Response('', { status: 404 })
    )) as unknown as typeof fetch;
  await assertRejects(
    () =>
      composite(sb, validateCompositeRequest({ ...REQ, overlayUrl: 'https://x/o2.png' }), {
        fetchImpl: failing,
      }),
    PersistError,
    'source returned 404'
  );
  assertEquals(uploads.length, 0);
});
