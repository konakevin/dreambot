#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/epic_moments.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} EPIC DRAGON MOMENT scene descriptions for DragonBot — jaw-dropping cinematic narrative beats where DRAGONS are central to the action. Every scene MUST feature at least one traditional winged high-fantasy dragon. 20-35 words each.

━━━ THE UNIVERSE ━━━
Gritty, grounded, medieval European high-fantasy. LOTR's Middle-earth, GoT's Westeros, Skyrim's Tamriel. Weathered stone fortresses, ancient forests, volcanic wastelands, vast mountain ranges, crumbling empires, storm-battered coastlines, snow-capped peaks. The world feels LIVED IN, ANCIENT, and REAL. Dragons are PART of this world — apex predators, living gods, weapons of war, ancient beings older than kingdoms.

━━━ WHAT THESE ARE ━━━
The most epic 3 seconds involving a dragon — frozen at peak intensity. The dragon is NOT just sitting there. It is DOING something that changes the course of history. Wide cinematic scale, overwhelming beauty, spine-tingling drama.

━━━ DRAGON MOMENTS (spread EVENLY — max 1 per category) ━━━
1. Dragon attacking a fortress — fire pouring over castle walls, towers crumbling
2. Dragon vs army — entire battlefield scattered by one beast
3. Dragon landing on a mountain peak — wings folding, silhouetted against storm
4. Dragon emerging from volcanic lair — eruption and beast as one
5. Dragon defending its nest/hoard — surrounded by challengers
6. Multiple dragons in flight — a flight of dragons crossing a landscape
7. Dragon and rider in battle — mounted warrior charging through enemy lines
8. Dragon breathing fire across a naval fleet — ships burning on the sea
9. Dragon sleeping on treasure hoard — ancient beast in its lair
10. Dragon fighting another dragon — aerial combat over a landscape
11. Dragon circling above a coronation/ceremony — blessing or threatening
12. Dragon frozen in ice/stone — ancient beast being discovered/awakened
13. Baby dragons hatching — new life in a dangerous world
14. Dragon perched on cathedral/castle — claiming territory, overlooking a city
15. Dragon diving from clouds toward the ground — attack dive, wings tucked
16. Dragon illuminated by lightning — storm flight, electric silhouette
17. Dragon and army marching together — allied beast alongside warriors
18. Dragon coiled around a tower — possessive, territorial, enormous
19. Wounded dragon — crash-landed, arrows protruding, still dangerous, defiant
20. Dragon at sunset/sunrise — majestic silhouette against spectacular sky
21. Dragon in a blizzard — frost dragon in winter storm, ice and scale
22. Dragon underwater/surfacing — sea dragon erupting from ocean depths
23. Ancient dragon skeleton — bones of a titan, landscape-scale remains
24. Dragon and wizard — sorcerer confronting or communing with a dragon
25. Dragon migration — dozens of dragons crossing the sky over a landscape

━━━ DRAGON RULES ━━━
- Traditional WINGED high-fantasy dragons ONLY — four legs, two wings, scales, fire/ice/lightning breath
- NO serpentine, NO snake-like, NO wingless, NO wyverns
- Dragons should feel MASSIVE — castle-sized, mountain-dwarfing, ancient
- Each dragon should be a different color/type (no two red dragons, etc.)

━━━ DEDUP ━━━
EXACTLY ONE entry per category. No two entries should share the same dragon action or dominant visual.

━━━ RULES ━━━
- Each entry is a COMPLETE scene — dragon + setting + dramatic beat
- WIDE CINEMATIC SCALE — Peter Jackson establishing shots
- The landscape is as epic as the dragon
- No named IP characters

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
