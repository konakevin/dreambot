#!/usr/bin/env node
// AlphaBot candidate "chibi-halloween-cozy" — MVP-25 seed pools.
//
// Cloned identity target: ChibiBot (no humans ever, chibi-proportioned
// creatures, Pop-Mart-vinyl/Pixar cute register). Concept: an INTIMATE INDOOR
// Halloween moment — 1-2 chibi critters carving a pumpkin by candlelight,
// telling spooky stories under a blanket fort, or roasting marshmallows by a
// jack-o-lantern's glow. Playful + cozy, never real horror.
//
// 5 generated pools (this script) + creature accessories are inlined as a
// plain JS array directly in the path file (short fixed list, no pool needed):
//   chibi_halloween_cozy_creatures.json   — the chibi critter(s), non-human
//   chibi_halloween_cozy_activities.json  — the shared/solo Halloween moment
//   chibi_halloween_cozy_settings.json    — the cozy indoor spot
//   chibi_halloween_cozy_decor.json       — one playful spooky-decor beat
//   chibi_halloween_cozy_glow.json        — MONEY SHOT: the jack-o-lantern /
//                                            candlelight glow signature detail
//
// Run: node scripts/gen-seeds/alphabot/gen-chibi-halloween-cozy-pool.js
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/chibibot/seeds/';

(async () => {
  // ── creatures ────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'chibi_halloween_cozy_creatures.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} chibi CREATURE description entries for a cute Halloween-cozy art bot. Each entry is ONE small, adorable, chibi-proportioned CREATURE — a real baby animal OR a cute fantasy critter — described the same way a designer-vinyl collectible toy would be: species/type, 2-3 unmistakable NON-HUMAN physical features, a warm expression, and a resting pose. NEVER describe age or gender the way you would a person (no "young", "old", "boy", "girl", "man", "woman") — only the creature's own anatomy. NEVER a real-world ethnic or national label. Each entry 20-32 words.

━━━ FORMAT (match this exactly) ━━━
"Baby red fox kit: burnt-orange fluff, oversized black-tipped ears, tiny white chest patch, dewy amber eyes, blushing cheeks, sitting with fluffy tail curled around stubby paws"
"Round little owlet: fluffy cream-and-brown feathers, enormous golden saucer-eyes, tiny tufted ear-feathers, blushing cheeks, perched with wings tucked and head tilted curiously"
"Tiny black cat kit: sleek inky fur, oversized triangle ears, luminous green eyes, a stubby curled tail, blushing cheeks, sitting primly with one paw raised"

━━━ SPECIES TO SPREAD ACROSS ALL ${n} (nocturnal + Halloween-friendly bias, but keep every description itself gentle/cute, never spooky) ━━━
- fox kit, barn owlet, black cat kit, hedgehog pup, bat pup (fuzzy, NOT scary), raccoon kit, red panda cub, field mouse, opossum joey, toad, gray squirrel, little spider critter (round, fuzzy, many-legged but adorable, cartoon-cute never creepy), tiny dragon hatchling, mushroom sprite (fantasy, plant-not-animal features), forest spirit (fantasy, glowing moss/leaf features), round friendly ghost-creature (an actual soft floating CREATURE, not a person in a sheet — no limbs described as human), skunk kit, wolf pup, chibi bear cub, rabbit kit with oversized ears, chinchilla, mole, crow chick, salamander, hamster.

━━━ RULES ━━━
- 2-3 UNMISTAKABLY NON-HUMAN features per entry (paws, snout, fur/feathers/scales/fungal cap, tail, wings, whiskers) so nothing reads as a human in costume.
- Warm, wholesome, blushing-cheeks charm — never menacing, never a "scary monster."
- No text, no brand names, no real-world ethnicity/nationality words.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── activities (the intimate Halloween moment) ──────────────────────
  await generatePool({
    outPath: DIR + 'chibi_halloween_cozy_activities.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} ACTIVITY entries for a cute Halloween-cozy chibi-creature art bot. Each entry is ONE intimate, small-scale INDOOR Halloween moment — a gerund-phrase action a tiny chibi creature (or two, sharing it) is caught doing, written WITHOUT naming the subject (no "the fox" / no pronouns) so it can be paired with any creature and with either a solo or a paired cast. Each entry 14-26 words, comma-separated phrasing, paw/whisker/tail vocabulary implied rather than a human noun.

━━━ FORMAT (match this exactly — no subject noun, just the action + sensory detail) ━━━
"Carving a lopsided grinning face into a pumpkin twice its size, tongue poking out in concentration, curls of orange peel piling up nearby"
"Tucked deep under a quilted blanket-fort with a flashlight, whispering a not-really-scary ghost story, eyes wide with delighted suspense"
"Holding a marshmallow on a bent twig close to the jack-o-lantern's candle-flame, watching it toast golden-brown"

━━━ SPREAD ACROSS ALL ${n} — vary the specific moment, don't repeat the same 3 ━━━
- carving a jack-o-lantern face by candlelight, seeds and pulp scattered nearby
- toasting a marshmallow over a jack-o-lantern's candle-flame
- telling a gently-spooky story under a blanket-fort with a flashlight or lantern
- painting a tiny pumpkin with careful little brushstrokes
- decorating a trick-or-treat pail with stickers and ribbon
- sorting a candy haul into piles by candlelight
- dipping an apple into caramel and rolling it in sprinkles
- stringing a garland of paper bats or felt ghosts along a shelf
- baking spider-web-frosted cookies, flour dusted on a rounded belly
- putting on a shadow-puppet show against a blanket-fort wall by candlelight
- sipping cocoa with a marshmallow-ghost bobbing on top, whiskers dusted with cinnamon
- scooping pumpkin seeds into a bowl to roast, sticky paws and all
- threading a mini witch-hat lantern string along a windowsill
- building a blanket-and-pillow "haunted house" fort with a paper-bat flag on top
- bobbing for a small apple in a basin, ears flopping forward
- wrapping a favorite stuffed toy in a strip of gauze as a friendly "mummy"
- hunting for hidden candy pieces tucked around a cozy room by candlelight
- roasting chestnuts in a little pan over the jack-o-lantern's glow
- drawing a spooky-cute picture with orange and black crayons by lamplight
- curling up with a picture book about friendly ghosts, page half-turned

━━━ RULES ━━━
Every activity stays PLAYFUL and gentle — a "ghost story" is fun-scary, never a real scare; nothing bloody, nothing genuinely frightening. No text, no brand names, no subject noun (start with the gerund).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── settings ─────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'chibi_halloween_cozy_settings.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} SETTING entries for a cute Halloween-cozy chibi-creature art bot. Each is ONE small, warm, INDOOR nook decked out lightly for autumn/Halloween — the intimate stage for a candlelit moment. Each entry 18-30 words, comma-separated phrasing, concrete cozy props.

━━━ FORMAT (match this exactly) ━━━
"A snug living-room hearth corner, knit blankets piled on a low rug, an orange string-light garland looped along the mantel, a fat carved pumpkin glowing on the hearthstone"
"A window-seat nook with cobweb-lace curtains, a stack of quilts and cushions, autumn leaves pressed against the frosted glass, a small lantern flickering on the sill"

━━━ SPREAD ACROSS ALL ${n} ━━━
- living-room hearth / fireplace nook with stockings or a knit throw
- window-seat with autumn leaves outside the glass
- kitchen table strewn with pumpkin-carving mess (seeds, pulp, little knives set aside)
- blanket-fort interior built from couch cushions and a draped quilt, fairy lights strung inside
- attic reading nook with a round window and a trunk of old Halloween decorations
- a cozy porch swing seen from just inside an open screen door, jack-o-lanterns lined on the steps beyond
- a candlelit pantry corner with jars of candy and a basket of apples
- a bedroom loft with a canopy of orange fairy lights and a pile of stuffed toys
- a study nook with a rolltop desk, an inkwell, and a stack of spooky storybooks
- a mudroom bench with tiny wellies, a broom propped in the corner, pumpkins by the door
- a sunroom with wicker chairs, dried cornstalks in the corner, warm lamp glow
- a cellar-turned-den with exposed beams, a string of paper-lantern lights, a cider barrel

━━━ RULES ━━━
Every setting is warm and inviting, never a real haunted-house register (no cobwebs-as-decay, no dust-and-gloom) — this is a loved, lived-in home decorated FOR FUN. No text, no people, no brand names.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── decor (one playful spooky-decor beat) ───────────────────────────
  await generatePool({
    outPath: DIR + 'chibi_halloween_cozy_decor.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} short DECOR-DETAIL snippets for a cute Halloween-cozy chibi-creature art bot — ONE playful, friendly Halloween decoration visible in the scene. Each entry 8-16 words, a single concrete object/detail, cute/smiling never scary.

━━━ EXAMPLES ━━━
"a garland of smiling paper ghosts strung along the mantel"
"a plump, round-eyed spider hanging from a fairy-light-strung web in the corner"
"a row of grinning mini pumpkins lined along the windowsill"

━━━ SPREAD ACROSS ALL ${n} ━━━
smiling paper-ghost garland, friendly googly-eyed spiderweb with fairy lights woven through, grinning mini pumpkins on a sill, a black-cat-shaped cushion, a jaunty witch hat perched on a lampshade, a bowl of candy corn and gummy worms, a string of orange-and-purple fairy lights, a carved-pumpkin lantern glowing on a shelf, a paper-bat garland fluttering from a doorway, a broomstick propped charmingly in a corner, a basket of shiny red-and-green apples, a stack of Halloween picture books, a cauldron-shaped bowl of treats, a wreath of autumn leaves and tiny plush ghosts, a string of felt-bat bunting, a candy dish shaped like a smiling pumpkin.

━━━ RULES ━━━
Every decor beat is PLAYFUL and friendly — smiling/grinning faces, warm colors, never decayed or menacing. No text, no brand names.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── glow — MONEY-SHOT signature detail ──────────────────────────────
  await generatePool({
    outPath: DIR + 'chibi_halloween_cozy_glow.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} GLOW-DETAIL snippets for a cute Halloween-cozy chibi-creature art bot. This is the SIGNATURE money-shot detail of the whole path: the exact way warm candlelight / a jack-o-lantern's inner candle-flame washes across the intimate scene. Each entry 16-28 words, vivid and specific about light behavior (color, flicker, where it lands), never just "warm lighting."

━━━ FORMAT (match this exactly) ━━━
"Warm flickering orange glow spills from the jack-o-lantern's triangle-cut eyes and grin, pooling across fur and fabric, throwing soft dancing shadows on the wall behind"
"Candlelight catches in oversized glassy eyes as the tiny flame inside the pumpkin gutters and flares, painting everything nearby in warm amber pulses"
"Cool blue moonlight through a frosted window mixes with the pumpkin's warm orange glow, splitting one rounded cheek into gold and the other into soft blue shadow"

━━━ SPREAD ACROSS ALL ${n} — vary the light SOURCE-BEHAVIOR and where it lands ━━━
flame flicker inside a carved pumpkin, wavering shadow-play from a jack-o-lantern's cut features, a ring of tealight candles pooling gold on a blanket-fort floor, a string of orange fairy-lights washing everything in soft amber, moonlight-vs-pumpkin-glow color contrast, a lantern's glow catching in glassy oversized eyes as multi-point catchlights, warm light rimming the edge of fur/feathers/fuzz against a dim room, a fireplace's ember-glow mixing with pumpkin-light, candle-glow through a paper-lantern casting patterned light, the pumpkin's grin projecting a jagged warm shape onto a nearby wall, a flashlight's cool beam meeting the pumpkin's warm glow under a blanket-fort.

━━━ RULES ━━━
Always warm-orange-forward (candle/pumpkin light is the hero light source even when a second light is mentioned). No text, no brand names.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
