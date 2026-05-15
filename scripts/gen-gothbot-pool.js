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
