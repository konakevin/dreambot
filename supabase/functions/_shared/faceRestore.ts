/**
 * faceRestore — post-swap face restoration (Stage 2, FACE_SWAP_UPGRADE_PLAN.md).
 *
 * Every swap reconstructs identity at inswapper's native 128×128, which reads
 * slightly soft at render resolution. CodeFormer at fidelity 0.9 won the
 * 2026-07-08 bench (Kevin: "the sharper (highest) ones look best") — the most
 * identity-conservative setting, sharpening facial detail without the
 * beautification drift lower fidelities show.
 *
 * Contract:
 *   - FAIL-OPEN. A restore error/timeout ships the unrestored swap and pushes
 *     a `face_restore_failed:*` reason — restoration must never break a dream.
 *   - Gated by engine_config.face_restore_enabled (default FALSE — ships dark;
 *     the flip is a config-row update per the staged rollout contract).
 *   - Only touches the face region by construction (CodeFormer face pipeline;
 *     background_enhance off, upscale 1 → output geometry unchanged).
 */

const CODEFORMER_VERSION = 'cc4956dd26fa5a7185d5660cc9100fab1b8070a1d1654a8bb5eb6d443b020bb2';
const POLL_MS = 1000;
const DEFAULT_BUDGET_MS = 25_000;

export interface RestoreResult {
  /** Restored URL, or the input URL when disabled/failed (fail-open). */
  url: string;
  restored: boolean;
  ms: number;
  /** Reason string for fallbackReasons when something went sideways. */
  reason?: string;
}

export async function restoreFace(
  imageUrl: string,
  opts: {
    replicateToken: string;
    fidelity?: number;
    /** Absolute wall-clock deadline — restore respects the render's budget. */
    deadlineMs?: number;
  }
): Promise<RestoreResult> {
  const t0 = Date.now();
  const budget = Math.min(
    DEFAULT_BUDGET_MS,
    opts.deadlineMs ? Math.max(0, opts.deadlineMs - t0 - 5_000) : DEFAULT_BUDGET_MS
  );
  if (budget < 8_000) {
    // Not enough runway left in the render deadline — skip rather than risk it.
    return { url: imageUrl, restored: false, ms: 0, reason: 'face_restore_skipped:budget' };
  }

  try {
    const create = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${opts.replicateToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: CODEFORMER_VERSION,
        input: {
          image: imageUrl,
          codeformer_fidelity: opts.fidelity ?? 0.9,
          upscale: 1,
          face_upsample: true,
          background_enhance: false,
        },
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const pred = (await create.json()) as { id?: string; error?: string };
    if (!pred.id) {
      return {
        url: imageUrl,
        restored: false,
        ms: Date.now() - t0,
        reason: `face_restore_failed:create:${String(pred.error ?? create.status).slice(0, 60)}`,
      };
    }

    while (Date.now() - t0 < budget) {
      await new Promise((r) => setTimeout(r, POLL_MS));
      const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
        headers: { Authorization: `Bearer ${opts.replicateToken}` },
        signal: AbortSignal.timeout(10_000),
      });
      const p = (await poll.json()) as {
        status?: string;
        output?: string | string[];
        error?: string;
      };
      if (p.status === 'succeeded') {
        const out = Array.isArray(p.output) ? p.output[0] : p.output;
        if (out && typeof out === 'string') {
          return { url: out, restored: true, ms: Date.now() - t0 };
        }
        return {
          url: imageUrl,
          restored: false,
          ms: Date.now() - t0,
          reason: 'face_restore_failed:empty_output',
        };
      }
      if (p.status === 'failed' || p.status === 'canceled') {
        return {
          url: imageUrl,
          restored: false,
          ms: Date.now() - t0,
          reason: `face_restore_failed:${p.status}:${String(p.error ?? '').slice(0, 60)}`,
        };
      }
    }
    return {
      url: imageUrl,
      restored: false,
      ms: Date.now() - t0,
      reason: 'face_restore_failed:timeout',
    };
  } catch (e) {
    return {
      url: imageUrl,
      restored: false,
      ms: Date.now() - t0,
      reason: `face_restore_failed:${(e as Error).message.slice(0, 60)}`,
    };
  }
}
