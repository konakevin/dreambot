#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/got_architecture.json',
  total: 25,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} GAME-OF-THRONES-CODED ARCHITECTURE entries for DragonBot's got-architecture path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ARCHITECTURAL INTERIOR in the GoT / ASOIAF aesthetic tradition — Winterfell-style northern feast hall, Red-Keep style throne chamber, Castle-Black brotherhood mess hall, Eyrie sky-cell-and-throne, Dornish water-garden palace, Highgarden rose-marble hall, Dragonstone volcanic chamber, Pyke driftwood throne, Wildling cave settlement, Iron Bank chamber.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO STARKS, NO LANNISTERS, NO HEROES. Pure architecture only.

CRITICAL — NO PROPER NOUNS. Never write "Westeros", "Essos", "Winterfell", "King's Landing", "Red Keep", "Iron Throne", "The Wall", "Castle Black", "Eyrie", "Highgarden", "Dorne", "Dragonstone", "Pyke", "Stark", "Lannister", "Targaryen", "Tyrion", "Daenerys", "Jon Snow", "Cersei", "Game of Thrones" — describe the AESTHETIC generically.

━━━ AESTHETIC DNA ━━━

Capture the mood of Game-of-Thrones / ASOIAF / Marc-Simonetti / Ted-Nasmith painted-realism tradition. Production-design quality. Each interior has a STRONG regional architectural language: NORTHERN cold-stone-and-grey-banner austere, ROYAL ornate-marble-and-gold-throne classical-medieval, BROTHERHOOD-FORTRESS rough-stone wooden-bench austere, EYRIE white-stone-narrow-courtyard mountain-aerie, DORNISH amber-sandstone-water-garden Mediterranean-mediterranean, HIGHGARDEN rose-marble-elegant-pastel, DRAGONSTONE volcanic-stone-twisted-dragon-pillars brooding, PYKE-IRONBORN driftwood-and-stone weather-beaten, WILDLING-CAVE earthen-cavern primitive.

━━━ ARCHITECTURE CATEGORIES (variety across ${n}) ━━━

NORTHERN COLD-STONE FEAST HALLS (~3):
- ancient northern feast hall with grey-stone walls, long oak tables, banners with direwolf-style sigils, central hearth blazing
- austere stone hall with tapestries depicting wolves and snow-trees, scattered torches, low-ceilinged warmth, atmospheric cold
- weirwood-godswood-courtyard interior with ancient white-trunked tree carved with face, snow drifting, sacred mood

ROYAL ORNATE-MARBLE THRONE CHAMBERS (~3):
- vast royal throne hall with marble columns, dramatic spiked-throne of fused weapons, banners hanging from impossibly high ceiling
- ornate gold-and-red royal audience chamber with vaulted ceiling, polished floor mosaic, banners hanging
- royal great hall with elaborate stained-glass windows, golden chandeliers, marble columns, atmospheric grandeur

BROTHERHOOD-FORTRESS BARRACKS (~2):
- austere brotherhood-fortress mess hall with rough-stone walls, long wooden tables, scattered weapons, dim torchlight
- frontier-fortress armory chamber with weapon-racks lining the walls, cracked stone floor, hanging banners

EYRIE WHITE-STONE NARROW-COURTYARDS (~2):
- white-stone sky-cell chamber with sloping floor opening to a kilometer drop, blue mountain sky beyond, atmospheric vertigo
- narrow white-stone audience chamber with arched windows showing distant mountain peaks, polished floor, marble throne

DORNISH AMBER-SANDSTONE WATER-GARDENS (~3):
- dornish water-garden palace interior with arched colonnades, fountain courtyards, palm trees in the foreground, atmospheric sun
- amber-sandstone audience chamber with mosaic-tiled floor, arched openings to a garden, golden-hour light through tropical palms
- mediterranean-style palace gallery with intricate amber-tilework, decorative fountains, tropical vegetation

HIGHGARDEN ROSE-MARBLE HALLS (~2):
- elegant rose-marble palace hall with pastel-tinted columns, climbing-vine decoration, soft pastoral light through arched windows
- highgarden-style throne chamber with floral motifs carved into marble, climbing roses on the columns, golden ambient

DRAGONSTONE VOLCANIC-STONE CHAMBERS (~3):
- volcanic-stone throne chamber with twisted-dragon-shaped pillars, brooding obsidian floors, single shaft of light from above
- dragonstone-style audience chamber with carved dragon-pillars wrapping the walls, atmospheric heat-shimmer, brooding mood
- ancient sea-cliff fortress chamber with volcanic-stone walls, dragon-stone-statue alcoves, dim atmospheric ambient

PYKE-IRONBORN DRIFTWOOD CHAMBERS (~2):
- ironborn-style sea-castle hall with driftwood-decoration, kelp-and-shell motifs, weathered stone walls, rusty iron throne
- pyke-style salt-throne chamber with weathered driftwood throne, sea-glass-windows, atmospheric storm-cloud through opening

WILDLING-CAVE EARTHEN SETTLEMENTS (~2):
- vast wildling cave-settlement interior with bone-and-fur decoration, central fire-pit, scattered furs and weapons, primitive mood
- frozen-cave settlement chamber with bone-totems, fur-draped walls, atmospheric cold, dim torchlight

IRON-BANK / EXOTIC-EAST CHAMBERS (~3):
- exotic-east bank-chamber with marble-tilework, scattered scales-and-coins, atmospheric haze, austere mood
- eastern slave-market plaza interior with stepped-pyramid architecture, palm trees, atmospheric heat, distant sound implied
- exotic palace audience chamber with carved-stone columns, geometric tile-patterns, hanging-lantern golden ambient

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO heroes-as-figures
- NO franchise proper nouns
- GAME-OF-THRONES / MARC-SIMONETTI / TED-NASMITH painted-realism mood — POLITICAL, GROUNDED, PRODUCTION-DESIGN-QUALITY
- Variety across the 9 categories above mandatory
- Strong material specificity per region

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
