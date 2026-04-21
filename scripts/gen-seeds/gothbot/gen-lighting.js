#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/lighting.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for GothBot — gothic chiaroscuro lighting. Moonlight / candle / crimson-stained-glass / lightning-flash / red-ritual-glow.

Each entry: 10-20 words. One specific gothic lighting treatment.

━━━ CATEGORIES ━━━
- Chiaroscuro-dramatic (deep shadow with single key light)
- Moonlight-silver (cool silver from full moon, deep shadows)
- Candle-single-source (single candle illuminating figure/face)
- Crimson-stained-glass-shaft (red-beam through stained glass window)
- Lightning-flash (brief stark white, purple afterglow)
- Red-ritual-glow (sanguine light from unseen ritual source)
- Blood-moon-red (entire scene bathed in red moonlight)
- Candelabra-warm (multiple-candle cluster, warm intimate)
- Torch-procession (chain of torches lighting gothic hallway)
- Stained-glass-rose-window (colorful beams through rose-window)
- Fog-diffused moonlight (soft silver haze through fog)
- Thunderstorm-contrast (dark sky with white lightning key-light)
- Chandelier-cluster (ornate gothic chandelier with many candles)
- Reflected water-light (black lake reflecting moon)
- Fireplace-orange-glow (hearth-glow from one side)
- Lantern-carried (figure carrying lantern in dark, isolated pool of light)
- Velvet-backlit rim (subject backlit with velvet-red rim)
- Glowing-eye-horror (red/green eye-light from shadowed figure)
- Spell-cast purple (magical purple light from caster)
- Grave-yard-fog-silver (silver diffuse in graveyard fog)
- Orange-sunset-through-cathedral (amber light through west window)
- Single-candle-on-skull (candle in Yorick-style composition)
- Smoke-traced-light (light through smoke revealing beams)
- Ritual-circle-underlight (floor-light from magic circle)
- Hellfire-orange-glow (warm from below, implying hellfire)
- Pale-pre-dawn-blue (cold blue before sunrise)
- Courtyard-torch-cluster (multiple torches in castle courtyard)
- Fire-reflecting-stained-glass (fire inside reflects colored)
- Bat-silhouette-against-moon
- Lamp-flicker-on-cobblestones (wet cobbles reflecting gas-lamp)

━━━ RULES ━━━
- Gothic chiaroscuro emphasis
- Single-source or highly-dramatic lighting
- Rich with shadow + atmosphere

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
