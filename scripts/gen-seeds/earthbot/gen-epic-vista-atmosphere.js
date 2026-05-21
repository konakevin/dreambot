#!/usr/bin/env node
/**
 * EarthBot epic-vista — ATMOSPHERE axis.
 *
 * Default: CRISP CLEAR AIR with sharp distance visibility. Atmospheric
 * particulate (fog / mist / haze / spray) is the EXCEPTION when the
 * specific scene calls for it — never a blanket across every render.
 * This axis is heavily weighted toward "clean air" because the chaos
 * drift came from stacking fog + spray + haze + dust + smoke into every
 * single frame.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/epic_vista_atmosphere.json',
  total: 150,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERE entries for EarthBot epic-vista — ONE atmospheric condition per entry, weighted toward CRISP CLEAR AIR as the default.

━━━ THE BAR ━━━

Most great landscape photographs are taken in clean clear air with sharp distance visibility — that's what makes the geography readable at vista scale. Atmospheric particulate (fog / haze / mist / spray / dust) is an OCCASIONAL accent when the specific scene calls for it (valley fog at dawn in mountains / sea spray at cliff base / volcanic dust at sunset / heat-shimmer over desert). NEVER blanket every render in atmospheric mush.

━━━ FORMAT (NON-NEGOTIABLE) ━━━

Each entry: 12-22 words. Describe:
- Air clarity (crisp clear / lightly hazy / dust-veiled / etc.)
- Distance visibility (sharp to horizon / soft third-plane / etc.)
- Localized particulate ONLY when scene-natural (valley-fog at base / cliff-spray / volcanic-haze) — never blanket
- Sense of breathing-room

━━━ EXAMPLES ━━━

✓ "Crisp clear alpine air, sharp distance visibility, every distant ridge crisply defined to horizon"
✓ "Pristine clarity after rain, every wet leaf reflective, distant peaks washed crisp"
✓ "Bone-dry desert clarity, hundred-mile visibility, distance unbroken to horizon"
✓ "Light morning haze softening the third-furthest plane, foreground crystal sharp"
✓ "Valley fog pooling between ridges, peaks rising sharp above the cloud-sea, sky clear overhead"
✓ "Sea-spray mist hanging at cliff base, upper cliffs sharp against open sky"
✓ "Volcanic dust drifting low across the valley floor, upper sky clear and cobalt"
✓ "Heat-shimmer rippling above midday desert sand, distance dissolving in mirage near horizon"
✓ "Wind-scoured snow stripping the knife-edge ridge, spindrift catching low sun"
✓ "Tropical post-rain humidity giving distance a soft pearl-grey wash"

✗ BAD — stacks everything: "Fog AND mist AND spray AND dust AND heat-shimmer all at once"
✗ BAD — adds phenomena: "Atmosphere with rainbow visible through it"
✗ BAD — adds lighting: "Golden-hour light through the fog" (that's lighting axis)

━━━ CATEGORY DISTRIBUTION (heavy clean-air weight) ━━━

- ~40% Crisp clear air — sharp distance, no particulate (DEFAULT)
- ~25% Light atmospheric softening (distance third-plane softened only)
- ~20% Localized scene-natural particulate (valley-fog / cliff-spray / volcanic-haze / desert-dust — at the SCENE not blanketed)
- ~10% Active wind/spray (spindrift / surf-spray / sand-blow) when scene-natural
- ~5% Soft tropical humidity / post-rain pearl-haze

━━━ HARD BANS ━━━

- NO stacked particulate (no "fog + mist + spray + dust" mush)
- NO blanket fog/mist that erases the landscape — should always have a clear FAR or NEAR plane
- NO bioluminescent atmosphere ("phosphorescent air", "glowing fog") — that's sci-fi drift
- NO "magical" or "enchanted" or "ethereal" atmospheric descriptors
- NO smoke (forest-fire / industrial) — different aesthetic register

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
