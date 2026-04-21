#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/flower_types.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} FLOWER TYPE descriptions for BloomBot — specific, visually distinctive blooms. Mix real and invented species.

Each entry: 6-16 words. Names the flower + key visible quality (color / petal architecture / size / special feature).

━━━ MIX ━━━
- Classic ornamentals (peonies, roses, dahlias, lilies, tulips, orchids, hydrangeas, magnolias, camellias)
- Tropical (hibiscus, plumeria, bird-of-paradise, ginger, heliconia, angel's trumpet, passionflower)
- Wildflowers (lupine, foxglove, bluebells, poppies, cosmos, daisies, lavender, snapdragons)
- Vines / climbers (wisteria, clematis, morning glory, bougainvillea, jasmine, moonflower)
- Unusual real (protea, strelitzia, cherry blossom, magnolia, lotus, corpse flower, ghost orchid)
- Garden standards (sunflowers, zinnias, ranunculus, anemones, sweet peas, dogwood, lilac)
- INVENTED alien species (crystal-petal bloom, bioluminescent trumpet, liquid-mercury stem flower, frozen-flame petal, nebula-colored stamen bloom, aurora-borealis bloom, starfire lily)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Avoid unescaped quotes inside entries.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
