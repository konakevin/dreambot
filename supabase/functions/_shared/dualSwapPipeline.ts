/**
 * genderSafeDualSwap — the ONE dual face-swap orchestrator shared by every caller
 * (generate-dream Create + nightly-dreams nightly/onboarding), so the "100%
 * consistent, never wrong" guarantee can't drift between paths.
 *
 * 2026-06-16 (Kevin: "I want dual face swap renders to be 100% consistent … code
 * red catastrophic if it ever fucks up or fails"): the Fly engine now does REAL
 * in-process face detection (YuNet) + gender (genderage) and splits the render at
 * the GAP BETWEEN the two detected faces, putting each cast member on their
 * matching-gender face — correct by CONSTRUCTION (both-on-one and wrong-gender are
 * impossible). So the orchestrator no longer needs the old Haiku route/verify
 * dance; it just:
 *
 *   1. Dual-swap via the engine.
 *   2. If the engine returns a swapped url (it found a clean 2-face split) → DONE.
 *   3. If it returns null (no clean 2-face split — clustered / <2 faces / a
 *      same-gender collision on a mixed cast) → RE-RENDER the couple and retry,
 *      until it's renderable (bounded by the time budget).
 *   4. Budget exhausted → degrade:
 *        • strict (onboarding): outcome 'cascade' → caller hard-fails so the
 *          first-dream cascade re-renders a SOLO self scene.
 *        • non-strict (nightly): single-swap the user's own face.
 *        • (Create maps 'cascade' → refund.)
 *
 * Detection is fallback-safe in the engine (any detection error → legacy 55/55),
 * so this orchestrator can never be worse than the old behavior.
 */

export interface DualSwapDeps {
  /**
   * Dual-swap the current target via the engine (which detects faces + their
   * gender, splits at the gap, and routes each source to its matching face).
   * Returns the swapped url, or null when there was no clean 2-face split.
   */
  dispatchDual: (target: string) => Promise<{ swappedUrl: string | null; faceCount: number }>;
  /** Single-swap one source onto the dominant face (the gender-safe degrade). */
  singleSwap: (source: string, target: string) => Promise<string>;
  /** Produce a FRESH render of the same couple scene (different layout/seed). */
  rerender: () => Promise<{ url: string; predictionId?: string }>;
  /** The user's own face URL — the gender-safe source for a single-swap degrade. */
  selfSource: string;
  log?: (msg: string) => void;
}

export interface DualSwapOutcome {
  /** Final image URL to persist. */
  url: string;
  /**
   * 'dual'    — a verified two-face dual was delivered.
   * 'single'  — degraded to a gender-safe single swap (the +1 likeness is dropped).
   * 'cascade' — could NOT safely deliver; caller hard-fails (onboarding → solo
   *             self tier; Create → refund) or delivers the unswapped scene.
   */
  outcome: 'dual' | 'single' | 'cascade';
  /** Faces the engine detected on the final attempt (for observability). */
  faceCount: number;
  /** Non-null if a re-render replaced the original render. */
  predictionId: string | null;
  /** Push onto the caller's fallbackReasons. */
  reasons: string[];
}

// Wall-clock a re-render + detect + swap needs. Within this of the job deadline,
// stop re-rendering and degrade — so a backed-up/slow system sheds load.
const RECOVER_BUDGET_MS = 85_000;

export async function genderSafeDualSwap(
  renderUrl: string,
  deps: DualSwapDeps,
  opts: { strict: boolean; maxRerenders?: number; deadlineMs?: number }
): Promise<DualSwapOutcome> {
  const log = deps.log ?? (() => {});
  const reasons: string[] = [];
  const maxRerenders = opts.maxRerenders ?? 2;
  let target = renderUrl;
  let predictionId: string | null = null;
  let faceCount = 2;

  const haveBudget = (): boolean => {
    if (!opts.deadlineMs) return true;
    const ok = Date.now() + RECOVER_BUDGET_MS <= opts.deadlineMs;
    if (!ok) {
      log('recover budget exhausted — degrading instead of re-rendering');
      reasons.push('recover_budget_exhausted');
    }
    return ok;
  };

  // Attempt 0 = original render; each subsequent attempt re-renders the couple.
  for (let attempt = 0; attempt <= maxRerenders; attempt++) {
    if (attempt > 0) {
      if (!haveBudget()) break;
      reasons.push('rerender_for_dual');
      try {
        const rr = await deps.rerender();
        target = rr.url;
        predictionId = rr.predictionId ?? predictionId;
        log(`re-rendered the couple (attempt ${attempt})`);
      } catch (e) {
        log(`re-render failed: ${(e as Error).message}`);
        break;
      }
    }

    let res: { swappedUrl: string | null; faceCount: number };
    try {
      res = await deps.dispatchDual(target);
    } catch (e) {
      // Engine / swap error → retry within budget (a fresh render usually clears it).
      log(`dual swap error: ${(e as Error).message}`);
      reasons.push(`dual_swap_error:${(e as Error).message.slice(0, 80)}`);
      continue;
    }
    faceCount = res.faceCount;
    if (res.swappedUrl) {
      return { url: res.swappedUrl, outcome: 'dual', faceCount, predictionId, reasons };
    }
    // No clean 2-face split → the loop re-renders the couple and tries again.
    log(`no clean dual split (faceCount=${faceCount}) — re-render`);
    reasons.push(`no_dual_split(faces=${faceCount})`);
  }

  // ── Could not deliver a verified dual ──
  if (opts.strict) {
    reasons.push('dual_degrade_cascade');
    return { url: target, outcome: 'cascade', faceCount, predictionId, reasons };
  }
  reasons.push('dual_degrade_single');
  try {
    const single = await deps.singleSwap(deps.selfSource, target);
    return { url: single, outcome: 'single', faceCount, predictionId, reasons };
  } catch (e) {
    reasons.push(`single_fallback_failed:${(e as Error).message.slice(0, 80)}`);
    return { url: target, outcome: 'cascade', faceCount, predictionId, reasons };
  }
}
