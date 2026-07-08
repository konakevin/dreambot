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
 * Stage 3 (FACE_SWAP_UPGRADE_PLAN.md): probe via the Fly service's /detect
 * (YuNet + genderage, ~200ms, deterministic) instead of 2 Haiku vision calls.
 * Selected by SOLO_PROBE_ENGINE=fly (Supabase secret — config-level rollback
 * to 'haiku'). Any /detect error falls back to the Haiku probe in-request, so
 * this can only be faster, never less available. Output is mapped to the
 * classifyDualGenders shape so judge() is engine-agnostic.
 */
// Bench 2026-07-08 (12 renders): 10/12 agreement with Haiku; BOTH misses were
// stylized mediums (canvas false-2-faces, illustration false-0-faces) — the
// predicted YuNet weakness on painted faces. So the Fly probe is gated to
// PHOTOREAL dream_mediums keys where its reads are trustworthy; every
// stylized medium keeps Haiku. (These three are also the mediums nightly
// re-rolls AWAY from for character dreams, so in practice this fires on
// Create solos — the smallest blast radius.)
const PHOTOREAL_PROBE_MEDIUMS = new Set(['photography', 'hyperreal', 'render']);

async function flyProbe(
  imageUrl: string
): Promise<Awaited<ReturnType<typeof classifyDualGenders>> | null> {
  const flyUrl = Deno.env.get('DUAL_SWAP_FLY_URL');
  const flyToken = Deno.env.get('DUAL_SWAP_FLY_TOKEN');
  if (!flyUrl || !flyToken) return null;
  try {
    // DUAL_SWAP_FLY_URL carries a legacy path (`…fly.dev/face-swap-dual`) that
    // the swap route tolerates (any unmatched path falls through to swap) but
    // /detect does not — probe the ORIGIN, not the secret verbatim.
    // (2026-07-08: appending to the raw secret sent /face-swap-dual/detect →
    // silent 400 from the swap handler → permanent Haiku fallback.)
    const res = await fetch(`${new URL(flyUrl).origin}/detect`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${flyToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return null;
    const j = (await res.json()) as {
      faces?: { x: number; w: number; gender: 'male' | 'female' | null }[];
    };
    if (!Array.isArray(j.faces)) return null;
    const byX = [...j.faces].sort((a, b) => a.x - b.x);
    return {
      left: byX[0]?.gender ?? null,
      right: byX[1]?.gender ?? null,
      faceCount: j.faces.length,
      twoDistinctFaces: j.faces.length === 2,
    };
  } catch {
    return null;
  }
}

/**
 * Probe (and if needed re-render) a solo-cast pre-swap render until it is
 * safe to paste the cast face, or report that it never became safe.
 * Attempt 0 probes the original render; each further attempt re-renders.
 */
export async function ensureSoloSwapTarget(
  renderUrl: string,
  deps: SoloSwapGuardDeps,
  opts: { maxRerenders?: number; deadlineMs?: number; mediumKey?: string } = {}
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
      let read: Awaited<ReturnType<typeof classifyDualGenders>> | null = null;
      // typeof guard: this module also runs under jest (no Deno global).
      if (
        typeof Deno !== 'undefined' &&
        Deno.env.get('SOLO_PROBE_ENGINE') === 'fly' &&
        opts.mediumKey &&
        PHOTOREAL_PROBE_MEDIUMS.has(opts.mediumKey)
      ) {
        read = await flyProbe(target);
        if (!read) reasons.push('solo_probe_fly_fallback_haiku');
      }
      read = read ?? (await classifyDualGenders(target, deps.replicateToken));
      last = judge(read, deps.castGender);
    } catch (e) {
      // Probe infrastructure error → benefit of the doubt (see header).
      log(`solo probe threw: ${(e as Error).message}`);
      reasons.push('solo_probe_error');
      return { url: target, safe: true, faceCount: null, predictionId, reasons };
    }

    if (last.kind === 'safe') {
      // 'solo_probe_ok' is the silent happy path; only log the odd-but-safe.
      if (last.reason !== 'solo_probe_ok') reasons.push(last.reason);
      // SUCCESS-path telemetry (Stage 0, 2026-07-08): probe attempts are 2
      // Haiku vision calls each — surface the count so the accounting can see
      // probe amplification (and Stage 3's Fly /detect swap has a baseline).
      reasons.push(`solo_probes:${attempt + 1}`);
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
