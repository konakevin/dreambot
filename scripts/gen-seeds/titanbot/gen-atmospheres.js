#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/titanbot/seeds/atmospheres.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC DETAIL descriptions for TitanBot — divine-phenomena. Golden-dust / star-fall / cosmic-embers / divine-mist / glowing-glyphs / petals-of-fate.

Each entry: 6-14 words. One specific divine atmospheric element.

━━━ CATEGORIES ━━━
- Golden-dust (motes of divine gold in beams)
- Star-fall (shooting stars across mythic sky)
- Cosmic-embers (drifting embers of creation)
- Divine-mist (luminous fog of godhood)
- Glowing-glyphs (floating runes / sanskrit / hieroglyphs)
- Petals-of-fate (cherry-blossom / lotus drifting divinely)
- Lightning-arcs (thunder-god discharge)
- Plasma-storm on Olympus peak
- Cherry-blossom storm (sakura-fall intensity)
- Sand-storm from chariot (Egyptian)
- Aurora-curtain (Valkyrie-sky phenomenon)
- Heavenly-rain (rain-of-gold from heavens)
- Flame-droplets (burning embers drifting)
- Serpent-scales shedding (ancient creature detail)
- Snake-skin-dust in sunbeam
- Rose-petals (love-goddess accompanying)
- Ashes-from-pyre (hero's funeral)
- Divine-sparks (hammer-on-anvil creation)
- Cosmic-wind tossing hair
- Feathers-drifting (angel / winged deity)
- Incense-smoke (temple atmosphere)
- Frost-breath in cold mythic-realm
- Mist-rising from sacred-pool
- Pollen-motes in forest-clearing
- Dragon-smoke from lair
- Phoenix-ash rising
- Flower-petals-from-heaven (Buddhist sutra)
- Ocean-spray at goddess-emerging
- Runic-light floating near weapon
- Sun-god-corona blazing around head

━━━ RULES ━━━
- Divine / mythic atmospheric variety
- Visual / painterly elements

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
