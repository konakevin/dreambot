#!/usr/bin/env node
/**
 * Generate a MechBot axis pool using Sonnet.
 *
 * Mirrors the gen-dragonbot-pool.js / gen-gothbot-pool.js infrastructure:
 * signature-based dedup, --target iterative gen+dedup loop, append-mode
 * preservation of existing entries. Pool recipes are MechBot-bespoke.
 *
 * Usage:
 *   node scripts/gen-mechbot-pool.js --pool titan_war_lighting --target 50
 *   node scripts/gen-mechbot-pool.js --pool titan_war_drama --target 50
 *   node scripts/gen-mechbot-pool.js --pool titan_war_composition --target 15
 *
 * Output: scripts/bots/mechbot/seeds/<pool>.json
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
const COUNT = parseInt(flag('count', '30'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');

if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--target N] [--dry-run]');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────
// POOL RECIPES — MechBot bespoke (titan-war-machines path, 2026-05-15)
// ─────────────────────────────────────────────────────────────

const POOL_RECIPES = {
  // ════════════════════════════════════════════════════════════════
  // scifi-cyborg-female — NEW from-scratch path (2026-06-09)
  // "Truly out there" exotic alien-cyborg females. NO baggage from the
  // legacy cyborg-woman beauty-portrait. Alien races + extreme cyborg
  // fusion + wow-inducing. Tasteful-sexy via exotic elegance, NOT pinup.
  // ════════════════════════════════════════════════════════════════
  scifi_cyborg_xeno_being: {
    format: 'simple',
    theme: `EXOTIC ALIEN-CYBORG FEMALE BEINGS — the HERO axis. Each entry is ONE wildly distinct otherworldly cyborg woman: her ALIEN SPECIES / lineage + her non-human anatomy + how machine technology fuses into her body + the exotic MATERIAL her body is made of. 30-45 words. This is the single biggest variety lever — EVERY entry must be a DIFFERENT alien race so no two renders feel alike.

⚠️ THE BAR — "WOW, what IS that?!" This is an AI dream-image app; the subject is perfect material to go FULLY exotic. Think Final-Fantasy summon / Mass Effect alien / Horizon machine / Nier automata / Cronenberg-beauty / Giger-elegant / Avatar-Na'vi-meets-machine / bioluminescent-deep-sea-goddess. She is SIMULTANEOUSLY a beautiful feminine being AND something genuinely alien and machine. Push HARD into the strange.

⚠️ FEMININE + TASTEFUL, NOT PINUP. She reads as an elegant feminine BEING — graceful, otherworldly, alluring through her EXOTIC alien beauty, not through skin. Her own exotic anatomy / chassis / chitin / scales / plating IS her covering. NEVER a "sexy robot in a bikini-chassis", NEVER cleavage-as-the-focus, NEVER pin-up. The allure is the WONDER of what she is.

🚫 BANS (positive-led — describe what she IS):
• NO generic "pretty human woman with a few chrome bits" — she must be GENUINELY alien
• NO bikini-chassis / bare-midriff-as-design / cleavage-focus / lingerie-coded plating
• NO single boring register — vary the species family HARD across the pool
• NO SKELETAL ANATOMY — never ribcage / exposed ribs / spine / vertebrae / bones / marrow / osseous / skull-faced / endoskeleton-or-exoskeleton-as-ribs (Kevin dislikes skeletal features). Her body is sleek and WHOLE — use "carapace / shell / chassis / inner-frame / dorsal plating", never bone/skeleton language

✓ DISTRIBUTION — one DIFFERENT alien family per entry (~25 entries):
  • INSECTOID — chitinous mantis / wasp / beetle-iridescent exoskeleton fused with chrome actuators
  • CRYSTALLINE — living silicon / quartz / gemstone body with refracting light-cores
  • CEPHALOPOD / DEEP-SEA — translucent bioluminescent skin, tentacle-cabling, anglerfish-lure light
  • REPTILIAN / SERPENTINE — iridescent scaled naga / draconic-cyborg with chrome spinal plating
  • FUNGAL / BOTANICAL — mycelial-grown bio-tech, glowing spore-pods, bark-and-circuit fusion
  • PLASMA / ENERGY-BEING — semi-corporeal body of contained light / liquid-metal held in a field
  • AVIAN / LEPIDOPTERAN — feathered-or-moth-winged, hollow-boned chrome frame
  • CORAL / REEF — calcified branching coral-body with living polyps and circuit-inlay
  • CERAMIC / PORCELAIN-DOLL — cracked porcelain chassis with glowing seams, uncanny-beautiful
  • VOID / COSMIC — body like a window into starfield, event-horizon skin, nebula-in-glass
  • ARACHNID — elegant chrome-and-silk spider-cyborg, multi-limbed, jewel-eyed
  • AMPHIBIAN / TRANSLUCENT — glass-frog translucency revealing glowing internal machinery
  • CETACEAN / WHALE-SONG — vast-eyed, smooth bio-ceramic, sonar-light organs
  • Plus ~12 more INVENTED alien families — keep going, never repeat a family

Each entry names the SPECIES FAMILY + her non-human anatomy + the cyborg fusion + her exotic body material. She is always recognizably FEMININE and graceful.`,
    touchpoints: [
      'MANTIS-EMPRESS — a tall, elegant insectoid cyborg woman, emerald-iridescent chitin exoskeleton seamlessly fused with brushed-chrome actuators at every joint, a slender translucent thorax revealing a slowly-pulsing amber bio-reactor, fine antennae sweeping back from a beautiful angular face, four delicate scythe-limbs folded at rest',
      'DEEP-ABYSS LUMA — a cephalopod-lineage cyborg woman, translucent indigo skin glowing from bioluminescent organs within, a crown of slow tentacle-cables haloing her head, an anglerfish lure-light hovering on a chrome filament above her brow, her lower body dissolving into living cable-tendrils',
      'QUARTZ-CHOIR — a crystalline cyborg woman grown from living rose-quartz and clear silicon, her body refracting light into prismatic shards, a faceted heart-core glowing violet through her translucent chest, chrome circuitry threaded like veins of gold through the crystal',
      'NAGA-OF-CHROME — a serpentine cyborg woman, iridescent oil-slick scales fused with segmented chrome spinal plating, a long coiling lower body of articulated metal vertebrae, jeweled slit-pupil eyes, delicate fin-frills of light along her arms',
      'MYCELIAL-MOTHER — a fungal-botanical cyborg woman, pale bark-and-circuit skin laced with glowing turquoise spore-veins, clusters of luminous mushroom-pods growing from her shoulders and collar, root-cabling descending from her hands into the floor',
      'PORCELAIN-REVENANT — a ceramic-doll cyborg woman of cracked white porcelain, fine gold-glowing seams running through every hairline fracture, hollow joints revealing soft inner light, an uncanny-beautiful serene face, kintsugi-circuitry repairing her',
      'EVENT-HORIZON — a cosmic void-being cyborg woman whose smooth obsidian skin is a window onto a slow-turning starfield, a ring of orbiting light-shards around her head, chrome containment-bands holding the cosmos inside her form',
      'CORAL-SAINT — a reef-lineage cyborg woman, calcified branching coral growing across a chrome endoskeleton, living polyps glowing pink and gold along the branches, sea-fan frills of circuit-laced calcium framing a serene face',
    ],
    instructions: `Each entry is ONE exotic alien-cyborg FEMALE being, 30-45 words. Format: "SPECIES-NAME CAPS — alien anatomy + cyborg fusion + exotic body material + feminine grace". EVERY entry a DIFFERENT alien family — never repeat. Genuinely strange + beautiful + feminine + TASTEFUL (no pinup/bikini-chassis). Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  scifi_cyborg_signature_wow: {
    format: 'simple',
    theme: `THE ONE SHOWSTOPPER — a single jaw-dropping "wow" element per render that makes the viewer gasp and screenshot it. 18-30 words. NOT her whole body — ONE spectacular feature layered onto the scene. This is the "WOW!!" lever.

⚠️ THE BAR — one unforgettable hero-detail: floating / orbiting / unfolding / growing / shattering / light-based / reality-bending. The kind of thing that makes the image feel like a frame from an unmade sci-fi epic.

✓ DISTRIBUTION (~25 entries, vary the TYPE):
  • FLOATING / ORBITING — a halo of slowly-orbiting mechanical petals / a ring of suspended light-shards / drifting drone-fragments circling her
  • UNFOLDING — her face/chest splits into elegant panels revealing inner light / armor blooming open like a flower
  • LIGHT-WINGS — wings of fractal light / holographic feathers / a mantle of projected energy
  • EXPOSED CORE — a visible glowing heart-reactor / a translucent skull revealing a galaxy-brain / a spine of pure light
  • GROWTH — crystal blooming from her shoulder / coral spreading across her arm / circuitry growing like vines
  • REALITY-BEND — space rippling around her / her reflection lagging / a tear in the air leaking light
  • SWARM — a cloud of nanite-fireflies forming a shape / a school of light-fish circling
  • LIQUID — liquid metal flowing up her arm / a droplet of mercury suspended mid-air / chrome dripping upward
  • TRAILING — ribbons of light trailing from her fingertips / data-streams pouring from her eyes`,
    touchpoints: [
      'A HALO of a dozen slowly-orbiting chrome petals suspended around her head, each one trailing a thread of soft light, rotating in silent zero-gravity',
      'WINGS of fractal holographic light unfurling from her shoulders, each feather a shard of refracted prism, flickering like a slow heartbeat',
      'Her chest-plate UNFOLDING into six elegant panels, revealing a small contained galaxy turning slowly inside her ribcage',
      'A SWARM of nanite-fireflies streaming from her open palm, coalescing in the air into the shape of a second, smaller face',
      'LIQUID CHROME flowing UPWARD off her shoulders against gravity, beading into floating mirror-droplets that hang suspended around her',
      'A translucent crystal BLOOMING in real-time from her collarbone, branching into a glowing geode that lights her face from below',
      'RIBBONS of liquid light trailing from each fingertip, writing slow luminous glyphs in the air behind her hand',
      'SPACE itself RIPPLING in concentric rings around her silhouette, her edges fracturing into prismatic chromatic-aberration',
    ],
    instructions: `Each entry is ONE showstopper feature, 18-30 words. Format: a single spectacular hero-detail (floating / unfolding / light / growth / swarm / reality-bend). NOT her whole body — ONE wow element. NO skeletal features — no exposed ribcage / ribs / spine / vertebrae / skull-as-skeleton. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  scifi_cyborg_biome: {
    format: 'simple',
    theme: `EXOTIC ALIEN ENVIRONMENTS — the stage she's in. 22-35 words. Otherworldly sci-fi settings that frame an exotic cyborg woman. Multi-tier depth (foreground / midground / deep distance). NEVER a plain studio void or flat backdrop.

⚠️ THE BAR — alien, wondrous, cinematic. The kind of place that couldn't exist on Earth. Bioluminescent / crystalline / organic-megastructure / cosmic / derelict-xeno.

✓ DISTRIBUTION (~25 entries, vary HARD):
  • BIOLUMINESCENT ABYSS — deep-alien-ocean trench glowing with living light
  • CRYSTAL CATHEDRAL — vast cavern of glowing crystal spires
  • ORGANIC STARSHIP — the wet, ribbed interior of a living vessel
  • NEBULA OBSERVATION DECK — a glass platform suspended in cosmic gas-clouds
  • FUNGAL ALIEN JUNGLE — towering glowing mushroom-forest
  • GAS-GIANT CLOUD CITY — floating platforms in swirling storm-bands
  • XENO TEMPLE — ancient alien ruins with unknown geometry
  • CORAL MEGASTRUCTURE — a city grown from living reef
  • FROZEN METHANE WORLD — blue ice plains under alien rings
  • VOLCANIC FORGE-WORLD — rivers of light-lava and obsidian
  • DERELICT XENO-HIVE — abandoned insectoid architecture
  • DATA-VOID — an abstract digital realm of floating geometry and light-grids
  • DESERT OF GLASS — wind-sculpted glass dunes under twin suns
  • Plus invented alien biomes — keep going`,
    touchpoints: [
      'A bioluminescent abyssal trench, towering hydrothermal spires glowing turquoise and magenta, schools of light-organisms drifting in the dark water, deep distance fading into black',
      'A vast crystal cathedral-cavern, kilometre-high glowing amethyst spires, refracted light scattering everywhere, a mirror-still mineral pool reflecting the ceiling',
      'The wet ribbed interior of a living organic starship, pulsing bio-luminescent veins along the walls, translucent membrane-doors, a vaulted chamber breathing slowly',
      'A glass observation deck suspended inside a nebula, swirling violet and gold cosmic gas-clouds pressing against the windows, distant newborn stars igniting',
      'A towering fungal alien jungle, glowing turquoise mushroom-canopies fifty metres tall, drifting luminous spores, bioluminescent undergrowth, deep misty distance',
      'A floating platform-city in a gas-giant, swirling amber storm-bands below, other platforms drifting in the haze, lightning arcing in the deep clouds',
      'Ancient xeno-temple ruins of impossible non-Euclidean geometry, monolithic alien glyphs glowing faintly, dust-light shafts, a sense of deep time',
      'A derelict insectoid hive-structure, honeycombed chitin architecture, shafts of pale light through cracked resin, abandoned and vast',
    ],
    instructions: `Each entry is ONE exotic alien environment, 22-35 words. Format: setting + multi-tier depth + atmosphere. Otherworldly, cinematic, NEVER a plain studio. Avoid the word "skeletal" as a descriptor. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  scifi_cyborg_look: {
    format: 'simple',
    theme: `THE LOOK REGISTER — the cinematic RENDERING TREATMENT of the whole image (palette + lighting mood + finish). 16-28 words. PURE rendering-style — palette, light quality, mood, finish, named cinematography. NO anatomy, NO subject, NO scene content (those come from other axes). This axis exists so the LOOK varies render-to-render instead of collapsing to one glossy register.

⚠️ THE BAR — each entry a DISTINCT, exotic, cinematic visual register. The look should lead CLIP and set the entire mood.

✓ DISTRIBUTION (~25 entries, vary HARD across palette + mood):
  • DEEP-SEA BIOLUMINESCENT — near-black with glowing turquoise/magenta accents, volumetric god-rays through water
  • COSMIC NEBULA — saturated violet-gold-teal cosmic grade, soft star-glow, dreamy
  • ULTRAVIOLET BLACKLIGHT — neon-reactive blues and magentas glowing on near-black, club-noir
  • VOLCANIC INFERNAL — molten orange-and-obsidian, hard ember light, dramatic
  • ARCTIC CRYSTALLINE — icy cyan-white high-key, crisp cold light, clean
  • REGAL BAROQUE-SCIFI — gold-and-oxblood opulence, chiaroscuro, ornate
  • NEON-NOIR — crushed blacks, one bold neon key color raking, anamorphic flare
  • IRIDESCENT DREAM — pastel oil-slick rainbow, soft high-key, ethereal
  • MONOCHROME CHROME — near-greyscale steel palette, hard editorial light
  • TOXIC ACID — radioactive green-and-black, eerie glow
  • GOLDEN-HOUR FILM — warm backlit honey light, soft halation, 35mm
  • HOLOGRAPHIC GLITCH — chromatic-aberration, scanline shimmer, digital
  • INFRARED THERMAL — false-color heat-map gradient on cold dark field
  • Plus invented exotic registers — keep going`,
    touchpoints: [
      'DEEP-SEA BIOLUMINESCENT — near-black frame lit only by glowing turquoise and magenta organic light, volumetric god-rays slanting through dark water, wet specular highlights',
      'COSMIC NEBULA GRADE — saturated violet, gold and teal cosmic palette, soft diffused star-glow, dreamy atmospheric haze, gentle bloom',
      'ULTRAVIOLET BLACKLIGHT — electric blues and hot magentas glowing neon-reactive against a near-black field, club-noir mood, hard rim accents',
      'VOLCANIC INFERNAL — molten orange and deep obsidian, hard low ember key-light, dramatic cast shadows, heat-shimmer',
      'NEON-NOIR — crushed inky blacks, ONE bold neon key color (acid-green or sodium-amber) raking hard across, anamorphic lens flare, heavy fog',
      'REGAL BAROQUE-SCIFI — opulent gold and oxblood palette, dramatic chiaroscuro single-source, ornate museum-canvas richness',
      'ARCTIC CRYSTALLINE — icy cyan-and-white high-key, crisp cold directional light, clean minimal, frost-bloom',
      'IRIDESCENT DREAM — pastel oil-slick rainbow sheen, soft high-key wraparound light, ethereal glowing haze',
    ],
    instructions: `Each entry is ONE rendering register, 16-28 words. Format: "REGISTER-NAME CAPS — palette + light quality + mood + finish". PURE style — NO anatomy, NO subject, NO scene. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  scifi_cyborg_composition: {
    format: 'simple',
    theme: `COMPOSITION + POSE — how she's framed and what she's doing. 18-30 words. Varied, dynamic, cinematic. Vary framing (full-body / medium / dramatic close) AND pose (graceful, powerful, mid-motion, regal). Tasteful — elegance and power, never pin-up.

⚠️ THE BAR — a striking, intentional composition. Mix portrait-presence with full-body wonder and dynamic motion so renders don't all sit at the same distance.

⚠️ TASTEFUL — graceful, powerful, regal, or mid-action poses. NEVER a pin-up / cheesecake / bare-thigh-seated / chest-thrust pose. The power and wonder carry it.

✓ DISTRIBUTION (~25 entries):
  • ~6 FULL-BODY HERO — head-to-foot, she dominates the frame in her environment
  • ~5 DRAMATIC LOW-ANGLE — camera below, she towers, monumental
  • ~4 FLOATING / ZERO-G — suspended mid-air, hair/limbs/cables drifting
  • ~4 MEDIUM PORTRAIT-IN-PLACE — waist-up with the alien environment readable behind
  • ~3 MID-MOTION — turning / reaching / channeling-energy / rising
  • ~3 REGAL / ENTHRONED — seated or standing in command, composed and powerful`,
    touchpoints: [
      'Full-body hero shot, head-to-foot, she stands tall and central in her alien environment, the deep scene receding behind her, monumental presence',
      'Dramatic low-angle from below, she towers over the camera, silhouette against the glowing sky, regal and imposing',
      'Floating in zero-gravity, suspended mid-frame, her hair and cabling and limbs drifting weightless, serene and surreal',
      'Medium waist-up framing, three-quarter turn, the exotic environment sharp and readable behind her, her face the focal anchor',
      'Caught mid-motion, turning toward the camera with one arm rising, energy trailing from the gesture, a split-second of grace',
      'Enthroned and composed, seated in command at the center of her domain, perfectly still and powerful, framed by her environment',
      'Rising upward through the frame, body elongated in graceful ascent, light blooming below her, an ascension moment',
      'Walking toward the frame through her world, full-body, deliberate and powerful, the environment opening around her',
    ],
    instructions: `Each entry is ONE composition+pose, 18-30 words. Format: framing + pose + relationship to environment. Varied distances, tasteful (graceful/powerful/regal/mid-motion, never pin-up). Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  scifi_cyborg_drama: {
    format: 'simple',
    theme: `EXOTIC PHENOMENON (40%-gated atmospheric drama) — a spectacular environmental event woven into the scene ~40% of renders. 18-28 words. Amplifies the wow WITHOUT cluttering her as the focal subject.

✓ DISTRIBUTION (~25 entries):
  • ENERGY DISCHARGE — arcs of plasma / a contained reactor-flare / lightning between spires
  • SWARM — a cloud of light-organisms / drifting spore-bloom / a school of light-fish passing
  • REFRACTION STORM — shafts of prismatic light fracturing through the scene
  • FLOATING DEBRIS — a slow-drifting field of shattered crystal / suspended rubble / orbiting fragments
  • BLOOM — a sudden bioluminescent bloom rippling outward / flowers of light opening
  • RAIN — luminous rain / falling ash-light / drifting cosmic snow
  • PORTAL — a tear in space leaking light / a slow-opening gateway behind her`,
    touchpoints: [
      'Arcs of contained plasma crackling between distant spires behind her, casting flickering electric-blue light across the scene',
      'A slow-drifting bloom of bioluminescent spores rippling outward through the air, each mote a pinprick of turquoise light',
      'Shafts of prismatic light fracturing through the scene as something unseen refracts the air into rainbow bands',
      'A slow field of shattered crystal fragments drifting weightless around her, each shard catching and throwing light',
      'Luminous rain falling in slow vertical threads of light, beading on every surface and glowing as it lands',
      'A school of translucent light-fish drifting through the frame behind her, their glow rippling across her chassis',
      'A tear in space slowly opening in the deep distance, leaking warm impossible light into the alien dark',
      'A sudden bioluminescent bloom opening across the environment like flowers of cold fire unfurling in sequence',
    ],
    instructions: `Each entry is ONE exotic phenomenon, 18-28 words. Format: a spectacular environmental event that amplifies the scene without stealing focus from her. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  scifi_cyborg_organic: {
    format: 'simple',
    theme: `THE ORGANIC SIDE — the living FACE + alien BIOLOGY of the cyborg female. 18-32 words. This axis makes her ORGANIC half vary across humans and genuinely ALIEN biology — the cyborg/machine side comes from other axes; THIS is her living flesh, face, skin, AND exotic alien anatomy. Kevin: "not just the skin colors — i want alien biology mixed in."

⚠️ THE BAR — go beyond "human with green skin." Most entries are genuinely ALIEN females with EXOTIC BIOLOGY: extra eyes, head-tendrils or sensory frills instead of hair, gill-slits, bioluminescent organs glowing under translucent skin, chromatophore color-shifting skin, crested or ridged skulls, feathered or membrane crests, antennae, faint scales, nictitating membranes. She is ALWAYS feminine and beautiful in an alien way — exotic and graceful, NEVER monstrous, NEVER a gross creature. A few HUMAN women of varied ethnicity for range.

⚠️ TASTEFUL — describe the FACE + head + skin + alien biological features. NEVER body / chest / cleavage / curves. No "sultry / seductive / sensual" language. Alien beauty, not sex.

✓ DISTRIBUTION (~25 entries):
  HUMAN (~5) — varied global ethnicity + skin tone (ebony / sienna / olive / porcelain-freckled / bronze), beautiful human face
  ALIEN-BIOLOGY (~20) — exotic skin color PLUS a real alien feature. Mix these features hard:
   • EYES — four eyes / a third eye / large lidless eyes / compound-faceted eyes / vertical slit-pupils / a row of small ocelli across the brow
   • CRANIAL — head-tendrils or soft cephalopod mantle instead of hair / sweeping sensory antennae / a crown of coral-frills / a crest of fine feathers / curved ridge-horns / a finned sensory crest
   • SKIN — chromatophore color-shifting skin / translucent skin revealing soft glowing organs / faint iridescent scales across cheek and brow / bioluminescent freckle-constellations / patterned dermal markings that pulse with light
   • OTHER — gill-slits at the neck / a luminous throat-sac / petal-like facial frills / delicate barbels / a nictitating inner eyelid
   • SKIN COLORS to draw from: jade-green / cobalt-blue / amethyst-violet / ashen moon-grey / coral-pink / gold-leaf / dusky teal / iridescent-pearl / obsidian / translucent-glass / silver-mercury`,
    touchpoints: [
      'An alien woman with jade-green skin and four calm luminous eyes set in an elegant elongated face, soft sensory tendrils flowing back where hair would be',
      'An alien woman with deep cobalt-blue chromatophore skin shifting faintly to teal at the edges, a crest of fine iridescent feathers along her crown, high serene features',
      'An alien woman with translucent moon-pale skin revealing soft glowing turquoise organs beneath, large lidless dark eyes, delicate gill-slits along her graceful neck',
      'An alien woman with amethyst-violet skin, a third softly-glowing eye centered on her brow, sweeping antennae, fine bioluminescent freckle-constellations across her cheekbones',
      'An alien woman with coral-pink skin and petal-like sensory frills framing her face instead of hair, vertical slit-pupils, a faint pearlescent shimmer over alien-high cheekbones',
      'An alien woman with iridescent-pearl scaled skin shimmering across cheek and brow, a soft cephalopod mantle of tendrils crowning her head, calm jewel-bright eyes',
      'A human woman with deep ebony skin, high sculpted cheekbones, full lips, a calm regal face, fine freckles dusted across the nose',
      'An alien woman with ashen grey skin and a crown of curved coral-frills, a row of tiny glowing ocelli across her brow above two large gentle eyes',
    ],
    instructions: `Each entry is ONE organic identity, 18-32 words. ~5 human (varied ethnicity), ~20 ALIEN with REAL alien biology (extra eyes / head-tendrils-or-frills / translucent-organ skin / chromatophores / crests / gills) + exotic skin color. FACE + HEAD + alien BIOLOGY only — tasteful, feminine, beautiful, NEVER monstrous. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  scifi_cyborg_eyes: {
    format: 'simple',
    theme: `GLOWING EYES — a luminous eye color + glow style for the cyborg female. 8-16 words. A pure RNG accent axis (Kevin: "glowing eyes as a random RNG axis"). Each entry is ONE striking glowing-eye treatment. Vary color + intensity + style HARD across the pool.

✓ DISTRIBUTION (~25 entries) — vary the color + style:
  • molten gold / electric cyan / plasma violet / blood-red ember / emerald-green / arctic silver-white / sodium-amber / hot magenta / deep sapphire / acid-lime
  • styles: solid glowing irises / glowing slit-pupils / fully-luminous no-pupil / ringed-iris glow / heterochromatic (two colors) / starfield-black with glowing flecks / scanning-bar optic / soft-pulsing glow / hard-bright laser-glow / dual-tone gradient iris`,
    touchpoints: [
      'molten-gold glowing irises, soft inner pulse',
      'electric-cyan eyes glowing with no visible pupil, faint light spilling onto the cheeks',
      'plasma-violet glowing slit-pupils, hard and bright',
      'heterochromatic eyes — one ember-red, one ice-blue, both faintly luminous',
      'starfield-black eyes flecked with tiny glowing silver points of light',
      'emerald-green ringed-iris glow with a thin scanning-bar of light across them',
      'arctic silver-white luminous eyes, cold and serene',
      'dual-tone gradient irises shifting magenta-to-gold, softly glowing',
    ],
    instructions: `Each entry is ONE glowing-eye treatment, 8-16 words. Format: "[color] glowing [style]". Vary color + style hard. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  // ════════════════════════════════════════════════════════════════
  // og-cyborg-female — NEW path (2026-06-09). Replicates Kevin's "OG"
  // reference aesthetic: beautiful SEXY human-proportioned female cyborgs,
  // glossy sculpted chassis + exposed mechanical joints + glowing accents,
  // real hair OR chrome cranium, glowing eyes, a cyber head/neck feature.
  // Sorayama-chrome meets Ghost-in-the-Shell beauty. PHOTOREAL. Grounded,
  // NOT the wild alien-creature register of scifi-cyborg-female.
  // ════════════════════════════════════════════════════════════════
  og_cyborg_subject: {
    format: 'simple',
    theme: `BEAUTIFUL SEXY HUMAN-PROPORTIONED FEMALE CYBORGS — the HERO axis. Each entry is ONE stunning cyborg woman: her SKIN + a flawless beautiful human face + her curvy feminine figure clad in a GLOSSY SCULPTED CHASSIS. 30-45 words. Photoreal. Sorayama-chrome / Ghost-in-the-Shell Major / Alita / Cyberpunk-2077 / Detroit-Become-Human lineage.

⚠️ THE BAR — a GORGEOUS WOMAN who is a cyborg. Human-proportioned, beautiful human(oid) FACE, curvy feminine figure. She is sexy and elegant and high-detail photoreal. This is NOT an alien creature, NOT insectoid, NOT a monster — she reads as a beautiful woman first, cyborg second.

⚠️ INTEGRATED CYBORG FACE — NOT a head on a robot (THE #1 FAILURE TO AVOID). The cybernetics INTEGRATE INTO her FACE and HEAD: partial chrome face-plating across the temple / crown / cheek / jaw, glossy chrome flowing seamlessly from her neck up into her face, glowing circuitry tracing her skin, her glossy skin and the chassis ONE continuous surface. She is a single seamless cyborg design — NEVER a plain human head pasted on top of a separate generic robot body. The MACHINE and the WOMAN are fused, including on her face.

⚠️ THE CHASSIS — a sleek GLOSSY chassis (mirror-white / chrome / pearl / or a colored glossy panel — emerald / orange / violet / cobalt) sculpted smoothly over her curvy human figure, with EXPOSED MECHANICAL DETAIL at the joints (neck / shoulders / spine / arm-segments — visible servos, cabling, paneling seams) and GLOWING ACCENT LIGHTS threaded through (orange / green / cyan / magenta pinpoints and strips).

⚠️ TASTEFUL-SEXY — the glossy chassis COVERS her body; she's sexy through curvy sculpted FORM + gloss + beauty, NEVER through bare skin. NO bare breasts, NO nipples, NO topless, NO lingerie. The chassis/panels are her covering.

✓ DISTRIBUTION (~25 entries) — vary SKIN + chassis color:
  • PALE / FAIR skin (~8) — fair-porcelain / cool-ivory / soft-alabaster / pale-olive / light-rose — a flawless beautiful face (the sci-fi-cyborg default is pale / fair skin)
  • EXOTIC SCI-FI SKIN (~17) — emerald-green glittery skin with gold sparkle-freckles / cobalt-blue glossy / pearl-white iridescent / soft-violet / chrome-silver / dusky-teal / amethyst / rose-gold / stylized OBSIDIAN jet-black GLOSSY synthetic skin (a stylized sci-fi black finish, NOT a realistic human race) — STILL a gorgeous human-shaped face
  🚫 NO realistic ethnic-RACE skin tones — NO "African-American" / deep-ebony / dark-brown realistic-race skin. These are sci-fi cyborgs: keep skin PALE / FAIR or a STYLIZED exotic/synthetic color only.`,
    touchpoints: [
      'A stunning emerald-green-skinned cyborg woman, glittery skin dusted with gold sparkle-freckles, chrome face-plating flowing across her crown and temple into her cheek, a flawless beautiful face, a glossy white-and-green chassis over her curvy figure continuous with the skin of her neck, glowing orange accent-lights',
      'A gorgeous fair-porcelain-skinned cyborg woman, glossy chrome plating integrated along her jaw and temple flowing seamlessly into a mirror-white chassis, a flawless face, intricate exposed mechanical paneling at the shoulders, glowing cyan pinpoint-lights, photoreal',
      'A beautiful cobalt-blue-skinned cyborg woman, smooth glossy blue skin with fine glowing circuitry tracing one cheek, a flawless face, a pearl-and-chrome chassis flowing up from her neck into her jaw, glowing magenta accent-strips, sexy and high-detail',
      'A striking stylized-obsidian jet-black glossy cyborg woman (a synthetic sci-fi finish, not a human race), chrome face-plating across her brow and cheek, a glossy violet chassis sculpted to her curvy figure, glowing orange glow-cores, beautiful and powerful',
      'A radiant pearl-white iridescent cyborg woman, glossy chrome flowing from a glowing-orange neck column up into a chrome cheek-plate, a flawless serene face, exposed mechanical shoulders, photoreal beauty',
      'A beautiful soft-violet-skinned cyborg woman, glossy skin with a chrome temple-implant integrated into her hairline, a glossy emerald-and-silver chassis over her curvy figure, glowing green accent-lights, a gorgeous face',
      'A gorgeous green-haired pale-olive cyborg woman, a chrome jaw-and-neck plate flowing into a glossy white-and-gold chassis sculpted over her curvy figure, exposed brass mechanical detail at the shoulder, photoreal high-gloss',
      'A stunning rose-gold-skinned cyborg woman, glossy skin with glowing circuitry across her temple, a flawless human face, a chrome liquid-metal chassis with gold-sparkle dusting, glowing orange eye-glow on her cheeks, elegant and exotic',
    ],
    instructions: `Each entry is ONE beautiful sexy human-proportioned female cyborg, 30-45 words. Format: skin (pale/fair OR stylized exotic — NO realistic ethnic-race tones) + flawless face WITH integrated chrome face/head plating (NOT a head on a robot) + glossy chassis continuous with the skin + exposed mechanical joints + glowing accents. ALWAYS a gorgeous human-FACED woman, NEVER a creature, NEVER a head-on-a-robot. Tasteful-sexy, chassis covers her. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  og_cyborg_hair: {
    format: 'simple',
    theme: `HAIR or CHROME CRANIUM for the cyborg woman. 8-16 words. Either real beautiful hair (style + color) OR a sleek glittery chrome/painted cranium (no hair). Vary HARD.

✓ DISTRIBUTION (~25): long glossy black / platinum-white braided crown / flowing emerald-green / soft lavender / windswept blonde / dark cornrow-braids / slicked-back wet-look / silver high-ponytail / pale-pink long / chestnut pompadour / white waist-length / OR a sleek glittery chrome cranium (bald, sparkle-dusted) / a painted-panel cranium with a glowing seam / a transparent dome-cranium`,
    touchpoints: [
      'long glossy jet-black hair, sleek and straight',
      'platinum-white hair in an intricate braided crown',
      'flowing emerald-green hair, soft and windswept',
      'soft lavender hair, long and loose',
      'dark hair in fine cornrow-braids gathered into a ponytail',
      'a sleek bald chrome cranium dusted with gold sparkle, no hair',
      'windswept blonde hair catching the light',
      'a smooth painted-panel cranium with a single glowing seam, no hair',
    ],
    instructions: `Each entry is ONE hair or cranium treatment, 8-16 words. ~80% real hair (varied style + color), ~20% chrome/painted cranium. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  og_cyborg_cyber_feature: {
    format: 'simple',
    theme: `THE SIGNATURE CYBER HEAD/NECK FEATURE — the standout cybernetic detail on her head, face, or neck. 14-24 words. This is what makes her unmistakably a cyborg. PHOTOREAL, beautiful, integrated.

✓ DISTRIBUTION (~25):
  • EAR MODULES — headphone-style chrome ear-discs / a glowing spiral ear-disc / sensor-pods at the ear
  • FACE — glowing circuitry tracing one cheek / a glowing mandala implant at the temple or crown / a chrome jaw-and-cheek plate / subtle glowing freckle-circuitry
  • NECK/NAPE — an intricate GLOWING cybernetic neck-and-nape column of fine circuitry / chrome cervical plating with glowing threads / cabling flowing into the collar (beautiful glowing tech, never a bare skeleton)
  • CRANIAL — a transparent crown-panel revealing glowing inner tech / temple-ports / a glowing third-eye gem implant`,
    touchpoints: [
      'large chrome headphone-style ear-disc modules framing the side of her head, softly glowing',
      'a glowing mandala implant set into her temple, pulsing soft violet light',
      'fine glowing circuitry tracing across one cheekbone, lit in soft orange',
      'an intricate glowing cybernetic neck-and-nape column of fine luminous circuitry beneath her jaw',
      'a glowing spiral ear-disc, concentric rings of warm orange light at the side of her head',
      'a transparent crown-panel revealing softly glowing inner tech above her brow',
      'chrome cervical plating at the throat threaded with glowing-cyan luminous lines',
      'a glowing third-eye gem implant centered on her forehead, set in fine chrome filigree',
    ],
    instructions: `Each entry is ONE cyber head/neck feature, 14-24 words. PHOTOREAL, beautiful, integrated. Glowing tech is welcome (incl. luminous neck/nape circuitry) — but NEVER a bare skeleton / exposed ribs / skull-look. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  og_cyborg_eyes: {
    format: 'simple',
    theme: `GLOWING EYES — a luminous eye color + style for the cyborg woman. 8-16 words. Pure RNG accent. Vary color + style HARD.

✓ DISTRIBUTION (~25): glowing violet / hot magenta / molten orange / electric cyan / amber-gold / soft pink / emerald-green / ice-blue / dual-tone — styles: solid glowing irises / soft-glow spilling onto cheeks / bright luminous no-pupil / ringed-iris glow / gentle pulse`,
    touchpoints: [
      'glowing violet eyes, soft light spilling onto her cheeks',
      'hot-magenta glowing irises, bright and luminous',
      'molten-orange glowing eyes with a soft inner pulse',
      'electric-cyan luminous eyes, no visible pupil',
      'soft-pink glowing eyes, gentle and warm',
      'amber-gold glowing irises catching the light',
      'emerald-green glowing eyes, cool and bright',
      'ice-blue luminous eyes with a faint glow-bloom',
    ],
    instructions: `Each entry is ONE glowing-eye treatment, 8-16 words. Format: "[color] glowing [style]". Vary hard. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  og_cyborg_setting: {
    format: 'simple',
    theme: `BACKGROUND — a simple, subject-focused setting. 12-22 words. The CYBORG WOMAN is the focus; the background is soft / bokeh / atmospheric, never busy or competing.

✓ DISTRIBUTION (~25): soft grey-blue studio bokeh / a sunlit rocky canyon, blurred / a neon-lit corridor with bokeh lights / a soft snowy field with drifting sparkle-bokeh / blurred ancient stone columns / a misty industrial bay / warm sunset haze / a dark backdrop with floating glow-bokeh / a pale clean gradient`,
    touchpoints: [
      'a soft out-of-focus grey-blue studio backdrop with gentle gradient light',
      'a sunlit rocky canyon blurred far behind her, warm dust-light',
      'a neon-lit corridor dissolving into colorful bokeh lights behind her',
      'a soft snowy field with drifting sparkle-bokeh and pale cool light',
      'blurred ancient stone columns receding into warm haze',
      'a dark moody backdrop scattered with floating warm glow-bokeh',
      'a misty industrial bay softly out of focus, cool atmospheric light',
      'a warm sunset-haze gradient, soft and dreamy behind her',
    ],
    instructions: `Each entry is ONE simple subject-focused background, 12-22 words. Soft / bokeh / atmospheric — never busy. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  og_cyborg_composition: {
    format: 'simple',
    theme: `COMPOSITION + POSE — a beauty-shot framing of the cyborg woman. 14-24 words. Mostly portrait / profile / medium upper-body (like a high-end character beauty render). Elegant, a little sexy, always tasteful.

⚠️ PULL THE CAMERA BACK — EVERY entry is WAIST-UP or WIDER, most are FULL-BODY. NEVER a neck-up headshot or a face close-up. We want to SEE HER BODY — chassis, figure, pose.

✓ DISTRIBUTION (~25):
  • ~10 FULL-BODY — head-to-foot, full figure + chassis + pose visible in her setting
  • ~7 THREE-QUARTER WAIST-UP-OR-LOWER — turned toward camera, upper body + hips visible
  • ~4 DYNAMIC / LOW-ANGLE — camera low (monumental), OR a turning / walking / reaching pose, full or 3/4 body
  • ~4 SIDE PROFILE — waist-up or fuller, never just the head`,
    touchpoints: [
      'Full-body shot head-to-foot, she stands poised in her setting, her whole glossy chassis and figure visible',
      'Full-body three-quarter view, one hand on her hip, confident and statuesque in her setting',
      'Dynamic low-angle from below looking up, full body, she towers monumental against the light',
      'Three-quarter waist-up turned toward the camera, hips and chassis detail visible, glowing accents catching the light',
      'Caught mid-motion walking toward the camera, full body, hair and light trailing, a split-second of grace',
      'Elegant side profile waist-up, her integrated cyber-face and chassis sharp against soft bokeh',
      'Full-body, she turns to glance over her shoulder, her whole figure and chassis in frame',
      'Medium waist-up, slight turn, her chassis paneling and figure clearly readable',
    ],
    instructions: `Each entry is ONE composition, 14-24 words. EVERY entry is WAIST-UP or WIDER — most FULL-BODY. NEVER a neck-up headshot / face close-up. Show her body, chassis, figure. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  og_cyborg_drama: {
    format: 'simple',
    theme: `SUBTLE ATMOSPHERE (40%-gated) — a soft glow/particle accent that adds beauty without clutter. 10-18 words.

✓ DISTRIBUTION (~25): drifting warm bokeh-embers / soft floating sparkle-motes / a gentle glow-bloom / faint drifting snow / soft lens-flare / luminous dust catching light / a soft halo of backlight / drifting petals of light`,
    touchpoints: [
      'drifting warm bokeh-embers floating softly around her',
      'soft floating sparkle-motes catching the light',
      'a gentle glow-bloom haloing her silhouette',
      'faint drifting snow sparkling in the cool light',
      'a soft warm lens-flare grazing the frame',
      'luminous dust drifting slowly through the light',
      'a soft halo of golden backlight behind her',
      'drifting petals of light floating past',
    ],
    instructions: `Each entry is ONE subtle atmospheric accent, 10-18 words. Soft, beautiful, never cluttering. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  // ════════════════════════════════════════════════════════════════
  // killer-cyborgs — MENACING ASSASSIN CYBORGS (2026-06-09). Full-blown
  // badass lethal killing machines that look SORT OF human but you'd run.
  // Wild aesthetics; can be sleek-ninja OR raw / unrefined / utilitarian.
  // Weapons (gun / sword / laser-sword), capes. Grievous = ONE touchpoint,
  // don't overdo it. Pool slots reuse the scifi names (signature_wow→WEAPON,
  // organic→HEAD) — the killer template rewords them.
  // ════════════════════════════════════════════════════════════════
  killer_cyborg_xeno_being: {
    format: 'simple',
    theme: `HUMAN / CYBORG FEMALE HYBRID ASSASSIN-THIEVES — the HERO axis. Each entry is ONE beautiful, striking, LETHAL female cyborg who is an agile ASSASSIN / THIEF / ROGUE. 30-45 words. She is a HUMAN woman (a real beautiful human FACE + a female figure) fused with a sleek CYBORG chassis and augments — a deadly, lithe, stealthy infiltrator. Ghost-in-the-Shell Major / sexy cyber-ninja / lethal cat-burglar lineage.

⚠️ THE BAR — a gorgeous, DEADLY woman who is a cyborg. A beautiful human female FACE (with a cold lethal edge), a female figure, a sleek cyborg chassis + integrated augments, LITHE and AGILE, armed and stealthy. The thieves and assassins of the cyborg world — HUMAN/CYBORG FEMALE HYBRIDS you'd run from.

⚠️ HUMAN-CYBORG HYBRID — NOT a robot, NOT a mech, NOT a skeleton, NOT genderless. She reads as a beautiful lethal WOMAN first, cyborg second. The chrome/tech INTEGRATES into her (face-plating at the temple/jaw, chassis flowing from her skin), over a human female figure, with real hair.

⚠️ ALWAYS LITHE + AGILE — slender, athletic, low-profile, built to sneak / climb / vault / vanish. A sleek glossy OR matte-black stealth chassis sculpted over her female figure, integrated cyber-augments (exposed mechanical at joints, glowing accents). NEVER bulky / hulking.

🚫 NOT a faceless robot / mech / bulky brute / bare-bone skeleton, NOT genderless, NOT cute. Skin: pale / fair OR a stylized exotic color (emerald / cobalt / pearl / violet) — NEVER realistic ethnic-race. Tasteful-sexy (chassis covers her) but LETHAL.

✓ DISTRIBUTION (~25) — vary the female-assassin archetype:
  • CYBER-NINJA ASSASSIN (~6) — lithe stealth-suited female killer, matte-black, silent
  • CAT-BURGLAR THIEF (~5) — agile female rogue, slim stealth-gear, nimble break-in artist
  • PHANTOM ASSASSIN (~4) — slender hooded female killer, cloaked, vanishing
  • ELITE INFILTRATOR (~4) — sleek high-tech female operative, polished chassis, deadly
  • STREET-ROGUE (~3) — scrappy lithe female thief, scavenged stealth-gear, still sexy-lethal
  • EXOTIC FEMALE ASSASSIN (~3) — wild lethal female-cyborg designs (still human-faced)

Each entry: female-assassin archetype + beautiful human female face + lithe figure + sleek/matte cyborg chassis + integrated augments + lethal stealthy presence.`,
    touchpoints: [
      'WIDOW-CIPHER — a lithe, gorgeous female cyber-ninja assassin, matte-black stealth-suit chassis sculpted over a slim figure, chrome face-plating along one cheekbone, a cold beautiful face, long black hair, glowing red eyes, blade-quick and silent',
      'NIGHT-LACE — a sleek female cat-burglar thief, a flawless human face and a slender figure in a form-fitting dark stealth-chassis, a grapple-line at the hip, fine glowing circuitry tracing her arm, agile and nimble',
      'PALE-PHANTOM — a slender female phantom-assassin, a fair beautiful face with a chrome temple-implant, a tattered dark hood over a lithe chrome-and-matte frame, long pale hair, glowing violet eyes, here then gone',
      'VESPER — an elite female infiltrator, a striking human face and athletic figure in a polished gunmetal stealth-chassis with cyan glow-accents, integrated chrome neck-augments, deadly and composed',
      'EMBER-FOX — a scrappy lithe female street-rogue, a pretty sharp-eyed face, slim scavenged stealth-gear over a chrome-augmented figure, exposed wiring at the forearm, quick and dangerous',
      'JADE-SCALPEL — an exotic emerald-skinned female assassin-cyborg, a gorgeous human face, glittering green skin, a sleek dark chassis over a lithe figure, glowing amber eyes, lethal grace',
      'CHROME-SAINT — a sleek female assassin in a glossy white-and-chrome stealth-chassis over a slender figure, a flawless face with a glowing optic at one temple, platinum hair, cold and beautiful and deadly',
      'SHADE-VIOLET — a lithe female cyber-ninja, soft-violet skin and a beautiful face behind a thin visor, a matte stealth-chassis sculpted to her figure, wrist-blades sheathed, silent and quick',
    ],
    instructions: `Each entry is ONE human/cyborg FEMALE assassin-thief, 30-45 words. Format: "NAME CAPS — female-assassin archetype + beautiful human female face + lithe figure + sleek/matte cyborg chassis + integrated augments + lethal stealthy presence". ALWAYS a beautiful lethal WOMAN (human face + female figure) fused with cyborg tech — NEVER a robot / mech / skeleton / genderless. Lithe + agile. Tasteful-sexy but deadly. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  killer_cyborg_signature_wow: {
    format: 'simple',
    theme: `THE WEAPON — what the assassin carries or wields. 14-26 words. She/it is CARRYING, RAISING, or mid-STRIKE with a lethal weapon. Vary the weapon hard, including crude / utilitarian ones.

✓ DISTRIBUTION (~25): glowing energy laser-sword / twin laser-swords (Grievous-style, sparingly) / a long chrome katana / a heavy slug-throwing rifle / dual pistols / forearm wrist-blades / an energy glaive-staff / a wicked scythe / an arm-mounted plasma-cannon / a serrated cleaver / a crude welded scrap-blade / a chain-whip / a railgun / twin tonfa-blades / a hooked vibro-dagger`,
    touchpoints: [
      'a glowing crimson energy laser-sword held low in one hand, humming, ready to strike',
      'a long chrome katana drawn and raised, light running down the edge',
      'a heavy slug-throwing rifle braced against the shoulder, barrel still smoking',
      'twin forearm wrist-blades extended, dripping coolant, caught mid-lunge',
      'an arm-mounted plasma-cannon spun up and glowing, aimed at the viewer',
      'a crude serrated scrap-blade welded to one fist, notched and bloodied',
      'a long energy glaive-staff spun horizontal, both blades crackling',
      'dual heavy pistols crossed and firing, muzzle-flash lighting the frame',
    ],
    instructions: `Each entry is ONE weapon being carried or wielded, 14-26 words. Vary the weapon hard. Lethal, menacing, sometimes crude/utilitarian. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  killer_cyborg_organic: {
    format: 'simple',
    theme: `THE FACE — a beautiful human female face with a cold lethal edge + integrated cyber. 14-26 words. She has a real, striking WOMAN'S face (NOT a mask, NOT a robot head) with cybernetic augments worked into it. A killer's face — gorgeous but dangerous.

✓ DISTRIBUTION (~25): a flawless cold-beautiful face with chrome face-plating along one cheekbone / a striking face with a glowing optic at one temple / a beautiful face half-shadowed by a hood, eyes glowing / a sharp pretty face with fine glowing circuitry tracing the jaw / a serene deadly face with a chrome jaw-augment / a beautiful face behind a thin sleek visor (face still visible) / a gorgeous face with a cybernetic ear-and-temple implant / an exotic-skinned (emerald/cobalt/violet) beautiful face with subtle augments.
🚫 NOT a mask-only / faceless / robot head — her human female FACE is ALWAYS visible and beautiful. Skin pale/fair OR stylized-exotic, never realistic ethnic-race.`,
    touchpoints: [
      'a flawless, cold-beautiful face with sleek chrome face-plating tracing along one cheekbone into her hairline',
      'a striking face with a small glowing-cyan optic set at one temple, the rest of her face fully human and lovely',
      'a beautiful face half-shadowed under a dark hood, only her glowing eyes and sharp jaw catching the light',
      'a sharp, pretty face with fine glowing circuitry tracing down her jaw and neck',
      'a serene, deadly-beautiful face with a brushed-chrome jaw-and-cheek augment integrated seamlessly',
      'a gorgeous face behind a thin sleek visor that leaves her eyes and lips visible',
      'a lovely face with a cybernetic ear-and-temple implant glowing softly, framed by loose hair',
      'an exotic emerald-skinned beautiful face with subtle gold glow-freckles and a chrome temple-line',
    ],
    instructions: `Each entry is ONE beautiful human female face + integrated cyber, 14-26 words. Her WOMAN'S face is always visible and gorgeous, with a cold lethal edge. NEVER a faceless mask / robot head. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  killer_cyborg_eyes: {
    format: 'simple',
    theme: `GLOWING MENACING EYES — the killer's eyes/optics. 8-16 words. Cold, lethal, intimidating. Vary color + style.

✓ DISTRIBUTION (~25): a single glowing red optic / two cold red slits / sickly amber sensor-glow / harsh white scanning-glow / a row of small red tracking-lenses / a hard cyan targeting-glow / a flickering orange optic / dead-grey lenses with a faint red pinpoint / a thin glowing visor-bar`,
    touchpoints: [
      'a single glowing-red cyclopean optic, cold and unblinking',
      'two narrow red optic-slits glowing in a dark face',
      'a harsh white scanning-glow sweeping behind the visor',
      'a row of small red tracking-lenses lighting one at a time',
      'a hard cyan targeting-glow locking on',
      'a sickly amber sensor-glow flickering',
      'a thin red glowing visor-bar across the eyes',
      'dead-grey lenses with a single faint red pinpoint deep inside',
    ],
    instructions: `Each entry is ONE menacing eye/optic treatment, 8-16 words. Cold, lethal. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  killer_cyborg_look: {
    format: 'simple',
    theme: `THE LOOK REGISTER — the menacing cinematic rendering treatment (palette + light + mood + finish). 16-28 words. PURE rendering-style — NO subject/anatomy. Dark, gritty, lethal registers so the look varies render to render.

✓ DISTRIBUTION (~25): gritty industrial gunmetal grade / blood-red noir / cold steel-blue ominous / smoky backlit silhouette / harsh tactical floodlight + hard shadow / grimy war-torn desaturation / volcanic-ember menace / acid-green toxic gloom / stark high-contrast black-and-red / rain-soaked neon-noir / fire-lit orange-and-black / cold morgue-white clinical dread`,
    touchpoints: [
      'GRITTY INDUSTRIAL — desaturated gunmetal palette, harsh overhead work-light, grime and oil sheen, hard shadow',
      'BLOOD-RED NOIR — crushed blacks with one bleeding crimson key light, heavy shadow, ominous',
      'COLD STEEL-BLUE — icy desaturated blue-grey, hard directional light, clinical and merciless',
      'SMOKY BACKLIT — silhouette against smoke and a single hot backlight, edges glowing, the rest in shadow',
      'VOLCANIC EMBER — molten orange and deep black, hard ember underlight, heat-shimmer menace',
      'STARK BLACK-AND-RED — near-monochrome black with violent red accents, high contrast, graphic dread',
      'RAIN-SOAKED NEON-NOIR — wet reflective surfaces, cold neon glow through rain, moody',
      'HARSH TACTICAL — flat hard floodlight, blown highlights, deep black shadow, interrogation-cold',
    ],
    instructions: `Each entry is ONE menacing rendering register, 16-28 words. PURE style — palette + light + mood + finish, NO subject. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  killer_cyborg_composition: {
    format: 'simple',
    theme: `COMPOSITION + POSE — a menacing showcase of the killer. 16-28 words. The KILLER is the main focus, large and central. Intimidating, lethal poses. Mostly full-body or three-quarter so the weapon and chassis read. Cape welcome.

✓ DISTRIBUTION (~25) — AGILE + STEALTHY, the lithe rogue moving like a shadow:
  • ~7 FULL-BODY AGILE STANCE — head-to-foot, lithe coiled-ready crouch, weapon in hand
  • ~5 STEALTH CROUCH / PERCHED — crouched low on a ledge, rooftop, or pipe, coiled to spring
  • ~4 MID-PARKOUR / IN MOTION — vaulting, wall-running, leaping a gap, sliding low and fast
  • ~4 DRAWING A BLADE FROM SHADOW — slipping a weapon free, half in darkness, about to strike
  • ~3 CLINGING / CLIMBING — gripping a wall, pipe, or vent, scaling unseen
  • ~2 EMERGING FROM SHADOW — slipping silently out of the dark, half-revealed`,
    touchpoints: [
      'Full-body agile stance, head-to-foot, lithe and coiled in a low ready crouch, blade in hand',
      'Crouched low and perched on a narrow ledge, the whole lithe body coiled to spring, glowing eyes scanning below',
      'Caught mid-parkour vaulting a gap, full body airborne and twisting, fast and weightless',
      'Slipping a thin blade free from shadow, half the lithe body in darkness, about to strike',
      'Clinging to a wall halfway up, gripping with clawed hands, scaling silently, full figure visible',
      'Wall-running low and fast along a corridor, the lithe frame stretched mid-stride',
      'Emerging silently out of the dark, a slim shadow half-revealed, weapon already drawn',
      'Three-quarter full-body, dropping into a soundless landing crouch, ready to move again',
    ],
    instructions: `Each entry is ONE AGILE / STEALTHY composition, 16-28 words. The lithe rogue is the main focus, full-body / three-quarter so the agile build + weapon read. Crouching / perched / parkour / climbing / shadow — never a heavy looming brute. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  killer_cyborg_biome: {
    format: 'simple',
    theme: `THE SETTING — a cool, menacing sci-fi environment that frames the killer (it stays the focus). 18-30 words. Dark, atmospheric, dangerous. Multi-tier depth.

✓ DISTRIBUTION (~25): a war-torn ruined city at night / a dark industrial hangar with hanging chains / a blood-red battlefield under smoke / a rain-soaked neon-noir alley / the derelict interior of a dead warship / a fire-lit wasteland / a cold steel interrogation-bay / a scrapyard graveyard of dead machines / a flooded reactor corridor / a foggy graveyard of war-mechs`,
    touchpoints: [
      'A war-torn ruined city at night, broken towers and burning wreckage receding into smoke behind him',
      'A dark industrial hangar, hanging chains and gantries, a single harsh work-light, deep shadow',
      'A blood-red battlefield under rolling smoke, distant fires and silhouetted wreckage',
      'A rain-soaked neon-noir alley, wet reflective ground, cold neon bleeding through the downpour',
      'The derelict interior of a dead warship, flickering emergency light, debris drifting',
      'A fire-lit wasteland, embers drifting, the black silhouettes of dead machines on the horizon',
      'A scrapyard graveyard of dead war-machines, mangled metal heaped into the haze',
      'A cold steel interrogation-bay, flat overhead light, a single drain in the floor',
    ],
    instructions: `Each entry is ONE menacing sci-fi setting, 18-30 words. Dark, atmospheric, multi-tier depth, frames the killer without stealing focus. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  killer_cyborg_drama: {
    format: 'simple',
    theme: `MENACING ATMOSPHERE (40%-gated) — a dangerous atmospheric accent. 12-20 words. Amplifies the threat without stealing focus.

✓ DISTRIBUTION (~25): drifting smoke / showering sparks / falling embers / blood-red haze / falling ash / a muzzle-flash flicker / arcing electricity / steam venting / drifting war-dust / a strobing alarm-light`,
    touchpoints: [
      'drifting smoke curling around the killer',
      'showering sparks raining off nearby metal',
      'falling embers drifting through the dark',
      'a heavy blood-red haze hanging in the air',
      'arcing electricity crackling off damaged conduits',
      'steam venting in hard jets from the floor',
      'a strobing red alarm-light pulsing across the scene',
      'falling grey ash settling on every surface',
    ],
    instructions: `Each entry is ONE menacing atmospheric accent, 12-20 words. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  // ─── killer-cyborgs-male — MALE mirror of killer-cyborgs (2026-06-09).
  //     Only the gendered axes are new (subject + face); weapon / biome / look /
  //     composition / eyes / drama are SHARED with the female path. ───
  killer_cyborg_male_xeno_being: {
    format: 'simple',
    theme: `SLEEK COOL ANTIHERO OUTLAW CYBORGS — the HERO axis. Each entry is ONE sleek, stylish, COOL cyberpunk OUTLAW antihero with PERSONALITY. 30-45 words. Lethal + characterful + STYLISH — a cool antihero (gunslinger / bounty-hunter / merc / rogue / smuggler / lone-ronin) with polished sleek gear + a signature stylish flair + cool attitude. Cyberpunk-2077 V / Cowboy-Bebop Spike / sleek Star-Wars-bounty-hunter lineage.

⚠️ THE BAR — a SLEEK, COOL antihero outlaw, stylish and lethal. Polished sleek cyber-augments + sleek personalized gear (a sharp tailored long coat / a sleek hood or cowl / sleek goggles or visor / a clean bandolier / a sleek cybernetic arm) + a cool attitude (a confident smirk / cold swagger). Characterful but POLISHED and STYLISH — a cool antihero you'd put on a poster.

🚫 NO HATS — absolutely NO fedora / cowboy-hat / wide-brim hat / brimmed hat of ANY kind (Kevin hates the look). Hoods / cowls / face-wraps / goggles / visors are fine; HATS are banned.

⚠️ SLEEK + COOL, NOT SCRUFFY — sleek polished armored gear, clean stylish lines, a cool antihero vibe. Personal flair done with STYLE — NEVER junkyard-scrap, NEVER grubby-scavenger, NEVER war-paint-raider, NEVER bushy-bearded-brute. Cool, sharp, badass.

⚠️ FACE — a MIX: ~half a sleek MASK / visor / goggles / face-wrap (cool + mysterious, cold eyes showing); ~half a striking COOL VISIBLE face — sharp, hard, confident, with cool flair (a thin scar / a glowing optic / a smirk) + integrated cyber.

🚫 ALWAYS A COVERED TORSO — a sleek coat / armored chassis / tactical gear over his chest. NEVER shirtless, NEVER bare-chested, NEVER an open / exposed muscular chest. NOT a faceless generic robot / mech / skeleton / bare-skull-face. Build lean-to-athletic. NEVER a pretty-boy. Skin pale/fair OR a stylized exotic color (emerald/cobalt/violet/ashen) — NEVER realistic ethnic-race.

✓ DISTRIBUTION (~25) — vary the cool antihero archetype:
  • SLEEK SHOOTER (~5) — sleek gun-for-hire antihero, a sharp long coat, a sleek hand-cannon / sidearm (NO hat)
  • BOUNTY-HUNTER (~5) — sleek polished armored hunter, a clean visor, a bandolier worn with style, composed
  • SLEEK MERC (~4) — sleek tactical operative-for-hire, polished gear with clean glowing lines, lethal cool
  • ROGUE-SMUGGLER (~4) — slick stylish charming rogue, a sharp coat, sleek holsters, a confident smirk
  • LONE RONIN-DRIFTER (~4) — sleek lone-wolf antihero, a long dark coat or wrap, a chrome blade, cold cool
  • EXOTIC ANTIHERO (~3) — exotic-skinned but SLEEK + COOL outlaw designs

Each entry: cool antihero archetype + sleek stylish personalized gear + a signature flair + sleek cyber-augments + a cool confident attitude (a sleek mask/visor on ~half, a cool visible face on ~half).`,
    touchpoints: [
      'BLACKJACK — a sleek gun-for-hire antihero, a sharp tailored black coat over polished dark armor, sleek goggles glinting, a cool hard visible face, a chrome sidearm spun on one finger, a cold confident smirk',
      'HALCYON — a sleek bounty-hunter cyborg, polished gunmetal armor with clean glowing-cyan lines, a sleek targeting-visor across the eyes, a bandolier worn with style, composed and lethal',
      'RONIN-7 — a sleek lone ronin-drifter antihero, a long dark coat over a sleek matte chassis, a chrome blade at the hip, a cool hard visible face with a single glowing optic, quiet menace',
      'SILK — a slick rogue-smuggler cyborg, a sharp stylish long coat, dual sleek holsters, a confident grin and a glowing eye on a cool sharp face, charming and dangerous',
      'NOMAD-X — a sleek merc-for-hire, polished tactical armor with clean lines, a sleek half-mask and visor, a sleek rifle slung cool over the shoulder, lethal and composed',
      'ASH-VECTOR — an exotic ashen-skinned cool antihero, a sharp dark coat over sleek augments, a sleek visor, a thin scar and a cold confident stare, stylish and deadly',
      'DUSK — a sleek hooded shooter antihero, a sharp coat and a sleek face-wrap leaving cold eyes visible, a sleek hand-cannon, cool and unbothered',
      'JADE-ACE — an exotic emerald-skinned sleek rogue, a stylish long coat over polished augments, a sharp confident visible face with a glowing amber eye, a sleek blade, cool swagger',
    ],
    instructions: `Each entry is ONE sleek COOL antihero OUTLAW cyborg, 30-45 words. Format: "NAME CAPS — cool antihero archetype + sleek stylish personalized gear + signature flair + sleek cyber-augments + cool confident attitude (a sleek mask/visor on ~half, a cool visible face on ~half)". STYLISH + POLISHED + COOL — NEVER scruffy / junkyard / war-paint-raider / bushy-bearded. ALWAYS a covered torso (no shirtless). NEVER a pretty-boy / skull-face / faceless robot. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  killer_cyborg_male_organic: {
    format: 'simple',
    theme: `THE FACE/HEAD — a COOL male antihero face OR a sleek mask/visor, with integrated cyber. 14-26 words. ~Half are a sleek MASK / visor / goggles / face-wrap (cool, mysterious, cold sharp eyes showing). ~Half are a striking COOL VISIBLE face — sharp, hard, confident, with cool flair (a thin scar / a glowing optic / a faint smirk / sharp features). A cool antihero, lethal and stylish. FACE/HEAD only, NEVER torso.

⚠️ COOL + STYLISH — sharp, hard, confident, cool. NOT a generic pretty-boy, NOT a grubby scruffy bum, NOT a bushy-bearded brute, NOT the same face twice. Light stubble OK; lean into COOL.

✓ DISTRIBUTION (~25): a sleek matte half-mask + a glowing optic-slit / a sleek visor + goggles over cold sharp eyes / a sharp confident face with a glowing optic and a faint smirk / a hard cool face with a thin scar + a sleek chrome cheek-plate / a sleek dark face-wrap leaving cold sharp eyes / a sharp cool face under a sleek hood / a striking hard face with clean integrated cyber along the jaw / an exotic-skinned cool sharp face with a glowing eye.
🚫 NOT a pretty-boy, NOT a bare skull / death's-head, NOT a grubby scruffy face, NOT a bushy-bearded brute, NOT a generic robot helmet, and NO HATS (no fedora / cowboy-hat / brimmed hat — hoods/cowls OK) — a COOL antihero (sleek mask OR cool sharp face). Skin pale/fair OR stylized-exotic, never realistic ethnic-race. FACE/HEAD only.`,
    touchpoints: [
      'a sleek matte-black half-mask with a single glowing-cyan optic-slit, cool and mysterious',
      'a sleek tech-visor and goggles over a sharp hard jaw, a cold confident set',
      'a sharp confident face with a faint smirk, a glowing-amber optic, and sleek temple-augments',
      'a hard cool face with a thin scar through one brow and a sleek chrome cheek-plate',
      'a sleek dark face-wrap leaving only cold sharp eyes and a strong jaw visible',
      'a cool sharp face under a sleek dark hood, sleek goggles pushed up on the brow, a steady cold stare',
      'a striking hard face with a glowing optic and clean integrated cyber along the jaw, confident',
      'an exotic emerald-skinned cool sharp face with a glowing amber eye and a sleek temple-line',
    ],
    instructions: `Each entry is ONE cool antihero face/head + integrated cyber, 14-26 words. ~Half a sleek mask/visor/goggles/face-wrap, ~half a striking cool VISIBLE face (sharp, hard, confident + cool flair). COOL + STYLISH — NEVER a pretty-boy / bare-skull / scruffy-bum / bushy-bearded / generic robot helmet. FACE/HEAD only. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  // ════════════════════════════════════════════════════════════════
  // mech-insect-hybrids — NEW exotic path (2026-06-09). Mechanical/live
  // hybrid insects: an insectoid race where machine + insect fuse into wild
  // sci-fi hybrids. Insect + mechanical aesthetic OVERRULES (insectoid-
  // humanoids allowed but insect/mech dominates). Mirrors scifi-cyborg-female
  // architecture: being(HERO) + fusion_material + eyes + signature_wow + biome
  // + look(register, anti-homogenize) + composition + drama(40%-gated). NO
  // insect-type enumeration in any prefix (first-named-noun lock); the HERO
  // pool carries the species, the look leads CLIP.
  // ════════════════════════════════════════════════════════════════
  mech_insect_being: {
    format: 'simple',
    theme: `MECHANICAL-INSECT HYBRID BEINGS — the HERO axis. Each entry is ONE crazy sci-fi mechanical/insect hybrid — a living insect fused with machine into a wild, poster-worthy hybrid. 30-45 words. Insect anatomy + mechanical engineering MERGED: chitin + chrome, wings + turbines, mandibles + servos, compound eyes + sensor-arrays. Lineage: District-9 / Starship-Troopers bug / Horizon-Zero-Dawn machine / Vitaly-Bulgarov / Sparth bio-mech.

⚠️ THE BAR — clearly an INSECT (a recognizable order: beetle / mantis / wasp / moth / dragonfly / ant / cicada / etc.) fused with MACHINE (servos / hydraulics / chrome plating / reactors / turbines / circuitry). Crazy, exotic, sci-fi. The hybrid IS the hero of the frame.

⚠️ INSECT + MECHANICAL DOMINATES (the overriding rule) — even an insectoid-HUMANOID reads insect-first (chitin carapace, extra limbs, wing-cases, mandibles, compound eyes) + machine-second. NEVER just a human in armor. NEVER a plain humanoid robot with no insect anatomy. The bug + the machine are BOTH unmistakable.

✓ DISTRIBUTION (~25) — vary the insect ORDER + the machine ARCHETYPE HARD:
  • BEETLE-class (~4) — armored beetle-tanks / scarab-constructs / stag-beetle-mechs
  • MANTIS-class (~4) — mantis-drones / scythe-armed mantis-assassins
  • WASP / HORNET-class (~3) — wasp-gunships / hornet-warframes / stinger-drones
  • MOTH / BUTTERFLY-class (~3) — moth-androids / iridescent butterfly-machines
  • DRAGONFLY-class (~3) — dragonfly recon-drones / hover-hunters
  • ANT / TERMITE-class (~3) — ant soldier-constructs / swarm-mech units
  • OTHER-class (~3) — cicada-cyborg / firefly-lantern-bot / stick-insect walker / locust-swarmframe
  • INSECTOID-HUMANOID (~2) — a humanoid whose insect+machine features dominate

Each entry: NAME CAPS + insect order + machine archetype + 2-3 fused anatomical details + a wild signature trait.`,
    touchpoints: [
      'CARAPEX — a hulking rhinoceros-beetle war-construct, glossy black-iridescent chitin shell riveted over brushed steel plating, a massive hydraulic horn-ram, six pistoned legs, a glowing orange reactor-thorax, lumbering and unstoppable',
      'GLAIVE-MANTIS — a tall mantis-drone assassin, slender chrome-and-emerald carapace, two folded-steel scythe forelimbs, a triangular sensor-head with glowing compound eyes, poised mid-strike and lethal',
      'VESPABREAKER — a wasp-gunship hybrid, a segmented yellow-and-black armored thorax bristling with gun-barrels, four buzzing turbine-wings, a chrome stinger-cannon curling beneath, hovering menace',
      'LUNARA — a moth-android, soft grey fractal-scaled wings spanning wide over a sleek white chassis, feathered antenna-sensors, glowing lilac ocelli, an eerie graceful machine',
      'SKIMMER-NINE — a dragonfly recon-drone, an iridescent elongated chrome abdomen, four blurring glass-and-carbon wings, a huge wraparound compound-eye optic dome, darting and precise',
      'MYRMIDON — an ant soldier-construct, matte-black exo-plated body, oversized hydraulic mandibles, segmented cable-muscled legs, a glowing red thorax-core, one of a marching swarm',
      'CICADA-VOX — a cicada-cyborg, translucent amber-resin wing-cases over exposed copper circuitry, a vibrating sound-membrane drum, glowing green eyes, perched and humming with power',
      'STILT-WEAVER — a stick-insect walker-mech, an impossibly tall spindly frame of green-anodized rods and servos, twig-thin camouflaged limbs, a tiny sensor-head, a silent striding sentinel',
      'CHITINE — an insectoid-humanoid warrior, a slender humanoid frame sheathed in beetle-black chitin armor, four arms (two ending in mantis-blades), folded wing-cases on the back, a mandibled faceplate and glowing compound eyes',
    ],
    instructions: `Each entry is ONE mechanical-insect hybrid BEING, 30-45 words. Format: "NAME CAPS — insect order + machine archetype + 2-3 fused anatomical details + a wild signature trait". INSECT + MECHANICAL must BOTH be unmistakable in every entry. Vary the insect order + machine archetype HARD. Insectoid-humanoids OK occasionally but insect/mech features dominate. NEVER a plain human-in-armor or a non-insect robot. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  mech_insect_material: {
    format: 'simple',
    theme: `FUSION MATERIAL — the surface/material truth where the insect biology meets the machine on the hybrid's body. 12-24 words. Describe the seam where chitin meets chrome — finishes, sheens, exposed mechanisms. NO whole-creature description (that's the being axis); JUST the material fusion.`,
    touchpoints: [
      'glossy black beetle-chitin riveted to brushed-steel plating, oil-sheen iridescence pooling along the seams',
      'translucent amber-resin wing-cases over exposed copper circuitry and tiny glowing capacitors',
      'iridescent green-gold carapace fused to chrome actuators, hydraulic fluid glistening at every joint',
      'matte wasp-paper composite layered over carbon-fiber struts, faint warning-stripe glow beneath',
      'pearlescent moth-scale dust over a sleek ceramic chassis, micro-LED veins threading the wing membranes',
      'cracked weathered exoplate patched with scavenged steel, rust and verdigris over warm brass mechanisms',
    ],
    instructions: `Each entry is ONE insect/machine fusion-material description, 12-24 words. Surface + finish + where biology meets machinery only. NO full-creature description. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  mech_insect_eyes: {
    format: 'simple',
    theme: `THE OPTICS — the hybrid insect-machine's eye/sensor system. 10-20 words. Compound eyes, multi-lens optic clusters, glowing ocelli, sensor-domes — bug optics fused with machine sensors.`,
    touchpoints: [
      'a massive wraparound compound eye of a thousand glowing-cyan hexagonal lenses',
      'three crimson ocelli glowing above twitching mechanical antenna-sensors',
      'a clustered optic dome of black glass lenses, each ringed with a faint amber aperture-glow',
      'huge faceted emerald compound eyes with a rotating targeting-iris at each center',
      'a band of tiny white sensor-lenses wrapping the skull beneath feathered antenna-arrays',
    ],
    instructions: `Each entry is ONE insect-machine optic/eye description, 10-20 words. Compound eyes / optic clusters / ocelli / sensor-domes, glowing. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  mech_insect_feature: {
    format: 'simple',
    theme: `THE SIGNATURE FEATURE — the ONE showstopper detail that makes the render pop. 14-28 words. A wow moment: unfolding chitin-plated wings, snapping servo-mandibles, a glowing thorax-reactor, a deploying chrome stinger/ovipositor-weapon, segmented hydraulic legs mid-spring, a swarm-spawning abdomen-hatch.`,
    touchpoints: [
      'enormous iridescent wing-cases cracking open to unfurl four humming glass-and-circuitry flight-wings, light pouring through the membranes',
      'twin scythe-forelimbs of folded chrome snapping wide, hydraulics hissing, edges catching the light',
      'a glowing molten-core thorax pulsing visibly beneath translucent armor plating, venting heat-shimmer',
      'a chrome segmented stinger-cannon arcing up and forward, a bead of glowing venom-plasma at the tip',
      'an abdomen-hatch splitting open to release a glittering cloud of tiny mechanical drone-larvae',
    ],
    instructions: `Each entry is ONE showstopper signature feature, 14-28 words. ONE dramatic insect-machine detail in action. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  mech_insect_biome: {
    format: 'simple',
    theme: `THE SETTING — a cool sci-fi environment that frames the mech-insect (it stays the focus). 18-30 words. Dark, atmospheric, multi-tier depth. Bio-mechanical hive-foundries, swarm-megastructures, resin-and-steel nests, alien insect-worlds, bio-mech labs, derelict bio-ships crawling with machine-bugs.`,
    touchpoints: [
      'inside a towering bio-mechanical hive-foundry, hexagonal resin cells glowing over molten-metal channels, swarm-silhouettes deep in the haze',
      'an alien insect-world canopy of chrome-veined fungal towers, spore-light drifting, a vast nest-structure looming behind',
      'a derelict bio-ship corridor, ribbed organic-metal walls dripping condensation, dim red emergency glow and distant skittering',
      'a sterile white bio-mech lab, suspended specimen-pods and holographic schematics, harsh overhead light raking the subject',
      'a resin-and-steel nest cavern, amber egg-clusters glowing, cable-roots and pipework threading the dark walls',
    ],
    instructions: `Each entry is ONE sci-fi environment for a mech-insect, 18-30 words. Multi-tier depth, atmospheric, the creature stays the focus. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  mech_insect_look: {
    format: 'simple',
    theme: `THE LOOK REGISTER — the RENDERING STYLE only (this LEADS the prompt and anti-homogenizes the path). 8-16 words. PURE rendering technique: palette + lighting mood + finish + render reference. NO anatomy, NO creature content, NO setting — style only.`,
    touchpoints: [
      'sleek hard-surface concept-art render, clean key light, crisp detail, Vitaly-Bulgarov / Sparth register',
      'gritty bio-mechanical realism, grimy industrial palette, harsh practical lighting, District-9 register',
      'lush macro-photography look, shallow depth of field, dewy iridescent detail, nature-documentary register',
      'dark cinematic sci-fi, deep shadows and a single cold rim-light, Villeneuve register',
      'glowing neon-noir, wet reflective highlights, saturated teal-and-magenta haze',
      'painterly creature-design illustration, warm rendered light, visible brushwork, Heavy-Metal register',
    ],
    instructions: `Each entry is ONE pure rendering-style register, 8-16 words. Palette + lighting + finish + reference ONLY. NO anatomy, NO creature, NO setting. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  mech_insect_composition: {
    format: 'simple',
    theme: `COMPOSITION + FRAMING for the mech-insect hero. 14-26 words. Camera angle + framing that makes the hybrid read large and legible, ALWAYS pulled back enough that the WHOLE creature is in frame (full body, not cropped). Pulled-back hero shot / full-body three-quarter / low-angle menace / perched-silhouette / one hero large in front of a deep swarm.`,
    touchpoints: [
      'dramatic low-angle three-quarter, the hybrid looming large and central with its full body in frame, deep environment falling away behind',
      'a pulled-back hero shot framing the whole creature, compound eyes and mandibles still crisp and prominent',
      'full-body profile mid-stride, the whole silhouette legible against a glowing backdrop',
      'a perched full-body high-vantage silhouette, wings half-spread, the world small beneath',
      'the hero large and sharp in the foreground with its full body in frame, a blurred swarm of its kind receding into depth',
    ],
    instructions: `Each entry is ONE composition/framing for a mech-insect hero, 14-26 words. The WHOLE hybrid is in frame (full body, pulled back enough to show the complete creature), large + central + legible — never cropped. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  mech_insect_drama: {
    format: 'simple',
    theme: `DRAMA PHENOMENON — a 40%-gated extra beat woven in (must NOT steal focus from the hero). 14-26 words. A hatching brood, a swarm boiling up behind, venom-drip and sparks, a secondary smaller machine-bug, an attack mid-launch, atmospheric menace.`,
    touchpoints: [
      'a seething swarm of smaller machine-bugs boiling up out of the depths behind the hero',
      'an egg-cluster hatching nearby, tiny chrome larvae unfurling wet wings',
      'sparks and a thin drip of glowing venom-plasma falling from a snapping mandible',
      'a smaller scout-drone-bug hovering at the edge of frame, optics trained on the hero',
      'the hero mid-launch, wing-cases flung open, dust and debris kicked up beneath it',
    ],
    instructions: `Each entry is ONE 40%-gated drama beat, 14-26 words. Adds menace/action without stealing focus from the hero. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  // ════════════════════════════════════════════════════════════════
  // hunter-killers — NEW path (2026-06-09). PURE-MACHINE autonomous hunter-
  // killer drones/units ON THE HUNT (no pilot, no organic) sweeping dead cities
  // + wastelands. Terminator HK / ED-209 / Boston-Dynamics-gone-rogue / Oblivion
  // drone. Axis design per playbook "Inventing new paths" Step 3: split FIGURE
  // (unit + armament + sensor) from ENVIRONMENT (hunting_ground + look), a
  // signature MONEY-SHOT axis (sensor = the targeting/scan moment), framed as
  // hunting the VIEWER, + 40%-gated contact/kill drama. universal:[] (bot's
  // space-coded lighting/atmosphere would fight a grounded dead-city scene —
  // the hunting_ground + look carry the light). NO unit-type enumeration in any
  // prefix (first-named-noun lock); the HERO pool carries the archetype.
  // ════════════════════════════════════════════════════════════════
  hk_unit: {
    format: 'simple',
    theme: `AUTONOMOUS HUNTER-KILLER UNITS — the HERO axis. Each entry is ONE cold, lethal, PURE-MACHINE autonomous hunter-killer ON THE HUNT. 30-45 words. NO pilot, NO rider, NO cockpit-with-a-person, NO organic — the MACHINE itself is the hunter. Sleek or brutal military death-machines. Lineage: Terminator HK-aerial/HK-tank / ED-209 / Boston-Dynamics-gone-rogue / Oblivion drone / Horizon military-machine / Maximum Overdrive.

⚠️ THE BAR — a menacing autonomous war-machine CLEARLY built to HUNT and KILL: cold, precise, lethal, predatory. A recognizable HK archetype with a distinct silhouette, glowing sensors, and weapon hardpoints, mid-hunt (stalking / sweeping / closing in). It IS the predator — the viewer is the prey.

⚠️ PURE MACHINE (the overriding rule) — NO pilot, NO rider, NO visible person operating it, NO organic creature, NO animal. It is a fully autonomous robot hunter. If a human appears at all it is distant PREY, never an operator.

✓ VARIETY MANDATE (~25) — span the HK archetypes HARD:
  • QUADRUPED STALKERS (~4) — fast 4-legged hunter-units (robot-dog/big-cat builds), digitigrade legs
  • AERIAL DRONES (~4) — gunship-drones / VTOL hunter-killers / hovering recon-killers
  • WALKERS (~3) — spider-walkers / tripod-walkers / chicken-walker enforcers
  • SERPENTINE / CRAWLERS (~3) — snake-sentries / centipede-crawlers / tendril-units
  • BIPEDAL ENFORCERS (~3) — humanoid ED-209-style enforcer-droids (still PURE machine, no pilot)
  • TREADED / WHEELED (~3) — tank-hunters / wheeled pursuit-units
  • SNIPER / SENTINEL (~2) — perched long-range sentinel-units
  • SWARM (~3) — clusters of small coordinated hunter-drones moving as one

Each entry: NAME CAPS + HK archetype + chassis/silhouette + 2-3 mechanical details + a predatory hunting trait.`,
    touchpoints: [
      'REAPER-K9 — a quadruped stalker-unit, a sleek matte-black four-legged hunter the size of a wolf, hydraulic digitigrade legs, a faceless sensor-head sweeping side to side, twin shoulder-autocannons, fast and silent',
      'VULTURE-7 — an aerial gunship-drone, a black delta-winged hunter-killer hovering on ducted fans, a chin-mounted minigun and underslung missile-pods, a single red scanner-eye raking the ground below',
      'WIDOW-WALKER — a spider-walker unit, a low-slung armored body on six articulated legs, a cluster of optic-lenses, a dorsal railgun, picking across rubble with cold mechanical patience',
      'IRON-VERDICT — a bipedal enforcer-droid, a hulking ED-209-style chassis stomping forward, dual arm-cannons spun up, hazard-striped armor, a glowing visor-slit, pure machine menace',
      'SIDEWINDER — a serpentine sentry-unit, a segmented chrome snake-body coiling through a shattered doorway, a sensor-crowned head, a built-in flechette-launcher, silent and relentless',
      'GRAVEDIGGER — a treaded tank-hunter, a squat armored hull on heavy tracks, a turret bristling with a chain-gun and a targeting-array, grinding over wreckage',
      'PALE-SNIPER — a perched sentinel-unit, a long-limbed tripod sniper anchored to a rooftop, a meters-long railgun barrel, a glowing telescopic optic, motionless and patient',
      'LOCUST-SWARM — a swarm of small coordinated hunter-drones, dozens of palm-sized quad-rotor killers with needle-stingers, moving together as one dark cloud through the streets',
    ],
    instructions: `Each entry is ONE autonomous hunter-killer UNIT, 30-45 words. Format: "NAME CAPS — HK archetype + chassis/silhouette + 2-3 mechanical details + a predatory hunting trait". PURE MACHINE — NO pilot/rider/person/organic. Vary the HK archetype HARD. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  hk_armament: {
    format: 'simple',
    theme: `ARMAMENT — the weapon system that makes the hunter-killer lethal. 10-22 words. Chain-guns, rail-cannons, missile-pods, plasma-lances, grapple-claws, buzzsaw-limbs, net-launchers, flechette-throwers — the deadly hardware, often mid-deploy or spinning up.`,
    touchpoints: [
      'twin shoulder-mounted autocannons spinning up, brass casings already raining onto the ground',
      'an underslung missile-pod hinging open, a row of target-locks blinking red',
      'a dorsal railgun charging with a rising electric whine, the coils glowing hot',
      'hydraulic grapple-claws flexing beside a humming buzzsaw forelimb',
      'a chin-turret minigun, six barrels blurring into a glowing ring',
      'a forearm flechette-launcher cycling, darts gleaming in the chamber',
    ],
    instructions: `Each entry is ONE HK weapon-system description, 10-22 words. The deadly hardware only, often mid-deploy. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  hk_sensor: {
    format: 'simple',
    theme: `THE HUNT-SENSOR — the SIGNATURE money-shot detail: the moment it is SCANNING / TARGETING / HUNTING. 12-24 words. A sweeping red search-laser, a targeting-grid projected on the ground, a hard spotlight-cone cutting fog, a laser-painting line crawling a wall, a glowing optic-cluster locking on, a thermal-optic glare. THIS is the iconic "it is hunting YOU" detail — render it vivid.`,
    touchpoints: [
      'a single red search-laser sweeping a slow arc across the rubble, dust swirling visibly through the beam',
      'a green targeting-grid projected across the ground, boxes snapping onto every heat-source',
      'a hard white spotlight-cone stabbing through the fog, panning left to right, hunting',
      'a cluster of glowing optic-lenses irising down to pinpoints as it locks on a target',
      'a thin laser-painting line crawling up a wall toward a hidden figure',
      'a thermal-optic glare washing the scene in ghostly white-hot false-color',
    ],
    instructions: `Each entry is ONE hunt-sensor / targeting moment, 12-24 words. The vivid "it is scanning/hunting" beam or grid or optic. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  hk_hunting_ground: {
    format: 'simple',
    theme: `THE HUNTING GROUND — a dark dystopian sci-fi environment the hunter-killer patrols, WITH its own lighting + mood baked in (the unit stays the focus). 18-32 words. MechBot vibe (Blade Runner / Terminator / Ghost in the Shell). Dead neon megacities, foggy rubble-fields, abandoned overpasses, derelict industrial zones, collapsed metro tunnels, war-torn plazas, floodlit perimeters. Multi-tier depth, atmospheric, intricate.`,
    touchpoints: [
      'a dead neon megacity street at night, rain-slick asphalt mirroring dead holographic signs, smoke drifting between black towers',
      'a foggy rubble-field at dusk, collapsed concrete and twisted rebar, a low blood-orange sky bleeding through the haze',
      'a derelict industrial zone under harsh sodium floodlights, chain-link fences and venting steam casting long hard shadows',
      'a collapsed metro tunnel, red emergency strip-lighting flickering, black water on the tracks, dead carriages and debris',
      'an abandoned highway overpass at night, dead cars stacked, a pale moon behind smog, distant fires glowing orange',
    ],
    instructions: `Each entry is ONE dark dystopian hunting-ground, 18-32 words, with its own lighting/mood. MechBot vibe, multi-tier depth, the unit stays the focus. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  hk_look: {
    format: 'simple',
    theme: `THE LOOK REGISTER — the RENDERING STYLE only (this LEADS the prompt and anti-homogenizes the path). 8-16 words. PURE rendering technique: palette + lighting mood + finish + render reference. NO subject, NO setting — style only.`,
    touchpoints: [
      'grim military realism, desaturated steel-and-concrete palette, harsh practical light, Terminator register',
      'neon-noir, wet reflective highlights, saturated teal-and-red haze, Blade Runner 2049 register',
      'sleek hard-surface concept-art render, clean cold key light, crisp detail, Vitaly-Bulgarov register',
      'muted overcast realism, flat grey light, raw textured finish, Simon Stalenhag register',
      'dark cinematic, deep shadows and a single hard rim-light, Denis Villeneuve register',
      'high-contrast thriller grade, cold blue shadows and hot amber practicals, anamorphic flare',
    ],
    instructions: `Each entry is ONE pure rendering-style register, 8-16 words. Palette + lighting + finish + reference ONLY. NO subject, NO setting. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  hk_composition: {
    format: 'simple',
    theme: `COMPOSITION + FRAMING for the hunter-killer — make it feel like the machine is HUNTING THE VIEWER. 14-26 words. ALWAYS pulled back enough to read the WHOLE unit (full body, not cropped). Low-angle menace / the unit closing in toward camera / a wide patrol-sweep / a perched sentinel scanning down / its beam finding the lens. NEVER a tight head-only crop.`,
    touchpoints: [
      'a low-angle shot as the unit strides toward camera, its sensor swinging to face the viewer, full body in frame',
      'a wide patrol-sweep, the whole unit small-to-mid in a vast dead street, scale and dread clear',
      'a perched high-angle as the sentinel scans down a ruined canyon-street, full silhouette against the sky',
      'the unit emerging from fog straight at the lens, search-beam flaring toward the camera, complete body visible',
      'a three-quarter full-body as it freezes mid-prowl, head turned to fix the viewer in its optics',
    ],
    instructions: `Each entry is ONE composition for an HK unit, 14-26 words, framed as hunting the viewer. The WHOLE unit in frame (full body), never cropped. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  hk_drama: {
    format: 'simple',
    theme: `CONTACT / KILL — a 40%-gated action beat (must NOT steal focus from the hero unit). 14-26 words. Tracer-fire raking the dark, a distant fleeing prey-silhouette caught in the searchlight, a downed sparking rival drone, a pack of HK units converging, an explosion backlighting the hunter, prey scattering.`,
    touchpoints: [
      'tracer-fire and muzzle-flash strobing from its guns into the dark, a target lighting up downrange',
      'a lone distant human silhouette frozen mid-run in its searchlight beam, the moment before',
      'a downed rival drone sparking on the ground beneath it, its optics dimming out',
      'two more identical HK units converging from side-streets, their search-beams crossing',
      'an explosion blooming behind it, backlighting the hunter in a wash of orange',
    ],
    instructions: `Each entry is ONE 40%-gated contact/kill beat, 14-26 words. Adds action/menace; any human is distant PREY only. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  // ════════════════════════════════════════════════════════════════
  // abyss-mechs — NEW path (2026-06-09). Deep-sea MACHINES in the crushing
  // abyssal dark — dive-mechs / submersible war-rigs / leviathan-constructs /
  // hadal sentinels (NOT sea-animals; those were the rejected cyber-beast).
  // Fills the missing AQUATIC biome. Subnautica / The Abyss / BioShock Big-Daddy
  // / Pacific Rim underwater. Axis design per playbook Step 3: FIGURE (mech HERO)
  // + signature MONEY-SHOT (lumens = the lights cutting the black) + ENVIRONMENT
  // (abyss + look) + composition (crushing scale) + 40%-gated deep-sea drama.
  // universal:[] (bot space-lighting fights underwater; abyss/lumens/look carry
  // the light). Non-negotiable: ALWAYS fully submerged in the crushing dark.
  // ════════════════════════════════════════════════════════════════
  abyss_mech: {
    format: 'simple',
    theme: `DEEP-SEA MECHS — the HERO axis. Each entry is ONE machine engineered for the crushing abyssal deep. 30-45 words. A MACHINE in the deep (NOT a sea-animal) — heavy pressure-hull plating, domed viewports, ballast-tanks, thruster-pods, manipulator-claws, floodlight-arrays. Lineage: Subnautica / The Abyss / BioShock Big-Daddy / Pacific Rim underwater / deep-sea-ROV-gone-titan.

⚠️ THE BAR — a machine clearly built to survive the abyss: heavy pressure-hull, glowing viewports/lamps, engineered for the crushing deep. A recognizable deep-sea-mech archetype, mid-descent or prowling the black seafloor. It is a MACHINE, never a creature.

⚠️ MACHINE, NOT A SEA-ANIMAL (the overriding rule) — even a serpentine sub-mech is a hull-segmented MACHINE, not a living eel. Pressure-plating, rivets, thrusters, lamps, viewports. NO scales/fins/gills/flesh as the body. The machine IS the hero.

✓ VARIETY MANDATE (~25):
  • ARMORED DIVE-MECHS (~5) — humanoid deep-suit war-mechs (Big-Daddy / atmospheric-diving-suit scaled up), heavy pressure-plating
  • SUBMERSIBLE WALKERS (~4) — multi-legged abyssal walker-rigs crawling the seafloor
  • LEVIATHAN-CONSTRUCTS (~4) — colossal building-scale machine-titans of the deep, slow
  • ROV / DRONE-MECHS (~3) — autonomous thruster-driven submersible hunter/recon mechs
  • INDUSTRIAL RIGS (~3) — deep-sea mining/salvage mechs, drill-arms, harvester-claws
  • HADAL SENTINELS (~3) — anchored dormant guardian-mechs at trench-mouths, glowing
  • SERPENTINE SUB-MECHS (~3) — segmented hull-bodied submersible machines (still MACHINE)

Each entry: NAME CAPS + deep-sea-mech archetype + pressure-hull silhouette + 2-3 mechanical details (viewports / thrusters / claws / lamps) + a deep-sea trait.`,
    touchpoints: [
      'TRIDENT-DEEP — an armored dive-mech, a hulking humanoid pressure-suit-mech of riveted brass-and-steel plating, a domed porthole-helm glowing warm from within, hydraulic claw-hands, ballast-tanks venting bubbles, trudging the seafloor',
      'ABYSSAL-CRAWLER — a submersible walker-rig, a heavy armored pod on six hydraulic legs picking across black silt, floodlight-arrays blazing forward, a folded manipulator-arm beneath',
      'LEVIATHAN-IX — a colossal machine-construct, a building-scale deep-titan of barnacled hull-plating, rows of glowing viewport-windows down its flank, slow thruster-wash stirring the dark',
      'NAUTILUS-K — an ROV hunter-mech, a sleek torpedo-bodied drone trailing thruster-glow, a cluster of sensor-lamps and a grabber-claw, darting through the black water',
      'DRILLHEAD — a deep-sea mining mech, a squat industrial rig with a massive rotary drill-bit, harvester-claws and a floodlit cage-frame, grinding into a vent-wall',
      'WARDEN-0 — a hadal sentinel, a tall dormant guardian-mech anchored at a trench-mouth, a single eye-lamp pulsing slowly in the dark, encrusted with deep-sea growth',
      'EELRIG — a serpentine sub-mech, a segmented chrome hull-bodied submersible undulating through the water, running-lights tracing its length, a sensor-head leading',
      'IRONJAW — a salvage mech, a broad armored hull with hydraulic jaw-clamps and a winch-arm, dragging a chain across a sunken wreck, lamps cutting the murk',
    ],
    instructions: `Each entry is ONE deep-sea MECH, 30-45 words. Format: "NAME CAPS — deep-sea-mech archetype + pressure-hull silhouette + 2-3 mechanical details + a deep-sea trait". A MACHINE, never a sea-animal. Vary the archetype HARD. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  abyss_lumens: {
    format: 'simple',
    theme: `THE LIGHTS IN THE DARK — the SIGNATURE money-shot: the mech's own lamps + bioluminescence cutting the crushing abyssal black. 12-24 words. Floodlight-cones stabbing the black water (volumetric, marine-snow drifting through), glowing viewport-domes, hull running-lights, bioluminescent glow rippling off the wet chassis. THE iconic deep-sea-light shot.`,
    touchpoints: [
      'twin floodlight-cones stabbing into the black water, marine snow drifting like dust through the beams',
      'warm light glowing from a domed viewport-helm, the only warmth in the crushing dark',
      'a row of hull running-lights tracing the machine, reflections rippling on its wet plating',
      'cold blue bioluminescence washing over the chassis from unseen creatures nearby',
      'a sweeping searchlight raking the seafloor silt, kicking up glittering particulate',
      'green chemical-glow lamps casting long shadows through the suspended deep-sea haze',
    ],
    instructions: `Each entry is ONE deep-sea light detail, 12-24 words. The mech's lamps + bioluminescence cutting the black, volumetric, marine-snow. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  abyss_biome: {
    format: 'simple',
    theme: `THE ABYSS — the deep-sea environment in the crushing dark, WITH its own lighting/mood (the mech stays the focus). 18-32 words. A hadal trench, a sunken reactor-wreck, a black-smoker hydrothermal vent-field, a bioluminescent abyssal plain, a derelict underwater city, a colossal sunken megastructure. Marine snow, surface-light fading to black above, crushing depth.`,
    touchpoints: [
      'a hadal trench wall dropping into bottomless black, ledges of pale sediment, marine snow drifting endlessly down through the dark',
      'a sunken reactor-wreck half-buried in silt, broken hull-plates and a faint radioactive glow leaking from its core, debris suspended',
      'a hydrothermal vent-field of black-smoker chimneys belching mineral clouds, ghostly tube-worm colonies glowing at their bases',
      'a derelict underwater city, drowned towers furred with growth, broken dome-glass, schools of glow drifting through dead windows',
      'a colossal sunken megastructure looming out of the murk, rows of dead portholes, its scale lost in the fading dark above',
    ],
    instructions: `Each entry is ONE deep-sea environment, 18-32 words, with its own lighting/mood. Crushing dark, marine snow, the mech stays the focus. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  abyss_look: {
    format: 'simple',
    theme: `THE LOOK REGISTER — the RENDERING STYLE only (leads CLIP, anti-homogenize). 8-16 words. PURE rendering technique: palette + lighting mood + finish + reference. NO subject, NO setting — style only.`,
    touchpoints: [
      'deep-sea documentary realism, murky blue-green palette, volumetric god-rays, BBC Blue Planet register',
      'bioluminescent neon-noir, glowing teal-and-magenta accents against crushing black',
      'dark cinematic, a single cold light-source in the void, The Abyss / Villeneuve register',
      'sleek hard-surface concept-art, cold key light through water, crisp detail, Vitaly-Bulgarov register',
      'muted painterly realism, suspended particulate, moody desaturation, Simon Stalenhag register',
      'high-contrast murk, hard floodlight against absolute black, heavy atmospheric depth',
    ],
    instructions: `Each entry is ONE pure rendering-style register, 8-16 words. Palette + lighting + finish + reference ONLY. NO subject, NO setting. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  abyss_composition: {
    format: 'simple',
    theme: `COMPOSITION + FRAMING for the deep-sea mech — convey CRUSHING SCALE + ISOLATION. 14-26 words. ALWAYS pulled back enough to read the WHOLE machine (full body, not cropped). The mech descending into the black / dwarfed by an abyssal structure / prowling the lit seafloor / surface god-rays fading above and the bottomless deep below. NEVER a tight crop.`,
    touchpoints: [
      'a wide shot, the mech tiny against a colossal sunken structure, scale and isolation overwhelming, full body in frame',
      'the mech descending into the black, faint surface god-rays fading above, the bottomless deep below, complete silhouette',
      'a low-angle as the mech trudges the seafloor toward camera, floodlights flaring, the whole machine legible',
      'a three-quarter full-body, the mech prowling a vent-field, its lamps carving the murk, environment deep behind',
      'the mech mid-water and dwarfed, marine snow streaking past, full body framed against the fading blue void',
    ],
    instructions: `Each entry is ONE composition for a deep-sea mech, 14-26 words, conveying crushing scale + isolation. The WHOLE machine in frame (full body), never cropped. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  abyss_drama: {
    format: 'simple',
    theme: `DEEP-SEA PHENOMENON — a 40%-gated beat (must NOT steal focus from the mech hero). 14-26 words. A colossal leviathan-SHADOW passing in the dark, a swarm of glowing bioluminescent creatures drifting past, a black-smoker vent erupting, a wreck collapsing in slow silt-clouds, a distant anglerfish-lure glowing. Atmosphere, not the hero.`,
    touchpoints: [
      'a colossal dark leviathan-shape passing slowly in the deep murk behind the mech, barely seen',
      'a drifting swarm of glowing jellyfish and siphonophores pulsing past in the dark',
      'a black-smoker vent erupting nearby, a billowing cloud of superheated mineral-smoke',
      'a slow silt-cloud blooming as a section of wreck collapses behind the machine',
      'a single distant anglerfish-lure glowing in the black, the only other light for miles',
    ],
    instructions: `Each entry is ONE 40%-gated deep-sea phenomenon, 14-26 words. Atmospheric (distant leviathan / glowing life / vent / collapse), never stealing focus from the mech. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  // ════════════════════════════════════════════════════════════════
  // sentinels — NEW path (2026-06-09). COLOSSAL ancient guardian-mechs, half-
  // dormant + overgrown after ages, in sacred awe-landscapes. Fills MechBot's
  // missing QUIET/AWE register (everything else is action-forward). Shadow of
  // the Colossus / Horizon tallneck / Ghibli-Mononoke / Castle in the Sky. Axis
  // design per playbook Step 3: FIGURE (sentinel HERO) + signature MONEY-SHOT
  // (awakening = ancient optics kindling to life) + ENVIRONMENT (realm + look) +
  // composition (always a scale-prover proving godlike size) + 40%-gated stirring
  // drama. universal:[] (bot space-lighting fights a misty-valley/temple scene;
  // realm/look/awakening carry the light). Awe + ancient majesty, NOT action.
  // ════════════════════════════════════════════════════════════════
  sentinel_being: {
    format: 'simple',
    theme: `COLOSSAL ANCIENT GUARDIAN-MECHS — the HERO axis. Each entry is ONE monumentally huge, ancient, half-dormant guardian-MACHINE, weathered and overgrown by ages. 30-45 words. Godlike scale, sacred, slumbering. Lineage: Shadow of the Colossus / Horizon tallneck / NieR / Castle in the Sky robot / Princess Mononoke forest-god / a buried titan.

⚠️ THE BAR — a COLOSSAL ancient guardian that DWARFS everything (a human is an ant at its foot), weathered and overgrown after ages of dormancy, sacred and awe-inspiring. A recognizable guardian archetype, monumental and still. Ancient majesty — NOT a shiny new war-machine, NOT mid-battle.

⚠️ ANCIENT + OVERGROWN + DORMANT (the overriding rule) — weathered metal-and-stone reclaimed by nature (moss, vines, lichen, coral, sand, ice, rust-streaks), half-asleep or just stirring. The awe is its AGE + SCALE + stillness, never combat. It is a MACHINE (a guardian-mech), even when overgrown.

✓ VARIETY MANDATE (~25):
  • HUMANOID COLOSSI (~5) — towering ancient humanoid guardian-giants
  • STRIDING QUADRUPEDS (~4) — long-legged tallneck/colossus-strider machine-walkers (NOT animals)
  • SEATED IDOL-MECHS (~4) — temple-guardian seated colossi, idol-like, dormant
  • BURIED / EMERGING TITANS (~3) — half-buried colossi rising from sand/earth/sea
  • WINGED SKY-SENTINELS (~3) — vast winged guardian-machines perched on peaks
  • GATE / WALL GUARDIANS (~3) — colossal guardians built into ancient gates/walls/cliffs
  • OBELISK / TOWER SENTINELS (~3) — monolithic tower-guardians with carved faces

Each entry: NAME CAPS + guardian archetype + colossal weathered silhouette + 2-3 ancient/overgrown details + a dormant/sacred trait.`,
    touchpoints: [
      'VERDANT-WARDEN — a towering humanoid colossus, a hundred-meter guardian of green-patinated bronze and mossed stone, vines cascading from its shoulders, a serene weathered face, one hand resting on the valley floor, long dormant',
      'STRIDER-OF-AGES — a colossal quadruped tallneck-strider, impossibly long legs of weathered iron, a great disc-crowned head wreathed in cloud, lichen furring its flanks, stepping slow across the mountains',
      'THE-SEATED-KING — a seated temple-idol-mech, a monumental guardian throned in a jungle ruin, roots binding its folded limbs, a cracked ornate faceplate, dark dormant eye-sockets, sacred and still',
      'SAND-COLOSSUS — a half-buried titan, a giant guardian-mech rising shoulder-deep from desert dunes, sand pouring off corroded golden plating, an eroded crowned head facing the sun, ancient',
      'SKY-SENTINEL VANE — a vast winged guardian perched on a cliff-peak, ragged metal wings furred with frost, a beaked stone-and-bronze visage, talons gripping the summit, watching the clouds',
      'THE-GATE-WARDENS — colossal twin guardians built into an ancient mountain gate, flanking a chasm, vines and waterfalls spilling over their armored forms, eyes long dark',
      'OBELISK-PRIME — a monolithic tower-sentinel, a weathered black-stone-and-iron monolith with a carved guardian-face, runic seams threading its height, half-swallowed by jungle, dormant',
      'CORAL-LEVIATHAN — a half-sunk colossus in a flooded ruin, a giant guardian waist-deep in still water, coral and barnacles crusting its bronze flanks, a tilted serene head, ages-still',
    ],
    instructions: `Each entry is ONE colossal ancient guardian-mech, 30-45 words. Format: "NAME CAPS — guardian archetype + colossal weathered silhouette + 2-3 ancient/overgrown details + a dormant/sacred trait". MONUMENTAL + ANCIENT + OVERGROWN + DORMANT, a MACHINE, never a shiny war-mech, never mid-battle. Vary the archetype HARD. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  sentinel_awakening: {
    format: 'simple',
    theme: `THE AWAKENING — the SIGNATURE money-shot: the moment of dormancy or first stirring. 12-24 words. Ancient optics kindling from black to a faint glow in a weathered face, a chest-core pulsing slowly back to life, dust + dry moss cascading as it stirs, runic seams lighting up — OR fully dormant (cold dark eyes, asleep). The light-of-life returning to an ancient god.`,
    touchpoints: [
      'ancient eye-sockets kindling from black to a faint warm amber glow for the first time in ages',
      'a deep chest-core pulsing slowly awake, light bleeding through cracks in the mossed armor',
      'dust and dry moss cascading off its shoulders as it stirs, joints grinding after centuries',
      'runic seams igniting in a slow wave of pale-blue light up its weathered body',
      'cold dark eye-sockets and unlit seams — fully dormant, asleep, a sleeping god',
      'a single great eye-lamp flickering, struggling, then steadying to a low sacred glow',
    ],
    instructions: `Each entry is ONE awakening/dormancy detail, 12-24 words. The light-of-life kindling in an ancient guardian (or fully asleep). Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  sentinel_realm: {
    format: 'simple',
    theme: `THE REALM — the awe-inspiring sacred landscape the guardian stands in, WITH its own lighting/mood (the sentinel stays the focus). 18-32 words. A misty mountain valley, an overgrown jungle temple, a vast desert with the colossus half-buried, a frozen aurora-tundra, a flooded ruin, a cliff-edge above a sea of clouds, an ancient cathedral-canyon. Monumental, atmospheric, sacred, multi-tier depth.`,
    touchpoints: [
      'a misty green mountain valley at dawn, waterfalls threading distant cliffs, low fog pooling around the colossus feet, soft god-rays breaking through',
      'an overgrown jungle temple-ruin, broken ziggurat steps swallowed by roots, shafts of green light through the canopy, birds drifting',
      'a vast desert at golden hour, endless dunes, the low sun casting the colossus shadow for miles, heat-haze shimmering',
      'a frozen tundra under aurora, snow drifting over ancient ruins, the guardian black against a pale glowing sky',
      'a cliff-edge above an endless sea of clouds at sunset, the guardian silhouetted on the brink, gold light raking its weathered form',
    ],
    instructions: `Each entry is ONE sacred awe-landscape, 18-32 words, with its own lighting/mood. Monumental, atmospheric, the sentinel stays the focus. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  sentinel_look: {
    format: 'simple',
    theme: `THE LOOK REGISTER — the RENDERING STYLE only (leads CLIP, anti-homogenize). 8-16 words. PURE rendering technique: palette + lighting mood + finish + reference. NO subject, NO setting — style only.`,
    touchpoints: [
      'lush painterly fantasy realism, warm golden-hour light, soft atmospheric haze, Studio Ghibli register',
      'muted melancholic realism, desaturated greens and greys, soft overcast light, Shadow of the Colossus register',
      'epic concept-art render, dramatic god-rays, crisp detail, Horizon Zero Dawn register',
      'misty romantic landscape painting, luminous fog, deep tonal depth, Ivan Shishkin register',
      'sacred cinematic, low warm key light and long shadows, reverent stillness, Villeneuve register',
      'sun-drenched hazy realism, dust motes in golden light, weathered patina, archaeological-awe register',
    ],
    instructions: `Each entry is ONE pure rendering-style register, 8-16 words. Palette + lighting + finish + reference ONLY. NO subject, NO setting. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  sentinel_composition: {
    format: 'simple',
    theme: `COMPOSITION + FRAMING — PROVE THE COLOSSAL SCALE. 14-26 words. ALWAYS a tiny scale-prover (a lone human / pilgrim / traveler / bird-flock / village) dwarfed by the guardian. Full-body monumental — the sentinel towering and dominating, low-angle awe, or filling the sky. Convey godlike scale + reverence. NEVER a tight crop, NEVER without a scale cue.`,
    touchpoints: [
      'a tiny lone figure standing at the colossus foot, dwarfed to an ant, the full guardian towering into the mist above, scale overwhelming',
      'a low-angle looking up the full height of the guardian, a flock of birds wheeling tiny around its head, monumental',
      'a wide vista, the colossus dominating the valley, a tiny traveler at its base for scale, full body in frame',
      'the guardian filling most of the frame against the sky, a minuscule human silhouette on a ridge below gazing up',
      'a distant reverent wide shot, the seated colossus and a tiny pilgrim on the temple steps before it, sacred scale',
    ],
    instructions: `Each entry is ONE composition for a colossal guardian, 14-26 words, ALWAYS with a tiny scale-prover. Full-body monumental, godlike scale, never cropped. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  sentinel_drama: {
    format: 'simple',
    theme: `STIRRING — a 40%-gated awe-beat (must NOT steal focus from the guardian hero). 14-26 words. The sentinel taking a first ground-quaking step (dust/debris falling), a flock of birds exploding off it, light blazing from its newly-woken core, a pilgrim kneeling before it, golden god-rays breaking over it, a slow turn of its great head.`,
    touchpoints: [
      'its great head turning slowly for the first time in ages, dust and birds scattering from the movement',
      'a first colossal step landing, the ground quaking, debris and dust cascading down its legs',
      'light blazing suddenly from its woken core, washing the valley in warm sacred glow',
      'a tiny robed pilgrim kneeling at its feet, minuscule against the waking god',
      'golden god-rays breaking through cloud to crown the guardian, birds wheeling around its head',
    ],
    instructions: `Each entry is ONE 40%-gated stirring/awe beat, 14-26 words. Adds reverent awe (not combat); any human is a tiny scale-prover. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  // ════════════════════════════════════════════════════════════════
  // chrome-shogun — NEW path (2026-06-09). Feudal-future SAMURAI WAR-MECHS —
  // machine-samurai in ornate kabuto/do/menpo armor, plasma-katana, honor +
  // ceremony + menace. Fills the eastern-mecha/honor register. Ghost of Tsushima
  // / Gundam samurai / Sekiro / Nioh / Afro Samurai. Distinct from killer-
  // cyborgs-male (street cyber-ninja). Axis design per playbook Step 3: FIGURE
  // (shogun HERO + blade money-shot) + ENVIRONMENT (domain + look) + composition
  // + 40%-gated honor-duel drama. universal:[] (bot space-lighting fights a
  // cherry-blossom-courtyard scene; domain/look carry the light).
  // ════════════════════════════════════════════════════════════════
  shogun_being: {
    format: 'simple',
    theme: `FEUDAL-FUTURE SAMURAI WAR-MECHS — the HERO axis. Each entry is ONE armored MACHINE-SAMURAI (a robot/mecha built in the samurai aesthetic). 30-45 words. Ornate samurai armor (horned kabuto helm, do chest-armor, sode shoulder-guards, menpo war-mask, sashimono back-banner) rebuilt in chrome + lacquered alloy, bearing a katana or naginata. Honor + ceremony + lethal menace. Lineage: Ghost of Tsushima / Gundam samurai / Sekiro / Nioh / Afro Samurai.

⚠️ THE BAR — a samurai WAR-MECH: a machine in samurai form, ornate feudal armor reimagined in chrome/lacquer/alloy with glowing accents, a blade in hand, honorable and lethal. A recognizable samurai archetype, in a poised or dueling moment. A machine-samurai — NOT a human in cosplay.

⚠️ FEUDAL + SAMURAI + MACHINE (the overriding rule) — the samurai aesthetic DOMINATES (kabuto, menpo mask, lacquer-armor, banner, katana) but it IS a mech (chrome, servos, glowing accents, alloy). Honor + ceremony + menace, NOT modern military. Both human-scale android-samurai and larger mecha-samurai welcome.

✓ VARIETY MANDATE (~25):
  • DAIMYO WARLORDS (~4) — towering ornate lord-mechs, horned kabuto, commanding
  • RONIN WANDERERS (~4) — weathered masterless samurai-mechs, worn armor, lone
  • ONI-MASKED WARLORDS (~3) — demon-masked menacing samurai-mechs, red/black lacquer
  • KENSEI DUELISTS (~4) — sleek master-swordsman mechs, perfect form, drawn blade
  • SOHEI WARRIOR-MONKS (~3) — naginata-wielding monk-mechs, prayer-beads, robed-armor
  • ASHIGARU SOLDIERS (~3) — simpler foot-soldier samurai-mechs, yari spears, banners
  • GIANT MECHA-SAMURAI (~3) — building-scale samurai war-mechs, Gundam-scale

Each entry: NAME CAPS + samurai archetype + ornate armor silhouette + 2-3 mech/feudal details + an honor/menace trait.`,
    touchpoints: [
      'AKAGANE-DONO — a towering daimyo war-mech, lacquered crimson-and-gold do-armor over a chrome chassis, a great horned kabuto crowned with a glowing mon-crest, a menpo war-mask, a sashimono banner rising from its back, commanding and lethal',
      'THE-GREY-RONIN — a weathered masterless samurai-mech, dull battle-scarred steel armor, a cracked menpo mask, a single chipped chrome katana at its hip, a tattered horo cape, walking alone',
      'ONI-NO-TETSU — an oni-masked warlord mech, black-and-red lacquer plating, a snarling horned demon-mask glowing from within, twin energy-katana crossed on its back, menacing and still',
      'SHIRANUI — a sleek kensei duelist mech, polished pale alloy armor in perfect samurai form, a slender glowing plasma-katana drawn low in iaijutsu stance, calm and deadly',
      'MYORIN — a sohei warrior-monk mech, robed armor over a brass-and-iron frame, a long energy-naginata, strings of glowing prayer-beads, a serene masked face',
      'ASHI-NINE — an ashigaru foot-soldier mech, simple riveted armor and a conical jingasa helm, a long energy-yari spear, a clan-banner on its back, one of a marching line',
      'TENGU-O — a giant mecha-samurai, a building-scale war-mech in ornate red samurai armor, a vast horned helm, a tower-tall nodachi blade planted in the earth, monumental',
      'YUKI-KAGE — a wandering ronin-mech in snow-pale armor, a wide amigasa straw-hat over a chrome menpo, a frost-rimed katana, breath-vapor venting from its mask, solitary',
    ],
    instructions: `Each entry is ONE feudal samurai WAR-MECH, 30-45 words. Format: "NAME CAPS — samurai archetype + ornate armor silhouette + 2-3 mech/feudal details + an honor/menace trait". A MACHINE-samurai (chrome/lacquer/alloy mech in samurai form), NOT a human. Vary the archetype HARD. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  shogun_blade: {
    format: 'simple',
    theme: `THE BLADE — the SIGNATURE money-shot: the samurai weapon, glowing and drawn. 12-24 words. A plasma-katana held in stance, a humming energy-naginata, twin glowing wakizashi, a drawn nodachi catching light, the iaijutsu flash of a draw-cut, a kanabo club crackling with energy. The iconic samurai-mech weapon.`,
    touchpoints: [
      'a slender plasma-katana drawn and held low, its edge a line of humming white-blue light',
      'a long energy-naginata spun to a ready guard, the blade trailing a faint glowing arc',
      'twin glowing wakizashi crossed before its mask, light pooling on the lacquered armor',
      'the white flash of an iaijutsu draw-cut, the katana a blur of light mid-strike',
      'a tower-tall nodachi planted point-down in the earth, energy crawling up the fuller',
      'twin katana drawn in a dual-wield stance, a mirrored glow tracing both edges',
    ],
    instructions: `Each entry is ONE samurai-mech weapon moment, 12-24 words. The glowing blade, drawn or mid-strike. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  shogun_domain: {
    format: 'simple',
    theme: `THE DOMAIN — a DARK, CINEMATIC feudal-future landscape (its own lighting/mood; the samurai-mech stays the focus). 18-32 words. This world is DARK, moody, weathered and lived-in — Ghost of Tsushima's grim hours, NOT a bright tourist postcard. It must sit alongside MechBot's other dark sci-fi paths (dead cities, abyssal deeps, ruined wastes). Span MANY distinct settings.

🚫 STRICT BANS (keep it ON-BRAND with MechBot's dark sci-fi world):
  • NEVER a torii gate or any vermilion / orange wooden gate-arch — off-brand cliché, banned outright; do not depict one
  • NEVER bright sunny tourist-postcard Japan — no pristine pink cherry-blossom courtyards, no clean pagoda postcards, no calm zen-garden brochures, no daylight travel-magazine scenes
  • Keep it DARK, atmospheric, moody, cinematic, weathered — fog, rain, snow, smoke, night, dusk, storm

✓ VARIETY MANDATE (~25) — span these, distribute roughly even:
  • burning castle-towns / besieged fortresses (~4)
  • misty battlefields with broken banners + fallen war-mechs (~4)
  • dark bamboo / cedar forests at night (~3)
  • snow-bound mountain fortresses / blizzard passes (~3)
  • neon-rain cyber-Edo backstreets, dark and wet (~3)
  • storm-lashed coastal cliffs with dark keeps (~2)
  • ruined, overgrown, half-collapsed feudal structures, dark (~2)
  • war-camps at night — braziers, tents, clan-banners (~2)
  • dark castle interiors / great halls, lantern-lit (~2)`,
    touchpoints: [
      'a burning feudal castle-town at night, embers and paper lanterns rising into black smoke, a tiered castle silhouetted in flame',
      'a misty battlefield at dawn, broken banners and fallen war-mechs half-sunk in mud, a dull blood-red sun behind the fog',
      'a dark bamboo forest at night, cold moonlight slicing between the stalks, fog pooling low, deep shadow all around',
      'a snow-bound mountain fortress in a blizzard, dark stone ramparts and frozen banners, wind driving the snow sideways',
      'a neon cyber-Edo backstreet in heavy rain, holographic kanji signage bleeding light onto wet black stone, steam and shadow',
      'a storm-lashed coastal cliff at dusk, a dark tiered keep clinging to the rock, waves smashing far below',
      'a war-camp at night on a black plain, rows of braziers and clan-banners, tents and drifting smoke under a starless sky',
      'a ruined, half-collapsed great hall swallowed by dark forest, broken timbers and moss, a single shaft of cold grey light',
    ],
    instructions: `Each entry is ONE DARK, cinematic feudal-future landscape, 18-32 words, with its own moody lighting. NEVER a torii gate / vermilion gate-arch, NEVER bright tourist-postcard Japan — keep it dark, weathered, atmospheric, on-brand with MechBot's sci-fi world. The samurai-mech stays the focus. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  shogun_look: {
    format: 'simple',
    theme: `THE LOOK REGISTER — the RENDERING STYLE only (leads CLIP, anti-homogenize). 8-16 words. PURE rendering technique: palette + lighting mood + finish + reference. NO subject, NO setting — style only.`,
    touchpoints: [
      'cinematic samurai realism, moody desaturated palette, hard low light, Ghost of Tsushima register',
      'ukiyo-e-meets-realism, flat bold color planes, woodblock texture over photoreal form',
      'sumi-e ink-wash drama, monochrome with one red accent, negative space, brush-stroke edges',
      'golden-hour epic, warm raking light and long shadows, dust and petals in the air',
      'neon cyber-Edo noir, wet teal-and-vermilion reflections, holographic glow',
      'dark cinematic, deep shadow and a single hard rim-light, Kurosawa-via-Villeneuve register',
    ],
    instructions: `Each entry is ONE pure rendering-style register, 8-16 words. Palette + lighting + finish + reference ONLY. NO subject, NO setting. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  shogun_composition: {
    format: 'simple',
    theme: `COMPOSITION + FRAMING for the samurai-mech — dramatic + honorable. 14-26 words. ALWAYS pulled back enough to read the WHOLE mech (full body, not cropped). A duel-stance, a lone-warrior-in-landscape, a low-angle hero, the blade catching light, a stand against a vast sky. NEVER a tight head-only crop.`,
    touchpoints: [
      'a lone full-body hero shot, the samurai-mech standing against a vast dusk sky, blade drawn, complete silhouette',
      'a low-angle duel-stance, the mech coiled to strike, petals swirling, full body legible',
      'a wide landscape shot, the lone samurai-mech small-to-mid against a sweeping feudal vista, scale and solitude',
      'a dramatic three-quarter, the mech mid-draw, light flaring off the blade, whole figure in frame',
      'the samurai-mech silhouetted on a ridge against a blood moon, banner snapping, full body framed',
    ],
    instructions: `Each entry is ONE composition for a samurai-mech, 14-26 words. The WHOLE mech in frame (full body), dramatic + honorable, never cropped. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  shogun_drama: {
    format: 'simple',
    theme: `CLASH — a 40%-gated honor/battle beat (must NOT steal focus from the hero samurai-mech). 14-26 words. A duel mid-strike against a rival samurai-mech, cherry-blossom petals exploding, a dawn standoff, a battlefield of banners + fallen mechs, an iaijutsu flash-cut, a kneeling vow before battle.`,
    touchpoints: [
      'mid-duel, blades locked against a rival samurai-mech, sparks erupting where the energy-edges meet',
      'a storm of cherry-blossom petals exploding outward as it completes a strike',
      'a battlefield of planted banners and fallen mechs stretching behind it under a blood moon',
      'a second samurai-mech facing it across a courtyard, both blades drawn, the held breath before',
      'kneeling on one knee, blade planted, head bowed in a vow before the coming battle',
    ],
    instructions: `Each entry is ONE 40%-gated honor/clash beat, 14-26 words. Adds duel/ceremony drama without stealing focus from the hero. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  // ════════════════════════════════════════════════════════════════
  // cyborg-man REBUILD → "android-man" register (2026-05-26)
  // MOSTLY-MACHINE male android-BEING. Synthetic chassis dominates the
  // silhouette; organic shows ONLY at eyes / a partial face-panel. A human
  // GHOST inside an engineered machine body — Alita / Ghost in the Shell
  // Major / Nier Automata / battle-android / Cyberpunk full-borg. RUGGED,
  // weathered, lethal — NEVER pretty-boy, NEVER a model, NEVER a handsome
  // organic head pasted onto a chrome torso. FULL-FIGURE in a sci-fi scene,
  // NOT a bust portrait. The body is a UNIFIED engineered form — no flesh /
  // chrome "seam" where a human head meets a robot body.
  // ════════════════════════════════════════════════════════════════

  // ─── android-man: chassis class (identity anchor — model / role / silhouette) ───
  android_man_chassis: {
    format: 'simple',
    theme: `BODY / BUILD types for a CYBORG MAN (a MAN who became a cyborg — human ghost, human-shaped body, heavily augmented). Each entry 30-50 words. This is the IDENTITY ANCHOR — it sets his whole silhouette and purpose. Deus Ex Adam Jensen / Cyberpunk Edgerunners David / Alita / Ghost in the Shell Major / Nier lineage.

⚠️ CRITICAL — HUMAN-PROPORTIONED, NOT A BULKY ROBOT. The biggest failure is a HULKING POWER-ARMOR / MECH-SUIT body with a small human head sticking out the top — that reads as a robot, NOT a cyborg man. KILL IT: his body has HUMAN MALE PROPORTIONS — lean to athletic, normal human shoulder-width and limb-thickness (NOT a bulky tank, NOT oversized power-armor, NOT a mech). And ORGANIC HUMAN SKIN is visibly interwoven across his body (a flesh forearm, an organic chest-section or shoulder, scarred skin showing between sleek plates) so he reads as a MAN fused with machine — not a suit of armor with a head.

⚠️ THE BAR — a sleek, human-proportioned cyborg MAN: athletic build, sleek integrated augmentation over a human frame, organic skin showing, masculine. He looks like a person who was rebuilt, NOT a manufactured robot.

🚫 BANS:
• NO bulky / hulking / oversized / heavy power-armor / mech-suit / siege / tank bodies (those = robot-with-a-head)
• NO oversized shoulder-mounts, NO massively thick torso-block, NO huge load-bearing limbs
• NO "the synthetic body IS his body" with zero organic — organic skin MUST be visibly interwoven
• NO female / femme framing (Flux defaults cyborg to female — fight with lean MASCULINE male build language)
• NO flowing hair / ponytails / long locks

✓ DISTRIBUTION (all LEAN-TO-ATHLETIC, human-proportioned, organic-interwoven):
  • ~5 RECON / INFILTRATION — lean lithe stealth build, sleek low-profile augments, organic skin showing at forearms/neck
  • ~5 OPERATIVE / SOLDIER — athletic tactical build, sleek combat augments over a human frame, organic chest/arm patches
  • ~4 MERCENARY / VETERAN — wiry battle-worn build, field-augmented, scarred organic skin between plates
  • ~3 EX-PILOT / SPACER — slim augmented build, neural-jack ports, organic skin with synth-graft sections
  • ~3 ENFORCER / DETECTIVE — athletic disciplined build, sleek concealed augments, organic face/hands
  • ~3 ASCETIC / OLD-MODEL — lean weathered build, antique sleek augments, organic skin gone leathery with age
  • ~2 DUELIST / ARENA — athletic combatant build, sleek augments, scarred organic skin

Each entry names the ROLE + the LEAN/ATHLETIC human-proportioned silhouette + sleek augmentation + where organic skin shows + purpose.`,
    touchpoints: [
      'RECON-INFILTRATOR — a lean, lithe cyborg man built for shadow-work, athletic human proportions, sleek low-profile matte-black augments tracing his arms and spine, organic scarred skin showing at the forearms and the side of the neck, every surface quiet, built to vanish',
      'TACTICAL OPERATIVE — an athletic cyborg man, normal human build, sleek black-and-steel combat augments integrated over a human frame, an organic chest-section and one organic arm showing between the plating, scarred and disciplined, built to hunt',
      'BATTLE-WORN MERCENARY — a wiry, weathered cyborg man, lean human proportions, field-fitted augments mismatched from years of repair, scarred organic skin showing across the torso and forearms between sleek plates, a survivor rebuilt piece by piece',
      'EX-PILOT SPACER — a slim augmented cyborg man, human proportions, neural-jack ports along the spine and nape, sleek grafted augments over organic skin, synth-graft patches blending into weathered flesh on the arms, built for the long dark',
      'ENFORCER DETECTIVE — an athletic cyborg man in a worn long coat over a sleek-augmented human frame, concealed integrated augments, organic face and hands and neck still flesh, lean and watchful, built to track and detain',
      'OLD-MODEL ASCETIC — a lean, weathered cyborg man, human proportions, antique sleek augments with worn engraving, organic skin gone leathery and lined with age showing at the face and forearms, quiet gravity, an obsolete model still carrying its ghost',
      'ARENA DUELIST — an athletic cyborg man built for the pits, lean-muscular human proportions, sleek augments scarred with trophy-damage, organic skin showing across a marked torso and arms, kinetic and dangerous',
      'FRONTIER RANGER — a rangy cyborg man, athletic human build, dust-worn sleek augments over a human frame, organic sun-weathered skin on the arms and neck between the plating, a long-rifle slung, built for the wastes',
    ],
    instructions: `Each entry is ONE cyborg-MAN body type, 30-50 words. Format: "ROLE CAPS — lean/athletic human-proportioned silhouette + sleek augmentation + where organic skin shows + purpose". HUMAN PROPORTIONS, sleek not bulky, organic skin interwoven, masculine. NEVER a bulky power-armor/mech body with a head on top. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  // ─── android-man: material / finish ───
  android_man_material: {
    format: 'simple',
    theme: `BODY MATERIAL + FINISH for a male android-being's synthetic chassis. Each entry 25-45 words. The material story of his engineered body — surface, treatment, wear. RUGGED, lived-in, real — NOT showroom-clean.

⚠️ THE BAR — material truth. Surfaces have texture, weight, wear, manufacture-marks. Hyper-real cinematic 3D / VFX-quality. The finish reinforces "this is a real machine that has been through things," never glossy-toy plastic.

🚫 BANS:
• NO pristine glossy-plastic / toy-shiny finishes
• NO "smooth chrome" as the only descriptor — name the texture, the wear, the manufacture
• NO fabric / cloth as the primary body material (this is the chassis, not clothing)

✓ VARIETY (mix material families AND wear-states):
  • carbon-fiber weave / woven-composite with visible warp
  • brushed titanium / anodized aluminum / cold gunmetal
  • matte-black tactical composite / radar-absorbent coating
  • black-chrome / oil-slick iridescent plating
  • ceramic-white medical-grade panels / bone-composite
  • oxidized bronze / verdigris-patina / aged brass
  • weathered field-steel / scratched ablative armor
  • exposed cabled synthetic-muscle / kevlar-mesh underweave
  • hex-pattern armor plating / segmented overlapping scales
  • Wear: battle-scarring, scorch-marks, weld-seams, grime in the seams, paint-chipping, dents, dust-matte`,
    touchpoints: [
      'WOVEN CARBON-FIBER — body-panels of woven carbon-fiber with a visible diagonal warp catching the light, matte black with a faint blue sheen at the edges, fine grime settled into the weave, manufactured and purposeful',
      'BRUSHED TITANIUM — cold brushed-titanium plating with a grey directional grain, scuffed bright along the high-wear edges, faint heat-discoloration blooming blue-gold near the joint-vents, industrial and weighty',
      'MATTE TACTICAL COMPOSITE — radar-absorbent matte-black composite plating that swallows light, edges scuffed to grey, a stenciled serial-code half-worn on one panel, scorch-streak across the flank',
      'BLACK-CHROME OIL-SLICK — black-chrome plating with an oil-slick iridescence shifting violet-to-cyan across the curves, fingerprint-smudges and a hairline crack webbing one panel, sleek and sinister',
      'CERAMIC-WHITE MEDICAL — bone-white ceramic-composite panels with fine hairline crazing, a yellowed age-stain creeping along the seams, one panel cracked to reveal the dark substructure beneath',
      'OXIDIZED BRONZE — aged bronze plating gone green with verdigris in the recesses, worn bright on the raised edges where hands and impacts have rubbed it, an antique machine carrying its years',
      'WEATHERED FIELD-STEEL — scratched grey field-steel armor with rust blooming around the rivets, hasty weld-seams crossing old battle-damage, grime packed into every recess, a body kept running by force of will',
      'EXPOSED SYNTH-MUSCLE — cabled synthetic-muscle bundles visible between armor segments, dark glistening polymer fibers bundled like sinew over a titanium skeleton, kevlar-mesh underweave showing at the flex-points',
    ],
    instructions: `Each entry is ONE material/finish story, 25-45 words. Format: "MATERIAL CAPS — surface + treatment + wear-state". Mix material families and wear. RUGGED + real, never toy-glossy. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  // ─── android-man: head/face — HEAVY INTEGRATION carbon-copied from Kevin's 2 SAVED refs (2026-05-26 R13) ───
  android_man_head: {
    format: 'simple',
    theme: `HEAD / FACE for a cyborg MAN — built to MATCH Kevin's two saved reference renders, which are HEAVILY integrated cyborg heads (NOT a clean human face with a bolt-on ear-piece). Each entry 35-55 words. Carbon-copy the reference register: a HALF-CONVERSION face (one vertical side of the face — brow→cheek→jaw — replaced by beveled metal plating with a recessed cyber-optic, flowing down a chrome cervical column onto the chest/pauldron) OR a scarred human face loaded with a mechanical iris + a servo-driven jaw-hinge + implant-studs flickering at the temple + a synth-larynx resonance band at the throat + a chrome cervical column from jawline into the chest-block + dense exposed cable-bundles. The OTHER half / rest stays a scarred weathered HUMAN face. The cranium KEEPS its hair (short crop / shaved sides).

⚠️ THE BAR — match the saved refs: LOTS of visible cyborg hardware on the head — half-conversion plating, mechanical iris/optic, servo-jaw, implant-studs, synth-larynx band, chrome cervical column, dense cabling. The head must read as a true cyborg head fused into the body, NEVER a pretty clean human face with one little cyber-ear.

🚫 BANS (ENFORCE HARD):
• NO clean / plain / barely-augmented human face with just a small cyber-ear or a couple bits — THAT is the pretty-boy-pasted-on failure. The head is HEAVILY integrated.
• NO SKULL-CAP / cranium-helmet / metal plating over the TOP of the head — the cranium keeps hair. (Heavy plating goes on one VERTICAL half of the face + jaw + temple + neck, NOT a horizontal cap.)
• NO faceless full helmet
• NO age or heritage (the IDENTITY axis sets those)

✓ DISTRIBUTION (all HEAVY integration):
  • ~10 HALF-CONVERSION — one vertical side of the face (brow→cheek→jaw) beveled metal plating + a recessed cyber-optic, flowing down a chrome cervical column onto the chest/pauldron; other side scarred weathered human
  • ~8 SERVO-JAW + IMPLANTS — scarred human face + mechanical iris + servo-driven jaw-hinge + implant-studs flickering at the temple + synth-larynx band at the throat + chrome cervical column into the chest
  • ~4 WIRED-DENSE — scarred human face wrapped in dense exposed cable-bundles from temple/jaw/nape + glowing circuit-traces + a cyber-optic + chrome cervical column
  • ~3 OPTIC-RIG — both eyes mechanical iris-optics burning + heavy temple-array + implant-studs + cabling + scarred human lower-face

Every entry: HEAVY cyborg integration (half-conversion plating OR servo-jaw+implants+synth-larynx) + chrome cervical column from jaw into chest + dense cabling + a scarred human element. Cranium keeps hair. NO skull-cap.`,
    touchpoints: [
      'HALF-CONVERSION SEAFOAM — scarred weathered organic right side of the face, the left brow-cheek-jaw replaced by beveled black-silver plating continuous down a chrome cervical column onto the pauldron, a recessed seafoam optic burning, short cropped hair on the intact cranium',
      'SERVO-JAW VETERAN — a scarred flat-nosed human face, one mechanical iris burning dull red, the jaw hinged on a visible servo, implant-studs flickering plasma-cyan at his shaved temple, a synth-larynx resonance band at the throat, a chrome cervical column continuous from jawline into the chest-block',
      'HALF-CONVERSION AMBER — scarred organic left side, the right brow-temple-jaw beveled gunmetal plating with a recessed amber optic, fine wiring fanning from the plate into a chrome cervical column flowing onto the shoulder, the human eye hard and weathered',
      'IMPLANT-TEMPLE HARD-CASE — a weathered human face, a glowing iris-ring cyber-optic in one eye, a cluster of implant-studs and short antennae flickering at the shaved temple, dense cable-bundles from behind the ear down a chrome cervical column into the chest',
      'WIRED-DENSE OPERATOR — a scarred human face wrapped in thick exposed cable-bundles running from temple and jaw down into a chrome cervical column, glowing circuit-traces creeping across the cheek, one mechanical iris, the cranium short-cropped and human',
      'SYNTH-LARYNX ENFORCER — a hard scarred human face, a servo-driven jaw-hinge clicking at the mandible, a chrome synth-larynx resonance band ringing the throat, a recessed crimson optic, a chrome cervical column threaded with amber-lit conduits into the pauldron',
      'HALF-CONVERSION CYAN — scarred organic right side, the left half of the face a sleek beveled ceramic-and-chrome conversion plate with a recessed cyan optic and a servo jaw-hinge, flowing unbroken down the chrome cervical column into the chest aperture',
      'OPTIC-RIG HUNTER — both eyes mechanical iris-optics burning cold blue, a heavy temple-array of ports and implant-studs at one side, exposed cable-bundles at the nape feeding a chrome cervical column, the lower face scarred weathered human skin and stubble',
    ],
    instructions: `Each entry is ONE HEAVILY-INTEGRATED cyborg-man head, 35-55 words. Carbon-copy the saved-reference register. Format: "HEAD-TYPE CAPS — the heavy integration (half-conversion beveled plating OR mechanical-iris + servo-jaw + implant-studs + synth-larynx) + chrome cervical column from jaw into chest + dense cabling + the scarred human element". LOTS of cyborg hardware on the head — NEVER a clean human face with one cyber-ear. NO skull-cap over the cranium (keeps hair). Do NOT specify age or heritage (the IDENTITY axis sets those). Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  // ─── android-man: IDENTITY (ethnicity + age + hair — diversity axis, 2026-05-26 R9) ───
  android_man_identity: {
    format: 'simple',
    theme: `IDENTITY of a cyborg MAN — his European heritage, age, and hair. Each entry 15-30 words. This axis exists to make every cyborg man a DIFFERENT PERSON so we never render the same grizzled middle-aged guy twice — but ALL of them are EUROPEAN-HERITAGE / WHITE men. Variety comes from European SUB-REGION + age + hair, NOT from broad ethnic diversity.

⚠️ THE BAR — a specific, distinct EUROPEAN man built from a heritage-NOUN + an age + a hairstyle. Use a European heritage NOUN ("a Nordic man", "a Sicilian man", "an Irish man") — heritage nouns render more reliably and give face/coloring variety while staying European. Spread ages from 20s to 50s (NOT all middle-aged). All clearly masculine white/European men.

🚫 BANS:
• EUROPEAN HERITAGE ONLY — no non-European ethnicities (these are white European men)
• NO defaulting to "middle-aged grizzled" — include PLENTY of younger men (20s-30s)
• NO repeating a heritage/age/hair combo — maximize the spread within European looks
• NO anti-women words of any kind

✓ DISTRIBUTION (spread WIDE across the 25 — all European):
  HERITAGE (vary every entry): Nordic / Scandinavian (Swedish, Norwegian, Icelandic), Slavic / Eastern European (Russian, Polish, Ukrainian, Czech), Germanic (German, Austrian, Dutch), Mediterranean (Italian, Sicilian, Greek, Spanish, Portuguese), Celtic (Irish, Scottish, Welsh), Anglo / British, French, Balkan (Serbian, Croatian), Baltic (Lithuanian, Estonian).
  AGE: ~40% in their 20s-early-30s (young), ~35% late-30s to 40s, ~25% in their 50s.
  COLORING (within European range): pale-blond, ginger / auburn, light-brown, dark-brown, jet-black, grey, salt-and-pepper; fair / ruddy / olive-Mediterranean skin.
  HAIR: shaved bald, buzzcut, short crop, undercut, slicked-back, tousled, top-knot fade, crew-cut — plus varied facial hair (clean-shaven, light stubble, full beard, goatee, mustache). VARY it widely.`,
    touchpoints: [
      'NORDIC — a young Swedish man, late 20s, pale-blond, sharp clean-shaven features, short tousled hair',
      'SLAVIC — a wiry Russian man, early 30s, pale eyes, light-brown buzzcut, heavy stubble',
      'SICILIAN — a striking Sicilian man, early 30s, olive skin, dark slicked-back hair, short dark beard',
      'IRISH — a ruddy Irish man, late 30s, auburn hair, freckled, close-cropped, light ginger stubble',
      'GERMANIC — a square-jawed German man, 40s, dark-blond undercut, clean-shaven, hard features',
      'GREEK — a broad Greek man, 30s, olive skin, black curls, full dark beard',
      'SCOTTISH — a grizzled Scottish man, 50s, grey crew-cut, weathered ruddy skin, salt-and-pepper beard',
      'POLISH — a lean Polish man, mid-20s, light-brown swept-back hair, sharp jaw, clean-shaven',
    ],
    instructions: `Each entry is ONE cyborg-man identity, 15-30 words. Format: "HERITAGE CAPS — a [age] [European-heritage] man, [coloring + face character], [hair + facial hair]". European heritage ONLY (white European men). Spread heritage / age / hair / coloring WIDE; include many young men. All masculine. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  // ─── android-man: glowing EYE color + optic style (2026-05-26 R7) ───
  android_man_eye: {
    format: 'simple',
    theme: `GLOWING EYE color + optic style for a cyborg MAN. Each entry 15-35 words. Sets the sci-fi glow of his eyes — the most striking high-tech tell on his face. Cyberpunk 2077 / Edgerunners / Deus Ex / Ghost in the Shell optics.

⚠️ THE BAR — a vivid SCI-FI glowing eye: a specific saturated glow color + an optic character (iris-ring / concentric lens / pinpoint / full-glow socket / slit). High-tech and luminous. It can be one cyber-eye + one organic, or both glowing — the entry sets the COLOR and STYLE; the scene decides how machine-heavy.

🚫 BANS:
• NO dull / no-glow eyes (this axis is the GLOW)
• NO soft romantic / dreamy glow — these are machine optics, cold and precise
• NO rainbow / multi-color in one eye — ONE saturated color per entry

✓ COLOR VARIETY (one saturated color each, spread across the 25):
  cyan / ice-blue, electric amber / gold, crimson / blood-red, violet / magenta, electric green / acid-green, white / silver, sodium-orange, teal / aqua, deep-blue, hot-pink. Mix the optic STYLE too: single iris-ring / concentric multi-lens / pinpoint pupil-glow / full-glowing socket / slit-pupil / scanning bar.`,
    touchpoints: [
      'CYAN IRIS-RINGS — eyes glowing a cold ice-cyan, concentric machine iris-rings contracting around a dark pupil, a precise sci-fi optic glow',
      'MOLTEN AMBER — eyes burning a hot electric-amber, a full warm glow filling the socket, the high-tech ember of an active optic',
      'CRIMSON OPTIC — a single crimson-red glowing cyber-eye (the other organic and tired), a thin targeting-glow at the pupil, dangerous',
      'VIOLET LENS-ARRAY — eyes glowing electric-violet through a concentric multi-lens optic, faint magenta bloom around the rim, precise and cold',
      'ACID-GREEN SCAN — eyes glowing acid-green, a thin scanning-bar of light sweeping across the optic, machine-cold and alert',
      'SILVER-WHITE GLOW — eyes glowing a pale silver-white, pinpoint pupils blazing bright, an almost blank luminous machine stare',
      'SODIUM-ORANGE — eyes glowing a warm sodium-orange, a single iris-ring optic, the other eye a faintly-glowing organic, weathered and human-still',
      'TEAL APERTURE — eyes glowing teal-aqua, mechanical aperture-petals visible contracting around the glow, a clean high-tech optic',
    ],
    instructions: `Each entry is ONE glowing-eye spec, 15-35 words. Format: "COLOR-OPTIC CAPS — saturated glow color + optic style + cold/precise character". ONE saturated color per entry, vivid sci-fi glow. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  // ─── android-man: dominant augmentation feature ───
  android_man_augment: {
    format: 'simple',
    theme: `DOMINANT AUGMENTATION feature for a cyborg MAN — the standout cyber detail on his human-proportioned body. Each entry 30-50 words. These are BODY/limb augments that SIT ON A HUMAN FRAME — sleek and integrated, never bulky power-armor.

⚠️ THE BAR — one bold, sleek cyber subsystem integrated into a human-shaped body, with organic skin visible around it. Hyper-detailed, functional, SLEEK. It augments a man — it does NOT turn him into a bulky robot.

🚫 BANS (these add the bulky-robot look — avoid):
• NO oversized shoulder-mounts, NO mounts that "double his width", NO bulky pauldrons, NO heat-sink stacks fanning off the back, NO huge piston legs / load-bearing limbs
• NO feature that makes him a hulking tank / power-armor / mech (he stays human-proportioned)
• NO face-only / temple-only features (this axis is the BODY)
• NO body-horror gore — sleek precision engineering

✓ VARIETY (each entry one sleek body-augment on a human frame):
  • a full cybernetic arm (sleek, human-scaled) with organic skin at the shoulder-join
  • a slim segmented spinal line / nape-port running down the back under the skin
  • a chest power-core glowing through a neat torso aperture, organic skin around it
  • sleek synth-muscle visible at a forearm / calf where a skin-panel is open
  • a cybernetic forearm/hand with fine articulated digits
  • subdermal circuit-tracing glowing under the organic skin of the torso/arms
  • a sleek cybernetic leg (human-scaled) with organic skin at the thigh
  • neural-jack ports + slim cable-runs at the nape/spine
  • a sleek integrated back-line / dermal plating following the human spine`,
    touchpoints: [
      'FULL CYBERNETIC ARM — one arm a sleek human-scaled cybernetic prosthetic of matte-black and steel, fine segmented plating and articulated digits, organic scarred skin at the shoulder-join where flesh meets the augment, glowing conduit-line along the forearm',
      'SUBDERMAL CHEST CORE — a compact power-core glowing his energy-color through a neat circular aperture in his chest, organic skin around the rim, slim cooling-vents, the quiet engine under a human-shaped torso',
      'SPINAL NAPE-PORT LINE — a slim segmented cyber-line running down his spine under the skin, neural-jack ports at the nape, glowing inter-segment conduits, organic skin of his back showing on either side, sleek not bulky',
      'OPEN FOREARM SYNTH-MUSCLE — a skin-panel open along one forearm revealing sleek cabled synth-muscle and a glowing conduit over a slim alloy bone, the surrounding organic skin scarred and weathered, precise engineered anatomy at human scale',
      'CYBERNETIC HAND + FOREARM — a sleek cybernetic forearm and hand with fine articulated finger-joints and a thin glowing seam, organic skin at the elbow where the augment integrates, lethal and precise',
      'SUBDERMAL CIRCUIT-TRACING — fine glowing circuit-traces threading beneath the organic skin of his torso and arms in his energy-color, pulsing faintly, the machine visible UNDER the human skin rather than replacing it',
      'CYBERNETIC LEG — one sleek human-scaled cybernetic leg of matte composite with a slim articulated knee and glowing shin-conduit, organic skin at the thigh-join, athletic not bulky, built for speed',
      'NEURAL-JACK NAPE — a cluster of neural-jack ports and slim cable-runs at the nape feeding under the skin into the spine, organic skin around them, a discreet sleek interface on a human neck',
    ],
    instructions: `Each entry is ONE sleek body-augmentation on a HUMAN-PROPORTIONED frame, 30-50 words. Format: "AUGMENT CAPS — the sleek system + where on the body + organic skin around it + glow detail". SLEEK + human-scaled, organic skin visible nearby, NEVER bulky/power-armor. BODY features only (never face). Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  // ─── android-man: action (FULL-BODY engaged sci-fi action) ───
  android_man_action: {
    format: 'simple',
    theme: `DYNAMIC FULL-BODY ACTION for a cyborg MAN. Each entry 35-60 words. He is caught mid-explosive-beat, his WHOLE BODY in KINETIC MOTION — full-figure, never static, never a bust. These must be ENERGETIC, cinematic, sci-fi action stills (Edgerunners / Cyberpunk 2077 / Ghost in the Shell / John Wick-meets-cyberpunk). The old pool was too STATIC (guys just standing) — fix that: every entry has real motion, energy, and stakes.

⚠️ KEEP HIS FACE TOWARD CAMERA. Dynamic, but his head stays UP and his face TURNED TOWARD (or three-quarter toward) the camera — the motion comes toward/across the viewer, never fleeing away (away-motion hides the face). Think "exploding toward the camera," not "running away."

⚠️ THE BAR — kinetic energy + a clear action beat + stakes (an enemy, a threat, an effect) + his face readable. Stack motion cues: motion-blur, debris, sparks, muzzle-flash, energy-arc, kicked-up dust, trailing coat/cables.

🚫 BANS:
• NO static standing / posing / "surveying" / "holding still" — these are ACTION beats with motion
• NO running / leaping AWAY from camera, NO back-to-camera, NO face hidden
• NO bust / portrait — full body head-to-foot or head-to-thigh
• NO mid-air freeze with zero ground contact (keep a foot / hand / surface anchoring him)

✓ DYNAMIC BEAT DISTRIBUTION (all kinetic, all face-toward-camera):
  • ~25% gunplay — sliding into cover firing toward camera, spinning to fire, dual-wielding mid-stride toward us, muzzle-flash + casings + recoil
  • ~25% close-combat — mid melee-strike toward an off-frame threat near the viewer, blade/fist swing with energy-trail, parry-and-counter, kinetic torque
  • ~20% explosive traversal toward camera — sprinting toward us through chaos, vaulting a barrier toward camera (hand planted), wall-kick landing facing us, skidding to a hard stop
  • ~15% power-up / ability — his cybernetic arm/eyes flaring with energy, an EMP/overcharge surging, a holo-HUD snapping up, charging a strike, electricity arcing across his body
  • ~15% hard landing / arrival — slamming down from a height in a three-point landing facing camera (shockwave + debris), bursting through a door toward us, rising fast from a crouch into motion`,
    touchpoints: [
      'SLIDING INTO COVER FIRING — sliding low across a wet floor toward camera behind a sidearm blazing past the lens, muzzle-flash lighting his face, spent casings and water-spray trailing, his cybernetic arm braced, full body kinetic and committed, neon scene streaking behind',
      'SPIN-TO-FIRE — caught mid-spin pivoting toward the viewer to fire, coat and cables whipping out with the motion, muzzle-flash strobing across his face and chassis, one boot planted hard, debris flung outward, full-figure and explosive',
      'MELEE STRIKE TOWARD CAMERA — driving a powered fist or blade toward an off-frame threat near the viewer, body torqued and committed, an energy-trail arcing off the strike, face snarling forward and readable, sparks bursting at the impact, kinetic and lethal',
      'VAULT TOWARD CAMERA — clearing a smashed barrier toward the viewer, one cybernetic hand planted on its edge, legs swinging through, face up and forward, debris kicking off the ledge, motion-blur on the background, full body airborne but hand-anchored',
      'SPRINT THROUGH CHAOS — sprinting toward camera down a collapsing corridor, fire and sparks raining, his body driven forward at a hard lean, face set and forward, coat-tails and cable-bundles streaming, the corridor blurring with speed behind him',
      'ARM-FLARE POWER-UP — skidding to a planted stance facing camera as his cybernetic arm and eyes flare bright with surging energy, electricity arcing across his chassis, a holo-HUD snapping up around his hand, face lit hard from below, charged and dangerous',
      'THREE-POINT SLAM-LANDING — slamming down from a height in a three-point landing facing camera, one fist and knee driven into cracked pavement, a shockwave-ring and debris bursting outward, head rising and face turning up to the viewer, coiled to spring',
      'DUAL-WIELD ADVANCE — striding fast toward camera dual-wielding, both weapons firing past the lens, twin muzzle-flashes lighting his face and the rain, casings raining, full body head-to-foot in kinetic forward motion',
      'BURST THROUGH A DOOR — bursting through a blast-door toward the viewer mid-stride, the door flung wide and light flooding past him, weapon raised, face forward and lit, smoke and debris churning around his planted lead foot',
      'PARRY-AND-COUNTER — caught mid parry-and-counter, his cybernetic forearm deflecting an off-frame strike as he drives a counter toward the viewer, energy sparking at the block, body coiled and torqued, face forward and intense, full-figure',
      'OVERCHARGE BURST — planted wide facing camera as an overcharge surges through him, his power-core and eyes blazing, an EMP-ring of light expanding outward, hair and cables lifting in the energy-wash, debris suspended, face lit and forward',
      'SLIDE-HALT FACING US — skidding to a hard halt facing the viewer at the end of a run, one hand down on the ground, dust and sparks spraying forward, weapon coming up, face snapping toward camera, full body low and kinetic',
    ],
    instructions: `Each entry is ONE DYNAMIC full-body sci-fi action, 35-60 words. ALWAYS kinetic (real motion + energy + stakes) AND his FACE turned toward camera and readable (head up), the WHOLE BODY engaged head-to-foot with a ground/surface anchor. NO static standing/surveying, NO away-from-camera motion, NO bust. Stack motion cues (blur, debris, sparks, muzzle-flash, energy-arc). Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  // ─── android-man: setting (sci-fi environment) ───
  android_man_setting: {
    format: 'simple',
    theme: `SCI-FI ENVIRONMENTS / SETTINGS for a male android-being to inhabit at FULL-FIGURE scale. Each entry 30-55 words. The stage — multi-tier depth (foreground / midground / deep distance / sky-or-ceiling), each layer carrying information. Blade Runner / Ghost in the Shell / Alita: Iron City / Edgerunners / Nier / Cyberpunk lineage.

⚠️ THE BAR — a rich, lush, layered sci-fi environment that gives him somewhere to BE, with scale-provers and atmospheric depth. Never a flat void / empty backdrop. The setting should let a full-body figure read against it.

🚫 BANS:
• NO blank studio void / plain gradient backdrop
• NO present-day Earth / modern-military / contemporary-city realism — this is FUTURE sci-fi
• NO requirement for the setting to dominate the figure — it FRAMES him

✓ VARIETY (mix biomes — each entry one distinct place):
  • derelict orbital station interior / failing space-hab
  • neon megacity alley / rain-soaked lower-level street
  • industrial foundry / reactor-core chamber / power-plant floor
  • desert wasteland strewn with ruined tech / crashed hulks
  • frozen research outpost / ice-bound facility
  • jungle-reclaimed ruins / overgrown machine-temple
  • corporate tower interior / sterile lab / data-cathedral
  • spaceport hangar / dropship bay / launch gantry
  • underground tunnel network / maintenance undercity
  • war-torn battlefield / shelled urban ruin
  • cargo bay / container-yard / dock at night
  • cliffside antenna-array / windswept comms-station`,
    touchpoints: [
      'DERELICT ORBITAL-HAB INTERIOR — a long failing space-station corridor, emergency strips guttering, a cracked viewport showing the curve of a planet, frost on the dead consoles, cables drooping from a torn ceiling, deep zero-pressure dark beyond a sealed bulkhead',
      'NEON LOWER-LEVEL ALLEY — a rain-soaked megacity alley walled in stacked neon signage and dripping ducting, steam pouring from street-vents, holographic ads rippling in puddles, the canyon of towers vanishing up into smog overhead',
      'REACTOR-CORE CHAMBER — a cavernous industrial reactor hall, a colossal glowing core suspended in a lattice of catwalks and coolant-pipes, heat-shimmer and steam, gantries receding into orange-lit haze, immense machinery dwarfing the foreground floor',
      'TECH-STREWN WASTELAND — a sun-scorched desert of crashed hulks and half-buried machinery, a dead war-walker rusting on the dune-crest, dust devils crossing the flats, a bruised storm-sky pressing low over the wreck-field',
      'FROZEN RESEARCH OUTPOST — a wind-scoured ice facility half-buried in drift, fractured antenna-masts, a frozen-over airlock, blue twilight and blowing snow, the dark shapes of further structures lost in the whiteout beyond',
      'JUNGLE-RECLAIMED RUINS — an overgrown machine-temple swallowed by jungle, roots prying apart ancient alloy walls, shafts of green light through the canopy, glowing fungus on dead consoles, mist pooling between the toppled pillars',
      'SPACEPORT HANGAR — a vast dropship hangar, a heavy lander squatting under work-lights, fuel-lines and gantry-arms reaching across the deck, sparks raining from an overhead welding rig, the open blast-door framing a dusk runway beyond',
      'MAINTENANCE UNDERCITY — a claustrophobic tunnel of pipework and conduit beneath the city, leaking steam and dripping condensate, a single caged work-light, graffiti-tagged bulkheads, the tunnel forking into deeper dark',
      'SHELLED URBAN RUIN — a war-torn future city block, a collapsed skyway, fires guttering in gutted towers, smoke columns against a sodium-orange sky, debris and rebar in the foreground, distant artillery-flashes on the horizon',
      'CONTAINER-YARD AT NIGHT — a sprawling dock stacked with cargo-containers under sodium floods, gantry-cranes silhouetted against a starless sky, puddles doubling the lights, a freighter hull looming at the quay-edge',
      'DATA-CATHEDRAL — a vast sterile server-cathedral, towering racks of glowing data-cores in receding aisles, a cold blue glow, cable-trunks arching overhead like buttresses, a hush of humming machinery',
      'CLIFFSIDE COMMS-STATION — a windswept clifftop antenna-array over a churning sea, dishes and masts straining in the gale, warning-beacons pulsing, storm-clouds stacking on the horizon, spray rising off the rocks below',
    ],
    instructions: `Each entry is ONE sci-fi setting, 30-55 words. Format: "SETTING CAPS — foreground + midground + deep distance + atmosphere/sky". Multi-tier depth, scale-provers, never a flat void. FUTURE sci-fi, never present-day. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  // ─── android-man: composition (FULL-FIGURE framing — anti-bust) ───
  android_man_composition: {
    format: 'simple',
    theme: `CINEMATIC FRAMINGS for a CYBORG MAN. Each entry 25-50 words. ⚠️ TWO failures to balance: (1) the old path rendered endless BUST PORTRAITS of a head — avoid that; (2) when framed too wide, his face shrinks and Flux renders a FACELESS ROBOT instead of a cyborg man — avoid that too. The sweet spot is the MEDIUM HERO SHOT: close enough that his RUGGED HUMAN/CYBORG FACE is clearly readable, wide enough that we see his integrated cyborg BODY and the sci-fi scene around him.

⚠️ THE BAR — every framing keeps his HUMAN CYBORG FACE clearly readable AND shows enough of his integrated body + environment that he reads as a cyborg MAN in a sci-fi world. Never a tiny figure lost in a vista (→ robot); never a tight face-only bust (→ portrait).

🚫 ABSOLUTE BANS:
• NO face-only / head-only / chest-up bust / tight portrait framings
• NO tiny-figure-in-a-vista framings where the face can't be read (those render as faceless robots)
• NO high-angle-looking-down-at-a-small-figure, NO "him at 30% of frame height"
• NO head-on modeling / facing-camera glamour, NO sexy / pinup

⚠️ MIX FULL-BODY AND MEDIUM-HERO roughly 50/50 (this mix is what landed well — uniform medium-hero is too repetitive). Medium-hero = his heavy cyborg-head integration reads sharpest; full-body = scene + scale + dynamism. BUT ⚠️ THE #1 JOB is to VARY THE CAMERA ANGLE every entry. The repetitive failures are (a) a tight frontal chest-up portrait and (b) a man walking dead-on toward camera. KILL both: each entry is a DISTINCT camera angle (low / high-3-4 / side-profile / three-quarter / over-shoulder / dutch-tilt / off-center / rear-turn). Almost NONE flat-frontal.

⚠️ Face uncovered + readable (NO helmet/visor), cyborg-head integration legible.

✓ DISTRIBUTION (~50% FULL-BODY at varied angles / ~45% MEDIUM-HERO at varied angles / ~5% dynamic):
  FULL-BODY (head-to-foot, varied angle — NOT a frontal walk): low-angle hero / side-profile stride / 3-4 perched / over-an-element / threshold / high-3-4 looking down.
  MEDIUM-HERO (thigh-up to waist-up, varied angle, head-integration sharp): low-angle / side-profile / 3-4 from the flank / over-the-shoulder / dutch-tilt / rear-turn.
  🚫 AVOID: flat frontal chest-up portrait, and the dead-on walk-toward-camera — the repetitive failures.`,
    touchpoints: [
      'FULL-BODY LOW-ANGLE — head-to-foot from a low hero angle (NOT a frontal walk), the cyborg figure towering against a backlit sci-fi backdrop, face readable, the integrated body, stance, and one dominant augment legible',
      'FULL-BODY SIDE-PROFILE STRIDE — head-to-foot pure 90-degree side profile mid-stride across frame, the cyborg silhouette and head-integration reading sharp in profile, motion-blur environment behind',
      'FULL-BODY 3/4 PERCHED — head-to-foot at a 3/4 angle, crouched or perched on rubble / a ledge, face angled toward the lens and readable, integrated body coiled against the sky, scene depth below',
      'FULL-BODY OVER-AN-ELEMENT — head-to-foot beyond a foreground element (railing / console / wreck) at a 3/4 angle, his full integrated cyborg body and readable face legible past it, layered sci-fi depth',
      'FULL-BODY THRESHOLD — head-to-foot framed in a doorway / hatch / breach at a slight angle, backlight from the space beyond, the full cyborg silhouette and uncovered face both legible',
      'LOW-ANGLE MEDIUM-HERO — camera low looking up at him thigh-up, the cyborg figure imposing, his half-conversion head and chest-augments sharp, uncovered face readable at the top of frame',
      'SIDE-PROFILE MEDIUM — pure 90-degree side profile, waist-up, his cyborg head razor-sharp in profile (half-conversion plate, cyber-optic, chrome cervical column reading clearly), shoulder-augment and wired neck legible',
      'THREE-QUARTER FLANK MEDIUM — 3/4 camera from his side, thigh-up, face turned back toward the lens, the integrated chassis and one dominant augment catching rim-light, sci-fi depth behind',
      'OVER-THE-SHOULDER MEDIUM — camera behind and beside his shoulder, he angles into the scene, face in a 3/4 turn toward the lens, his wired nape and cervical column dominant in foreground',
      'DUTCH-TILT MEDIUM — a canted dutch-angle waist-up frame, his cyborg head and torso-augments sharp, energy / sparks in the air, an off-kilter kinetic sci-fi composition, face readable',
    ],
    instructions: `Each entry is ONE cinematic framing, 25-50 words. ⚠️ LEAD with the CAMERA ANGLE (low / side-profile / 3-4 / high / over-shoulder / dutch-tilt / over-element / threshold) — VARY it every entry. ~50% FULL-BODY head-to-foot (varied angles, NOT a frontal walk) / ~45% MEDIUM-HERO (thigh/waist-up, head-integration sharp) / ~5% dynamic. Face uncovered + readable. AVOID flat frontal portraits and walk-toward-camera. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  // ─── android-man: surprise element (secondary sci-fi actor / world-builder) ───
  android_man_surprise: {
    format: 'simple',
    theme: `SECONDARY SCI-FI ELEMENTS that imply a wider world around the android-man. Each entry 25-45 words. A tiny secondary subject / object that adds narrative depth and proves the scene is part of a bigger world — a scale-prover and world-builder, NEVER a co-subject competing with him.

⚠️ THE BAR — adds story and depth WITHOUT stealing focus. He remains THE figure; this is in the midground / deep distance / periphery. Blade Runner / Ghost in the Shell / Edgerunners world-density.

🚫 BANS:
• NO second human-scale figure that becomes a co-subject (a DISTANT silhouette / unit is fine; a close companion is not)
• NO element so large it dominates the frame over him
• NO romance / partner framing

✓ VARIETY (each entry one peripheral element):
  • a hovering recon-drone with a single glowing optic
  • a parked / passing dropship or transport
  • a distant mech / walker on the horizon
  • a fellow android unit far off (silhouette, no interaction)
  • a flickering holographic billboard / sign / propaganda screen
  • a wrecked vehicle / downed aircraft / dead machine
  • a small mechanical creature / synth-animal at the periphery
  • a passing transit-train / cargo-hauler / sky-lane traffic
  • surveillance cameras / sensor-turrets tracking
  • a swarm of micro-drones / data-motes
  • a holographic waypoint / objective-marker hovering
  • a caged work-light / flare / beacon punctuating the dark`,
    touchpoints: [
      'RECON-DRONE WATCHING — a small recon-drone hovering in the deep background, a single glowing optic-eye fixed on him, rotors humming, surveillance-tension without interaction',
      'PASSING DROPSHIP — a heavy dropship banking across the deep sky behind him, running-lights blinking, engine-wash kicking up dust at the distant ground, a sense of an operation in motion',
      'DISTANT WALKER — a colossal mech-walker silhouetted on the far horizon, dwarfed by distance yet clearly enormous, legs mid-stride, a reminder of the scale of the war beyond him',
      'FELLOW UNIT FAR OFF — another android unit far down the corridor / across the plaza, a distant silhouette moving on its own purpose, no interaction, implying he is one of many',
      'FLICKERING BILLBOARD — a vast holographic billboard flickering on a tower-face in the midground, a corporate face or propaganda glyph rippling and glitching, washing colored light across the scene',
      'WRECKED VEHICLE — a downed gunship / burnt-out hovercar / dead loader-mech in the midground, smoke still curling from it, a frozen aftermath he moves past',
      'SYNTH-CREATURE — a small mechanical creature (a wiry synth-dog / drone-bird / scavenger-bot) skittering at the periphery, catching the light, a flicker of life in the machine-world',
      'SKY-LANE TRAFFIC — streams of distant aircars / cargo-haulers tracing light-trails through the deep sky-lanes high above, the pulse of a living future city behind him',
      'SENSOR-TURRETS TRACKING — wall-mounted sensor-turrets in the midground swiveling to track him, targeting-lasers ghosting through the haze, a hostile-environment tension',
      'MICRO-DRONE SWARM — a loose swarm of micro-drones / data-motes drifting through the air around the deep scene, each a pinprick of light, a cloud of machine-presence',
      'OBJECTIVE-WAYPOINT — a holographic waypoint / objective-marker hovering in the midground air, rotating glyph and distance-readout, suggesting his mission, a HUD-element made physical',
      'BEACON IN THE DARK — a caged work-light / signal-flare / pulsing beacon punctuating the deep darkness behind him, a lonely point of orientation in a vast dim space',
    ],
    instructions: `Each entry is ONE peripheral world-building element, 25-45 words. Format: "ELEMENT CAPS — what it is + where (midground/deep/periphery) + how it adds story without stealing focus". He stays THE figure. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  // ─── android-man: drama (40%-gated atmospheric sci-fi flourish) ───
  android_man_drama: {
    format: 'simple',
    theme: `40%-GATED ATMOSPHERIC FLOURISHES for the android-man path. Each entry 25-45 words. A subtle sci-fi environmental or tech flourish that amplifies the moment WITHOUT cluttering him as the focal subject.

⚠️ MANDATORY — every flourish supports HIM as the focal figure and reinforces the cold-machine + cinematic mood. Never competes for attention.

🚫 BANS:
• NO additional human-scale figures
• NO body-horror gore
• NO romance / soft / pretty register

✓ FLOURISH CATEGORIES (vary across):
  • coolant-vapor venting from a joint / cooling-fin shimmer
  • power-core pulse-glow through a torso aperture
  • holographic HUD / data-stream floating near him
  • sparks showering from a severed cable / grinding metal
  • EMP-flash / arc-discharge crackling across his chassis
  • rain beading and running off his plating / wet-chrome reflection
  • neon color-bleed washing across his frame from off-frame
  • dust-motes / embers / ash in a dramatic light-shaft
  • drifting particulate (snow / spores / data-fragments)
  • heat-shimmer / smoke / steam-column in the scene
  • glitch-artifacts flickering at his edges
  • his reflection doubled in wet floor / cracked glass / chrome
  • spent shell-casings / debris frozen mid-tumble
  • a light-ripple / chromatic halo from his energy-field`,
    touchpoints: [
      'COOLANT-VENT PLUME — a sharp plume of white coolant-vapor venting from a shoulder / spine / knee joint, briefly silhouetting against his chassis, the heat-shimmer distorting the air around the vent',
      'CORE PULSE-GLOW — his chest power-core pulsing slow through its torso-aperture in his energy-color, the glow spilling out across the surrounding plating and faintly lighting the air in front of him',
      'FLOATING HUD — a translucent holographic HUD / data-stream hanging in the air near him, rotating glyphs and target-readouts in his energy-color, atmospheric haze catching the projection',
      'SPARK-SHOWER — a shower of sparks cascading from a severed cable / grinding metal near him, the sparks bouncing off his plating and dying on the floor, hot orange against the cold scene',
      'ARC-DISCHARGE — a crackle of electrical arc-discharge skittering across a section of his chassis, branching blue-white filaments lighting his frame for an instant, ozone-charged',
      'RAIN ON CHROME — rain beading and running in rivulets off his plating, each drop catching the neon, his wet chassis doubling every light-source in slick reflection',
      'NEON COLOR-BLEED — colored neon-light bleeding across his frame from an off-frame source (magenta / cyan / sodium-amber), splitting his chassis into warring color-washes',
      'EMBERS IN LIGHT-SHAFT — embers / ash / dust-motes drifting through a single dramatic light-shaft cutting across the scene, the shaft grazing his silhouette and throwing his shadow long',
      'GLITCH-EDGE FLICKER — micro-glitch artifacts flickering briefly at his silhouette edges (pixel-displacement / chromatic-aberration), suggesting his machine-perception bleeding into the image',
      'WET-FLOOR REFLECTION — his full figure doubled in a sheet of standing water / wet floor beneath him, the reflection rippling and breaking, deepening the scene downward',
      'HEAT-SHIMMER + SMOKE — a heat-shimmer haze and a slow column of smoke rising in the scene behind him, the warm distortion separating him from the deep background',
      'DRIFTING PARTICULATE — slow drifting particulate filling the air (snow / spores / data-fragments / ash) catching the rim-light, suspended around his moving figure, atmospheric depth',
    ],
    instructions: `Each entry is ONE atmospheric sci-fi flourish, 25-45 words. Format: "FLOURISH CAPS — primary visual + atmospheric detail + relationship-to-him". Amplifies his presence without cluttering. Output as a NUMBERED list (1. ... 2. ...), one entry per line. NO internal newlines.`,
  },

  // ─── mecha-pilots path: composition (pilot+mech vertigo angles) ───
  mecha_pilots_composition: {
    format: 'simple',
    theme: `PILOT+MECH SCALE-RELATIONSHIP CAMERA ANGLES for the mecha-pilots path. Each entry specifies a camera position + framing that makes the SCALE GAP between tiny pilot and enormous mech viscerally legible. Each entry 25-50 words.

⚠️ MANDATORY — every entry must convey the SCALE GAP through composition. Pilot is ALWAYS tiny relative to mech. Both must be visible (or mech-fragment + pilot, like a hand cradling them).

✓ ANGLE CATEGORIES — vary across:
  • WORM'S-EYE-UP-THE-LEG — pilot mid-climb on access ladder, camera at ground looking up the towering leg, mech receding upward into perspective
  • PILOT IN MECH'S OPEN PALM — mech kneeling, holding pilot in open hand at eye-level (Iron Giant moment)
  • PILOT ON SHOULDER — looking out from atop the mech's shoulder, pilot in foreground edge, vast deployment-bay/sky beyond
  • GANTRY-CATWALK CROSS — pilot walking on catwalk that crosses between mech's chest and the wall, mech filling 70% of frame
  • DEEP-HANGAR WIDE-SHOT — pilot small in foreground walking toward mech that fills the deep tunnel, ranks of other mechs flanking
  • COCKPIT-INTERIOR POV — over-pilot's-shoulder at HUD displays, canopy showing world beyond, instrument-glow on pilot's helmet
  • PILOT MID-LEAP TOWARD HATCH — suspended between catwalk and cockpit opening, mech-chest filling background
  • ASYMMETRIC TWO-SHOT — pilot bottom-left small, mech filling rest of frame (the 1:50 scale-shot)
  • MECH KNEELING FOR BOARDING — mech in subordinate boarding stance, pilot ascending leg-step, deployment-bay framing
  • SHUTTLE-EXIT TOWARD-MECH — pilot stepping out of drop-shuttle toward waiting mech in deployment-bay, shuttle-glow behind
  • PILOT REPAIR ON SHOULDER — pilot on suspended platform working at mech's shoulder seam, hangar gantry behind
  • PILOT-RUNNING-TOWARD-COLLAPSED-MECH — rescue moment, fallen mech in mid-distance, pilot mid-stride toward it through debris
  • UNDER-THE-FOOT EMERGENCY — pilot directly beneath as mech foot descends/lifts above them, blast doors opening
  • CRANE-DEPLOYMENT GANTRY — mech being lowered by overhead crane into launch-position, pilot at control panel, gantry receding overhead
  • CRADLE-IN-FRAME — mech in vertical launch cradle, pilot ascending side-walkway, silo-walls receding upward
  • THROUGH-HATCH WIDE — camera at the open cockpit hatch looking out, pilot's hand on the rim, vast hangar beyond
  • PILOT WALKING AWAY POST-LAUNCH — pilot small foreground walking away from just-deployed mech that's already rising, smoke and steam
  • TWO-PILOTS BRIEFING — pilots in foreground exchanging gestures, mech being prepped in midground, hangar-deck below
  • PILOT REFLECTED IN CHEST-PLATE — pilot's reflection in the polished mech chassis, mech-fragment dominating, pilot small in reflection
  • RAIN-WET DEPLOYMENT-PAD — pilot crossing wet hangar floor at night toward backlit mech, reflections doubling the scale

Each entry must:
• Name the angle TYPE in first 6 words
• Specify pilot position (foreground / on catwalk / on shoulder / under leg / inside cockpit)
• Specify what mech-fragment dominates (leg / hand / shoulder / chest / full silhouette / cockpit-interior)
• Reference the deployment-context (hangar / silo / launch-cradle / shuttle-bay / catwalk-network)`,
    touchpoints: [
      "WORM'S-EYE UP THE LEG — camera flush against hangar-deck looking straight up the leg of a kneeling mech, pilot mid-climb on access ladder one-third up the leg, mech receding into impossible perspective overhead with deployment-rig framing the upper edges",
      "PILOT IN MECH'S OPEN PALM — mech kneeling in deployment-bay, holding the pilot in its open hand at eye-level, pilot small but clearly readable against the colossal palm, hangar-amber lighting from behind framing the moment, Iron Giant tenderness",
      "PILOT ON SHOULDER VANTAGE — camera positioned on the mech's shoulder behind the pilot, pilot in foreground edge looking outward, vast deployment-bay opening up below them, gantry catwalks visible far below at multiple levels",
      'GANTRY-CATWALK CROSS — pilot walking confidently across catwalk that crosses the deployment-bay at mid-chest height of the mech, the mech filling 70% of the frame as wall of chassis with seam-glow, catwalk receding behind',
      'DEEP-HANGAR WIDE-SHOT — pilot small in foreground walking toward the hero mech that fills the deep tunnel-of-mechs flanking left and right, hangar lights receding into vanishing point, the hero mech amber-backlit at the end',
      "COCKPIT-INTERIOR POV — over-pilot's-shoulder at multi-screen HUD displays bathed in cyan/amber, canopy showing the world beyond, instrument-glow reflected on the pilot's helmet visor, control-stick foreground",
      'PILOT MID-LEAP TOWARD HATCH — pilot frozen mid-jump suspended between catwalk and open cockpit hatch, mech-chest filling background, hatch-glow framing the landing zone, hands outstretched',
      'ASYMMETRIC 1-TO-50 TWO-SHOT — pilot bottom-left of frame at full body height, mech filling the rest of the frame towering upward and out of frame, scale-ratio approximately 1:50 immediately legible',
      'MECH KNEELING FOR BOARDING — mech in subordinate boarding stance with one knee on the deck, pilot ascending the leg-step toward the open chest cockpit, deployment-bay framing left/right, amber emergency lighting',
      'SHUTTLE-EXIT TOWARD MECH — pilot stepping out of drop-shuttle silhouetted in the shuttle-doorway-glow, walking toward the waiting mech in the deployment-bay, shuttle-engine-amber backlight, mech-blue-eye-glow ahead',
      "PILOT REPAIR ON SHOULDER PLATFORM — pilot on suspended maintenance-platform working at the mech's shoulder-seam with sparks flying, hangar gantry receding behind them at multiple levels, sodium-amber industrial light",
      'PILOT RUNNING TOWARD COLLAPSED MECH — rescue moment, fallen damaged mech smoking in mid-distance, pilot mid-stride sprinting toward it through debris and smoke, dawn-cold-blue light, urgency reading in the figure',
      "UNDER-THE-FOOT EMERGENCY — pilot directly beneath as mech's foot descends OR lifts above them, blast doors opening in the ceiling overhead, pilot looking up shielding face, dust kicked up",
      'CRANE-DEPLOYMENT GANTRY — mech being lowered by overhead deployment-crane into launch-position, pilot at the control panel in the foreground operating it, gantry receding overhead with hydraulic struts, cyan operational-lights',
      'VERTICAL CRADLE-IN-FRAME — mech locked in vertical launch cradle filling the frame, pilot ascending the side-walkway toward the cockpit, silo-walls receding upward and downward, alert-strobes pulsing red',
      "THROUGH-HATCH WIDE-LOOKOUT — camera positioned at the open cockpit hatch looking outward, pilot's gloved hand on the rim of the hatch in foreground, vast hangar-deck beyond with multiple mechs in different states",
      "PILOT WALKING AWAY POST-LAUNCH — pilot small in the foreground walking away from a just-deployed mech that's already rising on launch-thrust, smoke and steam billowing, sunset light raking across",
      'TWO-PILOTS BRIEFING ON DECK — two pilots in the foreground exchanging hand-gestures, mech being prepped in midground by maintenance crew, deployment-deck below visible through gantry-grating, industrial light',
      "PILOT REFLECTED IN MECH CHEST-PLATE — pilot's reflection visible in the polished mech-chassis surface, mech-fragment dominating the frame, pilot reading small in the reflection, hangar-amber backlight",
      'RAIN-WET DEPLOYMENT-PAD NIGHT — pilot crossing wet hangar floor at night toward backlit mech, neon-amber and emergency-red reflections doubling on the puddles, scale-ratio massive, atmospheric haze',
    ],
    instructions: `Each entry is ONE specific pilot+mech scale-relationship camera angle, 25-50 words. Format: "ANGLE NAME CAPS — camera position + pilot position + dominant mech-fragment + deployment context". Always make the scale-gap legible. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── mecha-pilots path: lighting (hangar / silo / dawn-deployment) ───
  mecha_pilots_lighting: {
    format: 'simple',
    theme: `MECHA-DEPLOYMENT LIGHTING for the mecha-pilots path. Each entry is ONE specific lighting setup for hangar / launch-silo / deployment-bay / shuttle-interior / dawn-deployment / repair-deck. Each entry 20-40 words.

⚠️ STRICT BAN — NO "volumetric haze / generic atmospheric fog" as PRIMARY. NO cosmic/astronomy vocabulary (wrong fit for industrial mecha-deployment scenes). NO daylight-resort lighting.

✓ MANDATORY VARIETY — distribute across:
  A. **HANGAR-AMBER SODIUM** (~20%): warm orange industrial floodlight wash, hard yellow shadows, after-image of cooler distant cyan accents
  B. **EMERGENCY-RED STROBE** (~15%): pulsing red emergency-strobes across the scene, hard shadow contrast pulsing in rhythm, urgency reading
  C. **DAWN-DEPLOYMENT DUAL-COLOR** (~15%): cold pre-sunrise blue + first warm orange touching upper mech-surfaces, dramatic dual-color contrast
  D. **LAUNCH-SILO PULSING-ORANGE** (~10%): rotating amber alert-strobes inside a vertical silo, walls catching warm-pulse rhythm, lower shadow zones cold
  E. **NIGHT WITH MECH-RUNNING-LIGHTS** (~10%): cold cobalt ambient + the mech\'s own chassis running-lights and cockpit-interior glow providing primary illumination
  F. **NEON-CYBERPUNK URBAN HANGAR** (~10%): magenta + cyan sign-lights bleeding into open hangar, wet floor reflecting, dramatic uplight on mech underside
  G. **DUSK FIRE-GLOW POST-COMBAT** (~5%): warm fire-glow from burning installation uplighting the mech and pilot, atmospheric haze, end-of-mission mood
  H. **OVERCAST DEPLOYMENT-FIELD** (~5%): diffuse soft light, low contrast, mechs lined up in formation reading in muted tones
  I. **HARD KEY-LIGHT INSPECTION** (~5%): single intense spotlight on the mech for inspection, pilot in shadow, harsh shadow boundaries
  J. **RAIN-WET NIGHT PAD** (~5%): cold night ambient with rain backlighting from a single source, wet hangar-deck reflections, atmospheric drama`,
    touchpoints: [
      'HANGAR-AMBER SODIUM WASH — warm orange industrial floodlight wash from elevated mast positions, hard yellow shadows cast across the deployment-bay floor, distant cyan accent-lights from control-panel banks providing cool-warm contrast',
      'EMERGENCY-RED STROBE PULSING — emergency-red rotating beacons across the scene pulsing in rhythm, hard shadow contrast pulsing with them, urgency reading immediate, the mech briefly silhouetted in alert-red between flashes',
      'DAWN-DEPLOYMENT DUAL-COLOR — pre-sunrise cold blue base ambient with first warm orange touching only the upper surfaces of the mech, dual-color contrast, deep blue shadow in the lower frame, every chassis-detail readable',
      'LAUNCH-SILO PULSING-ORANGE — rotating amber alert-strobes inside the vertical launch silo, silo walls catching the warm-pulse rhythm in concentric ring-patterns, lower shadow zones cold cobalt, vertical drama',
      "NIGHT MECH-RUNNING-LIGHTS — cold cobalt-moonlight ambient base, the mech's own chassis running-lights and cockpit-interior glow providing primary illumination, hull self-lit in amber/cyan against deep sky",
      "NEON-CYBERPUNK URBAN HANGAR — magenta and cyan sign-lights bleeding into the open hangar from the city outside, wet floor reflecting the colors in puddles, dramatic uplight on the mech's underside",
      'DUSK FIRE-GLOW POST-COMBAT — warm fire-glow from a burning installation uplighting the mech and pilot from below, atmospheric haze backlit by distant flames, end-of-mission mood weight in the air',
      'OVERCAST DEPLOYMENT-FIELD — uniform blanket-cloud diffuse light, low contrast, mechs lined up in formation reading in muted tones, ground bouncing fill-light upward into chassis shadows',
      "HARD KEY-LIGHT INSPECTION — single intense spotlight on the mech for pre-launch inspection, pilot reading in deep shadow at the mech's feet, harsh shadow boundaries, theatrical drama",
      'RAIN-WET NIGHT PAD — cold night ambient with rain backlighting from a single elevated source, wet hangar-deck reflections doubling the figures, atmospheric drama, droplets catching specular',
      'SUNRISE-OVER-DEPLOYMENT-FIELD — pink-purple gradient sky with the sun cresting the horizon, mech silhouetted edge-lit gold against the rising sun, pilot small in deep foreground shadow, hopeful operational mood',
      'BLAST-DOORS-OPENING LIGHT-FLOOD — beam of bright outside light flooding through opening blast doors into the dim deployment-bay, mech and pilot silhouetted against the rectangle of escaping light, dramatic key-source',
      "COCKPIT-INTERIOR HUD GLOW — cyan and amber multi-screen HUD displays providing primary illumination, pilot's face lit cool from below, instrument-glow reflected on visor, tactile and intimate",
      'SHUTTLE-INTERIOR DEPLOYMENT-BAY — rotating warning-yellow lights inside a drop-shuttle bay, mech locked in cradle, pilot at the door framed by amber strobe, industrial drop-mission lighting',
      'WINTER-DAWN ARCTIC DEPLOYMENT — cold blue-white arctic dawn with snow accumulating on chassis, mech reading in cool tones, pilot in heavy gear small in foreground, breath visible',
    ],
    instructions: `Each entry is ONE specific mecha-deployment lighting setup, 20-40 words. Format: "LIGHTING MODE CAPS — [source + direction + color + shadow character + deployment context]". STRICT industrial/hangar/silo/deployment context — NO cosmic, NO daylight-resort. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── mecha-pilots path: drama (40%-gated deployment phenomena) ───
  mecha_pilots_drama: {
    format: 'simple',
    theme: `40%-GATED ENVIRONMENTAL DRAMA for the mecha-pilots path — a hangar/deployment/launch event that amplifies the boarding-or-deployment moment. Each entry 25-50 words.

⚠️ STRICT — each phenomenon must amplify the SCALE/DRAMA of the pilot+mech boarding/deployment moment. NO active battlefield combat (that's titan-war territory). NO industrial mining work (industrial-machines).

✓ DEPLOYMENT/HANGAR PHENOMENA — distribute across:
  • EMERGENCY-LAUNCH STROBES PULSING across the deployment-bay
  • BLAST-DOORS-OPENING with outside light flooding in
  • GANTRY-CRANE LOWERING the mech into launch-position overhead
  • COOLANT-VAPOR BILLOWING from the mech\'s cooling vents
  • PRE-LAUNCH IGNITION-FLARE building at the mech\'s feet
  • HYDRAULIC-RAM LOCKS RELEASING in sequence with steam-jets
  • WEAPON-MOUNT CHARGING-GLOW building visibly along the mech\'s armaments
  • COCKPIT-HATCH SEALING with mechanical pneumatic-hiss
  • SHUTTLE-DROP DEPLOYMENT VECTOR opening below the pilot
  • RAIN POURING THROUGH OPEN BLAST-DOORS onto the deck
  • SUNRISE CRESTING horizon framing the deployment-pad
  • GROUND-CREW SCATTERING from the impending launch
  • TARGETING-RETICLE BLOOMING across the cockpit canopy as systems come online
  • CRADLE-RELEASE LATCHES SNAPPING OPEN in launch-sequence
  • DROP-POD ATMOSPHERIC-ENTRY visible through observation port
  • DISTANT-ALERT-LIGHTS PULSING across the deployment-deck horizon
  • CRACKED-GLASS-VIEWING-PANEL with weather behind it
  • COMM-TOWER FAR-DISTANT BEACON pulsing on the deployment-field horizon
  • REFUELING-UMBILICAL DETACHING with vapor-spray
  • TARP-SHEET BLOWING AWAY revealing the mech beneath`,
    touchpoints: [
      'EMERGENCY-LAUNCH STROBES PULSING — rotating amber-and-red emergency strobes pulsing across the entire deployment-bay in rhythmic alert pattern, casting flickering shadows that pulse across the mech and pilot, urgency reading immediately',
      'BLAST-DOORS-OPENING LIGHT-FLOOD — massive blast-doors at the deployment-bay ceiling parting in mid-motion, outside light flooding through the widening gap, mech and pilot silhouetted against the rectangle of escaping brightness',
      'GANTRY-CRANE LOWERING MECH — overhead deployment-crane visibly lowering the mech into launch-position, hydraulic struts extended, the mech suspended mid-descent, gantry-cables tensioned, control-station active in foreground',
      "COOLANT-VAPOR BILLOWING — pressurized coolant-vapor jetting from the mech's cooling-vents in volumetric plumes, partially obscuring the lower hemisphere of the mech in white mist, frozen-on-warm-metal aesthetic",
      "PRE-LAUNCH IGNITION-FLARE — bright white-orange ignition flare building visibly at the mech's feet, sparks raining outward, the surrounding deck briefly lit hot-white from below, the launch sequence beginning",
      "HYDRAULIC-LOCKS RELEASING — sequence of hydraulic-ram locks releasing along the mech's launch-cradle with audible-implied pneumatic-hiss and steam-jets, the mech preparing to detach, each lock-release flashing briefly",
      "WEAPON-MOUNT CHARGING-GLOW — visible energy-conduit glow building along the mech's primary weapon-mounts as systems come online, conduits illuminating sequentially, the mech's power-up cycle visible",
      'COCKPIT-HATCH SEALING — the open cockpit hatch in mid-motion of sealing closed mechanically, pneumatic-actuator visible, the pilot just-locked-in moment, the seal beginning around the perimeter',
      "SHUTTLE-DROP DEPLOYMENT VECTOR — drop-shuttle's deployment-vector opening as a rectangular hole in the floor below the pilot, mech visible in the cradle below ready to drop, wind-rush implied",
      'RAIN POURING THROUGH OPEN BLAST-DOORS — heavy rain pouring through the open ceiling blast-doors onto the deployment-deck, puddles forming on the metal floor, the pilot and mech soaked, atmospheric drama',
      'SUNRISE CRESTING HORIZON — sun cresting the horizon of the deployment-field visible through open hangar doors, pink-purple gradient sky, the mech edge-lit gold against the rising sun, hopeful operational mood',
      'GROUND-CREW SCATTERING — ground-crew figures scattering away from the impending launch in foreground, hand-signals visible, the urgency reading in their motion, leaving the mech and pilot alone in the cradle',
      "TARGETING-RETICLE BLOOMING — multiple targeting-reticles blooming across the cockpit canopy in sequence as systems come online, amber reticle-glow reflecting on pilot's visor, the targeting-lock cascade beginning",
      "CRADLE-RELEASE LATCHES — sequence of cradle-release latches snapping open along the mech's launch-cradle, each latch sparking briefly as it releases, the mech beginning to free of its restraints",
      'DROP-POD ATMOSPHERIC-ENTRY — atmospheric-entry burn visible through an observation port, white-hot leading edge crossing the upper view, the pilot watching their imminent drop-mission begin',
      'DISTANT-ALERT-LIGHTS PULSING — chain of distant alert-lights pulsing across the deployment-deck horizon in synchronized rhythm, multiple deployment-bays activating in coordinated launch-sequence',
      "CRACKED-GLASS VIEWING-PANEL — large viewing-panel with hairline-cracks across it providing the pilot's view of the world beyond, weather (storm / rain / dust) visible behind it, fractured-glass refractions",
      'COMM-TOWER BEACON FAR-DISTANT — communication-tower beacon pulsing rhythmically on the far horizon of the deployment-field, contextualizing the wider operational network the deployment is part of',
      "REFUELING-UMBILICAL DETACHING — refueling-umbilical detaching from the mech's side-port with vapor-spray and a brief flash of escaping coolant, the umbilical retracting toward its mount, the mech now free",
      'TARP-SHEET BLOWING AWAY — protective tarp-sheet blowing away from the mech revealing the chassis beneath, wind-rush implied, the mech now exposed and ready for boarding, dramatic reveal moment',
    ],
    instructions: `Each entry is ONE specific deployment/hangar/launch environmental phenomenon, 25-50 words. Format: "PHENOMENON NAME CAPS — primary visual action + secondary detail + deployment context". STRICT deployment/boarding context — NO active battlefield combat, NO industrial mining. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── mech-skyships path: composition (sky vertigo angles) ───
  mech_skyships_composition: {
    format: 'simple',
    theme: `SKY-VERTIGO CAMERA ANGLES for the mech-skyships path — each entry specifies a camera position + framing that makes the viewer FEEL the air, the altitude, and the speed of the predatory sci-fi skyship through perspective alone. Each entry 25-50 words.

⚠️ MANDATORY — every entry must convey VERTIGO + AERIAL spectacle. The viewer's gut reaction must be "I feel the altitude" or "I feel the speed."

✓ SKY-VERTIGO ANGLE CATEGORIES (vary across):
  • WORM'S-EYE FROM GROUND — camera at ground level looking straight up as the skyship roars overhead, hull filling the upper sky-frame
  • OVER-THE-WING POV — camera mounted on the skyship's wing looking forward toward a target / horizon, blade-wing filling foreground edge
  • COCKPIT/CANOPY-POV — looking through forward-facing canopy at the target ahead, reticle / HUD elements visible at frame edge
  • GOD'S-EYE FROM HIGHER ALTITUDE — camera at higher altitude looking down at skyship + ground far below, multiple cloud-layers between
  • THROUGH-CLOUD-LAYER BREAK — skyship piercing through a cloud-deck from above or below, vapor-cone bursting off prow
  • MOUNTAIN-PASS THREADING — skyship banking hard through narrow gap between snow-capped peaks, peaks framing the frame
  • LOW-PASS OVER CITY — camera at street-level / rooftop as skyship roars past tower-tops, windows reflecting hull-glow
  • CHEEK-TO-CHEEK PARALLEL — camera alongside skyship at matching speed, hull filling right or left half of frame, contrails behind
  • FORMATION-FLYBY — camera leading the formation, ships in V or wedge behind, exhaust-trails trailing
  • DOGFIGHT-BANK PURSUIT — camera locked on skyship banking hard through cloud-cover in pursuit, motion-blur on wingtips
  • CARRIER-LAUNCH — skyship deploying from a larger sky-vessel (mothership-class), scale-prover smaller ships visible
  • ATMOSPHERIC RE-ENTRY BURN — skyship descending through fire with thermal-shield glowing white-hot, atmospheric burn-trail
  • VERTICAL CLIMB — skyship climbing straight up through cloud layers, exhaust-cone trailing below, sun-glare ahead
  • DIVE-BOMB DESCENT — camera tracking skyship in steep dive toward ground target, ground rushing up
  • HOVER-OVER-WASTELAND — skyship suspended motionless over visible ground action, ground figures looking up
  • UNDER-THE-BELLY — camera directly beneath skyship as it passes overhead, weapon-mounts and exhaust-vents visible
  • TILT-BACK-FROM-SHADOW — camera on the ground in the moving shadow of the skyship overhead, sun blocked by hull silhouette
  • ABOVE THE CLOUD DECK — wide aerial shot at cloud-bank altitude, skyship piercing the cloud-deck with upper hull in sun and lower in shadow
  • THROUGH-DEBRIS-CLOUD — camera tracking skyship through a debris field / explosion aftermath, hull weaving through tumbling wreckage`,
    touchpoints: [
      "WORM'S-EYE FROM GROUND — camera flush against cracked desert hardpan looking straight up as the skyship roars overhead, blade-hull filling the upper frame, exhaust-cone trailing white-hot vapor, ground figures sprinting in the foreground silhouetted against the sun",
      "OVER-THE-WING POV — camera mounted on the skyship's starboard blade-wing looking forward toward a distant target spire, wing dominating the lower-left of frame, target ship banking away across cumulus cloud-cover",
      'CANOPY-POV PURSUIT — looking through forward canopy at the target skyship banking away in pursuit, reticle elements glowing red at frame edge, instrument-glow reflected on the canopy glass, sun-glare across the top',
      "GOD'S-EYE FROM HIGHER ALTITUDE — high-aerial view looking down at the skyship gliding between two cloud-layers, ground far below visible through a break in the lower cloud-deck, multiple ship-specks at vanishing point",
      'THROUGH-CLOUD-LAYER BREAK — skyship in the act of piercing the cloud-deck from above, hull half-emerging into open sky, vapor-cone bursting off prow, sun-shafts breaking through the cloud-tear',
      'MOUNTAIN-PASS THREADING — skyship banking hard through a narrow gap between snow-capped peaks, peaks framing the left and right edges of frame, blade-wings nearly grazing rock, contrails curling',
      'LOW-PASS OVER MEGACITY — camera at rooftop level as the skyship roars past tower-tops, neon signage reflecting off the hull-plating, downwash visible kicking debris from rooftops, distant skyline lit in dusk-orange',
      'CHEEK-TO-CHEEK PARALLEL — camera alongside the skyship at matching speed, hull filling the right half of the frame from prow to stern, contrails trailing behind, distant fleet specks visible at vanishing point left',
      'FORMATION-FLYBY — camera leading the formation at jet altitude, three ships in V-formation behind, exhaust-trails braiding, sun behind the formation casting silhouette, distant carrier-airship at horizon',
      'DOGFIGHT-BANK PURSUIT — camera locked on the skyship banking hard through dense cumulus in pursuit of an off-frame target, motion-blur on wingtips, missile-launch flare from underside, contrail spiraling',
      'CARRIER-LAUNCH DEPLOYMENT — skyship deploying from a larger mothership-class carrier visible at frame-top, scale-prover smaller ships in the distance, atmospheric haze separating altitudes, sun-shafts',
      'ATMOSPHERIC RE-ENTRY BURN — skyship descending through fire with thermal-shield glowing white-hot at prow, atmospheric burn-trail crossing the upper sky, ground far below partially visible through plasma-glare',
      'VERTICAL CLIMB — skyship climbing straight up through three cloud-layers, exhaust-cone trailing below in a vapor-pillar, sun-glare ahead at the apex of climb, smaller ships specks lower in formation',
      'DIVE-BOMB DESCENT — camera tracking the skyship in steep dive toward a ground target, ground rushing up below, weapon-mounts charging visibly, motion-blur on the hull, debris already in the air',
      'HOVER-OVER-WASTELAND — skyship suspended motionless above visible ground action, ground figures with rifles looking up, dust-cloud kicked up by downwash, multiple smaller ships circling at altitude',
      'UNDER-THE-BELLY PASS — camera directly beneath the skyship as it passes overhead, weapon-mounts and exhaust-vents visible against the sky, sun-glare at edge, ground rushing in the foreground motion-blur',
      'TILT-BACK FROM SHADOW — camera on a hilltop in the moving shadow of the skyship overhead, sun blocked by hull silhouette above, ground figures shielding eyes, skyship hull edge-lit by sun-rim',
      'ABOVE CLOUD-DECK PIERCE — wide aerial shot at cloud-bank altitude, skyship piercing the cloud-deck with upper hull in golden sun and lower half in deep cloud-shadow, smaller ships visible at the cloud-line',
      'THROUGH-DEBRIS-CLOUD WEAVE — camera tracking the skyship as it weaves through a tumbling debris field aftermath of an explosion, hull dodging chunks of wreckage, lens-flare from a distant fire',
      'OVER-THE-SHOULDER FROM PILOT — POV behind a tiny pilot figure standing on a tower-top watching the skyship pass overhead, pilot in foreground silhouetted, skyship dominating midground at full scale',
    ],
    instructions: `Each entry is ONE specific sky-vertigo camera-angle preset, 25-50 words. Format: "ANGLE NAME CAPS — camera position + what dominates the frame + aerial/scale-prover reference". Vary across the 15+ angle categories. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── mech-skyships path: lighting (aerial flight) ───
  mech_skyships_lighting: {
    format: 'simple',
    theme: `AERIAL FLIGHT LIGHTING for the mech-skyships path. Each entry is ONE specific cinematic lighting setup for sky-based action. Each entry 20-40 words.

⚠️ STRICT BAN — NO "volumetric haze / generic atmospheric fog" as the PRIMARY lighting language. Volumetric god-rays are OK as a sky element but not the primary lighting mode. Lighting must specify SOURCE + DIRECTION + COLOR + behavior.

🚫 ALSO BANNED:
• NO cosmic/astronomy vocabulary (K-type dwarfs / nebula light / wrong fit for aerial flight)
• NO daylight-resort-vista cheerful flat-sky
• NO ground-cave/interior lighting modes

✓ MANDATORY VARIETY — distribute roughly evenly across:
  A. **GOLDEN HOUR HIGH-ALTITUDE** (~15%): warm low-angle sun glancing across hull-tops, long shadows on cloud-deck
  B. **DAWN ABOVE THE CLOUD-DECK** (~15%): cold blue ambient + first warm orange touching upper hull surfaces, dual-color contrast
  C. **DUSK BLOOD-RED HORIZON** (~10%): sun at horizon bleeding crimson across the entire sky, ships silhouetted edge-red
  D. **STORM-CELL LIGHTNING FLASH** (~10%): pre-storm dark with actinic-white lightning forks briefly silhouetting ship and clouds
  E. **NIGHT WITH ENGINE-GLOW + RUNNING-LIGHTS** (~10%): cold moonlight base + ship's own engine-glow + chassis running-lights as primary illumination
  F. **SUNSET PURPLE-GOLD GRADIENT** (~10%): sky purple at zenith / gold at horizon, ships backlit edge-amber
  G. **ATMOSPHERIC RE-ENTRY THERMAL BURN** (~5%): white-hot plasma-shield at prow, atmospheric burn-trail providing primary illumination
  H. **MUZZLE-FLASH WEAPONS-DISCHARGE** (~10%): combat scene where weapon-discharge from the ship provides strobing primary light against darker background
  I. **NEON-CYBERPUNK CITY-GLOW UPLIGHT** (~5%): low-altitude over a neon megacity, multi-color sign-lights uplighting the ship's underside
  J. **ORBITAL TWILIGHT TERMINATOR** (~5%): high-altitude shot at the day/night terminator-line, half hull in sun + half in shadow
  K. **AURORA EM-WARFARE INTERFERENCE** (~5%): high-altitude with aurora-coded electromagnetic warfare distorting the sky in green/violet curtains`,
    touchpoints: [
      'GOLDEN HOUR HIGH-ALTITUDE — warm low-angle sun glancing across hull-tops casting long amber shadows down onto the cloud-deck below, clear air, every panel of the skyship crisp in the backlight',
      'DAWN ABOVE CLOUD-DECK — cold blue ambient with first warm orange touching only the upper hull surfaces of the skyship, dual-color contrast, cloud-deck below glowing pink from horizon-line sun',
      'DUSK BLOOD-RED HORIZON — sun at horizon bleeding deep crimson across the entire sky, the skyship silhouetted edge-red against the burning sky, hard shadows cast on the cloud-deck below',
      'STORM-CELL LIGHTNING FLASH — pre-storm dark with actinic-white lightning forks branching between charged cloud-banks, briefly silhouetting the skyship in stark white-on-black, deep shadow between flashes',
      "NIGHT ENGINE-GLOW PRIMARY — cold moonlight base ambient with the skyship's own engine-glow and chassis running-lights providing primary illumination, hull self-lit in amber/cyan against deep cobalt sky",
      'SUNSET PURPLE-GOLD GRADIENT — sky transitioning purple at zenith to gold at horizon, skyship backlit edge-amber, cloud-deck below catching gold from horizon-side, shadows long and stretched',
      "ATMOSPHERIC RE-ENTRY THERMAL — white-hot plasma-shield at the skyship's prow providing primary illumination, atmospheric burn-trail crossing the upper sky behind, hull glowing orange-white from heat",
      'MUZZLE-FLASH STROBE — combat scene with weapon-discharge from the skyship providing strobing primary light against deep storm-darkness, sharp shadow contrast pulsing in firing-rhythm',
      "NEON-CYBERPUNK CITY-GLOW UPLIGHT — low-altitude over a neon megacity at night, magenta and cyan sign-lights from below uplighting the skyship's underside hull, hard upward shadows",
      'ORBITAL TWILIGHT TERMINATOR — high-altitude shot at the day/night terminator-line, half the skyship hull in golden sun and half in cobalt shadow, atmospheric blue curve visible at horizon',
      'AURORA EM-WARFARE INTERFERENCE — high-altitude with aurora-coded electromagnetic distortion curtaining the sky in green-violet ribbons, skyship hull faintly reflecting the aurora-color',
      'HARSH MIDDAY ABOVE-CLOUD — overhead white sun with razor-edged shadows on the skyship hull, cloud-deck below bleached pale, heat-shimmer visible at distance',
      'OVERCAST BATTLEFIELD SKY — uniform blanket-cloud diffuse light, low contrast, skyship reading in muted tones, ground far below visible through atmospheric haze',
      "VOLCANIC UPLIGHT FROM BELOW — flying over an active volcanic region with orange lava-glow uplighting the skyship's underside hull in warm orange-red, smoke-columns from below",
      'TWIN-SUN ALIEN SKY — alien-planet sky with two suns of different colors casting overlapping double-shadows on the skyship hull, atmospheric tint pulled toward unusual color',
    ],
    instructions: `Each entry is ONE specific aerial flight lighting setup, 20-40 words. Format: "LIGHTING MODE CAPS — [source + direction + color + shadow character + sky context]". Distribute across the 11 buckets. NO "volumetric haze / generic atmospheric fog" as PRIMARY mode. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── mech-skyships path: engagement (ALWAYS-ON multi-actor combat scene) ───
  mech_skyships_engagement: {
    format: 'simple',
    theme: `MULTI-ACTOR COMBAT NARRATIVE BEATS for the mech-skyships path — each entry describes a SCENE with the hero skyship + 2-4 OTHER actors in active interaction. NOT a solo hero ship flying. Each entry 40-80 words.

⚠️ MANDATORY — every entry must include MULTIPLE actors in the scene with INTERACTION between them. The hero ship is engaged with: other ships (enemy / allied / fleet) AND/OR ground forces AND/OR a target structure AND/OR a city/installation reacting AND/OR debris/wreckage from prior kills. The viewer must read the STORY in 2 seconds.

🚫 BANNED — NO solo hero-ship-flying-through-clouds entries. NO peaceful cruise. NO empty sky. If the entry could be summed up as "ship in pretty sky," it FAILS the gate.

✓ ENGAGEMENT TYPES — vary across:
  A. **DOGFIGHT TANGLE** (~15%): 2-4 enemy ships locked in pursuit pattern with hero, missile-trails crossing, one already smoking from hits
  B. **SQUADRON STRIKE** (~15%): wing of ships diving in formation toward target convoy / installation / city below, AA-fire rising
  C. **ESCORT DEFENSE** (~10%): hero ship shielding larger carrier-class vessel from incoming attackers, weapons firing forward
  D. **CHASE PURSUIT** (~10%): hero ship in stern-chase of fleeing target ship, target throwing debris/countermeasures back, contrails braided
  E. **ARRIVAL / DESCENT** (~10%): hero ship breaking atmosphere over a ground target, ground troops scattering, AA-emplacements rotating up
  F. **AMBUSH-FROM-CLOUDS** (~10%): hero ship bursting out of cloud-cover to engage unsuspecting enemy formation, weapons opening up
  G. **BOMBING-RUN** (~10%): hero ship in low-pass over target releasing ordnance, multiple explosions blooming behind, allied wingmen following
  H. **DROP-DEPLOYMENT** (~5%): hero ship hovering low while smaller drop-pods / drones deploy from chassis-bays toward ground
  I. **INTERCEPT** (~5%): hero ship banking hard to intercept incoming threat (missile-swarm / kamikaze ship / boarding pod), threat visible at vanishing point
  J. **KILL-CONFIRMED** (~5%): hero ship banking away from a fresh kill, target ship spiraling down in flames, allied formation in deep distance
  K. **DEEP-STRIKE** (~5%): hero ship in low-altitude attack run between buildings, target rooftop / installation in sight, ground AA tracking it

Each entry must:
• Name the engagement TYPE in the first 6 words
• Identify the hero ship + the OTHER actors (2-4 named: "enemy interceptors" / "carrier-class vessel" / "ground AA emplacements" / "drop-pods" / "wingmen formation" / "target convoy" / "boarding swarm" / etc.)
• Describe the INTERACTION (weapons-fire / pursuit / defensive maneuver / target reaction / debris / explosions)
• Add 1-2 scale-prover details when appropriate (ground forces, dwarfed buildings, distant fleet specks)`,
    touchpoints: [
      'DOGFIGHT TANGLE — hero skyship banking hard pursued by three enemy interceptors in tight formation, missile-trails braiding between all four ships, one enemy already trailing smoke from a clean hit, contrails crossing the cloud-layer in tight loops, sun-glare lens-flaring across the engagement',
      'SQUADRON STRIKE — wing of five hero ships in V-formation diving toward an enemy convoy crawling across the wasteland below, lead ship releasing first ordnance with bloom-explosion already blooming on a target vehicle, AA-tracer rising from the convoy in colored arcs',
      "ESCORT DEFENSE — hero skyship positioned in front of a larger carrier-class vessel, weapons firing forward at incoming enemy formation, shield-impact discharge rippling across the hero ship's prow, allied fighters launching from the carrier behind",
      "CHASE PURSUIT — hero ship in stern-chase of a fleeing enemy ship, target throwing countermeasure-flares back in a spray of decoys, both ships banked hard through cloud-cover, hero ship's weapon-mount charging glowing red",
      'ARRIVAL DESCENT — hero ship breaking atmospheric re-entry over a defended ground installation, ground AA emplacements visibly rotating to track it, troops scattering for cover, dust and debris kicked up by downwash, allied dropships descending in formation behind',
      'AMBUSH FROM CLOUDS — hero ship bursting up out of a cumulus cloud-bank to engage an unsuspecting enemy formation at altitude, weapons opening up mid-emerge, enemy ships visibly reacting with hard banks',
      'BOMBING RUN OVER CITY — hero ship in low-pass over an enemy megacity releasing ordnance, multiple bloom-explosions in the city streets behind it, allied wingmen following in echelon, AA-fire rising from rooftops',
      'DROP DEPLOYMENT — hero ship hovering low above a ground target, multiple smaller drop-pods deploying from chassis-bays in sequence, pods firing retro-thrusters toward landing zones, ground figures visible below preparing to engage',
      'INTERCEPT FROM ALTITUDE — hero ship banking hard from cruise altitude to intercept an incoming missile-swarm, missile contrails visible spiraling toward the hero, point-defense weapons firing tracer-streams',
      'KILL CONFIRMED BANK-AWAY — hero ship banking away from a fresh kill, target enemy ship spiraling down in flames trailing black smoke, allied formation visible in deep distance continuing engagement',
      'DEEP STRIKE BETWEEN BUILDINGS — hero ship in low-altitude attack run threading between tower-tops of an enemy megacity, target installation visible ahead with weapons charging, ground AA-fire tracking from rooftops',
      'CARRIER STRIKE — hero ship launching torpedo run against a colossal enemy carrier-class vessel, torpedo contrails extending forward, carrier point-defense lighting up in counter-fire, allied wingmen flanking',
      'WAVE-ATTACK SWARM — hero ship leading a wave of smaller drone-craft toward a larger enemy target, drones spreading into attack formation, target rotating defensive guns to track the wave',
      'WINGMAN-DOWN MOMENT — hero ship banking past a fellow ship spiraling down in flames, looking back at the dying wingman, enemy ship visible at vanishing point peeling away from the kill',
      "PINCER MOVEMENT — hero ship closing on enemy target from one flank while allied ship visible closing from opposite flank, target ship caught between, hero's weapons charging for the kill-shot",
      'BOARDING REPEL — hero ship engaging incoming boarding-pods from enemy formation, point-defense lighting up the swarm of pods, debris from destroyed pods raining downward through cloud-layer',
      'RESCUE EXTRACTION — hero ship dropping low over a downed friendly ship in burning wreckage, deployment-bay open, ground figures running toward extraction, enemy ships closing at distance',
      "COVER-FIRE ADVANCE — hero ship laying suppressive fire upward at enemy formation while allied gunship advances behind it toward target, multiple weapon-flashes from hero's mounts, enemy ships scattering",
      'HIGH-G EVASION — hero ship pulling extreme maneuver through cloud-canyon to evade multiple incoming missiles, missiles tracking in trailing contrails, enemy ship visible at deep distance that launched them',
      'DRAGON-DESCENT OVER CITY — hero ship descending vertically toward a megacity target, AA-streams from below tracking it, target buildings already burning, allied formation circling at higher altitude',
      "FRIENDLY-FORMATION INBOUND — hero ship leading a wedge of allied ships inbound to engagement zone visible at deep distance, distant flashes from ongoing combat, hero's weapons charging for the engagement",
    ],
    instructions: `Each entry is ONE multi-actor combat narrative beat, 40-80 words. Format: "ENGAGEMENT TYPE CAPS — hero ship + 2-4 other actors + their interaction + scale-provers if relevant". STRICT mandate: MULTIPLE actors interacting visibly. NO solo hero-ship-flying. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── mech-skyships path: drama (40%-gated sky-combat phenomena) ───
  mech_skyships_drama: {
    format: 'simple',
    theme: `40%-GATED SKY-COMBAT PHENOMENA for the mech-skyships path — a sky-event that amplifies the spectacle of aerial warfare. Each entry 25-50 words.

⚠️ STRICT — each phenomenon must amplify SKY-COMBAT spectacle. Star Wars trench-run + 40K Imperial fleet + Mass Effect orbital + Independence Day + Battle of Endor lineage. NO peaceful nature, NO biomech, NO fantasy.

✓ SKY-COMBAT PHENOMENA — distribute across:
  • TRACER-ROUND ARCS streaking across the sky in colored lines
  • MISSILE-LAUNCH from ship's underside with launch-flare and contrail
  • SHIELD-IMPACT DISCHARGE energy-shield rippling visibly under incoming fire
  • ORBITAL-STRIKE BEAM descending from above the atmosphere onto a ground target
  • DROPSHIP-DEPLOYMENT smaller craft launching from the skyship's chassis-bays
  • ATMOSPHERIC-RE-ENTRY BURN STREAK something descending from orbit through fire
  • FORMATION OF DISTANT SHIPS visible at vanishing point engaging unseen target
  • DOGFIGHT TANGLE multiple skyship silhouettes locked in pursuit across the sky
  • SONIC-BOOM SHOCKWAVE visible atmospheric ring from supersonic flyover
  • EXPLOSION-BLOOM from a destroyed ship visible at distance, debris-cloud expanding
  • CARRIER-AIRSHIP LOOMING vast carrier-class vessel in upper background deploying ships
  • DEBRIS-FIELD FOREGROUND wreckage tumbling through the air from a recent kill
  • SEARCHLIGHT-BEAMS from anti-air positions sweeping the sky tracking the skyship
  • LIGHTNING-STORM ELECTROMAGNETIC arc-discharges branching between charged cloud-banks
  • CONTRAIL TANGLE multiple ships' contrails crisscrossing the sky in dogfight patterns
  • DEPLOYED SWARM-DRONES launching from the skyship's hangar-bays in formation
  • PLASMA-DISCHARGE FROM HULL energy bleeding visibly between hull-plates after impact
  • CITY-BELOW-ON-FIRE distant city ablaze visible through cloud-breaks
  • CRASHED-SHIP-FIREBALL fresh impact-crater with rising flames at ground level visible
  • EMP-PULSE-DAMPENED HULL hull running-lights stuttering offline after EMP-burst
  • COMET-LIKE METEOR-STRIKE incoming kinetic-rod or asteroid impact across the upper sky`,
    touchpoints: [
      'TRACER-ROUND ARCS — colored tracer-round streaks crossing the sky in arcing lines from anti-air positions tracking the skyship, briefly illuminating the air around the hull',
      'MISSILE-LAUNCH FROM UNDERSIDE — skyship releasing a missile from its underside with launch-flare bloom and white-hot contrail spiraling toward an off-frame target',
      'SHIELD-IMPACT DISCHARGE — energy-shield rippling visibly under heavy incoming fire, hexagonal cells lighting up where rounds strike, electromagnetic discharge bleeding outward in arcs',
      'ORBITAL-STRIKE BEAM DESCENT — single column of focused energy descending vertically from above the atmosphere onto a distant ground target, accompanied by ground-flash visible through cloud-break',
      "DROPSHIP DEPLOYMENT — smaller craft launching in sequence from the skyship's chassis-bays, each dropship with its own engine-glow, deploying toward the ground far below",
      'ATMOSPHERIC-RE-ENTRY BURN STREAK — long re-entry streak crossing the upper sky with white-hot leading edge, something descending toward the battlefield from orbit, burn-trail visible for miles',
      'DISTANT FORMATION ENGAGING — formation of ships visible at vanishing point engaging an unseen target with weapon-flashes, smoke-columns rising from kills',
      'DOGFIGHT TANGLE — multiple skyship silhouettes locked in pursuit across the upper sky, contrails crisscrossing in tight loops, weapon-flashes between them',
      'SONIC-BOOM SHOCKWAVE — visible atmospheric shockwave ring expanding outward from a supersonic ship-flyby, briefly distorting the air, dual-vapor-cone in the wake',
      'EXPLOSION-BLOOM AT DISTANCE — bright orange explosion-bloom from a destroyed ship visible at deep distance, debris-cloud expanding outward, fireball still rolling',
      'CARRIER-AIRSHIP LOOMING ABOVE — vast carrier-class mothership in the upper background deploying smaller ships in waves, scale-prover for the hero ship',
      'DEBRIS-FIELD FOREGROUND — tumbling wreckage in the foreground from a recent kill, the hero skyship weaving through hull-fragments, dust and burning debris in the air',
      'SEARCHLIGHT BEAMS SWEEPING — multiple anti-air searchlights from ground positions sweeping the sky tracking the skyship, beams crossing through clouds',
      "LIGHTNING ELECTROMAGNETIC STORM — sky filled with branching electromagnetic arc-discharges between charged cloud-banks, occasional strikes hitting the skyship's antenna-arrays",
      "CONTRAIL TANGLE — multiple ships' contrails crisscrossing the sky in tight dogfight patterns, sun lighting the white trails against deep blue, the spectacle of aerial battle visible in the trails alone",
      "DEPLOYED SWARM-DRONES — swarm of small combat drones launching from the skyship's hangar-bays in coordinated formation, engine-trails braiding behind them",
      'PLASMA-DISCHARGE FROM HULL — visible plasma-arc bleeding between damaged hull-plates after an impact, energy crackling across the chassis seams',
      'CITY-BELOW-ON-FIRE — distant city ablaze visible through breaks in the cloud-deck far below, multiple smoke-columns rising from the burning blocks',
      'CRASHED-SHIP FIREBALL — fresh impact-crater visible at ground level through a cloud-break, recently-downed ship with rising flames and smoke',
      "EMP-PULSE DAMPENED HULL — skyship's running-lights stuttering offline sequentially after an EMP-burst, hull going dark in cascade, engine-glow flickering",
      'COMET-LIKE METEOR-STRIKE — incoming kinetic-rod or meteor-strike crossing the upper sky with white-hot leading edge, contrail visible for miles, impending impact',
    ],
    instructions: `Each entry is ONE specific sky-combat phenomenon, 25-50 words. Format: "PHENOMENON NAME CAPS — primary visual action + secondary detail + aerial/atmospheric note". STRICT sky-combat aesthetic — NO peaceful, NO biomech, NO fantasy. Amplifies aerial-warfare spectacle. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── titan-war-machines path: composition (vertigo angles) ───
  titan_war_composition: {
    format: 'simple',
    theme: `VERTIGO-INDUCING CAMERA ANGLES for the titan-war-machines path — each entry specifies a camera position + framing that makes the viewer FEEL the kilometer-scale of the titan through perspective alone. Each entry 25-50 words.

⚠️ MANDATORY — every entry must induce VERTIGO through scale-perspective. The viewer's gut reaction must be "I can FEEL how massive that is."

✓ VERTIGO ANGLE CATEGORIES (vary across these):
  • WORM'S-EYE-VIEW from titan's base — camera at ground level looking straight up the leg of the titan, foot/leg dominates lower frame, body recedes into perspective vanishing point overhead
  • FLY-BETWEEN-LEGS — camera positioned between two of the titan's leg-pillars at ground level, looking through to distant battlefield, leg-columns frame the shot like skyscrapers
  • KAIJU-STEP-DESCENDING — extreme low-angle as titan's foot DESCENDS toward viewer, debris and dust exploding outward, foot fills upper third of frame
  • AERIAL-ORBIT-AROUND-HEAD — camera at titan's head altitude, city/battlefield far below, head silhouette dominates against sky, jets/helicopters dwarfed mid-air for scale
  • DWARFED-SKYLINE-ESTABLISHING — wide cinematic shot from a kilometer away, titan stands in midground dwarfing entire city skyline, atmospheric haze receding miles into deep distance
  • SLOT-CANYON-BETWEEN-BUILDINGS — camera in narrow alley between skyscrapers at street level, titan visible filling the slot of sky between buildings overhead, scale shocking
  • CRACKED-PAVEMENT-FOREGROUND — extreme low POV with cracked asphalt and overturned vehicle in foreground, titan looming above mid-stride, scale-prover vehicles dwarfed
  • HELICOPTER-PASS — camera at jet altitude doing a pass alongside the titan's torso, titan visible across miles, ground far below
  • CLIFF-EDGE-VANTAGE — camera on a cliff or rooftop at human eye-level, titan rising from below the cliff, viewer feels precipice
  • MID-FALL-CAMERA — POV as if camera is in free-fall past the titan's chest, body fills frame, ground far below visible through motion-blur
  • SCRAPING-CLOUD-LAYER — wide aerial shot at cloud-bank altitude, titan's upper hemisphere PIERCING the cloud-deck, lower body invisible below clouds, jets visible at the cloud-line for scale
  • OVER-THE-SHOULDER-FROM-SOLDIER — POV behind a tiny human soldier on the ground, soldier in foreground, titan looms over them at full scale, viewer feels the soldier's perspective`,
    touchpoints: [
      "WORM'S-EYE-VIEW UP THE LEG — camera at ground level looking straight up the leg-pillar of the titan, foot dominating lower third of frame, leg-armor receding into impossible perspective vanishing point overhead, head barely visible at the top of the sky",
      "FLY-BETWEEN-LEGS — camera positioned between two of the titan's massive leg-pillars at ground level, looking through to a distant burning battlefield, leg-columns framing the shot like ancient skyscraper columns",
      "KAIJU-STEP-DESCENDING — extreme low-angle as the titan's foot DESCENDS toward viewer mid-impact, dust and debris exploding outward in a concentric pressure-wave ring, foot filling the upper two-thirds of the frame, shock-cracks radiating across the ground",
      "AERIAL-ORBIT-AROUND-HEAD — camera at titan's head altitude tracking around it, head silhouette dominating against the sky, city/battlefield far below at the base, military jets dwarfed mid-air for scale reference",
      'DWARFED-SKYLINE-ESTABLISHING — wide cinematic establishing shot from a kilometer away, the titan stands in midground dwarfing the entire city skyline behind it, atmospheric haze receding miles into deep distance',
      'SLOT-CANYON-BETWEEN-BUILDINGS — camera in a narrow alley between skyscrapers at street level, the titan visible filling the SLOT of sky between buildings overhead, scale-shock from the impossibly-narrow frame against impossibly-large titan',
      'CRACKED-PAVEMENT-FOREGROUND — extreme low POV with cracked asphalt and an overturned car in foreground edge, the titan looming above mid-stride, scale-prover vehicles dwarfed by the leg in midground',
      "HELICOPTER-PASS ALONGSIDE TORSO — camera at jet altitude doing a flyby alongside the titan's torso, the titan visible across miles of the frame, ground far below, the camera and titan moving together",
      'CLIFF-EDGE-VANTAGE LOOKING DOWN — camera on a cliff at human eye-level, the titan rising from below the cliff and visible all the way to the head far above, viewer feels the precipice and the scale together',
      "MID-FALL-CAMERA — POV as if the camera is in free-fall past the titan's chest, the body filling the frame in motion-blur, ground far below visible through the blur, sense of vertigo and speed",
      "SCRAPING-CLOUD-LAYER — wide aerial shot at cloud-bank altitude, the titan's upper hemisphere PIERCING the cloud-deck, lower body invisible below clouds, military jets visible at the cloud-line for scale reference",
      "OVER-THE-SHOULDER-FROM-SOLDIER — POV behind a tiny human soldier on the ground in the foreground, the soldier silhouetted against the titan that LOOMS above them at full kilometer-scale, the viewer occupies the soldier's perspective",
      'STREET-LEVEL-WITH-DEBRIS — camera at street level with chunks of falling debris suspended in the foreground, the titan in midground walking through downtown crushing skyscrapers underfoot, the debris frames the shot',
      'AERIAL-WIDE-WITH-JETS-IN-FOREGROUND — high-altitude shot with a squadron of military jets in the foreground frame, the titan visible across miles in midground at the same altitude as the jets, ground far below',
      "BENEATH-THE-FALLING-FOOT — POV directly beneath as the titan's foot descends from above, sky disappearing as the foot fills the frame from above, the viewer about to be crushed, scale-shock at maximum",
    ],
    instructions: `Each entry is ONE specific vertigo camera-angle preset, 25-50 words. Format: "ANGLE NAME CAPS — camera position + what dominates the frame + scale-prover reference". Vary across the 10+ angle categories. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── titan-war-machines path: lighting (ground-based combat) ───
  titan_war_lighting: {
    format: 'simple',
    theme: `GROUND-BASED COMBAT LIGHTING for the titan-war-machines path. Each entry is ONE specific cinematic lighting setup for an active war zone. Each entry 20-40 words.

⚠️ STRICT BAN — NO "volumetric haze / atmospheric fog / volumetric god-rays / dust-particulate veil" as the PRIMARY lighting language. Those phrases fade every render to the same look. May appear as a secondary modifier only.

🚫 ALSO BANNED:
• NO cosmic/astronomy vocabulary (K-type dwarfs / M-class stars / nebulas / orbital phenomena — wrong fit for ground combat)
• NO "soft diffuse atmospheric" as primary mode
• NO cheerful daylight resort vistas

✓ MANDATORY VARIETY — distribute roughly evenly across these buckets:
  A. **HARD MIDDAY COMBAT** (~15%): overhead white sun, razor-edged shadows, high contrast, heat-shimmer at distance
  B. **DAWN MILITARY OPERATION** (~15%): cold pre-sunrise blue base + first warm orange touching highest titan surfaces, dual-color contrast
  C. **DUSK FIRE-GLOW** (~15%): sun-at-horizon orange-purple sky + warm fire-glow from burning city below uplighting the titan
  D. **NIGHT WITH MUZZLE-FLASH STROBE** (~15%): cold moonlight base + strobing white-hot muzzle-flashes from titan's weapons-fire creating freeze-frame illumination
  E. **SODIUM-AMBER URBAN** (~10%): sodium street-lamps + emergency floodlights from below, warm orange wash + hard shadows
  F. **STORM-LIGHTNING FLASH** (~10%): pre-storm dark + actinic-white lightning fork briefly silhouetting the titan against the sky
  G. **ARC-FLASH STROBE** (~5%): industrial arc-discharge from damaged power infrastructure briefly painting the titan in blue-white strobe
  H. **NUCLEAR-WINTER OVERCAST** (~5%): flat diffuse cold light through ash-fall, low contrast, ground bouncing fill-light into titan shadows
  I. **REACTOR-MELTDOWN GLOW** (~5%): titan or distant explosion lighting the scene in orange-white from a single point, hard shadows radiating outward
  J. **TACTICAL FLOODLIGHT ARRAY** (~5%): multiple bright stadium-style floodlights from elevated positions, titan with multiple overlapping cast shadows`,
    touchpoints: [
      'HARD MIDDAY COMBAT — overhead white sun casting razor-edged shadows directly beneath the titan, brutal high-contrast, heat-shimmer visible across the distant battlefield, clean air, every panel of the titan crisp',
      'DAWN MILITARY OPERATION — pre-sunrise cold blue base with first warm orange touching the highest titan surfaces, dual-color contrast, deep blue shadow in the lower frame, every titan detail readable in the gradient',
      'DUSK FIRE-GLOW — sun at horizon-line painting the sky purple-and-gold, warm fire-glow uplighting the titan from below from the burning city beneath, hard shadows cast skyward',
      "NIGHT MUZZLE-FLASH STROBE — cold cobalt moonlight as base, strobing white-hot muzzle-flashes from the titan's firing weapons creating freeze-frame illumination, sharp shadow contrast pulsing in rhythm",
      "SODIUM-AMBER URBAN — warm orange sodium-lamp wash across the downtown battlefield, emergency floodlights from below illuminating the titan's lower half, hard yellow shadows, after-image of cooler distant light",
      'PRE-STORM LIGHTNING FLASH — sky pre-storm dark, single actinic-white lightning fork briefly freezing the titan silhouetted against the sky, deep shadow areas momentarily readable, storm-darkness immediately after',
      'INDUSTRIAL ARC-FLASH STROBE — actinic blue-white arc-discharge from damaged power infrastructure briefly painting the titan in stuttering hard light, sodium-amber ambient between flashes',
      "NUCLEAR-WINTER OVERCAST — flat diffuse cold light through perpetual ash-fall, low contrast, ash-grey ambient everywhere, ground bouncing fill-light into the titan's shadows, distant fires barely visible",
      'REACTOR-MELTDOWN GLOW — distant catastrophic energy-event lighting the entire scene in orange-white from a single point on the horizon, hard shadows radiating outward, mushroom-cloud silhouette in the background',
      'TACTICAL FLOODLIGHT ARRAY — multiple bright stadium-style floodlights from elevated positions on surrounding ruins, the titan with multiple overlapping cast shadows in different directions, hard high-contrast frontal light',
      'SUNSET PURPLE-GOLD — sun at horizon with sky purple-and-gold gradient overhead, every titan surface backlit edge-amber, shadows long and stretched across the foreground rubble',
      'ORBITAL-STRIKE GLOW — single column of focused energy descending from above the atmosphere onto a distant target, ground-flash illuminating the titan from the side, dramatic single-source lighting',
      'BLOOD-RED DUSK — sun at horizon bleeding to deep crimson, hot red atmospheric glow across the entire battlefield, the titan silhouetted edge-red against the sky, hard shadows beneath',
      'COLD ARCTIC OVERCAST — flat blue-grey diffuse light through high cloud, ground bouncing fill-light upward, the titan reading in cool tones with snow accumulating on its shoulders',
      'BACKLIT SUNSET SILHOUETTE — sun positioned directly behind the titan making it a hard-edged silhouette with rim-light, foreground battlefield in deep shadow, sky in orange-gold blaze',
    ],
    instructions: `Each entry is ONE specific ground-based combat lighting setup, 20-40 words. Format: "LIGHTING MODE CAPS — [source + direction + color + shadow character + atmospheric note]". Distribute across the 10 buckets. NO "volumetric haze / atmospheric fog / volumetric god-rays" as PRIMARY mode. NO cosmic-astronomy vocabulary. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── titan-war-machines path: drama (40%-gated combat phenomena) ───
  titan_war_drama: {
    format: 'simple',
    theme: `40%-GATED COMBAT PHENOMENA for the titan-war-machines path — a war-event that amplifies the titan's biblical scale through scene context. Each entry 25-50 words.

⚠️ STRICT — each phenomenon must amplify SCALE + COMBAT spectacle. NO peaceful nature, NO Giger biomech, NO fantasy. Pacific Rim weather + Edge of Tomorrow battle-effects + Battlestar Galactica orbital combat + Mass Effect war-front lineage.

✓ COMBAT PHENOMENA — distribute across:
  • ORBITAL-STRIKE BEAM descending from the sky onto a distant target
  • EMP-BURST PULSE rippling across the battlefield disabling vehicles and lights
  • ARTILLERY-FLASH ROW periodic bright flashes on the horizon
  • SONIC-BOOM SHOCKWAVE from supersonic jet flyover or titan weapon-discharge
  • KAIJU-FOOTFALL PRESSURE-WAVE rippling outward from a titan footstep
  • FALLING MUNITIONS ARC visible streaks descending across the sky
  • SMOKE COLUMNS rising from distant burning city blocks beyond the horizon
  • REACTOR-MELTDOWN GLOW on the horizon — mushroom-cloud silhouette
  • PROPELLANT-VENT PLUME from the titan's chassis billowing volumetrically
  • DRONE-SWARM passing overhead in coordinated geometric formation
  • LIGHTNING STORM with electromagnetic arc-discharges branching between charged clouds
  • ATMOSPHERIC-ENTRY BURN streak crossing the upper sky — something descending from orbit
  • WEAPON-CHARGING GLOW on the titan or a distant mech, energy-conduits illuminated
  • TANK-BATTALION ADVANCE visible in deep distance, dust-cloud trailing
  • JET-SQUADRON FLYBY visible passing across the frame at distance
  • CARRIER-AIRSHIP looming in the upper background at altitude
  • CRASHED-JET FIREBALL fresh impact-crater with rising flames
  • DISTANT-TITAN SILHOUETTE another titan visible in the deep background mid-combat
  • SHIELD-IMPACT DISCHARGE energy-shield rippling under heavy fire
  • DEPLOYED COMBAT DRONES swarm-units launching from titan's chassis-bays
  • SEISMIC GROUND-CRACKS spreading outward from titan footfall
  • TRACER-ROUND ARCS streaking across the sky in colored lines`,
    touchpoints: [
      'ORBITAL-STRIKE BEAM — single column of focused energy descending vertically from above the atmosphere onto a target in deep distance, accompanied by ground-flash and outward shockwave',
      'EMP-BURST PULSE — visible electromagnetic shockwave rippling outward as ringed energy-distortion, briefly disabling all running-lights, vehicles, and signal-arrays across the battlefield',
      'ARTILLERY-FLASH ROW — periodic bright orange flashes along the horizon from distant artillery fire, briefly illuminating the underside of cloud-cover, smoke-trails rising from each impact',
      'SONIC-BOOM SHOCKWAVE — visible atmospheric shockwave ring expanding outward from a supersonic jet flyover or titan weapon-discharge, briefly distorting the air, dual-vapor-cone in the wake',
      'KAIJU-FOOTFALL PRESSURE-WAVE — visible ground-and-air pressure-wave rippling outward from a colossal titan footstep, ground compressing in concentric rings, dust lifted into the air',
      'FALLING MUNITIONS ARC — visible streaks of incoming artillery or missile-fire descending across the sky toward distant targets, each leaving a contrail across the upper atmosphere',
      'SMOKE COLUMNS BEYOND HORIZON — multiple smoke columns rising from a distant burning city blocks beyond the horizon, reaching high altitude before dispersing into the sky',
      'REACTOR-MELTDOWN GLOW — distant catastrophic energy-event lighting the horizon orange-white, atmospheric haze around the meltdown-site glowing dangerously, mushroom-cloud silhouette',
      "PROPELLANT-VENT PLUME — pressurized vapor cloud erupting from the titan's chassis-vents in volumetric volume, briefly obscuring the lower hemisphere of the titan in fog",
      'DRONE-SWARM FORMATION — dozens of small aerial mech-drones in coordinated geometric formation passing overhead, their running-lights tracing the formation pattern across the sky',
      "ELECTROMAGNETIC STORM — sky filled with branching electromagnetic arc-discharges between charged cloud-banks, occasional strikes hitting the titan's antenna-arrays with visible arc-flash",
      'ATMOSPHERIC-ENTRY BURN — long re-entry streak crossing the upper sky with white-hot leading edge, something descending toward the battlefield from orbit, burn-trail visible for miles',
      "WEAPON-CHARGING GLOW — energy-conduits illuminating along the titan's primary weapon-mount as charge builds, glow intensifying, sky around the muzzle starting to brighten",
      'TANK-BATTALION ADVANCE — visible armored column in deep distance, dust-cloud trailing behind, tank-treads kicking up debris, scale-prover for the titan above',
      'JET-SQUADRON FLYBY — visible jet squadron passing across the frame at distance, contrails behind them, dwarfed by the titan in midground for scale',
      'CARRIER-AIRSHIP LOOMING — vast carrier-airship looming in the upper background at altitude, deploying jets, scale-comparison against the titan',
      'CRASHED-JET FIREBALL — fresh impact-crater with rising flames and smoke at midground, recently downed jet, debris scattered, contextualizing the active combat',
      'DISTANT-TITAN SILHOUETTE — another titan visible silhouetted in the deep background, mid-combat with unseen enemy, smoke and flash from its weapons-fire',
      'SHIELD-IMPACT DISCHARGE — energy-shield rippling visibly under heavy incoming fire, hexagonal cells lighting up where rounds strike, electromagnetic discharge spreading',
      "DEPLOYED COMBAT DRONES — swarm of small combat drones launching from the titan's chassis-bays in coordinated formation, exhaust-trails behind them",
      'SEISMIC GROUND-CRACKS — visible cracks spreading outward through the pavement from each titan footfall, dust escaping the cracks, ground destabilizing',
      'TRACER-ROUND ARCS — colored tracer-round streaks crossing the sky in arcing lines from anti-air positions tracking the titan, briefly illuminating the air',
    ],
    instructions: `Each entry is ONE specific combat phenomenon for a titan-war scene, 25-50 words. Format: "PHENOMENON NAME CAPS — primary visual action + secondary detail + scale or atmospheric note". STRICT war-cinema aesthetic — NO peaceful, NO Giger, NO fantasy. Amplifies the titan's biblical scale. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── power-armor-infantry path: subjects (MEAN KILL-TEAM, regen 2026-05-16) ───
  power_armor_subjects: {
    format: 'simple',
    theme: `MEAN KILL-TEAM SQUADS for the power-armor-infantry path — 2-5 figures of brutally aggressive, gritty, lived-in, BADASS space-marine troopers in heavy power armor. Each entry 30-60 words.

⚠️ THE BAR: every entry must read like a key-art still from HELLDIVERS 2 / WARHAMMER 40K Space Marines / ALIENS Colonial Marines / DOOM Eternal / STARSHIP TROOPERS Mobile Infantry / KILLZONE Helghast / MASS EFFECT Krogan strike teams / EDGE OF TOMORROW Jacket-armor. MEAN. AGGRESSIVE. SCARRED. PREDATORY. KILLERS who ENJOY the work.

🚫 STAR WARS / HALO HARD BAN — NEVER write any of these words in any entry: "Stormtrooper / Imperial / chest-eagle / Mandalorian / beskar / T-visor / jetpack-mercenary / Boba / Mando / Clone Trooper / Republic / Empire / Sith / Jedi / Star Wars / Halo / ODST / Spartan / Master Chief / MJOLNIR / UNSC / Marathon / Reach / Bungie". Flux renders these as recognizable IP characters. The aesthetic these IPs represent (heavy power-armor / drop-troopers / mercenary kill-teams) is welcome — but describe it WITHOUT naming the IP. Use generic substitutions:
  • "Mandalorian-mercenary" → "hard-mercenary kill-squad" (no T-visor, no beskar, no jetpack-as-defining-trait)
  • "Imperial Stormtrooper" → no substitute — DROP this archetype entirely; the bone-and-charcoal palette is fine but the chest-eagle / Imperial coding always reads as stormtrooper
  • "Halo ODST" → "drop-predator special-forces" (matte-black drop-armor + amber visor aesthetic is fine without the name)
  • "Spartan / MJOLNIR" → "heavy assault armor" (no Halo-specific naming)

🚫 ABSOLUTE BANS — these are SWAT / Tom-Clancy procedural realism markers that KILL the badass tone:
• NO "tactical formation / breach team / lead trooper / riot shield / overwatch / spotter / hand-signals / professional unit / military procedural / cover formation"
• NO "scanning / surveying / careful approach / observation post / reconnaissance pair"
• NO "olive drab / standard issue / regulation" — these are CUSTOM rigs not regulation gear
• NO clean-newly-issued armor — every armor set is WEATHERED, scuffed, scratched, dented, blood-spattered, dust-caked, mud-caked, oil-stained, smoke-blackened
• NO standing-at-ease — these troopers are ALWAYS in predator posture (mid-firing / mid-charge / kill-stance / dragging-trophy / brace-and-snarl)

✓ MANDATORY DNA — every entry has 3-5 of these elements:
• KILL-STREAK insignia / war-trophy / skull-trophy / enemy-helmet-hung-from-belt / tally-marks-painted-on-pauldron
• HEAVY chassis (40K-Marine-scale 8-foot towering / Helldivers stomp / ODST drop-bulk) NOT thin/lithe
• PREDATOR stance (leaned forward, weapon up, scanning for kills, snarl through visor)
• WEATHERED — scuffed plates, scratched paint exposing under-metal, blood splatter, dust, mud, oil, soot
• MEAN VISUAL DETAIL — skull masks / fanged helm grilles / red glowing visor / spiked pauldrons / aggressive armor silhouette
• HEAVY ORDNANCE — visible heavy-weapon (autocannon / plasma-cannon / smartgun / heavy bolter / grenade-launcher / beam-cannon / rotary-cannon)

✓ KILL-TEAM ARCHETYPE DISTRIBUTION (vary across):
  • **40K SPACE-MARINE TOWERING** (~25%) — 8-foot armored predators, ceramite plating, skull-and-scroll insignia, bolter weaponry, hard contrast paint (Blood Angel red / Ultramarine deep blue / Death Guard rotted-green / Black Templar charcoal-and-bone)
  • **HELLDIVERS HEAVY-DROP** (~20%) — diving-suit aesthetic, white-and-red Super-Earth markings scuffed grey, smoking shotgun / heavy MG, dust-caked plates from atmospheric entry
  • **ALIENS COLONIAL-MARINE GRIZZLED** (~15%) — Vasquez/Hudson/Drake archetype, smartgun rigs, M41A pulse-rifles, sweat-shiny scarred faces visible behind cracked visors, dog-tags, flame-decals, "kill or be killed" energy
  • **MANDALORIAN HARD-MERCENARY** (~10%) — beskar-coded mismatched plates, jetpacks, vibroblades, helmet-T-visor, weathered cloak/cape, trophy-rings, kill-streak tally
  • **DOOM-SLAYER STYLE BRUTE** (~10%) — bulked-out praetor-suit lineage, glowing chest-core, oversized super-shotgun / chain-cannon, the rage-stomp posture
  • **HALO ODST DROP-PREDATOR** (~10%) — matte-black drop-armor, helmet visor amber-glow, scuffed by drop-pod entry, silenced-SMG, lean predator silhouette
  • **KILLZONE HELGHAST INDUSTRIAL** (~10%) — fascist industrial-yellow / charcoal armor, gas-mask helmets with glowing red goggles, mean MG-42-style heavy weapons, sinister silhouette`,
    touchpoints: [
      '5 Blood-Angel Space Marines in cracked crimson ceramite power-armor, skull-and-bone insignia tally-counted across pauldrons, lead marine cradling heavy bolter spent shell-casings smoking at his feet, second marine dragging a vanquished enemy by the throat, third advancing weapon-leveled forward with snarl-visible through grilled helm, ceramite scratched bone-deep through paint to gunmetal underneath',
      '4 Helldivers in scuffed white-and-red Super-Earth heavy drop armor, dust still coming off plates from atmospheric entry, lead trooper kicking down a steel door with shotgun raised, second mid-stride sprinting through breach with assault rifle leveled, third backlit through smoke unloading rotary MG sideways, fourth following with flame-thrower flaring, kill-streak tally painted across helmet visors',
      '3 Aliens Colonial Marines in weathered olive-and-charcoal hardsuit armor, smartgun harness on lead Marine slung at hip mid-strafe firing into shadow, two flanking with M41A pulse-rifles leveled, sweat-shiny scarred face visible behind cracked visor of lead operator, flame-decals scorched across pauldrons, dog-tags hanging outside collar, blood streaked across forearm-plates from prior kill',
      '4 Mandalorian-style mercenaries in mismatched beskar plates (one charcoal, one rust-orange, one cobalt, one charcoal-green), all helmet-T-visored, lead trooper mid-jetpack-ignite weapon up firing, second blade-arm extended toward target, third grenade-cocked overhead mid-pitch, fourth dragging an enemy combatant by the ankle, war-trophy skull rings clinking on belts',
      '5 Doom-Slayer-style praetor-suit brutes in heavy obsidian armor with glowing emerald chest-cores and shoulder-vents, lead brute mid-execution swinging chain-blade overhead toward off-frame enemy, two flanking with oversized super-shotguns mid-blast smoke-pluming, two rear unloading rotary-cannons sideways, blood-spatter across visors and chest-plates',
      '4 Halo-ODST drop-predators in matte-charcoal drop-armor with amber-glow helmet visors, lead operator mid-crouch unloading silenced SMG into close-range enemy with snarl behind visor, two flanking weapons-raised through smoke from drop-pod still venting plasma behind them, fourth dragging captive backward by collar through ash, atmospheric-entry burn-marks streaking armor',
      '3 Killzone-Helghast industrial-yellow heavy infantry in charcoal-and-rust ledge-armor with gas-mask helmets glowing red-goggle eyes, lead trooper mid-fire MG-42 belt-fed weapon spitting brass across pavement, second wielding flame-thrower mid-flare against off-frame enemy, third reloading mag with snarl-behind-mask, war-banner pole strapped to back catching wind',
      '5 mercenary kill-team in mismatched scavenged power-armor pieces (one Stryker-class plate, one alien-tech shoulder, one improvised-welded chestplate, one stolen Imperial chest-eagle), lead mercenary in predator-stalk forward with auto-pistol leveled, second with energy-cleaver mid-swing, third firing heavy lascannon braced on hip, kill-tally marks scratched across all plates',
      '4 Warhammer Death-Guard-style rotted-green power-armor brutes in pitted plagued ceramite, lead brute hefting flamer-cannon mid-purification-burn, two flanking with corroded bolters raised, fourth dragging chain-wrapped captive forward, swollen-skull insignia carved into pauldrons, dripping-corruption aesthetic, smoke and rot in the air around them',
      '3 Edge-of-Tomorrow Jacket-armor exo-troopers in heavy-machined plate frames, lead trooper mid-blast gatling-cannon mounted on shoulder belching brass, second with massive blade-arm raised over fallen enemy, third with grenade-launcher mid-fire arc visible, jackets battered to bare metal underneath, scratched kill-streak tallies climbing arm-plates',
      '4 Imperial Stormtrooper-style heavy assault in scuffed bone-and-charcoal armor (the Halo Marathon / Iron Halo aesthetic), lead trooper mid-stride forward firing bolter from hip, second with energy-shield raised deflecting incoming fire (shield itself sparking), third in mid-execute over kneeling captive, fourth rear-covering with rotary-cannon, all carrying trophy-skulls at belt',
      '5 Veteran Krogan-style heavy strike team in massive forge-plate armor, lead krogan-warrior mid-roar weapon overhead in war-cry pose, two flanking firing heavy shotguns mid-blast, two rear-covering with grenade-launchers, all bearing kill-streak ladders carved into chest-plates, mean predator silhouette, scarred and battle-hardened',
      '3 Mass-Effect Cerberus phantom assault in charcoal-and-orange power-armor, lead phantom mid-blade-strike sword-extended toward off-frame target, second mid-cloak phasing in with pistol raised, third providing heavy-weapon support with rotary-cannon braced, kill-tally stenciled across pauldrons, mean professional-killer energy',
      '4 Helldivers second-wave heavy assault in soot-blackened white-armor (smoke-stained from prior engagement), lead trooper mid-charge with bayonet-fixed assault rifle raised, second mid-fire with heavy MG belt-feeding from backpack, third with grenade-cocked overhead, fourth rear-covering with rotary-cannon, blood and dirt streaked across armor',
      '5 Warhammer Black-Templar marines in matte-black-and-bone armor with cross-and-skull insignia, lead chaplain-style figure mid-righteous-execute with crozius raised overhead toward kneeling captive, three flanking with bolters raised firing into off-frame target, fifth rear-guard with heavy weapon raised, oath-papers nailed to pauldrons',
      '3 Aliens-style smartgun heavy hunter team in weathered grey-and-orange hardsuit, lead operator hip-firing smartgun in wide arc with brass-spraying, second mid-execute over downed enemy with pistol leveled at head, third covering 90-degree arc with pulse-rifle, sweat-and-blood-streaked faces visible behind cracked visors',
      '4 mercenary execution squad in scavenged predator-aesthetic plates (skull-mask helmets, spike-pauldrons, trophy-belts), lead executioner with chain-blade mid-swing overhead, two flanking with energy-cleaver and plasma-pistol mid-strike, fourth dragging trophy-head by hair, kill-streak counts painted bone-white across all plates',
      '5 Doom-Marine-style praetor heavies in red-and-charcoal armor with glowing-amber chest-core, lead marine mid-charge with super-shotgun leveled, two flanking with chain-cannons mid-blast, two rear unloading plasma-cannons sideways, blood-spatter across visors, hellfire-rage posture, smoke trailing behind from kills',
      '4 ODST drop-killers in matte-charcoal drop-armor still venting atmospheric-entry plasma, lead operator mid-stride sprinting forward silenced-SMG raised, second crouched mid-firing pistol-and-MG combo, third with thermite-charge mid-pitch toward off-frame target, fourth rear-covering with sniper-rifle, kill-tally marks on visors',
      '3 Warhammer Space-Wolves heavy assault in steel-blue-and-bone armor with wolf-pelts draped over pauldrons, lead Long-Fang mid-roar with chainsword raised overhead, two flanking with bolt-pistols and chainaxes mid-strike, all bearing wolf-skull insignia and rune-etched plates, savage predator energy',
    ],
    instructions: `Each entry is ONE 2-5 figure MEAN KILL-TEAM squad, 30-60 words. Format: "[N] [archetype-coded] squad in [armor with weathered/mean DNA], lead trooper mid-[AGGRESSIVE-VERB], second [AGGRESSIVE-POSTURE], third [AGGRESSIVE-INTERACTION-WITH-TARGET-OR-ENEMY], [optional 4th/5th], with [kill-streak / war-trophy / blood-spatter / battle-damage detail]". Vary across the 7 archetype distributions. STRICT BAN on procedural/SWAT language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── power-armor-infantry path: actions (AGGRESSIVE verbs, regen 2026-05-16) ───
  power_armor_actions: {
    format: 'simple',
    theme: `AGGRESSIVE COMBAT ACTIONS for the power-armor-infantry path — what the MEAN KILL-TEAM squad is DOING in mid-action. Each entry 35-65 words.

⚠️ THE BAR: every action describes the squad MID-VIOLENCE — charging, kicking, executing, dragging, leaping, mid-strike, hunting. Helldivers cinematic / 40K marketing key-art / Doom Eternal cutscene / Edge of Tomorrow training-yard energy. The squad is HUNTING and KILLING.

🚫 ABSOLUTE BANS — these are procedural-realism kill-words that KILL the badass tone:
• NO "stacked at entry / breach formation / point-man priming / second covering / third watching rear"
• NO "bounding overwatch / fire team suppressing / maneuver element"
• NO "ridge deployment / squad prone / spotter calling ranges / scanning / surveying"
• NO "casualty extraction / wounded by harness / suppressive wall"
• NO "ICOM relay / mission patches / professional procedural"
• NO "careful / measured / cautious / hand-signals / professional"

✓ AGGRESSIVE VERB CATEGORIES (distribute across):
  A. **MID-FIRE BARRAGE** (~25%) — lead trooper mid-blast with heavy weapon, two flanking unloading, third reloading mid-snarl, brass-spraying, smoke trailing
  B. **CHARGE-AND-EXECUTE** (~15%) — squad mid-charge across no-man's-land, lead trooper bayonet-extended, second mid-execute over kneeling enemy
  C. **DOOR-KICK BREACH** (~10%) — lead trooper mid-kick to door / hatch / wall, squad behind weapons raised mid-firing into the just-opened space
  D. **DROP-POD DEPLOY** (~10%) — squad mid-emerge from steaming drop-pods, lead trooper mid-burst out of door, weapons up, atmospheric burn fresh
  E. **PURSUIT MID-RUN** (~10%) — squad mid-sprint chasing fleeing enemy, lead trooper mid-shot at runner, second leaping over rubble, third mid-grenade-throw
  F. **HUNT-AND-COVER** (~10%) — squad stalking through war-torn ground, lead trooper in predator-stalk forward weapon up, second flanking through smoke, third with kill already at belt
  G. **HOLD-AND-MURDER** (~10%) — squad holding position against incoming, lead trooper mid-mag-dump, second behind cover unloading rotary, third throwing grenade overhead
  H. **TROPHY-TAKE** (~5%) — squad mid-action with one trooper grabbing trophy from kill (helmet / weapon / banner / head), others covering, kill freshly bleeding
  I. **VEHICLE-DISMOUNT ASSAULT** (~5%) — squad mid-emerge from mid-flight dropship / APC / tank, lead trooper mid-leap to ground, weapons up firing

Each entry MUST:
• Open with the squad mid-action (NOT static positioning)
• Use predator-coded verbs: charging / kicking / executing / dragging / leaping / mid-shot / mid-strike / mid-burst / hunting / stalking / mid-roar
• Reference 2-3 squad members each doing something AGGRESSIVE (NOT one doing it while others "observe")
• Reference the kill / target / enemy / debris explicitly (this is COMBAT not patrol)`,
    touchpoints: [
      'Mid-fire barrage at entry-point, lead trooper unloading heavy bolter spent shell-casings smoking at his feet, second mid-pump-action shotgun blast at off-frame target, third reloading mag with snarl behind grilled visor, brass spent casings carpeting around their boots, smoke trailing from all three weapons, kill-shot already taken',
      'Squad mid-charge across blasted concrete plaza, lead trooper bayonet-fixed assault rifle leveled mid-stride sprinting forward, second mid-execute pistol pressed to kneeling enemy temple with trigger-pull moment caught, third mid-bound over fallen body with chain-blade raised overhead, dust kicking up from boots',
      'Lead trooper mid-kick to reinforced steel hatch with boot driving it open, squad behind weapons raised mid-firing into the just-opened space, second trooper unloading rotary cannon sideways through doorway, third with grenade mid-pitch overhead toward inside, fourth covering rear with bolter raised',
      'Squad mid-emerge from steaming drop-pods just touched down on enemy ground, lead trooper mid-burst out of pod-door weapon-leveled firing first volley, second behind half-out-of-pod with heavy MG already firing, third leaping over pod-edge to ground with chain-cannon spooled up, drop-pod plasma still venting',
      'Mid-pursuit sprint chasing fleeing enemy across rubble field, lead trooper mid-shot pistol leveled at fleeing target with muzzle-flare frozen, second mid-leap over collapsed beam with assault rifle raised, third mid-grenade-throw arc visible reaching toward distant cover where target is heading, smoke trailing',
      'Squad in predator-stalk through ruined city street, lead trooper forward in low-crouch stride with weapon up scanning for kills, second flanking through dissipating smoke with shotgun ready, third dragging severed enemy helmet by chin-strap as trophy at hip, fourth rear-covering with rotary, mean energy palpable',
      'Squad holding fixed position against incoming wave, lead trooper mid-mag-dump heavy bolter belt-fed weapon spitting brass, second behind concrete barricade unloading rotary-cannon in sweeping arc, third standing fully exposed mid-grenade-throw overhead, fourth reloading with snarl-behind-visor, kill-pile already at perimeter',
      'Squad mid-action with one trooper grabbing fresh trophy from kill, lead trooper crouching to wrench enemy helmet from severed neck, second covering with weapon raised toward off-frame threat, third holstering chain-blade still dripping, fourth rear-covering with shotgun, kill bleeding freshly on the ground beneath',
      'Squad mid-emerge from dropship hovering above LZ, lead trooper mid-leap to ground from open ramp weapons up firing into the LZ, second mid-rope-descend with MG hanging from harness, third still in dropship door mid-blast laying covering fire, dropship engines roaring overhead kicking dust',
      'Lead trooper mid-execute over kneeling enemy, gauntleted hand grabbing enemy by collar pulling them up, other hand pistol pressed under jaw trigger-moment caught, second trooper at his back mid-fire at off-frame target, third standing watch with weapon up scanning, fourth rear-covering, blood pooling beneath',
      'Squad mid-charge into enemy trench line, lead trooper mid-vault over earthen lip with chain-blade raised overhead, second mid-fire bolter at trench-defenders below, third mid-grenade-drop into the trench, fourth following close behind with shotgun raised, dust and debris exploding upward from grenade-bloom',
      'Squad mid-assault on enemy bunker, lead trooper mid-blast plasma-cannon at bunker door from braced stance, second mid-throw thermite-charge arc visible toward bunker wall, third firing heavy MG in suppressing burst at firing-slit, fourth rear-covering with rotary, bunker scorch-marked from prior hits',
      'Squad mid-clearing of urban rubble pocket, lead trooper mid-stride forward firing assault rifle in three-round burst at off-frame target visible only as silhouette, second mid-pivot to flank with shotgun raised, third mid-execute over crawling enemy with pistol-shot, fourth rear-covering, kill-trail behind',
      'Squad mid-mounted assault dismounting from APC ramp, lead trooper mid-leap to ground weapons up firing immediately on landing, second mid-emerge from ramp with rotary-cannon already firing in arc, third behind firing pistol-and-MG combo, fourth still on ramp with heavy weapon raised covering, APC engines roaring',
      'Squad mid-engagement with enemy strike team, lead trooper mid-firing assault rifle in three-round burst at incoming target, second mid-grenade-throw arc visible overhead, third mid-fire heavy MG in suppressing burst from braced stance, fourth mid-charge forward with chain-blade raised overhead, multiple enemy down already',
      'Squad mid-pursuit of fleeing enemy through ruined city block, lead trooper mid-sprint with rifle raised firing at fleeing target ahead, second mid-leap over rubble-pile with shotgun raised, third mid-blast rotary-cannon at sniper-position high above, fourth mid-throw grenade up toward enemy position, dust kicking up',
      'Squad mid-execute on enemy command-tent, lead trooper just-finished cutting through tent-flap with chain-blade still raised dripping, second mid-fire shotgun blast into the tent interior, third pressing into tent with assault rifle raised firing, fourth rear-covering tent entrance with rotary, enemy bodies already strewn',
      "Squad mid-charge across no-man's-land toward enemy position, lead trooper mid-stride sprinting forward with rifle raised firing at running target, second mid-leap over fallen body chain-blade extended overhead, third mid-grenade-throw arc visible toward enemy hardpoint, fourth firing heavy MG in suppressing burst from hip",
      'Squad mid-assault on alien-tech installation, lead trooper mid-blast plasma-cannon at installation door, second mid-fire heavy MG at defenders pouring out of installation, third mid-execute over a fallen alien defender pistol leveled at head, fourth covering with rotary-cannon, alien-tech sparking and bleeding',
      'Squad mid-hunt through war-torn forest, lead trooper in predator-stalk weapon up scanning treetops for snipers, second mid-execute over an enemy scout caught crawling away, third mid-fire shotgun blast at off-frame moving target, fourth rear-covering with rotary, dawn-cold light, breath fogging behind visors',
    ],
    instructions: `Each entry is ONE specific AGGRESSIVE squad combat action, 35-65 words. Format: "[opening verb-phrase], lead trooper mid-[VERB], second mid-[VERB], third mid-[VERB], [optional 4th/5th member], [kill / smoke / blood / debris / scale-prover]". Use ONLY predator/combat verbs (charging/kicking/executing/dragging/leaping/mid-fire/mid-strike/mid-blast/hunting/stalking/mid-roar). STRICT BAN on procedural/SWAT/Tom-Clancy verbs (stacked/overwatch/scanning/observing/hand-signals). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── droid-assassin path: SOLO killer-droid predatory actions (2026-05-17) ───
  killer_droid_actions: {
    format: 'simple',
    theme: `SOLO PREDATORY ACTIONS for the droid-assassin (killer-droid) path — ONE genderless robotic assassin caught MID-ACTION in a predatory beat. Each entry 30-55 words.

⚠️ THE BAR: every action puts the SOLE killer-droid in mid-violence or mid-stalk. John Wick assassin / Terminator hunter / Ghost in the Shell black-ops / Edge Runners cyberpunk-killer / Mass Effect SPECTRE / Halo Spartan-ONI energy. The droid is HUNTING, FIRING, CLIMBING, STRIKING, LURKING, AMBUSHING — never standing still posing.

🚫 ABSOLUTE BANS — these kill the assassin tone:
• NO "She / her / woman / female / feminine" — this is a genderless killer-DROID, not a cyborg-woman
• NO "stands, poses, leans, watches, examines, contemplates, gazes, looks pensive, holds artifact"
• NO "strides through neon street, scans for threats, calibrates circuits, jacks into terminal"
• NO procedural/SWAT verbs (stacked, overwatch, scanning, hand-signals, hold position)
• NO romantic/seductive framing — this is a killing machine, not a femme fatale

✓ ACTION CATEGORIES — distribute across:
  A. **MID-FIRE BARRAGE** (~20%) — droid mid-fire long-rifle / sniper / heavy cannon / dual-pistols, muzzle-flash blooming, brass spraying, target off-frame, kill-shot caught mid-trigger
  B. **WALL-CLIMB / VERTICAL-INFILTRATE** (~15%) — droid mid-scale of sheer wall / cliff / tower / ship-hull / industrial pipe-stack, articulated hands clamped to surface, gear strapped to back, target somewhere above
  C. **MELEE-STRIKE / CHAIN-BLADE** (~15%) — droid mid-strike with wrist-blade extended / chain-blade overhead / combat-knife mid-thrust, enemy mid-impact, blood mist, mechanical grip on throat or limb
  D. **LURKING-STALK** (~15%) — droid in low-crouch predator-stalk through smoke / shadow / rain / corridor, weapon-low, optic-glow cutting darkness, kill not yet visible but coming
  E. **AMBUSH-EMERGE** (~10%) — droid mid-emerge from cover (rubble / vent / drop-pod / shadow / above), weapon already firing as it appears, target reacting too slowly
  F. **EXECUTE-STANCE** (~10%) — droid standing over a fresh kill or kneeling target, weapon pressed to head, trigger-moment caught, kill-tally being etched into pauldron
  G. **PERCH-AND-AIM** (~10%) — droid sniper-perched on rooftop / steel beam / cliff-ledge / cathedral-spire, long-arm braced, scope-eye glowing, distant target framed in scope-line
  H. **CHASE-PURSUIT** (~5%) — droid mid-leap rooftop-to-rooftop / mid-sprint after fleeing target / mid-vault over debris, coat-flares-and-cables streaming, kinetic urgency frozen

Each entry MUST:
• Open with the droid mid-action (NOT static positioning)
• Use ONLY genderless nouns: "the killer-droid" / "the assassin-droid" / "the kill-unit" / "the combat-unit" / "the droid" / "the murder-unit" / "the hunter-droid"
• Use predator-coded verbs: firing / climbing / striking / lurking / stalking / ambushing / executing / hunting / leaping / mid-blast / mid-thrust / mid-scale / mid-crouch
• Reference the WEAPON explicitly (rifle / pistol / blade / cannon / sniper / wrist-blade / chain-blade)
• Reference the TARGET or KILL explicitly (target off-frame / fresh body at feet / kill-tally / scope-line on distant figure / enemy mid-fall)
• Reference ONE specific environmental detail (smoke / rain / muzzle-flash / shattered glass / blood-mist / spent brass / dust / debris)`,
    touchpoints: [
      'Mid-fire barrage from open rooftop edge, the killer-droid in braced kneeling stance unloading heavy long-rifle, muzzle-flash strobing white across its mirror-faceplate, spent brass arcing past its shoulder, scope-eye locked on a target collapsing three blocks distant, smoke trailing from the barrel-vents',
      'Mid-scale of a rain-slicked cathedral wall, the assassin-droid clamped to weathered stone by all four articulated limbs, combat-rifle strapped diagonal across its back, scope-eye glinting upward through the storm, target somewhere on the parapet above, lightning-flash freezing its silhouette against carved gargoyles',
      "Mid-strike with wrist-blade fully extended, the kill-unit driving its bladed forearm clean through a guard's armored chest from behind, the guard mid-jerk-and-spasm, droid's other hand clamped over the guard's mouth, blood-mist hanging in the corridor's emergency-red strobe",
      'Lurking advance through dissipating tear-gas in a wrecked subway corridor, the hunter-droid in low predator-stalk weapon-low, optic-cluster glowing cold cyan through the haze, gun-flash from a panicked guard ahead lighting its chassis edge for one frame, the kill already inevitable',
      "Ambush mid-emerge from beneath a crashed transport, the murder-unit erupting up through a torn hull-plate firing dual-pistols in overlapping arcs, two security guards mid-fall with chest-wounds blooming, the droid's shoulder-armor still flecked with crash-debris and oil",
      "Execute-stance over a kneeling corporate exec, the killer-droid pressing a silenced pistol to the back of the man's skull, the trigger-moment caught at the instant the firing-pin drops, the exec's mouth open in mid-protest, the droid's other hand etching a fresh kill-mark into its left pauldron",
      'Sniper-perch atop a 200-floor tower edge, the assassin-droid prone behind a long-barreled rail-rifle, scope-eye glowing red-hot through the optical sight, the city sprawled below in neon haze, distant target framed in the crosshair on a balcony 1.4km out, breath-vents motionless',
      'Mid-leap rooftop-to-rooftop pursuit, the kill-unit caught full-extension across a 12-meter gap with combat-rifle still firing in mid-air at a fleeing courier ahead, cyberpunk skyline below scrolling in motion-blur, holo-billboards bleeding magenta across its underside',
      'Mid-fire dual-pistol sweep across an open warehouse floor, the killer-droid spinning mid-crouch with both pistols extended outward firing at four converging guards, brass cascading in twin arcs, three guards mid-fall already, fluorescent overheads strobing through gun-smoke',
      'Wall-climbing infiltration of a brutalist concrete bunker exterior, the assassin-droid scaling sheer rebar-exposed wall via embedded climbing-spikes in its palms and soles, sniper-rifle slung across its back, surveillance-cam below sweeping past obliviously, night-vision-amber glowing its optics',
      "Mid-thrust combat-knife strike, the kill-unit driving a serrated combat-blade up under a sentry's jaw from a crouched flanking position, sentry mid-collapse with eyes wide, droid's other hand catching the dropping rifle before it can clatter, silenced kill in a marble corridor",
      'Predator-stalk through knee-deep flooded sewer, the hunter-droid wading silent with rifle held above waterline, optic-cluster sweeping the tunnel curve ahead, distant target-voices echoing off the concrete, single drop falling from a rusted overhead pipe lit by its eye-glow',
      'Ambush from above as the kill-unit drops from a ceiling vent onto a meeting-table, executive figures mid-recoil-and-rise, the droid landing in a hunter-crouch already firing pistols outward in two directions, glass-conference-walls shattering behind from cross-shots, papers exploding into the air',
      "Execute-pose over a fresh kill in a snowed-in alpine cabin, the killer-droid standing motionless beside a slumped diplomat in an armchair, silenced pistol still raised, blood pooling onto the rug, the droid's thermal vents melting snow in a halo on the floorboards",
      'Sniper-perch wedged in the rafters of a derelict cathedral, the assassin-droid braced between two oak beams with anti-material rifle along one arm, scope-eye glowing cold green through the optical sight, the high altar 80 meters distant framed in crosshair, dust falling through stained-glass shafts',
      'Mid-sprint pursuit through a neon-flooded night market, the kill-unit shoving past vendors with combat-rifle leveled forward firing in bursts at a fleeing target ahead, market-stalls exploding into sparks behind it, holo-signs in three languages reflecting in its mirror-faceplate, target stumbling under fire',
      'Mid-blast plasma-cannon firing from waist-level brace, the murder-unit unloading a sustained beam into an armored door, door-metal glowing white and warping inward, shielded heat-haze distorting the air, kill-tally marks fresh-scored down the cannon-housing',
      'Lurking outside a bathhouse window in pouring monsoon rain, the hunter-droid pressed flat against the lacquered exterior wall, suppressed pistol drawn at thigh, scope-eye watching through a translucent paper screen at a target shadowed within, water sluicing down its chassis seams',
      "Mid-emerge from underwater drop, the assassin-droid breaching the surface of a moonlit canal in a hunter-crouch already raising silenced pistol at a dockside target, water cascading off its chassis-plates, scope-eye locking on the target's back, kill-shot one second away",
      "Mid-strike chain-blade overhead, the kill-unit bringing a vibro-saw down in a two-handed arc on a heavily armored opponent's clavicle, sparks exploding outward, opponent mid-stagger backward, droid's posture set for the follow-through, the duel framed against a burning warehouse interior",
    ],
    instructions: `Each entry is ONE specific SOLO killer-droid predatory action, 30-55 words. Format: "[opening verb-phrase action], the [droid-noun] mid-[VERB] with [weapon], [target/kill detail], [one environmental detail]". Use ONLY genderless droid-nouns (killer-droid / assassin-droid / kill-unit / combat-unit / hunter-droid / murder-unit / the droid) — NEVER she/her/woman/female. Use predator/combat verbs (firing/climbing/striking/lurking/stalking/ambushing/executing/hunting/mid-blast/mid-thrust). STRICT BAN on contemplative verbs (stands/poses/leans/watches/examines/contemplates). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── droid-assassin (predator-droid spread) path: sci-fi action SCENES (2026-05-17) ───
  // 2026-05-17 expansion: original 25 entries were ninja-only. New entries cover combat-assault /
  // cyber-cop / military-soldier / hunter-droid scenes for the 5-archetype spread.
  ninja_bot_scenes: {
    format: 'simple',
    theme: `SCI-FI ACTION SCENES for the predator-droid spread path (ninja / combat-assault / cyber-cop / military-soldier / hunter-droid) — cinematic SCI-FI scenes where the droid is OPERATING IN context. The droid is the focal subject in EACH scene, but the scene itself is RICH with sci-fi context — secondary actors / threats / sci-fi tech / cinematic action moment. NOT empty architectural backdrop. 40-70 words per scene.

⚠️ THE BAR: every scene reads like a still from Blade Runner 2049 / Ghost in the Shell / Cyberpunk Edgerunners / Akira / The Matrix / Dredd / Altered Carbon / Black Mirror. Cinematic. Atmospheric. RICH WITH SCI-FI ELEMENTS. The ninja-bot is doing-something-in-the-scene, not posing in front of a backdrop.

🚫 ABSOLUTE BANS:
• NO empty architectural backdrop ("ancient stone hall", "industrial corridor" alone — must have scene context layered in)
• NO portrait-grade settings (NO peaceful zen-garden, NO pristine museum-interior)
• NO actual samurai-Japan historical settings (this is CYBERPUNK ninja-bot — neon/holo/sci-fi context required)
• NO "ninja-bot standing in [setting]" framings — describe the SCENE the ninja-bot is operating in

✓ ARCHETYPE-MATCHED SCENE CATEGORIES (distribute 20% per archetype across all 5):

  NINJA SCENES (~20%):
  A. **CYBERPUNK ROOFTOP PURSUIT** — neon-rain Tokyo / Hong-Kong / Night-City rooftop chase, holo-billboards bleeding, distant fleeing target, search-drones strobing the sky
  B. **NEON ALLEY DUEL** — narrow cyberpunk alley with overhead hover-traffic, paper-lantern light, another cyber-ninja silhouetted in opposing distance OR fresh-cut enemy collapsing
  C. **DATA-VAULT INFILTRATION** — server-farm corridor with bio-luminescent data-streams, red alarm-strobes, hovering security-drone debris smoking, holographic alert-warnings

  COMBAT-ASSAULT SCENES (~20%):
  D. **BUNKER BREACH** — heavy combat-droid mid-breach through smoking bunker doorway, debris exploding outward, secondary kill-droids visible in distance, plasma-burn marks across blast-walls
  E. **DROP-POD LZ ASSAULT** — combat-droid mid-emerge from steaming drop-pod just touched down on enemy ground, plasma still venting, dust kicked up by re-entry burn, smoking ruin in foreground
  F. **TITAN-MECH BATTLEFIELD** — combat-droid in foreground with massive titan-mech wreckage smoking 80 meters distant, severed plasma-conduit raining sparks, war-torn city skyline burning

  CYBER-COP SCENES (~20%):
  G. **CYBERPUNK PRECINCT STANDOFF** — cyber-cop droid with combat-shotgun raised at the lens, rain-slick precinct street, hover-spinner descending behind with searchlight on, holographic CITIZEN COMPLY warning projecting overhead
  H. **CORPORATE TOWER RAID** — cyber-cop droid breaching a corporate skytower lobby, glowing badge insignia on pauldron, two suited civilians taking cover behind a holo-reception desk, red riot-strobe lighting
  I. **NEON-STREET ARREST** — cyber-cop droid standing over a kneeling cyberpunk suspect at the lens, stun-baton raised, two backup-spinner cops visible touching down behind, blade-runner street palette

  MILITARY-SOLDIER SCENES (~20%):
  J. **ALIEN-COLONY OUTPOST PATROL** — military-soldier droid mid-patrol across alien-colony perimeter at night, distant arc-lightning between alien rock formations, smoking research-station ruin in middle distance, atmospheric haze
  K. **ORBITAL-DROP BATTLEFIELD** — military-soldier droid mid-emerge from drop-pod onto war-torn alien battlefield, three friendly drop-pods steaming nearby, distant titan-class enemy approaching across no-man's land, smoke-pillars
  L. **WAR-TORN CITY HOLD** — military-soldier droid in defensive position behind concrete barricade in a war-torn city street, smoke rolling, distant fellow squad-droid silhouettes in defensive positions, debris and shell-craters

  HUNTER-DROID SCENES (~20%):
  M. **FROZEN TUNDRA STALK** — hunter-droid perched in low-crouch on a frozen tundra ridge overlooking distant prey-target, breath-vents misting, aurora overhead, snow-buried hovercraft wreckage in distance
  N. **FOG-SHROUDED FOREST HUNT** — hunter-droid mid-stalk through dense alien-forest fog, bio-luminescent moss-patches glowing, scope-eye glinting through the haze, distant prey-creature silhouette barely visible
  O. **POST-APOC WASTELAND TRACK** — hunter-droid mid-vault over scorched-earth crater debris in a post-apoc wasteland, rusted hover-wreckage in foreground, distant dust-storm rolling toward the horizon

━━━ MANDATORY ENTRY FORMAT — ARCHETYPE-LOCKED PREFIX + UNIQUE SCENE-NAME TITLE ━━━

EVERY entry MUST begin with one of these EXACT prefix tags + a UNIQUE SCENE-NAME in caps + an em-dash, then the full scene description:

  "REGISTER: NINJA / NEON-ALLEY DUEL — the cyber-ninja mid-strike with..."
  "REGISTER: COMBAT-ASSAULT / BUNKER BREACH — the combat-droid mid-lunge through..."
  "REGISTER: CYBER-COP / PRECINCT STANDOFF — the cyber-cop droid mid-raise of..."
  "REGISTER: MILITARY-SOLDIER / COLONY PATROL — the military-soldier droid mid-patrol..."
  "REGISTER: HUNTER-DROID / TUNDRA STALK — the hunter-droid perched in low-crouch..."

CRITICAL — the SCENE-NAME after the slash must be UNIQUE per entry. NO two entries can share the same scene-name (the dedup uses pre-em-dash text as title). Vary scene-names creatively per archetype.

Distribute EXACTLY 10 entries per register across a batch of 50.

The prefix HARD-LOCKS the chassis archetype downstream — Sonnet reads "REGISTER: <ARCHETYPE>" and renders the droid as that archetype, NOT cyber-ninja default.

━━━ HARD MANDATE — SECONDARY ACTOR / KINETIC THREAT IN FRAME (every entry) ━━━

Every entry MUST place a SECONDARY VISIBLE ACTOR or KINETIC THREAT explicitly in the frame alongside the droid. The droid is NEVER alone in the composition — Flux defaults to "cool droid in atmospheric backdrop" when no other actor is named, producing static hero-shots. To force kinetic story renders, EVERY scene names a specific other-entity in a specific position:

  • A specific FLEEING TARGET ("a data-courier mid-leap two rooftops ahead" / "a corporate exec mid-stumble around the corner")
  • A specific CRUMPLING ENEMY ("two security-guards mid-fall with chest-wounds blooming" / "a sentry collapsing at the foreground edge")
  • A specific ENGAGING ENEMY ("a chrome-masked kill-unit silhouetted ten meters distant in opposing stance" / "three combat-marines mid-return-fire from doorway")
  • A specific DISABLED THREAT ("a smoking security-drone toppling at the foreground edge" / "a smashed mech-leg crashing past the lens")
  • A specific FRIENDLY ACTOR ("two squad-mates flanking through atmospheric haze" / "a hover-spinner descending behind with searchlight on")
  • A specific CIVILIAN ("two suited civilians diving for cover behind the holo-desk" / "a kneeling cyberpunk suspect at the lens with hands up")
  • A specific KINETIC THREAT IN MOTION ("muzzle-flash from off-frame enemy cutting across the scene" / "a hover-spinner mid-descent with landing-gear extending")

The secondary actor must be: SPECIFIC (named role + count + position), VISIBLE IN FRAME (not "off-frame"), KINETIC (mid-something — falling / fleeing / firing / collapsing / descending / engaging).

Each entry MUST:
• Open with the EXACT register prefix tag + UNIQUE SCENE-NAME
• Then describe the SCENE / setting in 5-15 words
• Reference the DROID by its archetype noun matching the register (the cyber-ninja / the combat-droid / the cyber-cop droid / the military-soldier droid / the hunter-droid)
• Place the droid IN the scene with a clear KINETIC VERB (mid-leap / mid-strike / mid-fire / mid-vault / mid-charge / mid-breach / mid-arrest / mid-strike-impact / mid-trigger-pull / mid-emerge)
• **NAME the SECONDARY ACTOR + ITS POSITION + ITS KINETIC STATE** (per the mandate above) — this is the single most important element of every entry
• Include AT LEAST 2 sci-fi context elements (holograms / drones / mechs / neon-billboards / plasma / mag-rails / data-streams / hover-spinners / aurora / smoke / war-debris)
• Include AT LEAST 1 kinetic environmental element in the air (rain-streaks / sparks / smoke-tendrils / muzzle-flash / motion-blur / spinning holo-projection / falling debris / dust-cloud)
• Use atmospheric cinematic language`,
    touchpoints: [
      'REGISTER: NINJA / NEON-TOKYO ROOFTOP PURSUIT — the cyber-ninja mid-sprint across rain-slick wet glass under cascading holo-billboard light, distant fleeing data-courier leaping the next rooftop two blocks away, three search-drones strobing white-blue across the cyberpunk sky, hover-traffic streaming through the canyons 80 floors below',
      'REGISTER: NINJA / KOWLOON ALLEY DUEL — the cyber-ninja mid-strike with katana drawn against another chrome-masked kill-unit silhouetted ten meters distant in opposing stance, overhead hover-traffic streaming red-and-white through the alley canyon, red paper-lantern light bleeding across the rain-slicked pavement, holographic ramen-shop signs',
      'REGISTER: NINJA / DATA-VAULT INFILTRATION — the cyber-ninja mid-crouch behind a bio-luminescent fiber-optic column with electric-cyan data-streams flowing through the glass casing, red alarm-strobes pulsing in three-second intervals across the hexagonal-grid floor, hovering security-drone smoking on its side, holographic ALERT warnings rotating',
      'REGISTER: COMBAT-ASSAULT / BUNKER BREACH — the combat-droid mid-lunge through an exploding fortified blast-door with debris fragmenting outward, plasma-burn scoring across the reinforced wall, two enemy kill-droids visible in distance returning fire, dust-cloud rolling outward from the breach point, smoke billowing',
      'REGISTER: COMBAT-ASSAULT / DROP-POD LZ — the combat-droid mid-emerge from a steaming hissing drop-pod with plasma-rifle leveled at off-frame threat, re-entry burn still venting orange from the hull, three sibling drop-pods touched-down in mid-distance, smoke pillars rising from cratered enemy continent landing zone',
      'REGISTER: COMBAT-ASSAULT / TITAN-MECH BATTLEFIELD — the combat-droid mid-fire heavy belt-fed cannon with muzzle-flash cutting through the haze, a massive titan-mech carcass smoking eighty meters distant, severed plasma-conduit raining sparks overhead, war-torn city outskirts at dusk with distant enemy formation advancing',
      'REGISTER: CYBER-COP / NEON-PRECINCT STANDOFF — the cyber-cop droid mid-raise of its combat-shotgun directly at the lens, rain-slick cyberpunk street, descending hover-spinner searchlight cutting through the rain behind, holographic CITIZEN COMPLY warning projecting in rotating panel overhead, glowing precinct-badge burning blue on left pauldron',
      'REGISTER: CYBER-COP / CORPORATE LOBBY RAID — the cyber-cop droid mid-stride through a shattered glass entrance with badge insignia burning gold on pauldron, red riot-strobe lighting pulsing across marble, two suited civilians taking cover behind holo-reception desk, stun-baton held low-ready in right hand',
      'REGISTER: CYBER-COP / MIDNIGHT-STREET ARREST — the cyber-cop droid standing over a kneeling cyberpunk suspect at the lens with sidearm trained, two backup hover-spinner cops touching down behind in landing-mode with red-and-blue strobes, holographic arrest-warrant projecting at eye-level, Blade Runner palette',
      'REGISTER: MILITARY-SOLDIER / ALIEN-COLONY PATROL — the military-soldier droid mid-patrol with combat-rifle held tactical-low, distant arc-lightning crackling between alien rock formations, smoking research-station ruin in middle distance, two squad-mates visible flanking through atmospheric haze, unit-callsign markings glowing',
      "REGISTER: MILITARY-SOLDIER / ORBITAL-DROP DAWN — the military-soldier droid mid-emerge from drop-pod ramp weapons-up onto war-torn alien battlefield, three friendly drop-pods steaming nearby with sibling soldiers disembarking, distant titan-class enemy approaching across no-man's-land, smoke-pillars rising at dawn",
      'REGISTER: MILITARY-SOLDIER / CITY-HOLD DEFENSE — the military-soldier droid in braced firing position behind concrete barricade with assault-rifle laying suppressing burst at off-frame enemy, smoke rolling through war-torn ruin, distant fellow squad-droid silhouettes in defensive positions, shell-craters and debris',
      'REGISTER: HUNTER-DROID / TUNDRA-RIDGE PERCH — the hunter-droid perched in low-crouch on a frozen tundra ridge overlooking distant prey-target with anti-material rifle braced on rock, breath-vents misting white in the cold, aurora rippling green-violet overhead, snow-buried hovercraft wreckage in middle distance',
      'REGISTER: HUNTER-DROID / FOG-FOREST STALK — the hunter-droid mid-stalk through dense bioluminescent mist with vibroblade drawn low, bioluminescent moss-patches glowing electric-blue across exposed roots, distant prey-creature silhouette barely visible through the haze, scope-eye glinting cold through the fog',
      'REGISTER: HUNTER-DROID / WASTELAND TRACK — the hunter-droid mid-vault over a scorched-earth crater rim with sniper-rifle slung across back, rusted hover-wreckage in foreground with skeletal struts protruding, distant dust-storm wall rolling toward the horizon, the prey-trail fresh in the ash',
    ],
    instructions: `Each entry is ONE specific sci-fi action scene, 50-85 words. EVERY entry MUST start with the format: "REGISTER: <ARCHETYPE> / <UNIQUE-SCENE-NAME-CAPS> — <full scene description>". The five archetypes: NINJA / COMBAT-ASSAULT / CYBER-COP / MILITARY-SOLDIER / HUNTER-DROID. DISTRIBUTE EXACTLY proportional entries per archetype across the batch. SCENE-NAMES must be UNIQUE per entry (dedup uses pre-em-dash text).

⚠️ MANDATORY in EVERY entry: a SPECIFIC NAMED SECONDARY ACTOR visible in frame (fleeing target / crumpling enemy / engaging opponent / disabled threat / friendly squad-mate / civilian / kinetic threat in motion). Without this, Flux renders a static hero-shot.

The "REGISTER:" tag HARD-LOCKS the chassis archetype. Reference the droid by archetype noun matching the register. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── cyborg-man path: badass male framings (2026-05-17) ───
  cyborg_man_composition: {
    format: 'simple',
    theme: `BADASS MALE CYBORG framings for the cyborg-man path — mixed full-body action + tight badass closeup angles for a RUGGED HANDSOME CAPABLE MYSTERIOUS male cyborg. 25-50 words per entry.

⚠️ THE BAR: every framing reads as BADASS — capable / dangerous / mysterious / weathered / lethal. Cold steel + scarred skin + chrome jaw + intense focus. NOT sexy, NOT thirst-trap, NOT shirtless-romance-novel-cover. The vibe is Solid Snake / Adam Jensen / Cole Phelps (cyborg variant) / Geralt-of-Rivia-as-cyborg / Marcus Fenix / Cyberpunk 2077 male V / Eddy Hewlett.

🚫 ABSOLUTE BANS — these kill the badass tone:
• NO "her" / "she" / "feminine" / "delicate" — pure male language
• NO "delicate lips parted" / "wistful gaze" / "ethereal" / "graceful"
• NO shirtless-ripped-abs poses, NO thirst-trap glamour shot
• NO "beautiful" — use "striking" / "weathered" / "imposing" / "menacing"
• NO smiling, NO seductive expression, NO modeling pose

✓ FRAMING CATEGORIES — distribute 50/50 closeup vs full-body action:

  CLOSEUP BADASS FRAMINGS (50%):
  • SCARRED-JAW CLOSEUP — closeup of chrome-jaw transition, stubble + battle-scar on the organic half, intense focused expression
  • MECHANICAL BROW + WEATHERED EYE — closeup of cybernetic brow ridge above an organic intense eye, dust / blood / oil-streak across the cheekbone
  • TEMPLE-PORT PROFILE — side profile showing temple sensor-array + organic ear + scarred cheek transitioning into chrome cranial plate
  • CHROME-SKULL PROFILE — bald chrome cranial dome with neural-port array exposed, side profile angle, organic neck visible
  • OVER-SHOULDER COMBAT PROFILE — over-shoulder behind him as he scans an off-frame threat, chrome neck-plate visible, jaw set hard
  • THROAT-TO-JAW SEAM — closeup of organic throat transitioning into chrome jaw-hinge, segmented neck-plate visible, stubble-and-chrome contrast
  • BRUISED-AND-CHROMED FACE — three-quarter face closeup, fresh bruise / bloodstain on the organic side, chrome panel-line bisecting the face vertically
  • EYE-SOCKET CHROME APERTURE — extreme closeup of a mechanical iris-aperture eye with weathered organic crow's-feet at the corner, lashes-and-chrome contrast

  FULL-BODY BADASS ACTION (50%):
  • LOW-ANGLE WIDE-STANCE — camera at hip level looking up at him standing wide-stance with weapon ready, full-body silhouette
  • SIDE-PROFILE MID-STRIDE — camera 90-degrees as he strides past with combat-rifle at his side, motion-blur on backdrop
  • OVER-SHOULDER MID-FIRE — camera behind his right pauldron looking down weapon-sight at off-frame target
  • THREE-QUARTER WEAPON-DRAWN — three-quarter back-angle as he draws a sidearm mid-pivot, coat-flares streaming behind
  • FROM-COVER REVEAL — camera at cover-edge as he leans out firing, half-body in frame
  • MID-VAULT KINETIC — full-body caught mid-vault over debris with weapon raised, motion-blur background
  • PERCH-DOWN PREDATOR — high-angle from his perch looking down at target zone, his silhouette dominant in foreground edge
  • RAIN-SLICK STAND — low-angle wide-stance in rain-slick street, coat heavy with rain, neon backdrop bleeding behind him

Each entry MUST:
• Use only male / masculine language (he / his / man / male cyborg / male figure / etc.)
• Describe the framing + ONE specific badass detail (weathered skin / scarred / blood / dust / stubble / coat / weapon-stance)
• 25-50 words
• NEVER use "she" / "her" / "feminine" / "delicate" / "beautiful"`,
    touchpoints: [
      'SCARRED-JAW CLOSEUP — tight three-quarter face shot, chrome jaw-plate seamlessly bonded to weathered organic skin, day-old stubble across the unmechanized side, fresh battle-scar curving across the chrome-flesh boundary, his intense focused eyes locked off-frame on something approaching',
      'TEMPLE-PORT PROFILE — strict side profile, his organic ear flush against a chrome temple-port array bristling with three neural-jack receptacles, weathered skin across the cheek transitioning cleanly into engraved chrome cranial plate, set jaw',
      'LOW-ANGLE WIDE-STANCE — camera at ankle level looking up as he stands wide-stance on rain-slick concrete, combat-rifle held diagonal across his chest, coat heavy and dripping, full silhouette against an exploding neon sign behind',
      'OVER-SHOULDER MID-FIRE — camera tight behind his right pauldron looking down the barrel of a suppressed carbine at a distant fleeing target, his chrome-knuckled hand wrapped firm around the grip, brass ejecting past the lens',
      'MID-VAULT KINETIC — full-body caught mid-vault over a smashed cyberpunk barricade with pistol drawn at full-extension, coat-flare and cables streaming behind, urban skyline scrolling in motion-blur, kinetic urgency frozen',
      'CHROME-SKULL PROFILE — strict side profile of his bald polished chrome cranium with subtle ornate engraving along the parietal plate, organic neck visible below the chrome-flesh seam, stubbled jaw, weathered organic eye, gaunt focused expression',
      'BRUISED-AND-CHROMED FACE — three-quarter face shot, fresh bruise blooming purple across his organic cheekbone, chrome panel-line bisecting the face from temple to jawline, dried blood at the temple, set jaw, cold focused eyes',
      'FROM-COVER REVEAL — camera at the alley cover-edge as he leans out firing a heavy sidearm in two-handed grip, half-body in frame with the other half hidden behind shattered drywall, muzzle-flash strobing his weathered face',
      "EYE-SOCKET CHROME APERTURE — extreme closeup of his mechanical iris-aperture eye, weathered crow's-feet at the corner, organic lashes contrasting with chrome shutter-petals, dust on the surrounding skin, focused intensity",
      'THREE-QUARTER WEAPON-DRAWN — three-quarter back-angle as he draws a sidearm from a thigh-rig mid-pivot, his coat-flares streaming behind, chrome jaw set hard, weathered organic eye visible over the pauldron, kinetic motion frozen',
      'PERCH-DOWN PREDATOR — high-angle from his crane-perch looking down at a target plaza forty floors below, his silhouette crouched dominant in the foreground right edge, anti-material rifle braced steady, scope-eye glinting cold',
      'SIDE-PROFILE MID-STRIDE — camera 90-degrees as he strides past at full speed with combat-rifle held at his side, his weathered coat heavy with motion, chrome jaw visible in profile, motion-blur on the cyberpunk corridor behind',
      'THROAT-TO-JAW SEAM — extreme closeup of the chrome neck-plate transitioning into his organic jaw-hinge, segmented chrome cervical vertebrae exposed, dark stubble across the organic chin, faint fiber-optic glow threading from a clavicle port',
      'MECHANICAL BROW + WEATHERED EYE — closeup of his cybernetic brow ridge above an organic intense weathered eye, fresh oil-streak across his cheekbone, chrome forehead-plate engraved with faint unit-callsign markings, focused predator gaze',
      'RAIN-SLICK STAND — low-angle wide-stance shot in a rain-slicked cyberpunk alley, his heavy coat soaked through, dual sidearms holstered at his hips, chrome arm visible beneath the rolled sleeve, neon sign bleeding magenta across his weathered face',
    ],
    instructions: `Each entry is ONE specific BADASS MALE cyborg framing, 25-50 words. Format: "FRAMING-NAME CAPS — camera position + framing + ONE badass detail (weathered / scarred / blood / dust / stubble / coat / weapon-stance)". Use ONLY male / masculine pronouns (he / his / man / male figure). DISTRIBUTE 50% closeup framings + 50% full-body action framings per batch. STRICT BAN on feminine / delicate / beautiful / wistful / thirst-trap language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── droid-assassin path: action-cinematic composition angles (2026-05-17) ───
  killer_droid_composition: {
    format: 'simple',
    theme: `ACTION-CINEMATIC CAMERA ANGLES for the droid-assassin (killer-droid) path. Each entry specifies a camera position + framing that makes the SOLO killer-droid's PREDATORY ACTION viscerally legible. 25-50 words.

⚠️ MANDATORY — every entry must convey AGGRESSION / DYNAMIC ACTION through the angle. Static chest-up portraits FAIL. The frame must SHOW the droid in motion / firing / scaling / striking / lurking. Full-body or three-quarter — NEVER face-filling closeup.

🚫 ABSOLUTE BANS:
• NO closeup chest-up portraits ("face filling frame", "extreme closeup of eye", "throat closeup")
• NO "she / her / woman" pronouns — this is a genderless DROID
• NO static "standing observed in low light", "contemplative posture", "pensive turn"
• NO romantic/feminine-coded framing (over-shoulder seductive, three-quarter beauty turn)

✓ ANGLE CATEGORIES (vary across):
  A. **LOW-FORWARD MID-CHARGE** — camera at ground level looking up as droid runs / leaps / strides straight at camera, full-body filling frame, weapon-raised
  B. **OVER-SHOULDER MID-FIRE** — camera behind droid looking down its weapon-sight at off-frame target, muzzle-flash blooming forward, hand-and-pauldron in frame
  C. **HELMET-CAM / SCOPE-EYE POV** — POV through cracked HUD-faceplate, reticle visible center, weapon-barrel in lower frame, target framed in crosshair
  D. **WORM'S-EYE FROM DOWNED-TARGET** — camera at ground from POV of fallen kill looking up at droid standing over them with weapon pointed down
  E. **SIDE-PROFILE MID-LEAP** — camera 90-degree as droid sprints/leaps left-to-right across frame, motion-blur on background, full-body silhouette
  F. **HIGH-ANGLE PERCH-DOWN** — high-angle from droid's sniper-perch looking down at target zone below, droid silhouette dominant in foreground edge
  G. **THROUGH-SMOKE EMERGE** — camera midground as droid emerges through wall of smoke / steam / rain firing weapons, silhouette resolving
  H. **DUTCH-ANGLE FIREFIGHT** — frame tilted to convey chaos, droid mid-firefight, debris falling, muzzle-flashes lighting silhouette
  I. **WALL-CLIMB UPWARD-LOOK** — camera below looking up sheer surface as droid scales toward sky, gear strapped to back, target somewhere above
  J. **MID-STRIKE INTIMATE COMBAT** — wide enough to show full body of droid AND target mid-impact, blade-strike/throat-grip caught at impact instant
  K. **THROUGH-WINDOW EXTERIOR LURK** — camera inside a lit room looking out a window at the droid pressed silent against exterior wall, weapon drawn
  L. **FROM-COVER REVEAL** — camera at the cover-edge as droid leans/emerges firing, half body in frame, other half hidden behind wall/crate/rubble`,
    touchpoints: [
      'LOW-FORWARD MID-CHARGE — camera at ground level looking up as the killer-droid sprints straight at lens, full-body filling frame, combat-rifle raised muzzle-flash strobing, motion-blur dragging the corridor behind, the kill imminent',
      "OVER-SHOULDER MID-FIRE — camera tight behind the assassin-droid's right pauldron looking down the long-rifle barrel at distant off-frame target, muzzle-flash blooming forward into the dark, brass spraying past the lens",
      'SCOPE-EYE POV — view through cracked HUD-faceplate of the kill-unit, red reticle crosshair locked on a small distant figure on a balcony 1.4km out, weapon-barrel in lower frame, breath-vent audio implied still',
      "WORM'S-EYE FROM DOWNED-TARGET — camera flat on the asphalt from a fallen kill's POV looking straight up at the killer-droid standing over them with silenced pistol still extended at the lens, neon billboards reflecting in its mirror-faceplate",
      'SIDE-PROFILE MID-LEAP — camera 90-degree to the assassin-droid as it leaps left-to-right across a 12-meter rooftop gap, full-body frozen mid-flight, motion-blur on the cyberpunk skyline behind, weapons still firing in mid-air',
      "HIGH-ANGLE PERCH-DOWN — camera from the killer-droid's sniper-perch on a tower edge, droid silhouette dominant in foreground left, the city target-zone sprawled 200 floors below in neon haze, distant target framed in scope-line",
      'THROUGH-SMOKE EMERGE — camera midground level as the murder-unit emerges from a wall of tear-gas smoke firing dual pistols outward, silhouette resolving into chassis-detail, muzzle-flashes lighting its faceplate from below',
      'DUTCH-ANGLE FIREFIGHT — frame tilted 18-degrees right to convey chaos, the kill-unit mid-firefight in a wrecked transit depot, debris falling from severed overhead conduit, muzzle-flashes lighting its torso from three directions',
      'WALL-CLIMB UPWARD-LOOK — camera at the wall base looking straight up as the assassin-droid scales a sheer brutalist concrete face, articulated limbs gripping rebar exposed plate edges, sniper-rifle strapped diagonal across its back against the sky',
      "MID-STRIKE INTIMATE COMBAT — wide frame showing the killer-droid driving its wrist-blade through a sentry's armored chest from a flanking position, sentry mid-jerk-and-spasm, blood-mist hanging in the emergency-red strobe",
      'THROUGH-WINDOW EXTERIOR LURK — camera inside a lit penthouse looking out a rain-streaked window at the hunter-droid pressed silent against the exterior wall ledge, silenced pistol drawn at thigh, scope-eye glowing cold cyan through the glass',
      'FROM-COVER REVEAL — camera at the cover-edge as the kill-unit leans out from behind a crashed transport firing combat-rifle in three-round bursts, half-body in frame, other half hidden behind twisted hull-plating',
      'OVER-SHOULDER STAIRWELL DESCENT — camera tight behind the assassin-droid descending a spiral fire-stair in low-crouch with suppressed weapon weapon-low, scope-eye sweeping the dark below, the kill on the floor beneath',
      'LOW-WIDE PURSUIT — camera ground-level wide-angle as the killer-droid sprints down a neon night-market alley after a fleeing target, market-stalls exploding into sparks behind it, full-body in motion-blur',
      'HIGH-ANGLE TROPHY-STANCE — high-angle looking down at the kill-unit standing over a fresh kill in a snowed-in alpine cabin, silenced pistol still raised, body slumped in armchair, thermal-vents melting a halo in the snow at its feet',
    ],
    instructions: `Each entry is ONE specific action-cinematic camera angle for a SOLO killer-droid, 25-50 words. Format: "ANGLE NAME CAPS — camera position + height + what dominates frame + the droid mid-[VERB] + 1-2 environmental details". Use ONLY genderless droid-nouns (killer-droid / assassin-droid / kill-unit / hunter-droid / murder-unit) — NEVER she/her/woman. The frame must convey AGGRESSION through angle — full-body or three-quarter, NEVER face-filling portrait. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── power-armor-infantry path: composition (squad combat vertigo angles) ───
  power_armor_composition: {
    format: 'simple',
    theme: `SQUAD COMBAT CAMERA ANGLES for the power-armor-infantry path. Each entry specifies a camera position + framing that makes the squad's AGGRESSION viscerally legible. 25-50 words.

⚠️ MANDATORY — every entry must convey AGGRESSION / DYNAMIC ACTION through the angle. Static observational shots FAIL — the angle must show kill-team energy in motion.

✓ ANGLE CATEGORIES (vary across):
  • **LOW-FORWARD MID-CHARGE** — camera at ground level looking up as squad runs straight at camera, lead trooper filling frame, others behind in V-formation
  • **OVER-THE-SHOULDER MID-FIRE** — camera behind lead trooper looking down their weapon-sight at the off-frame target, weapon-flash blooming forward
  • **HELMET-CAM-COMBAT POV** — POV through cracked HUD-helmet glass, reticle visible at frame center, weapon-barrel in lower frame
  • **DOOR-KICK FROM INSIDE** — camera inside breached room looking outward as lead trooper kicks the door inward, others visible behind with weapons up
  • **DROP-POD HATCH-BURST** — camera outside drop-pod as lead trooper bursts through hatch weapon-leveled, plasma-vent steam billowing around them
  • **WORM'S-EYE FROM DOWNED-ENEMY** — camera at ground from POV of fallen enemy looking up at squad standing over them, lead trooper aiming weapon down
  • **SIDE-PROFILE MID-STRIDE** — camera 90-degree to squad as they sprint through frame left-to-right, all members frozen mid-stride, motion-blur on background
  • **ROOFTOP-DOWN COMBAT** — high-angle from rooftop looking down at squad clearing courtyard below, kill-zone visible, brass scattered
  • **THROUGH-SMOKE EMERGE** — camera at midground level as squad emerges through wall of smoke firing weapons, silhouettes resolving into figures
  • **BEHIND-LEAD MID-BREACH** — camera behind lead trooper as they enter a room weapon-up firing, second/third visible flanking through doorway
  • **DUTCH-ANGLE FIREFIGHT** — frame tilted to convey chaos, squad mid-firefight, debris falling, muzzle-flashes lighting figures
  • **HERO-SHOT LOW-3/4 BACKLIT** — squad backlit by explosion behind them, low 3/4 angle showing weapons raised, smoke and embers in foreground
  • **LEAD-TROOPER-FILL-FRAME** — extreme close on lead trooper's snarling visor-and-weapon, squad members behind in soft focus
  • **VEHICLE-DISMOUNT FROM ABOVE** — overhead 3/4 shot of squad mid-leap from dropship ramp to ground, ramp visible at top of frame
  • **EXECUTE-OVER-KNEEL** — squad standing over kneeling captured enemy, lead trooper with weapon down at enemy head, others covering perimeter
  • **MID-CHARGE-WIDE-DRONE** — high-altitude drone-shot of squad mid-charge across open ground toward enemy position, kill-zone visible
  • **THROUGH-DEBRIS-BURST** — camera at squad-level as they burst through curtain of falling debris (collapsing wall / explosion-dust), weapons-up emerging
  • **EXTREME-CLOSE PAULDRON** — extreme close on a weathered armored pauldron with kill-streak tally marks, squad action soft-focused in background
  • **MID-EXECUTE FOREGROUND** — execute-moment in tight foreground (weapon to enemy head, trigger-pull caught), other squad members visible mid-distance covering perimeter
  • **NIGHT-MUZZLE-FLASH-STROBE** — squad in dark mid-night combat lit only by their own muzzle-flashes, brief silhouettes resolving against blackness

Each entry must specify:
• Camera position + height + angle (specific, not vague)
• What dominates the frame (which trooper / weapon / kill-shot / explosion)
• Where the OTHER squad members are visible (formation / depth)
• Specific aggressive action being captured`,
    touchpoints: [
      'LOW-FORWARD MID-CHARGE — camera at ground level looking straight up the assault-line as the squad runs at the lens, lead trooper boots filling the lower half of frame mid-stride, two flanking troopers visible in mid-distance weapons raised firing past camera',
      'OVER-THE-SHOULDER MID-FIRE — camera behind the lead trooper looking down the barrel of their bolter mid-blast, muzzle-flash blooming in the foreground frame-center, off-frame target hit visible in distant smoke, squad members partially visible left/right flanking',
      'HELMET-CAM COMBAT POV — point-of-view through the cracked HUD-helmet glass of the lead trooper, amber reticle visible at frame center, weapon-barrel in lower foreground frame, second trooper visible at frame-right mid-charge, blood-spatter on visor edge',
      "DOOR-KICK FROM INSIDE — camera inside the breached room looking outward toward the door as the lead trooper's boot kicks it inward, door splintering mid-frame, two squad members visible behind in the corridor weapons raised firing past lead into the room",
      'DROP-POD HATCH-BURST — camera positioned outside the drop-pod as the lead trooper bursts through the hatch weapon-leveled mid-blast, plasma-vent steam billowing around the pod-rim, second trooper visible behind in pod still firing through hatch',
      "WORM'S-EYE FROM DOWNED-ENEMY — camera at ground level looking up as if from the POV of a fallen enemy, lead trooper standing over the lens with weapon angled down toward camera ready to finish, two squad members visible at frame-edges covering perimeter",
      'SIDE-PROFILE MID-STRIDE — camera positioned 90-degrees to the squad as they sprint through the frame left-to-right, all four troopers frozen mid-stride at different stride phases, motion-blur streaking the background, weapons all leveled forward',
      'ROOFTOP-DOWN COMBAT — high-angle camera from rooftop looking down at the squad clearing the courtyard below, lead trooper visible mid-execute over fallen enemy, brass scattered across the pavement, two other troopers covering perimeter, kill-trail of bodies',
      'THROUGH-SMOKE EMERGE — camera positioned at midground level as the squad emerges through a wall of dissipating smoke firing weapons, lead trooper resolving from silhouette into visible armor mid-blast, second/third still emerging muzzle-flashes lighting through smoke',
      'BEHIND-LEAD MID-BREACH — camera positioned behind the lead trooper as they enter a room weapon-up firing, second and third visible flanking through the doorway behind them, ceiling and walls visible left/right, room-interior lit by muzzle-flashes',
      'DUTCH-ANGLE FIREFIGHT — frame tilted 15-degrees to convey chaos, squad mid-firefight with debris falling from above, lead trooper mid-fire shotgun-blast, second mid-grenade-throw, muzzle-flashes lighting figures from below, urgency reading',
      'HERO-SHOT LOW-3/4 BACKLIT — squad backlit by massive explosion behind them, low 3/4 angle showing all weapons raised mid-aim, smoke and embers visible in foreground, every figure silhouetted edge-lit hot, slow-motion key-art quality',
      "LEAD-TROOPER-FILL-FRAME — extreme close-up on lead trooper's snarling visor (cracked, blood-spattered) and weapon mid-blast, squad members visible in defocused background mid-action, the lead trooper's aggression filling the entire frame",
      'VEHICLE-DISMOUNT FROM ABOVE — overhead 3/4 camera positioned above dropship as the squad mid-leaps from the open ramp to the ground below, ramp visible at top of frame, ground-impact dust kicking up below, weapons raised mid-jump',
      "EXECUTE-OVER-KNEEL — wide shot of squad standing over kneeling captured enemy, lead trooper with weapon down pointed at enemy's head trigger-pull moment, two squad members covering perimeter weapons raised outward, blood-pool already at enemy's feet",
      'MID-CHARGE WIDE-DRONE — high-altitude drone shot showing the squad in mid-charge across open ground toward an enemy position visible at deep distance, kill-zone with brass and bodies behind them, dust-trail kicking up, enemy hardpoint smoking ahead',
      'THROUGH-DEBRIS-BURST — camera at squad-level as they burst through a curtain of falling debris (collapsing wall above them), weapons-up emerging through dust and chunks of concrete, lead trooper mid-stride, dust catching backlight',
      'EXTREME-CLOSE PAULDRON — extreme close-up on the weathered armored pauldron of a squad-member with painted kill-streak tally marks (50+ visible), other squad members in soft-focused background mid-firefight, the pauldron-detail dominating composition',
      "MID-EXECUTE FOREGROUND — execute-moment in tight foreground (lead trooper's weapon pressed to kneeling enemy's head with trigger-pull caught), other squad members visible in mid-distance covering perimeter, blood-pool spreading at feet, kill-confirmed energy",
      "NIGHT-MUZZLE-FLASH-STROBE — squad in deep-night combat lit only by their own muzzle-flashes as they fire, brief silhouettes resolving against blackness, lead trooper's mag-dump throwing white light across the frame, others visible only by their own flashes",
    ],
    instructions: `Each entry is ONE specific squad-combat camera angle, 25-50 words. Format: "ANGLE NAME CAPS — camera position + height + what dominates frame + squad-formation depth + specific aggressive action captured". Every entry conveys AGGRESSION via angle (not static observation). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── power-armor-infantry path: lighting (battlefield combat) ───
  power_armor_lighting: {
    format: 'simple',
    theme: `BATTLEFIELD COMBAT LIGHTING for the power-armor-infantry path. Each entry is ONE specific lighting setup for active squad combat scenes. Each entry 20-40 words.

⚠️ STRICT BAN — NO cosmic / astronomy vocabulary (wrong fit for ground combat). NO daylight-resort flat-sky cheerful. NO peaceful nature lighting. NO industrial-hangar (mecha-pilots territory). NO aerial-flight (mech-skyships territory).

✓ MANDATORY VARIETY — distribute across:
  A. **MUZZLE-FLASH STROBE PRIMARY** (~15%) — squad's own weapons-fire providing strobing primary light, hard shadow contrast pulsing in firing-rhythm, hot-white flash light, ambient deep-dark
  B. **EXPLOSION-BACKLIT SILHOUETTE** (~15%) — distant or mid-range explosion bloom backlighting the squad, every figure edge-lit hot-orange against the fireball, embers in foreground
  C. **PLASMA-BOLT TRACER-WALL** (~10%) — neon-cyan or hot-orange plasma-bolt streaks crisscrossing the frame, tracer-fire walls casting moving color across armor, war-light
  D. **DAWN-COLD GRIM ASSAULT** (~10%) — pre-sunrise cold blue ambient + first warm hint at horizon, mean troopers reading in cool dread-tones, scene-mood somber assault
  E. **DUSK BLOOD-RED HORIZON** (~10%) — sun at horizon bleeding crimson across the battle-sky, squad silhouetted edge-red, kill-energy mood
  F. **NIGHT WITH HELMET-FLOODLAMPS** (~10%) — deep-dark ambient with the squad\'s own helmet-mounted flood-lamps cutting beams through smoke, cones of light catching dust
  G. **SMOKE-PIERCED-BY-SPOTLIGHT** (~10%) — squad moving through dense battle-smoke with single-source spotlight (sun-shaft / searchlight / vehicle-headlights) cutting through, god-rays through smoke
  H. **EMERGENCY-STROBE BATTLEFIELD** (~5%) — emergency red strobes pulsing across a damaged-installation battlefield, urgency reading, intermittent light
  I. **DISTANT-FIRE-GLOW MID-DISTANCE** (~5%) — distant fires from burning buildings providing warm orange uplight on squad, smoke-trails rising, post-apocalypse mood
  J. **WHITE-PHOSPHORUS BURN** (~5%) — chemical-burn white-and-orange light from white-phosphorus or magnesium-flare, scene briefly over-exposed in zones, harsh shadow contrast
  K. **OVERCAST WAR-GREY** (~5%) — overcast battle-sky with diffuse cold-grey light, low contrast, muted tones, somber mid-engagement mood`,
    touchpoints: [
      "MUZZLE-FLASH STROBE PRIMARY — squad's own heavy weapons-fire providing strobing primary illumination, hard shadow contrast pulsing in firing-rhythm, hot-white flash-light briefly illuminating armor-detail and surrounding rubble, ambient mode deep-dark between flashes",
      'EXPLOSION-BACKLIT SILHOUETTE — massive mid-range explosion bloom backlighting the squad from behind, every trooper edge-lit hot-orange against the fireball, embers and smoke visible in the foreground, scene briefly bleached in firelight',
      'PLASMA-BOLT TRACER-WALL — neon-cyan and hot-orange plasma-bolt streaks crisscrossing the frame in arcing lines, tracer-fire walls casting moving colored light across armor plates, war-energy palpable, scene-mode high-contrast',
      'DAWN-COLD GRIM ASSAULT — pre-sunrise cold blue ambient with first warm-orange hint touching only the upper horizon-line, mean troopers reading in cool dread-tones with hard shadows beneath armor-overhangs, mood somber assault',
      'DUSK BLOOD-RED HORIZON — sun at horizon bleeding crimson across the entire battle-sky, squad silhouetted edge-red against the burning sky, hard shadows cast across the battlefield, kill-energy mood, hero-shot atmospheric',
      "NIGHT HELMET-FLOODLAMPS — deep-dark ambient with the squad's own helmet-mounted flood-lamps cutting beams through smoke, cones of light catching airborne dust and brass, target areas illuminated only where lamps point",
      'SMOKE-PIERCED-BY-SPOTLIGHT — squad moving through dense battle-smoke with single-source bright spotlight cutting through (sun-shaft through clouds / vehicle-headlights / search-light), god-rays through smoke catching figures in motion',
      'EMERGENCY-STROBE BATTLEFIELD — emergency red strobes pulsing across a damaged-installation battlefield, urgency reading immediate, intermittent light moments illuminating the squad mid-action then plunging them back into shadow',
      'DISTANT-FIRE-GLOW MID-DISTANCE — distant fires from burning buildings providing warm orange uplight on the squad from one side, smoke-trails rising in the deep distance, post-apocalypse atmospheric mood, low key fill',
      'WHITE-PHOSPHORUS BURN — chemical-burn white-and-orange light from white-phosphorus rounds or magnesium-flare igniting nearby, scene briefly over-exposed in zones close to the burn, harsh shadow contrast across armor',
      'OVERCAST WAR-GREY — overcast battle-sky with diffuse cold-grey light, low contrast, muted tones across armor, somber mid-engagement mood with no sun, blood reading dark red against grey ground',
      'TRACER-FIRE NIGHT-SKY — squad in night combat with multiple colored tracer-rounds streaking across the sky (red enemy / green friendly), traces lighting figures briefly as they pass, dark ambient ground',
      'BURNING-WRECK FOREGROUND — wreckage of recently-destroyed enemy vehicle burning in the foreground providing warm orange uplight on squad behind, fire-haze rising and distorting the air, embers in motion',
      "SEARCHLIGHT-CUT FROM ABOVE — enemy searchlight from a tower-top sweeping across the squad's position, beam cutting through battle-smoke in a defined cone, squad caught in or out of the beam, hard light vs deep shadow",
      'PLASMA-IMPACT FLARE — plasma-bolt impact-flare bursting against nearby cover sending ionized white-blue light across the squad, brief over-exposure on impact-side, scene-mode high-contrast electric',
    ],
    instructions: `Each entry is ONE specific battlefield combat lighting setup, 20-40 words. Format: "LIGHTING MODE CAPS — [source + direction + color + shadow character + battle context]". Distribute across the 11 buckets. STRICT BAN on cosmic / daylight-resort / industrial-hangar / aerial-flight modes. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── power-armor-infantry path: engagement (ALWAYS-ON multi-actor combat scene) ───
  power_armor_engagement: {
    format: 'simple',
    theme: `MULTI-ACTOR BATTLEFIELD ENGAGEMENT BEATS for the power-armor-infantry path — each entry describes a SCENE with the kill-team squad + 2-5 OTHER actors in active interaction (enemy forces / civilian chaos / allied units / hostile environment). NOT a squad standing aggressively. Each entry 50-90 words.

⚠️ MANDATORY — every entry must include MULTIPLE actors with VISIBLE INTERACTION. The squad is engaged with: enemy combatants firing back / fleeing civilians / collapsing structures / allied units flanking in / vehicles exploding / hostile creatures swarming / aerial support arriving. The viewer must read the FULL STORY in 2 seconds — not a posed shot but mid-firefight.

🚫 STAR WARS / HALO HARD BAN: NEVER name Stormtrooper / Imperial / Mandalorian / beskar / T-visor / Boba / Halo / ODST / Spartan / MJOLNIR / UNSC. Describe the aesthetic without the IP name.

🚫 BANNED — NO solo squad / no peaceful patrol / no "scanning for threats" / no "professional movement." If the entry could be summed up as "squad walking through ruins," it FAILS the gate.

✓ ENGAGEMENT TYPES — vary across:
  A. **WAVE-DEFENSE HORDE** (~10%) — squad holding line against incoming enemy wave (charging infantry / running figures / closing horde), multiple enemies dropping mid-charge, brass-rain everywhere
  B. **HOT-LZ ASSAULT** (~10%) — squad mid-emerge from dropship/pods into actively defended landing zone, defenders firing back, AA-tracers crossing sky, multiple drop-points landing simultaneously
  C. **URBAN-CLEARANCE FIREFIGHT** (~10%) — squad mid-block-by-block clearance, snipers from windows above firing down, defenders in alleys mid-return-fire, rubble bursting from impacts
  D. **TRENCH-CHARGE MASSACRE** (~10%) — squad mid-leap into enemy trench-line, defenders mid-rise mid-fire, bayonets and chain-blades in mid-strike against multiple enemies
  E. **BREACH-AND-CLEAR HARDPOINT** (~10%) — squad just breached enemy bunker/hardpoint, defenders inside mid-fall, smoke pouring out, allied units stacked behind ready for next room
  F. **VEHICLE-AMBUSH** (~10%) — squad mid-execution of enemy convoy ambush, tanks/APCs burning, crews mid-bail, secondary explosions chaining
  G. **DROP-POD ASSAULT-MULTIPLE** (~5%) — multiple friendly drop-pods slamming down across the LZ, squad mid-emerge under fire, defenders mid-retreat or mid-counterattack
  H. **CREATURE-SWARM REPEL** (~10%) — squad mid-firing into closing alien creature horde, multiple creatures down mid-charge, others still closing, flame-throwers wide
  I. **PURSUIT-EXECUTION-RUN** (~5%) — squad chasing fleeing enemy through ruins, multiple enemies down already mid-flight (kill-trail behind), lead squad members mid-firing at runners ahead
  J. **DEFENSIVE-OVERWATCH-WITH-VEHICLES** (~5%) — squad mid-fire from elevated position, allied tanks/walkers visible below also engaged, enemy formation incoming, suppressing-fire walls in all directions
  K. **CIVILIAN-EXTRACTION UNDER FIRE** (~5%) — squad covering fleeing civilians while engaging pursuing enemy force, multiple civilians mid-run past squad, lead squad members mid-fire at pursuers behind
  L. **AERIAL-SUPPORT INBOUND** (~5%) — squad mid-firefight as friendly gunship roars overhead opening up on enemy position, multiple weapon-flashes from above and below, ground enemies caught in crossfire
  M. **BUILDING-COLLAPSE COMBAT** (~5%) — squad mid-firefight as a nearby building collapses from artillery, defenders inside mid-fall, dust-cloud blocking part of frame, allied units visible in deep distance

Each entry MUST:
• Name the engagement TYPE in the first 6 words
• Identify the squad + 2-5 OTHER named actors (enemy infantry / vehicle / alien creature / civilian / allied unit / aerial gunship / etc.)
• Describe the INTERACTION (weapons-fire crossing both directions / pursuit / multiple actions simultaneous / kill-chains)
• Include 2-3 scale-prover or texture details (smoke columns, debris-clouds, ground-impact-zones, secondary fires, brass-rain, blood-spatter zones)
• Emphasize COMMOTION + DENSITY — multiple things happening simultaneously across the frame`,
    touchpoints: [
      'WAVE-DEFENSE HORDE — squad holding firing-line behind concrete barricade against charging enemy infantry-wave, 30+ enemy figures visible mid-charge across the open ground beyond, lead trooper mid-mag-dump heavy bolter spitting brass-rain, second mid-grenade-throw arc visible overhead, third mid-fire rotary-cannon in sweeping arc, multiple enemies dropping mid-charge, blood-spatter zones expanding, bodies piling at the barricade-line, smoke rising from prior kills',
      'HOT-LZ ASSAULT — squad mid-emerge from steaming drop-pods into actively defended landing zone, 4-6 enemy defenders mid-return-fire from elevated positions firing rifles down at the squad, AA-tracers crossing the sky above, two more friendly drop-pods slamming down at midground, lead trooper mid-blast shotgun at closest defender, second mid-leap from pod weapons-up, dust kicking up across the LZ',
      "URBAN-CLEARANCE FIREFIGHT — squad mid-block-by-block clearance through ruined urban street, enemy sniper visible in third-floor window above mid-return-fire, two more defenders in alley mid-fall from squad's suppressing barrage, lead trooper mid-fire bolter up at sniper, second mid-leap behind cover, third mid-fire rotary at alley-defenders, rubble bursting from sniper-rounds impacting around them",
      'TRENCH-CHARGE MASSACRE — squad mid-leap into enemy trench-line, 5-7 defenders mid-rise from trench mid-firing back, lead trooper mid-vault over trench-edge chain-blade raised overhead with first defender already mid-fall, second mid-grenade-drop into trench bottom with bloom-bursting, third mid-fire heavy MG at flanking defenders, fourth mid-execute pistol on rising defender, blood-spray and dirt erupting',
      "BREACH-AND-CLEAR HARDPOINT — squad just breached enemy bunker through blown door, 3-4 defenders inside mid-fall from squad's opening blast, smoke pouring out of the breach in volume, two more friendly squads visible flanking the bunker from sides, lead trooper mid-stride through smoke firing assault rifle, second mid-grenade-throw deeper into bunker, third covering entrance with rotary against incoming reinforcements",
      'VEHICLE-AMBUSH EXECUTION — squad mid-execution of enemy armored convoy ambush, 3 enemy tanks visible — one mid-fireball-explosion in foreground, one mid-bail (crew mid-leap from hatches), one mid-rotate-turret toward squad position, lead trooper mid-fire RPG at the turret, second mid-fire heavy MG at bailing crews, third mid-throw thermite at fuel-stores, secondary explosions chaining',
      'DROP-POD ASSAULT MULTIPLE — three friendly drop-pods slamming down simultaneously across the enemy LZ, squad mid-emerge from lead pod under fire, 5-6 enemy defenders mid-retreat as more pods land behind them, lead trooper mid-blast shotgun at closest retreater, second mid-leap from adjacent pod with rotary already firing, third squad visible mid-emerge from deep-distance pod, dust-clouds rising from each landing',
      'CREATURE-SWARM REPEL — squad mid-firing into closing alien creature horde, 8-12 alien creatures visible mid-charge with multiple already down mid-scuttle, lead trooper mid-fire flame-thrower in wide arc engulfing front-line creatures, second mid-fire heavy MG sweeping the flank, third mid-execute pistol on a creature that broke through, fourth mid-grenade-throw at creature-cluster behind, chitin-armor visible on creatures',
      'PURSUIT-EXECUTION RUN — squad chasing fleeing enemy infantry through ruined urban street, 4-5 enemy figures mid-flight ahead through doorways and around corners, 2 enemies already dropped mid-flight with bodies sprawled on cobblestones, lead trooper mid-sprint firing assault rifle at running enemy ahead, second mid-leap over fallen body chain-blade raised, third mid-fire shotgun at flanker breaking sideways',
      "OVERWATCH WITH VEHICLES — squad mid-fire from elevated rooftop position, two allied tanks visible on street below also mid-fire engaging enemy formation in mid-distance, 6-8 enemy infantry visible mid-charge toward tanks with multiple already dropping from squad's overwatch fire, lead trooper mid-fire sniper-rifle from prone, second mid-fire heavy MG belt-fed, third spotting/calling targets",
      'CIVILIAN-EXTRACTION UNDER FIRE — squad covering fleeing civilians while engaging pursuing enemy force, 5-7 civilian figures mid-flight past squad position toward extraction point, 4-5 enemy combatants visible mid-pursuit from behind mid-return-fire, lead trooper mid-fire shotgun at closest pursuer, second mid-fire rotary at pursuers behind, third dragging slow civilian forward, civilian-screaming-faces visible',
      "AERIAL-SUPPORT INBOUND — squad mid-firefight as friendly gunship roars overhead opening up on enemy position with weapon-flashes from above, ground enemies mid-fall from above-fire and squad's ground-fire simultaneously, lead trooper mid-fire bolter up at remaining enemies, second mid-fire heavy MG, brass from gunship raining down past squad, exhaust-trail crossing upper frame",
      'BUILDING-COLLAPSE COMBAT — squad mid-firefight as nearby building collapses from artillery-strike, 3-4 defenders inside mid-fall through collapsing structure, dust-cloud expanding outward blocking part of frame, allied units visible in deep distance also mid-engagement, lead trooper mid-fire heavy bolter, second mid-leap away from falling debris, third mid-execute kneeling captive in foreground',
      'STREET-AMBUSH FROM BOTH SIDES — squad mid-execution of urban ambush from both sides of street, enemy patrol caught mid-stride between, 4-5 enemy infantry mid-fall from crossfire, lead trooper mid-fire from rooftop position above, second mid-fire from alley to opposite side, third mid-execute survivor mid-flee, brass cascading from elevated positions, smoke rising from prior grenades',
      'BOARDING-VEHICLE ASSAULT — squad mid-board of enemy APC at full sprint, lead trooper mid-leap onto APC roof with chain-blade raised to plunge through hatch, second mid-fire shotgun at hatch where crew rising to defend, third mid-fire heavy MG at second APC closing in support, secondary friendly squad visible mid-charge across street, smoke from prior tank-kill rising behind',
      'BUNKER-SIEGE FROM BOTH SIDES — squad mid-siege of enemy bunker complex, 8-10 defenders visible in firing-slits mid-return-fire, multiple weapon-flashes from inside the bunker, allied squad visible flanking bunker from opposite side also mid-fire, lead trooper mid-fire plasma-cannon at bunker door, second mid-throw thermite-charge onto roof, dust columns rising from impacts across bunker',
      'NIGHT-RAID MASSACRE — squad mid-night-raid on enemy encampment, 6-8 enemy figures mid-wake from sleeping-bags mid-flight mid-fight, lead trooper mid-execute pistol on rising enemy, second mid-fire shotgun at fleeing enemy through tent-canvas, third mid-fire silenced-MG sweeping the camp, fires igniting from incendiary across the camp, surprise-attack chaos with enemy in various states of half-armored response',
      'ROOFTOP-OVERWATCH CITY-BATTLE — squad mid-fire from rooftop position over city-battle below, 12+ figures visible in street-level combat below (mix of allied and enemy units), multiple vehicles burning in mid-distance, lead trooper mid-fire sniper-rifle at distant target, second mid-call-targets while firing pistol at closer rooftop-enemy that just appeared, third mid-fire heavy MG sweeping the street, brass cascading off the rooftop edge',
      'FOG-WAR FLANK-AMBUSH — squad mid-flank-ambush of enemy patrol through battlefield smoke, 4-5 enemy patrol figures visible mid-stride caught from side, lead trooper mid-fire shotgun blast at closest enemy at point-blank, second mid-leap from smoke with chain-blade raised, third mid-fire heavy MG into smoke at retreating enemies, smoke and muzzle-flash strobing the scene, allied unit visible in deep distance flanking from opposite side',
      'AERIAL-DROP-AND-FIGHT — squad mid-aerial rappel-drop from gunship hovering above, multiple troopers mid-rope-descend with weapons raised, 3-4 enemy ground-defenders mid-fire up at descending squad, lead trooper just-touched-down mid-fire shotgun at closest defender, second still mid-descent firing pistol down, third covering descent from rope mid-rotary-fire, dust kicking up below from downwash',
    ],
    instructions: `Each entry is ONE multi-actor battlefield engagement beat, 50-90 words. Format: "ENGAGEMENT TYPE CAPS — squad + 2-5 other named actors + their interactions + multiple simultaneous actions + 2-3 scale-prover/texture details". STRICT mandate: MULTIPLE actors interacting with COMMOTION density. STRICT BAN on Star Wars/Halo IP names. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── power-armor-infantry path: allied_tech (ALWAYS-ON friendly combat bots / drones / walkers) ───
  power_armor_allied_tech: {
    format: 'simple',
    theme: `ALLIED COMBAT TECH for the power-armor-infantry path — one friendly robot / drone / walker / war-mech fighting ALONGSIDE the marine squad in active combat. Each entry 35-65 words.

⚠️ THE BAR: this is FULL MAN+MACHINE vs MACHINE combat — Helldivers 2 squad + Guard-Dog rovers / 40K Tactical Squad + Dreadnought walker / Aliens Colonial Marines + APC/Power-Loader / Mass Effect squad + LOKI mech / Starcraft Marines + Goliath walker / Avatar Marines + AMP-suit. The allied tech is a FRIENDLY COMBAT UNIT mid-fire alongside the squad, NOT background flavor.

🚫 STAR WARS / HALO HARD BAN — NEVER write Stormtrooper / Imperial / Mandalorian / beskar / T-visor / Boba / Halo / ODST / Spartan / MJOLNIR / UNSC / R2-D2 / BB-8 / battle droid / Clone Trooper / AT-AT / AT-ST. The aesthetic these IPs represent is fine — but NEVER name them.

🚫 OTHER BANS:
• NO titan-class mech (those are titan-war territory — these are HUMAN-SCALE-TO-2X allies, not biblical-scale)
• NO pilot-in-cockpit framing (mecha-pilots territory)
• NO cyborg-integrated combat (those are cyborg-* territory)
• NO peaceful service-bot / repair-drone / hospitality unit — these are COMBAT-armed
• NO generic floating-sphere drone (read as drone-photography, not combat)

✓ ALLIED COMBAT TECH CATEGORIES — distribute across:
  A. **HOVER COMBAT-DRONES** (~15%) — small armed hover-drones with weapon-mounts, following squad in formation, mid-fire at enemy
  B. **WALKER-BOTS (4-LEGGED)** (~15%) — quadrupedal combat walker (head-height to human, dog-sized or larger), weapon-mount on back, mid-stride with squad
  C. **BIPED COMBAT MECH (1.5-2x HUMAN)** (~15%) — smaller-than-titan biped mech (4-7 meters tall), weapon-arms, walking alongside marines, mid-fire
  D. **SPIDER-WALKER / 6-8 LEGGED** (~10%) — multi-legged combat walker (waist-to-chest height), low slung weapon-platform, mid-action with squad
  E. **TRACKED COMBAT-BOT** (~10%) — tracked weapon-platform (tank-bot, knee-to-chest height), mid-fire alongside, brass cascading
  F. **SERVITOR-MECH (40K-style)** (~10%) — cybernetic walking weapon-platform, half-human-shape with weapon-arms, mid-fire
  G. **ARMORED COMBAT-DOG** (~10%) — armored quadruped attack-bot (dog-sized, weapon-mount on harness), mid-pounce on enemy, alongside squad
  H. **WAR-WALKER DREADNOUGHT** (~5%) — towering 3-4m bipedal walker with heavy weapons, mid-fire over squad's heads, signature wide-stance
  I. **GUN-DRONE TURRET** (~5%) — automated turret-platform deployed on ground, 360-rotating cannon, mid-fire in sweeping arc
  J. **POWER-LOADER COMBAT** (~5%) — exosuit/loader-frame piloted but reading as machine-ally, weapon-arms mid-strike (Aliens Power-Loader lineage)

Each entry MUST:
• Name the tech TYPE in first 6 words
• Specify its SCALE relative to marines (knee-height / chest-height / head-height / 2x-marine / 3x-marine)
• Specify its WEAPON (rotary cannon / plasma-bolter / chain-cannon / missile-pod / heavy MG / beam-cannon / lascannon)
• Describe its MID-ACTION (mid-fire / mid-stride / mid-pounce / mid-strike / mid-sweep / mid-deploy)
• Reference 1-2 visual DETAILS (scorch-marks / kill-streak markings / hydraulic-hiss / weapon-mount glow / dust under treads)`,
    touchpoints: [
      "HOVER COMBAT-DRONE GUARD-DOG — chest-height armored hover-drone floating at lead marine's shoulder, twin rotary-cannon underslung mid-fire spitting brass in sweeping arc at off-frame enemy, glowing-red sensor-eye sweeping perimeter, scorch-marks across hull-plating from prior engagements, kill-streak tally scratched on side",
      'QUADRUPEDAL WALKER-BOT WAIST-HIGH — waist-height four-legged armored walker-bot striding alongside marines mid-pace, dorsal weapon-mount (heavy MG) belt-fed mid-fire at distant target, sand-and-dust kicked up from articulated paws, mission-tag bolted to neck-armor, hydraulic-hiss with each stride',
      'BIPED COMBAT MECH 2X-MARINE — 4-meter biped combat mech walking alongside marine squad with rotary-cannon arm mid-fire, second arm holding chain-blade, scratched matte-charcoal plating with skull-and-bones unit-marking on chest-pectoral, mid-step pivoting toward closer enemy, hydraulic-actuator visible in joints',
      'SPIDER-WALKER 6-LEGGED — chest-height six-legged spider-walker mid-stride alongside marines through rubble, central body housing twin plasma-cannon mid-fire in flanking sweep, multiple sensor-eyes blinking amber, leg-tips kicking up dust with each placement, mid-pivot to engage flank threat',
      'TRACKED COMBAT-BOT THIGH-HIGH — thigh-high tracked weapon-platform rolling alongside marines, top-mounted rotary cannon mid-fire spitting brass cascading into spent-shell pile behind it, scratched bone-white paint with red unit-stripe, mid-turret-rotate toward next target',
      'SERVITOR-MECH CYBERNETIC — half-human-height cybernetic walking weapon-platform with two weapon-arms (one heavy bolter mid-fire, one plasma-pistol raised), exposed mechanical leg-actuators below skirt-armor, glowing-amber eye-sensor, mid-stride alongside marine lead, oath-paper nailed to chest',
      'ARMORED COMBAT-DOG ATTACK — dog-sized quadruped armored attack-bot mid-pounce onto downed enemy, weapon-mounted harness with twin-pistol auto-firing, scratched matte-black plating with kill-streak tally, mid-pounce-leap with all four legs extended, snarl-LED display on face-plate',
      'WAR-WALKER DREADNOUGHT — towering 3.5-meter bipedal war-walker striding behind marine squad, twin heavy-weapon arms (left rotary-cannon mid-fire / right chain-cannon mid-spin-up), wide-stance pose absorbing recoil, scratched bone-and-charcoal plating with unit-skull insignia, smoke trailing from previous shots',
      "GUN-DRONE TURRET DEPLOYED — knee-high automated turret-platform deployed on cracked pavement at marine's feet, 360-rotating dual-cannon mid-fire in sweeping arc, brass spraying outward, glowing-blue targeting-sensor active, scorch-marks across base-plate from incoming fire, marines arrayed in defensive perimeter around it",
      'POWER-LOADER EXOSUIT COMBAT — chest-high power-loader exosuit (piloted, visible operator in cockpit-cradle) mid-strike with weapon-mounted arm-cannon firing at off-frame target, hydraulic-amber lighting in joints, scratched safety-yellow paint over charcoal plating, mid-pivot alongside marine squad',
      'PATROL-WALKER 4-LEG — head-height four-legged patrol-walker striding alongside marines, dorsal twin-pulse-cannons mid-fire in alternating burst, scratched olive-and-charcoal plating with unit number stenciled, leg-tips kicking up dust, glowing-amber LIDAR sensor on raised mast',
      'COMBAT-FLOATER ARMED SHIELD-PLATFORM — chest-height armored hover-platform deploying riot-shield forward while top-mounted heavy MG mid-fires over the shield-edge, glowing-blue repulsor-lights underneath, scorch-marks on shield-face from absorbed rounds, marines stacking behind it for cover',
      'BIPED MECH AVATAR-STYLE — 4-meter exo-frame mech alongside marines (AMP-suit lineage but not named), twin weapon-arms (left chain-gun mid-fire / right grappler), scratched gunmetal plating with safety-orange unit-stripes, mid-pivot tracking enemy, dust kicked up from foot-impact',
      'WALKER-BOT 6-LEGGED CHEST-HIGH — chest-height six-legged combat walker striding alongside marines, dorsal weapon-pod mid-fire with twin missile-launchers blooming exhaust-trails, articulated leg-tips picking through rubble, mission-patch bolted to side-armor, mid-pivot toward fresh target',
      'COMBAT-BOT TRIPEDAL — waist-height three-legged combat-bot striding alongside marines with central weapon-mount (rotary cannon mid-fire), three legs pumping in alternating rhythm, scratched matte-black plating with red kill-streak ladder, mid-stride dust-kick from three feet simultaneously',
      "DREADNOUGHT 40K-STYLE — towering 4-meter walking sarcophagus dreadnought (the kind containing a fallen marine's body, weapon-arms grafted to chassis), twin heavy-bolters mid-fire, ornate sarcophagus-chest with iconography, mid-stride alongside marines, hydraulic-thunder reading",
      'HOVER GUN-PLATFORM SQUAD-LEAD — head-height hover gun-platform leading marine squad through ruined street, underslung quad-cannon mid-fire sweeping the street ahead in walking suppression, glowing-blue repulsor-pads under hull, scratched bone-white-and-red paint, brass cascading onto pavement below',
    ],
    instructions: `Each entry is ONE specific allied combat tech unit (robot / drone / walker / war-mech) fighting alongside the marine squad, 35-65 words. Format: "TECH TYPE CAPS + SCALE — physical description + weapon + mid-action + relationship-to-squad + visual detail". Vary across the 10 categories. STRICT BAN on Star Wars / Halo IP names AND titan-class scale. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── power-armor-infantry path: drama (40%-gated battlefield phenomena) ───
  power_armor_drama: {
    format: 'simple',
    theme: `40%-GATED BATTLEFIELD COMBAT PHENOMENA for the power-armor-infantry path — a combat event that amplifies the squad's aggressive moment. Each entry 25-50 words.

⚠️ STRICT — each phenomenon must amplify GROUND combat spectacle. Helldivers 2 cinematic / 40K marketing key-art / Aliens / Doom Eternal / Starship Troopers / Edge of Tomorrow lineage. NO peaceful nature. NO industrial hangar work. NO aerial-flight phenomena (skyships).

✓ BATTLEFIELD COMBAT PHENOMENA — distribute across:
  • **RPG-IMPACT BLOOM** — fresh RPG/rocket impact bursting against cover near squad, debris-cloud expanding outward
  • **BREACHING-CHARGE DETONATION** — squad-placed breaching charge mid-detonation against wall, door blowing inward in slow-motion
  • **SUPPRESSING-FIRE TRACER-WALLS** — opposing fire-curtains crossing the frame as squad advances under them, tracers in colored arcs
  • **DISTANT-VEHICLE EXPLOSION** — enemy tank or APC just destroyed in mid-distance, secondary explosions chaining, smoke-column rising
  • **DROP-POD ATMOSPHERIC IMPACT** — friendly drop-pod just slammed into the ground nearby, dust-cloud expanding, troopers emerging
  • **MORTAR WALKS GROUND** — sequential mortar-impacts walking across the open ground past the squad's position, dust columns rising
  • **PLASMA-STORM OVERHEAD** — enemy plasma-artillery storm overhead, plasma-bolts streaking across the sky, ground impacts visible at distance
  • **BUILDING-COLLAPSE BEHIND** — a building just collapsed behind the squad from artillery, dust-cloud rolling outward, debris falling
  • **WALL-OF-FIRE FOREGROUND** — wall of flames from a flame-thrower (squad's or enemy's) bursting across foreground, squad backlit edge-orange
  • **AERIAL-STRAFE OVERHEAD** — friendly gunship strafing run pass overhead, weapon-flashes visible from above, brass falling from sky
  • **GROUND-CRACK FROM TITAN-FOOTFALL** — distant titan footfall sending ground-shock through the squad's position, ground-crack splitting outward at distance
  • **GRENADE-BLOOM MIDGROUND** — fresh grenade-bloom bursting at midground between squad and enemy, frag-spread frozen mid-burst
  • **CHEMICAL-CLOUD ROLLING** — chemical-warfare cloud rolling across the battlefield, squad in respirator helms wading through it
  • **CARRIER-AIRSHIP LOOMING** — friendly carrier-airship looming in upper background deploying additional dropships, scale-prover
  • **VEHICLE-WRECK FIREBALL** — fresh tank-wreck fireball burning in midground, secondary munitions cooking off, black smoke column rising
  • **ALIEN-CREATURE SWARM CLOSING** — alien-creature swarm visible closing at distance, scuttling shapes resolving from smoke, squad bracing
  • **AIRBORNE-DEBRIS RAIN** — debris from prior explosion still raining down across the squad's position, chunks of concrete and metal falling
  • **SNIPER-ROUND IMPACT** — incoming sniper-round impact on cover near lead trooper, sparks and dust spraying, near-miss energy
  • **DROP-SHIP DEPLOYMENT OVERHEAD** — friendly drop-ship deploying additional troopers above the squad, rappel-lines extending downward
  • **SMOKE-GRENADE BLOOM** — friendly smoke-grenade bloom filling lower half of frame, squad emerging through, concealment cover`,
    touchpoints: [
      'RPG-IMPACT BLOOM — fresh RPG-rocket impact bursting against a piece of cover near the squad, debris-cloud expanding outward in slow-motion, lead trooper bracing as shrapnel passes, secondary fires igniting nearby',
      'BREACHING-CHARGE DETONATION — squad-placed breaching-charge mid-detonation against a reinforced wall, door blowing inward in slow-motion frame-freeze, debris and dust expanding outward, squad members behind already weapons-up',
      'SUPPRESSING-FIRE TRACER-WALLS — opposing enemy fire-curtains crossing the frame in colored tracer-arcs as the squad advances under them, hot-white and red-orange tracers, squad heads-down mid-advance through the fire-walls',
      'DISTANT-VEHICLE EXPLOSION — enemy tank just destroyed in mid-distance behind the squad, secondary explosions chaining out from the wreck, black smoke-column rising into the sky, ammunition cooking off audibly',
      'DROP-POD ATMOSPHERIC IMPACT — friendly drop-pod just slammed into the ground 50 meters from the squad, dust-cloud expanding outward, troopers visibly emerging from the pod-hatches still venting plasma',
      "MORTAR WALKS GROUND — sequential enemy mortar-impacts walking across the open ground past the squad's position, dust-columns rising in a line, the squad bracing for the next impact in sequence",
      'PLASMA-STORM OVERHEAD — enemy plasma-artillery storm overhead, plasma-bolts streaking across the sky in arcing lines, ground impacts visible at distance throwing dust-columns, squad heads-down advancing through the storm',
      'BUILDING-COLLAPSE BEHIND — a building just collapsed behind the squad from artillery-strike, dust-cloud rolling outward toward camera, chunks of concrete and rebar falling from the collapse-zone, debris in the air',
      "WALL-OF-FIRE FOREGROUND — wall of flames from a flame-thrower (squad's or enemy's) bursting across the foreground, squad backlit edge-orange against the flame-wall, heat-shimmer distorting the air above",
      'AERIAL-STRAFE OVERHEAD — friendly gunship strafing pass overhead, weapon-flashes visible from above the squad, brass falling from sky in motion-blur streaks, exhaust-trails crossing the upper frame',
      "GROUND-CRACK FROM TITAN — distant titan-class mech footfall sending ground-shock through the squad's position, visible ground-crack splitting outward across the pavement, dust escaping from the crack at distance",
      'GRENADE-BLOOM MIDGROUND — fresh grenade-bloom bursting at midground between the squad and an enemy position, frag-spread frozen mid-burst with dust expanding, target-area briefly over-exposed',
      'CHEMICAL-CLOUD ROLLING — chemical-warfare cloud (greenish-yellow / purple-violet) rolling across the battlefield, squad in respirator-helms wading through it weapons-up, distant figures barely visible through the haze',
      'CARRIER-AIRSHIP LOOMING — friendly carrier-airship looming in the upper background of the battle-zone, visible deploying additional dropships from chassis-bays, scale-prover for the operational scope',
      'VEHICLE-WRECK FIREBALL — fresh tank-wreck fireball burning in midground behind the squad, secondary munitions cooking off audibly, black smoke-column rising into the sky, fire-glow uplighting the squad',
      'ALIEN-CREATURE SWARM CLOSING — alien-creature swarm visible closing at distance, scuttling shapes (or biped-runners) resolving from smoke, squad bracing weapons-up against the incoming charge, urgency reading immediate',
      "AIRBORNE-DEBRIS RAIN — debris from a prior explosion still raining down across the squad's position, chunks of concrete and metal-fragments falling in slow-motion, squad members visibly tracking debris with eyes",
      'SNIPER-ROUND IMPACT — incoming sniper-round impact on cover immediately next to the lead trooper, sparks and dust spraying from the impact-point, near-miss energy palpable, lead trooper visibly reacting',
      'DROP-SHIP DEPLOYMENT OVERHEAD — friendly drop-ship deploying additional troopers above the squad, rappel-lines extending downward from the open ramp, troopers visible mid-descent on the lines, dust kicked up below',
      'SMOKE-GRENADE BLOOM — friendly smoke-grenade bloom filling the lower half of frame, squad emerging through the smoke weapons-up, concealment-cover for the advance, gray smoke-tendrils rising',
    ],
    instructions: `Each entry is ONE specific battlefield combat phenomenon, 25-50 words. Format: "PHENOMENON NAME CAPS — primary visual action + secondary detail + squad-reaction-or-scale-prover". STRICT battlefield combat aesthetic — NO peaceful, NO industrial hangar, NO aerial-flight. Amplifies the squad's aggressive moment. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── post-apoc-rust-tech path: subjects (FAR-FUTURE sci-fi BUSH-FIX rigs, regen 2026-05-16) ───
  rust_apoc_subjects: {
    format: 'simple',
    theme: `FAR-FUTURE SCI-FI BUSH-FIX SCAVENGER RIGS for the post-apoc-rust-tech path — a scrap-welded chimera rig + visible crew. Each entry 30-60 words.

⚠️ THE BAR: every entry must read like a key-art still from MAD MAX FURY ROAD (sci-fi-tilted variant) / BORDERLANDS Pandora bandit-tech / TANK GIRL / WARHAMMER 40K ORK-LOOTED VEHICLES / DUNE Sardaukar-thopter / DEATH STRANDING off-Earth / CYBERPUNK 2077 Nomad-clan / HORIZON ZERO DAWN rebel-tech / FALLOUT-RAIDER Highwayman / TWISTED METAL / STAR WARS Jawa Sandcrawler (sci-fi scavenger DNA, NOT recognizable IP). FAR-FUTURE bush-fix scrap-welded — JURY-RIGGED with wire/chains/prayer/spite from salvaged ALIEN-TECH and POST-COLLAPSE FUTURE-METAL.

🚫 HARD BAN — NEVER 21st-century Earth equipment:
• NO recognizable present-day truck / 18-wheeler / big-rig / Peterbilt / Kenworth / Mack / semi-truck / box-truck / pickup-truck / Mustang / Camaro / motorcycle / VW van / camper / RV / bulldozer / cement mixer / construction equipment as the silhouette
• NO Mad Max 1981 Toecutter buggy / Australian outback-roadster aesthetic
• NO "diesel engine" / "gasoline" / "petrol" — sci-fi power: fusion-cell / plasma-drive / thermal-cell / reactor-core / arc-reactor
• NO Earth-recognizable brand-name (Caterpillar / John Deere / etc.)
• NO clean / pristine / military-issue (industrial-machines + power-armor territory)

🚫 IP HARD BAN — NEVER name: Stormtrooper / Imperial / Mandalorian / beskar / T-visor / Boba / Halo / ODST / Spartan / MJOLNIR / UNSC. The Mad Max + sci-fi aesthetic is welcome — but NEVER name the IP.

✓ FAR-FUTURE SCI-FI CUES — bake at least 2-3 of these into every entry:
• FUSION-CELL / PLASMA-DRIVE / THERMAL-CELL / REACTOR-CORE engines
• ALIEN-TECH SALVAGE welded into the build (xenomaterial chunks, glowing alien-conduits, scavenged orbital-debris panels)
• HOVER-SKIRT / REPULSOR-PAD AUGMENTATION (rig hovering 1m off ground OR retro-fit hover-strips along chassis)
• GLOWING ENERGY-CONDUIT VEINS visibly running through the chassis (cyan / amber / magenta / fel-green energy)
• POWER-PACK lashings on the deck (visibly-glowing battery packs / capacitor stacks / fuel-rods)
• RADIATION SYMBOLS / hazard-stencils on the chassis
• PULSE-CANNON / PLASMA-RIFLE / ARC-WEAPON mounts (where modern would have an MG / cannon)
• SCAVENGED-FROM-FALLEN-ORBITAL salvage (cracked drop-pod fragments, twisted antenna-arrays from a downed satellite, alien-spaceship hull-plates)
• GLOWING REACTOR-CORE visible in the gut of the rig

✓ BUSH-FIX SCRAP DNA — also bake in EVERY entry:
• MISMATCHED salvaged body panels (alien-hull plates / drop-pod fragments / road-sign offcuts / locker-doors / oil-drum sheets / refrigerator-door slabs / cargo-container flanks — welded chaotically)
• ANTENNA FOREST rising from the roof (twisted comms-rods, war-banner poles, signal-mirror masts, scrap-totem)
• EXHAUST STACKS belching glowing-plasma or black smoke (multiple chimneys)
• RAM PROW or SPIKE PLATE on the front (welded scrap-iron spikes, hood-ornament skull, cattle-catcher prong)
• ROPE-BOUND POWER-CELLS / fuel-pods lashed to chassis (visible-glowing power packs with frayed ropes)
• WAR-TROPHIES dangling (alien-skulls, captured enemy-tech, severed weapon-parts, chains, banners with hand-painted symbols / radiation-marks)
• SUN-BLEACHED PAINT over rust (faded colors barely visible through oxidation)
• WIRE-MESH CAGES around driver / crew positions
• EXPOSED ENGINE BLOCKS (fusion-cells / plasma-coils / reactor-rods visible through hull gaps)
• DRAGGING CHAINS / SPIKES behind

✓ ARCHETYPE DISTRIBUTION (vary across):
  A. **WHEELED SCAVENGER RIG** (~25%) — 6-12 oversized off-road wheels, scrap-armor body, exposed fusion-cell engine, crew in open hatches. (Mad Max War Rig / Gigahorse / Doof Wagon sci-fi-tilted variant.)
  B. **TRACKED SCRAPPER** (~20%) — wide tracked chassis, armored deck, crew on top platforms. (Death Stranding mule / WH40K Ork-Trukk / Dune harvester.)
  C. **HOVER-SKIFF / REPULSOR-RIG** (~15%) — hovering 1-2m off ground via repulsor-pad augmentation, scrap-armor patched body. (Star Wars Jawa-style scavenger, Dune ornithopter-but-grounded.)
  D. **WALKER-RIG (2-LEG / 4-LEG / 6-LEG)** (~15%) — legged scavenger walker, scrap-armor torso, driver in open cockpit, gunner on top. (BLAME!-aesthetic walker, Death-Stranding-walker.)
  E. **CARAVAN-CONVOY** (~10%) — prime-mover + 2-3 linked haul-pods (NOT semi-truck silhouette — sci-fi prime-mover with hover-pods or tracked-trailers), crew on each.
  F. **MULTI-MODE HYBRID** (~10%) — wheels + treads + hover-pads on a single rig (impossibly cobbled together), crew everywhere.
  G. **TUNNELLER / DRILL-RIG** (~5%) — front-mounted drill-bit, tracked or wheeled, crew in armored cab. (post-collapse mining + raid hybrid.)

CREW LANGUAGE: 1-5 visible crew (driver / gunner / lookout / scavenger / mechanic). War-painted faces, goggles, leather-harnesses, scarves over mouths, mismatched scavenger gear, scarred skin, ragged hair, lashed-on gear. NEVER pristine soldiers / NEVER clean uniforms.`,
    touchpoints: [
      '8-wheeled scavenger war-rig with mismatched alien-hull plate armor over a fusion-cell drive-pod chassis, glowing cyan power-conduits visible through welded gaps, ram-prow bristling with scrap-iron spikes and a captured alien-skull hood-ornament, antenna forest of twisted comms-rods and hand-painted war-banners, four crew in war-paint and goggles bungee-lashed to rooftop pulse-cannon mounts',
      'Tracked scrapper-rig welded from drop-pod fragments and cargo-container flanks, exposed plasma-drive engine glowing amber through hull-gaps, armored cab with wire-mesh viewport, three crew on dorsal platforms manning a scavenged arc-cannon mount, dragging chains spitting sparks off cracked salt-pan, exhaust stacks belching glowing-orange smoke straight up',
      'Hover-skiff jury-rigged from gutted xenomaterial casing and lashed-on repulsor-pads humming cyan, mismatched panels of stop-sign offcuts and refrigerator-door slabs riveted in chaotic layers, driver leaning out the open canopy with a captured pulse-rifle, two gunners rope-tied to rear plasma-cannon mounts, sun-bleached war-paint over rust-orange chassis',
      'Two-legged walker-rig striding on hydraulic-piston legs, scrap-welded torso of locker-doors and orbital-debris hull-fragments, driver in an open-cage cockpit with glowing reactor-core visible behind their seat, two gunners perched on shoulder-platforms manning rotary pulse-cannons, war-banner with radiation-mark snapping from a roof-spire',
      'Caravan-convoy with a fusion-cell prime-mover and three linked hover-pod trailers, commander on the lead roof signaling with a captured holo-mirror, four guards with scavenged arc-weapons at trailer junctions, alien-tech salvage lashed to every available surface with bungee and chain',
      '6-wheeled raider buggy welded from scavenged shuttle hull-plates and a stolen plasma-converter engine, exposed energy-conduit veins glowing magenta through the chassis, driver and two gunners in stitched-hide ponchos and goggles, antenna spines bristling from the roof with skull-trophies hanging on every mast',
      '4-legged walker-scrapper with wide-base feet for soft sand, scrap-welded body from orbital-debris hull fragments, glowing reactor-core in the gut visible through a wire-mesh chest-plate, driver in an exposed open cockpit at the head with goggles fogged and war-paint streaked, single gunner rope-tied to a dorsal pulse-mortar',
      'Tracked tunneller-rig with front-mounted scavenged plasma-drill rotating slow, armored cab welded from drop-pod fragments and license-plate slabs, two crew in dust-masks at the controls behind the drill, captured alien-conduit power-pack lashed to the rear-deck visibly glowing cyan',
      'Hover-skiff with mismatched paint panels and a humming repulsor-array along the underbelly, jet-intakes salvaged from a downed orbital scout welded to the rear, single nomad pilot in a hide-cloak flying low-altitude recon over cracked hardpan, captured pulse-pistol holstered at hip',
      'War-rig with eight oversized off-road wheels and a forest of antenna spines bristling from a scrap-welded cab, fusion-cell engine exposed through gaps in the hull glowing orange, four cultists in radiation-mark-painted ash-wraps chanting from rope-harnessed roof positions, war-banners streaming behind in the wind',
      'Multi-mode hybrid rig with wheels + hover-strips + crawler-treads on a single impossibly-cobbled chassis, plasma-drive exhausts belching black smoke through six stacks, driver in an exposed open hatch with goggles and bandana, two gunners on roof manning a scavenged Gauss-rifle and a chain-whip',
      'Tracked salvage rig with hydraulic-piston shear-jaws on the front, rust-streaked orange hull patched with alien-hull plates, cable-winches coiled on the rear deck, billboard-sized scrap-plate ram-shield, three crew in scavenger gear manning the side-mounted plasma-torches mid-cutting',
      '6-legged walker-rig with insectoid hexapedal stride, scrap-welded body of orbital-debris fragments and welded cargo-container ribs, glowing energy-conduit veins visible running along the spine, driver in a wire-mesh cage cockpit at the front, two gunners on flanks manning scavenged arc-mortars',
      'Wheeled raider chase-buggy with a Frankenstein engine welded together from two fusion-cells and a salvaged thermal-converter, exposed power-pack lashed behind the driver, ram-prong bristling with scrap-iron spikes, two crew (driver and rear-gunner) in war-paint and goggles, antenna spines whipping above',
      'Hover-skiff with salvaged alien-tech panels mismatched to civilian-junk panels, glowing alien-conduit running like veins across the chassis, two-person crew (driver and gunner) in stitched-hide armor and goggles, captured pulse-cannon mounted on a swivel at the rear with bungee-tied gunner',
      'Tracked scavenger walker on quadrupedal hydraulic legs (NOT 2-legged biped), wide-base treaded feet, scrap-welded body, glowing fusion-cell visible in the gut through gaps in the armor, driver and gunner in open cockpits with bandanas and goggles, drag-chains sparking behind',
      'Wheeled war-rig with a captured alien-spaceship-hull-section bolted to the side as armor, glowing magenta xenomaterial seam visible, four-wheel-drive chassis with oversized off-road tires, three crew with mismatched scavenger gear and war-paint, pulse-cannon mounted on a roof-totem with skulls',
      'Caravan-convoy with hovering prime-mover (repulsor-pad augmented) and four tethered haul-pods following on long cables, commander on lead roof with captured holo-mirror, six guards on the haul-pods manning arc-weapons, captured fuel-pods lashed to every available surface',
      'Insectoid 6-legged walker-rig with mantis-style scythe-arms welded from scrap-iron, scrap-armor body, plasma-drive engine exposed at the rear, driver in a wire-mesh cage at the chest, two crew on shoulder-mounted gunner-positions with rope-harnesses',
      '8-wheeled prime-mover hauling a lashed-down captured orbital-drop-pod (still smoking from atmospheric entry) as cargo, exposed fusion-cell engine, four crew (driver, gunner, two guards) in scavenger gear mid-action, ram-prow with welded scrap-iron spikes, antenna spines bristling',
    ],
    instructions: `Each entry is ONE 1-5 crew + FAR-FUTURE SCI-FI BUSH-FIX rig, 30-60 words. Format: "[archetype: wheeled/tracked/hover/walker/caravan/hybrid/tunneller] rig with [sci-fi tech + bush-fix scrap detail], [crew description with action-verb], [war-trophy / antenna / palette detail]". Vary across the 7 archetype distributions. STRICT BAN on 21st-century Earth vehicle silhouettes / IP names. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── post-apoc-rust-tech path: actions (FAR-FUTURE wasteland verbs, regen 2026-05-16) ───
  rust_apoc_actions: {
    format: 'simple',
    theme: `WHAT THE BUSH-FIX RIG + CREW ARE DOING for the post-apoc-rust-tech path. Each entry 35-65 words. The rig is MID-MOTION across the wasteland OR being BUSH-FIXED mid-action by its crew.

⚠️ MANDATORY — every entry conveys MOTION/ACTION + CREW ENGAGEMENT. Mad Max Fury Road convoy chase / Borderlands bandit ambush / Death Stranding mule-stop / Cyberpunk Nomad clan / Warhammer 40K Ork-raid lineage. Sci-fi-tilted ALWAYS.

🚫 HARD BAN — NEVER 21st-century Earth scenes:
• NO "stopped at gas station" / "stopped at refinery" / "racing down highway" / "navigating freeway" / "on the interstate" / "mounting sidewalk"
• NO "diesel straining" / "gasoline pump" — sci-fi power language: fusion-cell straining / plasma-drive belching / reactor-core spooling up
• NO modern road / parking lot / city street / strip mall / shopping district
• NO modern oil refinery / pipeline / aquifer / industrial plant as still-functional
• NO IP-named locations / IP-named factions

🚫 IP HARD BAN — NEVER name Stormtrooper / Imperial / Mandalorian / beskar / Halo / ODST / Spartan / MJOLNIR.

✓ ACTION CATEGORIES (vary across):
  A. **HIGH-SPEED CHASE** (~20%) — rig roaring across cracked hardpan / salt-flat / dust-canyon at full speed, dust-trail behind, pursuit closing
  B. **BUSH-FIX PIT-STOP** (~15%) — rig stopped in a hidden gulch / salvage gulley / abandoned ruin, crew mid-weld / mid-cell-swap / mid-tire-change / mid-engine-repair
  C. **AMBUSH / RAID** (~15%) — rig mid-attack on enemy convoy / settlement / scrap-cache, crew firing weapons, debris flying
  D. **SCAVENGE MOMENT** (~10%) — rig parked at a crash-site / ruin / wreckage, crew dismounted hauling salvage onto the deck
  E. **CONVOY FORMATION** (~10%) — rig running with 2-4 other rigs in convoy formation across wasteland, all kicking dust
  F. **JUMP / LAUNCH** (~10%) — rig caught mid-launch off a dune-crest / ramp / cliff-edge, all wheels off ground
  G. **CRASH-EVASION** (~10%) — rig swerving / mounting an obstacle / dodging incoming fire / sliding sideways
  H. **DEFENSIVE CIRCLE** (~5%) — rig parked in defensive position with crew manning gun-mounts against an off-frame threat
  I. **WATER-FIND / OASIS** (~5%) — rig stopped at a found water-source / fuel-pool / alien-tech crash-site, crew refilling / harvesting

Each entry MUST:
• Open with action verb (roaring / sliding / hammering / pit-stopping / mid-welding / ambushing / scavenging / launching / circling)
• Reference the rig's specific tech (fusion-cell / plasma-drive / hover-pad / walker-stride) — sci-fi cue mandatory
• Describe what 2-3 crew members are doing mid-action (driver / gunner / lookout / scavenger)
• Reference the wasteland environment context (cracked hardpan / salt-flat / dust-canyon / ruined city-skeleton / canyon-pass / sand-dune crest / acid-flat / wasteland-spine)`,
    touchpoints: [
      'Rig roaring at full plasma-drive across cracked salt-flat, driver leaning hard into a wide turn with one hand on the wheel and one on the manual override, two gunners on the rear deck firing pulse-cannons at a pursuit-buggy closing through the dust-cloud behind, antenna spines whipping in the wind',
      'Rig pit-stopped in a hidden dust-gulch behind collapsed rust-spires, three crew mid-bush-fix — one welding a cracked fusion-cell housing with sparks raining, one hand-cranking a plasma-pump to refill the reactor-core, one on lookout-watch atop the cab with a captured pulse-rifle scanning the horizon',
      'Rig mid-ambush on an enemy raider-convoy in a canyon-pass, ram-prong slammed into the lead enemy buggy mid-impact with debris flying, two crew firing arc-weapons from rooftop mounts at the secondary enemy rigs scattering, third crew dropping a captured plasma-grenade off the rear deck',
      'Rig parked at a fresh orbital-drop-pod crash-site smoking in a dust-bowl, four crew dismounted hauling alien-tech salvage onto the rear deck with rope-pulleys and bungee straps, driver still in the cab scanning surroundings with binocs, war-banners snapping in the dry wind',
      'Convoy of four mismatched rigs running in loose wedge formation across cracked desert hardpan, hero rig at centre with fusion-cell engine roaring, all four kicking massive dust-trails braiding behind, crew on each rig coordinating with hand-signals and signal-mirrors across the gaps',
      'Rig caught mid-launch off a dune-crest with all six wheels off the ground in mid-arc, dust trailing behind from take-off, crew braced inside with goggles fogged and hands gripping the roll-cage, the landing-flat of cracked salt-pan visible below glowing in late-sunset amber',
      'Rig swerving hard to evade an incoming pulse-cannon salvo from an off-frame pursuer, driver hauling on the manual override with both hands, the rear-gunner mid-return-fire with their own scavenged arc-weapon, sparks flying from where a glancing shot grazed the side-armor',
      'Rig stopped in defensive circle-formation with three other allied rigs, all crews mid-firing at an unseen off-frame raider-horde closing across the dust-flat, fusion-cell power-cores glowing visibly hot from the sustained engagement, war-banners snapping above',
      'Rig stopped at a found water-pool in a hidden crater oasis, two crew refilling jerrycans by hand-pump while a third stands lookout-watch on the rooftop with pulse-rifle ready, driver still in the cab with the plasma-drive idling at low hum, surrounding wasteland silent',
      'Rig sliding sideways across acid-flat with the rear wheels kicking up corrosive spray, driver leaning into the slide with grin visible behind goggles, two crew bungee-lashed to roof mounts firing scavenged Gauss-rifles back at an off-frame pursuer, exhaust stacks belching plasma-glow',
      'Rig hammering hard up a steep canyon-slope on tracked-treads, fusion-cell engine straining audibly, three crew leaning forward to counterweight the climb, salvage-cargo lashed down on the rear deck visibly straining at its bungee-cord restraints, dust avalanching down behind',
      'Rig pit-stopped in the shadow of a collapsed rust-spire, two crew mid-tire-change replacing a shredded scrap-tire with a salvaged spare while a third crew member welds a cracked spike-plate back onto the ram-prong, driver still in the cab keeping the plasma-drive at low-hum',
      'Rig mid-raid on an enemy settlement in a canyon-bowl, ram-prong crashing through the wooden palisade with debris flying, two crew leaping from the deck with pulse-rifles raised, driver still gunning the fusion-cell to keep momentum through the breach',
      'Rig parked at a scavenge-find — half-buried alien-tech wreckage in a dust-dune, four crew dismounted excavating with shovels and salvaged power-tools, hauling glowing alien-conduit chunks back to the rig on rope-pulleys, single lookout on roof with binocs',
      'Convoy of three rigs running in column formation along a wasteland-spine ridge, hero rig in the lead with antenna spines bristling, dust-trails braiding behind all three, crew on each waving back-and-forth with signal-mirrors across the gaps, distant ruined mega-spire on horizon',
      'Rig mid-launch off a ramp built from salvaged debris, all four wheels off the ground mid-arc, crew braced inside with hands gripping the cage, driver leaning forward with goggles flashing, plasma-drive exhaust trailing behind in a bright orange tail',
      'Rig roaring through a dust-storm with the headlight-cones cutting through the orange haze, driver leaning forward to read the obscured path, two crew on rooftop scanning for off-frame threats with goggles fogged and bandanas pulled tight, the whole rig coated in a layer of settling dust',
      "Rig parked at a fuel-cache with two crew mid-refill — one hauling a glowing plasma-cell from the cache to the rig's engine-block, the other operating a hand-pump to transfer thermal-fluid into the auxiliary tank, lookout on roof scanning with pulse-rifle ready",
      'Rig mid-pursuit closing on an enemy raider-rig ahead, hero driver leaning forward over the controls, two crew on the rooftop firing scavenged Gauss-cannons at the pursued vehicle, the gap closing visibly with each second, dust-cloud kicked up filling the space between them',
      'Rig pit-stopped at a rust-tower graveyard with three crew mid-bush-fix repair on the front spike-plate, one welding a cracked spike back, one hammering bent rebar straight, one hand-cranking the fusion-cell into a higher charge state, lookout on roof with binocs',
    ],
    instructions: `Each entry is ONE specific FAR-FUTURE wasteland action, 35-65 words. Format: "[action-verb] [rig with sci-fi tech], [crew member 1 doing X], [crew member 2 doing Y], [optional crew 3], [environmental context]". Vary across the 9 action categories. STRICT BAN on 21st-century Earth scenes / modern industrial settings. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── post-apoc-rust-tech path: settings (FAR-FUTURE wasteland environments, regen 2026-05-16) ───
  rust_apoc_settings: {
    format: 'simple',
    theme: `FAR-FUTURE WASTELAND ENVIRONMENTS for the post-apoc-rust-tech path. Each entry 25-50 words.

⚠️ MANDATORY — every entry must read as POST-COLLAPSE FAR-FUTURE wasteland, NOT 21st-century Earth. Mad Max Fury Road wasteland / Borderlands Pandora / Cyberpunk 2077 Badlands / Fallout post-apoc / Dune desert-and-ruins / Death Stranding off-Earth landscape lineage.

🚫 HARD BAN — NEVER 21st-century Earth recognizable settings:
• NO modern street / highway / overpass / asphalt / sidewalk / crosswalk / parking lot / shopping mall / gas station / strip mall / suburban
• NO modern oil refinery / pipeline / aquifer / industrial plant / power plant / chemical plant rendered as RECOGNIZABLY MODERN (rust-tower graveyards are fine, but post-collapse SKELETON BONE-YARDS, never functioning facility)
• NO recognizable real-world city (NO present-day New York / LA / Chicago / Dubai etc.)
• NO modern military base / present-day army camp

✓ FAR-FUTURE WASTELAND CATEGORIES (vary across):
  A. **CRACKED DESERT HARDPAN / SALT-FLAT** (~20%) — vast empty wasteland with cracked earth, distant mesas, dust-devils, heat-shimmer
  B. **RUST-TOWER GRAVEYARD** (~15%) — post-collapse skeletal industrial bone-yard, rusted spires reaching skyward, decades of decay
  C. **SALVAGE-YARD GRAVEYARD** (~15%) — vast junkyards of crashed orbital-debris / wrecked rigs / scrapped alien-tech, scavengers picking through
  D. **DUST-CANYON / SLOT-CANYON** (~10%) — narrow rocky passages, sun-bleached walls, dust-haze, dramatic vertical scale
  E. **COLLAPSED MEGA-CITY RUINS** (~10%) — far-future skyscraper SKELETONS half-buried in dust, ruined skyline at horizon (NEVER present-day-recognizable city)
  F. **ACID-FLAT / TOXIC POOLS** (~10%) — chemical-stained terrain with toxic pools reflecting weird colors, rust formations, hazardous beauty
  G. **CRASHED ORBITAL DEBRIS-FIELD** (~5%) — fallen satellites / drop-pods / spacecraft hulks half-buried, smoke still rising, scavengers approaching
  H. **DUNE-SEA** (~5%) — endless rolling sand-dunes, rig crossing between crests, the horizon a wave of sand
  I. **HIDDEN GULCH / CANYON-OASIS** (~5%) — small enclosed gully with hidden water-source / fuel-cache / safe-haven, refuge from the open wasteland
  J. **WASTELAND-SPINE RIDGE** (~5%) — long rocky ridge running across the landscape, dramatic vista from the high ground

Each entry MUST:
• Open with the wasteland-type
• Specify TIME OF DAY (dawn / morning / midday / golden-hour / dusk / twilight / night / pre-storm)
• Reference 2-3 atmospheric / textural details (heat-shimmer / dust-haze / wreckage / decay / vegetation-mutation / etc.)
• Be UNMISTAKABLY post-collapse far-future — no modern Earth recognizable elements`,
    touchpoints: [
      'Cracked desert hardpan at golden hour, heat-shimmer rising in waves from the salt-glazed crust, distant rust-tower silhouettes on the horizon glowing edge-amber, dust-devils spinning across the flats, a half-buried crashed drop-pod foreground-left',
      'Rust-tower graveyard at midday, decades of decay turning the skeletal spires to bone-white-and-orange in the harsh sun, scrap-shrines welded by passing scavengers visible at the base of each tower, dust-haze rolling through the colonnade',
      'Salvage-yard graveyard at twilight, fields of crashed orbital-debris and wrecked rig-skeletons stretching to the horizon, single oil-fire burning in the deep distance, raider-tent encampments visible between the wreckage piles',
      'Dust-canyon at dawn, narrow rocky passage with sun-bleached walls reaching up on both sides, mist clinging to the canyon floor, distant pulse-flash visible far ahead, the path forward winding into shadow',
      'Collapsed mega-city ruins at dusk, far-future skyscraper-skeletons half-buried in dust-drifts dominating the horizon, the skyline a jagged silhouette against the burning sunset, vegetation-mutations climbing the lower levels',
      'Acid-flat with toxic pools reflecting iridescent magenta and cyan, rust-formations growing organically from the chemical sludge, steam rising slow off the surface, a single skeletal rust-spire reflecting in a still pool',
      'Crashed orbital debris-field at dawn, fallen satellites and drop-pods half-buried in sand smoking from atmospheric entry, scavenger figures visible in the deep distance approaching cautiously, dawn-blue ambient with first warm orange at horizon',
      "Endless dune-sea at midday, rolling sand-dunes stretching to every horizon, the lone rig's tracks visible as a single line across the crest of the foreground dune, sun bleaching everything pale-yellow, a sandstorm wall building in the distance",
      'Hidden gulch oasis at twilight, narrow rocky gulley with a small fuel-pool reflecting the violet sky, scavenger-tent encampment tucked against the wall, fire-pit smoke rising straight up, refuge from the wasteland beyond',
      'Wasteland-spine ridge at golden hour, long rocky spine running across the landscape, dramatic vista from high ground showing dust-canyons and salvage-yards far below, the rig small on the ridge silhouetted against the burning sky',
      'Cracked desert hardpan during sandstorm at twilight, orange particulate filling the upper sky and dimming the sun to a dull red disk, visibility limited to mid-distance, the rig small in the storm-haze with headlights cutting through',
      'Rust-tower graveyard at night, the rusted spires reaching up into deep-cobalt sky, single moon overhead casting pale silver light, scavenger fire-pits glowing amber at the base of distant towers, dust-haze softening every silhouette',
      'Salvage-yard graveyard during a magenta dust-storm, debris piles emerging through the haze in silhouette, raider-tents huddled in the gaps, lightning flashes briefly silhouetting the wreckage in stark white-on-magenta',
      'Mountain-pass canyon at dawn with rust-streaked rock walls, narrow road carved through ancient post-collapse landscape, dust-drifts piled against the walls, distant rust-tower skeleton visible at the canyon mouth',
      'Acid-flat at sunset, toxic pools reflecting blood-orange and crimson, rust-stalactites hanging from a collapsed gantry-skeleton overhead, chemical-haze hanging low, beauty hiding lethality',
      'Open mesa-plain at midday, flat hardpan stretching for kilometres with isolated wind-carved rock-pillars rising at intervals, mirage-shimmer at distance, dust-cloud from approaching pursuit visible at the deep horizon',
      "Crashed orbital habitat-ring section at dusk, massive curved structure embedded in cracked desert, rusted and decayed for decades, scavenger-camps visible in the structure's shadow, dusk-sky tinted violet behind",
      "Dune-sea at dawn with frost on the windward sand, sun cresting the horizon casting long blue-shadow on the leeward, the rig's tracks visible as twin lines across the foreground dune, distant rust-tower silhouette at horizon",
      'Salvage-yard graveyard with a fresh raider-encampment, captured rigs being stripped for parts, fires burning in scrap-barrels, war-banners hanging from the wreckage, dust-haze rolling through in the late afternoon light',
      'Wasteland-spine ridge during a thunderstorm, dramatic clouds rolling overhead with intermittent lightning flashes briefly illuminating the spine, the rig small on the ridge silhouetted against the storm-front, dust whipping in the wind',
    ],
    instructions: `Each entry is ONE specific FAR-FUTURE wasteland environment, 25-50 words. Format: "[wasteland-type] at [time of day], [2-3 atmospheric/textural details], [optional scale-prover element]". Vary across the 10 wasteland categories. STRICT BAN on 21st-century Earth settings / modern infrastructure rendered functional. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── post-apoc-rust-tech path: composition (Mad Max chase angles) ───
  rust_apoc_composition: {
    format: 'simple',
    theme: `MAD MAX CHASE CAMERA ANGLES for the post-apoc-rust-tech path. Each entry specifies a camera position + framing that makes the SCAVENGER RIG'S motion, scrap-welded character, and crew visible. Each entry 25-50 words.

⚠️ MANDATORY — every entry must convey BUSH-FIX SCRAP DNA + MOTION. The rig is roaring across a wasteland or being worked on mid-action. Mad Max: Fury Road / Borderlands / Tank Girl / Death Stranding chase-cam energy.

🚫 BANS:
• NO clean industrial framing (industrial-machines territory)
• NO portrait of stationary crew (the rig is alive and moving or being repaired mid-action)
• NO ceremonial / curated framing — these are SCRAPPY, FUNCTIONAL, OFF-KILTER angles

✓ MAD MAX ANGLE CATEGORIES (vary across):
  • **LOW-CHASE FROM ROAD** — camera at ground/wheel level as rig roars past, dust-cloud kicked up, rear of rig dominant
  • **OVER-THE-BONNET POV** — camera mounted on the rig's hood/prow looking forward at oncoming wasteland, hood-ornament / spike-array in frame
  • **AERIAL DRONE FOLLOW** — overhead helicopter shot tracking the rig from above, dust-trail behind, distant wasteland vista
  • **PARALLEL-RUN-WITH-RIG** — camera car alongside rig at matching speed, crew leaning out hatches firing/shouting, side-armor in detail
  • **DRIVER-OUT-WINDOW** — driver leaning out side window or roof hatch mid-drive, hand on wheel, eyes on the road
  • **GUNNER-ON-ROOF POV** — POV from the rig's roof-gunner position firing at off-frame target, weapon-barrel in foreground
  • **REAR-OF-RIG ASCENDING** — camera at rear of rig as smaller pursuit vehicles close in behind, smoke and dust behind
  • **CRASHED-VS-RUNNING WIDE** — wide vista with running rig in midground and wrecked pursuer in foreground/distance
  • **TOTEM-ANTENNA FOREGROUND** — antenna spines / war-banner pole / totem-pole in foreground, rig body extending behind
  • **GANG OF RIGS CONVOY** — wide convoy of multiple rigs in formation across wasteland, hero rig at centre or leading
  • **CHASING-LEAD POV** — POV from a pursuing rig closing on the hero rig, road dust between them
  • **PIT-CREW MID-REPAIR** — rig stopped with crew swarming over it mid-repair (jacking up wheel / welding chassis / fueling), dust-storm rolling
  • **JUMP-MID-AIR** — rig caught mid-launch off a ramp/dune-crest, all four wheels off ground, dust trailing
  • **DUSK-SILHOUETTE WIDE** — rig silhouetted edge-amber against burning sunset sky, dust-trail dominant
  • **NIGHT-FIRE-LIT** — night scene with rig lit only by its own fire / torch / muzzle-flash, crew in shadow
  • **WHIRLWIND CIRCLE** — rig at center of swirling sandstorm/dust-devil, crew bracing against wind
  • **GUN-MOUNT REVERSE** — camera at rear of rig looking forward across the deck, gun-mount and crew silhouettes against forward landscape
  • **WIDE-VALLEY APPROACH** — rig descending into a valley / canyon / salvage yard from a high vantage, wide vista beyond
  • **CHASE-RAM IMPACT** — moment of two rigs impacting (ramming / spike-plates locking / pit-maneuver), dust + debris exploding
  • **SUNSET-OVER-THE-FLATS** — wide flat horizon at sunset, rig small in deep distance with massive dust-trail behind

Each entry must specify:
• Camera position + height + angle (specific, not vague)
• What dominates the frame (rig body / driver / gunner / dust-trail / convoy)
• Bush-fix visual detail (scrap-armor / antenna-pole / spike-plate / lashed-fuel-can in view)
• Motion or activity (roaring / pursuit / repair / convoy / jump)`,
    touchpoints: [
      'LOW-CHASE FROM ROAD — camera flush against cracked desert hardpan as the rig roars past at speed, rear of rig dominating upper frame with welded scrap-armor plating, dust-cloud kicked up by rear wheels filling lower frame, exhaust pipes belching smoke upward',
      "OVER-THE-BONNET POV — camera mounted on the rig's spike-ram prow looking forward at oncoming wasteland, hood-ornament (welded scrap-metal skull) in lower foreground, the road stretching ahead with another rig at vanishing point being pursued",
      'AERIAL DRONE FOLLOW — overhead helicopter-shot tracking the rig from above-left, dust-trail extending behind across the cracked salt-flat, distant wasteland vista of wrecked cars and burning oil-derricks',
      'PARALLEL-RUN-WITH-RIG — camera car alongside the rig at matching speed, three crew leaning out side-hatches firing improvised weapons at off-frame pursuer, side-armor in detail (welded license plates and oil-drum panels), motion-blur on the ground beneath',
      'DRIVER-OUT-WINDOW — driver leaning halfway out the side window mid-drive, war-painted face and goggles, one hand white-knuckled on the wheel through the open frame, scrap-armor inches from their elbow, the wasteland streaking past in motion-blur',
      "GUNNER-ON-ROOF POV — POV from the rig's roof-gunner position firing a welded-together heavy-MG at an off-frame pursuer, weapon-barrel and brass-rain in lower foreground, the rig's antenna-pole forest visible at frame-edge, ground-haze below",
      'REAR-OF-RIG ASCENDING — camera at the rear of the hero rig as three smaller pursuit-buggies close in from behind across the dust-cloud, brass casings raining from a roof-mounted gunner firing back, smoke and grit filling the space between',
      'CRASHED-VS-RUNNING WIDE — wide wasteland vista with the hero rig running in midground at speed, a wrecked-and-burning pursuer in deep foreground silhouetted black against the smoke, distant skyline of post-apoc ruin',
      "TOTEM-ANTENNA FOREGROUND — towering totem-pole/war-banner-pole rising from the rig's rear deck in extreme foreground, mounted with skulls and trophies, rig body extending behind dominated by the antenna spines, crew on deck below",
      'GANG OF RIGS CONVOY — wide convoy of 4-5 mismatched scrap-welded rigs in loose formation across cracked desert hardpan, hero rig leading at centre, dust-trails braiding behind all of them, single sun overhead',
      "CHASING-LEAD POV — POV from a pursuing rig closing on the hero rig ahead, road dust between them, hero rig's exhaust-smoke trailing back toward camera, pursuit-gunner's weapon-barrel visible at frame edge",
      'PIT-CREW MID-REPAIR — rig stopped in a hidden gulch with 4 crew swarming over it mid-bush-fix repair (welding a cracked chassis, jacking up a wheel, hand-cranking fuel-pump, replacing a broken antenna), dust-storm rolling in deep distance',
      'JUMP-MID-AIR — rig caught mid-launch off a dune-crest, all four wheels off the ground in mid-arc, dust trailing behind from take-off, crew braced inside, the landing strip of cracked dust visible below',
      'DUSK-SILHOUETTE WIDE — hero rig silhouetted edge-amber against a burning Mad Max sunset sky, massive dust-trail dominating the lower frame, antenna-spines reading black against the orange',
      'NIGHT-FIRE-LIT RIG — night scene with the rig lit only by its own torch-flame / improvised flame-thrower / fire-pit on the rear deck, crew silhouettes against the firelight, wasteland deep-dark around them',
      'WHIRLWIND CIRCLE — rig at the center of a swirling sandstorm / dust-devil, crew bracing against the wind with arms raised, antenna-poles bending, sand visibly streaming past in vortex motion',
      "GUN-MOUNT REVERSE POV — camera at the rear of the rig looking forward across the deck, the welded gun-mount and crew silhouettes against the forward wasteland landscape, the driver's helmet visible far ahead through the cab-frame",
      'WIDE-VALLEY APPROACH — hero rig descending into a wide salvage-yard valley from a high vantage, wrecked vehicles and scrap-piles scattered across the floor below, smoke columns rising from distant fires, the rig small at the entry',
      'CHASE-RAM IMPACT — frozen moment of two rigs impacting in mid-chase (ramming / spike-plates locking / pit-maneuver), dust and debris exploding outward, both crews braced and shouting, motion-blur in the surrounding wasteland',
      'SUNSET-OVER-THE-FLATS — wide flat horizon at burning sunset with the rig small in deep distance, a massive dust-trail extending across the entire frame behind it, sky filling 2/3 of the frame with theatrical color',
    ],
    instructions: `Each entry is ONE specific Mad Max chase camera angle, 25-50 words. Format: "ANGLE NAME CAPS — camera position + what dominates the frame + bush-fix detail + motion/activity". Every entry has SCRAP-DNA + MOTION. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── post-apoc-rust-tech path: lighting (Fury Road sunset / sandstorm / fire-glow) ───
  rust_apoc_lighting: {
    format: 'simple',
    theme: `MAD MAX WASTELAND LIGHTING for the post-apoc-rust-tech path. Each entry is ONE specific cinematic lighting setup for scrap-welded rigs roaring across post-apoc wasteland. Each entry 20-40 words.

⚠️ STRICT BAN — NO cosmic / astronomy vocabulary. NO clean industrial sodium-amber (industrial-machines territory). NO clean military combat lighting (power-armor-infantry territory). NO peaceful nature. NO interior LED facility.

✓ MANDATORY VARIETY — distribute across:
  A. **GOLDEN-HOUR SUNSET ORANGE** (~20%) — Fury Road signature warm-orange sunset, rig silhouetted edge-amber, dust kicked up in the warm light
  B. **DUST-STORM ORANGE FILTERED** (~15%) — sun filtered through dust-storm haze, everything tinted orange-sepia, low contrast, atmospheric
  C. **NOON HARSH WHITE-BLEACHED** (~10%) — midday sun bleaching the wasteland, hard shadows, sun-glare on chrome and dust, high-contrast desert
  D. **NIGHT FIRE-GLOW** (~10%) — night scene with rig lit only by torch / flame-thrower / fire-pit on the deck, deep-dark wasteland around
  E. **SANDSTORM SEPIA WALL** (~10%) — sandstorm wall in the deep distance dominating sky, rig in foreground reading in cool tones against the wall
  F. **DAWN BLOOD-RED HORIZON** (~10%) — pre-sunrise red horizon bleeding into deep-violet sky, rig silhouetted edge-red, urgency mood
  G. **NEON-CYBERPUNK URBAN SCAVENGER** (~5%) — abandoned urban ruin with broken neon signs uplighting the rig, multicolored bleed
  H. **HEADLIGHTS-IN-DUST CONES** (~5%) — rig\'s own headlights cutting through dust as primary light, hard cones of yellow-white visible
  I. **MOLOTOV-IGNITION FOREGROUND** (~5%) — molotov cocktail or thermite-charge mid-ignition in foreground, bright orange uplight on rig and crew
  J. **STORM-CELL LIGHTNING FLASH** (~5%) — pre-storm dark with actinic-white lightning forks briefly silhouetting the rig, deep shadow between flashes
  K. **DAWN COLD-BLUE WITH FIRE-PIT** (~5%) — pre-sunrise cold-blue ambient with the rig's own fire-pit / torch providing warm accent, dual-color contrast`,
    touchpoints: [
      'GOLDEN-HOUR SUNSET ORANGE — Fury Road signature warm-orange sun raking across the wasteland at low angle, rig silhouetted edge-amber against the sky, dust kicked up by wheels glowing in the warm light, long shadows stretched',
      'DUST-STORM ORANGE FILTERED — sun filtered through dust-storm haze, everything tinted orange-sepia in the diffused light, low contrast across the scene, atmospheric mood of approaching weather, visibility limited to mid-distance',
      'NOON HARSH WHITE-BLEACHED — midday sun bleaching the wasteland in harsh white light, hard-edged shadows beneath the rig, sun-glare reflecting off chrome and dust-cloud, high-contrast desert mood',
      'NIGHT FIRE-GLOW PRIMARY — night scene with the rig lit only by its own torch-flame / improvised flame-thrower / fire-pit on the rear deck, deep-dark wasteland around them, crew silhouettes against the firelight',
      'SANDSTORM SEPIA WALL — massive sandstorm wall dominating the deep distance and upper-frame sky in orange-sepia, rig in foreground reading in cool tones against the wall, crew bracing for the incoming weather',
      'DAWN BLOOD-RED HORIZON — pre-sunrise blood-red horizon bleeding into deep-violet sky overhead, rig silhouetted edge-red against the burning band, urgency mood, hard shadows still long',
      'NEON-CYBERPUNK URBAN SCAVENGER — abandoned urban ruin with broken neon signs uplighting the rig from below in cyan-magenta bleed, wet pavement reflecting the colors, hard color contrast against the ruined backdrop',
      "HEADLIGHTS-IN-DUST CONES — rig's own headlights cutting through dust as primary light source, hard cones of yellow-white visible projecting forward, the rig itself partially silhouetted, beyond-cone wasteland in shadow",
      'MOLOTOV-IGNITION FOREGROUND — molotov cocktail or thermite-charge mid-ignition in extreme foreground, bright orange uplight on the rig and crew, scene briefly over-exposed where flame is, hard shadow contrast',
      'STORM-CELL LIGHTNING FLASH — pre-storm dark wasteland with actinic-white lightning forks branching between charged storm-clouds, briefly silhouetting the rig in stark white-on-black, deep shadow between flashes',
      "DAWN COLD-BLUE WITH FIRE-PIT — pre-sunrise cold-blue ambient across the wasteland with the rig's own fire-pit / torch providing warm accent, dual-color contrast between cold sky and warm rig",
      'OVERCAST APOC-GREY — overcast post-apoc sky providing diffuse cold-grey light, low contrast, muted tones across the rig and wasteland, somber post-collapse mood',
      'GAS-FLARE GLOW DISTANT — distant gas-flare or burning oil-derrick in deep distance providing warm orange glow on the horizon, rig in foreground catching some of the warm-side light',
      'SUNSET BLOOD-ORANGE EXTREME — sun at horizon bleeding maximum-saturation blood-orange across the entire sky, rig silhouetted full-black against the burning sky, post-apoc operatic finale energy',
      'TWILIGHT WITH WAR-TORCHES — twilight sky with rig-mounted war-torches and crew torches kicking on, intermediate dual-color contrast between failing daylight and incandescent flame',
    ],
    instructions: `Each entry is ONE specific Mad Max wasteland lighting setup, 20-40 words. Format: "LIGHTING MODE CAPS — [source + direction + color + shadow character + wasteland context]". Distribute across the 11 buckets. STRICT BAN on cosmic / clean-industrial / clean-military / interior modes. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── post-apoc-rust-tech path: drama (40%-gated wasteland phenomena) ───
  rust_apoc_drama: {
    format: 'simple',
    theme: `40%-GATED WASTELAND PHENOMENA for the post-apoc-rust-tech path — an environmental event amplifying the chase/scavenger moment. Each entry 25-50 words.

⚠️ STRICT — each phenomenon must amplify MAD MAX wasteland spectacle. Fury Road / Borderlands / Tank Girl / Death Stranding lineage. NO clean industrial work, NO pristine nature, NO fantasy.

✓ WASTELAND PHENOMENA — distribute across:
  • **DUST-DEVIL SPIRAL** — dust-devil spiral on the horizon or near the rig
  • **SANDSTORM WALL APPROACHING** — massive sandstorm wall rolling in from the horizon
  • **VEHICLE-WRECK FIREBALL** — fresh wrecked pursuer fireball in midground
  • **MOLOTOV-EXPLOSION** — molotov cocktail exploding mid-air or impacting nearby
  • **OIL-DERRICK BURNING DISTANT** — burning oil-derrick or fuel-depot in deep distance, smoke-column rising
  • **WRECKAGE-SCATTERED FOREGROUND** — wrecks of prior crashes scattered across the foreground terrain
  • **VULTURES-CIRCLING OVERHEAD** — flock of vultures or carrion-birds circling overhead
  • **ROAD-DEBRIS-SCATTER** — chunks of wreckage / barbed-wire / spikes scattered on the road ahead
  • **MIRAGE-HEAT-SHIMMER** — heat-shimmer rising from the road creating a mirage-distortion in mid-distance
  • **DUST-CLOUD-OVERTAKE** — massive dust-cloud kicked up by pursuit overtaking the hero rig from behind
  • **FUEL-SPILL TRAIL** — leaking fuel-can trail behind the rig with sparks dangerously close
  • **CONVOY-FLARE OVERHEAD** — signal-flare arcing overhead from a friendly or enemy convoy
  • **SUPPRESSION-FIRE TRACER** — incoming tracer-rounds from a pursuer's MG creating colored arcs in the air
  • **CHAIN-WHIP CRACK** — heavy chain mid-swing from a chain-mounted weapon impacting an enemy vehicle
  • **DUNE-CREST LAUNCH** — dune-crest mid-launch as the rig comes off the rise, dust trailing
  • **ROAD-WARRIOR HORDE INCOMING** — horde of pursuit-vehicles visible at the deep horizon closing in
  • **THUNDERSTORM ROLLING** — thunderstorm rolling across the wasteland in distance with lightning flashes
  • **WATER-OASIS REVELATION** — sudden glimpse of green water-oasis ahead amid the desolation
  • **ENGINE-FIRE COMPLICATION** — rig's own engine catching fire mid-drive, smoke pouring from hood, crew trying to put it out
  • **RAM-PRONG IMPACT-MOMENT** — rig's ram-prong impacting another vehicle, debris and crew flying`,
    touchpoints: [
      "DUST-DEVIL SPIRAL — towering dust-devil spiral on the horizon at midground level, the dust-column extending up into the sky, the rig's path likely intersecting it within seconds, atmospheric drama",
      'SANDSTORM WALL APPROACHING — massive sandstorm wall rolling in from the deep horizon dominating the upper third of the frame in orange-sepia, the rig in foreground silhouetted against the wall, ominous',
      'VEHICLE-WRECK FIREBALL — fresh wrecked pursuer vehicle fireball in midground behind the hero rig, secondary explosions chaining out, black smoke-column rising into the sky',
      "MOLOTOV-EXPLOSION MID-AIR — molotov cocktail exploding mid-air or impacting against a pursuer's windshield, bright orange fireball mid-bloom, glass shattering, hands releasing the throw still visible",
      'OIL-DERRICK BURNING DISTANT — burning oil-derrick or fuel-depot in deep distance with massive smoke-column rising into the sky, the rig speeding past in foreground silhouetted against the orange backdrop',
      'WRECKAGE-SCATTERED FOREGROUND — wrecks of prior crashes scattered across the foreground terrain (burned-out car-shells, twisted metal, abandoned scrap), the rig threading between them at speed',
      'VULTURES-CIRCLING OVERHEAD — flock of vultures or carrion-birds circling overhead in the upper-frame sky, eyeing the wasteland for fresh kills, atmospheric memento-mori',
      'ROAD-DEBRIS-SCATTER — chunks of wreckage / barbed-wire / spike-trap scattered on the road ahead of the rig, the driver hauling the wheel to dodge, mid-evasive-action moment',
      'MIRAGE-HEAT-SHIMMER — heat-shimmer rising from the cracked desert hardpan creating a mirage-distortion in mid-distance, the pursuer at the heat-line dissolving into rippling air',
      'DUST-CLOUD-OVERTAKE — massive dust-cloud kicked up by pursuit closing in from behind, partially obscuring the rear of the hero rig, pursuit-vehicles emerging through the cloud',
      'FUEL-SPILL TRAIL — leaking fuel-can trail behind the rig with sparks dangerously close from the rear gun-mount, the spill ignition risk imminent, gunner glancing back',
      "CONVOY-FLARE OVERHEAD — signal-flare arcing overhead from a friendly or enemy convoy in the deep distance, the flare's smoke-trail crossing the upper frame, message-implied",
      "SUPPRESSION-FIRE TRACER — incoming tracer-rounds from a pursuer's MG creating colored arcs in the air around the hero rig, near-misses sparking off the welded-armor plating",
      "CHAIN-WHIP CRACK — heavy chain mid-swing from a chain-mounted weapon impacting an enemy vehicle's windshield, glass shattering, the enemy driver visibly recoiling",
      'DUNE-CREST LAUNCH — dune-crest mid-launch as the rig comes off the rise mid-arc, all four wheels off the ground, dust trailing behind from take-off, the landing-flat visible below',
      'ROAD-WARRIOR HORDE INCOMING — horde of pursuit-vehicles visible at the deep horizon closing in across the wasteland, multiple silhouettes at distance, dust-trails braiding behind them',
      'THUNDERSTORM ROLLING — thunderstorm rolling across the wasteland in deep distance with intermittent lightning flashes briefly illuminating the rig, the storm-front extending across the horizon',
      "WATER-OASIS REVELATION — sudden glimpse of a green water-oasis ahead amid the desolation, water glistening, the rig's crew visibly reacting in surprise, brief beauty in the wasteland",
      "ENGINE-FIRE COMPLICATION — rig's own engine catching fire mid-drive, smoke pouring from the hood, crew leaning out with fire-extinguisher or jacket to smother it, drive continuing",
      "RAM-PRONG IMPACT-MOMENT — rig's ram-prong impacting another vehicle in frozen moment, debris and crew flying from the impacted vehicle, the hero rig's prow visibly buckling",
    ],
    instructions: `Each entry is ONE specific Mad Max wasteland phenomenon, 25-50 words. Format: "PHENOMENON NAME CAPS — primary visual action + secondary detail + wasteland-context". STRICT Mad Max aesthetic — NO clean industrial work, NO pristine nature, NO fantasy. Amplifies the chase/scavenger moment. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── humanoid-robots path: subjects (FAR-FUTURE cool humanoid robots, 2026-05-17, calibrated to Kevin's reference DNA) ───
  humanoid_robots_subject: {
    format: 'simple',
    theme: `COOL HUMANOID ROBOTS for the humanoid-robots path — a SINGLE standalone humanoid robot (bipedal, head + torso + 2 arms + 2 legs, HUMAN-SCALE 1.5-2.5m tall). Each entry 35-65 words.

⚠️ THE BAR: every entry must read like a piece of premium concept-art for a polished cinematic sci-fi humanoid robot character. Visual reference: gleaming chrome/titanium/charcoal chassis with multi-iris kaleidoscope eye-arrays in the head, multi-color glowing joint-seams / chest-cores / shoulder-orbs (cyan/amber/magenta/emerald), exposed mechanical detail visible beneath polished armor plating. REAL STEEL boxing-bots / DETROIT BECOME HUMAN combat androids (mechanical-only chassis) / EX MACHINA Ava (mechanical frame) / APEX LEGENDS Pathfinder + Revenant + Ash / I, ROBOT NS-5 / MEGAMAN-X bosses / HORIZON ZERO DAWN Hephaestus-builds / Boston Dynamics Atlas (sci-fi-exaggerated) / Code Geass knightmare-pilot-frames / Cyberpunk 2077 Adam Smasher / Mass Effect Geth Prime humanoid.

🚫 ABSOLUTE BANS:
• NOT a hexapod / quadruped / hovering / spherical-rolling / tracked / wheeled robot — STRICTLY BIPEDAL HUMANOID FORM (head + torso + 2 arms + 2 legs)
• NOT a giant mech (titan-war / mecha-pilots territory) — HUMAN-SCALE 1.5-2.5m tall
• NOT a cyborg with flesh (cyborg-woman / cyborg-man territory) — FULLY MECHANICAL, no flesh, no organic skin, no hair
• NOT a synthetic android with realistic human skin (this is the MECHANICAL version)
• NOT scavenger bush-fix rig (rust-tech territory) — POLISHED + DESIGNED, never jury-rigged scrap-weld
• NOT a battlefield power-armored soldier (power-armor-infantry — those have humans INSIDE)

🚫 IP HARD BAN — NEVER name: Stormtrooper / Mandalorian / beskar / Halo / ODST / Spartan / MJOLNIR / UNSC / Star Wars / R2-D2 / BB-8 / C-3PO / IG-88 / K-2SO / Battle Droid / Clone Trooper / Master Chief / Forerunner Promethean. The aesthetic these IPs share is welcome — but NEVER name the IP.

✓ SIGNATURE VISUAL DNA — bake AT LEAST 3 of these into EVERY entry:
• **MULTI-IRIS COMPOUND OPTIC HEAD** — multiple glowing eye-lenses on the helm (2-7 lenses, often kaleidoscopic rainbow-bloom / iridescent / cyan-magenta-amber blend). The head reads like a precision instrument with several glowing optic-arrays, NOT a single cyclops eye.
• **MULTI-COLOR GLOWING JOINT-SEAMS** — energy-conduit glow visible at joint-articulations (shoulders / elbows / hips / knees) and along spine/chest, in multi-color (cyan + amber + magenta blend, NOT one color). Like circuitry pulsing.
• **GLOWING CHEST-CORE or SHOULDER-ORBS** — visible reactor-core / power-pack glowing through chest-plate (single large lens or multi-port array, often multi-color)
• **POLISHED CHROME / TITANIUM / BRUSHED-METAL chassis** — gleaming finish, NOT weathered scrap. Mirror-finish in places, brushed in others. Light catches every panel.
• **EXPOSED MECHANICAL DETAIL beneath armor plating** — visible servos / actuator-pistons / hydraulic-cables / gear-trains showing through gaps in the polished plating, mechanical truth
• **SCALE-RUST 0-30% optional** — minor wear at lower legs / dust on chassis / scratched-paint on a shoulder is fine if the entry needs it, but DEFAULT is gleaming-polished

✓ ALSO BAKE 1-2 OF (additional flourish):
• ELONGATED / ALIEN-TILTED HEAD-SHAPE (insectile / stretched-skull / faceted-faceplate) — humanoid head shapes can drift toward alien-tech-design
• SIGNATURE TOOL/WEAPON visible — energy-blade / pulse-pistol / scanner-array / repair-arm / climbing-claws / data-jack / heavy ordnance
• ASYMMETRIC SIGNATURE ELEMENT — one shoulder oversized / asymmetric arm / spine-mounted communication-array / drapery (cloak / scarf / sash)
• MEMORABLE COLOR ACCENT — emerald / cobalt / amber / crimson / rose / gold as the standout color of the design

✓ ARCHETYPE / BODY-TYPE DISTRIBUTION — vary across (FEMININE + MASCULINE + ANDROGYNOUS + ALIEN-FORM all welcome):
  A. **SLIM ATHLETIC FRAME** (~20%) — lean humanoid silhouette, often expressionless smooth chassis with multi-iris optic-array head, courier/assassin/scout-coded
  B. **HEAVY ARMORED FRAME** (~15%) — bulked-out combat chassis, broad shoulders, often with weapon-mounts, Adam-Smasher / Real-Steel-Zeus / Mass-Effect-Geth-Prime coded
  C. **FEMININE-CODED ATHLETIC** (~15%) — chassis with subtle chest-plates / hip-taper / waist-narrowing, sleek hourglass-silhouette but FULLY MECHANICAL (NEVER flesh), polished chrome + exposed mechanical detail. Kevin reference IMG_8869 / Screenshot 12.13.14.
  D. **WORKER/INDUSTRIAL HEAVY** (~10%) — bulky working chassis, scarves or cloth-drape over shoulders, polished but utilitarian, color-blocked design. Kevin reference IMG_8945.
  E. **CONTEMPLATIVE / NARRATIVE FRAME** (~10%) — designed for a quiet character moment, gentler proportions, kneeling-friendly silhouette. Kevin reference IMG_8964 (waterfall-bot).
  F. **CEREMONIAL / ORNATE** (~10%) — gold/chrome decorated, formal-coded, often robed/cloaked. Kevin reference Screenshot 12.11.42 (tall robed-helm-figure).
  G. **ALIEN-FORM / EXOTIC SILHOUETTE** (~10%) — elongated skull-head / unusual proportions / faceted alien-tech chassis. Kevin reference Screenshot 12.11.19 (yellow-eyed mantis-helm).
  H. **PREDATOR-STALK / FELINE-CODED** (~5%) — crouched humanoid, asymmetric reach, athletic-quadruped-tilted bipedal. Kevin reference IMG_8958 (crouched canyon-stalker).
  I. **AVATAR-STYLE FRAME** (~5%) — Real-Steel boxing-bot or training-droid feel, broad-shouldered presentation-pose`,
    touchpoints: [
      'Slim feminine-coded chrome-and-titanium humanoid frame 1.8 meters tall, dome-helm with TWO LARGE GLOWING MULTI-IRIS OPTIC LENSES (rainbow-bloom kaleidoscope iridescent magenta-cyan-amber), exposed mechanical cable-bundles visible at the neck, polished chest-plates with central emerald reactor-core glowing, brass-gear-accents at the hips, contemplative still pose',
      'Sleek slim androgynous humanoid 1.7 meters tall, faceted alien-tilted smooth-domed helm with MULTI-IRIS OPTIC array (3 lenses, kaleidoscope cyan-magenta bloom), pristine gleaming brushed-titanium chassis, glowing emerald spine-conduit visible along the back, asymmetric shoulder-orb pulsing amber, contemplative mid-stride pose',
      'Heavy worker-bot 2.3 meters tall in polished white-and-orange industrial chassis, dome-helm with multiple amber-glowing optic-arrays clustered like compound eyes, OVERSIZED orange ceremonial scarf draped across shoulders, gripper-claw hands hanging at sides, glowing emerald shoulder-orb visible, scuffed lower-legs from rough terrain, contemplative standing pose',
      'Predator-stalk humanoid 1.9 meters tall in matte-charcoal-and-black chassis, sleek smooth alien-form helm with one large central round optic glowing hot-amber, exposed mechanical claw-fingers, lean athletic proportions, antenna-mast extending from the back, crouched ready pose with one hand braced on ground',
      'Contemplative narrative-frame humanoid 1.8 meters tall in gleaming chrome with cobalt accents, smooth dome-helm with FOUR-IRIS COMPOUND OPTIC ARRAY (kaleidoscope rainbow blend: magenta + cyan + amber + emerald), glowing cyan chest-core visible through articulated plates, exposed servo-joints at shoulders, kneeling reverent pose',
      'Tall ornate ceremonial humanoid 2.2 meters tall in gleaming-chrome chassis under a black flowing ceremonial robe, alien-form elongated-skull helm with one large purple-magenta central optic surrounded by smaller amber accent-lenses, exposed mechanical wrist-joints visible at the cuff, dignified formal pose',
      'Mantis-form alien-tilted humanoid 1.9 meters tall in chrome-and-charcoal chassis with elongated mantis-shaped helm, dual GLOWING-AMBER COMPOUND EYES (multi-faceted insectile lens-clusters), gold-leaf filigree details on the chestplate, cape draped from one shoulder, asymmetric blade-mounted forearm, predator stance',
      'Athletic feminine-coded humanoid 1.7 meters tall in polished chrome with brass-and-emerald accent-details, smooth dome-helm with TWO LARGE MULTI-IRIS OPTIC LENSES (kaleidoscope bloom magenta-cyan-amber), articulated chest-plates with central emerald reactor visible, exposed servo-pistons at joints, mid-stride athletic pose',
      'Heavy boxing combat-bot 2.1 meters tall (Real-Steel-coded), articulated red-and-chrome competition chassis with massive shoulder-pads, dome-helm with TWO HORIZONTAL VISOR-LENSES glowing red (compound optic array), exposed chest-core pulsing amber, gleaming polished surfaces, weight on back foot ready for next strike',
      'Slim courier-bot 1.7 meters tall in brushed-titanium chassis with cyan accent-strips along the limbs, antenna-crown helm with MULTIPLE COMPACT OPTIC LENSES (4-iris cluster, cyan-magenta blend) and integrated comm-dish above, holographic-display projector arm raised mid-message, mid-stride athletic pose',
      'Adam-Smasher-coded heavy assault frame 2.5 meters tall, bulked-out matte-charcoal chassis with red-accent kill-stripes, faceplate with diagonal HORIZONTAL VISOR glowing red (3-iris compound array along the slit), asymmetric oversized right-arm cannon, scarred chest-plate with exposed engine-block on the back glowing amber',
      'Insectoid-form scout humanoid 1.7 meters tall in chrome-and-emerald chassis, alien-tilted faceted helm with MULTI-IRIS COMPOUND OPTIC ARRAY (6 small lenses arranged like an insect compound eye, glowing emerald-and-amber), exposed servo-pistons at joints, athletic crouch ready to leap',
      'Detroit-Become-Human-coded combat-android 1.8 meters tall, slim athletic MECHANICAL-ONLY chassis (NO synthetic skin, exposed servo-joints / actuator-pistons / segmented panels), brushed-aluminum body with cyan energy-conduit veins glowing along the spine, dome-helm with MULTI-IRIS OPTIC ARRAY (3 lenses cyan-bloom)',
      'Megaman-coded boss-droid 2.0 meters tall, brightly colored cobalt-and-crimson armored chassis with oversized shoulder-pauldrons and gauntlet-blasters, dome-helm with central forward-facing optic glowing gold + secondary side-lenses (3-iris head array), signature theme-color glow at chest and gauntlets, dramatic ready-pose',
      'Apex-Pathfinder-coded scout-courier 1.9 meters tall, exposed mechanical-frame chassis (skeletal humanoid, NO armor plating — all servo-pistons / actuator-joints / cabling visible), large round optic-screen on the head displaying expressive face-pattern, grappling-hook-arm extended, athletic mid-action pose',
      'Mass-Effect-Geth-Prime-coded armored combat-droid 2.4 meters tall, layered-plate humanoid chassis, central FACETED ALIEN-FORM HELM with MULTI-IRIS COMPOUND OPTIC ARRAY (5 lenses, cyan bloom), heavy assault rifle gripped two-handed, internal blue energy-conduits glowing through panel-seams, predator-stalk stance',
      'Scientific-research droid 1.8 meters tall, slim white-and-cyan medical-coded chassis, dome-helm with SIX-IRIS COMPOUND-SENSOR ARRAY (kaleidoscope cyan-amber blend), multi-tool armatures extending from back and hip mounts, holographic-display projector on top of helm, calibration-arm raised mid-scan, polished surfaces',
      'Ornate gold-and-chrome ceremonial royal-guard humanoid 2.0 meters tall, deep engraved filigree along chest-plate and pauldrons, antlered crown-helm with central glowing-emerald optic + 4 satellite-lens accents (multi-iris royal optic array), ceremonial energy-glaive held vertical at parade-rest, scarlet ceremonial-sash draped',
      'Exploration-survey droid 1.9 meters tall, rugged outdoor-coded chassis with utility-vest of climbing-claws and survival-tools, asymmetric MULTI-IRIS OPTIC ARRAY on the helm (one larger main optic plus 3-4 small sensor-dots clustered, amber-cyan blend), exposed engine-block on the back with cooling-fins, dust-coated lower legs',
      'Code-Geass-coded knightmare-pilot-frame humanoid 2.2 meters tall, cobalt-and-silver elegant armored chassis with oversized angular shoulder-pauldrons, full helm with HORIZONTAL VISOR GLOWING ELECTRIC-CYAN (4-lens array along the visor slit), ceremonial cape draped across one shoulder, sword-handle at hip, regal warrior stance',
    ],
    instructions: `Each entry is ONE specific cool humanoid robot, 35-65 words. Format: "[archetype] [color/material chassis description], [scale 1.5-2.5m], [head/helm/optic detail], [signature tool/weapon if applicable], [body language pose]". Vary across the 9 archetype distributions. STRICT BAN on cyborg-flesh / giant-mech / quadruped / hover / wheeled / non-humanoid forms. STRICT BAN on IP names. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── humanoid-robots path: actions (what the robot is doing) ───
  humanoid_robots_action: {
    format: 'simple',
    theme: `WHAT THE HUMANOID ROBOT IS DOING for the humanoid-robots path. Each entry 25-50 words. The robot is mid-ACTION — a freeze-frame of meaningful movement or behavior.

⚠️ MANDATORY — the robot is mid-ACTION (NOT static showpiece pose). The action conveys CHARACTER + PURPOSE. Reads as a still from a sci-fi movie.

🚫 BANS:
• NO group-action / no companion robots — SINGLE robot
• NO giant-mech actions (titan-war territory) — human-scale movement only
• NO bush-fix scavenger actions (post-apoc-rust-tech territory)
• NO squad combat (power-armor-infantry territory)

✓ ACTION CATEGORIES (vary across):
  A. **MID-COMBAT** (~20%) — mid-fire / mid-strike / mid-block / mid-charge with weapon raised
  B. **STEALTH/STALK** (~10%) — predator-stalk forward / cloaking-mid-fade / mid-strike from cover
  C. **WORK/UTILITY** (~15%) — mid-hauling cargo / mid-welding / mid-repairing / mid-scanning / mid-mining
  D. **MID-RUN/PURSUIT** (~10%) — mid-sprint / mid-leap / mid-vault / mid-grapple-fire
  E. **CEREMONIAL/PRESENT** (~10%) — formal ceremonial pose / mid-announcement / mid-message-projection
  F. **SCIENTIFIC/ANALYTICAL** (~10%) — mid-scan / mid-sample-collection / holographic-display reading / mid-recalibration
  G. **DRAMATIC POSE** (~10%) — battle-stance ready / hero-pose silhouetted against light / contemplative-still in dramatic frame
  H. **DOMESTIC/SERVICE** (~5%) — mid-cooking / mid-serving / mid-greeting / mid-assistance gesture
  I. **EMOTIONAL MOMENT** (~5%) — looking at sunset / kneeling beside damaged ally / hand-on-window-of-spaceship / cradling object
  J. **MID-DEPLOY** (~5%) — mid-launch from drop-pod / mid-rappel from ship / mid-emergence from charging station

Each entry must specify:
• Opening action-verb (mid-fire / mid-stride / mid-pose / mid-scan / mid-leap / etc.)
• Body language (which arm raised / weight distribution / head-angle)
• Specific OBJECT or TARGET being interacted with (weapon / cargo / scanner / display / enemy / cargo / friend)
• Environmental detail (sparks / dust / energy-discharge / debris)`,
    touchpoints: [
      'Mid-combat stance with right energy-blade extended forward and left arm raised in guard position, weight on rear leg ready to lunge, sparks raining from the blade where it just deflected an off-frame strike, head tilted slightly tracking the target',
      'Mid-stride sprint across an open plaza, both arms swinging in opposition to legs, single optic locked forward on a fleeing target, asymmetric heel-strike kicking up dust, holographic targeting-reticle visible across the helm',
      'Mid-haul lift of a massive cargo container above the head with both arms, knees slightly bent under the load, balance-sensors visibly active with stabilization-thrusters firing micro-bursts at the hips, dust scattered around the boot-impact point',
      'Mid-scan with right arm extended forward palm-up emitting a cone of blue scanner-light, head tilted reading the holographic display projected from the palm, left hand on chin in contemplative gesture, soft ambient mood',
      'Predator-stalk forward through ruined corridor, body bent low and weight forward, dual energy-daggers held reverse-grip at hips, faceless helm tracking left then right scanning for movement, cloaking-field micro-distortion shimmering across the chassis',
      'Mid-grapple-launch as the grapple-hook fires from the wrist toward an off-frame anchor-point, body crouched ready to be pulled, free arm raised in counterbalance, expressive face-screen display flashing excitement, dust kicking up behind the boots',
      'Ceremonial parade-rest pose with energy-glaive held vertical in right hand and left hand at the small of the back, head held high with chin slightly elevated, scarlet ceremonial-sash perfectly draped, gleaming polished surfaces catching the light',
      'Mid-fire pulse-rifle two-handed grip raised to shoulder, head tilted slightly to align with the integrated optic-sight, muzzle-flash blooming forward, brass-equivalent of energy-cells ejecting from the side, weight forward into the shot',
      'Mid-strike with right armored fist swinging through the air toward an off-frame target, body torqued at the hips for power transfer, exposed knuckle-spikes catching light, dust trail behind the punch, predator-snarl posture',
      'Mid-welding kneeling on one knee beside a panel, plasma-torch extended from the right forearm cutting through metal in a shower of bright sparks, left hand bracing the panel steady, head tilted reading the work with the helm-mounted scanner',
      'Looking out across a vast landscape with hands clasped behind back, body in contemplative-still posture, head slightly tilted in observation, soft sunset light raking across the chassis, a moment of mechanical-poetry',
      'Mid-emergence from charging-cradle as the cradle-arms retract back into the wall, body just-coming-online with optic-eyes flickering active for the first time, holographic boot-up sequence projected across the helm visor',
      'Mid-leap over a railing or obstacle with both legs tucked, hands ready to catch the landing, body torqued slightly in mid-air, motion-blur on the surrounding scene, athletic acrobatic posture',
      'Mid-mining operation with plasma-drill extended from right arm grinding into rock face, left arm bracing against the wall for stability, dust-cloud erupting from the drill-point, headlamp on the helm cutting through the dust',
      'Mid-research analytical pose seated on a stool with multiple instrument-arms extending from back-mounts examining a small sample held in main hands, holographic data-displays floating around the head showing readouts, intellectual concentration in body language',
      'Mid-domestic serving extending a tray with both hands toward an off-frame recipient, friendly body-language with slight forward bow, expressive face-display showing welcoming demeanor, soft ambient interior-light',
      'Mid-grappler-deploy with the grappling-hook arm extended forward and the spool visibly unspooling cable, body crouched for the launch, free arm raised behind for balance, target structure visible in mid-distance',
      'Mid-charge forward into combat with shoulder lowered as a battering ram, both arms pulled back as fists, head tracking forward, predator-roar implied through body language, surrounding debris flying',
      'Mid-deploy from a drop-pod with the pod-hatch just opening, body emerging crouched ready to leap out, weapons already in hand, atmospheric-entry steam still venting from the pod surfaces around them',
      'Mid-strike with energy-weapon overhead in a downward arc toward an off-frame opponent, body torqued for maximum impact, weight transferred forward, energy-trail glowing behind the weapon path',
    ],
    instructions: `Each entry is ONE specific humanoid robot mid-action, 25-50 words. Format: "[action-verb] [body language detail], [object/target interaction], [environmental detail]". Vary across the 10 action categories. STRICT BAN on group / giant-mech / scavenger / squad-combat actions. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── humanoid-robots path: landscape (ATMOSPHERIC sci-fi environments, calibrated to Kevin's reference DNA) ───
  humanoid_robots_landscape: {
    format: 'simple',
    theme: `WHERE THE HUMANOID ROBOT IS for the humanoid-robots path. Each entry 25-50 words. The setting is ATMOSPHERIC + CINEMATIC.

⚠️ THE BAR — every setting reads as a cinematic frame from a sci-fi film. Kevin's reference DNA leans HEAVILY toward atmospheric outdoor environments (waterfall canyon / snow-mountain ridge / alien wilderness / overgrown ruin / fire-glow wasteland / canyon-pass with mist) and dramatic cinematic ruins. NOT corporate-clean interior. NOT urban-busy. NOT empty white spaces.

🚫 BANS:
• NO present-day 21st-century street / suburban / highway / gas-station / shopping mall
• NO modern industrial infrastructure rendered as functional
• NO clean white corporate-lab interior (boring — leave those for stock-photo)
• NO post-apoc bush-fix wasteland (rust-tech territory)
• NO active battlefield (power-armor / titan-war territory)
• NO busy crowds dominating the frame

✓ SETTING CATEGORIES (lean HEAVY on atmospheric outdoor):
  A. **ALIEN WILDERNESS — exotic biome** (~20%) — bioluminescent jungle / crystal-stalk forest / red-desert / acid-pool / glowing-mushroom-canyon, alien sky overhead
  B. **MOUNTAIN / CANYON — ATMOSPHERIC** (~15%) — snow-capped mountain cliffside / deep rocky canyon-pass / mist-shrouded ravine / red-rock canyon at sunset
  C. **WATERFALL / RIVER — sci-fi** (~10%) — cascading waterfall against alien-rock cliff / rapids in a glowing-crystal river / mist-shrouded pool below a waterfall
  D. **OVERGROWN RUIN — vine-and-tech** (~15%) — sci-fi ruin overtaken by alien flora / vine-wrapped temple / collapsed orbital-debris half-buried in jungle / ancient mechanical-structure with bioluminescent moss
  E. **FIRE-GLOW WASTELAND** (~10%) — distant volcanic-glow on the horizon / lava-channel cutting across rocky terrain / glowing-amber rift in the ground / fire-edge mountains
  F. **SCI-FI STRUCTURE EXTERIOR — ATMOSPHERIC** (~10%) — towering exotic-architecture structure rising from mist / glowing geometric monolith in alien wilderness / vast sci-fi gateway in canyon
  G. **CINEMATIC RUIN INTERIOR** (~10%) — vast ruined alien-temple interior with shafts of light / collapsed station-corridor with vegetation creeping in / mossy underground alien-cavern with crystalline structures
  H. **ATMOSPHERIC ORBITAL / STATION** (~5%) — observation-deck with vast cosmic vista / station-corridor in dramatic chiaroscuro / docking-bay open to space with planet below
  I. **NIGHT-LIT URBAN — moody dystopian** (~5%) — rain-streaked alien-city alley / glowing-neon rooftop at high altitude / moody cyberpunk-tinted street with atmospheric haze (used sparingly)

Each entry must specify:
• The setting type (atmospheric outdoor leaning heavy)
• Time-of-day or atmospheric quality (golden-hour / dawn / dusk / twilight / overcast / mist / fire-glow / etc.)
• 2-3 atmospheric / textural details (mist-rolling / bioluminescent-flora / water-cascading / vine-growth / fire-glow / alien-sky / etc.)`,
    touchpoints: [
      'Cascading waterfall against an alien-rock cliff at midday, water tumbling into a glowing-cyan pool below, moss-covered boulders in the foreground, bioluminescent flora clinging to the rock-face, atmospheric mist rising from the water-impact zone',
      'Snow-capped mountain ridge at golden hour, the rocky peak rising into a sci-fi sky with distant alien-moons visible, snow swirling in the wind, sheer cliff-face dropping away below, atmospheric blue-shadow on the leeward side',
      'Deep rocky canyon-pass at twilight with sheer red-stone walls reaching up on both sides, atmospheric mist rolling along the floor, distant glowing-rift visible at the far end of the canyon, dramatic vertical scale',
      'Overgrown alien-temple ruin at sunset, ancient sci-fi structure half-consumed by bioluminescent vines, glowing-cyan moss covering every weathered surface, vast tree-roots cracking through the floor, mist drifting through the columns',
      'Bioluminescent alien jungle at twilight, towering crystal-stalk trees rising into a violet sky, drifting magenta-and-cyan spore-particles catching the light, distant glowing-creature silhouette visible in the deep distance, atmospheric mood',
      'Volcanic wasteland at dusk, distant lava-flow glowing amber on the horizon, jagged obsidian-rock formations in mid-distance, fire-glow uplighting the underside of low clouds, atmospheric haze tinted orange-red',
      'Cinematic vast ruined alien-temple interior with dramatic shafts of light streaming through collapsed ceiling, mossy floor with bioluminescent fungi, crystalline-growths emerging from cracked walls, atmospheric mist drifting through the columns at multiple levels',
      'Snowy frozen alien-tundra at dawn, the first warm sun touching the upper rocks while the lower terrain stays cold-blue, breath-fog visible, distant ice-formations rising like spires, atmospheric mist drifting low across the snow',
      'Wide red-rock canyon at golden hour, dramatic sandstone-style cliff-faces glowing warm-amber in the late sun, atmospheric blue-shadow in the recesses, distant rock-spire pillars visible at the canyon mouth, mist rising from below',
      'Mist-shrouded ravine at twilight, towering moss-covered rock walls on both sides, glowing-cyan crystalline outcroppings embedded in the rocks, atmospheric mist rolling along the bottom, sense of mysterious depth',
      'Alien beach at sunset, glowing bioluminescent-cyan waves lapping a black-sand shore, two alien moons rising above the horizon, distant crystal-spire formations in the deep water, atmospheric warm sky tinted magenta-and-amber',
      'Towering exotic-sci-fi structure rising from atmospheric mist at dawn, monolithic geometric design with glowing-cyan accent-lines visible, the surrounding terrain a barren rocky plain, atmospheric blue ambient with first warm sun cresting',
      'Glowing-mushroom alien-cavern interior with massive bioluminescent fungi in cyan-and-magenta lighting the space, dripping moisture from the ceiling, crystalline-water pools on the floor, drifting spore-particles catching the glow',
      'High-altitude mountain ridge at twilight with sheer drop on both sides, atmospheric clouds rolling below, distant snow-capped peaks visible at horizon-line, dramatic perspective with the ridge as a knife-edge, mood contemplative',
      'Vine-wrapped collapsed orbital-debris half-buried in alien jungle at midday, vast ancient sci-fi-structure fragments choked with bioluminescent vines and roots, dappled light filtering through tree-canopy above, atmospheric mood',
      'Mossy underground crystalline-cavern with multi-color bioluminescent crystals embedded in the rock walls glowing cyan-magenta-amber, a glowing-cyan pool of crystal-water at the center, vaulted ceiling lost in shadow, atmospheric otherworldly',
      'Cyberpunk-tinted rain-streaked rooftop at night, towering arcology-building rising into the deep distance, neon-holographic signage glowing magenta-and-cyan across the wet surfaces, distant traffic of flying vehicles streaming between towers',
      'Atmospheric sci-fi observation-deck at twilight with floor-to-ceiling viewport showing a vast cosmic vista of stars and distant nebula-clouds, soft amber ambient interior lighting, contemplative quiet mood, deep cinematic depth',
      'Alien rocky cliffside at dawn with the rising sun cresting behind distant mountain-spires, sheer drop into a mist-shrouded valley below, rocky terrain in foreground with glowing-cyan crystalline outcroppings, atmospheric mood',
      'Cinematic ancient sci-fi gateway in deep canyon, monumental geometric structure carved into the canyon-wall with glowing-cyan glyph-lines, atmospheric mist drifting around the base, dramatic vertical scale, the gateway leads somewhere unseen',
    ],
    instructions: `Each entry is ONE specific ATMOSPHERIC sci-fi setting, 25-50 words. Format: "[setting type] at [time of day], [2-3 atmospheric details]". Lean HEAVY on outdoor cinematic / atmospheric ruin / alien wilderness over clean-corporate-interior. STRICT BAN on present-day Earth / clean-empty corporate space / post-apoc-wasteland / active-battlefield. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── humanoid-robots path: composition (full-body humanoid robot vertigo angles) ───
  humanoid_robots_composition: {
    format: 'simple',
    theme: `FULL-BODY HUMANOID ROBOT CAMERA ANGLES for the humanoid-robots path. Each entry 25-50 words. The composition makes the robot's DESIGN immediately legible — head-to-toe visible, environment supporting.

⚠️ MANDATORY — every angle is FULL-BODY framing (head + torso + legs visible). NEVER portrait closeup / bust shot / detail closeup / waist-up cropping. The robot fills 50-75% of the vertical frame from feet to head.

🚫 BANS:
• NO portrait closeup / NO bust shot (head-and-shoulders only)
• NO detail closeup (single hand / single foot filling frame)
• NO face-only / helmet-only shot
• NO waist-up / knees-up cropping

✓ FULL-BODY ANGLE CATEGORIES (vary across):
  • **CINEMATIC FULL-BODY EYE-LEVEL** — camera at robot's chest-height looking straight on, full body centered
  • **HERO-SHOT LOW-3/4 ANGLE** — camera below knee-level looking up at full body, robot looming hero-style
  • **WORM'S-EYE LOW** — camera at ground level looking up, full body extending into upper frame
  • **OVER-THE-SHOULDER FROM ENVIRONMENT** — POV from a partial silhouette in foreground looking at the robot in midground
  • **WIDE ESTABLISHING-SHOT** — wide vista with robot at midground as one element among many in the environment
  • **THREE-QUARTER MID-DISTANCE** — robot at 25-40% of frame, environment surrounding, classic concept-art framing
  • **GOD'S-EYE ANGLED-DOWN** — camera above looking down at the robot from above-front, full body visible from above-angle
  • **SILHOUETTE BACKLIT WIDE** — wide shot with robot silhouetted against bright background (sunset / window / explosion), full body shape readable
  • **WALKING-AWAY FROM CAMERA** — robot mid-stride walking away from camera into the scene, full body from rear
  • **SIDE-PROFILE MID-STRIDE** — camera 90-degrees to robot mid-stride, motion-blur on background, full body in motion
  • **STAIRWELL/CORRIDOR DEEP-PERSPECTIVE** — robot at end of long corridor or top of stairwell, deep perspective leading the eye
  • **WINDOW-FRAME WIDE** — robot framed by a window or doorway in foreground or midground, full body visible through frame
  • **REFLECTION-SURFACE** — robot's reflection visible in a mirror / window / wet floor, both the robot and reflection in frame
  • **REVOLVING-PLATFORM WIDE** — robot standing on a circular platform with environment radiating outward, dramatic cinematic
  • **MID-ACTION FREEZE-FRAME** — robot mid-leap / mid-strike / mid-fire caught in freeze-frame, full body in dynamic motion
  • **LONE-FIGURE WIDE-LANDSCAPE** — robot small in midground against vast landscape, scale-prover for the environment
  • **DOORWAY-EMERGENCE** — robot mid-step through a doorway / hatch / hangar-door, full body visible silhouetted in the opening
  • **HERO-POSE BACKLIT** — robot in dramatic hero-pose silhouetted against bright explosion / sun / energy-discharge in background
  • **THREE-QUARTER WITH ENVIRONMENT DEPTH** — three-quarter angle on robot with deep multi-tier environment visible behind
  • **OVERHEAD-DRONE ANGLE** — drone-perspective looking down at robot at angle, full body visible from above-3/4

Each entry must specify:
• Camera position + height + angle
• Full-body visibility (always head to feet)
• What dominates the frame (the robot's silhouette + key environmental detail)`,
    touchpoints: [
      "CINEMATIC FULL-BODY EYE-LEVEL — camera positioned at robot's chest-height looking straight on, full body centered in the frame from feet on lower edge to top of helm at upper third, environment receding equally on both sides, classic museum-piece composition",
      'HERO-SHOT LOW-3/4 ANGLE — camera positioned below knee-level looking up at the robot from 3/4 angle, full body extending into upper frame, robot looming hero-style with shoulders and helm dominant in upper half, environment visible at sides',
      "WORM'S-EYE LOW LOOKING UP — camera flush against the ground looking straight up at the robot, full body extending vertically into upper frame, sky or ceiling visible behind the robot's head, dramatic upward perspective",
      'OVER-THE-SHOULDER FROM ENVIRONMENT — POV from behind a partial silhouette in extreme foreground (another figure / equipment / doorframe) looking at the robot in midground, full body framed by the foreground element',
      'WIDE ESTABLISHING-SHOT — wide vista with the robot at midground as one element among many in the environment, full body visible at maybe 30% of frame height, multi-tier depth around them, the world is half the story',
      'THREE-QUARTER MID-DISTANCE — robot at three-quarter angle to camera at 25-40% of vertical frame, environment receding to deep distance behind, classic sci-fi concept-art framing with character + world balanced',
      "GOD'S-EYE ANGLED-DOWN — camera positioned above the robot looking down at angle (not straight-down), full body visible from above-front perspective, head and shoulders prominent in foreground, legs in midground",
      'SILHOUETTE BACKLIT WIDE — wide shot with robot silhouetted black against bright background (sunset sky / window / explosion / energy-discharge), full body silhouette readable, environment glowing behind',
      'WALKING-AWAY FROM CAMERA — robot mid-stride walking away from camera into the deeper scene, full body visible from rear, head at upper-frame, feet at lower-frame, the destination ahead of them visible',
      'SIDE-PROFILE MID-STRIDE — camera positioned 90-degrees to robot mid-stride at chest-height, motion-blur on background, full body in dynamic motion from one side, every joint articulation visible',
      'STAIRWELL DEEP-PERSPECTIVE — robot at top of long stairwell or end of a deep corridor with strong perspective leading the eye, full body framed at the vanishing-point destination, dramatic geometric composition',
      'WINDOW-FRAME WIDE — robot framed by a window or doorway in foreground or midground, full body visible through the frame, the frame itself creating compositional interest, environment visible beyond',
      "REFLECTION-SURFACE FULL-BODY — robot's full body reflection visible in a mirror / window / wet floor / glass-table-surface, both the robot and the reflection in the frame, doubling the figure",
      'REVOLVING-PLATFORM WIDE-CIRCULAR — robot standing on a circular platform with environment radiating outward around them, full body visible centered on the platform, dramatic cinematic angle',
      'MID-ACTION FREEZE-FRAME — robot mid-leap / mid-strike / mid-fire / mid-charge caught in a freeze-frame moment, full body in dynamic motion captured at the peak of action, motion-blur on background',
      'LONE-FIGURE WIDE-LANDSCAPE — robot small in midground at maybe 15% of frame height against a vast environmental landscape, scale-prover for the world, the figure tiny but readable as the focal subject',
      'DOORWAY-EMERGENCE — robot mid-step through a doorway / hatch / hangar-door / blast-door, full body visible silhouetted in the opening, the environment beyond visible past them',
      'HERO-POSE BACKLIT EXPLOSION — robot in dramatic hero-pose silhouetted against a bright background explosion / sun / energy-discharge, full body silhouette readable, theatrical action-movie composition',
      'THREE-QUARTER WITH DEEP ENVIRONMENT — three-quarter angle on robot at 30-40% of frame height with multi-tier deep environment visible behind (foreground floor / midground robot / deep distance world)',
      'OVERHEAD-DRONE ANGLE — drone-perspective looking down at robot from above at a 60-70 degree angle, full body visible from above-3/4, environment visible spreading out below them, hero-shot from above',
    ],
    instructions: `Each entry is ONE specific FULL-BODY humanoid robot camera angle, 25-50 words. Format: "ANGLE NAME CAPS — camera position + height + angle + what dominates the frame + environmental context". STRICT BAN on portrait / bust / detail closeups / waist-up cropping. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── humanoid-robots path: lighting (theatrical / mood-driven) ───
  humanoid_robots_lighting: {
    format: 'simple',
    theme: `THEATRICAL LIGHTING for the humanoid-robots path. Each entry 20-40 words. Lighting that makes the robot's DESIGN sing — every panel, every glow, every accent legible.

⚠️ STRICT BAN — NO bland flat office lighting. NO 21st-century practical / mundane. NO blank empty backgrounds.

✓ MANDATORY VARIETY:
  A. **CINEMATIC RIM-LIGHT** (~15%) — strong directional rim-light catching the robot's silhouette edges, hard shadow in body-mass with bright edge-line
  B. **DRAMATIC THREE-POINT** (~15%) — classical cinematography three-point lighting with key / fill / rim, robot rendering as a sculpted museum-piece
  C. **NEON CYBERPUNK MULTI-COLOR** (~15%) — neon signage in multiple colors uplighting / sidelighting the robot, magenta + cyan + amber blend
  D. **GOLDEN-HOUR ROBOT-PORTRAIT** (~10%) — warm golden-hour sun raking across the chassis, long shadows, atmospheric beauty
  E. **EXPLOSION-BACKLIT SILHOUETTE** (~10%) — distant explosion or energy-discharge backlighting the robot, silhouette edge-orange-amber
  F. **SOFT INTERIOR AMBIENT** (~10%) — clean diffuse interior lighting from above (laboratory / corporate / station), shadowless precision
  G. **STORMY DRAMATIC SKY** (~5%) — overcast or thunderstorm sky with intermittent lightning briefly silhouetting the robot
  H. **HOLOGRAPHIC PROJECTION GLOW** (~10%) — robot lit primarily by holographic-displays / data-streams floating around it
  I. **DAWN COLD-BLUE PRE-MISSION** (~5%) — pre-sunrise cold blue ambient with warm accent from robot\'s own glowing chest-core or energy-conduits
  J. **NIGHT WITH ROBOT\'S OWN GLOW** (~5%) — deep-dark scene with the robot\'s own glowing eyes / chest-core / energy-conduits as primary light source`,
    touchpoints: [
      "CINEMATIC RIM-LIGHT — strong directional rim-light catching the robot's silhouette edges in bright cyan-white from behind-left, hard shadow on the body-mass with bright edge-line tracing every joint and panel, dramatic cinematic separation from background",
      'DRAMATIC THREE-POINT — classical cinematography three-point lighting: warm key from front-left, cool fill from front-right, bright rim from behind, robot rendering as a sculpted museum-piece with every panel and surface texture readable',
      'NEON CYBERPUNK MULTI-COLOR — neon signage in magenta and cyan and amber uplighting / sidelighting the robot in multiple direction, color blending across the chassis, wet pavement reflections doubling the colors',
      'GOLDEN-HOUR ROBOT-PORTRAIT — warm golden-hour sun raking across the chassis at low angle, long shadows stretching across the ground, atmospheric haze gold, every surface detail catching the warm light beautifully',
      'EXPLOSION-BACKLIT SILHOUETTE — distant explosion or energy-discharge backlighting the robot from behind, silhouette edge-orange-amber against the bright bloom, smoke and embers floating in front of the robot adding depth',
      'SOFT INTERIOR AMBIENT — clean diffuse interior lighting from above (laboratory / corporate / station overhead LED arrays), shadowless precision, robot rendering in cool clean tones, technical mood',
      'STORMY DRAMATIC SKY — overcast thunderstorm sky with intermittent lightning flashes briefly silhouetting the robot in stark white-on-dark, deep shadow between flashes, dramatic atmospheric tension',
      'HOLOGRAPHIC PROJECTION GLOW — robot lit primarily by holographic-displays and data-streams floating around it in cyan and amber and magenta, soft accent lighting from multiple angles, technical sci-fi atmosphere',
      "DAWN COLD-BLUE PRE-MISSION — pre-sunrise cold blue ambient ground-light with warm accent from the robot's own glowing chest-core / energy-conduits / running-lights, dual-color contrast, mission-readiness mood",
      "NIGHT ROBOT-SELF-LIT — deep-dark scene with the robot's own glowing eyes / chest-core / energy-conduits as primary illumination, hard dramatic shadows on the surrounding environment, mysterious mood",
      'SUNSET BACKLIT WITH ATMOSPHERIC HAZE — sun at horizon behind the robot with warm-orange atmospheric haze diffusing the light, robot silhouetted edge-amber, contemplative mood',
      "OVERHEAD KEY WITH SHADOW POOL — strong overhead directional key-light casting hard shadow pool around the robot's feet, body in high contrast, theatrical museum-piece composition",
      'WINDOWED-INTERIOR WITH LIGHT-SHAFTS — clean interior lit by sun-shafts streaming through tall windows at angle, light-shafts catching airborne dust, robot positioned in the shaft for hero-moment',
      'INDUSTRIAL SODIUM-AMBER WITH STROBE-ACCENT — sci-fi industrial sodium-amber overhead with intermittent strobing red emergency-light, hard shadow contrast pulsing in rhythm, urgency mood',
      'CRYSTAL-CAVE BIOLUMINESCENT GLOW — bioluminescent crystals or alien-flora providing primary glow in cyan or magenta from multiple angles, ethereal otherworldly lighting, alien mood',
    ],
    instructions: `Each entry is ONE specific theatrical lighting setup, 20-40 words. Format: "LIGHTING MODE CAPS — [source + direction + color + shadow character + mood/context]". Distribute across the 10 buckets. STRICT BAN on bland flat office / 21st-century practical / blank empty backgrounds. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── humanoid-robots path: drama (40%-gated visual flourishes) ───
  humanoid_robots_drama: {
    format: 'simple',
    theme: `40%-GATED VISUAL FLOURISH PHENOMENA for the humanoid-robots path — a visual element that amplifies the robot\'s moment. Each entry 25-50 words.

⚠️ STRICT — each phenomenon adds visual interest WITHOUT cluttering the robot subject. The robot remains the focal point.

✓ VISUAL FLOURISH CATEGORIES (vary across):
  • **HOLOGRAPHIC INTERFACE FLOATING** — holographic data-display or interface floating in mid-air near the robot
  • **ENERGY-DISCHARGE PARTICLE-SHOWER** — sparks or energy-particles cascading from a weapon-discharge or activation
  • **COOLANT-VAPOR JET** — pressurized coolant-vapor venting from a joint or panel in a visible plume
  • **DEBRIS-FIELD MID-AIR** — chunks of debris floating mid-air from a recent impact (slow-motion effect)
  • **ATMOSPHERIC LIGHT-SHAFT** — dramatic shaft of light cutting through the scene illuminating the robot
  • **SECONDARY ROBOT-COMPANION DISTANT** — a second robot visible in the deep distance (NOT competing for focus)
  • **PASSING-VEHICLE STREAK** — sci-fi vehicle streaking past in the background as motion-blur
  • **CROWD-OF-FIGURES DISTANT** — silhouettes of human figures or crowd in the deep distance (background life)
  • **WEATHER-EFFECT — rain / snow / mist** — atmospheric weather element across the scene
  • **PROJECTILE-IN-FLIGHT** — a projectile (bullet / energy-bolt / arrow) caught mid-flight in frame
  • **EXPLOSION-FAR-DISTANT** — explosion in the deep distance providing scale and energy
  • **DRONE-CAMERA SWARM** — small camera-drones hovering around the robot
  • **PUDDLES-AND-REFLECTIONS** — wet ground or reflective surface doubling the robot\'s presence
  • **POWER-CABLE BUNDLES** — bundles of glowing power-cables snaking through the scene
  • **STEAM-VENT IN GROUND** — steam erupting from a grate or vent in the floor near the robot
  • **GLOWING ENERGY-FIELD AROUND ROBOT** — visible energy-field / shield / aura around the robot
  • **FALLING CONFETTI / PETAL** — particulate falling through the scene (snow / ash / petals / data-fragments)
  • **DISTANT-CITY-SKYLINE LIT** — futuristic city skyline glowing in the distance as backdrop
  • **PASSING-AIRSHIP OVERHEAD** — sci-fi airship or shuttle passing overhead at distance
  • **ELECTRICAL-DISCHARGE FROM EQUIPMENT** — equipment in the scene visibly arcing or discharging electricity`,
    touchpoints: [
      "HOLOGRAPHIC INTERFACE FLOATING — translucent holographic data-display projecting in mid-air near the robot's outstretched hand, multi-layer information panels rotating slow with cyan-and-amber text, atmospheric haze catching the projection",
      'ENERGY-DISCHARGE PARTICLE-SHOWER — sparks and energy-particles cascading downward from a recently-fired weapon or activation, glowing trails arcing through the air, brief over-exposure where particles are densest',
      "COOLANT-VAPOR JET — pressurized coolant-vapor venting from a joint at the robot's shoulder or hip in a visible white plume, hot-air shimmer distorting the air around the vent, characteristic hiss-implied",
      'DEBRIS-FIELD MID-AIR — chunks of debris floating mid-air around the robot in slow-motion freeze-frame, dust and fragments suspended at various heights, frozen-moment-of-impact composition',
      'ATMOSPHERIC LIGHT-SHAFT — dramatic god-ray shaft of light cutting diagonally through the scene illuminating the robot from above-side, dust-motes catching the light, theatrical cinematic mood',
      'SECONDARY ROBOT-COMPANION DISTANT — a second humanoid robot visible in the deep distance behind the hero robot, smaller and out-of-focus (NOT competing for focus), suggesting a wider world of robots',
      'PASSING-VEHICLE STREAK — sci-fi hovering or flying vehicle streaking past in the background as motion-blur, light-trail extending behind, suggesting a busy futuristic world',
      'CROWD-OF-FIGURES DISTANT — silhouettes of human figures or crowd in the deep distance going about their lives, providing scale and social-context, the hero robot in foreground/midground',
      'WEATHER-EFFECT RAIN — heavy sci-fi rain falling across the scene, all surfaces reflecting any light sources, the robot mid-action in the deluge, water cascading off chassis-panels',
      'PROJECTILE-IN-FLIGHT — an energy-bolt or projectile caught mid-flight crossing the frame near the robot, glowing trail extending behind it, freeze-frame moment of action',
      'EXPLOSION-FAR-DISTANT — explosion in the deep distance providing fire-glow on the horizon, smoke-column rising into the sky, the hero robot in mid-distance silhouetted against the orange glow',
      'DRONE-CAMERA SWARM — small camera-drones hovering around the robot at multiple altitudes filming or scanning, drones with glowing optic-eyes facing inward toward the subject, technological surveillance mood',
      "PUDDLES-AND-REFLECTIONS — wet ground / reflective floor / glass surface doubling the robot's presence in mirror-reflection, both the robot and its reflection in frame composition",
      'POWER-CABLE BUNDLES — bundles of glowing power-cables (cyan or amber energy visible through translucent sheaths) snaking through the scene connecting various equipment, scale-prover textural detail',
      'STEAM-VENT IN GROUND — pressurized steam erupting from a grate or vent in the floor near the robot in a vertical plume, the robot partially obscured at lower-body level by the steam',
      'GLOWING ENERGY-FIELD AROUND ROBOT — visible energy-field / shield / aura glowing softly around the robot, multi-color (cyan / amber) shimmer at the field-edge, sci-fi defensive system active',
      'FALLING PARTICULATE — particulate falling through the scene (sci-fi-snow / ash / cherry-blossom-equivalent / data-fragments), drifting in soft motion across the frame, contemplative atmospheric mood',
      'DISTANT CITY-SKYLINE — futuristic city skyline glowing in the deep distance as backdrop, towers with neon-signage and flying-vehicle traffic visible as distant motion-blur, sci-fi world context',
      'PASSING-AIRSHIP OVERHEAD — sci-fi airship / shuttle / dropship passing overhead at high altitude in the deep distance, its silhouette against the sky, providing world-scale context',
      'ELECTRICAL-DISCHARGE FROM EQUIPMENT — equipment in the scene (console / generator / control-panel) visibly arcing or discharging electricity, bright sparks contained to that equipment, scientific drama',
    ],
    instructions: `Each entry is ONE specific visual flourish phenomenon, 25-50 words. Format: "PHENOMENON NAME CAPS — primary visual action + atmospheric detail + relationship-to-robot". Amplifies the robot\'s moment WITHOUT cluttering the focal subject. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── cyborg-woman path: composition (mixed closeup + full-body cyborg-woman framings) ───
  cyborg_woman_composition: {
    format: 'simple',
    theme: `CINEMATIC CAMERA ANGLES for a CYBORG WOMAN (half-human half-machine, FEMALE, beautiful + terrifying). Each entry 25-50 words. Mix of CLOSEUP detail-shots (camera tight on face/neck/shoulders showing the organic-to-chrome transition) AND FULL-BODY action-framing (showing her engaged mid-motion in the wider scene).

⚠️ THE BAR — every angle conveys the woman + machine TRANSITION (organic skin breaking to mechanical reveals). Ex Machina / Alita / Ghost in the Shell / Blade Runner 2049 / Westworld lineage. Hyper-real cinematic 3D / VFX-quality.

🚫 BANS:
• NO portrait closeups on a 100%-organic face (her face MUST show cyborg integration)
• NO head-on walking-toward-camera modeling pose
• NO sexy-pinup framing (this is cinematic concept-art, not glamour)
• NO multiple figures — she is SOLO

✓ DISTRIBUTION (target ~60% CLOSEUP / ~40% FULL-BODY):
  A. **CLOSEUP DETAIL FRAMINGS (~60%)** — tight on face/neck/shoulders so the organic-to-chrome TRANSITION is the entire composition. Show: temple-port array detail / fiber-optic cables exiting at neck / translucent jaw panel revealing servos / chrome iris with aperture rings / subdermal circuit-veining glowing across cheek / neural-jack port behind ear / partial skull-plate replacement / one mechanical eye + one organic eye / mechanical brow-ridge / clavicle-port array. Camera close enough to see individual servos and glowing fiber-bundles.
  B. **FULL-BODY ACTION FRAMINGS (~40%)** — wide enough to show her standing / mid-stride / mid-action with environment around her. Body engaged in motion, not posing. Camera angles: low-angle hero-shot / side-profile mid-stride / three-quarter mid-action / over-the-shoulder from environment / silhouetted backlit wide / atmospheric vista with her in mid-distance.

CRITICAL: closeup entries should describe FRAMING + WHAT to focus on (which cyborg feature dominates the frame, what scene-context bleeds in at edges). Full-body entries should describe CAMERA POSITION + her POSE + how the environment frames her.`,
    touchpoints: [
      'CLOSEUP — extreme tight on the LEFT TEMPLE-PORT ARRAY filling left third of frame, four fiber-optic cables exiting backward into a translucent jaw-panel revealing the servo-motors beneath, her left eye visible in upper-right corner with chrome aperture-rings rotating slow, atmospheric haze behind',
      'CLOSEUP — three-quarter face composition with one organic eye and one mechanical chrome-iris eye both in sharp focus, subdermal circuit-veining glowing faint along the cheekbone in her glow-color, the translucent jaw-panel hinged open revealing fiber bundles, soft rim-light from behind',
      'CLOSEUP — over-the-shoulder rear-of-head shot showing the NEURAL-JACK PORT at the base of the skull (chrome flange with multiple data-ports), back of neck visible with subdermal circuit-veins glowing, a wisp of her hair caught against the chrome',
      'CLOSEUP — front-on jawline-to-collarbone composition framed tight, a translucent skin-patch at the throat revealing the larynx-replacement chrome assembly and a glowing power-conduit, organic chest-decolletage visible at bottom-edge',
      'CLOSEUP — extreme close on the chrome iris of her mechanical right eye, the aperture-rings visibly rotating, micro-servos at the inner corner adjusting focus, faint reflection of the room visible in the chrome surface, soft atmospheric mood',
      'CLOSEUP — three-quarter view showing the partial skull-plate replacement across her forehead and right temple in mirror-chrome, hair swept to one side revealing the seam where organic skin meets chrome, glowing fiber-conduits running back into the hair',
      'CLOSEUP — profile composition with the mechanical brow-ridge dominating the silhouette (chrome supraorbital arc with multi-iris sensor cluster), eye downcast with long lashes, exposed servo-pistons visible at the temple, atmospheric backlight',
      'CLOSEUP — front-on shoulders-up composition with both clavicle-port arrays visible (chrome flanges with data-ports along the collarbone), translucent skin between revealing a glowing power-core in the upper chest, hair tied back, expression contemplative',
      'CLOSEUP — looking down at her own forearm from her POV (subjective angle), the translucent skin revealing chrome bones / servo-pistons / fiber-cables glowing in her glow-color, the gesture of her articulated mechanical hand reaching toward something off-frame',
      'CLOSEUP — under-chin upward angle showing the underside of her jaw with the translucent jaw-panel hinged open revealing internal servos, throat visible with cyborg larynx-assembly chrome, atmospheric mood',
      'FULL-BODY — three-quarter angle mid-stride through an atmospheric interior corridor, her cyborg-mechanical leg-joints visible through chrome panels at the hip and knee, organic torso visible above, head turned mid-motion, environment receding behind',
      'FULL-BODY — low-angle hero-shot looking up at her standing 1.7m tall, full body visible with mechanical reveals at shoulders / hips / wrists / temples, atmospheric vista receding behind, dramatic backlit cinematic framing',
      'FULL-BODY — side-profile mid-action with her arm extended forward (mechanical wrist + chrome forearm visible beneath organic skin), full body in frame from feet to top of head, motion-blur on background, cinematic',
      'FULL-BODY — silhouetted backlit wide shot of her standing at the threshold of a doorway / window / structural opening, full body visible with mechanical reveals glowing in her glow-color through her organic skin, environment beyond glowing dramatically',
      'FULL-BODY — high-3/4-angle from above-front looking down at her, full body visible from above-perspective, mechanical reveals at shoulders / spine / hips visible through translucent skin patches, environment radiating around her',
      'FULL-BODY — over-the-shoulder from a partial environmental silhouette in foreground (machinery / pillar / instrument-console), her full body visible in midground, cyborg reveals across multiple body parts catching the light',
      'FULL-BODY — three-quarter mid-pose seated on an environmental element (low wall / console / ledge), one leg extended with chrome-knee visible through translucent panel, organic torso leaning forward, contemplative pose, environment depth behind',
      'FULL-BODY — atmospheric wide-vista with her small in midground at maybe 30% of frame height, environmental scale dominant around her, mechanical reveals still visible glowing through the chassis-organic blend, scale-prover composition',
      'FULL-BODY — mid-action freeze-frame caught mid-motion (mid-leap / mid-strike / mid-deploy / mid-recoil), full body in dynamic motion, mechanical reveals visible through the motion-blur on her organic limbs',
      'FULL-BODY — three-quarter angle mid-stride forward through atmospheric haze (mist / steam / smoke), full body emerging from the haze, mechanical reveals visible glowing through the diffusion, cinematic atmospheric mood',
    ],
    instructions: `Each entry is ONE specific cyborg-woman cinematic framing, 25-50 words. Write each as a FULL DESCRIPTIVE SENTENCE describing the camera angle + what dominates the frame + her pose + environmental context. VARIETY MANDATE — vary opening words, body-part focus, environmental anchor, mood beat. Roughly 60% closeup detail-shots / 40% full-body action-framings. Mix cyborg body-parts focused on (temple / jaw / neck / shoulders / chest / forearm / leg-joint / spine / clavicle / hip-joint). Mix camera angles (low / high / side / 3/4 / over-shoulder / from-above / from-below). Mix moods (contemplative / mid-action / stalking / mid-emerging / mid-arrival). STRICT BAN on 100%-organic-face closeups / head-on-modeling-walking / sexy-pinup framings. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── cyborg-woman path: drama (40%-gated atmospheric flourishes) ───
  cyborg_woman_drama: {
    format: 'simple',
    theme: `40%-GATED ATMOSPHERIC FLOURISHES for the cyborg-woman path. Each entry 25-50 words. A subtle environmental or cyborg-tech flourish that amplifies the moment WITHOUT cluttering her focal subject.

⚠️ MANDATORY — every flourish supports HER as the focal subject. NEVER competes for attention. Ex Machina / Alita / Ghost in the Shell / Blade Runner 2049 lineage.

🚫 BANS:
• NO additional figures (she is SOLO)
• NO weapons in her hand (her hand may have a tool, but NO combat-weaponry as drama flourish)
• NO grotesque body-horror (mechanical reveals are ORNATE not body-horror)

✓ FLOURISH CATEGORIES (vary across):
  • **HOLOGRAPHIC HUD-INTERFACE** — translucent holographic display floating in mid-air, data-streams visible
  • **POWER-CORE PULSE-GLOW** — visible glow from her power-core through translucent chest-section pulsing
  • **FIBER-OPTIC CABLE LIGHT-TRACE** — fiber-optic cables glowing in her glow-color tracing visible paths through her body
  • **NANO-TECH GLOW UNDER SKIN** — subdermal nano-tech glowing in her glow-color in webs / patterns across visible skin
  • **CHROMATIC ABERRATION HALO** — subtle chromatic-aberration halo around her in the glow-color
  • **STEAM-VENT FROM JOINT** — tiny coolant-vapor venting from a joint (shoulder / wrist / hip)
  • **DUST-MOTES IN LIGHT-SHAFT** — atmospheric dust-motes catching a light-shaft cutting across the scene
  • **REFLECTION-DOUBLE** — her reflection visible in a chrome surface / glass / wet floor doubling her presence
  • **DRIFTING PARTICULATE** — sci-fi particulate drifting through the scene (data-fragments / cherry-blossom / snow / ash)
  • **WINDOW VIEW DISTANT** — a vista visible through a window in the background (cityscape / starfield / planetscape)
  • **DRONE-EYE WATCHING** — a tiny drone hovering in the deep background watching her (no interaction)
  • **CIRCUIT-DIAGRAM PROJECTION** — a circuit-diagram or schematic holographic-projection in the scene
  • **LIGHT-RIPPLE FROM HER MOTION** — light visibly rippling outward from her motion as if disturbing the air
  • **GLITCH-ARTIFACT MICRO-FLASH** — micro-glitch artifacts flickering briefly around her edges
  • **POLLEN / SPORE / ASH DRIFT** — soft particulate drifting through the scene atmospherically
  • **FALLING WATER / STEAM-COLUMN** — atmospheric water-feature or steam-column in the background
  • **NEON-SIGN COLOR-BLEED** — colored neon-light bleeding into the scene from off-frame source
  • **HOLO-FRAGMENT OF MEMORY** — translucent holographic memory-fragment fading at the edge of frame
  • **MECHANICAL-BIRD ALIGHTING** — a small mechanical bird or sci-fi creature alighting near her at the periphery
  • **CONDENSATION ON CHROME** — visible condensation droplets on her chrome surfaces catching the light`,
    touchpoints: [
      'HOLOGRAPHIC HUD-INTERFACE — translucent multi-layer holographic display floating in mid-air near her shoulder, data-streams rotating slow in cyan and amber, atmospheric haze catching the projection, technical sci-fi mood',
      'POWER-CORE PULSE-GLOW — visible glow from her chest power-core pulsing slow through a translucent chest-section in her glow-color, soft illumination spilling out onto her organic skin around the edges of the translucent panel',
      'FIBER-OPTIC CABLE LIGHT-TRACE — fiber-optic cables visible exiting from her neck / temple / wrist tracing glowing paths through the air in her glow-color, the cables ending at off-frame connections, sci-fi technological',
      'NANO-TECH GLOW UNDER SKIN — subdermal nano-tech glowing in her glow-color in delicate web-patterns across her exposed cheek / temple / forearm, the patterns slowly shifting and pulsing, ethereal beauty',
      'CHROMATIC ABERRATION HALO — subtle chromatic-aberration halo visible around her silhouette in her glow-color, a soft technological aura suggesting her cyborg-nature distorting the air around her',
      'STEAM-VENT FROM JOINT — tiny coolant-vapor venting from a shoulder / wrist / hip joint in a small visible plume, white mist briefly silhouetting against her body, momentary technical detail',
      'DUST-MOTES IN LIGHT-SHAFT — atmospheric dust-motes catching a single dramatic light-shaft cutting across the scene, the shaft passing through her partly silhouetting her chrome reveals',
      'REFLECTION-DOUBLE — her reflection visible in a chrome surface / glass / wet floor doubling her presence in the frame, the reflection slightly distorted at the edges, atmospheric mood',
      'DRIFTING PARTICULATE — sci-fi particulate drifting slowly through the scene (data-fragments / cherry-blossom / snow / ash) catching the light, soft atmospheric quality',
      'WINDOW VIEW DISTANT — vast vista visible through a window in the background (futuristic cityscape / starfield / planetscape / atmospheric landscape), her standing silhouetted against the vista, scale-prover',
      'DRONE-EYE WATCHING — a tiny drone hovering in the deep background watching her without interaction, single glowing optic-eye on the drone, surveillance-tech atmosphere',
      'CIRCUIT-DIAGRAM PROJECTION — circuit-diagram or schematic holographic-projection floating in the scene at midground, displaying her own bio-mechanical anatomy, soft cyan glow',
      'LIGHT-RIPPLE FROM HER MOTION — visible light-ripples emanating outward from her motion as if her cyborg-nature disturbs the surrounding air, soft chromatic halo following her movement',
      'GLITCH-ARTIFACT MICRO-FLASH — micro-glitch artifacts flickering briefly around her edges (pixel-displacement / chromatic-aberration / digital-static), suggesting cyborg-perception distorting reality at her edges',
      'POLLEN-SPORE DRIFT — soft pollen / spore / ash particulate drifting through the scene atmospherically, catching the rim-light, atmospheric beauty',
      'FALLING WATER ATMOSPHERIC — water-feature in the background (cascading fountain / cliff-spring / dripping rain), the water catching the lighting and adding atmospheric depth',
      'NEON-SIGN COLOR-BLEED — colored neon-light bleeding into the scene from an off-frame source (magenta / cyan / amber), the color washing over her chrome surfaces',
      'HOLO-FRAGMENT OF MEMORY — translucent holographic memory-fragment / image fading at the edge of frame, suggesting cyborg memory-streams visible to the viewer but ephemeral',
      'CONDENSATION ON CHROME — visible condensation droplets on her chrome surfaces catching the light beautifully, suggesting cool environment or temperature differential, tactile detail',
      'MECHANICAL-MOTH ALIGHTING — a small mechanical-moth or sci-fi micro-creature with translucent wings alighting near her shoulder at the periphery of frame, delicate detail',
    ],
    instructions: `Each entry is ONE specific cyborg-woman atmospheric flourish, 25-50 words. Format: "FLOURISH NAME CAPS — primary visual action + atmospheric detail + relationship-to-her". Amplifies her presence WITHOUT cluttering. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── cyborg-woman path: material/finish (the cyborg parts' material story) ───
  cyborg_woman_material: {
    format: 'simple',
    theme: `CYBORG MATERIAL/FINISH for the cyborg-woman path — ONE specific material + finish describing what her cyborg parts are made of. Each entry 20-40 words.

⚠️ THE BAR — variety. Move BEYOND default chrome+steel. Mix premium / exotic / industrial / antique / alien / composite materials. Each entry describes ONE material treatment with specific color + texture + finish details.

🚫 BANS:
• NO description of which body part (that's other axes' job — the material applies wherever her cyborg parts are)
• NO action / pose / setting description
• NO duplicate "chrome" entries — variety mandatory

✓ MATERIAL CATEGORIES (vary across):
  A. **METALS** — chrome, brushed titanium, polished brass, antique copper, mirror-silver, gunmetal-black, blackened steel, oxidized bronze, rose-gold, platinum-pearl, oil-slick iridescent chrome, satin pewter, hammered gold-leaf
  B. **CERAMICS / COMPOSITES** — pearl-ivory ceramic, mother-of-pearl iridescent ceramic, blue-and-white porcelain, bone-china glaze with painted blue-willow circuitry, matte-black carbon-fiber weave, kevlar-mesh composite, glass-fiber resin, lacquer-finish lacquered enamel
  C. **GLASSY / TRANSPARENT** — obsidian-glass, smoky quartz panels, frosted crystal, fossilized-amber resin with embedded mechanical components, dichroic glass, sea-glass green translucent, prismatic dichroic-shimmer
  D. **EXOTIC / ALIEN-TECH** — xenomaterial alien-hull plating with shifting iridescence, fossilized-resin from alien biotech, bioluminescent-coral plating, mother-of-mantis chitinous lacquer, crystalline rare-earth alloy, antimatter-coated mirror surface, otherworldly opal-shimmer
  E. **STEAMPUNK / INDUSTRIAL** — brass + copper steampunk plating, weathered ironclad blue-steel, wrought-iron filigree, gilt-and-mahogany inlay, hammered-pewter armor, riveted bronze plate
  F. **ORGANIC-CODED** — bone-white ivory chrome, jade-green stone-inlay plating, marble-veined polished stone, coral-pink ceramic with marine textures
  G. **NEON / FUTURIST** — neon-magenta plastic with embedded LED grids, glow-acrylic neon-yellow translucent, holographic-foil chrome, prismatic plastic dichroic-iridescence, fluorescent-resin material
  H. **WEATHERED / LIVED-IN** — desert-sand worn brass, rain-stained patina chrome, mossy ancient-tech with bioluminescent growth, war-torn scarred titanium, oxidized verdigris-copper

Each entry must specify:
• Primary material name (chrome / brass / pearl-ivory / etc.)
• Color/finish nuance (warm / cold / iridescent / matte / polished / hammered)
• Texture or detail (filigree / etched pattern / embedded LEDs / smooth / hammered)`,
    touchpoints: [
      'Rose-gold filigree chrome with floral-engraved scrollwork etched across every panel, warm metallic surface catching light in soft golden-pink reflections, fine ornate detailing in the seams.',
      'Mother-of-pearl iridescent ceramic with cool blue-violet shimmer shifting across the surface, smooth matte porcelain finish, tiny rainbow-glints catching every angle of light.',
      'Oil-slick iridescent chrome cycling through magenta-cyan-amber rainbow blooms across the surface, mirror-polished but constantly shifting hue, otherworldly dichroic finish.',
      'Brushed titanium-silver with subtle horizontal grain, cool matte finish, no reflection but every panel catching ambient light with even soft glow, military precision.',
      'Antique copper-and-brass steampunk plating with green-verdigris weathering in the seams, hammered hand-finish, rivets visible along every joint, lived-in industrial elegance.',
      'Pearl-ivory ceramic with hand-painted blue-willow circuitry traced delicately across every panel, smooth glaze finish, Wedgwood porcelain aesthetic.',
      'Obsidian-glass plating with deep volcanic-black surface flecked with embedded gold dust, polished mirror-smooth, glossy and predatory.',
      'Xenomaterial alien-hull plating with shifting bioluminescent iridescence cycling through deep purples and electric teals, organic-tech curves blending with crystalline facets.',
      'Matte-black carbon-fiber weave with visible twill texture, light-absorbing surface contrasted by glowing energy-conduit seams in cyan running between panels.',
      'Hammered-pewter armor with intricate gothic filigree, dark gunmetal finish accented with silver-leaf inlay along the edges, ornate and theatrical.',
      'Fossilized amber resin with mechanical components visibly preserved like prehistoric specimens inside the translucent honey-gold material, otherworldly artifact aesthetic.',
      'Neon-magenta translucent plastic with embedded LED grid pulsing in pink-and-cyan patterns under the surface, glow-acrylic finish, retro-futurist cyberpunk.',
      'Mirror-silver chrome with mother-of-pearl iridescent overlay, the surface alternating between sharp mirror reflection and soft prismatic shimmer, premium aesthetic.',
      'Bone-white ivory chrome with delicate gold-leaf engraving along every seam, ceremonial aesthetic, smooth polished finish with restrained decorative inlay.',
      'Smoky quartz translucent panels revealing internal mechanical components through the gray-violet semi-transparent surface, polished gem-cut faceted edges.',
      'Dichroic glass plating shifting through rainbow spectrums depending on viewing angle, smooth polished finish with otherworldly color-shift quality.',
      'Wrought-iron blackened steel with intricate baroque scrollwork etched into every panel, weathered dark gunmetal finish, gothic ornate aesthetic.',
      'Champagne-gold chrome with electric-blue conduit inlay running between the panels, warm metallic finish with glowing accents tracing structural seams.',
      'Bioluminescent-coral organic plating with marine-life texture, pulsing soft pink-and-amber glow from within the coral-like structures, organic-tech alien aesthetic.',
      'Prismatic plastic with dichroic-iridescence shimmering across the surface, translucent neon-yellow underlit by internal LED grid, holographic futurist finish.',
      'Aged jade-green stone-inlay plating with veining of copper-leaf threading through the surface, organic-tech meets ancient-artifact aesthetic.',
      'Mirror-finish platinum with carved deco geometric patterns etched across every panel, smooth liquid-mercury reflectiveness, art-deco luxury aesthetic.',
      'Holographic-foil chrome with rainbow oil-slick refraction, prismatic dichroic surface constantly shifting through magenta-cyan-amber, otherworldly synthetic finish.',
      'Lacquer-finish enamel in deep burgundy with hand-painted gold scrollwork, glossy automotive-grade depth, decorative aristocratic aesthetic.',
      'Crystalline rare-earth alloy with internal lattice-structure visible through semi-transparent panels, faintly glowing blue-white at the lattice intersections, alien-tech elegance.',
    ],
    instructions: `Each entry is ONE specific cyborg-material/finish, 20-40 words. Format: "[material name] with [color + finish nuance], [texture or detail]". Vary across the 8 material categories. STRICT BAN on duplicate chrome-only entries. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── cyborg-woman path: MID-BODY framings (chest-up / waist-up — bridge between portrait and full-body) ───
  cyborg_mid_body_framings: {
    format: 'simple',
    theme: `CHEST-UP and WAIST-UP CINEMATIC FRAMINGS for a CYBORG WOMAN — the bridge between portrait-closeup and full-body. Each entry 20-35 words. Camera positioned to SHOW her cyborg chassis from face down through shoulders, arms, torso, hips. The goal: showcase visible WIRING / CIRCUITRY / GLOWING PANELS / EXPOSED MECHANISM across multiple body parts, not just face. Ex Machina / Alita / Ghost in the Shell / Westworld lineage.

⚠️ THE BAR — every framing reveals 3-5 body parts with visible cyborg detail. Mid-body framings are NOT bikini-pinup shots — they are CINEMATIC CONCEPT-ART showcasing the woman+machine fusion across chest/arms/torso/hips. Visible CIRCUITRY, exposed GEARS, glowing PANELS, internal LIGHT bleeding through translucent sections.

🚫 STRICT BANS:
• NO bikini / two-piece / lingerie / cleavage-focal framings — this is concept-art, not glamour
• NO full-body walking-toward-camera modeling pose
• NO head-on symmetric stand-and-pose framings
• NO smooth-bodysuit chrome catsuit framings (must show CHASSIS DETAIL not smooth surface)
• NO sexy-pinup-pose framings (kneeling-arched-back, hand-on-hip-sashay, butt-shots)
• NO multiple figures — she is SOLO

✓ FRAMING DISTRIBUTION:
  • 60% CHEST-UP — face + shoulders + upper-chest + upper-arms visible, showing cyborg detail across shoulders / chest panels / clavicle-ports / collar mechanism / arm chassis to bicep
  • 40% WAIST-UP — face + shoulders + chest + torso + hands visible, showing cyborg detail across the longer body span including chest core + torso panels + forearms + hand mechanism + hip transition

The opening of each entry: NEVER start with "Chest-up shot..." or "Waist-up framing..." — start with the SUBJECT or ENVIRONMENT (e.g., "Her cyborg silhouette caught against..." or "Inside the data-vault chamber, she..." or "Atmospheric haze diffusing around..."). The framing is implied by WHICH body parts the description focuses on.`,
    touchpoints: [
      'Her left side three-quarter turn reveals shoulder-mount mechanism with exposed servo-pistons, translucent forearm-panel showing fiber-optic cables glowing in her glow-color, chest-core pulsing through sternum-window, atmospheric mid-distance backlight separating her silhouette',
      'Front-on chest-up composition with both clavicle-port arrays catching the rim-light, translucent skin-patch at the sternum revealing a glowing power-core, exposed micro-LED studs running along the shoulder-seams, soft mid-range backlight',
      'Three-quarter angle showing her from the collarbone to the top of the head, the right shoulder-mount fully visible with exposed hydraulic actuators and a glowing indicator-cluster, organic décolletage transitioning into chrome chassis at the upper chest',
      'Waist-up composition with her arms slightly extended forward revealing chrome forearm-chassis and articulated mechanical hands with visible servo-joints, translucent abdomen-panel showing internal capacitor banks glowing softly, sternum-core pulsing in her glow-color',
      'Side-profile chest-up with the spine-channel running visibly up the back of her neck, shoulder-blade mechanism exposed in chrome plating with glowing seam-lines, organic upper-arm transitioning into mechanical bicep with visible cable-bundles',
      'Atmospheric three-quarter turn showing her from the hip-line up, the hip-joint chrome catching reflective light, translucent abdominal panel revealing internal hard-light projector glowing, chest panel split open revealing the power-core, arms relaxed at her sides showing forearm-chassis detail',
      'Chest-up composition with her looking away in three-quarter profile, the right side of her body showing exposed cable-bundles exiting the shoulder into the upper-back, fiber-optic strands glowing in her glow-color tracing down toward the elbow',
      'Waist-up framing with one mechanical hand raised to her own jaw in a contemplative gesture, the forearm-chassis fully visible with exposed servo-pistons and glowing micro-LED studs, the other arm at her side, chest-panel power-core pulsing softly',
      'Her cyborg torso emerging from atmospheric haze, the chest-panel translucent revealing internal mechanism (capacitor banks / hologram-projector / synaptic mesh) glowing in her glow-color, shoulder-mounts catching the haze-diffused light, organic face visible above',
      'Front-on chest-up with her arms folded across her chest, the forearm-chassis mechanism crossing the upper torso revealing translucent panels with internal glow, both shoulder-mount mechanisms visible at the edges, jawline-to-clavicle showing organic-chrome seam',
      'Three-quarter waist-up with her body turned slightly toward camera, the visible side showing hip-joint chrome / abdominal-panel translucency revealing internal tech / chest-core glow / shoulder-mount mechanism — five distinct cyborg reveals across the body span',
      'Atmospheric chest-up framing with her standing in front of a glowing technological backdrop, the rim-light catching the shoulder-mount mechanism in silhouette, translucent neck-channel revealing fluid-light flowing upward, sternum-core glow bleeding outward through chest-panel',
      'Waist-up composition with her hands resting on a chest-high environmental element (console / railing / instrument-pedestal), the forearm-chassis fully visible, chest-panel translucency revealing internal mechanism, jawline showing organic-chrome seam at the temple',
      'Chest-up three-quarter angle showing her from the upper-arm to the top of the head, the visible shoulder-mount with exposed hydraulic-pistons and glowing seam-lines, the upper-chest panel showing translucent sections with internal capacitor-bank glow, organic face in soft focus above',
      'Her cyborg silhouette in atmospheric mid-distance with the chest-core glow visible through translucent chest-panel illuminating the surrounding chassis, shoulder-mounts catching rim-light, chrome forearm visible at her side, mid-range backlight separating her from environment',
    ],
    instructions: `Each entry is ONE specific cyborg-woman MID-BODY framing, 20-35 words. Write each as a FULL DESCRIPTIVE SENTENCE describing what dominates the frame + which body parts are visible + which cyborg mechanisms are showcased. VARIETY MANDATE — vary opening words (sometimes subject-first, sometimes environment-first, sometimes mechanism-first), body-part focus, environmental anchor, mood beat. Roughly 60% chest-up / 40% waist-up. Mix body parts focused on (shoulder-mount / clavicle-port / chest-core / sternum-panel / forearm-chassis / mechanical-hand / hip-joint / abdominal-panel / spine-channel / neck-fluid). Mix camera angles (front-on / three-quarter / side-profile / atmospheric-distant). Mix moods (contemplative / mid-action / stalking / mid-emerging). STRICT BAN on bikini-pose / pinup-arched-back / butt-shot / cleavage-focal / smooth-bodysuit-only / head-on-modeling framings. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── cyborg-woman path: HEAD VARIANTS (dual gear-discs / mandala / headphone / wired-up) — Attachments (5) DNA ───
  cyborg_head_variants: {
    format: 'simple',
    theme: `HEAD/TEMPLE MECHANISM variants for a CYBORG WOMAN — dominant mechanical features positioned ON THE HEAD/TEMPLE/EAR area. Each entry 25-45 words. Inspired by Attachments (5) references (IMG_8122 / IMG_8124 / IMG_8179 / IMG_8204 / IMG_8835) — striking ornate temple/ear mechanisms that become the visual signature of the render.

⚠️ THE BAR — every entry showcases a TEMPLE/EAR/HEAD mechanism with PRECISION DETAIL — visible mandala patterns, dual gear-discs in different colors, chunky headphone-style ear apparatus, wired-up glowing strand-bundles, ornate gold/silver face filigree. NOT generic "neural port" — these are MEMORABLE silhouettes.

🚫 BANS:
• NO full-body descriptions — these are HEAD/TEMPLE features
• NO generic "chrome partial skull plate" without ornate pattern detail
• NO bare-arms-only descriptions (this pool is HEAD-area)
• NO weapons / armor / tactical-tech (this is ornate beautiful cyborg, not military)

✓ ENTRY DISTRIBUTION (vary across):
  • 25% DUAL TEMPLE GEAR-DISCS — BOTH temples have separate mechanical pieces in DIFFERENT colors / patterns
  • 25% MANDALA / SACRED-GEOMETRY TEMPLE PATTERN — flower-of-life / hexagonal-lattice / tribal-geometric / aztec-pattern glowing in temple-disc
  • 20% HEADPHONE-STYLE EAR APPARATUS — chunky over-ear mechanical headphone (NOT a thin temple gear-disc — large round chrome unit jutting outward over the ear)
  • 15% WIRED-UP GLOW — exposed glowing wire-bundles trailing from nape / temple / behind the ear, draping over shoulders
  • 15% ORNATE GOLD/SILVER FACE FILIGREE — decorative metal scrollwork / tribal patterns / aztec-geometric across brow / cheekbone, often with single ornate forehead jewel`,
    touchpoints: [
      'Dual temple gear-discs — purple sacred-geometry mandala glowing on left temple (12 concentric petal-rings) opposite a green concentric-aperture ring-array on right temple with rotating servo-cogs, polished chrome cranium between them, ornate dual-color signature',
      'Massive HEADPHONE-style ear apparatus covering the entire right ear — large round chrome disc 8cm diameter with central glowing orange LED ring and three concentric outer rings, fiber-optic cable-bundles trailing back from the unit down the neck',
      'Sacred mandala glowing in the right temple-disc — twelve-petal flower-of-life pattern in violet light, surrounding hexagonal lattice frame in chrome, sub-pattern of micro-LEDs pulsing slowly inside each petal',
      'Wired-up exposed bundle of glowing fiber-optic filaments emerging from the nape of the neck and trailing forward over the right shoulder, the wires pulsing in her glow-color, framing the side of her face like luminous tresses',
      'Ornate gold filigree scrollwork tracing across both eyebrows and cheekbones in tribal-aztec geometric pattern, single ornate forehead jewel embedded above the third-eye position, decorative metal patterns gleaming against organic skin',
      'Dual gear-disc system — left temple a deep-pink concentric ring-array with rotating servos, right temple a cyan honeycomb-lattice pattern, the two patterns visually mirror-asymmetric, chrome skull plate visible across the top of the head',
      'Cyan hexagonal-lattice mandala pattern glowing across the right temple-disc, the geometric grid extending into subdermal traces across the cheekbone, a small gold forehead pendant centered above the brow',
      'Headphone-style ear unit — chunky over-ear chrome shell with a glowing pink central iris and four small rotating cogs visible at the edges, the unit jutting outward 3cm from the side of the head, distinct silhouette',
      'Exposed wire-strand "hair" — twenty glowing fiber-optic filaments emerging from the scalp instead of (or alongside) organic hair, draped around the face like luminous tresses pulsing in her glow-color',
      'Gold scrollwork ornate filigree across the forehead and brow ridge, a single emerald-cut jewel set in the center of the forehead, decorative metal tribal-geometric pattern extending down the cheekbone toward the jaw',
      'Dual asymmetric temple pieces — left temple a rotating six-pointed star pattern in violet light, right temple a flat chrome panel inscribed with glowing micro-text in amber, polished cranium between them',
      'Massive headphone apparatus over both ears connected by an arched chrome headband across the top of the cranium, central LED rings glowing in coordinating colors (left amber + right amber), cable-bundles trailing back to the shoulders',
      'Flower-of-life sacred geometry mandala glowing in violet across the right temple-disc, the petals slowly rotating, surrounding chrome frame inscribed with ornate hexagonal lattice border',
      'Cascade of glowing wire-bundles trailing from behind both ears down the neck and over the shoulders like a wire-mane, each wire pulsing in her glow-color, the strands floating slightly outward as if statically charged',
      'Gold tribal-geometric face filigree across the forehead, both temples, and the cheekbones — intricate aztec-pattern scrollwork in polished gold against organic skin, with a single ornate jewel above the third-eye position',
    ],
    instructions: `Each entry is ONE specific HEAD/TEMPLE/EAR mechanism for a cyborg woman, 25-45 words. Write each as a FULL DESCRIPTIVE SENTENCE describing what the mechanism IS + where it's positioned + its visual signature. VARIETY MANDATE — distribute across the 5 categories (dual gear-discs / mandala / headphone / wired-up / face filigree). Vary colors (no all-purple, no all-cyan). Vary patterns (concentric rings, mandala, hexagonal lattice, flower-of-life, aztec-geometric, tribal-scrollwork). STRICT BAN on weapons / armor / tactical-tech / full-body descriptions. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── cyborg-woman path: COLOR-VARIED FEATURES — dilute the chrome bias in cyborg_features pool (2026-05-17) ───
  cyborg_features_color_varied: {
    format: 'simple',
    theme: `DOMINANT MECHANICAL FEATURES for a CYBORG WOMAN — color-VARIED material entries to dilute the existing chrome bias in the cyborg_features pool. Each entry 25-50 words. Same structural format as the existing 200-entry cyborg_features pool (translucent panels revealing internal mechanism / exposed servo joints / chrome-NOT entries), but VARIED across material/color spectrum: brass, copper, bronze, gold, pearl, ivory, ceramic, jade, obsidian, lacquer, coral, amber, oxblood, rose-gold, verdigris, mother-of-pearl, opal-iridescent, xenomaterial.

⚠️ THE BAR — every entry showcases EXPOSED INNER WORKINGS at a specific body location (arm / leg / spine / shoulder / forearm / chest / hip / forearm / etc.) with a NON-CHROME material as the chassis material. Body part with visible internal mechanism.

🚫 STRICT BANS:
• NO "chrome" — use any other material word (brass / copper / bronze / gold / pearl / ivory / ceramic / jade / obsidian / lacquer / coral / amber / oxblood / rose-gold / verdigris / mother-of-pearl / opal / xenomaterial / etc.)
• NO "silver" — too close to chrome
• NO generic "metal" — be SPECIFIC about color
• NO armor / no weapons / no tactical

✓ ENTRY STRUCTURE (mirror existing pool): Body part + material + exposed inner mechanism + glow detail
  Example: "Brass-and-bronze right forearm with exposed servo musculature visible through amber-resin translucent panel, glowing fluid circulating through copper conduits, every gear and cable visible beneath warm-tinted glass skin."`,
    touchpoints: [
      'Brass-and-copper right arm with exposed hydraulic pistons in burnished bronze, articulated servo fingers catching amber light, visible cable-bundle actuators running along forearm length under warm rose-gold filigree.',
      'Transparent amber-resin forearm revealing burnished-brass skeletal framework, glowing topaz-orange fluid circulating through copper-alloy pistons, every mechanical tendon visible beneath honey-tinted skin.',
      'Segmented oxblood-lacquer spine visible through dorsal translucent ruby-glass plate, each vertebra independently rotating brass servo unit with copper fiber-optic connections threading between discs.',
      'Pearl-ivory ceramic right shoulder mount with exposed dark-bronze servo mechanism inside, gold-leaf scrollwork tracing the rim, micro-LED studs pulsing soft amber within the porcelain panel.',
      'Obsidian-black hip joint with exposed dark-gold gimbal mechanism inside translucent smoky-quartz panel, three-axis gear-train visible rotating slowly, ruby-red conduit-fluid glowing within.',
      'Verdigris-copper forearm chassis with hand-painted indigo circuitry traced in fine brushwork across every weathered patina panel, exposed servo mechanism visible at the elbow joint beneath botanical-tech detail.',
      'Rose-gold filigree right thigh-plate with exposed mechanical knee-joint beneath, translucent amber section revealing internal hydraulic system glowing soft peach, every piston catching the warm light.',
      'Mother-of-pearl iridescent chest plate with exposed power-core visible through translucent opal-shell panel, internal capacitor banks glowing soft violet, pearlescent surface shifting color in the light.',
      'Jade-green ceramic shoulder mount with exposed dark-bronze mechanism inside, gold scrollwork rim, glowing emerald micro-LED cluster pulsing soft within the porcelain panel.',
      'Antique-bronze left forearm with exposed copper servo musculature visible through translucent amber-resin panel, ruby-glass conduits glowing warm orange, ornate scrollwork engraved into the bronze plating.',
      'Lacquer-deep-burgundy right hip-joint with exposed gold gimbal-mechanism inside translucent ruby panel, three-axis gear-train rotating slowly, internal honey-amber fluid glowing.',
      'Coral-pink ceramic chest panel with translucent abdomen section revealing internal capacitor banks glowing soft pink, gold-leaf circuitry traced across the smooth glaze surface.',
      'Xenomaterial alien-hull right arm with shifting bioluminescent iridescence cycling teal into purple, exposed servo joints visible at every articulation, organic-tech crystalline micro-facets along the surface.',
      'Pearl-white ceramic spine plate with exposed brass vertebrae mechanism visible through translucent porcelain crown panel at the nape, gold-filigree circuitry running across the surface.',
      'Burnished-copper forearm with exposed dark-bronze servo bundles visible at the wrist seam, translucent amber-resin panel revealing internal hydraulic fluid glowing soft orange.',
    ],
    instructions: `Each entry is ONE specific cyborg-woman dominant mechanical feature, 25-50 words. Same format as the existing cyborg_features pool — body part + material + exposed inner mechanism + glow detail. STRICT BAN on "chrome" / "silver" / generic "metal" — use specific colorful materials (brass / copper / bronze / gold / pearl / ivory / ceramic / jade / obsidian / lacquer / coral / amber / oxblood / rose-gold / verdigris / mother-of-pearl / opal / xenomaterial / etc.). VARIETY MANDATE — vary body part (arm / leg / spine / shoulder / forearm / chest / hip / hand / abdomen), vary material color, vary internal mechanism (servo / hydraulic / capacitor / fiber-optic / gear-train). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── cyborg-woman path: BALD CHROME SKULL hair variants (~15% of hair pool when this fires) ───
  cyborg_bald_chrome_skull: {
    format: 'simple',
    theme: `BALD CHROME SKULL hair variants for a CYBORG WOMAN — replacing organic hair with a HAIRLESS CHROME CRANIUM PLATE. Each entry 15-25 words. Inspired by IMG_8122 reference — bald chrome head as a canvas for ornate temple mechanisms.

⚠️ THE BAR — every entry describes a SHINY POLISHED CHROME (or related material) HAIRLESS CRANIUM with some surface detail. The bald head should feel STRIKING and OTHERWORLDLY, not stark or generic. Pairs with dual temple gear-discs or mandala temple patterns.

🚫 BANS:
• NO actual hair / no fuzz / no stubble
• NO horns / no antlers
• NO helmet / no visor (this is the CRANIUM itself, not headwear)

✓ ENTRY DISTRIBUTION (vary across):
  • 40% Smooth polished chrome cranium with subtle reflection
  • 25% Chrome cranium with ornate geometric engraving (mandala / hexagonal / aztec / tribal)
  • 20% Chrome cranium with embedded micro-LED inlay constellations
  • 15% Chrome cranium with translucent crown sections revealing internal mechanism beneath`,
    touchpoints: [
      'Hairless polished chrome cranium plate, mirror-smooth surface reflecting the ambient light, no organic hair anywhere on the head',
      'Bald chrome skull with subtle hexagonal-lattice engraving across the crown, micro-LED studs pulsing softly within the geometric pattern',
      'Hairless cranium of brushed titanium with a single ornate gold scrollwork pattern circling the crown like a baroque crown-engraving',
      'Polished bald chrome head with translucent crown section revealing the glowing internal capacitor-banks beneath the cranial plate',
      'Smooth chrome cranium with a constellation of pinprick LED studs scattered across the surface, glowing softly in her glow-color',
      'Hairless head of polished obsidian-black chrome with subtle aztec-geometric engraving across the back of the cranium',
      'Bald chrome cranium with a single sacred-mandala pattern engraved across the crown in delicate filigree-line work',
      'Smooth white-pearl ceramic hairless cranium with a thin spine-channel of glowing wire visible running from forehead to nape',
      'Hairless chrome head with translucent acrylic panels at the top of the cranium revealing the rotating servo-mechanism beneath',
      'Polished bald rose-gold cranium with tribal scrollwork engraving running from the forehead back to the nape',
    ],
    instructions: `Each entry is ONE specific BALD CHROME SKULL variant for a cyborg woman, 15-25 words. Write each as a FULL DESCRIPTIVE SENTENCE. VARIETY MANDATE — vary surface treatment (polished chrome / brushed titanium / obsidian-black / white-pearl / rose-gold), engraving pattern (none, hexagonal, mandala, aztec, tribal), micro-LED inlay (none, scattered, constellation, spine-channel). STRICT BAN on organic hair / fuzz / stubble / horns / helmet / visor. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },
};

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(`No recipe for pool "${POOL}". Add it to POOL_RECIPES.`);
  process.exit(1);
}

function buildPrompt(count, recipe) {
  if (recipe.format === 'simple') {
    return `${recipe.theme}

━━━ TOUCHPOINT EXAMPLES (draw aesthetic from these — same caliber, same vocabulary register) ━━━
${recipe.touchpoints.map((t) => '  • ' + t).join('\n')}

${recipe.instructions}

Output ${count} numbered list entries (1. ... 2. ... 3. ...). Each entry on its own single line. NO preamble, NO commentary, NO markdown fences.`;
  }
  throw new Error(`Unknown recipe.format "${recipe.format}"`);
}

async function callSonnet(prompt) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000);
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
    if (!res.ok) throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

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
    } else if (current) current += ' ' + trimmed;
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
  'above',
  'below',
  'beside',
  'behind',
  'toward',
  'within',
  'throughout',
]);

function signatureOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  let body = dashIdx >= 0 ? entry.slice(dashIdx + 3) : entry;
  const tokens = body
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOPWORDS.has(w))
    .slice(0, 20);
  return [...new Set(tokens)].sort().slice(0, 12).join(' ');
}

function titleOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  if (dashIdx < 0) return null;
  return entry.slice(0, dashIdx).trim().toLowerCase();
}

function dedupe(entries) {
  const seenSigs = new Map();
  const seenTitles = new Map();
  const kept = [];
  const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const title = titleOf(e);
    if (title && seenTitles.has(title)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'title' });
      continue;
    }
    const sig = signatureOf(e);
    if (sig.length < 10) {
      if (title) seenTitles.set(title, e);
      kept.push(e);
      continue;
    }
    if (seenSigs.has(sig)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'body' });
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
    console.warn('  ⚠ Sonnet returned no usable entries');
    return [];
  }
  console.log(`  • Sonnet returned ${arr.length} entries in ${elapsed}s`);
  return arr;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/mechbot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) {
    try {
      preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch {}
  }
  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;
  if (TARGET !== null)
    console.log(
      `Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${DRY ? ' (dry-run)' : ''}`
    );
  else
    console.log(`Pool "${POOL}": gen ${COUNT} new (start ${startCount})${DRY ? ' (dry-run)' : ''}`);
  let pool = [...preExisting];
  let iteration = 0;
  while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = finalTarget - pool.length;
    const batchSize = Math.min(25, Math.ceil(stillNeeded * 1.5));
    console.log(
      `\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`
    );
    const fresh = await generateBatch(batchSize);
    if (fresh.length === 0) {
      console.warn('  ⚠ empty Sonnet response — stopping iteration');
      break;
    }
    const within = dedupe(fresh);
    if (within.dropped.length > 0)
      console.log(`  • within-batch dedup dropped ${within.dropped.length}`);
    const existingSigs = new Set(pool.map((e) => signatureOf(e)));
    const existingTitles = new Set(pool.map((e) => titleOf(e)).filter(Boolean));
    const newUnique = within.kept.filter((e) => {
      if (existingSigs.has(signatureOf(e))) return false;
      const t = titleOf(e);
      if (t && existingTitles.has(t)) return false;
      return true;
    });
    const crossDropped = within.kept.length - newUnique.length;
    if (crossDropped > 0) console.log(`  • cross-batch dedup dropped ${crossDropped}`);
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
  if (DRY) {
    console.log('\nDry-run — not writing to disk.');
    return;
  }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath) && preExisting.length > 0) {
    fs.copyFileSync(outPath, bakPath);
    console.log(`Backed up existing pool → ${bakPath}`);
  }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
