/**
 * FarmBot — barn-animal-shelter-interior (Phase 2, 2026-09-09).
 *
 * Section 16 example archetype. Hybrid of animal-feeding-time.js's
 * animal-heavy pattern and artisan-workshop.js's place-led interior
 * pattern: the warm INTERIOR of a barn/animal shelter (hay loft, wooden
 * stalls, tools on the wall, dappled light through slats) is a named-first
 * hero setting via the path-bespoke BARN_INTERIOR_PLACE pool, AND
 * ANIMAL_COMPANIONS is leaned on heavily — "a barn full of resting animals
 * is the whole point."
 *
 * WORLD_DETAIL_PROPS checked directly first (per FARMBOT_PATH_BUILD_STATE.md's
 * "verify against the actual JSON, don't trust a claim" lesson) — only 3/40
 * entries even mention "barn," and all three describe rain barrels sitting
 * BESIDE a barn door from the OUTSIDE (no hay loft, no stalls, no tools on
 * a wall, no slatted interior light) — zero genuine interior coverage,
 * confirming the bespoke BARN_INTERIOR_PLACE pool (required directly from
 * its JSON — NOT added to pools.js) was genuinely needed. See
 * gen-barn-interior-place-pool.js for the full pool-content reasoning
 * (including two bans baked in proactively: metaphorical light-as-object
 * language, and per-object personification of a repeated row of objects).
 *
 * ANIMAL_COMPANIONS NOTE: this path does NOT use a bare density-tag filter
 * (`byTags(ANIMAL_COMPANIONS, ['medium','high','chaos'])`, animal-feeding-
 * time.js's pattern) — checked the full pool content directly and most
 * medium/high/chaos entries describe an OUTDOOR-only setting incompatible
 * with a barn interior (a garden bed, a mud puddle, a vegetable patch, a
 * cottage window, a farmhouse mudroom) — the same "tags describe topic, not
 * physical-setting compatibility" gotcha documented on village-street-
 * wandering.js. Manually content-filtered instead to the 7 entries that are
 * physically barn-interior-compatible (hay/loft/gate/fence-slats/"feeding
 * time" language, no outdoor-only cues) — see BARN_ANIMALS below. This
 * subset already skews toward higher density (4 of the 7 describe
 * multi-animal gatherings, not just one animal), matching the brief's
 * "medium/high density" intent.
 *
 * ACTIVITY NOTE: also manually filtered (NOT `byTags`) — `byTags(ACTIVITY,
 * ['chore','farm'])` would leak every `['leisure','ANY']`-tagged entry too
 * (the exact bypass documented on spring-planting-day: 'ANY' always passes
 * regardless of requested tags). Filtered by explicit tag AND (`chore` AND
 * `farm`, not OR) plus a content keyword match for barn-appropriate chores
 * only (brushing a pony, feeding chickens, gathering eggs) — laundry lines,
 * strawberry picking, and outdoor bird feeders are chore/farm-tagged too
 * but setting-incompatible with a barn interior.
 *
 * SECTION-ORDER FIX (round 1 → round 3, found via DB `ai_prompt` inspection
 * across 2 rounds, NOT by eyeballing the image — the same technique
 * documented on rainy-farmhouse-morning.js, which had already hit and
 * solved this exact class of bug): round 1 came back with 2/3 renders'
 * Sonnet-written Flux prompt cut off MID-WORD ("...His skin is light with
 * soft warm peachy undert" / "...its ears soft rounded triang") — the
 * shared `botEngine.js` `callClaude()` call for the main brief uses a fixed
 * `maxTokens: 400` (not something a single path can change), and this
 * path's brief is denser than most (a full bespoke PLACE paragraph AND a
 * full ANIMAL_COMPANIONS paragraph, on top of character/activity/weather/
 * camera). With the original CHARACTER-then-ANIMALS ordering, a verbose
 * character pick exhausted the budget before Sonnet ever reached the
 * animals — a hard defect for a path whose entire point is "a barn full of
 * resting animals." First fix attempt moved ANIMALS to right after PLACE
 * (still behind PLACE) — round 2 confirmed animal MENTIONS now survived in
 * all 3 renders, but one render (a wide, heavily-elaborated barn-corridor
 * shot) still came back with the animal invisible in the actual image: the
 * prompt spent nearly its entire budget elaborating the architecture in
 * rich multi-sentence detail (stall latches, wood grain, hinges) and only
 * got one short, truncated sentence into the animal at the very end, which
 * Flux then under-weighted. This is rainy-farmhouse-morning.js's own
 * documented lesson: Sonnet's brief→Flux-prompt compression reliably drops
 * or thins content that appears LATE, independent of whether a hard token
 * cutoff is even reached — content positioned early survives with real
 * weight, content positioned late does not. Fixed by moving THE ANIMALS to
 * the very FIRST line of the template, ahead of even THE BARN INTERIOR
 * place block, with explicit "required, concrete, clearly-visible" framing
 * (mirroring the rain-window mandate's wording) rather than a plain
 * section label. Verified via 3 fresh round-3 renders.
 *
 * No SEASON pool pull — same reasoning as artisan-workshop.js: SEASON's
 * entries are landscape-hero (meadows, lakesides, orchard lanes), which
 * would compete with/dilute the barn-interior-as-hero place pool.
 * WEATHER_ATMOSPHERE IS pulled (full pool, unfiltered) since it's
 * light/atmosphere phrasing rather than a competing outdoor landscape, and
 * the global split-diptych fix (FARMBOT_COZY_NEUTRAL) already keeps any
 * window/doorway-glimpsed exterior as one continuous shot with the
 * interior.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared file,
// other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-barn-interior-place-pool.js
const BARN_INTERIOR_PLACE = require('../seeds/farmbot_barn_interior_place.json');

// Manual content filter (not a bare density-tag byTags) — see header note.
// Barn-interior-compatible signal words (hay/loft/gate/fence-slats/"feeding
// time") minus anything carrying an outdoor-only cue (garden, puddle,
// cottage window, stone wall, mudroom, etc).
const BARN_SIGNAL = /\b(hay|barn|loft|gate|fence slats|feeding time)\b/i;
const OUTDOOR_ONLY = /\b(garden|yard|clover|puddle|mudroom|cottage|stone wall|lettuce|carrot|sunflower|watering can|mud|window(sill)?|curtain)\b/i;
const BARN_ANIMALS = pools.ANIMAL_COMPANIONS.filter(
  (e) => BARN_SIGNAL.test(e.description) && !OUTDOOR_ONLY.test(e.description)
).map((e) => e.description);

// Manual STRICT tag-AND filter (not byTags — its 'ANY' always-pass would
// leak leisure entries), then a content filter for barn-appropriate chores
// only (a pony being groomed, chickens being fed, eggs being gathered —
// laundry lines and strawberry picking are chore/farm-tagged too but
// setting-incompatible with a barn interior).
const BARN_ACTIVITY = pools.ACTIVITY.filter(
  (e) => e.tags.includes('chore') && e.tags.includes('farm') && /\b(pony|chicken|egg)\b/i.test(e.description)
).map((e) => e.description);

module.exports = ({ sharedDNA, picker }) => {
  // "Sometimes no human" rule — an empty barn interior full of resting,
  // sheltered animals is charming on its own, maybe even the STRONGER
  // default for this particular path. ~65% chance of a character.
  const includeCharacter = Math.random() < 0.6;

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['farm', 'animal'], 'barn_interior_character')
    : null;

  const place = picker.pickWithRecency(BARN_INTERIOR_PLACE, 'barn_interior_place');

  // Animals are the whole point of this path — always pulled, character or
  // not (the barn is never empty of life even when it's empty of people).
  const animals = picker.pickWithRecency(BARN_ANIMALS, 'barn_interior_animals');

  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when a character is present. Skip the pick and the
  // whole section without one.
  const activity = includeCharacter
    ? picker.pickWithRecency(BARN_ACTIVITY, 'barn_interior_activity')
    : null;

  const weather = picker.pickWithRecency(
    pools.WEATHER_ATMOSPHERE.map((e) => e.description),
    'barn_interior_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'barn_interior_camera');
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'barn_interior_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE ANIMALS (present in every render — establish these first, before anything else in the frame; this is the whole point of the scene, a required, concrete, clearly-visible presence, not just background mood) ━━━
${animals}

━━━ THE BARN INTERIOR (the hero setting) ━━━
${place}
${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ ATMOSPHERE ━━━
${weather}

━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a cozy, sheltered barn-interior moment — the hay loft, wooden
stalls, and tools on the wall surround close at hand on every side, filling
the frame with real texture and detail, the animals resting and settled
throughout the space rendered just as richly and lovingly as the character
caring for them, who is never a small figure lost in an empty barn. Every
face in the frame, human and animal alike, stays clearly separate and fully
legible, each keeping its own open pocket of air around it so every
expression reads clean and unambiguous.`
    : `no human figure anywhere in the frame — this is a cozy, sheltered
barn-interior scene. The hay loft, wooden stalls, and tools on the wall
surround close at hand on every side, filling the frame with real texture
and detail, and the animals resting and settled throughout carry the whole
gentle moment, each one full of its own distinct personality and charm.
Every animal face stays clearly separate and fully legible, its own open
pocket of air around it, so every expression reads clean and unambiguous.`
} no text, no words, no watermarks, gallery quality`;
};
