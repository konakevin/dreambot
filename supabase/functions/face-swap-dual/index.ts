/**
 * Edge Function: face-swap-dual — isolated dual face-swap pipeline.
 *
 * Lives in its own Edge Function invocation so it gets a fresh memory +
 * CPU budget separate from generate-dream / nightly-dreams. The dual
 * pipeline holds 6+ image buffers in memory (target RGBA, 2 crops,
 * 2 swap-output RGBA, stitched RGBA) plus Replicate polling state, and
 * was hitting Supabase's per-invocation 150 MB / ~2 s CPU ceiling when
 * combined with the rest of the dream pipeline.
 *
 * Called via supabase.functions.invoke() from the orchestrator function
 * when DUAL_SWAP_FANOUT=true. Otherwise the orchestrator runs the
 * in-process dualFaceSwap() path (kept as fallback for the rollout).
 *
 * POST /functions/v1/face-swap-dual
 * Body: { targetUrl, leftSourceUrl, rightSourceUrl, userId, deadlineMs? }
 * Response 200: { swappedUrl }
 * Response 4xx/5xx: { error }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { dualFaceSwap } from '../_shared/faceSwap.ts';

interface RequestBody {
  targetUrl: string;
  leftSourceUrl: string;
  rightSourceUrl: string;
  userId: string;
  /** Absolute deadline (Date.now() + remaining). Optional — defaults to now + 105s. */
  deadlineMs?: number;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const REPLICATE_TOKEN = Deno.env.get('REPLICATE_API_TOKEN');
  if (!REPLICATE_TOKEN) {
    return new Response(
      JSON.stringify({ error: 'Server misconfigured: missing REPLICATE_API_TOKEN' }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const { targetUrl, leftSourceUrl, rightSourceUrl, userId, deadlineMs } = body;
  if (!targetUrl || !leftSourceUrl || !rightSourceUrl || !userId) {
    return new Response(
      JSON.stringify({
        error: 'Missing required field (targetUrl, leftSourceUrl, rightSourceUrl, userId)',
      }),
      {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }

  const t0 = Date.now();
  console.log(`[face-swap-dual] Start userId=${userId.slice(0, 8)} target=${targetUrl.slice(-30)}`);

  try {
    const swappedUrl = await dualFaceSwap(
      leftSourceUrl,
      rightSourceUrl,
      targetUrl,
      REPLICATE_TOKEN,
      supabase,
      userId,
      deadlineMs
    );
    const elapsed = Date.now() - t0;
    console.log(`[face-swap-dual] Done in ${elapsed}ms`);
    return new Response(JSON.stringify({ swappedUrl }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const elapsed = Date.now() - t0;
    const message = (err as Error).message ?? 'Unknown error';
    console.error(`[face-swap-dual] Failed in ${elapsed}ms: ${message}`);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
