#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/dune_architecture.json',
  total: 50,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} DUNE-CODED ARCHITECTURE entries for StarBot's dune-architecture path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ARCHITECTURAL INTERIOR or STRUCTURAL EXTERIOR in the Dune aesthetic tradition — desert-empire palaces, fremen sietch cave-cities, harkonnen brutalist industrial halls, imperial throne chambers, water-cathedral reservoirs, ornithopter hangars, sandstone fortresses.

CRITICAL — NO CHARACTERS, NO PEOPLE. Pure architecture / spaces only.

CRITICAL — NO PROPER NOUNS. Never write "Arrakis", "Dune", "Fremen", "Harkonnen", "Atreides", "Sardaukar", "Bene Gesserit", "ornithopter", "spice", "Caladan", "Giedi Prime" — describe the AESTHETIC generically. Use phrases like "desert-empire throne hall", "cliff-carved cave-city", "industrial brutalist palace", "imperial column-hall", "ornithopter hangar with vaulted ceiling".

━━━ AESTHETIC DNA ━━━

Capture the architectural mood of Frank-Herbert / Denis-Villeneuve / David-Lynch / Jodorowsky-Dune-art-book / Syd-Mead concept-art. The interiors are BIBLICAL in scale, ANCIENT, EMPIRE-coded. Massive stone-and-bronze chambers. Cliff-carved sietch passages with sandstone walls. Brutalist industrial halls in oil-black metal with arched corridors. Imperial throne rooms with carved columns and tapestries. Water-cathedral reservoirs deep underground. Ornithopter hangars with bronze-ribbed ceilings. Light is dramatic — single shafts piercing dust-haze, oil-lamp glow against stone, electric-blue spice-light.

━━━ ARCHITECTURE CATEGORIES (variety across ${n}) ━━━

DESERT-EMPIRE THRONE HALLS (~7):
- cavernous throne hall with carved-stone columns, dust-haze in shafts of light, distant tapestries hanging
- imperial audience chamber with sandstone walls, a single elevated throne, embers glowing in floor-pits
- council chamber with circular stone amphitheater, hieroglyphic walls, low ambient firelight

CLIFF-CARVED SIETCH CAVE-CITIES (~8):
- sietch interior corridor carved into sandstone, ladders connecting tiers, woven curtains over passages
- communal sietch chamber with circular fire-pit, woven blankets, dome ceiling carved into rock
- water-reservoir chamber deep in a sietch, shallow pool, condensation rilling down stone walls
- sietch ascending stairway carved into a cliff face, narrow steps spiraling up

BRUTALIST INDUSTRIAL HALLS (HARKONNEN-CODED) (~8):
- vast industrial hall in oil-black metal, arched corridors receding, sodium emergency lights
- factory-cathedral interior with riveted steel walls, conveyor systems suspended from black ceilings
- brutalist palace corridor, polished obsidian walls, single linear light running the floor
- foundry chamber with smelter pits glowing dim red, soot-stained columns, industrial gantries

WATER-CATHEDRAL RESERVOIRS (~5):
- deep underground water-cathedral, vast cistern surrounded by carved sandstone columns
- sacred water-pool chamber with condensation collecting on overhead stone
- subterranean reservoir hall with calm dark water reflecting torchlight

ORNITHOPTER HANGARS (~5):
- vast hangar with bronze-ribbed ceiling, scattered fuel drums, open hangar doors revealing desert beyond
- maintenance hangar with industrial cranes, arched bronze ceiling, oil-stained floor
- launch hangar with arched stone roof, hangar bay opening onto a dune-sea

CLIFF-FORTRESS EXTERIORS (~7):
- desert-empire fortress on a sandstone cliff, weathered ramparts and watchtowers
- ancient citadel carved into a mesa, narrow approach ramp winding up
- imperial palace overlooking a desert basin, stone walls glowing amber at dusk

INNER CHAMBERS / SACRED ROOMS (~5):
- meditation chamber with small still pool, single shaft of light from above
- archive chamber with carved-stone shelves filled with ancient codex-scrolls
- ancestral hall with carved stone busts of forebears, low torchlight

ANCIENT CORRIDORS / PASSAGES (~5):
- empty corridor in a desert palace with sandstone walls and elaborate floor mosaics
- subterranean tunnel with arched stone supports, oil-lamps along the wall
- temple-corridor with religious iconography carved into the walls

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO people / NO figures — pure architecture
- NO proper nouns from the franchise
- Strong material specificity (sandstone, oil-black metal, bronze, polished obsidian, carved stone, weathered wood, woven cloth)
- Strong light/atmosphere component (dust-haze in shafts, sodium emergency, firelight, oil-lamp glow, spice-blue)
- Variety across the 8 categories above mandatory
- Biblical scale OR intimate sacred mood — both work
- NO direct franchise lookalikes (avoid copying specific film sets verbatim)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
