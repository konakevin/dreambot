#!/usr/bin/env node
/**
 * FarmBot — halloween_pumpkin_carving_moment bespoke pool
 * ("Halloween: Pumpkin Carving" SEASONAL path, lives in bot.seasonalPaths.halloween —
 * see scripts/lib/botSeasonal.js, NOT the normal bot.paths[] rotation).
 *
 * THE MONEY SHOT / hero-of-the-shot axis — the carved pumpkin itself, mid
 * carving-project. Written as a PLACE/OBJECT-only description (no implied
 * person, no action verb requiring visible hands) so the exact same entry
 * reads naturally whether a character is present carving it or the render
 * is a quiet "moment just finished" still-life with nobody around — same
 * pattern proven by harvest-festival's bespoke place pool, which never
 * mentions people either.
 *
 * CRITICAL identity distinction from the EXISTING normal-rotation
 * seasonal-festival.js's "pumpkin-festival" concept (crowd/festival scale —
 * a carving CONTEST table, ring-toss booth, bunting, a "biggest pumpkin"
 * display): this pool describes exactly ONE pumpkin, alone, at ONE small
 * personal carving station — never a table lined with multiple lanterns,
 * never a contest, never bunting or festival decor. Small, personal,
 * handcrafted, one pumpkin at a time.
 *
 * CARVED-FACE HALLUCINATION GUARD (per FARMBOT_PATH_BUILD_STATE.md's
 * signage/label-hallucination lesson, extended to any "carved marking"
 * concept): the carved face is ALWAYS a simple, concrete, cheerful GEOMETRIC
 * SHAPE only (triangle/round/star eyes, a jagged or gap-tooth or crescent-
 * moon grin) — explicitly never letters, numbers, initials, words, dates,
 * or any readable/symbolic marking of any kind.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_pumpkin_carving_moment.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct descriptions of ONE PUMPKIN, alone, at a small
personal carving project, for a cozy countryside anime Halloween bot. The pumpkin (or its already-
carved face, once finished) is ALWAYS the grammatical subject named FIRST in the sentence — this is
a PLACE/OBJECT description only, with NO implied person and NO action verb that requires visible
hands (describe STATES and OBJECTS, not someone doing something — e.g. "one triangle eye already cut
clean through the rind" not "carefully cutting one triangle eye").

CRITICAL — exactly ONE pumpkin, one small personal carving moment. NEVER a table or row of multiple
lanterns, NEVER a contest, NEVER a "biggest pumpkin" display, NEVER festival bunting, booths, or
game decorations — this is a small, quiet, PERSONAL Halloween moment, the opposite of a public
festival or crowd scene.

Vary the carving STAGE across entries: the lid freshly cut and set aside beside the pumpkin, its
open top revealing the hollowed inside; one eye shape already cut clean through the rind while the
rest of the face is still just penciled in outline; the pale orange-white pulp and pumpkin seeds
scooped into a small bowl or spread on a sheet of newspaper close beside it; the fully finished
carved pumpkin sitting with its face complete, ready to be lit. A small carving tool — a short-
handled paring knife, a serrated pumpkin-carving saw, or a plain wood-handled kitchen knife — rests
on the board or against the pumpkin's rind nearby.

CRITICAL — the carved (or half-carved) face is ALWAYS a simple, concrete, CHEERFUL GEOMETRIC SHAPE
only, described in plain shape-words. Vary the eyes (two triangle eyes / two round eyes / a
crescent-moon eye paired with a round one / a small star shape above one eye) and the mouth (a
jagged toothy grin / a wide gap-tooth smile / a crescent-moon grin / a few playful zigzag teeth) —
always cheerful, silly, playful, grinning, warm and friendly, NEVER sinister, menacing, or genuinely
scary. NEVER imply the carving contains letters, numbers, initials, words, a date, or any readable
or symbolic marking whatsoever — it is purely a simple carved face shape, nothing else.

Describe the scooped pulp and seeds plainly and appetizingly (stringy pale-orange pulp, a small heap
of flat cream-colored seeds) — never gory, gross, or unpleasant. Vary which surface the pumpkin sits
on (a worn wooden cutting board, a spread sheet of newspaper, a flat garden stone, a low wooden
stool) and the pumpkin's own size/shape (a plump round pumpkin, a tall ribbed one, a small squat one
with a curled stem).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A plump round pumpkin sits mid-carving on a worn wooden cutting board, its lid freshly cut and set aside, one triangle eye already sliced clean through the rind while a short paring knife rests against its curved side.", "A finished pumpkin's face grins warmly in the fading light, two round eyes and a wide gap-tooth smile carved clean through the rind, a small heap of stringy pale-orange pulp and cream seeds piled in a bowl close beside it."]

🚫 STRICT BANS: NO named people/characters, NO implied people or hands (someone/anyone/fingers/
hands/carefully cutting/scooping — describe the STATE of the pumpkin and tools, never a person's
action), NO readable text/letters/numbers/initials/dates carved or written anywhere, NO gore or
genuinely scary imagery, NO photographer/camera-brand names, NO festival/contest/booth/bunting/
multiple-pumpkin display language (that belongs to the existing pumpkin-festival concept, not this
small personal moment).

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
