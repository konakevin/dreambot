#!/usr/bin/env node
/**
 * FarmBot — halloween_costume_parade_setting bespoke pool
 * ("Halloween Costume Parade" seasonal path, farmbot.seasonalPaths.halloween).
 *
 * Path-bespoke PLACE pool (no people in it at all — same pattern as
 * HARVEST_FESTIVAL_PLACE) — the outdoor WALKING PATH/LANE the parade moves
 * along, with autumn Halloween decor baked directly into the same sentence
 * (small carved pumpkins, string lights, hay bales, garlands, fallen
 * leaves) so decor never gets assigned to a setting it doesn't physically
 * fit. Always a whole living, decorated little world, never a bare road.
 *
 * Kept deliberately distinct from two sibling Halloween paths (built
 * concurrently by other agents, per Kevin's brief):
 *   - farmbot-halloween-barn-party — INDOOR/barn-decorated party scale.
 *     This pool is NOT an interior and NOT a party venue (no tables of
 *     snacks, no dance floor, no barn interior at all).
 *   - farmbot-halloween-trick-or-treating — door-to-door/treat-bag
 *     narrative. This pool is NOT a house's front porch/doorstep and never
 *     implies knocking on doors.
 * This pool is specifically a WALKING ROUTE — a lane, path, street, or trail
 * the parade moves ALONG — decorated on either side.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_costume_parade_setting.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct OUTDOOR HALLOWEEN PARADE PATH scene descriptions for a
cozy countryside bot — a walking lane, path, or street the parade moves ALONG, rendered as a rich,
lively, decorated little world, entirely through its physical objects and decorations. The path/lane
itself is ALWAYS the grammatical subject named FIRST in the sentence.

CRITICAL — this is a WALKING ROUTE, not a venue. Vary which of these lead each entry: a cobblestone
village lane, a farm dirt path between fences, a garden path lined with hedges, an orchard path under
low branches, a path through a pumpkin patch, a bridge over a small creek, a tree-lined avenue, a
path along a split-rail fence, a lane past a row of cottages, a path through tall cornstalks trimmed
into an archway. ALWAYS decorate the path itself with Halloween touches baked into the same sentence:
small carved jack-o-lanterns lining the edges (grinning cute and simple, never scary), strings of warm
lights looped overhead or along fences, stacked hay bales here and there, garlands of dried leaves or
bat-shaped or ghost-shaped paper cutouts strung between posts (ALWAYS use exactly this "X-shaped paper
cutout(s)" phrasing — NEVER write "paper ghosts"/"paper bats" as a bare noun; a live render confirmed
that wording gets read as literal small animate ghost/bat CREATURES with drawn faces scattered along
the fence, not flat paper decorations — same token-literalism risk class as the documented "fire"/
"herd" traps), scattered fallen autumn leaves, small woven corn-husk
bundles. Vary time of day within a late-afternoon-to-dusk Halloween mood, angle, and which lush
details lead. Convey festivity entirely through the OBJECTS and LIGHT — string lights glowing, cute
jack-o-lanterns grinning, leaves drifting — never through depicting a crowd.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones, and it is
a WALKING PATH, never an interior, never a party venue (no tables, no dance floor, no snack spread),
and never a specific house's porch/doorstep (no knocking, no treat bags, no doorbell). Do NOT mention:
figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces, hands, someone/anyone
doing something.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A cobblestone village lane curves gently between cottages, small carved jack-o-lanterns grinning from every doorstep along the way, strings of warm amber lights looped between lampposts, fallen leaves scattered across the stones in the soft dusk light.", "A dirt farm path runs between two split-rail fences strung with warm little lights, stacked hay bales set at intervals along the way, a scatter of small carved pumpkins glowing at their bases as the late afternoon light turns amber and gold."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/kids/
bystanders/onlookers/laughter/faces/hands), NO readable text/banners/signage, NO brand names, NO
photographer/camera-brand names, NO bare/empty path lacking Halloween decor, NO interior/barn/party
venue, NO specific front-porch/doorstep-for-trick-or-treating framing, NO pairing of dark/darkness/
shadow with a light-implying word (glint/sparkle/shimmer/luminous/glow) describing the same thing.

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
