#!/usr/bin/env node
/**
 * SteamBot STEAMPUNK_TRANSPORT_PHENOMENON top-up (Stage 2 backfill 2026-06-05).
 *
 * Used by steam-transport path — atmospheric phenomena that appear
 * alongside a steampunk vehicle in motion (locomotive, dirigible,
 * steam-clipper, mechanical-horse, paddle-wheeler, mono-rail). Existing
 * 50 cycle: meteor showers, fog-bows, geyser plumes, bioluminescent
 * algae, aurora ribbons, double-rainbows, dust-devils, triple-moonrise.
 *
 * REGISTER: 18-30 words. ONE atmospheric / natural / mechanical-vehicle
 * phenomenon happening WITHIN OR AROUND the vehicle's journey. Mid-
 * motion, observational. The vehicle is implied (or named in the verb).
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_transport_phenomenon.json',
  total: 200,
  batch: 25,
  maxTokens: 16000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} new TRANSPORT-PHENOMENON descriptors for SteamBot's steam-transport path. Each entry is an atmospheric or natural or mechanical-vehicle phenomenon happening WITHIN OR AROUND a steampunk vehicle in motion (locomotive, dirigible, steam-clipper, paddle-wheel riverboat, mechanical-horse caravan, monorail, ornithopter, steam-coach).

Each entry: 18-30 words. ONE phenomenon.

━━━ EXAMPLE PHRASINGS (mirror register exactly) ━━━

"Thunderhead anvil rolling across the valley rim, its flat base dragging curtains of grey rain toward the track ahead"
"Boiler-glow pulsing deep amber through the locomotive's inspection hatches, rhythmic heartbeat visible through the mountain fog"
"Meteor shower overhead, dozens of silver-white streaks scoring the velvet dark in rapid succession, fading like struck matches"
"Fog-bow arching perfectly across the gorge mouth, ghostly white ring where sunlight catches the suspended river-mist"
"Vast starling murmuration wheeling and folding over the marshland, liquid black shape shifting against the amber evening sky"
"Bioluminescent algae bloom coating the harbour surface, cold blue-green fire rippling outward in the vessel's spreading wake"
"Pressure-relief valve on the second carriage shrieking open, great white steam-plume billowing horizontally across the embankment"
"Triple-moonrise lifting three silver discs above the eastern plateau, long pale shadows striping the grassland in competing directions"

━━━ VARIETY MANDATE (distribute across ${n} new entries) ━━━

WEATHER / SKY (~16%):
- Storm phenomena (cyclonic cloud rotations / squall-line walls / hail-curtain / lightning ladders / thunderhead anvils)
- Fog phenomena (fog-bows / valley fog rising / fog-banks parting / sea-fog rolling over the rails)
- Rare optical (sun-pillar / mock-suns / 22-degree halo / fire-rainbow / circumzenithal arc)
- Wind-driven (dust storm / sandstorm / leaf-storm / petal-storm / ash-fall)

NATURAL / GEOLOGICAL (~12%):
- Geysers / lava-flows / hot-springs steam / glacier calving / avalanche cascade
- Volcanic phenomena (ash plume / lava-fall / pyroclastic distant front / smoke ring rising)
- Landslides / boulder-falls / mudslide / rockfall in the gorge
- River phenomena (flash-flood front / standing-wave / ice-jam break-up)

CELESTIAL (~10%):
- Aurora ribbons / aurora curtains / aurora-mid-day / polar light
- Comet streaks / shooting-star showers / multi-moon arrangements
- Eclipse (solar partial / lunar / annular ring) / Venus-transit / planetary alignment
- Milky-way arch / dense star-field over the train / equinox alignment with the tracks

MECHANICAL-VEHICLE PHENOMENA (~16%):
- Boiler / engine glow visible through cracks / pressure-gauges spinning / piston-cylinders glowing
- Steam-vent eruptions / safety-valves screaming / coupling-bursts
- Lift-crystal / aether-arc / propeller spin-up / gondola sway in cross-wind
- Smoke-ring chimney effects / chimney coal-ember showers / cinder-fall on the carriages

WATER-BODY PHENOMENA (~10%):
- Bioluminescent blooms in wake / whirlpool ahead / phosphorescent-foam trail
- Tidal bore / standing wave / steam-fog on hot springs / sea-spray rainbow
- Ice-floe field / breaking pack-ice / icebergs in the dawn / fog-frozen rigging

ANIMAL / FAUNA (~10%):
- Starling murmurations / monarch-butterfly migration / bat-cloud / bee-swarm
- Aerial creatures (eagle / pelican-flock / vulture / hawk-pair flanking the airship)
- Underwater life visible (whale-pod surfacing / school of brass-fish / sea-serpent silhouette)
- Mechanical wildlife (clockwork-bird flock / brass-dragonfly cloud)

ATMOSPHERIC PARTICULATES (~8%):
- Pollen-storm / dandelion-seed storm / cottonwood-fluff blizzard
- Volcanic ash falling slowly / sand-particle haze / desert dust-loft
- Snow-flurry beginning / sleet ticking on the windows / frost forming on glass

LIGHT-CHANGES (~8%):
- Sunrise breaking across the route / sunset rake-light through the track-cut
- Cloud-shadows racing across the plain / weather-front-edge cutting the light
- Mirage-shimmer over hot rails / heat-distortion at the horizon
- Golden-hour rake through engine-smoke / blue-hour silver across the lake

ENVIRONMENTAL CHANGES (~10%):
- Forest fire on a distant ridge / wildflower meadow in bloom along the embankment
- Crossing a salt-flat / crossing a high glacier / crossing a desert at dawn
- Crossing a delta of waterways / a flooded valley / a deep canyon / a fjord-narrowing

━━━ FORMAT RULES ━━━

- 18-30 words, ONE complete sentence.
- Lead with the phenomenon NOUN ("Thunderhead anvil", "Boiler-glow", "Meteor shower", "Vast starling murmuration").
- Use a progressive or strong active verb ("rolling", "pulsing", "wheeling", "rising").
- Close with sensory detail (color / motion / sound / scale).

━━━ HARD MANDATES ━━━

- Steampunk-era register — natural phenomena are described 1890s-style with brass / coal / steam / aether language where appropriate.
- The phenomenon is OBSERVED from the moving vehicle (it makes sense to see from a train / airship / boat).
- Each entry's phenomenon noun must vary across the pool.

━━━ HARD BANS ━━━

- NO modern phenomena (no jet contrails, no satellite-streaks, no light-pollution dome).
- NO active human characters in frame (the phenomenon is the subject).
- NO horror / disaster / death-toll register — atmospheric mid-event only.
- NO repeating phenomenon nouns across entries.
- NO photographer / camera-jargon.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
