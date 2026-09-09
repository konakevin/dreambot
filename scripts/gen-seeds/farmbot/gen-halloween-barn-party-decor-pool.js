#!/usr/bin/env node
/**
 * FarmBot — halloween_barn_party_decor bespoke pool ("Halloween Barn Party"
 * seasonal path, farmbot-halloween-barn-party, 2026-09-09).
 *
 * SEASONAL path (bot.seasonalPaths.halloween — see botSeasonal.js), NOT part
 * of the normal bot.paths[] rotation. Path-bespoke pool (not a shared
 * cross-path pool) — the decorated barn interior's PARTY DECORATIONS
 * themselves are the hero, same architecture-only-pool pattern as
 * BARN_INTERIOR_PLACE (barn-animal-shelter-interior.js) — but this pool
 * covers PARTY DRESSING specifically (string lights, jack-o-lanterns,
 * hay-bale seating, bunting, treats table) rather than plain barn
 * architecture, which is what keeps this path genuinely distinct from
 * barn-animal-shelter-interior.js per the brief ("must be genuinely distinct
 * ... your hero content is the PARTY DECORATION + COSTUMED ANIMALS
 * specifically, not just 'animals in a barn'").
 *
 * This pool is 100% people-free and animal-free ON PURPOSE — the path's own
 * COSTUMED_ANIMALS pick and pools.pickCharacter() pick carry all the living
 * content, composed at render time (same split as barn-animal-shelter-
 * interior.js). The specific string-light/jack-o-lantern GLOW quality is
 * ALSO a separate bespoke pool (halloween_barn_party_glow) — this pool names
 * the light SOURCES as decor objects (a string of lights, a lit
 * jack-o-lantern) but does not elaborate the light's quality/mood, so the
 * two pools don't compete or contradict each other.
 *
 * CHEERFUL / PLAYFUL / FAMILY-FRIENDLY ONLY (CLAUDE.md — positive-framing
 * hard rule, doubly true for Halloween content): this is a warmly lit,
 * joyful party, matching every other bot's Halloween content in the fleet
 * (ChibiBot precedent). Every jack-o-lantern is described as grinning and
 * cheerful with a SIMPLE carved face — never implying any lettering or
 * numerals cut into it (the documented hallucinated-numerals risk, same
 * class as the "wooden plant labels" bug on garden-vegetable-patch-tending).
 * The word "scary"/"spooky" never appears anywhere in this meta-prompt or
 * its output, even to negate it — Flux doesn't process negation (CLAUDE.md),
 * so the fix is to only ever describe what the scene IS (cheerful, playful,
 * warmly decorated), never what it is not.
 *
 * Bans baked in from the start (all previously-discovered bugs this session,
 * applied here proactively):
 *   - no readable text/signage/lettering/numbers/banners-with-words/price
 *     tags/labels of any kind (signage-hallucination risk)
 *   - no per-object personification of a repeated row of identical items
 *     (a row of jack-o-lanterns / bunting / hay bales described
 *     collectively, never with individual per-item agency)
 *   - no metaphorical light-as-object language (handled mainly in the
 *     sibling glow pool, but this pool avoids it too on general principle)
 *   - no implied people/crowd language (added separately at render time)
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_barn_party_decor.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct DECORATED HALLOWEEN BARN PARTY INTERIOR descriptions
for a cozy countryside bot — the inside of a small, well-loved wooden barn, dressed head to toe for a
cheerful Halloween celebration, as a rich, living little world of its own, entirely through its physical
decoration details. The decorated barn interior itself (a stretch of it — the hay-bale seating area, a
post strung with lights, the treats table) is ALWAYS the grammatical subject named FIRST in the sentence.

CRITICAL — CHEERFUL, PLAYFUL, FAMILY-FRIENDLY HALLOWEEN PARTY ONLY. This is a warmly lit, joyful,
kids'-party-style celebration inside a cozy barn — think a delightful harvest-time Halloween party, not
a haunted house. Every jack-o-lantern has a SIMPLE, cheerful, grinning carved face (a couple of triangle
eyes and a jagged grinning mouth) — never describe any lettering, numbers, or writing carved or painted
onto anything.

Lean into PARTY-DECORATION-hero imagery, mixing 2-4 of these per entry (never all at once): strings of
warm bulb lights zigzagging along the overhead beams and rafters, hay bales arranged as cozy party
seating (sometimes topped with a pumpkin-print cushion or a folded blanket), small and medium carved
jack-o-lanterns with simple grinning faces lining the hay bales, windowsills, or fence rails, a treats
table loaded with donuts, caramel apples, a jug of warm cider, and a bowl of candy corn, orange-and-black
or deep-purple fabric bunting or pennant banners looped along the beams (plain solid-colored fabric, no
lettering or pattern implying words), bundled corn stalks tied with a bright ribbon at the barn posts,
small stacked pumpkins and knobby gourds arranged in a display, paper garlands cut into simple bat or
ghost silhouettes strung along the rafters, a wooden barrel apple-bobbing tub set up in one corner with a
few apples floating on the water's surface, a small cart or wagon wheel wrapped in lights leaned against
a wall, a scattering of straw and fallen leaves swept into a tidy corner near the hay bales.

Vary which details lead, the framing (a wide view down the decorated aisle, a close corner of hay bales
and pumpkins, the treats table itself, a post wrapped in lights), and the specific mix of decorations —
every entry should feel like a genuinely different corner of the same warmly decorated party.

REPEATED ELEMENTS — when a stretch of decoration shows several of the same thing in a row (jack-o-
lanterns, bunting flags, hay bales), describe that row COLLECTIVELY as one unified image, never by
giving each individual item its own separate action or personality ("a row of jack-o-lanterns grinning
warmly along the hay bales" is correct; "one pumpkin winks while its neighbor grins wider" is not —
objects in a row do not get individual agency).

CRITICAL — this is a PLACE/DECORATION description with NO people and NO animals in it at all, not even
implied ones. Do NOT mention: figures, crowd, guests, partygoers, children, kids, trick-or-treaters,
bystanders, laughter, faces (other than a jack-o-lantern's carved face), hands, someone/anyone doing
something, footprints (implies a walker just left), or any animal by name (no cow, goat, sheep, chicken,
horse, pony, cat, dog, duck, rabbit, or any other creature) — the costumed animals and any person are
added separately at render time; this pool is decoration and atmosphere only.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A cluster of hay bales sits arranged as cozy party seating in one corner, each one topped with a
pumpkin-print cushion, a row of small grinning jack-o-lanterns lined up along the front edge glowing
warmly.", "Strings of warm bulb lights zigzag along the overhead beams above the barn aisle, orange and
black fabric bunting looped between the posts below, a bundle of corn stalks tied with bright ribbon
leaning against the nearest one."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/guests/partygoers/
children/kids/trick-or-treaters/bystanders/laughter/hands/footprints), NO animals of any kind (cow/
goat/sheep/chicken/horse/pony/cat/dog/duck/rabbit/any creature — even implied ones), NO readable
text/signage/lettering/numbers/banners with words/price tags/labels of any kind, NO brand names, NO
photographer/camera-brand names, NO bare/undecorated barn corner lacking real party-decoration detail,
NO describing a repeated row of identical objects with individual per-item agency or personality
(describe rows collectively), NO word "scary" or "spooky" anywhere (this is purely a cheerful party —
describe only the warm, playful decoration itself).

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
