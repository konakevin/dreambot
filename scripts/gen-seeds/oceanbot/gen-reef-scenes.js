#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/reef_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CORAL REEF SCENE descriptions for OceanBot. Each is a vivid snapshot of a specific coral reef scene bursting with tropical fish abundance, multi-species chaos, and shallow sunlit water.

Each entry: 15-25 words. One specific reef scene.

━━━ CATEGORIES (mix across all) ━━━
- Dense schooling fish spiraling around coral pillars with sunbeams cutting through
- Butterflyfish clusters among brain coral with angelfish and wrasses passing
- Nudibranch explosions across reef walls in countless color variants
- Clownfish anemone colonies with damselfish swarms
- Soft coral forests swaying with gobies and shrimp mid-reef
- Gorgonian fan walls with barracuda schools passing
- Tabletop coral gardens with blue tang cascades
- Staghorn thickets with yellowtail damsels darting
- Reef drop-offs with mantas gliding past dense coral
- Parrotfish grazing through massive sunlit coral gardens
- Shallow reef flats with turtles and surgeonfish
- Multi-story reef cross-sections with fish at every level

━━━ RULES ━━━
- MAX abundance — many species per scene, density is the art
- Multiple coral types visible per entry
- Sunbeams, particulate, shallow warm water energy
- No repeats — every entry a unique reef moment
- Vivid, specific language — not generic "beautiful reef"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
