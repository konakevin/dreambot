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
import { detectFacesWithGender } from './faceDetect.ts';
import { decodeImage } from './imageCodec.ts';
import { embedFace, embedReference, cosine } from './faceEmbed.ts';
import { detectFaces } from './faceDetect.ts';

/**
 * Constant-time string equality — mirrors supabase/functions/_shared/timingSafe.ts
 * (Stage 0 hardening, 2026-07-08). Kept as a local copy: this service deploys
 * from its own Docker context and can't import across the repo boundary.
 */
function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

// Which dual engine this deployment runs — surfaced in /healthz + every swap
// response so the engine mix is observable OUTSIDE Fly's ephemeral log buffer.
// (Stage 0 lesson: the dynamic engine ran silently for 3 weeks while an audit
// concluded from missing DB telemetry that it was dormant.)
const ENGINE_VARIANT = Deno.env.get('DUAL_SWAP_DYNAMIC_SPLIT') === 'true' ? 'dynamic' : 'legacy';

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
    return new Response(
      JSON.stringify({
        ok: true,
        ts: Date.now(),
        variant: ENGINE_VARIANT,
        authRequired: !!Deno.env.get('FLY_AUTH_TOKEN'),
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
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
  // Cheap mTLS-substitute so anonymous traffic on the public Fly URL can't
  // burn Replicate credits. HARDENED (Stage 0, 2026-07-08): the token is now
  // MANDATORY — the old skip-when-unset behavior meant a fresh deploy with a
  // missing secret was silently open to the internet. Local dev opts out
  // EXPLICITLY with ALLOW_UNAUTHENTICATED=true. Comparison is constant-time.
  const expectedToken = Deno.env.get('FLY_AUTH_TOKEN');
  const allowUnauthenticated = Deno.env.get('ALLOW_UNAUTHENTICATED') === 'true';
  if (!expectedToken && !allowUnauthenticated) {
    console.error('[face-swap-dual] FLY_AUTH_TOKEN unset and ALLOW_UNAUTHENTICATED not set');
    return new Response(JSON.stringify({ error: 'Service misconfigured: auth token required' }), {
      status: 503,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
  if (expectedToken) {
    const authHeader = req.headers.get('authorization') ?? '';
    const presented = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!presented || !timingSafeEqual(presented, expectedToken)) {
      // Log enough to distinguish "wrong secret on the caller" from "no token
      // sent" — a silent 401 here cost a debugging session (Stage 3 probe).
      console.warn(
        `[face-swap-dual] 401 path=${url.pathname} presented=${presented ? `len${presented.length}` : 'none'} expected=len${expectedToken.length}`
      );
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
  }

  // ── /detect — YuNet + genderage probe (Stage 3, FACE_SWAP_UPGRADE_PLAN.md).
  // Replaces the solo guard's 2-Haiku-calls-per-probe with a deterministic
  // in-process read: ~200ms, no LLM, exact boxes. Auth already enforced above.
  if (url.pathname === '/detect') {
    try {
      const { imageUrl } = (await req.json()) as { imageUrl?: string };
      if (!imageUrl) {
        return new Response(JSON.stringify({ error: 'imageUrl required' }), {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }
      const t0d = Date.now();
      const resp = await fetch(imageUrl, { signal: AbortSignal.timeout(15_000) });
      if (!resp.ok) throw new Error(`fetch ${resp.status}`);
      const img = await decodeImage(new Uint8Array(await resp.arrayBuffer()));
      const faces = await detectFacesWithGender(img.data, img.width, img.height);
      console.log(
        `[detect] ok faces=${faces.length} genders=${faces.map((f) => f.gender ?? '?').join('/') || '-'} ${Date.now() - t0d}ms`
      );
      return new Response(
        JSON.stringify({
          faces: faces.map((f) => ({
            x: f.x,
            y: f.y,
            w: f.w,
            h: f.h,
            gender: f.gender ?? null,
            score: f.score,
          })),
          width: img.width,
          height: img.height,
          ms: Date.now() - t0d,
        }),
        { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    } catch (err) {
      console.error(`[detect] error: ${(err as Error).message}`);
      return new Response(JSON.stringify({ error: (err as Error).message }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
  }

  // ── /verify — ArcFace identity read (Stage 8). Detects faces in imageUrl
  // (x-ordered), embeds each, and cosine-compares against each reference
  // photo's largest face. Powers the calibration bench + the solo path.
  if (url.pathname === '/verify') {
    try {
      const { imageUrl, refs } = (await req.json()) as { imageUrl?: string; refs?: string[] };
      if (!imageUrl || !Array.isArray(refs) || refs.length === 0) {
        return new Response(JSON.stringify({ error: 'imageUrl + refs[] required' }), {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }
      const t0v = Date.now();
      const resp = await fetch(imageUrl, { signal: AbortSignal.timeout(15_000) });
      if (!resp.ok) throw new Error(`fetch ${resp.status}`);
      const img = await decodeImage(new Uint8Array(await resp.arrayBuffer()));
      const faces = (await detectFaces(img.data, img.width, img.height))
        .slice(0, 4)
        .sort((a, b) => a.x - b.x);
      const refEmbeds = await Promise.all(refs.slice(0, 4).map((r) => embedReference(r)));
      const out = [];
      for (const f of faces) {
        const e = await embedFace(img.data, img.width, img.height, f);
        out.push({
          x: f.x,
          y: f.y,
          w: f.w,
          h: f.h,
          sims: refEmbeds.map((re) => (e && re ? Math.round(cosine(e, re) * 1000) / 1000 : null)),
        });
      }
      console.log(
        `[verify] faces=${out.length} sims=${JSON.stringify(out.map((o) => o.sims))} ${Date.now() - t0v}ms`
      );
      return new Response(JSON.stringify({ faces: out, ms: Date.now() - t0v }), {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error(`[verify] error: ${(err as Error).message}`);
      return new Response(JSON.stringify({ error: (err as Error).message }), {
        status: 500,
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
    const { swappedUrl, faceCount, reason, identity } = await dualFaceSwap(
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
      JSON.stringify({
        swappedUrl,
        faceCount,
        status: swappedUrl ? 'ok' : 'rerender',
        // Why the engine asked for a re-render (null on success) — lets the
        // dispatcher + benches split "no second face" from "gender misread".
        reason: reason ?? null,
        // ArcFace identity read (Stage 8, shadow) — null when measurement is
        // off or failed; {left,right,ms} cosine sims when on.
        identity: identity ?? null,
        // Engine variant + timing ride every response so the DISPATCHER can
        // persist them into ai_generation_log (Stage 0 telemetry) — Fly's own
        // log buffer is ephemeral and invisible to forensics.
        variant: ENGINE_VARIANT,
        elapsedMs: elapsed,
      }),
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
