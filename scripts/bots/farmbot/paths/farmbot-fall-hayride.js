/**
 * FarmBot — farmbot-fall-hayride (SEASONAL path, bot.seasonalPaths.fall,
 * 2026-09-09).
 *
 * ARCHITECTURALLY DIFFERENT from FarmBot's normal 30-path roster: this path
 * is NOT added to `paths[]` (the normal shuffle-bag rotation) — it belongs
 * in a NEW `seasonalPaths.fall` array on `index.js` (see
 * scripts/lib/botSeasonal.js), drawn only during the calendar Fall window
 * (Sept 15 → Thanksgiving Day) via its own separate persisted shuffle-bag,
 * gated behind `engine_config.bots_seasonal_enabled` +
 * `engine_config.bots_seasonal_pct`. NOT registered here — this agent does
 * NOT touch index.js (shared file, concurrent sibling seasonal-path agents
 * are editing it right now). See the bottom of this file's module for the
 * exact registration lines the orchestrator needs to add.
 *
 * CONCEPT (Kevin's brief): a charming hay wagon ride through the fields in
 * autumn — a wooden wagon pulled by a draft horse (or parked with the horse
 * resting nearby), piled with fresh hay, riding through golden/amber fall
 * fields, autumn trees, maybe a distant farmhouse. Fall-GENERAL, not
 * Halloween-specific — no pumpkins-as-jack-o-lanterns, no costumes, no
 * spooky anything, just warm harvest-season charm.
 *
 * DISTINCT FROM existing normal-rotation autumn paths (read first, per the
 * build brief): harvest-festival.js (decorated FESTIVAL GROUNDS — hay-bale
 * maze, scarecrows, festival stalls), autumn-village-market.js (MARKET-STALL
 * goods for sale), picnic-in-the-meadow.js (a FIXED picnic-blanket anchor).
 * This path's hero content is specifically THE HAY WAGON ITSELF, in motion
 * or paused mid-ride — never a festival backdrop, market stall, or picnic.
 *
 * ARCHITECTURE (mirrors chibi-halloween-cozy.js — several small bespoke axis
 * pools combined per-path, not just one "place" pool):
 *   1. WAGON        (always, HERO — put FIRST in the template per the
 *                    ⭐ CROSS-CUTTING maxTokens lesson, FARMBOT_PATH_BUILD_
 *                    STATE.md: Sonnet's brief-writing call has a fixed
 *                    maxTokens=400 and content late in a dense brief gets
 *                    dropped/thinned first) — the wooden hay wagon + draft
 *                    horse + piled hay, motion-vs-paused variety baked
 *                    directly into the pool (farmbot_fall_hayride_wagon.json)
 *   2. FIELD         (always) — the surrounding autumn farmland the wagon
 *                    rides through (farmbot_fall_hayride_field.json)
 *   3. ATMOSPHERE    (always) — fall light/weather/air, its OWN dedicated
 *                    pool rather than the shared SEASON pool per the build
 *                    brief, explicitly built for genuine variety (not
 *                    "always sunny" — see the Phase-4 tropical-pool lesson
 *                    in FARMBOT_PATH_BUILD_STATE.md) (farmbot_fall_hayride_
 *                    atmosphere.json)
 *   4. DETAIL         (~50% conditional) — ONE small charming touch riding
 *                    along (a basket of apples, a folded blanket...) —
 *                    deliberately NOT on every render, same rationale as
 *                    chibi-halloween-cozy.js's ACCESSORY axis: a mandatory
 *                    signature prop homogenizes every render into "the same
 *                    one wagon" (farmbot_fall_hayride_detail.json)
 *   5. ACTIVITY       (only when a character is present) — a small path-
 *                    local array (WAGON_ACTIVITY below), since the shared
 *                    ACTIVITY pool has zero hayride/wagon-relevant entries
 *                    (checked directly against farmbot_activity.json)
 *
 * "Sometimes no human" rule (bot-wide standard, 2026-09-09): includeCharacter
 * = Math.random() < 0.6. When false: guaranteed ambient life via
 * pools.pickPureSceneLife() (never a bare no-character render), front-loaded
 * into THE CAST block (proven fix from papaya-guava-orchard.js — a front-
 * loaded "no human figure" declaration can still lose the CAST-determining
 * sentence itself to Sonnet's brief-writing budget if it sits too late;
 * putting it right after the hero block, with "required/must appear"
 * language, is what makes it reliably survive into the render).
 *
 * CAMERA_COMPOSITION: manually filtered — a live scan (2026-09-09) found the
 * shared pool still carries 16/109 dwarfing-language entries even after the
 * 2026-09-09 source-level fix (that fix only stopped FUTURE generations from
 * reintroducing "tiny/dwarfed/sweeping/rolling" framing; it did not purge
 * the entries already baked into the existing 109-entry JSON). An open-field
 * concept like this one is the single highest-risk setting for that bug, so
 * the filter below is broad (not just one keyword), per the CAMERA_
 * COMPOSITION re-pollution lesson. Back-turned/over-the-shoulder entries
 * were already purged at the source (2026-09-09 "back-turned character" fix,
 * 120→109) — the filter still defensively re-checks for them in case a
 * future pool scale-up reintroduces that wording too.
 *
 * "Horse keeper" trap: the WAGON pool's own gen script (gen-fall-hayride-
 * wagon-pool.js) explicitly bans compounding an occupational/role word
 * directly against "horse" (no "cart horse," "wagon horse," "horse
 * handler") — this path's own WAGON_ACTIVITY array below follows the same
 * discipline (plain "the horse," never a compound role noun next to it).
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pools — required directly, NOT added to pools.js (shared
// file, other seasonal-path agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-fall-hayride-wagon-pool.js
// scripts/gen-seeds/farmbot/gen-fall-hayride-field-pool.js
// scripts/gen-seeds/farmbot/gen-fall-hayride-atmosphere-pool.js
// scripts/gen-seeds/farmbot/gen-fall-hayride-detail-pool.js
const WAGON = require('../seeds/farmbot_fall_hayride_wagon.json');
const FIELD = require('../seeds/farmbot_fall_hayride_field.json');
const ATMOSPHERE = require('../seeds/farmbot_fall_hayride_atmosphere.json');
const DETAIL = require('../seeds/farmbot_fall_hayride_detail.json');

// Small path-local activity set (not a shared pool — the shared ACTIVITY
// pool has zero hayride/wagon-relevant entries, checked directly against
// farmbot_activity.json before writing this). Every entry keeps the
// character's face clearly forward/visible (FarmBot's standing character
// rule — no back-turned/over-the-shoulder framing implied by the pose
// itself) and never compounds an occupational word against "horse."
const WAGON_ACTIVITY = [
  "Sitting atop the piled hay at the wagon's edge, one hand braced on the low side-rail, face turned forward into the open air with a bright, easy smile.",
  "Standing just beside the paused wagon, one hand resting gently on the horse's neck, offering a calm scratch along its mane.",
  "Perched on the wagon's front bench, both hands loosely holding the wagon's edge, leaning slightly forward as the wagon rolls steadily along.",
  'Kneeling in the piled hay, both arms wrapped around a full armful of loose golden hay, about to add it to the growing pile.',
  "Pausing beside the loaded wagon, one hand trailing lightly along its wooden side, face bright with a pleased smile at the full hay pile.",
  'Sitting comfortably nestled in the hay near the wagon, knees drawn up, hands resting loosely in the lap, face turned toward the passing fields.',
  "Standing at the wagon's front, both hands lightly holding the horse's lead rope, waiting patiently with a calm, content expression.",
  'Reaching up from the hay to tuck a loose strand back into the pile, cheeks flushed pink from the cool autumn air.',
  'Leaning back against a heap of hay with legs stretched out, arms braced behind for balance as the wagon gently rolls forward.',
  "Standing beside the wagon's wheel, one hand resting on the wooden rim, looking up toward the loaded hay with a warm smile.",
];

// Manual content filter (not byTags — CAMERA_COMPOSITION is untagged
// anyway): drops every scale-dissolving "tiny/dwarfed/sweeping/rolling/sky
// dominating/vast/endless/towering" framing (see header note — 16/109
// entries still carry this even post source-fix) PLUS a defensive re-check
// for back-turned/over-the-shoulder framing in case a future pool scale-up
// reintroduces it, PLUS (found live, round 1 QA 2026-09-09 — see the DB
// ai_prompt trace on the "purple curtained barn window" render) a whole
// ~30-entry cluster of window/barn-doorway/"cozy interior" framings and a
// ~15-entry village-street/rooftop-overhead cluster, both a genuine
// physical-setting mismatch for an open-field hayride (same class as the
// documented fishing-dock village-rooftop lesson) — a wagon ride through
// open fields is never viewed from inside a farmhouse/barn through a window,
// nor from over a village's rooftops. Round 1's bad render used entry #16
// ("Framed through a wide barn doorway, soft darkness at the edges, golden
// light beyond") — visually it rendered as an odd purple-curtained bedroom-
// window view onto the farm scene, completely off-brief.
const CAMERA_INCOMPATIBLE =
  /\btiny\b|\bdwarf(ed|ing)?\b|\bsmall within\b|\bsky dominating\b|\bsweeping\b|\brolling\b|\bvast\b|\bendless\b|\btowering\b|\bsprawling\b|\bover-the-shoulder\b|\brear view\b|\bfrom behind\b|\bback turned\b|\bfacing away\b|\bwindow\b|\bdoorway\b|\bcurtain\b|\bbarn\b|\bfarmhouse\b|\bthreshold\b|\bcozy interior\b|\bcosy interior\b|\binterior composition\b|\bvillage\b|\brooftops?\b|\bcottages?\b|\bhedgerows?\b/i;

module.exports = ({ sharedDNA, picker }) => {
  // Bot-wide "sometimes no human" rule (Kevin 2026-09-09): flat 60/40
  // character/pure-scene split.
  const includeCharacter = Math.random() < 0.6;

  const wagon = picker.pickWithRecency(WAGON, 'fall_hayride_wagon');

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['farm', 'leisure'], 'fall_hayride_character')
    : null;

  const activity = includeCharacter
    ? picker.pickWithRecency(WAGON_ACTIVITY, 'fall_hayride_activity')
    : null;

  const field = picker.pickWithRecency(FIELD, 'fall_hayride_field');
  const atmosphere = picker.pickWithRecency(ATMOSPHERE, 'fall_hayride_atmosphere');
  const detail =
    Math.random() < 0.5 ? picker.pickWithRecency(DETAIL, 'fall_hayride_detail') : null;

  const camera = picker.pickWithRecency(
    pools.CAMERA_COMPOSITION.filter((e) => !CAMERA_INCOMPATIBLE.test(e)),
    'fall_hayride_camera'
  );

  const animalChance = includeCharacter ? 0.4 : 0.75;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'fall_hayride_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'fall_hayride',
      });

  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'fall_hayride_magic')
      : null;

  // THE CAST — front-loaded right after the hero block (proven fix from
  // papaya-guava-orchard.js: the CAST-DETERMINING sentence itself, not just
  // decorative content, must survive Sonnet's brief-writing budget or the
  // render's correctness flips, not just its richness).
  const castBlock = character
    ? `A character is present and must be clearly, prominently visible — not distant or incidental:\n${character}`
    : `No human figure anywhere in the frame. This is required, concrete, clearly-visible life, not just background mood — it must actually appear in the render, not merely be implied: ${animal}`;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE HAY WAGON (the hero of the shot — always fills a large, unmistakable portion of the frame) ━━━
${wagon}

━━━ THE CAST ━━━
${castBlock}

━━━ THE FIELD ━━━
${field}

━━━ AUTUMN ATMOSPHERE ━━━
${atmosphere}
${activity ? `\n━━━ WHAT'S HAPPENING ━━━\n${activity}\n` : ''}
${detail ? `━━━ ONE SMALL TOUCH RIDING ALONG ━━━\n${detail}\n\n` : ''}━━━ CAMERA ━━━
${camera}
${character && animal ? `\n━━━ ANIMAL COMPANY ━━━\n${animal}\n` : ''}
${magic ? `━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n\n` : ''}${
    character
      ? `render a warm, unhurried autumn hayride moment — the hay wagon, the draft
horse, and the character all rendered with equal loving richness, never a
bare or empty composition. Every face in the frame, human and animal alike,
stays clearly separate and fully legible, each face keeping its own open
space with a visible gap of air between it and any other face, so every
expression reads clean and unambiguous.`
      : `no human figure anywhere in the frame — this is a warm, unhurried autumn
hayride still-life moment carried entirely by the hay wagon, its draft
horse, and the golden field around it. Also required, clearly and visibly
present in the finished image, not merely implied: ${animal} Rendered with
the same loving richness as the wagon itself, never a bare or empty
composition. Any animal present reads as a real, naturally distinct
creature with open air around it; any small insect, bird, or floating
detail (petals, dust motes, fireflies) stays simple and unposed, with no
invented face or cartoon expression.`
  } no text, no words, no watermarks, gallery quality`;
};
