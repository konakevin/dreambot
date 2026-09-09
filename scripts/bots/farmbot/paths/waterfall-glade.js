/**
 * FarmBot — waterfall-glade (new path, 2026-09-09, closes the "waterfalls"
 * gap in Kevin's original 17-section creative-direction brief — section 2,
 * "THE WORLD," explicitly listed waterfalls alongside forests/lakes/rivers,
 * but a full grep of every seed pool found zero waterfall content anywhere
 * in FarmBot until this path).
 *
 * Built and tested via ALPHABOT FIRST per the standing new-path rule
 * (ALPHABOT.md) — NOT wired into farmbot/index.js until Kevin reviews and
 * signs off. See gen-waterfall-glade-place-pool.js's header for the full
 * pool-content reasoning.
 *
 * Section 16 example archetype. Place-led (the waterfall — specifically the
 * FALLING, MOVING water itself — is the hero, always named first) —
 * deliberately distinct from every existing water-adjacent path:
 *   - summer-evening-by-the-pond.js's POND_PLACE — a small, STILL pond.
 *   - lakeside-riverside-moment.js's LAKESIDE_RIVERSIDE_PLACE — wide open,
 *     largely still water, far shoreline.
 *   - fishing-dock.js's FISHING_DOCK_PLACE — the DOCK STRUCTURE is the hero,
 *     water is secondary background.
 *   - woodland-walk.js's WOODLAND_WALK_PLACE — a forest setting, no water
 *     feature at all.
 *   - THIS path's WATERFALL_GLADE_PLACE — the CASCADING water itself, small
 *     and personal in scale (Kevin's brief: "personal in scale," never a
 *     huge Niagara-scale feature), tumbling over mossy rocks into a small
 *     clear pool, is always the described hero.
 *
 * Uses 3 path-bespoke pools (required directly from JSON — NOT added to
 * pools.js, shared file, other agents may be editing it concurrently):
 *   - WATERFALL_GLADE_PLACE — the hero waterfall+pool setting.
 *   - WATERFALL_GLADE_ACTIVITY — character-only actions specific to wading/
 *     sitting/splashing at a small waterfall pool (the shared ACTIVITY pool
 *     has no genuine waterfall content — same reasoning as fishing-dock.js's
 *     FISHING_DOCK_ACTIVITIES).
 *   - WATERFALL_GLADE_WILDLIFE — animals drinking or playing at the pool
 *     (the shared ANIMAL_COMPANIONS pool is exclusively farmyard-baby-animal
 *     content with no water-adjacent wildlife — same reasoning as
 *     fishing-dock.js's DOCK_WILDLIFE).
 * All 3 built at full 120-entry depth per the current fleet convention
 * (confirmed against the Fall/Halloween 9-path seasonal build, which shifted
 * from FarmBot's original MVP-25 convention to full-depth-from-the-start on
 * new content).
 *
 * ⭐ ANIMAL-SPOTLIGHT ORDERING (applied from the start, 2026-09-09 lesson,
 * mirrors barn-animal-shelter-interior.js's exact pattern): the ANIMAL
 * COMPANY block is placed BEFORE the CHARACTER block whenever both are
 * present, headed with the neutral "ANIMAL COMPANY" label (never "A
 * VISITOR"/"A COMPANION"), and drawn from a pool written with descriptive
 * richness comparable to a character description — not a throwaway
 * afterthought.
 *
 * CAMERA_COMPOSITION is filtered (not pulled raw) — several entries assume a
 * physical setting incompatible with an outdoor waterfall glade (farmhouse
 * window, barn doorway, village lane/rooftops, cozy interior) or carry
 * dwarfing/scale-dissolution language the CLAUDE.md hard rule explicitly
 * bans for this path ("tiny within a sweeping landscape," "rendered tiny,"
 * "dwarfed," "sky dominating," "rolling"/"sweeping" fields) — same class of
 * gotcha documented on fishing-dock.js and the mango-orchard-harvest
 * pool-scale-up lesson (FARMBOT_PATH_BUILD_STATE.md). Filtered locally here
 * rather than editing the shared pool file.
 *
 * No SEASON winter tag pulled — a waterfall described as flowing/cascading
 * throughout WATERFALL_GLADE_PLACE would contradict a frozen/snow-locked
 * winter atmosphere pick, same reasoning as woodland-walk.js.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pools — required directly, NOT added to pools.js (shared
// file, other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-waterfall-glade-place-pool.js
// scripts/gen-seeds/farmbot/gen-waterfall-glade-activity-pool.js
// scripts/gen-seeds/farmbot/gen-waterfall-glade-wildlife-pool.js
const WATERFALL_GLADE_PLACE = require('../seeds/farmbot_waterfall_glade_place.json');
const WATERFALL_GLADE_ACTIVITY = require('../seeds/farmbot_waterfall_glade_activity.json');
const WATERFALL_GLADE_WILDLIFE = require('../seeds/farmbot_waterfall_glade_wildlife.json');

// CAMERA_COMPOSITION entries that assume a physical setting incompatible
// with an outdoor waterfall glade, or that carry dwarfing/scale-dissolution
// language the CLAUDE.md hard rule bans outright for this path ("character
// tiny/dwarfed in a sweeping landscape," "sky dominating," back-turned/
// over-the-shoulder framing). See header note.
const CAMERA_INCOMPATIBLE =
  /\bfarmhouse window\b|\bbarn doorway\b|\bvillage\b|\brooftop|\bcottage|\binterior\b|\brolling\b|\bsweeping\b|\bnestled small\b|\btiny\b|\bdwarfed\b|\bestablishing shot\b|\bsky dominating\b|\bover-the-shoulder\b|\bback[- ]turned\b/i;
const WATERFALL_GLADE_CAMERA = pools.CAMERA_COMPOSITION.filter((c) => !CAMERA_INCOMPATIBLE.test(c));

module.exports = ({ sharedDNA, picker }) => {
  // "Sometimes no human" rule, standardized fleet-wide (Kevin 2026-09-09):
  // a waterfall glade with nobody there — just the falling water, the mossy
  // pool, and whatever gentle creature shares it — is just as charming as
  // one with a character wading in.
  const includeCharacter = Math.random() < 0.6;

  const waterfall = picker.pickWithRecency(WATERFALL_GLADE_PLACE, 'waterfall_glade_place');

  // Boost wildlife odds when there's no human subject to carry the frame,
  // same pattern as pond/lakeside/woodland/fishing-dock.
  const animalChance = includeCharacter ? 0.5 : 0.85;
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(WATERFALL_GLADE_WILDLIFE, 'waterfall_glade_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool: WATERFALL_GLADE_WILDLIFE,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'waterfall_glade',
      });

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['ANY', 'leisure', 'farm'], 'waterfall_glade_character')
    : null;

  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when a character is present.
  const activity = includeCharacter
    ? picker.pickWithRecency(WATERFALL_GLADE_ACTIVITY, 'waterfall_glade_activity')
    : null;

  const season = picker.pickWithRecency(
    pools.byTags(pools.SEASON, ['spring', 'summer', 'autumn', 'ANY']),
    'waterfall_glade_season'
  );
  const weather = picker.pickWithRecency(
    pools.byTags(pools.WEATHER_ATMOSPHERE, ['spring', 'summer', 'autumn', 'ANY']),
    'waterfall_glade_weather'
  );
  const camera = picker.pickWithRecency(WATERFALL_GLADE_CAMERA, 'waterfall_glade_camera');
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'waterfall_glade_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE WATERFALL (the hero of the shot) ━━━
${waterfall}
A small, personal-scale, magical-feeling countryside waterfall — never a huge or dramatic
Niagara-scale feature — tumbling gently over mossy rocks into a small, clear, inviting pool close
at hand, the kind of place you could walk right up to and wade into.
${animal ? `\n━━━ ANIMAL COMPANY ━━━\n${animal}\n` : ''}${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ SEASON & ATMOSPHERE ━━━
${season}
${weather}

━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried moment at a small countryside waterfall — the falling water, the
clear mossy pool, the character, and any animal present all rendered with equal loving richness,
never a bare or empty composition. Every face in the frame, human and animal alike, stays clearly
separate and fully legible, each keeping its own open pocket of air around it.`
    : `no human figure anywhere in the frame — this is a warm, unhurried moment at a small
countryside waterfall carried entirely by the falling water, the clear mossy pool, and whatever
gentle creature shares it, every detail rendered with equal loving richness, never a bare or empty
composition.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (dragonflies, petals, dust motes) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
