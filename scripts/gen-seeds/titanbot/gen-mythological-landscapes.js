#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/titanbot/seeds/mythological_landscapes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} MYTHOLOGICAL LANDSCAPE descriptions for TitanBot's mythological-landscape path — sacred mythic realms. No characters. Pantheon diversity.

Each entry: 15-30 words. One specific mythic realm/landscape.

━━━ CATEGORIES ━━━
- Mount Olympus summit with marble temples and golden clouds
- Valhalla great hall with soaring roof and einherjar-banners
- Avalon mist-shrouded island with apple trees
- Mictlan underworld descent with nine levels visible
- Asgard rainbow-bridge Bifrost leading to world-tree
- Takamagahara plain-of-high-heaven with sun-gate
- Tir na nOg land-of-eternal-youth with Celtic mounds
- Aztec Xibalba underworld with bone-palace
- African creation-pools with spirit-reflections
- Egyptian afterlife Duat with river of dead
- Hindu Mount Meru cosmic axis with celestial spheres
- Chinese Jade-Palace heavens with immortal gardens
- Mesopotamian ziggurat of Ekur reaching sky
- Olympus storm-top with thunder-throne empty
- Elysian fields with asphodel meadows
- Hades underworld with Styx river and shades
- Cenote of Mayan creation with divine descent-point
- Dreamtime pathways across Aboriginal landscape
- Mount Fuji with Amaterasu-light breaking
- Slavic Irij island with world-tree
- Native American sacred mountain with thunderbird eagles
- Yoruba Oshun-river with gold-flecked water
- Japanese Takachiho cave of sun-goddess
- Celtic faery-mound Brú na Bóinne
- Hindu Vaikuntha preserver-realm on cosmic-serpent
- Aztec Tollan golden-city with feathered-serpent temple
- Buddhist Pure-Land western paradise
- Inuit sea-goddess's deep-ocean domain
- Mesopotamian garden of Dilmun

━━━ RULES ━━━
- Specific pantheon realms
- No characters (pure mythic environment)
- Architectural + geographic detail

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
