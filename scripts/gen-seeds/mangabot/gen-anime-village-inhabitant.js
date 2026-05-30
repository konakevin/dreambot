#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_village_inhabitant.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} INHABITANT entries for a MangaBot anime-village keyframe. SCENE-LED — each entry names a TINY HUMAN-SCALE FIGURE who appears at 5-15% of frame to ground the scale of the village. THIS IS NOT A HERO PORTRAIT. The figure must be SMALL, MID-DISTANCE, and visibly engaged in a humble task that anchors but never dominates.

⚠️ CRITICAL ANTI-HERO-PORTRAIT GUARDRAIL: Every entry MUST contain explicit scale language — "tiny", "small", "distant", "mid-distance", "background figure", "small in frame", "5-10% of frame", "barely visible". Every entry must IMPLY the figure occupies a fraction of the frame, never centered or close-up.

Each entry: 12-22 words. Specifies role + tiny-scale + engaged-task. NEVER face-detail / NEVER expression / NEVER close-up.

INHABITANT VARIETY (humble villagers, NOT heroes):
- Robed grandmother sweeping a stone-step (tiny, mid-distance)
- Vendor pouring tea at a yatai (small in frame, background)
- Monk crossing a bridge (distant silhouette, back-three-quarter)
- Child chasing a dragonfly (tiny figure, mid-lane)
- Shopkeeper unrolling a noren-curtain (small, in doorway)
- Bicycle rider passing through the lane (mid-distance, motion-blur ok)
- Shrine maiden lighting a stone lantern (tiny, kneeling at side)
- Artist with sketchbook on a low stool (small, at corner of lane)
- Fishmonger packing ice over baskets (mid-distance, hunched at cart)
- Postman ringing a bell at a doorway (tiny figure, far end of lane)
- Two children running with a kite (tiny pair, far down street)
- Elderly farmer leading a brown ox (distant, between buildings)
- Lantern lighter on a stepladder reaching up (mid-distance silhouette)
- Tea-vendor stirring a copper kettle (small, at midground cart)
- Hooded traveler walking with a wooden staff (tiny, passing through frame)
- Woman beating a futon over a balcony rail (small, on upper storey)
- Carpenter planing a cypress beam outside his shop (mid-distance)
- Salaryman at a Showa-era vending machine (small, mid-lane)
- Two old men playing shogi on a bench (tiny pair, sidewalk corner)
- Child crouched feeding a stray cat (small, doorway crouch)
- Shrine attendant raking gravel (tiny figure, in courtyard)
- Old woman placing fruit at a jizo statue (small, at lane edge)
- Newspaper-deliverer on a Showa bicycle (mid-distance, motion through alley)
- Three school-children walking in line (tiny trio, vanishing toward bend)
- Woman in yukata stepping out a kissaten door (small, mid-distance)

DO write (note the scale language in EVERY entry):
- A tiny robed grandmother sweeping a stone-step in the mid-distance, broom-strokes catching late light
- A small vendor pouring tea at a yatai in the background, steam curling above his cart
- A distant monk crossing the cypress bridge in three-quarter back-view, robes catching wind
- A child chasing a dragonfly in the mid-distance, small in frame against the paddy-edge lane
- A small shopkeeper unrolling a noren-curtain at his doorway, mid-distance silhouette
- A tiny pair of children running with a paper kite, distant figures at the far end of the lane
- A small lantern-lighter on a stepladder mid-distance, reaching up to a paper shade

DO NOT write:
- ANY close-up / hero / portrait / face-detail / expression
- ANY centered or large figure (must be tiny + mid-distance + scale word)
- "A young woman walks toward the camera, her face..." — that's hero portrait
- Outfit detail beyond a single tag (no costume catalog)
- Combat / heroic / dramatic action
- Modern Tokyo office-worker / suit-and-tie (Showa kissaten salaryman ok if tiny)
- Multiple-figure crowds (max pair / trio, all tiny)
- Western dress

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
