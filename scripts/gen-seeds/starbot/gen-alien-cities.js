#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/alien_cities.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} descriptions of ALIEN CITIES for StarBot — vast, jaw-dropping cityscapes across every flavor of sci-fi. Blade Runner, Coruscant, Fifth Element, Guardians of the Galaxy, Dune, Arrival, Mass Effect, Star Wars prequels. 20-35 words each.

━━━ WHAT THESE ARE ━━━
The most awe-inspiring cities ever imagined. These should span the FULL range of sci-fi city types — from neon-drenched cyberpunk megacities to ancient alien ruins to sleek utopian metropolises to gritty industrial colonies. NOT just organic/volcanic/crystal. We need STREETS, NEON, RAIN, MARKETS, TRAFFIC, SKYLINES as much as we need alien biology.

━━━ CITY TYPES (spread EVENLY — max 2 per type) ━━━
1. Cyberpunk megacity — Blade Runner neon rain, holographic ads, flying cars, gritty streets
2. Coruscant-scale ecumenopolis — planet-spanning, towers to stratosphere, endless air-traffic
3. Sleek utopian metropolis — clean chrome, manicured parks, optimistic futurism
4. Neon market district — tight streets, vendor stalls, alien signage, colorful chaos
5. Gritty industrial colony — smoke stacks, ore processing, brutalist frontier architecture
6. Organic living city — grown not built, bioluminescent, breathing walls, non-human biology
7. Insectoid hive-city — compound geometry, chambered, built by swarm intelligence
8. Crystalline/mineral city — grew like geology, light-refracting alien materials
9. Aquatic/amphibian city — designed for species in liquid, pressure-adapted architecture
10. Ancient dead civilization ruins — monumental unknowable purpose, mystery and awe
11. Desert trading hub — sun-bleached, dusty, heat shimmer, frontier markets
12. Frozen world colony — domed against cold, warm glow against ice, aurora overhead
13. Floating/suspended city — platforms over clouds or void, anti-gravity, vertiginous depth
14. Jungle/swamp city — built INTO alien jungle or swamp, overgrown, humid, bioluminescent vegetation tangled with architecture
15. Vertical cliff/canyon city — carved into rock faces, terraced, stacked down kilometer-deep walls
16. Underground/cavern city — subterranean, lit by bioluminescence or artificial suns, cathedral-scale caves
17. Volcanic/lava city — built around or on volcanic terrain, geothermal power, heat and fire
18. Ocean-world city — floating on alien seas, wave-riding platforms, tidal architecture

━━━ DEDUP BY SETTING + COLOR + LIGHTING ━━━
No two entries should share the same combination:
- SETTING: rain-slicked streets, desert plains, frozen tundra, cloud layer, ocean surface, canyon walls, volcanic terrain, orbital interior, underground cavern, forest canopy, asteroid surface, gas giant atmosphere
- DOMINANT COLOR: neon pink/cyan, amber/gold, cool blue/silver, warm orange/red, green/emerald, violet/purple, white/chrome, deep crimson, teal, rust/brown
- LIGHTING: neon signage glow, twin-sun harsh light, single-star golden hour, bioluminescent internal, artificial day-cycle, aurora overhead, volcanic underglow, starfield ambient, rain-diffused, foggy atmospheric
- SHADOW CHARACTER: noir hard shadows, soft diffused no-shadow, dual-shadow from binary stars, deep canyon permanent shade, overhead structure shadow-patterns, neon-colored shadow-fill

━━━ RULES ━━━
- Each entry is a COMPLETE scene description of a specific alien city in its environment
- Include what surrounds it — sky, terrain, weather, cosmic backdrop
- Include one LIFE detail — traffic, crowds suggested by light, market activity, ships, smoke
- Architectural style must be clear — is it sleek? gritty? organic? geometric? chaotic?
- 20-35 words per entry
- No named IP (no Coruscant, no Blade Runner, no Mos Eisley by name)
- NO MORE THAN 2 entries with volcanic/lava/magma settings
- NO MORE THAN 2 entries with crystal/prismatic architecture
- AT LEAST 4 entries must have STREETS, NEON, or URBAN DENSITY visible

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
