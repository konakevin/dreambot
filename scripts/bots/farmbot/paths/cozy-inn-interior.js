/**
 * FarmBot — cozy-inn-interior (Phase 2, 2026-09-09).
 *
 * Section 16 example archetype. Place-led (the inn's common room itself is
 * the hero, always named first) — the warm public common room of a small
 * village inn: a crackling communal hearth, several worn wooden tables
 * ringed by mismatched chairs/stools/benches, a hanging rack of tankards,
 * a well-loved rug, maybe a cat by the fire. Uses the path-bespoke
 * COZY_INN_INTERIOR_PLACE pool (required directly from its JSON — NOT
 * added to pools.js, see gen-cozy-inn-interior-place-pool.js).
 *
 * ARCHETYPE GAP FOUND (2026-09-09): the tracker/brief for this path said
 * "CHARACTER_ARCHETYPE already has an innkeeper archetype — check for it
 * and use it." Checked directly against the actual seeded
 * farmbot_character_archetype.json (27 entries): there is NO innkeeper
 * entry. FARMBOT_CREATIVE_DIRECTION.md's section-3 role list (line 83)
 * names "innkeeper" as planned alongside potter/carpenter/fisher, but only
 * flower seller / café owner / village herbalist / village shopkeeper /
 * baker / farm girl / shepherd / gardener / weaver / traveling-adventurer
 * ever actually got seeded — innkeeper (and potter/carpenter/fisher) never
 * made it into the real pool. Since this agent may not touch pools.js,
 * this path instead pulls the closest-fitting existing archetypes via tags
 * ['bakery', 'leisure', 'market'] — café owner is the nearest real analog
 * to an innkeeper (serves food/drink, welcoming counter-side demeanor),
 * with village herbalist / shopkeeper / weaver / traveling-adventurer
 * filling the "patron warming up inside" role. This naturally excludes the
 * farm-labor-only archetypes (farm girl, shepherd — no bakery/leisure/
 * market tag), which don't belong in an inn common room. Flag for whoever
 * eventually builds artisan-workshop / fishing-dock next: their tracker
 * briefs make the SAME "already has potter/carpenter/fisher" assumption —
 * it is equally false, verify against the actual JSON before relying on it.
 *
 * DELIBERATELY DISTINCT from rainy-farmhouse-morning (also a warm-hearth
 * indoor mood path) per Kevin's brief: different furniture (a room full of
 * worn tables/mismatched chairs/benches + a serving counter + tankard rack,
 * vs. one rocking chair, a window seat, a spinning wheel), different scale
 * (a communal room built to seat many travelers vs. one family's cozy
 * nook), different social feel (a public gathering space strangers pass
 * through vs. a private farmhouse kitchen). See the bespoke pool's own
 * header comment for the full reasoning — WORLD_DETAIL_PROPS' existing
 * `indoor` entries were checked first and rejected as too single-family
 * in scale, hence the new pool.
 *
 * No SEASON/WEATHER_ATMOSPHERE pull — same reasoning as village-street-
 * wandering's SEASON skip: this is a fully enclosed public room (only
 * some of the 25 place-pool entries even carry a window), and the place
 * pool already bakes in its own light-quality variety (hushed pre-dawn,
 * golden afternoon, lamplit evening) — pulling outdoor weather/season
 * risks contradicting an entry that has no window at all, for no real
 * gain since the room's own warmth already carries the mood.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared file,
// other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-cozy-inn-interior-place-pool.js
const COZY_INN_INTERIOR_PLACE = require('../seeds/farmbot_cozy_inn_interior_place.json');

module.exports = ({ sharedDNA, picker }) => {
  // "Sometimes no human" rule (Kevin 2026-09-09) — an empty inn common room
  // by firelight (the hearth, the mismatched chairs, a cat dozing on the
  // hearthstone) is just as charming as one with a person in it.
  const includeCharacter = Math.random() < 0.6;

  const place = picker.pickWithRecency(COZY_INN_INTERIOR_PLACE, 'cozy_inn_place');

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['bakery', 'leisure', 'market'], 'cozy_inn_character')
    : null;
  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when a character is present. Restricted to the true
  // chore+bakery intersection (indoor kitchen/serving tasks — ladling soup,
  // wrapping a warm loaf, glazing a cake) — the ONLY ACTIVITY entries that
  // read as an indoor task rather than an outdoor farm chore or a leisure
  // pose tied to a porch/stream/hay-loft/picnic-blanket setting (every
  // leisure-tagged entry in this pool assumes an outdoor setting
  // incompatible with an enclosed common room — the "tags describe topic,
  // not physical setting" gotcha, see FARMBOT_PATH_BUILD_STATE.md).
  const activity = includeCharacter
    ? picker.pickWithRecency(
        pools.ACTIVITY.filter((e) => e.tags.includes('chore') && e.tags.includes('bakery')).map(
          (e) => e.description
        ),
        'cozy_inn_activity'
      )
    : null;
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'cozy_inn_camera');
  // A dozing cat by the hearth is exactly the "cozy companion" this brief
  // calls for — filtered dynamically off ANIMAL_COMPANIONS' own cat/kitten
  // entries (same pattern as rainy-farmhouse-morning) rather than the bare
  // density tags, which would otherwise just as easily surface an outdoor
  // barnyard animal that has no business inside a public common room.
  // `chaos`-tagged entries excluded — a multi-animal pileup fights the
  // quiet mood. The place pool itself already features a cat in a few
  // entries — this is an optional ADDITIONAL featured-animal moment on top,
  // same pattern as woodland-walk's rabbits/lakeside-riverside's herons.
  const catEntries = pools.ANIMAL_COMPANIONS.filter(
    (e) => /\b(cat|kitten)s?\b/i.test(e.description) && !e.tags.includes('chaos')
  ).map((e) => e.description);
  const animalChance = includeCharacter ? 0.35 : 0.6;
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(catEntries, 'cozy_inn_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool: catEntries,
        animalChance,
        ambientTags: ['indoor'],
        axisPrefix: 'cozy_inn',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'cozy_inn_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE COMMON ROOM (the hero of the shot) ━━━
${place}
${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING (a quiet, unhurried task, warmed by the hearth) ━━━\n${activity}\n\n` : ''}${animal ? `━━━ A QUIET COMPANION ━━━\n${animal}\n\n` : ''}━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried inn-common-room moment — the character rendered
just as lovingly as the room around them, the hearth, tables, and hanging
tankards rich with cozy, lived-in detail, never bare or plain. This is a
PUBLIC gathering room, not a private family kitchen. Every face in the
frame, human and animal alike, stays clearly separate and fully legible,
each with its own open pocket of air around it.`
    : `no human figure anywhere in the frame — this is a warm, contented
inn-common-room still-life moment. The room itself carries the whole frame
entirely on its own — the hearth, the worn tables and mismatched chairs,
the hanging tankards and dried herbs — rendered with rich, lived-in,
lovingly detailed warmth, never bare or plain. This is a PUBLIC gathering
room, not a private family kitchen.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
