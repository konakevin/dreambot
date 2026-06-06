/**
 * Edge Function: face-swap-dual — isolated dual face-swap pipeline.
 *
 * Lives in its own Edge Function invocation so it gets a fresh memory +
 * CPU budget separate from generate-dream / nightly-dreams.
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
  deadlineMs?: number;
  /** Skip the yan-ops primary, swap with fallback models only (dup-retry escape). */
  skipPrimary?: boolean;
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
    return new Response(JSON.stringify({ error: 'missing REPLICATE_API_TOKEN' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Server-to-server only — face-swap-dual is invoked exclusively by the
  // generate-dream + nightly-dreams Edge Functions via dualSwapDispatch
  // (which authenticates with SUPABASE_SERVICE_ROLE_KEY). Reject anything
  // that doesn't carry the service role token. Without this, the userId in
  // the request body is unauthenticated input — any caller could face-swap
  // arbitrary cast photos for any user. Added 2026-06-06 after the
  // Architect audit flagged it CRITICAL.
  const authHeader = req.headers.get('Authorization') ?? '';
  const presentedToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!presentedToken || presentedToken !== serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

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

  const { targetUrl, leftSourceUrl, rightSourceUrl, userId, deadlineMs, skipPrimary } = body;
  if (!targetUrl || !leftSourceUrl || !rightSourceUrl || !userId) {
    return new Response(JSON.stringify({ error: 'Missing required field' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
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
      deadlineMs,
      skipPrimary ?? false
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
