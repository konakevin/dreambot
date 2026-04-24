#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/tropical_flower_arrangements.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} HAWAIIAN TROPICAL FLOWER ARRANGEMENT descriptions for BeachBot's hawaii-flowers path. Each entry describes a specific combination of Hawaiian flowers with COLORS explicitly named. These flowers are blooming on Hawaiian beaches and coastlines — they should feel unmistakably HAWAIIAN.

Each entry: 10-20 words. A vivid description of Hawaiian tropical flowers — species AND colors named.

CRITICAL RULE: Each entry names AT MOST 3-5 flower species/colors. NEVER list more than 5. Flux cannot render 8 distinct species — it collapses them to one color. Keep it tight.

━━━ AVAILABLE SPECIES (use ONLY these — all native/common to Hawaii) ━━━
Plumeria/frangipani (THE Hawaiian flower), bougainvillea, hibiscus (state flower), bird-of-paradise, pikake jasmine (Hawaiian lei flower), ohia lehua (sacred Hawaiian flower — red pom-poms), torch ginger, heliconia (lobster claw), anthurium (heart-shaped), orchids (dendrobium/cattleya/vanda), protea (Maui's signature), ti leaves (deep red/green), naupaka (half-flower of Hawaiian legend), ilima (tiny golden flowers — royal lei), passion flower, blue jade vine, angel's trumpet, shower tree blooms (golden/pink — line Hawaiian streets), tuberose, ginger lily, cup of gold vine, flame tree flowers (royal poinciana), crown flower (Kauai)

━━━ HAWAIIAN FLOWER ENERGY ━━━
These aren't generic tropicals. These are the flowers that DEFINE Hawaii:
- Plumeria leis draped over everything, their sweet scent filling the air
- Hibiscus the size of dinner plates, impossibly vivid
- Ohia lehua sacred red pom-poms — the first flower to grow on new lava
- Pikake jasmine so fragrant you can smell it through the image
- Shower trees raining golden petals like Hawaiian confetti
- Protea alien and magnificent on Maui's slopes
- Bird-of-paradise standing tall like tropical royalty

━━━ ARRANGEMENT TYPES (distribute roughly as shown) ━━━

~50% MIXED — 3-5 different Hawaiian species in CONTRASTING colors:
- "hot pink plumeria, orange bird-of-paradise, and purple vanda orchids tangled together"
- "magenta bougainvillea, white pikake jasmine, and golden shower tree blooms cascading"
- "scarlet anthurium, blue jade vine, and yellow plumeria erupting in wild tangle"

~25% COLOR-THEMED — 3-4 Hawaiian species in a harmonious palette:
- "sunset Hawaiian — peach plumeria, orange heliconia, and coral hibiscus glowing warm"
- "cool Hawaiian blues and purples — blue jade vine, purple dendrobium orchids, and lavender crown flowers"
- "pure white Hawaiian lei flowers — pikake jasmine, cream plumeria, and ivory tuberose"

~15% SINGLE SPECIES, MULTIPLE COLORS — same Hawaiian flower in 3-5 distinct hues:
- "hibiscus in scarlet, golden yellow, and pure white — Hawaii's state flower in every color"
- "plumeria — deep fuchsia, cream, and sunset orange — the scent of the islands"

~10% SINGLE SPECIES, SINGLE COLOR — dramatic monochrome:
- "nothing but crimson ohia lehua — thousands of sacred red pom-pom blooms covering the lava"
- "wall of magenta bougainvillea — papery bracts impossibly dense against Hawaiian sky"

━━━ RULES ━━━
- ONLY Hawaiian/tropical species from the list above — no roses, no delphiniums, no tulips, no temperate flowers
- ALWAYS name specific colors — not just "colorful" but "scarlet, gold, periwinkle"
- Each entry should paint a vivid picture of what the viewer SEES
- These flowers are the Hawaiian islands — make every entry feel like aloha

━━━ DEDUP ━━━
No two entries with the same dominant species AND same color palette.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
