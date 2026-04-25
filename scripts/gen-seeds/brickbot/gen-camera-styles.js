#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/camera_styles.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CAMERA STYLE descriptions for LEGO toy photography. Each describes a specific camera technique, lens choice, and composition approach — NOT lighting (that's separate).

Each entry: 15-25 words. One specific camera/composition style.

━━━ CAMERA STYLES (mix broadly across ALL of these) ━━━
- Macro close-up: extreme detail, everything sharp, filling frame with brick texture
- Tilt-shift miniature: selective focus band, everything else soft, selling the toy scale
- Wide establishing shot: entire diorama visible, deep focus, everything sharp
- Aerial/bird's eye: looking straight down on the build, map-like perspective
- Eye-level with minifig: camera at minifig height, ground-level dramatic perspective
- Low angle hero shot: camera below, looking up at builds, making them feel monumental
- Dutch angle: tilted frame, dynamic tension, action energy
- Over-the-shoulder: behind a minifig looking into the scene
- Panoramic wide: ultra-wide aspect ratio feel, sweeping vista of large build
- Documentary style: neutral framing, clean, catalog-like, everything in focus
- Forced perspective: using depth to make near objects huge and far objects tiny
- Split focus: foreground detail sharp, background detail sharp, middle soft
- Tracking shot feel: slight motion blur on edges, frozen center of action
- Product photography: white/grey backdrop, clinical detail, zero distractions

━━━ RULES ━━━
- Describe camera technique and lens behavior, NOT lighting
- Each must create a distinctly different visual feel
- Mix dramatic and neutral approaches
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
