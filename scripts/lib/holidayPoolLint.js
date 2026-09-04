/**
 * Shared lint rules for HOLIDAY seed rows (HOLIDAY_DREAMS_PLAN.md §6 / T2).
 *
 * Only 1 of the 8 §6 face-swap safety rules is automated by the proximity scan.
 * This machine-checks the rest across every hand-authored `pool='holiday'` row so
 * a single "wearing a mask", a 60-word scene, a face-word, an unpinned medium, or
 * an unpaired single-gender dual costume can't silently break the swap.
 *
 * Two consumers keep these in one place so they can't drift:
 *   - scripts/scan-holiday-pools.js (CI / seed-workflow gate; reads the DB rows)
 *   - the holiday seed generator (lints each row at insert time)
 *
 * lintHolidayRow(row) → { errors: string[], warnings: string[] }.
 *   errors   → must be fixed; the scan exits non-zero.
 *   warnings → human-review (e.g. a possibly-gendered dual costume).
 */
const { VIOLATION, MITIGATED, ALLOW } = require('./posePoolLint');

// §6.1 — attire must be CLOTHING ONLY; nothing that occludes/recolors the face.
const FACE_OCCLUSION =
  /\b(?:mask|masked|domino mask|face[- ]?paint(?:ed)?|facepaint|painted face|fangs?|prosthetic|veil(?:ed)?|balaclava|niqab|burqa|full[- ]face|welding helmet|sunglasses|goggles over|hood(?:ed)?\s+up|hood\s+(?:over|covering)|hood\s+drawn)\b/i;

// §6.2/§6.3 — the scene is PURE ENVIRONMENT: no people, pose, camera, or face words.
const SCENE_PERSON =
  /\b(?:he|she|they|him|her|hers|his|their|them|man|woman|men|women|person|people|figure|figures|boy|girl|child|children|crowd|posing|pose|camera|lens|photo|photograph|portrait|close-?up|framing|foreground|face|faces|eye|eyes|gaze|gazing|glance|looking\s+(?:at|into|toward))\b/i;

// §6.2 — size-dominance cues shrink the couple and break the dual split.
const SIZE_CUE =
  /\bfills?\s+the\s+(?:background|frame|scene)\b|\bfill\s+the\s+frame\b|\bdominant\b|\bdominates?\b|\brich,?\s+layered\b|\blayered\s+(?:environmental|scene)\b/i;

// §6.6 — a single gendered garment on a DUAL (mixed-couple) attire → man-in-gown
// unless the attire pairs/neutralizes it.
const GENDERED_GARMENT =
  /\b(?:gown|gowns|dress|dresses|corset|bodice|skirt|blouse|frock coat|tuxedo)\b/i;
const PAIRED_ATTIRE = /\b(?:he|she|his|her|him|matching|paired|each|both|one\s+in|the\s+other)\b/i;

// Aligned to the LIVE goofy/elegant/active scene lengths (~10-26 words); the slot
// pipeline adds framing/identity around this, so a 40-word scene shrinks the faces.
const SCENE_MIN_WORDS = 10;
const SCENE_MAX_WORDS = 30;

function wordCount(s) {
  return String(s || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Reuse the couple-too-close proximity rule (posePoolLint) for a dual scene. */
function tripsProximity(text) {
  const t = String(text || '');
  if (!VIOLATION.test(t)) return false;
  if (MITIGATED.test(t)) return false;
  if (ALLOW.test(t)) return false;
  return true;
}

/**
 * @param {object} row - a holiday seed row.
 *   { table: 'dual_scenarios'|'single_scenarios'|'holiday_scenes',
 *     scene, attire?, medium_key?, medium_ban? }
 */
function lintHolidayRow(row) {
  const errors = [];
  const warnings = [];
  const table = row.table;
  const isSceneOnly = table === 'holiday_scenes';
  const isDual = table === 'dual_scenarios';

  // §6.7 RETIRED (Kevin 2026-09-04): holiday rows roll the same nightly mediums as
  // every other pool — medium_key/medium_ban are OPTIONAL (a ban is still allowed
  // for a QA-proven broken combo). No error when unpinned.

  if (isSceneOnly) {
    // Scene-only rows have no face to protect: skip the face/size/attire rules.
    if (!row.scene || !row.scene.trim()) errors.push('empty scene');
    return { errors, warnings };
  }

  // ── cast rows (dual_scenarios / single_scenarios) ──────────────────────────
  const attire = String(row.attire || '');
  const scene = String(row.scene || '');

  if (!attire.trim()) errors.push('empty attire');
  if (FACE_OCCLUSION.test(attire)) {
    errors.push(`attire has a face-occlusion token (mask/hood-up/face-paint/fangs/veil…) — §6.1`);
  }

  const wc = wordCount(scene);
  if (wc < SCENE_MIN_WORDS || wc > SCENE_MAX_WORDS) {
    errors.push(`scene word count ${wc} not in ${SCENE_MIN_WORDS}-${SCENE_MAX_WORDS} — §6.2`);
  }
  if (SCENE_PERSON.test(scene)) {
    errors.push('scene contains a person/pose/camera/face/eye/pronoun word — §6.2/§6.3');
  }
  if (SIZE_CUE.test(scene)) {
    errors.push(
      'scene contains a size-dominance cue (fills the background/dominant/layered) — §6.2'
    );
  }

  if (isDual) {
    if (tripsProximity(scene)) {
      errors.push('dual scene trips the couple-proximity rule (heads too close) — §6.4');
    }
    if (GENDERED_GARMENT.test(attire) && !PAIRED_ATTIRE.test(attire)) {
      warnings.push(
        'dual attire names a single-gender garment without pairing it (gender-neutralize or "she in…, he in…") — §6.6'
      );
    }
  }

  return { errors, warnings };
}

module.exports = {
  lintHolidayRow,
  wordCount,
  FACE_OCCLUSION,
  SCENE_PERSON,
  SIZE_CUE,
  GENDERED_GARMENT,
  SCENE_MIN_WORDS,
  SCENE_MAX_WORDS,
};
