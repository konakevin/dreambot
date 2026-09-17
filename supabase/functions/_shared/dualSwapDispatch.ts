/**
 * Dispatch helper for the dual face swap — the ONE road to the Fly-hosted `face-swap-dual` engine
 * (services/face-swap-dual: 2 GB, face detection, dynamic split, identity + gender checks).
 *
 * History. The swap first ran in-process (blind 55/55 crop-and-stitch inside the render isolate), then
 * behind `DUAL_SWAP_FANOUT` in its own Supabase isolate, then (2026-06-01) on Fly behind
 * `DUAL_SWAP_FLY_URL` with the Supabase isolate as the config-time fallback. On 2026-09-17
 * (NO_PIXELS_IN_ISOLATE_PLAN.md phase 5) both in-isolate engines were deleted: a 2 s CPU budget
 * cannot decode, crop, encode and stitch a render, and the fallback had been unreachable since the
 * Fly cutover. With no Fly URL the dispatch throws, the caller stamps `dual_swap_error`, and the
 * pipeline degrades to the gender-safe solo rebuild (the frozen chain) — never to in-isolate pixels.
 *
 * Transport is raw `fetch()` with an explicit Bearer (2026-05-09: the SDK's `functions.invoke()` was
 * built for client→function calls and returned opaque "non-2xx" errors server-to-server).
 */

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { ensureHttpsImageUrl } from './faceSwap.ts';

export interface DualDispatchResult {
  /** The swapped image, or null when the render had no clean 2-face split
   *  (caller should re-render the couple). */
  swappedUrl: string | null;
  /** Faces the engine detected (legacy / non-detecting path reports 2). */
  faceCount: number;
  /** Which engine served the swap — 'dynamic' (Fly detection), 'legacy'
   *  (blind 55/55), or 'in-process'/'supabase' transport labels. Persisted
   *  into ai_generation_log so the engine mix is visible to forensics
   *  (Stage 0, 2026-07-08 — success paths used to log NOTHING, which let an
   *  audit misread a healthy engine as dormant). */
  engine: string;
  /** Swap round-trip in ms (transport-inclusive). */
  swapMs: number;
  /** Engine's stated re-render reason when swappedUrl is null (e.g.
   *  no_split:lt2_faces, gender_unconfirmed:male/male). Null on success or
   *  when the engine predates the field. */
  rejectReason: string | null;
  /** ArcFace identity sims of the swapped faces vs their sources (Stage 8
   *  shadow measurement on the Fly engine; null when off/unavailable). */
  identity: { left: number | null; right: number | null; ms: number } | null;
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
  traceId?: string | null,
  // R2: Haiku-confirmed genders of the rendered faces (left/right by x-order),
  // substituting for genderage on this attempt (see dualSwapPipeline).
  genderOverride?: { left: 'male' | 'female'; right: 'male' | 'female' } | null
): Promise<DualDispatchResult> {
  // Convert data: URL targets (from native OpenAI + Gemini providers) to a temp HTTPS upload (on the
  // image-ops service, phase 3b) so the POST body stays small — no ~6-8 MB base64 ride-along — and the
  // engine fetches a URL like any other. Cleanup is best-effort in the finally below.
  const { url: httpsTarget, tempPath: targetTempPath } = await ensureHttpsImageUrl(
    targetImageUrl,
    supabase,
    userId
  );

  try {
    // The dual swap runs ONLY on the Fly-hosted engine. No URL / token = a dual_swap_error for the
    // caller (→ the gender-safe solo rebuild), never an in-isolate engine (deleted 2026-09-17, phase 5).
    const flyUrl = Deno.env.get('DUAL_SWAP_FLY_URL');
    const flyToken = Deno.env.get('DUAL_SWAP_FLY_TOKEN');
    if (!flyUrl || !flyToken) {
      throw new Error(
        'DUAL_SWAP_FLY_URL / DUAL_SWAP_FLY_TOKEN unset — the dual swap has no in-isolate engine (phase 5, 2026-09-17)'
      );
    }
    const endpoint = flyUrl;
    const authToken = flyToken;

    const t0 = Date.now();
    // BOUNDED CALL (2026-09-12): this fetch had no timeout. When the Fly machine hung under two concurrent swaps
    // (health check failed, no "Done" line) the edge request sat until the gateway's 150 s idle cutoff and the
    // dream was LOST — no log row, no upload. The engine already gets `deadlineMs` as its budget; the call now
    // aborts shortly after that budget so a hung engine becomes a dual_swap_error → re-render / gender-safe solo.
    const fetchBudgetMs = Math.max(
      15_000,
      Math.min(120_000, (deadlineMs ?? t0 + 120_000) - t0 + 5_000)
    );
    const res = await fetch(endpoint, {
      method: 'POST',
      signal: AbortSignal.timeout(fetchBudgetMs),
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
        genderOverride: genderOverride ?? null,
      }),
    });

    const elapsedMs = Date.now() - t0;
    const text = await res.text();

    const target = 'face-swap-dual@fly';

    if (!res.ok) {
      throw new Error(
        `${target} returned ${res.status} after ${elapsedMs}ms: ${text.slice(0, 300)}`
      );
    }

    let parsed: {
      swappedUrl?: string | null;
      faceCount?: number;
      status?: string;
      reason?: string | null;
      identity?: { left: number | null; right: number | null; ms: number } | null;
      error?: string;
      variant?: string;
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
    const engine = parsed.variant ? `fly-${parsed.variant}` : 'fly-unversioned';
    console.log(
      `[dispatchDualFaceSwap]${traceId ? `[${traceId}]` : ''} ${target} ${elapsedMs}ms swapped=${!!swappedUrl} faceCount=${faceCount} engine=${engine}`
    );
    return {
      swappedUrl,
      faceCount,
      engine,
      swapMs: elapsedMs,
      rejectReason: swappedUrl ? null : (parsed.reason ?? null),
      identity: parsed.identity ?? null,
    };
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
