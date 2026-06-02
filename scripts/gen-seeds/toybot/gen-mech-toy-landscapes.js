#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/mech_toy_landscapes.json',
  total: 200,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} MECH-TOY-RAMPAGE wider-environment descriptions for ToyBot's mech-toy-rampage path — landscape as protagonist, mechs small or absent. Handcrafted mecha-anime-toy-line settings. Atmospheric, epic, cinematic-establishing-shot energy.

Each entry: 18-28 words. ONE specific wider environment shot — focus is the world itself.

━━━ MECHA-TOY-WORLD LANDSCAPES (env focus) ━━━
- Sweeping cyberpunk-megacity skyline at dusk — neon-towers stretching to vanishing point, atmospheric haze, chrome silhouette of distant mech
- Volcano-lab panorama — lava-flow rivers cutting through chrome-research-station, smoke-billowing crater
- Space-hangar interior — vast cathedral-scale hangar with rows of parked mechs, sodium-lights overhead, chrome-walkways
- Orbital-station vista — wide pull-back of station with Earth in BG, parked transformer-jets at docking-bays
- Alien-desert landscape — twin-suns rising over sand-dune sea, chrome wreckage of fallen mecha, atmospheric haze
- Mecha-graveyard panorama — vast field of fallen-chrome-mecha-bodies stretching to horizon, dust-haze, sunset
- Snowy military-base — wide pull-back of arctic mecha-base with parked snow-camo-mechs, fresh snow on chrome
- Tropical island fortress — chrome-armored island with mech-launching-pads, palm-trees, ocean BG
- Megacity-grid aerial — overhead view of urban-grid with tiny mech-silhouettes between skyscrapers
- Asteroid-field panorama — drift of asteroids with chrome-mecha-mining-rig anchored to one, stars BG
- Space-elevator-base panorama — base-station with cable rising to space, chrome-mecha-loaders parked at perimeter
- Dam-power-station vista — chrome industrial complex with power-lines arcing electricity, distant mech-patrol
- Jungle-canopy panorama — overhead view of mecha-fortress hidden in jungle, chrome-glints between leaves
- Ruined-city aerial — wide pull-back of bombed-out city with rubble, single chrome-mech-silhouette in distance
- Undersea-trench-base — bioluminescent-glow lit chrome-mecha-base on ocean floor, mech-divers as silhouettes
- Cyberpunk-neon-alley panorama — wide narrow alley with neon-signs, chrome-puddles reflecting, mech in distance
- Mountain training-ground panorama — vast wilderness terrain with target-rigs and obstacle-course, no mechs in foreground
- Volcano-lab cross-section — chrome-research-base built into volcano-side with lava-flow visible through windows
- Mecha-shipyard panorama — vast naval-yard with massive chrome-mech-frames in scaffolding, blue-hour sky
- Cyberpunk-skyline rain — neon-lit megacity in heavy rainfall with chrome-puddles reflecting tower-lights
- Mecha-base hangar at dawn — wide hangar interior with first-light slanting through high windows, parked mechs
- Megacity-rooftop panorama — skyline of rooftops with mechs at parade-stance on multiple buildings
- Orbital-graveyard — drifting wreckage of fallen space-mechs with stars and Earth in BG, atmospheric chrome-glint
- Volcano-summit vista — chrome lab on volcano-summit with eruption-glow rim-light, distant mech-silhouettes
- Space-station-corridor — long chrome interior-corridor with sodium lights, perspective vanishing point, distant mech
- Megacity-megastructure — wide pull-back of impossibly-tall building with mech-launching-bays at multiple levels
- Cyberpunk-rainstorm panorama — drenched neon city with mech-wreckage half-submerged in puddles, no characters
- Mecha-junkyard sunset — chrome-piles of dismantled mechs catching golden light, distant smokestacks
- Rooftop training-area — chrome-floored urban training-ground with target-rigs at variety of distances
- Underwater-trench cross-section — chrome mecha-base built into trench-wall with bioluminescent fish drifting past
- Asteroid-mining-camp — chrome-station anchored to asteroid with cargo-haulers parked, distant nebula
- Megacity-dawn panorama — skyline of cyberpunk towers catching first-light, chrome reflecting orange
- Mecha-cathedral interior — vaulted chrome-construction with stained-glass windows showing battle-scenes
- Industrial-megastructure — vast factory complex with smokestacks, mech-cranes, atmospheric smoke-haze
- Snowy mountain-range vista — wide alpine vista with chrome-mecha-silhouettes on multiple ridges
- Tropical-island fortress aerial — chrome-armored island with palm-trees, harbor docked mech-carriers
- Alien-desert canyon — twin-sun lit chrome canyon with mecha-bridge spanning gap, atmospheric haze
- Space-station observation-deck — chrome interior with massive window showing nebula, no mechs in frame
- Cyberpunk-skyway-network — multi-tier urban-skyways with mech-couriers in distance, neon-glow reflecting
- Mountain-base camouflaged hangar — chrome doors hidden in mountainside with launch-pad clearings, no mechs visible
- Volcano-lava-flow panorama — chrome-bridges spanning lava-flows with mecha-silhouettes patrolling, rim-light
- Underwater-trench-canyon — vast chrome canyon with mecha-base structures lining walls, bioluminescent atmosphere

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- ENVIRONMENT/SETTING is focal point, not single mech-action
- Reference CHROME / METAL / ALLOY / NEON-LIT / SODIUM-LIGHT / ATMOSPHERIC-HAZE language
- Specific mecha-world location (cyberpunk-megacity / volcano-lab / orbital-station / space-hangar / etc.)
- Atmospheric depth — golden-hour / blue-hour / dawn / dusk / fog / rain / snow
- Either no mechs OR distant silhouette / scale-bait

━━━ BANNED ━━━
- NO IP-named mechs
- NO real military / real cities / real architecture
- NO CGI / illustration / digital-render language
- NO foreground human figures

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
