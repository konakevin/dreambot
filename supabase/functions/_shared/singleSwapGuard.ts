/**
 * Solo-swap safety guard — face-count + gender confirmation for the SINGLE
 * face-swap path.
 *
 * WHY (2026-07-05, the "wife's face on the man" failure): a solo-cast render
 * can invent a second person — couple-coded scenes (tea party, picnic, ball)
 * beat the solo framing mandate — and the single-swap models (cdingram /
 * yan-ops / pikachupichu25) are FACE-BLIND: no face index, no detection; they
 * paste the source face onto whichever rendered face is most prominent. Render
 * a couple on a wife-solo dream and her face can land on the MAN, and nothing
 * in the single path counted faces, so forensics stayed silent.
 *
 * THE GUARANTEE (ported from dualGenderRouting, 2026-06-16): we paste ONLY
 * when the pre-swap render is CONFIRMED safe — exactly one face, and (when the
 * cast gender is known) no readable face of the wrong gender. When we can't
 * confirm, we re-render within budget. When attempts/budget are exhausted we
 * accept only the provably-gender-safe case (every readable face matches the
 * cast gender — an extra same-gender bystander is a quality miss, not a
 * catastrophe) and otherwise tell the caller NOT to swap: create throws (→
 * refund, same contract as swap exhaustion), nightly ships the unswapped
 * scene, onboarding (strict) cascades to a solo-self re-render. No
 * confirmation → no paste.
 *
 * A completely unreadable probe (vision outage / unparseable) passes with the
 * benefit of the doubt — same stance as verifyDualSwapOutput: this guard is a
 * net for the invented-second-person case, not a new way for a vision hiccup
 * to fail good renders.
 */

import { classifyDualGenders } from './vision.ts';

export interface SoloSwapGuardDeps {
  /** The cast member's gender, when known (genderLock / describe-photo). */
  castGender: 'male' | 'female' | null;
  replicateToken: string;
  /** Re-render the SAME prompt to replace an unsafe target. */
  rerender: () => Promise<{ url: string; predictionId: string | null }>;
  log?: (msg: string) => void;
}

export interface SoloSwapGuardResult {
  /** Best target render (the re-rendered URL if the guard re-rendered). */
  url: string;
  /** true → pasting the cast face on this render is gender-safe. */
  safe: boolean;
  /** Faces the probe saw on the final attempt (observability). */
  faceCount: number | null;
  /** Non-null if a re-render replaced the original render. */
  predictionId: string | null;
  /** Push onto the caller's fallbackReasons. */
  reasons: string[];
}

// Wall-clock a re-render + probe + swap needs. Within this of the job
// deadline, stop re-rendering and settle — mirrors dualSwapPipeline.
const RECOVER_BUDGET_MS = 75_000;

interface Verdict {
  /** safe → paste now; soft → unsafe but gender-matched (acceptable at
   *  exhaustion); hard → never paste on this render. */
  kind: 'safe' | 'soft' | 'hard';
  reason: string;
  faceCount: number | null;
}

function judge(
  read: Awaited<ReturnType<typeof classifyDualGenders>>,
  castGender: 'male' | 'female' | null
): Verdict {
  const { left, right, faceCount } = read;
  const genders = [left, right].filter((g): g is 'male' | 'female' => g !== null);

  // Nothing readable at all → benefit of the doubt (see header).
  if (faceCount === null && genders.length === 0) {
    return { kind: 'safe', reason: 'solo_probe_unread', faceCount };
  }

  // No count but a second gender read → treat as that many people.
  const count = faceCount ?? genders.length;

  // Zero faces → the swap models would exhaust with "no face found" anyway;
  // a re-render is cheaper than burning the whole swap chain first.
  if (count === 0) return { kind: 'hard', reason: 'solo_probe_no_face', faceCount: count };

  if (count === 1) {
    const visible = left ?? right;
    if (visible && castGender && visible !== castGender) {
      // The render's only face is the WRONG gender (the scene replaced the
      // character) — pasting fixes the face but leaves the wrong body/hair.
      return { kind: 'hard', reason: `solo_gender_mismatch:${visible}`, faceCount: count };
    }
    return { kind: 'safe', reason: 'solo_probe_ok', faceCount: count };
  }

  // 2+ people in a solo render. Gender-safe only if EVERY readable face
  // matches the cast gender — then the paste cannot land on a wrong-gender
  // face, however the face-blind model targets.
  const allMatch =
    castGender !== null && genders.length >= 1 && genders.every((g) => g === castGender);
  return {
    kind: allMatch ? 'soft' : 'hard',
    reason: `solo_multi_face(faces=${count},cast=${castGender ?? '?'},read=${genders.join('/') || 'none'})`,
    faceCount: count,
  };
}

/**
 * Probe (and if needed re-render) a solo-cast pre-swap render until it is
 * safe to paste the cast face, or report that it never became safe.
 * Attempt 0 probes the original render; each further attempt re-renders.
 */
export async function ensureSoloSwapTarget(
  renderUrl: string,
  deps: SoloSwapGuardDeps,
  opts: { maxRerenders?: number; deadlineMs?: number } = {}
): Promise<SoloSwapGuardResult> {
  const log = deps.log ?? (() => {});
  const reasons: string[] = [];
  const maxRerenders = opts.maxRerenders ?? 2;
  let target = renderUrl;
  let predictionId: string | null = null;
  let last: Verdict = { kind: 'hard', reason: 'solo_probe_not_run', faceCount: null };

  const haveBudget = (): boolean => {
    if (!opts.deadlineMs) return true;
    const ok = Date.now() + RECOVER_BUDGET_MS <= opts.deadlineMs;
    if (!ok) {
      log('solo recover budget exhausted — settling instead of re-rendering');
      reasons.push('solo_recover_budget_exhausted');
    }
    return ok;
  };

  for (let attempt = 0; attempt <= maxRerenders; attempt++) {
    if (attempt > 0) {
      if (!haveBudget()) break;
      reasons.push('rerender_for_solo');
      try {
        const rr = await deps.rerender();
        target = rr.url;
        predictionId = rr.predictionId ?? predictionId;
        log(`re-rendered solo scene (attempt ${attempt})`);
      } catch (e) {
        log(`solo re-render failed: ${(e as Error).message}`);
        break;
      }
    }

    try {
      last = judge(await classifyDualGenders(target, deps.replicateToken), deps.castGender);
    } catch (e) {
      // Probe infrastructure error → benefit of the doubt (see header).
      log(`solo probe threw: ${(e as Error).message}`);
      reasons.push('solo_probe_error');
      return { url: target, safe: true, faceCount: null, predictionId, reasons };
    }

    if (last.kind === 'safe') {
      // 'solo_probe_ok' is the silent happy path; only log the odd-but-safe.
      if (last.reason !== 'solo_probe_ok') reasons.push(last.reason);
      return { url: target, safe: true, faceCount: last.faceCount, predictionId, reasons };
    }
    reasons.push(last.reason);
    log(`solo probe unsafe (${last.reason})${attempt < maxRerenders ? ' — re-render' : ''}`);
  }

  if (last.kind === 'soft') {
    reasons.push('solo_multiface_samegender_accepted');
    return { url: target, safe: true, faceCount: last.faceCount, predictionId, reasons };
  }
  reasons.push('solo_swap_unsafe');
  return { url: target, safe: false, faceCount: last.faceCount, predictionId, reasons };
}
