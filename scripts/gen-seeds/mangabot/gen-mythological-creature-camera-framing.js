#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mythological_creature_camera_framing.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA-FRAMING entries for a MangaBot mythological-creature keyframe. SCENE-LED — each entry names a framing that keeps the YOKAI as HERO at 40-70% of frame. NEVER tiny-creature-in-distance. NEVER back-of-character-looking-out. The CREATURE dominates the composition.

⚠️ CRITICAL ANTI-TINY-CREATURE GUARDRAIL: NEVER write framings that make the creature a small dot in a wide vista. NEVER write "back-to-camera character looking at distant dragon" (audit-flagged anti-pattern). The yokai is the SUBJECT. Every framing must position the camera so the creature READS LARGE.

⚠️ ALSO CRITICAL: NEVER hero-portrait framings of a HUMAN. The hero is the YOKAI. Human-witness if present is TINY scale-prover only.

Each entry: 12-22 words. Names the framing + creature-scale + composition style. Always creature-led.

FRAMING VARIETY (all hero-yokai dominant):
- 22% WIDE LOW-ANGLE HERO (camera near ground, creature towering into upper frame)
- 18% 3/4 HERO ANGLE (creature dominant, setting wrapping around)
- 14% MID-FLIGHT OVERHEAD (camera mid-air, creature mid-motion in upper-mid frame)
- 12% HIERATIC SYMMETRIC SHRINE REVEAL (creature centered in shrine-arch, symmetrical)
- 10% OVER-FOREGROUND-TORII REVEAL (foreground torii frames creature beyond, creature large)
- 8% LOW-BANK RIVER ANGLE (camera at river-edge, creature rising from water, creature dominates)
- 8% UP-A-STAIRCASE LOW-ANGLE (camera at base of shrine steps, creature looming at top)
- 8% MID-DISTANCE PROFILE (creature in 3/4 profile, full-body visible, mid-frame)

DO write (every entry keeps the creature LARGE in frame):
- A wide low-angle hero shot, camera near ground, the kitsune towering into the upper-frame against twilight sky
- A 3/4 hero angle, the dragon-god coiled across the frame with the shrine wrapping around
- A mid-flight overhead, the tengu beating wings across the upper-mid frame, mountain-valley below
- A hieratic symmetric shrine reveal, the oni centered between two torii pillars, perfectly mirrored
- An over-foreground-torii reveal, a vermilion pillar bracketing left, the looming kitsune visible beyond
- A low-bank river angle, camera at the water's edge, ryujin rising from waterfall mist hero-sized
- Up-a-staircase low-angle, weathered stone steps climbing toward the yokai looming at the upper frame
- A mid-distance 3/4 profile, the nine-tailed kitsune full-body across the mid-frame, fox-fire trailing
- A wide low-angle, the yuki-onna towering over a snow-field, the camera near a buried lantern
- A 3/4 hero angle, the tengu mid-wing-furl on a temple roof, the mountain shrine wrapping below
- An over-foreground-torii reveal, the dragon's coiled body visible past the vermilion lintel
- A mid-flight overhead, the bake-neko mid-leap across rooftops, lanterns falling away below
- A wide low-angle, the nure-onna coiled massive across the river-bed, the camera at the bank
- A 3/4 hero angle, the nekomata rearing on hind legs, paper-lanterns swaying in foreground
- A hieratic symmetric shrine reveal, the kitsune centered beneath a shimenawa rope arch
- Up-a-staircase low-angle, the oni looming at the shrine-top, kanabo club shouldered against sky
- A wide low-angle, the karakasa-obake hopping mid-frame, paper-umbrella body filling upper-third
- A 3/4 hero angle, the inugami in mid-stride across the snow-field, possessing-shadow trailing
- A mid-distance profile, the amabie standing at the shore three legs splayed, prophecy-mist drifting
- A low-bank river angle, the kappa kneeling mid-frame at the bank, dish-of-water in foreground
- An over-foreground-cypress-branch reveal, the dragon coiled massive across the mid-frame beyond
- A hieratic symmetric shrine reveal, the namahage centered in torii frame, knife raised
- A wide low-angle, the rokurokubi's elongated neck stretching across the upper frame, body small below
- A 3/4 hero angle, the tanuki mid-shape-shift centered, leaf still perched, fur-skin transition visible
- Up-a-staircase low-angle, the hyakume looming at the temple-step, glowing eyes clustered

DO NOT write:
- ANY tiny-creature / distant-creature / background-creature framing (creature MUST be 40-70% of frame)
- ANY hero-human / portrait / close-up of a HUMAN witness
- ANY "back-of-character looking out at distant creature" (audit-flagged failure)
- ANY "over-the-shoulder of human" framing
- Photoreal camera specs (f-stops / mm)
- Multiple shots per entry
- Cyberpunk megabuilding worm's-eye (different path)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
