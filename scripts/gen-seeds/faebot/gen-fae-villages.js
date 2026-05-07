#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/fae_villages.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
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
7. HANGING LEAF NEST — woven leaf nest suspended from branches
8. FAIRY RING COURTYARD — circular village center inside a mushroom ring, mossy stone circles
9. VINE-WRAPPED TREEHOUSE — single or multiple treehouses, layered vertical
10. STONE RUIN RECLAIM — ancient broken ruins overtaken by ivy and flowers
11. FLOWER-BLOSSOM DWELLING — home INSIDE a giant trumpet-flower, bell-flower, foxglove-bell, or oversized rose; petals as walls and roof, stamen as fixtures
12. FLOATING SEED-POD HOME — dandelion / seedpod home hovering above forest floor, tethered by vines
13. GLASS-LEAF DOME — translucent dome shaped like a leaf
14. FIREFLY NOMADIC CAMP — temporary tents of silk and leaves, woven mats
15. BUSH HIDEAWAY — woven nest INSIDE a thick bramble or berry-bush, twig-frame entrance hidden among leaves
16. ACORN / GOURD COTTAGE — entire dwelling carved into a giant acorn, walnut-shell, pumpkin, or gourd
17. SPIDER-SILK HAMMOCK HOME — soft hammock-pavilion hung between branches, draped silk walls
18. BIRD-EGG SHELL DWELLING — abandoned giant bird egg-shell upgraded into a cozy home with carved opening
19. CREATIVE INVENTION — invent your own organic-impossible dwelling (snail-shell home, inverted-mushroom hanging cottage, crystal-geode interior, spider-web lattice loft, hollowed-pinecone, lantern-fruit cottage, etc.)

━━━ HARD RULES ━━━
- The scene must include ONE clear dwelling type from the list above
- The dwelling must feel GROWN, not built — organic integration with the forest
- Materials are bark, moss, vine, petal, wood, mushroom, woven natural materials, hewn stone — never milled lumber, metal hardware
- DIMENSIONAL architecture (multi-story, balconies, stairs, real cottage shapes when applicable — not flat shacks)
- DO NOT describe lighting, fireflies, wildlife, atmospheric particles, or magical motes — those are layered in separately

━━━ COMPOSITION PATTERNS — DISTRIBUTE ACROSS THE POOL ━━━

**Pattern A — INTERCONNECTED-VIA-NATURE NETWORK (~30% — i.e. ~15 of 50 entries):**
A village where dwellings are CONNECTED VIA NATURAL INFRASTRUCTURE — multiple bridges of varied types (stone arch, wooden plank, vine-rope), rope-ladders, swings, vine-cord boardwalks, hanging plank walkways, knotted-rope ladders, tree-root catwalks, branch-to-branch vine-cord webs. The eye reads it as a NETWORK, not a single house. Mix WATER+BRIDGES networks with TREETOP+VINE-WEB networks freely.
- "A village along a forest stream — three cottages on the left bank emerging from oak trunks, two on the right built into mossy roots, a stone arch-bridge crossing at the lower water plus a wooden plank bridge upstream plus a vine-rope bridge overhead between treetops"
- "A treetop village of five hanging-nest cottages connected by a NETWORK of vine-rope bridges, knotted-rope ladders, and a swing dangling from the central trunk"
- "A waterfall-cliff village of three cottages on different ledges connected by a stone bridge over the upper pool plus a wooden plank-walkway carved into the cliff face plus a vine-rope bridge spanning the gorge"

**Pattern B — SOLITARY OR PAIRED DWELLING (~30% — i.e. ~15 of 50):**
A SINGLE beautiful dwelling (or a tight pair) as the focus — no village, no network, no bridges. Just one (or two) intricate fae cottage(s) integrated into nature. The dwelling itself fills the frame. Stairs / a single path / a porch / mossy steps are fine, but no inter-dwelling bridges.
- "A hollow-tree home carved into a colossal ancient oak with bark-arch doorway, three amber windows spiraling up the trunk, hewn-wood balcony at the second story, spiral moss staircase carved into the trunk, ferns and bluebells at the base, surrounded by lush enchanted forest"
- "A glass-leaf dome dwelling shaped like a translucent emerald leaf nestled at the base of a mossy cliff, single carved entrance, vine-cradle holding the structure, surrounded by ferns and flowering creepers"
- "A flower-blossom dwelling built INSIDE a giant trumpet-foxglove bell, petals as walls, stamen as a hanging chandelier, the bell tilted gently from a sturdy stem with a small mossy step at the entrance"

**Pattern C — TREETOP / SUSPENDED SINGLE OR LIGHT-NETWORK (~20% — i.e. ~10 of 50):**
Dwellings suspended in the canopy. Some entries are SINGLE suspended dwellings (a lone seed-pod hanging from a vine, a single hammock-home), others have LIGHT connections (one rope-ladder, one walkway, one vine-cord). Not the dense vine-web of Pattern A.
- "A single seed-pod home suspended from a high branch by a living vine, the entrance facing the sky, a single knotted-vine ladder dropping to ground"
- "A hanging leaf-nest suspended from an oak branch with a single vine-rope bridge connecting it to a small platform on the trunk, hewn-wood porch, woven-leaf roof"

**Pattern D — MULTI-COTTAGE CLUSTER WITHOUT NETWORK (~20% — i.e. ~10 of 50):**
3-5 cottages distributed in a forest clearing, mushroom ring, root grove, or alongside a forest path — but with MINIMAL inter-dwelling infrastructure. Connected only by stepping-stone paths, painted-pebble walkways, mossy stairs, or organic ground-paths. NOT a network with bridges/ladders/swings — just a hamlet that grew where the forest allowed.
- "A mushroom village cluster of seven giant toadstool houses with crimson and cream caps, carved oval doors, woven-grass mats at thresholds, painted-pebble paths winding between caps, ferns and wildflowers at the bases"
- "A fairy-ring courtyard at the heart of the village ringed by six mossy stone-circle dwellings, mossy stepping-stones threading between them, lush ferns at every threshold"

━━━ AVOID ━━━
- Modern construction (cut planks, metal hardware, glass-pane windows)
- Lighting / wildlife / atmospheric mote descriptions (handled by separate axes)
- Forcing multi-bridge networks into every entry — only ~30% should be Pattern A
- Crammed clusters of 10+ cottages on one side
- Flat single-story shacks

━━━ STRUCTURAL VARIETY (NON-NEGOTIABLE — pool will be 200 entries, MUST avoid repetition) ━━━

When 200 entries are generated, the pool MUST feel diverse, not formulaic. Each entry should differ from prior entries on MULTIPLE axes:
- DWELLING TYPE (rotate ALL 19 types — don't lean on hollow-tree / mushroom)
- COMPOSITION PATTERN (A/B/C/D as scoped above)
- NUMBER OF DWELLINGS (1, 2, 3, 4-5, 6+)
- NATURAL FEATURE the dwelling integrates with (oak / cliff / brambles / roots / pond / waterfall / mushroom-ring / canopy / boulder / hollow / glade)
- SCALE (intimate close-up / mid-village / sprawling vista)
- OPENING WORD/STRUCTURE — vary how each entry begins, do not start every entry with "A village..." or "A small..." — mix in "Three cottages...", "The hamlet sprawls...", "Five hanging-nests dangle...", "An ancient oak holds...", "Six toadstools cluster...", "On either side of the brook...", "High in the canopy...", etc.
- VOCABULARY — rotate adjectives across entries (don't reuse "lush" / "ancient" / "twisted" 200 times — also: gnarled, mossy, vine-strangled, fern-girdled, boulder-flanked, ivy-clad, age-blackened, sun-dappled, mist-veiled, wisteria-draped, cherry-strewn, lichen-mottled, root-knotted, cliff-perched, glade-bound, hollow-cradled)

When a prior batch is shown to you as "ALREADY GENERATED" — actively diverge from those structures, dwelling types, scales, and opening words.

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete scene description (35-55 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
