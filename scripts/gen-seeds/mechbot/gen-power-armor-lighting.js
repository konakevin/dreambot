#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/power_armor_lighting.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LIGHTING-MODE descriptions for MechBot's power-armor-infantry path. Each describes a complete BATTLEFIELD COMBAT lighting setup for a 2-5 figure MEAN KILL-TEAM squad (Helldivers 2 / WH40K Space Marines / Aliens Colonial Marines / Doom Eternal / Starship Troopers / ODST / Helghast lineage) mid-firefight in urban rubble, war-torn district, bunker corridor, tunnel, breached fortification.

Each entry: 28-42 words. Format: "LIGHTING-NAME-IN-CAPS — full multi-clause description of the combat light situation, how it lands on heavy-armor panel-shadow + helmet-floodlight beams + tracer-illuminated air, and the resulting mid-firefight / mean / aggressive / kill-energy mood." Comma-separated phrases.

━━━ THE BAR ━━━
Every entry must read like a MOVIE-POSTER COMBAT LIGHT — Helldivers key-art / 40K Space Marine cover / ODST mission promo. The lighting carries half the kill-energy. Squad MUST read as mean + aggressive + dynamic — NEVER quiet / contemplative / clinical. Combat ambient (muzzle-flash, explosion-backlit, tracer-walls, helmet-floods, phosphorus, distant-fire-glow, emergency-strobe) is the core register.

━━━ VARIETY MANDATE (~16 lighting families across the batch) ━━━

- MUZZLE-FLASH STROBE PRIMARY (rotary cannons firing in burst-sequence, hot-white strobe rhythm, hard black shadows between)
- EXPLOSION-BACKLIT SILHOUETTE (munitions-cache mid-block, every armor plate edge-lit searing orange, embers drifting)
- DAWN-COLD GRIM ASSAULT (pre-sunrise cold blue washing ruined street, thin amber sliver at horizon, dread-tone pre-breach)
- PLASMA-BOLT TRACER-WALL (cyan / orange plasma streams crossing frame, moving color washing across chest-plates)
- DUSK BLOOD-RED HORIZON (sun bleeding crimson across battle-smoke, squad edged red-orange against dying sky)
- NIGHT WITH HELMET-FLOODLAMPS (absolute ambient dark, helmet-mounted floods cutting hard white cones through smoke)
- OVERCAST WAR-GREY (flat diffuse grey, no directional shadow, armor muted steel, blood-splash dark crimson)
- SMOKE-PIERCED-BY-SPOTLIGHT (enemy searchlight beam through dense smoke, god-rays volumetric, hard cone edge)
- WHITE-PHOSPHORUS BURN (canister burning meters left, zone-bleach white-orange overexposure, acrid haze diffusing)
- DISTANT-FIRE-GLOW MID-DISTANCE (burning tenement blocks deep mid-distance, warm orange uplight from low-left)
- EMERGENCY-STROBE BATTLEFIELD (damaged installation strobe pulsing red, squad snap-shadow on/off)
- BURNING-WRECK FOREGROUND (enemy vehicle burning foreground, orange underfill rising on squad)
- TUNNEL FLARE-DROP (red signal flare casting hard low-angle red across squad in collapsing tunnel)
- BUNKER EMERGENCY-LIGHTS-ONLY (red emergency strips along ceiling, squad shadow stretching long down corridor)
- DROP-POD EXHAUST-VENT (fresh-impact pod still venting orange-white plasma, squad emerging in steam halo)
- THERMOBARIC AFTERGLOW (sustained orange-red shockwave residue, squad silhouetted in burning air)
- NIGHT-VISION FILTER GREEN (NV-amplified scene tinted phosphor-green, hot muzzle-flashes overexposed white)
- RAIN-WHIPPED COMBAT (cold downpour, lightning-fork flash freezing squad in white-on-black for one frame)
- ARTILLERY-WALK FIRE-FRONT (line of distant artillery impacts marching across horizon, sequential muzzle-flash on squad's flank)
- ALIEN BIOLUMINESCENT-HIVE UPLIGHT (cold cyan / violet bioluminescent zone-light from below, squad in dread-color)
- HOT-LZ FLOODLIGHT (dropship landing-lights raking across squad, hot-white wash, downwash whipping smoke)

━━━ MUST INCLUDE ELEMENTS in each entry (pick at least 3) ━━━
- Direction + temperature of the dominant light source(s)
- How it lands on POWER-ARMOR plating (rim-light on pauldrons / hard panel-shadow / muzzle-flash glint on visor)
- Atmospheric particulate (combat smoke / dust / brass-glitter / ash / blood-haze / spent-shell tinkle)
- Combat ambient texture (tracer-streaks / shock-front / flare-glow / phosphorus-burn / sodium-amber)
- Resulting kill-team mood (mean / aggressive / mid-engagement / kill-locked / dread / triumph)

━━━ BANS ━━━

- NO clean clinical lab / corporate / office lighting — always BATTLEFIELD
- NO quiet / contemplative / reverent moods — squad is MEAN + MID-FIGHT
- NO closeup / portrait framing language — squad is 2-5 figures in WIDE-ish combat composition
- NO Star Wars / Halo / Mandalorian / Spartan / Stormtrooper / Boba / Mando IP language
- NO "stadium lights generic" — name what's lighting (drop-pod exhaust / phosphorus / muzzle-flash / etc.)
- NO interior LIBRARY / school / hospital / mundane — only military / war / breach / siege interiors
- NO scrap-weld bush-fix DNA — squad is INTACT + DEPLOYED (rust-apoc territory)

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering. One full lighting description per string. Each starts with the lighting-name in CAPS, em-dash, then the body. Comma-separated phrases.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
