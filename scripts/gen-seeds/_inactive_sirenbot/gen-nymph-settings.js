#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/nymph_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FOREST NYMPH / DRYAD SETTING descriptions for SirenBot's forest-nymph path. Enchanted woodland environments — ancient groves, fairy glens, magical forests where nature is alive and sentient.

Each entry: 10-20 words. A specific enchanted forest environment.

━━━ CATEGORIES TO COVER ━━━
- Ancient oak grove with massive twisted trunks and dappled golden light
- Mossy waterfall grotto with ferns, mist, and rainbow prisms
- Fairy ring of mushrooms in a moonlit clearing
- Weeping willow canopy over a still pool reflecting green light
- Hollow inside a giant tree, root-woven walls, soft bioluminescent glow
- Flower meadow at dawn with dew on every petal, mist low
- Bamboo forest with shafts of light cutting through dense green
- Autumn forest floor carpeted in red-gold leaves, mist between trunks
- Ancient stone circle overgrown with ivy and wildflowers
- Bioluminescent night forest where every plant glows softly
- Cherry blossom grove in full bloom, petals drifting in breeze
- Rain-soaked jungle with massive leaves, orchids, hanging vines

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: tree/plant type + season/time of day + light quality.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
