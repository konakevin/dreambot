#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/got_landscapes.json',
  total: 25,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} GAME-OF-THRONES-CODED LANDSCAPE entries for DragonBot's got-landscape path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ICONIC FANTASY VISTA in the GoT / ASOIAF aesthetic tradition — Winterfell-style northern stone-keep on snow-plain, Wall-style ice barrier and frozen-wastes-beyond, Eyrie-style sky-castle on high mountain, Dornish-coded sun-baked-desert with palm groves, Highgarden-coded golden-rose-fields, Beyond-the-Wall haunted frozen-wilderness, Dragonstone-coded volcanic-island fortress, Pyke-coded sea-stack-castle, Riverlands rolling-hills with crossings.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO STARKS, NO LANNISTERS, NO TARGARYENS, NO HEROES. Pure landscape only (distant dragon silhouettes at scale OK).

CRITICAL — NO PROPER NOUNS. Never write "Westeros", "Essos", "Winterfell", "King's Landing", "The Wall", "Castle Black", "Eyrie", "Highgarden", "Dorne", "Sunspear", "Dragonstone", "Pyke", "Casterly Rock", "Stark", "Lannister", "Targaryen", "Tyrion", "Daenerys", "Jon Snow", "Cersei", "Westerosi", "Game of Thrones" — describe the AESTHETIC generically. Use phrases like "northern stone-keep on snow-plain", "ice barrier wall stretching to the horizon", "sky-castle on high mountain peak", "sun-baked desert with adobe city", "golden rose-field countryside", "haunted frozen wilderness".

━━━ AESTHETIC DNA ━━━

Capture the visual mood of Game-of-Thrones / ASOIAF / Marc-Simonetti / Ted-Nasmith painted concept-art. POLITICAL low-fantasy realism. Each region has a STRONG environmental signature. Painted-realism quality, like a high-budget historical-drama production design. Dramatic skies and atmospheric haze. Mood is BLEAK-AND-EPIC, MORALLY-COMPLEX, GROUNDED in geographic realism.

━━━ LANDSCAPE CATEGORIES (variety across ${n}) ━━━

NORTHERN-STONE-KEEP / WINTERFELL-CODED (~3):
- vast snowy plain with ancient stone-keep on a low rise, weirwood-tree silhouette in the courtyard, distant grey-stone walls
- northern fortress-castle in the snow with smoking chimneys, godswood weirwood with carved-face visible, atmospheric haze
- ancient northern stone-castle with massive walls and watchtowers, snow drifting, distant mountains, painted-realism mood

WALL-CODED ICE-BARRIER (~3):
- vast ice-barrier wall stretching across the horizon, dwarfing the small castle-fortress at its base, frozen wastes beyond
- distant view of an enormous ice-wall stretching to vanishing point, snow-laden landscape, sentinel watchtowers along the top
- approach to a colossal ice-wall, kilometer-tall, with stair-cuts ascending, frozen mood, blowing snow

EYRIE-CODED SKY-CASTLE (~3):
- white-stone sky-castle perched at the top of an impossibly high mountain peak, surrounded by clouds, distant valleys below
- eagle-nest-fortress on a soaring mountain crag, narrow stone path leading up, atmospheric scale, vertigo-inducing
- isolated mountaintop white-stone keep accessible only by sky-cell, clouds at the level of the courtyard

DORNISH SUN-BAKED-DESERT (~3):
- sun-baked desert plain with distant adobe-and-sandstone palace, palm groves at oases, sandstone cliffs, atmospheric heat-shimmer
- desert oasis with tile-roofed pavilions, tropical palms, golden-hour light, distant sandstone fortress carved into a cliff
- sandstone-cliff city carved into red rock, terraced gardens with palms, sun-baked plaza, atmospheric desert haze

HIGHGARDEN-CODED GOLDEN-ROSE-FIELDS (~2):
- vast golden countryside with rolling green hills, distant elegant castle-mansion surrounded by rose-gardens, golden-hour light
- pastoral rose-fields stretching to a distant marble palace with elegant towers, climbing vines, painted-pastoral mood

BEYOND-THE-WALL HAUNTED FROZEN-WILDERNESS (~3):
- frozen wilderness with ancient haunted forest of dead-trees, blue-tinted snow, distant weirwood with carved face, dread mood
- frozen tundra plain with broken-circles of standing-stones, atmospheric snow, dim grey overcast
- frozen primeval forest with massive twisted dead-trees, ground-mist, blue-cold ambient, atmospheric dread

DRAGONSTONE-CODED VOLCANIC-ISLAND (~2):
- volcanic-island fortress with twisted-dragon-stone architecture, black sand-beach below, smoking volcano in the background
- ancient volcanic-isle citadel with dragon-statue-pillars, brooding obsidian-cliffs, atmospheric storm-cloud sky

PYKE-CODED SEA-STACK CASTLE (~2):
- ancient stone-castle built across multiple sea-stack-pillars, narrow rope-bridges between, stormy ocean below
- ironborn-style castle with kelp-and-driftwood-decoration on weathered stone, tower-keeps perched on sea-stacks, gull-cry implied

RIVERLANDS / CROSSINGS (~2):
- vast green river-plain with ancient stone-bridge crossings, scattered watchtowers, distant ruined castle, atmospheric realism
- rolling river-country with stone causeway, distant village-and-keep silhouette, golden-hour painted-realism mood

ESSOS / EXOTIC-EAST CITIES (~2):
- vast eastern-exotic-coded city with stepped-pyramid silhouettes against desert sky, palm groves, atmospheric heat
- distant city of stepped-pyramids and arched aqueducts in desert plain, painted-realism mood, atmospheric haze

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO Starks / NO Lannisters / NO heroes / NO foreground figures
- NO franchise proper nouns
- GAME-OF-THRONES / MARC-SIMONETTI / TED-NASMITH painted-realism mood — POLITICAL, GROUNDED, BLEAK-AND-EPIC
- Variety across the 10 categories above mandatory
- Color palettes per region (snow-grey north, white-stone Eyrie, sandstone-amber Dorne, golden-fields Highgarden, blue-frozen Beyond-the-Wall, black-volcanic Dragonstone, sea-grey Pyke, green-river Riverlands)
- Painted-realism, NOT stylized-fantasy

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
