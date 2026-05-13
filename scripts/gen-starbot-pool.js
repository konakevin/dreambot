#!/usr/bin/env node
/**
 * Generate a StarBot Rich Scene Seed pool using Sonnet.
 *
 * Each pool entry is a structured mini-storyboard (FG / MG / Far / Sky
 * + scale provers + material truth + emotional DNA) — see
 * STARBOT_SCENE_QUALITY_PLAYBOOK.md for the format and bar.
 *
 * Usage:
 *   node scripts/gen-starbot-pool.js --pool alien_cities --count 50 --dry-run
 *   node scripts/gen-starbot-pool.js --pool alien_cities --count 50
 *
 * The pool's aesthetic touchpoints + theme guidance are looked up from
 * the POOL_RECIPES table below. Output is written to
 * scripts/bots/starbot/seeds/<pool>.json.
 */

const fs = require('fs');
const path = require('path');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const env = readEnvFile();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
if (!ANTHROPIC) {
  console.error('ANTHROPIC_API_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
const has = (n) => args.includes('--' + n);
const POOL = flag('pool', null);
const COUNT = parseInt(flag('count', '50'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');

if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--dry-run]');
  process.exit(1);
}

// Per-pool recipe — what kind of scenes this pool authors + aesthetic
// touchpoints Sonnet should draw from. Same format the playbook uses.
const POOL_RECIPES = {
  alien_cities: {
    theme: 'vast alien CITY scenes — multi-tier megacity density, planet-scale ecumenopolis, layered urban verticality, atmospheric depth. NOT a single hero building — DENSE cities with hundreds of supporting structures.',
    touchpoints: [
      'Coruscant (planet-city stacked levels)',
      'Blade Runner 2049 megaholograms + fog layers',
      'Akira Neo-Tokyo vertical density + neon signage',
      'Trantor (Foundation series ecumenopolis)',
      'Pacific Rim Hong Kong (mile-tall walls of stacked stores/homes)',
      'Warhammer 40K Hive City underhive vertical density',
      'Cloud City silhouettes',
      'Mass Effect Citadel arms (curved megastructure)',
      'Sparth concept art density studies',
      'Syd Mead retrofuture density',
      'Akihabara at peak crowd-and-signage',
      'Hong Kong Kowloon Walled City density',
    ],
    instructions: `Each city must feel like a CIVILIZATION, not a single building. The MG layer is where this is proven — name DOZENS of supporting structures, hundreds of windows, multi-elevation skybridges, tiny ships threading the gaps. The Hero anchor is dominant but never alone.`,
  },
  alien_landscapes: {
    theme: 'alien planetary surfaces — distinctive biomes with strong geological / biological / atmospheric identity. NOT generic "alien planet" — each is a specific ecology.',
    touchpoints: [
      'Dune Arrakis (twin suns, biblical desert scale)',
      'Solaris ocean (sentient world)',
      'Nausicaä toxic jungle',
      'Annihilation Shimmer (color-shifted refracted nature)',
      'Avatar Pandora (bioluminescent verticality)',
      'Beksinski painted dread landscapes',
      'Brian Despain alien-flora paintings',
      "Roadside Picnic Zone (broken physics)",
    ],
    instructions: `Each landscape must read as a specific ecology — biology, geology, atmosphere coherent. MG layer: biology / formations / weather. Scene must include EITHER a sentient figure (1-2% frame, midground-back silhouette) OR an alien creature native to this world.`,
  },
  sleek_female_explorer_outfits: {
    theme: 'Sleek, form-fit FUTURISTIC EVA EXPLORER outfits modeled on the StarBot-hearted exemplars 2026-05-12: gold-mirror-visor pressure-suit climbers, hydraulic-exoskeleton scientists with brass chestplates, prone marksmen in olive-drab + chrome chest plates, bald-tattooed bubble-helm scouts, Tron-blue circuit-line android operatives. Every outfit is a complete EVA-class explorer kit — form-fitting pressure suit base + sealed helmet + multiple pieces of visible engineered tech + ONE distinguishing identity marker that makes her unmistakably herself. Sci-fi paperback-cover oil-painting tradition: Bonestell / Syd-Mead / John-Harris / Michael-Whelan / Frank-Kelly-Freas covers.\n\nABSOLUTE BAN — NO Mandalorian / NO beskar plate / NO T-visor / NO Boba Fett / NO Star Wars helmet language. Flux renders the actual franchise IP from those tokens regardless of brief admonitions. Use generic descriptive language instead (sealed visor / bubble helmet / gold mirror visor / amber HUD faceplate / full-coverage helm).',
    touchpoints: [
      'Mass Effect Andromeda Pathfinder Ryder — form-fit N7 + sealed helmet + amber HUD visor',
      'Apollo / NASA EVA pressure suit — sealed bubble helmet + life-support backpack',
      'hydraulic exoskeleton scientist — burgundy hood + brass sigil chestplate + exposed pistons + battery-pack glow',
      'EVA bubble-helmet climber — gold mirror visor + life-support backpack + mag-boots',
      'olive-drab prone marksman — chrome chest plate + sealed helmet w/ amber HUD + bipod rifle',
      'Tron-coded android operative — midnight-blue bodysuit w/ electric-blue circuit-lines + plasma-blue eyes',
      'mutant explorer — pearl-white pressure suit + oxblood ceramic chest plate + chrome backpack venting',
      'bald-tattooed scout — matte-black tactical bodysuit + sealed bubble helmet reflecting prismatic sand',
      'Dune-coded stillsuit — rust-orange moisture recycler + armored shoulder + brass-filter goggles',
      'Sunshine Icarus crew — gold mirror visor pressure suit',
    ],
    instructions: (() => {
      // Load the 30 hearted-render exemplars (live render bodies from recent
      // FE batches Kevin hearted) and feed them as few-shot to Sonnet. The
      // pool entries should READ LIKE these real prompts — not abstract rules.
      let exemplars = [];
      try {
        exemplars = require('fs').existsSync('/tmp/fe-30-truncated.json')
          ? require('/tmp/fe-30-truncated.json')
          : [];
      } catch (_) {}
      const exemplarBlock = exemplars.length
        ? exemplars.map((e, i) => `EXEMPLAR ${i + 1}: ${e}`).join('\n\n')
        : '';
      return `Write ${COUNT} EVA-class explorer outfit entries, ~50-80 words each. Format: "SETTING — full character + outfit + tech description". Each entry is DENSE with engineered tech detail.

Below are ${exemplars.length} REAL prompts from previously-hearted renders. These are the bar. Generate new entries that read EXACTLY like these — same texture, same tech density, same identity-marker richness, same kind of distinctive non-default skin coloring + ceremonial markings + visible engineered tech. Vary the setting, race, color palette, helmet style, and tech configuration, but every new entry should feel like it BELONGS in this list.

═══════ HEARTED EXEMPLARS — WRITE NEW ENTRIES LIKE THESE ═══════

${exemplarBlock}

═══════ END EXEMPLARS ═══════

EVERY new entry MUST have:
- DISTINCTIVE NON-DEFAULT SKIN COLOR or anatomy (deep umber / light blue / pale-ivory / yellow-green / bronze / iridescent pink / pale-grey / mutant / low-grav evolved / long-limbed / pointed-eared / sensory antennae / etc.) — never just "human woman"
- FORM-FITTING PRESSURE SUIT BASE in a specific color (burnished steel / matte black / midnight-blue / pearl-white / oxblood / olive-drab / charcoal / chrome / bronze)
- SEALED HELMET / BUBBLE HELM / GOLD MIRROR VISOR / AMBER HUD VISOR / FACEPLATE / FULL-COVERAGE HELM (mandatory — 90% of entries)
- 2-4 distinct ENGINEERED TECH PIECES (life-support backpack venting / hydraulic exoskeleton with exposed pistons / retractable grapple-launcher / wrist-mounted scanner or laser / mag-boots / chest-mounted sensor pod / battery-pack glow / cryogenic vapor lines)
- ONE DISTINGUISHING IDENTITY MARKER (geometric facial tattoo / cybernetic eye glow / ceremonial clan markings / brand-plate at temple / chrome twist-braids / brass sigil engraving / scar)

ABSOLUTE BANS:
- NO "Mandalorian" / NO "beskar" / NO "T-visor" / NO "T-shaped visor" / NO Boba Fett / NO Star Wars (Flux renders the franchise IP)
- NO bare-headed bodyglove fashion / NO Tron-circuit clubwear without helmet / NO "no armor" entries / NO monastic-robe-only / NO bare feet / NO pilot cockpit suits / NO runway-coded entries

Vary the role: planetary surveyor / EVA fieldworker / bounty-hunter on planet-side hunt / scientist with sample kit / prone marksman / cliff-climber / cave-diver / atmospheric specialist / android operative.

The bar: each new entry should read as RICHLY and SPECIFICALLY as the exemplars above — never less detail, never more abstract. Output JSON array of strings.`;
    })(),
  },
  starcraft_anchor_entity: {
    theme: 'Starcraft-coded lone witness for landscape — Blizzard / Sam Didier / Glenn Rane / Trent Kaniuga tradition. Three faction codes — Terran (rust-industrial), Protoss (gold-crystalline), Zerg (organic-biomech). Lone armored figure / hovering crystalline drone / distant alien-creature silhouette. NO franchise nouns (no Terran / Protoss / Zerg / marine / zealot).',
    touchpoints: [
      'lone armored figure in industrial gear',
      'hovering crystalline drone glowing gold',
      'distant alien-creature silhouette against horizon',
      'rust-industrial walker mech tiny in frame',
      'gold-armored psionic warrior in profile',
      'organic-biomech crawler in middle distance',
      'lone industrial worker with welding rig',
      'distant gold-crystalline observer-figure',
      'small bug-creature silhouette on hill',
      'industrial APC vehicle parked far',
      'gold-armored scout with energy blade',
      'tiny ground-trooper team in single file',
      'distant biomech tower-fauna',
      'lone tech-engineer with portable scanner',
      'crystalline hovering sentinel',
    ],
    instructions: `Each entry is ONE Starcraft-coded small witness, 15-40 words. NO franchise nouns. Output JSON array of strings.`,
  },
  starcraft_moment: {
    theme: 'Starcraft-coded candid landscape moments. Blizzard concept-art tradition. Each entry 15-30 words.',
    touchpoints: [
      'WALKING — long stride across industrial waste',
      'STANDING WATCH — rifle braced',
      'KNEELING — at half-buried crystalline artifact',
      'POINTING — at distant feature',
      'SCANNING — handheld device sweeping',
      'CASTING SHADOW — long in late light',
      'CHANNELING — psionic energy from glowing palm',
      'PROBING — at organic-biomech growth',
      'STALKING — body low and silent',
      'OBSERVING — through optical-scope',
      'CLIMBING — onto crashed transport',
      'TAKING SAMPLE — vial from creep pool',
      'COMMUNICATING — wrist-comm at face',
      'WAVING — to distant ally silhouette',
      'PAUSING — head tilted to listen',
    ],
    instructions: `Each entry is ONE simple Starcraft-coded landscape moment in 15-30 words. Output JSON array of strings.`,
  },
  starcraft_deep_distance: {
    theme: 'Starcraft-coded far-back signature features. Blizzard concept-art tradition. Distant Terran-style industrial mining rig. Protoss-style gold-crystalline tower receding. Zerg-style biomech tower-fauna on horizon. Distant battlecruiser-style ship hovering. Each entry 25-50 words. NO franchise nouns.',
    touchpoints: [
      'distant industrial mining rig miles away',
      'gold-crystalline tower receding into atmosphere',
      'organic-biomech tower-fauna on horizon line',
      'capital ship hovering low far away',
      'crashed shipyard half-overgrown by creep',
      'planetary atmosphere band visible above terrain',
      'gas giant or ringed planet filling sky',
      'distant artillery barrage smoke columns',
      'forge-city silhouette miles distant',
      'mountain of crystalline outcrops in haze',
      'biomech-coral reef formation extending to horizon',
      'rusted military citadel on far ridge',
      'gold-spires of warrior shrines distant',
      'creep-spread coverage at vanishing point',
      'orbital weapon platform visible overhead',
    ],
    instructions: `Each entry is ONE Starcraft-coded far-back signature, 25-50 words. NO franchise nouns. Output JSON array of strings.`,
  },
  startrek_anchor_entity: {
    theme: 'Star-Trek-coded lone witness for landscape — Probert / Sternbach / classic-Trek painted-matte tradition. Lone robed pilgrim. Distant federation-style shuttle. Lone observer at horizon. Tiny sensor probe. Single survival pod. NO franchise proper nouns.',
    touchpoints: [
      'lone robed pilgrim climbing temple steps',
      'distant federation-style shuttle in low atmosphere',
      'lone observer at canyon rim with telescope',
      'tiny sensor probe hovering low',
      'single survival pod at rest position',
      'lone monk-figure with prayer beads',
      'distant landing party single-file silhouette',
      'lone meditation-figure on stone outcrop',
      'tiny away-team-style scout walking ridge',
      'single banner-bearer on temple courtyard',
      'lone water-carrier with vessel',
      'distant agricultural worker tending field',
      'lone guard at temple gateway',
      'single hover-bike crossing plain',
      'lone navigator with handheld map device',
    ],
    instructions: `Each entry is ONE Star-Trek-coded small witness, 15-40 words. NO franchise nouns. Output JSON array of strings.`,
  },
  startrek_moment: {
    theme: 'Star-Trek-coded candid landscape moments. Probert / Sternbach painted-matte tradition. Each entry 15-30 words.',
    touchpoints: [
      'PRAYING — kneeling at temple altar',
      'CLIMBING — temple-step ascent',
      'POINTING — at distant shuttle approaching',
      'STANDING SENTINEL — staff in hand',
      'CHECKING DEVICE — handheld glowing readout',
      'WAVING SIGNAL — hand raised toward horizon',
      'KNEELING — at offering bowl',
      'STRIDING — across open plain',
      'CARRYING — water-vessel on shoulder',
      'SCOUTING — bent low reading tracks',
      'STARGAZING — head tilted to sky',
      'GUIDING ANIMAL — leading pack-beast',
      'PROBING — scanner over ancient stone',
      'MEDITATING — cross-legged on outcrop',
      'BOWING — palms together facing horizon',
    ],
    instructions: `Each entry is ONE simple Star-Trek-coded landscape moment in 15-30 words. Output JSON array of strings.`,
  },
  startrek_deep_distance: {
    theme: 'Star-Trek-coded far-back signature features. Probert / Sternbach painted-matte tradition. Distant Federation-style starship in atmosphere. Temple-spire complex at horizon. Red-desert mountains receding. Orange-stone monastery far away. Multi-tier farm village. Each entry 25-50 words.',
    touchpoints: [
      'distant Federation-style starship in atmosphere',
      'temple-spire complex at far horizon',
      'red-desert mountain range receding',
      'orange-stone monastery on cliff far away',
      'multi-tier farm village in valley',
      'classical colonnade ruins miles distant',
      'green-bronze tower silhouette',
      'matte-black mechanical-cube station overhead',
      'volcanic forge-city on distant ridge',
      'bone-rust military outpost far away',
      'planetary ring visible through atmosphere',
      'distant pyramid-temple receding into haze',
      'agricultural patchwork extending to horizon',
      'distant capital ship docking at orbital platform',
      'mountainside carved statues miles distant',
    ],
    instructions: `Each entry is ONE Star-Trek-coded far-back signature, 25-50 words. NO franchise nouns. Output JSON array of strings.`,
  },
  mass_effect_atmosphere_detail: {
    theme: 'Mass-Effect-coded atmospheric detail — BioWare / Sparth / Matt Rhodes tradition. CLEAN-FUTURE-MEETS-DISTINCT-ALIEN. Controlled color palette — blues, oranges, purples — never gaudy. Holographic UI elements, biotic-energy effects, neural-link cabling, sleek alloy textures. Each entry 25-50 words. NO franchise nouns.',
    touchpoints: [
      'holographic UI panel displaying galaxy map glowing soft blue',
      'biotic-energy crackle along chamber wall edges',
      'neural-link cabling looping in elegant arcs from ceiling',
      'controlled blue ambient strip lighting',
      'sleek alloy walls catching cool light',
      'translucent partition glowing with internal data flow',
      'mass-effect-field shimmer around doorway',
      'orange holo-projection mid-air with data graphs',
      'curved bench glowing soft amber',
      'data-stream pillars rising through chamber',
      'translucent observation glass with rippling field-distortion',
      'purple-cyan twin-light gradient washing wall',
      'levitating sample container with energy-field bubble',
      'transparent floor-tile reactive to footsteps',
      'orange warning strobe — controlled rhythm',
    ],
    instructions: `Each entry is ONE Mass-Effect-coded atmospheric detail, 25-50 words. CLEAN futurism with controlled color. Output JSON array of strings.`,
  },
  mass_effect_deep_distance: {
    theme: 'Mass-Effect-coded far-back signature — BioWare / Sparth atmosphere. Citadel-style curved arm-spire receding into space. Distant alien archology silhouette through observation glass. Massive holo-projection visible at far chamber end. Star-system gate visible through floor-window. Each entry 25-50 words. NO franchise nouns.',
    touchpoints: [
      'curved arm-spire silhouette receding through observation glass',
      'alien archology distant through floor-window',
      'massive holo-projection at far chamber end',
      'star-system gate visible through panoramic window',
      'fleet of capital ships at distant docking yard',
      'mass-relay-style rotating gate in deep distance',
      'planetary curvature visible at observation deck horizon',
      'mountain-spire alien city distant through fog',
      'orbiting space station visible far through glass',
      'multi-level catwalk descending into glowing far end',
      'gas-giant analog filling distant observation window',
      'cosmic nebula curtain through huge glass dome',
      'fleet-yard with capital ships under construction',
      'distant antenna array silhouetted against twin suns',
      'Forerunner-style ruin glimpsed far below',
    ],
    instructions: `Each entry is ONE Mass-Effect-coded far-back signature, 25-50 words. CLEAN futurism. NO franchise nouns. Output JSON array of strings.`,
  },
  mass_effect_incident: {
    theme: 'Mass-Effect-coded incident — 40%-gated visible disruption. BioWare clean-future vibe. Biotic-energy surge visible. Holo-conference active. Defense-field activation. Cargo loading. Spotlight calibration. Each entry 25-50 words.',
    touchpoints: [
      'biotic-energy surge along corridor edges',
      'holo-conference active — translucent figures-of-light',
      'defense-field activation — orange shield shimmer rising',
      'cargo loading platform raising payload visible',
      'spotlight calibration scan sweeping chamber',
      'data-pillar core actively transferring — vertical light stream',
      'mass-effect-field test — distortion ring expanding',
      'medical drone in flight transferring sample',
      'security checkpoint armed and active — barrier raised',
      'transit pod docking at chamber port',
      'console alert — operator-style soft chime visible as light pulse',
      'medical bay — readout displays cycling',
      'observatory tracking active — telescope-array repositioning',
      'training drone formation in chamber',
      'galaxy-map active and rotating slowly',
    ],
    instructions: `Each entry is ONE Mass-Effect-coded incident, 25-50 words. CLEAN futurism. Output JSON array of strings.`,
  },
  halo_anchor_entity: {
    theme: 'Halo-coded lone witness for landscape — Bungie / 343 Industries / Sparth / Pat Rawlings tradition. Lone armored marine (small in frame). Distant Pelican-style dropship in flight. Solo scout vehicle. Lone observer on ridge. Distant scout marine team (silhouette only). NO franchise proper nouns (no Spartan / Pelican / Warthog).',
    touchpoints: [
      'lone armored marine on ridge in profile',
      'distant gunship hovering in middle distance',
      'solo scout vehicle on frontier road',
      'observer on rock outcrop with binoculars',
      'sniper prone with bipod rifle',
      'lone Forerunner-style hovering sentinel-drone',
      'tiny dropship descending from far ridge',
      'engineer with portable scanner array',
      'scout marine silhouette cresting hill',
      'standing soldier helmet under arm watching horizon',
      'lone pilot walking toward grounded ship in distance',
      'distant patrol team in single-file silhouette',
      'observer with energy-shield emitter glowing',
      'tracker reading footprints in soft soil',
      'lone radio-operator with antenna deployed',
    ],
    instructions: `Each entry is ONE Halo-coded small witness, 15-40 words. NO franchise proper nouns. Output JSON array of strings.`,
  },
  halo_moment: {
    theme: 'Halo-coded candid landscape moments — what the small witness is doing. Bungie / 343 / Sparth tradition. Each entry 15-30 words.',
    touchpoints: [
      'SCANNING — handheld scanner sweeping',
      'POINTING — at distant Ring arc visible',
      'STANDING WATCH — rifle held low and ready',
      'KNEELING — at half-buried Forerunner-style artifact',
      'WALKING — long stride toward horizon',
      'PROBING — scanner over ancient marker',
      'CLIMBING — ridge with three-point contact',
      'WAVING SIGNAL — flare gun raised',
      'CASTING SHADOW — long in afternoon light',
      'TAKING SAMPLE — vial in alien soil',
      'CHECKING WRIST-COMM — looking at glowing readout',
      'PAUSING — hand to visor watching sky',
      'TRACKING — bent low, reading prints',
      'OVERWATCH — prone with rifle scope to eye',
      'GLIDING — hover-bike across plain',
    ],
    instructions: `Each entry is ONE simple Halo-coded landscape moment in 15-30 words. Output JSON array of strings.`,
  },
  halo_deep_distance: {
    theme: 'Halo-coded far-back signature features — the deepest layer. Bungie / 343 / Sparth atmosphere. Ring-installation arc visible across sky (the signature). Ancient precursor megalith looming on horizon. Distant Forerunner-style structure piercing the clouds. Crashed UNSC-style ship overgrown. Massive shield-world cap visible at horizon. Each entry 25-50 words.',
    touchpoints: [
      'ring-installation arc visible across the sky',
      'ancient precursor megalith looming on horizon',
      'distant Forerunner-style structure piercing low clouds',
      'crashed military-class ship half-overgrown in valley',
      'shield-world cap visible at horizon curving up',
      'cosmic gate ring active with blue distortion',
      'orbital fleet visible at far edge of sky',
      'colossal ancient pillar miles distant',
      'descending dropship silhouette against ring',
      'ringworld inner-surface curve receding to vanishing point',
      'mega-fauna silhouette on the horizon line',
      'distant city-state on far ridge',
      'ancient amphitheater ruin half-buried in plain',
      'glowing energy beam ascending from horizon',
      'star-forge furnace silhouette miles away',
    ],
    instructions: `Each entry is ONE Halo-coded far-back signature, 25-50 words. NO franchise proper nouns. Output JSON array of strings.`,
  },
  guardians_atmosphere_detail: {
    theme: 'Guardians-of-the-Galaxy-coded atmospheric detail — James Gunn / Jack Kirby cosmic / 70s album-cover sci-fi tradition. PLAYFUL-EXTRAVAGANT-WEIRD cosmic interiors. Saturated color is the signature — neon, classical, rainbow-clashing palettes. Less gritty than Star Wars, more whimsical-cosmic-grand. Each entry 25-50 words. NO skulls. NO Star-Lord / Knowhere / Rocket / Groot proper nouns.',
    touchpoints: [
      'rainbow-prismatic refraction through crystalline pillars',
      'neon-orange holographic signage in unknown glyphs flickering',
      'kaleidoscopic floor tiles pulsing with rhythmic light',
      'levitating colored orbs drifting through chamber',
      'cosmic dust motes in shafts of violet light',
      'iridescent fluid streaming down translucent wall channels',
      'gold-leaf crystalline lattice catching pink-cyan light',
      'electromagnetic ribbons curling through air',
      'pulsing magenta-cyan trim along corridor edges',
      'spice-incense smoke curling through saturated lights',
      'amber neon backlight diffusing through stained-glass-style alien panels',
      'cosmic confetti drift suspended in zero-G',
      'rainbow oil-slick patterns shimmering across floor',
      'glowing alien plant clusters in translucent pots',
      'twin-cyan-magenta searchlights sweeping cosmic dust',
    ],
    instructions: `Each entry is ONE Guardians-coded atmospheric detail, 25-50 words. Format: "DETAIL — visual description". SATURATED COLOR is the signature. PLAYFUL not macabre. NO skulls, NO franchise nouns. Output JSON array of strings.`,
  },
  guardians_deep_distance: {
    theme: 'Guardians-coded far-back signature features — the deepest layer. James Gunn / Jack Kirby cosmic. Spire-cities receding into cosmic haze. Temple-arcade vanishing point. Color-saturated cathedral interior depth. Kaleidoscopic geometry stretching out. Distant cosmic phenomenon framing architecture. Each entry 25-50 words. NO skulls.',
    touchpoints: [
      'spire-city receding into rainbow cosmic haze',
      'temple-arcade vanishing to distant glowing altar',
      'color-saturated cathedral interior with depth',
      'kaleidoscopic geometry stretching to horizon',
      'distant cosmic phenomenon (nebula / lens) framing architecture',
      'multi-tier balcony arches receding into purple-cyan distance',
      'far-end glowing arch of energy',
      'crystal forest growing through chamber walls into distance',
      'distant chamber with massive levitating orb',
      'nebula visible through far observation dome',
      'series of arch-portals descending into rainbow light',
      'orbital ring fragment visible through stained-glass wall',
      'cosmic court receding to throne-platform',
      'distant gas-giant filling deep window',
      'arcade of glowing alien plant towers vanishing point',
    ],
    instructions: `Each entry is ONE Guardians-coded far-back signature, 25-50 words. PLAYFUL-COSMIC, NOT macabre. Output JSON array of strings.`,
  },
  guardians_incident: {
    theme: 'Guardians-coded incident — 40%-gated visible disruption. James Gunn / Jack Kirby cosmic vibe. Festival commotion. Performance happening. Light show in progress. Cosmic alarm with rainbow strobe. Energy beam from ceiling. Each entry 25-50 words. NO violence, NO horror — playful-cosmic disruptions.',
    touchpoints: [
      'festival in progress — confetti and floating banners',
      'cosmic light show — concentric rainbow rings expanding',
      'performance stage with floating projectors visible',
      'rainbow strobe alarm pulsing rhythmically',
      'energy beam descending from ceiling chamber',
      'celebration — floating lanterns rising through atmosphere',
      'fountain of glowing prismatic liquid erupting',
      'levitation field active — objects suspended at odd angles',
      'glitter-snow falling from upper levels',
      'parade banner stretching across upper arch',
      'illuminated bubble of cosmic energy drifting through chamber',
      'fireworks-equivalent — bursts of cosmic plasma overhead',
      'spectacle device active — visible energy art form',
      'translucent ceremony curtain rising',
      'rainbow lens flare from distant chamber light',
    ],
    instructions: `Each entry is ONE Guardians-coded incident, 25-50 words. PLAYFUL-COSMIC disruption only. NO violence, NO horror. Output JSON array of strings.`,
  },
  dune_anchor_entity: {
    theme: 'Dune-coded lone witness for vast desert vistas — Frank Herbert / Denis Villeneuve aesthetic. ONE small figure / craft proving scale of the empty desert. Robed desert pilgrim. Hover-skiff with insectoid blades. Riding atop massive sand-creature silhouette. Sietch-clan messenger. Sandstone ridge-climber. Each entry 15-40 words. NO franchise proper nouns (no Fremen, no ornithopter, no Shai-Hulud).',
    touchpoints: [
      'lone robed desert pilgrim walking dune crest',
      'insectoid-bladed hover-flyer crossing midground',
      'rider atop massive sand-creature silhouette',
      'sietch-clan messenger on dune ridge',
      'sandstone ridge-climber with rope',
      'desert hover-skiff with twin-thruster trail',
      'spice-harvester maintenance crew tiny on the dune',
      'lone observer on outcrop with hand to brow',
      'tribal scout with staff and face wrap',
      'sand-gunship hovering low in middle distance',
      'shrouded figure kneeling for prayer',
      'caravan-bus crossing distant dune line',
      'sandblade-rider mid-glide across crest',
      'desert messenger with banner unfurling',
      'lone trader with pack-beast silhouette',
    ],
    instructions: `Each entry is ONE Dune-coded small witness, 15-40 words. Format: "ENTITY — visual description at TINY/SMALL frame proportion". NO franchise proper nouns in output language. Output JSON array of strings.`,
  },
  dune_moment: {
    theme: 'Dune-coded candid landscape moments — what the lone witness is doing in the vast desert. Small-scale verbs that add story to the still. NO epic-scale heroics. Frank Herbert / Villeneuve aesthetic. Each entry 15-30 words.',
    touchpoints: [
      'CRESTING DUNE — silhouetted on crest, robe billowing',
      'PRAYING — kneeling toward distant horizon',
      'WALKING — staff strikes sand, footprints behind',
      'SHADING EYES — looking toward distant horizon storm',
      'POINTING — at far-off silhouette',
      'TRACKING — bent low, reading sand patterns',
      'CARRYING — water-vessel slung over shoulder',
      'STANDING — hands clasped, watching distance',
      'CLIMBING — ridge with rope',
      'GUIDING — caravan beast trailing behind',
      'SENDING SIGNAL — banner snapping in wind',
      'KNEELING — at half-buried artifact',
      'PAUSING — to drink from canteen',
      'GLIDING — sandblade trail behind',
      'CASTING SHADOW — long in twin-sun light',
    ],
    instructions: `Each entry is ONE simple Dune-coded landscape moment in 15-30 words. Format: "ACTION-VERB-CAP — body position + tool/object". GROUNDED candid moment. Output JSON array of strings.`,
  },
  dune_deep_distance: {
    theme: 'Dune-coded far-back signature — the deepest layer of the desert vista. Frank Herbert / Villeneuve atmosphere. Distant sandworm-trail in dunes. Twin-sun horizon corona. Polar ice cap visible at horizon. Spice-harvester operation glimpsed far. Cliff-built carved-stone city silhouette. Sandstorm wall miles wide. Mountains rising through dust. Each entry 25-50 words.',
    touchpoints: [
      'distant sandworm-trail churning dunes far away',
      'twin-sun horizon with double corona haze',
      'polar ice cap visible at far horizon',
      'spice-harvester operation glimpsed in middle distance',
      'cliff-built carved-stone city silhouette miles away',
      'sandstorm wall miles wide approaching',
      'mountain range rising through dust haze',
      'gas giant filling 30% of sky',
      'eclipse arch across the heavens',
      'caravan train tiny at horizon vanishing point',
      'rising dust devil column miles tall',
      'crashed alien wreck half-buried on horizon',
      'shimmering heat-mirage distorting horizon line',
      'cave-mouth in cliff face glowing at far distance',
      'distant battle smoke columns rising',
    ],
    instructions: `Each entry is ONE Dune-coded far-back signature, 25-50 words. Format: "FEATURE — description at deep-distance". NO franchise proper nouns. Output JSON array of strings.`,
  },
  aliens_atmosphere_detail: {
    theme: 'Aliens-coded atmospheric detail — H.R. Giger / Ridley Scott / Cameron / Ron Cobb tradition. Specific atmospheric/textural elements that bring biomech-hive / derelict-spacecraft / abandoned-colony / processor interiors to life — condensation, steam, dripping fluid, sodium emergency lighting, red strobes, exposed cables, biomech secretion textures, foggy haze, dust motes, ash particles. Each entry 25-50 words.',
    touchpoints: [
      'sodium-yellow emergency strip lighting along floor / wall channels',
      'red emergency strobe pulsing rhythmically through smoke',
      'biomech resin dripping from ribbed ceiling',
      'condensation streaming down cold steel walls',
      'low-hanging haze of vapor and chemical mist',
      'exposed cable bundle hanging like vines',
      'wet-organic secretion glistening on walls',
      'dust motes suspended in shafts of light',
      'steam venting from corner pipes',
      'cracked ceramic floor with dark stains',
      'flickering single fluorescent tube',
      'ash particles drifting through still air',
      'frost on cryo-equipment surfaces',
      'amber warning light strobing in foreground',
      'glistening fluid pooled on grating',
    ],
    instructions: `Each entry is ONE atmospheric / textural detail, 25-50 words. Format: "DETAIL NAME — description of what it looks like + where it sits in the architecture + sensory hook". H.R. Giger / Cameron-Aliens / Cobb-industrial tradition. Output JSON array of strings.`,
  },
  aliens_deep_distance: {
    theme: 'Aliens-coded far-back signature features — the deepest layer of the architecture interior. Something glimpsed through a doorway / down a corridor / across a hangar that anchors the franchise feel. Derelict ship interior section glimpsed through bulkhead. Vast atmospheric processor cavity. Hive chamber receding into dark. Cryo-bay row vanishing to vanishing point. Each entry 25-50 words.',
    touchpoints: [
      'derelict ship interior section glimpsed through opened bulkhead',
      'atmospheric processor vast cavity descending into haze',
      'biomech hive chamber receding into resin dark',
      'cryo-bay row vanishing toward distant frost-fog',
      'abandoned corridor stretching to distant blast door',
      'cargo hold opening with crates extending to dark',
      'sterile lab chamber across vast hangar',
      'reactor core glow visible down maintenance shaft',
      'collapsed deck visible through breach',
      'control room visible through cracked glass partition',
      'engine room with idle machinery glimpsed beyond',
      'medbay row of stasis pods extending into dimness',
      'observation deck with windows extending to space',
      'cathedral-scale Engineer-style chamber receding into vapor',
      'multi-level catwalk system descending to foundry deck',
    ],
    instructions: `Each entry is ONE far-back signature feature, 25-50 words. Format: "FEATURE NAME — description + how it sits at the depth of the frame + atmospheric haze". Aliens-franchise visual language. Output JSON array of strings.`,
  },
  aliens_incident: {
    theme: 'Aliens-coded incident — a 40%-gated visible disruption woven into the architecture scene. NOT a character or creature. A space-disturbance — fire / breach / steam / leak / electrical fault / structural failure / radiation alarm visible. Each entry 25-50 words.',
    touchpoints: [
      'electrical fault — sparks showering from severed cable',
      'hull breach — vapor venting from cracked panel',
      'fire — flames licking up a corner',
      'fluid leak — pooling acidic liquid spreading',
      'steam burst — column erupting from broken pipe',
      'radiation alarm — amber strobe pulsing on dark wall',
      'structural failure — beam half-collapsed, debris scattered',
      'door cycle malfunction — bulkhead half-closed sparking',
      'reactor flare — sudden bloom of intense light from far end',
      'cryo-vapor leak — wall of mist rolling along floor',
      'computer console fire — flame and smoke from terminal',
      'gravity fluctuation — debris suspended at odd angles',
      'fluid spill across grating — viscous and toxic-colored',
      'spotlight beam — sweeping through smoke haze',
      'systems failure — multiple lights flickering, dim emergency strips',
    ],
    instructions: `Each entry is ONE visible incident, 25-50 words. Format: "INCIDENT NAME — description of what happened + visible evidence". Disruption that's seen in the frame. NO characters, NO creatures. Output JSON array of strings.`,
  },
  cozy_warmth_source: {
    theme: 'The ONE dominant warmth source defining each cozy sci-fi interior — every cozy space has its own specific source of warmth (visual + emotional). Each entry names a single warmth source with enough detail that Sonnet+Flux can render the room AROUND that warmth. Each entry 20-50 words.',
    touchpoints: [
      'amber engine-bay glow leaking through floor grates',
      'grow-lamp lighting a hanging garden of xeno-ferns',
      'cooking steam from a galley pot, kettle whistle',
      'bioluminescent moss/lichen cluster casting soft teal',
      'tealight cluster / candles in an alien sconce',
      'amber console panel with old-style toggles glowing warm',
      'fireplace hearth fueled by alien crystals',
      'body heat — sleeping person under blanket, breath fogging visor',
      'reactor-coolant pipe radiating cherry-red warmth',
      'samovar / hot-drink dispenser with steam',
      'sun-shaft through window from a yellow-class star',
      'string-light cluster (paper-lantern strings strung across beams)',
      'forge-glow from a small fabricator working a part',
      'incense brazier with smoldering xeno-resin',
      'aquarium tank with bioluminescent specimens',
      'amber holo-projector throwing gentle ambient glow',
      'oven hatch open spilling baking heat into the cabin',
      'fire-pit on a balcony watching the stars',
      'workbench task-light bent over a project',
      'lava-lamp-style bioluminescent fluid lamp',
    ],
    instructions: `Each entry is ONE dominant warmth source, 20-50 words. Format: "WARMTH NAME — visual description + how it lights the room + sensory hook". The warmth should be the FOCAL point of the room's atmosphere. Variety across all 30: machinery / culinary / biological / electrical / fire-based / ambient cosmic / body / ritual. NO outdoor weather. NO industrial-cold-blue lights. Each is intimate, lived-in, dominant. Output JSON array of strings.`,
  },
  alien_city_drama: {
    theme: 'Path-specific drama events for alien-city scenes — visible incidents that bring story to a still of a vast alien metropolis. Examples: street protest with crowd torches, atmospheric phenomenon over city (auroras, debris field, eclipse), military lockdown checkpoint, alien festival with hanging lanterns, sky-train passing between megabuildings, fire on lower-tier ledge, parade with banners. Each entry 25-50 words.',
    touchpoints: [
      'street protest — crowd with torches in lower-tier plaza',
      'atmospheric phenomenon — aurora curtains over the skyline',
      'military lockdown — checkpoint with patrol drones',
      'alien festival — hanging paper lanterns and floating spirit lamps',
      'sky-train passing between megabuildings',
      'fire breakout — flames licking up a tower face',
      'parade — banners and music drifting up from a boulevard',
      'orbital debris streaks through upper atmosphere',
      'religious procession — robed figures crossing skybridge',
      'alien holiday — neon-sign flicker and festival color',
      'sandstorm wall arriving at city outskirts',
      'duel in the streets — two figures circling in a plaza',
      'capital-ship arrival — descending lights through clouds',
      'flood — water rising through lowest-tier streets',
      'parade of mechs in service display',
    ],
    instructions: `Each entry is ONE visible drama element woven into an alien city scene, 25-50 words. Format: "DRAMA NAME — description of what's happening, where in the city, what the viewer SEES". Visible from a wide shot — NOT internal-only events. Variety: civil unrest, atmospheric phenomena, religious/festival, military, technological, environmental, criminal, ceremonial. Output JSON array of strings.`,
  },
  alien_city_anchor_entity: {
    theme: 'Lone city-witness entities for alien-city scenes — a SINGLE figure / vehicle visible at TINY/SMALL frame proportion in a vast alien metropolis. Street-level witnesses, sky-tier traffic, low-altitude flyers. NOT capital ships, NOT cities (we ARE in the city), NOT megastructures. Just lone witnesses: a vendor, a hovercar, a pedestrian, a patrol drone, a lone skybridge walker. Each entry 15-40 words.',
    touchpoints: [
      'lone hovercar threading between towers',
      'sky-tier pedestrian crossing a transparent skybridge',
      'street vendor at illuminated stall',
      'patrol drone hovering at intersection',
      'lone monk-figure on temple steps',
      'small delivery transport with cargo box',
      'rooftop figure with hands on railing',
      'street performer in motion (acrobat)',
      'old alien sitting on park bench',
      'rickshaw-style pulled vehicle',
      'lone cyclist on bridge',
      'food-cart with steaming wok',
      'hooded passerby with weather cloak',
      'rideable alien creature with single passenger',
      'maintenance worker on cabling',
    ],
    instructions: `Each entry is ONE lone witness in a city, 15-40 words. Format: "ENTITY NAME — visual description of one figure/vehicle at TINY/SMALL scale within the alien city". NEVER crowds, NEVER capital ships, NEVER architecture (that's the city itself). Output JSON array of strings.`,
  },
  alien_city_deep_distance: {
    theme: 'The signature deep-distance feature defining the alien-city FAR-back layer. Each city has a horizon-defining detail beyond the immediate megabuilding cluster — distant orbital ring, ecumenopolis canyon vanishing to horizon, megabuilding piercing clouds, planetary curvature at top of skyline, distant temple-spire, broken arcology silhouette. Each entry 20-50 words.',
    touchpoints: [
      'orbital ring visible overhead through gap in towers',
      'distant ecumenopolis canyon vanishing to horizon',
      'megabuilding spire piercing low clouds',
      'planetary curvature visible at horizon',
      'distant temple-spire silhouette',
      'broken arcology ruin on horizon',
      'gas-giant analog filling 30% of distant sky',
      'space elevator threading through atmosphere',
      'collapsed sector visible miles away as broken silhouette',
      'fleet of capital ships docked at distant spaceport',
      'twin-moon arc rising over skyline',
      'distant volcanic geyser plume visible behind city',
      'second-city across the bay/canyon at far distance',
      'orbital fragment falling slowly through air',
      'auroral curtain stretching to horizon',
    ],
    instructions: `Each entry is ONE deep-distance signature feature, 20-50 words. Specific visible feature that punches up the far-back layer. NOT generic atmospheric haze. Output JSON array of strings.`,
  },
  megastructure_drama: {
    theme: 'Path-specific drama events for megastructure scenes — visible incidents at colossal post-planetary engineered scale. Examples: energy beam firing from structure, ring-section rotating slowly, atmospheric leak venting, fleet passing through hangar, construction-mech swarm working surface, debris field of dead ships nearby. Each entry 25-50 words.',
    touchpoints: [
      'energy beam firing from a structure aperture',
      'ring-section rotating against starfield',
      'atmospheric leak venting — geyser of vapor escaping',
      'fleet passing through a hangar maw',
      'construction-mech swarm working the surface',
      'debris field of dead ships drifting nearby',
      'capital-ship docking at a port the size of a city',
      'gravity-shear distortion bending light around structure',
      'planetary mining — extraction beam cutting into asteroid',
      'wormhole gate active — blue ring of distortion',
      'massive door opening to reveal interior canyon',
      'meteor shower impacting hull plates',
      'reactor flare — sudden bloom of light from spine',
      'mass eject — payload launching from accelerator',
      'shipyard frame holding a half-built capital ship',
    ],
    instructions: `Each entry is ONE visible megastructure-scale drama, 25-50 words. Format: "DRAMA NAME — description of what's happening and what the viewer SEES at megastructure scale". Variety: combat, atmospheric, mechanical, civic, industrial, environmental. Output JSON array of strings.`,
  },
  megastructure_anchor_entity: {
    theme: 'Lone megastructure-scale witness entities — a SINGLE small vehicle / figure / ship visible at TINY/SMALL frame proportion against the megastructure. Capital ships are TINY against a megastructure; fighters are SUB-pixel; engineers in suits are dust motes. Each entry 15-40 words.',
    touchpoints: [
      'small shuttle threading toward docking maw',
      'fighter-wing in formation passing structure spine',
      'lone construction-mech welding hull plates',
      'engineer in EVA suit tethered to cable',
      'capital ship dwarfed by structure scale',
      'cargo train of orbital pods',
      'inspection drone with spotlight',
      'tug pulling derelict freighter',
      'racing skiff threading between rings',
      'lifeboat drifting from venting section',
      'maintenance crawler on hull surface',
      'fleet courier flashing recognition lights',
      'survey probe with deployed instruments',
      'sentinel-drone with weapon array',
      'tiny human silhouette in observation window',
    ],
    instructions: `Each entry is ONE lone witness at megastructure scale, 15-40 words. Format: "ENTITY NAME — visual description". NEVER cities, NEVER groups, NEVER the megastructure itself. Single small witness proving scale. Output JSON array of strings.`,
  },
  megastructure_deep_distance: {
    theme: 'The signature deep-distance feature defining the megastructure FAR-back layer. Planet visible through structure gap, gas-giant looming behind, fleet at far edge, secondary megastructure on horizon, cosmic phenomenon framing the structure. Each entry 20-50 words.',
    touchpoints: [
      'planet visible through structural gap',
      'gas giant looming behind megastructure',
      'second megastructure on opposite horizon',
      'cosmic phenomenon (nebula / lensing) framing structure',
      'fleet at far edge of structure',
      'destroyed twin-structure ruin in distance',
      'sun rising behind structure spine',
      'asteroid field beyond structure',
      'wormhole event in deep background',
      'orbital ring fragment seen edge-on',
      'planetary atmosphere band visible through gap',
      'distant capital battle — far ships exchanging fire',
      'meteor storm beyond structure',
      'cosmic ray storm lighting deep space',
      'collapsing star (supernova) in far background',
    ],
    instructions: `Each entry is ONE specific deep-distance signature feature, 20-50 words. Specific visible mega-feature far behind the megastructure. Output JSON array of strings.`,
  },
  landscape_anchor_entity: {
    theme: 'Lone wilderness witness entities for alien-landscape scenes — a SINGLE figure / creature / small vehicle placed in midground-back of an alien wilderness as a SCALE PROVER (TINY/SMALL frame proportion). NEVER cities, NEVER capital ships, NEVER megastructures, NEVER architecture. Just lone witnesses in the wild — vac-suit explorers, native creatures, scout drones, ground rovers, hovering probes, single tents, lone xeno-fauna. Each entry 15-40 words.',
    touchpoints: [
      'vac-suit explorer in EVA gear with backpack',
      'native alien creature (sentient biped)',
      'native alien creature (quadruped fauna)',
      'native alien creature (avian flier)',
      'small scout drone (octagonal, hovering)',
      'six-wheel exploration rover',
      'lone climber with rope on rock face',
      'single survival tent with antenna',
      'small landing pod (single-occupant)',
      'rappelling scientist on cliff face',
      'lone hunter tracking prey',
      'medic with field kit beside fallen explorer',
      'cartographer with theodolite tripod',
      'small spherical probe trailing tether',
      'lone xeno-fauna (massive but distant)',
      'jetpack scout silhouette',
      'lone monk-like figure in robe-and-suit',
      'gas-mask explorer wading through tide',
      'sniper prone with bipod rifle',
      'sample-collector with case in hand',
    ],
    instructions: `Each entry is ONE lone wilderness witness entity, 15-40 words. Format: "ENTITY NAME — visual description of the entity at TINY/SMALL scale in alien-landscape composition". Variety required across all entries: human explorers in EVA gear, native alien creatures (sentient AND fauna), small scout vehicles, single survival objects. NO cities, NO architecture, NO capital ships, NO megastructures, NO crowds, NO multiple figures. ALWAYS a single witness. Output JSON array of strings.`,
  },
  landscape_moment: {
    theme: 'The candid action moment a lone wilderness witness is captured doing — a small-scale verb that adds story to a landscape still. Each entry is ONE simple visible action: cresting a ridge, hesitating at the canyon edge, kneeling at strange formation, scanning the horizon, approaching alien glow, brushing dust from artifact. NOT epic-scale heroics — small candid moments that show "she/he/it is real and alive in this landscape." Each entry 15-30 words.',
    touchpoints: [
      'CRESTING RIDGE — silhouetted as horizon emerges',
      'HESITATING — paused at canyon edge',
      'KNEELING — at strange ground formation',
      'SCANNING HORIZON — hand to visor',
      'APPROACHING GLOW — alien light source ahead',
      'BRUSHING DUST — from buried artifact',
      'WADING — through alien liquid',
      'CLIMBING — three-point grip on rock face',
      'POINTING — at distant feature for companion',
      'TAKING SAMPLE — vial in alien soil',
      'SETTING UP CAMP — tent half-erect',
      'FOLLOWING TRACKS — kneeling at print',
      'CASTING SHADOW — backlit by twin suns',
      'STANDING STILL — taking in vastness',
      'SCOPING — through optic at distance',
    ],
    instructions: `Each entry is ONE simple landscape moment in 15-30 words. Format: "ACTION-VERB-CAP — body position + tool/object". The action is SMALL-SCALE candid (not combat, not heroics) — a witness moment in alien wilderness. Examples: "CRESTING RIDGE — silhouetted figure topping ridge, distant horizon emerging beyond"; "KNEELING AT ARTIFACT — figure low to ground, hand pressed to luminous alien formation". GROUNDED, single moment, readable in first 5 words. Output JSON array of strings.`,
  },
  landscape_deep_distance: {
    theme: 'The signature deep-distance feature that defines the alien-landscape FAR-back layer. NOT generic "atmospheric haze" — a specific MEGA-FEATURE looming on the horizon that proves the world is alien AND vast. Examples: 10km-tall gas geyser, megaflora silhouette, distant alien herd migration, crashed generation ship overgrown, megafauna walking the horizon, alien archology miniature on far ridge, eclipse arch, falling debris field, gravitational lensing distortion. Each entry 20-50 words.',
    touchpoints: [
      '10-kilometer gas pillar venting cryogenic vapor',
      'megaflora silhouette — 500m trees miniature on horizon',
      'distant alien herd migrating across plain',
      'crashed generation ship overgrown by jungle',
      'megafauna silhouette walking horizon line',
      'alien archology miniature on distant ridge',
      'eclipse arch across sky',
      'falling debris field — meteor shower at horizon',
      'gravitational lensing distortion ring',
      'tidal mountain of liquid methane rising slowly',
      'twin-sun corona haloing distant peaks',
      'ringed gas giant filling 30% of horizon',
      'aurora curtains stretching to horizon',
      'sandstorm wall miles wide approaching',
      'cosmic ray burst lighting upper atmosphere',
      'mega-creature breaching alien ocean miles away',
      'spore cloud the size of a city on horizon',
      'glassed crater field stretching to vanishing point',
      'orbital ring fragment falling through atmosphere',
      'thunderstorm system with continental-scale lightning',
    ],
    instructions: `Each entry is ONE specific deep-distance signature feature, 20-50 words. Format: "FEATURE NAME — description of what it looks like + sense of distance/scale". Variety: gas geysers, distant herds, crashed wrecks, megafauna, atmospheric phenomena, orbital fragments visible, lensing/cosmic effects. NO generic "alien sky" or "atmospheric haze". Each must be a SPECIFIC visible mega-feature that punches up the far-back layer. Output JSON array of strings.`,
  },
  rugged_male_explorer_outfits: {
    theme: 'Tactical sci-fi EXPLORER / ROGUE / ASSASSIN outfits for a male character — Destiny Guardian / Destiny 2 Hunter / Mass Effect operative / Halo ODST / Mandalorian protagonist / Cad Bane / Star-Lord / Cowboy Bebop Spike / Han Solo with armor / John Wick in space. Armored cloaks over sealed helms, tactical armor over thermal underlayers, weapon-bristled mercenary kit, weathered cybernetic-augmented operative gear. He is CAPABLE, MYSTERIOUS, stylish-tactical — Destiny Guardian energy.\n\nFULLY CLOTHED RULE — NEVER shirtless, NEVER bare-chested, NEVER exposed torso, NEVER tank top, NEVER sleeveless, NEVER beefcake. Torso is ALWAYS covered in armor / coat / pressure suit / harness.\n\nABSOLUTE BAN — NO Mandalorian (the word) / NO beskar / NO T-visor / NO Boba Fett / NO Star Wars (the words). Flux renders the franchise IP from those tokens. Use generic descriptive language instead (sealed visor / amber HUD faceplate / full-coverage helm / armored cloak with hood).',
    touchpoints: [
      'Destiny 2 Guardian Hunter — armored cloak + sealed helm + utility belt + tactical armor',
      'Destiny 2 Guardian Titan — heavy plate armor + helmet + shoulder mantle',
      'Destiny 2 Guardian Warlock — armored robe-coat + bond-strap + visor helm',
      'Mass Effect operative — armored field tactical with curved plates + visor helm',
      'Mass Effect Shepard-coded — sealed helmet + tactical armor with shoulder pauldrons',
      'Halo ODST drop-trooper male — full sealed helmet + ballistic harness + flight suit',
      'Cad Bane bounty hunter (generic) — wide-brim hat + armored duster + twin pistols',
      'Star-Lord operative — armored jacket + helmet (handheld) + utility belt',
      'Cowboy Bebop Spike Spiegel — fitted blazer over tactical underlayer + sidearm + smoke',
      'cyberpunk operative — long armored coat + neural visor + augmented arm covered by sleeve',
    ],
    instructions: (() => {
      // Optional: load male-rendered exemplars if available (none yet for ME path)
      let exemplars = [];
      try {
        exemplars = require('fs').existsSync('/tmp/me-exemplars.json')
          ? require('/tmp/me-exemplars.json')
          : [];
      } catch (_) {}
      const exemplarBlock = exemplars.length
        ? `\n\n═══════ HEARTED EXEMPLARS — WRITE NEW ENTRIES LIKE THESE ═══════\n\n${exemplars.map((e, i) => `EXEMPLAR ${i + 1}: ${e}`).join('\n\n')}\n\n═══════ END EXEMPLARS ═══════\n\n`
        : '';
      return `Write ${COUNT} male sci-fi explorer/rogue/assassin OUTFIT entries, 50-80 words each. Each entry MUST describe a man in full tactical kit — outfit, armor pieces, weapons, identity markers. Setting is just a 2-3 word prefix; the BODY of every entry is the CHARACTER + OUTFIT + GEAR description.

CORRECT FORMAT (every entry must look like this):
"SETTING-NAME — [skin/race detail], [helmet/face], [armor/coat description], [tech pieces], [weapons], [identity marker]."

EXAMPLE OF CORRECT ENTRY:
"DEAD ORBITAL RING CITY — bronze-skinned operative with weathered stubble and ritual face scars, sealed amber-HUD visor helm, gunmetal-grey armored duster over segmented ceramic chest plate, life-support backpack with cyan power cells, twin pistols in shoulder holsters, rifle mag-locked to spine, vibroblade on hip"

WRONG (DO NOT DO THIS — these are settings, not outfits): "TIDE-LOCKED STORM WORLD OUTPOST — research garrison perched on cliff overlooking eternal hurricane"

Every entry MUST have ALL of these in the description body:
1. Skin tone + identity marker (scars / tattoos / stubble / beard / shaven skull / cybernetic eye)
2. Helmet OR head covering (sealed visor / full-coverage helm / hood / face-wrap / gas mask)
3. Body armor / coat / harness (armored duster / armored cloak / sealed pressure suit / ballistic harness over thermal layer)
4. Tactical color (gunmetal / matte-black / coyote-tan / olive-drab / oxblood / charcoal)
5. 2-4 tech pieces (life-support backpack / wrist-comm / mag-boots / sensor pod / cybernetic limb)
6. Multiple visible weapons (rifle / pistol / shotgun / vibro-blade / grenades)${exemplarBlock}
EVERY new entry MUST have:
- DISTINCTIVE non-default skin color or anatomy (deep umber / weathered tan / pale-grey / yellow-green / bronze / scarred / cybernetic-eyed / long-bearded / shaven-skulled / pointed-eared / etc.) — never just "human man"
- TACTICAL OPERATIVE OUTFIT BASE — armored cloak with hood / armored field jacket / armored duster coat / sealed pressure suit / segmented plate armor over thermal layer / ballistic harness over flight suit. Tactical color (gunmetal-grey / matte-black / coyote-tan / olive-drab / oxblood / charcoal / sand-bleached / weathered-brown). His TORSO IS COVERED — never bare.
- SEALED HELMET / FULL-COVERAGE HELM / VISOR HELM / FACEPLATE / GAS MASK (70% of entries — others have helmet held in hand / hood up / face-wrap-with-goggles)
- 2-4 distinct ENGINEERED TECH PIECES (life-support backpack / wrist-comm / sensor pod / mag-boots / grenade bandolier / scanner / cybernetic eye / shoulder pauldron / mantled cloak / power-pack glow)
- WEAPON-BRISTLED — multiple visible weapons (rifle slung over back / pistol holstered at thigh / shotgun mag-locked / vibro-blade on hip / grenade pouches / breach charges)
- IDENTITY MARKERS (battle scar across face / cybernetic eye replacement / weathered stubble / face tattoos / clan markings / cigar clenched in teeth / bandaged hand / missing finger / war paint)

ABSOLUTE BANS:
- NEVER shirtless, NEVER bare-chested, NEVER exposed torso, NEVER tank top, NEVER sleeveless, NEVER beefcake. Even cyborgs wear coats over their torso.
- NO "Mandalorian" / NO "beskar" / NO "T-visor" / NO "T-shaped visor" / NO Boba Fett / NO Star Wars (Flux renders the franchise IP)
- NO form-fitting bodyglove fashion / NO sleek runway suits / NO clean parade uniforms / NO pilot cockpit suits without armor / NO glamour kit
- NOT bulky-tank power-armor brute — this is a TACTICAL OPERATIVE / Destiny Guardian / rogue / assassin, not a Halo MJOLNIR berserker

Vary the role: bounty hunter / mercenary / planetary surveyor / EVA fieldworker / scout / marksman sniper / breacher / scavenger / cave-diver / hazmat specialist / heavy-weapons operative / cyberpunk operative / Destiny Guardian Hunter or Titan or Warlock / Mass Effect operative.

The bar: each entry should read as a Destiny Guardian, Mass Effect operative, Halo ODST, or sci-fi rogue/assassin you'd see in a hostile alien planet cinematic. Tactical + capable + stylish + COVERED. Output JSON array of strings.`;
    })(),
  },
  explorer_outfits_female: {
    theme: 'tactical-explorer outfits for female sci-fi characters — every entry is a complete SEALED ARMORED outfit emphasizing FUNCTION over form. Treat the character with the same dignity as a male soldier — full coverage, professional military / explorer kit, no cheesecake.',
    touchpoints: [
      'Halo Spartan armor (full sealed plate)',
      'Mass Effect N7 (sealed tactical suit)',
      'Edge of Tomorrow exosuit (functional rig)',
      'Aliens colonial marine armor',
      'Starship Troopers power armor',
      'Halo ODST armor',
      'The Expanse Martian Marine armor',
      'Apollo / NASA EVA suit (sealed pressurized)',
      'Dune stillsuit (utility-focused desert tactical)',
      'Mandalorian armor (plated full coverage)',
    ],
    instructions: `Each entry is a complete tactical-explorer outfit, ~30-50 words. The pool MUST express WIDE VISUAL VARIETY across color, texture, silhouette, and style-family — Kevin specifically called out the previous pool was repetitive "white spacesuit". Each entry must look DISTINCT from the others when rendered.

VARIETY MANDATE — across all 25 entries, hit each of these axes multiple times:
- COLOR variety: red / orange / olive / black / desert tan / cobalt blue / brass / chrome / forest green / oxblood / charcoal / off-white / sand / arctic-white / midnight / copper-brown. NOT mostly white.
- TEXTURE variety: weathered leather / segmented metal plates / canvas-and-kevlar / chitin-coded carapace / ceramic / synthetic mesh / fabric-armor hybrid / brushed alloy / coated polymer
- SILHOUETTE variety: slim scout / bulky power-armor / hooded cloaked / vest-and-pants / heavy backpack / minimalist / poncho-draped / cape-flowing / tank-top-with-armored-plates
- STYLE-FAMILY variety: imperial soldier / merchant ranger / drifter scavenger / corporate operative / monastic order / desert nomad / arctic explorer / jungle ranger / cyber-edgerunner / clean military / dirty mercenary / scientific researcher / pirate / pilot

REQUIRED ELEMENTS per entry:
- A specific COLOR or material identity that distinguishes it
- A specific STYLE-FAMILY (don't just be "tactical generic")
- FUNCTIONAL EQUIPMENT (utility belt, gauntlets, boots, sidearm, scanner, gear pouches, climbing-rope, etc.)
- About 50% of entries should include head covering (helmet, hood, visor, mask, breathing apparatus); 50% should have head uncovered (hair visible, hood pulled back, helmet held in hand)

NEVER use words: crop, midriff, bare-arms, exposed-stomach, cleavage-emphasized, bikini, swimsuit, sexy, alluring. (Form-fitting is OK if balanced with armor plates.)

EXAMPLES of varied entries the pool should contain (use these as flavor anchors, then invent 25 distinct):
- Weathered ochre-leather scavenger duster with rusted iron-plate gauntlets and goggled half-mask — Mad-Max-meets-Outer-Worlds
- Sleek black-and-magenta corporate operative suit with chrome accents and slim sidearm holster — Cyberpunk-2077 vibe
- Olive-drab military tactical fatigues with kevlar vest, bulky backpack, mirrored helmet visor
- Burgundy hooded monastic-order robe with armored undersuit, sigil-engraved chestplate
- Brass-and-rust dieselpunk explorer jacket with goggle-helmet and oversized utility bandolier
- Forest-green ranger cloak over canvas tactical with sniper-rifle slung, beard if applicable
- Arctic-white sealed parka with thermal-gel insulation and tinted goggles — only ONE entry like this
- Desert-tan moisture-recycler with face-wrap, dust-weathered, sand-pitted
- Heavy charcoal power-armor with red service stripes, bulky helmet
- Slim mercenary jumpsuit in black-and-orange with multi-tool belt

Each entry should feel like a CHARACTER you'd recognize from sci-fi cinema — distinct visual identity.`,
  },
  architecture_style: {
    theme: 'distinct architectural style vocabulary for alien cities — each entry names a specific structural language so Flux renders varied architecture instead of defaulting to "cyberpunk spires" every time. Each entry 30-60 words.',
    touchpoints: [
      'brutalist concrete (Stalinist scale)',
      'biomechanical Giger chitin',
      'crystalline Halo-Forerunner lattice',
      'Mayan stepped ziggurats',
      'Kirby cosmic kaleidoscopic',
      'Gaudí flowing organic',
      'art-deco retrofuture (Hugh Ferriss)',
      'Soviet dieselpunk industrial',
      'walking-megastructure (Howl)',
      'cliff-built carved-stone (Petra-scale)',
      'crashed ship assimilated into city',
      'modular hab-spheres (NASA-Apollo)',
      'floating-platform archipelago',
      'underground cyclopean halls',
      'mushroom-cap domed colonies',
      'temple-city processional avenues',
      'desert-oasis walled (Middle Eastern)',
      'Banks Culture elegant curves',
      'orbital ring segments grounded',
      'shipyard cradle integrated',
    ],
    instructions: `Each entry names a SINGLE distinct architectural style with specific structural language. Format: "STYLE NAME — visual description of forms / materials / textures / scale". Vary across all 100 entries — never repeat a style; each must feel like a different civilization or aesthetic tradition. NO generic "alien architecture" — every entry has a precise style identity.`,
  },
  character_action: {
    theme: 'Clear simple action verbs for a sci-fi female explorer — what she is DOING right now. Each entry is ONE simple action, no obscure setup, no extra props. The verb leads. Reader sees the action immediately.',
    touchpoints: [
      'BATTLING — firefight from cover',
      'CLIMBING — three points of contact on alien rock',
      'RAPPELLING — controlled descent on rope',
      'AIMING — rifle braced at distant target',
      'CROUCHING — examining tracks / artifact on ground',
      'HACKING — at glowing alien terminal',
      'SPYING — scope to eye from cover',
      'WADING — through alien liquid up to knees',
      'SNEAKING — flat against wall, peeking around corner',
      'SIGNALING — flare gun raised for pickup',
      'DEFENDING — rifle aimed at offscreen threat',
      'REPAIRING — kneeling with multitool at damaged tech',
      'HOLDING WEAPON — rifle low and ready, scanning',
      'KNEELING AT ARTIFACT — hand on alien relic',
      'TRACKING — body low and stalking through brush',
      'PUSHING THROUGH — shoulder against blast door',
      'PROTECTING — body shielding small object behind her',
      'ZIPLINING — sliding down cable in motion',
      'SCANNING — handheld scanner sweeping',
    ],
    instructions: `Each entry is ONE simple clear action in 15-30 words. NO obscure setups, NO extra props, NO numbered measurements, NO atmospheric details. Just: VERB + body position + weapon/tool. The reader must understand the action in the first 5 words.

Format: "ACTION-VERB-CAP — body position + tool/weapon + 1 simple detail". Example: "BATTLING — crouched behind cover, rifle braced against shoulder, muzzle flash". Another: "CLIMBING — three points of contact on sheer rock, fingers gripping ledge".

KEEP IT SIMPLE: short clear sentences, no rover descents, no compound scenarios, no "extracting data from research station". One verb, one action, one frame.

EVERY entry GROUNDED — feet on terrain or three points of contact. NO floating, NO mid-air.

Cover all genre categories: combat (battling), exploring (climbing/wading), tinkering (repairing/hacking), spying (surveillance/sneaking), hunting (tracking/stalking), reconnaissance (scanning/mapping), discovery (artifact/marker), survival (signaling/carrying), social (parley/conferring).

NO franchise proper nouns. NO superhero poses. Every action is a working professional doing real work.`,
  },
  starbot_anchor_entity: {
    theme: 'sci-fi anchor entities for StarBot scenes — what figure / ship / creature populates the scene at the prescribed scale. Each entry 15-40 words describing ONE entity type.',
    touchpoints: [
      'robed wandering explorer',
      'vac-suit scientist (Ad Astra/Interstellar)',
      'armored military soldier',
      'desert nomad in dust-cloak',
      'alien creature biped (sentient)',
      'alien creature quadruped (native fauna)',
      'tiny exploration shuttle',
      'mid-size cargo freighter',
      'elegant crystalline yacht',
      'oracle / ritual figure in flowing robes',
      'bipedal android / synthetic',
      'corporate operative in slim suit',
      'merchant / trader / spice-runner',
      'pilgrim / monastic / cultist',
      'jetpack-equipped scout',
      'beast-rider on alien mount',
      'small spherical drone',
      'six-legged crab-walker mech (small)',
      'cyber-edgerunner with augments',
      'arctic-suited polar explorer',
    ],
    instructions: `Each entry describes ONE entity type — a figure, ship, creature, or vehicle that could be a SILHOUETTE / SMALL element in a scene path render. Variety required across all 50 entries: humanoid figures of various professions, ships of various designs, alien creatures of various biologies, vehicles of various scales. NO franchise lookalikes. Each entry is the TYPE not a specific named character.`,
  },
  alien_sky_layer: {
    theme: 'sci-fi alien sky / overhead atmosphere layers for StarBot. Each entry describes what is OVERHEAD in 15-40 words — the sky layer that completes the scene composition.',
    touchpoints: [
      'twin suns at different altitudes',
      'ring-curve overhead (Halo/Niven)',
      'gas giant looming (Avatar)',
      'aurora cascades (green/magenta)',
      'Milky Way galactic arch',
      'binary eclipse / solar corona',
      'orbital station visible architecture',
      'storm-broken sun with shaft',
      'bioluminescent spore clouds',
      'plasma storm with lightning',
      'dust-red overcast Mars sky',
      'crystal-blue clear vacuum view',
      'meteor shower streaks',
      'distant supernova remnant',
      'spaceship traffic visible as dots',
      'partial-eclipse twin-moons',
      'pre-dawn pink terminator',
      'storm wall approaching',
      'nebula color clouds visible by day',
      'orbital ring under construction',
    ],
    instructions: `Each entry is a complete sky layer description for a sci-fi scene. The sky is the upper third of the frame composition. Vary across all 30 entries: day skies / night skies / dawn / dusk / storm / clear / nebula / orbital structures visible / multiple celestial bodies / weather phenomena. NO franchise proper nouns (don't say "Death Star overhead" — describe it generically).`,
  },
  surprise_element: {
    theme: 'sci-fi secondary subjects woven into scenes to add visual interest. Each entry describes ONE element that can be placed at midground or deep midground.',
    touchpoints: [
      'alien creature watching',
      'fellow explorer at distance',
      'enemy patrol moving in formation',
      'distant hunter with rifle',
      'parked ship ready for departure',
      'descending transport ship',
      'crashed ship wreck',
      'companion drone hovering',
      'alien artifact pulsing',
      'abandoned outpost in distance',
      'distant smoke column / conflict',
      'orbital station overhead',
      'wildlife flock passing',
      'rival explorer at far edge',
      'alien statue colossal',
      'enigmatic floating orb',
      'crashed probe blinking',
      'alien procession in distance',
      'damaged patrol droid half-buried',
      'beast carcass freshly killed',
      'alien mount tethered',
      'distant battle aftermath',
      'alien pilgrimage line',
      'rival faction encampment',
      'collapsed bridge dangling cables',
    ],
    instructions: `Each entry is a single secondary subject that adds story to a scene without overwhelming the primary subject. Format: "ELEMENT NAME — description of what it looks like + where it sits in the scene + atmospheric/story implication". Variety across all 100 entries: creatures, sentient figures, ships, drones, vehicles, artifacts, ruins, distant phenomena, traces of past events. Each must imply a wider world.`,
  },
  explorer_outfits_male: {
    theme: 'tactical-explorer outfits for male sci-fi characters — every entry is a complete SEALED ARMORED outfit emphasizing FUNCTION over form. Sealed coverage, equipment-laden, professional military / explorer kit, like Master Chief or Aliens colonial marine.',
    touchpoints: [
      'Halo Spartan armor',
      'Mass Effect N7',
      'Edge of Tomorrow exosuit',
      'Aliens colonial marine',
      'Starship Troopers power armor',
      'The Expanse Martian Marine',
      'Apollo / NASA EVA suit',
      'Dune stillsuit (utility-focused)',
      'Mandalorian armor (plated)',
      'Mad-Max wasteland-scavenger',
      'Cyberpunk-2077 corporate operative',
      'Blade-Runner trenchcoat-detective',
    ],
    instructions: `Each entry is a complete tactical outfit in 30-50 words. Lead with the ARMOR LAYER. Emphasize SEALED COVERAGE. Include FUNCTIONAL EQUIPMENT (utility belt, gauntlets, boots, sidearm, scanner, gear pouches).

VARIETY MANDATE across all entries — hit each:
- COLORS: red / orange / olive / black / desert tan / cobalt / brass / chrome / forest green / oxblood / charcoal / off-white / sand / arctic-white / midnight / copper-brown
- TEXTURES: weathered leather / segmented metal / canvas-kevlar / chitin carapace / ceramic / mesh / brushed alloy
- SILHOUETTES: slim scout / bulky power-armor / hooded cloaked / vest-and-pants / heavy backpack / minimalist / poncho / cape-flowing
- STYLE FAMILIES: imperial soldier / merchant ranger / drifter scavenger / corporate operative / monastic order / desert nomad / arctic explorer / jungle ranger / cyber-edgerunner / clean military / dirty mercenary / scientific researcher / pirate / pilot

50% of entries include head covering (helmet/hood/visor/mask); 50% head uncovered (hair visible, hood pulled back, helmet held).`,
  },
  female_explorer_hairstyles: {
    theme: 'sci-fi female hairstyles — functional, helmet-compatible, characterful. Each entry is a hairstyle description in 10-25 words.',
    touchpoints: [
      'tight low ponytail (EVA-compatible)',
      'shaved sides with top braid',
      'long flowing loose for non-helmet wear',
      'twin space-buns Princess Leia inspired',
      'short pixie utilitarian',
      'shoulder-length asymmetric cut',
      'cornrows / box braids',
      'high topknot',
      'french-braided side-swept',
      'dreadlocks practical bound',
      'undercut with long top swept back',
      'mohawk practical short',
      'natural afro',
      'shaved head (military-clean)',
      'beaded warrior braids',
      'space-explorer half-up half-down',
    ],
    instructions: `Each entry describes ONE hairstyle in 10-25 words: cut + length + how it's worn + functional consideration (e.g., "for helmet clearance" or "for EVA work"). Variety across cut types, lengths, ethnicities, formality. Practical for sci-fi explorers doing real work.`,
  },
  male_explorer_hairstyles: {
    theme: 'sci-fi male hairstyles — functional, characterful, practical. Each entry 10-25 words.',
    touchpoints: [
      'high-and-tight military',
      'shaved head clean',
      'short slicked-back',
      'medium beard-and-mustache short hair',
      'long warrior braid',
      'top-knot samurai-coded',
      'dreadlocks tied back',
      'mohawk practical',
      'shaggy chin-length scavenger',
      'mustache-and-undercut',
      'corporate slicked',
      'desert-nomad headwrap-covered',
      'gray-bearded distinguished',
      'punk-spiked liberty',
      'cyberpunk-asymmetric',
      'beard-only bald',
    ],
    instructions: `Each entry describes ONE male hairstyle in 10-25 words: cut + length + facial hair (if any) + characterful detail. Variety across cuts, beards, ages, ethnicities, formality. Practical for sci-fi explorers.`,
  },
  female_explorer_accessories: {
    theme: 'signature accessory / weapon / tool for female sci-fi explorer. Each entry 10-25 words describing ONE accessory she carries visibly.',
    touchpoints: [
      'plasma pistol holstered',
      'long-range scanner handheld',
      'tactical climbing-rope coiled',
      'multi-tool clipped to belt',
      'sniper-rifle slung across back',
      'jetpack mounted between shoulders',
      'energy-sword sheathed at hip',
      'comm-headset wrapped around ear',
      'thermal-vision goggles on brow',
      'mech-frame backpack with sensor arms',
      'ceremonial staff / focusing-rod',
      'data-tablet at hip',
      'shotgun pump-action slung',
      'medical-kit shoulder-bag',
      'flame-projector hose to backpack',
      'pet drone hovering at shoulder',
    ],
    instructions: `Each entry describes ONE accessory: what it is + where she carries it + signature detail. Vary across weapons / tools / scanners / armor accessories / mounts / pets. Each accessory should look DISTINCTIVE and identity-anchoring.`,
  },
  male_explorer_accessories: {
    theme: 'signature accessory / weapon / tool for male sci-fi explorer. Each entry 10-25 words.',
    touchpoints: [
      'heavy assault rifle slung',
      'plasma-pistol thigh-holstered',
      'climbing-axe at hip',
      'multi-tool wristband',
      'large utility-backpack with antenna',
      'sword-and-shield strapped to back',
      'engineering-toolbelt utility',
      'scanner-visor lifted',
      'comm-headset',
      'flamethrower hose-to-pack',
      'sniper-rifle scoped',
      'med-kit shoulder slung',
      'flare-launcher at hip',
      'shovel / pickaxe gear-strapped',
      'jetpack',
      'pet drone',
    ],
    instructions: `Each entry: what + where + signature. Variety across weapons / tools / scanners / mounts. Each distinctive.`,
  },
  alien_planet_biome: {
    theme: 'alien planetary BIOMES — each entry is ONE distinctive ecological/geological identity used as a SETTING pool for the slot-pool composer. Used in alien-landscape path. Concise but specific — each biome is a 3-5 sentence description Sonnet weaves with other rolled axes.',
    touchpoints: [
      'Dune Arrakis dune sea',
      'Solaris sentient ocean',
      'Nausicaä toxic spore jungle',
      'Annihilation Shimmer (color-refracted)',
      'Avatar Pandora bioluminescent forest',
      'Beksinski painted dread plain',
      "Roadside Picnic Zone (broken physics anomalies)",
      'Tatooine binary-sun desert',
      'Hoth glacial polar',
      'Mustafar volcanic obsidian river',
      'methane seas of Titan',
      'crystal cave forests',
      'tidal mudflats with bioluminescent algae',
      'mountain plateaus of frozen ammonia',
      'subterranean kelp-forests in low-G',
    ],
    instructions: `Each entry is 60-120 words describing ONE specific alien biome. Include: PRIMARY GEOLOGY (what the ground is — sand / basalt / chitin / ice / glass), DOMINANT BIOLOGY (what grows / lives here — towers, kelps, crystalline mineral life, plasma fauna), ATMOSPHERIC CHARACTER (color of sky, particulate, weather), DISTINCTIVE FEATURE (the thing that makes THIS biome unmistakable — geyser fields / floating boulders / fractal coral / etc.), and SCALE CUE (how big the features are). Each biome must be VISUALLY DISTINCT from the others. Reference real-world biomes pushed to alien extremes (Atacama → glass-crystal desert at -200C; Yellowstone → planet-spanning geyser field; Amazon → bioluminescent jungle 500m canopy; Sahara → twin-sun ochre dune sea 1km dunes).`,
  },
  megastructure_setting: {
    format: 'simple',
    theme: 'SLIM atomic seeds for ICONIC CYBERPUNK BUILDINGS within a bustling sci-fi city — single notable towers featuring distinctive shape + MASSIVE HOLOGRAPHIC ADVERTISEMENTS (often sexy fashion-coded or seductive cyborg/android pitch) + dense neon signage + clear relationship to flying-vehicle traffic. Blade Runner 2049 / Cyberpunk 2077 / Ghost in the Shell aesthetic baked into every entry.',
    touchpoints: [],
    instructions: `Write 30 SLIM atomic cyberpunk-building seeds for a sci-fi cityscape. Each entry is ONE short phrase (20-30 words) naming a SINGLE notable building/tower within a cyberpunk megacity, with these elements ALWAYS baked into the seed text:

(1) Distinctive architectural shape (chrome obelisk / brutalist ziggurat / twisted spire / inverted pyramid / fractal-tiered / etc.)
(2) MASSIVE HOLOGRAPHIC ADVERTISEMENT visible on the building face — often a beautiful android/sexy fashion model/seductive geisha pitching a corporate product (sake / cybernetic upgrade / luxury fragrance / synthetic companion / etc.). Could also be a giant CEO face, propaganda banner, or animated kaiju logo — but lean into the "sexy ad" cyberpunk-trope flavor often.
(3) Dense neon signage (kanji / glyphs / brand logos / flickering tubes) wrapping or climbing the structure
(4) IMPLIED flight traffic — flight-deck balconies / anti-grav landing pads / hovering signage / drone-thoroughfares around the building

THE AESTHETIC: Blade Runner 2049's holographic Joi, Cyberpunk 2077's Lizzy Wizzy spire, Ghost in the Shell's geisha pop-up, Akira's neon-soaked apartment blocks, Fifth Element's vertical city. NEON, HOLOGRAMS, FLYING SPINNERS, DENSE.

Each entry must ALWAYS include:
- The distinctive building (architecture)
- A specific holographic advertisement (often featuring an attractive android/model/geisha — adult-coded fashion/luxury/cybernetic-product pitch)
- Neon signage wrapping it
- A hint of nearby flight traffic / hovering activity

Examples:
1. 800-meter chrome obelisk wrapped in 40-story holographic geisha advertising synthetic sake, neon-pink kanji climbing every column, anti-grav landing pads jutting from upper tiers.
2. Brutalist pyramid corporate tower, massive animated hologram of an iridescent android model in dripping lingerie pitching cybernetic enhancement serum, drone delivery thoroughfares ringing midsection.
3. Twisted Y-shaped Arasaka-style spire, projected face of a corporate CEO smiling across 200 stories, scrolling neon-red propaganda banners, executive spinner-pads ringing penthouse.
4. Inverted-pyramid residential tower with rotating holographic perfume ad showing nude android-figure spritzing glow-mist, electric-blue tube-neon spiraling its scaffold-clad base.
5. Black-mirror skyscraper with giant projected face of a smiling cyborg fashion model selling synth-coffee, hot-pink kanji vertical banners, hover-spinners darting between mid-tier balconies.
6. 200-floor housing block faced with animated mega-billboard of a synthetic geisha bowing in iridescent kimono advertising memory-implants, drone traffic streaking around its peak.
7. Spiral neon-helix tower with projected hologram of a winking pin-up android pitching corporate cigarettes, anti-grav cargo pads at every fifth tier, ion-trail vehicles passing through helix gaps.
8. Brutalist concrete block with full-facade hologram of a swimsuit-clad android lounging on synthetic beach selling vacation memory-tourism packages, neon-kanji climbing scaffolds.
9. Crystalline modular tower with each face displaying different rotating ad-hologram (sexy android pop-star / luxury cyber-watch / synth-companion), drone delivery formations between modules.
10. Pagoda-tiered skyscraper with massive hologram of a kimono-cyborg fashion model advertising designer cyborg-cosmetics, neon-red lantern strings between every tier, hover-taxi traffic at multiple elevations.
11. Coral-organic biomech tower with projected hologram of a translucent android beauty model pitching luxury skin-grafts, bioluminescent neon vines pulsing electric blue.
12. Stepped ziggurat-spire with rotating animated ad of a synthetic dancer in liquid-metal bodysuit selling holo-entertainment subscriptions, neon billboards on every terrace.

Format: ONE entry per line, 20-30 words each. Distinctive building + holographic ad (often sexy/fashion-coded) + neon signage + implied flight traffic. NO franchise proper nouns (Blade Runner / Tyrell / Coruscant / Arasaka — INSPIRED BY, not literal). NO "megastructure" / "Dyson" / "ringworld" — those are different paths. NO sexually explicit content — adult fashion / lingerie / pin-up / model-coded is fine; nudity OK if tasteful (no pornography).`,
  },

  megastructures: {
    theme: 'colossal artificial structures at planet-or-greater scale — orbital rings, Dyson constructs, planetary mantles. Civilization-as-superstructure. NOTE: this recipe builds the LEGACY MEGASTRUCTURES pool (POOLS.MEGASTRUCTURES). The active megastructure path uses MEGASTRUCTURE_SETTING (iconic buildings in cities) — see the megastructure_setting recipe above.',
    touchpoints: [
      'Halo ring (orbital ring world, visible curvature)',
      "Niven's Ringworld",
      'Dyson sphere/swarm (sun encapsulated)',
      'Bishop Ring habitats',
      "Banks's Culture orbital",
      "Trantor's planetary mantle",
      'Pillars-of-Heaven space elevators',
      'McGuire generation ships',
    ],
    instructions: `Scale must EXCEED planetary. Visible curvature, atmospheric haze at impossible distances. Scale provers: ships are dots, cities are dots-of-dots. Foreground ALWAYS has something at human-comprehensible scale for the brain to anchor on.`,
  },
  space_opera_scenes: {
    theme: 'spacecraft scenes — distinctive vessels with strong design DNA, in dramatic cosmic settings. Push HARD away from navy-grey-military and tail-fin-50s-rocket clichés.',
    touchpoints: [
      'Heighliners (Dune crystalline impossibles)',
      'Mass Effect Reaper (squid-organic alien)',
      'Babylon 5 Vorlon ship (organic crystalline)',
      'Heavy Metal magazine ships (Moebius / Druillet)',
      'Kirby cosmic vessels (impossible-geometry)',
      'Pacific Rim Kaiju silhouettes (alien biological)',
      'Star Wars Star Destroyer underbelly (low-angle hero)',
      "Banks's Culture ship aesthetics (organic / playful / immense)",
      'Eldar Craftworld (Warhammer 40K — graceful + alien)',
    ],
    instructions: `Ships must be VISUALLY DISTINCTIVE per entry — pick a DESIGN DNA (organic-biological / crystalline-lattice / Kirby-cosmic / ribbed-shell / impossible-geometry / weathered-cargo-haulers) and commit hard. NO gun-grey navy. NO blocky 60s-rocket. NO generic "sleek arrow." Each seed describes ONE ship type at compositional scale + environment that frames it.`,
  },
  space_opera_ships: {
    format: 'simple',
    theme: 'Cool ICONIC sci-fi spaceships with strong recognizable silhouettes and visible functional parts. Mass Effect Normandy / Halo UNSC Pelican / Cyberpunk Edgerunners AV-4 / Cowboy Bebop Bebop / Expanse Rocinante / Star Wars X-wing-class fighters / Star Trek shuttlecraft / Blade Runner Spinner aesthetic — INSPIRED BY, not literal franchise names. Every ship has a clear cockpit + wings/fins + engines + sometimes weapons.',
    touchpoints: [],
    instructions: `Write 30 SLIM atomic iconic sci-fi spaceship seeds. Each entry: ONE short phrase (20-35 words) naming a single ship + its DISTINCTIVE FUNCTIONAL ANATOMY.

THE FOCUS: COOL RECOGNIZABLE SHIPS with strong silhouettes the eye can read instantly. NOT abstract orb/sphere/megastructure blobs. NOT modern Earth naval (no aircraft carriers / battleships / destroyers). NOT steampunk / dieselpunk / brass-and-copper / Victorian zeppelin. NOT biomech / wraithbone / dolphin-shaped / creature-hull / chitin. PURE FUTURE SCI-FI silhouettes.

ALWAYS bake in:
(1) Specific HULL SHAPE — wedge / arrowhead / cigar / cruciform / disc / dart / blade / pod-cluster / hammerhead / forward-swept-wing / triangular-wedge / etc.
(2) Visible COCKPIT or BRIDGE TOWER — where the crew sits, near the front or upper hull
(3) Visible WINGS / FINS / NACELLES — angled, swept-back, or paired engines on pylons
(4) Visible ENGINES / THRUSTERS — glowing exhaust at the back, plasma trails, ion glow
(5) Optional: visible TURRETS / WEAPONS / SENSOR-ARRAYS / LANDING-GEAR / DOCKING-CLAMPS / CARGO-MODULES

Each ship should look like something out of Mass Effect / Halo / Cyberpunk 2077 spinners / Star Wars / The Expanse / Cowboy Bebop / Star Trek shuttles — clean, sleek-or-utilitarian sci-fi with named parts.

VARIETY across 30 entries — mix the categories evenly:
- SLEEK INTERCEPTORS / FIGHTERS (20-40m, wedge or dart, fast)
- ARMED FRIGATES / CORVETTES (80-200m, cruiser silhouettes, weapons visible)
- HEAVY HAULERS / CARGO-RIGS (200-500m, blocky modular industrial)
- ELEGANT SCIENCE / EXPLORATION VESSELS (150-300m, smooth lines, sensor arrays)
- WORKING SHIPS — tugs, miners, atmospheric transports (50-150m, utilitarian with visible tools)
- CIVILIAN — passenger shuttles, smuggler runabouts, pleasure yachts (30-100m)
- BIG GUNS — armed cruisers / patrol craft / strike-frigates (150-400m, weapon-heavy)

Examples:
1. Sleek 40-meter wedge-fighter with paired forward-swept wings, gunmetal hull with cyan accent stripes, twin plasma thrusters at rear, single cockpit canopy at the nose, wing-tip gauss cannons.
2. Boxy 180-meter modular corvette with rectangular cargo bay slung beneath central hull, bridge tower amidships with viewport row, four ion thrusters in square formation, dorsal twin-barrel turret.
3. Battered 320-meter cargo-rig with stacked container modules along central spine, exposed maintenance gantries with yellow safety rails, single bridge module forward, four massive fusion thrusters trailing blue exhaust.
4. Hammerhead-bow patrol cruiser 240 meters long with wide flat forward weapon platform, three bridge towers stepped along dorsal spine, paired engine nacelles on swept-back pylons, hull paneled in matte-charcoal armor.
5. Arrowhead-shaped 80-meter strike fighter with single canopy at apex, two delta-wings with leading-edge gauss-cannons, twin ramjet thrusters in tandem, ventral missile-bay.
6. 220-meter angular science cruiser with elongated forward sensor probe, glass observation dome at bow, paired ion-drive nacelles on extending pylons, hull painted clean white with orange identification bands.
7. 95-meter utility tug with chunky cylindrical hull, four-pronged docking claws extended forward, side-mounted maneuvering thrusters, single armored cockpit module at the rear, magnetic tow-arrays visible.
8. Sleek 65-meter civilian runabout with sweeping curved hull, panoramic forward viewport, two engine pods slung beneath wing-roots, single belly-mounted entry ramp lowered.
9. Heavy 380-meter assault carrier with broad flight-deck forward, three command towers along port flank, twenty visible launch tubes along ventral hull, paired massive engine nacelles aft glowing teal.
10. 110-meter Mass-Effect-Normandy-coded stealth frigate with rounded organic-clean curves, paired sweep-wing engine pods, central canopy bridge forward, ventral weapon recess, hull glowing soft blue along seams.
11. Cigar-shaped 280-meter generation transport with rotating habitat ring midship for spin-grav, paired RCS thruster clusters at bow and stern, exposed solar-panel arrays, no weapons.
12. Cruciform 130-meter strike interceptor with four perpendicular swept wings and a wing-tip engine on each, single canopy at intersection, central railgun protruding forward.

Format: ONE entry per line, 20-35 words each. Distinctive ship + clear silhouette + named functional parts. NO franchise proper nouns. NO modern Earth naval. NO steampunk / dieselpunk / brass-and-copper. NO biomech / creature-shaped / dolphin / whale / chitin / wraithbone. NO abstract "vessel with geometric volumes" — every entry must have a CLEAR readable silhouette.`,
  },
  space_opera_setting: {
    theme: 'DYNAMIC FIGHTER-ACTION SETTINGS — places where starfighters dogfight, recon, chase, or skim. Each entry is one specific action environment with motion-friendly cinematic depth. NO static landscape views. NO ground-level architecture. Pure space + atmospheric action contexts.',
    touchpoints: [
      'asteroid canyon (rocks at varied scale + tight spaces)',
      'debris field of broken capital wreck (twisted hull fragments)',
      'capital ship hull surface (skimming low along armor terraces)',
      'nebula cloud chase corridor (gas wisps + reduced visibility)',
      'station approach choke point (narrow corridor + defense turrets)',
      'planet ring plane traverse (ice + rock + reflected sunlight)',
      'low-orbital strike zone above industrial planet',
      'gas giant cloud dive (storm bands + lightning)',
      'enemy fighter formation interception zone',
      'orbital shipyard scaffolding maze (skeletal frames)',
      'comet tail trail (vapor streams)',
      'mining-belt industrial cluster (rigs + cargo frames)',
    ],
    instructions: `EACH ENTRY IS A DYNAMIC SCI-FI ACTION SETTING — 25-50 words. SINGLE FLOWING SENTENCE PER ENTRY. No ship described. No camera. Just the SETTING where the fighter is acting.

FORMAT: numbered 1-25. One sentence each.

Per entry MUST include:
- SETTING TYPE (canyon / debris field / hull surface / nebula corridor / station maze / etc.)
- MOTION FRIENDLINESS — tight spaces, obstacles to weave around, or open vistas with depth markers
- COSMIC ANCHOR (planet / station / capital backdrop / asteroid / nebula — at least one element)
- ONE memorable detail (drifting wreckage / lightning flash / running-lights pulsing / etc.)

VARIETY MANDATE across 25 entries:
- Tight spaces (50%): asteroid canyons / debris fields / station corridors / shipyard mazes / capital-hull skim
- Open vistas (50%): nebula chases / planet ring traverses / low-orbital strikes / gas giant dives / open void with capital backdrop

EXAMPLES (flavor anchors; invent 25 distinct):

1. Tight asteroid canyon with massive rocks tumbling at varied scales, narrow gaps between fragments forcing the fighter to weave through, distant starfield through the canyon opening.

2. Skimming low along the hull surface of a massive capital ship, armor terraces and weapon emplacements blurring past beneath the fighter, dorsal sensor pylons and antenna clusters rushing by.

3. Inside a debris field of a broken capital wreck, twisted hull fragments and glowing wreckage drifting at varied angles, vapor streams from ruptured fuel lines creating a smoky maze.

ABSOLUTE BANS:
- NO ship described (ships come from a separate axis)
- NO action described (actions come from a separate axis)
- NO ground-level / planetary-surface views — these are SPACE / HIGH-ATMOSPHERE settings
- NO cathedral / temple / fortress / planetary architecture
- NO franchise proper nouns

Output 25 numbered list entries.`,
  },
  busy_fleet_elements: {
    format: 'simple',
    theme: 'Scene-filling elements that populate dense sci-fi space scenes around a featured spaceship: EVA crews on tethers, magnetic dock grapples, supply ships parallel-running, refueling tenders, gantries with welding sparks, hauler queues, drone swarms, sensor buoys, debris fragments, capital ship hulls as deep-background scale anchors, station infrastructure, repair scaffolds, escort craft.',
    touchpoints: [],
    instructions: `Write 30 scene-filling sci-fi space elements that go AROUND the featured spaceship in a busy scene. One sentence each. Detailed, specific, visual — describe count + motion + glowing detail.

Mix industrial activity (EVA crews on tethers, gantries with welding sparks, magnetic grapples docking, supply ships running parallel, refueling tenders, cargo bay traffic) with combat support (escort craft, drone swarms, sensor buoys, capital ship silhouettes in deep background, debris fragments).

Each entry should add depth and density to a scene — not be the hero itself, just a textural element making the scene FULL.

Examples:
1. White EVA-suited figures moving like stretched marionettes along tether lines anchored to a hull breach, magnetic grapples glowing blue at contact points.
2. A parallel supply ship 200 meters off the starboard flank, exposed aluminum truss-work gantry extending across the gap, cargo pods crawling on rails.
3. The deep-background silhouette of a kilometer-class capital hull receding into atmospheric haze, lit window-grids speckling its flanks, weapon batteries flashing distantly.

Output 30 numbered list entries.`,
  },
  battle_dynamics: {
    format: 'simple',
    theme: 'Action and drama moments that bring a sci-fi space scene alive: weapons firing, shields flaring, hull-strikes sparking, missile contrails streaking, refinery accidents venting, reactor overloads glowing, debris tumbling, drive sections venting plasma.',
    touchpoints: [],
    instructions: `Write 30 action / drama moments that add visible activity to a sci-fi space scene. One sentence each. Frozen at a loaded instant — visual cues that read in a still frame.

Mix combat dynamics (laser bolts mid-flight, missile contrails arcing, shields flaring under impact, explosion blooms, hull-strike sparks) with industrial drama (refinery venting, reactor coolant flares, drive overloads, structural failures, escape pods launching).

Each entry adds motion + energy + drama to the frame.

Examples:
1. Twin energy lances mid-discharge crossing the frame in parallel streams, recoil-heat venting from accordion radiators glowing dull red.
2. Reactor coolant pump rupturing mid-frame, friction-heat sparks cascading through bulkhead struts, blue micro-discharges crackling along antenna edges.
3. A salvo of missiles spiraling outward in helical contrails, intercept bursts blooming in the deep midground, scattering hot debris.

Output 30 numbered list entries.`,
  },
  ship_action: {
    format: 'simple',
    theme: 'What the featured spaceship is doing in this exact frame — posture, motion, drive state, weapons status, hull condition. Verb-led when possible.',
    touchpoints: [],
    instructions: `Write 30 ship-action descriptions — what the featured sci-fi spaceship is DOING in the scene. One sentence each. Frozen at a loaded instant.

Mix dynamic combat (banking hard / strafing / firing main weapons / launching missiles) with industrial activity (docking with station / mating to refueling tender / opening cargo bay doors / deploying repair drones / venting coolant) with cinematic stillness (coasting cold through debris / drifting damaged / silent observation / mid-FTL exit).

Each entry adds posture and meaning to the featured ship.

Examples:
1. Drifting damaged through Lagrange anchorage, hull breach venting orange sparks, twin micro-adjustment thrusters firing crystalline vapor to maintain attitude.
2. Mating dock with parallel supply ship, exposed aluminum truss-work gantry extended, magnetic grapples engaging in blue arcs.
3. Banking hard 60 degrees through a debris field, engine plasma trails curving in a spiral, point-defense web tracking incoming fragments.

Output 30 numbered list entries.`,
  },
  space_opera_story_beat: {
    theme: 'ACTION NARRATIVE BEATS for fighter-action scenes — the dramatic moment the scene captures. Pursuit / Dogfight / Recon Discovery / Spy Mission Penetration / Wingmate Loss / Breakaway / Last-Stand / Bombing Run / Ambush / Daring Escape. Each entry sets the narrative stakes.',
    touchpoints: [
      'mid-pursuit fighter chase',
      'dogfight in tight formation',
      'recon discovery (sensor ping reveals threat)',
      'spy mission penetration past defenses',
      'wingmate just went down',
      'breakaway after critical mission',
      'last-stand defense run',
      'bombing run on capital target',
      'ambush sprung from debris',
      'daring escape through enemy formation',
      'rescue extraction under fire',
      'reconnaissance silent approach',
    ],
    instructions: `EACH ENTRY IS A NARRATIVE STORY BEAT — 20-35 words. SINGLE SENTENCE PER ENTRY. Describes the DRAMATIC MOMENT the scene captures — what's at stake, what just happened, or what's about to happen.

FORMAT: numbered 1-20. One sentence each.

Per entry MUST include:
- A NARRATIVE FRAME (mid-pursuit / dogfight peak / recon discovery / etc.)
- WHAT'S AT STAKE (rescue / escape / sabotage / silent observation / etc.)
- DRAMATIC TENSION (the moment of decision, action, or consequence)

VARIETY MANDATE across 20 entries:
- Combat beats (50%): dogfight peak / strafing run / bombing target / last-stand / ambush
- Pursuit/escape beats (25%): chase mid-flight / daring escape / breakaway / pursuit weave
- Stealth beats (15%): spy penetration / recon silent / sensor discovery / silent approach
- Loss/heroic beats (10%): wingmate destruction / rescue extraction / sacrifice moment

EXAMPLES (flavor anchors; invent 20 distinct):

1. Mid-pursuit fighter chase — the hero is being hunted by superior enemy formation through narrow asteroid corridors, every maneuver risking destruction.

2. Recon discovery — the hero's sensors just lit up with massive enemy presence, the moment of frozen realization before evasive action begins.

3. Bombing run on capital target — the hero is mid-strafing along an enemy capital's vulnerable section, weapons firing, dodging defense fire.

ABSOLUTE BANS:
- NO franchise proper nouns
- NO description longer than 35 words
- NO settings described
- NO ship described

Output 20 numbered list entries.`,
  },
  space_opera_composition: {
    theme: 'FIGHTER FRAMING / CAMERA PERSPECTIVES — how the camera frames the action. Cockpit POV / wingman view / under-the-keel skim / overhead chase / behind-shoulder / cinematic 3/4 / diving angle / asteroid-gap perspective / etc. Each entry is one specific camera framing rule.',
    touchpoints: [
      'cockpit POV looking forward through canopy',
      'wingman-view from companion fighter',
      'under-keel skim camera (skimming asteroid surface)',
      'overhead chase cam',
      'behind-shoulder pursuit framing',
      'cinematic 3/4 angle on the hero',
      'diving angle looking down past wings',
      'asteroid-gap perspective (thin opening)',
      'side-profile racing camera',
      'tail-chase POV (camera behind enemy)',
      'mid-bank rotated camera',
      'low-angle hero shot (camera below fighter looking up)',
    ],
    instructions: `EACH ENTRY IS A CAMERA FRAMING / COMPOSITION RULE — 15-30 words. SINGLE SENTENCE PER ENTRY. Describes WHERE THE CAMERA IS and how it FRAMES the fighter action.

FORMAT: numbered 1-20. One sentence each.

Per entry MUST include:
- CAMERA POSITION (cockpit / wingman / overhead / behind-shoulder / under-keel / etc.)
- WHAT THE FRAME SHOWS (forward through canopy / hero in 3/4 / etc.)
- ONE compositional detail (motion blur / depth-of-field / wide vs tight / etc.)

VARIETY MANDATE across 20 entries:
- POV cameras (35%): cockpit forward / canopy view / pilot's perspective
- Chase cameras (25%): behind-shoulder / tail-chase / wingman-view / overhead chase
- Cinematic angles (25%): 3/4 hero / low-angle dramatic / side-profile racing / diving angle
- Tight-spaces (15%): asteroid-gap / station-corridor / debris-thread / hull-skim

EXAMPLES (flavor anchors; invent 20 distinct):

1. Cockpit POV looking forward through the canopy, HUD targeting overlays visible against the starfield, hands gripping flight stick in foreground.

2. Wingman-view from a companion fighter at 50-meter offset, the hero captured in 3/4 angle banking right, engine plasma streaks blurring with motion.

3. Under-keel skim camera, the fighter rushing above an asteroid surface or hull terrace, scale-blurring detail rushing past beneath.

ABSOLUTE BANS:
- NO franchise proper nouns
- NO description longer than 30 words
- NO settings described (separate axis)
- NO ship described (separate axis)

Output 20 numbered list entries.`,
  },
  space_opera_lighting: {
    theme: 'SPACE-ACTION LIGHTING — engine bloom / weapon flash / nebula backlight / hull-strike spark / explosion glow / sun rim-light / planet earthlight / etc. Each entry is one specific lighting situation for fighter-action scenes.',
    touchpoints: [
      'engine plasma bloom as primary light',
      'weapon-fire flash from forward cannons',
      'nebula backlight (magenta-cyan diffuse)',
      'hull-strike spark + ricochet light',
      'explosion glow filling the frame',
      'distant sun rim-light on hull edges',
      'planet earthlight reflecting from below',
      'station floodlights catching the fighter',
      'shield-impact flare illuminating the cockpit',
      'missile contrail trail glow',
      'volumetric god-rays through nebula gaps',
      'cold deep-void starlight with strong contrast',
    ],
    instructions: `EACH ENTRY IS A LIGHTING SETUP — 20-35 words. SINGLE SENTENCE PER ENTRY. Describes the dominant light source and how it illuminates the fighter-action scene.

FORMAT: numbered 1-20. One sentence each.

Per entry MUST include:
- PRIMARY LIGHT SOURCE (engine bloom / weapon flash / nebula glow / sun / planet earthlight / etc.)
- COLOR / TEMPERATURE (cyan-blue / orange-red / magenta-violet / cold-white / etc.)
- HOW IT HITS THE HERO (rim-light on hull / fill on canopy / silhouette backlight / etc.)
- CONTRAST quality (dramatic chiaroscuro / soft volumetric / harsh strobing)

VARIETY MANDATE across 20 entries:
- Engine/weapon light (40%): plasma bloom dominant / cannon flash / missile trail glow / shield flare
- Cosmic light (35%): nebula backlight / sun rim-light / star strobe / volumetric god-rays
- Environment light (25%): planet earthlight / station floodlights / capital-ship hull-glow / explosion fill

EXAMPLES (flavor anchors; invent 20 distinct):

1. Engine plasma bloom as primary light — cyan-blue glow from the fighter's twin nozzles illuminating the hull and casting motion-streaks across the dark backdrop.

2. Nebula backlight in magenta and cyan, the fighter silhouetted against soft volumetric gas wisps, hull edges catching faint diffuse pink light.

3. Weapon-fire flash from forward cannons — harsh strobing white-blue light pulsing on the hull and momentarily blowing out the dark backdrop.

ABSOLUTE BANS:
- NO franchise proper nouns
- NO description longer than 35 words
- NO settings described (separate axis)
- NO ship described (separate axis)
- NO Earth-natural lighting (forest sunset / beach sunrise / etc.) — pure space/cosmic lighting

Output 20 numbered list entries.`,
  },
  space_opera_particulate: {
    theme: 'COSMIC PARTICULATE FOR FIGHTER-ACTION — debris haze, plasma cloud, nebula gas, ice crystals streaming, vapor trails, smoke contrails, atmospheric particle scattering. Adds depth and motion to the scene.',
    touchpoints: [
      'debris haze drifting through frame',
      'plasma cloud from engine wash',
      'nebula gas wisps swirling',
      'ice crystal streams in vacuum',
      'vapor contrail trail behind fighter',
      'smoke trail from damaged hull',
      'atmospheric particle scatter',
      'dust kicked up from low skim',
      'frost vapor from coolant vent',
      'asteroid pulverized fragments',
      'energy-weapon ionization residue',
      'electrical micro-discharge sparks',
    ],
    instructions: `EACH ENTRY IS A PARTICULATE / ATMOSPHERIC EFFECT — 15-30 words. SINGLE SENTENCE PER ENTRY. Describes airborne or vacuum particulate that adds depth and motion.

FORMAT: numbered 1-20. One sentence each.

Per entry MUST include:
- WHAT KIND of particulate (debris / plasma / gas / ice / vapor / smoke / dust / etc.)
- HOW IT MOVES (drifting / streaming / swirling / arcing / etc.)
- COLOR / OPACITY (faint magenta haze / orange plume / ice-white crystals / etc.)

VARIETY MANDATE across 20 entries:
- Engine/weapon particulate (35%): plasma wash, vapor contrails, smoke trails, ionization residue
- Debris particulate (30%): pulverized rock fragments, hull-strike sparks, asteroid dust, wreckage fragments
- Cosmic particulate (35%): nebula gas, ice crystals, planetary frost, electrical micro-discharge

EXAMPLES (flavor anchors; invent 20 distinct):

1. Plasma cloud trailing from the fighter's engine wash, cyan-blue ionized particles streaming behind in a turbulent vortex.

2. Debris haze drifting across the frame at varied speeds, broken hull fragments and dust particles scattering light from distant explosions.

3. Ice crystal streams in vacuum, the fighter passing through frozen vapor catching starlight as a sparkling cloud.

ABSOLUTE BANS:
- NO franchise proper nouns
- NO description longer than 30 words
- NO Earth-weather (rain / snow / fog / hail) — pure cosmic/sci-fi particulate
- NO settings described (separate axis)
- NO ship described (separate axis)

Output 20 numbered list entries.`,
  },
  space_opera_emotion: {
    theme: 'ACTION-MOOD EMOTIONAL DNA for fighter scenes — adrenaline, pursuit-thrill, desperation, defiant heroism, triumph, focused-calm-before-strike, dread of overwhelming force, righteous fury, exhilaration. Each entry is one emotional tone for the scene.',
    touchpoints: [
      'adrenaline rush mid-dogfight',
      'pursuit-thrill chasing target',
      'desperation breaking from disaster',
      'defiant heroism against odds',
      'triumph after critical kill',
      'focused calm before the strike',
      'dread of overwhelming force',
      'righteous fury at injustice',
      'exhilaration of breakneck speed',
      'silent stealth-tension',
      'last-stand resolve',
      'survival-mode raw nerve',
    ],
    instructions: `EACH ENTRY IS AN EMOTIONAL DNA TONE — 15-25 words. SINGLE SENTENCE PER ENTRY. Describes the emotional mood / energetic atmosphere of the fighter-action scene.

FORMAT: numbered 1-15. One sentence each.

Per entry MUST include:
- EMOTIONAL TONE (adrenaline / dread / triumph / desperation / etc.)
- ENERGETIC QUALITY (high-tempo / slow-tension / explosive / focused / etc.)
- VISUAL CUE that conveys it (sharp contrast / motion blur / wide eyes / etc.)

VARIETY MANDATE across 15 entries:
- High-energy: adrenaline / exhilaration / pursuit-thrill / fury / triumph
- Mid-energy: focused calm / defiant heroism / righteous resolve / survival-mode
- Tension: stealth-tension / dread / desperation / last-stand

EXAMPLES (flavor anchors; invent 15 distinct):

1. Adrenaline rush mid-dogfight, high-tempo motion blur and harsh-contrast lighting conveying frantic energy.

2. Defiant heroism against impossible odds, the hero fighter blazing forward with engine plasma at full burn despite overwhelming enemy presence.

3. Silent stealth-tension, the fighter creeping through cover with engines barely glowing, every hull seam dimmed.

ABSOLUTE BANS:
- NO franchise proper nouns
- NO description longer than 25 words
- NO settings described (separate axis)
- NO ship described (separate axis)

Output 15 numbered list entries.`,
  },
  weather_particulate: {
    format: 'simple',
    theme: 'Universal atmospheric particulate / weather effects that fill the air in a sci-fi scene — dust, mist, vapor, ash, plasma, aurora, radiation, glitter, etc.',
    touchpoints: [],
    instructions: `Write 30 atmospheric particulate / weather effects. Each entry: lowercase descriptive phrase — short body explaining how it fills the air and catches light. One sentence per entry.

Examples:
1. thick atmospheric haze — dense particulate suspending light into visible volumetric beams, distance fades into gradient
2. wind-driven dust haze — orange or amber dust streaming horizontally across the frame, sand-grain texture in the air
3. acid-rain fog — corrosive humid mist clinging to surfaces, vapor visible at ground level
4. ash drift — fine dark particulate falling slowly through the frame, accumulating on horizontal surfaces, sky overcast
5. ionized plasma shimmer — heat-rippled distortion across the frame, brief electric flickers along edges

Avoid duplicating: thick atmospheric haze, wind-driven dust haze, acid-rain fog, vapor streams from vents, clear cold air, ash drift. Invent NEW particulate — coral spore drift, magnetic-storm aurora veil, radiation snow, crystalline frost crystals suspended, bioluminescent plankton drift, gravitational lensing distortion, solar-wind ribbon, etc. Mix terrestrial, atmospheric, vacuum, and supernatural effects. Output 30 numbered list entries.`,
  },
  real_space_subjects: {
    format: 'simple',
    theme: 'SLIM atomic seeds for photoreal astrophotography — named real astronomical objects, ~15-25 words each. The brief composer layers in scale_provers / weather / surprise_element / story_beat / composition / lighting at render time, and Sonnet weaves it all into the polished multi-wavelength composite prompt. Pool entries provide the SUBJECT IDENTITY only; layering is the axis system\'s job.',
    touchpoints: [],
    instructions: `Write 30 SLIM atomic astronomical-subject seeds. Each entry is ONE short phrase (15-25 words) naming a real astronomical object + a 1-clause characterization of its distinctive visual signature. NO full scene paragraphs. NO scale-prover spacecraft (that's an axis layer). NO instrument framing language (the medium wrapper handles that). Just: named object + its defining visual feature.

Use the FULL CATALOG widely — never repeat the same object class. Messier (M1-M110), NGC catalog, named exoplanets (TRAPPIST-1 / Proxima b / Kepler-452b), supergiant stars (Betelgeuse / Rigel / Eta Carinae / R136a1 / VY Canis Majoris), planets + moons (Jupiter / Saturn rings / Io / Europa / Titan / Enceladus / Triton / Pluto-Charon), nebulae (Crab / Orion / Eagle / Carina / Helix / Cat's Eye / Veil / Lagoon / Trifid / Pelican / Tarantula / Boomerang / Pillars of Creation / Mystic Mountain), galaxies (Andromeda / Whirlpool / Sombrero / Cartwheel / Mice / Antennae / Stephan's Quintet), galaxy collisions (Antennae / Mice / Cartwheel), black holes (M87 / Sgr A* / Cygnus X-1), quasars + AGN (3C 273), pulsars + magnetars, supernova remnants (Cassiopeia A / Vela / SN 1054), asteroid fields + Kuiper belt objects (Psyche / Vesta / Ceres / Eros / Bennu / Arrokoth), comets (Hale-Bopp / NEOWISE / Halley / Borisov), globular + open clusters (Omega Centauri / 47 Tucanae / M13 / Pleiades), molecular clouds, star-forming regions, neutron-star mergers, kilonovas, gamma-ray bursts.

Examples:
1. NGC 4038/4039 Antennae Galaxies mid-collision — twin spiral nuclei spiraling kiloparsecs apart with tidal bridge of disrupted stars.
2. Cassiopeia A supernova remnant — expanding electric-orange shockwave shell with neutron-star pulsar ejecting particle streams at center.
3. M87 supermassive black hole — asymmetric accretion disk Doppler-boosted around event horizon shadow with relativistic jet shooting 5,000 light-years.
4. Crab Nebula M1 — pulsar wind nebula with electric violet filaments and crimson-gold gas shell.
5. Carina Nebula Mystic Mountain — three-light-year column of cold molecular hydrogen with embedded protostar jets erupting at tip.
6. Jupiter Great Red Spot — anticyclonic storm 1.3 Earth-widths wide churning crimson-amber against electric cyan banded clouds.
7. Saturn's rings backlit — gossamer A/B/C/D ring structure with Cassini Division and shepherd moons casting shadow scallops.
8. Pillars of Creation — Eagle Nebula's elephant-trunk gas pillars sculpted by stellar wind with photoevaporating tips.
9. R136a1 hypergiant — most massive known star blazing blue-white at 9 million suns from cluster heart of 30 Doradus.
10. Kilonova merger GW170817 — neutron-star collision afterglow fountaining gold + platinum atoms in white-hot jets.

Format: ONE entry per line, 15-25 words each. ALL-CAPS or capitalized named object + descriptive clause. NO fictional objects, NO franchise references, NO scale-prover spacecraft, NO instrument-name framing.`,
  },
  cozy_moment: {
    format: 'simple',
    theme: 'Small intimate cozy moments visible in a warm sci-fi interior — a steam curl, a turned page, a sleeping pet, a hand reaching for a mug. Conditional 40%-gated layer for cozy-sci-fi-interior path.',
    touchpoints: [],
    instructions: `Write 50 small intimate cozy moments — a single tiny action or detail caught freeze-frame in a warm sci-fi interior. Each entry: one sentence describing the specific moment. Sci-fi context still present (the moment happens in a starship galley / generation-ship quarters / hydroponics bay / etc.) but the moment itself is human-scale, intimate, warm.

Examples:
1. Steam curling from a forgotten mug of coffee on the navigation console, catching the warm amber readout glow.
2. A figure seen from behind reading a paperback book, one socked foot tucked under them, a soft blanket draped across their shoulders.
3. A small striped cat asleep on a coiled fiber-optic cable, tail flicking once in dream-sleep.
4. Two hands meeting in lamplight to pass a thermos, fingertips briefly touching, a small smile implied off-frame.
5. A plant leaf unfurling under purple grow-lamp, fresh green against worn metal bulkheads.

The moment is QUIET — no action set-pieces. No combat, no awe, no epic scale. Soft, lived-in, human. Mix: solitary moments / paired moments / animal moments / sensory moments (steam, light, fabric, food, plants). Sometimes no person visible, just evidence of one. Output 50 numbered list entries.`,
  },
  cosmic_event: {
    format: 'simple',
    theme: 'Dramatic cosmic events for cosmic-vista scenes — the moment a cosmic phenomenon erupts into ACTION. Conditional 40%-gated drama layer.',
    touchpoints: [],
    instructions: `Write 30 dramatic cosmic events — the MOMENT a cosmic phenomenon detonates into action. Each one sentence describing what is happening RIGHT NOW in the scene (not "could happen", not "was happening" — the freeze-frame). Pure cosmos, no figures, no ships, no human elements. Hubble / Webb / Villeneuve cosmic horror aesthetic.

Examples:
1. Supernova mid-detonation — a star's outer layers exploding outward as expanding spherical shockwave, blinding white core, gas filaments flung kilometers.
2. Gamma-ray burst piercing the frame as a needle of pure white light cutting through nebula clouds, leaving an ionized trail of glowing plasma.
3. Two galaxies mid-collision — spiral arms tangling, gravitational distortion warping starfield, dust lanes intersecting in an X-shape across the frame.
4. Black-hole jet erupting at relativistic speed — twin beams of plasma punching from the poles of the event horizon, illuminating surrounding gas in violet and gold.
5. Quasar awakening — central singularity flaring as accretion disk surges, blue-shifted matter spiraling into the maw, jet axis cutting the frame diagonally.

Format: ALL-CAPS event-name OR descriptive opening — short body. One sentence. No ships, no figures, no architecture. Pure astronomical drama. Output 30 numbered list entries.`,
  },
  ritual_moment: {
    format: 'simple',
    theme: 'Mystic / oracle action moments for cosmic-oracle scenes — channeling cosmic energy, divining starlight, casting sigils, communing with the void.',
    touchpoints: [],
    instructions: `Write 25 mystic action moments — what the cosmic oracle is DOING when ritual energy is active. Each one sentence. Visible glow, sigil, energy thread, or supernatural presence.

Examples:
1. Channeling violet starlight through outstretched palms, golden sigils orbiting the figure in slow rotation.
2. Drawing a glowing constellation map mid-air with one finger, lines forming an ancient star-pattern.
3. Communing with a tethered cosmic entity, faint silvery thread connecting their forehead to a hovering nebula-form.
4. Casting a divination — three glowing dice tumble in midair leaving violet trails.

Future sci-fi mystic aesthetic, not fantasy wizard. Output 25 numbered list entries.`,
  },
  story_beats: {
    format: 'simple',
    theme: 'Universal cinematic narrative beats — the dramatic MOMENT a sci-fi scene is capturing.',
    touchpoints: [],
    instructions: `Write 25 cinematic story beats — the narrative MOMENT a sci-fi scene captures. Each entry: ALL-CAPS NAME — short description (the pose / camera mood / what is about to happen). One sentence per entry.

Examples:
1. ARRIVAL — a ship descends through the atmosphere or breaches the horizon; the world is being entered for the first time.
2. DISCOVERY — a figure has paused at the edge of something unknown — a ruin, a portal, a wonder. The heartbeat before the figure decides what to do next.
3. CONFRONTATION — face-to-face with the alien Other. A figure stands before a colossal alien entity, an inscrutable monolith, an opening into the unknown.
4. VIGIL — figure stands still at a high vantage, watching. A lone watcher above a city, a sentinel on a wall. Time stretched and quiet.

Avoid duplicating: ARRIVAL, DISCOVERY, DEPARTURE, ASCENT, THREAT, AWE, RUIN, CONFRONTATION, VIGIL, EXODUS, CONVERGENCE, SOLITUDE. Invent NEW beats — RECKONING, BREACH, COMMUNION, ABDICATION, RECLAMATION, SUMMONS, INVOCATION, etc. Output 25 numbered list entries.`,
  },
  composition_frame: {
    format: 'simple',
    theme: 'Universal camera / framing concepts — how the camera composes the sci-fi scene.',
    touchpoints: [],
    instructions: `Write 25 camera / framing concepts. Each entry: ALL-CAPS NAME — short description of the camera position, lens, depth, and compositional energy. One sentence per entry.

Examples:
1. WIDE CINEMATIC VISTA — establishing shot, eye-level horizon centered on lower third, sky fills upper two-thirds, full depth from foreground to deep horizon.
2. EXTREME LOW ANGLE LOOKING UP — camera at ground level tilted upward, foreground tilted forward, sky filled with the impossible structure. Forces vertical scale.
3. OVER-THE-SHOULDER ANCHOR — anchor entity in foreground (back-turned), the wonder of the scene unfolding ahead of them. Caspar-Friedrich / Spielberg awe-pose.
4. BACKLIT SILHOUETTE — strong light source behind the anchor, scene rendered in heavy chiaroscuro, atmosphere visible in the light beam.

Avoid duplicating: WIDE CINEMATIC VISTA, EXTREME LOW ANGLE LOOKING UP, AERIAL SWEEP, LONG-LENS DEEP COMPRESSION, WORM'S-EYE FROM RIDGE EDGE, OVER-THE-SHOULDER ANCHOR, DUTCH-TILT CHAOS, BIRD'S-EYE TOP-DOWN, SYMMETRIC HERO FRAME, RACKED FOREGROUND, PROFILE PARALLAX, BACKLIT SILHOUETTE. Invent NEW frames — MIRRORED REFLECTION, KEYHOLE VIEW, TOP-DOWN CRANE PUSH-IN, REVERSE-DOLLY, etc. Output 25 numbered list entries.`,
  },
  scale_provers: {
    format: 'simple',
    theme: 'Universal visual scale-reference elements — small details that prove an environment is monumentally large.',
    touchpoints: [],
    instructions: `Write 25 visual scale-reference elements. Each entry: lowercase descriptive phrase — short explanation of how this element conveys scale. One sentence per entry.

Examples:
1. ships as dots — multiple small craft visible as glowing pinpricks against the structure or sky, no individual detail
2. lit windows as honey-grain — hundreds of small bright window-lights speckling a massive face, conveying that thousands inhabit each tower
3. atmospheric haze bands at midheight — visible layers of fog or smog cutting horizontally through the structure, proving the height exceeds normal atmospheric depth
4. tiny aerial creatures or drones in formation — birds, drones, or alien flyers as moving specks giving the eye motion and scale reference

Avoid duplicating: ships as dots, lit windows as honey-grain, figures-as-pinpricks on bridges, smaller towers clustered at base, atmospheric haze bands, twin moons or rings behind, cargo trains weaving between buildings, weather local to structure, tiny aerial creatures, spotlight beams, scale bands of decay, cascading platforms. Invent NEW provers — distant lightning at base of structure, crowds in plazas read as pixels, vehicle trails snaking on roads, etc. Output 25 numbered list entries.`,
  },
  emotional_dna: {
    format: 'simple',
    theme: 'Universal sci-fi mood / atmosphere concepts — the EMOTIONAL register a cosmic / sci-fi scene is operating in.',
    touchpoints: [],
    instructions: `Write 25 mood / atmosphere concepts. Each entry: ALL-CAPS NAME — short description of the emotional register, the light quality, how the entity / viewer feels. One sentence per entry.

Examples:
1. AWE — the scene overwhelms; the entity is rendered small by impossible beauty or scale. Reverence and wonder, edges softened by light.
2. DREAD — something is wrong or about to be. Architecture or geology carries menace. Light is cold or sickly.
3. SACRED — the scene reads as a place of pilgrimage or revelation. Symmetry, ascending light, ritual cleanliness.
4. FRONTIER-ISOLATION — distance from home is the feeling. The entity is far out, surviving, alone. Wide empty horizons. Light is harsh or precious.

Avoid duplicating: AWE, DREAD, MELANCHOLY, SACRED, INDIFFERENT-MEGALOPOLIS, ALIEN-WONDER, FRONTIER-ISOLATION, TRIUMPHANT-DISCOVERY. Invent NEW moods — EUPHORIC-ASCENSION, COSMIC-HOSTILITY, ANCIENT-PATIENCE, NEUROTIC-SUBLIME, TENDER-LONELINESS, EXALTED-VIGIL, etc. Output 25 numbered list entries.`,
  },
  cozy_sci_fi_interiors: {
    theme: 'WARM lived-in sci-fi interiors — the OPPOSITE of monumental awe. Personal scale, soft light, intimate moments. A view from inside a quiet sanctuary. Includes private quarters AND cozy social spaces (bars, lounges, observation decks, skybars, viewport lookouts).',
    touchpoints: [
      'Cowboy Bebop Bebop ship interior (lived-in, gritty, warm lamps)',
      'Star Trek Ten Forward lounge (curved viewport, plush seating, soft amber light)',
      'Mass Effect Citadel skybar (planet view, intimate booths)',
      'Star Wars cantina (alien clientele, bar lights, low-key warmth)',
      'Blade Runner noodle bar (steam, neon, cramped intimacy)',
      'Studio Ghibli pastoral kitchens',
      'Solar Sands homestead aesthetic',
      'Firefly Serenity cargo hold + galley',
      'Ad Astra capsule interior (clean isolation)',
      'Babylon 5 ZocaloAvatar — Pandora floating mountains observation lounge',
      'The Expanse Belter dive bar',
      'observation deck looking down at a planet below — Earth-like, Mars-like, or gas-giant',
    ],
    instructions: `Cozy + lived-in is the KEY. Warm light, personal objects, plants, soft fabrics. SCI-FI is in materials (alien view through window, transparent floor, holographic accent) but MOOD is "home" or "neighborhood haunt".

ONLY THESE SCENE TYPES (mix them, never repeat the same archetype twice):
- Cozy command bridge / cockpit (single pilot at console, warm panel glow, porthole view of stars/nebula/planet)
- Bedroom / private quarters / sleeping nook / berth / captain's cabin (hammocks, quilts, personal mementos)
- Bar / lounge / cantina / cafe / noodle joint / tea house / pub (warm intimate booths, sometimes 2-4 distant patrons)
- Lab / workshop / engineering nook / tinkerer's corner (researcher's cozy lab with porthole, specimens, plants)
- Atrium / greenhouse / hydroponics / botanical garden / arboretum / conservatory / terrarium / aquarium (lush plants, often biomech or alien biology mixed in, porthole or skylight)
- Reading nook / sitting area / study / den / library corner
- Galley / kitchen / mess hall (warm cooking, baking, dining)
- Observation deck / skybar / sky-lounge / panoramic viewport lookout / dome (BIG curved window with planet below or nebula)

FORBIDDEN scene types (NEVER write these):
- Cargo holds / cargo bays / cargo containers / storage lockers / storage closets / supply rooms
- Corridors / hallways / passages / maintenance tunnels / utility shafts / access ducts / crawlspaces
- Waiting areas / departure lounges / terminal lobbies / queue zones
- Escape pods / emergency capsules / life pods (unless converted into a fully-decorated bedroom-style nook)
- Airlocks / airlock staging areas (only OK if explicitly described as "converted into a [bedroom/sitting nook]")
- Gyms / locker rooms / showers / toilets / bathrooms / wash rooms
- War rooms / tactical centers / interrogation rooms / operating theaters
- Foundries / smelting bays / forge rooms / industrial floors / factory floors
- Memorial / shrine / temple / monastery / cult / ritual chamber spaces

For observation-deck / skybar / lounge scenes: BIG curved viewport showing a planet below (Earth-like, Mars-like ringed gas giant, etc.) or vast nebula is the centerpiece. Cozy still wins the foreground — armchairs, plush booths, glowing lamps — but the window is the gravitational pull.

Camera INTIMATE — small enclosed space, never wide corridor or transit area. May include 0-1 figures (rarely 2-4 distant patrons in bar/lounge). NEVER first-person POV.`,
  },
  dune_landscapes: {
    theme: 'Dune-coded alien desert vistas — twin-sun horizons, ribbed sandstone formations, dust-haze atmospherics, Villeneuve cinematography. Inspired by but not literal franchise references.',
    touchpoints: [
      'Villeneuve 2021 / 2024 Dune cinematography',
      "Frazetta's desert paintings",
      'Sicilian basalt desert at golden hour',
      'Wadi Rum at extreme low sun',
      'Atacama Desert salt flat at twilight',
      'Painted Desert color striations',
    ],
    instructions: `Twin suns or impossibly-low-single-sun. Dust haze. Biblical scale. MUST include EITHER a robed figure (1-2% frame silhouette) OR a sci-fi flying craft (insectoid-bladed, hover, gunship) at scale — pick one for compositional weight. NO franchise proper nouns (Arrakis / Fremen / ornithopter / spice).`,
  },
  aliens_architecture: {
    theme: 'Giger / Xenomorph biomechanical architecture — ribbed organic hallways, fluid-skeletal forms, oily black surfaces with bone undertones, claustrophobic depth.',
    touchpoints: [
      "H.R. Giger's Necronomicon paintings",
      'Alien (1979) derelict ship interior',
      'Prometheus engineer hall',
      'Aliens hive corridor',
      'Beksinski biomechanical dread',
      "Giger's Alien Egg paintings",
    ],
    instructions: `Biomechanical melding — biology + machinery indistinguishable. Ribbed, jointed, fluid-secreting. Dark and wet. Lit from BELOW or with single shafts. Mood: dread + reverence for what came before. Pure architecture — no living figures, but BODIES IN THE WALLS okay (skeletal in chitin).`,
  },
  starwars_landscapes: {
    theme: 'Star Wars planet vistas — alien wilderness AND inhabited frontiers, with that signature Ralph McQuarrie painted-realism. Inspired by but not literal references.',
    touchpoints: [
      'Ralph McQuarrie concept art (Tatooine, Hoth, Bespin, Endor)',
      'Tatooine binary sunset',
      'Hoth ice plains with imperial walkers (suggested silhouette)',
      'Endor redwood canopy',
      'Naboo Italian-coded grasslands',
      'Mustafar volcanic obsidian rivers',
      'Crait salt flats with red dust',
    ],
    instructions: `McQuarrie painterly clarity, romantic frontier mood, Western cinematography. MAY include 1-2 small sci-fi craft, OR 1 small figure silhouette, OR none. NO franchise proper nouns. Each scene is "wilderness someone could be making for".`,
  },
  guardians_architecture: {
    theme: 'James Gunn cosmic-weird architecture — Kirby cosmic 70s-album-cover SF, saturated colors, kaleidoscopic geometry, temple cities. Playful-extravagant-weird, NOT macabre.',
    touchpoints: [
      'Jack Kirby cosmic geometry (Eternals, Inhumans)',
      'Heavy Metal magazine architecture',
      '70s sci-fi novel cover art (Boris, Bonestell)',
      'Moebius Incal architecture',
      "Druillet's Lone Sloane palaces",
      'James Gunn Guardians films cosmic locales',
      "Roger Dean's Yes album-cover landscapes",
    ],
    instructions: `SATURATED color clashing. Geometric impossibility. Spire-cathedrals, temple-arcades, kaleidoscopic mandala-cities. ABSOLUTELY NO SKULLS — no celestial skull, no skull-shaped buildings, no bone fragments. Architecture leans playful + weird + impossibly beautiful. NO franchise proper nouns.`,
  },
  mass_effect_architecture: {
    theme: 'Mass Effect / BioWare-coded sleek alien architecture — curved monumental megastructure, holographic UI ambient, futuristic Citadel-tier grandeur. NOT brutalist; SLEEK + GRACEFUL.',
    touchpoints: [
      'Mass Effect Citadel arms',
      'Mass Effect Reaper interior',
      'Asari Council Chamber',
      'Salarian architecture',
      'Star Trek TNG Federation interior aesthetic',
      'Andromeda Initiative habitats',
      "Le Corbusier curves in alien material",
    ],
    instructions: `Curved organic-engineered surfaces. Holographic ambient (subtle, not overwhelming). Vast interior atriums, plant integration, ambient cyan/teal mood with warm accent lights. NO franchise proper nouns. Architecture conveys "this civilization solved hard problems with elegance."`,
  },
  halo_landscapes: {
    theme: 'Halo ringworld landscapes — orbital ring curving against the horizon, ancient Forerunner ruins, sweeping skybox grandeur with the ring itself visible overhead.',
    touchpoints: [
      'Halo CE / Reach / Infinite cinematic vistas',
      'Bungie concept art',
      'Forerunner megastructure aesthetic',
      "Niven's Ringworld",
      'Banks Culture orbitals (visible curve)',
      'Yosemite cliffs scaled up 100×',
    ],
    instructions: `RING VISIBLE in sky (curving up overhead is the signature). Ancient megastructure integrated with natural terrain. MUST include ring-curve in the sky composition. NO franchise proper nouns. Mood: sacred + ancient + slightly haunted.`,
  },
  startrek_landscapes: {
    theme: 'Star Trek alien-planet vistas — TOS-vivid colors meets TNG/Discovery realism. Diverse biome variety, often with Federation-or-other ship visible.',
    touchpoints: [
      'Star Trek TOS planet sets (vivid skies, colored rocks)',
      'Star Trek TNG / VOY matte paintings',
      'Star Trek Discovery / Picard cinematography',
      "Andre Norton's Star Voyager covers",
    ],
    instructions: `Optimistic exploration mood. Color variety (don't just default to teal). MAY include small Starfleet-coded ship silhouette in sky (saucer-and-nacelle shape suggested, not literal). NO franchise proper nouns.`,
  },
  starcraft_landscapes: {
    theme: 'Starcraft alien-planet vistas — Zerg-organic-creep / Protoss-crystal / Terran-frontier-mining. Pick a faction lens per entry.',
    touchpoints: [
      'Blizzard Starcraft 2 concept art',
      'Char (volcanic Zerg world)',
      'Aiur (Protoss crystal cities)',
      'Korhal (Terran neo-noir city ruins)',
      'Shakuras (twilight crystal world)',
      'Tarsonis (collapsed Terran capital)',
    ],
    instructions: `Pick ONE faction lens per seed: Zerg (creep, organic, bone-and-shell), Protoss (crystal, gold, monolithic), Terran (oil-rig industrial, neo-noir). Strong DNA per entry. NO franchise proper nouns.`,
  },
};

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(`No recipe for pool "${POOL}". Add it to POOL_RECIPES.`);
  process.exit(1);
}

function buildPrompt(count, recipe) {
  // Simple format opt-out — recipes can set `format: 'simple'` to skip the
  // Rich Scene Seed scaffolding and just pass through theme + instructions.
  if (recipe.format === 'simple') {
    return `${recipe.theme}

${recipe.instructions}

Output ${count} numbered list entries (1. ... 2. ... 3. ...). Each entry on its own single line. NO preamble, NO commentary, NO markdown fences.`;
  }

  return `Generate ${count} Rich Scene Seeds for the StarBot ${POOL} pool. StarBot is a sci-fi image-generation bot whose renders should feel like stills from an unmade epic film — multi-tier depth, scale provers, materially specific, narratively suggestive.

━━━ POOL THEME ━━━
${recipe.theme}

━━━ AESTHETIC TOUCHPOINTS (draw from these) ━━━
${recipe.touchpoints.map((t) => '  • ' + t).join('\n')}

━━━ POOL-SPECIFIC INSTRUCTIONS ━━━
${recipe.instructions}

━━━ THE RICH SCENE SEED FORMAT — every entry follows this EXACTLY ━━━
Each seed is 80-150 words. Use these exact slot headers (the labels themselves are part of the entry):

[NAME / TYPE] — [one-sentence headline anchor]
FOREGROUND: [specific tangible detail — railing, terrace, machinery, ruin, ridge]
MIDGROUND: [city/structure body, with scale provers named — tiny ships, lit windows, bridge traffic, smaller buildings clustered]
DEEP DISTANCE: [the hero anchor, dominant, partially veiled in atmospheric haze]
SKY: [atmospheric layer — smog, twin moons, storm, light pollution glow, ring-curve]
SCALE PROVERS: [3+ explicit small-things-prove-big-things — name them]
MATERIAL: [what surfaces are made of, how they wear, what light does to them]
EMOTIONAL DNA: [the feeling — awe, dread, wonder, melancholy, alien-indifference, sacred]

━━━ HARD RULES ━━━
- Multi-tier composition is NON-NEGOTIABLE — every seed has all 4 depth layers (FG, MG, Deep, Sky) explicitly filled
- Specific material language — ribbed obsidian over concrete (not "alien architecture"), copper-green oxide (not "weathered"), bioluminescent chitin (not "alien biology")
- 3+ named scale provers per seed — "ships as dots", "hundreds of lit windows", "figures-as-pinpricks on the bridge"
- Each seed has a DISTINCT visual DNA — no two seeds should feel interchangeable
- Architectural / biological / mechanical SPECIFICITY — name the style (brutalist / chitin-grown / cyclopean / Kirby-cosmic / etc.)
- 80-150 words per seed
- NO franchise proper nouns (no "Coruscant" / "Reaper" / "Halo" / etc. — INSPIRED BY, not literal)

━━━ FORBIDDEN — every seed must AVOID ━━━
- Generic descriptors without anchors ("vast city", "sprawling spires", "massive structure", "alien architecture") — these are placeholder noise
- The same tower-with-orange-windows-in-fog default; force variety in architectural style across seeds
- Single-hero-building isolation — every seed has supporting density
- Teal+orange default palette mention — let LIGHTING/VIBE handle palette, don't lock it in the seed

━━━ OUTPUT FORMAT — STRICT ━━━
Return EXACTLY ${count} entries as a NUMBERED LIST. Each entry on its OWN SINGLE LINE prefixed by "<number>. ". NO internal newlines within an entry — use commas / semicolons / dashes for internal structure. NO preamble, NO commentary, NO markdown fences, NO JSON.

Example output (the WHOLE response is just this format, nothing else):
1. MEGACITY OF STACKED ZIGGURATS — five-kilometer-tall ribbed obsidian ziggurats in a grid, each a layered city of thousands, connected at seven elevations by 200-meter skybridges, hanging-garden terraces, copper-green oxide bridge-trusses, ships threading the gaps as dots, indifferent megalopolis mood.
2. CANYON CITY OF SUSPENDED BRIDGES — vertical city carved into both faces of a 3-kilometer canyon, linked by 80+ suspension bridges at staggered heights, eroded stone balconies, prayer flags whipping in updraft, canyon walls weeping mineral stains.
3. (... and so on, ${count} numbered entries total)

CRITICAL: each entry MUST be ONE LINE only. If you need to convey FG/MG/Deep/Sky/Material/Emotional context, combine them into ONE comma-separated line. Multi-line entries WILL BE PARSED INCORRECTLY.`;
}

async function callSonnet(prompt) {
  // Node's undici defaults to a 5-minute headers timeout — Sonnet's larger
  // responses (16K output tokens with content) can exceed this. Use a
  // dispatcher with a longer timeout via AbortController fallback.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000); // 15min
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 16000,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

// Numbered-list parser. Each entry starts with "<number>. ". Lines that
// don't start with a number are treated as continuations of the previous
// entry (in case Sonnet ignores the "one line per entry" rule and wraps).
function parseArray(text) {
  const body = text
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .trim();
  const lines = body.split('\n');
  const entries = [];
  let current = null;
  const numRe = /^\s*(\d+)\s*[.):\]]\s*(.+)$/;
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const m = trimmed.match(numRe);
    if (m) {
      if (current) entries.push(current);
      current = m[2].trim();
    } else if (current) {
      // continuation line — append with a space
      current += ' ' + trimmed;
    }
  }
  if (current) entries.push(current);
  const cleaned = entries
    .map((e) => e.replace(/^["']|["']$/g, '').replace(/^[-•*]\s*/, '').trim())
    .filter((e) => e.length > 20 && e.length < 1200);
  if (cleaned.length === 0) throw new Error('No numbered entries found in response');
  return cleaned;
}

// ─── DEDUP ────────────────────────────────────────────────────────────────
// Sonnet clusters within batches and across batches — same theme, slightly
// different wording. Catch it programmatically by hashing a signature of
// each entry (significant keywords from the body, stopwords removed,
// sorted alphabetically). Entries with identical signatures are duplicates.

const STOPWORDS = new Set([
  'the','a','an','and','or','but','with','of','in','on','at','to','for','from',
  'by','as','is','are','was','were','be','been','being','have','has','had',
  'this','that','these','those','it','its','they','them','their','her','his',
  'into','onto','through','across','over','under','near','around','between',
  'one','two','three','some','any','all','no','not','than','then','also','so',
  'very','more','most','many','much','each','every','other','another','same',
  'such','only','own','just','still','here','there','where','when','what','who',
  'kilometer','kilometers','meter','meters','foot','feet','mile','miles','wide',
  'tall','long','high','low','large','small','massive','huge','vast','huge',
  'across','above','below','beside','behind','toward','within','throughout',
  'meterdiameter','kilometerdiameter','metertall','kilometertall',
]);

function signatureOf(entry) {
  // Strip the title prefix (everything before the first " — ")
  const dashIdx = entry.indexOf(' — ');
  let body = dashIdx >= 0 ? entry.slice(dashIdx + 3) : entry;
  // Strip any Rich-Scene-Seed bloat
  const fgIdx = body.indexOf(' FOREGROUND:');
  if (fgIdx > 0) body = body.slice(0, fgIdx);
  // Tokenize and extract significant content nouns/adjectives
  const tokens = body.toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOPWORDS.has(w))
    .slice(0, 20); // first 20 significant words of the body
  // Sort alphabetically so word-order shuffling doesn't escape dedup
  return [...new Set(tokens)].sort().slice(0, 12).join(' ');
}

// Title-only signature for pools with "TITLE — description" or
// "lowercase phrase — description" shape. Two entries with the same
// title but different bodies should still be treated as duplicates —
// signatureOf strips titles, so we need a separate guard.
function titleOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  if (dashIdx < 0) return null; // no title — fall back to signature-only dedup
  return entry.slice(0, dashIdx).trim().toLowerCase();
}

function dedupe(entries) {
  const seenSigs = new Map(); // body-signature → first entry that claimed it
  const seenTitles = new Map(); // title (lowercased) → first entry that claimed it
  const kept = [];
  const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const title = titleOf(e);
    if (title && seenTitles.has(title)) {
      dropped.push({ entry: e.slice(0, 80), duplicateOf: seenTitles.get(title).slice(0, 80), reason: 'title' });
      continue;
    }
    const sig = signatureOf(e);
    if (sig.length < 10) {
      // Body was too short to signature — keep (and register title)
      if (title) seenTitles.set(title, e);
      kept.push(e);
      continue;
    }
    if (seenSigs.has(sig)) {
      dropped.push({ entry: e.slice(0, 80), duplicateOf: seenSigs.get(sig).slice(0, 80), reason: 'body' });
      continue;
    }
    seenSigs.set(sig, e);
    if (title) seenTitles.set(title, e);
    kept.push(e);
  }
  return { kept, dropped };
}

async function generateBatch(batchCount) {
  const t0 = Date.now();
  const text = await callSonnet(buildPrompt(batchCount, recipe));
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  let arr;
  try {
    arr = parseArray(text);
  } catch (e) {
    console.error('Parse failed:', e.message);
    console.error('First 400 chars:', text.slice(0, 400));
    return [];
  }
  if (!Array.isArray(arr) || arr.length === 0) {
    console.warn(`  ⚠ Sonnet returned no usable entries`);
    return [];
  }
  // Strip Rich-Scene-Seed bloat so signatures aren't polluted
  const stripped = arr.map((e) => {
    if (typeof e !== 'string') return null;
    const i = e.indexOf(' FOREGROUND:');
    return i > 0 ? e.slice(0, i).trim() : e;
  }).filter(Boolean);
  console.log(`  • Sonnet returned ${stripped.length} entries in ${elapsed}s`);
  return stripped;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/starbot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) {
    try { preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8')); } catch {}
  }

  // Determine final target.
  // --target N → fill up to N via iterative gen+dedup loop
  // --count N → single batch of N (legacy behavior)
  const finalTarget = TARGET ?? (preExisting.length + COUNT);
  const startCount = preExisting.length;

  if (TARGET !== null) {
    console.log(`Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${DRY ? ' (dry-run)' : ''}`);
  } else {
    console.log(`Pool "${POOL}": gen ${COUNT} new (start ${startCount})${DRY ? ' (dry-run)' : ''}`);
  }

  let pool = [...preExisting];
  let iteration = 0;
  while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = finalTarget - pool.length;
    // Smaller batches (15-25) — Sonnet writes faster + ~10K-token responses
    // stay well under fetch timeouts. Overgen by ~50% to absorb dedup losses.
    const batchSize = Math.min(25, Math.ceil(stillNeeded * 1.5));
    console.log(`\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`);
    const fresh = await generateBatch(batchSize);
    if (fresh.length === 0) {
      console.warn('  ⚠ empty Sonnet response — stopping iteration');
      break;
    }
    // Within-batch dedup
    const within = dedupe(fresh);
    if (within.dropped.length > 0) {
      console.log(`  • within-batch dedup dropped ${within.dropped.length}`);
    }
    // Cross-batch dedup against current pool — body signature AND title
    const existingSigs = new Set(pool.map((e) => signatureOf(e)));
    const existingTitles = new Set(pool.map((e) => titleOf(e)).filter(Boolean));
    const newUnique = within.kept.filter((e) => {
      if (existingSigs.has(signatureOf(e))) return false;
      const t = titleOf(e);
      if (t && existingTitles.has(t)) return false;
      return true;
    });
    const crossDropped = within.kept.length - newUnique.length;
    if (crossDropped > 0) {
      console.log(`  • cross-batch dedup dropped ${crossDropped}`);
    }
    // Trim to target if we overshot
    const room = finalTarget - pool.length;
    const toAdd = newUnique.slice(0, room);
    pool = [...pool, ...toAdd];
    console.log(`  ✓ Added ${toAdd.length} unique → pool at ${pool.length}/${finalTarget}`);
    if (toAdd.length === 0 && newUnique.length === 0) {
      console.warn('  ⚠ batch added nothing — Sonnet may be exhausted on theme, stopping');
      break;
    }
  }

  console.log(`\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`);

  console.log('\nSample (last 2 added):');
  pool.slice(-2).forEach((e, i) => console.log(`\n[${pool.length - 1 + i}] ${e.slice(0, 400)}...`));

  if (DRY) {
    console.log('\nDry-run — not writing to disk.');
    return;
  }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath)) {
    fs.copyFileSync(outPath, bakPath);
    console.log(`Backed up existing pool → ${bakPath}`);
  }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
