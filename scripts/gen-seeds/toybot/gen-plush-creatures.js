#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/plush_creatures.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `Write ${n} INDIVIDUAL plush-creature archetypes for ToyBot's plush-world path. Each entry = ONE specific plush stuffed-animal with texture + signature visual detail. 8-18 words per entry.

━━━ HARD ANTI-BIAS RULES ━━━
- MAX 8% teddy-bears across pool (not the default — used sparingly).
- MAX 8% plush-bunnies.
- HEAVY emphasis on uncommon / weird / delightful creatures: capybara, axolotl, octopus, pangolin, narwhal, quokka, hedgehog, sloth, llama, alpaca, otter, raccoon, opossum, fennec-fox, chinchilla, hippo, rhino, peacock, kingfisher, jellyfish, manta-ray, sea-turtle, frog, newt, gecko, dragon, unicorn, griffin, phoenix, kitsune-fox-with-multiple-tails, mermaid, kraken, snail, ladybug, butterfly, dragonfly, beetle, mushroom-creature, cloud-being, star-creature.
- Mix REAL animals with FANTASY creatures (~70% real, ~30% fantasy).
- Vary textures: knitted, plush, felted, fiberfill, woolen, patchwork, crocheted, terry-cloth, velveteen, faux-fur, microfiber.
- Vary visual quirks: button-eyes, embroidered-eyes, sequined-eyes, glassy-eyes, mismatched-button-eyes; stitched-mouths, embroidered-grins, felt-tongues; tiny-accessories (knit-scarf, felt-bowtie, mini-glasses, crochet-cape, tiny-crown, leaf-hat, pom-pom-tail).
- Include color descriptors (pastel-mint, dusty-rose, cream, charcoal, marigold, raspberry, periwinkle, sage, butter-yellow, etc.).

━━━ FORMAT ━━━
Each entry is ONE plush-creature, 8-18 words, comma-separated phrases:
- "knitted axolotl in pastel-pink with felt-gill-fronds, embroidered-eyes, tiny scale-bowtie"
- "plush capybara in cream wool-fur with zen-smile, button-eyes, knit-flower-crown"
- "stuffed octopus in marigold velveteen with eight floppy-tentacles, sequined-grin, tiny-monocle"
- "felt narwhal in periwinkle with sparkle-tusk, embroidered-belly, mini-sailor-hat"

━━━ BANNED ━━━
- Teddy-bear / brown-bear if it would push pool over 8% bears.
- Plain bunny if it would push pool over 8% bunnies.
- LBP burlap-and-zipper (Sackboy).
- Real-animal-photographic descriptions.

━━━ DEDUP RULE ━━━
- No two entries should share both ARCHETYPE + COLOR (e.g., "pastel-pink axolotl" only once across pool — vary).
- Vary heavily across the 200 entries.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
