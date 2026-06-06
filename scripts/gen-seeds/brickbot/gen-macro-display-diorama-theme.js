#!/usr/bin/env node
/**
 * BRICKBOT_MACRO_DISPLAY_DIORAMA_THEME — the complete brick WORLD the
 * diorama depicts. Audit 2026-06-05: existing 25 entries — undersized.
 * Target 200.
 *
 * Each entry describes a complete, fully-realized brick world that fills
 * the whole diorama frame — foreground + mid-build + background, all
 * threaded by paths / canals / rails / walkways into one coherent settlement
 * or natural-world scenario.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_macro_display_diorama_theme.json',
  total: 200,
  batch: 25,
  maxTokens: 16000,
  append: true,
  metaPrompt: (n) => `You are writing ${n} DIORAMA-THEME entries for BrickBot's macro-display path — a COMPLETE BRICK WORLD that fills the whole tabletop diorama frame, with foreground + mid-build + background all threaded together by paths / canals / rails / walkways into one coherent settlement, biome, or natural-world scenario. Each entry is ONE CAPS prefix + em-dash + 50-80 word body describing the foreground / mid-build / background zones with specific brick-rendered features.

━━━ THE BAR ━━━
Every entry must give Flux a COMPLETE WORLD with THREE DEPTH ZONES (foreground / mid-build / background) plus the connective tissue (path / canal / rail / walkway / road / bridge / trail) that ties them together — all rendered as a brick MOC convention diorama. Generic ("a fantasy world") FAILS — name the specific subjects in each zone + the connective tissue.

━━━ VARIETY MANDATE (distribute roughly across these world categories) ━━━
- ~6 NATURAL BIOME SETTLEMENT (desert frontier / jungle temple / harbor fishing / volcano research / arctic station / mountain village / coastal cliff / canyon outpost / river delta / island colony)
- ~5 FANTASY WORLD (castle realm / dragon-roost / wizard tower / dwarven hold / elven forest / orc-warren / underworld-cavern / island-of-mages / floating-city / dragon-graveyard)
- ~4 SCI-FI WORLD (Mars colony / lunar base / orbital station / cyberpunk city / off-world frontier / underwater dome / spaceport / asteroid station / alien jungle / steampunk metropolis)
- ~4 HISTORICAL WORLD (medieval town / Roman forum / pirate haven / wild-west boom town / Viking longhouse-village / Edo castle-town / Aztec-Maya city / colonial-port / ancient-Greek port / Norse-fjord)
- ~4 MODERN URBAN (downtown / skyline / port-district / arts-district / market-district / transit-hub / amusement-pier / industrial / suburban / waterfront)
- ~3 RURAL / AGRARIAN (farm valley / vineyard / orchard hill / shepherd-village / rice-terrace / olive-grove / wheat-field harvest / pasture-and-mill / fishing village / lighthouse cove)
- ~3 SEASONAL / EVENT (winter village / autumn-harvest festival / spring-bloom orchard / monsoon market / Christmas-town / Halloween-village / blossom-festival / harvest-fair / blizzard-research / aurora-camp)
- ~2 INFRASTRUCTURE-AS-WORLD (canal town / aqueduct city / railway junction / dam-and-reservoir / waterway lock-and-bridge / steel-mill town)
- ~2 CATASTROPHIC / DRAMATIC (volcanic eruption / city under siege / flood / wildfire / earthquake aftermath / monster-attack)
- ~2 IMAGINATIVE / SURREAL (giant tree-city / clockwork world / sky-island archipelago / inverted city / Escher impossible-architecture)
- ~1 RELIGIOUS / SACRED (cathedral district / temple-mount / mosque-and-souk / Tibetan-monastery / Shinto-shrine-village / pilgrimage-route)
- ~1 ACADEMIC / MAGICAL (wizard-school campus / underwater-research-academy / observatory-mountain / library-fortress / arcane-college)
- ~1 RECREATIONAL / LEISURE (ski-resort / lakeside-cabin / beach-town / spa-village / hot-spring-onsen / mountain-lodge)
- ~1 INDUSTRIAL HEAVY (oil-rig / mining-operation / shipyard / steel-mill / refinery / quarry / brick-kiln town)

━━━ FORMAT ━━━
Each entry: ONE CAPS prefix (2-5 hyphenated words), em-dash, then 50-80 word body. Body MUST name: foreground zone + mid-build zone + background zone + connective tissue (path / canal / rail / walkway / road / bridge). Use specific brick / plate / element language where natural. Touchpoint examples:
"DESERT FRONTIER TOWN — a complete brick dusty outpost: a saloon-and-general-store strip along a sand-tan plate main street in the foreground, a sheriff's office + livery stable mid-build, a water-tower + mine-shaft entrance climbing a sandstone-brick bluff behind, one whole sun-baked frontier world connected by rutted wagon-tracks"
"HARBOR FISHING TOWN — a complete brick coastal settlement: weathered-brick fishing sheds and lobster-pot stacks along a trans-blue quay foreground, a fish-market hall and repair-dry-dock mid-build, a steep hillside of stacked-plate cottages and a lighthouse point behind, one whole working harbor world laced by cobbled lanes"
"VOLCANO RESEARCH BASE — a complete brick volcanic outpost: a geothermal drilling-platform and lava-flow tile channels in the foreground, modular lab-domes and equipment-crane arrays mid-build, a caldera rim of dark-brick peaks venting trans-orange steam at the back, one rugged research-settlement world linked by grated walkways"

━━━ BANS ━━━
- NO photoreal language
- NO single-subject zooms — every theme is a COMPLETE WORLD
- NO licensed-brand names (Mordor / Tatooine / Mos Eisley) — generic-tropic only
- NO motion blur language
- NO bland descriptors — name the foreground/mid/back zones + the connective tissue
- NO empty-world themes — every theme has minifig + creature life implied by the world

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with CAPS prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
