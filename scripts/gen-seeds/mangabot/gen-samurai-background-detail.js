#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/samurai_background_detail.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} BACKGROUND DETAIL entries for a MangaBot samurai-era keyframe. Each entry is a DEEP-DISTANCE SECONDARY DETAIL — a silhouette, secondary figure, distant flock, or environmental feature that sits FAR back in the frame and gives the scene a third readable narrative layer (foreground prop + midground character + this).

Each entry: 10-20 words. ONE specific deep-distance detail with implied story.

CATEGORY VARIETY across the 50:
- DISTANT FIGURE SILHOUETTES (retreating army, lone watcher, sweeping monk, mounted rider on horizon)
- ANIMAL/BIRD IN DISTANCE (crows circling, deer at treeline, koi-pond in distance)
- DISTANT SMOKE / FIRE (a far burning village, distant signal-fire, smoking ridge)
- DISTANT BUILDING SILHOUETTE (small temple far off, distant castle keep, hilltop pagoda half-hidden)
- DISTANT WEATHER (storm rolling in over far ridges, distant snow-curtain, lightning over a far peak)
- DISTANT BANNER / FLAG (clan pennant on a far hill, prayer-flags strung across a distant valley)
- DISTANT BOAT (fishing boats on a far bay, ferry on a misty lake)

DO write:
- A row of retreating mounted-samurai silhouettes fading into mist along a far ridge
- A lone watcher figure half-hidden at the frame's edge, hooded and still
- Ravens circling slowly above a distant treeline, three black specks against the sky
- A small temple-monk sweeping at the limit of vision, broom raised against gravel
- Distant signal-fire smoke rising from a far hilltop, dark column against pale sky
- A small fishing-boat with a single lantern lit, drifting on a far bay in mist
- Clan-pennant silhouettes whipping atop a distant hill, color drained by atmospheric haze
- A distant mounted rider crossing a far ridge, horse and figure both reduced to a brushstroke
- Prayer-flags strung across a distant valley, faint flutter of color in deep mist
- A small village in the deep distance, paper-lanterns lit, smoke from cooking-fires drifting up
- A flock of cranes lifting from a distant rice-paddy, white wings against the haze
- Distant storm-cloud bank rolling in over the far peaks, sheet-rain visible far away
- A herd of distant deer just visible at the edge of a far meadow, antlers catching dawn light
- Small temple pagoda half-hidden in deep fog at the limit of vision

DO NOT write:
- The figure in the main scene (that's the character_role axis — keep this DEEP DISTANCE)
- Architectural anchors (those are separate axis — these are SMALLER and FARTHER)
- Foreground props (those are story_prop axis)
- Modern objects (cars, electronics, aircraft, paved infrastructure)
- Multiple details per entry — ONE focal secondary
- Gore / bodies

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
