#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/humanoid_robots_composition.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} CINEMATIC CAMERA-COMPOSITION descriptions for MechBot's humanoid-robots path. Each describes a specific camera-angle for a SOLO polished humanoid robot (1.5-2.5m human-scale, multi-iris compound-optic head, multi-color joint-seam + chest-core glow, polished chrome / titanium chassis). FULL-BODY 50-75%-frame mandatory — feet to top-of-head must be visible (NEVER closeup / bust / detail / waist-up).

Each entry: 28-46 words. Format: "ANGLE-NAME-IN-CAPS — full multi-clause camera-angle description naming the camera position, full-body framing emphasis, environmental anchor, depth layers, what makes the angle cinematic." Comma-separated phrases.

━━━ THE BAR ━━━
Every entry must read like a MOVIE-POSTER PROMOTIONAL FRAME for a sci-fi reveal — robot dominant 50-75% vertical frame, full-body legible from boots to multi-iris helm, atmospheric environment with multi-tier depth. NEVER closeup / portrait / bust / detail-only. Every entry must reinforce "see the WHOLE ROBOT."

━━━ VARIETY MANDATE (~18 angle families across the batch) ━━━

- HERO-SHOT LOW-3/4 ANGLE (below knee-level looking up, full body extending into upper frame, shoulders dominant)
- WORM'S-EYE LOW LOOKING UP (camera flush against ground straight up, full body vertical, sky/canopy above)
- CINEMATIC FULL-BODY EYE-LEVEL (chest-height looking straight on, robot centered feet-to-helm)
- WIDE ESTABLISHING-SHOT (vast vista, robot at midground 30% frame height, depth layers receding)
- THREE-QUARTER MID-DISTANCE (35% vertical frame, vista receding to deep distance behind)
- GOD'S-EYE ANGLED-DOWN (camera above and ahead, 45-degree look-down, head/torso foreground, legs midground)
- SILHOUETTE BACKLIT WIDE (robot silhouetted against backlight source, full silhouette readable)
- WALKING-AWAY FROM CAMERA (mid-stride away into corridor / vista, full body from rear, destination glowing)
- SIDE-PROFILE MID-STRIDE (90-degrees to robot at chest-height, lateral motion, motion-blur background)
- DEEP-PERSPECTIVE FRAMING (long stairwell / corridor / hangar tunnel, vanishing-point lines rushing toward robot)
- WINDOW-FRAME WIDE (robot through doorway / hangar opening, framed in rectangular opening, interior glow behind)
- REFLECTION-SURFACE FULL-BODY (polished wall / mirror lake / wet plaza, robot doubled in reflection)
- MID-ACTION FREEZE-FRAME (mid-leap / mid-step / mid-pose freeze, full body airborne or in motion)
- LONE-FIGURE WIDE-LANDSCAPE (robot tiny 15% frame, vast open vista, scale dwarf-anchor)
- DOORWAY-EMERGENCE (robot mid-step through massive blast-door / portal, silhouetted in glowing opening)
- HERO-POSE BACKLIT EXPLOSION (wide-stance hero-pose against atmospheric backdrop, rim-light edges)
- OVERHEAD-DRONE ANGLE (drone POV 65-degree downward, full body visible from above-3/4, plaza spreading)
- THREE-QUARTER WITH DEEP ENVIRONMENT (3/4 angle, foreground texture / midground robot / deep distance vista)
- BETWEEN-MACHINERY WIDE (camera between large structures framing shot, robot centered in gap)
- BACKLIT FOGGY WIDE (fog-filled scene, robot silhouette glowing rim-light from feet to helm)
- ASYMMETRIC RULE-OF-THIRDS (robot at 1/3 line, environmental anchor at opposite 1/3, atmospheric balance)
- TRACKING-LATERAL FOLLOW (camera tracking sideways with robot, environment streaking past, robot stable)
- CRANE-DROP-WIDE (high-altitude crane descending toward robot, framing tightens as descends)
- LOW-ANGLE WATER-EDGE (camera at puddle / shore reflecting robot, full body + reflection doubled)
- THROUGH-FOREGROUND-FOLIAGE (camera behind moss / vines / crystal-shards, robot framed beyond)
- OVER-SHOULDER ENVIRONMENT (POV from environment subject's shoulder — observer / engineer / scout)
- BIRD'S-EYE TOP-DOWN (camera directly above, robot from straight overhead, surrounding terrain spreading radial)
- DOORWAY-DEPTH NESTED (multiple receding doorway frames, robot in deepest frame, layered geometry)

━━━ MUST INCLUDE per entry (CHECKLIST — all 4) ━━━
1. CAMERA POSITION explicitly named (worm's-eye / drone / over-shoulder / hero-low-3/4 / side-profile / etc.)
2. FULL-BODY FRAMING confirmed (feet-to-helm visible / 50-75% vertical / from boots to optic-array)
3. ENVIRONMENT or ATMOSPHERE anchor (waterfall mist / canyon wall / ruin / crystal cavern / hangar / corridor / plaza)
4. DEPTH or BACKGROUND TEXTURE (vanishing point / deep distance haze / foreground texture / silhouette source)

━━━ BANS ━━━

- NO closeup / portrait / bust / waist-up / detail framing — FULL BODY mandatory
- NO cyborg-flesh / human-face anatomy language (robot is FULLY MECHANICAL)
- NO scrap-weld / rust-tech wasteland DNA (robot is POLISHED + DESIGNED)
- NO active military combat (this is the humanoid-robots flagship path, not power-armor / titan-war)
- NO Star Wars / Halo / Mandalorian / Spartan IP
- NO Pacific Rim / kaiju scale (this is human-scale, NOT titan)
- NO mecha-pilot context (pilot dwarfed by mech is mecha-pilots territory)
- NO scrap / weld / rust language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering. One full composition description per string. Each starts with the angle-name in CAPS, em-dash, then the body. Comma-separated phrases.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
