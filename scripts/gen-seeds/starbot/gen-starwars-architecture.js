#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/starwars_architecture.json',
  total: 25,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} STAR-WARS-CODED ARCHITECTURE entries for StarBot's starwars-architecture path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ICONIC ARCHITECTURAL INTERIOR in the Star Wars aesthetic tradition — Imperial throne chambers, Senate-rotunda classical halls, cantina dive-bar interiors, Death-Star-corridor brutalist halls, Ewok-village treetop platforms, Naboo classical palaces, Jedi temple meditation chambers, droid factories, Cloud-City hangars.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO DROIDS, NO LIGHTSABERS, NO STORMTROOPERS-AS-FIGURES. Pure architecture only.

CRITICAL — NO PROPER NOUNS. Never write "Tatooine", "Coruscant", "Death Star", "Imperial", "Jedi", "Sith", "Senate", "Stormtrooper", "Mos Eisley", "Cantina" — describe the AESTHETIC generically. Use phrases like "imperial throne chamber", "senate-rotunda classical hall", "alien-frontier dive-bar interior", "brutalist station-corridor", "treetop village platform", "classical-domed lake-country palace".

━━━ AESTHETIC DNA ━━━

Capture the mood of George-Lucas / Ralph-McQuarrie / Doug-Chiang concept-art / 70s-pulp-paperback-painted matte tradition. LIVED-IN dirty-future, used-cosmos, painted backdrop quality. Each interior has a SPECIFIC iconic-coded mood: imperial-brutalist (dark obsidian and red), classical-empire (white marble columns), frontier-grunge (neon and filth), ancient-mystical (carved stone meditation), industrial-corridor (gun-metal and pipes).

━━━ ARCHITECTURE CATEGORIES (variety across ${n}) ━━━

IMPERIAL BRUTALIST INTERIORS (~4):
- vast obsidian-black throne hall with elevated dais, glowing-red accent lighting, distant arched columns receding
- imperial command bridge with consoles, polished black floor, viewport overlooking starfield, brutalist architecture
- station corridor in gunmetal-grey with red-and-white emergency strips along the floor, distant blast doors

CLASSICAL-EMPIRE / SENATE HALLS (~3):
- grand senate-rotunda with concentric rings of floating viewing-pods around a central podium, classical-future architecture
- vast classical hall with elaborate carved columns, marble floor, golden statuary, vaulted ceiling
- imperial palace audience chamber with throne on raised dais, ornate columns, tapestries hanging

FRONTIER-GRUNGE DIVE BARS (~3):
- alien dive-bar interior with neon-and-stone walls, beat-up tables, hookah-coded smoke-haze, jukebox-style music console
- desert cantina interior with low ceiling, stone walls, scattered tables, exotic instrument on the bandstand (no figures)
- spaceport-tavern with grimy windows showing landed spacecraft outside, neon signs in unknown language

JEDI/MYSTICAL TEMPLE CHAMBERS (~3):
- ancient stone meditation chamber with carved-rock walls, a single shaft of light from above, simple low-platform
- mystical temple library with rows of carved-stone shelves, ancient scroll-codices, soft warm light
- circular sacred chamber with carved stone, tiled floor, central circular meditation cushion (no figure)

CLASSICAL-DOMED LAKE-COUNTRY PALACES (~2):
- elegant domed palace interior with arched windows overlooking a lake, marble floors, ornate columns
- classical palace gallery with fluted columns, polished floor, sunlight through high windows

EWOK-VILLAGE TREETOP PLATFORMS (~2):
- treetop wooden village platform connected by rope bridges, woven-stick architecture, dappled forest light
- canopy-village clearing with thatched dwellings on platforms, vine-rope walkways, soft green ambient

CLOUD-CITY ELEGANT INTERIORS (~2):
- elegant cloud-city corridor with curved walls, art-deco fluting, sunset glow through panoramic windows
- floating-city promenade with classical columns, floor-to-ceiling pastel-orange gas-giant view, polished floor

DROID FACTORIES / INDUSTRIAL (~2):
- vast droid-assembly factory with conveyor belts and robotic arms (idle, no droids assembled), industrial gantries
- industrial workshop interior with welding stations, scattered parts, sparks frozen mid-action, no figures

UNDERGROUND HIDEOUTS / CAVES (~2):
- carved-stone hideout-cave with primitive lighting, scattered crates, alien-empire glyphs on the walls
- subterranean rebel-base interior with concrete walls, cables along ceiling, scattered map-tables (no figures)

CARBONITE / FREEZE CHAMBERS (~2):
- industrial carbonite-freeze chamber with circular rim and central pit, smoke rising from the cooling chamber
- harsh industrial corridor with carbonite-coated wall slabs, exposed pipes, harsh white lighting

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO droids / NO lightsabers
- NO franchise proper nouns
- LIVED-IN dirty-future, painted-matte concept-art mood
- Variety across the 10 categories above mandatory
- Strong material specificity (obsidian-and-red imperial / white-marble classical / neon-and-stone grunge / carved-rock mystical / gun-metal industrial)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
