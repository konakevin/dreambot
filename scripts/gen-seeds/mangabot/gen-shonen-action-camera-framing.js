#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/shonen_action_camera_framing.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA FRAMING entries for shonen-action keyframe. Combat-heavy mix. Forward-facing-or-profile only. NO back-to-camera.

Each entry: 8-16 words. Framing + character orientation + combat composition.

DISTRIBUTION (combat-leaning forward-facing only):
- 22% LOW-ANGLE HERO (camera below, hero rising into frame mid-strike with power-aura, face haloed by impact)
- 18% FORWARD THREE-QUARTER COMBAT (hero angled 3/4 toward viewer mid-strike, weapon arc, full-body)
- 14% TIGHT MEDIUM-COMBAT (waist-up of hero mid-cast or mid-strike, face dominant in power-aura, weapon arc visible)
- 12% PROFILE PEAK-ACTION (full side-profile mid-strike with weapon arc, body torqued, face visible in profile)
- 8% DUTCH-ANGLE COMBAT (tilted-frame combat-tension, hero mid-strike at off-axis tension toward viewer)
- 8% WEAPON-FOREGROUND (weapon-tip close to lens mid-arc, hero's face mid-distance focused on strike)
- 6% MEDIUM-FULL-BODY (hero at half-frame three-quarter forward mid-action, battlefield wraps)
- 4% HIGH-ANGLE COMBAT (camera above; hero looks UP at incoming threat, face visible turned upward)
- 4% EXTREME CLOSE-UP (face fills frame, single eye burns with rune-glow, sweat-bead at temple)
- 4% MAGIC-CIRCLE-FRAMED (rune-circle wraps hero mid-cast, face dominant in circle glow)

DO write:
- Low-angle hero, camera below shonen hero mid-strike, body angled three-quarter forward, weapon raised against burning sky
- Forward three-quarter combat-pose, hero angled toward viewer mid-strike, weapon arc trailing, fierce face
- Tight medium-combat shot, hero waist-up mid-cast, hands forward with energy-blast, face dominant in glow
- Profile peak-action full-body, hero mid-strike side-on with weapon arc, body torqued, face determined in profile
- Dutch-angle combat tilt, hero mid-counter at off-axis with sparks flying toward viewer
- Weapon-foreground, blade close to lens mid-arc, hero's face mid-distance focused fierce

DO NOT: over-shoulder behind / wide-vista-with-hero-tiny / silhouette-from-behind. Photoreal camera specs.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
