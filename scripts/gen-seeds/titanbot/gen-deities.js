#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/titanbot/seeds/deities.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} DEITY descriptions for TitanBot's deity-moment path — god/titan archetypes from world pantheons, by role+domain+culture. NEVER named (no Zeus/Thor/Anubis/Shiva). Rotate pantheons widely.

Each entry: 15-30 words. One deity archetype with distinguishing visual details + pantheon indicator.

━━━ CATEGORIES (rotate across pantheons) ━━━
- Greek/Roman (thunder-god with lightning, sea-god with trident, dawn-goddess with rose-fingers, messenger-god with winged sandals)
- Norse (all-father on throne with ravens, thunder-god with hammer, trickster-god mid-transformation, valkyrie with spear)
- Egyptian (jackal-headed death-judge with scales, sun-god with hawk-head and solar-disc, cat-headed protector-goddess, falcon-god with crook)
- Hindu (dance-god in destruction-pose with four arms and fire, preserver-god blue-skinned on lotus, warrior-goddess riding tiger, elephant-headed wisdom-god)
- Buddhist (seated bodhisattva with multiple arms, temple-guardian with flaming sword, compassion-bodhisattva with willow branch)
- Japanese (sun-goddess emerging from cave, storm-god with sword, rice-god with fox companions, moon-god on jewel-stairs)
- Chinese (jade-emperor on cloud-throne, dragon-queen of southern seas, monkey-king with staff, immortal with peach-of-heaven)
- Aztec/Maya (feathered-serpent descending, sun-god with obsidian knife, rain-god with mask, creator-god-pair)
- Celtic (dagda with cauldron and club, morrigan with raven, horned-god in forest, warrior-queen on chariot)
- African/Yoruba (storm-orisha with double-axe, river-goddess with mirror, trickster-orisha at crossroads)
- Slavic (thunder-god with axe, earth-goddess with grain, fire-god in forge)
- Polynesian (trickster-hero pulling islands from sea, volcano-goddess with flowing hair)
- Mesopotamian (Marduk-archetype with storm-weapons, Inanna-archetype in underworld robes)
- Native American (thunderbird spreading wings, spirit-bear teaching, trickster-coyote)
- Inuit (sea-goddess with long braid, moon-man with sled)
- Aboriginal (rainbow-serpent across sky)

━━━ RULES ━━━
- By role + domain + culture — NEVER named
- Include signature regalia / iconic feature
- Pantheon-specific aesthetic (not generic)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
