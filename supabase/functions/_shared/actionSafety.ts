/**
 * actionSafety.ts — the ONE swap-safe envelope validator for authored action beats.
 *
 * Consumers:
 *   - locationActionBeat.ts (Option B place-fit beats, since 2026-08-10)
 *   - characterSlotPrompt.ts scene-first actions (SCENE_FIRST_ACTION_PLAN.md, 2026-09-05)
 *
 * An action beat lands VERBATIM in the Flux prompt at assembly position 5 (right after the
 * anchor). Anything in it that turns a body away, occludes a face, pulls two heads together,
 * or lifts hands above the head can break the face swap — so a beat that trips any rule is
 * DROPPED (the caller falls back to a classic pool pose); the render is never blocked.
 *
 * The dual proximity trio (VIOLATION / MITIGATED / ALLOW) is transcribed from
 * scripts/lib/posePoolLint.js — the POST-SEED HOOK scanner's rules — and a parity test
 * (__tests__/lib/actionSafety.test.ts) fails if the two drift.
 */

// Words that would fight the downstream face-forward framing or occlude the face
// if they leaked into the action string.
export const UNSAFE_WORDS =
  /\b(face|faces|eyes?|eyebrows?|gaze|gazing|smil\w*|lips|mouth|cheeks?|jaw|forehead|helmet|mask|masked|hood|hoods|goggles|visor|balaclava|veil|spyglass to (?:the |one'?s )?eye|pipe in (?:the |his |her )?mouth|selfie|camera|lens|kiss\w*|hug\w*|embrac\w*|cheek to cheek)\b/i;

// Over-energetic / above-the-head actions read GOOFY under a face-swap (a leap or
// arms-thrown-overhead breaks the grounded, knees-up, professional-cinematic bar
// and can shrink/tilt the face).
export const TOO_ENERGETIC =
  /\b(jump\w*|leap\w*|leaping|soar\w*|airborne|mid-?air|sprint\w*|arms? (?:raised|up|aloft|overhead|thrown)|(?:raise[sd]?|raising|throw\w*|fling\w*) (?:both )?(?:arms|hands)|hands? (?:aloft|overhead|raised)|overhead|triumphant\w*|celebrat\w*|fist ?pump\w*|punch\w* the air|leaping|bound\w* (?:up|over))\b/i;

// Eye-direction / body-orientation words the slot validator already forbids in every
// Sonnet-written field: they turn a face away from the lens or lock the two faces on each
// other (no_dual_split). Kept in sync with FORBIDDEN_PATTERNS in characterSlotPrompt.ts.
export const DIRECTION_WORDS =
  /\blooking\s+(at|toward|into|across|up\s+at|out|over)\b|\bgazing\b|\b(watching|observing|staring|peering)\b|\bfacing\s+(each\s+other|one\s+another)\b|\bface[-\s]to[-\s]face\b|\bturned\s+(toward|to|away)\s+|\beye\s+contact\b|\b(from\s+behind|back\s+view|rear\s+view|back\s+of\s+(the|her|his|their)\s+head)\b|\b(side\s+profile|profile\s+shot)\b/i;

// People are referred to by role ("one … the other"), never by pronoun: a pronoun in a
// beat can re-gender a cast member under the swap (the slot validator bans them too).
export const PRONOUNS = /\b(she|he|him|her|his|hers|she's|he's)\b/i;

// A seated / kneeling couple fights the dual anchor ("the two stand side by side") and the
// crop pipeline's same-height rule. Solo beats may sit; couple beats stay on their feet.
export const NOT_STANDING_DUAL =
  /\b(sitting|seated|sit|sits|kneel\w*|crouch\w*|squat\w*|lying|lie|lies|reclin\w*)\b/i;

// ── Dual proximity trio — VERBATIM from scripts/lib/posePoolLint.js ────────────────
// Couple-too-close phrasings that cause overlapping faces (→ no_dual_split).
export const DUAL_PROXIMITY_VIOLATION =
  /\b(?:standing|sitting|seated|stand|sit|perched|leaning|nestled|huddled)\s+close\b|\bclose\s+(?:together|beside|on\s+a|on\s+the|to\s+each\s+other)\b|\bshoulders?\s+(?:nearly\s+)?touching\b|\bshoulder[-\s]to[-\s]shoulder\b|\bcheek[-\s]to[-\s]cheek\b|\bcheeks?\s+touching\b|\bheads?\s+(?:close|together|touching|nearly\s+touching)\b|\bfaces?\s+(?:close|together|touching|inches\s+apart)\b|\bleaning\s+(?:in|into)\s+(?:each\s+other|one\s+another|the\s+other|close)\b|\bnuzzl|\bnestl|\bhuddl|\bpressed\s+against\s+each\s+other\b|\b(?<!hands\s)(?<!palms\s)(?<!fingertips\s)pressed\s+together\b|\bforeheads?\s+touching\b|\btemple[-\s]to[-\s]temple\b|\barms?\s+(?:around|round)\s+(?:each\s+other|one\s+another|the\s+other)\b|\bwrapped\s+around\s+each\s+other\b|\bembrac|\bcuddl|\bhugging\b/i;
// A proximity phrase is exempt when the same line pins the faces apart or to-camera.
export const DUAL_PROXIMITY_MITIGATED =
  /FROM THE SIDE|heads apart|clear gap|a step apart|arm's length|heads on separate sides|band of background|facing camera|facing forward|toward camera|not an embrace/i;
// Known false positives (proximity to an OBJECT, not the partner).
export const DUAL_PROXIMITY_ALLOW =
  /close\s+to\s+(?:a|an|the|it|its)\b|close-up|close\s+attention|\bclosed\b/i;

// Head / gaze orientation. A beat that tilts a head, or has the person read / study / examine
// something, renders the face turned DOWN or AWAY (2026-09-05 A/B: "chin tilted upward toward
// the moon" → a full side-profile couple, no_dual_split ×2; "consulting a pocket watch" → eyes
// down, identity 0.51). Faces stay toward the camera by the framing block; the beat must not fight it.
export const GAZE_WORDS =
  /\b(?:heads?|chins?|brows?|necks?)\s+(?:tilt\w*|turn\w*|bow\w*|lower\w*|down|up|cock\w*|angl\w*|dipp\w*|rais\w*|bent|inclin\w*)\b|\btilt(?:s|ed|ing)?\s+(?:the |their |a |one'?s )?(?:head|chin)s?\b|\b(?:angled|oriented|attention)\s+(?:toward|drawn|fixed|turned)\b|\b(?:study\w*|examin\w*|inspect\w*|scrutiniz\w*|contemplat\w*|consult\w*|read(?:s|ing)?|perus\w*|squint\w*|glanc\w*|survey\w*|admir\w*|regard\w*)\b|\btrac(?:e|es|ing)\s+(?:a|the|an|one|glowing|ancient|faded)\b|\bopen\s+(?:grimoire|book|tome|manuscript|spellbook|ledger|map|letter|page|scroll|journal)s?\b|\b(?:the|a|its|each)\s+pages?\b/i;

// Passive / defeated register — the "melancholy statue" beats. The set-dresser + costume-designer
// bar wants lively, characterful moments with the scene's objects, never someone waiting around.
export const PASSIVE_WORDS =
  /\b(?:motionless|resignation|resigned|slumped|pensive|melancholy|wistful\w*|listless|idly|idle|waiting|waits|lingering|lingers|loiter\w*|stands? still|standing still|still and|quiet thought|lost in thought)\b/i;

export type ActionBeatVerdict = { ok: true } | { ok: false; reason: string };

/**
 * Pronouns → role nouns. A pronoun in a beat can re-gender a cast member under the swap, so
 * the validator rejects them; but Sonnet slips "he / she" in often enough (2026-09-05 A/B:
 * 1 in 7 couple beats) that rewriting is better than losing the authored beat. Flux does not
 * care about grammar; it cares that the noun carries the right gender.
 */
export function depronounActionBeat(beat: string): string {
  return beat
    .replace(/\bshe's\b/gi, 'the woman is')
    .replace(/\bhe's\b/gi, 'the man is')
    .replace(/\bshe\b/gi, 'the woman')
    .replace(/\bhe\b/gi, 'the man')
    .replace(/\bhers\b/gi, "the woman's")
    .replace(/\bher\b/gi, "the woman's")
    .replace(/\bhis\b/gi, "the man's")
    .replace(/\bhim\b/gi, 'the man');
}

/** Normalize a model-written beat into the single-line phrase the prompt expects. */
export function normalizeActionBeat(raw: string): string {
  return (raw || '')
    .split('\n')[0]
    .trim()
    .replace(/^["'`]+|["'`]+$/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, 220)
    .trim();
}

/**
 * Validate one (already normalized) action beat against the swap-safe envelope.
 * `castCount` 2 adds the dual proximity + standing rules.
 */
export function validateActionBeat(beat: string, castCount: 1 | 2): ActionBeatVerdict {
  const b = (beat || '').trim();
  if (b.length < 6 || b.length > 220 || /\n/.test(b)) return { ok: false, reason: 'length' };
  if (UNSAFE_WORDS.test(b)) return { ok: false, reason: 'unsafe_word' };
  if (TOO_ENERGETIC.test(b)) return { ok: false, reason: 'too_energetic' };
  if (DIRECTION_WORDS.test(b)) return { ok: false, reason: 'direction' };
  if (PRONOUNS.test(b)) return { ok: false, reason: 'pronoun' };
  if (GAZE_WORDS.test(b)) return { ok: false, reason: 'gaze' };
  if (PASSIVE_WORDS.test(b)) return { ok: false, reason: 'passive' };
  // Solo beats are one clause; couple beats carry one clause per person + the gap → a wider cap.
  if (b.split(/\s+/).length > (castCount === 2 ? 36 : 26)) return { ok: false, reason: 'too_long' };
  if (castCount === 2) {
    const stripped = b.replace(DUAL_PROXIMITY_ALLOW, '');
    if (DUAL_PROXIMITY_VIOLATION.test(stripped) && !DUAL_PROXIMITY_MITIGATED.test(b)) {
      return { ok: false, reason: 'proximity' };
    }
    if (NOT_STANDING_DUAL.test(b)) return { ok: false, reason: 'not_standing' };
  }
  return { ok: true };
}
