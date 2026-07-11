/**
 * Tests for generateImage's Replicate retry behavior — specifically that the 429
 * rate-limit retry is BOUNDED (it used to recurse forever). pickModel is mocked
 * to a Replicate flux model (isOpenAIModel/isGeminiModel return false for it, so
 * no provider mocks needed) and global.fetch is stubbed.
 */

jest.mock('@engine/modelPicker', () => ({
  pickModel: jest.fn().mockResolvedValue({ model: 'black-forest-labs/flux-1.1-pro' }),
}));

import { generateImage } from '@engine/generateImage';

// Minimal Response-like stub.
const res = (status: number, body: unknown) => ({
  status,
  ok: status >= 200 && status < 300,
  json: async () => body,
  text: async () => JSON.stringify(body),
});

const FLUX = 'black-forest-labs/flux-1.1-pro';
const origFetch = global.fetch;

afterEach(() => {
  global.fetch = origFetch;
  jest.clearAllMocks();
});

it('BOUNDED 429 retry — throws after MAX_429_RETRIES (3) instead of recursing forever', async () => {
  // Every submit returns 429 with retry_after:0 (so the sleep is instant).
  const fetchMock = jest.fn().mockResolvedValue(res(429, { retry_after: 0 }));
  global.fetch = fetchMock as unknown as typeof fetch;

  await expect(
    generateImage('flux-dev', 'a serene lake', undefined, 'tok', FLUX, 'jpg')
  ).rejects.toThrow(/rate-limited \(429\)/i);

  // 1 initial submit + 3 retries = 4 calls, then it gives up (NOT infinite).
  expect(fetchMock).toHaveBeenCalledTimes(4);
});

it('recovers when a 429 is followed by success', async () => {
  const fetchMock = jest
    .fn()
    .mockResolvedValueOnce(res(429, { retry_after: 0 })) // first submit rate-limited
    .mockResolvedValueOnce(res(201, { id: 'pred-1' })) // retry submit ok
    .mockResolvedValueOnce(res(200, { status: 'succeeded', output: ['https://img.jpg'] })); // poll
  global.fetch = fetchMock as unknown as typeof fetch;

  const out = await generateImage('flux-dev', 'a serene lake', undefined, 'tok', FLUX, 'jpg');
  expect(out.url).toBe('https://img.jpg');
  expect(out.provider).toBe('replicate');
  expect(out.predictionId).toBe('pred-1');
});

it('poll-transport failure bails EARLY (not a 90s timeout) after MAX_CONSECUTIVE_POLL_ERRORS', async () => {
  // Submit ok, then every poll GET 500s. The loop must bail after 3 CONSECUTIVE
  // poll errors with a failover-eligible "poll unavailable" error — NOT wait out
  // all 60 polls to a "Generation timed out". No gemini key here, so the
  // cross-provider failover can't run → the early error propagates unchanged.
  const fetchMock = jest
    .fn()
    .mockResolvedValueOnce(res(201, { id: 'pred-1' })) // submit ok
    .mockResolvedValue(res(500, { error: 'upstream' })); // every poll 500
  global.fetch = fetchMock as unknown as typeof fetch;

  await expect(
    generateImage('flux-dev', 'a serene lake', undefined, 'tok', FLUX, 'jpg')
  ).rejects.toThrow(/poll unavailable/i);

  // 1 submit + exactly 3 poll GETs (early bail), NOT 1 + 60.
  expect(fetchMock).toHaveBeenCalledTimes(4);
}, 15000);

it('tolerates a LONE poll blip (counter resets on a healthy poll) and still succeeds', async () => {
  const fetchMock = jest
    .fn()
    .mockResolvedValueOnce(res(201, { id: 'pred-1' })) // submit ok
    .mockResolvedValueOnce(res(503, {})) // poll blip #1 (counter=1)
    .mockResolvedValueOnce(res(200, { status: 'processing' })) // healthy poll → counter resets
    .mockResolvedValueOnce(res(503, {})) // poll blip #2 (counter=1, not 2)
    .mockResolvedValueOnce(res(200, { status: 'succeeded', output: ['https://img.jpg'] }));
  global.fetch = fetchMock as unknown as typeof fetch;

  const out = await generateImage('flux-dev', 'a serene lake', undefined, 'tok', FLUX, 'jpg');
  expect(out.url).toBe('https://img.jpg');
}, 15000);
