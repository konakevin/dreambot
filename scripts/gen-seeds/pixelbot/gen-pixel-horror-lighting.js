#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_horror_lighting.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} LIGHTING descriptions for PixelBot's pixel-horror path (now Castlevania / Ghosts 'n Goblins / Black Tiger / Demon's Crest gothic-fantasy action aesthetic, NOT modern psychological horror).

Each entry is 15-30 words. EVERY entry must include:
- DRAMATIC GOTHIC LIGHT SOURCE — flickering torches / candelabras / stained-glass shafts / lit braziers / lit-chandelier / hellfire-glow / cursed-rune-glow / lightning-flash / lava-glow / blood-moon
- HIGH CONTRAST — saturated 16-bit gothic palette: deep purples / blood-reds / candle-orange / sickly-greens / electric-blues / blue-black shadows
- 16-BIT CHUNKY PIXEL feel — visible dithered shadow edges, no smooth gradients

Examples (write fresh):
- "Two flickering wall-torches casting orange-amber dancing pixel-shadows on stone-tile floor, deep blue-black shadow corners, dithered stained-glass-window violet shafts crossing the chamber."
- "Lit-chandelier overhead casting golden-amber light on the marble ballroom floor, deep purple shadow corners, blood-red moonlight through arched windows, dithered shadow edges."
- "Lightning-flash strobing across the rainy ramparts in stark blue-white pixel flashes, deep blue-black ambient between flashes, lit-brazier in foreground with dancing orange-flame highlights."
- "Hellfire-glow rising orange-red from a lava-pit, drifting embers catching the light, demon-silhouettes backlit, blue-black shadow on stone bridges."
- "Full blood-moon overhead casting silver-and-crimson light on the graveyard, lit-lantern by the gravedigger's shed glowing orange-amber, deep blue-purple atmosphere."
- "Cursed-rune-glow magenta-violet pulsing on the magic-circle floor, surrounding shadow blue-black, candle-flickers on wall sconces casting orange-yellow accents, dithered shadow gradients."
- "Ghostly cyan-blue spectral light from a wraith mid-frame, deep purple-black ambient, lit-candelabra orange counter-light, drifting ash particles in the wraith-glow."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
