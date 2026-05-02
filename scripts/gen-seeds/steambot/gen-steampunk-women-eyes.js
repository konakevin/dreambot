#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_women_eyes.json',
  total: 100,
  append: true,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} EYE-COLOR-AND-INTENSITY entries for SteamBot's sexy-steampunk-woman path. Each entry is a SHORT phrase (10-18 words) describing the EXACT vivid color of her eyes AND how steampunk-world light interacts with them — gaslight glint, brass reflection, forge-flame catch, oil-lamp glow.

This pool composes with separate skin/hair/makeup/wardrobe pools. The eyes should feel SUPERNATURALLY VIVID — gaslight bouncing, brass reflecting, forge-flame catching the iris.

━━━ COLOR SPREAD (enforce diversity across ${n}) ━━━
- AMBER / GOLD (4-5) — brass-flecked amber catching gaslight to liquid gold, warm honey-amber with copper rings around the pupil, dark amber that glints brass when she turns her head, molten-gold eyes burning under furnace-flame, antique-bronze gold with darker outer rim
- GREEN (4-5) — gaslight-green so bright it looks lit from within, deep moss-green softened by oil-lamp warmth, cold absinthe-green catching forge-flame, hazel-green that goes brass when steam rises behind her, mint-glass green with gold flecks
- BLUE (4-5) — gas-blue eyes burning cold under brass goggles, deep ocean-blue with a haunted pale ring, ice-blue glinting silver under candlelight, electric-blue that crackles when she's focused, weathered grey-blue washed warm by gaslight
- BROWN / UMBER (4-5) — chocolate-brown with copper highlights from the forge, dark almond-brown that catches gaslight to warm honey, deep umber going gold near the iris-edge, rich coffee-brown with brass flecks, mahogany-brown glinting copper under oil-lamp
- RARE / STRIKING (4-5) — heterochromatic one amber one green flickering different in different light, violet-tinged grey that goes amethyst at dusk, washed-pale haunted-grey, brass-prosthetic ocular replacement glowing soft amber where her right eye used to be, smoke-grey with brass specks

━━━ RULES ━━━
- Each entry is a VIVID color + a steampunk-light interaction
- Color-diverse — do NOT cluster on amber-and-gold. Hit every tier
- Eyes should feel POWERFUL and intentional — they radiate
- One entry MUST be a brass-prosthetic ocular replacement (signature steampunk detail)
- No "soulless" / "dead eyes" / horror-coded — power and danger via VIVIDNESS, not damage

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
