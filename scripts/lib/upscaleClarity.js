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

const CLARITY_MODEL = 'philz1337x/clarity-upscaler';

/**
 * Submit + poll a Clarity Upscaler prediction. Returns the temp URL
 * of the upscaled image, or null on failure / timeout.
 */
async function runClarityUpscale(replicateToken, imageUrl) {
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
    console.warn(`  ⚠️ upscale submit failed (${submitRes.status}): ${text.slice(0, 200)}`);
    return null;
  }
  const data = await submitRes.json();
  if (!data.id) {
    console.warn('  ⚠️ upscale: no prediction id returned');
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
      return typeof pdata.output === 'string' ? pdata.output : pdata.output?.[0] ?? null;
    }
    if (pdata.status === 'failed' || pdata.status === 'canceled') {
      console.warn(`  ⚠️ upscale ${pdata.status}: ${pdata.error ?? 'unknown'}`);
      return null;
    }
  }
  console.warn('  ⚠️ upscale timed out (>90s)');
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
    const tempUrl = await runClarityUpscale(replicateToken, sourceUrl);
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

module.exports = { upscaleAndCache };
