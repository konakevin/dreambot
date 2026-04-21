#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/cozy_arcane_settings.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COZY ARCANE SETTING descriptions for DragonBot's cozy-arcane path — cozy fantasy places. Mix inhabited cozy + natural fantasy pockets. Magical wildlife at rest welcome. Warm + tame + peaceful magic, NEVER dramatic.

Each entry: 15-30 words. One specific cozy fantasy setting.

━━━ INHABITED CATEGORIES ━━━
- Hobbiton-style hearth (round-door cottage interior, fire crackling, pipe-smoke)
- Elven tea-garden (silver-leaved trees, tea-set on moss, afternoon light)
- Wizard's rainy library (books stacked to ceiling, rain on window, lamp-glow)
- Tavern-in-snow (warm interior through window, snow outside, hearth fire)
- Witch's herb-cottage (hanging herbs, bubbling cauldron gently, cat on sill)
- Dwarf-brewery interior (ale-barrels, rune-carved tables, warm fire)
- Fae-tree hollow (cozy nook inside old tree, glowing mushroom lantern)
- Bard's caravan-interior (patchwork cushions, hanging instruments, lantern-lit)
- Hedge-witch's kitchen (copper pots, herb-drying, cat napping, evening light)
- Druid's-grove sanctuary (stone-circle with soft moss, antler-crown hanging, peaceful)
- Rangers' outpost (wooden lookout with animal pelts and weapons racked, warm)

━━━ NATURAL / MAGICAL-CREATURE CATEGORIES ━━━
- Glowing-moss creek (softly luminescent moss on stones, crystal-clear water)
- Fae-glen (clearing with silver-mushroom circle, gentle sparkle atmosphere)
- Sprite-cave (small cave with glowing pool, tiny winged sprites at rest)
- Sleeping-unicorn meadow (unicorn curled in flower-meadow, dawn light)
- Fire-moth stump at dusk (glowing moths around forest-stump, warm magic)
- Firefly-swarm glade (thousands of fireflies in forest clearing)
- Elk-spirit resting ground (antlered-spirit-deer in twilight meadow)
- Young-dragon napping in sunny clearing (harmless scale, tail-curled)
- Fox-spirit at rest (fox with glowing ethereal markings curled on moss)
- Mushroom-ring with tiny sprites reading
- Owl-spirit perched in moonlit tree
- Glowing-pond with koi-spirits
- Fae-picnic grove (tiny plates laid out, peaceful meadow)
- Badger-den magical (warm tiny cottage-like burrow entrance)
- Goblin-market vignette (cozy stall with lanterns, quiet eve)
- Fairy-lights strung between ancient trees (magical trail)
- Sleepy dragon-whelp in cottage-corner by fire
- Pixies gathered around steaming teacup outdoors
- Deer-spirit grazing in glowing-mushroom-field

━━━ RULES ━━━
- Warm + tame + peaceful — NEVER dramatic
- Magical wildlife OK at REST
- Inhabited cottage or natural magical pocket — either OK
- Cozy / warm / quiet-magic emotional target

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
