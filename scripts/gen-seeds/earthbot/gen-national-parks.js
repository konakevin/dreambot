#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/national_parks.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} US NATIONAL PARKS landscape descriptions for EarthBot — real park geography amplified to impossible beauty.

Each entry: 15-25 words. One specific scene at a named US national park or monument. No people.

━━━ PARKS TO COVER (spread evenly, every park gets multiple entries) ━━━
- Zion (Angels Landing knife-edge, The Narrows slot canyon, Kolob Canyons, Checkerboard Mesa)
- Yosemite (Half Dome, El Capitan, Bridalveil Falls, Tunnel View, Mariposa Grove, Mirror Lake)
- Yellowstone (Grand Prismatic, Old Faithful, Mammoth Hot Springs, Grand Canyon of Yellowstone, Lamar Valley)
- Moab / Arches / Canyonlands (Delicate Arch, Mesa Arch sunrise, Island in the Sky, Dead Horse Point, Needles)
- Bryce Canyon (hoodoo amphitheater, Thor's Hammer, Queens Garden, Sunset Point)
- Grand Canyon (South Rim, North Rim, Havasu Falls, Toroweap overlook, inner gorge)
- Glacier (Going-to-the-Sun Road, Grinnell Glacier, Lake McDonald, Many Glacier)
- Redwoods / Sequoia (towering coastal redwoods, General Sherman, Giant Forest, fern undergrowth)
- Olympic (Hoh Rainforest, Ruby Beach, Hurricane Ridge, Hall of Mosses)
- Grand Teton (Teton Range reflection in Jackson Lake, Snake River overlook, Cascade Canyon)
- Banff / Canadian Rockies (Lake Louise, Moraine Lake, Icefields Parkway, Peyto Lake)
- Goblin Valley (mushroom rock formations, wild west alien landscape)
- Death Valley (Badwater Basin, Zabriskie Point, Mesquite Flat dunes, Racetrack Playa)
- Acadia (Cadillac Mountain sunrise, Bass Harbor lighthouse, Jordan Pond)
- Great Smoky Mountains (misty ridgelines, Clingmans Dome, autumn hardwoods)
- Joshua Tree (twisted Joshua trees at sunset, Skull Rock, Cholla Garden)
- Crater Lake (deep blue caldera, Wizard Island, Phantom Ship)
- Big Bend (Santa Elena Canyon, Chisos Mountains, Rio Grande)
- Denali (mountain towering above clouds, tundra wildflowers, braided rivers)
- Badlands (layered sediment striations, eroded pinnacles, prairie meeting moonscape)
- White Sands (pure white gypsum dunes, rippled patterns, sunset shadows)
- Capitol Reef (Waterpocket Fold, Cathedral Valley, Hickman Bridge)
- Carlsbad Caverns (massive underground chambers, stalactite cathedrals)
- Antelope Canyon (light beams in sandstone, flowing rock walls)
- Monument Valley (mittens, buttes, vast desert floor)
- Lassen Volcanic (Bumpass Hell, fumaroles, volcanic devastation zone)
- Hawaii Volcanoes (active lava flows, steam vents, chain of craters)
- Saguaro (giant cactus forests at sunset, Sonoran desert bloom)
- Rocky Mountain (Trail Ridge Road, alpine tundra, Bear Lake)
- Everglades (cypress swamps, sawgrass prairies, mangrove coastline)

━━━ RULES ━━━
- NAME the specific park and formation in each entry
- Real geography amplified — recognizable but impossibly beautiful
- Mix seasons, weather, and times of day across entries
- No two entries should describe the same formation at the same park
- 15-25 words each — vivid, specific, grounded in real places

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
