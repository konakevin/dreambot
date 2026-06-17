/**
 * Dispatch helper for dual face swap — routes to either the in-process
 * `dualFaceSwap()` or the standalone `face-swap-dual` Edge Function based
 * on the `DUAL_SWAP_FANOUT` env flag.
 *
 * Default: in-process. Setting `DUAL_SWAP_FANOUT=true` routes the pixel-
 * heavy decode/crop/encode/stitch work into its own Edge Function isolate,
 * isolating it from the orchestrator's Sonnet/Flux/logging memory footprint.
 *
 * 2026-05-09: switched fanout transport from `supabase.functions.invoke()`
 * to raw `fetch()`. The SDK invoke pattern is designed for client-to-Edge-
 * Function calls where the user's auth context propagates automatically.
 * For Edge-Function-to-Edge-Function (server-to-server) we already have
 * explicit service-role context — the SDK's auth abstraction adds opacity
 * without value, and was returning "non-2xx" for reasons we never fully
 * isolated. Raw fetch with an explicit `Authorization: Bearer` header is
 * the same transport our external smoke tests verified, and makes the
 * auth flow transparent + debuggable.
 */

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { dualFaceSwap, ensureHttpsImageUrl } from './faceSwap.ts';

export interface DualDispatchResult {
  /** The swapped image, or null when the render had no clean 2-face split
   *  (caller should re-render the couple). */
  swappedUrl: string | null;
  /** Faces the engine detected (legacy / non-detecting path reports 2). */
  faceCount: number;
}

export async function dispatchDualFaceSwap(
  leftSourceUrl: string,
  rightSourceUrl: string,
  targetImageUrl: string,
  replicateToken: string,
  supabase: SupabaseClient,
  userId: string,
  deadlineMs?: number,
  // skipPrimary → swap both halves with the fallback models only (cdingram →
  // pikachupichu25), skipping yan-ops. Used by the dup-detect retry to escape
  // yan-ops's canned-output bug.
  skipPrimary = false,
  // Each source's gender — lets the Fly engine put each cast member on the
  // matching-gender DETECTED face (the dynamic-split path).
  genders?: { left?: 'male' | 'female' | null; right?: 'male' | 'female' | null },
  // dream_queue.id — forwarded so the Fly/edge swap logs prefix the same id,
  // letting one grep follow a render across Supabase + Fly logs.
  traceId?: string | null
): Promise<DualDispatchResult> {
  const useFanout = Deno.env.get('DUAL_SWAP_FANOUT') === 'true';

  // Convert data: URL targets (from native OpenAI + Gemini providers) to a
  // temp HTTPS upload BEFORE either path so:
  //   1) the fanout POST body stays small (no ~6-8 MB base64 ride-along)
  //   2) the in-process dualFaceSwap doesn't have to handle data: in its
  //      fetch + decode + re-upload path (it works either way, but explicit
  //      conversion here matches the single faceSwap() boundary)
  // Cleanup is best-effort in the finally below.
  const { url: httpsTarget, tempPath: targetTempPath } = await ensureHttpsImageUrl(
    targetImageUrl,
    supabase,
    userId
  );

  try {
    if (!useFanout) {
      // In-process path uses the legacy in-Supabase engine (no detection — Edge's
      // 256 MB cap can't host onnxruntime). Returns a URL; normalize to the result
      // shape with faceCount=2 (it always crops 55/55).
      const url = await dualFaceSwap(
        leftSourceUrl,
        rightSourceUrl,
        httpsTarget,
        replicateToken,
        supabase,
        userId,
        deadlineMs,
        skipPrimary
      );
      return { swappedUrl: url, faceCount: 2 };
    }

    // 2026-06-01: when DUAL_SWAP_FLY_URL is set, route to the Fly.io
    // hosted face-swap-dual (2 GB RAM, escapes the 256 MB Supabase Edge
    // Function cap that was triggering HTTP 546 WORKER_RESOURCE_LIMIT on
    // large-output models — Ultra / gpt-image-2). When unset, falls back
    // to the in-Supabase face-swap-dual function. See services/face-swap-
    // dual/README.md + CLAUDE.md Scaling Initiative.
    const flyUrl = Deno.env.get('DUAL_SWAP_FLY_URL');
    const flyToken = Deno.env.get('DUAL_SWAP_FLY_TOKEN');
    const useFly = Boolean(flyUrl);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const endpoint = useFly ? flyUrl! : `${supabaseUrl}/functions/v1/face-swap-dual`;
    const authToken = useFly && flyToken ? flyToken : serviceRoleKey;

    const t0 = Date.now();
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        targetUrl: httpsTarget,
        leftSourceUrl,
        rightSourceUrl,
        userId,
        deadlineMs,
        skipPrimary,
        leftGender: genders?.left ?? null,
        rightGender: genders?.right ?? null,
        traceId: traceId ?? null,
      }),
    });

    const elapsedMs = Date.now() - t0;
    const text = await res.text();

    const target = useFly ? 'face-swap-dual@fly' : 'face-swap-dual@supabase';

    if (!res.ok) {
      throw new Error(
        `${target} returned ${res.status} after ${elapsedMs}ms: ${text.slice(0, 300)}`
      );
    }

    let parsed: {
      swappedUrl?: string | null;
      faceCount?: number;
      status?: string;
      error?: string;
    };
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(
        `${target} returned invalid JSON (${res.status} after ${elapsedMs}ms): ${text.slice(0, 200)}`
      );
    }

    // A true error throws. But a NULL swappedUrl with status 'rerender' is NOT an
    // error — the engine found no clean 2-face split and wants the caller to
    // re-render the couple. (Old engines omit faceCount/status: a present
    // swappedUrl ⇒ faceCount 2; absent + an `error` ⇒ throw.)
    if (parsed.error) {
      throw new Error(`${target}: ${parsed.error} (${elapsedMs}ms)`);
    }
    const swappedUrl = parsed.swappedUrl ?? null;
    if (!swappedUrl && parsed.status !== 'rerender' && parsed.faceCount === undefined) {
      // Legacy engine returned no url and no rerender signal → treat as failure.
      throw new Error(`${target}: no swappedUrl in response (${elapsedMs}ms)`);
    }
    const faceCount = parsed.faceCount ?? (swappedUrl ? 2 : 0);
    console.log(
      `[dispatchDualFaceSwap]${traceId ? `[${traceId}]` : ''} ${target} ${elapsedMs}ms swapped=${!!swappedUrl} faceCount=${faceCount}`
    );
    return { swappedUrl, faceCount };
  } finally {
    // Clean up the temp data-URL conversion if we made one. Fire-and-forget.
    if (targetTempPath) {
      supabase.storage
        .from('uploads')
        .remove([targetTempPath])
        .catch((e) =>
          console.warn('[dispatchDualFaceSwap] temp target cleanup failed:', (e as Error).message)
        );
    }
  }
}
