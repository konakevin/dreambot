#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_scene_type.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} SCENE-TYPE entries for a MangaBot ghibli-countryside keyframe. Studio Ghibli pastoral wonder — Totoro / Kiki / Mononoke / Whisper of the Heart. Each entry is the COMPOSITION LEAD.

CRITICAL VARIETY MANDATE: do NOT default to "wandering girl on hilltop with windswept tree." That's ONE composition. Mix many pastoral compositions.

Each entry: 14-28 words. ONE composition concept.

Distribution (no single mode above 14%):
- 14% HILLSIDE-VISTA WIDE (figure on rolling hill, sweeping landscape behind — used sparingly)
- 13% COTTAGE-DOORSTEP / ENGAWA (figure on cottage porch, doorway, interior visible)
- 12% THROUGH-GRASS FOREGROUND (looking through tall wildflowers in foreground at figure beyond)
- 11% BRIDGE-CROSSING (figure on small wooden bridge over stream)
- 10% INTERIOR-COTTAGE (figure inside a Ghibli kitchen / bedroom, window to countryside)
- 9% FOREST-EDGE PATH (figure at the boundary of forest and field, dappled light)
- 8% WELL-OR-FOUNTAIN (figure tending water-source, pump or stone well)
- 7% RICE-PADDY TERRACE (figure on a stepped paddy, mirror reflection in flooded field)
- 6% CYCLING DOWN PATH (figure on bicycle, rural dirt path)
- 6% MARKET-STALL VILLAGE (figure at outdoor village market, produce visible)
- 4% MID-SHOT ENVIRONMENTAL (figure at frame edge, landscape dominates)

DO write:
- Cottage-doorstep composition, figure on the engawa porch, interior tatami visible through open shoji, garden in foreground
- Through-tall-grass foreground, wildflowers blur in close focus, figure walking through in mid-distance
- Bridge-crossing composition, figure on small wooden bridge over reedy stream, ferns in foreground
- Interior cottage shot, figure inside Ghibli-style kitchen, window framing countryside view
- Forest-edge path composition, figure at the boundary of dappled forest and bright field
- Well-tending composition, figure drawing water from stone well, garden surrounding
- Hillside-vista wide (USED SPARINGLY), figure walking up rolling green hill, single windswept tree visible
- Rice-paddy terrace composition, figure on stepped emerald paddy, water mirror reflecting sky
- Cycling-down-path composition, figure on bicycle, rural dirt road through countryside
- Village-market composition, figure at outdoor stall, baskets of vegetables stacked in foreground

DO NOT write:
- Multiple "hilltop-vista with windswept tree" entries — ONE max
- Urban / cyberpunk / cityscape compositions
- Dramatic-cinematic-anime hero shots
- Photoreal framing
- Specific axes content (separate axes for character / weather / light / etc.)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
