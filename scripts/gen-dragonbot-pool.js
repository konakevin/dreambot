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
 * scripts/bots/dragonbot/seeds/<pool>.json.
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

// Per-pool recipe — what kind of scenes this pool authors + aesthetic
// touchpoints Sonnet should draw from. Same format the playbook uses.
const POOL_RECIPES = {
  // ─── DRAGONBOT dragon-lore path (2026-05-14, migration from legacy
  // function-based form to bespoke 5-axis system). Archaeological-
  // fantasy evidence of dragons — skeletons / murals / abandoned lairs
  // / hoards / eggs / temples / outposts. Mood: wonder + melancholy +
  // reverence + lost grandeur. Strict Western high fantasy.

  dragon_lore_scene: {
    format: 'simple',
    theme: `ARCHAEOLOGICAL DRAGON LORE SCENES for DragonBot's dragon-lore path. Each entry is ANCIENT EVIDENCE of dragons — the absence made visible. NOT living dragons (that's dragon-scene). Each entry 50-80 words.\n\n⚠️ STRICT WESTERN HIGH FANTASY ONLY — LOTR / GoT / Skyrim / Witcher / Warcraft / D&D Forgotten Realms / Elden Ring lineage.\n\nMANDATORY in every entry:\n• A SPECIFIC PIECE OF DRAGON EVIDENCE (skeleton / mural / abandoned lair / hoard / fossilized egg / dragon-temple / dragon-rider outpost / petrified dragon-stone / weathered claw-marks / monument / tomb / ruin / dragon-bone-bridge / etc.)\n• MULTI-TIER DEPTH — foreground tactile detail (fragments of bone / scattered coins / cracked eggshells) + midground main lore-element + deep distance atmospheric layer\n• "ABSENCE" SIGNAL — dust / vines / centuries / dragons-are-gone / silence / lost-civilization\n• SCALE-OF-ABSENCE — massive size relative to any human element (skeleton-the-size-of-a-cathedral / mural-stretching-half-a-mile / hoard-knee-deep-in-a-vault)\n\n🚫 ABSOLUTE BANS:\n• NO living dragons in the frame (that's dragon-scene path)\n• NO combat / armies / heroes-in-action — only AFTERMATH and RUIN\n• NO modern / industrial elements\n• NO real-world ethnic-coded sites\n• NO sci-fi / cosmic / floating-island / sky-whale drift\n• Tiny figures (scholars / explorers / archaeologists / lone-wanderers) ARE allowed but as SCALE-PROVERS only, never the focus\n• 🚫 DRAGON SKELETONS MUST READ DEAD: NO glowing eyes / NO eyes at all (empty sockets) / NO scales attached / NO flickering soul / NO animate poses / NO breath visible. BONES ONLY — bleached, picked clean, centuries-weathered. Skeletons are SKELETONS, not preserved-alive-wyrms.\n\nVARIETY MANDATE — distribute across these dragon-evidence categories:\n\n  A. **DRAGON SKELETON / FOSSIL** (~25%): Massive dragon-skeleton bleached by centuries, embedded in cliff-face / lying across a valley / coiled in a vault / half-buried in glacier ice / vertical-pinned to a mountain like the original death-pose / partially excavated with rune-markers at each joint\n  B. **WEATHERED MURAL / FRESCO** (~15%): Cathedral-wall depicting the Dragon Wars / colonnade of crumbling reliefs showing each dragon-clan / underground-cave painting in ochre and dragon's-blood / mosaic-floor depicting a dragon-rider's last stand\n  C. **ABANDONED LAIR / HOARD** (~25%): Vaulted cavern with knee-deep gold and gems / coin-flooded chamber with throne carved for a dragon / hoard with petrified flames still glowing faintly / pile of crowns from devoured kings / hoard-vault with crystallized dragon-spittle\n  D. **FOSSILIZED / PETRIFIED DRAGON EGG** (~10%): Single intact dragon-egg the size of a carriage on a stone pedestal in a shrine / cluster of cracked eggshells scattered across a clutch-floor / stone-hardened egg cradled by tree-roots / fossilized egg embedded in ice / mineralized egg in a vault\n  E. **DRAGON-TEMPLE / SHRINE RUIN** (~15%): Crumbling temple built TO dragons with massive scaled-architecture / dome-roofed shrine collapsed inward / colonnade-of-bones temple / mountain-cut dragon-cathedral / standing-stones shrine carved with dragon-runes\n  F. **DRAGON-RIDER OUTPOST / MONUMENT** (~10%): Cliff-top crumbling dragon-rider barracks / monument-tomb-stone for a fallen rider and mount / abandoned eyrie with weathered rune-stones / dragon-rider colossal statue half-fallen / saddle-stand still standing in an empty roost`,
    touchpoints: [
      'COLOSSAL DRAGON SKELETON IN A SCREE VALLEY — massive vertebrae arched like a ruined cathedral nave, ribcage cradling whole groves of pine that have grown inside it over centuries; foreground: fragmented bone shards and lichen-painted skull-fragments; midground: the skeleton stretches three hundred meters end to end; deep distance: granite peaks rising beyond, snow on the upper slopes; sky: pale dawn with crepuscular rays piercing through.',
      'CAVERNOUS HOARD VAULT — gold coins, jeweled crowns, and engraved goblets piled knee-deep across an entire underground chamber, the dragon\'s throne-impression still visible in the metal; foreground: a single fallen sword half-buried in coin-drift; midground: heaps of treasure receding into the dragon-stamped throne-floor; deep distance: the vault opens to a black corridor; sky/ceiling: vaulted stone with stalactites.',
      'WEATHERED DRAGON-WAR MURAL — cathedral-scale wall of weathered fresco depicting the great wyrm-wars, paint flaking but compositions still visible; foreground: a single ochre-faded dragon claw outlined in detail; midground: the entire wall stretching half a kilometer along the colonnade, multiple battle-scenes; deep distance: the wall continues into a vanishing point; sky: shafts of light through broken cathedral roof.',
      'FOSSILIZED DRAGON EGG ON A SHRINE PEDESTAL — single intact dragon-egg the size of a small carriage cradled on a stone pedestal carved with offering-bowls; foreground: smaller cracked eggshell fragments scattered around the pedestal; midground: the egg with its mineralized surface still showing scale-pattern; deep distance: the shrine\'s vaulted ceiling rises into shadow; sky: a single shaft of light from a broken oculus.',
      'COLLAPSED DRAGON-TEMPLE INTERIOR — vast circular temple with massive scaled-columns half-fallen and a dome partially open to the sky; foreground: fallen capstone with a dragon-rune carved on its face; midground: the central altar with petrified dragon-flame still flickering blue-cold; deep distance: the temple continues into shadowed transepts; sky: aurora visible through the broken dome above.',
      'CLIFF-TOP DRAGON-RIDER OUTPOST RUIN — ancient watchtower at the edge of a sheer cliff, the saddle-stand still standing in the open-air upper level; foreground: weathered runic banner-pole fallen across stone; midground: the outpost\'s stone walls partially collapsed showing the saddle stand and dragon-claw-marks on the stone; deep distance: the valley below with a winding river; sky: storm-clouds gathering with first lightning.',
      'GLACIER-EMBEDDED DRAGON SKELETON — a dragon-skeleton frozen in glacier-ice, visible through several meters of clear blue ice; foreground: a chunk of broken ice with a single dragon-tooth still embedded; midground: the skull and forequarters visible through the wall of ice, perfectly preserved; deep distance: the glacier curves away into mist; sky: an ice-blue sky with thin cirrus streaks.',
      'WEATHERED MOSAIC FLOOR — circular mosaic depicting a dragon-rider\'s last stand, individual tiles fallen out leaving gaps but the central rider-and-mount composition still readable; foreground: scattered loose mosaic-tiles in red and gold; midground: the central composition spanning ten meters across; deep distance: the mosaic-floor continues into a roofless ruin; sky: storm-clouds with sun breaking through.',
      'STANDING STONES OF THE DRAGON CLAN — circle of weathered standing-stones each carved with a different dragon-rune, in a high alpine meadow at golden hour; foreground: wildflowers in mountain pink and yellow scattered between the stones; midground: the stone-circle, each pillar twice human height; deep distance: distant mountain peaks; sky: aurora beginning to ripple in green-and-violet.',
      'CLUTCH OF CRACKED DRAGON-EGGS — abandoned dragon-clutch in a stone-walled cave, dozen-plus mineralized eggs cracked at the top as though the brood successfully hatched eons ago; foreground: a single intact egg in the center; midground: the cracked clutch arranged in a careful nesting pattern; deep distance: the cave widens into a vaulted chamber with daylight pouring in.',
      'DRAGON-BONE BRIDGE OVER GORGE — bridge made from a single massive dragon-rib spanning a deep canyon, polished by wind and centuries; foreground: weathered carving at the bridge-anchor showing dragon-rider sigil; midground: the bone-bridge itself, fifty meters long, end-to-end visible; deep distance: opposite cliff continuing the trail; sky: god-rays piercing through cloud above the gorge.',
      'CATHEDRAL COLONNADE OF DRAGON-BONES — corridor lined with massive dragon-rib pillars supporting a stone vault, walking down it like through a ribcage; foreground: a single rib at floor-level showing carved offering-marks; midground: the corridor stretching with paired ribs; deep distance: the corridor ends in a doorway opening to outside light; sky: visible through high arrow-slits.',
      'ABANDONED HOARD WITH PETRIFIED FLAMES — vault chamber where the dragon\'s breath petrified mid-exhale, suspended blue-cold flame-tendrils crystallized in mid-air over the hoard; foreground: scattered gold and a crystal-flame-fragment; midground: the main hoard with the petrified flame-cloud frozen above it; deep distance: throne-impression visible; sky/ceiling: dripstone vault.',
      'MURAL OF THE DRAGON-RIDERS — long horizontal frieze stretching across a fortress wall depicting every dragon-rider lineage, faces weathered but pose-and-mount visible; foreground: fallen sword and helmet of a rider depicted in the mural; midground: the mural\'s body, the rider-lineage stretching down the corridor; deep distance: the wall meets ruined arch; sky: red dawn through arch.',
      'CRUMBLING DRAGON-RIDER STATUE — fifty-meter-tall stone statue of a dragon-rider on his mount, the mount\'s wing partially shattered, the rider\'s head fallen at the base; foreground: the fallen stone head, weathered but still recognizable; midground: the statue itself, mount and rider; deep distance: more ruined statues in a row receding into mist; sky: storm-cloud with lightning.',
      'DRAGON-SKULL CATHEDRAL ENTRANCE — entrance to an underground vault carved through an actual dragon\'s skull, the eye-sockets serving as windows; foreground: rune-carved threshold-stone; midground: the skull-arch revealing a dim interior with treasure-glow; deep distance: dragon-vertebrae receding into shadow; sky: a single shaft of late afternoon sun.',
      'OBSIDIAN DRAGON-TOMB MARKERS — field of weathered obsidian gravestones each carved with a single dragon-rune, marking the resting places of the wyrm-clans; foreground: a single carved marker tilted at an angle with vines climbing it; midground: rows of markers receding through purple twilight mist; deep distance: a single great pyre-mound silhouetted; sky: blood moon rising.',
      'PETRIFIED DRAGON-EGGSHELL IN TREE-ROOTS — single broken dragon-eggshell cradled by the spreading roots of a now-massive oak that grew over the centuries, the shell now stone-hardened; foreground: scattered shell-shards mossed with lichen; midground: the main shell cradled by gnarled roots; deep distance: the oak rises out of frame; sky: dappled gold through canopy.',
      'CLIFF-CARVED DRAGON-FACE WATCHING THE VALLEY — massive dragon-face carved into a cliff-wall hundreds of meters high, eyes-sockets serving as cave-entrances; foreground: scree-slope of fallen stone-chunks below the face; midground: the carved face\'s lower jaw and chin visible; deep distance: the valley spread below with a winding river; sky: morning mist rolling up the cliff.',
      'ABANDONED SADDLE-STAND IN A WIND-SCOURED ROOST — circular open-air aerie at the top of a mountain spire, single weathered saddle-stand still bolted to the stone, dragon-claw-marks raked across the floor; foreground: a fallen rider\'s helm half-buried in scree; midground: the saddle-stand and claw-marked floor; deep distance: the mountain-tops below; sky: thin air, clouds at lower altitude than the roost.',
    ],
    instructions: `Each entry is ONE archaeological dragon-lore scene, 50-80 words. Format: "[SCENE NAME] — [primary lore element]; foreground [tactile fragment]; midground [main element]; deep distance [atmospheric/contextual layer]; sky [overhead element]". STRICT Western high fantasy. NO living dragons / combat / heroes-in-action. Mood: WONDER + MELANCHOLY + ABSENCE-AT-IMPOSSIBLE-SCALE. Variety: skeleton / mural / hoard / egg / temple / outpost. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  dragon_lore_architecture: {
    format: 'simple',
    theme: `ARCHITECTURAL CONTEXT for dragon-lore scenes — the built fantasy structure surrounding or containing the dragon evidence. Each entry 20-40 words. Format: "[ARCHITECTURE TYPE] — [signature visual feature + scale + condition + dragon-related detail]".\n\n⚠️ STRICT WESTERN HIGH FANTASY ONLY — LOTR / GoT / Skyrim / Witcher / Warcraft / D&D / Elden Ring. NO real-world ethnic codes. NO modern / industrial architecture (no lighthouses / windmills / clocktowers / etc.). NO sci-fi (no floating islands).\n\n✓ FANTASY-CANON DRAGON-ARCHITECTURE: dragon-temple / dragon-shrine / dragon-cathedral / dragon-rider outpost / aerie / cliff-cut roost / mountain-cut tomb / scaled-column hall / cathedral-of-bones / standing-stones shrine / colonnade-of-claws / vault-of-hoards / dragon-fortified-keep / dragon-cult-monastery / dragon-tomb-marker-field.\n\nThe architecture is FANTASY-MEDIEVAL with dragon-themed motifs: scaled columns / claw-carved buttresses / dragon-tooth crenellations / wing-shaped flying-buttresses / dragon-eye windows / runic dragon-glyphs etched into stone / dragon-face cliff carvings / wyrm-skeleton supports / petrified-flame chandeliers.`,
    touchpoints: [
      'A vast cathedral-temple built to a dragon at midground, scaled columns supporting a vaulted ceiling with a single broken oculus, much of the roof collapsed onto the central altar.',
      'A mountain-cut dragon-tomb at deep distance, the entire face of the cliff carved as a massive dragon-skull serving as a doorway with dark interior beyond.',
      'A colonnade-of-bones at midground — paired massive dragon-ribs supporting a stone vault, forming a corridor that stretches for hundreds of meters.',
      'An aerie spire at deep distance — narrow mountain-peak with weathered stone platform at the top, claw-marks raked across visible roosting surface.',
      'A weathered dragon-shrine at midground, four scaled columns supporting a domed roof, central altar still bearing offerings of crystallized gold-flame.',
      'A dragon-rider outpost ruin at midground perched on cliff-edge, watch-tower with the saddle-stand still intact at the open-air upper level.',
      'A vault-of-hoards architecture at midground — vaulted underground chamber with arches carved as dragon-wings, gold-filled to a meter deep.',
      'A standing-stones shrine at deep distance — circle of monoliths each carved with a different dragon-rune, set in a clearing surrounded by ancient cedars.',
      'A mountain-cut dragon-cathedral at deep distance, the entire mountain face hollowed into a temple with a massive door, columns of dragon-claw supporting the entrance.',
      'A cliff-perched dragon-cult monastery at midground, multiple connected scaled-roof buildings clinging to a near-vertical rock face, ancient and abandoned.',
      'A dragon-fortified keep at midground — castle whose curtain walls are reinforced with massive dragon-rib bone-trusses, the central tower roof shaped like folded wings.',
      'A dragon-tomb-marker field at midground — rows of obsidian gravestones each carved with a single dragon-rune, stretching into the misty distance.',
      'A scaled-column hall at midground — interior corridor with each column carved to resemble a coiling dragon, the column-capitals showing dragon-heads.',
      'A wing-shaped flying-buttress at midground — massive stone wing-arch supporting a half-collapsed temple, the buttress weathered but its feather-like detail still visible.',
      'A petrified-flame chandelier hall at midground — long hall whose ceiling is hung with stone-frozen tongues of dragon-fire suspended in mid-flicker, dimly glowing.',
      'A dragon-eye window cathedral at midground — narrow chapel with the rear wall pierced by a massive circular window shaped as a dragon\'s eye, stained glass still partially intact.',
      'A claw-carved buttress-row at midground — exterior wall of a ruined keep reinforced with massive stone buttresses each ending in a clawed talon.',
      'A wyrm-skeleton arch at deep distance — natural rock-formation framing the entrance to a vault, the upper-arch curving like a dragon-spine.',
      'A dragon-tooth crenellation watchtower at midground — square stone tower whose battlements are carved as massive interlocking dragon-teeth.',
      'A great wyrm-skeleton incorporated into a temple at midground — the natural skeleton serving as the temple\'s central support structure, the chamber built around it.',
    ],
    instructions: `Each entry is ONE dragon-lore architecture element, 20-40 words. STRICT Western high fantasy. NO modern / industrial / sci-fi / real-world ethnic codes. Positioned at MIDGROUND or DEEP DISTANCE. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  dragon_lore_phenomenon: {
    format: 'simple',
    theme: `80%-gated UNIQUE DRAGON-SHAPED HABITAT for a dragon-lore scene — never-before-seen environmental features that ONLY a long-departed dragon's presence could have created. The HABITAT IS the phenomenon — the landscape itself bears the impossible mark of the dragon's living. Each entry 30-60 words.\n\n⚠️ STRICT WESTERN HIGH FANTASY ONLY. 🚫 NO sci-fi / sky-whales / nebulas / floating islands / orbital / cosmic horror / modern industrial. NO real-world ethnic codes.\n\n⚠️ MOVIE-POSTER INTENSITY — each habitat feature should DOMINATE its quadrant of the frame. Scale-vertigo mandatory: glass-trees rising 50 meters / petrified-fire flowing for miles / ash-snow blanketing horizon / crystalline geysers hundreds of meters tall. THINK STUDIO-GHIBLI-PETER-JACKSON-CONCEPT-ART scale, not subtle.\n\n⚠️ NEVER-BEFORE-SEEN — these must feel UNIQUE to a dragon-touched world. NOT generic fantasy ruins / NOT standard biomes / NOT recognizable from a real-world reference. Each habitat is an IMPOSSIBLE consequence of dragon-fire / dragon-blood / dragon-breath / dragon-tears / dragon-spittle / dragon-shed-scales / dragon-pyre-ash mineralizing or transforming the world.\n\nCategory tilt — distribute roughly:\n  A. **PETRIFIED-FIRE TRANSFORMATIONS** (~25%): dragon-fire fused things into glass / obsidian / crystal that still hums with residual heat or glow\n  B. **MINERAL-TEAR / BLOOD / SPITTLE POOLS** (~20%): dragon-fluids mineralized into impossible color patterns / prismatic surfaces / glowing pools\n  C. **ASH / EMBER / PYRE FALLOUT** (~15%): centuries-after a dragon-pyre, ash or embers or feathers still drifting / falling / accumulating\n  D. **DRAGON-CARVED GEOLOGY** (~15%): canyons fused / cliff-faces molten / valleys claw-rent / spires shaped by dragon-passage\n  E. **BONE / CORAL / FOSSIL REEFS** (~10%): dragon-bones became reefs / fossil-coral / mineral-formations growing over centuries\n  F. **ETERNAL ANOMALIES** (~15%): impossible perpetual states — flames that don't go out / ice that doesn't melt / runes that pulse / mirrors that show centuries-old reflections / time-paused phenomena`,
    touchpoints: [
      // PETRIFIED-FIRE TRANSFORMATIONS
      'PETRIFIED-FIRE GLASS FOREST — entire pine forest flash-fossilized by ancient dragon-breath, every tree turned to translucent blue-cold obsidian-glass still humming with residual heat, the forest covers a whole valley with each glass-trunk fifty meters tall, light refracting through them in shafts',
      'OBSIDIAN-FLOW VALLEY — dragon-fire ran through this valley centuries ago and never fully cooled, the lava-glass surface still warm to the touch with faint orange seams between cooled-black plates extending for miles, vapor rising in places',
      'FROZEN-FLAME FOREST — entire grove of stone-fire columns where the dragon-flames crystallized mid-burn into upward-reaching petrified shapes, eternal frozen-flicker visible in the late-afternoon light',
      'CRYSTAL-FUSED CLIFF FACE — entire cliff-wall melted and re-cooled by dragon-breath into towering prismatic crystal columns, refracting sunlight into rainbow shafts that paint the valley floor in shifting color',
      'GLASS-CANYON OF FUSED STONE — canyon whose walls were heat-fused by dragon-fire into smooth glassy-black mirrors, the canyon-floor reflecting sky like a frozen river of obsidian',
      // MINERAL-TEAR / BLOOD / SPITTLE
      'CRYSTALLIZED-TEAR SALT-FLAT — vast salt-mirror surface where the wounded wyrm wept, the tears mineralized into prismatic patterns visible from on high, rainbow refraction in every footprint',
      'DRAGON-BLOOD GEYSER FIELD — geysers steaming colored vapor where the ancient wyrm bled into the earth, the steam-clouds tinted crimson and gold in slow eternal exhale across a wide plain',
      'PRISMATIC POOL OF DRAGON-TEARS — perfectly mirror-still pool that catches every color of the sky, the water-surface holding centuries-old reflections that don\'t match the current sky',
      'SPITTLE-CRYSTAL FOREST — every surface of a grotto cluster grown over with iridescent crystal-formations from where the wyrm rested, each crystal humming faintly with dragon-residue',
      'BLOOD-OBSIDIAN RIVER — solidified ribbon of dark glass winding through a valley, the path of dragon-blood spilled millennia ago and never reabsorbed by the earth',
      // ASH / EMBER / PYRE FALLOUT
      'ASH-SNOW FOREST — centuries after the dragon-pyre, luminescent ash still falls in an unending soft snow across the forest, accumulating in white-grey drifts that glow faintly at dusk',
      'EMBER-RAIN PLAIN — drifting glowing embers fall slowly from a sky still healing from the pyre, the plain perpetually orange-lit from below by gentle ember-drift across the entire horizon',
      'DRAGON-PYRE PETAL STORM — pale petals from a long-dead dragon-pyre-tree still drift on the wind a thousand years on, a constant slow-falling cloud of pink-white across the ruin',
      'FEATHER-FALL MEADOW — feather-light dragon-down from the long-departed wyrm still drifts in the air over its old aerie, falling and re-rising in gentle gusts',
      // DRAGON-CARVED GEOLOGY
      'CLAW-RAVINE CANYON — canyon walls rent by single massive claw-strikes carved into the stone, six-meter-deep parallel grooves stretching for kilometers along the cliff-face',
      'WING-CARVED MOUNTAIN — entire mountainside hollowed into a vast wing-shaped cavern where the dragon roosted, the negative-space outline of its wing still visible',
      'WYRM-TAIL VALLEY — entire valley follows the impossibly long serpentine path where the dragon\'s tail rested for millennia, the valley walls perfectly fitted to its absent body',
      'BREATH-FUSED COLUMN FIELD — vertical obsidian columns rising hundreds of meters across a plain where dragon-fire compressed the stone into prismatic spires',
      // BONE / CORAL / FOSSIL REEFS
      'BONE-CORAL REEF FIELD — where ancient dragon-bones became seed for coral growth over centuries, now a forest of branching white coral-bone-structures rising from a fossilized seabed',
      'FOSSIL-VERTEBRAE BRIDGE-CHAIN — chain of connected islands formed when an ancient dragon\'s vertebrae mineralized into stone, each island the size of a hill',
      'CALCIFIED SCALE-DRIFT — vast scattered field of fossilized dragon-scales each the size of a shield, accumulated over millennia from the shedding of one immense wyrm',
      'WYRM-RIB CATHEDRAL FOREST — natural underground space where ancient dragon-ribs grew into pillars supporting cave-roofs over centuries, a rib-vaulted living-stone space',
      // ETERNAL ANOMALIES
      'PETRIFIED-FLAME FLICKERING ETERNAL — crystallized dragon-flame still flickers blue-cold over the abandoned hoard, an impossible eternal ember frozen mid-burn',
      'TIME-PAUSED RAINSTORM — a single moment of dragon-fire flash-fossilized an entire rainstorm mid-fall, thousands of glass-droplets hovering on invisible stems-of-air',
      'RUNE-STONES PULSING OUTWARD — the dragon-tomb-markers pulse with soft blue-white runic light in slow rolling waves, the pulse traveling stone-to-stone across the field',
      'GHOSTLY-DRAGON SHAPES IN MIST — translucent draconic silhouettes briefly visible through fog over the ruin, multiple shapes moving slowly, fading as you watch',
      'MIRROR-POND THAT SHOWS THE PAST — perfectly reflective pool whose surface holds a thousand-year-old reflection of the living dragon, visible only at dusk',
      'PHOSPHORESCENT BLOOD-VEIN GLOW — visible glowing veins of dragon-blood snake through the rock-floor of the ruin, pulsing softly with each second',
    ],
    instructions: `Each entry is ONE UNIQUE DRAGON-SHAPED HABITAT phenomenon, 30-60 words. Format: "[NAME-CAP] — [what the dragon did + how the world bears its mark + the visual impossibility / scale]". The habitat IS the phenomenon. Movie-poster scale, NEVER-BEFORE-SEEN, only-a-dragon-could-do-this. STRICT Western high fantasy. NO sci-fi / cosmic / modern. Variety across petrified-fire / mineral-fluid / ash-pyre / dragon-geology / bone-fossil / eternal-anomaly. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  dragon_lore_surprise_element: {
    format: 'simple',
    theme: `TINY SECONDARY SUBJECTS for a dragon-lore scene — small details implying the wider world. Each entry 15-35 words. Format: "[ELEMENT] — [visual description + placement: midground / deep midground / edge of frame]".\n\n✓ ALLOWED — tiny figures permitted (scholars / explorers / archaeologists / awe-struck pilgrims / lone wanderers) as SCALE-PROVERS and MOOD-SETTERS. They are REVERENT, AWED, INVESTIGATING — NEVER combat, NEVER action. Render them as TINY silhouettes — 5-15% of frame max. PLUS wildlife / abandoned objects / weather-detail / magical-detail / abandoned-artifacts.\n\n🚫 ABSOLUTE BANS: NO living dragons / NO armies / NO villages-with-people. NO modern / industrial / sci-fi objects (no lighthouses / windmills / orbital structures).`,
    touchpoints: [
      'a tiny scholar in dark traveling robes kneeling at the base of a dragon-skeleton, sketching the bones in a leather journal — midground silhouette',
      'a single archaeologist with a lantern crouched inside the dragon-cathedral nave, dwarfed by the scale of the ribcage around him — deep midground',
      'a lone wanderer standing at the threshold of a vaulted hoard, palm pressed against the doorway, hesitating before entering — midground',
      'a small group of explorers in furs camped at the base of the cliff-carved dragon-face, their campfire a single point of orange — deep distance',
      'an awe-struck pilgrim kneeling at a dragon-tomb-marker, head bowed, distance lending him reverence — midground',
      'a red fox watching from the edge of the dragon-skeleton, ears pricked, half-hidden in the rib-grass — foreground',
      'a hawk perched on the dragon-statue\'s extended claw, alert, head turning toward the camera — midground',
      'a single intact dragon-tooth at the foreground edge, half-buried in earth and moss, twenty centimeters long',
      'a fallen scholar\'s rucksack at the foreground edge, opened with a leather-bound dragon-grimoire spilling out',
      'an ancient banner-pole at the edge of the frame, the cloth long-rotted but the dragon-clan sigil still faintly visible',
      'a circle of charcoal at the central altar marking an offering-fire long-extinguished, surrounded by small bone-fragments',
      'a single weathered scroll partially unrolled in the foreground, dragon-runes visible across its surface',
      'a perched raven on the dragon-skull at midground, watching with intelligence',
      'a flock of distant birds rising from the cliff-face dragon-tomb, alarmed by something unseen',
      'a tiny figure of a young apprentice mage standing at the edge of the rune-circle, a single staff held upward in awe — deep midground',
      'an old saddle-fragment with weathered dragon-rider house-sigil leaning against a stone wall',
      'a single cracked piece of dragon-eggshell in the foreground, large as a dinner plate, mineralized and rune-edged',
      'a wolf trotting across the foreground, head turning to watch the camera, between the camera and the ruin',
      'a single elder wanderer with a long staff and weathered hood standing at midground edge, hand raised against the light, gazing at the bones',
      'a fallen dragon-rider helm at the foreground edge, weathered but unmistakably belonging to a riding-knight',
      'a half-buried dragon-claw protruding from the earth in the foreground, three meters long, a fragment of the larger skeleton',
      'a glowing rune-stone at midground edge, palm-sized, faintly pulsing blue-white in the gloom',
      'a tiny scholar with a brass measuring-rod standing next to the dragon-vertebra column, the rod giving scale comparison',
      'a wolf-pack visible in the distant valley below the cliff-tomb, eight or nine silhouettes moving across snow',
    ],
    instructions: `Each entry is ONE tiny secondary subject for a dragon-lore scene, 15-35 words. Tiny humanoid figures (scholar / explorer / archaeologist / awe-struck pilgrim / lone wanderer) ARE permitted as scale-provers — render at 5-15% of frame max, never the focus. Plus wildlife / abandoned objects / magical signs. NO living dragons / armies / villages-with-people. NO modern / industrial / sci-fi. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  dragon_lore_sky: {
    format: 'simple',
    theme: `SKY / OVERHEAD ELEMENTS for a dragon-lore scene — the dramatic atmospheric layer that occupies the upper half of the frame. Each entry 15-30 words. Format: "[SKY DESCRIPTION] — [signature feature + light/color/atmospheric quality]".\n\n⚠️ STRICT WESTERN HIGH FANTASY. 🚫 NO sci-fi / cosmic / nebulas-in-daylight / sky-whales / floating islands / orbital / Hubble-deep-field. The sky must feel like a fantasy world's sky.\n\nMood-fit for dragon-lore: melancholy / mysterious / ancient / reverent. Lean dramatic but never overwhelming the lore-element below.\n\nVARIETY: dawn (rose-gold / pale lemon) / golden hour cumulus / blue hour transition / dusk / overcast pewter with crepuscular rays / aurora-rippled night / twin moons / starlit night (clean starfield) / mist blanketing upper third / heavy snowfall / sun-pillar / sundog / halo-around-sun / sky with passing dragon-silhouette at distance / sky with comet / sky with double rainbow / sky with mammatus / sky with distant rain-curtains.`,
    touchpoints: [
      'Pale dawn sky with thin cirrus gone gold along leading edges, the sun a soft disk through high haze',
      'Storm-bruised purple-black with lightning forking in a distant thunderhead, mammatus pouches visible',
      'Aurora-rippled night sky in green-and-violet curtains, stars visible between the auroral pillars',
      'Twin moons rising over distant peaks — one full-white, one pale-amber, their light overlapping below',
      'Overcast pewter with intermittent crepuscular-rays piercing through cloud-breaks onto the ruin',
      'Blood-red sunset bleeding into indigo above, the horizon bracketed by red on bottom and violet on top',
      'Aurora-storm of arcane light pulsing through clouds, gold and violet alternating in slow waves',
      'Night sky with comet bisecting the heavens, its tail spanning thirty degrees of arc',
      'Starlit night with a single bright moon, the starfield clean and ancient',
      'Mist blanketing the upper third of the frame, the ruin emerging from the bottom of the cloud-layer',
      'Heavy snowfall obscuring the sky, individual flakes drifting through still air',
      'Double rainbow spanning the misty valley after rain, the second bow faintly visible above',
      'Halo-around-the-sun ice-crystal phenomenon, the corona a perfect bright ring',
      'Sundogs flanking a low winter sun, three bright spots aligned across the sky',
      'Sun-pillar — vertical bright column extending from the setting sun straight up into a cloud-bank',
      'Distant rain-curtains as vertical grey columns over the horizon',
      'A single dragon-silhouette passing across the sky at deep distance — fantasy-canon echo of the lost',
      'Curtains of mist drifting across a starlit sky, the moon dim through the veil',
      'Indigo dusk with the first stars appearing, a single horizon-band of dying rose-gold',
      'High noon brilliant blue with cumulus piled in vertical castles, sharp shadows on the ruin below',
    ],
    instructions: `Each entry is ONE sky / overhead description for a dragon-lore scene, 15-30 words. Strict Western high fantasy — NO sci-fi / cosmic. Mood-fit: melancholy / mysterious / ancient / reverent. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── DRAGONBOT landscape path (2026-05-14, flagship migration from
  // legacy function-based to bespoke 5-axis system) ──────────────────────

  landscape_biome: {
    format: 'simple',
    theme: `AWE-INDUCING MOVIE-POSTER-INTENSITY FANTASY BIOMES for DragonBot's flagship LANDSCAPE path. Each entry is a FULL biome description with multi-tier depth (foreground tactile / midground body / deep distance / sky context). LOTR / GoT / Elden Ring / Skyrim / Witcher / Warcraft visual lineage. STRICT WESTERN HIGH FANTASY ONLY. Each entry 50-80 words (longer than typical because each entry must MAX OUT scale and drama).\n\n⚠️ NO CHARACTERS in the biome description. The land is the hero. (Animals or wildlife as scale-provers OK; humanoid figures NOT.)\n\n⚠️ MOVIE-POSTER INTENSITY — Every biome entry must read as JAW-DROPPING — the kind of landscape that opens a chapter / serves as a Peter-Jackson-LOTR establishing shot. NOT a quiet meadow. SCALE-VERTIGO mandatory:\n• Cliffs that drop a thousand feet into mist\n• Waterfalls that fall miles into the unknown\n• Mountains piercing clouds so the peaks float above\n• Valleys so deep the bottom is lost in haze\n• Forests with trees forty meters tall\n• Canyons where the walls meet overhead in slot-passages\n• Floating islands suspended impossibly\n• Bioluminescent caverns the size of cathedrals\n• Multiple scale-provers in every frame (small things proving big things)\n\nMANDATORY in every entry:\n• A SPECIFIC BIOME (forest / mountain / coast / canyon / tundra / volcanic / marsh / desert / cave / etc.) named distinctly\n• MULTI-TIER DEPTH — foreground tactile detail + midground body + deep distance atmospheric layer\n• "LAND IS ALIVE" SIGNAL — lush / dynamic / full of life / scale-vertigo / rich-detail\n• A SIGNATURE FEATURE that makes this biome distinct from generic-fantasy-landscape (specific tree species / specific rock formation / specific magical glow / specific weather)\n• SCALE PROVER — wildlife / abandoned object / distant cookfire smoke / lit windows / ships-as-dots — something small that makes the big things feel impossibly big\n\n🚫 ABSOLUTE BANS:\n• NO characters / figures / humanoids\n• NO real-world ethnic-coded settings (no Bedouin desert / Persian palace / samurai temple / Aztec ruin / Polynesian island). Use fantasy-canon analogues: Dornish-coded / Hammerfell-coded / Chultan-coded / etc.\n• NO generic painted-postcard descriptions ("a beautiful forest with mountains in the distance")\n• NO single-tier flat compositions — every entry MUST describe foreground + midground + distance\n\nVARIETY MANDATE — distribute across these biome categories (target ~equal distribution):\n\n  A. **FOREST / WOODLAND** (~20%): primeval mistwood / sun-dappled grove / pine taiga / birch grove / redwood-cathedral / autumn maple / mangrove tide-flat / bioluminescent fungi cave / fey-hollow / Lothlórien-coded golden wood / Mirkwood-coded dark forest / Greenwood / Hyjal / Stranglethorn\n  B. **MOUNTAIN / ALPINE** (~15%): alpine pass above cloudmass / glacier canyon / treeline-to-tundra threshold / volcanic foothills / Skyrim-coded snow peaks / Misty Mountains / Iron Hills / Dragonblight peaks / Mahakam range\n  C. **COAST / SEA-CLIFF / FJORD** (~10%): storm-wracked coastal cliffs / fjord with sheer walls / sea-cliff monastery ruin / island archipelago / Skellige-coded rocky coast / Ironborn island / Dorne sand-beach\n  D. **CANYON / DESERT / MESA** (~10%): wind-carved sandstone / slot canyon / dune sea at noon / salt-flat starfield / Hammerfell desert / Anauroch wastes / Athasian Dark-Sun / Calimshan desert\n  E. **VALLEY / MEADOW / MOOR** (~10%): autumn glacial valley / windswept highland moor / alpine meadow / firefly glen / moonlit meadow / Rohan plains / Highgarden meadow / Greenwood glade\n  F. **WETLAND / MARSH / RIVER** (~10%): mangrove swamp at low tide / dawn-mist river / mountain stream / waterfall basin / Sothoryos jungle-marsh / Stranglethorn river / Dagorlad bog\n  G. **VOLCANIC / OBSIDIAN / FIRE** (~5%): volcanic plain in twilight / lava-tube skylight cave / obsidian flow / Mordor-coded ash-waste / Vvardenfell ash-coast / Searing-Gorge plain\n  H. **TUNDRA / ICE / FROST** (~10%): aurora-curtained tundra / glacier canyon with cathedral-ice / frozen birch grove winter / Forodwaith waste / Skyrim northern reaches / Frostmourne cathedral\n  I. **RUIN / OVERGROWN / ABANDONED** (~10%): overgrown temple courtyard / sunken garden / abandoned watchtower / collapsed bridge / forgotten chapel / waystation ruin / Eriador ruin / Carian academy ruin / Leyndell collapsed quarter`,
    touchpoints: [
      'PRIMEVAL MIST-FOREST WITH TITAN OAKS — thousand-year oaks with thirty-meter trunks wrapped in lichen and luminescent moss, ferns at knee-height, shafts of green-filtered sunlight piercing the high canopy through mist; deep distance reveals more trunks fading into dawn-fog; sky barely visible through layered canopy.',
      'WIND-CARVED MESA AT AMBER HOUR — bone-white sandstone with natural arches spanning forty meters, wind-smoothed into sensual curves; foreground scattered with desert-flowers in pink and amber; midground reveals a sister mesa across the dune sea; sky a vast amber-violet sunset.',
      'HIGH ALPINE PASS ABOVE CLOUDMASS — narrow stone pass at four thousand meters, granite spires receding into snow-haze, the trail a thread between two voids; foreground patches of alpine wildflowers and frost-cracked stone; sky an unreal blue with thin cirrus clouds streaming.',
      'AUTUMN GLACIAL VALLEY — U-shaped valley carpeted in mixed-deciduous forest gone gold and crimson; oxbow river coiling through the basin reflecting fall foliage; foreground granite boulder with creeping moss; midground forest body; deep distance peaks veiled in fall-mist.',
      'BIOLUMINESCENT GROTTO WITH FUNGAL LIGHT — subterranean chamber fifty meters across dominated by luminescent shelf-fungi and hanging blue-glowing moss; foreground crystalline pool reflecting fungal-light onto the dripstone ceiling; deep distance reveals more chambers branching into blue darkness.',
      'STORM-WRACKED CLIFF FORTRESS RUIN — basalt sea-cliff with the broken remains of a Carian-coded fortress clinging to the heights; foreground waves crashing against pillared stacks; midground spray and gulls wheeling; deep distance storm-cloud horizon with lightning flickering.',
      'AURORA-CURTAINED TUNDRA — vast treeless plain under shimmering green-and-violet light-curtains, permafrost hummocks extending to horizon; foreground lichen-painted rocks and frost-crystals; midground reveals reindeer in distant silhouette; sky dominated by aurora architecture.',
      'GORGE-SPANNING ROPE BRIDGE OVER CLOUD-LAYER — deep canyon with a rope-and-plank bridge threading between cliff-walls, cloud-layer pooling below; foreground gnarled pine clinging to the rim with exposed roots; midground bridge mid-span; deep distance opposite cliff-face vanishing into mist.',
      'UNDERGROUND CATHEDRAL LAKE — massive cavern with pillars descending from darkness into mirror-black water; foreground bioluminescent algae on the water-edge stones; midground the great pillars reflected perfectly; deep distance darkness swallowed in ink; ceiling phosphorescent stars.',
      'HIGHLAND MOOR STORM — windswept moorland under racing storm-clouds, heather waist-high in purple and gold; foreground a single weather-worn standing-stone with carved runes; midground rolling hills going to mist; sky bruised purple-black with lightning forking.',
      'REDWOOD CATHEDRAL FOREST — coastal redwood grove with trunks eight meters in diameter dwarfing everything beneath; foreground fallen needle-carpet and silver-grey logs; midground vertical trunks rising into mist; deep distance more trunks fading; sky barely visible through canopy.',
      'CRATER LAKE AT TWILIGHT — volcanic crater filled with mirror-still water, rim three hundred meters above the surface; foreground volcanic glass shards catching last light; midground reflection of crimson sunset cloud-bank; sky bleeding from crimson through violet to indigo.',
      'SANDSTONE SLOT CANYON AT HIGH NOON — narrow canyon with walls meeting forty meters overhead, light filtering to orange glow; foreground smooth water-carved curves of red stone; midground curving wall-textures revealing fossilized seabed strata; deep distance vanishing into orange shadow.',
      'MOUNTAIN MONASTERY COURTYARD ON IMPOSSIBLE SPIRE — fortress-temple on a needle-like spire above a cloud-ocean; foreground prayer-flags strung between weathered stone pillars; midground monastery body with bell-tower; deep distance other spires breaking through cloud-tops at sunset.',
      'MANGROVE BIOLUMINESCENT SWAMP — coastal mangrove at low tide, prop-roots exposed in tide-pools, water-pools glowing where disturbed; foreground a single egret motionless in shallows; midground twisting root-tunnels; deep distance fireflies rising in clouds at dusk.',
      'FROSTED BIRCH GROVE IN DEEP WINTER — birch forest with every twig coated in hoarfrost crystals; foreground a frozen creek with ice patterns; midground white-on-white trunks blurring into snowy mist; sky pale and overcast, dim winter sun a circle of soft light.',
      'SALT-FLAT STARFIELD DESERT — vast salt-flat reflecting unreal stars after rare rain, surface mirror-perfect; foreground hexagonal salt crystals catching starlight; midground hexagonal crack-pattern receding into horizon; sky an unfathomable starfield with Milky Way arching.',
      'FJORD SHEER-WALL PASSAGE — narrow fjord with cliffs falling eight hundred meters straight to deep-blue water; foreground gnarled spruce clinging to cliff-edge; midground sea-eagles riding updrafts; deep distance water snaking inland between basalt walls vanishing into mist.',
      'LAVA-TUBE SKYLIGHT CATHEDRAL — collapsed lava-tube ceiling creating light-shaft into darkness, ferns colonizing in the bright zone; foreground volcanic glass beneath the light-spot; midground the cathedral-walls of cooled lava with rope-textures; deep distance pitch-black tunnel curving away.',
      'OVERGROWN TEMPLE COLONNADE — jungle-reclaimed Carian-coded temple with massive columns emerging from fog and tropical ferns; foreground broken pediment overgrown with vine-flowers; midground columns receding into vines; deep distance the main temple structure half-swallowed by trees.',
      'SEA-CLIFF FORTRESS RUIN — fortress-monastery on impossible promontory, three sides sheer drop to breakers, fourth side connected to coast by a narrow ridge; foreground crashing surf against pillared stacks; midground fortress walls partially fallen into the sea; sky storm-wracked.',
      'CRYSTAL CAVE WITH HANGING SHARDS — massive geode-chamber with crystal stalactites the size of trees, every surface refracting blue-violet light; foreground crystalline pool with submerged crystal-clusters; midground crystal pillars meeting from ceiling and floor; deep distance more chambers branching into prismatic darkness.',
      'TREELINE-TO-TUNDRA THRESHOLD — last stunted pines clinging to the wind, lichen-painted rocks beyond stretching to flat horizon; foreground wind-bent dwarf-pine with exposed roots; midground transition zone with moss and frost-flowers; deep distance vast lichen-tundra under thin pale sun.',
      'ELDEN-RING-CODED ERDTREE GROVE — golden-leafed colossal trees rising hundreds of meters, their light bleeding through every surface gold; foreground fallen golden leaves carpeting moss; midground trunk-bases like mountain roots; deep distance more trees fading into golden haze.',
    ],
    instructions: `Each entry is ONE awe-inducing fantasy biome, 40-70 words. Format: "[BIOME-NAME-CAP] — [signature feature]; foreground [tactile detail]; midground [body of the biome]; deep distance [atmospheric layer]; sky [overhead element]". STRICT Western high fantasy — no real-world ethnic settings. NO characters / figures. Multi-tier depth MANDATORY. Variety distribution across forest / mountain / coast / canyon / valley / wetland / volcanic / tundra / ruin biome categories. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  landscape_architecture: {
    format: 'simple',
    theme: `ARCHITECTURAL ELEMENTS that anchor composition in a fantasy landscape. The architecture is NOT the hero — it's the COMPOSITION ANCHOR placed at midground or deep distance, drawing the eye to a focal point within the larger biome. Each entry 20-40 words. Format: "[ARCHITECTURE TYPE] — [signature visual feature + scale + condition]".\n\n⚠️ STRICT WESTERN HIGH FANTASY ONLY — LOTR / GoT / Skyrim / Witcher / Warcraft / D&D Forgotten Realms / Elden Ring tradition. The architecture should look like it belongs in Middle-earth, Westeros, Skyrim, the Northern Realms, Azeroth, or the Lands Between.\n\n🚫 ABSOLUTE BANS:\n• NO real-world ethnic codes (no pagodas / minarets / ziggurats / pyramids — use fantasy-canon analogues)\n• NO floating islands suspended in mid-air / tethered-to-nothing structures\n• NO sci-fi architecture (no domes / hangars / docking-platforms / orbital structures)\n• NO modernist / brutalist structures\n• NO Eastern-coded pagodas / temples\n• NO modern / post-medieval / industrial-revolution architecture: NO lighthouses, NO windmills, NO water-wheels, NO mills, NO factories, NO steel-framed structures, NO clocktowers, NO observatories with telescopes, NO industrial chimneys, NO mining-rigs\n• NO Victorian / steampunk-coded architecture\n• NO modern bridges (only stone-arched or rope-and-plank, never iron/steel truss)\n\n✓ FANTASY-CANON ARCHITECTURE:\n• Castles (intact / ruined / partial / clinging-to-cliff)\n• Towers (lone watchtower / multi-tower fortress / wizard's spire / lighthouse)\n• Monasteries / abbeys / chapels / shrines (ruined or intact)\n• Bridges (stone arched / rope-and-plank / collapsed)\n• Colonnades / arches / amphitheater-ruins\n• Standing-stones / megalithic circles / way-cairns\n• Dwarven stone-gates carved into mountainsides\n• Elven treehouses / Sindar-spires / Galadhrim-platforms\n• Dragon-roost spires / wyrm-aeries\n• Hill-forts / palisade-rings / motte-and-bailey\n• Gondorian white-stone fortresses / Minas-Tirith-style\n• Crooked-spire wizard towers (Witcher / Elden Ring coded)\n• Ruined Carian / Leyndell academies (Elden Ring coded)\n• Hobbit-hole burrows (LOTR Shire-coded)\n• Argonath-style colossal statues\n• Iron-clad city-gates / portcullis-fortress\n• Roost / aerie / mountain-temple on impossible spire (but STILL ON THE SPIRE, NOT floating)\n• Crumbled keep / abandoned outpost\n• Weirwood-grove with carved tree-faces (GoT godswood)`,
    touchpoints: [
      'A ruined Carian-coded wizard tower perched on an outcrop at midground, half-collapsed but with the top still gleaming in light from its faded magical wards.',
      'A massive stone arch spanning a forest path at deep distance, vines reclaiming its weathered runes, the keystone still visible against the sky.',
      'A LOTR-coded watchtower fortress at midground, intact with battlements visible, banners barely visible against a stormy sky.',
      'A circle of weathered standing-stones at midground, slightly tilted but unfallen, runes visible on the inner faces, lichen-patterned and ancient.',
      'A rope-and-plank suspension bridge spanning a gorge, the rope visibly fraying at the cliff anchor, the planks weathered grey from rain and sun.',
      'An Elden-Ring-coded golden colossal tree visible in deep distance, its top half lit by sunset, its base disappearing into mist.',
      'A dwarven Khazâd-style gateway carved directly into a mountainside at midground, runic doors closed, two stone-giant figures flanking the entrance.',
      'A monastery on an impossible spire at midground, prayer-flags strung between its weathered stone pillars, a single bell-tower visible.',
      'An elven Sindar-coded treehouse complex visible in midground, suspended walkways spiraling around massive oaks, lanterns glowing softly at twilight.',
      'A Gondorian-coded fortress at deep distance perched atop a cliff, white-stone walls catching the last light, the silver-tree banner snapping in the wind.',
      'A half-buried colonnade at midground, columns broken at various heights, the surviving lintel-stones carved with crumbling reliefs.',
      'A wizard\'s academy tower at midground, multiple connected spires of different heights, narrow windows lit from within with arcane blue-violet light.',
      'A LOTR-coded Argonath-style colossal stone statue at deep distance, its features weathered nearly featureless, hand outstretched.',
      'A ruined chapel half-collapsed at midground, stained-glass windows mostly shattered but the rose-window still intact, ivy climbing the bell-spire.',
      'A floating island visible in deep distance, suspended by visible arcane currents, with a small temple structure perched on top, tethered to nothing.',
      'A dragon-roost stone-tower at midground, sized to accommodate something massive, the inside visible as a vaulted nest-chamber through broken upper-floors.',
      'A lighthouse-tower on a sea-cliff at deep distance, its top still operating with magical flame, casting a beam across storm-clouds.',
      'A way-cairn at midground, fifteen meters tall, built of stacked rune-carved stones, slightly weathered but unmistakably intentional.',
      'An ancient Elden-Ring-coded broken-arch at midground, only the upper-curve of the original arch still visible, the rest collapsed into rubble.',
      'A Witcher-coded ruined keep at midground, square stone tower with crumbling walls, a single intact iron-bound door visible at its base.',
    ],
    instructions: `Each entry is ONE architectural element, 20-40 words. Format: "[ARCHITECTURE] — [visual feature + scale + condition + placement: midground / deep distance]". Strict Western high fantasy. NO real-world ethnic codes. Positioned at MIDGROUND or DEEP DISTANCE (never foreground). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  landscape_phenomenon: {
    format: 'simple',
    theme: `80%-gated ATMOSPHERIC / MAGICAL PHENOMENON woven into a fantasy landscape — an awe-inducing event that elevates the scene from beautiful to MEMORABLE. Each entry 25-50 words.\n\n⚠️ STRICT WESTERN HIGH FANTASY ONLY — LOTR / GoT / Skyrim / Witcher / Warcraft / D&D Forgotten Realms / Elden Ring. The phenomenon must feel like a frame from a Peter-Jackson-LOTR establishing shot, NOT a sci-fi movie / Avatar / Studio Ghibli / Star Wars / cosmic horror.\n\n🚫 ABSOLUTE BANS (sci-fi drift):\n• NO sky-whales / passing leviathans / floating sea-creatures\n• NO nebulas visible in daylight / cosmic-arms / galaxy structures\n• NO sky-tears / dimensional rifts in the sky (those belong in action-scenes paths, not landscape)\n• NO floating islands suspended in mid-air\n• NO perpetual-twilight weirdness / time-frozen-sky\n• NO magical portals in the sky / arcane sigils hovering\n• NO interstellar / spaceship / orbital / alien phenomena\n• NO cosmic horror tentacles / Lovecraftian sky-event\n\n✓ FANTASY-CANON PHENOMENA ONLY:\n• Aurora borealis (real-world, fantasy-friendly)\n• Twin moons / multi-moon arrangements (Westeros, fantasy worlds)\n• Blood moon rise\n• Lightning storm forking across distant ridges\n• Solar eclipse / lunar eclipse\n• Meteor shower / shooting stars / comet\n• Passing dragon at distance (fantasy-canon)\n• God-rays piercing cloud breaks\n• Heavy snowfall / fog rolling in / petal-storm\n• Rainbow / double rainbow after rain\n• Will-o-wisp cluster in misty grove (Celtic fantasy)\n• Beacon-fires lit on distant ridges (Gondor)\n• Mammatus storm clouds\n• Sun-pillar / sundog / halo-around-sun (real-world atmospheric optics)\n• Crepuscular rays / volumetric god-rays\n• Storm-front edge advancing\n• Lightning striking a distant peak\n• Glowing leyline visible across the land (subtle, ground-level, NOT sky-event)\n• Northern lights\n\n⚠️ MOVIE-POSTER INTENSITY — the phenomenon should DOMINATE its quadrant of the sky/horizon. Not a wisp — a STORM. Not a single bolt — a fork-pattern lighting half the frame. Not a faint aurora — a sky-covering curtain. Not a single comet — a meteor SHOWER. SCALE UP the event to be impossible to miss. BUT KEEP IT FANTASY-CANON — no sci-fi escalation.\n\nFormat: "[PHENOMENON-CAP] — visible description + where it appears in the scene".\n\nABSOLUTE BANS: NO violence / battle / enemies / characters / figures. The phenomenon is purely environmental / magical.\n\nVARIETY: aurora / meteor shower / blood moon / lightning storm / eclipse / passing dragon at distance / falling star / will-o\'-wisp cluster / god-ray dawn / comet / magical portal in the sky / mist rolling in / heavy snowfall / autumn leaf-fall / double rainbow / twin-moon rise / firefly emergence / dust devil / petal-storm / ash-fall / passing sky-whales / ground-fog glow / rolling thunderhead / atmospheric refraction / time-of-day weirdness (perpetual sunset, frozen-twilight) / arcane-storm / leyline flare / sky-tear / floating arcane sigils / spirit-lights / mythic creature crossing horizon`,
    touchpoints: [
      'AURORA BOREALIS — green-and-violet curtains rippling across the night sky above distant snow-capped peaks',
      'METEOR SHOWER — dozens of fire-streaks tracing across a star-dense sky, brief and dazzling',
      'BLOOD MOON RISE — massive crimson moon cresting the eastern horizon, bathing the landscape in rust-red light',
      'PASSING DRAGON AT DISTANCE — winged silhouette gliding across a far ridge-line, scale-glint visible in the morning sun',
      'WILL-O\'-WISP CLUSTER — floating lantern-spirits drifting at knee-height across a misty grove',
      'GOD-RAY DAWN — single thick column of sunlight piercing dense morning cloud onto the valley floor',
      'COMET — bright tailed body crossing the sky, its tail visible as a long pale arc',
      'MAGICAL PORTAL IN THE SKY — swirling glowing ring of light mid-air at a far distance, shape just resolving from haze',
      'MIST ROLLING IN — wall of low fog advancing across the valley floor, swallowing trees as it comes',
      'TWIN-MOON RISE — two moons rising together over distant peaks, one full-white, one pale-amber',
      'FIREFLY EMERGENCE — thousands of fireflies rising from grass at dusk, the meadow lighting up gold',
      'WHIRLING PETAL-STORM — pink petals carried on the wind through the entire scene from a distant grove',
      'ASH-FALL — fine grey ash drifting down through still air from a distant volcano',
      'PASSING SKY-WHALES — fantastical leviathans drifting overhead at altitude through the clouds',
      'GROUND-FOG GLOW — eerie phosphorescence shimmering through low fog at ankle-height across the clearing',
      'ROLLING THUNDERHEAD — wall-cloud bearing down from the horizon, lightning flickering inside its body',
      'LEYLINE FLARE — visible arcane current pulsing across the ground in a single bright line, briefly illuminating standing stones along its path',
      'SKY-TEAR — a vertical seam of glowing arcane light splitting the sky in deep distance, faint as it heals',
      'PERPETUAL-TWILIGHT WEIRDNESS — the entire sky frozen in golden-hour despite midday, dust-motes drifting through still air',
      'SOLAR ECLIPSE — sun reduced to a fire-ringed black disk, shadow racing across the landscape',
    ],
    instructions: `Each entry is ONE atmospheric phenomenon, 20-40 words. Format: "[EVENT-CAP] — visible description + placement in the scene". NO violence / characters. Adds awe. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  landscape_surprise_element: {
    format: 'simple',
    theme: `TINY NON-CHARACTER SECONDARY SUBJECTS for a fantasy landscape — small details implying the wider world without becoming the focus. Each entry 15-35 words. Format: "[ELEMENT] — [visual description + placement: midground / deep midground / edge of frame]".\n\n🚫 ABSOLUTE BANS:\n• NO humanoid figures / characters / heroes / villains / armies / villages-with-people\n• NO modern / post-medieval / industrial-revolution objects: NO lighthouses, NO lighthouse beams, NO lighthouse beacons, NO windmills, NO water-wheels, NO clocktowers, NO observatories with telescopes, NO industrial chimneys, NO mining-rigs\n• NO sci-fi objects: NO floating islands, NO sky-whales, NO orbital structures, NO satellites\n\n✓ ALLOWED: wildlife / objects / weather-detail / magical-detail / abandoned-artifacts / signs-of-civilization-WITHOUT-people (distant cookfire smoke, distant lit window in a far tower, distant ship at sea, distant beacon-fire on a hill, banner-pole, weathered shrine, broken sword, fallen helm).\n\nVARIETY: wildlife (fox / hawk / deer / wolf / raven / falcon / glowing salamander / dragon-distant / luminous fish / butterfly cloud) / abandoned objects (broken sword / crumpled banner / overgrown statue / fallen helm / abandoned cart / sunken boat / weathered shrine) / magical signs (glowing rune-stone / hovering mote / spirit-light / fey ring of mushrooms) / civilization-traces-without-people (smoke from distant unseen fire / distant lit window / distant ship at sea / distant glow of city).`,
    touchpoints: [
      'a single red fox watching from a tangle of thorny underbrush fifteen meters into the foreground, ears pricked, half-hidden',
      'a small dragon perched on a far tower silhouette in deep distance, wings folded, against an evening sky',
      'an abandoned cart at the edge of frame in the midground, one wheel broken, cargo half-spilled across the path',
      'wind-bent prayer flags strung across a narrow mountain pass at midground, snapping in high wind',
      'a hooded raven perched on a stone marker fifteen meters off at midground, watching steadily',
      'an ancient stone marker carved with directional glyphs at the edge of the trail',
      'a broken sword half-buried in the loam, hilt-up, vines already growing around it, at foreground edge',
      'a small standing stone with weathered runes carved into one face, knee-high, mossed, at midground',
      'a herd of distant deer grazing in a far meadow, alert but undisturbed, at deep midground',
      'a half-collapsed wooden bridge in the deep midground, suggesting an old road',
      'a single white moth circling a lantern at the edge of frame, oversized and pale',
      'a partial skeleton of some great beast in the midground, ribs arching from the earth',
      'a small painted shrine tucked into the base of a roadside tree, candle-stub still burning, at midground',
      'a hawk wheeling high overhead at deep distance, briefly silhouetted against bright sun',
      'a scout-sigil scratched fresh into the bark of a tree at the edge of frame, paint still wet',
      'a hovering glowing arcane mote drifting slowly across the midground, palm-sized, blue-white',
      'a small fey ring of mushrooms in a forest clearing in midground, perfectly circular, glowing faintly at dusk',
      'a sunken rowboat half-submerged at the edge of a riverbank in midground, vines climbing its prow',
      'a single tower-light visible in deep-distance, unmistakably from a high window of a fortress otherwise lost in mist',
      'a fallen knight\'s helm half-buried in moss at foreground, vines flowering white through the visor',
      'a thread of distant cookfire smoke rising thin above a far ridge in deep distance, suggesting unseen travelers',
      'a butterfly cloud rising from a wildflower patch in midground, hundreds of bright wings briefly visible',
      'a luminous salamander perched on a rock at midground, its skin faintly glowing blue-green',
      'a weathered statue half-overgrown in midground, faceless and ancient',
    ],
    instructions: `Each entry is ONE tiny secondary subject for a landscape, 15-35 words. Format: "[ELEMENT] — [visual + placement + implication]". Wildlife / abandoned objects / magical signs / civilization-traces-without-people. NO humanoid figures. Element NEVER eclipses the biome. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  landscape_sky: {
    format: 'simple',
    theme: `SKY / OVERHEAD ELEMENTS for a fantasy landscape — the dramatic atmospheric layer that occupies the upper half of the frame. Each entry 15-30 words. Format: "[SKY DESCRIPTION] — [signature feature + light/color/atmospheric quality]".\n\n⚠️ STRICT WESTERN HIGH FANTASY — LOTR / GoT / Skyrim / Witcher / Warcraft / D&D / Elden Ring. The sky must feel like a fantasy world's sky, NOT a sci-fi cosmos.\n\n🚫 ABSOLUTE BANS:\n• NO nebulas visible in daylight\n• NO galaxy arms / cosmic-arms / interstellar features\n• NO floating islands suspended at altitude\n• NO sky-whales / leviathans drifting through clouds\n• NO orbital structures / spaceships / sci-fi sky-architecture\n• NO Milky Way as a strong visual feature (a starfield is fine, but not a literal galaxy-arm crossing the frame)\n• NO Hubble-deep-field cosmic detail\n• NO multiple cosmic phenomena stacked beyond what real-world skies could show\n\n✓ FANTASY-CANON SKIES:\n• Dawn (gold / rose / soft pink)\n• Golden hour cumulus (deep cobalt + edges blazing white)\n• High noon brilliant blue with vertical castles of cumulus\n• Blue hour transition (indigo with first stars)\n• Dusk (crimson / amber band on horizon, deepening to indigo above)\n• Storm-bruised purple-black with lightning\n• Aurora-rippled night (green-and-violet, real-world reference)\n• Twin moons (Westeros canon — one of these is OK occasionally)\n• Overcast pewter with crepuscular rays\n• Starlit night with moon (clean starfield, no galaxy arm)\n• Mist / fog blanketing the upper third\n• Heavy snowfall obscuring the sky\n• Sun-pillar / sundog / halo-around-sun / corona (real-world atmospheric optics, fantasy-friendly)\n• Sky with passing dragon at distance (fantasy-canon — silhouetted)\n• Sky with comet / shooting stars\n• Sky with rainbow / double rainbow after rain\n• Storm clouds with mammatus pouches\n• Distant rain-curtains as vertical grey columns\n• Cathedral-shafts of light through cloud-breaks`,
    touchpoints: [
      'Pale dawn sky with thin cirrus streaks gone gold along their leading edges, the sun a soft disk through high haze',
      'Golden-hour cumulus piled against a deep cobalt sky, edges blazing white, undersides flushed amber',
      'Indigo dusk with the first stars appearing, a single horizon-band of dying rose-gold beneath',
      'Storm-bruised purple-black with lightning forking in a distant thunderhead, mammatus pouches visible above',
      'Aurora-rippled night sky in green-and-violet curtains, stars visible between the auroral pillars',
      'Twin moons rising over distant peaks — one full-white, one pale-amber — their light overlapping on the landscape',
      'Triple-moon arrangement — small white moon high, large pale-blue moon ascending east, faint red moon setting west',
      'Unreal lavender-and-mint sky at perpetual twilight, no sun visible, just diffuse magical glow',
      'High noon brilliant blue with cumulus piled in vertical castles, sharp shadows on the landscape below',
      'Overcast pewter sky with intermittent crepuscular-rays piercing through cloud-breaks',
      'Aurora-storm of arcane light pulsing through clouds, gold and violet alternating in slow waves',
      'Night sky with comet bisecting the heavens, its tail spanning thirty degrees of arc',
      'Deep nebula visible even in daylight, a galaxy arm crossing the upper third of the frame',
      'Floating islands suspended at altitude, their undersides showing exposed stone and dangling roots',
      'Double rainbow spanning the misty valley after rain, the second bow faintly visible above the first',
      'Sky with passing sky-whales drifting at altitude, their long bodies silhouetted against high clouds',
      'Halo-around-the-sun ice-crystal phenomenon, the corona visible as a perfect bright ring',
      'Sundogs flanking a low winter sun, three bright spots aligned across the sky',
      'Sky with sun-pillar — a vertical bright column extending from the setting sun straight up into the cloud-bank',
      'Storm sky with curtains of distant rain visible as vertical grey columns over the horizon',
    ],
    instructions: `Each entry is ONE sky / overhead description, 15-30 words. Variety across times of day / weather states / unreal magical skies / sky-anomalies. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── DRAGONBOT male-action-scenes path (2026-05-14, peak-action
  // multi-effect for male protagonist — mirror of female-action-scenes)
  male_action_scenes_action: {
    format: 'simple',
    theme: `PEAK-ACTION CINEMATIC MOMENTS for a male fantasy adventurer — captured at the LOADED INSTANT of a dynamic mid-action beat. Effects-rich, motion-blurred, MAELSTROM-INTENSE. Each entry 40-70 words (longer than typical pool because EACH ENTRY MUST STACK MULTIPLE SIMULTANEOUS EFFECTS).\n\nFormat: "ACTION-HEADLINE — body position AT THE PEAK INSTANT + his primary effect (spell released / blade arc / arrow loosed) + environmental reaction (debris / shockwave / glass-shatter / sparks raining / motion-blur) + active scene context (fleeing crowd / collapsing tower / allied caster / dragon shadow / distant explosion / arrow-volley)".\n\n⚠️ THIS IS NOT THE CANDID-ADVENTURING POOL. This is PEAK ACTION with the dial CRANKED. Every entry should read as a MOVIE-POSTER PROMOTIONAL STILL — every quadrant of the frame has something happening.\n\n━━━ MULTI-EFFECT STACK — MANDATORY ━━━\nEvery entry MUST describe AT LEAST 3 SIMULTANEOUS DYNAMIC ELEMENTS:\n  1. **HIS PRIMARY ACTION** — the LOADED INSTANT of his beat (mid-cast at fireball apex / mid-loose with arrow streaking / mid-leap descending / mid-summon with portal cracking / mid-strike with blade-arc / mid-channel with energy beam)\n  2. **ENVIRONMENTAL REACTION** — the world REACTING to his action (debris kicked up / glass shattering / dust cloud / sparks raining / spell-light blooming outward / shockwave radiating / hair-and-cloak whipped by magical wind / motion-blur on his swung arm / cracking flagstones / scorch marks)\n  3. **ACTIVE BACKGROUND CONTEXT** — chaos / motion / magic ELSEWHERE in the frame (fleeing crowd / collapsing tower / distant explosion / arrow-volley overhead / dragon shadow / allied caster also mid-spell / battle silhouettes / cracking flagstones / smoke billowing / burning building / charging cavalry / scattered enemies retreating / pursuing guards / falling banners / scrolls whipping past)\n\n━━━ SCALE THE MAGIC UP ━━━\nIf magic is involved, render a MAELSTROM not a wisp. Stack secondary effects on the primary spell.\n\n━━━ ACTIVE SCENE CONTEXT REQUIRED ━━━\nEvery action entry should describe scene-level chaos: someone fleeing / collapsing / shouting / firing / charging / falling / breaking / smoking / glowing.\n\nMANDATORY in every entry:\n• A peak-action verb (mid-cast / mid-loose / mid-leap / mid-strike / mid-summon / mid-blast / mid-charge / mid-shift / mid-vault / mid-slide / mid-block / mid-channel)\n• 2-3 specific stacked effects (his primary + environmental reaction + scene context)\n• KINETIC TENSION — the next frame changes everything\n\nABSOLUTE BANS:\n• NO single-effect quiet moments. STACK THE EFFECTS.\n• NO candid quiet moments — that's male-adventurer.\n• NO grisly gore / fallen bodies / blood-spray (PG-13 action, not slasher)\n• NO shirtless / bare-chested / oiled / loincloth-only / pirate-coded / male-cheesecake / oiled-pecs / strategically-torn / rugged-hero-pose / "open vest revealing chest" / "tunic torn from action" language\n• NO real-world ethnic / historical costume references\n• 🚫 NO PIRATE TROPES — no "swinging from ship rigging with cutlass" / no "skyship boarding" / no "between airborne vessels". Flux training defaults these to shirtless. Use rooftop-to-rooftop leaps / cliff-vaults / wall-runs / battlement-sprints / collapsing-stair-leaps instead.\n\n⚠️ FULLY CLOTHED MANDATE — EVERY entry MUST explicitly note an item of CLOTHING / ARMOR being WORN during the action moment. Examples: "his armored leather cuirass catching firelight" / "fur-lined cloak whipping in the gale" / "his dark scout-coat torn from the speed of the leap" (TORN-AT-HEM only, NOT torn-revealing-chest) / "chainmail rippling with his stride" / "robes billowing behind him". Flux trains "dynamic male action" as shirtless pirate by default; every entry MUST counter this with explicit clothed-and-armored language.\n\nVARIETY MANDATE — distribute across class-coded action types: spellcasters mid-magic / martial mid-strike-or-dodge / ranged mid-loose / rogues mid-infiltration / divine-shaman channeling / travel-escape-pursuit / dragon-rider.`,
    touchpoints: [
      // SPELLCASTERS MID-MAGIC — STACK THE EFFECTS
      'FIREBALL MAELSTROM — arms thrust forward at full extension, the flaming orb just released hurtling toward a fortified gate trailing a comet-tail of ember-sparks AND secondary tendrils of flame curling around his wrists, shockwave radiating outward from his feet kicking up flagstone-dust and rippling battle-banners, fleeing villagers as silhouettes in the foreground while siege engines launch counter-fire from the burning watchtower behind him',
      'PORTAL SUMMON — both hands tracing concentric glyphs in mid-air, a portal of violet light CRACKING REALITY open behind him with creatures partial-emerged, his hair and beard lifting in pulled-physics wind and books-and-scrolls whipping past his body toward the rift, an arcane library collapsing behind him with bookshelves toppling and other apprentices fleeing',
      'ELDRITCH BLAST — palm extended, a beam of crackling violet energy boring outward across the entire frame toward an off-screen target, his own eyes glowing the same violet, secondary shadow-tendrils erupting from beneath his feet, a cliffside with crashing waves below AND a second eldritch entity beginning to manifest in the deep midground sky',
      'STORM-CALLER STRIKE — both arms raised to a storm-cloud sky from a basalt outcrop, lightning bolt forking down past his shoulder to strike the earth at his heel, arcane storm-circle of glowing runes radiating outward from his feet and ozone-mist billowing, his cloak and beard WHIPPED horizontal by the gale, fleeing wolves silhouetted across the moor and a second lightning strike hitting a distant tower',
      'ICE NOVA — arms sweeping downward in an X-pattern, an expanding ring of jagged ice shards radiating outward from his feet shattering the cobblestones, frost-mist billowing past his ankles and his breath visible white, a city plaza with citizens diving for cover and frozen shop signs cracking from the cold-blast',
      'LEYLINE CHANNEL — kneeling with palms flat on the ground, ley-line glyphs flaring blue-white beneath his hands racing outward across cracked earth, his hair lifting in the upward magical pulse and rock fragments hovering around him, standing menhirs at the deep midground beginning to glow in response',
      // MARTIAL MID-STRIKE
      'PALADIN HAMMER-STRIKE — warhammer raised overhead at the apex, the weapon and his arm sheathed in golden divine light, motion-blur on his swing arm and a divine corona blooming outward, a shadow-demon recoiling at the impact-point with its tendrils dissolving, a temple courtyard with retreating cultists in the foreground',
      'KNIGHT SHIELD-CHARGE — sprinting forward behind raised tower shield, the steel face catching a lightning-flash, mud and grass spraying from his boots with each pounding step, banner trailing horizontal behind him, the gate-line of enemy spear-formation visible twenty feet ahead with their front rank already breaking',
      'BARBARIAN MAELSTROM-CHARGE — full sprint with greataxe held two-handed overhead, mouth open in a war-cry, dust and grass kicked up in his wake and motion-blur on his trailing beard, war-paint glowing faintly in the dusk, three scattered foes recoiling in the foreground muddy battlefield and allied raiders charging alongside',
      'MONK AERIAL KICK — caught mid-air, body twisted side-on parallel to the ground, chi-glow trailing his extended leg in a brilliant luminous arc, robe rippling violently and cherry-petals blasted outward from the impact-zone, a temple gong cracking from the impact behind him',
      'WARRIOR PARRY-EXPLOSION — half-turned mid-block with sword angled up, the impact-point a starburst of sparks where his blade meets an unseen attacker\'s, his sword glowing red-hot from the speed of motion, foreground a burst of orange and white debris, a chaotic melee around him',
      // RANGED MID-LOOSE
      'RANGER MID-LOOSE — bow drawn full to his cheek and the arrow JUST released, the shaft streaking from his fingers with a motion-trail spanning the frame, enchanted ember-glow trailing the arrow-tip, his cloak snapping from the shot\'s force, in a forest at golden hour with bandits scattering in the foreground',
      'CROSSBOW VOLLEY — emerging from behind a stone column on a battlement, heavy crossbow snapped to his shoulder, bolt already blurring across the frame toward a distant rider, another bolt streak in the foreground from an unseen ally, a castle corridor lit by lantern-fire with siege machines visible below',
      'WALL-VAULT BACK-SHOT — mid-jump up a stone wall using a single foothold, twisting backwards mid-flight to release an arrow at a pursuer below, motion-blur trail across his bow-arm and lantern-glow lighting him from below, a lantern-lit alley in chaos with two armed pursuers entering',
      'THROWING-AXE TRIPLE — arm in full follow-through, the lead axe already mid-flight blurring across the foreground with two more spinning behind it from his other hand, sparks raining from the embedded axes in the wooden tavern wall behind, a tavern interior with patrons diving away',
      // ROGUES MID-INFILTRATION
      'NIGHT MARKET PURSUIT — moving smoothly through a dense lantern-lit market crowd, hood up, cloak whipping behind him, motion-blur on his trailing edge, his hooded target visible twenty paces ahead already breaking into a run, three guards pushing through the crowd in the deep midground behind, paper lanterns swaying overhead',
      'ROOFTOP DESCENT — mid-leap from a steep clay rooftop, dagger reversed in his hand, descending toward a guard\'s shoulders below, his cloak streaming straight up, motion-blur on the trailing leg, a moonlit citadel courtyard with two more guards reacting to his arrival, a distant fire on the next rooftop',
      'COLLAPSING-ROOF SPRINT — full sprint across an unstable burning rooftop, arrows whistling past him in audible volleys, the roof breaking apart behind each footfall with embers and tiles cascading down, a moonlit city with three pursuers already on the rooftop behind him, archers visible on a distant battlement',
      'TAVERN DOOR EXPLOSION — bursting in shoulder-first through a heavy oak tavern door, splinters flying outward, blade already half-drawn at his hip, lantern-light spilling out behind him into the rain-slick street, inside is a brawl already in progress with patrons fighting on overturned tables',
      'PLAZA PURSUIT VAULT — caught mid-vault over a stone fountain in pursuit, startled pigeons exploding outward in a cloud of feathers and a shower of coins scattering from a knocked-over cart, his quarry rounding the far corner with cloak streaming, market crowd parting in alarm',
      // DIVINE / DRUIDIC / SHAMANIC
      'CLERIC HEALING DOME — kneeling with arms outstretched, a golden dome of divine light expanding outward in motes-of-light particles, motes of gold raining down around him, wounded crouched allies within the growing sphere visibly recovering as the wave passes, a shadowy enemy line retreating at the dome\'s edge',
      'DRUID MID-SHIFT — caught at the moment of half-transformation, fur erupting through splitting skin on his arms and chest visible through the torn shirt-collar, paws emerging from where boots fell, motes of green forest-magic swirling around him, a forest clearing with surprised hunters in the foreground lowering their bows',
      'NECROMANCER RAISING DEAD — standing in a graveyard at dusk, palms pressed downward toward the earth, skeletal hands erupting from the soil around his feet in a wide ring, mist curling upward in tendrils, his eyes glowing white-blank, a distant battle visible in the deep midground with armies clashing',
      'STORM-CALLER MAELSTROM — arms raised to a roiling storm-cloud sky on a high cliff, lightning bolts arcing down BEHIND him into the sea AND from his upturned palms upward into the cloud, his hair and cloak whipped horizontal by the gale, a galleon-fleet visible far below in the storm-tossed waves with sails tearing',
      'DIVINE-STRIKE SWORD — sword raised overhead, a COLUMN of golden light erupting from the blade upward into a starless sky, a circle of paladin-light blooming around his boots and divine motes raining down, holy script glowing in air around him, shadow-demons fleeing in all directions',
      // TRAVEL / ESCAPE
      'COLLAPSING-BRIDGE SPRINT — full sprint along a rope bridge as planks break free behind each footfall, the rope-rail flailing, mist plumes erupting from the gorge as planks fall, a distant tower visible across the gorge with a pursuit-party emerging onto its battlement to fire arrows',
      'MOUNTED GALLOP-BY — at full gallop on his horse leaning low past the camera, banner streaming horizontal behind him, hooves throwing chunks of mud, his mount\'s breath visible in the cold, a burning village receding in the background with civilians fleeing, an enemy cavalry line cresting a hill in pursuit',
      'CLIFF-DIVE ESCAPE — captured mid-air after the leap from a high cliff, arms wide, his cloak billowing upward like a parachute, motion-blur on his plummeting silhouette, a pursuing arrow streaking past where he just was, three pursuers visible on the cliff-edge above firing more arrows',
      'WALL-RUN ESCAPE — wall-running across a battlement at full speed, behind him a fireball-strike erupting against the stone with debris exploding outward, foreground crenellation sparks, a moat far below with crocodiles, archers on the far tower reloading',
      'SCREE-SLIDE PURSUIT — sliding down a steep scree slope on his heels at speed, dust trailing in a long plume behind him, small stones cascading ahead, bow held forward already nocked, the canyon-floor below opening into a chaotic melee battle with multiple allied raiders engaging an enemy patrol',
      // DRAGON-RIDER
      'DRAGONBACK DIVE — clinging to his dragon\'s neck-horn as it dives steeply past a tower, wind plastering him against its neck, dragon-scales catching the sun in iridescent ripples, the tower spire blurring past with motion-blur trail, a city wall under siege below with catapults firing upward',
      'DRAGON-SHOULDER ROAR — standing at his great dragon\'s shoulder mid-roar, fire erupting from its maw in a wide gout illuminating the entire foreground orange, his own cloak whipping back in the heat-blast, the air shimmering from the inferno, a distant siege engine bursting into flame',
      'SADDLED LONGBOW LOOSE — mounted on his flying dragon, bow drawn back, arrow JUST released streaking forward in flight, wind whipping his hair and the dragon\'s mane horizontal, motion-blur on his draw-arm, a city wall and battle far below receding under them',
    ],
    instructions: `Each entry is ONE peak-action cinematic moment for a male protagonist, 40-70 words. Format: "ACTION-HEADLINE — body position AT THE LOADED INSTANT + specific magical/mechanical EFFECT IN MOTION + specific cinematic CONTEXT". Mid-cast / mid-loose / mid-strike / mid-leap / mid-summon. EFFECTS visible (flame-orb / arrow-streaking / divine-light / motion-blur / debris / cloak-whipping). NO candid quiet moments. NO gore. NO shirtless / male-cheesecake / posing-for-camera. NO real-world ethnic codes. Variety mandate: distribute across spellcaster / martial / ranged / rogue / divine-shaman / travel-escape / dragon-rider. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── DRAGONBOT male-adventurer path (2026-05-14, full bespoke male
  // version mirroring female-adventurer 12-axis split; beards allowed for
  // dwarves/orcs/etc; male anatomy + male-cut silhouettes; strict high
  // fantasy; NSFW-clean) ────────────────────────────────────────────────────

  male_adventurer_race: {
    format: 'simple',
    theme: `Fantasy RACE / LINEAGE descriptor for a male adventurer — anatomy + skin/eye type + distinguishing features. STRICT WESTERN HIGH FANTASY only (LOTR / GoT / Skyrim / Witcher / Warcraft / D&D Forgotten Realms / Elden Ring). Each entry 12-25 words. Format: "[Race-name]: [signature anatomy] + [skin tone] + [eye-type] + [distinguishing feature: beards / horns / tusks / scars / ears / etc.] + [BADASS bearing]".\n\n⚠️ BADASS / WEATHERED / DANGEROUS TONE — every entry should imply a man who has SEEN THINGS. Bearing leans:\n  • SCARRED / WEATHERED / HARD-EYED / GRIZZLED / VETERAN\n  • DANGEROUS-EVEN-AT-REST / DEAD-CALM / SOMETHING-HIDDEN\n  • EXOTIC / FOREBODING / OTHERWORLDLY (for darker races)\n  • NOT pretty / soft / regal-and-untouched\n\nMale anatomy markers ALLOWED and ENCOURAGED for races where canon-appropriate:\n  • Dwarves: FULL BEARDS — heavily-braided / massive forked with iron rings / thick with worked-iron clasps\n  • Half-orcs / orcs: pronounced lower tusks + heavy brow + broad scarred jaw\n  • Tieflings / dragonborn: horns / scales / draconic snout\n  • Humans: full beards, mustaches, weathered scars, beardless veteran\n  • Elves: beardless, pointed ears — but RANGE from elegant to feral-wild (wood-elf can be feral; drow can be predatory)\n  • Halflings / gnomes: smaller stature; may have sideburns or short beard\n\n🚫 ABSOLUTE BANS — NO REAL-WORLD ETHNIC CODES (no Bedouin / Persian / samurai / Aztec / Polynesian / Mongol / etc.). Use fantasy-canon analogues only.\n\n⚠️ EXPLICIT MUST-INCLUDE — the pool needs DEEP elf coverage AND broad other-race coverage. Cover at minimum these races (mix across the pool):\n\n  **ELVES (DEEP COVERAGE — at least 12 elf entries across the pool):**\n    • High elf (D&D / WoW Alliance high elf)\n    • Drow / dark elf\n    • Wood elf / Sylvan elf\n    • Blood elf (Sin\'dorei, fel-green eyes)\n    • Night elf (Kaldorei, purple-skinned, glowing silver eyes)\n    • Sun elf (gold-skinned variant)\n    • Moon elf (pale silver-blue)\n    • Half-elf\n    • Sindar elf (LOTR — grey-elves)\n    • Noldor elf (LOTR — high-kindred)\n    • Galadhrim / Lothlórien wood-elf\n    • Aen Seidhe (Witcher elder-race)\n    • Snow elf (Skyrim Falmer-coded but proud)\n    • Sea elf / aquatic elf\n    • Eladrin (feywild elves — seasonal variants)\n    • Dunmer (Elder Scrolls dark elf — ash-coast)\n    • Bosmer (Elder Scrolls wood elf)\n    • Altmer (Elder Scrolls high elf)\n    • Drider (drow-spider half-cross, rare)\n    • Shadar-kai (dark-fey elves)\n\n  **DWARVES (deep coverage):**\n    • Mountain dwarf (heavily-braided beard)\n    • Hill dwarf (forked beard with iron-rings)\n    • Mahakaman dwarf (Witcher)\n    • Khazâd dwarf (LOTR craftsmanship)\n    • Duergar (Underdark — sparse beard)\n    • Stout (D&D shorter variant)\n    • Frost dwarf / Frostborn\n    • Goldgather dwarf (treasure-coded)\n\n  **HUMANS (deep coverage — fantasy-canon, NOT real-world):**\n    • Rohirrim rider\n    • Gondorian tower-guard\n    • Dúnedain ranger\n    • Númenórean noble\n    • Skyrim Nord\n    • Stormcloak (Skyrim Eastmarch)\n    • Imperial (Cyrodiil)\n    • Breton (Skyrim spellsword-heritage)\n    • Redguard (Hammerfell — sword-singer)\n    • Witcher-mutated human (Aedirn / Temeria / Nilfgaardian school-of-wolf)\n    • Haradrim Southron\n    • Easterling / Easterling rider\n    • Free-Folk wildling (GoT — Beyond-the-Wall)\n    • Northerner (GoT — House Stark)\n    • Dornish (GoT — Dorne sand-sun)\n    • Ironborn (GoT — Iron Islands)\n    • Cormyrean (FR)\n    • Calishite (FR — gentle real-world coding, fantasy-tightened)\n    • Thayan (FR — dark wizard culture)\n    • Mahakam human (Witcher mountains)\n\n  **GREENSKIN / HALF-MONSTER (deep coverage):**\n    • Half-orc (D&D)\n    • Full orc (D&D classic)\n    • WoW Horde orc (Blackrock / Frostwolf / Warsong clans)\n    • Witcher orc (Northern Realms)\n    • Hobgoblin (D&D — disciplined goblinoid)\n    • Bugbear (D&D — large hairy goblinoid)\n    • Goblin (D&D — small cunning)\n    • Half-goblin / Half-ogre\n    • Mag\'har orc (WoW — uncorrupted brown orc)\n\n  **TIEFLINGS (variety):**\n    • Asmodeus tiefling (classic red, ram horns)\n    • Zariel tiefling (bronze, jagged short horns)\n    • Mephistopheles tiefling (pale grey-blue, black-iron horns)\n    • Levistus tiefling (icy blue, frost-rimed)\n    • Glasya tiefling (lithe, ruby-red)\n    • Mammon tiefling (golden, greed-coded)\n\n  **DRAGONBORN VARIANTS (chromatic + metallic):**\n    • Red dragonborn (fire-breath)\n    • Blue dragonborn (lightning)\n    • Green dragonborn (poison)\n    • Black dragonborn (acid)\n    • White dragonborn (frost)\n    • Bronze dragonborn (metallic — lawful)\n    • Silver dragonborn (metallic)\n    • Gold dragonborn (metallic — noble)\n\n  **AASIMAR / GENASI:**\n    • Protector aasimar (celestial-pale, golden glow)\n    • Scourge aasimar (warm-bronzed, war-light)\n    • Fallen aasimar (ash-grey, dark wings)\n    • Fire genasi (red-skinned, ember-eyed)\n    • Water genasi (teal-blue, fin-traits)\n    • Earth genasi (stone-skinned, gem-eyed)\n    • Air genasi (pale blue, wind-marked)\n\n  **EXOTIC / OTHER FANTASY:**\n    • Tabaxi (cat-folk)\n    • Aarakocra (bird-folk)\n    • Kenku (raven-folk)\n    • Lizardfolk\n    • Argonian (Elder Scrolls reptile)\n    • Khajiit (Elder Scrolls cat-folk)\n    • Goliath (giant-kin)\n    • Firbolg (gentle giant fey)\n    • Tortle (turtle-folk)\n    • Centaur\n    • Minotaur (D&D)\n    • Loxodon (elephant-folk)\n    • Triton (sea-folk)\n    • Yuan-ti pureblood (serpent-folk)\n    • Shifter (lycanthrope-touched)\n    • Tabaxi spotted cat-folk\n\n  **TROLLS / GIANTS (rare entries):**\n    • Zandalari troll (WoW — tall, golden-eyed, tusked)\n    • Darkspear troll (WoW — purple-blue)\n    • Frost troll\n    • Forest troll\n    • Hill giant (D&D — smaller giant)\n    • Stone giant\n\n  **WoW-specific (badass):**\n    • Death Knight (any race, undead variant — pale skin, glowing blue eyes)\n    • Demon Hunter (elf — blindfolded, scarred eyes, fel-touched)\n    • Worgen (Gilnean wolfman)\n    • Vrykul (giant Nordic warrior)\n\nMix these across the pool. EVERY entry conveys the badass/weathered/dangerous tone.`,
    touchpoints: [
      'High elf: sharply pointed ears, almond-shaped luminous gold eyes, alabaster skin, regal aristocratic features, beardless, graceful noble bearing',
      'Drow: obsidian-grey skin, white-silver platinum hair, glowing violet eyes, sharp angular Underdark features, beardless, deadly elegant poise',
      'Mountain dwarf: heavily-braided beard with iron clan-rings, ruddy weather-beaten skin, deep-set steely eyes, broad powerful build, forge-hardened presence',
      'Hill dwarf: massive forked beard with iron rings, leather-tanned skin, fierce dark eyes, Tolkien battle-hardened build, mountain-forged endurance',
      'Mahakaman dwarf: coarse-tan weathered skin, thick beard with worked-iron clasps, dark fierce eyes, gruff industrious Witcher-world bearing',
      'Duergar: ash-pale Underdark skin, thin sparse beard, dim glowing grey eyes, gaunt sun-deprived features, grim dwarven endurance',
      'Half-orc: muted green-grey skin, pronounced lower tusks, heavy brow, broad scarred jaw, scruff-beard, powerful smaller-than-full-orc build',
      'WoW Horde orc: vivid green skin, large lower tusks, heavy brow ridge, fierce battle-painted features, broad-shouldered powerful build, dark warrior topknot',
      'Asmodeus tiefling: crimson skin, curving ram horns, slit-pupil red eyes, prehensile tail, infernal-blooded sharp human features, dark goatee',
      'Dragonborn warrior: bronze-scaled face, draconic snout, slit-pupil amber eyes, horn-crest along the skull, no beard (scaled chin)',
      'Wood elf: sharply pointed ears, almond-shaped forest-green eyes, sun-kissed olive skin, beardless, lithe woodland features, alert grace',
      'Witcher orc: grey-green skin, sharp underbite tusks, scarified tribal face, heavy iron piercings, scruff beard, Northern Realms savage bearing',
      'Halfling: oversized hairy bare feet, curly chestnut hair, warm round face, possible sideburns or short beard, easy-going Shire bearing',
      'Forest gnome: small stature with weathered olive skin, vivid green eyes, wild flyaway hair, possible neat little beard or clean-shaven, tinker\'s curiosity in his gaze',
      'Tabaxi: spotted fur-covered feline humanoid, cat-slit amber eyes, whiskers, feline predator features, jaguar-like prowling grace',
      'Aarakocra: bird-headed eagle humanoid, keen raptor eyes, feathered wings for arms, avian beak and talons, skyborne hunter bearing',
      'Rohirrim: sun-warmed Northern fair skin, blue-green eyes, golden-blond braided beard and warrior-tail, weathered horse-clan features, rider\'s proud stance',
      'Gondorian: Mediterranean-olive skin, dark hawkish eyes, dark hair, full-bearded sharply noble aquiline features, austere southern bearing, tower-guard discipline',
      'Dúnedain ranger: weather-tanned skin, sharp grey eyes, dark hair with grey at temples, full road-bearded weathered features, sworn-keeper bearing',
      'Númenórean: long-lived noble human, sharply chiseled features, grey-blue eyes, raven-dark hair and short trimmed beard, tall regal Dúnedain bearing',
      'Nord: fair Northern skin, ice-blue eyes, blond braided beard and warrior-mane, weathered Skyrim features, frost-hardened Viking bearing',
      'Breton: ivory-fair skin with magical undertone, hazel-green eyes, auburn hair and trim beard, faint magical-glow at temples, spellsword heritage',
      'Imperial: warm olive Cyrodiilic skin, brown eyes, dark wavy hair, soldierly aristocratic features with mustache or stubble, disciplined legionnaire bearing',
      'Redguard: deep umber dark skin, dark almond eyes, close-cropped or twist-braided hair, neat beard or clean-shaven, Hammerfell desert-warrior bearing',
      'Blood-elf: pale ivory skin, glowing fel-green eyes, sharply tapered long ears, beardless or thin trimmed goatee, magic-fed elegant gaunt features, Sin\'dorei pride',
      'Night-elf: purple-tinted moon-pale skin, glowing silver eyes, exceptionally long ears, druidic facial tattoos, beardless, Kaldorei moonlight grace',
      'Dunmer: ash-grey skin, blood-red eyes, sharply pointed ears, beardless or thin chin-tuft, eastern-volcanic sharp features, ash-warrior bearing from Morrowind',
      'Zandalari troll: tall lanky tusked humanoid, walnut-brown skin, jutting upward tusks, glowing yellow-amber eyes, voodoo-painted tribal features, dark warrior-braids',
      'Stormcloak: pale Skyrim-Northern skin, ice-blue eyes, weathered face, thick blond or red beard with braid-clasps, ursine build, Eastmarch warrior bearing',
      'Free-Folk wildling: weather-cracked face, ice-blue or pale-grey eyes, wild matted hair, full unkempt beard, broad survivor\'s build, Beyond-the-Wall hardiness',
    ],
    instructions: `Each entry is ONE fantasy race descriptor for a male adventurer, 12-25 words. Format: "[Race-name]: [signature anatomy] + [skin] + [eye-type] + [beard/face-feature note: beardless / full-beard / scaled / horned] + [bearing]". STRICT WESTERN HIGH FANTASY ONLY — no real-world ethnic codes. Cover elves / dwarves / halflings / gnomes / tieflings / dragonborn / half-orcs / aasimar / genasi / humans (LOTR + Elder Scrolls + GoT + Witcher races) / Eladrin / tabaxi / aarakocra. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  male_adventurer_class: {
    format: 'simple',
    theme: `Fantasy class IDENTITY + BEARING for a male adventurer — D&D × LOTR × Witcher × WoW × Elder Scrolls tradition. The class is his ROLE and ENERGY only — NOT his gear (gear lives on a separate axis). Each entry 15-30 words. Format: "[CLASS-CAP] — bearing + iconic energy + signature trait of how he carries himself".\n\n⚠️ BADASS / FOREBODING / DANGEROUS TONE — CRITICAL ⚠️\nThe male characters should feel BADASS, FOREBODING, MYSTERIOUS, DANGEROUS, EXPERIENCED, WEATHERED. NOT pretty/soft/quaint/serene. Every bearing descriptor should convey at least one of:\n  • HARD-WON / BATTLE-TESTED / WEATHERED-BY-A-HUNDRED-FIGHTS\n  • EYES THAT HAVE SEEN TOO MUCH / FLAT-COLD / HAUNTED / DISTANT\n  • PRESENCE THAT MAKES PEOPLE STEP ASIDE / DANGEROUS-EVEN-AT-REST\n  • SCARRED / WEATHERED / GRIZZLED / VETERAN\n  • MYSTERIOUS / SOMETHING-HIDDEN-BENEATH / NOT-TO-BE-CROSSED\n  • BLEAK / GRIM / TAUT-WITH-CONTROLLED-INTENT\n  • SOMETHING IS WRONG ABOUT HIM (in the warlock / necromancer / hexblade cases)\n\nReplace soft tropes with hard ones:\n  • NOT "moves with grace" → "moves with the economy of someone who's killed quietly before"\n  • NOT "carries serene authority" → "carries the dead-calm of someone whose voice is the last warning"\n  • NOT "stands with conviction" → "stands like a man who has buried his own brothers and kept walking"\n  • NOT "exudes charm" → "smiles like someone who knows where every blade in the room is"\n  • NOT "spine straight with noble obligation" → "spine straight from a lifetime of bearing weight others would not"\n\nABSOLUTE BANS:\n• NO specific weapons named (accessory axis)\n• NO specific outfit pieces named (outfit axis)\n• NO race-anatomy (race axis)\n• NO shirtless / bare-chested / cheesecake language\n• NO "smoldering" / "brooding heart-throb" romance-stock language — DANGEROUS not SEXY\n\nMANDATORY in every entry:\n• A CLASS NOUN\n• A BEARING DESCRIPTOR conveying the badass / dangerous tone\n• A SIGNATURE class-energy detail\n\n⚠️ ROSTER VARIETY IS CRITICAL — the pool MUST cover the full Western high-fantasy class roster. Distribute roughly:\n\n  **MARTIAL** (~30%): WARRIOR / KNIGHT / PALADIN / TEMPLAR / CRUSADER / CHAMPION / BARBARIAN / BERSERKER / KNIGHT-ERRANT / BLACKGUARD / WAR-PRIEST / CAVALIER\n  **STEALTH / SHADOW** (~15%): ROGUE / ASSASSIN / NIGHTBLADE / SHADOWMANCER / SHADOW PRIEST / HEXBLADE\n  **RANGED / WILDERNESS** (~15%): RANGER / HUNTER / WARDEN / SCOUT / BLADEDANCER / TRACKER\n  **ARCANE** (~20%): WIZARD / MAGE / SORCERER / ARCANIST / RUNECASTER / BATTLEMAGE / BLOODMAGE / ELEMENTALIST / CONJURER / SUMMONER\n  **OCCULT / DARK** (~10%): WARLOCK / NECROMANCER / HEXBLADE / DEATHKNIGHT / SOULBINDER / DEMONOLOGIST\n  **DIVINE / SPIRIT** (~10%): CLERIC / DRUID / MONK / SHAMAN / BARD / ORACLE / MYSTIC / SAGE / INQUISITOR / ARTIFICER\n\nThe pool must read as a FULL D&D-style party roster, not a robe-heavy mage subset. NO duplicate class entries — each class appears at most twice (with different bearing).\n\nWORLD CANON FLAVOR allowed: Witcher (school-of-wolf monster-hunter) / Skyrim (Companion / Nightingale / Imperial Legate) / WoW (Death Knight / Demon Hunter / Vindicator) / Elden Ring (Carian Knight / Sorcerer of the Academy) / D&D (Drow Blade-Singer / Dragonborn Champion) — as long as STRICTLY high fantasy.`,
    touchpoints: [
      'ROGUE — light-footed and quick-handed, watchful eyes that read every door and lock the way others read faces, never the loudest voice in the room',
      'RANGER — wilderness-honed and slow to speak, fast to draw; he reads weather, tracks, and threat-distance before others notice the air has changed',
      'SORCERER — innate magic crackles at his fingertips uninvited, eyes hold a faint storm-light even at rest, raw power barely banked behind his composure',
      'WARLOCK — pact-bound to a distant patron, a faint sigil glows on his sternum or palm, sometimes his gaze briefly belongs to something not him',
      'WIZARD — disciplined arcane scholar, every gesture deliberate, the air around his hands occasionally bending with stored cantrip-charge',
      'PALADIN — quiet unwavering authority, the steadiness of someone who has sworn a vow he will keep, a faint inner glow others cannot see',
      'WARRIOR — straight-backed and battle-tested, scars across his knuckles, the alert stillness of someone who has survived more than most',
      'MONK — economy of motion, perfect balance, his breath the only sound in a room at rest, the calm before kinetic explosion',
      'DRUID — moss-quiet calm of someone who speaks more to trees than people, animal-silent in the underbrush, eyes flecked with bark or leaf-green',
      'BARD — quick smile and quicker tongue, the practiced confidence of someone who has talked his way out of more trouble than he has fought through',
      'CLERIC — solemn devotion in his bearing, faint divine light reflected in his irises in dim places, hands that have closed both wounds and eyes',
      'BARBARIAN — sheer brute presence with controlled fury banked just below the surface, ritual scars or tribal markings, the heavy stillness of weather about to break',
      'ARTIFICER — fingertips stained with reagent-ink, tinkerer\'s pouches at his hip, eyes that catch and measure every mechanical detail in a room',
      'NECROMANCER — pale calm of someone who has shaken hands with death, faint sigil-tattoos along his forearms, a voice that whispers more than speaks',
      'SHAMAN — feather-and-bone fetishes braided into his clothes and beard, eyes that go elsewhere mid-conversation listening to ancestor-spirits',
      'KNIGHT-ERRANT — square-shouldered honor-bound traveler, sworn-promise gravity in his speech, the patience of a long road walked alone',
      'ARCANIST — research-pale and ink-stained, books and scroll-cases at his hip, the faintly distracted look of someone solving an equation while you talk',
      'BLACKGUARD — sworn-fallen knight with the same gravity as a paladin but tilted toward dread, faint sigil-mark hidden under his collar',
      'INQUISITOR — observes with piercing scrutiny that peels away deception, posture inflexible with doctrinal certainty, presence demanding confession',
      'ELEMENTALIST — surrounded by faint manifestations of primal forces, posture shifting like flame or water, eyes reflecting whichever element holds sway',
    ],
    instructions: `Each entry is ONE class identity + bearing for a male adventurer, 15-30 words. Format: "CLASS-CAP — bearing + class-energy + signature trait". NO specific weapons. NO specific outfit pieces. NO race anatomy. NO shirtless / cheesecake language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  male_adventurer_skin: {
    format: 'simple',
    theme: `SKIN DESCRIPTIONS for a male adventurer — weathered, lived-in, road-tested. Each entry 15-25 words. Format: "[skin tone with light-interaction detail + textural truth: scars / weathering / beard-shadow / stubble / sun-burn / tattoos]".\n\n⚠️ FACE-FOCUSED ONLY — describe his face / cheekbones / forehead / jaw / temples / brow. NEVER describe his TORSO / CHEST / SHOULDERS / NECK / ARMS / MUSCULAR-BODY. The skin pool reads only his visible face (chest/shoulders are covered by outfit).\n\n🚫 ABSOLUTE BANS — these trigger Flux to render bare-chested/shirtless:\n• NO "gleaming like polished [X]" / "polished stone" / "polished basalt" — these read as bare-chest gleam\n• NO "sweat-gleaming" / "sweat-glistening" / "sheen of sweat"\n• NO "oiled" / "sculpted" / "chiseled" / "muscular neck" / "broad shoulders"\n• NO "war-paint across chest" / "ritual scars across torso/back" — keep scars on FACE only\n• NO "rope-burn wrapping muscular neck"\n• NO "hide" as a synonym for skin (race entries use "hide" for orc scales, but skin entries should say "skin" only)\n\nMandatory: every entry reads MALE — beard-shadow / stubble / road-roughened FACE / scar-tracked FACE / weathered crow's-feet / sunburn at the nose-bridge / weather-cracked cheekbones. Skin tones span every fantasy palette from alabaster to obsidian, but the surface texture details stay on the FACE.\n\nNo cheesecake. No "smooth" / "soft" / "milky" language.`,
    touchpoints: [
      'Pale Northern complexion catching torchlight warm at the cheekbones, faint crow\'s-feet at the temple corners, three-day stubble shadow',
      'Milk-white Highland skin sun-burned across the nose-bridge, firelight pooling gold in the hollow of the throat, neat trimmed beard',
      'Alabaster pale that flushes pink at the collarbone with exertion, moonlight casting blue shadows along the jawline, dark beard-shadow at the chin',
      'Weather-tanned brown leather-like skin with deep crow\'s-feet at the eyes, scarred cheekbone from an old blade-strike, road-stubble',
      'Sun-darkened Mediterranean olive with road-dust caked at the temples, an old scar across the bridge of the nose, full road-beard',
      'Deep umber Hammerfell-Redguard skin, smooth at the cheekbones but with scars across one brow, neat-trimmed black beard',
      'Pale ash-grey Dunmer complexion with darker ash-streaks at the temples, faint volcanic-vein patterns under the cheekbones, beardless and gaunt',
      'Obsidian-grey Drow skin catching cool moonlight at the planes of the face, beardless and elegant, faint silvery clan-tattoos at the temple',
      'Olive-warm Cyrodiilic skin with a soldier\'s sun-creases, an ear half-notched from an old fight, brushed-back mustache',
      'Dark cocoa skin with deep texture and scars from caravan-road life, full thick beard going slightly grey at the chin, hawkish features',
      'Verdant green orcish skin with prominent jaw-scars from tusks growing through, broad-shouldered build implied by the neck-thickness',
      'Bronze-scaled dragonborn skin with iridescent shifts between bronze and obsidian, the scales rough textured along the brow-ridge',
      'Storm-grey skin with mahogany ash at the temples, beardless, dark veins faintly visible at the throat in cold air',
      'Crimson tiefling skin with faint infernal vein-patterns at the brow, a goatee around the chin, slit-pupils reflecting fire',
      'Pale tundra-blanched skin with frost-cracked cheeks, full red Stormcloak beard with braid-clasps, ice-blue eye-shadow from cold',
      'Olive-warm Witcher-coded skin with the pale silver-grey of mutation-tinge at the temples, beardless and sharp-featured, white scar across one cheek',
      'Sun-warmed Northern fair skin with rider\'s tan, golden-blond braided beard, blue-green eyes with weather-creases',
      'Indian-subcontinent warmth tinged ochre by lantern-glow, dark almond eyes, neat black beard and short-cropped hair',
      'Polynesian-coded Free-Folk tan with wind-cracked cheeks and full untrimmed beard, pale-grey eyes survey-narrowed',
      'Walnut-brown Zandalari-troll skin with darker brow-ridges, jutting tusks, dark warrior-braids in the side-shaved hair',
    ],
    instructions: `Each entry is ONE male-adventurer skin description, 15-25 words. Format: "[tone + light interaction + texture + male-feature: beard / stubble / scar / sunburn]". STRICT WESTERN HIGH FANTASY — no real-world ethnic codes (replace Polynesian/Indian-subcontinent above with fantasy analogues if regenerating: Free-Folk, Calishite, Mahakaman etc.). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  male_adventurer_eyes: {
    format: 'simple',
    theme: `EYE DESCRIPTIONS for a male adventurer — color + intensity + how they catch light + a weathering / character detail. Each entry 15-25 words. Format: "[eye color] catching [light source] to [secondary color], with [scar / crow's-feet / squint-lines / battle-narrowed expression / weather-creased detail]".\n\nNo cheesecake. No "smoldering" / "bedroom eyes" / "piercing gaze" stock-romance language. WEATHERED, ALERT, CAPABLE — that's the register.`,
    touchpoints: [
      'Deep amber eyes catching torchlight to liquid gold, with copper rings tightening around the pupil, crow\'s-feet at the corners from years of wind',
      'Forest-green so vivid they seem lit from within, darkening to hunter-emerald when battle-focus sharpens, fine scar-line through one eyebrow',
      'Northern ice-blue burning cold under torchlight, ringed with frost-silver that intensifies when he\'s hunting, weather-narrowed at the corners',
      'Storm-grey eyes with darker rims, catching cloud-light to slate-blue, alert and squint-lined from years of sun and snow',
      'Whiskey-amber eyes with tiger-eye bands reflecting firelight, half-closed in concentration, an old scar splitting the left brow',
      'Brass-gold eyes igniting molten-copper in lantern-light, fierce and unblinking, slight gunmetal undertone in cold weather',
      'Dark hazel eyes with chocolate-brown depths, lit copper by sundered-gold sidelight, weather-creased and watchful',
      'Glowing violet Drow eyes burning cold against obsidian skin, slit-narrowed in shadow, intelligent and predatory',
      'Slate-grey eyes flecked with iron, hunter-narrowed in falling snow, crow\'s-feet from decades on the road',
      'Pale fel-green Blood-elf eyes glowing faintly with arcane hunger, sunken into gaunt fey-features, scholar-keen',
      'Glacier-pale grey eyes with darker rims, flushed scarlet at the lower lid from cold and exhaustion, full of hard-won wisdom',
      'Slit-pupiled amber dragonborn eyes set into scaled face, predatory and unblinking, gold leaf radiating from the iris',
      'Russet-brown eyes with copper outer rim, focused downward in concentration, an old burn-scar across one cheekbone',
      'Sable-brown eyes with molten-copper cores, scanning the deep distance with rider\'s vigilance, weather-tightened',
      'Glowing silver night-elf eyes burning like starlight through dawn-mist, druidic tattoos framing the cheekbones',
      'Dim glowing grey Duergar eyes, gaunt and sun-deprived, lit briefly red by his own lantern in the Underdark',
      'Burnt sienna eyes with amber veins radiating from the pupils, weather-creased and bandit-wary, scar across the brow',
      'Crimson tiefling eyes with vertical slit-pupils, lit infernal-orange by torchlight, intelligent and predatory',
      'Pale ice-blue Stormcloak eyes set in a weathered face, frost-rimmed lashes, lantern-light catching their pale-grey depths',
      'Hawk-yellow eyes with copper outer rim, unblinking in flight, predator-keen and unforgiving',
    ],
    instructions: `Each entry is ONE male-adventurer eye description, 15-25 words. Format: "[color + light interaction + secondary color + character detail: scar / crow's-feet / weather-narrowed / squint-lined]". No cheesecake / romance-stock language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  male_adventurer_hair_color: {
    format: 'simple',
    theme: `HAIR COLOR DESCRIPTIONS for a male adventurer — applies to both head hair and beard (where present). Each entry 12-25 words. Format: "[color] with [secondary tone or interaction with light] + [weathering / grey-streaks / sun-bleach / road-grime detail]".\n\nNo cheesecake / shampoo-commercial language. WEATHERED, LIVED-IN, ROAD-DUSTED hair.`,
    touchpoints: [
      'coal-black with a dragon-fire copper sheen catching at the edges, grey just beginning at the temples',
      'chestnut-brown going deep copper under the forge\'s hungry firelight, road-dust caked at the roots',
      'fiery auburn that looks perpetually lit by dragon-flame from within, beard the same auburn shade',
      'iron-grey at the temples blending to coal-black through the body, hard-won veteran\'s palette',
      'warm chestnut with burnished copper along fire-touched strands, beard going slightly darker than the head hair',
      'jet-black with indigo depths braided into a warrior-tail, the beard the same dark shade',
      'platinum-blond Northern hair, sun-bleached at the tips, beard a shade darker than the head hair',
      'Stormcloak-red hair shot through with golden filaments, full red beard with braid-clasps',
      'wolf-grey hair, salt-and-pepper from a hard life, full grey beard close-cropped',
      'midnight-black hair with electric-blue undertones in moonlight, beardless or stubble only',
      'sun-bleached blond Rohirric hair tied back in a warrior-mane, golden-blond braided beard',
      'iron-and-charcoal hair shot through with the white of a near-death encounter, dark beard',
      'rust-and-iron-orange hair, weather-cracked and road-dusty, neat trimmed coppery beard',
      'pale silver-white elven hair catching every ambient gleam, beardless',
      'walnut-brown hair with darker undertones, full road-beard going grey at the chin',
      'storm-cloud-grey hair with darker strands beneath, beard the same banded grey-and-coal',
      'forest-green-tinted black hair (Sindar Elf), beardless and elegant',
      'fire-red hair sun-stripped to gold at the very tips, scruff-beard the same red',
      'jet-black hair with a single white streak from a magical accident, dark trimmed beard',
      'amber-gold hair like wheat at harvest, full Norse beard with bronze-clasp braids',
    ],
    instructions: `Each entry is ONE male-adventurer hair color description, 12-25 words. Applies to head hair AND beard (where present). Format: "[color] with [secondary tone or light interaction] + [weathering detail]". No shampoo-commercial language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  male_adventurer_hairstyle: {
    format: 'simple',
    theme: `PRACTICAL ADVENTURING HAIRSTYLES for a male adventurer — head hair AND/OR beard styles (some entries describe just the head, some just the beard, some both). The kind of hair-management someone does on the road. Each entry 10-25 words.\n\nMANDATORY: every style is FUNCTIONAL for travel/combat. NO salon styling. NO product-shiny. NO loose flowing waves draped over one shoulder.\n\nVARIETY MANDATE — distribute across these styles:\n  • HEAD HAIR: warrior topknot / single warrior-tail down the spine / undercut with long top / shaved sides with mohawk / cropped short / tied back in a low knot / wild and unkempt / long braided / single warrior-braid / dreadlocked / shoulder-length and tousled / partially-shaved with battle-runes inked into scalp\n  • BEARDS: full untrimmed beard / neat trimmed beard / forked dwarven beard with iron clasps / Norse braided beard with bone-rings / horseshoe mustache only / goatee / mutton-chops / clean-shaven with strong jaw / three-day stubble / pencil-thin beard along the jawline / beardless (for elves / dragonborn / draconic)\n  • BOTH: warrior topknot WITH braided beard / undercut WITH full red beard / shaved head WITH long beard / etc.`,
    touchpoints: [
      'long warrior-braid down his spine, full untrimmed road-beard',
      'shaved sides with a long top-knot, neat black goatee around the chin',
      'short cropped head hair, three-day stubble, scarred jaw',
      'wild unkempt long hair, full untrimmed beard, weathered from months on the road',
      'undercut with the long top tied back into a tight knot, full red Norse beard with bone-clasps',
      'wolf-grey single warrior-tail, full grey beard close-cropped',
      'Mohawk shaved-sides with the center spiked, horseshoe mustache only',
      'long braided side-tails framing his face, clan-tattoos visible on the temples, no beard',
      'shaved head with battle-runes inked into the scalp, full forked beard with iron-rings',
      'dreadlocked with bone-clasps and bound at the tail, shaman beard adorned with feather-trinkets',
      'low utility-knot at the nape, neat trimmed dark beard, weathered ranger\'s face',
      'shoulder-length and tousled from the road, light stubble, alert ranger\'s posture',
      'hooded so only the front edge of his hair shows under the cowl, full beard partly visible',
      'Sindar-elf long pale hair bound in twin temple-braids, beardless and elegant',
      'Mahakaman dwarven warrior-topknot with a full forked beard, iron clasps in both',
      'partially-shaved head with battle-scars showing through the buzz, neat goatee around the chin',
      'long single rope-braid wound around the head and pinned, beardless Elven elegance',
      'side-shaved with the long side falling forward over one eye, neat trimmed beard',
      'cropped to a Brutus-cut, clean-shaven jaw with one knife-scar along it',
      'rider\'s warrior-tail with leather thong, full Norse beard with golden-blond braid-clasps',
    ],
    instructions: `Each entry is ONE practical male-adventurer hairstyle — head hair and/or beard. 10-25 words. NEVER salon-styled. NEVER product-shiny. Beards encouraged for races where canon-appropriate but include some beardless options (elves, dragonborn, draconic). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  male_adventurer_outfit: {
    format: 'simple',
    theme: `SLEEK ADVENTURING GEAR for a male adventurer in **STRICTLY HIGH-FANTASY tradition** — LOTR / GoT / Skyrim / Witcher / Warcraft / D&D Forgotten Realms. Practical, agile, functional, road-tested. Each entry 20-50 words.\n\n🚫 STRICT WESTERN HIGH FANTASY — NO real-world ethnic codes (no Bedouin / Persian / samurai / Aztec / Polynesian / Mongol / Egyptian / Byzantine). Use fantasy-canon analogues: Dornish / Hammerfell-Redguard / Haradrim / Chultan / Stranglethorn / Cormyrean / Quel\'Thalas / Carian / Leyndell / Stormwind / Cyrodiil / Skellige / Stormcloak / Free-Folk / Forodwaith / Ironforge.\n\n⚠️ CLIMATE DISTRIBUTION:\n  A. **WARM-CLIMATE / LIGHT** (~35%): Dornish / Hammerfell-Redguard / Haradrim / Chultan / Stranglethorn / Anauroch / Sothoryos / Calishite — light fitted single-layer tunic, sleeveless gambeson with bracered forearms, sun-cloak, lightweight scale over breathable layer\n  B. **TEMPERATE / MID** (~35%): Rohirrim / Gondorian / Dúnedain / Cyrodiil-Imperial / Witcher / Eriador-ranger / Bretons / Quel\'Thalas — fitted ranger leathers / paladin half-plate / mage robes / cuirass over thin gambeson\n  C. **COLD / LAYERED** (~30%, NOT MORE): Skellige / Stormcloak / Free-Folk / Forodwaith / Ironforge — bearskin / hide-and-fur / Witcher long-coat / arctic shaman\n\n⚠️ SILHOUETTE VARIETY — distribute across robes/mage-cassock / cuirass-focus / single-layer fitted / hooded coat / wrapped cloth / full plate. NOT all "long coat over trousers".\n\n⚠️ NSFW-CLEAN — NO shirtless barbarian / bare-chested / oiled-pecs / male-cheesecake / strategically-torn / "rugged hero pose" language. He is functionally COVERED.\n\n🚫 EXPLICIT BANS (these trigger Flux's shirtless-warrior default):\n• NO "sleeveless" anything. Use "rolled-up sleeves" / "short-sleeved tunic with bracers covering forearms" / "fitted half-sleeve with vambraces" instead.\n• NO "shorts" / "loincloth" / "kilt" alone. Use "fitted breeches" / "knee-length leg-wraps" / "trousers tucked into boots".\n• NO "bare arms" / "bare shoulders" / "open vest revealing chest"\n• NO "minimal coverage" / "warrior fur-and-bone" without explicit chest-covering language\n• Every entry MUST have a CHEST-COVERING item explicitly named: tunic / cuirass / breastplate / gambeson / scale-armor / robe / coat / surcoat / mail hauberk / brigandine / chest-plate / chest-piece. Beards visible. Forearms covered by bracers / vambraces / sleeves.\n\nSTRUCTURAL VARIETY in entry shape — mix silhouette-led / material-led / single-piece-focus / lived-in-detail / color-palette-led / what-he-is-NOT-wearing. DO NOT use a rigid "[CULTURE] — [garments]" headline format.`,
    touchpoints: [
      // WARM
      'A Dornish scout in a sleeveless saffron-and-copper leather jerkin, fitted linen breeches, low travel boots, sun-cloak at the shoulder — built for the desert sun',
      'A Hammerfell-Redguard sword-singer in a fitted teal long-tunic with gold-thread embroidery at the collar, dark trousers, soft leather boots, a wide sash at the waist',
      'A Chultan jungle ranger in a fitted dark-green sleeveless leather vest over a thin linen shirt, knee-length breeches, calf-wrapped boots, feather-and-cord bracers',
      'A Stranglethorn explorer in light fitted hide gear, bare forearms, dark short cloak knotted at one shoulder, broad belt with multiple pouches',
      'A sleeveless quilted cream gambeson with red embroidery at the seams, exposing tattooed forearms (clan-ink), light trousers, low boots — Southron warm-climate kit',
      'A Calishite wizard\'s flowing cream robe with fitted bodice and skirt-to-mid-calf, gold-thread sigils at the hem, sandals — robe, NOT coat',
      'Haradrim rider\'s sleeveless dark-red leather vest over a thin linen tunic, loose-fit trousers, simple riding boots — a Southron in summer',
      // TEMPERATE
      'Fitted forest-green Sindar woodland gear — leather scout-jerkin over a brown linen under-tunic, breeches, leaf-patterned bracers, low travel boots, NO long cloak',
      'A Gondorian paladin\'s half-plate articulated from gorget to shin-guards, silver-tree surcoat over the chest, dust-stained from the road — dressy, not bundled',
      'A fitted Witcher-school under-coat in dark grey leather, gambeson beneath, riding gloves, mid-calf boots — Northern Realms kit but cut SHORT',
      'A Quel\'Thalas blood-elf paladin in burnished red-and-gold breastplate over a fitted cream under-coat, knee-skirt of leather strips, light bracers',
      'No armor — just a fitted dark wool tunic, breeches, soft boots, a heavy spellbook on a baldric across his chest — a Cormyrean court-mage on the road',
      'A flowing midnight-teal Carian wizard\'s robe with fitted bodice and skirt-to-mid-calf, silver-thread runes at the hem, a moon-glass focus on a long chain',
      'A Drow scout coat in matte-black leather to the HIP ONLY (not long), deep hood, dark trousers, soft climbing boots — fitted, glare-suppressed Underdark gear',
      'Cropped Rohirric riding jacket and breeches in russet wool, knee-high boots, a single bronze horse-motif pauldron — NO long coat NO cloak',
      'A fitted Mahakaman dwarven scale corset in verdigris-bronze over a thin under-coat, plain breeches, sturdy boots — the scale is the centerpiece',
      'A Breton spellsword in a fitted dark blue doublet with brass buckles, light mail beneath, riding trousers, low boots, hawthorn focus-rod at the belt',
      // COLD
      'A Nord warrior in a heavy bearskin half-cloak over a dark wool tunic and breeches, painted clan-marks on his cheekbones, leather wrist-wraps',
      'A pewter mail hauberk falling to mid-thigh, leather belt at the waist, plain wool trousers, sturdy boots — Dúnedain warden\'s practical loadout',
      'A long forest-green Ranger-cloak to the ankle, beneath it a simple brown tunic and breeches, weathered boots — Eriador winter gear',
      'A Free-Folk wildling layered against the Wall — heavy hide-and-fur overcloak, hardened leather chest-piece beneath, bone-clasped at the throat',
      'A patched dark leather Witcher coat with mismatched horn buttons, elbows re-hided in darker leather, the original color long faded',
      'A Forodwaith arctic mantle of bear-fur over layered linen, bone-fetish belt, fur-topped boots, breath visible — high-tundra cold gear',
      'A Stormcloak heavy gambeson in dark blue and bronze, mail underneath, fur-trimmed collar, Skyrim winter trousers — Eastmarch winter kit',
      // Some additional silhouettes
      'A Stormwind cavalry officer\'s cobalt tabard over polished steel breastplate, white wool trousers, black riding boots to mid-calf, lion-crest pauldron on left shoulder',
      'A Highgarden duelist\'s fitted forest-green silk doublet, leather trousers, knee-high boots, rapier on hip, no armor — speed not steel',
      'A monk\'s saffron-and-charcoal wrap-tunic with rope-belt, fitted under-leggings, hand-and-forearm wraps, sturdy bare-soled walking sandals',
      'A druidic ranger\'s brown-and-green layered hide cloak with antler-clasp at the throat, deep green linen tunic and breeches beneath, hand-bound vine-wrap bracers',
    ],
    instructions: `Each entry is ONE sleek male-adventurer outfit, 20-50 words. STRICTLY WESTERN HIGH FANTASY — NO real-world ethnic codes. NSFW-CLEAN — no shirtless / bare-chested / oiled / male-cheesecake. Functional + covered + road-tested. STRUCTURAL VARIETY — mix silhouette-led / material-led / single-piece-focus / lived-in-detail / color-palette-led / what-he-is-NOT-wearing. NO TWO entries share archetype/material/culture. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  male_adventurer_accessory: {
    format: 'simple',
    theme: `SIGNATURE CARRIED ITEM or WEAPON for a male adventurer — class-flavored, the kind of object he\'s known for. Each entry 15-30 words. Format: "[OBJECT-NAME] — [where carried] + [signature visual detail]".\n\nVARIETY across:\n• WEAPONS: longbow + arrow-quiver / recurve bow / longsword / scimitar / dual daggers / war-staff / quarterstaff / mace / morningstar / war-hammer / spear / glaive / halberd / crossbow / hand-crossbow / sling / throwing-axes / katana / sabre / poleaxe / falchion / great-sword\n• CASTER FOCI: gem-topped staff / orb-staff / focus-crystal pendant / leather-bound spellbook / scroll-case / spirit-totem fetish / holy symbol / sun-emblem amulet / moon-disc / pact-sigil ring / rune-stone bag\n• UTILITY: lockpick roll / climbing hooks / harvester\'s pouch / herbalist\'s satchel / cartographer\'s tube / hunter\'s horn / signal-mirror / lantern / smoking censer / shaman\'s drum / tinkerer\'s tool-belt\n• ICONIC: family signet ring / lineage banner-pole / clan-banner cloak-pin / oath-relic / familiar (raven on shoulder / hawk on glove / cat / wolf / spirit-companion) / heirloom locket\n\nNO weapons in active combat use. All sheathed, holstered, slung, or being carried.`,
    touchpoints: [
      'longbow slung across his back with arrow-quiver at his hip, fletching dyed in clan colors',
      'twin parrying daggers crossed in lower-back sheaths, hilts wrapped in dark leather',
      'gem-topped quarterstaff held in one hand, the focus-crystal catching ambient light',
      'leather-bound spellbook clipped at his belt with brass fittings, page-edges gilded',
      'great-sword strapped across his back, hilt visible over one shoulder, family crest on the pommel',
      'recurve bow carried in one hand with a leather wrist-guard on his draw-arm',
      'hooded raven familiar perched on his left shoulder, alert and silent',
      'pact-sigil ring on his index finger glowing faintly when his gaze flickers elsewhere',
      'shaman\'s hand-drum slung over one shoulder, painted with bone-rune patterns',
      'cartographer\'s tube on his belt with rolled maps poking from the open end',
      'pair of throwing-axes in cross-back harness, blades carbon-blacked to suppress glare',
      'iron-shod oak walking staff held in one hand, carved with weathered runes',
      'silver holy symbol on a chain at his throat, palm-sized, faintly luminous in dim light',
      'falconer\'s glove on his left hand with a hooded hawk standing alert on it',
      'leather lockpick roll tucked into his belt, picks held in place by oiled loops',
      'crossbow slung across his back with bolt-quiver clipped to his hip belt',
      'hand-crossbow holstered on each thigh, dark-stained wood with iron fittings',
      'glaive carried point-up in one hand, the polearm head wrapped in leather for travel',
      'paired shortswords in cross-back sheaths, both hilts wound in green-dyed cord',
      'herbalist\'s satchel at his hip overflowing with bundled herbs and tied root-bags',
      'iron-banded oak quarterstaff held in one hand, carved with weathered runes along its length',
      'lineage banner-pole strapped across his back, banner furled tight in oilcloth',
      'lantern hooked at his hip on a brass swivel-arm, the flame guttering as he moves',
      'silver moon-disc amulet on a fine chain, the disc engraved with a single crescent',
      'tinkerer\'s tool-belt at his waist with tiny brass instruments tucked into loops',
    ],
    instructions: `Each entry is ONE signature carried item for a male adventurer, 15-30 words. Format: "[OBJECT] — [where carried] + [visual detail]". Variety: martial weapon / caster focus / utility item / iconic personal. NEVER in active combat use. NO cheesecake language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  male_adventurer_action: {
    format: 'simple',
    theme: `STORY-RICH adventuring moments for a male adventurer in the wild — a candid mid-action beat from his travels. NOT mundane camp chores. NOT combat. Each moment is a chapter-opener — something is happening, someone is doing the thing they do. Each entry 25-45 words. Format: "ACTION-CAP — body position + specific prop or object + specific location detail + cinematic tension".\n\nABSOLUTE BANS:\n• NO combat / mid-strike / weapon-aimed-at-foe / enemy in frame / fallen body / wounded character / blood-fight\n• NO chores ("sharpening blade / polishing sword / lacing boots / drinking from waterskin / eating by campfire")\n• NO stock poses ("scanning horizon hand-to-brow / kneeling at shrine")\n• NO shirtless / posing-for-camera language\n\nMANDATORY in every entry:\n• A STORYTELLING HOOK\n• A SPECIFIC PROP / OBJECT\n• A SPECIFIC LOCATION beat\n• CINEMATIC TENSION\n\n⚠️ BODY-POSITION VARIETY IS CRITICAL — distribute across:\n  A. MOUNTED / WITH COMPANION ANIMAL (~20%) — atop his horse / leading mount / hawk launching / wolf alongside / raven on shoulder\n  B. DYNAMIC TRAVEL / IN MOTION (~20%) — mid-stride / striding / wading / running / vaulting / sliding\n  C. CLIMBING / VERTICAL (~10%) — mid-grip / pulling up / descending rope\n  D. STANDING / SURVEYING / READING THE WORLD (~15%) — drawing bowstring / casting from focus / sextant / pressing palm to tree\n  E. KNEELING / CROUCHING / WORKING (~20%) — tracking / brushing sigil / casting ward-circle / kindling fire — minority share\n  F. REACHING UP / LIFTING / STRAINING (~10%) — lifting beam / pulling crypt door / reliquary above water\n  G. SEATED / RESTING / CRAFTING (~5%) — fletching / writing in journal — minor share`,
    touchpoints: [
      // MOUNTED / WITH COMPANION
      'LEADING MOUNT ACROSS ROPE BRIDGE — one hand on the bridle, the other gripping the rope-rail, mid-span over a gorge with mist rolling beneath the planks',
      'ATOP A CRESTING HORSE — leaning forward in the saddle on a rising trail at golden hour, his cloak streaming back, a distant valley opening below',
      'HIS HAWK LAUNCHING FROM HIS GLOVE — arm extended sharp toward a rising horizon, raptor breaking forward into flight, jess-cord trailing for a heartbeat',
      'HIS WOLF PADDING ALONGSIDE — striding through a quiet forest at dusk, the wolf shoulder-high beside him keeping his exact pace, both alert',
      'PULLING REIN AT CROSSROADS — atop his dark mount in low evening light, gloved hand on the pommel, head tipped reading a weather-worn signpost',
      // DYNAMIC TRAVEL
      'STRIDING DOWN A FOREST PATH — bow held in his draw-hand but relaxed, mid-step over a fallen branch, dappled light cutting horizontal bands across his path',
      'WADING THIGH-DEEP THROUGH RAPIDS — staff planted hard against the current, his free hand braced low for balance, water white-foam breaking against his knees',
      'VAULTING A FALLEN LOG — mid-leap with one foot pushing off the trunk, the other already extended toward the trail beyond, pack-straps caught mid-bounce',
      'STRIDING ACROSS A WIND-WHIPPED MOOR — cloak streaming sideways in a horizontal gust, beard whipping, the path threading toward distant standing stones',
      // CLIMBING
      'CAUGHT MID-GRIP ON A CLIFF FACE — three meters above the trail, both hands and one boot on rough sandstone, the next handhold already chalked',
      'PULLING ONTO A LEDGE — both forearms over the lip, body straining as he heaves himself up, the long drop visible beneath him',
      // STANDING / SURVEYING
      'DRAWING THE BOWSTRING — feet planted shoulder-width, arrow-shaft brushing his cheek, eye on a distant target the viewer cannot quite see',
      'CASTING FROM FOCUS — standing tall with one arm half-extended, glowing crystal in his open palm, a glyph of light blooming above it',
      'STUDYING NIGHT SKY THROUGH SEXTANT — standing on a high outcrop, brass instrument raised to one eye, the Milky Way arching overhead',
      'PRESSING PALM TO TREE — pausing mid-stride against a great trunk, eyes shut, listening to something on the wind his companion has not yet heard',
      // KNEELING / WORKING
      'TRACKING THROUGH FERN — kneeling at a half-print in damp loam, fingertip brushing its edge, eyes already following the trail',
      'BRUSHING DUST FROM A SIGIL — kneeling at a half-buried stone slab, gloved fingertip clearing moss from a rune beginning to glow under his touch',
      'CASTING WARD-CIRCLE — kneeling in a chalk-drawn ring on flat stone, scattering bone-runes one by one, breath ghosting white in suddenly-cold air',
      // REACHING UP / LIFTING
      'LIFTING A COLLAPSED BEAM — both arms straining against a half-fallen rafter in a ruined hall, dust falling through a shaft of light',
      'LIFTING A RELIQUARY ABOVE FLOOD-WATER — waist-deep in a sunken temple, both hands raising a stone reliquary high above his head',
      'PULLING BACK A CRYPT DOOR — body angled into the effort, both palms flat against the stone slab, neck-veins straining as the door grinds open',
      // SEATED / CRAFTING
      'WRITING IN JOURNAL AT CAMP — seated cross-legged in firelight, leather book open on one knee, his mount grazing in the background',
      'FLETCHING ARROW AT REST — seated cross-legged on a flat rock, a half-fletched shaft braced between his knees, feather-vane held in steady fingers',
      // More variety
      'MOUNTING UP — one foot in the stirrup, mid-swing into the saddle, his cloak already lifting in the wind he\'s about to ride into',
      'MID-SLIDE DOWN SCREE — heels dug in, body angled back, dust and small stones cascading around his boots, the trail-end visible far below',
      'PALM TO ANCIENT MENHIR — kneeling beside the standing stone, hand pressed flat against weathered runes, head bowed in concentration',
      'CONSULTING MAP AT CROSSROADS — kneeling at a flat stone with vellum map spread out, one hand pinning a corner, signpost above',
      'KINDLING FIRE UNDER TARP — kneeling in the lee of a stretched oilcloth in steady rain, sparking flint over tinder, the first flame catching',
    ],
    instructions: `Each entry is ONE story-rich non-combat adventuring moment for a male adventurer, 25-45 words. Format: "ACTION-CAP — body position + specific prop + specific location + cinematic tension". NO combat. NO chores. NO stock poses. NO shirtless/cheesecake. BODY-POSITION VARIETY distributed across mounted/companion / dynamic-travel / climbing / standing-surveying / kneeling-working / reaching-lifting / seated-crafting. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  male_adventurer_landscape: {
    format: 'simple',
    theme: `STAGES in the wild where a male adventurer is mid-action — fantasy biomes, ruins, edge-of-civilization places. Each entry 15-50 words.\n\nSTRUCTURAL VARIETY — mix epic-vista / mid-scale / intimate-nook / ruin / weather-moment / threshold. DO NOT use rigid "[TITLE] — panorama" format.\n\nVARIETY: primeval forest / mist-veiled woods / sun-dappled grove / pine taiga / birch grove / redwood cathedral / autumn maple / overgrown ruin / windswept moor / heath / alpine meadow / cliff-edge / canyon trail / desert mesa / slot canyon / dune sea / salt flat / volcanic foothill / lava-glow plain / tundra / glacier canyon / ice cave / coast / sea-cliff / mangrove / marsh / river-ford / waterfall basin / cave passage / underdark cavern / hilltop shrine / collapsed bridge / waystation ruin / abandoned watchtower / forgotten chapel / fey hollow / moonlit meadow / firefly glen / sunken garden.\n\nNO real-world ethnic-coded settings. Western high fantasy only.`,
    touchpoints: [
      'A clearing of moss-soft floor between three lichen-bearded oaks; the canopy overhead lets only thin shafts of sun through; somewhere a wren calls',
      'High alpine pass at golden hour — wind-honed granite spires receding into snow-haze, the trail a thread between two voids',
      'A hollow under a fallen sequoia, roots forming a vault overhead, ferns growing where the bark gives way to bare earth',
      'The mouth of a cave at the edge of a pine taiga, breath visible in the chill, the interior swallowed in black',
      'Wind-carved sandstone arch standing alone on a salt-flat under unreal stars',
      'A waystation ruin — three roofless stone walls and a hearth — at the crossroads of two forest paths, ivy creeping into the chimney',
      'Knee-deep ford across a clear river, smooth stones visible through the current, kingfishers in the willows above',
      'A small hidden grotto behind a curtain of waterfall, the rock-walls slick with green moss',
      'Dawn-mist threading between birch trunks, frost on every surface, breath visible — winter forest just waking up',
      'A collapsed stone bridge across a slow-moving creek, vines pulling the abutments apart, lily pads broken across the surface',
      'Cliff-edge trail in a high desert canyon, late-afternoon shadow-bands cutting the opposite wall in horizontal stripes',
      'A windswept highland moor under racing storm-cloud, heather to mid-thigh, a single weather-worn standing-stone at the crest',
      'Ankle-deep firefly glen at dusk — meadow of low grass, thousands of fireflies just rising, the surrounding trees lost in darkness',
      'Abandoned watchtower on a hilltop, half-collapsed crenellations, a single raven on the broken parapet',
      'The lip of a fjord — water so dark it reads black 800 meters below, sea-eagles riding the updraft along the cliff-face',
      'A treeline that gives suddenly onto tundra, the last stunted pines clinging to the wind, lichen-painted rocks beyond',
      'An overgrown temple courtyard, columns half-fallen, a circle of unbroken paving still visible at the center under ivy',
      'A bioluminescent cave passage — fungi at knee-height casting cool blue light up the walls, dripstone overhead',
      'Streamside at dawn, mist clinging to the water, willows leaning in from both banks, flat stepping-stones across',
      'The base of a small waterfall — pool deep enough to wade in, rocks ringed with green moss, light filtering through alder leaves',
      'Salt-flat at full dark — the entire mirror-surface throwing the stars back, no wind, sound carrying impossibly far',
      'A volcanic plain in twilight — black basalt cooling under fine ash-fall, faint orange seams where the rock still glows',
      'Lava-tube skylight cave — sun-shaft from a collapsed ceiling spotlighting ferns in the otherwise pitch-black tunnel',
      'A small forgotten chapel on a coastal cliff — slate roof half-collapsed, ivy climbing the south wall, the bell still in the broken tower',
    ],
    instructions: `Each entry is ONE wild fantasy stage, 15-50 words. STRUCTURAL VARIETY: mix epic-vista / mid-scale / intimate-nook / ruin / weather-moment / threshold. DO NOT use rigid "[TITLE] — panorama" format. NO real-world ethnic-coded settings. Strict Western high fantasy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  male_adventurer_drama: {
    format: 'simple',
    theme: `40%-gated ATMOSPHERIC DRAMA woven into an adventurer scene — an environmental event that adds awe but NEVER combat. LOTR / GoT / Skyrim weather/cosmic-event tradition. Each entry 20-40 words.\n\nABSOLUTE BANS: NO violence / battle / enemies / mid-strike / fight. NO sultry / posing language.\n\nMANDATORY: a specific atmospheric event, where in the scene it appears, visible presence (not just "in the background").`,
    touchpoints: [
      'AURORA BOREALIS — green-and-violet curtains rippling across the night sky above distant snow-capped peaks',
      'METEOR SHOWER — dozens of fire-streaks tracing across a star-dense sky, brief and dazzling',
      'BLOOD MOON RISE — massive crimson moon cresting the eastern horizon, bathing the landscape in rust-red light',
      'LIGHTNING STORM — bolt cracking across distant purple storm-cloud, briefly illuminating valley depths',
      'SOLAR ECLIPSE — sun reduced to a fire-ringed black disk, shadow racing across the landscape',
      'PASSING DRAGON AT DISTANCE — winged silhouette gliding across a far ridge-line, scale-glint visible',
      'FALLING STAR — single bright streak overhead, briefly outshining everything else in the sky',
      'WILL-O\'-WISP CLUSTER — floating lantern-spirits drifting at knee-height across a misty grove',
      'GOD-RAY DAWN — single thick column of sunlight piercing dense morning cloud onto the valley floor',
      'COMET — bright tailed body crossing the sky, its tail visible as a long pale arc',
      'MAGICAL PORTAL — swirling glowing ring of light mid-air at a far distance, shape just resolving from haze',
      'MIST ROLLING IN — wall of low fog advancing across the valley floor, swallowing trees as it comes',
      'HEAVY SNOWFALL — slow drifting flakes filling the air, settling on his shoulders and hood',
      'AUTUMN LEAF-FALL — gold-orange foliage shower drifting in still air through the entire scene',
      'DOUBLE RAINBOW — full arc spanning the misty valley after rain, second bow faintly visible above',
      'TWIN-MOON RISE — two moons rising together over distant peaks, one full-white, one pale-amber',
      'FIREFLY EMERGENCE — thousands of fireflies rising from grass at dusk, the meadow lighting up gold',
      'WHIRLING PETAL-STORM — pink petals carried on the wind through the entire scene from a distant grove',
      'ASH-FALL — fine grey ash drifting down through still air from a distant volcano',
      'ARCING FALCON — solo predator wheeling high overhead, briefly silhouetted against bright sun',
      'PASSING SKY-WHALES — fantastical leviathans drifting overhead at altitude through the clouds',
      'GROUND-FOG GLOW — eerie phosphorescence shimmering through low fog at ankle-height across the clearing',
      'ROLLING THUNDERHEAD — wall-cloud bearing down from the horizon, lightning flickering inside its body',
    ],
    instructions: `Each entry is ONE atmospheric drama event, 20-40 words. Format: "EVENT-CAP — visible description + where in the scene". Adds awe. NO violence. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  male_adventurer_surprise_element: {
    format: 'simple',
    theme: `TINY SECONDARY SUBJECTS that add story to a male-adventurer scene — a small element at midground or deep midground implying a wider world. Each entry 15-35 words. Format: "[ELEMENT] — [visual description + placement: midground / deep midground / edge of frame]".\n\nABSOLUTE BANS: NO violence / enemies / mid-strike. NO sultry language. Element NEVER eclipses him.\n\nMANDATORY: a specific tiny subject (animal / object / tiny figure / artifact), a specific placement in the frame, a story-hook implying the wider world.`,
    touchpoints: [
      'a red fox watching from a tangle of thorny underbrush fifteen meters behind him, ears pricked, half-hidden',
      'a small dragon perched on a far tower silhouette sixty meters away, wings folded, against an evening sky',
      'an abandoned cart at the edge of frame, one wheel broken, cargo half-spilled across the path',
      'wind-bent prayer flags strung across a narrow mountain pass behind him, snapping in high wind',
      'distant pilgrim figures on a far ridge two hundred meters across the valley, single-file, tiny silhouettes',
      'a small cooking fire smoldering unattended thirty meters downstream, suggesting recent camp',
      'tracks of a large beast pressed into mud in the midground, leading away into deep forest',
      'a ruined statue half-overgrown in the middle distance, faceless and weather-eaten',
      'a hooded raven perched on a stone marker fifteen meters off, watching him steadily',
      'an ancient stone marker carved with directional glyphs at the edge of the trail',
      'a broken sword half-buried in the loam, hilt-up, vines already growing around it',
      'a small standing stone with weathered runes carved into one face, knee-high, mossed',
      'a tied warhorse at the edge of frame, head dipped to crop sparse grass',
      'a distant cookfire smoke-thread rising thin above a far ridge, suggesting other travelers',
      'a wildflower patch blooming at the edge of a cliff trail, pale blue against scorched earth',
      'a fallen knight\'s helm half-buried in moss, vines flowering white through the visor',
      'a single white moth circling a lantern at the edge of frame, oversized and pale',
      'a partial skeleton of some great beast in the midground, ribs arching from the earth',
      'a small painted shrine tucked into the base of a roadside tree, candle-stub still burning',
      'a hawk perched on his shoulder or nearby branch, alert, head turning toward the camera',
      'a scout-sigil scratched fresh into the bark of a tree at the edge of frame, paint still wet',
      'a herd of distant deer grazing in a far meadow, alert but undisturbed',
      'a half-collapsed wooden bridge in the deep midground, suggesting an old road',
      'a torn cloak snagged on a thorn at chest-height in the midground, abandoned by someone before him',
    ],
    instructions: `Each entry is ONE tiny secondary subject for a male-adventurer scene, 15-35 words. Format: "[ELEMENT] — [visual + placement + story-hook]". Element is small and midground / deep-midground / edge. NEVER eclipses him. NO violence / enemies. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── DRAGONBOT female-action-scenes path (2026-05-14) ───────────────────
  // Clone of female-adventurer with the ACTION pool rewritten for pure
  // peak-action cinematic moments: mages mid-spell with explosions,
  // ranger mid-loose, rogue sneaking through busy night market, paladin
  // mid-strike, sorceress at summon apex, druid mid-shape-shift, warlock
  // eldritch blast. Alive, motion-blurred, effect-rich. Other pools
  // (class / outfit / accessory / hairstyle / race / drama / landscape /
  // surprise_element) are inherited from female-adventurer at clone time
  // and can diverge later. Only the action recipe is meaningfully
  // different at clone time.

  female_action_scenes_action: {
    format: 'simple',
    theme: `PEAK-ACTION CINEMATIC MOMENTS for a female fantasy adventurer — captured at the LOADED INSTANT of a dynamic mid-action beat. Effects-rich, motion-blurred, MAELSTROM-INTENSE. Each entry 40-70 words (longer than the typical pool because EACH ENTRY MUST STACK MULTIPLE SIMULTANEOUS EFFECTS).\n\nFormat: "ACTION-HEADLINE — body position AT THE PEAK INSTANT + her primary effect (spell released / blade arc / arrow loosed) + environmental reaction (debris / shockwave / glass-shatter / sparks raining / motion-blur) + active scene context (fleeing crowd / collapsing tower / allied caster / dragon shadow / distant explosion / arrow-volley)".\n\n⚠️ THIS IS NOT THE CANDID-ADVENTURING POOL. This is PEAK ACTION with the dial CRANKED. Every entry should read as a MOVIE-POSTER PROMOTIONAL STILL — every quadrant of the frame has something happening.\n\n━━━ MULTI-EFFECT STACK — MANDATORY ━━━\nEvery entry MUST describe AT LEAST 3 SIMULTANEOUS DYNAMIC ELEMENTS:\n  1. **HER PRIMARY ACTION** — the LOADED INSTANT of her beat (mid-cast at fireball apex / mid-loose with arrow streaking / mid-leap descending / mid-summon with portal cracking / mid-strike with blade-arc / mid-channel with energy beam)\n  2. **ENVIRONMENTAL REACTION** — the world REACTING to her action (debris kicked up / glass shattering / dust cloud / sparks raining / spell-light blooming outward / shockwave radiating / hair-and-cloak whipped by magical wind / motion-blur on her swung arm / cracking flagstones / scorch marks)\n  3. **ACTIVE BACKGROUND CONTEXT** — chaos / motion / magic ELSEWHERE in the frame (fleeing crowd / collapsing tower / distant explosion / arrow-volley overhead / dragon shadow / allied caster also mid-spell / battle silhouettes / cracking flagstones / smoke billowing / burning building / charging cavalry / scattered enemies retreating / pursuing guards / falling banners / scrolls whipping past)\n\nA TYPICAL ENTRY SHAPE:\n"FIREBALL RELEASE — arms thrust forward at apex of cast, flaming orb hurtling away trailing comet-tail of ember-sparks, [environmental:] shockwave radiating outward kicking up flagstone-dust and rippling banners, [context:] fleeing villagers parting in foreground silhouettes while siege engines launch counter-fire from the burning watchtower behind her"\n\n━━━ SCALE THE MAGIC UP ━━━\nIf magic is involved, DON'T render a wisp — render a MAELSTROM.\n  • NOT just a fireball — a fireball PLUS secondary tendrils of flame PLUS glowing runes orbiting her ankles\n  • NOT just lightning — lightning forking down + arcane circle radiating from her feet + ozone-mist billowing\n  • NOT just a portal — a portal CRACKING REALITY + creatures partial-emerged + air rippling + her hair lifting in pulled-physics wind\n  • NOT just a healing-wave — golden dome expanding + motes of light raining + injured allies visibly recovering as the wave passes\n\n━━━ ACTIVE SCENE CONTEXT REQUIRED ━━━\nThe LANDSCAPE is one slot — but EVERY action entry should ALSO describe scene-level chaos: someone fleeing / collapsing / shouting / firing / charging / falling / breaking / smoking / glowing. The frame should feel like CHAPTER NINETEEN of a fantasy novel, not chapter one's candid moment.\n\nMANDATORY in every entry:\n• A peak-action verb (mid-cast / mid-loose / mid-leap / mid-strike / mid-summon / mid-blast / mid-charge / mid-shift / mid-vault / mid-slide / mid-block / mid-channel)\n• 2-3 specific stacked effects (her primary + environmental reaction + scene context)\n• KINETIC TENSION — the next frame changes everything\n\nABSOLUTE BANS:\n• NO single-effect quiet moments. STACK THE EFFECTS.\n• NO candid quiet moments ("sitting / kneeling at fire / sharpening blade / reading map / pausing to listen") — that's female-adventurer.\n• NO grisly gore / fallen bodies / blood-spray (PG-13 action, not slasher)\n• NO posing for camera / sultry / sensual / cheesecake language\n• NO real-world ethnic / historical costume references\n\nVARIETY MANDATE — distribute across class-coded action types (target ~equal across all):\n\n  A. **SPELLCASTERS MID-MAGIC** (mages / sorceresses / warlocks / wizards / arcanists / elementalists):\n     • Mid-fireball release, arms outstretched, palms still glowing\n     • At summon apex, both hands tracing complex glyphs, portal cracking open behind her\n     • Eldritch blast — beam of crackling violet boring outward from her open palm\n     • Lightning-storm caller — both arms raised to a thunderhead, bolt forking down\n     • Ice nova — arms swept downward, expanding ring of frost shattering the ground\n     • Channeling at ley-line, ground glyphs flaring beneath her feet\n\n  B. **MARTIAL CLASSES MID-STRIKE-OR-DODGE** (paladins / warriors / monks / knights / barbarians):\n     • Paladin mid-strike, divine warhammer overhead, weapon and arm glowing gold\n     • Knight charging behind tower shield, lightning glinting off steel face\n     • Barbarian mid-charge with greataxe overhead, mouth open in war cry, foes scattering\n     • Monk mid-air kick with chi-glow trailing her leg, body twisted impossibly\n     • Warrior parrying a strike off-frame, sparks erupting from blade-on-blade\n\n  C. **RANGED MID-LOOSE-OR-AIM** (rangers / archers / crossbow / throwing weapons):\n     • Ranger mid-loose, bow drawn to cheek, arrow already streaking from her fingers\n     • Crossbow snap-shot from cover, bolt blurring across the frame\n     • Throwing-axe mid-flight from her hand, blade catching firelight\n     • Wall-vault mid-jump shooting backwards over her shoulder\n\n  D. **ROGUES / ASSASSINS / SCOUTS MID-INFILTRATION** (high-stakes urban or sneak):\n     • Slipping through a lantern-lit night market, hood up, target visible twenty paces ahead through the crowd\n     • Mid-leap from a rooftop, knife reversed in hand, descending toward a guard\n     • Sprinting across collapsing rooftops while arrows rain past her\n     • Bursting through a tavern door, blade already half-drawn at her hip\n     • Vaulting a fountain in pursuit through a plaza, scattering coins and pigeons\n\n  E. **DIVINE / SHAMAN CHANNELING** (clerics / druids / shamans / necromancers):\n     • Cleric healing-wave — kneeling with arms outstretched, golden dome expanding\n     • Druid mid-shape-shift — half-human half-bear, fur bursting through cracking skin, face still partly visible\n     • Necromancer raising the dead — bony hands erupting from the earth around her feet\n     • Shaman storm-call — arms raised to storm-cloud sky, lightning bolt arcing down behind her\n     • Cleric divine-strike — sword overhead with column of golden light erupting from the blade\n\n  F. **TRAVEL / ESCAPE / PURSUIT ACTION** (any class, dynamic biome action):\n     • Sprinting across a rope bridge as it collapses behind her\n     • Mounted at full gallop, leaning low past the camera, banner streaming\n     • Sliding down a scree slope with momentum, dust trailing\n     • Diving off a cliff into a river far below, mid-air with arms wide\n     • Wall-running across a battlement, behind her a fireball strike\n\n  G. **DRAGON-ADJACENT** (special — Dragon bot path identity):\n     • Mid-flight on dragonback, gripping a horn as the dragon dives past a tower\n     • Standing at a dragon's shoulder mid-roar, fire visible erupting from its maw\n     • Mounted dragon-rider mid-loose, firing a longbow from the saddle at a distant target\n\nEvery entry should be the kind of thing that would be a MOVIE-POSTER PROMOTIONAL STILL — not a quiet candid moment. Effects, motion, fire-and-magic, kinetic peak.`,
    touchpoints: [
      // SPELLCASTERS MID-MAGIC — STACK THE EFFECTS
      'FIREBALL MAELSTROM — arms thrust forward at full extension, the flaming orb just released hurtling toward a fortified gate trailing a comet-tail of ember-sparks AND secondary tendrils of flame curling around her wrists, [environmental:] shockwave radiating outward from her feet kicking up flagstone-dust and rippling battle-banners, [context:] fleeing villagers as silhouettes in the foreground while siege engines launch counter-fire from the burning watchtower behind her',
      'PORTAL SUMMON — both hands tracing concentric glyphs in mid-air, a portal of violet light CRACKING REALITY open behind her with creatures partial-emerged, [environmental:] her hair lifting in pulled-physics wind and books-and-scrolls whipping past her body toward the rift, [context:] an arcane library collapsing behind her with bookshelves toppling and other apprentices fleeing toward the exit',
      'ELDRITCH BLAST — palm extended, a beam of crackling violet energy boring outward across the entire frame toward an off-screen target, [environmental:] her own eyes glowing the same violet, secondary shadow-tendrils erupting from beneath her feet, [context:] a cliffside with crashing waves below AND a second eldritch entity beginning to manifest in the deep midground sky',
      'STORM-CALLER STRIKE — both arms raised to a storm-cloud sky from a basalt outcrop, lightning bolt forking down past her shoulder to strike the earth at her heel, [environmental:] arcane storm-circle of glowing runes radiating outward from her feet and ozone-mist billowing, [context:] her cloak and hair WHIPPED horizontal by the gale, fleeing wolves silhouetted across the moor and a second lightning strike hitting a distant tower',
      'ICE NOVA — arms sweeping downward in an X-pattern, an expanding ring of jagged ice shards radiating outward from her feet shattering the cobblestones, [environmental:] frost-mist billowing past her ankles and her breath visible white, [context:] a city plaza with citizens diving for cover and frozen shop signs cracking from the cold-blast, distant flames extinguishing in the wave',
      'LEYLINE CHANNEL — kneeling with palms flat on the ground, ley-line glyphs flaring blue-white beneath her hands racing outward across cracked earth, [environmental:] her hair lifting in the upward magical pulse and rock fragments hovering around her, [context:] standing menhirs at the deep midground beginning to glow in response, a distant night-army halting on the next hill as the spell registers',
      // MARTIAL MID-STRIKE — STACK THE EFFECTS
      'PALADIN HAMMER-STRIKE — warhammer raised overhead at the apex, the weapon and her arm sheathed in golden divine light, [environmental:] motion-blur on her swing arm and a divine corona blooming outward, divine sparks raining down from the weapon, [context:] a shadow-demon recoiling at the impact-point with its tendrils dissolving, a temple courtyard with retreating cultists in the foreground and a partial-collapsed pillar behind',
      'KNIGHT SHIELD-CHARGE — sprinting forward behind raised tower shield, the steel face catching a lightning-flash, [environmental:] mud and grass spraying from her boots with each pounding step, banner trailing horizontal behind her, [context:] the gate-line of enemy spear-formation visible twenty feet ahead with their front rank already breaking, a burning castle keep silhouetted in the distance',
      'BARBARIAN MAELSTROM-CHARGE — full sprint with greataxe held two-handed overhead, mouth open in a war-cry, [environmental:] dust and grass kicked up in her wake and motion-blur on her trailing braids, war-paint glowing faintly in the dusk, [context:] three scattered foes recoiling in the foreground muddy battlefield, allied raiders charging alongside in the deep midground, a sky-wide red moon overhead',
      'MONK AERIAL KICK — caught mid-air, body twisted side-on parallel to the ground, chi-glow trailing her extended leg in a brilliant luminous arc, [environmental:] robe rippling violently and cherry-petals blasted outward from the impact-zone, [context:] a temple gong cracking from the impact behind her with debris already falling, a second monk leaping forward to support, mountain temple in the deep distance',
      'WARRIOR PARRY-EXPLOSION — half-turned mid-block with sword angled up, the impact-point a starburst of sparks where her blade meets an unseen attacker\'s, [environmental:] her sword glowing red-hot from the speed of motion, foreground a burst of orange and white debris, [context:] a chaotic melee around her with allied figures clashing further back in the smoke-and-fire midground',
      // RANGED MID-LOOSE — STACK THE EFFECTS
      'RANGER MID-LOOSE — bow drawn full to her cheek and the arrow JUST released, the shaft streaking from her fingers with a motion-trail spanning the frame, [environmental:] enchanted ember-glow trailing the arrow-tip, her cloak snapping from the shot\'s force, [context:] in a forest at golden hour with bandits scattering in the foreground silhouettes and a second arrow already nocked in her right hand, a burning wagon visible behind',
      'CROSSBOW VOLLEY — emerging from behind a stone column on a battlement, heavy crossbow snapped to her shoulder, bolt already blurring across the frame toward a distant rider, [environmental:] another bolt streak in the foreground from an unseen ally also firing, [context:] a castle corridor lit by lantern-fire with siege machines visible firing through the courtyard arch below, dust falling from cracked masonry above',
      'WALL-VAULT BACK-SHOT — mid-jump up a stone wall using a single foothold, twisting backwards mid-flight to release an arrow at a pursuer below, [environmental:] motion-blur trail across her bow-arm and lantern-glow lighting her from below, [context:] a lantern-lit alley in chaos with two armed pursuers entering the foreground and shop-windows reflecting torch-fire',
      'THROWING-AXE TRIPLE — arm in full follow-through, the lead axe already mid-flight blurring across the foreground with two more spinning behind it from her other hand, [environmental:] sparks raining from the embedded axes in the wooden tavern wall behind, [context:] a tavern interior with patrons diving away from upturned tables, guard-bursting through the splintering door, lantern crashing to the floor',
      // ROGUES MID-INFILTRATION — STACK THE EFFECTS
      'NIGHT MARKET PURSUIT — moving smoothly through a dense lantern-lit market crowd, hood up, [environmental:] cloak whipping behind her as she weaves past startled merchants, motion-blur on her trailing edge, [context:] her hooded target visible twenty paces ahead already breaking into a run, three guards pushing through the crowd in the deep midground behind, paper lanterns swaying overhead, food-stalls scattering as the chase passes',
      'ROOFTOP DESCENT — mid-leap from a steep clay rooftop, knife reversed in her hand, descending toward a guard\'s shoulders below, [environmental:] her hair streaming straight up, motion-blur on the trailing leg, [context:] a moonlit citadel courtyard with two more guards reacting to her arrival, a distant fire on the next rooftop, torch-bearers crossing the courtyard unaware',
      'COLLAPSING-ROOF SPRINT — full sprint across an unstable burning rooftop, [environmental:] arrows whistling past her in audible volleys, the roof breaking apart behind each footfall with embers and tiles cascading down, [context:] a moonlit city with three pursuers already on the rooftop behind her, archers visible on a distant battlement, the entire eastern quarter aflame in the deep distance',
      'TAVERN DOOR EXPLOSION — bursting in shoulder-first through a heavy oak tavern door, [environmental:] splinters flying outward, blade already half-drawn at her hip, lantern-light spilling out behind her into the rain-slick street, [context:] inside is a brawl already in progress with patrons fighting on overturned tables, a guard with his back to her at the bar, smoke from a kicked-over hearth filling the upper half of the frame',
      'PLAZA PURSUIT VAULT — caught mid-vault over a stone fountain in pursuit, [environmental:] startled pigeons exploding outward in a cloud of feathers and a shower of coins scattering from a knocked-over cart, [context:] her quarry rounding the far corner with cloak streaming, market crowd parting in alarm in the foreground, a guard captain pointing from the deep midground commanding response',
      // DIVINE / DRUIDIC / SHAMANIC — STACK THE EFFECTS
      'CLERIC HEALING DOME — kneeling with arms outstretched, a golden dome of divine light expanding outward in motes-of-light particles, [environmental:] motes of gold raining down around her, her hair lifting in the upward magical pulse, [context:] wounded crouched allies within the growing sphere visibly recovering as the wave passes, the dark forest beyond pushed back by the glow, a shadowy enemy line retreating at the dome\'s edge',
      'DRUID MID-SHIFT — caught at the moment of half-transformation, wolf fur erupting through splitting skin on her arms and face, [environmental:] paws emerging from where boots fell, motes of green forest-magic swirling around her, [context:] a forest clearing with surprised hunters in the foreground lowering their bows, a real wolf-pack emerging from the treeline behind her to flank',
      'NECROMANCER RAISING DEAD — standing in a graveyard at dusk, palms pressed downward toward the earth, [environmental:] skeletal hands erupting from the soil around her feet in a wide ring, mist curling upward in tendrils, her eyes glowing white-blank, [context:] a distant battle visible in the deep midground with armies clashing, ravens circling overhead, the cathedral on the hill at the horizon already burning',
      'STORM-CALLER MAELSTROM — arms raised to a roiling storm-cloud sky on a high cliff, [environmental:] lightning bolts arcing down BEHIND her into the sea AND from her upturned palms upward into the cloud, her hair and cloak whipped horizontal by the gale, [context:] a galleon-fleet visible far below in the storm-tossed waves with sails tearing, a sea-serpent breaching from the foaming sea-floor',
      'DIVINE-STRIKE SWORD — sword raised overhead, a COLUMN of golden light erupting from the blade upward into a starless sky, [environmental:] a circle of paladin-light blooming around her boots and divine motes raining down, holy script glowing in air around her, [context:] shadow-demons fleeing in all directions, a fallen ally she protected lying half-visible at her feet, the night battlefield revealed by her column of light',
      // TRAVEL / ESCAPE — STACK THE EFFECTS
      'COLLAPSING-BRIDGE SPRINT — full sprint along a rope bridge as planks break free behind each footfall, [environmental:] the rope-rail flailing, mist plumes erupting from the gorge as planks fall into it, [context:] a distant tower visible across the gorge with a pursuit-party emerging onto its battlement to fire arrows, the far cliff-edge ten more meters away',
      'MOUNTED GALLOP-BY — at full gallop on her horse leaning low past the camera, [environmental:] banner streaming horizontal behind her, hooves throwing chunks of mud, her mount\'s breath visible in the cold, [context:] a burning village receding in the background with civilians fleeing, an enemy cavalry line cresting a hill in the deep midground in pursuit, a comet streaking across the morning sky',
      'CLIFF-DIVE ESCAPE — captured mid-air after the leap from a high cliff, arms wide, hair streaming up, [environmental:] her cloak billowing upward like a parachute, motion-blur on her plummeting silhouette, [context:] a pursuing arrow streaking past where she just was, three pursuers visible on the cliff-edge above firing more arrows, a river-pool far below with rocks visible at its edge',
      'WALL-RUN ESCAPE — wall-running across a battlement at full speed, [environmental:] behind her a fireball-strike erupting against the stone with debris exploding outward, foreground crenellation sparks, [context:] a moat far below with crocodiles, archers on the far tower reloading, a banner of her enemy snapping in the wind above',
      'SCREE-SLIDE PURSUIT — sliding down a steep scree slope on her heels at speed, [environmental:] dust trailing in a long plume behind her, small stones cascading ahead, [context:] bow held forward already nocked, the canyon-floor below opening into a chaotic melee battle with multiple allied raiders engaging an enemy patrol, a hawk-rider circling overhead',
      // DRAGON-RIDER — STACK THE EFFECTS
      'DRAGONBACK DIVE — clinging to her dragon\'s neck-horn as it dives steeply past a tower, [environmental:] wind plastering her against its neck, dragon-scales catching the sun in iridescent ripples, the tower spire blurring past with motion-blur trail, [context:] a city wall under siege below with catapults firing upward and trebuchet-stones arcing past, allied dragons swooping in formation in the deep midground',
      'DRAGON-SHOULDER ROAR — standing at her great dragon\'s shoulder mid-roar, [environmental:] fire erupting from its maw in a wide gout illuminating the entire foreground orange, her own cloak whipping back in the heat-blast, the air shimmering from the inferno, [context:] a distant siege engine bursting into flame from the dragonfire, retreating soldiers visible silhouettes in the foreground, smoke columns rising from previous strikes',
      'SADDLED LONGBOW LOOSE — mounted on her flying dragon, bow drawn back, arrow JUST released streaking forward in flight, [environmental:] wind whipping her braid and the dragon\'s mane horizontal, motion-blur on her draw-arm, [context:] a city wall and battle far below receding under them with civilian boats fleeing the harbor, a second dragon-rider visible in the deep distance also engaging',
    ],
    instructions: `Each entry is ONE peak-action cinematic moment, 30-55 words. Format: "ACTION-HEADLINE — body position AT THE LOADED INSTANT + specific magical/mechanical EFFECT IN MOTION + specific cinematic CONTEXT". Mid-cast / mid-loose / mid-strike / mid-leap / mid-summon — the LOADED INSTANT before the next frame changes everything. EFFECTS visible (flame-orb-just-released, arrow-streaking, divine-light-blooming, motion-blur, debris kicked up, hair-and-cloak whipping, magical-wind). NO candid quiet moments. NO gore. NO posing for camera. NO real-world ethnic codes. Variety mandate: distribute across spellcaster / martial / ranged / rogue / divine-shaman / travel-escape / dragon-rider action types. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── DRAGONBOT female-adventurer path-bespoke pools (2026-05-14) ────────
  // 12-axis split system per the new playbook. NSFW-clean rebuild — no
  // artist callouts (Frazetta/Brom/Vallejo were cheesecake-DNA + NSFW
  // triggers); no "minimal coverage" / "bare midriff" outfit language.
  // Reuses bot-level race/skin/eyes/hair_color pools.

  female_adventurer_class: {
    format: 'simple',
    theme: `Fantasy class IDENTITY + BEARING for a female adventurer — D&D × LOTR × Witcher tradition. The class is her ROLE and ENERGY only — NOT her gear (gear lives on a separate axis). Each entry 15-30 words. Format: "[CLASS-CAP] — bearing + iconic energy + signature trait of how she carries herself".\n\nABSOLUTE BANS:\n• NO specific weapons named (axe / sword / bow / staff — that's the accessory axis)\n• NO specific outfit pieces named (leather / robes / plate — that's the outfit axis)\n• NO race-anatomy (that's the race axis)\n• NO cheesecake language (sleek / sensual / sultry / curves / cleavage — banned)\n\nMANDATORY in every entry:\n• A CLASS NOUN (ROGUE / RANGER / SORCERESS / WARLOCK / MAGE / PALADIN / WARRIOR / MONK / DRUID / BARD / CLERIC / BARBARIAN / ARTIFICER / NECROMANCER / SHAMAN / KNIGHT / ARCANIST)\n• A BEARING DESCRIPTOR (how she stands, moves, watches)\n• A SIGNATURE class-energy detail (faint sigil glow / wind-honed eyes / unspoken authority / arcane crackle at fingertips)\n\nVARIETY MANDATE — cover the spectrum: martial / arcane / divine / wilderness / shadow / nature / inventive.`,
    touchpoints: [
      'ROGUE — light-footed and quick-handed, watchful eyes that read every door and lock the way others read faces, never the loudest voice in the room',
      'RANGER — wilderness-honed and slow to speak, fast to draw; she reads weather, tracks, and threat-distance before others notice the air has changed',
      'SORCERESS — innate magic crackles at her fingertips uninvited, eyes hold a faint storm-light even at rest, raw power barely banked behind her composure',
      'WARLOCK — pact-bound to a distant patron, a faint sigil glows on her sternum or palm, sometimes her gaze briefly belongs to something not her',
      'MAGE — disciplined arcane scholar, every gesture deliberate, the air around her hands occasionally bending with stored cantrip-charge',
      'PALADIN — quiet unwavering authority, the steadiness of someone who has sworn a vow she will keep, a faint inner glow others cannot see',
      'WARRIOR — straight-backed and battle-tested, scars across her knuckles, the alert stillness of someone who has survived more than most',
      'MONK — economy of motion, perfect balance, her breath the only sound in a room at rest, the calm before kinetic explosion',
      'DRUID — moss-quiet calm of someone who speaks more to trees than people, animal-silent in the underbrush, eyes flecked with bark or leaf-green',
      'BARD — quick smile and quicker tongue, the practiced confidence of someone who has talked her way out of more trouble than she has fought through',
      'CLERIC — solemn devotion in her bearing, faint divine light reflected in her irises in dim places, hands that have closed both wounds and eyes',
      'BARBARIAN — controlled fury banked just below the surface, ritual scars or tribal markings, the heavy stillness of weather about to break',
      'ARTIFICER — fingertips stained with reagent-ink, tinkerer\'s pouches at her hip, eyes that catch and measure every mechanical detail in a room',
      'NECROMANCER — pale calm of someone who has shaken hands with death, faint sigil-tattoos along her forearms, a voice that whispers more than speaks',
      'SHAMAN — feather-and-bone fetishes braided into her clothes, eyes that go elsewhere mid-conversation listening to ancestor-spirits',
      'KNIGHT-ERRANT — square-shouldered honor-bound traveler, sworn-promise gravity in her speech, the patience of a long road walked alone',
      'ARCANIST — research-pale and ink-stained, the faintly distracted look of someone solving an equation while you talk to her',
    ],
    instructions: `Each entry is ONE class identity + bearing, 15-30 words. Format: "CLASS-CAP — bearing + class-energy + signature trait". NO specific weapons. NO specific outfit pieces. NO race anatomy. NO cheesecake / sultry / sensual / curves / cleavage language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  female_adventurer_outfit: {
    format: 'simple',
    theme: `SLEEK ADVENTURING GEAR for a female adventurer in **STRICTLY HIGH-FANTASY tradition** — LOTR / GoT / Elden Ring / Skyrim / Witcher / Warcraft / D&D Forgotten Realms. Practical, agile, functional, road-tested. Painterly fantasy concept-art tradition WITHOUT artist callouts. Each entry 20-50 words.\n\n🚫 **ABSOLUTE BAN — NO real-world ethnic costume codes.** This is Western HIGH FANTASY, not historical cosplay. Specifically forbidden:\n  • NO Bedouin / Arabic / Middle-Eastern-coded\n  • NO Persian / Ottoman-coded\n  • NO Mongol / Steppe-nomad-coded\n  • NO Aztec / Mayan / Andean / Inca-coded\n  • NO Polynesian / Pacific-Islander-coded\n  • NO Indian / Indian-subcontinent / sari-coded\n  • NO Samurai / Japanese / hakama / kimono-coded (NO Eastern)\n  • NO Egyptian / Roman / Greek / Byzantine-coded\n  • NO Norse Viking (the racial template "Nord" is fine; "Norse-coded barbarian" is fine; but don't drift into real-world Viking historical-costume reference)\n\nThe high fantasy world has its OWN climate-and-culture variety vocabulary — use IT:\n\n⚠️ CLIMATE DISTRIBUTION IS CRITICAL — DO NOT default to "leather coat over wool inner over trousers and boots with hood". Target distribution:\n\n  A. **WARM-CLIMATE / LIGHT** (~35% of pool — use HIGH FANTASY analogues):\n    • Dornish (GoT) / Hammerfell-Redguard (Skyrim) / Haradrim (LOTR) / Khanduras (Diablo) / South Reach\n    • Chult (FR) / Stranglethorn (WoW) / Sothoryos (GoT) jungle outfits\n    • Anauroch (FR) / Athasian (Dark Sun) desert-fantasy explorers\n    • Light fitted single-layer tunic + breeches\n    • Sleeveless gambeson with bracered forearms\n    • Sun-cloak + light leathers\n    • Lightweight scale over a thin under-layer\n    • Sorceress in a fitted travel-robe, NOT bundled\n  B. **TEMPERATE / MID** (~35% of pool):\n    • Rohirrim / Gondorian / Dúnedain / Cyrodiil-Imperial / Witcher-school / Eriador-ranger / Bretons-Highgarden\n    • Fitted ranger leathers / hooded scout coat that ends at the hip\n    • Civilian bardic doublet\n    • Paladin half-plate over surcoat\n    • Mage's traveling robes (not full winter cloak)\n    • Cuirass over thin gambeson\n  C. **COLD-CLIMATE / LAYERED** (~30% of pool, NOT MORE):\n    • Skyrim Nords / Witcher's Northern Realms / Forodwaith / The North (GoT) / Stormcloak\n    • Bearskin / hide-and-fur / arctic shaman / Eriador winter-cloak\n    • These belong but DO NOT dominate.\n\n⚠️ SILHOUETTE VARIETY IS CRITICAL — DO NOT default to "long coat over trouser-and-boot". Distribute across:\n\n  A. ROBES / DRESSES-AS-ARMOR — mage cassock / cleric vestments / monk wrap (Western monastic, not Eastern) / sorceress flowing travel-robe / druidic moss-robe — flowing, NOT coat-over-trouser\n  B. CUIRASS / BREASTPLATE FOCUS — steel breastplate + skirt-of-chain-and-leather / scale cuirass over fitted under-coat — the armor is THE statement\n  C. SINGLE-LAYER FITTED — light tunic + breeches with NO coat / sleeveless gambeson / fitted linen riding outfit\n  D. HOODED COAT — the historic bias, legitimate but ONE option, not default\n  E. PLATE / HEAVY ARMOR — full half-plate / engraved cuirass + greaves\n\nSTRUCTURAL VARIETY in entry shape (mix all):\n  A. SILHOUETTE-LED — leads with the shape\n  B. MATERIAL-LED — leads with the dominant fabric/metal\n  C. SINGLE-PIECE FOCUS — leads with one iconic garment\n  D. WHAT-SHE-IS-NOT-WEARING — "No armor at all..." / "No cloak..." / "Sleeveless..."\n  E. LIVED-IN DETAIL — leads with wear/damage story\n  F. COLOR-PALETTE-LED — leads with chromatic identity\n\nDO NOT use a rigid "CULTURE-NAME — [garments list]" headline format. Mix openings, capitalization, lengths.\n\nABSOLUTE BANS (NSFW triggers):\n• NO "minimal coverage" / "battle bikini" / "battle bra" / "bare midriff" / "exposed cleavage" / "exposed thighs"\n• NO "form-fitting" / "skin-tight" / "second-skin"\n• NO "harness across torso" / "bondage-coded"\n• NO "sultry" / "sensual" / "alluring" / "seductive" / "provocative" / "curves emphasized" / "bust-accentuating" / "low-cut"\n• NO artist names (Frazetta / Brom / Vallejo / Boris / Hildebrandt / Whelan)\n\nMUST READ AS: functional + covered + road-tested + class-coded + HIGH FANTASY ONLY.\n\nCONTENT VARIETY MANDATE — every entry MUST differ in:\n• OUTFIT ARCHETYPE\n• MATERIAL PALETTE — oxblood / forest-green / charcoal / cobalt / verdigris-bronze / pewter / bone-white / wine-red / dark teal / saffron / russet / steel-grey / cream / sand-tan / indigo / olive / amber / coral-pink / jade / amethyst-purple\n• FANTASY-CANON CULTURE FLAVOR (one of):\n    • LOTR: Rohirrim / Gondorian / Dúnedain / Númenórean / Sindar / Noldor / Galadhrim / Haradrim / Easterling\n    • GoT: Northerner / Dornish / Highgarden / Ironborn / Free-Folk\n    • Skyrim: Nord / Imperial / Redguard / Bosmer / Altmer / Dunmer / Breton\n    • Witcher: Nilfgaardian / Skellige / School-of-Wolf / Aen Seidhe / Mahakaman\n    • D&D Forgotten Realms: Cormyrean / Waterdhavian / Thayan / Chultan / Calishite (avoid the strongest real-world coding; lean on fantasy-original names)\n    • Warcraft: Stormwind / Stranglethorn / Quel'Thalas / Ironforge / Hyjal\n    • Elden Ring / Dark Souls: Carian / Leyndell / Liurnia / Catarina\n    • Generic D&D: Drow / Elf / Dwarf / Halfling-Shire / Half-orc / Tiefling / Dragonborn\n• CLASS REGISTER — heavy-armored / mid-armored / lightly armored / robed / hide-and-fur / civilian\n• CLIMATE (per distribution above)`,
    touchpoints: [
      // WARM-CLIMATE / LIGHT — HIGH FANTASY ONLY (target ~35%)
      'A Dornish scout in a sleeveless saffron-and-copper riding leathers, fitted linen breeches, low travel boots, hair tied back in a single dark braid — built for the desert sun',
      'A Hammerfell Redguard sword-singer in a fitted teal tunic with gold-thread embroidery at the collar, dark trousers, soft leather boots, a sun-cape draped over one shoulder',
      'A Chultan jungle ranger in a fitted dark-green sleeveless leather jerkin, knee-length skirt of layered leather strips, bare arms with feather-and-cord wraps, low jungle-boots',
      'A Stranglethorn explorer in light fitted hide gear — bare-armed, dark short cloak knotted at one shoulder, calf-wrapped boots, copper-tone bracelet stack at one wrist',
      'A sleeveless quilted cream gambeson with red embroidery at the seams, exposing tattooed forearms (clan-ink, not skin-display), light trousers, low travel boots — Southron warm-climate kit',
      'A Haradrim scout in a fitted dark-red sleeveless leather vest over a thin linen under-tunic, loose-fit trousers, simple boots — a Southron rider in summer',
      'A Calishite enchantress in a flowing cream sorceress-robe with fitted bodice and skirt-to-mid-calf, gold-thread sigils at the hem, focus-crystal on a chain, sandals — robe, not coat',
      'A Free Folk wildling-summer kit: light fitted hide tunic, bare arms, dark riding trousers, leather wrist-wraps — South of the Wall warm-season explorer',
      // TEMPERATE / MID — HIGH FANTASY ONLY (target ~35%)
      'Fitted forest-green Sindar woodland gear — leather scout-jerkin over a brown linen under-tunic and breeches, leaf-patterned bracers, low travel boots, NO coat NO long cloak',
      'A Gondorian paladin\'s half-plate articulated from gorget to shin-guards, silver-tree surcoat over the chest, dust-stained from the road — dressy, not bundled',
      'A fitted Witcher-school under-coat in dark grey leather, gambeson beneath, riding gloves, mid-calf boots — Northern Realms kit but cut short, NOT a long coat',
      'A Quel\'Thalas blood-elf paladin in burnished red-and-gold breastplate over a fitted cream under-coat, knee-skirt of leather strips, light bracers',
      'No armor at all — just a fitted dark wool tunic, breeches, soft boots, a heavy spellbook on a baldric across her chest — a Cormyrean court-mage on the road',
      'A flowing midnight-teal Carian sorceress robe with fitted bodice and skirt-to-mid-calf, silver-thread runes at the hem, a moon-glass focus on a long chain',
      'A Drow scout coat in matte-black leather to the HIP ONLY (not long), deep hood, dark trousers, soft climbing boots — fitted, glare-suppressed Underdark gear',
      'Cropped Rohirric riding jacket and breeches in russet wool, knee-high boots, a single bronze horse-motif pauldron — NO long coat NO cloak',
      'A fitted Mahakaman dwarven scale corset in verdigris-bronze over a thin under-coat, plain breeches, sturdy boots — the scale is the centerpiece',
      'A Breton spellsword in a fitted dark blue doublet with brass buckles, light mail beneath, riding trousers, low boots, hawthorn focus-rod tucked at the belt',
      // COLD-CLIMATE / LAYERED — HIGH FANTASY ONLY (target ~30%, NOT MORE)
      'A Nord shieldmaiden in a heavy bearskin half-cloak over a dark wool tunic and breeches, painted clan-marks on her cheekbones, leather wrist-wraps',
      'A Pewter mail hauberk falling to mid-thigh, leather belt at the waist, plain wool trousers, sturdy boots — Dúnedain warden\'s practical loadout',
      'A long forest-green Ranger-cloak to the ankle, beneath it a simple brown tunic and breeches, weathered boots — Eriador winter gear',
      'A Free-Folk wildling layered against the Wall — heavy hide-and-fur overcloak, hardened leather chest-piece beneath, bone-clasped at the throat',
      'A patched dark leather Witcher coat with mismatched horn buttons, elbows re-hided in darker leather, the original color long faded — a decade of monster-hunting visible',
      'A Forodwaith arctic mantle of bear-fur over layered linen, bone-fetish belt at the waist, fur-topped boots, breath visible — high-tundra cold gear',
      'A Stormcloak heavy gambeson in dark blue and bronze, mail underneath, fur-trimmed collar, Skyrim winter trousers — Eastmarch winter kit',
    ],
    instructions: `Each entry is ONE sleek adventuring outfit, 20-50 words. STRUCTURAL VARIETY IS CRITICAL — mix silhouette-led, material-led, single-piece-focus, what-she-is-NOT-wearing, lived-in-detail, and color-palette-led forms across the pool. DO NOT use a "CULTURE — garment list" rigid headline format. Vary openings, capitalization, lengths. Some entries can be a single descriptive sentence; others can be 2-3 sentences. Some entries lead with what she's NOT wearing. Some name no class at all. NSFW-CLEAN — never minimal-coverage, never bare-midriff, never harness/sultry/sensual. Functional + covered + road-tested. NO TWO entries share archetype/material/culture. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  female_adventurer_accessory: {
    format: 'simple',
    theme: `SIGNATURE CARRIED ITEM or WEAPON for a female adventurer — class-flavored, the kind of object she's known for. Each entry 15-30 words. Format: "[OBJECT-NAME] — [where carried] + [signature visual detail]".\n\nVARIETY MANDATE across the pool:\n• WEAPONS: longbow + arrow-quiver / recurve bow / longsword / scimitar / dual daggers / paired shortswords / war-staff / quarterstaff / shillelagh / mace / morningstar / war-hammer / spear / glaive / halberd / crossbow / hand-crossbow / sling-and-pouch / throwing-axes / kukri / katana / sabre\n• CASTER FOCI: gem-topped staff / orb-staff / focus-crystal pendant / leather-bound spellbook / scroll-case / spirit-totem fetish / holy symbol / sun-emblem amulet / moon-disc / pact-sigil ring\n• UTILITY: lockpick roll / climbing hooks / harvester\'s pouch / herbalist\'s satchel / cartographer\'s tube / hunter\'s horn / signal-mirror / lantern / smoking censer / shaman\'s drum / tinkerer\'s tool-belt\n• ICONIC: family signet ring / lineage banner-pole / clan-banner cloak-pin / oath-relic / familiar (raven on shoulder / hawk on glove / cat at hip) / heirloom locket\n\nNO weapons in active combat use. All sheathed, holstered, slung, or being carried — never mid-swing.`,
    touchpoints: [
      'longbow slung across her back with arrow-quiver at her hip, fletching dyed in clan colors',
      'twin parrying daggers crossed in lower-back sheaths, hilts wrapped in dark leather',
      'gem-topped quarterstaff held in one hand, the focus-crystal catching ambient light',
      'leather-bound spellbook clipped at her belt with brass fittings, page-edges gilded',
      'longsword strapped at her left hip in a tooled leather scabbard, family crest on the pommel',
      'recurve bow carried in one hand with a leather wrist-guard on her draw-arm',
      'hooded raven familiar perched on her left shoulder, alert and silent',
      'pact-sigil ring on her index finger glowing faintly when her gaze flickers elsewhere',
      'shaman\'s hand-drum slung over one shoulder, painted with bone-rune patterns',
      'cartographer\'s tube on her belt with rolled maps poking from the open end',
      'pair of throwing-axes in cross-back harness, blades carbon-blacked to suppress glare',
      'wolf-headed walking staff with iron-shod tip, her hand resting at the carved grip',
      'silver holy symbol on a chain at her throat, palm-sized, faintly luminous in dim light',
      'falconer\'s glove on her left hand with a hooded hawk standing alert on it',
      'leather lockpick roll tucked into her belt, picks held in place by oiled loops',
      'crossbow slung across her back with bolt-quiver clipped to her hip belt',
      'hand-crossbow holstered on each thigh, dark-stained wood with iron fittings',
      'glaive carried point-up in one hand, the polearm head wrapped in leather for travel',
      'paired shortswords in cross-back sheaths, both hilts wound in green-dyed cord',
      'herbalist\'s satchel at her hip overflowing with bundled herbs and tied root-bags',
      'iron-banded oak quarterstaff held in one hand, carved with weathered runes along its length',
      'lineage banner-pole strapped across her back, banner furled tight in oilcloth',
      'lantern hooked at her hip on a brass swivel-arm, the flame guttering as she moves',
      'silver moon-disc amulet on a fine chain, the disc engraved with a single crescent',
      'tinkerer\'s tool-belt at her waist with tiny brass instruments tucked into loops',
    ],
    instructions: `Each entry is ONE signature carried item, 15-30 words. Format: "[OBJECT] — [where carried] + [visual detail]". Variety: martial weapon / caster focus / utility item / iconic personal. NEVER in active combat use — sheathed, slung, holstered, or carried. NO cheesecake / sultry / sensual / curves language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  female_adventurer_hairstyle: {
    format: 'simple',
    theme: `PRACTICAL ADVENTURING HAIRSTYLES for a female adventurer — the kind of hair-management someone does on the road, not for a portrait. Each entry 10-25 words. Format: "[STYLE] — [practical detail: tied, braided, hooded, etc.]".\n\nMANDATORY: every style is FUNCTIONAL for travel/combat. NO salon styling. NO loose flowing waves draped over one shoulder. NO carefully-curled. NO product-shiny.\n\nVARIETY: single thick braid / two side braids / long warrior-tail / utility ponytail / cropped short / undercut with top-knot / shaved sides with long top / hooded so hair barely shows / wrapped under a head-scarf / wrapped under a hood / pinned up under a helmet-padding / loose with a leather forehead-band / wrapped with cord / dreadlocked / wild and tangled / topknot / chignon held with bone-pins / partial-braid with the rest tied back / box-braids / two thick ropes pinned to the crown`,
    touchpoints: [
      'single thick warrior-braid down her spine, bound at the tail with leather cord',
      'two thick side-braids framing her face, the rest loose down her back',
      'high utility ponytail tied with a strip of dark leather, fly-aways tucked',
      'cropped short and practical, just past her ears, road-windblown',
      'undercut with the long top pinned up in a tight knot, sides shaved close',
      'hooded so only the front edge of her hair shows under the cowl',
      'wrapped under a dark head-scarf knotted at the nape',
      'pinned up in a tight crown of braids, ready for a helmet',
      'loose with a leather forehead-band keeping it out of her eyes',
      'dreadlocked with bone-clasps and bound at the tail with cord',
      'wild and tangled from days on the road, half-tied back with twine',
      'topknot pinned with a single bone-pin, the rest shaved close at the sides',
      'shoulder-length and tied back into a low utility-knot at the nape',
      'box-braids gathered into a single thick tail bound with bright cord',
      'long single rope-braid wound around her head and pinned at the back',
      'side-shaved with the long side falling forward over one ear',
      'partial-braid at the temples with the rest loose and travel-tousled',
      'two thick crown-braids pinned with bone-pins, the rest in a tail',
      'short curls cropped at the jaw, dark and travel-windswept',
      'half-up with the front twisted back and pinned, the rest down her back',
    ],
    instructions: `Each entry is ONE practical adventuring hairstyle, 10-25 words. NEVER salon-styled. NEVER product-shiny. NEVER loose flowing waves draped for a portrait. ALWAYS functional for travel/combat. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  female_adventurer_action: {
    format: 'simple',
    theme: `STORY-RICH adventuring moments for a female adventurer in the wild — a candid mid-action beat from her travels. NOT mundane camp chores. NOT combat. Each moment is the kind of thing that opens a chapter — something is happening. Each entry 25-45 words. Format: "ACTION-CAP — body position + specific prop or object + specific location detail + cinematic tension".\n\nABSOLUTE BANS:\n• NO combat / mid-strike / weapon-aimed-at-foe / enemy in frame / fallen body / wounded character / blood-fight\n• NO chores ("sharpening blade / polishing sword / lacing boots / drinking from waterskin / eating by campfire")\n• NO stock poses ("scanning horizon hand-to-brow / kneeling at shrine")\n• NO sultry / sensual / posing-for-camera language\n\nMANDATORY in every entry:\n• A STORYTELLING HOOK — something is happening, why it matters or what's at stake\n• A SPECIFIC PROP / OBJECT she's interacting with\n• A SPECIFIC LOCATION beat (forest path / cliff trail / cave mouth / clearing / stream-bank / etc.)\n• CINEMATIC TENSION — held breath, mid-motion, charged stillness, half-drawn focus\n\n⚠️ BODY-POSITION VARIETY IS CRITICAL — DO NOT default to "kneeling / crouching / seated / hunched at fire". Across the pool, distribute body positions roughly evenly across these registers:\n\n  A. **MOUNTED / WITH COMPANION ANIMAL** (~20% of pool): atop her horse cresting a ridge / leading her mount across a rope bridge / dismounting at a stream / her hawk launching from her glove / her wolf padding alongside her / her raven on shoulder mid-stride / kneeling beside her wounded mount\n  B. **DYNAMIC TRAVEL / IN MOTION** (~20% of pool): mid-stride across a moor / striding down a forest path with bow drawn-but-relaxed / wading thigh-deep through a river / walking a cliff trail / running between cover / sliding down a scree slope on her heels / vaulting a fallen log\n  C. **CLIMBING / VERTICAL** (~10% of pool): caught mid-grip on a cliff face / pulling herself onto a ledge / descending hand-over-hand on a rope / squeezing through a narrow passage / climbing a rope bridge after it collapsed mid-span\n  D. **STANDING / SURVEYING / READING THE WORLD** (~15% of pool): standing on a high outcrop reading the wind / drawing bowstring back at a distant target / studying the sky through a sextant / arm half-extended casting a glowing focus / pausing mid-step listening / pressing palm to a tree-trunk gone still\n  E. **KNEELING / CROUCHING / WORKING** (~20% of pool): tracking a print / brushing dust from a sigil / casting a ward-circle / kindling fire under rain-tarp — these belong but DO NOT dominate\n  F. **REACHING UP / LIFTING / STRAINING** (~10% of pool): lifting a collapsed beam aside / pulling back the cover of a crypt door / unsealing a casket / lifting a reliquary above flood-water / striking a flint over kindling held in cupped hands\n  G. **SEATED / RESTING / CRAFTING** (~5% of pool): fletching arrows on a flat rock / writing in a journal at camp / repairing tear in a cloak — minor share\n\nKevin's R2 favorite was "leading mount across rope bridge" — a dynamic traveling pose with a companion animal. The pool should produce more of THAT energy, not more "kneeling at sigil".\n\nVariety thematic spectrum (cover all):\n• TRACKING / SCOUTING (often crouching but vary with standing-and-reading-the-wind too)\n• EXPLORATION (rappelling, wading, climbing, squeezing through, lifting beams)\n• MAGIC / RITUAL (casting standing arm-extended, mid-spell with focus, channeling at standing stone — vary BODY POSITION even within ritual)\n• DISCOVERY (brushing sigil, lifting cloth from cache, unrolling map, opening casket)\n• TRAVEL (mounted, leading mount, fording river, crossing bridge, striding through biome, mid-step listening)\n• SHELTER (kindling fire, stringing hammock, setting snares)\n• CRAFT / WORK (fletching, repairing, writing in journal)`,
    touchpoints: [
      // MOUNTED / WITH-COMPANION (Kevin loved the rope-bridge mount entry — more like this)
      'LEADING MOUNT ACROSS ROPE BRIDGE — one hand on the bridle, the other gripping the rope-rail, mid-span over a gorge with mist rolling beneath the planks',
      'ATOP A CRESTING HORSE — leaning forward in the saddle on a rising trail at golden hour, her cloak streaming back, a distant valley opening below',
      'DISMOUNTING AT A STREAM — one boot already on the ground, the other still in the stirrup, reins held loose as her mount lowers its head to drink',
      'HER HAWK LAUNCHING FROM HER GLOVE — arm extended sharp toward a rising horizon, raptor breaking forward into flight, jess-cord trailing for a heartbeat',
      'HER WOLF PADDING ALONGSIDE — striding through a quiet forest at dusk, the wolf shoulder-high beside her keeping her exact pace, both alert to the same distant sound',
      'PULLING REIN AT CROSSROADS — atop her dark mount in low evening light, gloved hand on the pommel, head tipped reading a weather-worn signpost',
      // DYNAMIC TRAVEL / IN MOTION
      'STRIDING DOWN A FOREST PATH — bow held in her draw-hand but relaxed, mid-step over a fallen branch, dappled light cutting horizontal bands across her path',
      'WADING THIGH-DEEP THROUGH RAPIDS — staff planted hard against the current, her free hand braced low for balance, water white-foam breaking against her knees',
      'VAULTING A FALLEN LOG — mid-leap with one foot pushing off the trunk, the other already extended toward the trail beyond, pack-straps caught mid-bounce',
      'RUNNING BETWEEN COVER — caught at full stride between two trees on a moonlit hillside, the next stand of pines three meters off, breath visible in the cold',
      'SLIDING DOWN A SCREE SLOPE — heels dug in, body angled back, dust and small stones cascading around her boots, the trail-end visible far below',
      'STRIDING ACROSS A WIND-WHIPPED MOOR — cloak streaming sideways in a horizontal gust, hair tearing free of its braid, the path threading toward distant standing stones',
      // CLIMBING / VERTICAL
      'CAUGHT MID-GRIP ON A CLIFF FACE — three meters above the trail, both hands and one boot on rough sandstone, the next handhold already chalked',
      'PULLING ONTO A LEDGE — both forearms over the lip, body straining as she heaves herself up, the long drop visible beneath her',
      'DESCENDING HAND-OVER-HAND — rope twisted around her wrist, boots braced against a slick stone wall, lantern swinging from her belt as she rappels',
      // STANDING / SURVEYING / READING THE WORLD
      'DRAWING THE BOWSTRING — feet planted shoulder-width, arrow-shaft brushing her cheek, eye on a distant target the viewer cannot quite see',
      'CASTING FROM FOCUS — standing tall with one arm half-extended, glowing crystal in her open palm, a glyph of light blooming above it, hair lifting in magical wind',
      'STUDYING NIGHT SKY THROUGH SEXTANT — standing on a high outcrop, brass instrument raised to one eye, the Milky Way arching overhead',
      'PRESSING PALM TO TREE — pausing mid-stride against a great trunk, eyes shut, listening to something on the wind her companion has not yet heard',
      'STANDING AT THE BRIDGE-EDGE — one boot on the first plank, hand resting on the rope-rail, looking into the gorge before committing weight to the span',
      // KNEELING / CROUCHING / WORKING (kept but minority share)
      'TRACKING THROUGH FERN — kneeling at a half-print in damp loam, fingertip brushing its edge, eyes already following the trail into the deep ferns',
      'BRUSHING DUST FROM A SIGIL — kneeling at a half-buried stone slab in a clearing, gloved fingertip clearing moss from a rune that has begun to glow under her touch',
      'CASTING WARD-CIRCLE — kneeling in a chalk-drawn ring on flat stone, scattering bone-runes one by one, breath ghosting white in suddenly-cold air',
      // REACHING UP / LIFTING / STRAINING
      'LIFTING A COLLAPSED BEAM — both arms straining against a half-fallen rafter in a ruined hall, dust falling through a shaft of light from the broken roof',
      'LIFTING A RELIQUARY ABOVE FLOOD-WATER — waist-deep in a sunken temple, both hands raising a stone reliquary high above her head, careful step by step toward the stair',
      'PULLING BACK A CRYPT DOOR — body angled into the effort, both palms flat against the stone slab, neck-veins straining as the door grinds open inch by inch',
      // SEATED / RESTING / CRAFTING (minor share — Kevin says these dominate, keep small)
      'WRITING IN JOURNAL AT CAMP — seated cross-legged in firelight, leather book open on one knee, her mount grazing in the background',
      'FLETCHING ARROW AT REST — seated cross-legged on a flat rock, a half-fletched shaft braced between her knees, feather-vane held in steady fingers',
    ],
    instructions: `Each entry is ONE story-rich non-combat adventuring moment, 25-45 words. Format: "ACTION-CAP — body position + specific prop + specific location + cinematic tension". NO combat. NO chores. NO stock poses. NO sultry/sensual posing-for-camera. Variety: tracking / exploration / magic-ritual / discovery / travel / listening / shelter / craft. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  female_adventurer_landscape: {
    format: 'simple',
    theme: `STAGES in the wild where a female adventurer is mid-action — fantasy biomes, ruins, edge-of-civilization places. Each entry 15-50 words.\n\nSTRUCTURAL VARIETY IS MANDATORY — entries must NOT all be "epic panorama with depth layers". Mix SCALE across the pool (target ~equal distribution):\n  A. EPIC VISTA — wide-open scale with horizon depth (alpine pass / fjord / tundra under aurora)\n  B. MID-SCALE GROVE / TRAIL / EDGE — tighter scope (forest clearing / cliff path / mountain trail / streamside / cave mouth)\n  C. INTIMATE NOOK — close confined stage (hollow under a fallen tree / nook between boulders / hidden grotto / small waterfall basin / lit cave passage)\n  D. RUIN / HUMAN-TOUCHED PLACE — abandoned watchtower / waystation / hilltop shrine / collapsed bridge / ruined gatehouse / overgrown courtyard\n  E. WEATHER MOMENT — biome defined by a weather state more than its bones (snowstorm-edge / dawn-mist / dusk-on-the-water / sudden-rain-clearing)\n  F. THRESHOLD — transition between two places (forest-edge meets meadow / cave-mouth opens to canyon / treeline-to-tundra)\n\nDO NOT use the rigid "[TITLE] — sweeping panorama description with X-meter measurements" format. Mix lengths and openings. Some entries should be a single short sentence. Some can lead with a SOUND or LIGHT detail rather than a geography label.\n\nVARIETY MANDATE — every entry MUST differ in biome/scope/lighting/atmosphere:\n• BIOME — primeval forest / mist-veiled woods / sun-dappled grove / pine taiga / birch grove / redwood cathedral / autumn maple / overgrown ruin / windswept moor / heath / alpine meadow / cliff-edge / canyon trail / desert mesa / slot canyon / dune sea / salt flat / volcanic foothill / lava-glow plain / tundra / glacier canyon / ice cave / coast / sea-cliff / mangrove / marsh / river-ford / waterfall basin / cave passage / underdark cavern / hilltop shrine / collapsed bridge / waystation ruin / abandoned watchtower / forgotten chapel / fey hollow / moonlit meadow / firefly glen / sunken garden\n• LIGHT STATE — dawn / golden hour / high noon / blue hour / dusk / night / moonlit / aurora / storm-light / fog-light / firefly-light / bioluminescent\n• SCOPE — epic vista (5 m+ deep) / mid-scale stage (~50 m) / intimate nook (~5 m)\n\nNo grand title-style headlines. Some entries can read like quiet observations.`,
    touchpoints: [
      'A clearing of moss-soft floor between three lichen-bearded oaks; the canopy overhead lets only thin shafts of sun through; somewhere a wren calls',
      'High alpine pass at golden hour — wind-honed granite spires receding into snow-haze, the trail a thread between two voids',
      'A hollow under a fallen sequoia, roots forming a vault overhead, ferns growing where the bark gives way to bare earth',
      'The mouth of a cave at the edge of a pine taiga, breath visible in the chill that rolls out, the interior swallowed in black',
      'Wind-carved sandstone arch standing alone on a salt-flat under unreal stars',
      'A waystation ruin — three roofless stone walls and a hearth — at the crossroads of two forest paths, ivy creeping into the chimney',
      'Knee-deep ford across a clear river, smooth stones visible through the current, kingfishers in the willows above',
      'A small hidden grotto behind a curtain of waterfall, the rock-walls slick with green moss and the air filled with mist',
      'Dawn-mist threading between birch trunks, frost on every surface, breath visible — winter forest just waking up',
      'A collapsed stone bridge across a slow-moving creek, vines pulling the abutments apart, lily pads broken across the surface where she crosses',
      'Cliff-edge trail in a high desert canyon, late-afternoon shadow-bands cutting the opposite wall in horizontal stripes',
      'A windswept highland moor under racing storm-cloud, heather to mid-thigh, a single weather-worn standing-stone at the crest',
      'Ankle-deep firefly glen at dusk — meadow of low grass, thousands of fireflies just rising, the surrounding trees lost in darkness',
      'Abandoned watchtower on a hilltop, half-collapsed crenellations, a single raven on the broken parapet',
      'The lip of a fjord — water so dark it reads black 800 meters below, sea-eagles riding the updraft along the cliff-face',
      'A treeline that gives suddenly onto tundra, the last stunted pines clinging to the wind, lichen-painted rocks beyond stretching to a flat horizon',
      'An overgrown temple courtyard, columns half-fallen, a circle of unbroken paving still visible at the center under ivy',
      'A bioluminescent cave passage — fungi at knee-height casting cool blue light up the walls, dripstone overhead',
      'Streamside at dawn, mist clinging to the water, willows leaning in from both banks, the trail crossing on flat stepping-stones',
      'The base of a small waterfall — pool deep enough to wade in, rocks ringed with green moss, light filtering down through alder leaves',
      'Salt-flat at full dark — the entire mirror-surface throwing the stars back, no wind, sound carrying impossibly far',
      'A volcanic plain in twilight — black basalt cooling under fine ash-fall, faint orange seams where the rock still glows',
      'Lava-tube skylight cave — sun-shaft from a collapsed ceiling spotlighting ferns growing in the otherwise pitch-black tunnel',
      'A small forgotten chapel on a coastal cliff — slate roof half-collapsed, ivy climbing the south wall, the bell still in the broken tower',
      'A glacier canyon at noon — cathedral-blue ice walls rising on either side, the floor slick black-and-white meltwater',
      'A mangrove tide-flat at low water — prop-roots exposed, water-pools glowing faintly green where she steps',
      'A fey hollow in a moonlit forest — clearing where the grass grows in a perfect circle, mushroom-ring at the edge, no birds calling',
      'A high meadow above the treeline, alpine wildflowers in chaos of color, snow-streaks on the peaks beyond',
      'Edge of a redwood-cathedral grove, trunks the diameter of small houses, the understory bare except for the carpet of fallen needles',
      'A sunken garden behind a long-lost manor — terraced stone steps overgrown with wildflowers, a dry fountain at the center',
    ],
    instructions: `Each entry is ONE wild fantasy stage, 15-50 words. STRUCTURAL VARIETY: mix epic-vista / mid-scale / intimate-nook / ruin / weather-moment / threshold across the pool. DO NOT use the rigid "[TITLE] — panorama with X-meter measurements" format. Vary openings, lengths, capitalization. Some entries are a single short sentence. Some lead with sound or light. Variety mandate: NO TWO entries share biome / scope / light-state. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  female_adventurer_drama: {
    format: 'simple',
    theme: `40%-gated ATMOSPHERIC DRAMA woven into an adventurer scene — an environmental event that adds awe but NEVER combat. LOTR / GoT / Skyrim weather/cosmic-event tradition. Each entry 20-40 words.\n\nABSOLUTE BANS:\n• NO violence / battle / enemies / mid-strike / fight\n• NO sultry / sensual / cheesecake-posing language\n\nMANDATORY:\n• An ATMOSPHERIC EVENT specifically described (storm / aurora / eclipse / etc.)\n• WHERE IN THE SCENE it appears (sky / horizon / midground / distance)\n• VISIBLE PRESENCE (rain coming down / lightning flashing / dragon passing) — never just "in the background"`,
    touchpoints: [
      'AURORA BOREALIS — green-and-violet curtains rippling across the night sky above distant snow-capped peaks',
      'METEOR SHOWER — dozens of fire-streaks tracing across a star-dense sky, brief and dazzling',
      'BLOOD MOON RISE — massive crimson moon cresting the eastern horizon, bathing the landscape in rust-red light',
      'LIGHTNING STORM — bolt cracking across distant purple storm-cloud, briefly illuminating valley depths',
      'SOLAR ECLIPSE — sun reduced to a fire-ringed black disk, shadow racing across the landscape',
      'PASSING DRAGON AT DISTANCE — winged silhouette gliding across a far ridge-line, scale-glint visible',
      'FALLING STAR — single bright streak overhead, briefly outshining everything else in the sky',
      'WILL-O\'-WISP CLUSTER — floating lantern-spirits drifting at knee-height across a misty grove',
      'GOD-RAY DAWN — single thick column of sunlight piercing dense morning cloud onto the valley floor',
      'COMET — bright tailed body crossing the sky, its tail visible as a long pale arc',
      'MAGICAL PORTAL — swirling glowing ring of light mid-air at a far distance, shape just resolving from haze',
      'MIST ROLLING IN — wall of low fog advancing across the valley floor, swallowing trees as it comes',
      'HEAVY SNOWFALL — slow drifting flakes filling the air, settling on her shoulders and hood',
      'AUTUMN LEAF-FALL — gold-orange foliage shower drifting in still air through the entire scene',
      'DOUBLE RAINBOW — full arc spanning the misty valley after rain, second bow faintly visible above',
      'TWIN-MOON RISE — two moons rising together over distant peaks, one full-white, one pale-amber',
      'FIREFLY EMERGENCE — thousands of fireflies rising from grass at dusk, the meadow lighting up gold',
      'DUST DEVIL ON HORIZON — small swirling funnel of dust crossing a far ridge, sand catching late light',
      'WHIRLING PETAL-STORM — pink petals carried on the wind through the entire scene from a distant grove',
      'ASH-FALL — fine grey ash drifting down through still air from a distant volcano',
      'ARCING FALCON — solo predator wheeling high overhead, briefly silhouetted against bright sun',
      'PASSING WHALES (SKY-WHALES) — fantastical leviathans drifting overhead at altitude through the clouds',
      'GROUND-FOG GLOW — eerie phosphorescence shimmering through low fog at ankle-height across the clearing',
      'ROLLING THUNDERHEAD — wall-cloud bearing down from the horizon, lightning flickering inside its body',
    ],
    instructions: `Each entry is ONE atmospheric/environmental drama event, 20-40 words. Format: "EVENT-CAP — visible description + where it appears in the scene". Adds awe. NO violence. NO combat. NO enemies. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  female_adventurer_surprise_element: {
    format: 'simple',
    theme: `TINY SECONDARY SUBJECTS that add story to an adventurer scene — a small element at midground or deep midground implying a wider world. Each entry 15-35 words. Format: "[ELEMENT] — [visual description + placement: midground / deep midground / edge of frame]".\n\nABSOLUTE BANS:\n• NO violence / enemies / mid-strike / weapon-aimed-at-her\n• Element NEVER eclipses the adventurer — always tiny / midground / edge\n• NO sultry / sensual language\n\nMANDATORY:\n• A SPECIFIC TINY SUBJECT (animal / object / tiny figure / artifact)\n• A SPECIFIC PLACEMENT in the frame\n• A STORY-HOOK — what it implies about the wider world`,
    touchpoints: [
      'a red fox watching from a tangle of thorny underbrush fifteen meters behind her, ears pricked, half-hidden',
      'a small dragon perched on a far tower silhouette sixty meters away, wings folded, against an evening sky',
      'an abandoned cart at the edge of frame, one wheel broken, cargo half-spilled across the path',
      'wind-bent prayer flags strung across a narrow mountain pass behind her, snapping in high wind',
      'distant pilgrim figures on a far ridge two hundred meters across the valley, single-file, tiny silhouettes',
      'a small cooking fire smoldering unattended thirty meters downstream, suggesting recent camp',
      'tracks of a large beast pressed into mud in the midground, leading away into deep forest',
      'a ruined statue half-overgrown in the middle distance, faceless and weather-eaten',
      'a hooded raven perched on a stone marker fifteen meters off, watching her steadily',
      'an ancient stone marker carved with directional glyphs at the edge of the trail',
      'a broken sword half-buried in the loam, hilt-up, vines already growing around it',
      'a small standing stone with weathered runes carved into one face, knee-high, mossed',
      'a tied warhorse at the edge of frame, head dipped to crop sparse grass',
      'a distant cookfire smoke-thread rising thin above a far ridge, suggesting other travelers',
      'a wildflower patch blooming at the edge of a cliff trail, pale blue against scorched earth',
      'a fallen knight\'s helm half-buried in moss, vines flowering white through the visor',
      'a single white moth circling a lantern at the edge of frame, oversized and pale',
      'a partial skeleton of some great beast in the midground, ribs arching from the earth',
      'a small painted shrine tucked into the base of a roadside tree, candle-stub still burning',
      'a hawk perched on her shoulder or nearby branch, alert, head turning toward the camera',
      'a scout-sigil scratched fresh into the bark of a tree at the edge of frame, paint still wet',
      'a herd of distant deer grazing in a far meadow, alert but undisturbed',
      'a half-collapsed wooden bridge in the deep midground, suggesting an old road',
      'a torn cloak snagged on a thorn at chest-height in the midground, abandoned by someone before her',
    ],
    instructions: `Each entry is ONE tiny secondary subject, 15-35 words. Format: "[ELEMENT] — [visual + placement + story-hook]". Element is small and midground / deep-midground / edge. NEVER eclipses her. NO violence / enemies. NO sultry language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── DRAGONBOT female-warrior path-bespoke pools (2026-05-14) ───────────
  female_warrior_action: {
    format: 'simple',
    theme: 'STORY-RICH non-combat adventuring moments for a fantasy warrior — caught in vivid scenes of stakes, mystery, discovery, infiltration, ritual, exploration, or interaction. NOT mundane camp chores — each moment is the kind that would open a CHAPTER in a fantasy novel. NO combat, NO mid-strike, NO weapon-aimed-at-foe, NO active fighting. Weapons can be DRAWN-AT-READY, sheathed, or stashed. The mood is taut + cinematic + narratively loaded — something is HAPPENING, even if it\'s quiet.\n\nABSOLUTE BANS (these are what made the previous pool boring):\n• NO "sharpening blade / polishing sword / lacing boots" type chores\n• NO "drinking from waterskin / eating by campfire / sitting in tavern" type rest\n• NO "scanning horizon / hand to brow" stock pose\n• NO "kneeling at shrine / saying lineage prayer" reverence\n• NO mundane camp setup\n\nMANDATORY in every entry:\n• A STORYTELLING HOOK — what is happening, why it matters, what\'s at stake\n• A SPECIFIC PROP or OBJECT she is interacting with (artifact / map / lock / sigil / corpse / scroll / ally / messenger / mount / scout-sign)\n• A SPECIFIC LOCATION beat (rope bridge over chasm / tomb antechamber / ruined throne room / ship deck / smuggler\'s tunnel / etc.)\n• CINEMATIC TENSION — held breath, mid-motion, charged stillness, intercepted glance\n\nVARIETY MANDATE — cover the full storytelling spectrum:\n• INFILTRATION: scaling fortress wall / lockpicking vault / sneaking past guards / dropping from rafters / cutting through silk screen\n• EXPLORATION: rappelling into ruins / wading through flooded crypt / picking through ancient battlefield / opening sealed tomb door / following glow-mushroom trail\n• MYSTERY: decoding runes by torchlight / examining bloody trail / interrogating prisoner / reading scroll by candlelight / discovering hidden message\n• INTERACTION: receiving relic from ghost / negotiating with merchant / consoling wounded ally / accepting quest from king / being knighted at altar / handing tribute to elder\n• RIDING: cresting hill on warhorse / fording icy river on mount / leaning over saddle pursuing trail / drawing rein at crossroads\n• AT-A-DISTANCE THREAT: holding bow drawn-but-aimed-at-empty-air-not-target / loading crossbow at watchtower / lowering torch into pitch-black opening\n• RITUAL: anointing altar with blood / casting ward circle / consulting bone-runes / lighting funeral pyre / cutting palm to seal pact\n• DISCOVERY: lifting cloth from treasure cache / finding signet ring in dirt / brushing dust from carved sigil / unrolling forbidden map / pulling sword from stone',
    touchpoints: [
      'LOCKPICKING A VAULT — kneeling at iron-banded door, picks in steady hands, torchlight glinting off tumblers, silk-purse of jewels at her belt waiting',
      'RAPPELLING INTO RUINS — descending rope down ancient shaft, dust falling in her wake, glowstone in mouth illuminating moss-covered walls below',
      'DECODING SIGIL BY TORCHLIGHT — bent over carved stone slab in crypt antechamber, fingertip tracing rune-grooves, jaw set in concentration',
      'RECEIVING RELIC FROM GHOST — facing translucent spectral figure offering a glowing crown, her hand half-extended in held-breath wonder',
      'OPENING SEALED TOMB DOOR — both hands pressing on stone seal, neck-veins straining as ancient mechanism grinds, dust cascading',
      'CRESTING A HILL ON WARHORSE — leaning forward on galloping black destrier, banner of her clan whipping behind, target valley visible below',
      'WADING THROUGH FLOODED CRYPT — knee-deep in dark water, lantern held high, eyes scanning waterline for signs of sunken sarcophagi',
      'LOWERING TORCH INTO PIT — kneeling at edge of yawning black hole, torch dangled on rope, fire-light flickering on wet stone walls below',
      'CUTTING THROUGH SILK SCREEN — knife slicing through painted screen of sultan\'s palace, eye visible through tear, jewels visible beyond',
      'INTERROGATING PRISONER — leaning over bound figure tied to chair, dagger-tip resting under his chin, her braid swinging forward in the lamplight',
      'BEING KNIGHTED AT ALTAR — kneeling on stone steps, ancient queen lowering ceremonial sword to her shoulder, court watching in silence',
      'EXAMINING BLOODY TRAIL — crouched in forest path, fingertip touching dark crimson on leaf, eyes following the drips into deep undergrowth',
      'PICKING UP SIGNET RING — kneeling beside an open grave, dusting earth from a ring of forgotten royalty, expression caught between dread and triumph',
      'PULLING SWORD FROM STONE — both hands gripping ornate hilt embedded in ancient menhir, muscles taut, runes along the blade beginning to glow',
      'CASTING WARD CIRCLE — kneeling in chalk-drawn protective ring on tavern floor, scattering bone-runes, breath ghosting in suddenly cold air',
      'ANOINTING ALTAR WITH BLOOD — pressing cut palm to stone altar, blood-runes appearing where her hand passes, eyes shut in concentration',
      'CONSOLING WOUNDED ALLY — kneeling beside fallen companion, his head in her lap, pressing folded cloth to chest-wound, eyes hard with resolve',
      'NEGOTIATING WITH MERCHANT — leaning across counter of caravan-wagon, pouch of coin in one hand, scroll in other, merchant\'s sly grin in shadow',
      'CROSSING ROPE BRIDGE OVER GORGE — mid-step on swaying plank-and-rope bridge, hands gripping guide ropes, gorge yawning a thousand feet below',
      'SCALING FORTRESS WALL — clinging to stones partway up castle wall, climbing-hooks in hand, shadow-cloak pulled tight, sentries pacing far below',
      'READING FORBIDDEN SCROLL — kneeling alone in library, unrolled scroll spread on floor, candle guttering, eyes wide reading something forbidden',
      'BRUSHING DUST FROM CARVED SIGIL — half-buried in ancient ruin, gentle fingertip clearing sand from glowing rune, expression of awe',
      'LIFTING CLOTH FROM TREASURE — peeling silk away from chest of pirate-gold and jeweled crowns, lamplight catching on hoard, breath caught',
      'PULLING REIN AT CROSSROADS — atop dark horse paused at signpost in twilight, gloved hand resting on saddle pommel, reading the carved directions',
      'STANDING WATCH ON BATTLEMENT — silhouetted on castle wall at dusk, longbow strung at her side, fog rolling in across the moor below',
      'OPENING ANCIENT GRIMOIRE — seated cross-legged at flat stone slab in ruined library, hand reverently flipping vellum page, dust motes in sunbeam',
      'CONSULTING BONE-RUNES — crouched at flat stone with carved animal-bones cast in pattern, fingertips tracing the spread, reading the future',
      'LEANING OVER SADDLE PURSUING TRAIL — galloping low along forest path, eyes locked on hoof-prints in the mud, lantern swinging from horn',
      'LIGHTING FUNERAL PYRE — extending burning torch toward fallen comrade laid on wood-stack, sunset turning sky blood-red behind her',
      'CUTTING PALM TO SEAL PACT — extending bleeding hand toward shadowy figure across stone altar, blood dripping onto rune-carved surface',
    ],
    instructions: `Each entry is ONE story-rich non-combat moment, 25-45 words. Format: "ACTION-CAP — body position + specific prop/object + specific location detail + cinematic tension". Story-loaded NOT mundane. NEVER chores (sharpening / polishing / lacing / drinking water / eating). NEVER stock poses (scanning horizon / kneeling at shrine). Every entry has STAKES or DISCOVERY or INFILTRATION or RITUAL. Variety mandate: cover infiltration / exploration / mystery / interaction / riding / threat / ritual / discovery. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },
  female_warrior_landscape: {
    theme: 'Fantasy landscapes serving as the STAGE for a female warrior in a peaceful moment — biomes she travels through or rests in. NOT generic painted backdrop. Specific epic-fantasy locations with multi-layer depth. LOTR / GoT / Elden Ring / Skyrim / Witcher tradition. Each entry 30-55 words.',
    touchpoints: [
      'misty primeval forest with thousand-year trees and shaft-of-light through canopy',
      'wind-carved desert mesa with bone-bleached stone at sunset',
      'high alpine pass above clouds with snow-capped peaks',
      'autumn-foliage valley with river snaking through',
      'enchanted bioluminescent forest with glowing fungi',
      'ancient ruined city overgrown with moss and ivy',
      'storm-wracked coastal cliffs with crashing waves below',
      'tavern interior with timber beams, hearth glow, and patrons',
      'mountain monastery courtyard on impossible spire',
      'royal city skyline at dusk with golden domes',
      'frozen glacier canyon with cathedral ice-pillars',
      'volcanic foothills with lava rivers and ash plumes',
      'twilight battlefield aftermath strewn with banners',
      'sea-cliff fortress with foaming waves below',
      'tundra plains under aurora borealis',
    ],
    instructions: `Each entry is ONE fantasy landscape, 30-55 words. Format: "[landscape type] with [signature feature + texture detail + atmospheric depth]". Must include FOREGROUND tactile detail + MIDGROUND form + DEEP DISTANCE atmospheric layer. Variety: mountain / forest / desert / coastal / ruin / tavern-interior / city / glacier / volcanic / battlefield. Output JSON array of strings.`,
  },
  female_warrior_drama: {
    theme: 'Environmental / atmospheric drama woven into the warrior scene — a 40%-gated event that adds awe but never combat. LOTR / GoT / Skyrim weather/cosmic-event language. Each entry 25-50 words. NO violence, NO battle, NO enemies.',
    touchpoints: [
      'LIGHTNING STORM — bolt cracking across distant sky',
      'AURORA BOREALIS — green-and-violet curtains over peaks',
      'METEOR SHOWER — streaks of fire crossing the heavens',
      'BLOOD MOON — massive crimson moon over horizon',
      'ECLIPSE — sun ringed in fire-corona',
      'RAINBOW — full arc spanning misty valley after rain',
      'COMET — bright tailed body crossing sky',
      'MAGICAL VORTEX — swirling glowing portal mid-air in distance',
      'DAWN GOD-RAY — single column of sunlight piercing clouds',
      'FOG ROLLING IN — wall of mist crossing the valley',
      'FALLING LEAVES — gold-orange autumn shower in still air',
      'SNOWFALL — heavy flakes drifting through still scene',
      'DRAGON IN DISTANCE — winged silhouette mid-flight at far horizon',
      'SHOOTING STAR — single bright streak overhead',
      'WILL-O-WISP CLUSTER — floating lantern-spirits in misty grove',
    ],
    instructions: `Each entry is ONE atmospheric/environmental drama, 25-50 words. Format: "EVENT-CAP — visible description and where in the scene". Adds awe / story to the frame. NO violence. Output JSON array of strings.`,
  },
  female_warrior_surprise_element: {
    theme: 'Tiny secondary subjects that add story to a warrior scene — a small element at midground or deep midground implying a wider world. Each entry 15-40 words.',
    touchpoints: [
      'a fox watching from underbrush',
      'distant pilgrim figures on far ridge',
      'crashed wagon with scattered cargo',
      'small dragon perched on far tower',
      'wildflower patch in foreground',
      'tied-up horse at the edge of frame',
      'broken sword half-buried in earth',
      'ancient stone marker carved with runes',
      'banner flapping atop distant pole',
      'fallen helm with vines growing through',
      'wind-bent prayer flags strung across path',
      'small cooking fire in middle distance',
      'tracks of a large beast in mud',
      'ruined statue half-overgrown',
      'crow perched on outcrop',
    ],
    instructions: `Each entry is ONE tiny secondary subject, 15-40 words. Format: "ELEMENT — visual description + placement in scene". Small element implying a wider world. NO violence, NO enemies. Output JSON array of strings.`,
  },
  // ─── DRAGONBOT artsy-girl path-bespoke pools (2026-05-13 — frozen clone) ─
  // Exact clones of female_warrior_* recipes at the moment Kevin loved the
  // Frazetta-cheesecake painted-fantasy-cover output. Cloned so this path's
  // pools can be regenerated independently — future female_warrior tuning
  // (race-lock / armor-coverage) lives in the recipes above, this aesthetic
  // lives here, locked.
  artsy_girl_outfit: {
    // Bypass the Rich Scene Seed scaffold — outfit pool should describe the
    // ARMOR itself, not the FG/MG/Deep/Sky setting. R1 pool (200 entries) was
    // ~88% scene-polluted because Sonnet followed the scaffold over the
    // recipe. Simple format forces theme+instructions only.
    format: 'simple',
    theme: 'EXOTIC FANTASY-NOVEL-COVER battle outfit for a heroic adventurer woman. Frank Frazetta / Boris Vallejo / Brom / Hildebrandt / Michael Whelan painted-fantasy-cover lineage. Sleek, sexy, body-readable, painterly — the iconic Frazetta-cheesecake silhouette is ON THE TABLE. The mission is VISUAL VARIETY across exotic armor styles + diverse weapons. Time-period LOTR / D&D / GoT / Witcher / Skyrim / Conan / Warhammer / Forgotten Realms / Eastern fantasy. Each entry 30-60 words describing the ARMOR + WEAPON + signature visual flourish.\n\nVARIETY MANDATE — across the pool, NO entry should look like another. Vary every axis:\n• METAL/MATERIAL palette: mirror-bright steel / patinated bronze / blackened obsidian / dragonscale / chitin / silvered elven mithril / lacquered red / hammered copper / ivory bone-plate / pearl-and-gold / verdigris-green bronze / brushed gunmetal\n• ARMOR ARCHETYPE: full engraved breastplate / asymmetric single-pauldron warrior / lamellar Eastern scale / segmented banded mail / dragon-bone curved cuirass / mail hauberk / leather harness with armor accents / scale-and-leather hybrid / ornate paladin plate / minimalist battle-bra-and-greaves rogue / chitin shell / fur-and-bone barbarian (yes fur ok if barbarian-coded only) / runic-glowing plate / coral-and-pearl aquatic / desert nomad leather-and-cloth wrap\n• CULTURE / FLAVOR: Norse Valkyrie / Roman gladiatrix / samurai-coded ronin / Persian-coded shamshir-wielder / Aztec-coded warrior-priestess / Mongol horse-lord / barbarian Conan-coded / dark-elf assassin / blood-elf paladin / dragonborn warlord / tiefling demon-hunter / desert corsair / arctic Skyrim Stormcloak / forest druidic / underdark explorer\n• WEAPON: longsword / great-axe / two-handed warhammer / war-spear / glaive / longbow + arrow-quiver / crossbow / twin scimitars / runeblade / war-staff / chain-flail / katar pair / khopesh / kukri / war-pick / falchion / saber / curved dao / ornate halberd / bone-spike club / runed throwing-axes\n• SIGNATURE FLOURISH: glowing runes / tribal facepaint / dragon-skull pauldron / horn-helm / hooded cowl / chain-veil / ornate jewelry / blood-clan tattoos / silver mask / antler headdress / feather-cloak / chain-belt of trophies',
    touchpoints: [
      'Norse Valkyrie — mirror-bright winged steel breastplate, twin shoulder pauldrons with raven engravings, chainmail skirt over fitted leggings, longsword at hip, round shield on back',
      'Roman gladiatrix — bronze segmented banded mail across torso, leather pteruges skirt, single bronze pauldron, manica forearm-guard, gladius at hip, trident in hand',
      'Conan barbarian-coded — minimal leather-and-fur harness with bone-spike pauldron, broadsword strapped to back, chain-belt of skull-trophies, thigh-wraps and animal-hide boots',
      'Drow shadowblade — fitted obsidian-black hardened leather cuirass studded with chitin shards, hooded cowl pulled back, twin curved scimitars in cross-back harness, spider-emblem chest sigil',
      'Tiefling demon-hunter — black-leather corset cuirass embossed with infernal script, asymmetric single shoulder-spike pauldron, chain-veil over half her face, twin hand-crossbows on thigh',
      'Samurai-coded ronin warrior — lacquered red-and-gold lamellar scale armor with bound silk underrobe, single katana strapped low-belt, geta-style sandals, ornate horn-helm tucked under arm',
      'Persian-coded shamshir-wielder — segmented scale-cuirass in copper-green patina, beaded chain-belt, curved shamshir saber across hip, silk turban-wrap with brass coin-mail veil',
      'Aztec-coded warrior-priestess — feathered shoulder-mantle in turquoise and gold, jaguar-pelt half-cloak, obsidian-shard-edged macahuitl sword, jade ear-plugs, painted face-stripes',
      'Mongol horse-lord — layered lamellar scale across chest, fur-lined collar (winter steppe only), recurve composite bow + thigh-quiver, curved dao saber on saddle-belt, conical riveted helm',
      'Witcher-coded monster-hunter — fitted black leather coat-armor with chainmail panels and silver studs, twin sword cross-back harness (silver + steel), bandolier of glowing potion vials',
      'High-elf magus-warrior — mithril mail bodysuit in silver-and-pearl iridescence, asymmetric runic pauldron, war-staff with floating gem, longbow + quiver across back',
      'Blood-elf paladin — ornate red-and-gold engraved breastplate carved with phoenix motif, glowing rune-bracers, two-handed warhammer on back, twin braided side-tails',
      'Dragonborn warlord — full dragonscale cuirass in bronze-and-obsidian iridescent pattern, massive horned shoulder-pauldrons, dragon-tooth necklace, great-axe slung across back',
      'Sorceress-warrior — fitted dark-violet leather harness with floating rune-sigils glowing along sternum, war-staff topped with crystal orb, twin daggers at thighs, half-cape of starfield silk',
      'Desert nomad corsair — sun-bleached leather harness with brass rivets, layered cloth wraps in sand-colored silks, goggles pushed to forehead, scimitar and kukri pair on hip-belt',
      'Arctic Stormcloak — fitted blackened-steel banded mail (no fur), studded leather kilt, war-axe and shortbow combo, bear-skull pauldron on one shoulder, twin braids and warpaint',
      'Underdark drow ranger — silver-and-black chitin segmented chest-plate, hooded shadowsilk cloak, hand-crossbow on each thigh, twin shortswords in hip-sheaths, glowing spider-eye gem at throat',
      'Dragonbone necromancer-warrior — curved dragon-rib cuirass bound with leather strapping, skull-pauldron on one shoulder, bone-spike war-club, blood-runes painted across midriff',
      'Coral-and-pearl aquatic warrior — iridescent scale-armor in teal and pearl, trident in hand, finned helm with cresting wave-motif, sea-shell ornaments at her belt',
      'Forest druidic ranger — green-and-brown leaf-pattern fitted leather, antler headdress, longbow + leaf-fletched arrows, hand-axe on belt, vine-and-moss accents on pauldron',
    ],
    instructions: `Each entry is ONE exotic painted-fantasy-cover battle outfit, 30-60 words. Format: "[ARCHETYPE NAME / CULTURE — short headline] — [armor description: material + cut + fit] + [named visible armor pieces] + [signature weapon] + [signature flourish: runes / tattoos / ornaments / helm]". The body describes the OUTFIT, never the location. Frazetta-cheesecake silhouette is allowed and encouraged — sleek, sexy, body-readable. The MISSION is exotic VARIETY: every entry must look DIFFERENT from every other entry in metal palette, armor archetype, cultural flavor, AND weapon. NO TWO entries share the same weapon. NO TWO share the same metal palette. Push exotic: lamellar / scale / chitin / dragonbone / coral / mithril / lacquered / ornate-engraved / desert-nomad-wrap / barbarian-fur-and-bone / samurai-bound-silk. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },
  artsy_girl_action: {
    theme: 'Peaceful adventuring / candid / lineage-flavored moments for a female fantasy warrior — caught between battles, never in one. NO combat, NO mid-strike, NO weapon-aimed-at-foe. Hiking, traveling, in a tavern, breaking camp, scouting, polishing a sword, sharpening a blade, looking out from a cliff, eating by a campfire, sitting in a hostel, drawing a map, talking to a horse, drinking from a stream, examining a relic, fastening armor, lacing boots, etc. Each entry 20-40 words. CINEMATIC mid-moment, body in motion or candid stillness — never staged posing.',
    touchpoints: [
      'CLIMBING ROCKY PATH — three-point contact ascending switchback',
      'POLISHING SWORD — kneeling beside campfire, cloth in hand',
      'DRINKING FROM STREAM — crouched, cupped hands raised to lips',
      'LACING BOOTS — seated on log at dawn',
      'EATING BY CAMPFIRE — bowl in hand, fire glow on face',
      'TALKING TO HORSE — hand on muzzle, leaning close',
      'SCANNING HORIZON — hand to brow on cliff overlook',
      'STUDYING MAP — kneeling at table in tavern',
      'EXAMINING ARTIFACT — turning relic in firelight',
      'FASTENING ARMOR — adjusting shoulder strap',
      'TENDING WOUND — wrapping bandage on her own forearm',
      'SHARPENING BLADE — whetstone in motion',
      'WAKING AT DAWN — sitting up in bedroll, stretching',
      'WALKING THROUGH MARKET — head turned to a vendor',
      'LINEAGE PRAYER — kneeling at small shrine of her people',
    ],
    instructions: `Each entry is ONE peaceful adventuring moment, 20-40 words. Format: "ACTION-CAP — body position + visible detail (tool / object / setting)". Captured at a candid loaded instant. NEVER in combat. NEVER mid-strike. Variety: travel / camp / tavern / inn / shrine / wilderness / town. Output JSON array of strings.`,
  },
  artsy_girl_landscape: {
    theme: 'Fantasy landscapes serving as the STAGE for a female warrior in a peaceful moment — biomes she travels through or rests in. NOT generic painted backdrop. Specific epic-fantasy locations with multi-layer depth. LOTR / GoT / Elden Ring / Skyrim / Witcher tradition. Each entry 30-55 words.',
    touchpoints: [
      'misty primeval forest with thousand-year trees and shaft-of-light through canopy',
      'wind-carved desert mesa with bone-bleached stone at sunset',
      'high alpine pass above clouds with snow-capped peaks',
      'autumn-foliage valley with river snaking through',
      'enchanted bioluminescent forest with glowing fungi',
      'ancient ruined city overgrown with moss and ivy',
      'storm-wracked coastal cliffs with crashing waves below',
      'tavern interior with timber beams, hearth glow, and patrons',
      'mountain monastery courtyard on impossible spire',
      'royal city skyline at dusk with golden domes',
      'frozen glacier canyon with cathedral ice-pillars',
      'volcanic foothills with lava rivers and ash plumes',
      'twilight battlefield aftermath strewn with banners',
      'sea-cliff fortress with foaming waves below',
      'tundra plains under aurora borealis',
    ],
    instructions: `Each entry is ONE fantasy landscape, 30-55 words. Format: "[landscape type] with [signature feature + texture detail + atmospheric depth]". Must include FOREGROUND tactile detail + MIDGROUND form + DEEP DISTANCE atmospheric layer. Variety: mountain / forest / desert / coastal / ruin / tavern-interior / city / glacier / volcanic / battlefield. Output JSON array of strings.`,
  },
  artsy_girl_drama: {
    theme: 'Environmental / atmospheric drama woven into the warrior scene — a 40%-gated event that adds awe but never combat. LOTR / GoT / Skyrim weather/cosmic-event language. Each entry 25-50 words. NO violence, NO battle, NO enemies.',
    touchpoints: [
      'LIGHTNING STORM — bolt cracking across distant sky',
      'AURORA BOREALIS — green-and-violet curtains over peaks',
      'METEOR SHOWER — streaks of fire crossing the heavens',
      'BLOOD MOON — massive crimson moon over horizon',
      'ECLIPSE — sun ringed in fire-corona',
      'RAINBOW — full arc spanning misty valley after rain',
      'COMET — bright tailed body crossing sky',
      'MAGICAL VORTEX — swirling glowing portal mid-air in distance',
      'DAWN GOD-RAY — single column of sunlight piercing clouds',
      'FOG ROLLING IN — wall of mist crossing the valley',
      'FALLING LEAVES — gold-orange autumn shower in still air',
      'SNOWFALL — heavy flakes drifting through still scene',
      'DRAGON IN DISTANCE — winged silhouette mid-flight at far horizon',
      'SHOOTING STAR — single bright streak overhead',
      'WILL-O-WISP CLUSTER — floating lantern-spirits in misty grove',
    ],
    instructions: `Each entry is ONE atmospheric/environmental drama, 25-50 words. Format: "EVENT-CAP — visible description and where in the scene". Adds awe / story to the frame. NO violence. Output JSON array of strings.`,
  },
  artsy_girl_surprise_element: {
    theme: 'Tiny secondary subjects that add story to a warrior scene — a small element at midground or deep midground implying a wider world. Each entry 15-40 words.',
    touchpoints: [
      'a fox watching from underbrush',
      'distant pilgrim figures on far ridge',
      'crashed wagon with scattered cargo',
      'small dragon perched on far tower',
      'wildflower patch in foreground',
      'tied-up horse at the edge of frame',
      'broken sword half-buried in earth',
      'ancient stone marker carved with runes',
      'banner flapping atop distant pole',
      'fallen helm with vines growing through',
      'wind-bent prayer flags strung across path',
      'small cooking fire in middle distance',
      'tracks of a large beast in mud',
      'ruined statue half-overgrown',
      'crow perched on outcrop',
    ],
    instructions: `Each entry is ONE tiny secondary subject, 15-40 words. Format: "ELEMENT — visual description + placement in scene". Small element implying a wider world. NO violence, NO enemies. Output JSON array of strings.`,
  },
  // ─── DRAGONBOT female-warrior path: comprehensive rogue/ranger/hunter
  // archetype pool (2026-05-13). Each entry is a COMPLETE character
  // archetype: race + class-role + outfit + visible weapons + signature
  // flourish. Sonnet rolls ONE per render and weaves it into the body, so
  // the wrapper no longer needs the comma-soup character template.
  female_warriors: {
    format: 'simple',
    theme: 'COMPREHENSIVE FANTASY ADVENTURER WOMAN archetype — each entry is ONE complete character: fantasy lineage + class role (ROGUE / RANGER / HUNTER / SCOUT / ASSASSIN / SPELLBLADE / TRACKER / SHADOW DANCER / WILD MAGE / SCOUT) + form-fitting sleek leather/cloth outfit + visible weapons + signature flourish (tattoos / cowl / facepaint / trophies / amulet). Frank Frazetta painted-fantasy-novel-cover tradition BUT rogue/ranger-coded NOT paladin-coded. NEVER plate-armored. NEVER bikini-armor cheesecake. NEVER exposed-chest. Sleek + functional + dark + dangerous.\n\nABSOLUTE BANS:\n• NO plate-armored paladin / valkyrie / shieldmaiden look\n• NO bikini-armor / bare-midriff / chainmail-bikini / pasties\n• NO ornate gold-and-bronze cuirass\n• NO sword-and-shield template\n• NO long flowing dresses\n\nMANDATORY in every entry:\n• Form-fitting sleek leather OR fitted hide OR close-fit dark cloth\n• Visible practical weapons (NOT longsword default — daggers / bow / crossbow / kukri / war-pick / twin shortswords / hand-crossbow / throwing-axes / blowgun / spell-rod / glaive / chain-flail)\n• Hooded cowl OR utility-belt OR thigh-harness OR cross-back harness\n• Race-coded anatomy from rolled lineage (drow / wood-elf / halfling / dwarf / orc / human varied culture)\n\nVARIETY MANDATE — every entry differs on:\n• RACE: Drow / Wood-elf / High-elf / Half-elf / Halfling / Hill dwarf / Mountain dwarf / Half-orc / Orc / Human-coded varied culture (Norse / Persian / Mongol / Aztec / Roman / Bedouin)\n• ROLE: Shadow-blade assassin / Forest ranger / Crossbow scout / Wild hunter / Spellblade / Tracker / Tomb burglar / Beast-master / Wandering swordswoman / Mystic shadow-dancer\n• OUTFIT MATERIAL: oiled black leather / forest-green hide / tan suede / blackened studded leather / pale linen wraps / dark waxed cloak / scaled brigandine / hardened lacquered leather\n• WEAPON: twin shortswords / longbow + quiver / heavy crossbow / hand-crossbow / twin daggers / war-pick / kukri / glaive / katana / spear / sai pair / chain-flail / spell-rod\n• FLOURISH: hooded cowl / tribal facepaint / clan-tattoos / scar across cheek / silver mask / antler-pin cloak / bone-trophy belt / glowing rune-bracers',
    touchpoints: [
      'Drow shadow-blade assassin in fitted obsidian-black leather harness with cowl pulled low over ash-grey face, twin shortswords cross-back, throwing-daggers strapped to thigh',
      'Wood-elf forest ranger in green-and-brown fitted hide with longbow and leaf-fletched quiver across back, hand-axe on belt, antler-pin cloak',
      'Halfling burglar in close-fit dark cloak over kid leather, hand-crossbow concealed under cloak, lockpick kit at belt, hooded cowl framing weathered freckled face',
      'Mountain dwarf crossbow scout in stout reinforced gambeson with steel-plate accents, heavy crossbow on shoulder, hand-axe at belt, braided red beard-rings',
      'Half-orc wild hunter in fur-trimmed leather with bone trophies, recurve composite bow and arrow-quiver across back, hand-axe on hip, blue tribal facepaint',
      'High-elf spellblade in fitted black-and-silver leather with mithril runes along sleeves, twin curved daggers at hips, glowing sigil-tattoos coiling down both arms',
      'Persian-coded tracker in tan suede over loose silk under-tunic, recurved horsebow and falcon-fletched arrows on hip-quiver, scimitar in silvered scabbard at her side',
      'Norse skald-ranger in dark wool cloak over fitted leather, double-bladed axe on hip, throwing-axes on bandolier across chest, runic-tattoo cheek-mark',
      'Mongol horse-hunter in lacquered black leather lamellar over winter felt, recurve horsebow, hand-crossbow on saddle-belt, conical riveted helm tucked under arm',
      'Drow underdark scout in fitted dark-purple leather brigandine, hooded shadowsilk cloak, twin shortswords cross-back, glowing spider-eye gem at throat',
      'Roman gladiator-scout in fitted bronze-banded leather over dark linen wraps, gladius at hip, throwing-pila across back, manica forearm-guard',
      'Wandering swordswoman in close-fit dark linen over leather under-armor, single longsword in worn leather scabbard at hip, traveling cloak with road-dust',
      'Aztec-coded jaguar-priestess hunter in jaguar-pelt half-cloak over fitted leather, obsidian-edged macahuitl sword, atlatl + dart-quiver, jade ear-plugs and red face-stripes',
      'Bedouin-coded sand-tracker in sun-bleached linen wraps over leather harness, curved khopesh on hip, throwing-knives on thigh, indigo veil',
      'Halfling thief in close-fit grey leather with pouches everywhere, twin daggers and short-club at belt, hooded cloak framing freckled face, lockpicks tucked in sleeve',
      'Human spellblade in fitted dark-blue silk-and-leather, glowing rune-staff in hand, twin curved daggers at hips, magic sigils coiling across sternum and arms',
      'Hill dwarf war-hunter in stout brown leather with iron rivets and steel pauldrons, heavy war-axe on back, hand-crossbow on hip, braided dark beard',
      'Wood-elf druid-ranger in moss-green hide and fern-wrapped cloak, recurve bow + leaf-arrow quiver, hand-sickle at belt, antler-crown headdress',
      'Drow rogue-monk in fitted black silk over leather under-armor, twin sai at hips, throwing-stars in chest-bandolier, head-wraps with one eye visible',
      'Half-elf night-tracker in fitted dark hide with bone-charm necklaces, longbow + black-feather quiver, hand-axe and skinning knife at belt',
      'Wild-mage shadowblade in fitted black-and-violet leather, glowing wand at hip, twin curved daggers, sigil-tattoos pulsing faintly across cheek and neck',
      'Half-orc raider-scout in fur-and-bone leather harness, double-bladed throwing-axes on chest-bandolier, war-pick on hip, blood-clan facepaint',
      'Orc beast-master in close-fit hide with bone-spike pauldron, recurve bow + arrow-quiver, hand-axe at belt, raven-feather cloak',
      'Halfling forest scout in green-and-brown hide with leaf-pattern cloak, recurve bow + leaf-fletched arrows, hand-knife at belt, freckled cheery face',
      'Drow priestess-assassin in fitted obsidian leather with spider-emblem chest sigil, twin scimitars cross-back, glowing red eyes, web-pattern arm tattoos',
      'Human ronin-coded swordswoman in faded dark hakama and fitted lacquered cuirass-vest, single katana in worn scabbard at hip, frayed traveling cloak',
      'Mountain dwarf crossbow-scout in plate-reinforced leather, heavy crossbow with bolt-quiver, war-hammer on hip, iron-braided beard',
      'Wood-elf wandering hunter in tan-and-green hide with fur-trim shoulders, hand-crossbow and shortsword, antler-and-feather hair-braids',
      'Halfling pilgrim-scout in close-fit grey hide with hooded cowl, throwing-knives on chest-bandolier, walking-staff in hand, weathered freckled face',
      'Drow rangefinder in fitted dark-purple brigandine with web-pattern engravings, twin hand-crossbows on thigh-harnesses, twin shortswords cross-back',
    ],
    instructions: `Each entry is ONE comprehensive fantasy adventurer archetype, 30-50 words. Format: "[Race] [class-role] in [outfit material + cut] with [named visible weapons] + [signature flourish: cowl / tattoo / facepaint / trophies / amulet]". NEVER mention longsword/great-sword/plate-armor/bikini-armor/cheesecake. Variety mandate: every entry must differ on race + role + outfit material + weapon + flourish. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },
  // ─── DRAGONBOT dragon-scene path-bespoke pools (2026-05-14) ──────────────
  // Stage 1 MVP — 30 entries each. Scaled later only after Kevin signs off
  // on render quality.
  dragon_scene_dragon: {
    theme: 'TRADITIONAL WESTERN high-fantasy dragon ANATOMY + signature visual identity — Smaug / LOTR / GoT / Elden Ring / Skyrim / Warcraft / D&D archetype. Each entry describes ONE dragon at full body — scale color + horn pattern + wing character + body distinguishing features. NO ACTION (action is a separate axis). NO Eastern serpentine dragons, NO wyverns (must be 4 legs + 2 wings). NO RIDERS / NO HUMANS. Each entry 25-50 words.',
    touchpoints: [
      'Smaug — golden scales, smoke-stained breath, jewel-glinting belly',
      'crimson red-and-black with bone-spike crest and torn wing membranes',
      'obsidian-black with cracked ivory horns and milky blind eye',
      'frost-rimed sapphire with cathedral wingspan and ice-crusted spine',
      'forest-green with moss-grown shoulders and amber lantern eyes',
      'desert-tan with sun-bleached crest and sandstorm-tattered wings',
      'volcanic ember-orange cracked-stone hide with magma-veins glowing',
      'storm-grey with lightning-scarred wings and thundercloud breath',
      'ancient bronze with patinated scales and gold-leaf belly',
      'twilight-purple iridescent with starfield wing-membranes',
      'pale white-silver with frostbite eyes and crystal horns',
      'corrupted black-rot with diseased flesh exposed between scales',
      'royal scarlet-and-gold with crown-like horn array',
      'swamp-mottled green-brown with algae-slick hide',
      'glass-clear scales reflecting the sky like prismatic mirror',
    ],
    instructions: `Each entry is ONE specific Western dragon, 25-50 words. Format: "[primary color/scale type] dragon with [distinguishing horn/wing/eye/body trait] and [signature visible texture]". Variety required across hue / horn pattern / wing character / body size / unique-feature (scar / glow / mineral-coating / battle-damage). NO action verbs ("breathing fire" / "flying" / "perched" all banned — those go in dragon_action pool). ALWAYS 4 legs + 2 wings + horned reptilian skull (Western anatomy mandatory). Output JSON array of strings.`,
  },
  dragon_scene_action: {
    theme: 'Mid-action dragon moments — what the dragon is DOING right now in the frame. Cinematic, captured at a loaded instant. Movie-poster moments. Skyrim / GoT / LOTR / Elden Ring tradition. Each entry 20-40 words.',
    touchpoints: [
      'MID-ROAR — jaw extended wide, throat glowing with fire about to release',
      'BREATHING FIRE — cone of flame mid-arc, smoke trailing from nostrils',
      'BANKING IN FLIGHT — wings tilted hard, body rolling through air',
      'PERCHED ON CLIFF — wings half-furled, claws gripping stone, watching below',
      'EMERGING FROM CAVE — head and forelegs out of darkness, eyes glowing',
      'CLUTCHING PREY — talons sunken into mountain-goat carcass, mid-feed',
      'SLEEPING ON HOARD — curled around gold pile, smoke wisp from nostrils',
      'CLAWING THE SKY — rearing on hindlegs, foreclaws striking up at something',
      'GLIDING LOW — wings fully extended, skimming over forest canopy',
      'TAIL LASHING — full body coiled, tail mid-strike at an unseen target',
      'TAKING OFF — pushing off from ground, dust kicking, wings beating',
      'LANDING — descending on outstretched legs, wings cupping air',
      'INSPECTING ARTIFACT — head lowered, eye examining glowing relic at clawtip',
      'CHALLENGING ROAR — head thrown back, neck stretched, sky-shaking bellow',
      'STALKING — body low, neck extended, eyes locked on offscreen quarry',
    ],
    instructions: `Each entry is ONE cinematic mid-action dragon moment, 20-40 words. Format: "ACTION-CAP — body position + what's visible (jaw / wings / claws / tail / fire / smoke / debris)". Captured at the loaded instant. NEVER static perched-and-staring (unless that's the explicit beat). Variety: combat / flight / hunting / feeding / sleeping / takeoff / landing / interaction. Output JSON array of strings.`,
  },
  dragon_scene_landscape: {
    theme: 'Epic high-fantasy landscapes worthy of a dragon — biomes where dragons live in LOTR / GoT / Skyrim / Elden Ring / Warcraft. NOT generic mountain — specific epic landscape types. Each entry 30-60 words with multi-layer depth.',
    touchpoints: [
      'jagged volcanic mountain range with lava rivers and ash plumes',
      'frozen glacial canyon with cathedral ice-pillars',
      'misty primeval forest with thousand-year trees',
      'wind-carved desert mesa with bone-bleached stone',
      'storm-wracked coastal cliffs with crashing waves',
      'ancient ruined city overgrown with moss and ivy',
      'high alpine peaks above clouds with golden-hour light',
      'twilight battlefield strewn with bodies and broken banners',
      'enchanted bioluminescent forest with glowing mushrooms',
      'cavern interior with crystal formations and lava pool',
      'dragon-graveyard valley with massive skeletal remains',
      'royal city skyline with golden domes at sunset',
      'autumn-foliage valley with river snaking through',
      'mountain monastery on impossible spire',
      'sea-cliff fortress with foaming waves below',
    ],
    instructions: `Each entry is ONE epic fantasy landscape, 30-60 words. Format: "[landscape type] with [signature features + texture detail + atmospheric depth]". Must include FOREGROUND tactile detail + MIDGROUND form + DEEP DISTANCE atmospheric layer. NEVER flat backdrop. Variety: mountain / glacial / forest / desert / coastal / ruin / sky-island / battlefield / cavern / city. Output JSON array of strings.`,
  },
  dragon_scene_drama: {
    theme: 'Environmental DRAMA woven into the dragon scene — a 40%-gated atmospheric event happening in the world around the dragon. LOTR / GoT / Skyrim weather/cosmic-event language. Each entry 25-50 words.',
    touchpoints: [
      'LIGHTNING STORM — bolt cracking across sky behind dragon',
      'AURORA BOREALIS — green-and-violet curtains over peaks',
      'VOLCANIC ERUPTION — distant volcano blowing ash plume kilometers high',
      'BLOOD MOON — massive crimson moon dominating sky',
      'METEOR SHOWER — streaks of fire crossing the heavens',
      'ECLIPSE — sun ringed in fire-corona, world half-dark',
      'AVALANCHE — wall of snow tumbling down distant mountain face',
      'TORNADO — funnel cloud touching plains in middle distance',
      'TSUNAMI — wave wall rising over coastal horizon',
      'RAINBOW — full arc spanning misty valley after storm',
      'COMET — bright tailed body crossing sky overhead',
      'MAGICAL VORTEX — swirling glowing portal mid-air in distance',
      'WILDFIRE — orange flames consuming distant forest',
      'BLIZZARD — wall of snow-flurry sweeping across plain',
      'GOD-RAY — single column of sunlight piercing thunderclouds',
    ],
    instructions: `Each entry is ONE atmospheric/environmental drama event, 25-50 words. Format: "EVENT-CAP — visible description of what's happening and where in the scene". Adds awe / drama / story to the frame. Output JSON array of strings.`,
  },
  dragon_scene_surprise_element: {
    theme: 'Tiny secondary subjects that add story to a dragon scene — a small element placed at midground or deep midground that implies a wider world. Each entry 15-40 words.',
    touchpoints: [
      'tiny knight on distant cliff, sword drawn',
      'ruined castle silhouette on far ridge',
      'second smaller dragon distant in flight',
      'treasure hoard glinting in cave mouth',
      'pile of bones at the dragon feet',
      'distant village with smoke rising',
      'banner-bearing army formation at far edge',
      'crashed flying ship fragments scattered',
      'wizard tower with glowing window',
      'ancient stone circle in valley below',
      'rider on flying mount distant in sky',
      'pilgrim caravan winding through pass',
      'cave-mouth glowing with inner forge-light',
      'fallen colossus statue half-buried',
      'shipwreck on rocks at coastline',
    ],
    instructions: `Each entry is ONE tiny secondary subject, 15-40 words. Format: "ELEMENT — visual description + where it sits in the scene". Small element implying a wider world. Output JSON array of strings.`,
  },
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
  const outPath = path.resolve(`scripts/bots/dragonbot/seeds/${POOL}.json`);
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
