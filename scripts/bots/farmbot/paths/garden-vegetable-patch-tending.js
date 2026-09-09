/**
 * FarmBot — garden-vegetable-patch-tending (Phase 2, 2026-09-08).
 *
 * Place-led (an established, working VEGETABLE garden is the hero) —
 * ongoing tending across any warm-season stretch (weeding, watering,
 * harvesting ripe vegetables), NOT tied to first planting. Kept distinct
 * from spring-planting-day (SEASON-LOCKED to spring, about the ACT of
 * FIRST planting bare freshly-turned soil with just-set seedlings): this
 * path is season-open (summer/autumn only, biased toward harvest
 * abundance — no spring/winter, see below) and about a FULL, LEAFY,
 * ALREADY-ESTABLISHED patch heavy with ripe produce, weeds to pull, rows
 * to water.
 *
 * Content review BEFORE writing (per the build brief — this path was
 * flagged as a likely reuse-only candidate, same premise as
 * village-street-wandering's original intent):
 *   - WORLD_DETAIL_PROPS's 19 "garden"-tagged entries are almost entirely
 *     a DECORATIVE FLOWER/COTTAGE-GARDEN register (lavender, foxglove,
 *     rose arches, wind chimes, birdhouses, bunting) — only 1/19 even
 *     mentions a vegetable, none describe raised beds/rows/a
 *     trellis/a scarecrow. Wrong register for a working vegetable patch.
 *   - ACTIVITY's 12 chore+farm entries have no weeding/watering/vegetable-
 *     harvest action at all (closest: 2 strawberry-picking entries — a
 *     fruit, not a vegetable, and already thin).
 *   - CHARACTER_ARCHETYPE does have 2 gender-matched "gardener" entries
 *     (tagged farm+leisure) — reused directly, no gap there.
 *   Conclusion: a genuine content gap existed for the PLACE (the working
 *   vegetable-patch structure itself) AND for the core TENDING ACTION —
 *   both addressed below. No gap for the character layer.
 *
 * Bespoke pool: VEGETABLE_GARDEN_PLACE (25, required directly from its
 * JSON — NOT added to pools.js, see
 * gen-seeds/farmbot/gen-vegetable-garden-place-pool.js), same pattern as
 * POND_PLACE / FLOWER_FIELD_PLACE / ORCHARD_AFTERNOON_PLACE / etc. Covers
 * raised beds/rows, trellises, ripe vegetables, tools, a scarecrow — never
 * the ornamental flower-garden register WORLD_DETAIL_PROPS(garden) already
 * owns, and never freshly-dug bare soil with just-set seedlings (that's
 * spring-planting-day's PLANTING_ANCHOR).
 *
 * TENDING_ACTIVITIES: a small path-local action set (not a shared pool —
 * same pattern as spring-planting-day.js's PLANTING_ANCHOR, added because
 * no shared pool has weeding/watering/harvesting-specific actions) so the
 * "what's happening" section is ALWAYS legibly about tending the patch
 * when a character is present, rather than risking an off-topic
 * chore/leisure pick from the generic ACTIVITY pool undermining the whole
 * path's premise (the exact failure mode documented for spring-planting-day
 * round 1 in FARMBOT_PATH_BUILD_STATE.md).
 *
 * Season/weather: no SEASON pool pick — its spring/summer/autumn entries
 * each describe a DIFFERENT whole landscape (orchard lane, lakeside reeds,
 * a lamb meadow, a hay-dotted field) that would compete with the bespoke
 * garden setting rather than support it (same class of risk as
 * orchard-afternoon's reasoning for skipping SEASON). WEATHER_ATMOSPHERE
 * is pure light/air/atmosphere with no competing landscape nouns, so it
 * carries the season signal instead — filtered to summer/autumn/ANY only
 * (excludes spring, too early for an established ripe patch; excludes
 * winter, incompatible with lush leafy rows), matching the "ongoing
 * tending across any season... bias toward summer/autumn harvest
 * abundance" brief.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared
// file, other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-vegetable-garden-place-pool.js
const VEGETABLE_GARDEN_PLACE = require('../seeds/farmbot_vegetable_garden_place.json');

// Path-local (not a shared pool — no other path needs this) tending-action
// set, gerund-phrased with an implied subject to match the shared ACTIVITY
// pool's own convention, so it drops into the same "WHAT'S HAPPENING" slot.
// Guarantees the path's core premise (weeding/watering/harvesting) shows
// up even though the shared ACTIVITY pool has no such entries.
const TENDING_ACTIVITIES = [
  'Kneeling beside a row of vegetables, pulling a stray weed free from the dark soil and setting it aside on a small growing pile.',
  'Tipping a watering can slowly along a row of leafy vegetables, a thin stream darkening the soil at the base of each stem.',
  'Reaching into a bushy tomato plant to twist a ripe red tomato free by its stem, setting it gently into a half-filled basket.',
  'Crouching at the edge of a raised bed, easing a fat carrot up out of the loosened soil by its leafy green top.',
  'Snipping a head of lettuce free at its base with a small pair of garden shears, tucking it into a woven basket already holding a few others.',
  'Working a hand trowel through the soil around a row of young vegetables, loosening the dirt and pulling free the weeds tangled at the roots.',
  'Gathering a double handful of freshly pulled beets by their leafy tops, setting them down beside a nearly full wicker basket.',
  "Running a gentle hand along a bean vine climbing its trellis, checking the pods' ripeness before plucking a handful into a waiting bowl.",
];

module.exports = ({ sharedDNA, picker }) => {
  // Kevin (2026-09-09): "sometimes no human" rule — an empty ripe vegetable
  // garden, heavy with produce and left with tools resting mid-task, is
  // just as charming as a person tending it. ~65% chance of a character.
  const includeCharacter = Math.random() < 0.6;

  const place = picker.pickWithRecency(VEGETABLE_GARDEN_PLACE, 'garden_vegetable_place');

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['farm', 'leisure'], 'garden_vegetable_character')
    : null;

  // Only meaningful when a character is present (implied human subject).
  const activity = includeCharacter
    ? picker.pickWithRecency(TENDING_ACTIVITIES, 'garden_vegetable_activity')
    : null;

  const weather = picker.pickWithRecency(
    pools.byTags(pools.WEATHER_ATMOSPHERE, ['summer', 'autumn', 'ANY']),
    'garden_vegetable_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'garden_vegetable_camera');

  const animalChance = includeCharacter ? 0.4 : 0.75;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'garden_vegetable_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'garden_vegetable',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'garden_vegetable_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE VEGETABLE GARDEN (the hero of the shot) ━━━
${place}
${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING (tending the patch) ━━━\n${activity}\n\n` : ''}━━━ ATMOSPHERE ━━━
${weather}
${animal ? `\n━━━ ANIMAL COMPANY ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried vegetable-patch tending moment — the garden and
the character rendered with equal loving richness, the ripe vegetables,
tools, and soil all clearly legible, never a bare or empty composition.
Every face in the frame, human and animal alike, stays clearly separate
and fully legible.`
    : `no human figure anywhere in the frame — this is a warm, quietly
abundant vegetable garden moment carried entirely by the leafy rows, ripe
produce, and tools left resting close at hand, and whatever animal life
shares it, never a bare or empty composition.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
