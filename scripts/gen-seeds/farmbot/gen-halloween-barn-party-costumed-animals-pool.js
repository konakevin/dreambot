#!/usr/bin/env node
/**
 * FarmBot — halloween_barn_party_costumed_animals bespoke pool ("Halloween
 * Barn Party" seasonal path, farmbot-halloween-barn-party, 2026-09-09).
 *
 * SEASONAL path (bot.seasonalPaths.halloween). Path-bespoke pool — THE
 * SIGNATURE HERO CONTENT of this path, per the brief: "a few farm animals
 * wearing small cute costumes (a bandana with a pumpkin print, a tiny witch
 * hat on a goat, etc — playful, never elaborate/realistic costuming)." This
 * is the single element that makes the path genuinely distinct from
 * barn-animal-shelter-interior.js (which is animal-heavy but has NO
 * costuming concept at all).
 *
 * ALWAYS present in every render, character or not (see the path file) —
 * this doubles as the "guarantee ambient/living presence in a no-character
 * render" requirement (CLAUDE.md / pools.pickPureSceneLife's purpose): since
 * costumed animals are this path's own always-on hero content, a separate
 * pools.pickPureSceneLife() fallback is unnecessary — a no-character render
 * can never come back bare of life, it always has its costumed animal(s).
 *
 * INTENTIONAL PERSONIFICATION IS THE WHOLE POINT (does NOT trip the
 * per-object-personification ban): the CLAUDE.md ban targets literal
 * INANIMATE objects (rocks, plants, fruit) getting an invented face/agency —
 * a real living farm animal wearing a small costume accessory is exactly the
 * intended, expected register for Halloween costuming and is explicitly
 * carved out in this path's own brief.
 *
 * COSTUME RESTRAINT (brief, non-negotiable): ONE small, simple, charming
 * costume ACCESSORY per animal only — a hat, a bandana, a collar, a bow, a
 * small cape. NEVER a full-body costume, never human-style clothing (no
 * shirts/pants/shoes), never anything that obscures the animal's own natural
 * anatomy or makes it look part-human. This is the same restraint
 * discipline as the documented "horse keeper" bug (an animal-adjacent noun
 * placed where it reads as describing anatomy rather than an accessory) —
 * the costume item is always clearly a small WORN ACCESSORY on a
 * recognizably real, natural animal, never a transformation of the animal
 * itself.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_barn_party_costumed_animals.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct descriptions of ONE OR TWO real farm animals wearing a
small, playful Halloween costume accessory at a barn party, as a rich, living little scene of its own,
entirely through the animal's own natural anatomy and its one small worn accessory. The animal itself
(a goat, a pony, a chicken, a duck, a sheep, a rabbit, a barn cat, a pig, a cow, a donkey) is ALWAYS the
grammatical subject named FIRST in the sentence.

CRITICAL — CHEERFUL AND ADORABLE, NEVER SCARY. Every animal here is happy, calm, and utterly charming —
a real, natural farm animal (fur, feathers, wool, or hide exactly as a real one has) wearing exactly ONE
small, simple, playful costume accessory. This is a cute costume moment at a fun party, never anything
unsettling.

COSTUME RESTRAINT (critical, always follow): give each animal exactly ONE small worn accessory, chosen
from things like: a tiny witch hat tilted at a jaunty angle, a bandana printed with a small pumpkin
pattern tied around the neck, a felt collar with a stitched pumpkin or bat shape, a candy-corn-striped
bow clipped to an ear, a small knit sweater patterned with pumpkins, a miniature cape tied at the neck, a
soft paper or felt pair of bat-wing ears on a headband, a garland of tiny fabric leaves and pumpkins
looped loosely around the neck, a striped orange-and-black scarf. NEVER describe a full-body costume,
NEVER put the animal in human-style clothing (no shirts, no pants, no shoes, no gloves), and NEVER
obscure or replace the animal's own natural anatomy — the costume is always a small worn accessory ON a
completely real, natural-looking animal, never a transformation of it.

Vary the animal species, the specific accessory, the animal's pose/expression (a goat balanced on a hay
bale, a pony's head lowered curiously toward the camera, a chicken perched on a fence rail, a duck
waddling past, a barn cat curled contentedly, a rabbit sitting up on its haunches, a sheep standing
placidly, a pig snuffling at the ground, a cow chewing lazily), and whether it's a solo animal or two
animals together (a goat and a chicken side by side, two ducklings matching in tiny bandanas). Roughly
70% of entries should describe one animal, 30% should describe two animals together.

CRITICAL — this is a specific ANIMAL description with NO people in it at all, not even implied ones. Do
NOT mention: figures, crowd, guests, partygoers, children, kids, hands feeding or holding it, laughter,
someone/anyone doing something to it — the animal is captured on its own, mid-party, its costume already
in place; any person is added separately at render time.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 20-35 words each.

Examples:
["A small goat stands proudly atop a hay bale wearing a tiny black witch hat tilted at a jaunty angle,
its ears poking out on either side, tail flicking happily.", "A plump chicken perches on a fence rail
wearing a felt collar stitched with a small orange pumpkin shape, head tilted curiously to one side."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/guests/partygoers/
children/kids/hands/laughter), NO readable text/signage/lettering/numbers on any accessory, NO brand
names, NO photographer/camera-brand names, NO full-body costumes or human-style clothing (shirts/pants/
shoes/gloves) on any animal, NO more than ONE costume accessory per animal, NO obscuring or replacing
the animal's own real natural anatomy, NO word "scary" or "spooky" anywhere — every animal here is
happy, calm, and adorable.

Output ONLY the JSON array, no preamble, no numbering.`,
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
