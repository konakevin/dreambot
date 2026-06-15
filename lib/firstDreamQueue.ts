/**
 * First-dream async-queue client (2026-06-15).
 *
 * Replaces the old synchronous `lib/firstDreamCascade.ts`, which had the client
 * AWAIT a multi-tier render over a no-timeout `fetch` — the "loading forever"
 * bug (a slow/stalled dual swap held the reveal screen indefinitely while the
 * render actually completed server-side).
 *
 * Now: enqueue ONE job (`enqueue-dream` with `first_dream:true`), then poll
 * `dream_jobs` for the terminal state. The dual → single → scene cascade runs
 * server-side (first-dream-render advances tiers across isolates), so the client
 * just watches one job id — no long-held HTTP connection, no gateway timeout.
 */

import { supabase } from '@/lib/supabase';
import type { VibeProfile } from '@/types/vibeProfile';

export interface FirstDreamResult {
  url: string;
  prompt: string;
  medium?: string;
  vibe?: string;
  uploadId?: string;
}

/** Enqueue the onboarding first dream (free). Returns the job id to watch. */
export async function enqueueFirstDream(profile: VibeProfile): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated');

  const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/enqueue-dream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ first_dream: true, vibe_profile: profile }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`enqueue_failed:${res.status}:${t.slice(0, 120)}`);
  }
  const data = await res.json();
  if (!data?.dream_id) throw new Error('enqueue_no_dream_id');
  return data.dream_id as string;
}

interface AwaitOpts {
  /** Overall wait ceiling before giving up (cascade can chain a few renders). */
  timeoutMs?: number;
  /** Poll cadence. */
  intervalMs?: number;
  /** Abort the poll loop (e.g. on unmount). */
  signal?: AbortSignal;
}

/**
 * Poll `dream_jobs` until the first dream finishes. Resolves with the rendered
 * dream on success; rejects on terminal failure (all cascade tiers exhausted)
 * or timeout — the caller surfaces the onboarding retry UI either way.
 */
export async function awaitFirstDream(
  jobId: string,
  opts: AwaitOpts = {}
): Promise<FirstDreamResult> {
  const timeoutMs = opts.timeoutMs ?? 5 * 60 * 1000;
  const intervalMs = opts.intervalMs ?? 2500;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (opts.signal?.aborted) throw new Error('aborted');

    const { data } = await supabase
      .from('dream_jobs')
      .select(
        'status, result_image_url, result_prompt, result_medium, result_vibe, upload_id, error'
      )
      .eq('id', jobId)
      .maybeSingle();

    if (data) {
      if (data.status === 'done' && data.result_image_url) {
        return {
          url: data.result_image_url,
          prompt: data.result_prompt ?? '',
          medium: data.result_medium ?? undefined,
          vibe: data.result_vibe ?? undefined,
          uploadId: data.upload_id ?? undefined,
        };
      }
      if (data.status === 'failed' || data.status === 'nsfw') {
        throw new Error(`first_dream_failed:${data.error ?? data.status}`);
      }
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('first_dream_timeout');
}
