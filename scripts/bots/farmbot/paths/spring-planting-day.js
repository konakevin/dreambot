/**
 * FarmBot — spring-planting-day (Phase 1 remainder, 2026-09-08).
 *
 * Season LOCKED to spring. The "new beginnings" energy of spring — a
 * gardener/farm character (or, on a no-human roll, the garden itself)
 * tending freshly turned soil and young seedlings. Built entirely from
 * shared pools: CHARACTER_ARCHETYPE already has two gender-matched
 * "gardener" entries (tagged farm+leisure, trowel-in-hand), ACTIVITY
 * (chore, farm) already has a strawberry-crouching planting-adjacent entry,
 * SEASON(spring) already has a seedlings-breaking-soil entry, and
 * WORLD_DETAIL_PROPS(garden) is rich with garden-bed imagery — no bespoke
 * pool needed (checked pools.js + the seed JSON directly, no real content
 * gap found). PLANTING_ANCHOR below is a small path-local (not pool-file)
 * set of fixed planting-specific lines — not every random SEASON/ACTIVITY
 * draw happens to mention soil/seedlings directly, so this keeps every
 * render legibly ABOUT planting regardless of what else gets rolled.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Small path-local anchor set (not a shared pool — no other path needs
// this) so the render is always unmistakably a PLANTING scene even when
// neither the SEASON nor ACTIVITY pick happens to mention soil/seedlings.
const PLANTING_ANCHOR = [
  'Neat rows of freshly turned dark soil hold a handful of just-set seedlings and a scatter of open paper seed packets, a wooden trowel and a small tin watering can left close at hand.',
  'A shallow trench of dark, crumbly soil waits half-filled with tiny seedling starts, a woven seed basket and a battered garden fork resting on the nearby grass.',
  'Small paper seed packets are fanned open beside a row of tucked-in seedlings, the dark soil still damp and freshly turned, a tin watering can standing ready close by.',
  'A row of little clay pots holds young seedlings ready to go into the ground, set beside a patch of freshly dug dark soil, a wooden dibber and a coil of garden twine resting nearby.',
];

// pools.byTags() treats a literal "ANY" tag as always-passing regardless of
// the requested filter tags (by design, e.g. for CHARACTER_ARCHETYPE) — but
// ACTIVITY has 10 entries tagged ["leisure","ANY"] (sitting with tea,
// watching sunset, counting stars) that silently bypassed a
// byTags(ACTIVITY, ['chore','farm']) filter here, undermining this path's
// whole premise (the ACT of planting). Round 1 QA traced it live: 2 of 2
// character renders drew a leisure/ANY pose instead of a chore action.
// Filter manually so only genuine chore+farm entries are eligible.
const PLANTING_ACTIVITIES = pools.ACTIVITY.filter(
  (e) => e.tags.includes('chore') && e.tags.includes('farm')
).map((e) => e.description);

module.exports = ({ sharedDNA, picker }) => {
  // This path's whole concept is the ACT of planting, so lean human a
  // little more than the ~70% baseline (Kevin 2026-09-09 "sometimes no
  // human" rule) — but a no-human round still reads fine as a strong
  // garden still-life via PLANTING_ANCHOR below.
  const includeCharacter = Math.random() < 0.6;

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['farm', 'leisure'], 'spring_planting_character')
    : null;
  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when a character is present.
  const activity = includeCharacter
    ? picker.pickWithRecency(PLANTING_ACTIVITIES, 'spring_planting_activity')
    : null;
  const anchor = picker.pickWithRecency(PLANTING_ANCHOR, 'spring_planting_anchor');
  const props = picker.pickWithRecency(
    pools.byTags(pools.WORLD_DETAIL_PROPS, ['garden']),
    'spring_planting_props'
  );
  const season = picker.pickWithRecency(pools.byTags(pools.SEASON, ['spring']), 'spring_planting_season');
  const weather = picker.pickWithRecency(
    pools.byTags(pools.WEATHER_ATMOSPHERE, ['spring']),
    'spring_planting_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'spring_planting_camera');
  const animalChance = includeCharacter ? 0.35 : 0.7;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'spring_planting_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'spring_planting',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'spring_planting_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}${character ? `━━━ THE CHARACTER ━━━\n${character}\n\n` : ''}${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ THE PLANTING ━━━
${anchor}

━━━ THE SETTING (a spring planting day) ━━━
${props}
${season}
${weather}
${animal ? `\n━━━ ANIMAL COMPANY ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a hopeful, new-beginnings spring planting moment — the character
and the setting rendered with equal loving richness, hands, soil, and
seedlings all clearly legible, never a bare or empty composition. Every
face in the frame, human and animal alike, stays clearly separate and
fully legible.`
    : `no human figure anywhere in the frame — this is a hopeful, new-beginnings
spring planting moment carried entirely by the freshly worked garden and
whatever animal life is in it, never a bare or empty composition.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
