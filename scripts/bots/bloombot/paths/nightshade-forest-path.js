/**
 * BloomBot candidate — nightshade-forest-path (prototyped on AlphaBot).
 *
 * Kevin (2026-09-07): "spooky forest paths with nightshade flowers drenching
 * the scene — it's like a scary scene with beautiful flowers — makes it
 * interesting." Deliberate departure from BloomBot's usual "never scary"
 * rule: the SETTING is genuinely eerie/unsettling (unlike every other
 * BloomBot path), but the nightshade blooms themselves must still render
 * lush and magnificent — the tension between a scary place and gorgeous
 * flowers is the whole point.
 */

const NIGHTSHADE_BLOOMS = require('../seeds/nightshade-forest-path_blooms.json');
const FOREST_SETTINGS = require('../seeds/nightshade-forest-path_settings.json');
const SCARY_ATMOSPHERE = require('../seeds/nightshade-forest-path_atmosphere.json');

// R3 QA (2026-09-07, final round — Kevin's own review of R1-R3, all "really
// good", asked again for more bats/raven-among-the-flowers): STILL 0 of 3
// sampled R3 renders showed a legible bat, raven, cobweb, or moon, even
// after R2's fix (welding the nod onto the tail of the bloom sentence).
// Diagnosed why by comparing the 3 delivered prompts line-by-line against
// these seed pools: SETTING and ATMOSPHERE sentences survive into the final
// narrative almost verbatim and land early-to-mid in the piece (e.g. one
// delivered prompt's "Nothing here had fallen. That was the first wrong
// thing" is a near-exact lift of an atmosphere line below) — but the BLOOM
// sentence consistently gets written LAST, and in 2 of the 3 delivered
// prompts the piece is truncated mid-sentence at almost exactly the point
// the bloom description (and the nod riding on its tail) would continue,
// right before the boilerplate closer. The nod was surviving the write,
// then getting cut on the way out because of WHERE it was welded, not
// because it was ignored. Fix: move the weld off the bloom and onto the
// ATMOSPHERE line instead — the pool that already proved most reliably
// transcribed, and whose "one uncanny concrete observation" register a
// raven/bat/cobweb detail fits naturally as its own sentence (not a
// subordinate clause, which compresses away more easily than an
// independent beat).
const HALLOWEEN_NODS = [
  'A raven perched directly among the massed blooms, head cocked, feathers glossy black against the petals.',
  'Bats cut silent, swooping arcs through the gaps in the canopy just above the flowers.',
  "A spider's web strung heavy with dew hangs between two of the nearest blooms, its threads catching the cold light.",
  'A swollen harvest moon hangs low through the branches behind the bloom-mass, pale and half-veiled.',
  'A raven perches low on a bent stem among the flowers, watching in silence, its shape stark black against the color.',
  'A scatter of bats crosses silently in front of a pale moon glimpsed through the canopy just overhead.',
];

module.exports = ({ picker }) => {
  const bloom = picker.pickWithRecency(NIGHTSHADE_BLOOMS, 'nightshade_bloom');
  const setting = picker.pickWithRecency(FOREST_SETTINGS, 'nightshade_setting');
  const atmosphere = picker.pickWithRecency(SCARY_ATMOSPHERE, 'nightshade_atmosphere');
  const nod = HALLOWEEN_NODS[Math.floor(Math.random() * HALLOWEEN_NODS.length)];
  // Weld the same nod onto the atmosphere sentence, as its own standalone
  // beat, NOT the bloom sentence — see comment above.
  const atmosphereWithNod = `${atmosphere} ${nod}`;

  return `━━━ NON-NEGOTIABLE MANDATE — SCARY PLACE, GORGEOUS FLOWERS ━━━
This path is a deliberate exception to the usual "never scary" rule: the
SETTING must read as genuinely eerie and unsettling — a real sense of dread,
not a cozy autumn stroll. But the nightshade blooms themselves are the
unmistakable hero and must render lush, magnificent, and botanically
beautiful throughout — vivid, richly detailed, never wilted or ugly. The
whole point is the tension between a scary place and gorgeous flowers.
Palette is LOCKED to deep near-black greens, bruised purple-black, and cold
thin moonlight — never warm, sunny, or golden-daylight light.

━━━ MANDATORY HALLOWEEN DETAIL — must be clearly, unmistakably visible, not merely implied ━━━
${nod} This is not a passing mood note — it must appear as a concrete,
unmissable visual element in the frame.

━━━ THE HERO BLOOMS — real gothic/poisonous nightshade-family species ━━━
${bloom}

━━━ THE FOREST PATH SETTING ━━━
${setting}

━━━ THE MONEY SHOT — the eerie atmosphere ━━━
${atmosphereWithNod}

render every named species as that exact species in its named color, depth
built from receding layers of more blooms, gnarled trees, and
clearly-rendered path, the canopy dense and looming rather than an open
sky, every layer crisply rendered`;
};
