#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/noir_scenes.json',
  total: 25,
  batch: 25,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} ANIME NOIR scene descriptions for MangaBot's noir path. Each entry is 30-50 words. Setting-only.

CONTEXT: Anime noir / detective / rain-and-jazz aesthetic. Cowboy-Bebop / Black-Lagoon / Lupin-III / Monster (Naoki Urasawa) / Detective-Conan-coded visual vocabulary. Rainy nights, jazz bars, smoky alleyways, vintage suits, lonely diners, neon reflections, vintage cars. Moody, sophisticated, melancholic.

Categories — rotate widely:
- Rainy back alley with single hanging lamp (wet pavement reflections, fire-escapes)
- Jazz bar interior (smoky room, single saxophone player on small stage, candlelit tables)
- Vintage diner at 3 AM (chrome counter, single occupant booth, neon sign outside)
- Detective's office at night (dim lamp, file folders, ashtray, rain on window)
- Underground parking garage (concrete columns, single car, fluorescent flicker)
- Rooftop with vintage sedan parked (city skyline at night, rain misting)
- Train-car interior late at night (empty carriage, single passenger reflected in window)
- Pier at midnight in fog (wooden boards, distant ship's bell, lone lamppost)
- Hotel lobby at 3 AM (vintage chandelier, empty desk, polished floor)
- Smoky pool hall (green-lit tables, hanging lights, wood-paneled walls)
- Apartment window at night with rain (curtains parted, city below)
- Neo-Tokyo street under heavy rain (neon reflections in puddles, vintage cars)
- Phone booth at midnight (single phone booth lit, rain on glass)
- Jazz-club back-stairwell (concrete, single bare bulb, peeling posters)
- Speakeasy entrance (alley door with peephole, single candlelantern hanging)
- Bridge over a city river at night (vintage iron bridge, fog rolling, distant signs)

EVERY entry must include:
- Specific noir setting
- 4-6 environmental details (vintage signage / neon glow / wet pavement / hanging-bare-bulb / chrome diner-counter / vintage-car / saxophone / cigarette-smoke / glass-tumblers-on-bar / vinyl-record-sleeves / pool-table-felt / rotary-phone / typewriter / leather-booth)
- 1-2 atmospheric effects (rain — almost mandatory / cigarette smoke drifting / fog rolling / steam from a manhole / drifting smoke from a cigarette / dust motes in single beam of light)
- Lighting tone (single-warm-tungsten-against-blue-night / neon-pink-reflected-on-wet-pavement / candle-amber-against-dark / sodium-streetlamp-yellow / blue-rim-light-from-window-with-warm-interior)
- Moody / melancholic / sophisticated mood implied

ABSOLUTELY BANNED:
- NO photoreal photography
- NO violence / weapons-drawn (this is BEFORE / AFTER, never mid-act)
- NO blood
- NO bright cheerful lighting (noir is moody-dark)
- NO Western-modern-corporate office (vintage / 80s-noir aesthetic only)

Examples (write fresh):
- "Rainy Tokyo back alley at midnight, brick walls slick with rain, single tungsten-yellow hanging bulb above a metal door, neon ramen-shop sign reflected in puddles, fire-escape ladder dripping, scattered cardboard boxes, drifting cigarette smoke from somewhere off-frame, distant vintage cars on a wet street beyond, melancholic warm-on-cool palette"
- "Jazz bar interior at midnight with single saxophone player silhouetted on a small stage, candle-lit booths in the foreground with empty whiskey tumblers, vinyl-record sleeves stacked behind the bar, hanging Edison-bulb lights, smoke drifting through the warm-amber light, vintage radio glowing softly, deep red-leather booths receding into shadow"
- "3-AM diner with chrome counter and red-leather stools, single occupant in a corner booth (silhouette only, untouched coffee on the table), pink-and-blue neon Open sign reflecting on the wet street through the window, rain streaming down the glass, jukebox glowing in the corner, stainless-steel napkin-holders, vintage wall-clock"

Output ONLY a valid JSON array of ${n} strings (30-50 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
