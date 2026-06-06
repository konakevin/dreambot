#!/usr/bin/env node
/**
 * EarthBot EPIC_VISTA_PHENOMENON top-up (Stage 2 backfill 2026-06-05).
 *
 * Shared by 9 paths: epic-vista, sacred-light, national-parks, deep-forest,
 * lush-jungle, coastal-vista, tropical-paradise, hawaii-flowers, epic-sunset.
 * Mostly GATED at 30% — only triggers occasionally to keep the pool's
 * "wow moment" reading rare.
 *
 * REGISTER: 15-25 words. ONE rare optical / atmospheric sky-phenomenon
 * that visually elevates a wide landscape. NO biome-locking — the
 * phenomenon must be plausible above forest, jungle, coast, savanna,
 * mountain, sunset, hawaii, vista. NO humans. NO architecture.
 *
 * Existing 50 cycle: double rainbow, sun-dogs, fire rainbow, 22-degree
 * halo, sun pillar, anticrepuscular rays, circumzenithal arc, nacreous
 * cloud, wall cloud, single-fork lightning.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/epic_vista_phenomenon.json',
  total: 200,
  batch: 25,
  maxTokens: 16000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} new SKY / ATMOSPHERIC PHENOMENA for EarthBot's epic-vista pool (shared by 9 paths: epic-vista / sacred-light / national-parks / deep-forest / lush-jungle / coastal-vista / tropical-paradise / hawaii-flowers / epic-sunset). Each entry is a rare optical / atmospheric phenomenon happening in the sky / atmosphere above ANY wide landscape biome.

Each entry: 15-25 words. ONE phenomenon, described with its real-science name where known.

━━━ EXAMPLE PHRASINGS (mirror register exactly) ━━━

"Double rainbow arcing complete across the valley, primary vivid below, secondary fainter above with reversed color order"
"Sun-dogs (parhelia) flanking the sun at 22°, paired bright spots burning on either side of the solar disc"
"Fire rainbow (circumhorizontal arc) glowing across high cirrus, prismatic band running parallel to the horizon"
"22° halo ring drawn full around the sun, pale luminous circle refracted through ice-crystal cirrus"
"Sun pillar rising vertical from the low sun, column of scattered light through hexagonal ice plates in cold air"
"Anticrepuscular rays converging at the antisolar point on the opposite horizon, parallel light-ribbons pulling to a vanishing point"
"Nacreous (polar stratospheric) cloud glowing pastel-iridescent in deep twilight, mother-of-pearl wash across the stratosphere"

━━━ VARIETY MANDATE (distribute across ${n} new entries) ━━━

OPTICAL HALOS / ARCS (~18%):
- 46° halo / parhelic circle / supralateral arc / infralateral arc / tangent arc (upper / lower)
- Circumzenithal arc / circumhorizontal arc / Parry arc / sub-sun / sub-parhelia
- Bottlinger's ring / Heiligenschein / glory ring around the antisolar point
- Subhorizon halo / pillar at sunrise / pillar at sunset

RAINBOW VARIANTS (~12%):
- Reflection rainbow / reflected-light rainbow (mirror over water) / supernumerary rainbow bands
- Twinned rainbow / monochrome red-rainbow / red bow at sunset / horizontal moonbow
- Spray-bow at waterfall base / fogbow (white rainbow) / dew-bow on grass at dawn

CLOUD PHENOMENA (~14%):
- Lenticular cloud stack over a mountain / shelf cloud at front edge / mammatus pouches under thunderhead
- Asperitas wave-cloud / undulatus cloud rolls / Kelvin-Helmholtz wave cloud
- Volutus roll cloud / fallstreak hole / hole-punch cloud / pileus cap-cloud
- Mother-of-pearl nacreous / noctilucent silver-bands at twilight

LIGHTNING / ELECTRICAL (~10%):
- Heat-lightning sheet illumination behind distant clouds / dry-lightning fork
- Cloud-to-cloud spider lightning / volcanic lightning in ash-plume
- Ball-lightning hovering above ridge / St. Elmo's fire glowing on mast / corona discharge
- Sprite / blue-jet / red-elf above thunderhead (rare high-atmosphere)

SUN / MOON SPECIFIC (~12%):
- Green-flash at horizon / blue-flash / yellow flash arc
- Sun reflection mirror-band on water / moon-glade silver track / moon halo with corona
- Solar prominence visible during eclipse / corona crown around occulted disc
- Belt of Venus arc with Earth's shadow band below it / sunrise/sunset anti-twilight arch

ATMOSPHERIC OPTICAL (~10%):
- Crepuscular rays through clouds (god-rays) / cloud-shadow casting on neighboring clouds
- Light-pillar from urban lights against ice-crystal sky / iridescent cloud edges
- Cloud-iridescence pearlescent band / cloud-shadow projected across mountain face
- Distrails / contrails / cavum cloud / vapour-trail anti-twilight

STORM / RAIN OPTICAL (~8%):
- Single distant rainshaft (virga) drifting across the plain / curtain rainshaft sweeping in
- Hail-shaft visible far across the valley / sleet sheet / snow-shower distant
- Microburst plume hitting the ground / shelf-cloud arcus front / gust front roll

WATER-AIR INTERACTION (~6%):
- Sea-smoke / steam-fog over warm water in cold air / vapor wisps lifting off the lake at dawn
- Cold-air avalanche off a glacier / katabatic wind visible in dust / valley-fog inversion at dawn
- Fog-bow / glory in fog / Brocken spectre with halo on a fog bank

CELESTIAL VISIBLE-IN-DAY (~6%):
- Daytime Moon visible / Venus visible in late-afternoon sky / Mercury at twilight
- Solar eclipse partial bite / annular ring of fire / Bailey's beads around occulted limb
- Multiple sun-dogs forming a triangle / 22° halo with sundogs and upper tangent arc together (rare combo)

VOLCANIC / SMOKE / DUST (~4%):
- Volcanic sunset (Krakatoa effect) intensified colors / red moon at horizon / hazy purple twilight
- Dust storm wall (haboob) advancing distant / dust-devil column rising / ash-fall reddening
- Wildfire smoke layer turning sun copper / smoke-shadow rays across the basin

━━━ FORMAT RULES ━━━

- 15-25 words, ONE complete sentence.
- Lead with the phenomenon NAME (preferably with its real-science term in parens if it has one).
- Describe its visual signature in 1-2 specific terms (color, geometry, position relative to sun/moon, scale).
- Close with the atmospheric condition that produces it (cirrus / ice-crystals / supercell / sea-fog / etc.).

━━━ HARD MANDATES ━━━

- Real atmospheric / optical / cloud phenomena — describe what would actually be visible.
- BIOME-NEUTRAL — the phenomenon must read plausibly over forest, jungle, coast, sunset, mountain, savanna, vista.
- Each entry's phenomenon name must vary across the pool.

━━━ HARD BANS ━━━

- NO biome-specific terrain mentions (NO "above the redwoods", NO "across the savanna") — biome neutral only.
- NO humans / architecture / vehicles.
- NO fantasy / sci-fi inventions (no portals, no auroras-as-magic, no faux phenomena).
- NO photographer / lens / camera-jargon.
- NO "wallpaper-worthy" / "Pulitzer-Prize" / "breathtaking" cruft adjectives — describe the phenomenon, not its appraisal.
- NO same phenomenon name repeated across entries.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
