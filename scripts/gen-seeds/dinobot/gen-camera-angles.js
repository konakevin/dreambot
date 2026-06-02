#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/camera_angles.json',
  total: 200,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} CAMERA ANGLE descriptions for DinoBot — wildlife-cinematography framings that show DINOSAUR + WORLD together. Each entry is 14-22 words.

━━━ NON-NEGOTIABLE — WIDE / ESTABLISHING / SCALE-SHOWING DOMINANT ━━━
The bot's signature is showing dinosaurs in their VAST primordial world. Camera angles must let the lush mega-foliage, vast terrain, and atmospheric depth be VISIBLE. Distribute STRICTLY:

- 60% WIDE / EXTREME-WIDE / ESTABLISHING shots (dinosaur full-body in vast environment)
- 25% MEDIUM-WIDE shots (dinosaur full-body or near-full, environment still richly visible)
- 10% MEDIUM shots (dinosaur waist-up or 3/4, some environment)
- 5% CLOSER shots (rare — only when path-specific paths benefit from intimacy)

NEVER include extreme-close-up / macro / tight-detail entries — those collapse the frame and hide the world.

━━━ ANGLE / DIRECTION VARIETY (within wide/medium framings) ━━━

LOW / GROUND-LEVEL (full body visible):
- Low-angle wide hero shot, dinosaur full body silhouetted against vast sky and distant peaks
- Worm's-eye wide framing, dinosaur towering above with mega-fern canopy filling upper frame
- Low tracking wide shot, dinosaur full-body running across primordial plain

EYE-LEVEL (full body):
- Eye-level extreme wide, dinosaur full body in vast canyon, terrain stretching past horizon
- Eye-level wide three-quarter, dinosaur in dense jungle understory, mega-foliage framing all sides
- Eye-level wide profile, dinosaur full body across the frame with rich environment behind

HIGH / OVERHEAD (showing scale + terrain):
- High-angle establishing shot from cliff ledge, dinosaur small in vast valley below
- Crane-up wide pull-away from dinosaur, environment expanding into infinity
- Aerial wide top-down view of dinosaur in clearing, mega-foliage radiating outward
- Bird's-eye wide showing dinosaur and surroundings, atmospheric haze fading distance

EXTREME WIDE / VISTA:
- Ultra-wide cinematic establishing shot, dinosaur as scale-anchor in epic primordial vista
- Panoramic wide vista with dinosaur small in foreground, world stretching to vanishing point
- IMAX-wide dinosaur at midground with multi-layer terrain receding into haze
- Wide-angle aerial vista, dinosaur visible amid vast canyon / waterfall / mega-jungle

THREE-QUARTER WIDE:
- Three-quarter wide angle, dinosaur partially turned, environment richly visible on all sides
- Three-quarter rear wide, dinosaur half-turned showing back/spine with full world behind
- Three-quarter overhead, slight diagonal tilt, dinosaur full-body in lush context

OVER-THE-OBJECT FRAMING:
- Over-tree-branch wide framing, peeking voyeur-cam at dinosaur in clearing
- Through-mega-foliage hidden-cam wide shot, dinosaur visible past fronds
- Behind-vine-curtain wide angle, dinosaur in middle distance with foliage in foreground

DYNAMIC / TRACKING (still wide):
- Tracking wide shot moving alongside running dinosaur, terrain blurring past
- Pull-back wide as dinosaur strides forward, environment opening up around it
- Whip-pan wide freeze on a leaping dinosaur in mid-air over a canyon

DOCUMENTARY-INSPIRED:
- BBC long-lens telephoto wide, dinosaur sharp in environment with compressed depth
- Wildlife-doc wide tracking, smooth gimbal showing dinosaur and habitat together
- Hidden-cam wide low-angle, dinosaur full-body framed by undergrowth

REFLECTION / SILHOUETTE WIDE:
- Reflection-double wide shot — dinosaur and reflection both in frame with surroundings
- Rim-light wide silhouette against dawn or sunset sky, full body visible in environment
- Through-water wide lens, dinosaur partially submerged with world above visible
- Backlit wide silhouette through god-rays, dinosaur full-body in atmospheric depth

━━━ EVERY ENTRY MUST INCLUDE ━━━
- Framing keyword: "wide" / "extreme wide" / "establishing" / "ultra-wide" / "panoramic" / "vista" / "medium-wide"
- Implied or stated: dinosaur visible at FULL BODY (not torso-only or face-only)
- Implied or stated: environment is VISIBLE around the dinosaur
- An angle/direction (low / high / eye-level / overhead / three-quarter / over-X / tracking / etc.)

━━━ ABSOLUTE BANS ━━━
- NO "extreme close-up" / "macro" / "tight detail" / "fills the frame" / "tight close-up" / "headshot" / "portrait crop"
- NO body-part-only framings (eye / claw / horn / scale / feather barb)
- NO framings that hide the environment

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: framing distance + angle direction + cinematography style.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
