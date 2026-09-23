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
import { fetchEngineConfig } from './engineConfig.ts';
import { acquireSwapSlot, releaseSwapSlot, type SwapPriority } from './swapCapacityGate.ts';

/** A swap needs about this long once it starts; a slot that frees later than deadline minus this is useless. */
const MIN_SWAP_MS = 25_000;

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
  /** Big-face tier (BIG_FACE_RECLAIM_PLAN.md): the engine swapped on its full-frame per-face path. Null when the
   *  engine predates the field. */
  bigFace: boolean | null;
  /** Taller chosen face as a fraction of frame height, when the engine detected. */
  maxFaceHFrac: number | null;
  /** SWAP CAPACITY GATE (mig 549): how long this swap waited for a Fly slot, and how the gate ran
   *  ('acquired' | 'disabled' | 'gate_error'). */
  gateWaitMs?: number | null;
  gateMode?: string | null;
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
  genderOverride?: { left: 'male' | 'female'; right: 'male' | 'female' } | null,
  // Big-face tier ceiling from engine_config.dual_big_face_max_hfrac (BIG_FACE_RECLAIM_PLAN.md). Null / 0.40 =
  // today's behaviour on the engine; the engine clamps it to 0.40-0.80.
  bigFaceMaxHFrac?: number | null,
  // SWAP CAPACITY GATE (NIGHTLY_ROBUSTNESS_PLAN.md): 'interactive' (Create — a user is watching) may use the
  // reserved slots; 'batch' (nightly, QA) waits behind them.
  priority: SwapPriority = 'batch'
): Promise<DualDispatchResult> {
  // Convert data: URL targets (from native OpenAI + Gemini providers) to a temp HTTPS upload (on the
  // image-ops service, phase 3b) so the POST body stays small — no ~6-8 MB base64 ride-along — and the
  // engine fetches a URL like any other. Cleanup is best-effort in the finally below.
  const { url: httpsTarget, tempPath: targetTempPath } = await ensureHttpsImageUrl(
    targetImageUrl,
    supabase,
    userId
  );

  let leaseId: string | null = null;
  try {
    // SWAP CAPACITY GATE (mig 549): wait for a free Fly slot instead of piling onto the service. 1-2 swaps at
    // once never failed in 21 nights of data; 3-4 at once failed 31% of the time. Fail-open by construction:
    // disabled or a DB error = the swap runs un-gated, exactly as before. Throws SwapCapacityBusyError only
    // when no slot frees up in time (nightly turns that into a later retry, never a solo).
    const gateCfg = await fetchEngineConfig(supabase);
    const gateNow = Date.now();
    const swapDeadline = deadlineMs ?? gateNow + 120_000;
    const lease = await acquireSwapSlot(supabase, {
      priority,
      holder: traceId ?? userId,
      ttlMs: Math.min(150_000, Math.max(30_000, swapDeadline - gateNow + 20_000)),
      waitUntilMs: swapDeadline - MIN_SWAP_MS,
      settings: { enabled: gateCfg.swapGateEnabled, maxWaitMs: gateCfg.swapGateMaxWaitMs },
    });
    leaseId = lease.leaseId;
    const gateWaitMs = lease.waitedMs;
    const gateMode = lease.mode;
    if (gateWaitMs > 0 && lease.mode === 'acquired') {
      console.log(
        `[dispatchDualFaceSwap]${traceId ? `[${traceId}]` : ''} waited ${gateWaitMs}ms for a swap slot (${priority})`
      );
    }

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
        bigFaceMaxHFrac: bigFaceMaxHFrac ?? null,
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
      bigFace?: boolean;
      maxFaceHFrac?: number | null;
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
      bigFace: typeof parsed.bigFace === 'boolean' ? parsed.bigFace : null,
      maxFaceHFrac: typeof parsed.maxFaceHFrac === 'number' ? parsed.maxFaceHFrac : null,
      gateWaitMs,
      gateMode,
    };
  } finally {
    // Give the swap slot back (an unreleased lease expires on its own).
    await releaseSwapSlot(supabase, leaseId);
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
