/**
 * probeReachability — "is the PHONE online", racing non-Supabase endpoints.
 */
import { probeReachability } from '@/lib/reachability';

type FetchImpl = (url: string, init: RequestInit) => Promise<{ status: number }>;

const URLS = ['https://a.example/', 'https://b.example/'];

function fetchWith(map: Record<string, number | 'throw' | 'hang'>): FetchImpl {
  return (url, init) =>
    new Promise((resolve, reject) => {
      const v = map[url];
      if (v === 'throw') return reject(new Error('Network request failed'));
      if (v === 'hang') {
        init.signal?.addEventListener('abort', () => reject(new Error('AbortError')));
        return;
      }
      resolve({ status: v ?? 200 });
    });
}

describe('probeReachability', () => {
  it('is online when ANY probe answers, even if the other fails', async () => {
    const f = fetchWith({ [URLS[0] as string]: 'throw', [URLS[1] as string]: 204 });
    await expect(probeReachability(1_000, f, URLS)).resolves.toBe('online');
  });

  it('a 404 still proves the network path (online)', async () => {
    const f = fetchWith({ [URLS[0] as string]: 404, [URLS[1] as string]: 'throw' });
    await expect(probeReachability(1_000, f, URLS)).resolves.toBe('online');
  });

  it('a 5xx does not count as the phone being fine', async () => {
    const f = fetchWith({ [URLS[0] as string]: 503, [URLS[1] as string]: 'throw' });
    await expect(probeReachability(1_000, f, URLS)).resolves.toBe('offline');
  });

  it('is offline only when EVERY probe fails', async () => {
    const f = fetchWith({ [URLS[0] as string]: 'throw', [URLS[1] as string]: 'throw' });
    await expect(probeReachability(1_000, f, URLS)).resolves.toBe('offline');
  });

  it('aborts hung probes at the timeout and reports offline', async () => {
    jest.useFakeTimers();
    try {
      const f = fetchWith({ [URLS[0] as string]: 'hang', [URLS[1] as string]: 'hang' });
      const p = probeReachability(5_000, f, URLS);
      await jest.advanceTimersByTimeAsync(5_000);
      await expect(p).resolves.toBe('offline');
    } finally {
      jest.useRealTimers();
    }
  });

  it('uses HEAD with no-store so a cached response cannot fake connectivity', async () => {
    const seen: RequestInit[] = [];
    const f: FetchImpl = (_u, init) => {
      seen.push(init);
      return Promise.resolve({ status: 200 });
    };
    await probeReachability(1_000, f, URLS);
    for (const init of seen) {
      expect(init.method).toBe('HEAD');
      expect(init.cache).toBe('no-store');
      expect(init.signal).toBeDefined();
    }
  });

  it('is offline with no endpoints configured', async () => {
    await expect(probeReachability(1_000, fetchWith({}), [])).resolves.toBe('offline');
  });
});
