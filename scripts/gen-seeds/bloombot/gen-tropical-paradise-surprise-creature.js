#!/usr/bin/env node
/**
 * BLOOMBOT_TROPICAL_PARADISE_SURPRISE_CREATURE — single hero tropical
 * creature framed in a tropical-paradise bloom scene. Keel-billed
 * toucan, poison-dart frog, ruby-throated hummingbird, blue morpho
 * butterfly, green iguana.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_tropical_paradise_surprise_creature.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SURPRISE CREATURE entries for BloomBot's tropical-paradise path — a single hero tropical creature framed within a tropical-paradise bloom scene. Each entry is one descriptive line, 30-50 words, starting with a CAPS NAME, em-dash, then body describing the creature, its placement in the frame (foreground / midground / background), and its interaction with the tropical bloom-mass.

━━━ THE BAR ━━━
Every entry names a SPECIFIC tropical creature (bird, frog, reptile, insect, mammal, fish) + a placement in the scene + a small action or pose. Saturated, jewel-toned, surface-detailed. Toucans, hummingbirds, poison-dart frogs, blue morpho, green iguana, scarlet macaw, golden lion tamarin, etc. The creature is the HERO of the scene.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"KEEL-BILLED TOUCAN ON BRANCH — solitary keel-billed toucan perched on a midground branch, oversized rainbow beak crisp against the clearly-defined canopy layers behind, body compact and sharply rendered"
"NEON-BLUE POISON-DART FROG — solitary poison-dart frog on a broad wet foreground leaf, fluorescent-cobalt skin catching dappled shaft of light, toe-pads splayed, eyes glinting like obsidian beads"
"RUBY-THROATED HUMMINGBIRD AT HIBISCUS — solitary jewel-throated hummingbird hovering at a foreground hibiscus, wings a transparent motion-blur, beak just grazing the stamen"
"BLUE MORPHO BUTTERFLY — solitary blue morpho caught mid-glide in midground, wings electric-cobalt with pale translucent margins, body soft with motion-blur, humid jungle air visible behind"
"GREEN IGUANA ON BRANCH — solitary green iguana sunning on a horizontal midground branch, reptile-scale detail crisp, dewlap relaxed flat, surrounding canopy receding in crisp sharp overlapping layers"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~5 TROPICAL BIRDS (keel-billed toucan, scarlet macaw, blue-yellow macaw, hyacinth macaw, golden conure, resplendent quetzal, gold-and-blue tanager, crimson cardinal)
- ~5 HUMMINGBIRDS (ruby-throated, calliope, sword-billed, violet-eared, fiery-throated, anna, marvelous spatuletail, white-necked jacobin)
- ~4 FROGS / AMPHIBIANS (poison-dart frog, red-eyed tree frog, glass frog, blue-poison frog, golden frog, harlequin frog)
- ~4 BUTTERFLIES / MOTHS (blue morpho, owl-butterfly, atlas-moth, paradise-bird-wing, malachite, postman, glasswing)
- ~4 REPTILES (green iguana, gecko, anole, basilisk lizard, chameleon, emerald-tree-boa, vine-snake)
- ~3 SMALL MAMMALS (golden-lion tamarin, capuchin monkey, sloth, kinkajou, slow-loris, agouti)
- ~3 LARGE MAMMALS (jaguar, ocelot, jaguarundi, tapir, capybara)
- ~3 INSECTS (jewel-beetle, atlas-beetle, leaf-cutter ants on bloom, glowworm-cluster, jewel-wasp)
- ~3 PARROTS / SMALL PARROTS (lovebird pair, lorikeet, conure, parrotlet)
- ~3 RAINFOREST GROUND-BIRDS (hoatzin, curassow, agami heron, sunbittern, trumpeter)
- ~3 FOREST-FLOOR (red-and-blue dart frog on leaf, leaf-cutter ant trail, single iridescent beetle, jewel-tarantula on bark)
- ~3 PARADISE-BIRD (six-plumed paradise-bird, king bird-of-paradise, twelve-wired paradise-bird)
- ~3 IGUANA / LIZARD UNUSUAL (Komodo monitor, frilled-lizard, Jackson chameleon, panther-chameleon)
- ~3 WATER-CREATURE (mandarin fish at surface, paradise-fish at lotus, single discus surfacing, fire-belly newt on stone)

━━━ BANS ━━━
- NO photographer-name drops.
- NO sci-fi / no neon / no hologram.
- NO crowds — each entry is a SINGLE hero creature.
- NO bare "tropical animal" — name the SPECIFIC species + placement + small action/pose.
- NO action chaos — the creature is at REST or in slow motion.

━━━ FORMAT ━━━
Each entry: 30-50 words. Format: "NAME CAPS — body text naming the specific species + placement in frame + small action + surface qualifier".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
