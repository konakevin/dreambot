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
  skipPrimary = false
): Promise<string> {
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
      return await dualFaceSwap(
        leftSourceUrl,
        rightSourceUrl,
        httpsTarget,
        replicateToken,
        supabase,
        userId,
        deadlineMs,
        skipPrimary
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const t0 = Date.now();
    const res = await fetch(`${supabaseUrl}/functions/v1/face-swap-dual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({
        targetUrl: httpsTarget,
        leftSourceUrl,
        rightSourceUrl,
        userId,
        deadlineMs,
        skipPrimary,
      }),
    });

    const elapsedMs = Date.now() - t0;
    const text = await res.text();

    if (!res.ok) {
      throw new Error(
        `face-swap-dual returned ${res.status} after ${elapsedMs}ms: ${text.slice(0, 300)}`
      );
    }

    let parsed: { swappedUrl?: string; error?: string };
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(
        `face-swap-dual returned invalid JSON (${res.status} after ${elapsedMs}ms): ${text.slice(0, 200)}`
      );
    }

    if (!parsed.swappedUrl) {
      throw new Error(
        `face-swap-dual: ${parsed.error ?? 'no swappedUrl in response'} (${elapsedMs}ms)`
      );
    }

    console.log(`[dispatchDualFaceSwap] face-swap-dual succeeded in ${elapsedMs}ms`);
    return parsed.swappedUrl;
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
