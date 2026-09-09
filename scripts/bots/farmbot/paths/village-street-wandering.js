/**
 * FarmBot — village-street-wandering (Phase 2, 2026-09-09).
 *
 * Section 16 example archetype. Place-led (the cobblestone street itself is
 * the hero, always named first) — wandering THROUGH the village, the street
 * and its everyday atmosphere carrying the shot. Deliberately NOT about
 * market goods (that's autumn-village-market's territory — no stalls, no
 * produce crates, no baskets of wares for sale here) — any villager present
 * is just incidentally going about their day, glimpsed in passing, never
 * staged behind a stall.
 *
 * Reuse-heavy per Kevin's brief: leans on the existing CHARACTER_ARCHETYPE
 * (market + leisure tagged, for broader "villager out and about" variety
 * than autumn-village-market's market-only pick) and ACTIVITY pools, plus a
 * small bespoke VILLAGE_STREET_PLACE pool (required directly, NOT added to
 * pools.js, see gen-village-street-place-pool.js) — the existing
 * WORLD_DETAIL_PROPS market-tagged entries turned out to be exclusively
 * produce-crate/barrel/bunting goods-display imagery (autumn-village-
 * market's own territory) with no cobblestone-street/shopfront-architecture
 * content, so a small bespoke place pool was genuinely needed here.
 *
 * No SEASON pool pull — SEASON's entries are landscape-hero (meadows,
 * lakesides, orchard lanes), which would compete with/contradict the
 * street-as-hero place pool; the street reads charming in any season
 * without an explicit pick. WEATHER_ATMOSPHERE IS pulled (full pool,
 * unfiltered, same as quiet-sunset-on-the-porch) since it's light/atmosphere
 * phrasing rather than a competing landscape, and gives real season/weather
 * variety across renders.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared file,
// other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-village-street-place-pool.js
const VILLAGE_STREET_PLACE = require('../seeds/farmbot_village_street_place.json');

// ACTIVITY's tags alone don't distinguish physical setting — several
// chore/leisure entries assume a stream, hayloft, or open dark field/meadow
// (round 1 QA: byTags(ACTIVITY, ['chore','leisure']) let through "seated
// beside a quiet stream, trailing fingertips through the water," and Sonnet
// dutifully invented a whole stream running alongside the cobblestone lane
// to accommodate it — off-premise for a village street). Manual content
// filter excludes those (stream/hay/open-dark-field poses), keeping every
// chore entry plus the street-plausible leisure ones (porch step,
// wildflower-picking along a fence/lane).
const STREET_INCOMPATIBLE_ACTIVITY =
  /\bstream\b|\bhay\b|\brafters\b|\bpicnic blanket\b|\bevening grass\b|\bfireflies\b/i;

module.exports = ({ sharedDNA, picker }) => {
  // Kevin (2026-09-09): "sometimes no human" rule — a pure street still-life
  // (cobblestones, flower boxes, a cat on a stoop) is just as on-brand as a
  // villager passing through. Roll a light headcount instead of a strict
  // binary (autumn-village-market's pattern) since "villagers going about
  // their day incidentally" reads naturally as sometimes one, occasionally
  // two passing each other, mostly not a crowd. Rebalanced 2026-09-09 to
  // the bot-wide 60/40 character/pure-scene split.
  const roll = Math.random();
  const headcount = roll < 0.4 ? 0 : roll < 0.86 ? 1 : 2;

  const characterA =
    headcount >= 1 ? pools.pickCharacter(picker, ['market', 'leisure'], 'street_character_a') : null;
  const characterB =
    headcount >= 2 ? pools.pickCharacter(picker, ['market', 'leisure'], 'street_character_b') : null;

  const place = picker.pickWithRecency(VILLAGE_STREET_PLACE, 'street_place');

  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when a character is present. Broad reuse (chore +
  // leisure, same combination autumn-village-market uses) is intentional
  // here: a baker glimpsed wrapping a loaf at an open shopfront doorway or a
  // villager pausing to pick wildflowers along the lane both read as
  // "incidentally going about their day" on a village street.
  const activity =
    headcount >= 1
      ? picker.pickWithRecency(
          pools
            .byTags(pools.ACTIVITY, ['chore', 'leisure'])
            .filter((desc) => !STREET_INCOMPATIBLE_ACTIVITY.test(desc)),
          'street_activity'
        )
      : null;

  const weather = picker.pickWithRecency(
    pools.WEATHER_ATMOSPHERE.map((e) => e.description),
    'street_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'street_camera');
  const animalChance = headcount === 0 ? 0.6 : 0.35;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low']);
  const animal =
    headcount === 0
      ? pools.pickPureSceneLife(picker, {
          animalPool,
          animalChance,
          ambientTags: ['outdoor'],
          axisPrefix: 'street',
        })
      : Math.random() < animalChance
        ? picker.pickWithRecency(animalPool, 'street_animal')
        : null;
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'street_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE STREET (the hero of the shot) ━━━
${place}
${
  characterA
    ? `\n━━━ ${headcount >= 2 ? 'VILLAGERS' : 'A VILLAGER'} PASSING THROUGH ━━━\n${characterA}\n${characterB || ''}\n`
    : ''
}${activity ? `━━━ WHAT'S HAPPENING (incidental, unposed) ━━━\n${activity}\n\n` : ''}━━━ ATMOSPHERE ━━━
${weather}
${animal ? `\n━━━ AN ANIMAL ABOUT ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  characterA
    ? `render a quiet, charming village-street wandering moment — the cobblestones,
flower boxes, and shopfront architecture rendered with just as much loving
richness as any villager in frame, who reads as passing through the scene
naturally, never posed or staged. This is NOT a market or shopping scene —
no stalls, no goods laid out for sale, no price boards or displays; the
street itself carries the moment. Every face in the frame, human and animal
alike, stays clearly separate and fully legible.`
    : `no human figure anywhere in the frame — this is a quiet, charming village
street still-life moment. The cobblestones, flower boxes, and shopfront
architecture carry the whole scene, rendered with rich loving detail, never
plain or empty. This is NOT a market or shopping scene — no stalls, no
goods laid out for sale, no price boards or displays.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
