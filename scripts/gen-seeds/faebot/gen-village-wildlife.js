#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/village_wildlife.json',
  total: 25,
  batch: 25,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} WILDLIFE descriptions for FaeBot's fae-village path. Each entry is 35-55 words describing the scene BUZZING WITH VISIBLE CRITTER ACTIVITY — hummingbirds, butterflies, dragonflies, squirrels, chipmunks, songbirds, fireflies, frogs, ladybugs, hedgehogs, baby rabbits, mice. The village must feel ALIVE.

━━━ THE TARGET ━━━

Every village scene should look like a Studio Ghibli forest moment — critters EVERYWHERE, each one doing something specific. Not "butterflies drifting" but "three orange monarch butterflies clustered on a foreground foxglove, one mid-flight crossing a god-ray, two perched on a window-box." Density and ACTION matter.

Reference: Mononoke spirit forest creatures + Cinderella's woodland helpers + Snow White's animal companions + Princess Mononoke kodama scene density.

━━━ EVERY ENTRY MUST INCLUDE ALL OF THESE ━━━

1. **3-5 DIFFERENT CRITTER SPECIES** — variety across flying / ground / climbing
2. **ACTION VERBS for each critter** — what is the critter DOING? Locked verbs like:
   - hovering at, darting between, drinking from, perched on, gathering, scampering, peeking from, foraging in, sipping from, balancing on, leaping to, washing face, grooming
3. **EXPLICIT COUNTS or POSITIONS** — "three" / "a pair of" / "a flock of" / "in foreground" / "on the railing" / "by the chimney" — Flux renders specifics, not vague gestures
4. **VARIED DISTANCES** — at least one foreground critter, one mid-distance, one near the dwelling

━━━ CRITTER VOCABULARY (rotate broadly across entries) ━━━

FLYING (most common):
- hummingbirds (hovering at flowers, drinking from blossoms, wings as blur)
- butterflies — monarch (orange), swallowtail (yellow/black), morpho (electric blue), painted lady (peach), cabbage white
- dragonflies (skimming water, hovering, electric-blue or red bodies)
- moths — luna moth (pale green), atlas moth, hawk moths
- songbirds — robins, bluebirds, finches, wrens, chickadees, hummingbirds at feeders
- fireflies / glowbugs (constellation clouds)
- bees / bumblebees on flowers
- a small owl on a branch (occasional)

GROUND CLIMBING (must include in 60%+ of entries):
- **squirrels** — red, grey, fox squirrel — gathering nuts, leaping between branches, balancing on railings, peeking around tree trunks, washing face with paws
- **chipmunks** — cheek-pouches stuffed, scampering along paths, peeking from holes, foraging at doorsteps
- **hedgehogs** — snuffling through leaves, on a porch step, drinking from a tiny saucer
- **baby rabbits** — bunnies grazing in clover, kits at the foot of cottages, one upright on hind legs, ears alert
- **forest mice** — peeking from doorways, on windowsills, scurrying along beams, gathering crumbs
- **frogs** — on lily-pads, on mossy stones, mid-leap to a bigger pad
- **ladybugs / beetles** — on foreground leaves, climbing flower stems

LARGER (occasional cameos, distant):
- a deer at the forest edge with fawn
- a fox-spirit silhouette glimpsed in trees
- a small owl perched on a branch
- a heron at a stream

LIVING-SCENE TOUCHES (always include 1-2):
- smoke curling from a chimney
- hanging laundry on a clothesline
- lit windows with warm glow
- garlands of flowers / hanging herb-bundles

━━━ EXAMPLES (write fresh — do not copy) ━━━

- "Three orange monarch butterflies clustered on a foreground foxglove, two more drifting through god-rays mid-frame, a red squirrel balancing on a vine-rope railing with an acorn between paws, a pair of bluebird songbirds on a hewn-wood beam, a chipmunk scampering along the stone path with cheek-pouches stuffed, smoke curling from a chimney."

- "A hummingbird hovering at a foreground trumpet-flower with wings a blur, a dragonfly skimming a small pond, a baby rabbit upright on hind legs at the cottage doorstep, a hedgehog snuffling through leaf-litter in the foreground, ladybugs on a fern, lit windows with warm glow."

- "A grey squirrel leaping between two oak branches mid-frame, a flock of fireflies forming a slow drifting constellation between dwellings, a frog mid-leap from a lily-pad to a mossy stone, a swallowtail butterfly perched on a moss-covered railing, a forest mouse peeking from a doorway with a crumb of bread, hanging laundry billowing softly."

- "Two chipmunks foraging in foreground clover with cheek-pouches stuffed, a hummingbird drinking from a hanging fuchsia flower-basket, a pair of robins on a windowsill, a luna moth resting on a wooden door, butterflies in golden god-rays, smoke from a chimney."

- "A red squirrel washing its face with paws on a stone bridge railing, a bumblebee on a lavender stalk in foreground, three painted-lady butterflies in mid-flight crossing a sunbeam, a frog perched on a foreground lily-pad with a damselfly above it, lit windows with warm glow, hanging herb-bundles."

- "A baby rabbit grazing in foreground clover, a deer with fawn glimpsed at the forest edge in middle distance, a chipmunk peeking from a hollow log, dragonflies skimming above a still pond near the cottages, songbirds perched on the porch railing, smoke curling from two chimneys."

- "A hedgehog drinking from a tiny saucer at a doorstep, a flock of bluebirds at a hummingbird feeder, three monarch butterflies on a foxglove, a chipmunk scampering up a moss-covered tree trunk, ladybugs on a foreground fern, a fox silhouette glimpsed at forest edge."

━━━ AVOID ━━━

- Vague "butterflies drifting" without count or location — too easy for Flux to omit
- Single-species lists ("butterflies and hummingbirds and bees") — needs ACTION + position
- Predator/prey violence — fae world is peaceful
- Critters in unrealistic anthropomorphic poses (a squirrel on hind legs is fine; a squirrel reading a book is not)
- Fae figures or fairies as wildlife — those belong in other paths' subjects, not the village's wildlife layer

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete wildlife description (35-55 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
