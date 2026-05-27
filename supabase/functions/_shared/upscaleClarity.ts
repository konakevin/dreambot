/**
 * Clarity Upscaler (philz1337x/clarity-upscaler) — 4× upscale helper
 * shared across Edge Functions. Mirrors scripts/lib/upscaleClarity.js
 * for the Node bot pipeline.
 *
 * Used by:
 *   - upscale-image  (on-demand Pro long-press → 4K save)
 *   - generate-dream (fire-and-forget for Pro users at render time)
 *   - nightly-dreams (fire-and-forget for Pro users)
 *   - dream-queue-worker/firstDream (fire-and-forget for Pro users)
 *
 * Low creativity (0.2) + high resemblance (1.5) preserves the source
 * style across both photoreal AND illustrated content. Real-ESRGAN
 * would mangle small cartoon features (TinyBot eyes, ChibiBot detail).
 *
 * Pattern for fire-and-forget from another Edge Function:
 *
 *   EdgeRuntime.waitUntil(
 *     upscaleAndCache(supabase, replicateToken, uploadId, imageUrl, userId)
 *   );
 *
 * The waitUntil API lets the upscale finish after the HTTP response
 * is sent — user gets their dream immediately, HQ version lands ~30s
 * later in the background.
 */

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { persistBufferToStorage } from './persistence.ts';

// Both are COMMUNITY models, so they MUST run via POST /v1/predictions with a
// pinned `version` hash. The official-model endpoint
// (/v1/models/<owner>/<name>/predictions) 404s for them — that silently broke
// every Pro on-demand HQ download AND every bot pre-upscale (2026-05-25). Pin
// versions so behavior is reproducible.
//
// Redundancy (G3): a primary + a fallback upscaler. clarity = best fidelity for
// BOTH photoreal and illustrated content. real-esrgan = reliable, always-up
// fallback (photo-biased, weaker on tiny cartoon features, but vastly better
// than serving original-res on a PAID HQ download when clarity is down). Tried
// in order; first success wins.
interface Upscaler {
  label: string;
  version: string;
  buildInput: (imageUrl: string) => Record<string, unknown>;
}

const UPSCALERS: Upscaler[] = [
  {
    label: 'clarity',
    version: 'dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e',
    // PNG (lossless) — paid HD; persistBufferToStorage sniffs magic bytes.
    // scale_factor 2 (HD ~1536x2688 / 4MP, ~17s) not 4 (16MP, ~64s) — quality
    // is plenty for a phone download and ~4x cheaper. See UPSCALE_QUEUE_PLAN.md.
    buildInput: (imageUrl) => ({
      image: imageUrl,
      scale_factor: 2,
      creativity: 0.2,
      resemblance: 1.5,
      num_inference_steps: 18,
      output_format: 'png',
      prompt: '',
      dynamic: 6,
      sharpen: 0,
    }),
  },
  {
    label: 'real-esrgan',
    version: 'b3ef194191d13140337468c916c2c5b96dd0cb06dffc032a022a31807f6a5ea8',
    buildInput: (imageUrl) => ({ image: imageUrl, scale: 2, face_enhance: false }),
  },
];

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504, 529]);
const SUBMIT_RETRY_DELAYS_MS = [1000, 4000];
const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

interface PollResult {
  url: string | null;
  retrySubmit?: boolean;
}

/**
 * One submit + poll attempt for a single model. Time-bounded (one ≤90s poll
 * window per started prediction) so the on-demand user-waiting path can't hang;
 * a started-then-failed/timed-out prediction moves on to the fallback model
 * rather than retrying the same slow model.
 */
async function submitAndPoll(
  replicateToken: string,
  model: Upscaler,
  imageUrl: string
): Promise<PollResult> {
  const submitRes = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ version: model.version, input: model.buildInput(imageUrl) }),
  });

  if (!submitRes.ok) {
    const text = await submitRes.text();
    console.warn(`[upscale:${model.label}] submit ${submitRes.status}: ${text.slice(0, 160)}`);
    return { url: null, retrySubmit: RETRYABLE_STATUSES.has(submitRes.status) };
  }
  const data = await submitRes.json();
  if (!data.id) return { url: null, retrySubmit: true };

  const maxPolls = 45;
  const intervalMs = 2000;
  for (let i = 0; i < maxPolls; i++) {
    await sleep(intervalMs);
    let pdata: { status?: string; output?: unknown; error?: string };
    try {
      const poll = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
        headers: { Authorization: `Bearer ${replicateToken}` },
      });
      pdata = await poll.json();
    } catch {
      continue; // transient poll/network blip — keep polling
    }
    if (pdata.status === 'succeeded') {
      const out =
        typeof pdata.output === 'string'
          ? pdata.output
          : ((Array.isArray(pdata.output) ? pdata.output[0] : null) ?? null);
      return { url: out };
    }
    if (pdata.status === 'failed' || pdata.status === 'canceled') {
      console.warn(`[upscale:${model.label}] ${pdata.status}: ${pdata.error ?? 'unknown'}`);
      return { url: null, retrySubmit: false };
    }
  }
  console.warn(`[upscale:${model.label}] timed out (>90s)`);
  return { url: null, retrySubmit: false };
}

/** Run one model, retrying only fast transient SUBMIT failures with backoff. */
async function runModelWithRetry(
  replicateToken: string,
  model: Upscaler,
  imageUrl: string
): Promise<string | null> {
  for (let attempt = 0; attempt <= SUBMIT_RETRY_DELAYS_MS.length; attempt++) {
    let res: PollResult;
    try {
      res = await submitAndPoll(replicateToken, model, imageUrl);
    } catch (err) {
      console.warn(`[upscale:${model.label}] threw: ${(err as Error).message}`);
      res = { url: null, retrySubmit: true };
    }
    if (res.url) return res.url;
    if (!res.retrySubmit) return null;
    if (attempt < SUBMIT_RETRY_DELAYS_MS.length) await sleep(SUBMIT_RETRY_DELAYS_MS[attempt]);
  }
  return null;
}

/**
 * Run the upscale with retries + model fallback (redundancy). Returns the temp
 * URL of the upscaled image, or null only if EVERY model+retry is exhausted.
 */
async function runUpscale(replicateToken: string, imageUrl: string): Promise<string | null> {
  for (const model of UPSCALERS) {
    const url = await runModelWithRetry(replicateToken, model, imageUrl);
    if (url) return url;
    console.warn(`[upscale] "${model.label}" exhausted — trying fallback`);
  }
  console.warn('[upscale] all upscalers exhausted');
  return null;
}

/**
 * Full pipeline: upscale → download → persist → update DB row.
 *
 * Returns the HQ public URL on success, null on any failure. Never
 * throws — failure here is non-fatal because the original render is
 * already persisted; missing HQ just means the first long-press
 * triggers the on-demand path.
 */
export async function upscaleAndCache(
  supabase: SupabaseClient,
  replicateToken: string,
  uploadId: string,
  sourceUrl: string,
  userId: string
): Promise<string | null> {
  if (!sourceUrl || !uploadId || !userId) return null;
  try {
    const tempUrl = await runUpscale(replicateToken, sourceUrl);
    if (!tempUrl) return null;

    const resp = await fetch(tempUrl);
    if (!resp.ok) {
      console.warn(`[upscaleAndCache] download failed: ${resp.status}`);
      return null;
    }
    const buf = await resp.arrayBuffer();

    // Deterministic cache key per upload → the write is idempotent. If a
    // re-run ever happens (stale-reclaim or failed-retry of the on-demand
    // upscale), it OVERWRITES this one object instead of orphaning a second
    // timestamped copy. Exactly one cached HD object per source image.
    const hqUrl = await persistBufferToStorage(
      buf,
      userId,
      supabase,
      `${userId}/hq/${uploadId}.png`
    );
    const { error: updErr } = await supabase
      .from('uploads')
      .update({
        image_url_hq: hqUrl,
        image_url_hq_generated_at: new Date().toISOString(),
      })
      .eq('id', uploadId);
    if (updErr) {
      console.warn(`[upscaleAndCache] DB update failed: ${updErr.message}`);
      return hqUrl;
    }
    console.log(`[upscaleAndCache] upload=${uploadId.slice(0, 8)} done -> ${hqUrl}`);
    return hqUrl;
  } catch (err) {
    console.warn(`[upscaleAndCache] threw: ${(err as Error).message}`);
    return null;
  }
}
