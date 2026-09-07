#!/usr/bin/env node
/**
 * Seed pools for the two BloomBot Halloween candidates prototyped on AlphaBot:
 * moonlit-flower-garden and overgrown-pumpkin-blooms (Kevin 2026-09-06 — "this
 * is AI, we can go crazy here"). Scaled MVP-25 -> production depth 120
 * (2026-09-07, Kevin: "all approved... move to expanding the seed pools") —
 * append:true grows each pool from its already-tested entries, never
 * overwrites them. Also carries the two Halloween-creature pools added during
 * the enhancement pass (moonlit's SEASON_CREATURE block, overgrown's
 * "Halloween Creature Nod" section) — those never had their own gen script
 * until now.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'bloombot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'moonlit-flower-garden_blooms.json'),
    total: 120,
    append: true,
    metaPrompt: (n) => `Generate ${n} distinct hero-flower descriptions for a MAGICAL MOONLIT flower
scene (a bot that renders flowers as the unmistakable hero, gallery-quality,
hyperreal-CGI register). Each entry names a REAL night-blooming or pale/white
flower species (moonflower vine, night-blooming cereus, evening primrose,
ghost orchid, white datura, night phlox, angel's trumpet, moon garden
jasmine, silver-white dahlia, pale hydrangea, white foxglove, snowdrops,
white lily, casablanca lily, white peony, silver thistle, pearl-white rose,
white anemone, moonstone poppy, etc — vary widely) and describes it with an
otherworldly SILVERY/PALE GLOW quality under moonlight — petals that seem to
catch and hold moonlight, dew like scattered diamonds, a faint inner
luminescence. 15-25 words each. Vary species, growth form (climbing vine,
towering stalk, low carpet, cascading cluster), and specific glow detail
widely — no two entries should feel like the same flower restated. Examples:
["Moonflower vines unfurl their huge white trumpet blooms in slow motion, each petal edge catching moonlight like spun silver thread.", "A cluster of night-blooming cereus opens in perfect unison, their pale ivory petals holding a faint inner luminescence like captured starlight."]

Output ONLY a JSON array of ${n} strings.`,
  },
  {
    outPath: path.join(SEEDS_DIR, 'moonlit-flower-garden_settings.json'),
    total: 120,
    append: true,
    metaPrompt: (n) => `Generate ${n} distinct MOONLIT GARDEN SETTING descriptions for a magical
night-time flower scene (bot renders flowers as the hero, any setting is
just backdrop). Vary widely: an overgrown greenhouse conservatory at night
with cracked glass panes, a moonlit walled garden with crumbling stone,
a misty herb-garden clearing, an old stone fountain courtyard gone wild,
a moonlit orchard, a forgotten graveyard garden reclaimed by blooms
(elegant not creepy), a moonlit greenhouse ruin, a silver birch grove
clearing, a moonlit rooftop garden, a stone circle overgrown with blooms,
etc. 15-25 words each, evocative and atmospheric, describe the STRUCTURE/
PLACE only (no flowers, no moon — those are separate axes). Examples:
["A crumbling stone fountain courtyard, moss thick over cracked flagstones, an old iron gate hanging half-open at the garden's edge.", "An abandoned greenhouse at night, glass panes shattered and vine-choked, moonlight pouring through the broken roof onto the tiled floor below."]

Output ONLY a JSON array of ${n} strings.`,
  },
  {
    outPath: path.join(SEEDS_DIR, 'moonlit-flower-garden_glow.json'),
    total: 120,
    append: true,
    metaPrompt: (n) => `Generate ${n} distinct "money-shot" MOONLIT GLOW PHENOMENON descriptions —
the single most magical visual detail in a moonlit flower scene (the thing
that makes the shot iconic). Vary widely: moonbeams pooling like liquid
silver on a bed of petals, dew drops each holding a tiny reflected moon,
fireflies drifting low between glowing stems, a shaft of moonlight cutting
through mist to spotlight one bloom, silver light rippling across a field of
blooms like water, moon-shadows of petals cast sharp on pale stone, a
spiderweb strung between stems glittering with dew like a net of stars,
petals so pale they seem to glow from within, etc. 15-25 words each,
genuinely magical and beautiful, NEVER scary. Examples:
["A single shaft of moonlight breaks through drifting mist to spotlight one enormous bloom, every other petal in the frame dissolving into soft silver shadow.", "Dew clings to every petal in perfect beads, each one holding a tiny mirrored reflection of the huge moon overhead."]

Output ONLY a JSON array of ${n} strings.`,
  },
  {
    outPath: path.join(SEEDS_DIR, 'overgrown-pumpkin-blooms_transformations.json'),
    total: 120,
    append: true,
    metaPrompt: (n) => `Generate ${n} distinct BOLD, IMPOSSIBLE botanical-fantasy "transformation"
concepts for a Halloween flower-bot render (flowers are always the
unmistakable hero; this path must NOT be a tasteful arrangement with a
pumpkin prop sitting next to it — go all-the-way surreal and impossible).
Split roughly half-and-half between TWO families:
(A) A pumpkin patch being utterly SMOTHERED/RECLAIMED by a riot of wild
flowering vines and blooms — flowers bursting up through pumpkin shells,
vines coiling tightly around ridged pumpkins, blossoms erupting from cracks,
nature consuming the patch in beautiful chaos.
(B) An impossible MONUMENTAL flower-sculpture in the exact SILHOUETTE of a
giant jack-o-lantern or fat ribbed pumpkin — thousands of densely-packed
blooms forming the shape, every petal a "pixel" of the form, a colossal
botanical topiary that is obviously made of flowers, not a real pumpkin.
15-30 words each, vivid and specific, vary species/scale/detail widely.
Examples:
["A pumpkin patch overrun: thick flowering vines coil around every pumpkin, orange blossoms erupting from cracks in the ridged shells, blooms spilling out where the vine has split the rind wide open.", "A colossal jack-o-lantern rises from the field built entirely of packed marigold and chrysanthemum blooms, its grinning triangular eyes and jagged mouth formed from deliberately bare dark soil between the dense orange petals."]

Output ONLY a JSON array of ${n} strings.`,
  },
  {
    outPath: path.join(SEEDS_DIR, 'overgrown-pumpkin-blooms_settings.json'),
    total: 120,
    append: true,
    metaPrompt: (n) => `Generate ${n} distinct SETTING descriptions for a bold Halloween botanical-
fantasy flower scene (structure/place only — no flowers, no pumpkins, those
are separate axes). Vary widely: a rolling autumn field at golden dusk, an
overgrown abandoned farm patch, a misty pumpkin-patch fairground gone wild,
a fog-wreathed hillside orchard, a forgotten roadside farmstand swallowed by
growth, a moonlit rural crossroads, a barn silhouette on the horizon, a
split-rail fence line disappearing into overgrowth, etc. 15-25 words each.
Examples:
["A rolling autumn field at golden dusk, a weathered barn silhouette on the far horizon, split-rail fences half-swallowed by growth.", "An abandoned roadside farmstand, its wooden stall collapsing under years of wild growth, a faded hand-painted sign barely visible."]

Output ONLY a JSON array of ${n} strings.`,
  },
  {
    outPath: path.join(SEEDS_DIR, 'overgrown-pumpkin-blooms_palettes.json'),
    total: 120,
    append: true,
    metaPrompt: (n) => `Generate ${n} distinct AUTUMN/HALLOWEEN COLOR PALETTE directives for a
flower-hero bot render (one intentional florist-designed palette per entry,
never a random color salad). Vary widely across deep orange/rust, burgundy,
black-purple, golden-amber, and mixed-harmony autumn palettes. 10-20 words
each, name 2-4 specific colors/tones. Examples:
["Deep rust-orange and near-black burgundy blooms dominate, with one accent of dusty gold.", "A monochrome study in glowing amber and honey-gold, every petal the same warm family of tones."]

Output ONLY a JSON array of ${n} strings.`,
  },
  {
    outPath: path.join(SEEDS_DIR, 'moonlit-flower-garden_creature.json'),
    total: 120,
    append: true,
    metaPrompt: (n) => `Generate ${n} distinct "Halloween creature" moments for BloomBot's
moonlit-flower-garden path — a mandatory, early-fired detail placed right
after the moon in the prompt. Split roughly half-and-half between TWO
families: (A) a single raven perched among or atop the blooms, glossy black
and unmistakable against the pale petals or cold moonlight; (B) bats in crisp
black silhouette crossing the huge bright moon disc, or skimming low over the
flower-tops in the middle distance. Every entry must read as a CRISP,
UNMISTAKABLE dark silhouette — never faint, distant, or easily missed. 20-35
words each, vivid and specific (perch location, wing position, exact
contrast against moonlight or petals) — vary widely, no two entries should
feel like the same shot restated. Examples:
["A single glossy-black raven perches low among the nearest moonlit blooms, wings folded, head tilted, its silhouette sharp and unmistakable against the pale petals.", "A small kettle of bats wheels in crisp black silhouette directly across the huge glowing face of the moon, their sharp wing-shapes unmistakable against the bright lunar disc."]

Output ONLY a JSON array of ${n} strings.`,
  },
  {
    outPath: path.join(SEEDS_DIR, 'overgrown-pumpkin-blooms_creature_accents.json'),
    total: 120,
    append: true,
    metaPrompt: (n) => `Generate ${n} distinct "Halloween creature nod" accents for BloomBot's
overgrown-pumpkin-blooms path — a mandatory detail that must land in the
first two sentences (right after the hero bloom description) and survive
even a heavy creative rewrite. Split across THREE families: (A) a raven
perched somewhere on or amid the hero bloom-form (apex, shoulder-height,
a curling vine, mid-landing) — glossy black, unmistakable against the warm
bloom color; (B) bats caught mid-flight near the hero form or against the
sky behind it, thin black silhouettes with wings spread; (C) delicate
cobwebs strung between the outermost blooms, beaded with dew or catching
light. Every entry must be BOLD, CRISPLY-EDGED, and UNMISTAKABLE — explicitly
NEVER a faint texture or distant speck. 20-35 words each, vary perch
location / flight position / cobweb placement widely. Examples:
["a single glossy-black raven perched motionless among the topmost blooms, its silhouette a sharp dark accent against the color, head tilted as if surveying the scene", "two or three small bats caught mid-flight against the sky just above the hero form, thin black silhouettes with wings spread mid-beat"]

Output ONLY a JSON array of ${n} strings.`,
  },
];

async function main() {
  for (const r of RECIPES) {
    console.log(`\n=== ${path.basename(r.outPath)} ===`);
    await generatePool(r);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
