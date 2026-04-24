#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/retrobot/seeds/sensory_textures.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} SENSORY TEXTURE descriptions for RetroBot — tactile and atmospheric details from 1975-1995. These get layered into scene descriptions to add sensory depth.

Each entry: 8-16 words. One specific sensory/tactile/atmospheric detail.

━━━ CATEGORIES ━━━
- Carpet textures (shag carpet, berber, worn paths, vacuum lines, carpet burn)
- Wood paneling (dark grooves, knotholes, warm amber tone under lamplight)
- Wallpaper (floral patterns, textured vinyl, peeling corners, faded stripes)
- Vinyl and plastic (sticky car seats, raincoat smell, shower curtain rings)
- Film grain (Kodachrome saturation, Polaroid fade, 35mm warm grain)
- Dust motes (afternoon sunbeam through blinds, floating particles, golden haze)
- Condensation (cold soda can sweat, window fog in winter, glass pitcher beads)
- Chrome and formica (kitchen table glint, diner booth, bumper reflection)
- Fabric textures (corduroy ridges, denim fade, velour couch, terry cloth)
- Static electricity (TV screen zap, balloon hair, dryer sheets, wool sweater)
- Paper and cardboard (cereal box cardboard, newspaper ink smell, construction paper)
- Rubber and foam (eraser shavings, foam headphone pads, rubber ball bounce)
- Metal surfaces (warm radiator, cold locker, chain-link fence diamond pattern)
- Glass and mirrors (smudged TV screen, bathroom mirror fog, window frost patterns)
- Food textures (popsicle drip, melted cheese stretch, cereal milk pink, gum wrapper foil)

━━━ RULES ━━━
- Purely descriptive — no narrative, no action
- Must trigger tactile memory — the viewer FEELS it
- 1975-1995 era materials and surfaces only

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
