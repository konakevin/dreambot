#!/usr/bin/env node
/**
 * FarmBot — SEASONAL (Halloween) bespoke pool: the SCARECROW itself
 * ("farmbot-halloween-scarecrow-building" path).
 *
 * Architecturally a SEASONAL path (bot.seasonalPaths.halloween), NOT part of
 * the normal bot.paths[] rotation — see FARMBOT_PATH_BUILD_STATE.md and
 * scripts/lib/botSeasonal.js. This is one of 4 bespoke axis pools built for
 * this single path (SCARECROW / SETTING / DECOR / ATMOSPHERE), same
 * path-bespoke pattern as POND_PLACE / ORCHARD_AFTERNOON_PLACE / etc. — own
 * gen script + own JSON, required directly by the path file, NOT added to
 * pools.js.
 *
 * This is the HERO pool — the friendly, adorable Halloween scarecrow as a
 * physical object, described entirely through its own construction (straw,
 * old clothes, a hand-stitched face). Distinct from the existing background
 * "a cheerful patchwork scarecrow standing watch" mentions already present
 * in farmbot_harvest_festival_place.json / farmbot_vegetable_garden_place.json
 * (passive decor) — this pool's whole job is the scarecrow AS the subject,
 * mid-construction or freshly finished, ready to be the hero of a dedicated
 * moment rather than background dressing.
 *
 * CRITICAL SAFETY CONSTRAINT baked in (per FARMBOT_PATH_BUILD_STATE.md's
 * documented "horse keeper" occupational-anatomy-confusion bug, and the
 * caller's explicit warning that this exact trap applies here): every entry
 * must describe the scarecrow's head/face as UNAMBIGUOUSLY its own inanimate
 * straw-and-fabric construction — never phrased in any way that could read
 * as a human character's own head/face/anatomy. No human figure appears in
 * this pool at all (banHumanLanguage + explicit no-people-implied ban) — the
 * building character is handled separately, in the path file's own
 * BUILDING_ACTION array, which always keeps "the scarecrow's [part]" as the
 * grammatical object of the human's actions, never the reverse.
 *
 * Positive-framing only (CLAUDE.md hard rule + caller's brief): never writes
 * "not scary" / "no spooky" — cheerful/friendly/button-eyed/stitched-smile
 * vocabulary does the work instead.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_scarecrow_building_scarecrow.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct descriptions of a FRIENDLY, ADORABLE, cheerful
Halloween-season SCARECROW for a cozy countryside anime bot — the scarecrow itself as a charming
little handmade creation, described entirely through its own physical construction. The scarecrow
is ALWAYS the grammatical subject named FIRST in the sentence.

CRITICAL — every entry must make it unmistakably clear this is a straw-stuffed, fabric-and-clothing
OBJECT, never a living being: old work clothes (a patched flannel shirt, faded overalls, a knotted
bandana, mismatched buttons, a frayed rope belt) stuffed round and full with golden straw, its arms
spread along a simple wooden crossbar post (or resting loosely at its sides), straw poking cheerfully
from its cuffs, collar, and hem. Its head is a round burlap or soft fabric sack (a few entries can
instead give it a small smiling carved pumpkin standing in for a head), topped with a floppy straw
hat or a small pumpkin perched jauntily on top, sometimes with a wildflower or autumn leaf tucked
into the hatband. Its face is ALWAYS clearly hand-made and inanimate — two big round button eyes (or
eyes stitched from black thread or fabric patches) and one wide, warm, stitched or painted smile made
of yarn or paint, with soft round fabric-patch cheeks — cheerful, friendly, plush-toy-adorable,
exactly like a beloved children's-picture-book character. THIS IS THE SCARECROW'S OWN HEAD AND FACE —
inert straw-and-fabric construction, not a human head, not any part of a human character's own
anatomy, ever; never phrase it in a way that could be mistaken for a person's own face or body.

Vary the BUILD STAGE across entries — roughly half FRESHLY FINISHED (fully stuffed, buttoned,
upright, proudly complete) and half STILL BEING BUILT (one sleeve not yet stuffed and hanging a
little flat, straw spilling loose from an open collar into a nearby basket, the button-eye face only
half-sewn on, propped at a gentle lean against its post while it waits to be finished) — both stages
read equally charming and cozy, a half-finished scarecrow is a fun mid-project moment, never sad or
messy-looking. Vary clothing colors/patterns, hat style, one small hand-made charm detail (a
corn-husk flower pinned to its shirt, a little acorn button, a patchwork quilt square sewn onto one
knee, a tiny knitted scarf), and pose (arms straight out along the crossbar, one arm drooping softly,
leaning at a jaunty angle).

CRITICAL — describe any cluster of similar small objects near it (loose straw, a row of buttons, a
scatter of autumn leaves at its feet) HOLISTICALLY as one arrangement — plain physical description
only, never an individual per-object action verb or personality given to any single piece.

CRITICAL — describe light in plain, literal terms only (a warm glow, soft afternoon light, golden
light catching the straw, cool grey daylight) — NEVER a metaphorical object-noun standing in for
light (no "coins of light," "ribbons of gold," "scattered gems of sun"). NEVER pair "dark" /
"darkness" / "shadow" with a light-implying word ("glint," "sparkle," "shimmer," "luminous," "glow")
describing the same thing in one entry.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 30-45 words each.

Examples:
["A half-finished scarecrow leans at a gentle angle against its wooden crossbar post, one arm still
flat and unstuffed while golden straw spills from its open collar into a woven basket below, its
round burlap head already fitted with two big cheerful button eyes.", "A freshly finished scarecrow
stands proudly upright, arms spread wide along its crossbar in a faded red flannel shirt stuffed
round with straw, a small orange pumpkin perched jauntily atop its burlap head like a hat, its wide
stitched yarn smile curving up at both corners."]

🚫 STRICT BANS: NO people/human figures of any kind, not even implied ones (no figures, hands,
someone, footprints, "just finished by"); NO sinister/creepy/menacing/scary/frightening/eerie/
tattered-in-a-scary-way language of any kind — this scarecrow is always adorable and friendly; NO
readable text/signage/lettering/numbers anywhere on it; NO brand names or photographer names; NO
metaphorical light-as-object language; NO dark+light contradictory pairing; NO per-object
personification within a cluster; NO describing the scarecrow's straw/fabric head or face in any way
that could be mistaken for a human character's own head, face, or body — it must always read
unambiguously as an inanimate handmade construction; NO bare/plain scarecrow lacking real
construction detail (straw, stitching, patched fabric).

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
