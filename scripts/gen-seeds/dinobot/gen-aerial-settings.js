#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/aerial_settings.json',
  total: 200,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} SETTING descriptions for DinoBot's aerial-perspectives path. Each entry describes WHERE the aerial scene is happening in 14-22 words. Sky as canvas, with vast prehistoric world below as backdrop.

━━━ SETTING CATEGORIES ━━━

OCEAN / COASTAL (heavy emphasis):
- Above ocean at sunset, mirror-flat water reflecting sky, distant cliffs at edge of frame
- Coastal cliff-rookery at dawn, hundreds of nests, sea below crashing into base
- Storm front over open ocean, waves churning, shafts of light breaking through
- Reef shallows from above, ammonites and small marine life visible through clear water
- Mosasaur visible just below ocean surface, pterosaur shadow racing overhead
- Volcanic-island archipelago seen from sky, lava-glow on dark cones, sea between them
- Tidal-flat at low tide with mineral-rich pools mirroring sky

SKY / ATMOSPHERIC:
- Cloud-canyon between cumulus formations, multi-layer cloud architecture stretching to vanishing point
- Storm-cell in distance with dark rain-curtain, pterosaur in clear air at frame edge
- Aurora curtains across daytime sky (creative license — this world allows it)
- Pre-dawn sky with first-light pink-gold, world below in cool shadow
- Twilight haze with stars beginning to show, comet visible in daytime sky
- Sun-pillar / parhelion atmospheric phenomenon, pterosaur silhouetted against
- High-altitude clear cold air with curvature visible, jagged peaks below
- Lenticular clouds capping mountains, pterosaur skirting their edge
- Mid-cloud-layer passage, pterosaur half-hidden by drifting vapor

ABOVE PRIMORDIAL TERRAIN:
- Above mile-high gnarled mega-jungle canopy, brachiosaurus neck breaking through emerald sea
- Above vast canyon with thousand-meter waterfalls, mist rising, pterosaur cresting the rim
- Above floodplain with herd migration trails visible as dust streaks, river meanders silver
- Above karst-tower limestone forest, mist in valleys, jungle on tower tops
- Above active volcanic chain, smoke columns rising, lava-rivers visible in dark
- Above prehistoric desert mesa-and-spire field, hard shadows across sand
- Above glacier valley with sheer ice-walls, crevasses glowing turquoise
- Above coral-reef shallows, multi-color coral visible through clear water
- Above rainforest with morning fog filling valleys like a white river

CLIFF / NEST CONTEXT:
- Cliff face honeycomb of pterosaur nests at coastal sunset, sea below shattering
- Sandstone bluff rookery in midday sun, nest-bowls visible, dust kicked by takeoff
- Mountain-pass updraft channel between two ranges, thermal column visible
- Cave-mouth ledge with morning mist pouring out, pterosaur silhouetted at the entrance
- Tide-island cliff, isolated stack rising from sea, nesting colony on top

━━━ NON-NEGOTIABLE — VAST DEPTH ━━━
Every entry must imply or describe atmospheric depth — the prehistoric world stretches to vanishing point in atmospheric haze. Multi-distance staging: foreground (cloud / cliff edge / wing) + midground (pterosaur or terrain element) + background (vista receding to vanishing point).

━━━ EVERY ENTRY MUST INCLUDE ━━━
- A specific aerial-context anchor (above / cliff / sky / cloud-layer / over-ocean / over-canyon)
- An atmospheric or scale-anchor element (mist / cloud-layer / ocean-shimmer / canyon-rim / vista)
- Time-of-day or weather cue (dawn / dusk / storm / midday / golden-hour / pre-dawn)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: terrain-or-sky context + altitude-or-perspective + atmospheric-element.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
