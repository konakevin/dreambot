#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/post_apocalyptic_scenes.json',
  total: 200,
  batch: 25,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} POST-APOCALYPTIC scene descriptions for MangaBot's post-apocalyptic path. Each entry is 30-50 words. Setting-only.

CONTEXT: Anime post-apocalyptic — Trigun / Made-in-Abyss / Girls'-Last-Tour / Shinsekai-Yori / 7-Seeds / Yokohama-Kaidashi-Kikou / Studio-Khara aesthetic. Overgrown civilization, abandoned trains, broken highways, lone-wanderer-quiet. Beauty in decay. NOT horror. Quiet. Wistful. Reclaimed-by-nature.

Categories — rotate widely:
- Overgrown abandoned Tokyo (skyscrapers wrapped in vines, traffic-light vines, empty crosswalks)
- Abandoned train at a forest crossing (rusted train cars overgrown with green, tracks barely visible)
- Highway overpass with ivy reclaiming concrete (cracked highway, vines climbing the columns)
- Sunken cityscape (half-submerged tall buildings in still water, water lapping at the third floor)
- Abandoned shopping arcade (faded shop-signs, neon dead, vines through the ceiling, sunlight breaking through)
- Old subway tunnel half-flooded (rusted train, knee-deep water, glow from a broken ceiling above)
- Lone wanderer's path through ruined suburb (faded street, abandoned bicycles, overgrown gardens)
- Cracked highway with abandoned cars (rusted vehicles, vines, mountains beyond)
- Ruined gas station (vines wrapped around pumps, faded signage, single warm glow inside)
- Abandoned amusement park (overgrown ferris wheel half-collapsed, carousel covered in moss)
- Half-collapsed shrine in overgrown forest (centuries-untouched, moss-covered torii)
- Broken-window apartment block (sunlight through shattered windows, plants growing inside rooms)
- Abandoned school playground (rusted swing-set with vines, broken windows, faded murals)
- Old library wreckage (book-piles half-decayed, sunlight through ceiling-hole, ivy on shelves)
- Ruined factory at sunset (silhouetted broken-tower, golden light, drifting dust)

EVERY entry must include:
- Specific post-apocalyptic setting
- 4-6 environmental details (vines / moss / rust / cracked concrete / faded signage / broken glass / overgrown gardens / abandoned vehicles / weathered murals / kanji signs faded / chain-link fence collapsed / rebar showing through concrete)
- 1-2 atmospheric effects (drifting dust, sunbeams through broken ceiling, mist between ruins, drifting petals, drifting smoke from somewhere distant)
- Lighting tone (golden-hour through broken windows / blue-hour-melancholic / moonlit-quiet / soft-overcast / dappled-light-through-vines)
- Quiet wistful presence (the world has been gone a long time; nature is winning; beauty in absence)

ABSOLUTELY BANNED:
- NO horror / no zombies / no body-horror
- NO active war / weapons / explosions (this is AFTER, peaceful)
- NO crowds (lone wanderer or empty)
- NO Western post-apocalyptic (Mad-Max-coded) — this is anime-quiet-melancholic Japan-coded
- NO gore

Examples (write fresh):
- "Overgrown Tokyo intersection with traffic lights tilted and wrapped in vines, cracked asphalt sprouting wildflowers, faded crosswalk paint barely visible, abandoned bicycle rusted to the spot, vine-wrapped streetlamp, drifting dust in golden-hour light, distant skyscrapers green with reclaimed forest, soft melancholic stillness"
- "Abandoned train station with rusted train half-pulled into the platform, empty platform overgrown with tall grass between the rails, faded kanji signage, vending machine collapsed sideways and rusted, hanging power-cables drooping, drifting dust in shafts of sunlight through holes in the roof, blue-hour quiet"
- "Half-collapsed amusement park with the ferris wheel tilted at thirty degrees, vines climbing the support beams, carousel horses half-buried in moss and undergrowth, faded paint, broken light bulbs strung between posts, soft sunset-amber haze, drifting dandelion seeds, distant overgrown skyline"

Output ONLY a valid JSON array of ${n} strings (30-50 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
