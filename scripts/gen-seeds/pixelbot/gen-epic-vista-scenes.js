#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/epic_vista_scenes.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} 16-BIT RETRO PIXEL ART SIDE-SCROLLING PARALLAX-VISTA SCREENSHOT scene descriptions for PixelBot's epic-vista path. The frame is rendered as a horizontal layered side-scrolling parallax background — the kind you'd scroll past in a 16-bit RPG world-map / opening-cutscene / side-scrolling-engine vista cutaway. NOT atmospheric painting. NOT concept-art wallpaper. A SCREENSHOT FROM A 16-BIT GAME with chunky tile-edge mountains, hard-edge horizons, layered parallax-scrolling depth.

Reference inspiration (USE AS FEEL-ANCHORS ONLY — NEVER name literally in scene output): Final Fantasy VI airship-flyover + Chrono Trigger world-map + Lufia II overworld + Secret of Mana world-vistas + Terranigma overworld + Castlevania IV background-vistas + Donkey Kong Country background-art + Sonic 2/3 horizon backgrounds + Trine pixel-tribute parallax + Owlboy parallax skies.

━━━ THE NORTH STAR ━━━

Each entry should look like A SCREENSHOT FROM A 16-BIT SIDE-SCROLLING-GAME PARALLAX-VISTA BACKGROUND — wide horizontal layered landscape, 4 distinct parallax-depth layers stacked back-to-front, hard tile-edges between layers, chunky-pixel cloud-edges, hard-edge horizon, DITHERED color-band sky (not smooth gradient).

Each entry: 30-50 words, ONE paragraph. EVERY entry MUST OPEN with explicit side-scrolling-parallax-vista framing — "Horizontal side-scrolling parallax-vista of...", "Side-view 16-bit parallax-background showing...", "Layered parallax-scrolling vista of...", "Wide horizontal 16-bit parallax-background of...".

━━━ MANDATORY ELEMENTS (every entry) ━━━

1. CAMERA — horizontal side-scrolling parallax-vista (always — explicit in opening)
2. 4 PARALLAX LAYERS with HARD edges between them:
   - FOREGROUND parallax: chunky tile-edge terrain in bottom third (rocky cliff edge / sand-dune ridge / snow-tile / jungle-vine canopy / stone outcrop / cherry-blossom tree / palm-cluster / ice-shelf)
   - MIDDLE parallax: middle-distance terrain (rolling hills / forested hills / distant village / ruined temple / smaller mountain peaks / cliff face / treetop layer)
   - DISTANT parallax: far peaks / distant horizon-mountains / sea-horizon / fjord-cliff-line / alien-planet-rim / megacity-skyline-silhouette
   - FAR BACKDROP: sky as DITHERED COLOR-BANDS / starfield / aurora / cloud-bank with chunky-edge clouds / planet rising / sun-disc-on-horizon
3. CHARACTERISTIC EPIC BIOME (mountains / fjord / desert / jungle / tundra / volcanic / alien / megacity / savanna / coast / sky-island / underwater-canyon / cherry-blossom valley / etc.)
4. DRAMATIC LIGHTING (sunset / sunrise / dawn / aurora / storm / golden-hour / blue-hour / moonlight / starlight / volcanic-glow / etc.)
5. ATMOSPHERIC particles (drifting clouds / mist / snow / embers / petals / dust / pollen)
6. OPTIONAL tiny silhouette for scale (single bird in flight / distant airship-silhouette / lone-traveler / caravan / distant ship)

━━━ BIOME TYPES — ROTATE BROADLY ━━━

- Towering mountain range with snow peaks
- Fjord with crashing waves and cliffside village
- Desert dunes with ancient ruins half-buried
- Dense jungle canopy with mist rolling
- Frozen tundra with aurora overhead
- Volcanic plains with lava-rivers
- Alien planet surface with ringed moon
- Megacity skyline at sunset
- Savanna with herd silhouettes
- Coastal cliffs with lighthouse
- Floating sky-island archipelago
- Underwater canyon with kelp-forest
- Dragon's-spine-mountain-pass
- Red-sand-desert with rock-spires
- Aurora-tundra with ice-crystal forest
- Cherry-blossom valley with terraced rice-fields
- Bamboo-forest hills with mist
- Lavender-field with windmill silhouette
- Storm-sea horizon with lightning
- Pirate-cove with multiple ships
- Crystal-cavern overlook
- Mushroom-forest valley with bioluminescent canopy
- Frozen-fjord glacier
- Rolling-grassland-prairie at sunset
- Mountain-peak above clouds
- Underwater-temple ruins
- Sky-castle on cloud-island
- Sunken-city silhouette in sea-fog
- Mega-tree forest
- Alien-jungle with twin-moons
- Crystalline-ice-mountains
- Volcanic-island-chain at twilight

━━━ EXAMPLES (write fresh — do not copy) ━━━

- "Horizontal side-scrolling parallax-vista of a towering mountain range at sunset, foreground chunky stone-cliff with two pine-tree silhouettes, middle layer rolling green hills with dirt-road tile-line, distant snow-capped peaks tinged pink-orange with hard tile-edges, far backdrop dithered blood-orange sky color-bands with chunky-edge cumulus clouds, drifting magical motes, single bird-silhouette."
- "Side-view 16-bit parallax-background showing a desert with ancient pyramids, foreground chunky dune-ridge with palm-tree-cluster silhouette, middle layer pyramid-trio half-buried in golden-tile sand, distant red-rock-canyon silhouettes, far backdrop dithered amber sky color-bands with chunky cloud-bank, drifting sand-particles, distant caravan silhouette."
- "Layered parallax-scrolling vista of a fjord at dawn, foreground chunky rocky-shore tile-edges with crashing wave-foam, middle layer cliffside-village with lit cottage windows, distant snow-capped fjord peaks fading to dithered blue-bands, far backdrop pink-pearl sunrise dithered color-bands, drifting mist, single ship-silhouette at horizon."
- "Wide horizontal 16-bit parallax-background of a volcanic island chain at twilight, foreground chunky black-sand-shore with lava-cracks, middle layer multiple volcano-silhouettes with eruption-plumes, distant ringed-planet rising with hard tile-edge in starfield, far backdrop dithered deep-violet cosmic color-bands, drifting embers and ash."
- "Horizontal side-scrolling parallax-vista of a frozen tundra at night, foreground chunky ice-crystal forest tile-edges, middle layer rolling snow-drifts with single-cabin lit-window, distant aurora-glow ribbons in dithered pink-cyan bands, far backdrop dithered deep-blue-black starfield, drifting snow-particles, distant wolf-silhouette pack."
- "Side-view 16-bit parallax-background showing a megacity skyline at sunset, foreground chunky spire-rooftop with bell-tower silhouette, middle layer cathedral-and-castle skyline with golden-lit windows, distant mountains receding into dithered amber-pink bands, far backdrop dithered sunset-orange color-bands, drifting smoke-trails, distant airship-silhouette."
- "Layered parallax-scrolling vista of a cherry-blossom valley at dawn, foreground chunky petal-strewn ground with stone-shrine silhouette, middle layer terraced rice-fields with farmer-NPC silhouette, distant pagoda-silhouette on hill, far backdrop dithered pink-pearl morning color-bands, drifting cherry-petals, soft golden god-rays."
- "Wide horizontal 16-bit parallax-background of a sky-island archipelago at midday, foreground chunky cloud-platform tile with mossy stone-tile, middle layer floating-island chain with rope-bridges, distant island-cluster fading to dithered azure-bands, far backdrop dithered pure-blue color-bands with chunky-edge cumulus clouds, drifting magical motes, distant airship-trail."

━━━ HARD RULES ━━━

- ALWAYS open with explicit side-scrolling parallax-vista phrase (NEVER "wide panoramic vista" / "atmospheric landscape" / "cinematic painting")
- ALWAYS 4 distinct parallax layers with HARD edges between them
- ALWAYS describe sky as DITHERED COLOR-BANDS (not smooth gradient)
- ALWAYS describe cloud edges as CHUNKY-PIXEL-EDGE (not airbrushed / wispy)
- ALWAYS describe horizon as HARD PIXEL-EDGE
- 16-BIT chunky pixel-grid aesthetic — hard edges, dithered shading, NEVER smooth/soft/painterly/wispy/airbrushed
- Saturated SNES-era 16-bit palette — RICH chunky color blocks
- Animated atmospheric particles
- NO active gameplay (no hero on platform, no enemy mid-attack, no UI / health bars)
- OPTIONAL tiny silhouette for scale (bird / airship / caravan / traveler / ship)
- NEVER named IP characters or game-titles in OUTPUT
- NEVER atmospheric-painting framing — this is a side-scrolling-game-engine parallax background

━━━ AVOID ━━━

- "Atmospheric vista" / "cinematic landscape" / "panoramic painting" framing — those push smooth modern illustration
- Smooth sky gradients — sky must be DITHERED COLOR-BANDS
- Wispy / airbrushed / soft / pastel / fading language — that pushes Flux toward modern illustration
- Active gameplay (hero on platform, enemy mid-attack)
- Specific named IPs

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete scene description (30-50 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
