/**
 * Edge Function: upscale-image — 4× upscale of a posted dream via
 * Real-ESRGAN (nightmareai/real-esrgan). Pro-gated. Caches the result
 * onto uploads.image_url_hq so subsequent requests skip the upscale.
 *
 * POST /functions/v1/upscale-image
 * Auth: Bearer <user JWT>
 * Body: { upload_id: string }
 * Response 200: { image_url_hq: string, cached: boolean }
 *
 * Why face_enhance=false: Real-ESRGAN's optional GFPGAN face-enhance
 * pass aggressively rebuilds faces and can drift identity on face-swap
 * renders. We trust Flux's original face — only upscale the canvas.
 *
 * Latency: ~15-25s for 1024×1024 → 4096×4096. The client shows a
 * full-screen overlay during the wait.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { persistToStorage } from '../_shared/persistence.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const REAL_ESRGAN_MODEL = 'nightmareai/real-esrgan';

interface RequestBody {
  upload_id: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? serviceRoleKey;
  const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');
  if (!replicateToken) return json({ error: 'REPLICATE_API_TOKEN missing' }, 500);

  // Authenticate the caller
  const authHeader = req.headers.get('authorization') ?? '';
  const supabaseUser = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
    error: authError,
  } = await supabaseUser.auth.getUser();
  if (authError || !user) {
    return json({ error: 'Not authenticated' }, 401);
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }
  if (!body.upload_id) {
    return json({ error: 'Missing upload_id' }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Pro gate: only Pro users can call this. We verify against the users
  // table rather than trusting the client.
  const { data: callerRow } = await supabase
    .from('users')
    .select('pro_subscription')
    .eq('id', user.id)
    .maybeSingle();
  if (!callerRow?.pro_subscription) {
    return json({ error: 'Pro subscription required' }, 403);
  }

  // Load the upload — we need the source image_url + need to check
  // whether image_url_hq is already populated (cache hit).
  const { data: uploadRow, error: uploadErr } = await supabase
    .from('uploads')
    .select('id, image_url, image_url_hq')
    .eq('id', body.upload_id)
    .maybeSingle();
  if (uploadErr || !uploadRow) {
    return json({ error: 'Upload not found' }, 404);
  }

  // Cache hit — skip upscale, return existing HQ URL.
  if (uploadRow.image_url_hq) {
    return json({ image_url_hq: uploadRow.image_url_hq, cached: true }, 200);
  }

  // ── Run Real-ESRGAN 4× via Replicate ───────────────────────────────────
  console.log(
    `[upscale-image] user=${user.id.slice(0, 8)} upload=${body.upload_id.slice(0, 8)} starting upscale`
  );

  const submitRes = await fetch(
    `https://api.replicate.com/v1/models/${REAL_ESRGAN_MODEL}/predictions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${replicateToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          image: uploadRow.image_url,
          scale: 4,
          face_enhance: false,
        },
      }),
    }
  );

  if (!submitRes.ok) {
    const text = await submitRes.text();
    console.error(`[upscale-image] Replicate submit failed (${submitRes.status}): ${text}`);
    return json({ error: `Upscale submit failed (${submitRes.status})` }, 502);
  }

  const submitData = await submitRes.json();
  if (!submitData.id) {
    return json({ error: 'No prediction ID from Replicate' }, 502);
  }

  // Poll — Real-ESRGAN typically completes in 15-25s. We allow up to 60s.
  const maxPolls = 30;
  const intervalMs = 2000;
  let upscaledTempUrl: string | null = null;

  for (let i = 0; i < maxPolls; i++) {
    await new Promise((r) => setTimeout(r, intervalMs));
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${submitData.id}`, {
      headers: { Authorization: `Bearer ${replicateToken}` },
    });
    const pollData = await pollRes.json();
    if (pollData.status === 'succeeded') {
      upscaledTempUrl =
        typeof pollData.output === 'string' ? pollData.output : pollData.output?.[0];
      break;
    }
    if (pollData.status === 'failed' || pollData.status === 'canceled') {
      const errMsg = pollData.error ?? 'unknown';
      console.error(`[upscale-image] Replicate ${pollData.status}: ${errMsg}`);
      return json({ error: `Upscale ${pollData.status}: ${errMsg}` }, 502);
    }
  }

  if (!upscaledTempUrl) {
    return json({ error: 'Upscale timed out (>60s)' }, 504);
  }

  // ── Persist to Supabase Storage ────────────────────────────────────────
  let persistedUrl: string;
  try {
    persistedUrl = await persistToStorage(upscaledTempUrl, user.id, supabase);
  } catch (err) {
    console.error(`[upscale-image] Persist failed: ${(err as Error).message}`);
    return json({ error: `Persist failed: ${(err as Error).message}` }, 500);
  }

  // ── Update uploads row with cached HQ URL ──────────────────────────────
  const { error: updateErr } = await supabase
    .from('uploads')
    .update({
      image_url_hq: persistedUrl,
      image_url_hq_generated_at: new Date().toISOString(),
    })
    .eq('id', body.upload_id);

  if (updateErr) {
    // Non-fatal — we still return the URL to the user, just won't be cached.
    console.warn(`[upscale-image] DB update failed: ${updateErr.message}`);
  }

  console.log(
    `[upscale-image] user=${user.id.slice(0, 8)} upload=${body.upload_id.slice(0, 8)} done -> ${persistedUrl}`
  );

  return json({ image_url_hq: persistedUrl, cached: false }, 200);
});

function json(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
