#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/tropical_flower_arrangements.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TROPICAL FLOWER ARRANGEMENT descriptions for BloomBot's tropical-paradise path. Each entry describes a specific combination of Hawaiian/tropical flowers with COLORS explicitly named.

Each entry: 10-20 words. A vivid description of tropical flowers — species AND colors named.

CRITICAL RULE: Each entry names AT MOST 3-5 flower species/colors. NEVER list more than 5. Flux cannot render 8 distinct species — it collapses them to one color. Keep it tight.

━━━ AVAILABLE SPECIES (use ONLY these, all Hawaiian/tropical) ━━━
Plumeria/frangipani, bougainvillea, hibiscus, bird-of-paradise, pikake jasmine, ohia lehua, torch ginger, heliconia (lobster claw), anthurium, orchids (dendrobium/cattleya/vanda), protea, ti leaves, naupaka, ilima, passion flower, blue jade vine, angel's trumpet, shower tree blooms, tuberose, ginger lily, cup of gold vine, flame tree flowers

━━━ ARRANGEMENT TYPES (distribute roughly as shown) ━━━

~50% MIXED — 3-5 different tropical species in CONTRASTING colors:
- "hot pink plumeria, orange bird-of-paradise, and purple vanda orchids tangled together"
- "magenta bougainvillea, white tuberose, and golden shower tree blooms cascading"
- "scarlet anthurium, blue jade vine, and yellow plumeria erupting in wild tangle"

~25% COLOR-THEMED — 3-4 tropical species in a harmonious palette:
- "sunset tropics — peach plumeria, orange heliconia, and coral hibiscus in warm layers"
- "cool blues and purples — blue jade vine, purple dendrobium orchids, and lavender passion flowers"
- "pure white — pikake jasmine, cream plumeria, and ivory tuberose carpeting everything"

~15% SINGLE SPECIES, MULTIPLE COLORS — same flower in 3-5 distinct hues:
- "hibiscus in scarlet, golden yellow, and pure white"
- "plumeria — deep fuchsia, cream, and sunset orange blooms"

~10% SINGLE SPECIES, SINGLE COLOR — dramatic monochrome:
- "nothing but crimson ohia lehua — thousands of feathery red pom-pom blooms"
- "wall of magenta bougainvillea — papery bracts impossibly dense"

━━━ RULES ━━━
- ONLY Hawaiian/tropical species from the list above — no roses, no delphiniums, no tulips
- ALWAYS name specific colors — not just "colorful" but "scarlet, gold, periwinkle"
- Each entry should paint a vivid picture of what the viewer SEES
- Mix types AND colors freely — plumeria next to orchids next to heliconia
- Include trailing/cascading/climbing descriptions where appropriate

━━━ DEDUP ━━━
No two entries with the same dominant species AND same color palette.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
