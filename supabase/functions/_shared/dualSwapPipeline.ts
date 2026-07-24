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
  dispatchDual: (
    target: string,
    genderOverride?: { left: 'male' | 'female'; right: 'male' | 'female' } | null
  ) => Promise<{
    swappedUrl: string | null;
    faceCount: number;
    engine?: string;
    swapMs?: number;
    rejectReason?: string | null;
    identity?: { left: number | null; right: number | null; ms: number } | null;
  }>;
  /** Single-swap one source onto the dominant face (the gender-safe degrade). */
  singleSwap: (source: string, target: string) => Promise<string>;
  /** Produce a FRESH render of the same couple scene (different layout/seed).
   *  Stage 5a (2026-07-08): receives the attempt number so callers can MUTATE
   *  the prompt on the final retry (prepend face-separation framing) instead
   *  of re-rolling the identical prompt and hoping for a luckier layout. */
  rerender: (attempt: number) => Promise<{ url: string; predictionId?: string }>;
  /** The user's own face URL — the gender-safe source for a single-swap degrade. */
  selfSource: string;
  /** R2 (2026-07-09): one Haiku vision read of the RENDERED faces' genders,
   *  consulted only after a gender_unconfirmed reject — genderage misreads
   *  athletes/wet hair/mid-spin where Haiku reads fine (5/11 depth-QA rejects).
   *  Returning distinct left/right genders re-dispatches the SAME target with
   *  the override; anything else falls through to the re-render ladder. */
  confirmGenders?: (target: string) => Promise<{
    left: 'male' | 'female' | null;
    right: 'male' | 'female' | null;
  } | null>;
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

// Below this per-face ArcFace similarity, a "best" sub-threshold dual is not a
// WEAK likeness — it's the WRONG person (sim near/below 0 = uncorrelated, i.e. a
// stranger's face). Shipping it is the "wife's face is someone else" failure, so
// a best this bad degrades to a self-only swap instead of shipping (Kevin
// 2026-07-24: chose self-only over shipping-broken). A best in [floor, threshold)
// still ships — a weak-but-present dual beats dropping the +1. Well below the
// 0.35 enforcement threshold so genuinely-weak likenesses aren't over-degraded.
const IDENTITY_DEGRADE_FLOOR = 0.15;

/**
 * Stage 8c (2026-07-09): identity enforcement threshold. When the secret is a
 * number, a delivered dual whose min per-face ArcFace sim is below it is
 * treated as a reject (→ the re-render ladder tries for a better take). Unset
 * → shadow (measure + log only). Owner-calibrated at 0.35 across all 9 live
 * face-swap mediums on production prompts (identity-calibration + identity-
 * stylized benches). typeof guard: this module also runs under jest.
 */
function identityThreshold(): number | null {
  if (typeof Deno === 'undefined') return null;
  const raw = Deno.env.get('IDENTITY_MIN_SIM');
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 && n < 1 ? n : null;
}

/** Min per-face sim; a MISSING side scores 0 (the skiing-4 rule: a face the
 *  verifier measured-and-found-absent is a failed face). BOTH sides null =
 *  the measurement itself didn't happen → null (fail-open). */
function minIdentity(id: { left: number | null; right: number | null }): number | null {
  if (id.left === null && id.right === null) return null;
  return Math.min(id.left ?? 0, id.right ?? 0);
}

export async function genderSafeDualSwap(
  renderUrl: string,
  deps: DualSwapDeps,
  opts: {
    strict: boolean;
    maxRerenders?: number;
    deadlineMs?: number;
    /**
     * Strict callers that would rather DEGRADE to a self-only swap than hard-fail
     * when a verified dual can't be delivered. Create sets this (Kevin 2026-07-24:
     * self-only beats a refund / a wrong-face dual). Onboarding leaves it off so
     * its cascade still re-renders a solo self scene.
     */
    degradeToSingle?: boolean;
  }
): Promise<DualSwapOutcome> {
  const log = deps.log ?? (() => {});
  const reasons: string[] = [];
  const maxRerenders = opts.maxRerenders ?? 2;
  let target = renderUrl;
  let predictionId: string | null = null;
  let faceCount = 2;
  // Best sub-threshold dual seen (Stage 8c) — shipped at exhaustion in
  // preference to any degrade path.
  let best: { url: string; faceCount: number; minSim: number; attempt: number } | null = null;

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
        const rr = await deps.rerender(attempt);
        target = rr.url;
        predictionId = rr.predictionId ?? predictionId;
        log(`re-rendered the couple (attempt ${attempt})`);
      } catch (e) {
        log(`re-render failed: ${(e as Error).message}`);
        break;
      }
    }

    let res: {
      swappedUrl: string | null;
      faceCount: number;
      engine?: string;
      swapMs?: number;
      rejectReason?: string | null;
      identity?: { left: number | null; right: number | null; ms: number } | null;
    };
    try {
      res = await deps.dispatchDual(target);
      // R2: a gender_unconfirmed reject means genderage couldn't read one-of-each
      // on the rendered faces. Before burning a re-render, ask Haiku to read the
      // SAME render once; a confirmed one-of-each re-dispatches with the override
      // (costs ~$0.002 + one swap, saves a 30-60s re-render). Any other read —
      // null, same-gender, unreadable — falls through to the ladder as before.
      if (
        !res.swappedUrl &&
        res.rejectReason?.startsWith('gender_unconfirmed') &&
        deps.confirmGenders
      ) {
        try {
          const read = await deps.confirmGenders(target);
          if (read && read.left && read.right && read.left !== read.right) {
            reasons.push(`gender_confirm_haiku:${read.left}/${read.right}`);
            log(`haiku confirmed genders ${read.left}/${read.right} — re-dispatch with override`);
            res = await deps.dispatchDual(target, { left: read.left, right: read.right });
          } else {
            reasons.push('gender_confirm_haiku_unresolved');
          }
        } catch (e) {
          reasons.push('gender_confirm_haiku_error');
          log(`gender confirm failed: ${(e as Error).message}`);
        }
      }
    } catch (e) {
      // Engine / swap error → retry within budget (a fresh render usually clears it).
      log(`dual swap error: ${(e as Error).message}`);
      reasons.push(`dual_swap_error:${(e as Error).message.slice(0, 80)}`);
      continue;
    }
    faceCount = res.faceCount;
    if (res.swappedUrl) {
      // SUCCESS-path telemetry (Stage 0, 2026-07-08): the engine mix +
      // attempt count must be visible in ai_generation_log — success used to
      // log nothing, which let an audit misread the live dynamic engine as
      // dormant. These reasons ride the caller's fallbackReasons into the log.
      reasons.push(`dual_engine:${res.engine ?? 'unknown'}`);
      // Stage 8 shadow: identity sims of the delivered swap (calibration data
      // accrues in production forensics before any enforcement flips).
      if (res.identity)
        reasons.push(`identity_sim:L${res.identity.left ?? '?'}/R${res.identity.right ?? '?'}`);

      // Stage 8c enforcement: a measured dual below the identity threshold is
      // a QUALITY reject — try the ladder for a better take. We KEEP the best
      // sub-threshold dual and ship it at exhaustion: a weak dual still beats
      // a degrade (never worse than pre-enforcement behavior). Fail-open when
      // the measurement itself is absent (infra error / shadow off).
      const thr = identityThreshold();
      const min = res.identity ? minIdentity(res.identity) : null;
      if (thr !== null && min !== null && min < thr) {
        reasons.push(`identity_below_threshold:${min}<${thr}`);
        log(`identity below threshold (min=${min} < ${thr}) — re-render`);
        if (!best || min > best.minSim) {
          best = {
            url: res.swappedUrl,
            faceCount,
            minSim: min,
            attempt: attempt + 1,
          };
        }
        continue;
      }

      reasons.push(`dual_attempts:${attempt + 1}`);
      if (typeof res.swapMs === 'number') reasons.push(`dual_swap_ms:${res.swapMs}`);
      return { url: res.swappedUrl, outcome: 'dual', faceCount, predictionId, reasons };
    }
    // No clean 2-face split → the loop re-renders the couple and tries again.
    log(`no clean dual split (faceCount=${faceCount}) — re-render`);
    reasons.push(`no_dual_split(faces=${faceCount})`);
    // Engine-stated cause (no_split:* vs gender_unconfirmed:*) — the two need
    // different fixes (pose wording vs gender-read fallback), so forensics
    // must be able to tell them apart (2026-07-08 action bench lesson).
    if (res.rejectReason) reasons.push(`dual_reject:${res.rejectReason}`);
  }

  // ── Could not deliver an above-threshold dual ──
  // Stage 8c: a WEAK sub-threshold dual (floor ≤ min < threshold) in hand still
  // beats every degrade — both faces are PRESENT and gender-routed; that miss is
  // a likeness-quality miss, not a safety failure.
  if (best && best.minSim >= IDENTITY_DEGRADE_FLOOR) {
    reasons.push(`identity_shipped_best:${best.minSim}(attempt ${best.attempt})`);
    log(`identity enforcement exhausted — shipping best dual (min=${best.minSim})`);
    return { url: best.url, outcome: 'dual', faceCount: best.faceCount, predictionId, reasons };
  }
  // A CATASTROPHIC best (min < floor) is the WRONG person on one side, not a weak
  // likeness — do NOT ship it. Fall through to the self-only degrade (Kevin
  // 2026-07-24: the "wife's face is a stranger" render should degrade, not ship).
  if (best) reasons.push(`identity_degrade_floor:${best.minSim}<${IDENTITY_DEGRADE_FLOOR}`);

  // Degrade to a gender-safe self-only swap (self placed, +1 dropped to a generic
  // figure) instead of shipping a wrong face. Non-strict callers (nightly) always
  // do this; strict callers do it only when they opted in (Create). Strict callers
  // that did NOT opt in (onboarding) keep cascading so the first-dream flow can
  // re-render a solo self scene.
  const canDegradeSingle = !opts.strict || opts.degradeToSingle === true;
  if (canDegradeSingle) {
    reasons.push('dual_degrade_single');
    try {
      const single = await deps.singleSwap(deps.selfSource, target);
      return { url: single, outcome: 'single', faceCount, predictionId, reasons };
    } catch (e) {
      reasons.push(`single_fallback_failed:${(e as Error).message.slice(0, 80)}`);
      // fall through to cascade
    }
  }
  reasons.push('dual_degrade_cascade');
  return { url: target, outcome: 'cascade', faceCount, predictionId, reasons };
}
