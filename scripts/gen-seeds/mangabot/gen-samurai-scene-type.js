#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/samurai_scene_type.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} SCENE-TYPE entries for a MangaBot samurai-era keyframe. Each entry is the COMPOSITION LEAD — what kind of frame this is, what the camera is showing, how the character(s) are placed in the world.

Each entry: 14-28 words. ONE specific composition concept. NOT a full scene description — just the composition skeleton.

Distribution (target):
- 30% WIDE-VISTA shots — character(s) tiny against a massive landscape, multi-tier depth obvious
- 25% MID-ACTION shots — character(s) at 25-45% of frame, mid-step / mid-draw, with full setting visible behind
- 20% PILGRIMAGE/JOURNEY shots — character walking through landscape toward a distant anchor
- 15% CLOSE-ENCOUNTER shots — two figures squared off / sensei-and-apprentice meeting / wandering monk and villager
- 10% OVER-SHOULDER / POV shots — looking past a figure toward what they're seeing

DO write (vary across the distribution):
- Wide cinematic vista, lone ronin walking a cliffside path toward a distant pagoda silhouette, mountains beyond
- Mid-action keyframe, two duelists squared off in a bamboo grove, katanas drawn, the great gate looming behind
- Over-shoulder shot from a wandering monk's perspective looking down a temple stair toward a distant valley
- Pilgrimage frame, hooded stranger crosses a high stone bridge above mist, castle silhouette deep in distance
- Low-angle hero shot, sensei stands at a torii arch, apprentice kneeling at the base, mountains framing them
- Close-encounter mid-shot, ronin and clan retainer meet on a wooden bridge, fallen leaves swirling between them
- Wide poster composition, three samurai silhouettes ride along a coastal cliff under a colossal storm sky

DO NOT write:
- A full baked scene with all atmosphere + lighting + emotion specified (those are SEPARATE axes — keep this just the composition)
- Specific time-of-day language (separate axis)
- Specific lighting language (separate axis)
- Named historical figures
- Modern setting / contemporary clothing
- Photoreal camera language

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
