#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/tiny_creatures.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} TINY CREATURE descriptions for TinyBot — tiny-scale creatures for terrarium + macro-nature paths.

Each entry: 8-16 words. One specific tiny creature with charm note.

━━━ CATEGORIES ━━━
- Tiny lizard sunning on rock (anole, gecko, skink)
- Tiny frog on mushroom (poison-dart, glass-frog, tree-frog)
- Beetle with iridescent shell (jewel-beetle, scarab)
- Snail with spiraled shell on leaf
- Butterfly resting on flower (monarch, swallowtail, blue-morpho)
- Ladybug on petal
- Bee pollinating flower
- Dragonfly hovering over pond
- Pixie or fairy (tiny fantasy)
- Fae creature (tiny magical)
- Ant carrying leaf (leafcutter)
- Caterpillar on twig
- Praying-mantis (tiny posing)
- Hummingbird mid-hover (tiny)
- Tiny mouse nibbling berry
- Chipmunk with cheeks-full
- Hedgehog in autumn leaves
- Tiny tree-frog with suction-pads
- Spider on dewy web
- Centipede in leaf-litter
- Bumble-bee covered in pollen
- Moth with patterned wings on bark
- Grasshopper on grass-blade
- Ant on crumb of bread
- Tiny turtle on leaf
- Cricket on rock
- Ladybird larva on leaf
- Tiny snake curled on moss
- Fairy-wren tiny bird
- Pollen-covered bee mid-flight
- Tiny gecko on tropical plant
- Stick-insect camouflaged
- Firefly at dusk

━━━ RULES ━━━
- Real or fantasy (pixie/fairy) tiny-scale
- Charm detail included
- Fits terrarium / macro-nature scale

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
