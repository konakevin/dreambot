/**
 * Scene hook — the early-token carrier for scene identity on face-swap prompts.
 *
 * THE PROBLEM (2026-09-02, background-drowning fix): on nightly face-swap
 * renders the scene_description sits BEHIND ~85% of the prompt's tokens — a
 * deliberate ordering (2026-06-19 hard rule in characterSlotPrompt.ts: front-
 * loading the scene shrank the couple and broke the dual swap). But Flux's
 * early-token attention never reaches the tail, so renders came out with rich
 * scene TEXT and plain/absent backdrops ("anvil thunderhead + emergency
 * strobes" → blank blue sky; "endless main street + soaring mesas" →
 * head-and-shoulders crop).
 *
 * THE MECHANISM: the one scene element that DOES reliably render is the early
 * "set at <location>" slot. buildSceneHook() distills the scene_description's
 * 1-2 most distinctive visual clauses into a short location appositive that
 * rides that same early slot: `set at <location> — <hook>`. It changes NO part
 * ordering and carries NO size/dominance cue, so it stays inside the letter of
 * the 2026-06-19 hard rule.
 *
 * Every step is a small exported function with its own unit tests
 * (__tests__/lib/sceneHook.test.ts). Change behavior HERE only with tests.
 */

/** Hard cap on hook length — the hook must stay a compact appositive, never a
 * second scene paragraph competing with the early identity/framing tokens. */
export const MAX_HOOK_WORDS = 18;

/** At most this many clauses are distilled into the hook. */
export const MAX_HOOK_CLAUSES = 2;

/** Words shorter than this are ignored when comparing clause↔location overlap
 * ("the", "of", "at" carry no location identity). */
const MIN_SIGNIFICANT_WORD_LENGTH = 4;

/** A clause restates the location when at least this fraction of its
 * significant words already appear in the location name. */
const LOCATION_OVERLAP_THRESHOLD = 0.5;

/** Size/dominance cues are the exact 2026-06-19 footgun ("scene fills the
 * background" → couple shrinks → dual swap breaks). A clause carrying any of
 * these NEVER rides the early window. */
const DOMINANCE_CUE_RE =
  /\b(background|fills?|filling|dominant|dominates?|rich|layered|sprawling)\b/i;

/** Lowercased words long enough to carry meaning for overlap comparison. */
export function significantWords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= MIN_SIGNIFICANT_WORD_LENGTH);
}

/** Split prose into trimmed, non-empty clauses on comma/semicolon/period/dash/
 * colon. Dashes matter: scene descriptions use em-dashes as clause breaks, and
 * without splitting on them a location-restating clause hides inside a longer
 * clause and slips past the restatement filter (seen live: "set at Bicton's
 * Italian Garden — Bicton's Italian Garden at golden hour — …"). */
export function splitClauses(text: string): string[] {
  return text
    .split(/[,;.:]|[—–]|\s-\s/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
}

/**
 * True when the clause mostly restates the location name (e.g. scene
 * descriptions often open by repeating the anchor: "Seoul Lotte World Tower
 * observation deck, …"). Restating clauses are redundant with the `set at`
 * slot the hook rides in. A clause with NO significant words is also treated
 * as a restatement (it carries nothing worth promoting).
 */
export function clauseRestatesLocation(clause: string, location: string): boolean {
  const locWords = new Set(significantWords(location));
  const words = significantWords(clause);
  if (words.length === 0) return true;
  if (locWords.size === 0) return false;
  const overlap = words.filter((w) => locWords.has(w)).length;
  return overlap / words.length >= LOCATION_OVERLAP_THRESHOLD;
}

/** True when the clause carries a size/dominance cue (see DOMINANCE_CUE_RE). */
export function hasDominanceCue(clause: string): boolean {
  return DOMINANCE_CUE_RE.test(clause);
}

/** Cap a phrase at MAX_HOOK_WORDS words (whole-word truncation). */
export function capWords(text: string): string {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  return words.length > MAX_HOOK_WORDS ? words.slice(0, MAX_HOOK_WORDS).join(' ') : words.join(' ');
}

/**
 * Distill a scene_description into a ≤MAX_HOOK_WORDS-word location appositive:
 * the first MAX_HOOK_CLAUSES clauses that neither restate the location nor
 * carry a dominance cue. Returns '' when nothing qualifies (caller then emits
 * the bare `set at <location>` exactly as before this fix).
 */
export function buildSceneHook(sceneDescription: string, location: string): string {
  if (!sceneDescription) return '';
  const clauses = splitClauses(sceneDescription)
    .filter((c) => !clauseRestatesLocation(c, location))
    .filter((c) => !hasDominanceCue(c));
  return capWords(clauses.slice(0, MAX_HOOK_CLAUSES).join(', '));
}
