#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/space_opera_camera_framing.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA-FRAMING entries for a MangaBot space-opera keyframe. SCENE-LED — each entry names a framing that keeps the SHIP as HERO at 40-70% of the frame.

⚠️ CRITICAL ANTI-HERO-PORTRAIT GUARDRAIL: NEVER write close-up / portrait / face-visible / chest-up / waist-up framing of any character. NEVER write "camera at pilot's face" or "character fills frame". The ship is the hero.

⚠️ CRITICAL ANTI-TINY-SHIP-POSTCARD GUARDRAIL: NEVER write "ship in distance against starfield" / "tiny ship dwarfed by nebula" / "ship as small detail in vast cosmic vista". The ship must occupy 40-70% of frame — monumental, hero-sized.

Each entry: 12-22 words. Names framing + composition style. Always ship-led + monumental.

SHIP FRAMING VARIETY (ALL ship-hero / monumental / 40-70% frame):
- 20% WIDE ESTABLISHING 3/4 (camera angled, hull spans diagonal across the frame, full silhouette visible)
- 15% LOW-ANGLE HERO HULL-BELLY (camera under the ship looking up at the keel and engine-cluster)
- 12% BETWEEN-WINGMEN REVEAL (camera framed between two escort-fighters, hero cruiser dominating middle)
- 12% OVER-FOREGROUND-DEBRIS REVEAL (foreground wreckage brackets the hero ship beyond)
- 10% THROUGH-HANGAR-BAY-DOORS LOOKING OUT (hangar-frame brackets the hero exterior beyond)
- 10% OVER-PILOT-SHOULDER REVEAL (tiny pilot-helmet in foreground, ship cockpit-view of the hero)
- 8% BEHIND-TAIL LOOKING FORWARD (camera at the engine-cluster looking up the spine to the bow)
- 5% DUTCH-ANGLE ACTION (frame tilted, ship arcing through the diagonal, mid-combat)
- 4% NEAR-MISS PROXIMITY (camera nearly grazing the hull as the ship passes close)
- 4% BIRDS-EYE TOPDOWN (camera straight-down looking at the dorsal-spine, hull filling frame)

DO write (every entry keeps the SHIP at 40-70% of frame, monumental):
- Wide establishing 3/4 angle, the hero ship's hull spanning diagonal across the frame, full silhouette dominant
- Low-angle hero hull-belly, camera under the cruiser looking up at the keel and engine-cluster
- Between-wingmen reveal, two escort-fighters bracketing left and right, hero cruiser dominating middle-frame
- Over-foreground-debris reveal, jagged hull-fragment in foreground brackets the hero ship beyond
- Through-hangar-bay-doors looking out, the hangar-frame brackets the hero cruiser exterior dominant beyond
- Over-pilot-shoulder reveal, tiny pilot-helmet in immediate foreground, hero cruiser-bridge-view filling beyond
- Behind-tail looking forward, camera at the engine-cluster looking up the spine to the bow, hull-mass dominant
- Dutch-angle action, frame tilted 30-degrees, the cruiser arcing through the diagonal at frame-center
- Near-miss proximity, camera nearly grazing the hull as the cruiser passes close, plate-detail filling frame
- Birds-eye topdown, camera straight-down looking at the dorsal-spine, hull-mass filling 60% of frame

DO NOT write:
- ANY close-up / medium-shot / portrait / chest-up / waist-up / face-visible framing of a character
- ANY "camera at pilot's face" or "pilot fills frame" or "crew dominates shot"
- ANY "back-of-character looking out at scene" (audit-flagged failure mode)
- ANY "tiny ship in distance" / "ship dwarfed by nebula" / "ship as small detail in vast vista" (postcard failure mode)
- ANY framing where the ship occupies less than 40% of the frame
- Photoreal camera specs (f-stops / mm)
- Multiple shots per entry

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
