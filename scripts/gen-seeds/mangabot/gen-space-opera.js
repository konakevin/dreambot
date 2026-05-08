#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/space_opera_scenes.json',
  total: 200,
  batch: 25,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} ANIME SPACE-OPERA scene descriptions for MangaBot's space-opera path. Each entry is 30-50 words. Setting-only.

CONTEXT: Anime cosmic / starship / orbital / galaxy aesthetic. Cowboy-Bebop / Outlaw-Star / Macross / Legend-of-Galactic-Heroes / Crest-of-the-Stars / Space-Battleship-Yamato / Captain-Harlock visual vocabulary. Vast cosmic scale, retrofuturistic starships, orbital cities, galaxy sunsets, nebula skies.

Categories — rotate widely:
- Spaceship cockpit interior (anime cockpit-glow, console panels, view of space outside)
- Starship hangar deck (massive interior with multiple ships visible)
- Orbital city rooftop (anime cyberpunk-orbital with planet-curve visible)
- Nebula-sky vista (giant nebula filling the void, stars dusting through, distant ship silhouette)
- Space station promenade (curved windows showing stars, restaurants/shops glimpses)
- Galaxy sunset on an alien planet (twin suns, alien terrain)
- Spaceship docking-tube approach (long glass tube extending into a station)
- Asteroid-belt mining station (rocky asteroids, industrial structures, ships)
- Ringed-planet horizon (massive Saturn-style planet dominating sky from a moon)
- Cosmic battleship at rest (giant warship silhouetted against nebula)
- Faster-than-light tunnel interior (warp-tunnel streaks of light)
- Frontier-spaceport at dusk (rusty ships, dirt landing pad, multi-moon sky)
- Anime starship bridge (captain's chair, holographic displays, viewscreen)
- Drifting derelict ship (silent, half-broken, in nebula light)
- Generation-ship interior corridor (long corridor with greenhouse-windows showing space)
- Cosmic temple-ship (mysterious organic-tech structure floating in space)

EVERY entry must include:
- Specific space-opera setting
- 4-6 environmental details (console panels / holographic displays / rivet-detailed bulkheads / hanging cables / banner-flags / kanji-signage / starship hatches / fuel-line conduits / docking-clamps / viewscreens / observation-windows / warp-coil glow / engine-glow / nebula-haze)
- 1-2 atmospheric effects (drifting dust / engine-exhaust haze / cosmic-bloom-glow / drifting holographic particles / drifting steam / volumetric god-rays from an engine / nebula-wisps / starlight haze)
- Lighting tone (nebula-bloom-pink-and-violet / blue-cold-bridge-lighting / amber-warning-strobes / cosmic-rim-light / engine-glow-orange / starlight-cool-blue)
- Cosmic scale anchor (planet curve visible / nebula filling sky / massive ship dwarfing the frame / etc.)

ABSOLUTELY BANNED:
- NO photoreal NASA imagery (this is anime cosmic)
- NO franchise names (no "Bebop's Swordfish II", no "Yamato")
- NO photoreal modern-Hollywood-sci-fi
- NO crowded scenes

Examples (write fresh):
- "Anime starship cockpit interior at warp-speed, dual control sticks and a wrap-around console of glowing pastel-blue holographic displays, kanji-labeled switches, view through the canopy showing a streaking warp-tunnel of light, soft engine-hum-glow rim-lighting the seats, cool-blue-and-amber console reflections, drifting holographic dust particles"
- "Vast nebula sky filling the upper frame in pink-and-violet cosmic clouds, dusted with thousands of stars, a distant cosmic battleship silhouetted against the glow, foreground asteroid-fragment with mining scaffolding, drifting cosmic-dust particles catching the nebula bloom, soft cosmic rim-light, sense of operatic scale"
- "Orbital-city rooftop at golden cosmic-hour, planet-curve dominating the lower frame with continents glowing, neon-lit Tokyo-style apartment-block silhouettes in the foreground, thin atmospheric haze separating city from planet, distant docking-tower with glowing landing-strobes, nebula-pink sky, drifting cosmic-dust"

Output ONLY a valid JSON array of ${n} strings (30-50 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
