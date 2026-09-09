#!/usr/bin/env node
/**
 * FarmBot — fall_corn_maze_detail bespoke pool ("Fall Corn Maze" SEASONAL
 * path — farmbot-fall-corn-maze).
 *
 * One small charming found-object detail at a turn/fork in the maze — the
 * "small wooden signpost with an arrow" idea named in the brief, PLUS
 * several non-signage alternatives so the marker beat isn't the only option
 * (variety + reduces reliance on the one riskiest concept).
 *
 * SIGNAGE-HALLUCINATION RISK (per FARMBOT_PATH_BUILD_STATE.md's
 * garden-vegetable-patch-tending lesson — "wooden plant labels" rendered
 * literal hallucinated numerals despite an explicit "no text" suffix): the
 * CONCEPT of a marker/sign is risky even without the literal word "sign."
 * Any entry describing a directional marker explicitly states "no lettering,
 * no carved marks, no numbers" as part of the entry's own description (not
 * just relying on the pool-wide suffix) and describes it as a plain shaped
 * object (a carved arrow, not a signboard with room for text).
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_fall_corn_maze_detail.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SMALL FOUND-DETAIL descriptions for a corn maze
scene in a cozy countryside anime bot's Fall content — ONE small charming physical detail
tucked at a turn, fork, or bend in the maze path. The detail itself is ALWAYS the grammatical
subject named FIRST in the sentence.

Vary which detail leads, roughly evenly across these categories:

(A) A small plain wooden arrow-shaped marker post at a fork, pointing one direction — ALWAYS
describe it as having NO lettering, NO carved numbers, NO painted marks, NO words of any kind —
just a plain hand-carved arrow shape, weathered wood, maybe tied with a bit of twine or ribbon.

(B) A small bundle of dried corn husks or cornstalks tied together with twine, propped at a
bend or fork as a simple, wordless trail marker.

(C) A cluster of a few small uncarved pumpkins or gourds (whole, no faces, no carving) set at a
crossing point or along the path edge, marking the spot.

(D) A small woven basket, left resting at a bend, holding a handful of gathered fallen leaves or
a few gourds.

(E) A cheerful scattering of fallen leaves swept into a small trail-like drift along one side of
the path, or a single fat pumpkin (uncarved) tucked into a nook where two corn walls meet.

Every entry is a small, warm, human-made or human-placed touch that makes the maze feel tended
and cared-for, never a bare corridor.

CRITICAL — pumpkins/gourds in this pool are ALWAYS whole and uncarved (no jack-o-lantern faces,
no carved features of any kind) — this is general Fall/harvest-season charm, not Halloween.

CRITICAL — this is a PLACE/OBJECT description with NO people in it at all, not even implied
ones. Do NOT mention figures, crowd, riders, children, kids, bystanders, faces, hands, footprints
(implies someone just left), or any word implying a person is present or was recently present. An
object simply resting/propped/tucked in place is fine — do not describe anyone having just set
it there.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 20-35 words each.

Examples:
["A small hand-carved wooden arrow marker leans at the fork in the path, plain weathered wood with no lettering or carved marks of any kind, just its simple arrow shape pointing the way, a bit of twine looped near its base.", "A little bundle of dried corn husks tied together with rough twine rests propped against the corn wall at a bend, a wordless trail marker among the rustling stalks."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/
kids/bystanders/faces/hands/footprints), NO readable text/lettering/numbers/painted marks of any
kind on ANY object, NO signboard or plank with room for writing, NO brand names, NO photographer/
camera-brand names, NO jack-o-lanterns or carved pumpkin faces, NO costumes or spooky/Halloween
content (this is general Fall/harvest-season charm, not Halloween).

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
