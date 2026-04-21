#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for StarBot — cosmic + sci-fi color moods.

Each entry: 10-20 words. One specific sci-fi palette with 3-5 color words.

━━━ CATEGORIES ━━━
- Deep-space-indigo (indigo + starlight-white + silver + black-void)
- Nebula-pink (rose-pink + violet + amber + deep-blue)
- Ion-teal (teal + cyan + silver + deep-navy)
- Blade-Runner-neon (magenta + cyan + amber + oil-black)
- Dune-sepia (rust-orange + tan + deep-shadow-brown + cream)
- Ice-blue (pale-blue + crystal-white + silver + deep-cobalt)
- Gas-giant-cream-and-gold (cream + gold + amber + burnt-umber)
- JWST-infrared (deep-orange + teal + burnt-amber + cobalt)
- Hubble-pillars (amber + blue + cream + shadow-brown)
- Annihilation-shimmer (pearl + iridescent + moss + faded-rose)
- Interstellar-black-hole (orange-disc + cobalt-void + black + golden-rim)
- Arrival-monolith (cool-grey + cream + warm-amber + oil-black)
- 2001-Kubrick (white + red-HAL + black + cream-wood)
- Foundation-ambers (warm-copper + black + deep-gold)
- Alien-xenomorph (oil-black + bone-white + teal-slime)
- Prometheus-crystals (violet-crystal + obsidian + amber-warm)
- Moon-surface-grey (pewter + bone + black-shadow + amber-earth)
- Mars-rust (rust-red + tan + deep-shadow-brown + pale-sky)
- Europa-ice (pale-blue + white + silver-streak + black-crack)
- Titan-orange (orange + brown + amber + deep-teal-sky)
- Saturn-golden (gold + cream + shadow-band + deep-blue-rings)
- Jupiter-storm (cream + rust + amber + red-spot)
- Orion-nebula (red-amber + teal + gold + deep-blue)
- Cosmic-chaos (multi-color nebula explosion palette)
- Retro-70s-sci-fi (amber + avocado + cream + faded-red)
- Cyberpunk-saturation (magenta + cyan + yellow + oil-black)
- Solar-flare (yellow + orange + red + white-hot-core)
- Supernova (white-core + red-ring + blue-shockwave)
- Wormhole-tunnel (iridescent + white + blue + violet)
- Asteroid-mining (grey + amber-light + rust + black)

━━━ RULES ━━━
- Cosmic + sci-fi palettes
- 3-5 specific color words per entry
- Reference real-astronomy OR movie-sci-fi

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
