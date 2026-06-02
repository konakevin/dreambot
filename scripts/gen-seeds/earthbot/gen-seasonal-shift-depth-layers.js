#!/usr/bin/env node
/**
 * EarthBot seasonal-shift — DEPTH LAYERS axis (R4 autumn + spring only).
 *
 * Multi-tier composition (FG / MG / distant) for 10/10 frames per playbook.
 * Season-tagged autumn or spring ONLY.
 *
 * R0 = 40.
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/seasonal_shift_depth_layers.json';
// Append mode — scale to 200.

generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} DEPTH LAYER entries for EarthBot seasonal-shift. Each entry names what fills the FOREGROUND + MIDGROUND + DISTANT portions of the frame. Per playbook: 4+ tier depth is mandatory for 10/10 renders.

━━━ THE BAR — MULTI-TIER DEPTH FOR A WIDE LANDSCAPE VISTA ━━━

Each entry describes a WIDE-VISTA panoramic landscape — foreground / midground / distant tiers visible across a sweeping panoramic view (NOT a close-up). Lead with "A wide-vista landscape with..." or similar wide-framing language so the depth tiers reinforce a panoramic shot. Season-tagged for coherent rolls.

━━━ OUTPUT FORMAT — JSON OBJECTS ━━━

{ "tags": ["autumn"], "description": "<wide-vista FG + MG + distant description, 22-38 words>" }

Season tag MUST be the FIRST tag — ONLY "autumn" or "spring".

⚠️ NEVER lead with "Foreground of X" — that pulls the camera close. Lead with "A wide-vista landscape" / "A panoramic view" / "An expansive scene" so the depth tiers serve a sweeping landscape, not a close-up.

━━━ AUTUMN DEPTH LAYERS (~50%) — WIDE-VISTA PANORAMIC + DENSE ━━━

- A wide-vista autumn landscape — sweeping DENSE mixed forest hillside packed wall-to-wall in the midground, low autumn shrubs at the near edge, distant snow-dusted alpine peaks rising at the horizon
- A panoramic autumn view — saturated peak-color canopy filling the midground slope edge-to-edge, lingering green conifers anchoring the low foreground, distant valley wrapped in atmospheric haze
- An expansive autumn scene — wide DENSE deciduous forest at peak saturation across the midground, leaf-scatter at near rim, distant mountain peaks silhouetted against the sky
- A wide-vista autumn valley — dense mixed peak-color forest packed wall-to-wall down both slopes, low autumn shrubs near the rim, distant snow-dusted ridges
- A panoramic autumn river-valley — dense forest hillside in saturated peak color across the midground, river bend cutting through near foreground, distant ridges at the horizon
- A wide-vista FIRST SNOW landscape — dense mixed deciduous still at peak color across the midground slope, near rim scattered with first-snow dusting, distant snow-capped peaks
- An expansive autumn forest panorama — dense wide multi-color canopy packing the midground, low understory color at the near edge, distant alpine ridge wrapped in haze
- A panoramic autumn hillside view — sweeping dense mixed-species peak color across the midground slope, leaf-carpet at near rim, distant horizon with silhouetted peaks
- A wide-vista autumn waterfall scene — multi-tier waterfall cascading through dense midground forest at peak color, mixed-color slope behind, distant ridge silhouette
- A panoramic autumn forest-interior view — dense mixed canopy enveloping the midground frame, low leaf-carpet at near floor, distant trunks fading into atmospheric haze

━━━ SPRING DEPTH LAYERS (~50%) — WIDE-VISTA PANORAMIC ━━━

- A wide-vista spring landscape — sweeping wildflower SUPERBLOOM filling the midground meadow, low bloom-carpet at near edge, distant alpine peaks rising at the horizon
- A panoramic spring valley — mixed flowering tree canopy across the midground hillside, wildflower carpet at near rim, distant valley extending into hazy distance
- An expansive spring scene — wide flowering forest filling the midground slope, mixed wildflower bloom at near edge, distant rolling hills with emerging green
- A wide-vista spring hillside — flowering canopy filling the midground, wildflower carpet at the near foreground, distant snow-dusted alpine peaks
- A panoramic spring river-valley — flowering tree-line on both banks across the midground, wildflower banks at near rim, distant green emerging-spring ridge
- A wide-vista spring SUPERBLOOM panorama — multi-color wildflower carpet filling the midground, low bloom accents at near edge, distant peaks at the horizon
- A panoramic spring thaw scene — emerging wildflower carpet filling the midground meadow, lingering snow patches at near rim, distant snow-capped peaks
- An expansive spring alpine view — mixed flowering trees filling the midground slope, wildflower bloom at near foreground, distant valley extending in spring haze
- A wide-vista spring waterfall scene — waterfall cascading through the midground forest, mixed flowering trees behind, distant green emerging valley
- A panoramic spring forest-interior view — mixed flowering canopy enveloping the midground frame, low wildflower carpet at near floor, distant trunks fading into haze

━━━ ABSOLUTELY BANNED ━━━

- Color details (color_palette axis)
- Lighting words
- Sky / atmosphere details
- Specific motion (motion axis)
- Architecture / humans
- Made-up depth tiers (always FG + MG + distant)

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS. FG + MG + distant per entry. Season-tagged. No preamble, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
