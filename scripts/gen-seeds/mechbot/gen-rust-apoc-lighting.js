#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/rust_apoc_lighting.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LIGHTING-MODE descriptions for MechBot's post-apoc-rust-tech path. Each describes a Mad Max FURY-ROAD wasteland lighting setup for a SCAVENGER BUSH-FIX RIG (jury-rigged scrap-welded chimera) RUNNING or BEING-BUSH-FIXED across cracked hardpan / salvage yard / collapsed industrial district / dust-storm flats. Crew VISIBLE on the rig (1-5 figures).

Each entry: 28-42 words. Format: "LIGHTING-NAME-IN-CAPS — full multi-clause wasteland lighting description, how it lands on the rig's scrap-armor / rust / sun-bleached paint / exhaust stacks + the crew's silhouettes + the dust-trail behind, and the resulting Fury Road / Borderlands / Tank Girl mood." Comma-separated phrases.

━━━ THE BAR ━━━
Every entry must read like a MAD MAX FURY ROAD frame — the rig is the hero, the wasteland is the stage, lighting carries the wasteland mood. Sun-bleached, fire-glow, dust-storm, golden-hour amber, blood-red dawn are the core register. The rig's exhaust-stacks belching black smoke + crew silhouettes + lashed scrap-armor are the lighting subjects.

━━━ VARIETY MANDATE (~16 wasteland lighting families across the batch) ━━━

- GOLDEN-HOUR SUNSET ORANGE (low raking sun across cracked salt flats, rig silhouetted copper, wheel-dust glowing plumes)
- DUST-STORM ORANGE FILTERED (midday sun choked through approaching haze, scene tinted orange-sepia, chrome dulled brass)
- DAWN BLOOD-RED HORIZON (blood-red band beneath violet sky, rig silhouetted edge-red, long cold shadows raking forward)
- HEADLIGHTS-IN-DUST CONES (twin yellow-white headlight beams punching through roiling dust, hard volumetric cones)
- NOON HARSH WHITE-BLEACHED (midday sun hammering, all color bleached toward white, hard black shadows beneath chassis)
- SANDSTORM SEPIA WALL (towering ochre sandstorm wall, rig reading cool desaturated, the wall's scale dwarfing the rig)
- NIGHT FIRE-GLOW (dead-dark wasteland, rear-deck flame-thrower as sole light, orange uplight on crew faces + welded edges)
- DAWN COLD-BLUE WITH FIRE-PIT (cold pre-sunrise blue ambient + rig-mounted fire-pit warm orange under chassis)
- MOLOTOV-IGNITION FOREGROUND (thermite charge detonating in foreground, blinding orange-white bloom, crew over-exposed)
- STORM-CELL LIGHTNING FLASH (pre-storm total darkness, actinic-white lightning fork freezes rig white-on-black)
- NEON-CYBERPUNK URBAN SCAVENGER (ruined overpass district, shattered neon tubes uplifting rig in broken cyan + magenta)
- GAS-FLARE GLOW DISTANT (burning oil-derrick on horizon casting warm amber across lower sky, rig flank catching warmth)
- TWILIGHT WITH WAR-TORCHES (last grey-blue light draining, war-torches igniting one by one, dual-color twilight + flame)
- SALVAGE-YARD WELDER-ARC (rig stopped, crew member welding cracked frame, blue-white arc-strobe lighting all faces)
- HEAT-MIRAGE NOON (heat shimmer dissolving rig's outline at speed, ambient sun blinding overhead, sky pure white-blue)
- BLACK-OIL-SMOKE COLUMN (rear stacks belching dense black smoke into low sky, sun reduced to dim red disc through stack-trail)
- HARD-SHADOW CANYON DRIVE (rig threading a slot canyon, sky reduced to bright slot above, deep cold shadow + amber-bounce from walls)
- DUST-DEVIL WHIRL UPLIGHT (twin dust-devils flanking the rig, sun-shafts catching the rotating columns of grit golden)
- WRECK-FIREBALL FOREGROUND (pursuer rig fireball in mid-distance behind, orange backlight rim-lighting hero rig, smoke column climbing)
- DAWN BLOOD-RED DUST-CLOUD-FRONT (dust-front rolling at horizon under blood-red dawn, rig sprinting just ahead of the front, sky split horizontally)
- POST-NUCLEAR FALLOUT-SKY (perpetual yellow-grey fallout overcast, no defined shadow, ash collecting on rig's upper surfaces)
- CONVOY-HEADLIGHTS PURSUIT (line of pursuing rigs' headlight clusters lighting hero rig from behind in scrambled multi-cone)
- SWITCH-BLADE NIGHT REGGAE-PURPLE (night drive on alien wasteland, sky deep purple, distant horizon glow lining low chassis)

━━━ MUST INCLUDE ELEMENTS in each entry (pick at least 3) ━━━
- Direction + temperature of the dominant light source
- How it lands on the rig's SCRAP-ARMOR / RUST / SUN-BLEACHED PAINT / WELDED SEAMS
- How it lands on the CREW (silhouettes / faces uplit by torch / goggles catching glint)
- Atmospheric particulate (dust-cloud / sand-veil / exhaust-smoke / heat-shimmer / ash)
- Resulting wasteland mood (Mad Max chase / scavenger pursuit / sun-bleached / blood-and-grit / fire-and-rust)

━━━ BANS ━━━

- NO clean polished chassis — rig is RUST + SCRAP-WELD + sun-bleached paint
- NO interior / hangar / lab / corporate — always WASTELAND outdoor
- NO Mad Max / Furiosa / Immortan / Doof Wagon BY NAME (lineage DNA only)
- NO Star Wars / Halo / Mandalorian IP
- NO predator-class / blade-silhouette / fang-prow language (skyships territory)
- NO POLISHED chrome dominant — chrome appears DULLED + scratched only
- NO modern military combat language (power-armor territory)
- NO contemplative / quiet / studio register — wasteland is HARSH + RUNNING

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering. One full lighting description per string. Each starts with the lighting-name in CAPS, em-dash, then the body. Comma-separated phrases.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
