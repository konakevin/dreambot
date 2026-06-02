#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_men_archetypes.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} STEAMPUNK MAN ARCHETYPES for SteamBot's steampunk-man path. STRICTLY two genres only: COMBAT/GUNSLINGER types and ADVENTURER/EXPLORER types. Period-accurate Victorian-industrial era, NOT modern, NOT anime, NOT sexualized.

Each entry: 14-25 words. ONE specific archetype.

━━━ TONE — CRITICAL ━━━
- DASHING / RUGGED / WEATHERED / INTENT / CAPABLE / DANGEROUS — never "sexy" or "seductive"
- Period-accurate Victorian-industrial / late-19th-century steampunk
- DNA: Indiana Jones / Around-The-World-In-80-Days / League-of-Extraordinary-Gentlemen / Wild-Wild-West / 20,000-Leagues-Under-The-Sea / Treasure-Planet / BioShock-Infinite / Sherlock-Holmes / Allan-Quatermain / Phileas-Fogg / The-Mummy
- He's a CHARACTER with a story — armed and dangerous OR exploring the unknown. ALWAYS one or the other.
- NOT a fashion model. NOT posing. NEVER at a desk or workbench.

━━━ ALLOWED ARCHETYPE TYPES — STRICTLY THESE TWO BUCKETS ━━━

▶ COMBAT / GUNSLINGER (mix evenly across these):
1. STEAM-RIFLEMAN — long brass-barreled rifle, leather coat, predator calm
2. STEAM-GUNSLINGER — duster coat, twin brass-revolvers low-slung, slouch hat
3. PISTOL-DUELIST — tailored morning coat, ivory-handled flintlock, scarred knuckles
4. SHARPSHOOTER / MARKSMAN — long brass-scoped rifle, ghillie gear, hawk-eyed
5. OCCULT MONSTER-HUNTER — silver crucifix + steam-revolver, vested suit, wary
6. BOUNTY-TRACKER — trail-worn riding coat, wanted-poster in pocket, brass-spurred boots
7. SKY-PIRATE GUNSLINGER — patched leather waistcoat, holstered brass pistols, devil's smirk
8. FRONTIER MARSHAL / LAWMAN — silver star, twin revolvers, weathered Stetson
9. NOBLEMAN-DUELIST — embroidered silk waistcoat, dueling pistol, refined menace
10. BRASS-KNUCKLE PUGILIST — bareknuckle boxer, scarred fists, taped knuckles
11. ARTILLERY-OFFICER — powder-stained uniform, brass range-finder slung across chest
12. ORDNANCE / EXPLOSIVES SPECIALIST — blast-scarred leather coat, fuse-wire on belt
13. MERCENARY GUN-FOR-HIRE — twin holsters, scuffed boots, eyes-everywhere wariness
14. FENCING / SABRE-MASTER — fencing master with brass-hilted sabre, dueling-club bearing
15. STEAM-POWERED CLOCKWORK SOLDIER — bronze cuirass, steam-rifle, hardened soldier
16. CAVALRY OFFICER — sabre at hip, brass-buttoned regimental jacket, riding boots
17. AIRSHIP MARINE — military-cut greatcoat, repeating brass-rifle, dirigible-deck stance
18. ARMS-DEALER — black wool greatcoat, brass-fitted weapon-case in hand, calculating gaze
19. STEAM-PISTOL DEMONSTRATOR — sharp-eyed showman with prototype steam-pistol drawn
20. WERWOLF/VAMPIRE HUNTER (Van-Helsing-coded) — leather longcoat, silver-bladed pistol

▶ ADVENTURER / EXPLORER (mix evenly across these):
21. GENTLEMAN EXPLORER — pith helmet, khaki linen, traveling case, dust-flecked boots
22. AETHER PILOT — leather flying-helmet, brass goggles raised, sheepskin-lined jacket
23. ORNITHOPTER TEST-PILOT — padded leather flight-suit, wing-frame blueprints, bruised
24. DIRIGIBLE NAVIGATOR — sheepskin-collared flight-coat, altitude-gauge pinned to lapel
25. AIRSHIP CAPTAIN — weathered brass-buttoned greatcoat, telescope at belt, command bearing
26. CLIPPER NAVIGATOR — navy peacoat with brass buttons, sextant, salt-spray weathered
27. STEAM-TRAWLER CAPTAIN — waterproofed greatcoat, fishing-chart, salt-crusted beard
28. BRASS-COMPASS NAVIGATOR — salt-stained oilskin coat, chart-tube, storm-weathered face
29. DIVING-BELL / BATHYSPHERE OPERATOR — rubberized canvas suit, brass helmet under arm
30. ANTIQUARIAN CARTOGRAPHER — ink-stained vest, rolled map-case, compass on chain
31. EXPEDITION PHOTOGRAPHER — canvas field jacket, brass-fitted plate-camera on tripod
32. STORM-CHASER — reinforced canvas duster, lightning-rod apparatus strapped to back
33. SUBTERRANEAN SURVEYOR / SPELUNKER — miner's helmet with carbide-lamp, geological hammer
34. GEOLOGICAL PROSPECTOR — canvas field-trousers, ore-sample pouch heavy, rock-hammer
35. SURVEYOR — trail-worn field-coat, brass theodolite on tripod, terrain-map under arm
36. SPECIMEN-COLLECTOR / NATURALIST — canvas expedition-vest, butterfly-net, chloroform jar
37. ARCTIC / POLAR EXPLORER — fur-lined parka with brass goggles, snowshoes, frost-bearded
38. JUNGLE / SAFARI EXPLORER — pith helmet, brass-barreled rifle, khaki safari-coat
39. ALPINE MOUNTAIN-CLIMBER — brass crampons, ice-axe, ropes coiled across chest
40. LOST-CIVILIZATION ARCHAEOLOGIST — Indiana-Jones-coded with bullwhip + brass-revolver
41. SUBMARINE / NAUTILUS-STYLE CAPTAIN — Captain Nemo-coded with ornate uniform
42. AETHER-FLIGHT MERIDIAN-CHARTER — high-altitude pilot with oxygen tube
43. BIG-GAME HUNTER — Allan-Quatermain-coded with elephant gun + safari kit
44. CIRCUMNAVIGATOR — Phileas Fogg-coded gentleman with valise + pocket-watch
45. AETHER-WHALER — sky-whaler with brass harpoon-gun on airship deck
46. EXPLORER-DETECTIVE — Sherlock-Holmes-in-the-field with magnifying glass + steam-revolver
47. RIVER-EXPEDITION CAPTAIN — Heart-of-Darkness-coded with steamboat
48. DESERT-EXPEDITION LEADER — Lawrence-of-Arabia-coded with khaki + brass scope
49. CRYPTOZOOLOGIST — naturalist hunting unknown beasts, brass-fitted specimen-cage
50. AERONAUT — pioneering balloon-pilot with brass-fitted altimeter, leather-bound logbook

━━━ FOR EACH ENTRY INCLUDE ━━━
- Core archetype (combat or adventurer — never both, never other)
- 2-3 distinctive identifying details (brass-rifle, pith helmet, dueling pistol, chart-tube)
- His ENERGY in 1-2 words (predator-calm, daring, weathered, intent, hawk-eyed, fearless)

━━━ ABSOLUTELY BANNED ━━━
- NO factory workers, industrial laborers, mechanics, foremen, supervisors
- NO desk-scholars, professors, draughtsmen, patent-clerks, pencil-pushers
- NO craftsmen at workbenches (no glassblowers, smiths, lens-grinders, etc.)
- NO socialites, tycoons, lawyers, doctors, ministers, gentlemen-of-leisure
- NO musicians, performers, photographers-in-studio, artists
- NO laborers (riveters, stokers, lamplighters, drivers, couriers, dispatchers)
- NO "sexy", "seductive", "alluring", "smoldering"
- NO modern era (no cars / phones / contemporary fashion)
- NO anime / manga register
- NO shirtless / underwear poses
- NO named real people / IP characters (no Indiana Jones BY NAME, no Allan Quatermain BY NAME)

━━━ EXAMPLES (DO NOT REUSE — write fresh) ━━━
- "Steam-rifleman in worn leather coat, brass-barreled rifle slung over shoulder, predator's calm gaze, weathered composure"
- "Gentleman explorer in dust-flecked khaki linen, pith helmet tucked under arm, traveling case in hand, rugged determination"
- "Steam-gunslinger in long duster coat, twin brass-revolvers holstered low, slouch hat shadowing eyes, lethal calm"
- "Aether pilot in leather flying-helmet, brass goggles pushed up, sheepskin jacket worn, oxygen tube coiled, daring readiness"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
