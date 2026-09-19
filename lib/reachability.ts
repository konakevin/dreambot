/**
 * Reachability probe — is the PHONE online, independent of Supabase?
 *
 * Plain `fetch` (no native module, no dev-build churn). Races the endpoints in
 * REACHABILITY_PROBES; the first server answer of any kind wins as `online`
 * (a 404 still proves the network path), and only when EVERY probe throws or
 * times out do we say `offline`. A manual AbortController + setTimeout is used
 * rather than AbortSignal.timeout(), which Hermes does not guarantee.
 */
import { BOOT_STALL, REACHABILITY_PROBES } from '@/constants/bootStall';

export type ProbeResult = 'online' | 'offline';

type FetchLike = (url: string, init: RequestInit) => Promise<{ status: number }>;

async function probeOne(url: string, timeoutMs: number, fetchImpl: FetchLike): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
    });
    // Any response the server produced means the path is up. 5xx is excluded so
    // a dying CDN edge does not count as "the phone is fine".
    return res.status > 0 && res.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export function probeReachability(
  timeoutMs: number = BOOT_STALL.PROBE_TIMEOUT_MS,
  fetchImpl: FetchLike = (url, init) => fetch(url, init),
  urls: readonly string[] = REACHABILITY_PROBES
): Promise<ProbeResult> {
  if (urls.length === 0) return Promise.resolve('offline');
  return new Promise<ProbeResult>((resolve) => {
    let remaining = urls.length;
    for (const url of urls) {
      void probeOne(url, timeoutMs, fetchImpl).then((ok) => {
        if (ok) {
          resolve('online');
        } else if (--remaining === 0) {
          resolve('offline');
        }
      });
    }
  });
}
