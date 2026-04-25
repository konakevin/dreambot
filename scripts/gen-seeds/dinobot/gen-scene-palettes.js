#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/scene_palettes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for DinoBot — prehistoric color moods.

Each entry: 10-20 words. One specific palette with 3-5 color words.

━━━ CATEGORIES ━━━
- Amber-jungle (amber + emerald + deep-shadow + gold)
- Volcanic-red-gray (crimson-lava + slate-ash + ember + shadow)
- Misty-blue-green (blue-mist + forest-green + silver + pale-gold)
- Ancient-sepia (burnt-umber + warm-cream + faded-bronze)
- Dramatic-storm (charcoal + single-amber-break + deep-blue)
- Dusk-crimson (crimson-sky + silhouette + shadow-purple)
- Cretaceous-dawn (rose-pink + mint-green + cream + deep-forest)
- Jurassic-coast (turquoise + sand + volcanic-black + palm-green)
- Carboniferous-swamp (deep-green + brown + mist-grey + amber)
- Triassic-desert (rust-orange + tan + shadow-brown + pale-sky)
- Feathered-raptor-warm (copper + cream + shadow + warm-green)
- T-Rex-golden (amber + gold + deep-shadow + forest)
- Storm-crashing (charcoal + lightning-white + deep-blue)
- Primordial-twilight (violet + silver + deep-blue + emerald)
- Volcanic-night (black + red-glow + ash-grey)
- Jungle-canopy-dappled (green + gold + shadow + amber)
- River-delta (brown-mud + green-vegetation + blue-water + amber)
- Open-plain-savanna (golden-grass + blue-sky + shadow + rust-dust)
- Mountain-prehistoric (snow-white + stone-grey + deep-blue + sun-gold)
- Meteor-shower (starfield + ember-streaks + silhouette)
- Tar-pit (black + brown + amber + deep-shadow)
- Clean-daylight-prehistoric (bright + green + sky-blue + warm)
- Moonlit-prehistoric (silver + deep-blue + shadow-black)
- Sunrise-primordial (rose + gold + green-canopy + silhouette)
- Sunset-swamp (orange + purple + deep-green + amber)

━━━ RULES ━━━
- Prehistoric color palettes
- 3-5 colors per entry

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
