/**
 * A CAST FACE MUST RESOLVE TO THE SAME URL EVERY TIME.
 *
 * Supabase mints a signed URL with a fresh token per call, so the same file produced a
 * DIFFERENT string on every request. On the Create screen that cost twice over: an
 * avatar mounts the instant a typed name resolves to someone, and cold it pays a
 * network round trip to mint the URL and then a full image download, because
 * expo-image caches by URL and had never seen this one. Typing "Steph" lit her face
 * about a second later, every time, because the URL never repeated (Kevin, 2026-09-22).
 *
 * Caching by path is what makes the URL stable, and a stable URL is what lets the image
 * cache hit. The count of network calls is the lesser prize.
 */
import { castSignedUrl, cachedCastUrl, clearCastUrlCache } from '@/lib/castPhoto';

let mockCalls = 0;
let mockFailNext = false;
const mockCreateSignedUrl = jest.fn(async (path: string, ttl: number) => {
  mockCalls += 1;
  if (mockFailNext) return { data: null, error: { message: 'boom' } };
  // A fresh token per call, exactly as Supabase behaves.
  return { data: { signedUrl: `https://x/${path}?token=${mockCalls}&ttl=${ttl}` }, error: null };
});

jest.mock('@/lib/supabase', () => ({
  supabase: { storage: { from: () => ({ createSignedUrl: mockCreateSignedUrl }) } },
}));

beforeEach(() => {
  mockCalls = 0;
  mockFailNext = false;
  mockCreateSignedUrl.mockClear();
  clearCastUrlCache();
});

it('returns the SAME url for the same path, so the image cache can hit', async () => {
  const a = await castSignedUrl('u1/face.jpg');
  const b = await castSignedUrl('u1/face.jpg');
  expect(a).toBe(b);
  expect(mockCreateSignedUrl).toHaveBeenCalledTimes(1);
});

it('keeps different paths apart', async () => {
  const a = await castSignedUrl('u1/self.jpg');
  const b = await castSignedUrl('u1/steph.jpg');
  expect(a).not.toBe(b);
  expect(mockCreateSignedUrl).toHaveBeenCalledTimes(2);
});

it('makes ONE request when two avatars mount on the same keystroke', async () => {
  // The cast chip mounts self and the +1 together the moment a name resolves.
  const [a, b] = await Promise.all([castSignedUrl('u1/face.jpg'), castSignedUrl('u1/face.jpg')]);
  expect(a).toBe(b);
  expect(mockCreateSignedUrl).toHaveBeenCalledTimes(1);
});

it('exposes the cached url synchronously, so a warm face paints on the first frame', async () => {
  expect(cachedCastUrl('u1/face.jpg')).toBeNull();
  const url = await castSignedUrl('u1/face.jpg');
  expect(cachedCastUrl('u1/face.jpg')).toBe(url);
});

it('cachedCastUrl is null-safe for a member with no private path', () => {
  expect(cachedCastUrl(undefined)).toBeNull();
  expect(cachedCastUrl(null)).toBeNull();
  expect(cachedCastUrl('')).toBeNull();
});

it('does NOT cache a failure — a transient error must not blank that face all session', async () => {
  mockFailNext = true;
  expect(await castSignedUrl('u1/face.jpg')).toBeNull();
  expect(cachedCastUrl('u1/face.jpg')).toBeNull();
  mockFailNext = false;
  expect(await castSignedUrl('u1/face.jpg')).toContain('https://x/');
});

it('retires an entry BEFORE it truly expires, so a url handed to the server still works', async () => {
  // describe-photo and the first-dream render fetch these minutes later.
  const url = await castSignedUrl('u1/face.jpg');
  expect(url).toBeTruthy();
  const realNow = Date.now;
  try {
    // 50 minutes into a 60-minute TTL: past the 15-minute margin, so it re-mints
    // rather than handing out a url with only 10 minutes of life left.
    Date.now = () => realNow() + 50 * 60 * 1000;
    expect(cachedCastUrl('u1/face.jpg')).toBeNull();
    expect(await castSignedUrl('u1/face.jpg')).not.toBe(url);
  } finally {
    Date.now = realNow;
  }
});

it('clears on demand, so the next user does not inherit these', async () => {
  await castSignedUrl('u1/face.jpg');
  clearCastUrlCache();
  expect(cachedCastUrl('u1/face.jpg')).toBeNull();
});
