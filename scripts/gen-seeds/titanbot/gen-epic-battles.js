#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/titanbot/seeds/epic_battles.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} EPIC BATTLE descriptions for TitanBot's epic-battle path — cosmic-scale mythic battle setups. No named deities.

Each entry: 15-30 words. One specific mythic battle scene.

━━━ CATEGORIES ━━━
- End-times gods-vs-giants (mythic gods battling giants at world-ending scale)
- Titan-fall (ancient titans cast from heaven, falling through sky)
- Hero-vs-world-monster (Heracles-archetype battling hydra, Perseus-archetype vs gorgon)
- Sky-splitting divine war (two pantheons colliding in heavens)
- Thunder-god-vs-serpent (Thor-archetype battling world-serpent Jörmungandr)
- Wolf-devouring-sun (Fenris-archetype consuming sun)
- Death-god-vs-trickster (underworld lord battling chaos-bringer)
- Dragon-vs-thunder-god (ancient dragon rising to meet sky-god)
- Valkyrie-choosing-dead (on battlefield after great slaughter)
- Monkey-king-vs-heavens (trickster defying celestial court)
- Feathered-serpent-returning (descent to battle)
- Hindu cosmic-dance of destruction and rebirth
- Norse Ragnarok ice-and-fire end
- Greek Titanomachy mountain-throwing
- Mesopotamian Marduk-vs-Tiamat (hero-god vs sea-chaos)
- Egyptian Horus-vs-Set (sky vs desert god)
- Japanese Susanoo-vs-Orochi (storm-god vs eight-headed serpent)
- Chinese Sun-Wukong vs heavenly host
- Aztec solar-creation battle
- Celtic Cath Maige Tuired (two races of gods)
- African storm-spirits-vs-sea-chaos
- Hindu Mahabharata war on Kurukshetra (divine scale)
- Japanese Heian court warring with yokai
- Creation-battle primordial waters vs first light
- Aztec heart-offering battle between suns
- World-tree under siege by darkness
- Twilight-of-gods mountain-crumbling
- Hero ascending to divine combat
- Prometheus-archetype chained on mountain with eagle
- Twelve-labors mid-battle (shepherd-hero with lion)

━━━ RULES ━━━
- Cosmic-scale mythic battles
- Pantheon-diverse (not all Greek/Norse)
- No named deities — by role only

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
