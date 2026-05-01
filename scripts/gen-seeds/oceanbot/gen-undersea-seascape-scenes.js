#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/undersea_seascape_scenes.json',
  total: 200,
  append: true,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} HYPOTHETICAL FANTASTICAL UNDERSEA SEASCAPES for OceanBot's undersea-seascape path. These are NOT realistic NatGeo documentary shots — these are IMPOSSIBLE-BEAUTY underwater dreamscapes meant to wow the viewer. Avatar-Pandora-underwater meets Studio-Ghibli-bioluminescent-fantasy meets album-cover wallpaper. Each entry is a fantastical, LUSH, over-the-top underwater landscape.

Each entry: 22-32 words. ONE specific cinematic IMPOSSIBLE undersea moment.

━━━ THE TONE — CRITICAL ━━━
- HYPOTHETICAL, not real. These places don't have to exist.
- LUSH and OVER-THE-TOX visually dense — riotous color, layered detail, abundant life as scale-element accents
- WOW-FACTOR — wallpaper-worthy, double-page-spread, jaw-dropping
- FANTASTICAL — bioluminescent gardens of impossible coral, glowing whale-sized jellyfish, kelp-cathedrals with stained-glass-like translucent fronds, underwater volcanoes erupting magma into water that turns to glass beads, geological impossibilities, Atlantean-scale geology
- The viewer's reaction should be "I want this as my wallpaper"

━━━ ABSOLUTE NO-HUMANS RULE (STRICTLY ENFORCED) ━━━
- NEVER reference humans, divers, scuba gear, snorkelers, swimmers, boats, ships, submarines, lifeboats, longboats, or human silhouettes
- NEVER use her/his/she/he/they/their referring to a person
- NO scuba bubbles, NO oxygen tanks, NO masks, NO fins, NO underwater photographers
- The seascape is empty of human presence — only sea life as scale-element atmospheric accents

━━━ LUSH SUBJECT TYPES (mix broadly) ━━━
1. **BIOLUMINESCENT KELP CATHEDRAL** — towering glowing kelp pillars in cathedral configuration, god-rays from above filtering through luminescent fronds, schools of glowing fish weaving between trunks
2. **IMPOSSIBLE CORAL GARDEN VISTA** — kilometer-wide coral reef in colors that don't exist on Earth, layered terraces of fluorescent reef, manta-ray squadrons as scale elements
3. **DEEP-SEA TRENCH WITH GLOW** — vast canyon dropoff plunging into bioluminescent abyss, walls covered in glowing tube-worm gardens, alien blue-violet light below
4. **VOLCANIC-VENT CATHEDRAL** — undersea volcano erupting magma that flash-cools into translucent glass-bead curtains, chemosynthetic gardens spreading in fluorescent rings
5. **SEAMOUNT CROWNED IN FANTASY-CORAL** — abyssal mountain rising into surface light, summit covered in impossible alien-coral spires, schools orbiting at the peak
6. **UNDER-ICE BIOLUMINESCENT CATHEDRAL** — Antarctic ice ceiling glowing electric-blue from above, hanging ice-stalactites covered in jellyfish gardens
7. **HALOCLINE RIVER WITH BANKS OF GLOW** — visible underwater river with shimmering halocline edges, banks of bioluminescent reeds, glowing fish drifting in the current
8. **MASSIVE JELLY-BLOOM CURTAIN** — wall of giant glowing moon-jellies stretching to invisibility, light pulsing in synchronized waves
9. **WHALE-FALL GARDEN** — massive ancient whale skeleton blooming with impossible alien gardens, bioluminescent tubeworm groves, scale defying belief
10. **SUNKEN OASIS IN ABYSSAL DESERT** — dark abyssal plain stretching to nothing, then a single luminous oasis erupting with glowing vegetation and impossible color
11. **PILLOW-LAVA MAZE** — labyrinth of obsidian-glass lava tubes, internal bioluminescent algae illuminating the maze from within, schools weaving through
12. **GIANT KELP RAINFOREST CANOPY** — kelp forest grown to redwood proportions, surface-light canopy filtering down through translucent fronds in cathedral light
13. **CORAL ATOLL WALL CASCADE** — atoll wall plunging from sunlit shallows in stepped terraces, each layer a different coral garden, riotous colors, fish cascading between layers
14. **GIANT GLOWING SEA-FAN FOREST** — gorgonian fans the size of barn doors, entire forests of them, current waving them like trees in wind
15. **FANTASY HYDROTHERMAL TOWERS** — black smoker chimneys grown to skyscraper proportions, glowing gardens climbing them like ivy on cathedrals

━━━ ABSOLUTELY BANNED ━━━
- NO humans (see above hard rule)
- NO ships / wrecks / submarines (other paths)
- NO Atlantis / ruins / temples / statues (lost-cities path)
- NO mermaids (mermaid-legend path)
- NO sea monsters / krakens / serpents / leviathans (kraken-leviathan path)
- NO single-creature focus (deep-wonder / reef-life paths)
- NO documentary-realistic flat shots — push for fantastical
- NO modern human infrastructure — pipelines, oil-rigs, cables

━━━ COMPOSITION RULE ━━━
WIDE-ANGLE PANORAMIC. Vistas. Not close-ups. Massive scale. The geology + lush life + fantastical light is the subject. Schools of fish are SCALE-ELEMENT atmospheric accents — never the focus. Like a wallpaper-poster of a place no one's ever been.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Bioluminescent kelp cathedral the size of Manhattan, towering electric-blue glowing fronds, schools of luminescent jacks weaving like living tinsel between trunks"
- "Impossible coral garden vista in fluorescent magenta-and-cyan-and-gold spreading to the horizon, layered terraces of fantasy reef, manta squadrons gliding in formation overhead"
- "Volcanic-vent cathedral, fifty-meter black smokers wreathed in chemosynthetic gardens that glow electric-violet, magma flash-cooling into translucent glass curtains"
- "Seamount summit crowned in alien-coral spires the colors of a tropical sunset, abyssal black plunging beyond, schools of jacks orbiting like rings of Saturn"
- "Under-ice cathedral with luminescent jellyfish gardens hanging from electric-blue ice stalactites, glowing krill clouds drifting in the cold blue light"

━━━ RULES ━━━
- 22-32 words, ONE concrete fantastical scene per entry
- LUSH, OVER-THE-TOP, FANTASTICAL — never "boring real"
- NO HUMANS, ever
- WIDE-ANGLE panoramic / wallpaper-worthy
- Mix scene types broadly across all entries
- Vivid bioluminescent / impossible-color / cathedral-scale register

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
