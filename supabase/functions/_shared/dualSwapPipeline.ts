/**
 * genderSafeDualSwap — the ONE hardened dual face-swap orchestrator shared by
 * every caller (generate-dream Create + nightly-dreams nightly/onboarding), so
 * the "never wrong, never silently bad" guarantee can't drift between paths.
 *
 * Kevin 2026-06-16: "it is a code red catastrophic failure if the face swap ever
 * fucks up or fails." This wraps EVERY belt-and-suspenders layer:
 *
 *   1. ROUTE by confirmed gender (routeDualSwapByGender) — never positional.
 *   2. If unconfirmed → RE-RENDER once for a cleaner layout, then re-route.
 *   3. DUAL SWAP with retries (cold-model backoff).
 *   4. VERIFY THE OUTPUT (verifyDualSwapOutput) — re-read the swapped image and
 *      confirm the genders actually landed as two distinct faces. Catches the
 *      engine's "both faces on one person" / canned-output / wrong-gender bugs
 *      at the FINAL result.
 *   5. If verify fails OR all swap attempts fail → RE-RENDER once + re-route +
 *      re-swap + re-verify.
 *   6. Still no verified dual → GENDER-SAFE DEGRADE:
 *        • strict (onboarding): outcome 'cascade' → caller hard-fails so the
 *          first-dream cascade re-renders a SOLO self scene (one gender-locked
 *          person → impossible to mis-gender).
 *        • non-strict: single-swap the gender-confirmed source. If even that
 *          fails → outcome 'cascade' (caller throws / delivers unswapped).
 *
 * The orchestrator NEVER returns a dual it couldn't verify. A wrong-gender or
 * both-faces-on-one paste cannot survive to the user.
 */

import {
  routeDualSwapByGender,
  verifyDualSwapOutput,
  type DualSwapSource,
} from './dualGenderRouting.ts';

export interface DualSwapDeps {
  replicateToken: string;
  /** Swap leftSource onto the left body + rightSource onto the right. */
  dispatchDual: (leftSource: string, rightSource: string, target: string) => Promise<string>;
  /** Single-swap one source onto the dominant face (gender-safe degrade). */
  singleSwap: (source: string, target: string) => Promise<string>;
  /** Produce a FRESH render of the same scene (different layout/seed). */
  rerender: () => Promise<{ url: string; predictionId?: string }>;
  log?: (msg: string) => void;
}

export interface DualSwapOutcome {
  /** Final image URL to persist. */
  url: string;
  /**
   * 'dual'    — verified dual swap delivered.
   * 'single'  — gender-safe single swap delivered (the +1 likeness is dropped).
   * 'cascade' — could NOT safely deliver; caller must hard-fail / cascade /
   *             deliver the unswapped scene. `url` is the last (unswapped) render.
   */
  outcome: 'dual' | 'single' | 'cascade';
  routing: string;
  verified: boolean | null;
  /** Non-null if a re-render replaced the original render (update the log/pred). */
  predictionId: string | null;
  /** Push these onto the caller's fallbackReasons. */
  reasons: string[];
}

// Rough wall-clock a re-render + swap + verify needs. If less than this remains
// before the job deadline, the orchestrator skips the optional recovery and
// degrades fast — so a backed-up/slow system sheds load instead of stacking
// re-renders past its isolate budget. Scale-safety lever.
const RECOVER_BUDGET_MS = 70_000;

export async function genderSafeDualSwap(
  a: DualSwapSource,
  b: DualSwapSource,
  renderUrl: string,
  deps: DualSwapDeps,
  opts: {
    strict: boolean;
    maxSwapRetries?: number;
    backoffMs?: number[];
    /** Absolute ms timestamp (Date.now()-based) the whole job must finish by. */
    deadlineMs?: number;
  }
): Promise<DualSwapOutcome> {
  const { replicateToken, dispatchDual, singleSwap, rerender } = deps;
  const log = deps.log ?? (() => {});
  const reasons: string[] = [];
  const maxRetries = opts.maxSwapRetries ?? 3;
  const backoff = opts.backoffMs ?? [2_000, 4_000];

  let target = renderUrl;
  let predictionId: string | null = null;

  // Enough time left to attempt another re-render+swap+verify before deadline?
  const haveRecoverBudget = (): boolean => {
    if (!opts.deadlineMs) return true;
    const ok = Date.now() + RECOVER_BUDGET_MS <= opts.deadlineMs;
    if (!ok) {
      log('recover budget exhausted — degrading instead of re-rendering');
      reasons.push('recover_budget_exhausted');
    }
    return ok;
  };

  const doRerender = async (reason: string): Promise<boolean> => {
    if (!haveRecoverBudget()) return false;
    reasons.push(reason);
    try {
      const rr = await rerender();
      target = rr.url;
      predictionId = rr.predictionId ?? predictionId;
      return true;
    } catch (e) {
      log(`re-render failed: ${(e as Error).message}`);
      return false;
    }
  };

  // Swap with cold-model retries. Returns the swapped url, or null if every
  // attempt failed.
  const trySwap = async (left: string, right: string): Promise<string | null> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 1) await new Promise((r) => setTimeout(r, backoff[attempt - 2] ?? 4_000));
        return await dispatchDual(left, right, target);
      } catch (err) {
        log(`dual swap attempt ${attempt}/${maxRetries} failed: ${(err as Error).message}`);
        if (attempt === maxRetries)
          reasons.push(`dual_swap_failed_${attempt}x:${(err as Error).message}`);
      }
    }
    return null;
  };

  // One full attempt at a VERIFIED dual on the current `target`. Returns the
  // verified swapped url, or null (swap failed or output failed verification).
  const swapAndVerify = async (
    left: string,
    right: string
  ): Promise<{ url: string; verified: boolean } | null> => {
    const swapped = await trySwap(left, right);
    if (!swapped) return null;
    const verified = await verifyDualSwapOutput(swapped, a, b, replicateToken);
    log(`post-swap verify: ${verified}`);
    if (!verified) {
      reasons.push('dual_swap_verify_failed');
      return null;
    }
    return { url: swapped, verified };
  };

  // 1) Route on the original render.
  let decision = await routeDualSwapByGender(a, b, target, replicateToken);
  log(`routing: ${decision.routing} (mode=${decision.mode})`);

  // 2) Unconfirmed → re-render once + re-route (a fresh layout usually reads clean).
  if (decision.mode === 'single') {
    if (await doRerender(`dual_unconfirmed_rerender:${decision.routing}`)) {
      decision = await routeDualSwapByGender(a, b, target, replicateToken);
      log(`post-rerender routing: ${decision.routing} (mode=${decision.mode})`);
    }
  }

  // 3) Confirmed dual → swap + verify.
  if (decision.mode === 'dual') {
    const first = await swapAndVerify(decision.leftSource, decision.rightSource);
    if (first) {
      return {
        url: first.url,
        outcome: 'dual',
        routing: decision.routing,
        verified: true,
        predictionId,
        reasons,
      };
    }
    // 4) Swap failed or output unverified → ONE fresh render + re-route + re-swap + re-verify.
    if (await doRerender('dual_swap_recover_rerender')) {
      const rd = await routeDualSwapByGender(a, b, target, replicateToken);
      log(`recover routing: ${rd.routing} (mode=${rd.mode})`);
      decision = rd;
      if (rd.mode === 'dual') {
        const second = await swapAndVerify(rd.leftSource, rd.rightSource);
        if (second) {
          return {
            url: second.url,
            outcome: 'dual',
            routing: rd.routing,
            verified: true,
            predictionId,
            reasons,
          };
        }
      }
    }
    // fall through to degrade with the latest `decision`
  }

  // 5) DEGRADE — no verified dual was possible.
  if (opts.strict) {
    // Onboarding: hard-fail so the cascade re-renders a SOLO self scene.
    reasons.push(`dual_degrade_cascade:${decision.routing}`);
    return {
      url: target,
      outcome: 'cascade',
      routing: decision.routing,
      verified: false,
      predictionId,
      reasons,
    };
  }
  // Non-strict: gender-safe single swap.
  reasons.push(`dual_degrade_single:${decision.routing}`);
  try {
    const single = await singleSwap(decision.singleSource, target);
    return {
      url: single,
      outcome: 'single',
      routing: decision.routing,
      verified: null,
      predictionId,
      reasons,
    };
  } catch (e) {
    reasons.push(`single_fallback_failed:${(e as Error).message}`);
    return {
      url: target,
      outcome: 'cascade',
      routing: decision.routing,
      verified: false,
      predictionId,
      reasons,
    };
  }
}
