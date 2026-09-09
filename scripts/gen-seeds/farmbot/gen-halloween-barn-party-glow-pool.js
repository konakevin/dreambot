#!/usr/bin/env node
/**
 * FarmBot — halloween_barn_party_glow bespoke pool ("Halloween Barn Party"
 * seasonal path, farmbot-halloween-barn-party, 2026-09-09).
 *
 * SEASONAL path (bot.seasonalPaths.halloween). Path-bespoke pool — the
 * MONEY SHOT: the exact way warm string-light and jack-o-lantern candlelight
 * fills and washes the decorated barn (mirrors ChibiBot's
 * chibi_halloween_cozy_glow.json "money shot" axis pattern, scaled from an
 * intimate 1-2-creature moment up to a whole party space).
 *
 * ⭐ HIGHEST-RISK POOL IN THIS PATH for the documented dark+light-word
 * contradictory-pairing bug (FARMBOT_PATH_BUILD_STATE.md, 2026-09-09,
 * root-caused on fishing-dock: "a dark glint of water" → Sonnet escalated to
 * "the darkness beneath given a gentle luminous sparkle" → rendered as a
 * literal glowing beam slicing through an otherwise foggy scene, a
 * split-frame artifact). String lights and jack-o-lantern glow are
 * INHERENTLY described relative to a darker surrounding in most real-world
 * Halloween-party photography language ("lights glowing against the dark
 * barn") — that exact framing is the trap. Fixed at the SOURCE here by
 * banning the words "dark," "darkness," "shadow," "dusk," "night," "dim,"
 * and "gloom" outright from this pool's own vocabulary — every entry
 * describes ONLY the warm, cheerful light itself and where it falls, never
 * contrasted against darkness in the same breath. This also directly serves
 * the brief's "zero spooky/eerie/dark atmosphere" identity constraint: a
 * barn interior that's warmly, brightly, cheerfully lit throughout (string
 * lights + a friendly daytime or golden-hour ambient light through the open
 * barn doors, on top of the party lighting) reads as "kids' Halloween
 * party," never "haunted barn at night."
 *
 * Also bans metaphorical light-as-object language (the "coins of light" →
 * literal gold coins bug, same class as orchard-afternoon.js's documented
 * fix) and per-object personification of a repeated string/row of lights.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_barn_party_glow.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct descriptions of the WARM PARTY GLOW filling a decorated
Halloween barn — specifically how strings of warm bulb lights and the candlelight from carved
jack-o-lanterns fill and wash the space with cheerful light, as a rich, living little world of its own,
entirely through light and color. The light itself (a string of bulbs, the glow spilling from a
jack-o-lantern's grin, the overall warm wash across the barn) is ALWAYS the grammatical subject named
FIRST in the sentence.

CRITICAL — CHEERFUL AND BRIGHT, NEVER MOODY OR DIM. This barn is warmly, brightly, cheerfully lit
throughout — think a delightful daytime or golden-hour Halloween party with festive lights added on top,
never a nighttime or haunted mood. Do NOT use the words "dark," "darkness," "shadow," "shadows,"
"dusk," "night," "dim," or "gloom" ANYWHERE in your output — describe only the warm, glowing,
cheerful light itself and exactly where it pools, spills, or dances, never contrasted against any kind
of darkness. If you want to describe depth or richness, use words like "warm," "golden," "amber," "rich,"
"glowing," "radiant," or "cozy" instead.

Lean into GLOW-hero imagery: warm white or amber string lights zigzagging overhead, their small bulbs
glowing steadily and warmly against the wooden beams, a jack-o-lantern's candlelight flickering gently
and warmly from within its carved grinning face, pools of warm golden light spilling across the hay-
strewn floor beneath a string of lights, the whole barn glowing a cheerful amber and gold, a lit
jack-o-lantern's warm glow catching the edge of a nearby hay bale, warm light glinting softly off a
polished mason jar or a glass cider jug, the golden glow of many small lights blending into one warm,
inviting wash of color across the wooden walls, a friendly beam of daylight through the open barn doors
mixing with the warm party lights.

LIGHT LANGUAGE — always describe light as a warm glow, wash, pool, or gentle glimmer/shimmer/sparkle
spilling or dancing across a real surface (hay, wood, fabric, a jar). NEVER use an object-metaphor for
light — do NOT write "coins of light," "beads of light," "jewels of light," "confetti of light," or any
similar noun-metaphor naming a physical object standing in for light; these render as the literal object,
not as light.

REPEATED ELEMENTS — when describing a whole string or row of lights, describe it COLLECTIVELY as one
warm continuous glow, never by giving each individual bulb or jack-o-lantern its own separate action or
personality ("a string of small bulbs glows warmly and evenly along the beam" is correct; "one bulb
glimmers shyly while the next one dances brighter" is not).

CRITICAL — this is a LIGHT/ATMOSPHERE description with NO people and NO animals in it at all, not even
implied ones. Do NOT mention: figures, crowd, guests, partygoers, children, kids, bystanders, laughter,
faces (other than a jack-o-lantern's own carved face), hands, someone/anyone doing something, or any
animal by name — the costumed animals and any person are added separately at render time; this pool is
pure light and atmosphere.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 20-35 words each.

Examples:
["Strings of warm amber bulb lights glow steadily along the overhead beams, their light pooling in soft
warm patches across the hay-strewn floor below.", "A carved jack-o-lantern's candlelight flickers gently
and warmly from its grinning face, catching the edge of the hay bale beside it in a cozy golden glow."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/guests/partygoers/
children/kids/bystanders/laughter/hands), NO animals of any kind, NO readable text/signage/lettering/
numbers, NO brand names, NO photographer/camera-brand names, NO metaphorical light objects (coins/
jewels/beads/confetti/sequins), NO per-bulb or per-lantern personification (describe strings/rows
collectively), NO word "scary" or "spooky" anywhere, and ABSOLUTELY NO use of "dark," "darkness,"
"shadow," "shadows," "dusk," "night," "dim," or "gloom" anywhere in any entry.

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
