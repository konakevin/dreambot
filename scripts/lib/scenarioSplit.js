/**
 * scenarioSplit.js — split a scenario row into the PLACE and what the PEOPLE are doing.
 *
 * WHY (Kevin, 2026-09-13). A scenario row is one sentence carrying both halves, and the nightly engine assigns the
 * whole string to the place slot. Everything after the first comma is then read as scenery, so nothing tells the
 * people to do anything and the face-swap framing block ("stand side by side, face the camera") becomes the only
 * pose. That is what rendered a couple standing at attention on a seabed under the line "Soaring above a lost city
 * of submerged pillars". This splits the sentence so the action can reach the slot that describes people.
 *
 * The words are never invented or rewritten — only reassigned.
 *
 * Locked by __tests__/lib/scenarioSplit.test.ts.
 */

/** ", she …" / "; both …" — a comma or semicolon, then a clause that starts with a subject. */
const SPLIT_COMMA = /[,;]\s+(?=(?:she|he|they|both|the pair|the two of them|each)\b)/i;

/**
 * "Waterpark enclosed tube slide both mid-rush …" — no comma, the subject just starts. DUAL POOLS ONLY: in the
 * single pools "both" is nearly always a determiner ("resting across both hands", "bent hard in both hands"), and
 * cutting there produces an action of "both hands, acacia trees behind him". Requires a verb-shaped word after the
 * subject so a determiner cannot match.
 */
/** Nouns that follow "both" as a DETERMINER. Without this guard "spear resting across both hands, acacia trees
 *  behind him" splits into an action of "both hands, acacia trees behind him" — a fragment replacing a real pose.
 *  Caught by __tests__/lib/scenarioSplit.test.ts before any row was written. */
const DETERMINER_NOUNS =
  'hands|arms|feet|legs|eyes|sides|ends|shoulders|knees|elbows|palms|wrists|fists|thumbs|hips|boots|gloves|reins|handles|poles|straps|oars|paddles|ears|cheeks|thighs|shins|wings|halves';

const SPLIT_BARE = new RegExp(
  `\\s+(?=(?:she|he|they|both|each)\\s+(?!(?:${DETERMINER_NOUNS})\\b)(?:mid-|[a-z]+(?:s|ing|ed)\\b))`,
  'i'
);

/** A half shorter than this is a fragment, not a place or an action. */
const MIN_HALF = 12;

/**
 * @param {string} scene the scenario row's `scene` text
 * @param {{ allowBare?: boolean }} [opts] allowBare: permit the comma-less split (dual pools only)
 * @returns {{ place: string, action: string } | null} null when there is no clean split — the caller leaves the row
 *   alone and the engine's pose fallback covers it, rather than anyone guessing at the author's intent.
 */
function splitScenario(scene, opts = {}) {
  if (typeof scene !== 'string' || scene.trim().length === 0) return null;
  const m = SPLIT_COMMA.exec(scene) || (opts.allowBare ? SPLIT_BARE.exec(scene) : null);
  if (!m) return null;
  const place = scene.slice(0, m.index).trim().replace(/[,;]$/, '');
  const action = scene
    .slice(m.index + m[0].length)
    .trim()
    .replace(/\.$/, '');
  if (place.length < MIN_HALF || action.length < MIN_HALF) return null;
  return { place, action };
}

module.exports = { splitScenario, SPLIT_COMMA, SPLIT_BARE, MIN_HALF, DETERMINER_NOUNS };
