#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_village_surprise_element.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} SURPRISE-ELEMENT entries for a MangaBot anime-village keyframe. SCENE-LED — each entry names ONE SUBTLE MOMENT that gives the frame a story-tick (the loaded instant that takes a static-postcard into a keyframe).

Each entry: 12-22 words. ONE specific subtle moment. NOT dramatic, NOT a hero action — just a quiet beat that pricks the frame alive.

GENRE SPLIT (this 25-entry pool):
- 60% PASTORAL-PERIOD subtle moments (Mushishi / Mononoke / Spice-and-Wolf register)
- 40% MODERN-JAPAN subtle moments (Showa / kissaten / Akihabara back-alley)

SURPRISE-ELEMENT VARIETY:
- Cat mid-leap from one tile-roof to the next (frozen mid-air silhouette)
- Lantern flicker (one paper lantern shading-and-brightening, candle gust)
- Petal-cluster releasing from a low branch (mid-fall blossom cascade)
- Wind chime swaying (glass-bell mid-shiver above a doorway)
- Kettle whistling steam from an outdoor cart (white-vapor plume)
- Shoji door cracking open (warm-light spill across cold cobble)
- Butterfly landing on a stone-lantern (cabbage-white at rest)
- Firefly-cloud emerging from a paddy at dusk (tiny green-yellow glints rising)
- Wagon-wheel rolling alone down a hill (no driver visible, just motion)
- Paper-charm fluttering loose from a shrine post (mid-air twirl)
- Vending machine kicking to life (Showa neon flicker-on)
- Crow taking off from a power-line (wings catching last-light)
- Pigeon flock startled from a torii crossbeam (sudden burst-of-wings)
- Steam puffing from an onsen vent (white-rolling cloud against twilight)
- A single sake-cup tipped over on a low table (spill mid-pool)
- Snowflake clusters drifting past a kissaten window (first-flakes of season)
- Lamplighter's match-flare catching at a lantern (small bright point in twilight)
- Goldfish startled into motion in a puddle-stall basin (red flash through water)
- A bicycle bell ringing as a rider rounds a corner (motion implied)
- Kite tugging hard against its string above the lane (sky-tension)
- Wisteria-petal cluster swinging loose in wind (low-hanging cascade-swing)
- Curtain-noren lifting at a doorway (warm-glow spill at lift)
- Steam-cloud rolling from a manhole at night (Showa modern alley vapor)
- A frog leaping from a stone-basin's edge (mid-jump arc)
- Stone shrine-bell tipping in wind (silent mid-sway)

DO write:
- A cat caught mid-leap from one kawara tile to the next, silhouetted against amber dusk
- A single paper lantern flickering, candle-gust shading and brightening the warm halo
- A petal-cluster releasing from a low branch, mid-fall cascade caught in the slanting light
- A wind-chime mid-shiver above a doorway, glass-bell catching the breeze's first edge
- A kettle whistling thick steam from an outdoor yatai, white-vapor plume against twilight
- A shoji door cracking open at the lane's far end, warm-light spilling across cold cobble
- A vending machine flickering to life in a Showa alley, neon kanji glow-pulsing on

DO NOT write:
- Combat / dramatic / heroic moments
- Hero-portrait moments centered on a character's face
- Magical / fantasy explosions
- Modern megacity SFX
- Generic "movement" — name a SPECIFIC subtle moment

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
