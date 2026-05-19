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

const CLARITY_MODEL = 'philz1337x/clarity-upscaler';

async function runClarityUpscale(replicateToken: string, imageUrl: string): Promise<string | null> {
  const submitRes = await fetch(
    `https://api.replicate.com/v1/models/${CLARITY_MODEL}/predictions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${replicateToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          image: imageUrl,
          scale_factor: 4,
          creativity: 0.2,
          resemblance: 1.5,
          num_inference_steps: 18,
          output_format: 'jpg',
          prompt: '',
          dynamic: 6,
          sharpen: 0,
        },
      }),
    }
  );

  if (!submitRes.ok) {
    const text = await submitRes.text();
    console.warn(`[upscaleClarity] submit failed (${submitRes.status}): ${text.slice(0, 200)}`);
    return null;
  }
  const data = await submitRes.json();
  if (!data.id) {
    console.warn('[upscaleClarity] no prediction id returned');
    return null;
  }

  // Poll up to 90s
  const maxPolls = 45;
  const intervalMs = 2000;
  for (let i = 0; i < maxPolls; i++) {
    await new Promise((r) => setTimeout(r, intervalMs));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
      headers: { Authorization: `Bearer ${replicateToken}` },
    });
    const pdata = await poll.json();
    if (pdata.status === 'succeeded') {
      return typeof pdata.output === 'string' ? pdata.output : (pdata.output?.[0] ?? null);
    }
    if (pdata.status === 'failed' || pdata.status === 'canceled') {
      console.warn(`[upscaleClarity] ${pdata.status}: ${pdata.error ?? 'unknown'}`);
      return null;
    }
  }
  console.warn('[upscaleClarity] timed out (>90s)');
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
    const tempUrl = await runClarityUpscale(replicateToken, sourceUrl);
    if (!tempUrl) return null;

    const resp = await fetch(tempUrl);
    if (!resp.ok) {
      console.warn(`[upscaleAndCache] download failed: ${resp.status}`);
      return null;
    }
    const buf = await resp.arrayBuffer();

    const hqUrl = await persistBufferToStorage(buf, userId, supabase);
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
