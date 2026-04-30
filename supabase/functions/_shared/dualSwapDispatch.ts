/**
 * Dispatch helper for dual face swap — routes to either the in-process
 * `dualFaceSwap()` (current behavior) or the standalone `face-swap-dual`
 * Edge Function (Phase 2 split) based on the `DUAL_SWAP_FANOUT` env flag.
 *
 * Default: in-process. Setting `DUAL_SWAP_FANOUT=true` flips both
 * `generate-dream` and `nightly-dreams` to the fanout path. Per-function
 * granularity isn't needed yet — if we want it later, branch on
 * `DUAL_SWAP_FANOUT_LIVE` / `DUAL_SWAP_FANOUT_NIGHTLY` env vars.
 *
 * The fanout path uses `supabase.functions.invoke()` to hit the new
 * function. Each invocation gets its own 150 MB memory + ~2 s CPU
 * budget, isolating the pixel-heavy work from the orchestrator's
 * Sonnet/Flux/logging memory footprint.
 *
 * Same signature as `dualFaceSwap` so callers can swap in this helper
 * without other changes.
 */

import { dualFaceSwap } from './faceSwap.ts';

export async function dispatchDualFaceSwap(
  leftSourceUrl: string,
  rightSourceUrl: string,
  targetImageUrl: string,
  replicateToken: string,
  // deno-lint-ignore no-explicit-any
  supabase: any,
  userId: string,
  deadlineMs?: number
): Promise<string> {
  const useFanout = Deno.env.get('DUAL_SWAP_FANOUT') === 'true';

  if (!useFanout) {
    return dualFaceSwap(
      leftSourceUrl,
      rightSourceUrl,
      targetImageUrl,
      replicateToken,
      supabase,
      userId,
      deadlineMs
    );
  }

  console.log('[dispatchDualFaceSwap] Using fanout → face-swap-dual');
  const { data, error } = await supabase.functions.invoke('face-swap-dual', {
    body: {
      targetUrl: targetImageUrl,
      leftSourceUrl,
      rightSourceUrl,
      userId,
      deadlineMs,
    },
  });

  if (error) {
    throw new Error(`face-swap-dual invoke failed: ${error.message ?? String(error)}`);
  }
  if (!data?.swappedUrl) {
    const errMsg = data?.error ?? 'face-swap-dual returned no swappedUrl';
    throw new Error(`face-swap-dual: ${errMsg}`);
  }
  return data.swappedUrl;
}
