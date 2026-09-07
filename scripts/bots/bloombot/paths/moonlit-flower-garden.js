/**
 * BloomBot candidate — moonlit-flower-garden (prototyped on AlphaBot).
 *
 * Kevin (2026-09-06): "we have real opportunities to make 'moonlit' flower
 * scenes... this is AI, we can go crazy here." A genuinely magical, eerie-
 * beautiful moonlit garden at night — real night-blooming species (moonflower,
 * night-blooming cereus, evening primrose, ghost orchid, white datura) under
 * a huge harvest moon, silvery glow, dew like scattered diamonds. MAGICAL,
 * never scary — the moon and the glowing blooms are the co-stars.
 */

const MOON_BLOOMS = require('../seeds/moonlit-flower-garden_blooms.json');
const GARDEN_SETTINGS = require('../seeds/moonlit-flower-garden_settings.json');
const GLOW_PHENOMENA = require('../seeds/moonlit-flower-garden_glow.json');
const SEASON_CREATURE = require('../seeds/moonlit-flower-garden_creature.json');

// re-QA R2, 2026-09-06: avg 1.67/5 across 3 renders — 0 of 3 read as Halloween
// at all (two were indistinguishable from a generic spring/fantasy moonlit
// flower field; the third landed on a stray render from a sibling path with
// zero pumpkin content despite its own prompt demanding one). Root cause
// traced to THIS path's own template, not the render engine: the
// NON-NEGOTIABLE MANDATE above never mentions Halloween/harvest/autumn at
// all, and the OLD HARVEST_ACCENTS pool below was this path's only possible
// seasonal marker — yet only 1 of its 5 entries mentioned anything
// pumpkin/harvest-coded ("a few pale ghostly-white pumpkins"), worded to be
// literally invisible ("ghostly-white" blends into the path's own silver
// palette; "nestled low" tells Flux to de-emphasize it), and it was the LAST
// content block before the closing palette line — the exact
// buried-trailing-accent failure this repo has already root-caused twice on
// the sibling gothic-harvest-florals path (see that file's R2/R4 notes):
// Flux/Sonnet anchor on whatever is named FIRST and treat a late, softly-
// worded accent as droppable flavor. FIX (this path's own pool + template
// order only): renamed to SEASON_SIGNATURE, every entry rewritten to be
// unmistakably Halloween/harvest-coded (real orange pumpkins, jack-o'-
// lanterns, candlelit gourds, autumn leaf-litter — never "ghostly-white" or
// "nestled low"), made structurally mandatory and prominent, and moved to
// fire FIRST in the returned template (ahead of the hero blooms) so it reads
// as this scene's establishing subject rather than a trailing garnish —
// still magical/never-scary per the mandate above, just no longer optional
// or invisible.
// re-QA R3, 2026-09-06: avg well below bar — 2 of 3 renders drew the
// spiderweb entry (was index 3) and came back with ZERO visible Halloween
// signal: no webs, no warm accent, nothing but a generic pink/silver flower
// garden. Root cause: spiderwebs and bare leaf-litter are fine, flat,
// low-color-fill textures that the mandatory dense bloom-mass (and the
// wrapper's "flowers are the hero, setting is only backdrop" framing)
// visually swallows whole, even when Sonnet's narrative describes them at
// length. Only the solid, opaque, self-luminous orange objects (pumpkins,
// jack-o'-lanterns — indices 0-2) survived into the actual pixels, and the
// one render that drew one of those (a jack-o'-lantern row) was the only one
// of the three that read as Halloween at all. FIX: every entry now anchors
// on a solid, warm-glowing pumpkin/gourd object rather than a fragile
// texture alone, so no draw from this pool can render invisible.
// re-QA R4, 2026-09-07: avg 3.87/5 across 3 renders. Two (open-path settings,
// signature = the pumpkin CLUSTER or ROW entries) read strongly as Halloween
// and scored well. The third -- an enclosed stone-fountain-courtyard setting
// paired with the SINGLE-jack-o-lantern signature entry ("at the base of the
// blooms") -- came back with NO visible moon at all (zero sky in frame) and
// the jack-o-lantern itself reduced to a barely-legible speck: the same
// mass-swallows-small-anchor failure this file already root-caused twice,
// now claiming the MOON too. The mandate paragraph calls the moon a
// "co-star hero," but unlike the season signature and hero blooms, the moon
// never got its OWN structurally-mandatory, early-fired callout -- it was
// only prose-mentioned in the opening paragraph and the closing coda line,
// so in a tightly-enclosed setting under the monumental dominating bloom
// mass, it was the first thing Flux dropped. FIX (template wording only):
// give the moon the identical treatment already proven to work for
// pumpkins -- a dedicated, mandatory, early-fired block that explicitly
// forbids cropping it out even in an enclosed courtyard setting.
// R1 creative push, 2026-09-07 (Kevin, direct creative note -- not a defect
// pass): "these are all really good... a few more nods to halloween --
// maybe some bats, or a raven perched amongst the flowers." Neither had
// ANY presence anywhere in this template. Applying the same anti-swallow
// engineering this file already proved twice above (solid opaque anchor +
// mandatory + fired early, never a fragile trailing texture): a new
// SEASON_CREATURE pool + its own dedicated early block, positioned right
// after the moon so it reads as a second establishing detail rather than
// background garnish. Ravens perch low IN the bloom mass (Kevin's exact
// image) and bats are specifically silhouetted AGAINST the huge bright
// moon disc -- the highest-contrast, most failure-proof placement
// available in this scene, since the moon itself is already
// non-negotiable and dominant.
// R2 creative push, 2026-09-07 (Kevin, direct creative note, same brief as
// R1 -- push further, don't chase a numeric bar): re-QA'd the R1 creature
// pool across 3 renders. Result: the moon held in all 3 (its closing-line
// echo below, "a black-indigo night sky with a huge dominant moon," is
// still doing its job), but the creature itself survived into the final
// rendered prompt in only 1 of 3 (the bats-across-the-moon render) -- the
// other two (a birch-grove archway shot and a standing-stones wildflower
// shot) dropped it completely, along with the season signature in the
// standing-stones one. Same root cause this file has now traced three
// times: an early, one-time mandatory mention gets out-narrated and
// dropped once the setting's own imagery (birches, megaliths) gives the
// brief-writer somewhere richer to spend its words -- UNLESS that element
// also gets a second, closing-line echo, which is exactly why the moon
// alone has held 3/3 while everything else drawn early-only has not. FIX
// (closing palette line only): give the Halloween creature the identical
// second mention already proven for the moon, tying it directly to the
// moon's own clause so the two reinforce each other structurally instead
// of the creature being a one-shot early mention.
// R3 creative push, 2026-09-07 (Kevin, direct creative note, same brief --
// final round, still not chasing a numeric bar): re-QA'd the R2 closing-
// line-echo fix across 3 fresh renders (courtyard/jack-o'-lantern-path,
// rooftop/pumpkin-pile, rose-fountain-courtyard). Result: WORSE than R2 --
// the creature dropped out of the final written prompt in 3 of 3, not 1 of
// 3. Diagnosed the difference between the creature block and the season
// signature block, which has held 3/3 since R_QA3 despite firing from the
// same "early, one mandatory mention" position: the season signature's
// header uses an explicit NARRATIVE-ORDERING instruction ("NAME THIS
// FIRST, BEFORE THE FLOWER SPECIES") that tells the brief-writer *where in
// its own prose* to place the element, whereas the creature header only
// asserted a RENDERING constraint ("MUST BE CLEARLY VISIBLE... survives
// the densest bloom-mass") -- true of the pixels, useless as narrative
// guidance, so the brief-writer had nothing telling it to actually spend
// opening-paragraph words on the creature and quietly cut it. Compounding
// that, the R2 closing echo pointed back at the creature only by reference
// ("the Halloween creature named above") rather than repeating any of its
// actual content -- unlike the moon's own closing echo, which restates a
// concrete phrase ("a huge dominant moon"), not just "the moon named
// above." A pure back-reference gives the compressor nothing left to grab
// once the early mention is already gone. FIX (template wording only, two
// changes): (1) copied the season signature's proven ordering phrasing
// onto the creature header -- "NAME THIS SECOND, IMMEDIATELY AFTER THE
// MOON AND BEFORE ANY FLOWER SPECIES," written into the opening narrative
// paragraph, not just described as a rendering requirement; (2) replaced
// the referential closing echo with a concrete one naming the creature
// itself ("a raven or a bat rendered as a crisp dark silhouette, in the
// blooms or against the moon") so the closing line carries real content
// the way the moon's does, instead of a pointer back to an early mention
// that may already be gone.
const SEASON_SIGNATURE = [
  'a cluster of real, unmistakably orange pumpkins and curling harvest gourds sits prominently in the near foreground, moonlight and warm candle-glow both catching their ribbed skin',
  "a row of small jack-o'-lanterns lines the garden path into the middle distance, each face carved and candlelit, their warm amber glow pushing back against the cool moonlight",
  'a single large jack-o-lantern glows warmly from within at the base of the blooms, its candlelit grin the one warm-colored anchor in the whole silver-blue frame',
  'small carved pumpkins nestle at the foot of the archway, their candlelit orange glow catching in the thick, heavy spiderwebs strung overhead between the stems, moon-bright dew glittering across the silk above the warm pumpkin light',
  'a heaped pile of real orange pumpkins and curling harvest gourds rises from a deep drift of fallen autumn leaves in rust, amber and deep gold, their candlelit glow marking the season as unmistakably as the moon overhead',
];

module.exports = ({ picker }) => {
  const bloom = picker.pickWithRecency(MOON_BLOOMS, 'moonlit_bloom');
  const setting = picker.pickWithRecency(GARDEN_SETTINGS, 'moonlit_setting');
  const glow = picker.pickWithRecency(GLOW_PHENOMENA, 'moonlit_glow');
  const creature = picker.pickWithRecency(SEASON_CREATURE, 'moonlit_creature');
  const seasonSignature = SEASON_SIGNATURE[Math.floor(Math.random() * SEASON_SIGNATURE.length)];

  return `━━━ NON-NEGOTIABLE MANDATE ━━━
This is a MAGICAL, ENCHANTED moonlit HALLOWEEN garden — beautiful and
awe-inspiring, NEVER scary, NEVER horror-toned. A huge low harvest moon and
the glowing night-blooming flowers are the two co-star heroes of the frame,
but the scene must read unmistakably as an autumn/Halloween-season garden,
never a generic spring or summer moonlit field. Every other element is set
dressing around the moon and the blooms.

━━━ THE MOON — MUST BE PHYSICALLY VISIBLE IN THE SKY. NON-NEGOTIABLE, even
when the setting below is an enclosed courtyard, walled garden, or fountain
plaza: the composition MUST open onto a real patch of black-indigo night
sky (over a wall, through a collapsed roof, between branches) so the moon
is plainly present, never implied, never cropped out just because the
blooms dominate the foreground ━━━
An enormous, low-hanging harvest moon fills a large portion of the visible
sky directly above the garden, its heavy ivory light spilling straight down
onto the scene below.

━━━ THE HALLOWEEN CREATURE — NAME THIS SECOND, IMMEDIATELY AFTER THE MOON AND
BEFORE ANY FLOWER SPECIES. Write it directly into your opening narrative
paragraph as a solid, sharp-edged silhouette (never a faint or half-hidden
shape, never a detail saved for later, never dropped in favor of describing
the flowers first) ━━━
${creature}

━━━ THE SEASON SIGNATURE — NAME THIS FIRST, BEFORE THE FLOWER SPECIES. This
is the one detail that makes the scene read as Halloween/harvest rather than
a generic moonlit garden — it must be prominent and unmistakable in the
frame, never a small background afterthought ━━━
${seasonSignature}

━━━ THE HERO BLOOMS ━━━
${bloom}

━━━ THE SETTING ━━━
${setting}

━━━ THE MONEY SHOT — moonlit glow ━━━
${glow}

render every named species as that exact species in its named color, the
entire palette locked to deep midnight blue-black shadow, cold silver
moonlight and pale indigo-violet, with warm candlelit amber reserved for the
season signature above — every petal, leaf, and stone bathed in cool lunar
light, depth built from receding layers of more blooms and clearly-rendered
scenery, a black-indigo night sky with a huge dominant moon, and a raven or
a bat rendered as a crisp, unmistakable dark silhouette — perched low amid
the nearest blooms or cutting across the moon's bright face — never
omitted, never faint, every layer crisply rendered`;
};
