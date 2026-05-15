#!/usr/bin/env node
/**
 * Generate a GothBot pool using Sonnet.
 *
 * GothBot aesthetic — Castlevania / Bloodborne / Crimson-Peak / Berserk /
 * Tim-Burton / gothic-fairy-tale. Dark elegant beauty with twilight color,
 * NEVER LOTR / Skyrim / Witcher high-fantasy vocabulary.
 *
 * Usage:
 *   node scripts/gen-gothbot-pool.js --pool gothbot_dark_landscape_biome --count 30
 *   node scripts/gen-gothbot-pool.js --pool gothbot_dark_landscape_biome --target 200 --count 30
 *
 * Output written to scripts/bots/gothbot/seeds/<pool>.json.
 */

const fs = require('fs');
const path = require('path');
const { SONNET } = require('./lib/models');

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

// Per-pool recipe — GothBot bespoke aesthetic. Castlevania / Bloodborne /
// Crimson-Peak / Berserk / Tim-Burton — NEVER LOTR / Skyrim / Witcher.
const POOL_RECIPES = {
  // ─── GOTHBOT gothic-architecture path (2026-05-15, bespoke migration).
  // STRUCTURE IS THE HERO (80%+ visual weight). Inner-glow mandatory.
  // Ornate architectural detail porn. Exterior only. ─────────────────

  gothbot_gothic_architecture_structure: {
    format: 'simple',
    theme: `GOTHIC STRUCTURES for GothBot's gothic-architecture path — the building IS the hero. Each entry is ONE specific gothic structure with surrounding context + setting, 50-80 words. Castlevania / Bloodborne / Crimson-Peak / Berserk / Dark-Souls / Elden-Ring / Van-Helsing visual lineage.\n\n⚠️ The STRUCTURE dominates 80%+ of frame. Surrounding landscape is SUPPORTING context, never competes. Multi-tier depth still required (foreground architectural-detail / midground structure body / deep distance supporting context + sky).\n\n⚠️ STRICT GOTHIC DARK-FANTASY — NEVER LOTR / Skyrim / Witcher / Warcraft high-fantasy. NEVER modern / industrial / sci-fi.\n\n⚠️ EXTERIOR shot only — NO interior chamber compositions.\n\nMANDATORY in every entry:\n• A SPECIFIC GOTHIC STRUCTURE TYPE named distinctly (vampire-castle / Gothic cathedral / ruined abbey / cliff-perched monastery / mausoleum-cathedral / black-iron fortress / spired citadel / cursed-village church / chateau-manor / Gothic lighthouse-tower / catacomb-temple / bell-tower / sea-stack chapel / forge-cathedral / etc.)\n• EXTERIOR SCALE describing the structure DOMINATING the frame — towering, vast, sprawling\n• AT LEAST 2 NAMED ARCHITECTURAL FEATURES (e.g., specific spire-style / specific rose-window-shape / specific buttress / specific dome / specific arch-type)\n• SURROUNDING CONTEXT briefly described — cliff / moor / canyon / forest / harbor / village / etc. — but supporting role only\n• "WEATHERED / RUINED / HAUNTED" SIGNAL — centuries-old, baroque decay\n\n🚫 ABSOLUTE BANS:\n• NO LOTR / Skyrim / Witcher / Warcraft vocabulary\n• NO modern (no electric lighthouses with electric bulbs / no clocktowers with digital faces / no factories)\n• NO real-world ethnic-coded structures (no Forbidden-City / Persian-palace / Aztec-pyramid / Indian-fort)\n• NO sci-fi / cyberpunk / neon\n• NO humans / human figures (those go in the accent_creature axis only)\n• NO interior shots — exterior only\n• NO "castle silhouette on cliff" generic — must SHOW architectural detail\n• NO pentagram / satanic iconography\n\nVARIETY MANDATE — distribute roughly across structure types:\n\n  A. **VAMPIRE-CASTLE** (~25%): multi-spire fortress / cliff-perched dark castle / mountain-crag vampire-citadel / Wallachian-coded keep — SPRAWLING multi-wing complex\n  B. **GOTHIC CATHEDRAL** (~20%): Notre-Dame-coded ruin / collapsed-nave cathedral / soaring-spire basilica / blood-cult cathedral — full cathedral-complex with attendant buildings\n  C. **RUINED ABBEY / MONASTERY** (~15%): cliff-perched monastery / collapsed abbey on a tor / mountainside priory / coastal sanctuary — multi-building complex with cloisters and outbuildings\n  D. **MAUSOLEUM-CATHEDRAL / CRYPT-COMPLEX** (~10%): central tomb-cathedral / above-ground crypt-cathedral / catacomb-entrance temple — vast complex with statuary-flanked approach\n  E. **CHATEAU-MANOR / GOTHIC PALACE** (~15%): multi-wing mansard-roof manor / Crimson-Peak-coded chateau / weather-worn palace — sprawling palace-complex\n  F. **FORGE-CATHEDRAL / IRONWORK STRUCTURE** (~5%): Gothic dwarven-coded forge-hall / black-iron weapon-foundry / smith-cathedral — multi-tier industrial-Gothic complex\n  G. **BLACK-IRON FORTRESS** (~10%): siege-fortress with skeletal scarecrow battlements / Gothic war-keep — multi-wing fortified complex\n\n🚫 BANNED CATEGORIES (do NOT include in this pool):\n• NO solitary lighthouse-towers / standalone single-tower structures\n• NO standalone Gothic spire / single-tower entries\n• NO bell-tower-only entries — bell-towers MUST be attached to a larger cathedral/abbey complex\n• NO sea-stack chapel / isolated single-chapel structures — chapels must be part of a larger complex\n• NO village-chapel-only entries — chapels MUST be part of a wider haunted-village or church-cathedral complex`,
    touchpoints: [
      'A vast multi-spire vampire-castle on a basalt crag dominating the entire frame, ten soaring spires bristling above three concentric curtain-walls, every wall lined with skeletal-warrior statuary at thirty-foot intervals, the lower castle wrapped in dead-vines, a single causeway-bridge approaching from foreground, distant Gothic forest at deep-distance edge.',
      'A Gothic cathedral ruin filling the frame at midground, single rose-window the size of a small house at the center with shattered tracery still partially intact, flying buttresses lining both sides like skeletal ribs, twin soaring spires rising into storm-sky, weathered grotesques at every corner.',
      'A cliff-perched abbey dominating the frame, multiple stacked stone-and-tile roofs cascading down a rock-face, single watchtower at the summit, every window arched and barred with wrought-iron, weathered statuary lining the rooftop pinnacles.',
      'A vast mausoleum-cathedral dominating the frame, cathedral-sized tomb with stone-angel statuary lining the entire approach colonnade, twin colossal weeping-angel statues flanking a central iron-bound door, weathered family-crests carved above every alcove, central spire piercing fog.',
      'A Crimson-Peak-coded chateau-manor dominating the frame, multi-wing red-brick mansion with steep mansard roofs, dozens of pointed-arch windows in every wing, wrought-iron balconies at every level, single central tower with weather-vane, the manor sinking slightly into ground-soft soil.',
      'A solitary tall Gothic bell-tower dominating the frame center, weathered iron bell visible through arched opening at the summit, ivy crawling up the entire structure in serpentine patterns, gargoyle-faces on every corner battlement.',
      'A Gothic sea-stack lighthouse-tower dominating the frame, single soaring stone tower rising from an isolated rock pillar surrounded by crashing waves, single iron-cage candle-fire beacon at the summit (NO electric bulb), weathered salt-rime on every stone.',
      'A vast black-iron fortress dominating the frame, multi-tower Gothic fortress with skeletal scarecrows impaled at every crenellation, single gate flanked by twin gargoyle-statues thirty-feet tall, three concentric curtain-walls visible in receding tiers.',
      'A Gothic forge-cathedral dominating the frame, Dwarven-coded multi-tier forge-hall with chimneys at every tower-top still actively smoking, central forge-stack rising hundreds of feet, ironwork-stair networks visible scaling the exterior.',
      'A Notre-Dame-coded Gothic cathedral filling the frame, soaring twin-spire facade with a massive central rose-window the size of a small ballroom, deeply-carved Gothic tympanum above the central portal, flying buttresses on both sides supporting the nave-walls.',
      'A cliff-perched monastery dominating the frame, multi-tier stone-and-slate buildings cascading down a sheer rock-face, narrow rope-bridges connecting clusters, central bell-tower piercing the cloud-layer, weathered to grey by centuries of storm.',
      'A Castlevania-coded vampire-castle dominating the frame, central spired keep flanked by twin slightly-shorter wing-towers, four-tier concentric curtain-walls with gargoyles spaced at every yard along the battlements, central gate with iron portcullis raised.',
      'A Crimson-Peak-coded gothic mansion dominating the frame, vast red-brick mansion with countless pointed-arch windows and steep mansard roofs, the entire structure visibly sinking into red-clay ground, weathered iron-wrought balconies on every wing.',
      'A Dark-Souls-coded cathedral-ruin dominating the frame, half-collapsed Gothic cathedral with two of four spires fallen, scattered carved-stone fragments still half-standing in the foreground, central rose-window partially intact still casting tracery-shadow.',
      'A Bloodborne-coded Gothic cathedral-spire dominating the frame, vast multi-tier spire architecture with stained-glass windows lit from within at multiple levels, Victorian-coded ornamental ironwork at every balcony, surrounded by lesser spire-buildings forming the cathedral-district.',
      'A blood-cult monastery dominating the frame, circular stone monastery on a hilltop with cult-symbols carved across every visible wall, central iron-bound door beneath a colossal carved sigil, weathered to grey by centuries.',
      'A cliff-perched chateau-fortress dominating the frame, Gothic-Romanesque hybrid fortress with multiple round-towers and pointed-arch windows clinging to a vertical cliff, central keep with conical-roof tower, weathered iron-balcony walkways.',
      'A vast catacomb-temple entrance dominating the frame, colossal carved-stone gate flanked by twin stone-angel statues with broken wings, gate-arch carved with concentric warding-runes, descending stair into darkness beyond the threshold.',
      'A cursed-village chapel dominating the frame, half-timbered Gothic chapel with collapsed roof exposing the rafters, weathered grave-yard surrounding the building, single intact stained-glass window showing pale-violet inner-glow, village ruins barely visible at frame-edges.',
      'A Gothic siege-fortress dominating the frame, multi-tier black-iron fortress with skeletal scarecrows at every battlement-corner, single great-gate with iron-banded doors and twin gargoyle-flanking.',
      'A Bram-Stoker-coded vampire-castle dominating the frame, soaring multi-spire fortress on an alpine crag with countless lit-windows at varying levels, central gate with portcullis raised, gargoyle-statuary at every spire-cap.',
      'A Gothic clocktower (mechanical, not digital) dominating the frame, single soaring stone tower with vast clock-face showing weathered roman-numerals, ornamental ironwork around the clock-face, gargoyle-spouts at every corner.',
      'A Berserk-coded fortress-cathedral dominating the frame, Gothic-fortress hybrid with both military-and-ecclesiastical features — battlemented walls AND cathedral-spires, surrounded by impaled-statuary.',
      'A Gothic chateau-mansion on a hilltop dominating the frame, multi-wing palace with countless pointed-arch windows, central tower with weathered weather-vane, ivy crawling across the entire facade.',
      'A Bell-tower-and-chapel-complex dominating the frame, Gothic bell-tower with attached single-aisle chapel, weathered iron bell visible through arched opening, ivy on every wall.',
    ],
    instructions: `Each entry is ONE gothic structure dominating the frame (80%+ visual weight), 50-80 words. EXTERIOR only. Multi-tier depth: structure-detail foreground / structure body / supporting-context background. STRICT GothBot dark-fantasy. NO LOTR / Skyrim / Witcher / modern / sci-fi / real-world ethnic / human figures. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_architecture_detail: {
    format: 'simple',
    theme: `ORNATE GOTHIC ARCHITECTURAL FLOURISHES for gothic-architecture scenes — pickN: 3 per render. Each entry is ONE specific architectural detail Sonnet must render visibly, 15-30 words. Castlevania / Bloodborne / Crimson-Peak / Berserk visual lineage.\n\n⚠️ These are the ornate-detail-porn elements. Each render picks 3 of these to render visibly across the frame.\n\n🚫 NO modern / sci-fi / industrial. NO real-world ethnic codes.\n\n✓ GOTHIC ARCHITECTURAL FLOURISHES: rose-window tracery / flying-buttresses / spire-pinnacles with crockets / gargoyles in profile / grotesques on cornices / wrought-iron weathervanes / stone-angel statuary / dragon-head water-spouts / bat-motif finials / vaulted arch keystones / relief-saint carvings / pointed-arch windows / ironwork-spike rows / carved-rose carvings / Gothic tracery / decorative crenellation / iron-bound doors with rune-bands / oxidized-copper roof patches / iron-cage braziers`,
    touchpoints: [
      'A massive rose-window with intricate stone-tracery in concentric quatrefoils, partially shattered with witch-fire green light leaking through remaining glass',
      'Twin flying-buttresses lining the cathedral nave, each carved with relief-scrollwork showing saints and demons in conflict',
      'A soaring spire-pinnacle with carved crockets running up the edge and a weather-vane in iron-bat-silhouette at the summit',
      'A gargoyle perched in profile on a corner buttress, mouth open in mid-roar, water-spout visible at the throat',
      'Three grotesques carved at varying heights on the central cornice, each more weathered than the last',
      'An ornate wrought-iron weathervane in the shape of a Gothic cross spinning slowly atop the highest spire',
      'A stone-angel statue with broken wings lining the cathedral-approach colonnade, weathered to grey',
      'A dragon-head water-spout extending from the cornice, the dragon-mouth carved open and a thin trickle of rainwater pouring',
      'Bat-motif finials capping every spire-tip and battlement-corner, each carved bat with outstretched wings',
      'A vaulted arch keystone carved with the family-crest of a forgotten noble line, ivy creeping up the keystone-edge',
      'A weathered relief-carving of saints flanking the central portal, faces eroded but garment-folds still visible',
      'Pointed-arch windows in alternating sizes lining every level of the facade, each filled with stained-glass tracery',
      'Ironwork-spike rows topping every parapet-wall, the spikes weathered to dark verdigris',
      'A carved-rose ornament at the central facade above the main door, the rose half-bloomed with thorn-detail',
      'Gothic tracery patterns in every window-frame, the lattice carved in stone with quatrefoil and trefoil motifs',
      'Decorative crenellation along every battlement-wall, the merlons carved with bat-and-skull motifs',
      'A massive iron-bound door with three horizontal rune-bands carved across its face, the wood weathered to black',
      'A weathervane spire at the gate-tower summit topped with a wrought-iron raven silhouette',
      'Oxidized-copper roof patches showing patina-green on every spire and tower, the underlying lead-sheets weathered',
      'An iron-cage brazier at every wall-corner with a single witch-fire green flame burning inside',
      'A vaulted Romanesque archway above the main portal carved with concentric grotesque faces',
      'Stone-angel statuary in alcoves at every level of the facade, each angel posed in mid-flight or kneeling',
      'A carved-tympanum above the great-gate depicting a Gothic last-judgment scene in three relief-tiers',
      'A row of carved-saint statues lining the cathedral-approach, each statue with weathered hands and chipped halos',
      'A wrought-iron portcullis raised at the gate, the ironwork formed in spiked-bat-wing patterns',
    ],
    instructions: `Each entry is ONE ornate gothic architectural flourish, 15-30 words. STRICT GothBot dark-fantasy. NO modern / sci-fi / ethnic. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_architecture_inner_light: {
    format: 'simple',
    theme: `INNER DARK-MAGIC LIGHT SOURCES for gothic-architecture scenes. Each entry 15-30 words. The structure is LIT FROM WITHIN. Castlevania / Bloodborne / Crimson-Peak visual lineage.\n\n⚠️ MANDATORY: the inner-glow is the structure's "alive" signal — light leaking through windows / rose-windows / cracks / doorways. NEVER sunlight, NEVER exterior illumination.\n\n🚫 NO modern (no electric / no flashlights / no LEDs). NO sci-fi (no neon / no plasma).\n\n✓ INNER-LIGHT SOURCES: witch-fire green / sapphire-necromantic blue / violet-spell glow / candle-amber warmth / alchemist-gold / fel-green warlock light / blacklight ultraviolet / corpse-pale luminescence / forge-ember orange / rose-tinted candlelight / pulsing-rune-light / cobalt arcane glow / pale-moon-reflected silver`,
    touchpoints: [
      'WITCH-FIRE GREEN glow blazing through every rose-window and pointed-arch window, the green light spilling onto surrounding stonework in casting-pools',
      'CANDLE-AMBER warmth leaking from a dozen narrow arrow-slit windows at varying levels, the amber pools suggesting unseen movement inside',
      'SAPPHIRE-NECROMANTIC BLUE pulsing slowly from the central rose-window in rhythm with an unseen heartbeat',
      'VIOLET-SPELL GLOW seeping through every crack in the stone, the structure looking as if it could split apart at the seams from inner pressure',
      'ALCHEMIST-GOLD radiance pouring from a single top-spire window, the gold light catching dust-motes in surrounding air',
      'FEL-GREEN WARLOCK LIGHT bleeding through stained-glass in jagged patterns, casting acid-green tracery on the ground below',
      'BLACKLIGHT ULTRAVIOLET pulsing from the central doorway, the violet light revealing rune-script invisible to normal sight on surrounding stones',
      'CORPSE-PALE LUMINESCENCE seeping from every opening like cold breath, the pale glow making stonework appear icy',
      'FORGE-EMBER ORANGE glow from the basement-level windows visible through grills, the orange light suggesting something still burns inside',
      'ROSE-TINTED CANDLELIGHT softly glowing through every leaded-glass window, the rose light catching ironwork tracery',
      'PULSING-RUNE-LIGHT visible on every interior wall through open archways, the runes glowing in synchronized rhythm',
      'COBALT ARCANE GLOW spilling from a tall arched doorway, the blue light reaching out into surrounding fog as if alive',
      'PALE-MOON SILVER reflected from polished interior surfaces, the silver light cascading through every opening',
      'WITCH-FIRE GREEN combined with VIOLET-SPELL — two competing inner-glows leaking from different windows, colors mixing in surrounding fog',
      'EMBER-RED FORGE-GLOW from a basement-forge combined with CANDLE-AMBER from upper-level windows, layered warm tones',
      'SAPPHIRE-BLUE arcane glow through stained-glass + GOLDEN-CANDLE warmth through arrow-slits, the cool-and-warm contrast saturating the facade',
      'A single intense WITCH-FIRE GREEN beam shooting upward from an open rooftop oculus into storm-sky, visible from miles away',
      'PULSING amber-and-violet alternating glow from rose-window, the pulse rhythm a slow heartbeat-beat',
      'DEAD-SOUL PALE-WHITE light leaking through every opening, the structure feeling spectral, the inner-glow having no warmth',
      'CHAOS-MULTI-COLOR arcane glow with violet, green, gold, and rose all simultaneously visible through different windows, suggesting impossible inner-events',
    ],
    instructions: `Each entry is ONE inner-light source, 15-30 words. Inner-glow only — NEVER sunlight / exterior illumination. STRICT GothBot dark-fantasy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_architecture_spice: {
    format: 'simple',
    theme: `SET-DECORATION SPICE for gothic-architecture scenes. Each entry 25-45 words. Castlevania / Bloodborne / Crimson-Peak / Berserk visual lineage.\n\n⚠️ MANDATORY 100%-active spice layer. Each render gets ONE spice from this pool — adds atmospheric character without competing with the structure.\n\n⚠️ STRICT POOL CONTENT — only THREE categories allowed:\n\n  A. **DRAMATIC FULL MOONS** (~50%): ALWAYS full moon (NEVER crescent / half / quarter). The moon must be RICHLY DETAILED — visible craters, lunar maria, fine texture across the disc — NEVER a flat white blob. Vary the DRAMA via weather + cloud-veil + sky-mood:\n     • Vast pale-silver full moon riding low, surface deeply textured with visible craters and dark maria, a single thin cloud-veil draped across the lower third\n     • Massive blood-orange full moon haloed in red corona, deep maria visible like ink on copper, surrounding violet sky\n     • Clear-sky full moon at zenith, sharply detailed crater-shadows raking across the disc, no clouds\n     • Storm-cloud-shrouded full moon partially veiled, the visible portion showing fine pock-marked surface detail, lightning forking nearby\n     • Eclipsed full moon with red corona ringing the blackened disc, surface detail still readable through the eclipse-shadow\n     • Wind-torn cloud-rags streaking across a vivid full moon, the moon-surface visible between cloud-tears with crater-detail\n     • Mist-veiled full moon glowing softly through a thin fog-curtain, surface texture diffused but still readable\n     • Twin-moon night with both moons full and detailed, offset against deep-violet sky\n     • Aurora-haloed full moon, aurora-curtain rippling behind the moon-disc, moon-surface fine-textured at the center\n  B. **BATS** (~30%): vary the bat presentation — bat-ribbon streaming from a belfry / vast bat-cloud filling the upper sky / single bat-silhouette dramatically crossing the moon-disc / bat-swarm wheeling around the highest spire / paired bats perched on a gargoyle ledge / wedge-formation bat-flock crossing the sky\n  C. **FLYING GARGOYLES** (~20%): stone gargoyles in mid-flight (animated, alive) — single gargoyle in mid-pounce above the cathedral roof / pair of gargoyles wheeling in synchronized flight above the spires / gargoyle-pack diving from the upper battlements / lone gargoyle silhouetted against the moon mid-flight\n\n🚫 NO other spice categories — NO tiny figures / NO lanterns / NO wisps / NO sigils / NO crows / NO owls / NO wolves / NO comets / NO aurora-without-moon / NO shooting-stars / NO carriages.`,
    touchpoints: [
      'Vast pale-silver full moon riding low behind the central spire, deeply pock-marked surface visible — craters and dark maria readable as fine texture across the disc, a thin cloud-veil draped across the lower third of the lunar face, surrounding sky deep violet',
      'Massive blood-orange full moon haloed in red corona at midground sky, deep maria visible like ink on copper, fine crater-detail across the upper hemisphere, surrounding sky bruise-purple',
      'Clear-sky full moon at zenith above the cathedral, sharp crater-shadows raking across the surface in stark high-contrast detail, no clouds, surrounding violet-black night with cold stars',
      'Storm-cloud-shrouded full moon partially veiled, the visible portion showing fine pock-marked surface, fork-lightning crackling at the cloud-edge revealing more moon-detail in flashes',
      'Eclipsed full moon with red corona ringing the blackened disc, surface detail still readable through the eclipse-shadow as a darkened-but-textured face',
      'Wind-torn cloud-rags streaking across a vivid full moon, the moon-surface visible between cloud-tears with deep crater-detail, surrounding sky storm-purple',
      'Mist-veiled full moon glowing softly through a thin fog-curtain, surface texture diffused but still readable, the moon haloed in a pale-violet ring',
      'Twin-moon night with both moons full and richly detailed, offset against deep-violet sky, the smaller moon casting a fainter shadow than the larger',
      'Aurora-haloed full moon, aurora-curtain of green-violet rippling behind the moon-disc, moon-surface fine-textured with visible craters at the center',
      'Pale full moon haloed in concentric pale-violet corona rings, surface deeply detailed with visible maria, the moon rendered larger than physically plausible directly behind the central spire',
      'Frost-blue full moon in winter sky with crater-detail enhanced by cold-tone shading, surrounding stars cold-pale, the moon casting silver light across the frosted facade',
      'Smoke-veiled full moon partially obscured by rising chimney-smoke, the visible portion showing fine textured surface, the smoke catching moonlight in gold-violet streamers',
      'Bone-white full moon at deep midnight, every crater shadowed in stark relief, surrounding sky impossibly dark, the moon almost three-dimensional in its detail',
      'Full moon glimpsed through broken storm-clouds, surface visible in a single torn-cloud aperture, every crater detail crisp in the cloud-gap, surrounding sky bruise-purple churning',
      'Violet-coronaed full moon directly behind the cathedral spire, the spire silhouetted as a black blade across the moon-disc, surface detail wrapping around the silhouette',
      'A stream of bats pouring from the bell-tower belfry like a black ribbon, the stream extending across the upper third of the frame, individual wing-shapes visible',
      'A vast bat-cloud filling the upper sky behind the structure, dozens of silhouettes converging into a dense layer across the moon',
      'A single bat in mid-flight directly across the lunar disc, wings spread wide, frozen as a stark silhouette against the textured moon-surface',
      'A bat-swarm wheeling in slow gyre around the highest spire, the silhouettes a moving constellation against the violet sky',
      'A wedge-formation bat-flock crossing the sky between the structure and the moon, dozens in V-pattern flight',
      'Three bats perched motionless on a gargoyle ledge at midground edge, wings folded, heads tilted toward the camera',
      'A vampire-bat-stream the size of a city-bus pouring from a single belfry window at midground, the stream curling outward into the storm-sky in serpentine pattern',
      'A pair of bats wheeling in synchronized flight directly in front of the moon-disc, their silhouettes catching pale moonlight on outstretched wings',
      'A bat-cloud emerging from beneath the cathedral porch-arch in a slow upward spiral, individual bats visible in mid-burst',
      'A single bat silhouette dramatically frozen in mid-dive past the highest pinnacle, wings hyper-extended, claws extended forward toward unseen prey',
      'A single stone gargoyle in mid-flight above the cathedral roof, wings outstretched, stone-eyes glowing pale-green, mid-pounce with claws extended',
      'A pair of gargoyles wheeling in synchronized flight above the central spires, their stone-wings catching moonlight at high angles',
      'A gargoyle-pack of four silhouettes diving from the upper battlements toward unseen quarry below, all in mid-dive with wings half-folded',
      'A lone gargoyle silhouetted dramatically against the full moon mid-flight, wings outstretched and tail trailing behind, the moon-disc visible through the gap between wings',
      'A gargoyle in mid-leap from one tower-cap to another, mid-flight pose frozen, stone-claws extended, wings beating downward',
    ],
    instructions: `Each entry is ONE spice element, 25-45 words. ONLY 3 categories: dramatic detailed full moons (~50%) / bats (~30%) / flying gargoyles (~20%). NEVER white-blob moons — moons must show rich crater + maria + surface detail. ALWAYS full moon (never crescent/half/quarter). STRICT GothBot dark-fantasy. NO other spice categories. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_architecture_accent_creature: {
    format: 'simple',
    theme: `80%-gated ACCENT CREATURES for gothic-architecture scenes — tiny atmospheric dark-wildlife that enhances without competing with the structure. Each entry 15-30 words. Castlevania / Bloodborne / Crimson-Peak visual lineage.\n\n⚠️ ACCENT ONLY — tiny scale-prover, never primary subject. The structure is hero; these add alive-haunted texture.\n\n⚠️ NO HUMANS / NO HUMANOID FIGURES.\n\n✓ ALLOWED: a crow on a gargoyle ledge / bat-swarm from a bell-tower / single bat silhouette / wolf in the courtyard / wolf-pack at the gate / pale-ghost wisp past a window / raven on a weathervane / owl on a stone-angel statue / moth around an unlit lantern / cat on a balcony / fox at the doorway`,
    touchpoints: [
      'a single black raven perched on the highest gargoyle ledge at midground edge, one bright eye fixed on the camera',
      'a vast bat-swarm streaming from the bell-tower belfry in a black ribbon across the upper frame',
      'three bat-silhouettes wheeling between two of the spires at midground, their wing-shapes catching moonlight',
      'a wolf at the foot of the gate-arch in midground, head turned toward the camera, fur ragged and eyes faintly luminous',
      'a wolf-pack of four silhouettes on the cathedral-approach steps at midground, all watching motionless',
      'a pale-ghost wisp drifting past a stained-glass window at midground, the wisp visible through the colored glass',
      'a raven perched on the weathervane atop the highest spire at midground, silhouetted against the moon',
      'an owl with massive luminous amber eyes perched on a stone-angel statue at midground, head turned to face the camera',
      'a single luminous moth the size of a dinner plate circling an unlit iron-cage lantern at midground edge',
      'a black cat sitting on a stone balustrade at midground edge, motionless and unnaturally still',
      'a fox crossing the cathedral-doorway threshold at midground, head turned to look back, fur catching moonlight',
      'a flock of black-feathered ravens perched along a weathered iron-fence at midground edge, all motionless and watching',
      'a single gargoyle silhouette in mid-flight at midground above the cathedral roof, wings spread, posed unnaturally still',
      'a swarm of fireflies drifting through an open archway at midground, pale-green points visible against dark interior',
      'a hawk-silhouette wheeling above the highest spire at midground, dark against the violet sky',
      'a black-feathered crow perched on the wrought-iron portcullis at midground, calling silently with open beak',
      'an owl perched on a broken stone-angel arm at midground edge, eyes glowing pale-green in moonlight',
      'a single bat-swarm passing across the moon at midground, the silhouettes a dense layer obscuring half the lunar disc',
      'a procession of spectral will-o-wisps drifting up the cathedral-approach steps at midground edge in slow line',
      'a black-iron-bound spellbook left open on a low pedestal at the gate-approach midground edge, pages turning by themselves',
      'a single suit of empty cursed armor standing at the cathedral-approach midground edge, helm-visor down, sword planted in ground (no body inside)',
      'a vulture flock visible on a distant battlement-row at deep midground, perched and patient',
      'a single owl-shadow passing across the moon at midground, the silhouette unmistakable',
      'a fox-silhouette emerging from an open crypt-door at midground edge, head turned toward the camera',
      'a single nightshade-vine creeping across the gate-arch at midground foreground edge, a black-spider perched on the largest leaf',
    ],
    instructions: `Each entry is ONE accent creature, 15-30 words. NO HUMANS / NO HUMANOID FIGURES. Tiny scale-prover only. STRICT GothBot dark-fantasy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_architecture_sky: {
    format: 'simple',
    theme: `SATURATED GOTHIC SKY for a gothic-architecture scene. Each entry 15-30 words. The sky FRAMES the structure. Castlevania / Bloodborne / Crimson-Peak visual lineage.\n\n⚠️ Structure dominates 80%+ of the frame; sky is supporting backdrop — but MUST be saturated theatrical, never washed-out.\n\n🚫 NO sci-fi / nebulas / orbital / cheerful-blue. NO blood-red dominant (red moon ~10% max). NO LOTR / Skyrim / Witcher vocabulary.\n\n✓ GOTHIC ARCHITECTURE SKIES: storm-bruised violet with fork-lightning silhouetting spires / moonlit-violet with massive moon dominant / sickly-green aurora rippling overhead / lavender-indigo twilight / storm-cracked violet with sheet-lightning / corpse-pale overcast / fel-violet storm-cloud with bat-shadows / aurora-curtained night with crow-silhouettes / pale-rose dusk / cathedral-cloud violet / blackened-eclipse-moon / star-streaked aurora / twin-moon night sky`,
    touchpoints: [
      'Storm-bruised purple-and-violet sky with fork-lightning crackling at horizon, silhouetting the spires of the structure',
      'Moonlit-violet sky with a massive pale-silver moon dominant directly behind the central spire, halo-glow around the lunar disc',
      'Sickly green-violet aurora rippling across the night sky in slow waves, the green light catching every weathered stone of the facade',
      'Lavender-indigo twilight bleeding from rose-horizon to deep-violet zenith, the structure silhouetted in saturated mood',
      'Storm-cracked violet sky with fork-lightning illuminating architectural detail in stark flashes',
      'Corpse-pale overcast with phantom-shape outlines barely visible in the cloud-bank, the structure rising before them',
      'Fel-violet storm-cloud sky with bat-shadow silhouettes moving across, no actual birds present',
      'Aurora-curtained night with green-and-violet light-curtains rippling, crow-silhouettes wheeling against the curtains',
      'Pale-rose dusk bleeding to deep violet with a single witch-star at horizon catching the structure-glow',
      'Cathedral-cloud sky with massive painted cloud-banks piled in vertical stratus-castles behind the spires',
      'Blackened-eclipse moon haloed in pale corona behind the central spire (use ~10% max)',
      'Bruised-blue-violet sky with painted thunder-cloud architecture, sheet-lightning at horizon revealing structure-silhouette',
      'Twin-moon night sky with two moons hanging dim-and-pale-violet against deep-indigo, the structure silhouetted by both',
      'Pale corpse-light overcast with no warmth, the structure casting no shadow, lit only by its own inner-glow',
      'Ash-snow sky with slow black flakes falling perpetually, accumulating on every spire-edge and balcony-rail',
      'Violet-and-rose sunset bleeding to deep indigo, single witch-light at horizon catching the highest spire',
      'Storm-violet sky with sheet-lightning at horizon and fork-lightning above, bat-ribbons clearly visible in the flash above the structure',
      'Pale-silver moon haloed in faint violet corona behind the central tower, surrounding stars cold-pale',
      'Pyre-smoke and ash-fall sky with distant amber fires at horizon below, the cloud-cap glowing dimly, crows wheeling silhouetted',
      'Bone-white overcast sky with thin black cracks visible as if the sky itself were ceramic and breaking',
      'Spectral-army visible in the cloud-bank as ghostly silhouettes, the cloud lit faintly luminous from within behind the spires',
      'Pale-violet corruption sky with phantom-bird silhouettes circling at altitude above the bell-tower',
      'Storm-bruised violet sky with mammatus pouches and forking lightning above the cathedral, every quadrant churning',
      'Star-streaked aurora night with shooting-stars visible against the green-and-violet curtains',
      'Sickly green god-ray piercing through corrupted cloud-cover onto a single point of the structure facade',
    ],
    instructions: `Each entry is ONE saturated theatrical gothic sky framing the structure, 15-30 words. SATURATED + THEATRICAL + GOTHIC. NEVER cheerful blue / NEVER clean daylight. STRICT GothBot dark-fantasy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT gothic-vista path (2026-05-15, full bespoke migration).
  // The LAND IS ALIVE mandate — dark-wildlife everywhere, bioluminescent
  // flora, structures glowing from within, supernatural-presence sigils.
  // Awe-and-dread. NO CHARACTERS. ──────────────────────────────────────

  gothbot_gothic_vista_biome: {
    format: 'simple',
    theme: `LIVING-AND-HAUNTED GOTHIC LANDSCAPE BIOMES for GothBot's gothic-vista path. Each entry is a FULL biome with multi-tier depth (foreground tactile / midground body / deep distance / sky context). Castlevania / Bloodborne / Crimson-Peak / Berserk / Tim-Burton / Van-Helsing / Dark-Souls visual lineage. Each entry 50-80 words.\n\n⚠️ MANDATORY in EVERY entry: the LAND IS ALIVE — render dark-wildlife AND bioluminescent dark-flora AND a supernatural-presence signal visibly woven into the biome description. NOT a static dead backdrop — a LIVING BREATHING gothic world that GORGEOUSLY UNSETTLES.\n\n⚠️ Dark-wildlife signals (at least one in each entry): crows wheeling in ominous formations / bats streaming from a belfry in black ribbons / wolves watching from a treeline / owls perched on gargoyles / fireflies drifting through graveyards like wandering spirits / moths circling unlit lanterns / spectral wisps between headstones / single raven on a tomb-cross.\n\n⚠️ Bioluminescent dark-flora signals: black moss reclaiming stone / nightshade-and-belladonna bloom-clusters / moonflowers in silver light / ghostly pale wildflowers in cursed soil / bioluminescent fungi pulsing in crypt-corners / glow-thorn vines / luminous nightshade berries.\n\n⚠️ Supernatural-presence signals (at least one): fog moving against the wind / shadows pooling where no object casts them / lit windows impossibly glowing in abandoned ruins / spectral wisps drifting / witch-fire green glow bleeding from cathedral windows / unnaturally still fog-curtain.\n\n⚠️ STRICT GOTHIC DARK-FANTASY ONLY — NEVER LOTR / Skyrim / Witcher / Warcraft / DragonBot high-fantasy vocabulary.\n\n⚠️ NO CHARACTERS / NO humanoid figures (dark-wildlife as scale-prover only).\n\n⚠️ MOVIE-POSTER WIDE VISTA — every biome reads as JAW-DROPPING. The kind of landscape that opens a Castlevania stage / Bloodborne area. SCALE-VERTIGO mandatory.\n\nMANDATORY in every entry:\n• A SPECIFIC GOTHIC BIOME (haunted-forest / cemetery / moorland / coastal-cliff / canyon-gorge / cursed-village / abbey-ruin / castle-approach / frozen-lake / swamp / volcanic-wasteland / etc.) named distinctly\n• MULTI-TIER DEPTH — foreground tactile detail + midground body + deep distance atmospheric layer\n• "ALIVE AND HAUNTED" SIGNAL — dark-wildlife + bioluminescent-flora + supernatural-presence woven together\n• A SIGNATURE FEATURE that makes this biome distinct (specific architectural ruin / specific moonlight pattern / specific witch-fire / specific gothic-flora)\n• SCALE PROVER — explicit dark-wildlife or atmospheric scale-prover (NEVER humanoid)\n\n🚫 ABSOLUTE BANS:\n• NO characters / human figures / humanoid silhouettes — dark-wildlife only\n• NO LOTR / Skyrim / Witcher / Warcraft vocabulary\n• NO modern / industrial / sci-fi / cyberpunk / neon\n• NO single-tier flat compositions\n• NO "looking through stone archway at gothic building in middle distance" — banned cliché\n• NO blood-red-stained-glass dominant (windows DARK / MOONLIT VIOLET / CANDLE-AMBER / FEL-GREEN / WITCH-FIRE GREEN only)\n• NO red-fog / red-mist / red-everything (palette is purple/violet/blue/green/silver/black with red as ACCENT only)\n• NO blood-moon dominating the sky (~10% max)\n• NO interior chamber compositions\n\nVARIETY MANDATE — distribute across gothic-biome categories with dark-life integration:\n\n  A. **HAUNTED FOREST WITH DARK-WILDLIFE** (~15%): petrified dead trees with crow-flocks / blackened canopy with bat-ribbons / will-o-wisp-haunted woodland with spectral wisps\n  B. **CEMETERY WITH DARK-LIFE** (~15%): tombstone field with crow-murders / mausoleum city with owl-on-gargoyle / drowned tomb-garden with firefly-swarms\n  C. **CASTLE-APPROACH WITH GLOWING WINDOWS** (~15%): mountain-pass to castle with witch-fire green windows / cliff-top fortress with single lit-window / spired citadel with candle-tower glow\n  D. **CATHEDRAL/ABBEY WITH INNER-GLOW** (~10%): cathedral ruin with witch-fire stained-glass / abbey courtyard with candle-tower / monastery with bell-tower bat-stream\n  E. **COASTAL CLIFF WITH STORM-LIGHTHOUSE** (~10%): storm-coast with lighthouse-candle / fjord with sea-cave-glow / drowning village with witch-fire window\n  F. **MOOR/HEATH WITH DARK-WILDLIFE** (~10%): heather-moor with abbey-glow + wolves on ridge / blackthorn waste with raven-flock / cursed-fen with will-o-wisps\n  G. **MOUNTAIN PASS WITH GLOWING CITADEL** (~5%): mountain-pass with vampire-castle showing witch-fire windows / snow-pass with monastery-glow\n  H. **WETLAND/SWAMP WITH SPECTRAL-WISPS** (~10%): half-submerged gothic ruin with will-o-wisps / corpse-marsh with dead-tree-firefly-spires / drowned chapel with witch-fire window\n  I. **CURSED VILLAGE WITH IMPOSSIBLE LIT-WINDOWS** (~5%): aerial view of haunted village with castle-glow / Gothic city with witch-fire windows / abandoned village at dusk with single-lit-tavern\n  J. **CANYON WITH BIOLUMINESCENT FLORA** (~5%): canyon-gorge with glow-fungi / cliff-perch monastery with luminous-moss / red-rock canyon with bioluminescent-vines\n  K. **FROZEN LANDSCAPE WITH GLOW** (~5%): frozen-lake with chateau-glow across ice / snow-cemetery with witch-fire / ice-rimed castle with single window-glow\n  L. **VOLCANIC WASTELAND WITH FORGE-GLOW** (~5%): volcanic plain with abandoned forge still burning / ash-fall city with single-tower-burning / smoldering crater-field with witch-fire vents`,
    touchpoints: [
      'HAUNTED FOREST WITH BAT-RIBBON BELFRY — dead petrified forest stretching to horizon with a bell-tower piercing canopy at midground, ribbons of bats streaming from its open belfry across a moonlit-violet sky; foreground: a single nightshade-bloom cluster glowing pale-luminous beside a moss-claimed grave-stone, fireflies drifting; midground: the bell-tower with one window glowing witch-fire green; deep distance: more dead canopy receding into violet mist.',
      'CEMETERY WITH OWL-ON-GARGOYLE — vast tombstone field stretching miles with a mausoleum-cathedral at midground, a great horned owl perched on a weeping-angel statue staring at the camera, crow-murder wheeling overhead; foreground: a single luminous moonflower opening between two tilted gravestones; midground: the mausoleum with witch-fire-green window pulsing; deep distance: more tombstones into pale fog; sky: silver moon and aurora-violet.',
      'CASTLE-APPROACH WITH WITCH-FIRE WINDOWS — narrow stone road winding up between sheer cliff-walls toward a multi-spire vampire-castle, every window glowing emerald witch-fire as if something alive watches from within; foreground: a single weathered cairn-stone with a single raven perched on top; midground: the switchback road with creeping ivy strangling iron gates beside it; deep distance: the castle silhouetted against violet-twilight storm-sky with witch-fire glow casting onto the rocks below.',
      'CATHEDRAL RUIN WITH WITCH-FIRE STAINED-GLASS — collapsed Gothic cathedral half-swallowed by dead-bark forest, the rose-window shattered but the rim still bleeding witch-fire green light onto the surrounding stone; foreground: a fallen stone-saint relief glowing pale-luminous from bioluminescent moss; midground: the cathedral with witch-fire stained-glass casting green pools onto the forest floor, bats streaming from one tower; deep distance: more forest receding; sky: pale moonlit-violet with crow-flock silhouettes.',
      'COASTAL CLIFF WITH STORM-LIGHTHOUSE — black basalt sea-cliff above crashing waves with a vast Gothic lighthouse-tower at midground, single witch-fire green candle burning at its summit, gulls and storm-petrels wheeling; foreground: a single firefly swarm rising from a dead-bramble cluster at the cliff-edge; midground: the lighthouse-tower silhouetted with green-fire summit; deep distance: storm-line at sea-horizon with sheet-lightning; sky: storm-bruised purple with fork-lightning illuminating bat-ribbons.',
      'MOOR WITH WOLF-RIDGE — windswept blackthorn moor with a weathered abbey silhouette at midground showing a single lit-window, a wolf-pack silhouetted on a distant ridge watching across the heath; foreground: a single standing-stone with moss-claimed runes, nightshade-blooms at its base glowing faintly violet; midground: the moor stretching with the abbey at center, wolves on the ridge to one side; deep distance: more moor receding; sky: twilight-lavender to deep-violet.',
      'SPIRED CITADEL WITH CANDLE-TOWER — valley-floor view looking up at a multi-spired dark citadel with a single tower bleeding candle-amber light, bats streaming around its battlements like a living veil; foreground: a fallen banner-stone with creeping ivy; midground: the valley floor with mist rolling toward the citadel; deep distance: the citadel rising into the storm-sky with candle-glow window; sky: storm-cracked violet with sheet-lightning.',
      'WETLAND WITH WILL-O-WISP CHAPEL — black-water swamp filled with vertical dead-tree trunks half-submerged like cathedral pillars, a half-drowned Gothic chapel at midground with witch-fire window casting green onto the water; foreground: a single will-o-wisp drifting near the camera with reflected glow on black water, glow-fungi clusters on the nearest trunk; midground: the chapel with broken spire and witch-fire window, more will-o-wisps drifting between trunks; deep distance: dead cypress receding into mist; sky: green-tinged overcast.',
      'AERIAL HAUNTED VILLAGE — high vantage looking down on a fog-shrouded valley with cursed village clustered along a black river, a vampire-castle on the distant hilltop with witch-fire windows; foreground: dead-tree branches in the upper frame as a window into the scene, a perched raven on the nearest branch; midground: village rooftops poking through fog with impossible lit-windows in supposedly-abandoned houses; deep distance: the castle silhouetted on the hill against violet sky; sky: violet-twilight with crow-formation flying.',
      'FROZEN LAKE WITH CHATEAU-GLOW — vast frozen-lake foreground stretching to a Gothic chateau silhouette across the ice, the chateau windows blazing amber as if a feast continues despite the building being long-abandoned; foreground: a single black-feathered raven perched on a frozen-reed stalk; midground: the ice surface with starlight reflection; deep distance: the chateau with multiple lit windows casting amber pools onto the surrounding snow; sky: aurora-purple with pale-silver moon, bat-silhouettes in the upper frame.',
      'CANYON WITH BIOLUMINESCENT VINES — deep canyon spanned by a colossal stone aqueduct-bridge with multiple arch-tiers, every arch wrapped in glowing bioluminescent ivy that pulses in slow rhythm; foreground: cliff-edge with a gnarled dead tree clinging to the rim, glow-fungi clusters at its base; midground: the aqueduct in profile, water still trickling in places, vines pulsing across every arch; deep distance: the opposite cliff with monastery; sky: storm-bruised purple with crows wheeling in slow gyre.',
      'ABBEY UNDER LAVENDER SKY WITH OWL-WATCH — windswept blackthorn moor with weathered abbey silhouette at deep distance, an owl perched motionless on the highest spire watching across the heath; foreground: a single weathered standing-stone with rune-carving, nightshade-blooms at base; midground: the moor stretching toward the abbey; deep distance: the abbey with single lit-window casting amber spot; sky: twilight-lavender bleeding to deep violet, owl silhouette unmistakable.',
      'BARROW-FIELD WITH FIREFLY-SWARM — vast field of moss-covered barrow-mounds carpeted in blackthorn brambles, hundreds of fireflies rising in slow vortex above a central barrow; foreground: a single barrow-entrance stone with carved warning-runes, glow-fungi at base; midground: the barrow-field with fireflies converging; deep distance: a tor with standing-stone circle; sky: pre-dawn rose with witch-fire green glow at horizon.',
      'DROWNED-FOREST WITH GLOW-FUNGI — black-water swamp filled with vertical dead-tree trunks half-submerged, every trunk covered in pulsing glow-fungi in pale-green and violet; foreground: dark water reflecting upward into the trunks, a single luminous moonflower floating on the surface; midground: the trunk-grove receding into mist with green fungal-glow pulsing in waves; deep distance: a partially-drowned chapel-spire silhouette with witch-fire window; sky: visible only as pale-violet patches between canopy-skeletons.',
      'BLOOD-MOON FOREST CLEARING WITH RAVENS — circular forest clearing with a single ancient witch-tree at center, the eclipsed moon directly overhead through a perfect break in the canopy, dozens of ravens perched in the witch-tree branches; foreground: a weathered stone-altar with offerings (candles, dried roses, glow-fungi), a single raven on the altar-edge; midground: the witch-tree with raven-laden antler-branches; deep distance: surrounding black-bark forest; sky: eclipsed moon with red corona, ravens silhouetted.',
      'VOLCANIC WASTELAND WITH FORGE-RUIN — vast plain of cracked black volcanic glass under perpetual ash-fall, a ruined Gothic forge at midground still burning amber as if the smith never stopped; foreground: a single twisted dead-bramble growing from glass-cracks, glow-fungi at base; midground: the plain stretching with the forge-ruin emitting amber glow visible miles away; deep distance: scattered obsidian fang-spires; sky: storm-bruised purple with violet aurora and ash-fall.',
      'WINTER PASS TO ICE-RIMED FORTRESS WITH WITCH-FIRE — snowy mountain-pass with weathered black-stone fortress visible on the highest crag, single witch-fire green window casting green onto the snow; foreground: a single frostbitten dead pine clinging to the cliff-edge, a wolf-print trail in fresh snow leading away; midground: the pass with wolf-pack silhouetted in deep midground; deep distance: the fortress with witch-fire window; sky: aurora-purple with snow-dust drifting.',
      'CURSED VILLAGE AT DUSK WITH IMPOSSIBLE LIT WINDOWS — abandoned half-timbered Gothic village with single street between empty houses, every house showing amber lit-windows despite the village being long-deserted; foreground: a dropped basket of withered roses, a moth circling an unlit lamp-post; midground: the street with lit windows and floating motes; deep distance: a Gothic church-spire at street-end with witch-fire window; sky: post-dusk indigo with first stars.',
      'POISONED FEN AT TWILIGHT WITH WISPS — flat reed-marsh in dim twilight with rolling violet fog, willow-of-the-wisps dancing knee-high in dozens; foreground: a single reed-cluster with perched black-bird, glow-fungi at base; midground: the marsh with fog rolling in slow waves, wisps converging into formations; deep distance: a Gothic chapel emerging from fog with witch-fire window; sky: post-dusk green-purple gloom.',
      'CATACOMB-ENTRANCE PLAIN WITH OWLS — flat barren stone-plain with vast carved catacomb entrance, twin colossal stone-angel statues flanking the descent, owls perched on both angel-shoulders; foreground: a single weathered offering-stone with melted candle stubs and glow-fungi cluster; midground: the catacomb-entrance with darkness within and witch-fire green spilling out; deep distance: more carved-stone features dotting the plain; sky: pre-dawn rose with constellation visible.',
      'STORM-LIT ABBEY ON SEA-STACK WITH BAT-STREAM — solitary Gothic abbey on an isolated sea-stack with crashing waves around its base, lightning illuminating the silhouette, bats streaming from a bell-tower window in a black ribbon; foreground: storm-spray exploding against weathered rocks; midground: the abbey silhouetted with bat-stream; deep distance: storm-line at horizon with sheet-lightning; sky: storm-violet with fork-lightning.',
      'VAMPIRE-CASTLE OVER MIST-VALLEY WITH WITCH-FIRE — towering multi-spire vampire-castle viewed from below, every window blazing witch-fire green like a constellation of unblinking eyes; foreground: a Gothic stone-bridge crossing a black river with weathered statuary, a raven on the bridge-keystone; midground: the valley floor with rolling mist; deep distance: the castle with hundreds of witch-fire windows; sky: violet-twilight with bat-silhouettes circling the highest spire.',
      'WITCH-FOREST WITH BARROW-MOUND AND WISPS — small clearing in dead-bark forest with single moss-grown barrow-mound at center, weathered stone-marker at the apex, will-o-wisps converging around the marker; foreground: a circle of pale-green witch-fire candles burning low on the forest-floor; midground: the barrow with the marker and wisps; deep distance: skeletal forest; sky: pale-violet through the canopy, a single raven silhouetted.',
      'GOTHIC ROCKBOUND COVE WITH BAT-COLONY — small cove between sheer black cliffs with single Gothic chapel on a sea-stack, dark waves crashing around it, a vast bat-colony streaming from the chapel-belfry against moonlit sky; foreground: a single weathered jetty with overturned boat, glow-fungi on the planks; midground: the chapel with witch-fire window, bat-stream visible; deep distance: open ocean with storm-line; sky: storm-violet with pale-silver moon, bat-ribbon clearly visible.',
      'TOMB-GARDEN OVERGROWN WITH MOONFLOWERS — vast garden-cemetery overgrown with black-rose AND moonflower vines crawling across stone-angels and tomb-crosses, moonflowers opening in silver light; foreground: a fallen moonflower-bloom on a weathered grave-stone, single firefly drifting; midground: the rose-AND-moonflower vines crawling everywhere with bioluminescent glow in pockets; deep distance: a central mausoleum-chapel silhouette with witch-fire window; sky: rose-dusk with single morning-star, owl silhouette on the mausoleum-roof.',
    ],
    instructions: `Each entry is ONE alive-and-haunted gothic biome, 50-80 words. Format: "[BIOME NAME] — [primary element with dark-life]; foreground [tactile detail with dark-flora]; midground [body with architecture-glowing-from-within]; deep distance [atmospheric layer]; sky [overhead]". MANDATORY: dark-wildlife visible + bioluminescent dark-flora + supernatural-presence signal. STRICT GothBot dark-fantasy. NO LOTR / Skyrim / Witcher vocabulary. NO characters / human figures. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_vista_architecture: {
    format: 'simple',
    theme: `GOTHIC ARCHITECTURE GLOWING FROM WITHIN for gothic-vista scenes. Each entry 20-40 words. Castlevania / Bloodborne / Crimson-Peak / Berserk visual lineage.\n\n⚠️ MANDATORY: every structure has VISIBLE INNER-GLOW — witch-fire green window / candle-amber tower-light / forge-ember basement / single lit-window in an abandoned building / bioluminescent moss-spread across the facade. Something is ALIVE inside, even when nothing should be.\n\n⚠️ STRICT GOTHIC ONLY — NO LOTR / Skyrim / Witcher / Warcraft architecture.\n\n🚫 NO modern (no electric lighthouses / no clocktowers with digital faces / no factories). NO real-world ethnic codes. NO sci-fi.\n🚫 NO cheerful / bright structures. Every entry is RUINED, WEATHERED, or HAUNTED — but ALIVE WITH GLOW.\n🚫 NO blood-red-stained-glass dominant — windows DARK or WITCH-FIRE GREEN or MOONLIT VIOLET or CANDLE-AMBER or FEL-GREEN only.\n\n✓ GOTHIC ARCHITECTURE: vampire-castles with witch-fire windows / Gothic cathedrals with stained-glass bleeding green / ruined abbeys with single lit-window / cliff-perched monasteries with candle-tower / mausoleum-cathedrals with crypt-glow / black-iron fortresses with forge-ember / spired citadels with multiple impossible-lit windows / cursed-village churches with bell-tower glow / chateau-manors with mansard-glow / Gothic lighthouse-towers with candle-fire beacon / forge-ruins still burning / blood-cult-temple-glow.`,
    touchpoints: [
      'A multi-spire vampire-castle with witch-fire green windows glowing in every tower, gargoyles silhouetted against the inner light.',
      'A Gothic cathedral ruin with a shattered rose-window still bleeding witch-fire green into the surrounding forest.',
      'A cliff-perched abbey with a single lit-window high in the spire, candle-amber glow against the moonlit-violet sky.',
      'A vast mausoleum-cathedral with witch-fire green seeping from cracks between the stone-angel statuary at the entrance.',
      'A black-iron fortress with forge-ember glow visible through arrow-slit windows, smoke rising from a chimney impossibly active.',
      'A solitary Gothic spire with a single witch-fire green lit window at its summit, ravens circling the inner-glow.',
      'A cursed-village church with bell-tower glowing amber from within, bats streaming from the bell-window in a black ribbon.',
      'A chateau-manor with dozens of mansard-roof windows glowing amber, as if a midnight ball still goes on inside.',
      'A bell-tower glowing witch-fire green from within, the iron-bell silhouetted against the inner light.',
      'A catacomb-entrance gate with green-fire light spilling out from the descending stair beyond the threshold.',
      'A Gothic stone-aqueduct with bioluminescent vines crawling up the arches, every arch pulsing pale-violet.',
      'A vast necropolis-skyline with multiple mausoleum-windows glowing impossibly across the tomb-city.',
      'A moss-covered barrow-mound with a witch-fire green glow seeping from the carved-stone entrance.',
      'A sea-stack chapel with single witch-fire window blazing through storm-mist, visible miles offshore.',
      'A forest-shrine with twin candle-stands burning bright violet, weathered carved-saint relief catching the light.',
      'A blood-cult temple with cult-sigils glowing red along the carved walls (rare — accent only, NOT dominant).',
      'A Gothic lighthouse-tower with single candle-fire beacon at the summit, weathered with salt-rime.',
      'A drowning-chapel with the upper half of its bell-tower above black-water, witch-fire green spilling from the open belfry.',
      'A cliff-bridge fortress with multiple witch-fire green windows along its central tower, smoke rising from a chimney.',
      'A Gothic abbey courtyard with the central well glowing pale-violet from within, bioluminescent moss across every wall.',
      'A vampire-castle gatehouse with witch-fire green flames burning in iron-cage braziers flanking the portcullis.',
      'A black-stone observatory with witch-fire green telescope-eye glowing at the dome-apex.',
      'A Gothic cliff-monastery with a candle-amber chain of windows running up its facade as if monks still pray within.',
      'A weathered cemetery-gate with witch-fire green glow seeping from beyond the iron-bars, suggesting something alive inside the necropolis.',
      'A cursed obelisk with red rune-lines glowing at the seams (accent only — not dominant), surrounded by lesser glowing rune-stones.',
    ],
    instructions: `Each entry is ONE gothic architecture focal point WITH VISIBLE INNER-GLOW, 20-40 words. STRICT GothBot gothic dark-fantasy. NO LOTR / Skyrim / Witcher / modern / sci-fi / real-world ethnic. Positioned at MIDGROUND or DEEP DISTANCE. Inner-glow is mandatory. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_vista_phenomenon: {
    format: 'simple',
    theme: `80%-gated SUPERNATURAL-PRESENCE PHENOMENA for a gothic-vista scene — the LAND-IS-WATCHING signal. Each entry 25-50 words. Castlevania / Bloodborne / Crimson-Peak / Berserk visual lineage.\n\n⚠️ MANDATORY: every phenomenon signals SOMETHING IS WATCHING / SOMETHING IS WRONG / THE LAND REMEMBERS. Not just atmospheric — eerie + alive + present.\n\n🚫 NO sci-fi / cosmic / nebulas / orbital structures. NO Lovecraftian-tentacle-horror.\n\n✓ SUPERNATURAL-PRESENCE PHENOMENA: fog moving against the wind / shadows pooling where no object casts them / lights flickering in impossible patterns / fireflies converging into watching-eye formations / spectral apparitions emerging from cloud-banks / a phantom carriage drawn by spectral horses at deep distance / witch-fire green aurora "breathing" / phantom-bell tolling visible as concentric mist-ripples / a watching-tower window where no one should be lit / a procession of will-o-wisps marching in formation / shadows of unseen wings passing over the scene / unnaturally-still fog-curtain that splits to reveal something / a single distant figure-shape in the mist that vanishes when looked at directly / a moaning low wind that visibly moves only certain leaves / ravens forming letters in flight / a watching-pair-of-eyes glowing from a tree-hollow at midground edge`,
    touchpoints: [
      'SPECTRAL MIST AGAINST THE WIND — wall of pale violet mist advancing across the landscape against prevailing wind, faces almost visible within the curling vapor, eyes following the camera',
      'SHADOW-POOLS WHERE NO OBJECT CASTS — distinct dark shadow-pools on the moonlit ground that have no corresponding object overhead, the shadows moving slowly as if breathing',
      'FIREFLIES IN WATCHING-EYE FORMATION — vast swarm of fireflies converged into the shape of a giant watching-eye hovering above a barrow-mound, the pupil-area darker than the surrounding light',
      'PHANTOM CARRIAGE AT DEEP DISTANCE — translucent funeral-carriage visible at deep distance crossing the landscape, drawn by spectral horses, no driver visible, a lantern at the carriage-side',
      "WITCH'S TOWER-LIGHT BREATHING — single beam of witch-fire green light from a distant tower cast upward onto the cloud-bank, pulsing in slow rhythm as if breathing",
      'SPECTRAL APPARITION IN CLOUD-BANK — ghostly figure formed of pale mist visible in the distant cloud-bank, holding shape briefly before dissolving, leaving a faint residue of presence',
      'WILL-O-WISP MARCHING PROCESSION — dozens of pale-violet wisps in single-file formation moving slowly across a moor as if processing toward an unseen destination',
      'GHOST-BELL RIPPLES IN MIST — visible concentric ripples expanding through fog as a phantom bell tolls across the silent landscape, the toll itself silent',
      'IMPOSSIBLE LIT-WINDOW BLINKING — a single window in a distant abandoned tower glowing candle-amber and visibly blinking on-off-on in slow rhythm',
      'SHADOWS OF UNSEEN WINGS — vast shadow shapes of bird-wings passing across the moonlit landscape with no actual bird visible overhead, the shadows moving in slow gyre',
      "UNNATURAL FOG-CURTAIN SPLIT — a wall of fog suddenly splits down the middle to reveal a distant Gothic structure that wasn't there moments before, the fog re-closing slowly",
      'DISTANT FIGURE-SHAPE VANISHING — a humanoid silhouette barely visible in the mist at deep distance, half-formed and dissolving as the camera resolves on it',
      'MOANING LOW WIND MOVING ONLY CERTAIN LEAVES — wind that visibly moves only specific dead-leaf clusters across the landscape, the rest of the foliage still, suggesting something invisible passes through',
      'RAVENS FORMING LETTERS IN FLIGHT — a murder of crows arranged in flight-formation that resolves momentarily into letters or sigils in the violet sky before dispersing',
      'WATCHING-EYES IN TREE-HOLLOW — a pair of glowing pale-green eyes visible in a distant tree-hollow at midground edge, blinking once, then gone',
      'WITCH-FIRE AURORA BREATHING — vast green-violet aurora across the sky that visibly inhales-and-exhales in slow rhythm, the colors deepening on the exhale',
      'BAT-STREAM FORMING SPIRAL — vast stream of bats forming a slow spiraling vortex above a ruined cathedral, the vortex-center filled with witch-fire green light',
      'PHANTOM-FUNERAL PROCESSION DISTANT — translucent procession of robed figures visible at deep distance carrying a phantom-coffin across a moor, moving slowly with phantom-lanterns',
      'GLOWING CARRION-BIRD FLOCK — vast flock of luminous spectral ravens circling overhead, their silhouettes glowing pale-green against the dark sky in slow rhythm',
      'UNHOLY-RUNE-GLOW IN GROUND — glowing red-and-violet rune-sigil scarred across the landscape ground (rare red-accent use), pulsing in slow waves visible to horizon',
      'NIGHTMARE-MOTH SWARM EYES — vast cloud of dark moths with glowing-skull-eye markings rising from the forest, the eyes appearing to watch the camera',
      'SPECTRAL HORSE-CARRIAGE FAR — translucent funeral-carriage visible crossing the landscape at deep distance, drawn by spectral horses, no driver',
      'CURSED-MIST CRAWLING LIKE SERPENTS — thick black-violet mist crawling across the ground in serpent-coil patterns, moving against the wind, occasionally rising in cobra-hood shapes',
      'BLOOD-MOON ECLIPSE — moon turning to crimson disk haloed in pale corona (use sparingly, ~10% max), the eclipse-light catching the dark-wildlife at midground',
      'WILL-O-WISP DENSE GATHERING — hundreds of pale-violet wisps swarming around a single ancient tree at midground in a slow vortex-pattern, the tree-leaves vibrating with their motion',
    ],
    instructions: `Each entry is ONE supernatural-presence phenomenon for a gothic-vista, 25-50 words. STRICT GothBot gothic dark-fantasy. Every phenomenon signals SOMETHING IS WATCHING / SOMETHING IS WRONG / THE LAND IS ALIVE. NO sci-fi / cosmic / Lovecraftian-tentacles. Use blood-moon sparingly (~10% max). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_vista_surprise_element: {
    format: 'simple',
    theme: `MANDATORY DARK-WILDLIFE / SCALE-PROVER for gothic-vista scenes — the LAND-IS-ALIVE signal. Each entry 15-35 words. Castlevania / Bloodborne / Crimson-Peak visual lineage.\n\n⚠️ NO CHARACTERS / NO humanoid figures (path is pure landscape). DARK-WILDLIFE only — crows / bats / wolves / owls / fireflies / spectral wisps / single fox / single black cat.\n\n⚠️ Dark-wildlife is MANDATORY at this layer — gothic-vista requires the landscape to feel ALIVE. Render scale-prover wildlife at midground or foreground edge.\n\n✓ ALLOWED: distant crow flock / bat ribbon from belfry / wolf-pack silhouette on a ridge / single owl on a gargoyle / firefly swarm in a graveyard / single raven on a tomb-cross / moths circling unlit lanterns / spectral wisps drifting between headstones / single fox crossing a moonlit path / single black cat on a tomb-step / a vulture flock on a distant gibbet / glowing-eyed crows perched along a fence.\n\n🚫 ABSOLUTE BANS: NO human / humanoid figures. NO modern objects. NO sci-fi. NO bright/cheerful elements.`,
    touchpoints: [
      'a vast murder of crows wheeling overhead in slow ominous gyre, dozens of black silhouettes against the violet sky at midground',
      'a stream of bats pouring from a belfry like a black ribbon, the stream extending across the upper midground',
      'a wolf-pack silhouetted on a distant ridge at midground edge, fur ragged and eyes faintly luminous in moonlight',
      'a single great horned owl perched on a gargoyle at midground edge, head turned with luminous amber eyes',
      'a vast swarm of fireflies drifting through a graveyard at midground, dozens of points of pale-green light',
      'a single raven perched on a tomb-cross at midground edge, one bright eye fixed on the camera',
      'a flock of moths circling an unlit lantern at midground edge, their wing-glints catching moonlight',
      'a procession of spectral will-o-wisps drifting between headstones at midground, pale-violet glow in slow line',
      'a single fox crossing a moonlit path at midground edge, head turned to look back, fur catching silver light',
      'a single black cat on a tomb-step at midground, motionless and unnaturally still, eyes glowing pale-green',
      'a vulture flock perched on a distant gibbet at deep midground, motionless and patient',
      'a row of glowing-eyed crows perched along a weathered iron-fence at midground edge',
      'a bat-cloud passing across the moon at midground, the silhouettes a dense layer obscuring half the lunar disc',
      'a single black-feathered raven on a fallen banner-pole at midground, the banner long-rotted but the iron of the standard still hooked',
      'a flock of hell-ravens circling a tower at midground, dozens of black silhouettes against the witch-fire green window',
      'a single deer silhouette at clearing-edge at midground, its eyes glinting silver in moonlight, antlers branching',
      'a wisp-swarm converging into a spiral pattern above a barrow at midground, pale-green points moving in coordinated formation',
      'a single owl with massive luminous amber eyes perched on a tomb-cross at midground, head turned to face the camera',
      'a black-iron-bound spellbook left open on a stone pedestal at midground, pages turning by themselves in still air (atmospheric, not human)',
      'a single suit of empty cursed armor standing at midground edge, helm-visor down, sword planted in ground (no body inside)',
      'a single dark-blossom flower growing impossibly from a skull at foreground edge, black-petaled and faintly luminous',
      'a Gothic carriage-lantern fallen on its side at midground, the wax-candle within still flickering somehow',
      'a single luminous moth the size of a dinner plate perched on a fallen banner at midground edge, wings slowly fanning',
      'a partially-buried skull at foreground edge surrounded by glow-fungi, the fungi pulsing in slow rhythm',
      'a single wolf at midground center watching the camera with luminous amber eyes, fur catching moonlight',
    ],
    instructions: `Each entry is ONE dark-wildlife or atmospheric scale-prover, 15-35 words. MANDATORY dark-wildlife for the LAND-IS-ALIVE signal. NO human/humanoid figures (path is pure landscape). STRICT GothBot gothic dark-fantasy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_vista_sky: {
    format: 'simple',
    theme: `SATURATED GOTHIC SKY for a gothic-vista scene. Each entry 15-30 words. The sky is THE atmospheric anchor — SATURATED + THEATRICAL + GOTHIC. Castlevania / Bloodborne / Crimson-Peak visual lineage.\n\n⚠️ Lean toward skies that REINFORCE the alive-and-haunted vibe — aurora-rippling / bat-silhouetted / fog-crawling overhead / mist-curling / clouds-with-faces / phantom-shapes-in-stormcloud.\n\n🚫 NO sci-fi / nebulas-in-daylight / galaxy-arms / floating-islands / sky-whales / orbital structures / cheerful-blue. 🚫 NO blood-red dominant sky (red moon ~10% max). NO clear bright weather. NO LOTR / Skyrim / Witcher vocabulary.\n\n✓ GOTHIC VISTA SKIES: violet-twilight with bat-silhouettes / moonlit-violet with crow-flock / sickly-green aurora rippling / cathedral-cloud violet with painted thunder / corpse-pale overcast with phantom-army silhouettes / fel-violet storm-cloud with wing-shadows / aurora-curtained night with fireflies rising / ghost-light pale overcast / blackened-eclipse-moon haloed in violet / spectral-shapes in cloud-bank / cathedral-arch sky with light-shafts / star-streaked aurora with shooting-star streaks / twin-moon night sky / painted dawn-tear sky / cathedral-pillar god-ray sky`,
    touchpoints: [
      'Storm-bruised purple-and-violet sky with fork-lightning crackling at horizon, bat-silhouettes etched against the cloud',
      'Moonlit-violet sky with a pale-silver moon dominant, dozens of crow-silhouettes wheeling across in slow gyre',
      'Sickly green-violet aurora rippling across the night sky in slow waves, the green light casting on every surface below',
      'Lavender-indigo twilight bleeding from rose-horizon to deep-violet zenith, a single owl silhouetted on a distant spire',
      'Storm-cracked violet sky with fork-lightning illuminating bat-ribbons streaming from a distant belfry in flashes',
      'Corpse-pale overcast with phantom-army silhouettes visible in the cloud-bank, faintly luminous shapes moving',
      'Ash-fall grey-violet sky with dark flakes drifting perpetually, ravens visible silhouetted against the haze',
      'Pale-rose dusk bleeding to deep violet, a single witch-star visible at horizon, owl-silhouette on the architecture',
      'Fel-violet storm-cloud sky with wing-shadows visible moving across, no actual birds present',
      'Ghost-light pale luminescence sky with no source visible, even cold luminescence with phantom-shape outlines in cloud',
      'Blackened-eclipse moon haloed in pale red corona, surrounding sky deep-violet (use ~10% max), bats clearly visible',
      'Aurora-curtained night with green-and-violet light-curtains rippling, fireflies rising from the landscape below',
      'Cathedral-cloud violet sky with massive painted cloud-banks piled in vertical castles catching dying light, raven-flock in the lower frame',
      'Bruised-blue-violet sky with painted thunder-cloud architecture, sheet-lightning at horizon revealing bat-ribbons',
      'Twin-moon night sky with two moons hanging dim-and-pale-violet against deep-indigo, owl-silhouette on architecture',
      'Pale corpse-light overcast sky with no warmth, distant spectral-figure outlines barely visible in the cloud',
      'Ash-snow sky with slow black flakes falling perpetually from grey-violet ceiling, low cloud-cover with bat-shapes moving',
      'Violet-and-rose sunset bleeding to deep indigo at zenith, single witch-light at horizon, owl-silhouette unmistakable',
      'Storm-violet sky with sheet-lightning at horizon and fork-lightning above, bat-ribbons clearly visible in the flash',
      'Pale-silver moon haloed in faint violet corona against a violet-black sky, surrounding stars cold, raven-silhouette across the lunar disc',
      'Pyre-smoke and ash-fall sky with distant amber fires at horizon below, the cloud-cap glowing dimly, crows wheeling silhouetted',
      'Bone-white overcast sky with thin black cracks visible as if the sky itself were ceramic and breaking, bat-shapes flitting between cracks',
      'Spectral-army visible in the cloud-bank as ghostly silhouettes, the cloud lit faintly luminous from within',
      'Pale-violet corruption sky with phantom-bird silhouettes circling at altitude in slow gyre',
      'Storm-bruised violet sky with mammatus pouches and forking lightning above, every quadrant churning, ravens scattered',
    ],
    instructions: `Each entry is ONE gothic-vista sky, 15-30 words. SATURATED + THEATRICAL + GOTHIC. NEVER cheerful blue / NEVER clean daylight. STRICT GothBot dark-fantasy. NO sci-fi / cosmic / LOTR vocabulary. Lean toward skies that reinforce the alive-watching mood (bat-silhouettes / crow-flocks / phantom-shapes / aurora-rippling). Use blood-moon sparingly (~10%). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT dark-landscape path (2026-05-15, full bespoke migration).
  // Pure gothic landscape — castles / cathedrals / cemeteries / haunted
  // wilds. NO CHARACTERS. Twilight color, vibrant haunting. Movie-poster
  // wide-vista compositions. ─────────────────────────────────────────────

  gothbot_dark_landscape_biome: {
    format: 'simple',
    theme: `GOTHIC LANDSCAPE BIOMES for GothBot's dark-landscape path. Each entry is a FULL biome description with multi-tier depth (foreground tactile / midground body / deep distance / sky context). Castlevania / Bloodborne / Crimson-Peak / Berserk / Tim-Burton / Van-Helsing / Dark-Souls / Elden-Ring visual lineage. Each entry 50-80 words.\n\n⚠️ STRICT GOTHIC DARK-FANTASY ONLY — NEVER LOTR / Skyrim / Witcher / Warcraft / DragonBot high-fantasy vocabulary. The bot lives in the BLOODBORNE / CASTLEVANIA visual world, not Tolkien's.\n\n⚠️ NO CHARACTERS in the biome description. The land is the hero. (A distant crow / bat / wolf-silhouette as atmospheric scale-prover OK, never a humanoid figure.)\n\n⚠️ MOVIE-POSTER WIDE VISTA — every biome entry reads as JAW-DROPPING. The kind of landscape that opens a Castlevania stage / Bloodborne area. SCALE-VERTIGO mandatory:\n• Cliffs that drop a thousand feet into mist\n• Vast cemeteries stretching miles\n• Cathedral spires piercing storm-clouds\n• Mountain-passes leading to distant citadels\n• Coastal cliffs above storm-wracked oceans\n• Canyon-gorges with stone aqueducts bridging the chasm\n• Vast haunted-lake foregrounds with gothic chateau across the ice\n• Aerial views over haunted villages\n\nMANDATORY in every entry:\n• A SPECIFIC GOTHIC BIOME (haunted-forest / cemetery / moorland / coastal-cliff / canyon-gorge / cursed-village / abbey-ruin / castle-approach / frozen-lake / swamp / volcanic-wasteland / etc.) named distinctly\n• MULTI-TIER DEPTH — foreground tactile detail + midground body + deep distance atmospheric layer\n• "ELEGANT DARKNESS" SIGNAL — twilight color, baroque ruin, moonlit melancholy, witch-fire glow, candle-warmth\n• A SIGNATURE FEATURE that makes this biome distinct (specific architectural ruin / specific moonlight pattern / specific witch-fire / specific gothic-flora)\n• SCALE PROVER — distant crow flock / bat silhouettes / wolf-silhouette / distant lit-window / single fog-curl — something small that makes the big things feel impossibly haunted\n\n🚫 ABSOLUTE BANS:\n• NO characters / human figures / humanoid silhouettes\n• NO LOTR / Skyrim / Witcher / Warcraft vocabulary — NEVER write "Mordor / Rivendell / Skyrim hold / Witcher path / Lothlórien / etc."\n• NO modern / industrial / sci-fi / cyberpunk / neon\n• NO single-tier flat compositions — every entry MUST describe foreground + midground + distance\n• NO "looking through stone archway at gothic building in middle distance" — banned cliché composition\n• NO blood-red-stained-glass-windows dominant in the scene — windows DARK, MOONLIT VIOLET, CANDLE-AMBER, or FEL-GREEN only\n• NO red-fog / red-mist / red-everything — palette is purple / violet / blue / green / silver / black with red as ACCENT only\n• NO blood-moon dominating the sky (red moon in at most 10% of renders) — moon is PALE SILVER / MOONLIT VIOLET / ECLIPSED with corona\n• NO interior chamber compositions — this is OUTDOOR LANDSCAPE\n\nVARIETY MANDATE — distribute roughly across these gothic-biome categories:\n\n  A. **HAUNTED FOREST / DEAD WOOD** (~15%): petrified dead trees / blackened skeletal canopy / moss-dripping cathedral-forest / blood-bark grove / will-o-wisp-haunted woodland\n  B. **CEMETERY / NECROPOLIS / GRAVE-FIELDS** (~15%): vast tombstone field / mausoleum city / above-ground crypt-row / drowned tomb-garden / catacomb-entrance plain\n  C. **CASTLE / CITADEL APPROACH** (~15%): mountain-pass approach to dark castle / cliff-top fortress silhouette / valley-floor looking up at spired citadel / fortified-bridge crossing\n  D. **CATHEDRAL / ABBEY / MONASTERY RUIN** (~10%): collapsed cathedral nave under moonlight / abbey courtyard with broken statuary / monastery-roof piercing forest canopy\n  E. **COASTAL / SEA-CLIFF / FJORD** (~10%): storm-wracked coastal cliff with lighthouse-tower / fjord with sheer black cliffs / sea-cave with gothic ruin / drowning village foreshore\n  F. **MOOR / HEATH / WIND-SWEPT LOWLAND** (~10%): heather-moor with abbey silhouette under twilight / blackthorn waste / cursed-fen with rolling fog / windswept barrows-field\n  G. **MOUNTAIN / ALPINE PASS** (~5%): mountain-pass to dark citadel / vampire-castle alpine-crag / snow-crowned dark fortress\n  H. **WETLAND / SWAMP / BOG** (~10%): half-submerged gothic ruin with will-o-wisps / corpse-marsh with dead-tree spires / drowned chapel in black-water / poisoned-fen at twilight\n  I. **CURSED VILLAGE / CITYSCAPE** (~5%): aerial view of haunted village with castle on distant hill / gothic city of red-tile-roofed houses under storm / abandoned village at dusk\n  J. **CANYON / GORGE** (~5%): canyon-gorge with stone aqueduct bridging the chasm / cliff-perch monastery / red-rock canyon with cathedral ruin\n  K. **FROZEN / WINTER LANDSCAPE** (~5%): frozen-lake foreground with gothic chateau across the ice / snow-piled cemetery / ice-rimed castle in a winter pass\n  L. **VOLCANIC / ASH WASTELAND** (~5%): volcanic plain with cracked obsidian / ash-fall ruined city / smoldering crater-field with witch-fire vents`,
    touchpoints: [
      'MOUNTAIN-PASS APPROACH TO RAVEN-CASTLE — narrow stone road winding up between sheer cliff-walls toward a multi-spire vampire-castle perched on the highest crag, the castle still half a mile distant and small in the frame; foreground: a single weathered cairn-stone with raven sigil carved into it; midground: the switchback road with mist rolling across the trail; deep distance: the castle silhouetted against violet-twilight storm-sky.',
      'VAST CEMETERY OF FORGOTTEN HOUSES — sprawling necropolis stretching to horizon with mausoleums and crypt-houses arranged in city-blocks, weathered stone-angels guarding intersections, sea of headstones and obelisks; foreground: a single tilted tombstone with worn-illegible inscription; midground: the necropolis grid receding through silver mist; deep distance: a great mausoleum-cathedral; sky: pale silver moonlight catching frost on every stone.',
      'STORM-WRACKED CLIFF FORTRESS — black-iron multi-tower fortress clinging to a basalt sea-cliff above crashing waves, lightning forking across the sky beyond it; foreground: storm-foam exploding against jagged sea-stacks; midground: the fortress with banners ripped horizontal by the gale, watchfires flickering in the wall-cages; deep distance: the storm-line at sea-horizon with sheet-lightning illuminating waves; sky: storm-violet with fork-lightning forking.',
      'COLLAPSED CATHEDRAL IN MOONLIT FOREST — Gothic cathedral ruin half-swallowed by black-bark forest, rose-window shattered showing star-bleed beyond, vines crawling up flying buttresses; foreground: fallen Gothic stone-fragment with carved-saint relief, moss-and-frost coated; midground: the cathedral nave with collapsed roof open to sky; deep distance: more forest receding into violet fog; sky: pale moonlit-violet with the moon a clean silver disk through the rose-window.',
      'CLIFF-TOP MONASTERY UNDER ECLIPSE — high-perched abbey with multiple spires reaching upward, the eclipsed moon haloed in red corona above; foreground: a single weathered stone-cross at the cliff-edge; midground: the monastery with single lit-window casting amber light into mist; deep distance: lower mountains and a valley filled with dawn-violet cloud; sky: eclipse-corona red around blackened moon, surrounding sky deep-violet.',
      'WILL-O-WISP MARSH WITH HALF-SUBMERGED CHAPEL — black-water swamp lit by dancing fey-light spots in pale-green hovering knee-height across the water, partially-drowned Gothic chapel emerging from the mire at midground; foreground: a single will-o-wisp drifting near the camera with reflected glow on the black water; midground: the chapel with broken spire and one intact stained-glass window glowing pale-violet; deep distance: dead cypress receding into mist; sky: green-tinged overcast.',
      'AERIAL VIEW OVER HAUNTED VILLAGE — high vantage looking down on a fog-shrouded valley with cursed village clustered along a black river, a vampire-castle on the distant hilltop dominating the horizon; foreground: dead-tree branches in the upper frame as a window into the scene; midground: village rooftops poking through fog with lit windows; deep distance: the castle silhouetted on the hill against twilight-violet sky.',
      'FROZEN LAKE WITH GOTHIC CHATEAU — vast frozen-lake foreground stretching to a Gothic chateau silhouette across the ice, the chateau lit warmly from within with amber lamplight; foreground: a single black-feathered raven perched on a frozen-reed stalk; midground: the ice surface with starlight reflection; deep distance: the chateau with multiple lit windows casting amber pools onto the surrounding snow; sky: aurora-purple with pale-silver moon.',
      'CANYON-GORGE WITH STONE AQUEDUCT — deep canyon spanned by a colossal stone aqueduct-bridge with multiple arch-tiers, monastery ruins clinging to one cliff-wall; foreground: cliff-edge with a gnarled dead tree clinging to the rim; midground: the aqueduct in profile, water still trickling in places; deep distance: the opposite cliff with monastery; sky: storm-bruised purple with crows wheeling in slow gyre.',
      'MOORLAND ABBEY UNDER LAVENDER SKY — windswept blackthorn moor with weathered abbey silhouette at deep distance, ancient barrow-mounds dotting the heath; foreground: a single weathered standing-stone with rune-carving worn smooth; midground: the moor stretching with scattered barrow-mounds; deep distance: the abbey with a single lit-window casting amber spot; sky: twilight-lavender bleeding to deep violet at zenith.',
      'COASTAL VILLAGE WITH GOTHIC LIGHTHOUSE-CITADEL — fishing-village clustered along storm-coast with a vast Gothic citadel-tower rising from a sea-stack offshore, storm-lantern at its summit; foreground: weathered fishing-boats overturned on the foreshore; midground: the village with lit windows; deep distance: the citadel-tower with its lit summit-beacon piercing storm-mist; sky: storm-cracked violet with sheet-lightning at horizon.',
      'BLACKTHORN-THICKET BARROW-FIELD — vast field of moss-covered barrow-mounds carpeted in blackthorn brambles, ravens nesting in the thicket; foreground: a single barrow-entrance stone with carved warning-runes; midground: the barrow-field with mist drifting low; deep distance: a tor with weathered standing-stone circle; sky: pre-dawn rose with single morning-star visible.',
      'DROWNED-FOREST SWAMP — black-water swamp filled with vertical dead-tree trunks half-submerged like cathedral pillars, glowing fungi on every trunk; foreground: dark water reflecting upward into the trunks; midground: the trunk-grove receding into mist with green fungal-glow pulsing; deep distance: a partially-drowned chapel-spire silhouette; sky: visible only as pale-violet patches between the canopy-skeletons.',
      'BLOOD-MOON FOREST CLEARING — circular forest clearing with a single ancient witch-tree at center, the eclipsed moon directly overhead through a perfect break in the canopy; foreground: a weathered stone-altar with offerings (candles, dried roses, bone-fragments); midground: the witch-tree with antler-shaped branches; deep distance: the surrounding black-bark forest; sky: eclipsed moon with red corona dominating the visible patch.',
      'GOTHIC VOLCANIC WASTELAND — vast plain of cracked black volcanic glass under perpetual ash-fall, distant ruined city silhouette emerging from haze; foreground: a single twisted dead bramble growing impossibly from glass-cracks; midground: the plain stretching with scattered obsidian fang-spires; deep distance: the ruined city with single tower still burning amber; sky: storm-bruised purple with violet aurora.',
      'WINTER PASS TO ICE-RIMED FORTRESS — snowy mountain-pass with weathered black-stone fortress visible on the highest crag, the fortress-roofs heavy with snow and icicles; foreground: a single frostbitten dead pine clinging to the cliff-edge; midground: the pass with single trail of wolf-prints in fresh snow; deep distance: the fortress with single lit window; sky: aurora-purple with snow-dust drifting.',
      'CURSED VILLAGE AT DUSK — abandoned half-timbered Gothic village with single street running between empty houses, lit only by a single lamp-post; foreground: a dropped basket of withered roses; midground: the deserted street with lit lamp casting amber pool; deep distance: a Gothic church-spire at the end of the street; sky: post-dusk indigo with first stars appearing.',
      'POISONED FEN AT TWILIGHT — flat reed-marsh in dim twilight with rolling violet fog and scattered dead-tree skeletons, willow-of-the-wisps dancing knee-high; foreground: a single reed-cluster with a perched black-bird; midground: the marsh with fog rolling across in slow waves; deep distance: a Gothic chapel emerging from the fog with single witch-fire green window; sky: post-dusk green-purple gloom.',
      'CATACOMB-ENTRANCE PLAIN — flat barren stone-plain with a vast carved entrance to subterranean catacombs, twin colossal stone-angel statues flanking the descent; foreground: a single weathered offering-stone with melted candle stubs; midground: the catacomb-entrance with darkness within; deep distance: more carved-stone features dotting the plain; sky: pre-dawn rose with the constellation of the underworld visible.',
      'STORM-LIT ABBEY ON A SEA-STACK — solitary Gothic abbey on an isolated sea-stack with crashing waves around its base, lightning illuminating the silhouette; foreground: storm-spray exploding against weathered rocks; midground: the abbey silhouetted; deep distance: storm-line at horizon with sheet-lightning; sky: storm-violet with fork-lightning above the abbey.',
      'VAMPIRE-CASTLE OVER MIST-VALLEY — towering multi-spire vampire-castle viewed from below in a misted valley, the castle rising like a mountain of black stone with countless lit windows; foreground: a Gothic stone-bridge crossing a black river with weathered statuary; midground: the valley floor with rolling mist; deep distance: the castle silhouetted against pale-violet sky with hundreds of lit windows like a constellation; sky: violet-twilight with bat silhouettes circling.',
      'WITCH-FOREST CLEARING WITH BARROW-MOUND — small clearing in dead-bark forest with a single moss-grown barrow-mound at center, weathered carved-stone marker at the apex; foreground: a circle of pale-green witch-fire candles burning low on the forest-floor; midground: the barrow-mound with the marker; deep distance: the surrounding skeletal forest; sky: pale-violet through the canopy.',
      'GOTHIC ROCKBOUND COVE — small cove between sheer black cliffs with a single Gothic chapel on a sea-stack at center, dark waves crashing around it; foreground: a single weathered jetty with overturned boat; midground: the chapel on its sea-stack with single lit-window; deep distance: open ocean with storm-line; sky: storm-violet with pale-silver moon breaking through cloud.',
      'TOMB-GARDEN OVERGROWN WITH BLACK-ROSES — vast garden-cemetery overgrown with black-rose vines crawling across every stone-angel and tomb-cross, the garden in perpetual late-autumn; foreground: a fallen rose-petal on a weathered grave-stone; midground: the rose-vines crawling everywhere; deep distance: a central mausoleum-chapel silhouette; sky: rose-dusk with single morning star.',
      'WIND-SCOURED FORTRESS APPROACH — barren stone-and-thorn approach to a Gothic black-iron fortress with skeletal scarecrow figures impaled along the road on either side; foreground: a single tilted milestone marker with worn-runic inscription; midground: the road through thorn-and-stone toward the fortress gate; deep distance: the fortress wall and central spire; sky: storm-broken with violet lightning.',
    ],
    instructions: `Each entry is ONE gothic-landscape biome, 50-80 words. Format: "[BIOME NAME] — [primary element]; foreground [tactile detail]; midground [body of the biome]; deep distance [atmospheric/architectural layer]; sky [overhead element]". STRICT GothBot dark-fantasy (Castlevania / Bloodborne / Crimson-Peak / Berserk lineage). NO LOTR / Skyrim / Witcher vocabulary. NO characters. NO red-fog / blood-stained-windows / blood-moon dominant. NO interior chambers. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_dark_landscape_architecture: {
    format: 'simple',
    theme: `GOTHIC ARCHITECTURE FOCAL POINTS for dark-landscape scenes — castles / cathedrals / abbeys / monasteries / mausoleums / fortresses / village-spires / aqueducts. Each entry 20-40 words. Castlevania / Bloodborne / Crimson-Peak / Berserk / Dark-Souls / Elden-Ring visual lineage.\n\n⚠️ STRICT GOTHIC ONLY — NO LOTR / Skyrim / Witcher / Warcraft architecture vocabulary. The structures live in the BLOODBORNE / CASTLEVANIA world.\n\n🚫 ABSOLUTE BANS:\n• NO modern (no lighthouses with electric beacons / no clocktowers with digital faces / no factories)\n• NO real-world ethnic codes (no Forbidden-City / Persian-palace / Aztec-temple)\n• NO sci-fi / cyberpunk\n• NO cheerful / bright / pristine structures — every entry is RUINED, WEATHERED, or HAUNTED\n• NO blood-red-stained-glass dominant — windows DARK or MOONLIT VIOLET or CANDLE-AMBER or FEL-GREEN\n\n✓ GOTHIC ARCHITECTURE: vampire-castles / Gothic cathedrals / ruined abbeys / cliff-perched monasteries / mausoleum-cathedrals / black-iron fortresses / spired citadels / cursed-village churches / chateau-manors / cathedral-ruins / Gothic lighthouse-towers (no electric beacon, candle-lit beacon-fire) / bell-towers / catacomb-gates / Gothic stone-aqueducts / barrows-and-cairns / sea-stack chapels / forest-shrines / blood-cult-temples.`,
    touchpoints: [
      'A multi-spire vampire-castle at deep distance — towering black-stone fortress with countless gargoyle-statues lining every battlement, multiple turret-spires, banner-tatters flying.',
      'A Gothic cathedral-ruin at midground — collapsed nave with skeletal rib-vault still visible, rose-window shattered, flying buttresses half-fallen, ivy crawling up every column.',
      'A cliff-perched abbey at deep distance — multi-roof monastery clinging to a vertical rock-face, single watchtower at the summit, lantern-light at one window.',
      'A vast mausoleum-cathedral at midground — cathedral-sized tomb with stone-angel statuary lining the approach, central iron-bound door, weathered family-crests carved above.',
      'A black-iron fortress at midground — Gothic multi-tower fortress with skeletal scarecrows at every crenellation, single gate with twin gargoyle-flanking statues.',
      'A solitary Gothic spire at deep distance — single soaring cathedral-spire emerging from forest canopy or mist, weathered to grey with iron weathervane.',
      'A cursed-village church at midground — half-timbered village chapel with collapsed roof exposing the rafters, weathered grave-yard surrounding the building.',
      'A chateau-manor at deep distance — multi-wing Gothic mansion with steep mansard roofs, dozens of pointed-arch windows, ironwork balconies, single tower at one wing.',
      'A bell-tower at midground — solitary stone bell-tower with weathered iron bell visible through arched opening, ivy crawling up the stonework, raven perched on the bell-frame.',
      'A catacomb-entrance gate at midground — colossal carved-stone gate flanked by twin stone-angel statues with broken wings, descending stair into darkness beyond.',
      'A Gothic stone-aqueduct at midground — multi-arch bridge spanning a deep gorge, weathered to grey, partial collapse in the middle, ivy and dead vines crawling up the supports.',
      'A vast necropolis-skyline at deep distance — city of tombs and mausoleums stretching to horizon, central mausoleum-cathedral dominating the silhouette.',
      'A barrow-mound at midground — moss-covered earth-mound with carved-stone marker at the apex, weathered runic inscription, surrounded by standing-stones.',
      'A sea-stack chapel at deep distance — solitary Gothic chapel on an isolated rock pillar surrounded by dark waves, single iron weathervane visible.',
      'A forest-shrine at midground — small Gothic-stone shrine in a clearing, twin candle-stands on either side of the central altar, weathered carved-saint relief.',
      'A blood-cult temple at midground — circular Gothic monastery on a hilltop with cult-sigils carved into every wall, single iron-bound door.',
      'A Gothic lighthouse-tower at deep distance — vast stone tower on a sea-stack, single candle-fire beacon at the summit (no electric), weathered with salt-rime.',
      'A drowning-chapel at midground — Gothic chapel partially submerged in black-water swamp with only the upper half of the bell-tower above the surface.',
      'A cliff-bridge fortress at midground — stone fortress straddling a deep chasm with multi-arch bridge running through its center, weathered to grey.',
      'A Gothic abbey courtyard at midground — open cloistered courtyard with collapsed roof, broken statuary lining the walkways, central well still intact.',
      'A vampire-castle gatehouse at midground — single soaring gate-tower with portcullis raised, ironwork-spike rows at the gate-arch, gargoyles flanking the approach.',
      'A black-stone observatory at deep distance — Gothic tower with domed roof open to sky for telescope-access, perched on a high crag.',
      'A Gothic cliff-monastery at deep distance — multi-tier stone monastery built into vertical rock-face, accessed only by a single rope-bridge from above.',
      'A weathered cemetery-gate at midground — wrought-iron gate with carved-stone arch, weathered to verdigris, surrounded by collapsed grave-wall.',
      'A cursed obelisk at midground — twenty-meter black-stone monolith covered in cult-runes glowing faintly red at the seams, set on a flat plain.',
    ],
    instructions: `Each entry is ONE gothic architecture focal point, 20-40 words. STRICT GothBot gothic dark-fantasy (Castlevania / Bloodborne / Crimson-Peak). NO LOTR / Skyrim / Witcher / modern / sci-fi / real-world ethnic. Positioned at MIDGROUND or DEEP DISTANCE. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_dark_landscape_phenomenon: {
    format: 'simple',
    theme: `80%-gated ATMOSPHERIC PHENOMENON for a gothic dark-landscape scene — a supernatural or magical event that elevates the haunting mood. Each entry 25-50 words. Castlevania / Bloodborne / Crimson-Peak / Berserk visual lineage.\n\n⚠️ STRICT GOTHIC DARK-FANTASY — magical / supernatural events that fit Gothic horror, NOT high-fantasy. NO LOTR-coded effects.\n\n🚫 NO sci-fi / cosmic / nebulas / orbital structures. NO Lovecraftian-tentacle-horror (mild eldritch references OK).\n\n✓ GOTHIC PHENOMENA: spectral mist that moves against the wind / blood-moon eclipse (rare — at most 10%) / witch-fire green aurora / ash-fall from distant pyre / spectral apparitions in the cloud-bank / will-o-wisp swarms / ghost-bell tolling visible as mist-ripples / corpse-light glow on the horizon / black-rain-shower / phantom-army silhouette in the distance / glowing carrion-bird flocks / unholy-rune-glow across the ground / nightmare-moth swarms / spectral horse-carriage in deep distance / a witch's tower-light cast on cloud-bank / hellfire-pit smoke columns / spectral-funeral procession visible at distance / cursed-mist crawling like serpents`,
    touchpoints: [
      'SPECTRAL MIST AGAINST THE WIND — wall of pale violet mist advancing across the landscape against prevailing wind, faces almost visible within the curling vapor',
      'WITCH-FIRE GREEN AURORA — corrupted aurora rippling across the sky in poisoned green-and-violet curtains, casting acid-green light on every surface below',
      'ASH-FALL FROM DISTANT PYRE — slow black ash-flakes drifting down like snow across the landscape, the source-pyre visible burning amber at horizon',
      'SPECTRAL APPARITION IN CLOUD-BANK — ghostly figure formed of pale mist visible in the distant cloud-bank, holding shape for moments before dissolving',
      'WILL-O-WISP SWARM AT MIDGROUND — dozens of pale-green phantom-lights drifting at knee-height across the landscape in misleading directions',
      'GHOST-BELL RIPPLES IN MIST — visible concentric ripples expanding through fog as a phantom bell tolls across the silent landscape',
      'CORPSE-LIGHT HORIZON GLOW — pale-green corpse-light shimmering on the horizon line, marking some distant cursed event, the light pulsing slowly',
      'BLACK-RAIN SHOWER — slow black raindrops falling perpendicular across the scene, the ground beneath stained dark with each strike',
      'PHANTOM-ARMY DISTANT SILHOUETTE — translucent army of soldiers visible at deep distance marching across the plain, faintly luminous and slowly fading',
      'GLOWING CARRION-BIRD FLOCK — vast flock of luminous spectral ravens circling overhead, their silhouettes glowing pale against the dark sky',
      'UNHOLY-RUNE-GLOW ACROSS GROUND — glowing red-and-violet rune-sigil scarred across the landscape ground, pulsing in slow waves visible to horizon',
      'NIGHTMARE-MOTH SWARM — vast cloud of dark moths with glowing-skull markings rising from the forest, blotting out the distant moon',
      'SPECTRAL HORSE-CARRIAGE AT DISTANCE — translucent funeral-carriage visible at deep distance crossing the landscape, drawn by spectral horses, no driver',
      "WITCH'S TOWER-LIGHT ON CLOUDS — single beam of violet light from a distant witch's tower cast upward onto the cloud-bank, illuminating the underside of the storm",
      'HELLFIRE-PIT SMOKE COLUMNS — twin or triple columns of black smoke rising from distant hell-vents in the landscape, each column glowing amber at the base',
      'SPECTRAL FUNERAL PROCESSION — translucent procession of robed figures visible at deep distance with lantern-flickers, moving slowly across the moor',
      'CURSED-MIST CRAWLING LIKE SERPENTS — thick black-violet mist crawling across the ground in serpent-coil patterns, moving against the wind, occasionally rising in cobra-hood shapes',
      'BLOOD-MOON ECLIPSE — moon turning to crimson disk haloed in pale corona, hanging massive over the landscape (use sparingly, ~10% of renders)',
      'SICKLY GREEN GOD-RAY — single thick column of acid-green light piercing through corrupted cloud-cover onto a single point of the landscape',
      'CORRUPTED FALLING STARS — meteor-streaks across the night sky burning black-red instead of white, each leaving a dim ash-trail',
      'PHANTOM-BELL TOLL RIPPLES — visible ripples expanding through mist as a phantom bell tolls, the toll itself silent but the ripples spread visibly',
      "LICH-AURA HORIZON GLOW — pale-violet glow on the horizon marking a distant lich-king's active influence, the light pulsing slowly in time with unseen heartbeat",
      'PERPETUAL ASH-SNOW — slow black ash-flakes falling like snow across the landscape, accumulating in drifts of grey-black on every surface',
      'WILL-O-WISP DENSE GATHERING — hundreds of pale-violet wisps swarming around a single ancient tree at midground in a slow vortex-pattern',
      'PHANTOM-AIRSHIP SILHOUETTE — translucent Gothic dirigible visible at deep distance, glowing pale-green within, drifting silently across the sky',
    ],
    instructions: `Each entry is ONE atmospheric phenomenon for a gothic dark-landscape, 25-50 words. STRICT GothBot gothic dark-fantasy. NO sci-fi / cosmic / Lovecraftian-tentacles / high-fantasy LOTR vocabulary. Use blood-moon sparingly (~10% max). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_dark_landscape_surprise_element: {
    format: 'simple',
    theme: `TINY SECONDARY SUBJECTS for a gothic dark-landscape — small details implying the wider haunting. Each entry 15-35 words. Castlevania / Bloodborne / Crimson-Peak visual lineage.\n\n⚠️ NO CHARACTERS / NO humanoid figures (not even tiny scale-prover figures). The dark-landscape path is PURE LANDSCAPE per Kevin's spec. Scale-provers are crow / bat / wolf-silhouette / objects / animals — never people.\n\n✓ ALLOWED scale-provers: distant crow / bat / raven flock / wolf silhouette / lone deer at clearing-edge / black-feathered owl on a stone / fox crossing the path / weathered standing-stone / fallen banner / abandoned grave-marker / cult-sigil scratched in bark / dropped lantern / weathered cairn / overgrown statue.\n\n🚫 ABSOLUTE BANS: NO human/humanoid figures. NO modern objects. NO sci-fi. NO bright/cheerful elements.`,
    touchpoints: [
      'a single black-feathered raven perched on a weathered tombstone at midground edge, one bright eye fixed on the camera, holding very still',
      'a flock of carrion-crows wheeling overhead in slow gyre, dozens of black silhouettes against the twilight sky at deep midground',
      'a single wolf silhouette standing at a rock-outcrop at midground edge, fur ragged and eyes faintly luminous in moonlight',
      'a black-bird perched on a fallen-banner standard at midground, the banner-fabric long-rotted but the iron of the standard still standing',
      "a fallen knight's helm half-buried in the road-dust at foreground edge, dark-tarnished and weather-beaten",
      'a single bat silhouette darting across the midground, wings caught in starlight',
      'a fox crossing a forest-path at midground edge, head turned to look back, fur catching moon-silver light',
      'a weathered standing-stone at midground edge, single rune carved deep, listing slightly with age',
      'a cult-sigil scratched fresh into the bark of a dead tree at foreground edge, paint still wet-looking',
      'a tattered Gothic banner-pole at midground, fabric long-rotted but the rusted iron of the standard still hooked',
      'a fallen war-helm with broken plumes resting at the foot of a black-iron statue, weather-beaten',
      'an abandoned carriage half-overgrown with black-thorn vines at midground edge, its passengers long-gone',
      'a single black cat (slightly oversized, perhaps not entirely natural) perched on a tomb-step at midground, motionless and unnaturally still',
      'a vulture flock visible on a distant gibbet at deep midground, perched and patient',
      'a partially-buried skull at foreground edge, weathered smooth but with faint dark-rune carvings',
      'a deer silhouette at clearing-edge at midground, its eyes glinting silver in moonlight',
      'a flock of glowing-eyed crows perched along a weathered fence at midground edge',
      'a single owl with massive luminous amber eyes perched on a tomb-cross at midground, head turned to face the camera',
      'a black-iron-bound spellbook left open on a stone pedestal at midground, pages turning by themselves in still air',
      'a single suit of empty cursed armor standing at midground edge, helm-visor down, sword planted in ground',
      'an obsidian dagger embedded blade-down in the foreground at edge of frame, runic-etched and faintly glowing',
      'a single dark-blossom flower growing impossibly from a skull at foreground edge, black-petaled and faintly luminous',
      'a Gothic carriage-lantern fallen on its side at midground, the wax-candle within still flickering somehow',
      'a weathered tombstone with worn-illegible inscription at midground edge, vine-strangled',
      'a single luminous moth the size of a dinner plate perched on a fallen banner at midground edge',
    ],
    instructions: `Each entry is ONE tiny secondary subject, 15-35 words. NO human/humanoid figures (path is pure landscape). Scale-prover animals / objects / supernatural-detail only. STRICT GothBot gothic dark-fantasy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_dark_landscape_sky: {
    format: 'simple',
    theme: `GOTHIC TWILIGHT SKY for a dark-landscape scene. Each entry 15-30 words. The sky is THE atmospheric anchor — never washed-out, always SATURATED + THEATRICAL + GOTHIC.\n\n⚠️ STRICT GOTHIC DARK-FANTASY — Castlevania / Bloodborne / Crimson-Peak visual lineage.\n\n🚫 NO sci-fi / nebulas-in-daylight / galaxy-arms / floating-islands / sky-whales / orbital structures / cheerful-blue. 🚫 NO blood-red dominant sky (red moon ~10% max). NO clear bright weather. NO LOTR / Skyrim / Witcher vocabulary.\n\n✓ GOTHIC SKIES: violet-twilight / moonlit-violet / silver-moonlight / storm-bruised purple / sickly-green aurora / pale-rose dusk / lavender-indigo twilight / fel-violet storm-cloud / corpse-pale overcast / ash-fall grey / ghost-light pale luminescence / blackened-eclipse-moon / aurora-curtained night / cathedral-cloud lavender / bruised-blue-violet`,
    touchpoints: [
      'Storm-bruised purple-and-violet sky with fork-lightning crackling at horizon, mammatus pouches visible at high altitude',
      'Moonlit-violet sky with a clean pale-silver moon dominant, surrounding stars cold-pale, no clouds',
      'Sickly green-violet aurora rippling across the night sky in slow waves, the green tint catching every surface below',
      'Lavender-indigo twilight bleeding from horizon-rose to zenith-deep-violet, single morning-star visible',
      'Storm-cracked violet sky with fork-lightning illuminating dark architecture below in stark flashes',
      'Corpse-pale overcast with phosphorescent green tint, no warmth, everything cast cold',
      'Ash-fall grey-violet sky with dark flakes drifting perpetually, no sun or moon visible behind the haze',
      'Pale-rose dusk bleeding to deep violet at zenith, single witch-star visible at horizon',
      'Fel-violet storm-cloud sky with sickly violet glow at cloud-edges, no stars visible',
      'Ghost-light pale luminescence sky with no source visible, even cold luminescence everywhere',
      'Blackened-eclipse moon haloed in pale red corona, surrounding sky deep-violet (use ~10% max)',
      'Aurora-curtained night with green-and-violet light-curtains rippling across, casting magical glow on the landscape',
      'Cathedral-cloud sky with massive painted cloud-banks piled in vertical castles catching dying violet light',
      'Bruised-blue-violet sky with painted thunder-cloud architecture, single sheet-lightning at horizon',
      'Twin-moon night sky with two moons hanging dim-and-pale-violet against deep-indigo, blood-stained accent on both',
      'Pale corpse-light overcast sky with no warmth, everything cast in cold luminescence',
      'Ash-snow sky with slow black flakes falling perpetually from grey-violet ceiling, low cloud-cover',
      'Violet-and-rose sunset bleeding to deep indigo at zenith, single witch-light at horizon',
      'Storm-violet sky with twin sheet-lightning at horizon and forked-lightning above, mammatus pouches at high altitude',
      'Pale-silver moon haloed in faint violet corona against a violet-black sky, surrounding stars cold',
      'Pyre-smoke and ash-fall sky with distant amber fires visible at horizon below, the cloud-cap glowing dimly',
      'Bone-white overcast sky with thin black cracks visible as if the sky itself were ceramic and breaking',
      'Spectral-army visible in the cloud-bank as ghostly silhouettes, the cloud lit faintly luminous from within',
      'Pale-violet corruption sky with phantom-bird silhouettes circling at altitude',
      'Storm-bruised violet sky with mammatus pouches and forking lightning above, every quadrant churning',
    ],
    instructions: `Each entry is ONE gothic twilight sky, 15-30 words. SATURATED + THEATRICAL + GOTHIC. NEVER cheerful blue / NEVER clean daylight. STRICT GothBot dark-fantasy. NO sci-fi / cosmic / LOTR vocabulary. Use blood-moon sparingly. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
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
        model: SONNET,
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
    .map((e) =>
      e
        .replace(/^["']|["']$/g, '')
        .replace(/^[-•*]\s*/, '')
        .trim()
    )
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
  'the',
  'a',
  'an',
  'and',
  'or',
  'but',
  'with',
  'of',
  'in',
  'on',
  'at',
  'to',
  'for',
  'from',
  'by',
  'as',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'this',
  'that',
  'these',
  'those',
  'it',
  'its',
  'they',
  'them',
  'their',
  'her',
  'his',
  'into',
  'onto',
  'through',
  'across',
  'over',
  'under',
  'near',
  'around',
  'between',
  'one',
  'two',
  'three',
  'some',
  'any',
  'all',
  'no',
  'not',
  'than',
  'then',
  'also',
  'so',
  'very',
  'more',
  'most',
  'many',
  'much',
  'each',
  'every',
  'other',
  'another',
  'same',
  'such',
  'only',
  'own',
  'just',
  'still',
  'here',
  'there',
  'where',
  'when',
  'what',
  'who',
  'kilometer',
  'kilometers',
  'meter',
  'meters',
  'foot',
  'feet',
  'mile',
  'miles',
  'wide',
  'tall',
  'long',
  'high',
  'low',
  'large',
  'small',
  'massive',
  'huge',
  'vast',
  'huge',
  'across',
  'above',
  'below',
  'beside',
  'behind',
  'toward',
  'within',
  'throughout',
  'meterdiameter',
  'kilometerdiameter',
  'metertall',
  'kilometertall',
]);

function signatureOf(entry) {
  // Strip the title prefix (everything before the first " — ")
  const dashIdx = entry.indexOf(' — ');
  let body = dashIdx >= 0 ? entry.slice(dashIdx + 3) : entry;
  // Strip any Rich-Scene-Seed bloat
  const fgIdx = body.indexOf(' FOREGROUND:');
  if (fgIdx > 0) body = body.slice(0, fgIdx);
  // Tokenize and extract significant content nouns/adjectives
  const tokens = body
    .toLowerCase()
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
      dropped.push({
        entry: e.slice(0, 80),
        duplicateOf: seenTitles.get(title).slice(0, 80),
        reason: 'title',
      });
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
      dropped.push({
        entry: e.slice(0, 80),
        duplicateOf: seenSigs.get(sig).slice(0, 80),
        reason: 'body',
      });
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
  const stripped = arr
    .map((e) => {
      if (typeof e !== 'string') return null;
      const i = e.indexOf(' FOREGROUND:');
      return i > 0 ? e.slice(0, i).trim() : e;
    })
    .filter(Boolean);
  console.log(`  • Sonnet returned ${stripped.length} entries in ${elapsed}s`);
  return stripped;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/gothbot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) {
    try {
      preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch {}
  }

  // Determine final target.
  // --target N → fill up to N via iterative gen+dedup loop
  // --count N → single batch of N (legacy behavior)
  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;

  if (TARGET !== null) {
    console.log(
      `Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${DRY ? ' (dry-run)' : ''}`
    );
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
    console.log(
      `\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`
    );
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

  console.log(
    `\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`
  );

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
