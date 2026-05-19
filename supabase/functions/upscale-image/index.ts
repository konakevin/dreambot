/**
 * Edge Function: upscale-image — 4× HD upscale of a posted dream via
 * Clarity Upscaler (philz1337x/clarity-upscaler). Pro-gated. Caches
 * the result onto uploads.image_url_hq so subsequent requests skip
 * the upscale.
 *
 * POST /functions/v1/upscale-image
 * Auth: Bearer <user JWT>
 * Body: { upload_id: string }
 * Response 200: { image_url_hq: string, cached: boolean }
 *
 * Why Clarity (not Real-ESRGAN): Real-ESRGAN's general model is
 * trained primarily on photographs — tiny illustrated features (e.g.
 * 10-15px character eyes in TinyBot/ChibiBot/BloomBot renders) get
 * rebuilt with photo-realistic priors and mangled. Clarity is an
 * SDXL-based diffusion upscaler that respects the source style
 * across both photoreal and illustrated content. With low creativity
 * (0.2) + high resemblance (1.5) it adds detail without reimagining.
 *
 * Output: 3072×5376 (4× of 768×1344 source) — ~16 MP poster-quality.
 *
 * Latency: ~25-35s. Client shows a fullscreen overlay during wait.
 * Cost: ~$0.008 per upscale on Replicate.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { upscaleAndCache } from '../_shared/upscaleClarity.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

  // ── Run Clarity Upscaler 4× via shared helper ─────────────────────────
  console.log(
    `[upscale-image] user=${user.id.slice(0, 8)} upload=${body.upload_id.slice(0, 8)} starting upscale`
  );

  const persistedUrl = await upscaleAndCache(
    supabase,
    replicateToken,
    body.upload_id,
    uploadRow.image_url,
    user.id
  );
  if (!persistedUrl) {
    return json({ error: 'Upscale failed' }, 502);
  }

  return json({ image_url_hq: persistedUrl, cached: false }, 200);
});

function json(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
