#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/deep_creatures.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} DEEP CREATURE descriptions for OceanBot's deep-creature path — real + mythic marine beasts. Real-amplified AND mythical.

Each entry: 15-30 words. One specific marine creature + setting.

━━━ REAL MARINE ━━━
- Whale shark gliding past with suckerfish attached
- Humpback-whale mother-and-calf in blue
- Orca pod in arctic water with ice-above
- Great-white shark with chum-cloud
- Giant-pacific octopus in kelp
- Sperm-whale descending into abyss
- Blue-whale belly in sun-dappled water
- Beluga-whale in ice-cave
- Narwhal-pod with tusks
- Dolphin-pod in ocean-acrobatics
- Sunfish massive in open water
- Manta-ray barrel-rolling in plankton
- Leatherback-turtle descending
- Sea-lion group underwater
- Wolf-eel in crevice
- Frilled-shark ancient-deep
- Giant-squid attacking sperm-whale
- Mobula-ray-swarm
- Sperm-whale family
- Hammerhead-shark-school
- Tiger-shark in shallow
- Bull-shark in murky water
- Blue-shark in open ocean
- Thresher-shark tail-strike mid-action
- Anglerfish with lure-glow

━━━ MYTHIC MARINE ━━━
- Kraken with tentacles emerging from deep
- Leviathan biblical sea-beast ancient
- Sea-serpent coiling through waves
- Ancient-deep-thing Lovecraftian horror
- Multi-tentacled mythic octopus god
- Cthulhu-inspired mountain-from-deep
- Mermaid-drowned-queen ancient shrine
- Sea-dragon eastern-serpentine
- Tiamat primordial sea-goddess
- Kappa water-spirit
- Naga-serpent sea-temple
- Deep-god awakening shadow
- Ghost-ship leviathan in mist
- Serpent-of-Midgard Jörmungandr coiling
- Ancient kraken attacking galleon
- Mermaid-court with multi-tail queen
- Glowing-cetacean ghost-whale

━━━ RULES ━━━
- Include setting / pose / scale
- Real and mythic mix across 50 entries
- Gnarly + dramatic

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
