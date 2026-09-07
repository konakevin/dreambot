#!/usr/bin/env node
// AlphaBot candidate "chibi-halloween-outing" — MVP-25 seed pools.
//
// Cloned identity target: ChibiBot (no humans ever, chibi-proportioned
// creatures, Pop-Mart-vinyl/Pixar cute register — see
// scripts/bots/chibibot/shared-blocks.js). Concept: a little band of 2-3
// chibi creature friends mid-action on a Halloween adventure TOGETHER —
// door-to-door trick-or-treating with baskets, a hayride, or a corn maze.
// Verb-led, dynamic, never a posed lineup. Playful/family-friendly only —
// grinning jack-o-lanterns and friendly ghosts, never real horror.
//
// 6 generated pools (this script) + a short fixed lighting/time-of-night
// list inlined directly in the path file (no pool needed for a handful of
// options):
//   chibi_halloween_outing_creature.json — the chibi friends, physical only
//   chibi_halloween_outing_activity.json — the shared verb-led moment (headline)
//   chibi_halloween_outing_detail.json   — lived-in neighborhood/farm richness
//   chibi_halloween_outing_prop.json     — small charm one of them holds
//   chibi_halloween_outing_surprise.json — tucked-away background cameo
//   chibi_halloween_outing_costume.json  — MONEY SHOT: a costume piece worn
//                                           OVER the creature's own body
//
// Run: node scripts/gen-seeds/alphabot/gen-chibi-halloween-outing.js
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/chibibot/seeds/';

(async () => {
  // ── creature_group — who the friends are, PHYSICAL DESCRIPTION ONLY ────
  // (no action, no costume — those are separate axes). Format mirrors
  // ChibiBot's own creature-identity register: species + 3-4 unmistakable
  // non-human physical descriptors + a pose/expression beat.
  await generatePool({
    outPath: DIR + 'chibi_halloween_outing_creature.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} CHIBI CREATURE identity descriptions for ChibiBot's chibi-halloween-outing path — a little band of adorable chibi critter friends going trick-or-treating together. Each entry describes ONE creature's physical appearance only (no action, no costume, no Halloween theming yet — those come from other axes). Each entry 16-26 words.

━━━ FORMAT (2 examples) ━━━
"Chibi red fox kit: burnt-orange fluff, oversized black-tipped ears, a fluffy white-tipped tail curled at its side, huge dewy amber eyes, blushing cheeks"
"Chibi barn owl chick: downy cream-and-gold plumage, an enormous heart-shaped face, giant round obsidian eyes, tiny tufted ear-feathers, perched upright on stubby taloned feet"

━━━ SPECIES VARIETY — spread across all ${n}, rotate freely ━━━
Woodland: fox kit, bunny/rabbit, hedgehog, raccoon, squirrel, field mouse, fawn/deer, chipmunk, opossum
Farmyard (for the hayride/corn-maze setting): duckling, lamb, piglet, baby goat, barn owl
Cute Halloween-coded critters (keep them ADORABLE, never spooky): a fluffy round-eared bat pup, a plump googly-eyed spider (soft round body, NOT creepy — think plush toy), a black cat kitten with a little bell on its collar, a fluffy silver-grey wolf pup
Every entry: chibi proportions (oversized head, massive glassy multi-catchlight eyes, soft stubby body), 3-4 unmistakable non-human physical features (fur/feather/scale texture, ears, tail, markings), and a blush-cheek or pose detail. NEVER use human age/gender nouns (woman, man, boy, girl, elderly, teenager) — name the species and describe it with animal features only.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── activity — the shared, verb-led headline moment ─────────────────
  await generatePool({
    outPath: DIR + 'chibi_halloween_outing_activity.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} HALLOWEEN-OUTING activity snippets for ChibiBot's chibi-halloween-outing path — what a little band of 2-3 chibi creature friends are doing TOGETHER, right now, mid-action. This is the HEADLINE of the scene — verb-led and dynamic, never a posed lineup. Each entry 22-36 words. Refer to the friends generically ("tiny paws", "the friends", "one... another... the third...") since the specific creatures are supplied separately.

━━━ FORMAT (3 examples) ━━━
"racing hand-in-paw up a porch stoop, one on tiptoe pressing the glowing doorbell button while the others clutch open trick-or-treat bags, waiting wide-eyed for the door to open"
"piled onto a creaking hay-bale wagon rolling past a moonlit pumpkin field, tiny paws gripping the wooden rail, loose hay tufts flying up behind them"
"dashing through a golden corn maze in a giggling single-file line, one holding an upside-down map up front, the others bumping close behind at a run"

━━━ THE THREE ANCHOR ACTIVITIES — spread across all ${n}, majority weight ━━━
A. DOOR-TO-DOOR TRICK-OR-TREATING: ringing a doorbell together, knocking with a tiny paw, holding baskets/bags out expectantly, dashing between porches, tipping candy into an overflowing sack, comparing hauls on a stoop, tiptoeing up a candlelit walkway
B. HAYRIDE: piled onto a hay-bale wagon, gripping the rail as it rolls through a pumpkin field or moonlit farm lane, tossing loose hay, waving from atop the hay bales, a wagon wheel creaking over a bumpy farm track
C. CORN MAZE: racing through rows of tall corn, peeking around a corner, following a paper map, popping out at a dead end together, climbing a little lookout platform to spot the way out

━━━ VARIETY — a FEW complementary outing beats too (minority weight, keep the frame "a Halloween outing together") ━━━
a costume-parade dash down the sidewalk, stopping at an apple-bobbing barrel along the route, gathering at a bonfire circle after the hayride, following a trail of jack-o-lantern lights between houses

━━━ RULES ━━━
Every entry is IN-MOTION and MULTI-FRIEND (2-3 acting together, described generically — no species names, those come from elsewhere). PLAYFUL and JOYFUL — grinning, giggling, excited, never scared. NO humans, NO human hands (use "paws"/"tiny hands" as generic critter anatomy). NO real scares, no horror.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── setting_detail — lived-in neighborhood/farm richness (pick 3) ───
  await generatePool({
    outPath: DIR + 'chibi_halloween_outing_detail.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} short HALLOWEEN-NEIGHBORHOOD/FARM setting-detail snippets for ChibiBot's chibi-halloween-outing path — small pieces of lived-in richness that build out a decorated street, farm, or corn-maze location. Three of these get combined per render to build the place. Each entry 8-16 words, a single concrete visual detail (no full scenes, no creatures).

━━━ FORMAT (3 examples) ━━━
"rows of grinning carved jack-o-lanterns lit along a porch railing"
"a cobweb-draped picket fence strung with cheerful paper ghosts"
"hay bales stacked at a farm gate under strings of bulb lights"

━━━ CATEGORIES — spread across all ${n} ━━━
- Jack-o-lanterns (porch rows, mailbox toppers, walkway lining, glowing from windowsills, stacked in a wheelbarrow)
- Neighborhood decor (cobweb-draped fences, paper ghosts/bats taped to windows, string lights shaped like tiny bats or pumpkins, a wreath of autumn leaves on a door)
- Farm/hayride detail (hay bales, a wagon wheel, corn-stalk bundles tied to a lamppost or gatepost, a weathervane, a red barn silhouette)
- Corn-maze detail (tall rustling corn rows, a hand-painted signpost, a little wooden lookout tower, string lights strung between poles)
- Porch/street life (a candy bowl on a step, a welcome mat, string of triangle bunting, a scarecrow tipping its hat, pumpkin stacks by a mailbox)
- Sky/ground texture (a scatter of fallen leaves swirling underfoot, a low ground-mist between pumpkins, a harvest moon over rooftops)

━━━ RULES ━━━
NO creatures/characters in these (those are separate axes). NO humans. Playful, warm, never bleak or menacing — this is a friendly Halloween-decorated place, not a haunted one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── prop — small charm one friend holds ──────────────────────────────
  await generatePool({
    outPath: DIR + 'chibi_halloween_outing_prop.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} tiny HALLOWEEN PROP snippets for ChibiBot's chibi-halloween-outing path — a small charm object one of the creature friends holds. Each entry 4-10 words, just the object + one texture/color detail.

━━━ FORMAT (4 examples) ━━━
"a woven trick-or-treat basket brimming with foil-wrapped candies"
"a tin pumpkin-shaped candy bucket with a wire handle"
"a candy-corn-striped lollipop half-unwrapped"
"a paper treat sack rolled shut at the top"

━━━ CATEGORIES — spread across all ${n} ━━━
Treat containers (basket, tin pumpkin bucket, paper sack, burlap sack tied with twine, pillowcase bulging with candy), specific candy items (candy-corn lollipop, foil-wrapped chocolate, a caramel apple on a stick), small Halloween trinkets (a glow-stick bracelet, a tiny paper lantern shaped like a smiling pumpkin, a mini flashlight), farm/hayride items (a small pumpkin hugged in both arms, a corn-husk doll, a sprig of dried wheat).

━━━ RULES ━━━
Object only — no creature described holding it (that's composed separately). NO humans, NO scary items (no weapons, no gore props). Warm and charming only.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── surprise_element — tucked-away background cameo ──────────────────
  await generatePool({
    outPath: DIR + 'chibi_halloween_outing_surprise.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} tiny "SURPRISE ELEMENT" snippets for ChibiBot's chibi-halloween-outing path — a small, tucked-away background detail elsewhere in the frame, easy to miss on first glance, that rewards a closer look. Each entry 8-16 words.

━━━ FORMAT (3 examples) ━━━
"a shy ghost peeking around a fence post with a tiny wave"
"a black kitten wearing a little bow, watching from a porch step"
"a friendly scarecrow with a kind button-eyed grin, tipping its hat"

━━━ CATEGORIES — spread across all ${n} ━━━
Friendly "spooky" cameos kept adorable (a translucent-cute ghost peeking from behind something, a plump spider spinning a glittery web between two pumpkins, a fluffy bat hanging upside-down from a branch, a black cat with a bow watching, a scarecrow with a kind smile), small wildlife cameos (a raccoon family peeking from a hollow log in acorn-cap hats, an owl blinking from a lit window, a mouse family watching from a mail slot), ambient charm (a trail of paper-bat lights fluttering overhead, a candy wrapper glinting on the path, a jack-o-lantern with a lopsided grin flickering).

━━━ RULES ━━━
Background/secondary only — never the main subject. PLAYFUL and gentle, never genuinely creepy. NO humans, NO real horror imagery.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── costume_detail — MONEY-SHOT axis ─────────────────────────────────
  // Present on ~50% of renders (handled in the path file, never mandatory
  // per the playbook's homogenization failure mode). The "worn OVER the
  // creature's own body" instruction lives in the path template wrapper,
  // not per-entry, so entries stay short.
  await generatePool({
    outPath: DIR + 'chibi_halloween_outing_costume.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} tiny HALLOWEEN COSTUME PIECE snippets for ChibiBot's chibi-halloween-outing path — this is the SIGNATURE MONEY-SHOT detail: one small, charming costume accessory a chibi creature friend wears OVER its own fur/feathers/scales for trick-or-treating. Each entry 6-14 words, the costume piece only (the "worn over its own body, paws/tail/ears visible" instruction is added separately — don't repeat it).

━━━ FORMAT (4 examples) ━━━
"a tiny pointed witch hat with a starry purple band"
"a soft ghost-sheet cape with two round eye-holes cut out"
"a round orange felt pumpkin hood with a green stem topper"
"gauzy iridescent fairy wings and a star-tipped wand"

━━━ CATEGORIES — spread across all ${n} ━━━
Classic Halloween costumes as a small worn accessory: witch (hat + tiny cape), ghost (a soft draped sheet-cape with eye-holes), pumpkin (a round felt hood with a stem), bee (striped wings + antenna headband), superhero (a small cape clipped at the shoulders with a felt star), knight (a cardboard-look breastplate), fairy (gauzy wings + wand), dinosaur (a soft spiked hood), skeleton (a soft vest with painted bone shapes), vampire (a tiny black cape with a red collar — playful, NOT scary), mummy (a few loose wrapped bandage strips), pirate (a tiny eye-patch and bandana), astronaut (a soft round helmet accessory), knight-in-shining-cardboard, wizard (a starry pointed hat + tiny robe).

━━━ RULES ━━━
Each is a SMALL accessory/costume PIECE (hat, cape, hood, wings, vest) that layers over an existing creature body — never a full-body human costume shape. NO humans. Playful and charming, never scary (vampire/skeleton entries stay cute and cartoonish, not gory).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
