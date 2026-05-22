#!/usr/bin/env node
/**
 * EarthBot geological-wonder — LIGHTING axis (R3 outdoor-only).
 *
 * R2 still had ~50% interior cave-lighting entries (godrays through
 * skylight, bioluminescent fungi). Since R3 subject pool pivoted to
 * outdoor-only, the lighting pool must pivot too.
 *
 * R3: 100% outdoor lighting. Golden hour, alpenglow, storm-break,
 * blue-hour, midday brilliance, raking sidelight. Some midnight-sun
 * entries kept ONLY for arctic-polar biome.
 *
 * BANNED: "single column" / "single shaft" / "vertical column" beam
 * language (Flux renders as laser-beam).
 *
 * R0 = 50.
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/geological_wonder_lighting.json';
// R3 production scale — append to existing 50 entries to reach 200.
generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} OUTDOOR LIGHTING entries for EarthBot geological-wonder. Each entry describes ONE specific outdoor light condition for a real-Earth geological scene. NEVER cave-interior lighting. Marc Adamus / Peter Lik gallery-print caliber.

━━━ THE BAR — OUTDOOR LIGHT, NEVER INTERIOR ━━━

Light is the second hero of geological photography. Golden hour rake, alpenglow at peak chromatic moment, storm-break spotlight, blue-hour wash, pre-dawn cool indigo, midday brilliance, dramatic backlight. ALL outdoor. NEVER cave/chamber/skylight-piercing-cave lighting.

━━━ ABSOLUTELY BANNED ━━━

NEVER write these — they cause Flux to render laser-beams / energy effects:

- "single column of light" / "single shaft of light"
- "vertical column" / "column piercing"
- "single intense shaft" / "single thin column"
- "beam of light" / "beam piercing"
- "cathedral-scale godray" (the "godray" word triggers cave-interior + beam)
- "skylight piercing" / "piercing through a skylight"
- "midnight sun horizontal rake" — TRIGGERS ALIEN-PLANET interpretation when paired with violet/cyan mineral palettes; ONLY allowed for arctic-polar biome with cool descriptive language

USE INSTEAD: "shafts of light" (plural, scattered), "raking sidelight", "scattered cloud-gap light", "broad spotlight from a storm-break", "soft directional light", "raking horizontally across", "fanning shafts" (plural always)

━━━ OUTPUT FORMAT — JSON OBJECTS ━━━

Output a JSON array of OBJECTS in this exact shape:

{ "tags": ["epic"], "description": "<outdoor lighting condition, 18-32 words>" }
OR (smaller %)
{ "tags": ["intimate"], "description": "<outdoor close-up lighting, 18-32 words>" }

The "tags" array MUST include "epic" OR "intimate" as the FIRST tag. Most entries should be "epic". Some may be tagged with biome (alpine / desert / volcanic / arctic-polar / coastal).

━━━ LIGHTING MODES (all outdoor — vary aggressively across these) ━━━

GOLDEN HOUR / RAKING SIDELIGHT:
- Golden hour rake from low sun, warm copper-amber sidelight slashing across the formation
- Late-afternoon raking sidelight, long shadows extending across the foreground
- Last-light golden warmth on a distant ridge, foreground in cool shadow
- First-light dawn rake, warm copper light just clipping the highest ridges

ALPENGLOW:
- Alpenglow at peak chromatic moment, peak faces burning rose-pink to magenta, eastern sky deep indigo
- Last-light alpenglow on distant peaks, foreground in cool shadow
- Fading alpenglow with warm amber-rose along the ridge silhouette

STORM-BREAK / DRAMATIC:
- Storm-break spotlight, sun blasting wide-open through a ragged cloud-tear, the landscape lit gold like a stage, surrounding ridges sunk in cool purple-grey
- Backlit storm-light, sun behind a heavy cloud bank, the formation silhouetted with bright rim-light
- Dramatic backlighting with sun glow rimming every cloud edge, the foreground in deep contrast shadow

CLOUD-RAY SCATTERED:
- Sunset sun-rays fanning through scattered cloud-gaps, multiple shafts illuminating different portions of the landscape
- Scattered shafts of cloud-gap light spilling across the foreground formations
- Broad spotlight breaking through the overcast ceiling, hitting one section of the foreground

BLUE HOUR / COOL:
- Pre-dawn blue-hour deep indigo saturation, the formation just barely catching first cool light
- Blue-hour deep cool indigo wash, the landscape silhouetted with rim-edges catching last warm light
- Dusk transition deep copper-orange horizon band backlighting the formation, sky overhead grading near-black

MIDDAY:
- Midday brilliance with crystal-clear air, every formation sharp-detailed in tack-direct light
- High-noon direct sun saturating every surface in tack-sharp contrast
- Midday overcast even-diffuse light, no harsh shadows, every formation evenly rendered

ARCTIC-POLAR ONLY (limited):
- Arctic midnight-sun low raking light across the ice plain, long shadows extending horizontally (allowed for arctic-polar biome only)
- Polar twilight with the sun just below the horizon, the sky in deep violet wash

━━━ HARD BANS ━━━

NEVER include:
- Cave / chamber / interior / godray-through-skylight language (subject is outdoor — lighting must be too)
- Beam / column / shaft language (Flux renders as laser)
- Specific subject content (no "lighting on the hoodoos" — generic only)
- Specific atmospheric texture (no "mist swirling" — atmosphere axis owns)
- Mineral color saturation (no "amethyst-violet" — mineral_color axis owns)
- Focal-anchor elements (no "tree silhouetted" — focal_anchor axis)
- Humans
- Sci-fi / fantasy / magical-glow
- Made-up lighting words

━━━ EXAMPLES ━━━

✓ { "tags": ["epic", "desert"], "description": "Golden hour rake from low sun, warm copper-amber sidelight slashing across the formation, long shadows extending across the foreground" }

✓ { "tags": ["epic", "alpine"], "description": "Alpenglow at peak chromatic moment, peak faces burning rose-pink to magenta, eastern sky holding deep indigo, snow catching the warm glow" }

✓ { "tags": ["epic"], "description": "Storm-break spotlight, sun blasting wide-open through a ragged cloud-tear, the landscape lit gold like a stage, surrounding ridges sunk in cool purple-grey" }

✓ { "tags": ["epic"], "description": "Pre-dawn blue-hour deep indigo saturation, the formation just barely catching first cool light along the rim-edge" }

✓ { "tags": ["epic", "volcanic"], "description": "Last-light alpenglow on a distant peak, the foreground in cool shadow, warm amber-rose along the ridge silhouette" }

✓ { "tags": ["epic"], "description": "Sunset sun-rays fanning through scattered cloud-gaps, multiple shafts illuminating different portions of the landscape" }

✓ { "tags": ["epic", "arctic-polar"], "description": "Arctic midnight-sun low raking light across the ice plain, long shadows extending horizontally, soft cool tones" }

✓ { "tags": ["epic", "desert"], "description": "Late-afternoon raking sidelight, long shadows extending across the foreground, every rock edge catching warm amber rim-light" }

✓ { "tags": ["epic"], "description": "Backlit storm-light, sun behind a heavy cloud bank, the formation silhouetted with bright rim-light burning along every exposed edge" }

✓ { "tags": ["intimate"], "description": "Soft directional golden-hour sidelight skimming across the close-up rock face, raking warm amber across textured surfaces" }

✗ BAD — beam: "Single column of light piercing through cloud-gap" (BANNED — say "shafts of light" plural)
✗ BAD — cave: "Godrays piercing down through a cave skylight" (BANNED — outdoor only)
✗ BAD — names subject: "Light on the Antelope Canyon walls" (BANNED — generic only)
✗ BAD — atmospheric: "Light with mist swirling through" (BANNED — atmosphere axis)
✗ BAD — color saturation: "Light with electric-violet glow" (BANNED — mineral_color axis)

━━━ DISTRIBUTION ━━━

- ~85% epic (outdoor wide-vista lighting)
- ~15% intimate (outdoor close-up lighting)
- 0% interior / cave lighting

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS. Outdoor lighting only. NO beam / column / shaft language. No preamble, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
