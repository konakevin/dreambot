#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/fae_villages.json',
  // Iteration mode: total=50 fast turnaround. Scale to 200 when recipe locks.
  total: 50,
  batch: 25,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} unified scene descriptions of FAE DWELLINGS for FaeBot's fae-village path. Painterly enchanted-forest world matching FaeBot's other paths. Brian Froud + Greg Manchess + Eyvind Earle painted-fantasy lineage. Each entry feeds a Flux concept-art prompt-writer.

Each entry: 35-55 words, ONE paragraph, focused PURELY on the DWELLING + ITS NATURAL FEATURE + LAYOUT.

LIGHTING and WILDLIFE are layered in via separate axes — DO NOT include them in your descriptions. Just describe the dwelling and its setting.

━━━ DWELLING TYPES — ROTATE ONE PER ENTRY ━━━
1. HOLLOW TREE HOME — massive ancient oak with carved doorway, windows spiraling up, internal staircase visible
2. MUSHROOM VILLAGE — cluster of giant toadstool houses with carved doors, like a little town
3. ROOT-CAVE BURROW — home tucked under twisted roots, earth-sheltered, moss walls
4. STUMP COTTAGE — old tree stump converted into cottage, moss roof, tiny windows
5. WATERFALL CLIFF DWELLING — tiny home built into mossy cliff wall near waterfall
6. CRYSTAL GROVE HUT — woven branches with embedded crystals and rune stones
7. HANGING LEAF NEST — woven leaf nest suspended from branches, rope bridges
8. FAIRY RING COURTYARD — circular village center inside a mushroom ring, mossy stone circles
9. VINE-WRAPPED TREEHOUSE CITY — multiple treehouses connected by bridges, layered vertical village
10. STONE RUIN RECLAIM — ancient broken ruins overtaken by ivy and flowers
11. FLOWER-BLOSSOM DWELLING — home INSIDE a giant trumpet-flower, bell-flower, foxglove-bell, or oversized rose; petals as walls and roof, stamen as fixtures
12. FLOATING SEED-POD HOME — dandelion / seedpod home hovering above forest floor, tethered by vines
13. GLASS-LEAF DOME — translucent dome shaped like a leaf
14. FIREFLY NOMADIC CAMP — temporary tents of silk and leaves, woven mats
15. BUSH HIDEAWAY — woven nest INSIDE a thick bramble or berry-bush, twig-frame entrance hidden among leaves
16. ACORN / GOURD COTTAGE — entire dwelling carved into a giant acorn, walnut-shell, pumpkin, or gourd
17. SPIDER-SILK HAMMOCK HOME — soft hammock-pavilion hung between branches, draped silk walls
18. BIRD-EGG SHELL DWELLING — abandoned giant bird egg-shell upgraded into a cozy home with carved opening
19. CREATIVE INVENTION — invent your own organic-impossible dwelling; lean into magical surprise (snail-shell home, inverted-mushroom hanging cottage, crystal-geode interior, spider-web lattice loft, hollowed-pinecone, lantern-fruit cottage, etc.)

━━━ HARD RULES ━━━
- The scene must include ONE clear dwelling type from the list above
- The dwelling must feel GROWN, not built — organic integration with the forest
- Materials are bark, moss, vine, petal, wood, mushroom, woven natural materials, hewn stone — never milled lumber, glass windows, metal hardware
- DIMENSIONAL architecture (multi-story, balconies, stairs, real cottage shapes when applicable — not flat shacks)
- Multi-tier or multi-point distribution when describing villages (3-7 cottages spread across the scene, NOT clustered on one trunk)
- BRIDGES / WALKWAYS / STAIRS when applicable (stone, wooden, vine-rope, hewn-root) connecting points
- The dwelling sits IN a lush enchanted forest — describe the natural feature it grows from (tree / cliff / stump / brambles / roots / lakeshore / rock formation / mushroom-ring / canopy)
- DO NOT describe lighting, fireflies, wildlife, atmospheric particles, or magical motes — those are layered in separately

━━━ COMPOSITION PATTERNS — DISTRIBUTE ACROSS THE POOL ━━━

Pattern A — WATER + BRIDGES (~30% of entries):
A forest stream, river, or brook threading between dwellings — bridges (stone, wooden plank, vine-rope, hewn-root) connecting cottages on opposite banks. Village SPREAD ACROSS the water.
- "A village along a forest stream — three cottages on the left bank emerging from oak trunks, two on the right bank built into mossy roots, a wooden plank bridge crossing at center plus a vine-rope bridge overhead between treetops"
- "A small hamlet with a winding brook threading between dwellings, three cottages on each side, two stone arch-bridges spanning the water"

Pattern B — FLIGHT-ACCESS / TREETOP / SUSPENDED (~30% of entries):
Fairies fly. Dwellings can have NO ground-level entrance — treetop nests, dwellings suspended from branches, hanging like ornaments, mid-air pavilions tethered by vines. NO stairs, NO paths, NO ground-doors. Access is from above or by flight only.
- "A treetop village of five hanging-nest cottages suspended from branches at the very top of an ancient oak — woven leaf nests dangling like fruit, each with a small round entrance facing the open air, NO stairs or paths, fae access by flight only"
- "A canopy hamlet of three pavilions tethered between branches, mid-air dwellings with vine-cord ladders that hang into open space, accessible only by wing"
- "A single seed-pod home suspended from a high branch by living vine, the entrance facing the sky, no path connecting to ground"
- "A treetop spire cottage at the very crown of a colossal oak, balcony opening to the open sky, no stairs visible — accessible by flight"

Pattern C — GROUND-ACCESSIBLE (~30% of entries):
Cottages with proper doors, stairs, paths at ground level. For walking fae and forest folk who prefer the earth. Dwellings INTO root systems, hill burrows, ground-level cottages with garden paths.

Pattern D — MIXED ELEVATION VILLAGE (~10% of entries):
Combines flight-access AND ground-access — some dwellings high in canopy with no path, others rooted on the ground, the village spans top-to-bottom of the forest layers.

━━━ EXAMPLES (write fresh, do not copy) ━━━
- "A hollow tree home carved into a colossal ancient oak with bark-arch doorway, three amber windows spiraling up the trunk, hewn-wood balcony wrapping at the second story, spiral moss staircase carved into the trunk, ferns and bluebells at the base, hanging vines drooping from the canopy above, surrounded by lush enchanted forest."
- "A small village along a cascading forest stream — three cottages on the left bank emerging from oak trunks, two cottages on the right cliff face built into the rock, a wooden bridge crossing the stream at center plus a vine-rope bridge between the treetops, peaked moss-thatch roofs, lush ferns and mossy boulders framing the scene."
- "A stump cottage hollowed from a giant rotted oak crowned with bracket fungi and twigs, two-story spiral architecture with peaked moss roof, ornate carved door, hewn-wood porch, surrounded by bramble-thickets and wildflowers, hanging vines from the canopy above, lush enchanted forest setting."
- "A mushroom village cluster of seven giant toadstool houses with crimson and cream caps, tiny carved doors, woven-grass mats at each threshold, painted-pebble paths winding between caps, ferns and wildflowers at the bases, mossy stones, surrounded by ancient enchanted forest."
- "A vine-wrapped treehouse city among five mega-trees, six cottages at varied heights connected by rope-bridges and lantern-lined wooden walkways, peaked thatch roofs, balcony porches, hewn-wood stairs spiraling up trunks, lush canopy framing the layout."

━━━ AVOID ━━━
- Modern construction (cut planks, metal hardware, glass)
- Lighting / wildlife / atmospheric mote descriptions (handled by separate axes)
- Crammed clusters of 10+ cottages on one side
- Flat single-story shacks

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete scene description (35-55 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
