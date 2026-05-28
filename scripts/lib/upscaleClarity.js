/**
 * Clarity Upscaler (philz1337x/clarity-upscaler) — 4× upscale helper
 * for the Node bot pipeline. Mirrors supabase/functions/upscale-image
 * for the Pro long-press path.
 *
 * Pre-upscales every bot render so Pro users get instant HQ on save
 * (cache hits from day one). ~$0.008/run on Replicate, ~25-35s.
 *
 * Low creativity (0.2) + high resemblance (1.5) preserves the source
 * style across photoreal AND illustrated content. Real-ESRGAN would
 * mangle small cartoon features (TinyBot eyes, ChibiBot details).
 *
 * Usage:
 *   const hqUrl = await upscaleAndCache(sb, replicateToken, uploadId, sourceUrl, userId);
 *   // -> persists 4K render to storage + sets uploads.image_url_hq
 *   // -> returns the public URL of the HQ render (or null on failure)
 *
 * Bot context: failures are non-fatal — log and return null; the
 * regular Flux render is already persisted at this point, so missing
 * the upscale just means the first Pro user to long-press will pay
 * the ~30s wait (i.e. fall back to the on-demand Edge Function path).
 */

// Both are COMMUNITY models, so they MUST run via POST /v1/predictions with a
// pinned `version` hash. The official-model endpoint
// (/v1/models/<owner>/<name>/predictions) 404s for them — that silently skipped
// every bot pre-upscale AND every Pro on-demand HQ download (2026-05-25). Pin
// versions so behavior is reproducible.
//
// Redundancy (G3): a primary + a fallback upscaler. clarity = best fidelity for
// BOTH photoreal and illustrated content (low-creativity diffusion). real-esrgan
// = reliable, always-up fallback — photo-biased and weaker on tiny cartoon
// features, but vastly better than serving original-res on a PAID HQ download
// when clarity is down. Tried in order; first success wins.
const UPSCALERS = [
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
      // 18 = Clarity's default. MEASURED 2026-05-27: steps barely affect speed
      // (predict_time ~14.1s at 6 steps vs ~15.3s at 18) — the ~14s is fixed
      // pipeline overhead (VAE/tiling/IO), not per-step cost. So we keep the
      // full-quality default; tuning steps is not a speed lever. Keep in sync
      // with supabase/functions/_shared/upscaleClarity.ts.
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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * One submit + poll attempt for a single model. Returns:
 *   { url }                       — success
 *   { url: null, retrySubmit: true }  — transient submit failure worth a quick retry
 *   { url: null, retrySubmit: false } — give up on THIS model (bad input, or the
 *                                        prediction started then failed/timed out)
 * Time-bounded so the on-demand (user-waiting) path can't hang: one poll window
 * (≤90s) max per started prediction; failures move on to the fallback model.
 */
async function submitAndPoll(replicateToken, model, imageUrl) {
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
    console.warn(`  ⚠️ [${model.label}] submit ${submitRes.status}: ${text.slice(0, 160)}`);
    return { url: null, retrySubmit: RETRYABLE_STATUSES.has(submitRes.status) };
  }
  const data = await submitRes.json();
  if (!data.id) return { url: null, retrySubmit: true };

  const maxPolls = 45;
  const intervalMs = 2000;
  for (let i = 0; i < maxPolls; i++) {
    await sleep(intervalMs);
    let pdata;
    try {
      const poll = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
        headers: { Authorization: `Bearer ${replicateToken}` },
      });
      pdata = await poll.json();
    } catch {
      continue; // transient poll/network blip — keep polling
    }
    if (pdata.status === 'succeeded') {
      const out = typeof pdata.output === 'string' ? pdata.output : (pdata.output?.[0] ?? null);
      return { url: out };
    }
    if (pdata.status === 'failed' || pdata.status === 'canceled') {
      console.warn(`  ⚠️ [${model.label}] ${pdata.status}: ${pdata.error ?? 'unknown'}`);
      return { url: null, retrySubmit: false };
    }
  }
  console.warn(`  ⚠️ [${model.label}] timed out (>90s)`);
  return { url: null, retrySubmit: false };
}

/** Run one model, retrying only fast transient SUBMIT failures with backoff. */
async function runModelWithRetry(replicateToken, model, imageUrl) {
  for (let attempt = 0; attempt <= SUBMIT_RETRY_DELAYS_MS.length; attempt++) {
    let res;
    try {
      res = await submitAndPoll(replicateToken, model, imageUrl);
    } catch (err) {
      console.warn(`  ⚠️ [${model.label}] threw: ${err.message}`);
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
async function runUpscale(replicateToken, imageUrl) {
  for (const model of UPSCALERS) {
    const url = await runModelWithRetry(replicateToken, model, imageUrl);
    if (url) return url;
    console.warn(`  ⚠️ upscaler "${model.label}" exhausted — trying fallback`);
  }
  console.warn('  ⚠️ all upscalers exhausted');
  return null;
}

/**
 * Download a URL to a Buffer. Used to fetch the upscaled image back
 * from Replicate's temp URL before re-uploading to Supabase Storage.
 */
async function downloadToBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download upscaled image: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Persist a buffer to Supabase Storage under the user's folder.
 * Returns the permanent public URL.
 */
async function persistBufferToStorage(sb, buffer, userId) {
  const head = buffer.subarray(0, 4);
  const isPng = head[0] === 0x89 && head[1] === 0x50;
  const ext = isPng ? 'png' : 'jpg';
  const contentType = isPng ? 'image/png' : 'image/jpeg';
  const fileName = `${userId}/hq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage
    .from('uploads')
    .upload(fileName, buffer, { contentType, cacheControl: '2592000' });
  if (error) throw new Error(`HQ storage upload failed: ${error.message}`);
  return sb.storage.from('uploads').getPublicUrl(fileName).data.publicUrl;
}

/**
 * Full pipeline: upscale → download → persist → update DB row.
 *
 * Returns the HQ public URL on success, or null on any failure.
 * Failures are logged but never throw — bots should never crash on
 * an upscale issue since the original render is already persisted.
 */
async function upscaleAndCache(sb, replicateToken, uploadId, sourceUrl, userId) {
  if (!sourceUrl || !uploadId || !userId) return null;
  try {
    const tempUrl = await runUpscale(replicateToken, sourceUrl);
    if (!tempUrl) return null;
    const buf = await downloadToBuffer(tempUrl);
    const hqUrl = await persistBufferToStorage(sb, buf, userId);
    const { error: updErr } = await sb
      .from('uploads')
      .update({
        image_url_hq: hqUrl,
        image_url_hq_generated_at: new Date().toISOString(),
      })
      .eq('id', uploadId);
    if (updErr) {
      console.warn(`  ⚠️ upscale DB update failed: ${updErr.message}`);
      return hqUrl; // Storage worked, DB didn't — caller can still use URL
    }
    return hqUrl;
  } catch (err) {
    console.warn(`  ⚠️ upscaleAndCache threw: ${err.message}`);
    return null;
  }
}

// UPSCALERS + runUpscale exported for the monitoring smoke test
// (scripts/upscale-smoke-test.js) so it exercises the EXACT pinned versions —
// a deprecated version or broken endpoint fails the scheduled check loudly
// instead of silently degrading the paid HQ feature.
module.exports = { upscaleAndCache, runUpscale, UPSCALERS };
