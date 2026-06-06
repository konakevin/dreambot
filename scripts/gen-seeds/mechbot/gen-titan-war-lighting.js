#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/titan_war_lighting.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LIGHTING-MODE descriptions for MechBot's titan-war-machines path. Each describes a complete cinematic lighting setup for a KILOMETER-SCALE COMBAT TITAN mid-engagement — Pacific Rim / 40K Imperator / AT-AT / Attack on Titan colossus lineage. Tiny humans / vehicles / cities for scale. Pure biblical-scale spectacle.

Each entry: 28-42 words. Format: "LIGHTING-NAME-IN-CAPS — full multi-clause description of the lighting situation, how it lands on the titan's kilometer-scale armor plating + glowing combat detail + ground impact zone, and the resulting catastrophic / biblical / war-spectacle mood." Comma-separated phrases.

━━━ THE BAR ━━━
Every entry must support WIDE CINEMATIC ESTABLISHING SHOTS — titan dominates the sky, ground is a tiny scale-prover zone of carnage below. Lighting MUST emphasize SCALE — distance haze, atmospheric layers, ground-vs-sky differential. Titan's own combat-glow (weapon-charges / shoulder-arrays / chest-reactor) interacts with ambient — name that interaction. Combat-flavored: muzzle-flashes, explosions, fire-fronts, EMP-bursts, lightning, orbital-strikes are welcome at AMBIENT scale (NOT closeup detail).

━━━ VARIETY MANDATE (~16 lighting families across the batch) ━━━

- HARD MIDDAY COMBAT (overhead white sun, razor shadow pooling beneath, heat-shimmer treeline)
- DAWN MILITARY OPERATION (cold steel-blue base + first orange band on topmost shoulder plates, dual-color split)
- DUSK FIRE-GLOW (horizon orange-purple, burning city below throwing warm amber uplight onto titan's belly)
- NIGHT WITH MUZZLE-FLASH STROBE (cold cobalt moonlight base, titan's cannons strobing white-hot, freeze-frame shadow snap)
- SODIUM-AMBER URBAN (downtown sodium lamps washing titan in deep amber, emergency floodlights lighting lower legs)
- STORM-LIGHTNING FLASH (black storm sky, single actinic-white fork freeze-silhouette titan)
- ARC-FLASH STROBE (severed high-voltage cable arcing actinic blue-white, sodium-amber filling gaps)
- NUCLEAR-WINTER OVERCAST (ash-grey diffuse through perpetual overcast, distant fire barely orange through grey)
- REACTOR-MELTDOWN GLOW (distant detonation pulse, single-source hard shadows radiating from titan's base)
- TACTICAL FLOODLIGHT ARRAY (multiple stadium-floods on building ruins, overlapping multi-shadow)
- ORBITAL-STRIKE BEAM (vertical column of white-hot orbital-cannon striking ground in deep distance, atmospheric back-glow)
- EMP-BURST CONCENTRIC (silent-pulse blue-white shockwave radiating across sky, equipment-glow stuttering)
- ARTILLERY-WALK FIRE-FRONT (line of distant artillery impacts marching across horizon, sequential muzzle-flash on titan's flank)
- SMOKE-CHOKED BATTLEFIELD (dense smoke columns from burning district, sun reduced to dim orange disc through ash haze)
- TWILIGHT POST-ENGAGEMENT (dying violet sky over still-burning city, titan silhouetted against smoke-and-flame horizon)
- AURORA EM-WARFARE (electromagnetic interference curtaining sky in flickering green-violet, distorted reflection on hull plating)
- ICE-PLANET LOW-SUN (low Arctic-angle white sun, snow-bounce filling underside of plating cold-white, long blue shadow)
- DESERT-WAR DUST-FILTERED (Sahara-orange dust-haze filtering sun to amber disc, titan reading in dusty silhouette)

━━━ MUST INCLUDE ELEMENTS in each entry (pick at least 3) ━━━
- Direction + temperature of the dominant light source
- How it lands on KILOMETER-SCALE armor plating (panel-shadow stretching across blocks / rivet-rows readable / hull underside)
- How it lands on the GROUND IMPACT ZONE (rubble shadow / burning district uplift / pulverized debris cloud)
- Atmospheric SCALE-haze element (distance fog / smoke columns / dust-front / ash blanket / weather system)
- Resulting catastrophic mood (apocalyptic / biblical / warlike / colossal / inevitable)

━━━ BANS ━━━

- NO portrait / closeup / bust framing language — titan dominates the SKY
- NO interior / hangar / clean studio — this is OUTDOOR battlefield always
- NO Pacific Rim / Jaeger / Kaiju / Imperator / Attack on Titan / Eva-01 by name
- NO Star Wars AT-AT / AT-ST / Walker / Stormtrooper IP
- NO scrap-weld / bush-fix DNA — titan is DESIGNED + INTACT (rust-apoc territory)
- NO single-cyclops simple-eye design language — keep description ENVIRONMENTAL not anatomical
- NO "intimate" / "quiet" / "contemplative" lighting moods — this is WAR + SCALE

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering. One full lighting description per string. Each starts with the lighting-name in CAPS, em-dash, then the body. Comma-separated phrases.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
