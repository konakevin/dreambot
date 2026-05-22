#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/neo_tokyo_scene_type.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} SCENE-TYPE entries for a MangaBot neo-tokyo cyberpunk anime keyframe. Each entry is the COMPOSITION LEAD. Akira / Ghost-in-the-Shell / Blade-Runner-Tokyo / Edgerunners / Bubblegum Crisis register.

CRITICAL VARIETY MANDATE: do NOT default to "solo figure standing centered in wet alley looking at a distant tower." That's ONE composition out of many. Spread entries across very different compositions.

Each entry: 14-28 words. ONE composition concept — just the framing, NOT a full scene.

Distribution target (NO single mode above 15%):
- 15% INTERIOR / CAFE / BAR / RAMEN-COUNTER (figure inside a lit space looking out, signage visible through windows)
- 14% HIGH-ANGLE DRONE-VIEW (camera above, looking down on figure + street, city stretches sideways not vertical)
- 12% PROFILE / SIDE-ON (figure in profile across the frame, NOT facing forward, motion implied)
- 11% VEHICLE / MOTORCYCLE POV (figure on bike or hovercar, mid-action, environment streaks past)
- 10% CLOSE-UP / FACE-FILLS-FRAME (intimate detail of character with signage blur behind)
- 9% ROOFTOP HORIZONTAL VISTA (figure at rooftop edge, city sprawls SIDEWAYS not vertical)
- 8% THROUGH-FOREGROUND (looking through chain-link / rain-streaks / shoji-glass / drone-window)
- 7% CROWD-IN-CONTEXT (figure inside a moving crowd, not solitary, crowd silhouettes around)
- 6% ASYMMETRIC OFF-CENTER (figure pushed to one side, signage / landmark dominates other side)
- 4% WET-ALLEY WALKING (the iconic shot — used sparingly so it's earned)
- 4% OVER-SHOULDER POV (camera behind figure looking past at scene)

DO write (varied widely — these are different shots):
- Ramen-counter interior shot, figure caught at the bar with steam billowing, the wet neon street visible through the noren curtain
- High-angle drone-view straight down on a figure crossing an intersection, hovercar light-trails arcing across the frame
- Profile side-on composition of a figure on a hovering motorcycle mid-acceleration, environment streaking past in light-trail blur
- Extreme close-up face fills the frame, neon reflections in cyber-eye, signage blurred to bokeh behind
- Rooftop horizontal vista, figure at frame edge, city sprawls SIDEWAYS into distance with hovercar highway cutting across
- Through-rain-streaks composition, looking at the figure through a wet glass pane with raindrops in foreground focus
- Crowd-shot composition, figure mid-frame surrounded by silhouette-crowd at Shibuya-scramble intersection
- Asymmetric off-center composition, figure pushed to bottom-left, holographic ad-tower dominates upper-right
- From-motorcycle handlebars POV looking ahead at neon-tunnel street, gauges glowing in lower frame
- Wet-alley walking composition (USED SPARINGLY), figure mid-frame, signage stacked, tower in distance

DO NOT write:
- Multiple entries with "figure walking down wet alley toward distant tower" — that's ONE entry max
- Vertical-pano upward (separate axis — camera_framing — don't double-up here)
- Specific signage / tech / weather details (separate axes)
- Historical Japan elements
- Pastoral / nature without cyberpunk-coding

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
