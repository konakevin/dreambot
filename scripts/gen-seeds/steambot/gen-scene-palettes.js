#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for SteamBot — steampunk color moods.

Each entry: 10-20 words. One specific steampunk palette with 3-5 color words.

━━━ CATEGORIES ━━━
- Brass-and-copper (brass + copper + oiled-wood + deep-shadow)
- Victorian-moody (oil-black + brass + oxblood + faded-velvet)
- Sepia-industrial (sepia + burnt-umber + bronze + cream)
- Fog-and-gold (gold-gaslight + grey-fog + deep-shadow + cream)
- Smoke-and-flame (coal-smoke + ember-orange + black + amber)
- Airship-sky (pale-blue + cream-cloud + brass-sun + rope-beige)
- Inventor's-workshop (brass + leather + oil-dark + gaslight-amber)
- Victorian-parlor (burgundy-velvet + brass + cream + deep-wood)
- Gearwork-bronze (bronze + copper + patina-green + oxblood)
- Mortal-Engines palette (rust + brass + smoke-grey + sunset-amber)
- BioShock-Infinite (sky-blue + cream + gold + red-accent)
- Howl's-Moving-Castle (pastel-sky + warm-brass + wood-brown)
- FFIX palette (warm-earth + brass-accent + muted-pastel + deep-shadow)
- Steampunk-noir (oil-black + brass + cigarette-smoke-grey + amber-warmth)
- Rust-and-copper (deep-rust + copper + patina + shadow)
- Clockwork-cathedral (stained-glass-jewel + brass + deep-wood + shadow)
- Factory-smog (industrial-grey + brass-glint + amber-forge)
- Pilot-leather (leather-brown + cream-scarf + brass-goggles + sky-blue)
- Duchess-boudoir (rose-brass + cream + velvet-pink + gold)
- Tesla-storm (electric-blue + brass + deep-shadow + white-arc)
- Alchemy-flask (emerald + copper + amber + oil-black)
- Mechanic's-coat (oil-stained-leather + brass + copper + dust)
- Observatory-night (deep-blue + silver-brass + star-white + dark-wood)
- Airship-dusk (sunset-coral + brass-rim + smoke-shadow + cream-cloud)
- Tavern-steampunk (warm-wood + brass-lamp + burgundy + smoke)
- Railway-depot (rust + coal-black + brass-brass + amber-light)
- Jungle-expedition (khaki + brass + leather + sunset-gold)
- Arctic-steampunk (silver + brass + ice-blue + white-fur)
- Steampunk-desert (sun-amber + rust-dune + brass + shadow-plum)
- Underwater-mechanical (deep-teal + brass + copper-green + pearl-white)

━━━ RULES ━━━
- Steampunk palettes
- 3-5 specific color words per entry
- Brass / copper / wood / leather / brass-gaslight dominant

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
