#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/neo_tokyo_background_detail.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} BACKGROUND-DETAIL entries for a MangaBot neo-tokyo cyberpunk anime keyframe. Each entry is a DEEP-DISTANCE SECONDARY DETAIL — far back in the frame, proves the city stretches beyond, gives a third readable narrative layer.

Each entry: 10-20 words. ONE specific deep-distance detail.

CYBERPUNK-CODED VARIETY:
- Hovering drone in distance (small dot, single status-light, far overhead)
- Distant ad-blimp (dirigible with screen-side ad, mid-distance sky)
- Second character in distant window (silhouette in lit-up window across the street)
- Hovercar arc through far buildings (light-trail curving between megabuildings)
- Distant rooftop figure (small lone silhouette on a far rooftop, contemplating)
- Megabuilding silhouette at horizon (the city stretches endlessly, mega-tower far back)
- Distant explosion-glow (fire / spark / Akira-energy flash deep in mid-distance)
- Faint maglev train passing (light-streak from a far elevated rail)
- Cyber-bird flock far above (a flock of mech-birds or drones in formation)
- Distant figure on suspended walkway (small silhouette crossing a sky-bridge far away)
- Far-distance neon signage (a deep-back signage cluster, just hint of color)
- Ad-blimp searchlight scanning (a beam from a far blimp sweeping the city)
- Distant police-drone formation (cluster of military drones in deep distance)
- Far-back hostess-club facade (distant pink-saturated facade across the river / road)
- Tokyo Bay-style distant water (faint waterline at deep horizon, reflective)

DO write:
- A hovering surveillance drone in deep distance, single red status-light blinking, far above the alley
- A massive ad-blimp drifts at mid-distance height, side-screen scrolling kanji-ad across its underbelly
- A second figure visible in a lit window across the street, silhouette frozen mid-gesture
- A hovercar's light-trail arcs through the gap between two distant megabuildings, slow streak
- A lone figure stands on a distant rooftop edge, silhouette small against the saturated city glow behind
- A distant explosion-flash deep in the mid-distance, Akira-yellow burst behind the silhouette of buildings
- A faint maglev train passes on a far elevated rail, light-streak cutting across the deep horizon
- A flock of cyber-birds wheel in formation high above, small black shapes against the neon haze

DO NOT write:
- The main character in scene (separate axis — character_role)
- Foreground props (separate axis — story_prop)
- Landmark anchors (separate axis — must be SMALLER and FARTHER)
- Modern unbranded city details
- Pastoral nature (no wildlife — only cyber-coded animals)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
