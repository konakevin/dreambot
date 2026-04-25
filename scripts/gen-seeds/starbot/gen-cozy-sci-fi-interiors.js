#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cozy_sci_fi_interiors.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} descriptions of COZY SCI-FI INTERIOR SPACES for StarBot — warm, intimate, lived-in corners of the SAME universe as our cosmic vistas, megastructures, and alien landscapes. 20-35 words each.

━━━ WHAT THESE ARE ━━━
The warm private spaces where people actually LIVE in a sci-fi universe. NOT Earth hobbies crammed into a spaceship. These are spaces that could ONLY exist in space — alien-planet homes, deep-space station hideaways, generation-ship neighborhoods, orbital habitat living quarters, asteroid-mining outpost break rooms. Every space must feel unmistakably SCI-FI while also feeling COZY and LIVED-IN.

━━━ SETTING CATEGORIES (spread EVENLY — max 2 per category) ━━━
1. Ship bridge/cockpit at rest — quiet night watch, autopilot engaged, personal touches on controls
2. Personal quarters — crew cabin, captain's stateroom, officer's berth, individual living space
3. Ship galley/mess — cooking area, eating nook, crew dining, midnight snack run
4. Engineering/maintenance nook — warm machinery, jury-rigged comfort, mechanic's den
5. Greenhouse/hydroponics — growing food in space, plant-filled bays, oxygen gardens
6. Medical/science lab after-hours — quiet instruments, researcher's late night, specimen glow
7. Alien-planet dwelling — home on an alien world, adapted architecture, off-world domesticity
8. Space station common area — hub café, station market, communal gathering space
9. Observation/viewport space — watching cosmos, contemplation spot, stellar view lounge
10. Navigation/cartography — star charts, plotting courses, navigator's domain
11. Cargo/storage converted — unauthorized comfort zone, repurposed industrial space
12. Alien-architecture interior — non-human design adapted for living, organic walls, crystal rooms
13. Deep-space outpost — remote listening post, mining colony break room, frontier comfort

━━━ WHAT MAKES THEM COZY ━━━
- PERSONAL TRACES: someone actually lives/works here — their stuff is visible
- WARMTH: warm light sources (console glow, grow-lamps, bioluminescence, heat from machinery)
- WORN WITH USE: scuffed, patched, upgraded, personalized over time
- SCALE: intimate, not cathedral — mid-close framing spaces

━━━ WHAT MAKES THEM SCI-FI ━━━
- TECHNOLOGY: consoles, holographic displays, environmental systems, artificial gravity
- MATERIALS: brushed titanium, carbon-composite, crystalline alien materials, radiation-shielded glass
- CONTEXT: these spaces exist on ships, stations, alien planets, orbital habitats — NOT Earth
- ATMOSPHERE: recycled air, artificial light cycles, viewport glimpses of cosmos

━━━ CRITICAL — NO PORT WINDOW DEFAULT ━━━
Do NOT default to "window with space view" or "viewport showing [planet/stars/nebula]." At MOST 3 of ${n} entries should mention a window or viewport. Most cozy spaces have NO window — they're deep inside ships, in interior decks, underground on alien planets, in windowless station corridors. The coziness comes from the SPACE ITSELF, not from looking at space through glass.

━━━ DEDUP BY SETTING TYPE + KEY VISUAL ELEMENTS ━━━
No two entries should share the same setting type + primary visual element:
- SETTING: cockpit, quarters, galley, engineering bay, greenhouse, med-bay, alien dwelling, station hub, observation post, nav room, cargo bay, alien interior, outpost
- PRIMARY VISUAL: console glow, plant life, mechanical warmth, food/drink, bioluminescence, personal artifacts, alien materials, warm fabrics, tool collections, holographic displays
- LIGHTING: amber console, grow-lamp green, bioluminescent blue, warm LED, machinery heat-glow, candle/lantern, red emergency low

━━━ RULES ━━━
- Each entry describes the SETTING + what makes it cozy + key textures/details
- NO Earth-hobby rooms (no tattoo parlor, no pottery studio, no D&D session)
- Every space must feel like it could ONLY exist in a sci-fi setting
- Include worn/lived-in details — patches, stains, personal modifications
- 20-35 words per entry
- No named IP

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
