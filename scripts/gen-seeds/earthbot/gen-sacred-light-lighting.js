#!/usr/bin/env node
/**
 * EarthBot sacred-light — LIGHTING axis (path-bespoke).
 *
 * THIS is the sacred-light path's identity axis. The light itself is
 * the hero. Each entry is a SPECIFIC transcendent natural-light event
 * — alpenglow on a single peak, raking shafts plural through old-growth
 * canopy, storm-break broad spotlight across a meadow, crepuscular
 * rays fanning through cypress, sun-halo over winter forest, golden-
 * hour saturation, last-light crowning a ridge.
 *
 * Trigger-purged from R0:
 * - NO "single beam / single shaft / single column" (laser-beam trigger)
 * - NO "bioluminescent / phosphorescent / glowing"
 *
 * R0 = 50.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/sacred_light_lighting.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SACRED-LIGHT LIGHTING entries for EarthBot sacred-light. Each entry describes ONE specific transcendent natural-light event — the HERO of the frame. The light moment is the emotional center. Marc Adamus / Galen Rowell / Peter Lik caliber gallery-print sacred-light photography.

━━━ THE BAR — LIGHT AS THE EMOTIONAL CENTER ━━━

Each entry names ONE specific natural-light event. NOT ambient lighting — a DRAMATIC SINGLE event that demands attention. Alpenglow burning a single peak crown while everything else stays cool, storm-break broad spotlight blasting through a cloud-tear onto a meadow, raking shafts plural through old-growth canopy, sun-halo ring over a winter forest, golden-hour saturation crowning a ridge.

━━━ ABSOLUTELY BANNED ━━━

NEVER write these — they trigger Flux laser-beam / sci-fi rendering:

- "single beam" / "single shaft" / "single column of light"
- "vertical column" / "column piercing"
- "single intense shaft" / "single thin column"
- "cathedral-scale godray" / "godray piercing"
- "single ray of light" (always plural — "rays plural" or "shafts plural")
- "bioluminescent" / "luminescent" / "luminescence" / "phosphorescent"
- "glowing" (when describing rock/water/minerals — they REFLECT light, never glow)
- "pulsing" / "radiating" mineral language
- "portal" / "doorway" / "mystical" / "ethereal" / "otherworldly" / "magical"
- "fluorescent" anything
- "lit from within" / "internal glow"

USE INSTEAD: "shafts plural fanning", "broad spotlight breaking through", "raking sidelight", "warm crown of light", "alpenglow rim", "golden-hour saturation", "scattered cloud-gap shafts", "soft directional light"

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS. Each string is one lighting moment, 18-30 words.

━━━ LIGHT-EVENT CATEGORIES (rotate aggressively) ━━━

ALPENGLOW / FIRST-LIGHT:
- Alpenglow at peak chromatic moment, the peak crown burning rose-pink to magenta while everything else holds in deep indigo shadow
- Dawn first-light striking the highest ridge in warm copper-amber, valleys below still in cool blue shadow
- Last-light alpenglow burning the peak face rose-gold, foreground in deep cool shadow
- Pre-dawn cool indigo wash with just the peak crown beginning to catch first warm rose

RAKING / SIDELIGHT:
- Golden-hour rake from low sun, warm copper-amber sidelight slashing horizontally across the formation
- Late-afternoon raking sidelight, long shadows extending across the foreground, warm amber rim along every exposed edge
- First-light raking horizontally, warm copper light just clipping the highest crowns
- Late-light warm crown of saturation on the highest ridge, foreground sunk in cool shadow

CREPUSCULAR / SHAFTS-PLURAL:
- Crepuscular rays fanning through scattered cloud-gaps, multiple shafts plural illuminating different portions of the landscape below
- Shafts plural raking through old-growth canopy, illuminated dust catching the columns of light in volumetric warmth
- Sunset god-rays bursting through scattered cloud-gaps, multiple shafts plural striking the landscape
- Forest-canopy shafts plural cutting through the upper canopy, dust-beams visible in the spilling light

STORM-BREAK / SPOTLIGHT:
- Storm-break broad spotlight, sun blasting wide-open through a ragged cloud-tear, the landscape lit gold like a stage, surrounding ridges sunk in cool purple-grey
- Backlit storm-light, sun behind a heavy cloud bank, the formation silhouetted with bright rim-light burning along every edge
- Dramatic backlighting with sun-glow rimming every cloud edge, the foreground in deep contrast shadow
- Broad spotlight breaking through the overcast ceiling, hitting one section of the landscape in golden warmth

HALO / SUN-PILLAR / OPTICAL:
- Sun-halo ring catching ice-crystals in upper atmosphere, the halo visible around the sun overhead
- Sun-pillar rising vertical from the horizon, golden column of light extending up into the sky
- Crepuscular rays fanning behind a peak silhouette, the rays plural visible against the sky

GOLDEN-HOUR / WARMTH:
- Golden-hour saturation flooding the upper sky in warm amber, soft warmth raking the landscape
- Warm honey-gold afternoon light flooding the scene, every formation catching warm rim-light
- Pre-sunset warm glow filling the upper sky, soft warm tones across the landscape

━━━ HARD BANS ━━━

NEVER include:
- Specific subject content (no "alpenglow on the K2 peak" — generic only)
- Specific atmospheric texture (no "mist swirling" — atmosphere axis owns)
- Mineral colors (no "amethyst-violet" — mineral_color is geological-wonder only)
- Focal-anchor elements
- Humans
- Architecture / ruins / cathedrals
- Sci-fi / fantasy / magical glow
- Made-up lighting words

━━━ EXAMPLES ━━━

✓ "Alpenglow at peak chromatic moment, the peak crown burning rose-pink to magenta while surrounding slopes hold in deep indigo cool shadow"

✓ "Crepuscular rays plural fanning through scattered cloud-gaps, multiple golden shafts illuminating different portions of the landscape below"

✓ "Storm-break broad spotlight, sun blasting wide-open through a ragged cloud-tear, the landscape lit gold like a stage"

✓ "Golden-hour rake from low sun, warm copper-amber sidelight slashing horizontally across the formation, long shadows extending across the foreground"

✓ "Dawn first-light striking the highest ridge in warm copper-amber, valleys below still in cool blue-indigo shadow"

✓ "Shafts plural raking through old-growth canopy, illuminated dust catching the columns of warm light in volumetric texture"

✓ "Sun-halo ring catching ice-crystals in upper atmosphere, the halo visible around the sun, soft cool tones throughout the upper sky"

✓ "Last-light alpenglow burning the peak face rose-gold, foreground in deep cool shadow, warm amber rim-light along the upper edges"

✓ "Backlit storm-light, sun behind a heavy cloud bank, the formation silhouetted with bright rim-light burning along every exposed edge"

✓ "Sunset god-rays bursting through scattered cloud-gaps, multiple shafts plural striking different portions of the landscape below"

✓ "Sun-pillar rising vertical from the horizon, golden column of light extending up into the sky, surrounding sky in cool tones"

✓ "Golden-hour saturation flooding the upper sky in warm amber, soft warmth raking the landscape, foreground catching warm rim-light"

✗ BAD — single beam: "Single sunbeam piercing the forest canopy" (BANNED — say "shafts plural raking through the canopy")
✗ BAD — bioluminescent: "Soft bioluminescent glow rising from the forest floor" (BANNED — natural light only)
✗ BAD — godray: "Cathedral-scale godray descending through the canopy" (BANNED — say "shafts plural raking through")
✗ BAD — names subject: "Alpenglow on K2" (BANNED — generic only)
✗ BAD — atmospheric: "Light with mist swirling through" (BANNED — atmosphere axis)
✗ BAD — architecture: "Light through a stained-glass chapel" (BANNED — no architecture)

━━━ CATEGORY DISTRIBUTION ━━━

- ~25% alpenglow / first-light
- ~20% raking / sidelight
- ~20% crepuscular / shafts-plural
- ~15% storm-break / broad spotlight
- ~10% halo / sun-pillar / optical
- ~10% golden-hour / general warmth

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. Specific transcendent natural-light event. NO single-beam language. NO bioluminescent. NO architecture. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
