#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/halo_landscapes.json',
  total: 25,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} HALO-CODED LANDSCAPE entries for StarBot's halo-landscape path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ICONIC ALIEN VISTA in the Halo aesthetic tradition — ring-installation arcs visible across the sky, Forerunner megaliths on alien planet surfaces, Reach-style mountain wastes, ancient precursor temple-ruins on planet plateaus, frontier military colony surfaces, Halo-arc curving across the alien horizon.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO MASTER-CHIEF, NO ELITES, NO DROP-SHIPS-AS-FOREGROUND. Pure landscape only.

CRITICAL — NO PROPER NOUNS. Never write "Halo", "Forerunner", "Covenant", "Reach", "Master Chief", "Spartan", "Cortana", "Sangheili", "UNSC", "Pelican", "Warthog" — describe the AESTHETIC generically.

━━━ AESTHETIC DNA ━━━

Capture the mood of Bungie / 343-Industries / Sparth / Pat-Rawlings concept-art. The landscape is BIBLICAL with ring-installation arcs ALWAYS visible curving overhead, ANCIENT PRECURSOR MONOLITHIC architecture juts from cliffs, MILITARY-INDUSTRIAL bases scatter the surface, ALIEN VEGETATION feels distinctly off-Earth. Lighting is dramatic — atmospheric perspective showing the curve of the ring, sun-pillars piercing dust haze, sodium emergency lights at distant bases.

━━━ LANDSCAPE CATEGORIES (variety across ${n}) ━━━

RING-INSTALLATION ARC LANDSCAPES (~6):
- alien-planet vista with the curving Halo-style ringworld arc visible stretching across the sky
- ringworld surface valley with the opposing arc of the artificial-construct sky bending up overhead
- standing on a ringworld plateau looking up at the opposing arc of the ring, atmosphere bending the light
- ringworld plain with distant continents wrapping overhead through atmospheric haze
- snow-capped ringworld mountain range with the visible curve of the artificial sky above
- ringworld coastline where ocean meets ring-arc rising into the sky on either horizon

FORERUNNER MEGALITHS ON PLANETS (~5):
- alien plain with monolithic Forerunner-style obelisks half-buried in soil, ancient glowing-glyphs faintly visible
- precursor monolith circle on a forest-moon plateau, megalithic stone slabs older than the system itself
- single colossal precursor monolith standing at a cliff edge, ancient runes glowing faintly
- desert plain with rows of geometric precursor obelisks, sand-blasted but intact, ancient sun-light catching them
- coastal cliff with precursor temple-pyramid carved into the rock face, glowing-glyph at the apex

REACH-STYLE MOUNTAIN WASTES (~4):
- snowy mountain wasteland with prefab military bunkers nestled in valleys, distant frigate silhouette in sky
- desolate frontier mountain plateau under steel-grey sky, scattered military prefab structures, atmospheric haze
- alpine wasteland with rocky outcrops and isolated military installations, perpetual winter, distant aurora
- frontier wasteland mountain range with sandbag emplacements abandoned, atmospheric mist, no figures

ANCIENT PRECURSOR TEMPLE-RUINS (~4):
- alien jungle with Forerunner-style precursor temple ruins half-overgrown, vines wrapping geometric metal-stone walls
- desert plain with ruined precursor pyramid-temple half-buried, ancient runes still glowing faintly
- mountain plateau with vast precursor ruin complex, multiple stepped levels carved into rock, ancient
- coastal precursor temple ruin with stone-and-metal walls partially collapsed into the sea

FRONTIER MILITARY COLONY SURFACES (~3):
- prefab military colony exterior on an alien moon, modular concrete-and-steel buildings, atmospheric processor distant
- forward operating base on an arid plain, prefab habitats clustered, sandbag walls, military-grade aesthetic
- frontier base entrance built into a cliff-face, blast doors closed, prefab gantries visible, atmospheric haze

GAS-GIANT-HORIZON RINGWORLD (~3):
- view from a ringworld plateau with massive gas-giant rising at the horizon, ring-arc curving overhead
- ringworld coastline with ocean and visible ring-segments arcing into the sky, gas-giant in the upper atmosphere
- alien-cliff overlook with the opposing ring arc visible above and gas-giant looming on the horizon

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO Master-Chief / NO foreground vehicles (background ships at distance OK)
- NO franchise proper nouns
- Strong sky / atmospheric component (RING-ARC visible overhead is signature)
- Variety across the 6 categories above mandatory
- Mood ranges SACRED-ANCIENT (precursor) → MILITARY-INDUSTRIAL (Reach) → BIBLICAL-RINGWORLD (Halo)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
