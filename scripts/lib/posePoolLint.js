/**
 * Shared lint rules for face-swap pose/scene pool entries.
 *
 * Two consumers keep these in one place so they can't drift:
 *   - scripts/scan-dual-faceswap-proximity.js (the POST-SEED HOOK hard rule)
 *   - scenario seeding scripts (DB rows in dual_scenarios/single_scenarios —
 *     the scanner only sees code files, so seeders lint rows at insert time)
 *
 * ACTIVE-pool rules (2026-07-09, from the depth-QA failure taxonomy):
 *   - every entry must NAME both faces visible/toward camera (the invariant
 *     that replaces "heads apart" for action poses)
 *   - reach-back/pull-up poses are banned (ridge-scramble: 1/5 — the wording
 *     turns a body away from camera)
 *   - particle clouds at face height are banned (flour-fight occlusions)
 */

// Couple-too-close phrasings that cause overlapping faces (→ no_dual_split).
const VIOLATION =
  /\b(?:standing|sitting|seated|stand|sit|perched|leaning|nestled|huddled)\s+close\b|\bclose\s+(?:together|beside|on\s+a|on\s+the|to\s+each\s+other)\b|\bshoulders?\s+(?:nearly\s+)?touching\b|\bshoulder[-\s]to[-\s]shoulder\b|\bcheek[-\s]to[-\s]cheek\b|\bcheeks?\s+touching\b|\bheads?\s+(?:close|together|touching|nearly\s+touching)\b|\bfaces?\s+(?:close|together|touching|inches\s+apart)\b|\bleaning\s+(?:in|into)\s+(?:each\s+other|one\s+another|the\s+other|close)\b|\bnuzzl|\bnestl|\bhuddl|\bpressed\s+against\s+each\s+other\b|\b(?<!hands\s)(?<!palms\s)(?<!fingertips\s)pressed\s+together\b|\bforeheads?\s+touching\b|\btemple[-\s]to[-\s]temple\b|\barms?\s+(?:around|round)\s+(?:each\s+other|one\s+another|the\s+other)\b|\bwrapped\s+around\s+each\s+other\b|\bembrac|\bcuddl|\bhugging\b/i;

// A proximity phrase is exempt when the same line pins the faces apart or
// to-camera (deliberate, mitigated phrasing).
const MITIGATED =
  /FROM THE SIDE|heads apart|clear gap|a step apart|arm's length|heads on separate sides|band of background|facing camera|facing forward|toward camera|not an embrace/i;

// Known false positives (proximity to an OBJECT, not the partner).
const ALLOW = /close\s+to\s+(?:a|an|the|it|its)\b|close-up|close\s+attention|\bclosed\b/i;

// Sonnet-facing BAN lists name forbidden verbs on purpose — not pose text.
const BAN_LIST = /\bNO\s|DO NOT|impossible to render|Even though the user typed/;
const COMMENT = /^\s*(\/\/|\*|\/\*)/;

// ── ACTIVE-pool entry rules ──────────────────────────────────────────────

const FACE_VISIBILITY =
  /both faces\s+(?:fully\s+|clearly\s+)?(?:visible|toward|turned toward)|faces?\s+(?:clearly\s+|still\s+|turned\s+|fully\s+)?toward\s+(?:the\s+)?camera|(?:grinning|smiling|laughing|looking)\s+(?:at|toward|back at|into)\s+the\s+camera/i;

const REACH_BACK = /reach(?:es|ing)?\s+back|pull(?:s|ing)?\s+(?:her|him|them|each other)\s+up/i;

const PARTICLE_AT_FACE =
  /\b(?:flour|dust|powder|snow|foam|smoke)\s+cloud\b(?![^.]*faces?\s+(?:clear|visible))|faces?\s+(?:obscured|hidden|covered|buried|shielded)/i;

/**
 * Lint one ACTIVE pose/scenario entry. Returns an array of problem strings
 * (empty = clean). Applies BOTH the proximity rule and the active rules.
 */
function lintActivePoseEntry(text) {
  const problems = [];
  const stripped = text.replace(ALLOW, '');
  if (VIOLATION.test(stripped) && !MITIGATED.test(text)) {
    problems.push('couple-too-close phrasing without head-separation mitigation');
  }
  if (!FACE_VISIBILITY.test(text)) {
    problems.push('must explicitly name both faces visible/toward camera');
  }
  if (REACH_BACK.test(text)) {
    problems.push('reach-back/pull-up pose (turns a body away from camera — ridge-scramble 1/5)');
  }
  if (PARTICLE_AT_FACE.test(text)) {
    problems.push('particle cloud / face occlusion language (flour-fight failure class)');
  }
  return problems;
}

module.exports = { VIOLATION, MITIGATED, ALLOW, BAN_LIST, COMMENT, lintActivePoseEntry };

/**
 * CLASSIC-pool lint (POSE_POOLS_DB_MIGRATION_PLAN.md I5): proximity rule ONLY.
 * Classic poses are scene-neutral body poses — forcing the active-pool
 * face-phrase rules onto them would change their register, which is itself a
 * way to break dreams. Swap-breaking closeness is still rejected.
 */
function lintClassicPoseEntry(text) {
  const stripped = text.replace(ALLOW, '');
  if (VIOLATION.test(stripped) && !MITIGATED.test(text)) {
    return ['couple-too-close phrasing without head-separation mitigation'];
  }
  return [];
}

module.exports.lintClassicPoseEntry = lintClassicPoseEntry;
