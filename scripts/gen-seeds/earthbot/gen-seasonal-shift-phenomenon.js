#!/usr/bin/env node
/**
 * EarthBot seasonal-shift — PHENOMENON axis (bespoke, season-tagged).
 *
 * Conditional 30%-gated RARE optical event. Season-tagged so autumn rolls
 * get autumn-coded phenomena (mist rolling through autumn valley, first
 * frost crystals on leaves, autumn alpenglow) and spring rolls get
 * spring-coded ones (post-rain rainbow, blossom storm carried on warm
 * wind, mist rising from a thawing pond).
 *
 * R0 = 30 (autumn + spring 50/50).
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/seasonal_shift_phenomenon.json';
// Append mode — scale to 200.

generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} RARE PHENOMENON entries for EarthBot seasonal-shift. Each entry names ONE signature optical / atmospheric event — a rare moment that makes the scene feel like a once-in-a-lifetime capture. Season-tagged so the phenomenon matches the rolled subject's season — never contradicts it.

━━━ THE BAR — ONE RARE OPTICAL EVENT ━━━

A real Earth phenomenon — mist rolling through a valley, first frost crystals catching light, alpenglow on snow peaks, sun halo, fog clinging to canopy, rainbow after rain, blossom storm carried on wind. NEVER sci-fi / fantasy / aurora-like / bioluminescent.

━━━ OUTPUT FORMAT — JSON OBJECTS ━━━

{ "tags": ["autumn"], "description": "<one rare optical/atmospheric event, 14-22 words>" }

Season tag MUST be the FIRST tag — ONLY "autumn" or "spring".

━━━ AUTUMN PHENOMENA (~50%) ━━━

- A river of dawn mist rolling slowly through the autumn valley pooling between forested ridges
- Fresh frost crystals coating fallen autumn leaves catching the warm low-angle sidelight as glittering accents
- A warm alpenglow flush spreading across distant snow-dusted peaks above the autumn canopy at sunset
- A thick cloud-inversion cloaking the autumn valley floor leaving only the mixed-color treetops emerging above
- Smoke-thin atmospheric haze cooling the far autumn ridge separating it from the saturated midground
- A faint atmospheric sun-halo arcing above the distant autumn ridge in the cold late-day sky
- A thin curtain of autumn rain drifting through the far valley catching late afternoon sidelight
- Dawn fog clinging to the autumn canopy in soft drifts between the mixed deciduous trunks
- Long stretching atmospheric god-rays raking through gaps in the autumn canopy onto the valley floor
- A faint distant lightning shaft punching down at the far ridge through a passing autumn storm cell
- A delicate cobweb-thin frost line tracing every twig and leaf edge in the still autumn morning
- Mist clinging to the autumn river surface in soft drifts rising through the multi-color canopy
- A wide warm-orange sun-pillar rising vertically above the distant autumn ridge at sunset
- A thin curtain of falling autumn leaves drifting on a sudden valley updraft mid-frame
- Soft snow-dust beginning to fall through the autumn canopy at first-snow transition

━━━ SPRING PHENOMENA (~50%) ━━━

- A spring rainbow arcing across the valley after a passing thaw shower catching the late-day light
- Mist rising from a thawing pond drifting up through the spring canopy in soft pale curtains
- A warm alpenglow flush spreading across distant snow-dusted peaks above the spring canopy
- A river of warm dawn mist rolling slowly through the spring valley between flowering ridges
- A drift of cherry-blossom petals carried high on a warm spring updraft across the mid-frame
- A delicate atmospheric sun-halo arcing above the distant spring ridge in the bright clear sky
- A faint double-rainbow arcing low over the distant spring meadow after a passing rain-cell
- Soft dewdrops catching warm low-angle sidelight on every petal as glittering scene-wide accents
- Long stretching atmospheric god-rays raking through gaps in the spring canopy onto the bloom carpet
- A spring snow flurry drifting through the still-flowering canopy at the cold-spring transition
- Mist clinging to the snowmelt river surface in soft drifts rising through the spring forest
- Pollen drifting on warm spring wind across the mid-frame catching the sidelight as soft golden haze
- A faint distant atmospheric sun-pillar rising vertically above the distant spring ridge at sunset
- A wide curtain of soft spring rain drifting through the far valley catching the late-day sidelight
- A faint warm-orange storm-break light shaft punching down across the spring valley after a passing shower

━━━ ABSOLUTELY BANNED ━━━

- Sci-fi / fantasy / aurora / aurora-borealis / cosmic
- Bioluminescent / phosphorescent / glowing-anything (sci-fi trigger)
- Lava / volcanic / molten / lava-color
- Vertical pillar of fire / column of fireflies / vertical column of light (laser-beam triggers)
- Floating / hovering / impossible-physics
- Architecture / cabins / smoke from buildings
- Humans
- Multiple phenomena per entry (ONE per entry)
- Cross-season — autumn entries MUST contradict spring; spring entries MUST contradict autumn
- Subject content (subject axis)
- Color / palette details
- Tree species details (subject axis)

━━━ OUTPUT FORMAT EXAMPLES — JSON OBJECTS WITH TAGS ━━━

EVERY entry MUST be a JSON OBJECT with "tags" array (containing "autumn" OR "spring") and "description" string. Examples to copy verbatim:

✓ { "tags": ["autumn"], "description": "A river of dawn mist rolling slowly through the autumn valley pooling between forested ridges" }
✓ { "tags": ["spring"], "description": "A spring rainbow arcing across the valley after a passing thaw shower catching the late-day light" }
✗ BAD — bare string: "A river of dawn mist..." (BANNED — must be object with tags)
✗ BAD — missing tags: { "description": "..." } (BANNED — tags required)

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS — each MUST have shape { "tags": ["autumn"|"spring"], "description": "..." }. No bare strings. No preamble, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
