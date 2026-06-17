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
import { dualFaceSwap } from './faceSwap.ts';

interface RequestBody {
  targetUrl: string;
  leftSourceUrl: string;
  rightSourceUrl: string;
  userId: string;
  deadlineMs?: number;
  /** Skip the yan-ops primary, swap with fallback models only (dup-retry escape). */
  skipPrimary?: boolean;
  /** Each source's gender — lets the engine put each cast member on the
   *  matching-gender detected face (dynamic-split path). */
  leftGender?: 'male' | 'female' | null;
  rightGender?: 'male' | 'female' | null;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PORT is set by Fly.io (8080). Fall back to 8000 for local dev.
const PORT = parseInt(Deno.env.get('PORT') ?? '8000', 10);

Deno.serve({ port: PORT }, async (req) => {
  const url = new URL(req.url);

  // Fly.io health check — no auth, just verifies the container is up
  // and the runtime is responsive. Returning JSON keeps the format
  // consistent with the other endpoints.
  if (url.pathname === '/healthz' || url.pathname === '/health') {
    return new Response(JSON.stringify({ ok: true, ts: Date.now() }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  // Bearer-token auth: must match the shared secret the caller sets.
  // Cheap mTLS-substitute so anonymous traffic on the public Fly URL
  // can't burn Replicate credits. Skip if FLY_AUTH_TOKEN isn't set
  // (local dev / first deploy).
  const expectedToken = Deno.env.get('FLY_AUTH_TOKEN');
  if (expectedToken) {
    const got = req.headers.get('authorization') ?? '';
    if (got !== `Bearer ${expectedToken}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
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

  const {
    targetUrl,
    leftSourceUrl,
    rightSourceUrl,
    userId,
    deadlineMs,
    skipPrimary,
    leftGender,
    rightGender,
  } = body;
  if (!targetUrl || !leftSourceUrl || !rightSourceUrl || !userId) {
    return new Response(JSON.stringify({ error: 'Missing required field' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const t0 = Date.now();
  console.log(`[face-swap-dual] Start userId=${userId.slice(0, 8)} target=${targetUrl.slice(-30)}`);

  // Re-base the swap deadline at request RECEIPT. The caller (generate-dream)
  // passes an ABSOLUTE wall-clock deadline computed BEFORE it dispatched to us.
  // If this machine cold-started (~9s boot at low traffic / on auto-scale-up),
  // that boot elapsed before this handler ran and already ate into the absolute
  // window — squeezing the swap budget until Replicate times out (the
  // 2026-06-15 dual-swap failures). Flooring at now + MIN_SWAP_BUDGET_MS
  // guarantees a cold-booted machine still gets a full swap budget, so a cold
  // start costs LATENCY, not a failed dream — at ANY scale-up depth, not just
  // machine #1. Warm requests keep the caller's larger (later) deadline.
  const MIN_SWAP_BUDGET_MS = 60_000;
  const effectiveDeadlineMs = Math.max(deadlineMs ?? 0, t0 + MIN_SWAP_BUDGET_MS);

  try {
    const { swappedUrl, faceCount } = await dualFaceSwap(
      leftSourceUrl,
      rightSourceUrl,
      targetUrl,
      REPLICATE_TOKEN,
      supabase,
      userId,
      effectiveDeadlineMs,
      skipPrimary ?? false,
      { left: leftGender ?? null, right: rightGender ?? null }
    );
    const elapsed = Date.now() - t0;
    // swappedUrl=null is NOT an error — the render had no clean 2-face split, so
    // the caller should re-render the couple. status distinguishes it from 'ok'.
    console.log(`[face-swap-dual] Done in ${elapsed}ms faceCount=${faceCount} ok=${!!swappedUrl}`);
    return new Response(
      JSON.stringify({ swappedUrl, faceCount, status: swappedUrl ? 'ok' : 'rerender' }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
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
