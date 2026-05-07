#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/village_wildlife.json',
  total: 200,
  batch: 40,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} WILDLIFE descriptions for FaeBot's fae-village path. Each entry is 35-55 words describing the scene BUZZING WITH VISIBLE FOREST LIFE — both mundane critters (butterflies, squirrels, hummingbirds) AND mythic forest creatures (white stags, owls, fox spirits, ravens, crows, spirit wolves, tree spirits, luna moths). The village must feel ALIVE.

━━━ THE TARGET ━━━

Every entry should look like a Studio Ghibli forest moment — life EVERYWHERE, each creature doing something specific. Not "butterflies drifting" but "three orange monarchs clustered on a foreground foxglove, one mid-flight crossing a god-ray." Mix mundane critter density with mythic-forest cameos that make the world feel enchanted.

References: Mononoke spirit forest creatures + Cinderella's woodland helpers + Snow White's animal companions + Princess Mononoke kodama tree-spirits + Studio Ghibli white-stag moments.

━━━ EVERY ENTRY MUST INCLUDE ALL OF THESE ━━━

1. **3-5 DIFFERENT CRITTER SPECIES** mixed across flying / ground / climbing / mythic
2. **ACTION VERBS for each critter** — what is the critter DOING? hovering at, darting between, drinking from, perched on, gathering, scampering, peeking from, foraging in, leaping to, washing face, grooming, gazing, watching, drifting through, mid-flight
3. **EXPLICIT COUNTS or POSITIONS** — "three" / "a pair of" / "a single" / "a flock of" / "in foreground" / "on the railing" / "by the chimney"
4. **VARIED DISTANCES** — at least one foreground critter, one mid-distance, one near-cottages

━━━ HEADLINE CRITTER ROTATION (the FIRST / most prominent critter — distribute across the pool) ━━━

MYTHIC FLOOR — these MUST appear as headline critter in their target % of entries:
- **WHITE STAG / DEER WITH FAWN** (~5% of entries — about 10 of 200): a white stag standing at the forest edge in middle distance / a doe with twin fawns grazing beyond the cottages / a stag crossing a stream
- **OWL** (~5% — about 10 of 200): a barred owl perched on a branch with golden eyes / a snowy owl in flight at twilight / a great-horned owl on a chimney / an owlet peeking from a hollow
- **FOX SPIRIT** (~5% — about 10 of 200): a translucent glowing-eyed fox spirit at the forest edge / a fox spirit with multiple tails crossing a moonlit clearing / a small fox spirit silhouette drifting between trunks
- **RAVEN** (~4% — about 8): a raven perched on a stone arch / a pair of ravens on a chimney / a raven mid-flight crossing god-rays
- **CROW** (~4% — about 8): a flock of crows wheeling over the village / a single crow on a fence-post
- **SPIRIT WOLF** (~4% — about 8): a translucent spirit wolf gazing from the deep forest / a small spirit wolf pup curled at a doorway
- **TREE SPIRIT / KODAMA** (~5% — about 10): tiny white kodama tree-spirits clustered in middle distance with rotating heads / a single kodama peeking from a knothole / kodama sitting on roots
- **LUNA MOTH** (~4% — about 8): a luminous pale-green luna moth resting on a window / a luna moth in flight at the lantern / a pair of luna moths on a foreground leaf

MUNDANE CRITTER ROTATION — distribute the rest of the entries across these (don't lean on any one):
- **HUMMINGBIRD** as headline (~10%)
- **SQUIRREL** as headline (~10%) — red, grey, fox squirrel
- **CHIPMUNK** as headline (~8%)
- **BABY RABBIT** as headline (~8%)
- **HEDGEHOG** as headline (~6%)
- **MOUSE** as headline (~5%)
- **FROG** as headline (~5%)
- **DRAGONFLY** as headline (~5%)
- **SONGBIRD** (robin / bluebird / finch / wren / chickadee) as headline (~5%)
- **BUTTERFLY** as headline (~5%) — monarch / swallowtail / morpho / painted-lady
- **BEE / BUMBLEBEE** as headline (~3%)

━━━ SUPPORTING CRITTER VOCABULARY (use 2-3 of these per entry alongside headline) ━━━

FLYING: hummingbirds, butterflies, dragonflies, moths (luna, atlas, hawk), songbirds, bees, bumblebees, fireflies, glowbugs
GROUND/CLIMBING: squirrels, chipmunks, hedgehogs, baby rabbits, forest mice, frogs, ladybugs, snails (painted shells)
LARGER & MYTHIC: white stags, deer with fawn, owls (barred / snowy / great-horned), fox spirits, ravens, crows, spirit wolves, tree-spirits/kodama
LIVING-SCENE TOUCHES (always include 1-2): smoke from chimney, hanging laundry, lit windows with warm glow, garlands of flowers, hanging herb-bundles

━━━ EXAMPLES (write fresh — do not copy) ━━━

MYTHIC HEADLINE:
- "A white stag with antlers wreathed in vines standing in middle distance at the forest edge gazing toward the village, three monarch butterflies on a foreground foxglove, a chipmunk scampering along a stone path, songbirds perched on a beam, smoke from a chimney."
- "A barred owl with golden eyes perched on a moss-covered branch above the cottage, a hummingbird at a foreground fuchsia, a frog mid-leap from a lily-pad, ladybugs on a fern, lit windows with warm glow."
- "A glowing-eyed fox spirit silhouette drifting between trunks at the forest edge in middle distance, a red squirrel balancing on a vine-rope railing, a luna moth resting on a wooden door, butterflies in light shafts, hanging laundry."
- "A flock of three ravens wheeling over the village rooftops, a chipmunk peeking from a knothole with cheek-pouches stuffed, dragonflies skimming a pond, smoke curling from chimneys."
- "Tiny white kodama tree-spirits clustered on a moss-covered root in middle distance with their heads rotating softly, a hedgehog snuffling through leaf-litter foreground, a bumblebee on lavender, songbirds on a hewn beam."
- "A translucent spirit wolf gazing from the deep forest in middle distance, a baby rabbit upright on hind legs at the cottage doorstep, hummingbirds at trumpet-flowers, butterflies in god-rays."
- "A pair of luna moths with luminous pale-green wings resting on the window-frame, a frog on a foreground lily-pad, a chipmunk on the stone path, fireflies drifting, lit windows."

MUNDANE HEADLINE:
- "Three orange monarch butterflies clustered on a foreground foxglove, two more drifting through god-rays, a red squirrel balancing on a vine-rope railing with an acorn, a pair of bluebirds on a beam, a chipmunk on the path."
- "A hummingbird hovering at a foreground trumpet-flower with wings blurred, a dragonfly skimming a pond, a baby rabbit upright on hind legs at the doorstep, hedgehog snuffling leaf-litter, lit windows."
- "A red squirrel washing its face with paws on a stone bridge railing, three painted-lady butterflies in mid-flight crossing a sunbeam, a frog perched on a lily-pad, a damselfly above it, smoke from a chimney."

━━━ AVOID ━━━

- Vague "butterflies drifting" without count or location — Flux drops vague critters
- Same headline critter across consecutive entries — rotate broadly per the floors above
- Predator/prey violence — fae world is peaceful, even spirit wolves and owls are watchful, never hunting
- Critters in unrealistic anthropomorphic poses (a squirrel on hind legs is fine; a squirrel reading a book is not)
- Fae figures or fairies as wildlife — those belong in other paths' subjects, not the village's wildlife layer

━━━ STRUCTURAL VARIETY (NON-NEGOTIABLE — pool will be 200 entries) ━━━

When prior batches are shown as "ALREADY GENERATED" — actively diverge. Do NOT repeat headline-critter / supporting-critter / opening-structure clusters from prior entries. Every entry is a fresh combination.

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete wildlife description (35-55 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
