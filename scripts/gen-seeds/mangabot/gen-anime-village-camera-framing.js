#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_village_camera_framing.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA-FRAMING entries for a MangaBot anime-village keyframe. SCENE-LED — each entry names a WIDE / ARCHITECTURAL framing that keeps the VILLAGE as HERO and any inhabitant TINY for scale only.

⚠️ CRITICAL ANTI-HERO-PORTRAIT GUARDRAIL: NEVER write close-up / medium-shot / portrait / face-visible / chest-up / waist-up framings. NEVER write "camera at character's face" or "character fills frame". The village is the hero. Every entry must keep the figure TINY (5-15% of frame at most).

Each entry: 12-22 words. Names the framing + composition style. Always architecture-led or wide-establishing.

VILLAGE FRAMING VARIETY (ALL wide / architectural / atmospheric):
- 18% WIDE ESTABLISHING LOW-ANGLE (camera near ground, village climbs into frame, sky above)
- 14% 3/4 ARCHITECTURAL ANGLE (looking diagonally across rooflines, village mass dominant)
- 12% EYE-LEVEL ALLEY-VANISHING POINT (single-point perspective down narrow lane)
- 12% DOWN-THE-STREET PERSPECTIVE (camera at one end of street, lane stretching to vanishing point)
- 10% OVER-ROOFTOP BIRDS-EYE (camera elevated, looking down on village rooftops + distant mountain)
- 10% THROUGH-PAPER-LANTERN FOREGROUND (a hanging lantern brackets the frame, village visible beyond)
- 8% THROUGH-SHOJI-SCREEN REVEAL (interior shoji frames the village beyond)
- 6% UP-A-STONE-STAIRCASE LOW-ANGLE (camera at base of temple steps, looking up toward shrine)
- 5% RAIN-PUDDLE REFLECTION (foreground puddle mirrors the village above)
- 5% CROSS-RIVER PERSPECTIVE (camera on one bank, village across the water)

DO write (every entry keeps the camera ARCHITECTURAL, the figure TINY-IF-PRESENT):
- Wide establishing low-angle, camera near ground, village climbing into upper-frame against twilight sky
- 3/4 architectural angle, kawara rooflines stepping diagonally across the frame, distant mountain rising
- Eye-level alley-vanishing-point composition, narrow lane stretching to a single-point vanish at the bend
- Down-the-street perspective with the lane stretching to a vanishing-point bridge in the far distance
- Over-rooftop birds-eye view, camera elevated, gassho thatched roofs cascading down to distant fields
- Through a hanging paper-lantern foreground, the village glow visible beyond the lantern's warm halo
- Through a half-open shoji screen, the village street framed by tatami-edge in the immediate foreground
- Up-a-stone-staircase low-angle, weathered steps climbing toward a torii at the upper frame
- Rain-puddle reflection in the immediate foreground, the inverted village visible in the surface
- Cross-river perspective, the camera low on the near bank, the village rising on the far bank with mist

DO NOT write:
- ANY close-up / medium-shot / portrait / chest-up / waist-up / face-visible framing
- ANY "camera at character's face" or "character fills frame"
- ANY "back-of-character looking out at scene" (audit-flagged failure mode)
- ANY "over-the-shoulder of inhabitant" framing
- Photoreal camera specs (f-stops / mm)
- Multiple shots per entry
- Dutch-angle combat / dramatic tension
- Cyberpunk megabuilding worm's-eye

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
