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
 * impossible). So the orchestrator dropped the old Haiku route/verify dance and
 * just leans on the engine — EXCEPT for one proactive guard: the engine's
 * in-process genderage misreads painterly/oil-on-canvas faces, so #2 (2026-08-05,
 * sunnysteph) reads the rendered genders with Haiku FIRST and hands the engine a
 * genderOverride when it's a confident one-of-each. Flow:
 *
 *   0. (Optional) Haiku pre-reads the two faces' genders → genderOverride.
 *   1. Dual-swap via the engine (routed by the override when present).
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
    /** Big-face tier (BIG_FACE_RECLAIM_PLAN.md): swapped on the engine's full-frame per-face path. */
    bigFace?: boolean | null;
    maxFaceHFrac?: number | null;
  }>;
  /**
   * Place SELF onto the render as a GENDER-SAFE single swap (the degrade path).
   * MUST be gender-safe: return the swapped url only when self lands on a
   * same-gender face; return `null` when self can't be placed safely (e.g. a
   * couple render whose only readable face is the wrong gender), so the pipeline
   * CASCADES rather than pasting self on the wrong body. Wire this through the
   * solo swap guard (ensureSoloSwapTarget). 2026-08-05: closes the raw
   * face-blind single-swap hole that put sunnysteph's face on the man.
   */
  singleSwap: (
    source: string,
    target: string
  ) => Promise<{ url: string; predictionId?: string | null } | null>;
  /** Produce a FRESH render of the same couple scene (different layout/seed).
   *  Stage 5a (2026-07-08): receives the attempt number so callers can MUTATE
   *  the prompt on the final retry (prepend face-separation framing) instead
   *  of re-rolling the identical prompt and hoping for a luckier layout. */
  rerender: (attempt: number) => Promise<{ url: string; predictionId?: string }>;
  /** The user's own face URL — the gender-safe source for a single-swap degrade. */
  selfSource: string;
  /** #2 (2026-08-05, sunnysteph): one Haiku vision read of the RENDERED faces'
   *  genders, consulted PROACTIVELY before every dispatch — the engine's
   *  in-process genderage misreads painterly/oil-on-canvas faces where Haiku
   *  reads reliably. A CONFIDENT one-of-each read becomes the genderOverride so
   *  each source lands on its matching-gender face; ambiguous/errored → no
   *  override (the engine uses its own genderage, unchanged). Read once per
   *  attempt (re-reads a fresh re-render). Optional: a caller that omits it keeps
   *  the exact single-arg dispatch. */
  confirmGenders?: (target: string) => Promise<{
    left: 'male' | 'female' | null;
    right: 'male' | 'female' | null;
    /** How many faces the reader counted. A read that did not count EXACTLY two is never an override:
     *  with a third figure in frame (a mural, a statue, a background passer-by) "the person on the LEFT" is
     *  not one of the two faces the engine will swap — Kevin's aquarelle couple crossed exactly this way
     *  (2026-09-12: Haiku read "3 | woman | man", the leftmost "woman" being a painted mural). */
    faceCount?: number | null;
  } | null>;
  /** SECOND SIGNAL (2026-09-12, _shared/wardrobeSides.ts): an INDEPENDENT read of the sides' genders derived from
   *  which side wears the LEFT-locked outfit (mapped through the cast genders). Consulted per attempt when
   *  opts.sideCheckMode is shadow / enforce; a dual dispatches under enforce ONLY when this agrees with
   *  confirmGenders. Callers without wardrobes omit it (stamped side_check:none, single read kept). */
  confirmSides?: (target: string) => Promise<{
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
// still ships — a weak-but-present dual beats dropping the +1.
// 2026-08-31 (Kevin): RAISED 0.15 → 0.25. Cheek-to-cheek couple renders (the model
// ignoring the head-gap framing) mis-crop the L/R split, so one face lands at ~0.16-0.18
// sim — a STRANGER, but it cleared the old 0.15 floor and shipped as a "weak dual"
// (the wife-on-the-man + generic-partner failure). Successful duals score 0.5-0.75 and
// these misfires score ~0.16-0.18 — a clean bimodal gap — so 0.25 degrades the strangers
// to a clean solo-of-self without over-degrading any genuinely-weak-but-correct couple.
const IDENTITY_DEGRADE_FLOOR = 0.25;

/**
 * Stage 8c (2026-07-09): identity enforcement threshold. When the secret is a
 * number, a delivered dual whose min per-face ArcFace sim is below it is
 * treated as a reject (→ the re-render ladder tries for a better take). Unset
 * → shadow (measure + log only). Owner-calibrated at 0.35 across all 9 live
 * face-swap mediums on production prompts (identity-calibration + identity-
 * stylized benches). typeof guard: this module also runs under jest.
 */
export function identityThreshold(): number | null {
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
    /**
     * Try a SOLO on the current model after each failed couple, before moving to the next model
     * (NIGHTLY only — see the ladder note at the call site). Default false keeps the historical order:
     * exhaust the couple re-renders first, degrade once at the end.
     */
    soloBetweenAttempts?: boolean;
    deadlineMs?: number;
    /**
     * Strict callers that would rather DEGRADE to a self-only swap than hard-fail
     * when a verified dual can't be delivered. Create sets this (Kevin 2026-07-24:
     * self-only beats a refund / a wrong-face dual). Onboarding leaves it off so
     * its cascade still re-renders a solo self scene.
     */
    degradeToSingle?: boolean;
    /**
     * How much wall-clock (ms) to keep in reserve before this deadline for a
     * re-render. Defaults to RECOVER_BUDGET_MS. Callers that reserve a SEPARATE
     * downstream solo-fallback window (nightly/create) pass their own SHORTER
     * dual re-render reserve here + a shortened deadlineMs, so the dual phase
     * degrades early enough to leave the solo fallback guaranteed room to finish
     * → a cast dream never cascades to pure-scene on budget (Kevin 2026-08-28).
     */
    recoverBudgetMs?: number;
    /** Override the wrong-person floor (engine_config.identity_degrade_floor,
     *  audit 2026-09-03 L3). Defaults to the hardcoded IDENTITY_DEGRADE_FLOOR so
     *  existing callers/tests are unchanged. */
    identityDegradeFloor?: number;
    /** engine_config.dual_side_check_mode (mig 514). 'off' (default) = byte-identical single-read routing;
     *  'shadow' = both reads stamped, nothing changes; 'enforce' = no dispatch without two agreeing reads
     *  (conflict / unresolved side read / unresolved gender read → re-render → degrade, never a possible cross). */
    sideCheckMode?: 'off' | 'shadow' | 'enforce';
    /** Per-call likeness bar for a delivered dual (parity loop round 7, the looks path passes 0.5): a swap whose
     *  min per-face sim is below it takes the re-render ladder instead of shipping. Default = IDENTITY_MIN_SIM. */
    identityMinSim?: number;
    /** The couple ladder's solo rung fires only from this attempt on (default 0 = after the first failed couple).
     *  Nightly passes 1 (Kevin 2026-09-17, late): flux couple → flux couple AGAIN → flux single → next-model
     *  couple → its single → nobody. The 09-14..16 engine re-rendered a failed couple before degrading and
     *  delivered 96% of couples as couples; the immediate solo rung was converting them at the first-try
     *  failure rate. */
    soloFromAttempt?: number;
  }
): Promise<DualSwapOutcome> {
  const log = deps.log ?? (() => {});
  const reasons: string[] = [];
  const maxRerenders = opts.maxRerenders ?? 2;
  const recoverBudgetMs = opts.recoverBudgetMs ?? RECOVER_BUDGET_MS;
  const identityDegradeFloor = opts.identityDegradeFloor ?? IDENTITY_DEGRADE_FLOOR;
  const soloFromAttempt = opts.soloFromAttempt ?? 0;
  let target = renderUrl;
  let predictionId: string | null = null;
  let faceCount = 2;
  // Best sub-threshold dual seen (Stage 8c) — shipped at exhaustion in
  // preference to any degrade path.
  let best: { url: string; faceCount: number; minSim: number; attempt: number } | null = null;

  const haveBudget = (): boolean => {
    if (!opts.deadlineMs) return true;
    const ok = Date.now() + recoverBudgetMs <= opts.deadlineMs;
    if (!ok) {
      log('recover budget exhausted — degrading instead of re-rendering');
      reasons.push('recover_budget_exhausted');
    }
    return ok;
  };

  /**
   * THE SOLO DEGRADE, as a reusable step (Kevin 2026-09-17).
   *
   * The ladder he asked for is: couple on the rolled model → SOLO on that same model → move to the next
   * model and try a couple there → solo there → pure scene. So the degrade has to be attemptable BETWEEN
   * model moves, not only once after every attempt is spent. Hence a local rather than a tail block.
   *
   * Returns the result to ship, or null to keep descending the ladder. Gender-safety is unchanged: a null
   * from deps.singleSwap means the guard REFUSED (no same-gender face for self) and we never paste on the
   * wrong body — that closes the 2026-08-05 "her face on the man" hole.
   */
  const tryDegradeSingle = async (from: string, tag: string): Promise<DualSwapOutcome | null> => {
    if (opts.strict && opts.degradeToSingle !== true) return null;
    reasons.push(tag);
    try {
      const single = await deps.singleSwap(deps.selfSource, from);
      if (single) {
        // singleSwap may have re-rendered a fresh SOLO scene, so its predictionId is the one that matches
        // the delivered url — forensics must point at the render we actually persisted.
        return {
          url: single.url,
          outcome: 'single',
          faceCount,
          predictionId: single.predictionId ?? predictionId,
          reasons,
        };
      }
      reasons.push(`${tag}_refused_gender`);
    } catch (e) {
      reasons.push(`single_fallback_failed:${(e as Error).message.slice(0, 80)}`);
    }
    return null;
  };

  // Attempt 0 = original render; each subsequent attempt moves to the NEXT MODEL (deps.rerender walks the
  // style contract's model chain). A failed dual now tries the solo on THAT model before the move.
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

    // Forensics (2026-09-13, the flux first-swap drill): the base render each attempt swapped against, so a failed
    // attempt's image can be pulled and looked at (the swap result alone only says "one face ≈ 0").
    //
    // URL ONLY (2026-09-14). gemini and grok hand back a `data:image/png;base64,…` URI rather than an https URL,
    // and stamping that put MEGABYTES into ai_generation_log.fallback_reasons — 34 of 120 sampled rows carried
    // 56 MB between them, the largest single row 2.85 MB. That is the column `check-forensics.js` and the
    // dream_forensics RPCs read, so the stamp meant to make failures diagnosable was making them undiagnosable:
    // a plain select over recent rows now hits the statement timeout. A data URI cannot be fetched later anyway,
    // so it was never worth storing — record that the attempt happened and move on.
    reasons.push(
      target.startsWith('data:')
        ? `dual_target:${attempt}:inline`
        : `dual_target:${attempt}:${target}`
    );

    // #2 (2026-08-05, sunnysteph): PROACTIVELY read the rendered faces' genders
    // with Haiku and route the engine by it — the engine's in-process genderage
    // misreads painterly faces (oil-on-canvas, the exact mis-route we're fixing),
    // where Haiku reads reliably. A CONFIDENT one-of-each becomes the
    // genderOverride so each source lands on its matching-gender face; anything
    // ambiguous / errored → no override, the engine uses its own genderage exactly
    // as before (never a regression on the reads it already gets right). Safe by
    // construction: even a WRONG override yields a low-identity swap → caught by
    // the identity gate below (re-render / degrade), so it can never SHIP a
    // wrong-gender dual. One Haiku per attempt (Kevin OK'd the cost 2026-08-05).
    // Replaces the old reject-only confirm (which only fired after the engine
    // already produced a swap or a gender_unconfirmed reject — too late for a
    // confidently-wrong genderage read that still returned a swappedUrl).
    let override: { left: 'male' | 'female'; right: 'male' | 'female' } | null = null;
    if (deps.confirmGenders) {
      try {
        const read = await deps.confirmGenders(target);
        const countOk = read == null || read.faceCount == null || read.faceCount === 2;
        if (read && read.left && read.right && read.left !== read.right && countOk) {
          override = { left: read.left, right: read.right };
          reasons.push(`gender_haiku:${read.left}/${read.right}`);
        } else if (read && !countOk) {
          // The reader's LEFT / RIGHT are relative to ALL the figures it saw, not to the two faces the engine
          // detects — so a confident-looking read over 3+ figures is unusable as a swap order.
          reasons.push(`gender_haiku_facecount:${read.faceCount}`);
          reasons.push('gender_haiku_unresolved');
        } else {
          reasons.push('gender_haiku_unresolved');
        }
      } catch (e) {
        reasons.push('gender_haiku_error');
        log(`gender pre-read failed: ${(e as Error).message}`);
      }
    }

    // SECOND SIGNAL (2026-09-12, Kevin's aquarelle couple: his face on the woman, hers on the man). The gender
    // read above ALONE routed the swap, and a confident misread of a sketchy painted couple became a guaranteed
    // cross that the identity gate cannot see (each pasted face matches its own source) and the broken-only
    // quality gate does not look for. A dual now needs two independent reads of "which side is the man" that
    // AGREE: the gender read and the wardrobe read (which side wears the LEFT-locked outfit). shadow = stamp only;
    // enforce = refuse to dispatch on conflict, an unresolved wardrobe read, or an unresolved gender read
    // (→ re-render → degrade to solo). A caller without wardrobes keeps the single read and is stamped.
    const sideMode = opts.sideCheckMode ?? 'off';
    if (sideMode !== 'off') {
      if (!deps.confirmSides) {
        reasons.push('side_check:none');
      } else {
        let side: { left: 'male' | 'female' | null; right: 'male' | 'female' | null } | null = null;
        try {
          side = await deps.confirmSides(target);
        } catch (e) {
          reasons.push('side_haiku_error');
          log(`side read failed: ${(e as Error).message}`);
        }
        const sideOk = !!(side && side.left && side.right && side.left !== side.right);
        reasons.push(sideOk ? `side_haiku:${side!.left}/${side!.right}` : 'side_haiku_unresolved');
        const verdict: 'agree' | 'conflict' | 'unresolved' =
          override && sideOk
            ? override.left === side!.left && override.right === side!.right
              ? 'agree'
              : 'conflict'
            : 'unresolved';
        if (verdict === 'agree') reasons.push('gender_side_agree');
        else if (verdict === 'conflict')
          reasons.push(
            `gender_side_conflict:g=${override!.left}/${override!.right},s=${side!.left}/${side!.right}`
          );
        if (sideMode === 'enforce' && verdict !== 'agree') {
          reasons.push(`side_check_reject:${verdict}`);
          log(`side check ${verdict} — refusing to dispatch this render, re-rendering`);
          continue;
        }
      }
    }

    let res: {
      swappedUrl: string | null;
      faceCount: number;
      engine?: string;
      swapMs?: number;
      rejectReason?: string | null;
      identity?: { left: number | null; right: number | null; ms: number } | null;
      bigFace?: boolean | null;
      maxFaceHFrac?: number | null;
    };
    try {
      // Pass the override only when confident, so a no-confirmGenders caller (and
      // the jest suite) keeps the exact single-arg dispatch it had before.
      res = override ? await deps.dispatchDual(target, override) : await deps.dispatchDual(target);
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
      // Big-face tier (BIG_FACE_RECLAIM_PLAN.md): stamp the reclaimed couples so the rollout is measurable.
      if (res.bigFace)
        reasons.push(`big_face:${res.maxFaceHFrac == null ? '?' : res.maxFaceHFrac.toFixed(2)}`);
      // Stage 8 shadow: identity sims of the delivered swap (calibration data
      // accrues in production forensics before any enforcement flips).
      if (res.identity)
        reasons.push(`identity_sim:L${res.identity.left ?? '?'}/R${res.identity.right ?? '?'}`);

      // Stage 8c enforcement: a measured dual below the identity threshold is
      // a QUALITY reject — try the ladder for a better take. We KEEP the best
      // sub-threshold dual and ship it at exhaustion: a weak dual still beats
      // a degrade (never worse than pre-enforcement behavior). Fail-open when
      // the measurement itself is absent (infra error / shadow off).
      const thr = opts.identityMinSim ?? identityThreshold();
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
        // STEP 2 OF THE LADDER, IDENTITY ARM (2026-09-17). The `continue` below jumps straight to the next
        // model, so until now the solo rung was reachable ONLY from the no_dual_split path — an identity
        // failure went couple-on-flux -> couple-on-gemini with no single attempted, which is the other half
        // of "it's supposed to fail back to a single on flux".
        //
        // Gated on the DEGRADE FLOOR so the two rules do not fight: between the floor and the threshold a
        // weak dual still beats a degrade (both faces present and gender-routed — a likeness miss, not a
        // safety failure), and that dual is kept in `best` and shipped at exhaustion. Below the floor the
        // dual is unusable (measured here at 0.069 and -0.017 — not the cast member at all), so there is no
        // weak dual worth protecting and the single is strictly better than a couple on another model.
        if (
          opts.soloBetweenAttempts === true &&
          attempt >= soloFromAttempt &&
          attempt < maxRerenders &&
          min < identityDegradeFloor
        ) {
          const onThisModel = await tryDegradeSingle(
            target,
            `dual_degrade_single:identity${attempt + 1}`
          );
          if (onThisModel) return onThisModel;
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
    // Big-face tier (BIG_FACE_RECLAIM_PLAN.md): a giant rejection carries the face's fraction of frame height, so the
    // ceiling (engine_config.dual_big_face_max_hfrac) can be tuned from stamps instead of re-running probes.
    if (res.rejectReason && /giant_face/.test(res.rejectReason) && res.maxFaceHFrac != null)
      reasons.push(`giant_face_hfrac:${res.maxFaceHFrac.toFixed(2)}`);

    // STEP 2 OF THE LADDER: the couple failed on THIS model — try a solo on it before moving models.
    // OPT-IN (`soloBetweenAttempts`), because it changes what ships: a solo on the CURRENT model now wins
    // over a couple that a re-render on the NEXT model might have delivered. Kevin chose that trade
    // deliberately and repeatedly ("i'd rather let it fall back to single"; "a flux couple failure falls
    // back to a flux single, then to gemini"), but it is the wrong default for Create and onboarding,
    // which would rather keep chasing the couple.
    //
    // Only while a move is still ahead of us; the final attempt falls through to the tail so the
    // sub-threshold-best check below still gets its say.
    if (opts.soloBetweenAttempts === true && attempt >= soloFromAttempt && attempt < maxRerenders) {
      const onThisModel = await tryDegradeSingle(
        target,
        `dual_degrade_single:attempt${attempt + 1}`
      );
      if (onThisModel) return onThisModel;
    }
  }

  // ── Could not deliver an above-threshold dual ──
  // Stage 8c: a WEAK sub-threshold dual (floor ≤ min < threshold) in hand still
  // beats every degrade — both faces are PRESENT and gender-routed; that miss is
  // a likeness-quality miss, not a safety failure.
  if (best && best.minSim >= identityDegradeFloor) {
    reasons.push(`identity_shipped_best:${best.minSim}(attempt ${best.attempt})`);
    log(`identity enforcement exhausted — shipping best dual (min=${best.minSim})`);
    return { url: best.url, outcome: 'dual', faceCount: best.faceCount, predictionId, reasons };
  }
  // A CATASTROPHIC best (min < floor) is the WRONG person on one side, not a weak
  // likeness — do NOT ship it. Fall through to the self-only degrade (Kevin
  // 2026-07-24: the "wife's face is a stranger" render should degrade, not ship).
  if (best) reasons.push(`identity_degrade_floor:${best.minSim}<${identityDegradeFloor}`);

  // Degrade to a gender-safe self-only swap (self placed, +1 dropped to a generic
  // figure) instead of shipping a wrong face. Non-strict callers (nightly) always
  // do this; strict callers do it only when they opted in (Create). Strict callers
  // that did NOT opt in (onboarding) keep cascading so the first-dream flow can
  // re-render a solo self scene.
  // LAST RUNG before pure scene: a solo on whatever model the final attempt rendered.
  const lastSolo = await tryDegradeSingle(target, 'dual_degrade_single');
  if (lastSolo) return lastSolo;

  reasons.push('dual_degrade_cascade');
  return { url: target, outcome: 'cascade', faceCount, predictionId, reasons };
}
