/**
 * Render-time quality gate (NIGHTLY_IMPRESS_PLAN.md item 1) — BROKEN-ONLY.
 *
 * One cheap Haiku vision read of the FINISHED render (post-swap, pre-ship)
 * answering exactly ONE question: is this image blatantly BROKEN? Extra or
 * malformed limbs, duplicated/melted faces or hands, an object fused across a
 * person and an animal, or wildly impossible scale. NOTHING ELSE.
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
  /** Machine-readable telemetry labels (currently just ['broken'] on fail). */
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
    'Look at this image. Answer with ONLY one line in exactly this format and nothing else:\n' +
    'BROKEN: yes or no\n' +
    'Answer yes ONLY if you can see one of these specific defects: a face or body region that is heavily pixelated, smeared, or corrupted compared to the rest of the image; a pair of glasses or other accessory resting on two different heads at the same time; an accessory floating on an animal that belongs on the person; a person with an extra or missing limb or a duplicated face; or the image split into mismatched disconnected panels. ' +
    'Stylized or painterly art, unusual composition, tight or wide framing, plain settings, imperfect small details, and GIANT or oversized animals, creatures, or objects (intentional fantasy) are all NORMAL and are NOT broken. If you are unsure, answer no.'
  );
}

/** Parse the labeled reply. Missing/garbled label → null (fail-open). */
export function parseGateResponse(raw: string): QualityVerdict | null {
  const m = (raw || '').match(/\bBROKEN\s*:\s*(yes|no)\b/i);
  if (!m) return null;
  const broken = m[1].toLowerCase() === 'yes';
  return { pass: !broken, flags: broken ? ['broken'] : [], raw: (raw || '').slice(0, 200) };
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
        max_tokens: 16,
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
