/**
 * FarmBot — artisan-workshop (Phase 2, 2026-09-09).
 *
 * Section 16 example archetype. Place-led (the workshop interior itself is
 * the hero, always named first) — a cozy indoor artisan's workshop: a
 * potter's wheel, a loom, wood-carving tools, shelves of finished handmade
 * goods (pottery, woven baskets, carved figures). Uses the path-bespoke
 * ARTISAN_WORKSHOP_PLACE pool (required directly from its JSON — NOT added
 * to pools.js, see gen-artisan-workshop-place-pool.js) as the setting
 * anchor, same pattern as village-street-wandering.js/POND_PLACE/etc.
 * WORLD_DETAIL_PROPS has zero workshop-interior coverage (checked directly —
 * no entry mentions wheel/loom/carving/kiln/clay), confirming the bespoke
 * pool was genuinely needed, same reasoning documented on
 * village-street-wandering.js.
 *
 * CHARACTER ARCHETYPE NOTE: the brief for this path assumed CHARACTER_ARCHETYPE
 * already had potter/weaver/carpenter entries. Checked directly — only ONE
 * matching entry existed ("weaver," despite the pool's own original
 * meta-prompt explicitly listing potter/carpenter as options — they never
 * survived generation/dedup). Appended exactly 4 new entries (potter x2,
 * carpenter x2, gender-balanced) via
 * gen-character-archetype-artisan-append.js — additive only, same
 * format/tag convention as the existing weaver entry
 * (["leisure","ANY",gender]), does not touch or remove anything else in the
 * shared pool. `pools.js` itself was NOT edited.
 *
 * pickCharacter() is NOT used here — its tag-filter is an OR-match against
 * the shared "leisure"/"ANY" tag vocabulary with no dedicated "artisan" tag,
 * so passing tags directly would leak every other leisure/ANY archetype
 * (gardener, herbalist, café owner, former adventurer, etc.) in — the exact
 * byTags()-OR-match gotcha documented in FARMBOT_PATH_BUILD_STATE.md.
 * Instead this file manually content-filters CHARACTER_ARCHETYPE down to
 * potter/weaver/carpenter only, then locally mirrors pickCharacter's
 * archetype+hairstyle+hair-color+eye-color+skin-tone combination logic
 * (pickArtisanCharacter, below) using the same shared axis pools.
 *
 * ACTIVITY NOTE: the shared ACTIVITY pool has zero craft-specific entries
 * (checked directly — no wheel/loom/carving/whittling actions), and
 * generic chore/leisure entries (kneading dough, hanging laundry) would be
 * off-premise for a workshop. Since potter/loom/carving-bench crafts use
 * mutually exclusive tools, a mismatched activity here would be a real
 * defect (a "carpenter" character described as "guiding a shuttle through
 * the loom"), not just flavor variance — so this path defines a small local
 * ARTISAN_ACTIVITY pool, craft-tagged, and picks only from the activity
 * matching whichever archetype's craft was actually picked.
 *
 * No SEASON pool pull — SEASON's entries are landscape-hero (meadows,
 * lakesides, orchard lanes, same reasoning as village-street-wandering.js),
 * which would compete with/dilute the workshop-interior-as-hero place pool.
 * WEATHER_ATMOSPHERE IS pulled (full pool, unfiltered, same as
 * cozy-bakery-afternoon.js and village-street-wandering.js) since it's
 * light/atmosphere phrasing rather than a competing outdoor landscape, and
 * the global split-diptych fix (FARMBOT_COZY_NEUTRAL) already keeps any
 * window-glimpsed exterior light as one continuous shot with the interior.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared file,
// other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-artisan-workshop-place-pool.js
const ARTISAN_WORKSHOP_PLACE = require('../seeds/farmbot_artisan_workshop_place.json');

// Manual content filter (not byTags) — see the header note above. No
// dedicated "artisan" tag exists on CHARACTER_ARCHETYPE, so a tag-based
// filter can't isolate potter/weaver/carpenter without leaking every other
// leisure/ANY-tagged role in.
const ARTISAN_ARCHETYPE = pools.CHARACTER_ARCHETYPE.filter((e) =>
  /\b(potter|weaver|carpenter)\b/i.test(e.description)
);

// Craft-specific "what's happening" lines, tagged by craft so the picked
// activity always matches the picked archetype's own tools (a carpenter
// never gets handed a weaver's loom action). Phrased as gerund actions with
// an implied human subject, same convention as the shared ACTIVITY pool —
// only meaningful when a character is present.
const ARTISAN_ACTIVITY = [
  {
    craft: 'potter',
    description:
      'Cupping both hands gently around a spinning lump of wet clay, coaxing its wall slowly upward into a tall, even curve.',
  },
  {
    craft: 'potter',
    description:
      'Running a smoothing rib along the rim of a half-formed bowl, pausing to dip fingertips into a bowl of water before continuing.',
  },
  {
    craft: 'potter',
    description:
      'Lifting a freshly glazed bowl from a low shelf to inspect it in the light, turning it slowly by its rim.',
  },
  {
    craft: 'weaver',
    description:
      "Guiding a shuttle through the loom's open shed, drawing the weft thread snug against the woven cloth with a practiced tug.",
  },
  {
    craft: 'weaver',
    description:
      'Threading a fresh coil of dyed yarn onto a wooden bobbin, winding it steadily with an easy, practiced rhythm.',
  },
  {
    craft: 'weaver',
    description:
      'Weaving a fresh strand of willow into the rim of a half-finished basket, tucking each end neatly under the last.',
  },
  {
    craft: 'carpenter',
    description:
      'Drawing a chisel along the grain of a half-carved wooden figure, curls of pale wood peeling away with each careful stroke.',
  },
  {
    craft: 'carpenter',
    description:
      'Sanding the smoothed edge of a finished stool with slow, even strokes, brushing away the fine dust with the back of one hand.',
  },
  {
    craft: 'carpenter',
    description:
      'Running a plane along a long strip of pale wood, a thin curling shaving lifting away in one continuous ribbon.',
  },
];

function craftOf(archetypeEntry) {
  const d = archetypeEntry.description.toLowerCase();
  if (/\bpotter\b/.test(d)) return 'potter';
  if (/\bweaver\b/.test(d)) return 'weaver';
  if (/\bcarpenter\b/.test(d)) return 'carpenter';
  return null;
}

// Mirrors pools.pickCharacter's combination logic (archetype + gender-matched
// hairstyle + hair color + eye color + skin tone) but draws the archetype
// from the manually content-filtered ARTISAN_ARCHETYPE subset above, and
// also returns which craft was picked so the caller can match the activity.
function pickArtisanCharacter(picker, axisPrefix) {
  const archetype = picker.pickWithRecency(ARTISAN_ARCHETYPE, `${axisPrefix}_archetype`);
  const gender = pools.genderOf(archetype) || 'ANY';
  const hairstyle = picker.pickWithRecency(pools.byTags(pools.HAIRSTYLE, [gender]), `${axisPrefix}_hairstyle`);
  const hairColor = picker.pickWithRecency(pools.byTags(pools.HAIR_COLOR, ['ANY']), `${axisPrefix}_hair_color`);
  const eyeColor = picker.pickWithRecency(pools.byTags(pools.EYE_COLOR, ['ANY']), `${axisPrefix}_eye_color`);
  const skinTone = picker.pickWithRecency(pools.byTags(pools.SKIN_TONE, ['ANY']), `${axisPrefix}_skin_tone`);
  return {
    craft: craftOf(archetype),
    description: `${archetype.description}
Hair: ${hairColor} Styled: ${hairstyle}
Eyes: ${eyeColor}
Skin: ${skinTone}`,
  };
}

module.exports = ({ sharedDNA, picker }) => {
  // "Sometimes no human" rule — an empty workshop still-life (a wheel
  // mid-throw, a loom strung and waiting, shelves of finished goods) is just
  // as charming as a potter/weaver/carpenter at work. ~65% chance of a
  // character.
  const includeCharacter = Math.random() < 0.6;

  const picked = includeCharacter ? pickArtisanCharacter(picker, 'workshop_character') : null;
  const character = picked ? picked.description : null;

  const place = picker.pickWithRecency(ARTISAN_WORKSHOP_PLACE, 'workshop_place');

  // ACTIVITY is craft-matched to the picked archetype — only meaningful (and
  // only physically coherent) when a character is present. See header note.
  const activity =
    picked && picked.craft
      ? picker.pickWithRecency(
          ARTISAN_ACTIVITY.filter((a) => a.craft === picked.craft).map((a) => a.description),
          'workshop_activity'
        )
      : null;

  const weather = picker.pickWithRecency(
    pools.WEATHER_ATMOSPHERE.map((e) => e.description),
    'workshop_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'workshop_camera');
  const animalChance = includeCharacter ? 0.35 : 0.6;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'workshop_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['indoor'],
        axisPrefix: 'workshop',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'workshop_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE WORKSHOP (the hero of the shot) ━━━
${place}
${animal ? `\n━━━ AN ANIMAL ABOUT (present in this render — a required, concrete, clearly-visible detail, not just background mood) ━━━\n${animal}\n` : ''}
${
  character
    ? `\n━━━ THE ARTISAN ━━━\n${character}\n`
    : ''
}${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ ATMOSPHERE ━━━
${weather}

━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a cozy, absorbing artisan-workshop moment — the workshop's own tools,
half-finished work, and shelves of handmade goods surround close at hand on
every side, filling the frame with real craft detail, rendered with just as
much loving richness as the artisan at work, who is never a small figure
lost in an empty room. Every face in the frame, human and animal alike,
stays clearly separate and fully legible.`
    : `no human figure anywhere in the frame — this is a cozy, absorbing
workshop still-life moment. The potter's wheel or loom or carving bench, the
half-finished work left mid-project, and the shelves of handmade goods carry
the whole scene, filling the frame close at hand on every side, rendered
with rich loving detail, never plain or empty.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
