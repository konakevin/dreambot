/**
 * Render-time quality gate (NIGHTLY_IMPRESS_PLAN.md item 1) — BROKEN + PROFILE.
 *
 * One cheap vision read of the FINISHED render (post-swap, pre-ship)
 * answering exactly TWO closed questions: (1) is this image blatantly BROKEN?
 * Extra or malformed limbs, duplicated/melted faces or hands, an object fused
 * across a person and an animal, or wildly impossible scale. (2) PROFILE — is
 * the cast shown in a strict SIDE view (one eye / turned away)? Added
 * 2026-09-04 on Kevin's call ("no side profiles, I hate that view") after a
 * couple render shipped both faces side-on with a correct frontal prompt; the
 * face swap can't place a likeness on a profile. Three-quarter views with both
 * eyes visible are NOT profile (conservative carve-out). NOTHING ELSE.
 *
 * ██ SCOPE IS DELIBERATELY NARROW (Kevin, 2026-09-03) ██
 * Taste is SUBJECTIVE and Haiku must never judge it: composition, framing,
 * background richness, face size, creature presence, style, "quality" — all
 * OUT of scope. Those are the prompt engine's job. Checks were removed on
 * purpose (face-count would false-flag intentional dual→solo degrades;
 * background/face-size are aesthetics). Do NOT add criteria back without a
 * fresh labeled calibration run proving ~0 false positives on good renders
 * (scripts/eval-quality-gate.mjs is the harness; the cast-scanner corpus
 * methodology).
 *
 * Contracts (agreed with Kevin):
 *  - FAIL-OPEN: any vision error / refusal / unparseable reply → null,
 *    caller ships ungated. Never a new way for a dream not to arrive.
 *  - CONSERVATIVE BIAS: the prompt instructs "if unsure, NOT broken".
 *  - Justification-FREE prompt (Haiku refuses "justified" vision probes).
 *  - Word-boundary label parsing — never JSON / newline-anchored.
 *  - Rollout: engine_config.quality_gate_mode 'off'|'shadow'|'enforce'
 *    (default 'shadow' = log only) + quality_gate_max_retries (default 2,
 *    enforce-mode retries are fresh RE-ROLLS, ship-best on exhaustion).
 */

import { SONNET } from './models.ts';

export interface QualityVerdict {
  /** false = blatantly broken per the single BROKEN check. */
  pass: boolean;
  /** Machine-readable telemetry labels: 'broken' and/or 'profile' on fail. */
  flags: string[];
  raw: string;
}

/**
 * The vision prompt. ONE closed-set question, behavioral wording, explicit
 * conservative default, no justification requested. Exported so unit tests
 * LOCK: (a) no justification words, (b) the unsure→NOT-broken bias, (c) no
 * taste vocabulary (background/composition/quality/beautiful) ever creeps in.
 */
export function buildGatePrompt(): string {
  return (
    'Look at this image. Answer with ONLY two lines in exactly this format and nothing else:\n' +
    'BROKEN: yes or no\n' +
    'PROFILE: yes or no\n' +
    'Answer BROKEN yes ONLY if you can see one of these specific defects: a face or body region that is heavily pixelated, smeared, or corrupted compared to the rest of the image; a pair of glasses or other accessory resting on two different heads at the same time; an accessory floating on an animal that belongs on the person; a person with an extra or missing limb or a duplicated face; or the image split into mismatched disconnected panels. ' +
    'Stylized or painterly art, unusual composition, tight or wide framing, plain settings, imperfect small details, and GIANT or oversized animals, creatures, or objects (intentional fantasy) are all NORMAL and are NOT broken. ' +
    'Answer PROFILE yes ONLY if the main person, or both people of a couple, is shown in a strict side view where only one eye is visible or the face is turned away from the camera; a three-quarter or frontal view with both eyes visible is NOT a profile, and a single side-on person in a couple where the other faces the camera is NOT a profile. ' +
    'If you are unsure, answer no for that line.'
  );
}

/** Parse the labeled reply. Missing/garbled BROKEN label → null (fail-open).
 *  PROFILE is optional: absent/garbled → treated as "no" (never fail-closed
 *  on a half-answer). Flags: 'broken' (re-SWAP can clear it) and/or 'profile'
 *  (needs a fresh RENDER — the base image itself is side-on). */
export function parseGateResponse(raw: string): QualityVerdict | null {
  const m = (raw || '').match(/\bBROKEN\s*:\s*(yes|no)\b/i);
  if (!m) return null;
  const broken = m[1].toLowerCase() === 'yes';
  const pm = (raw || '').match(/\bPROFILE\s*:\s*(yes|no)\b/i);
  const profile = pm ? pm[1].toLowerCase() === 'yes' : false;
  const flags: string[] = [];
  if (broken) flags.push('broken');
  if (profile) flags.push('profile');
  return { pass: flags.length === 0, flags, raw: (raw || '').slice(0, 200) };
}

/**
 * Assess a finished render. FAIL-OPEN: null on any error — callers ship
 * ungated and stamp quality_gate:error for telemetry.
 */
export async function assessRenderQuality(imageUrl: string): Promise<QualityVerdict | null> {
  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!anthropicKey) return null;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        // SONNET judge: labeled calibration (2026-09-03, 30 good + 3 broken) scored
        // Haiku 1/3 detection vs Sonnet 2/3, both at 0/30 false positives. The one
        // accepted miss is panel-layout weirdness — deliberately NOT chased (would
        // false-flag legit comics-medium renders).
        model: SONNET,
        max_tokens: 24,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'url', url: imageUrl } },
              { type: 'text', text: buildGatePrompt() },
            ],
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const txt =
      data.content && data.content[0] && data.content[0].type === 'text'
        ? String(data.content[0].text)
        : '';
    return parseGateResponse(txt);
  } catch (_e) {
    return null;
  }
}

// ── Pure-scene FALLBACK check (2026-09-05) ──────────────────────────────────
// When a swap is unusable the render falls back to an EMPTY scene. Twice on
// 2026-09-04 that fallback shipped strangers (a watercolor of two women in
// profile; a couple's failed cast). Fallback renders skip the cast gate (no
// cast to check), so they get this ONE closed question instead: are there
// people in it? Same contracts: fail-open, conservative, no justification.
export interface ScenePeopleVerdict {
  /** false = people are visible as subjects in a scene that must be empty. */
  pass: boolean;
  raw: string;
}

export function buildScenePeoplePrompt(): string {
  return (
    'Look at this image. Answer with ONLY one line in exactly this format and nothing else:\n' +
    'PEOPLE: yes or no\n' +
    'Answer yes ONLY if one or more people, human faces, or human figures are clearly visible as subjects of the image. ' +
    'Tiny distant silhouettes, statues, mannequins, skeletons, ghosts, scarecrows, and jack-o-lantern grins are NOT people. ' +
    'If you are unsure, answer no.'
  );
}

export function parseScenePeopleResponse(raw: string): ScenePeopleVerdict | null {
  const m = (raw || '').match(/\bPEOPLE\s*:\s*(yes|no)\b/i);
  if (!m) return null;
  return { pass: m[1].toLowerCase() !== 'yes', raw: (raw || '').slice(0, 200) };
}

/** FAIL-OPEN: null on any error — the caller ships the fallback ungated. */
export async function assessSceneFallbackPeople(
  imageUrl: string
): Promise<ScenePeopleVerdict | null> {
  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!anthropicKey) return null;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: SONNET,
        max_tokens: 16,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'url', url: imageUrl } },
              { type: 'text', text: buildScenePeoplePrompt() },
            ],
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const txt =
      data.content && data.content[0] && data.content[0].type === 'text'
        ? String(data.content[0].text)
        : '';
    return parseScenePeopleResponse(txt);
  } catch (_e) {
    return null;
  }
}
