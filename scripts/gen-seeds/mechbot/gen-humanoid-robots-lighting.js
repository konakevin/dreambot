#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/humanoid_robots_lighting.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LIGHTING-MODE descriptions for MechBot's humanoid-robots path. Each describes a complete theatrical / atmospheric / cinematic lighting setup for a SINGLE polished humanoid robot (1.5-2.5m human-scale, multi-iris compound-optic head, multi-color glowing joint-seams + chest-core, polished chrome / titanium chassis) in an outdoor atmospheric setting (waterfall / snow mountain / canyon / overgrown ruin / fire-glow wasteland / alien wilderness / bioluminescent jungle / crystal cavern).

Each entry: 28-42 words. Format: "LIGHTING-NAME-IN-CAPS — full multi-clause description of the light situation, how it interacts with the robot's polished chassis + glowing joint-seams + multi-iris optics, and the resulting cinematic mood / shadow shape / atmospheric quality." Comma-separated phrases inside each entry.

━━━ THE BAR ━━━
Every entry must read like a SAVED MOVIE POSTER LIGHT SETUP — the kind of light a master cinematographer or concept-art painter would specify for a flagship sci-fi reveal frame. The robot's own multi-color GLOW (chest-core + joint-seams + multi-iris optics) interacts with the ambient lighting — name that interaction explicitly. Every entry should support FULL-BODY 50-75%-frame composition (NEVER closeup / bust / detail). Outdoor preferred; rare clean interior allowed but must be cinematic.

━━━ VARIETY MANDATE (distribute across these ~16 lighting families, ~12-14 entries per batch) ━━━

- GOLDEN-HOUR raking sun (low warm sidelight, long copper shadows, every panel rim-warm)
- DAWN dual-color (cold pre-sunrise blue ambient + first orange catching upper chassis only)
- DUSK / BLOOD-RED HORIZON (crimson backlit silhouette, shadow side falling near-black)
- OVERCAST diffuse (low cloud ceiling, soft directionless, muted-steel chassis tone)
- STORM / LIGHTNING flash (charcoal sky, single actinic-white fork freeze-silhouette)
- NIGHT WITH ROBOT'S OWN GLOW (deep darkness, eyes/chest-core as primary multi-color emission)
- NEON CYBERPUNK multi-color (magenta + cyan + amber wash from offscreen signage, wet ground doubling color)
- WATERFALL-MIST diffusion (wraparound humid light, mist god-rays, prism-flecks catching chassis edges)
- BIOLUMINESCENT JUNGLE uplight (glowing flora throwing cold green / cyan / violet up from below)
- VOLCANIC FIRE-GLOW (orange-red uplift from lava-channel below, hot shadow raking upward across torso)
- CRYSTAL CAVERN refracted (prism-shards casting cyan / magenta / amber rainbow shards across chassis)
- AURORA / EM-SKY ribbon (high-altitude curtains of green-violet light shifting cold reflection across upper hull)
- ARTIFICIAL FLOODLIGHT ARRAY (stadium-grade lights from multiple ruins / posts casting overlapping multi-shadow)
- EXPLOSION / FIREBALL BACKLIT silhouette (distant ordnance bloom edge-lighting the robot orange)
- HOLOGRAPHIC PROJECTION GLOW (cyan data-streams + amber tactical-readouts floating around casting soft multi-directional)
- INTERIOR CINEMATIC (clean hangar / lab / vault — overhead key + soft fill, still atmospheric)

━━━ MUST INCLUDE ELEMENTS in each entry (pick at least 3) ━━━
- Direction + temperature of the dominant light source
- How it interacts with POLISHED CHROME / TITANIUM chassis (rim / specular / dramatic shadow)
- How it interacts with the robot's MULTI-IRIS COMPOUND-OPTIC HEAD or its multi-color joint-seam glow
- Atmospheric particulate (mist / dust / embers / spore-drift / rain / snow / steam)
- Resulting mood (awe / menace / grace / wonder / solitude / defiance)

━━━ BANS ━━━

- NO closeup / portrait / bust language ("face / visor catches light"). Robot is FULL-BODY 50-75% frame.
- NO scrap / weld / rust / bush-fix DNA (that's rust-tech / industrial territory). Robot is POLISHED + DESIGNED.
- NO Star Wars / Halo / Mandalorian / Spartan / Stormtrooper / Boba / Mando / R2 / BB-8 / C-3PO / Master Chief.
- NO single-color "blue glow" — robot's own emission is MULTI-COLOR (cyan + amber + magenta + emerald blend).
- NO bland white empty office / clean corporate cube backdrop.
- NO "muzzle-flash strobe" (this isn't a combat path) — keep light SOURCES atmospheric / theatrical / environmental.
- NO modern military / battlefield drama language as the dominant mood.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering. One full lighting description per string. Each starts with the lighting-name in CAPS, em-dash, then the body. Comma-separated phrases inside the body.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
