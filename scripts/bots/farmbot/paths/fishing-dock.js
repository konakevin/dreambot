/**
 * FarmBot — fishing-dock (Phase 2, 2026-09-09).
 *
 * Section 16 example archetype. Place-led (the small wooden dock STRUCTURE
 * itself is the hero, always named first) — deliberately distinct from both
 * existing water-adjacent paths:
 *   - summer-evening-by-the-pond.js's POND_PLACE — a small, intimate POND is
 *     the hero (lily pads, stepping stones, backyard-scale).
 *   - lakeside-riverside-moment.js's LAKESIDE_RIVERSIDE_PLACE — the WIDE
 *     OPEN WATER itself is the hero (far shoreline, broad lake/river).
 *   - THIS path's FISHING_DOCK_PLACE — the DOCK STRUCTURE is the hero
 *     (weathered planks, a coiled rope, a fishing rod against a post, a
 *     bucket, a moored rowboat); the water is glimpsed AROUND and BELOW the
 *     dock as secondary background, never the described wide subject.
 * Uses the path-bespoke FISHING_DOCK_PLACE pool (required directly, NOT
 * added to pools.js — shared file, other agents may be editing it
 * concurrently). See gen-fishing-dock-place-pool.js.
 *
 * No shared ACTIVITY entry fits standing/sitting at a fishing dock at all —
 * the pool's leisure-tagged entries assume hay/rafters, a porch step, a
 * picnic blanket, or a generic stream (checked pools.js directly: the same
 * "tags describe topic, not physical-setting compatibility" gotcha
 * documented on village-street-wandering). Rather than force an
 * incompatible reuse, FISHING_DOCK_ACTIVITIES below is a small path-local
 * (not pool-file) set of genuine dock/fishing actions — same pattern as
 * flower-shop.js's FLOWER_SHOP_ACTIVITIES and spring-planting-day's
 * PLANTING_ANCHOR.
 *
 * No shared ANIMAL_COMPANIONS pull either — that pool is exclusively
 * farmyard-baby-animal content (calves, baby goats) with no water-adjacent
 * wildlife, and the brief specifically wants "herons or ducks nearby." A
 * small path-local DOCK_WILDLIFE array (heron, ducks, a jumping fish,
 * dragonflies) fills that role authentically instead, same reasoning as the
 * ACTIVITY swap above.
 *
 * No SEASON pull — SEASON's entries are landscape-hero (meadows, lakesides,
 * orchard lanes), which would compete with/contradict the dock-as-hero
 * place pool, same reasoning as village-street-wandering and flower-shop.
 * WEATHER_ATMOSPHERE IS pulled (full pool, unfiltered) for light/atmosphere
 * variety across renders.
 *
 * CAMERA_COMPOSITION IS filtered (round 2 fix, see below) — it's an
 * untagged "applies universally" pool, but several of its entries assume a
 * physical setting a small outdoor dock doesn't have (a farmhouse window, a
 * barn doorway, a village lane/rooftops, a "rolling fields" landscape) and
 * structurally contradict this path's own "the dock fills the foreground,
 * never distant" instruction. Round-1 QA caught exactly this: the "High
 * angle looking softly down over the village rooftops" entry combined with
 * the dock proximity sentence to produce a wide aerial village panorama
 * with only a mooring post left in tight close-up — off-brief scope creep
 * away from the dock-structure-as-hero premise (diagnosed via the render's
 * actual stored `ai_prompt`, not by eyeballing the image). Same class of
 * bug as village-street-wandering's ACTIVITY-tag mismatch: an untagged/
 * loosely-tagged pool's entries don't know what physically fits together.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// CAMERA_COMPOSITION entries that assume a physical setting incompatible
// with a small outdoor dock (farmhouse window, barn doorway, village lane/
// rooftops, open rolling-fields landscape, indoor coziness) or that
// contradict this path's own "dock fills the foreground, never distant"
// instruction ("nestled small," "tiny within... landscape"). See header.
const CAMERA_INCOMPATIBLE =
  /\bfarmhouse window\b|\bbarn doorway\b|\bvillage (street|rooftops)\b|\brolling( ,)? landscape\b|\brolling fields\b|\bcottages\b|\bcozy interior\b|\bnestled small\b|\btiny within\b|\bestablishing shot\b/i;
const FISHING_DOCK_CAMERA = pools.CAMERA_COMPOSITION.filter((c) => !CAMERA_INCOMPATIBLE.test(c));

// Path-bespoke pool — required directly, NOT added to pools.js (shared
// file, other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-fishing-dock-place-pool.js
const FISHING_DOCK_PLACE = require('../seeds/farmbot_fishing_dock_place.json');

// Small path-local anchor set (not a shared pool — no other path needs
// genuine dock/fishing actions) since the shared ACTIVITY pool has no
// content that fits a fishing dock at all.
const FISHING_DOCK_ACTIVITIES = [
  'Casting a fishing line out over the calm water with a slow, practiced flick of the wrist, watching the little float settle and bob gently.',
  'Sitting on the edge of the dock with legs dangling above the water, both hands loosely holding a fishing rod propped against one shoulder.',
  'Reeling a line in slow, even turns, eyes fixed on the spot where the water ripples out from the hook.',
  'Baiting a hook with careful fingers, a small open tin of bait resting on the planks close at hand.',
  'Kneeling on the dock to coil a length of rope into a neat loop, looping it back over the worn mooring post.',
  'Untying a small rowboat from its mooring cleat, one hand steady on the post and the other guiding the rope free.',
  'Mending a small tear in a fishing net spread across the knees, fingers working a length of twine through the gap.',
  'Leaning back against a weathered post with a fishing rod resting lightly across the lap, watching the water without any hurry at all.',
];

// Small path-local wildlife set (not the shared ANIMAL_COMPANIONS pool,
// which is exclusively farmyard-baby-animal content with no water-adjacent
// creatures) — the brief specifically wants herons or ducks nearby the
// dock. Described holistically, never with per-object personification.
const DOCK_WILDLIFE = [
  'A heron stands statue-still at the far edge of the dock, one leg tucked up, watching the water without a ripple of movement.',
  'A pair of ducks paddle quietly near the pilings, leaving two soft trailing wakes across the still water.',
  'A small fish breaks the surface near the dock with a single quiet splash, rings of ripples spreading slowly outward.',
  'A dragonfly hovers and darts low over the water beside the dock, its wings catching the light in brief flashes.',
  'A trio of ducks drifts past the end of the dock in an unhurried line, barely disturbing the calm surface.',
];

module.exports = ({ sharedDNA, picker }) => {
  // "Sometimes no human" rule (Kevin 2026-09-09) — an empty dock at dawn
  // with a heron standing watch is just as charming as a figure fishing
  // from the end of it.
  const includeCharacter = Math.random() < 0.6;

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['market', 'leisure'], 'fishing_dock_character')
    : null;

  const dock = picker.pickWithRecency(FISHING_DOCK_PLACE, 'fishing_dock_place');

  // ACTIVITY-shaped entries are only meaningful when a character is
  // present (implied human subject).
  const activity = includeCharacter
    ? picker.pickWithRecency(FISHING_DOCK_ACTIVITIES, 'fishing_dock_activity')
    : null;

  const weather = picker.pickWithRecency(
    pools.WEATHER_ATMOSPHERE.map((e) => e.description),
    'fishing_dock_weather'
  );
  const camera = picker.pickWithRecency(FISHING_DOCK_CAMERA, 'fishing_dock_camera');

  // Boost wildlife odds when there's no human subject to carry the frame,
  // same pattern as pond/lakeside/flower-shop.
  const wildlifeChance = includeCharacter ? 0.4 : 0.7;
  const wildlife = includeCharacter
    ? Math.random() < wildlifeChance
      ? picker.pickWithRecency(DOCK_WILDLIFE, 'fishing_dock_wildlife')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool: DOCK_WILDLIFE,
        animalChance: wildlifeChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'fishing_dock_wildlife',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'fishing_dock_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE DOCK (the hero of the shot) ━━━
${dock}
The weathered planks, the mooring post, and every worn prop on the dock
fill the frame right at hand in the foreground — a small, close, humble
wooden structure you could reach out and touch, never a distant sliver of
water glimpsed from far off. The calm water stays a quiet backdrop glimpsed
around and beneath the boards.
${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ ATMOSPHERE ━━━
${weather}
${wildlife ? `\n━━━ NEARBY ON THE WATER ━━━\n${wildlife}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried moment at a small fishing dock — the dock's own
weathered planks and props, and the character, rendered with equal loving
richness, never a bare or empty composition. Every face in the frame, human
and animal alike, stays clearly separate and fully legible, each keeping
its own open space with a visible gap of air between it and any other face.`
    : `no human figure anywhere in the frame — this is a warm, unhurried moment
at a small fishing dock carried entirely by the dock's own weathered planks
and props and whatever wildlife shares the water nearby, every detail
rendered with equal loving richness, never a bare or empty
composition.${wildlife ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
