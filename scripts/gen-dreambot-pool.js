#!/usr/bin/env node
/**
 * Generate DreamBot bubble-bot-dreams seed pools using Sonnet.
 *
 * DreamBot's one path (bubble-bot-dreams) rolls 4 axes per render:
 *   • subject    — THE bubble-bot (a glossy iridescent designer-toy chibi).
 *                  Identity is LOCKED + consistent; only surface touches vary.
 *   • scene      — the dreamy fantastical WORLD it sits inside (goes WIDE).
 *   • mood       — the dreamy light + pastel palette wash.
 *   • atmosphere — ONE iridescent/sparkly atmospheric layer (rolled x2/render).
 *
 * The four pools were originally hand-authored as small curated MVP sets. This
 * script makes them reproducible + scalable: it loads the EXISTING curated
 * entries from each seed file and feeds them to Sonnet as the style TOUCHPOINTS
 * (Kevin: "include all these as touchpoints ... the robot is very consistent
 * which is perfect, and the scenes are very good"), then generates NEW entries
 * that extend the variety in the exact same voice — with programmatic dedup
 * against the curated set + each other.
 *
 * Usage (MVP-first, per the seed mandate — verify at 25 before scaling):
 *   node scripts/gen-dreambot-pool.js --pool chibibot_bubble_bot_scene --count 10 --dry-run
 *   node scripts/gen-dreambot-pool.js --pool chibibot_bubble_bot_scene --target 120
 *
 * Output is appended (curated entries preserved) to
 * scripts/bots/dreambot/seeds/<pool>.json. A .bak-<ts> is written first.
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

// Per-pool recipe — theme + instructions. The curated entries already on disk
// are auto-loaded as the aesthetic touchpoints, so the recipe text only has to
// carry the LOCKED rules + the variety mandate; the voice comes from the
// touchpoints themselves.
const POOL_RECIPES = {
  // ════════════════ FIGURE AXES — the bubble-bot, split into parts ═══════════
  // Pure appearance adjectives. The SILHOUETTE (round designer-toy + dome-visor
  // face) is locked by the path prefix; these axes vary the FINISH so the same
  // beloved character reads slightly different every render.

  // ── BODY (material / color / finish / trim) ──────────────────────────────
  bubble_bot_body: {
    label: 'bot body',
    maxWords: 16,
    theme: `Each entry describes ONLY the BODY of a glossy designer-toy "bubble-bot" — a cute round chibi collectible. Just the body shell: its material, color/tint, finish, and any trim. NOT the head/dome, NOT the eyes, NOT the pose, NOT the scene.

LOCKED: always a glossy vinyl/pearl designer-toy body with soft subsurface-scattering sheen, plump and round with stubby little limbs. VARY: the pearl tint (pearl-white / snow-white / cloud-white / opal-white / chrome-pearl / cream-pearl / marshmallow-white / blush-pearl / mint-pearl) and the TRIM (gold-trimmed joints / brass accent rings / a glowing chest emblem / soft pastel panel-lines / pristine seamless / rose-gold seams — or none). Keep most bodies pale/pearl so the character stays consistent; trim is the main variety.

✅ GOOD: "glossy pearl-white vinyl body with delicate gold-trimmed joints"
✅ GOOD: "chrome-pearl body with a soft glowing aqua chest emblem"
✅ GOOD: "smooth cloud-white body, pristine and seamless"`,
    instructions: `Generate distinct bubble-bot BODIES — pale pearl/vinyl, varying the tint + trim. 8-16 words, comma phrase, ONE line. Body ONLY — no dome, no eyes, no pose, no scene.`,
  },

  // ── DOME / VISOR (the signature head finish) ─────────────────────────────
  bubble_bot_dome: {
    label: 'bot dome',
    maxWords: 18,
    theme: `Each entry describes ONLY the HEAD of the bubble-bot — its big rounded DOME / VISOR face and what's on/inside it. This is the signature feature, so VARY the finish widely (this is the #1 variety lever for the character). NOT the body, NOT the eyes, NOT the scene.

The full visor-finish family (spread across these):
  • a dark glossy MIRROR-visor that reflects the whole scene around it
  • a clear crystal-glass dome glowing soft (gold / aqua / lavender / peach) inside
  • an iridescent rainbow thin-film dome with swirling refraction
  • a dark dome with a faint galaxy of stars / constellation glints inside
  • a chrome-iridescent oil-slick helmet visor
  • a holographic glass face-screen
  • a translucent soap-bubble dome with thin-film rainbow sheen
  • a dark-iridescent visor catching colored light

✅ GOOD: "a dark glossy mirror-visor reflecting the whole scene"
✅ GOOD: "a clear crystal-glass dome glowing soft gold inside"
✅ GOOD: "a dark dome with a faint galaxy of stars glinting inside"`,
    instructions: `Generate distinct DOME/VISOR finishes across the full family above (mirror / crystal-glass / iridescent / starry / chrome / holographic / soap-bubble). 6-18 words, comma phrase, ONE line. HEAD finish ONLY — no body, no eye color, no scene.`,
  },

  // ── EYES (color / shape / size) ──────────────────────────────────────────
  bubble_bot_eyes: {
    label: 'bot eyes',
    maxWords: 12,
    theme: `Each entry describes ONLY the EYES that glow on the bubble-bot's visor. VARY color, shape, AND size — NOT all "big glowing" (the originals range from tiny bright dots to large rings). NOT the body, dome, pose, or scene.

Spread across: big glowing neon-pink concentric-ring eyes / small bright white dot-eyes / glowing green dot-eyes / glowing magenta star-shaped eyes / soft glowing heart-shaped eyes / warm amber ring eyes / glowing-aqua ring eyes / glowing-violet ring eyes / tiny twinkling pixel eyes / round sky-blue catchlight eyes. Mix sizes: some small + simple, some large + glowing.

✅ GOOD: "small bright white dot-eyes"
✅ GOOD: "big glowing magenta star-shaped eyes"
✅ GOOD: "soft glowing-aqua concentric-ring eyes"`,
    instructions: `Generate distinct EYE descriptions — vary color, shape, AND size (NOT all large/glowing). 4-12 words, ONE line. Eyes ONLY.`,
  },

  // ── POSE (gesture) ───────────────────────────────────────────────────────
  bubble_bot_pose: {
    label: 'bot pose',
    maxWords: 14,
    theme: `Each entry is ONE cute POSE/ACTION for the little bubble-bot — a MIX of serene poses AND dynamic, in-action/adventuring poses (so the bot feels alive — sometimes calm, sometimes mid-adventure). NOT the appearance, NOT the scene.

SERENE: sitting cross-legged with paws on knees, standing tall and proud, a tiny shy wave, both arms raised in joy, floating gently, hugging its knees, gazing up in wonder, peeking with one paw.
DYNAMIC ACTION (adventuring, full of energy): running forward eagerly mid-stride, mid-leap jumping with arms flung up, striding ahead exploring, scrambling up a ledge, reaching out to grab something, pointing ahead leading the way, a determined adventure-crouch ready to spring, sliding/riding with arms out, tip-toeing curiously forward, fist-pumping mid-cheer, tumbling playfully, dashing with arms streaming back.

✅ GOOD (serene): "sitting cross-legged with tiny paws on its knees"
✅ GOOD (action): "running forward eagerly, arms pumping, one foot lifted mid-stride"
✅ GOOD (action): "mid-leap jumping with both arms thrown up in delight"`,
    instructions: `Generate distinct cute POSES — both serene AND dynamic in-action/adventuring. 4-14 words, ONE line. Pose ONLY — no appearance, no scene.`,
    subThemes: [
      'SERENE POSES — sitting, standing proud, gazing up, a tiny wave, floating, hugging knees, peeking, arms-raised joy',
      'DYNAMIC ACTION POSES — running mid-stride, mid-leap jumping, striding/exploring ahead, climbing/scrambling, reaching to grab, pointing-ahead leading, adventure-crouch, sliding/riding, tip-toe-curious, dashing, tumbling, fist-pump cheer',
    ],
  },

  // ════════════════ ENVIRONMENT AXES — the dream world (co-star) ═════════════

  // ── DREAM WORLD (the fantastical biome — the big creative axis) ──────────
  bubble_dream_world: {
    label: 'dream world',
    maxWords: 20,
    theme: `Each entry is ONE specific, imaginative, COLORFUL, DYNAMIC dream WORLD — a bold fully-realized fantastical place, frame-worthy phone-wallpaper quality. This is the co-star of the render, so it must be CREATIVE and full of wonder, not a generic backdrop. The bar (from the best renders): a SCALE hook (the tiny bot dwarfed by towering/giant elements) + SPECIFIC named elements + ONE signature whimsical feature + a depth/horizon cue.

⚠️ TERSE REGISTER: a SHORT 12-20 word fragment, like the touchpoints — name the world + its signature feature + a scale/depth cue, then STOP. Sonnet EXPANDS it into rich prose at render time; an over-long seed crowds out the hero. One comma-joined fragment, no elaborate multi-clause sentences.
  ✅ GOOD: "a vast crystal grotto of gemstones rising like cathedral spires, god-rays pouring down"
  ✅ GOOD: "an oversized flower garden where blooms eclipse the sky, fat dewdrops on every petal"
  ❌ TOO LONG: a flowing three-clause paragraph of atmospheric prose.

VARIETY MANDATE — spread WIDELY (never cluster on sunset-ocean):
  A. golden-hour OCEAN / coast   B. COSMIC / space (planets, galaxies, moons, nebulae)
  C. CANDY-LAND / sweets         D. SKY KINGDOM (cloud-islands, rainbow roads, sky-castles, balloon festivals)
  E. UNDERWATER (coral cities, jellyfish, kelp)   F. CRYSTAL / GEM (grottos, geodes, prism-forests)
  G. OVERSIZED NATURE / macro (giant flowers, mushrooms, dandelions, ferns)   H. AURORA / SNOW / snowglobe
  I. SOFT NEON / DREAM-TECH (arcades, holographic plazas, clockwork gardens)   J. ZEN / STORYBOOK (sakura, koi, lanterns, music-box ballroom)
  K. WHIMSICAL SURREAL (tea party in the stars, glitter-volcano, liquid-rainbow waterfall, bubble-tea sea, library-canyon)

🚫 BANS: NO bubble-bot / character (separate axis). NO humans. NO scary / dark. Spread across A-K. OMIT negation. Never exceed 20 words.`,
    instructions: `Generate NEW bold imaginative dream worlds extending the variety across families A-K — colorful, dynamic, with a scale hook + named elements + signature feature. 12-20 word terse fragments, ONE line each. World ONLY.`,
    // Production scale: one Sonnet phase per family so cross-batch dedup can't
    // starve a family (Kevin's equal-share-per-subtheme hard rule).
    subThemes: [
      'GOLDEN-HOUR OCEAN / COAST — sunset seas, sun-glazed piers, palm archways, tide pools, lagoon sandbars, sea-caves, coastal cliffs, coral atolls, shell beaches, glowing harbors',
      'COSMIC / SPACE — giant pastel planets, ringed worlds, galaxy bands, the moon, comet trails, nebula clouds, asteroid gardens, star-fields, twin suns, drifting space-stations of light',
      'CANDY-LAND / SWEETS — lollipop trees, gumdrop hills, marshmallow clouds, ice-cream mountains, soda seas, chocolate rivers, peppermint forests, cookie cliffs, candy-cane groves, frosting dunes',
      'SKY KINGDOM — floating cloud-islands, rainbow roads, sky-castles, balloon festivals, drifting soap-bubble skies, cloud staircases, floating archipelagos with waterfalls, airship gardens, sky-bridges',
      'UNDERWATER — iridescent coral bubble-cities, kelp groves, jellyfish drifts, sunken pastel ruins, anemone carnivals, pearl caverns, glowing trenches, seahorse meadows, shipwreck gardens',
      'CRYSTAL / GEM — glittering grottos, geode caverns, prism-spire forests, gem fields, amethyst canyons, quartz cathedrals, opal lakes, crystalline ice-palaces, mirror-gem mazes',
      'OVERSIZED NATURE / MACRO — giant flower gardens, lotus ponds, mushroom villages, dewy fern hollows, towering dandelions, giant clover meadows, oversized berry bushes, leaf-canopy worlds',
      'AURORA / SNOW / SNOWGLOBE — snow-pastel tundra under aurora ribbons, frosted glades, snowglobe villages, frozen-waterfall palaces, ice-flower fields, glittering glacier caves, winter lantern-paths',
      'SOFT NEON / DREAM-TECH — pastel dream-arcades, glowing holographic plazas, gentle cyber gardens, clockwork garden, music-box ballrooms, neon koi-pools, light-grid meadows, hologram bazaars',
      'ZEN / STORYBOOK — sakura islands, paper-lantern koi courtyards, tea-house terraces, miniature villages, bamboo groves, torii-gate paths, library-canyons, cottage hamlets, lantern-festival rivers',
      'WHIMSICAL SURREAL — a tea party drifting among the stars, surfing a giant bubble, a glitter-volcano, a liquid-rainbow waterfall, a windmill-pinwheel hill, a rainbow-geyser plain, a hot-air-balloon sky, an upside-down floating pond',
    ],
  },

  // ── WORLD DETAIL (secondary elements that fill + animate the world) ───────
  bubble_world_detail: {
    label: 'world detail',
    maxWords: 14,
    theme: `Each entry is ONE secondary ELEMENT that fills out and ANIMATES a dream world — adds density, depth, life, or motion around the bubble-bot (the path layers TWO per render, so each stands alone). NOT a full world (separate axis), NOT the bot.

Spread across: foreground props (fat dewdrops on petals, mushrooms clustered along a path, gumdrop bushes), MOTION (tiny waterfalls cascading off floating crags, petals streaming on the breeze, lanterns floating up, ribbon-streamers drifting), LIFE (schools of luminous koi gliding past, fireflies spiraling, a drift of glowing jellyfish, butterfly-gears fluttering), DEPTH-builders (smaller sky-islands drifting beyond, distant glowing spires, a faraway ringed planet, layered pastel mountains).

✅ GOOD: "tiny waterfalls cascading off floating crags into glowing mist"
✅ GOOD: "schools of luminous koi gliding slowly past"
✅ GOOD: "smaller sky-islands drifting in the soft distance"`,
    instructions: `Generate NEW single secondary world ELEMENTS — props / motion / life / depth-builders that animate any dream world. 5-14 words, ONE line. One element each, no full world, no bot.`,
    subThemes: [
      'FOREGROUND PROPS — fat dewdrops on oversized petals/leaves, clustered glowing mushrooms, gumdrop bushes, mossy stones, candy-striped tall grass, scattered seashells, glowing pebbles, toadstool rings',
      'MOTION — tiny waterfalls cascading off crags, petals/leaves streaming on the breeze, lanterns floating up, ribbon-streamers drifting, spinning pinwheels, rising bubbles, swirling light-trails, falling spar_dust',
      'LIFE — schools of luminous koi gliding, fireflies spiraling, drifting jellyfish, butterfly-gears fluttering, glowing moths, tiny sky-whales, hummingbirds of light, drifting glow-sprites, clockwork dragonflies',
      'DEPTH-BUILDERS — smaller sky-islands drifting beyond, distant glowing spires, a faraway ringed planet, layered pastel mountains, far waterfalls into cloud-pools, distant windmills, receding archways, far city-glow',
      'SKY / WEATHER DRIFTS — pale aurora ribbons rippling, drifting dandelion-seed clouds, soap bubbles passing, slow falling snow-sparkle, drifting petals overhead, wisps of glowing mist, comet streaks, light-rain shimmer',
    ],
  },

  // ── LIGHT + PALETTE ──────────────────────────────────────────────────────
  bubble_light_mood: {
    label: 'light mood',
    maxWords: 20,
    theme: `Each entry is ONE cohesive dreamy LIGHT + PALETTE wash for the whole render — soft, luminous, magical, frame-worthy. Names the light quality AND 2-4 palette colors AND one soft light detail. Tints the scene, not the character.

Vary widely: warm golden-hour sunset (coral-peach + rose-gold, god-rays); soft pastel dawn (pink + cream); starry violet twilight; clean aqua-and-pearl daydream; soft neon-pastel dreamlight (pink + cyan); aurora shimmer (mint + rose ribbons); candy-bright soft daylight; moonlit pearl (silver-blue, drifting sparkle); cosmic purple-and-gold nebula; honey-amber warm glow; cotton-candy pink-and-blue sky; opalescent rainbow-pastel ambient — plus fresh ones (misty blue-hour, peachy-cream morning, dreamy lilac dusk, soft minty glow, rosé-and-gold haze).

✅ GOOD: "drenched in warm golden-hour sunset, coral-peach and rose-gold, soft god-rays and a glowing horizon"`,
    instructions: `Generate NEW light+palette moods in the dreamy register — light quality + named pastel palette + a soft light detail. 10-20 words, ONE line. Light + color ONLY.`,
  },

  // ── DREAMY ATMOSPHERE (sparkle layer, ×2 per render) ─────────────────────
  bubble_atmosphere: {
    label: 'atmosphere',
    maxWords: 16,
    theme: `Each entry is ONE dreamy atmospheric LAYER that fills the air and frames the hero — iridescent, sparkly, magical set-dressing (the path layers TWO per render, so each must stand alone).

Vary widely: floating iridescent soap bubbles; a glossy mirror-reflective floor doubling the scene; fluffy marshmallow cloud-puffs; scattered sparkle-stars + gem glints; warm god-rays with soft lens-bloom; drifting glitter motes like slow golden snow; holographic dewdrops; soft drifting petals; glowing bokeh orbs; a faint rainbow refraction halo; slow-falling fairy-dust sparkles; translucent bubbles of every size rising; low iridescent ground-mist; pastel fireflies — plus fresh (drifting light-feathers, prismatic light-shards, floating glow-orbs, shimmering pollen-light).

✅ GOOD: "floating iridescent soap bubbles drifting through the air"
✅ GOOD: "warm god-rays beaming through with a soft cinematic lens-bloom"`,
    instructions: `Generate NEW single-layer atmospheric touches in the dreamy register — each stands alone, could float in any world. 6-16 words, ONE line.`,
  },

  // ════════════════ DREAMSCAPE — scene-as-hero candy-fantasy world vistas ═════
  // 2026-06-27 (new path). NO bubble-bot, NO central character — the WORLD is the
  // hero (hyper-saturated candy-colored cinematic dream-vistas, ref aida_ai_pro:
  // lush oversized flora + whimsical fairytale architecture + a reflective stream
  // under a dreamy twilight sky). 9 axes; the `world` axis carries the wide spread.
  // AXIS-CLEAN discipline: palette owns COLOR, atmosphere owns LIGHT, sky owns
  // OVERHEAD, world owns the BIOME — no lane bleeds into another (EarthBot L4).

  dreamscape_world: {
    label: 'dreamscape world',
    maxWords: 22,
    theme: `Each entry is ONE specific, imaginative, hyper-saturated candy-colored FANTASY WORLD — a lush, frame-worthy dream-vista where the WORLD ITSELF is the hero (no character). The bar (from the reference renders): a vivid named world + ONE signature whimsical feature + a depth/scale cue (the world rising and receding to a glowing horizon). Bold, magical, "I want to step inside it."

⚠️ TERSE REGISTER: a SHORT 12-22 word fragment, like the touchpoints — name the world + its signature feature + a depth cue, then STOP. Sonnet EXPANDS it into rich prose at render time; an over-long seed crowds the frame. ONE comma-joined fragment, no multi-clause paragraphs.
  ✅ GOOD: "a candy-colored valley of giant cotton-candy canopy trees, a mirror-stream winding through flower banks to a glowing horizon"
  ✅ GOOD: "a bioluminescent mushroom forest of house-sized glowing toadstools, light-vines strung between cap and cap, misty depths beyond"
  ❌ TOO LONG: a flowing three-clause paragraph of atmospheric prose.

OWN ONLY THE WORLD-TYPE / BIOME. Do NOT specify the palette (separate axis), the light (separate axis), the sky (separate axis), the architecture (separate axis), or any creature/figure. Just the LAND + its signature wonder + depth.

VARIETY MANDATE — spread WIDELY across fantastical candy-biomes (never cluster on flower-valley):
  A. CANDY-FLOWER VALLEY  B. GLOWING MUSHROOM FOREST  C. FLOATING SKY-ISLANDS  D. CRYSTAL / GEODE GARDEN
  E. DREAM-REEF (coral-on-land)  F. COTTON-CANDY CLOUD KINGDOM  G. ENCHANTED CANAL / WATERWAY REALM
  H. GIANT-FLORA MACRO WORLD  I. RAINBOW DESERT / GLASS OASIS  J. AURORA SNOW-GLASS REALM
  K. BIOLUM NEON-PASTEL JUNGLE  L. SURREAL WONDERLAND (impossible candy geometry)

🚫 BANS: NO bubble-bot, NO humans, NO named characters. NO scary / dark / macabre. Spread across A-L. OMIT negation language. Never exceed 22 words.`,
    instructions: `Generate NEW hyper-saturated candy-fantasy WORLDS extending the variety across families A-L — a vivid world-type + signature whimsical feature + a depth/scale cue. 12-22 word terse fragments, ONE line each. WORLD/BIOME only — no palette, no light, no sky, no architecture, no creatures.`,
    // Production scale: one Sonnet phase per family so cross-batch dedup can't
    // starve a family (Kevin's equal-share-per-subtheme hard rule).
    subThemes: [
      'CANDY-FLOWER VALLEY — oversized-bloom valleys, petal-river gorges, flower-canyon terraces, bouquet-mound meadows, blossom-cascade ravines, giant-rose amphitheaters, pom-pom-tree groves, dahlia-hill country',
      'GLOWING MUSHROOM FOREST — house-sized luminous toadstools, fungal cathedrals, bioluminescent spore-groves, layered mushroom-shelf cliffs, glowing-cap canopies, fairy-ring hollows, moss-and-fungus dells',
      'FLOATING SKY-ISLANDS — drifting flower-crags with waterfalls spilling into cloud, cloud-archipelago chains, levitating garden-isles, sky-bridges between floating peaks, upside-down island roots trailing vines',
      'CRYSTAL / GEODE GARDEN — gemstone grottos rising like cathedral spires, prism-spire forests, amethyst canyons, opal lakes, crystalline ice-flower fields, quartz cathedrals, mirror-gem mazes',
      'DREAM-REEF (coral-on-land) — terrestrial reef gardens of candy coral, anemone meadows, brain-coral hills, kelp-tree groves above ground, tide-pool terraces, pearl-bubble springs, sea-fan canopies',
      'COTTON-CANDY CLOUD KINGDOM — pastel cloud realms, sugar-spun cloud-castles, marshmallow cloud-banks you could walk on, rainbow roads, balloon-festival skies, floating soap-bubble seas',
      'ENCHANTED CANAL / WATERWAY REALM — whimsical waterway valleys, lantern-lit canal gorges in the blooms, lily-pad lagoons, tiered-waterfall basins, glowing-river deltas, reflecting-pool terraces',
      'GIANT-FLORA MACRO WORLD — a world beneath oversized flowers and leaves, dewdrop-jewel meadows, towering dandelion fields, giant-clover canopies, fern-spiral hollows, berry-bush groves the size of hills',
      'RAINBOW DESERT / GLASS OASIS — candy-striped dunes, prism-glass oases, crystal-sand flats, geode badlands, mirage-pool basins, rainbow-rock arches, sugar-sand mesas',
      'AURORA SNOW-GLASS REALM — frosted pastel tundra, ice-flower fields, snowglobe valleys, frozen-waterfall palaces, glittering glacier-cave gardens, crystal-snow drifts under shimmering skies',
      'BIOLUM NEON-PASTEL JUNGLE — Avatar-style glowing rainforest, vine-light canopies, neon-frond gorges, glowing-pod groves, luminous-river jungles, bioluminescent flower-walls, spore-lit understory',
      'SURREAL WONDERLAND — upside-down floating ponds, liquid-rainbow waterfalls, teacup-island archipelagos, candy-geometry canyons, impossible spiral-stair gardens, gravity-defying bloom-towers, melting-clock meadows',
    ],
  },

  dreamscape_flora: {
    label: 'dreamscape flora',
    maxWords: 16,
    theme: `Each entry is ONE dominant oversized magical PLANT element that fills a candy-fantasy world with lush density — stands alone (the path layers TWO per render). Big, vivid, frame-filling botanical wonder. NOT a full world (separate axis), NOT architecture, NOT a creature.

Spread across: CANOPY (giant cotton-candy pom-pom trees, towering blossom-canopies, prism-leaf palms, weeping light-willows), FUNGI (house-sized glowing mushrooms, shelf-fungus terraces, puffball clusters), FLOWER-MASS (massive bouquet-flower mounds, giant lotus, oversized dahlias, coral-bloom thickets), SUCCULENT/CRYSTAL (crystal succulents, gemstone cacti, geode-pods), HANGING (wisteria-light curtains, vine-lanterns, hanging bloom-baskets, trailing glow-tendrils), GROUND (bubble-berry bushes, fern-spirals, candy-grass tufts, glowing moss carpets).

✅ GOOD: "giant cotton-candy pom-pom trees in magenta and teal towering overhead"
✅ GOOD: "house-sized glowing mushrooms with luminous gilled caps"
✅ GOOD: "massive bouquet-flower mounds spilling over mossy stones"`,
    instructions: `Generate NEW single oversized magical PLANT elements — one botanical wonder each, stands alone in any candy-fantasy world. 6-16 words, ONE line. Plant only — no full world, no buildings, no creatures.`,
    subThemes: [
      'CANOPY TREES — giant cotton-candy pom-pom trees, towering blossom-canopies, prism-leaf palms, weeping light-willows, balloon-fruit trees, spiral-trunk giants, parasol-bloom trees, glass-leaf groves',
      'GIANT FUNGI — house-sized glowing mushrooms, luminous gilled caps, shelf-fungus terraces, puffball clusters, lantern-cap toadstools, coral-fungus fans, spotted parasol-mushrooms',
      'FLOWER-MASS — massive bouquet-flower mounds, giant lotus blooms, oversized dahlias and peonies, coral-bloom thickets, sunflower-giants, hydrangea hills, tulip-spire fields',
      'SUCCULENT / CRYSTAL FLORA — crystal succulents, gemstone cacti, geode-pods, prism-aloe rosettes, quartz-bud stalks, glass-petal flowers, jewel-berry vines',
      'HANGING FLORA — wisteria-light curtains, vine-lanterns, hanging bloom-baskets, trailing glow-tendrils, cascading-petal drapes, dangling pod-lights, ivy-light garlands',
      'GROUND FLORA — bubble-berry bushes, fern-spirals, candy-grass tufts, glowing moss carpets, lily-pad rafts, clover-jewel patches, toadstool rings, dewdrop-spangled groundcover',
    ],
  },

  dreamscape_structure: {
    label: 'dreamscape structure',
    maxWords: 18,
    theme: `Each entry is ONE whimsical fairytale STRUCTURE nestled INTO a candy-fantasy world — organic, storybook architecture that belongs to the world (the render layers it among the flora). This fires on ~60% of renders; the other ~40% are pure-natural wonderlands, so each structure must read as a charming accent, NEVER dominating the world. NO humans. NOT the full world, NOT the flora.

Spread across: TREE-TOWNS (tiered treehouse-villages with round wooden balconies wrapped around giant trunks, lantern-lit windows — the reference look), MUSHROOM/ORGANIC COTTAGES (toadstool houses, snail-shell huts, gourd-cottages, pod-dwellings), TOWERS/SPIRES (crystal spires, twisting candy-towers, blossom-clad pagodas), WATER STRUCTURES (lantern-lit canal houses on stilts, floating pavilions, lily-pad docks, arched flower-bridges), WONDERS (hanging sky-platforms on vines, spiral garden-stairs, glass conservatories, bell-domed gazebos).

✅ GOOD: "tiered treehouse cottages with round wooden balconies and warm lantern-lit windows wrapped around a giant trunk"
✅ GOOD: "a cluster of toadstool cottages with curved doors and glowing windows"
✅ GOOD: "lantern-lit canal houses on carved stilts above the reflecting water"`,
    instructions: `Generate NEW whimsical fairytale STRUCTURES that nestle into a candy-fantasy world as a charming accent — organic, storybook, warm-lit. 8-18 words, ONE line. Architecture only — no humans, no full world, no flora list.`,
    subThemes: [
      'TREE-TOWNS — tiered treehouse-villages with round wooden balconies wrapped around giant trunks, lantern-lit windows, rope-and-vine walkways, stacked canopy-cottages, spiral-staircase trunk-towers',
      'ORGANIC COTTAGES — toadstool houses with curved doors, snail-shell huts, gourd-cottages, pod-dwellings, woven-nest homes, acorn-cap cabins, flower-bud houses with glowing windows',
      'TOWERS / SPIRES — crystal spires, twisting candy-striped towers, blossom-clad pagodas, vine-wrapped bell-towers, glass minarets, coral-spire turrets, lantern-topped watch-towers',
      'WATER STRUCTURES — lantern-lit canal houses on carved stilts, floating pavilions, lily-pad docks, arched flower-bridges, waterwheel mills, reflecting-pool terraces with railings',
      'AERIAL / GARDEN WONDERS — hanging sky-platforms on vines, spiral garden-stairs, glass conservatories, bell-domed gazebos, suspended walkway-bridges, terraced balcony-gardens with string-lights',
    ],
  },

  dreamscape_foreground: {
    label: 'dreamscape foreground',
    maxWords: 16,
    theme: `Each entry is ONE foreground GROUNDING element that anchors the bottom of the frame and leads the eye INTO the world — most often a reflective waterway (the reference signature), sometimes a path or clearing. Builds depth; mirrors the colorful world above it. NOT the full world, NOT flora, NOT sky.

Spread across: WINDING WATER (a mirror-stream winding over colorful pebbles to the horizon, a glowing river-bend, a reflecting canal), STILL WATER (a glassy reflecting pool doubling the scene, a lily-pad pond, a quiet lagoon, a crystal spring), MOVING WATER (tiered cascading waterfalls into a basin, a bubbling brook over mossy stones, a petal-strewn rapids), STONE-LINED EDGES (mossy boulder-banks framing the water, glowing-pebble shallows), NON-WATER (a petal-carpet path winding in, a dewy moss clearing, a flower-lined trail of light).

✅ GOOD: "a mirror-still stream winding over colorful pebbles, reflecting the world above, leading to the horizon"
✅ GOOD: "a glassy reflecting pool doubling the glowing scene, mossy boulders framing the edge"
✅ GOOD: "tiered waterfalls cascading into a clear basin ringed with flower banks"`,
    instructions: `Generate NEW foreground grounding elements that lead the eye into a candy-fantasy world — usually reflective water, sometimes a petal path/clearing. 6-16 words, ONE line. Foreground anchor only.`,
    subThemes: [
      'WINDING WATER — a mirror-stream winding over colorful pebbles to the horizon, a glowing river-bend, a reflecting canal threading the blooms, a serpentine creek catching the light',
      'STILL WATER — a glassy reflecting pool doubling the scene, a lily-pad pond, a quiet mirror-lagoon, a crystal spring, a still rock-pool reflecting the sky',
      'MOVING WATER — tiered cascading waterfalls into a basin, a bubbling brook over mossy stones, a petal-strewn rapids, a fountain-spring overflowing into a pool',
      'STONE-LINED EDGES — mossy boulder-banks framing bright water, glowing-pebble shallows, lichen-stone stepping rims, smooth-river-rock borders studded with blooms',
      'NON-WATER PATHS — a petal-carpet path winding inward, a dewy moss clearing, a flower-lined trail of soft light, a fallen-blossom walkway, a glowing-stone footpath into the depths',
    ],
  },

  dreamscape_palette: {
    label: 'dreamscape palette',
    maxWords: 18,
    theme: `Each entry is ONE cohesive candy-fantasy COLOR STORY for the whole render — the dominant hues that lead, like a palette a designer chose on purpose (NOT a random color salad). Names 3-5 hues + how they relate (a dominant + accents + a contrast). The feed's color VARIETY lives here, so spread WIDELY — never default to all-pink. Owns COLOR ONLY: no light-quality, no time-of-day, no air FX (separate axis).

Spread WIDELY: magenta + violet + teal with cool-blue water (the reference); coral + rose-gold + cream; emerald + chartreuse + gold; sunset orange + hot-pink + purple; aqua + mint + pearl-white; ruby + sapphire + gold jewel-tones; lavender + peach + butter-yellow; crimson + plum + amber; turquoise + coral + sunshine-yellow; lilac + sky-blue + silver; tangerine + fuchsia + lime; rose + powder-blue + gold; and full prismatic rainbow spreads.

✅ GOOD: "magenta and violet canopy over teal foliage, cool cobalt water reflections, pops of coral and gold"
✅ GOOD: "emerald and chartreuse greens with gold light and deep-amber accents, a single ruby-red focal bloom"`,
    instructions: `Generate NEW cohesive candy-fantasy COLOR STORIES — 3-5 dominant hues + how they relate (dominant + accents + a contrast pop). 8-18 words, ONE line. Color only — no light quality, no time-of-day, no effects. Spread widely, never all-pink.`,
  },

  dreamscape_atmosphere: {
    label: 'dreamscape atmosphere',
    maxWords: 18,
    theme: `Each entry is ONE cohesive dreamy LIGHT-QUALITY + AIR treatment for the whole render — the light behavior and atmospheric set-dressing that make it cinematic and magical. Describe light by QUALITY / DIRECTION / TIME and the AIR effects; let the PALETTE axis own the actual hues (use neutral light words: warm/cool/soft/golden-glow, not "magenta"). NOT the sky overhead (separate axis), NOT color.

Spread across: VOLUMETRIC (soft god-rays pouring through with drifting glow-motes, light-shafts through the canopy, beams cutting morning haze), TIME-OF-DAY LIGHT (warm golden-hour bloom + soft sparkle, misty pastel dawn, dreamy blue-hour twilight glow, lantern-lit dusk warmth), MAGIC AIR (floating luminous spores, drifting petals on the breeze, slow glitter-motes like golden snow, soft iridescent ground-mist, gentle bokeh orbs, fairy-dust shimmer), SOFT-FOCUS (ethereal fog softening the depths, soft cinematic lens-bloom, dewy humid glow).

✅ GOOD: "soft volumetric god-rays pouring down through drifting luminous spores, dreamy and warm"
✅ GOOD: "misty pastel dawn haze with gentle light-shafts and slow-falling glitter-motes"`,
    instructions: `Generate NEW dreamy LIGHT-QUALITY + AIR treatments — light behavior (quality/direction/time) + atmospheric effects (spores/motes/mist/bloom). 8-18 words, ONE line. Light + air only — no specific hues, no sky.`,
  },

  dreamscape_sky: {
    label: 'dreamscape sky',
    maxWords: 16,
    theme: `Each entry is ONE SKY overhead for a candy-fantasy vista — the upper band of the frame (the world fills most of it, but the sky sets the ceiling mood). Owns the SKY ONLY: cloud forms + celestial elements. NOT ground light, NOT the world, NOT air FX near the ground.

Spread across: DRAMATIC CLOUDS (a dramatic twilight cloudscape with billowing clouds catching the light — the reference; towering cumulus, wispy cirrus streaks), CELESTIAL (twin pastel moons, a giant ringed planet low on the horizon, a galaxy/nebula band, a scatter of soft stars), AURORA (rippling aurora ribbons, shimmering polar curtains), SOFT (clean pastel-gradient sky, cotton-candy cloud banks, a faint rainbow arc, sun-shafts breaking through cloud-gaps).

✅ GOOD: "a dramatic twilight cloudscape, billowing clouds catching the last warm light"
✅ GOOD: "twin pastel moons hanging low over a soft gradient sky"
✅ GOOD: "rippling aurora ribbons across a deep dusk sky"`,
    instructions: `Generate NEW skies overhead for a candy-fantasy vista — cloud forms + celestial elements. 5-16 words, ONE line. Sky only — no ground light, no world, no near-ground effects.`,
  },

  dreamscape_event: {
    label: 'dreamscape event',
    maxWords: 16,
    theme: `Each entry is ONE magical EVENT / moment happening in the scene — a beat of motion or wonder that brings the world alive (fires on ~40% of renders, so each must be a self-contained delight, never required). NOT the world, NOT a static element — a HAPPENING. NO humans.

Spread across: DRIFTING LIGHT (a cloud of glowing spores drifting up, floating wish-lanterns rising, a swirl of light-orbs spiraling), FLOCKS (a flock of luminous birds wheeling overhead, a cloud of glowing butterflies, fireflies swarming up from the blooms, a drift of glowing jellyfish-in-air), WEATHER-MAGIC (a sudden shower of petals raining down, a rainbow arcing across the falls, a meteor streaking the dusk, a shimmer of light-rain), BLOOM-MOMENT (a giant flower bursting open in a puff of pollen-light, a waterfall of pure light spilling over a ledge).

✅ GOOD: "a cloud of glowing spores drifting upward through the light"
✅ GOOD: "a flock of luminous birds wheeling across the sky"
✅ GOOD: "a sudden shower of glowing petals raining down"`,
    instructions: `Generate NEW magical EVENTS / moments of motion that bring a candy-fantasy world alive — drifting light, flocks, weather-magic, bloom-moments. 5-16 words, ONE line. A happening only — no humans, no static scenery.`,
  },

  dreamscape_creature: {
    label: 'dreamscape creature',
    maxWords: 16,
    theme: `Each entry is ONE tiny charming AMBIENT creature dwarfed in the world — rare ambient life, NEVER the hero (fires on ~22% of renders). Small and far enough that it reads as a delightful detail you discover, not the subject. Whimsical, cute, magical. NEVER a human, NEVER a person.

Spread across: GLOWING MAMMALS (a tiny glowing fox curled on a stone, a pair of luminous fawns drinking at the water, a fluffy cloud-sheep grazing, a small moss-backed rabbit), MINI-MYTHICS (a palm-sized dragon-kitten napping, a tiny phoenix-bird preening, a baby gryphon-cub, a small unicorn-foal), WATER LIFE (glowing koi gliding in the stream, a tiny otter on a lily-pad, bubble-snails on a leaf), WINGED (a luminous owl on a branch, a hummingbird of light, a tiny pastel deer-bird), SPRITES (a chibi forest-sprite peeking out, a glowing wisp-creature, a thumb-sized mushroom-elf).

✅ GOOD: "a tiny glowing fox curled asleep on a mossy stone by the water"
✅ GOOD: "a pair of luminous fawns drinking at the stream's edge, small in the distance"`,
    instructions: `Generate NEW tiny charming AMBIENT creatures dwarfed in a candy-fantasy world — rare magical life, a discovered detail not the hero. 6-16 words, ONE line. Creature only — small-scale, never a human.`,
    subThemes: [
      'GLOWING MAMMALS — a tiny glowing fox curled on a stone, luminous fawns at the water, a fluffy cloud-sheep grazing, a moss-backed rabbit, a small glowing wolf-pup, a soft-lit hedgehog',
      'MINI-MYTHICS — a palm-sized dragon-kitten napping, a tiny phoenix-bird preening, a baby gryphon-cub, a small unicorn-foal, a thumb-sized pegasus, a curled baby wyvern',
      'WATER LIFE — glowing koi gliding in the stream, a tiny otter on a lily-pad, bubble-snails on a leaf, a small turtle with a flowering shell, luminous frogs on a pad',
      'WINGED — a luminous owl on a branch, a hummingbird of light, a tiny pastel deer-bird, a glowing songbird pair, a small moth-winged sprite-bird',
      'SPRITES — a chibi forest-sprite peeking from the blooms, a glowing wisp-creature, a thumb-sized mushroom-elf, a tiny floating star-spirit, a small leaf-cloaked pixie',
    ],
  },

  // ════════════════ BUTTERFLY-REALM — striking butterflies in a DREAMSCAPE ════
  // 2026-06-27 (new path, R1 redesign after R0 "spammy / too flowery / not dreamy"
  // feedback). NO character — striking BUTTERFLIES are the hero of a CLEAN, dreamy,
  // WHIMSICAL scene (refs: eroticbotanical.art blue-morpho-blanketed MOSSY TRUNK in
  // a misty forest + ai_bubnova butterfly-rainbow over a vista). The references are
  // RESTRAINED: ONE clean striking subject against misty negative space — NOT a
  // packed flower garden. So: de-flowered, composition-over-density, + a WHIMSY axis
  // for dream-magic. 6 axes. AXIS-CLEAN: setting owns BIOME, palette owns BUTTERFLY
  // COLOR, composition owns ARRANGEMENT, whimsy owns the SURREAL DREAM ELEMENT,
  // atmosphere owns LIGHT, feature owns the ONE clean anchor.

  butterfly_realm_setting: {
    label: 'butterfly-realm setting',
    maxWords: 18,
    theme: `Each entry is ONE vivid, COLORFUL, SURREAL fantasy DREAM-WORLD the butterflies inhabit — the stage. These are DREAMS, NOT rooted in realism: saturated color, luminous magic, wonder, with real atmospheric DEPTH (so the butterflies stay the crisp hero). Push past the muted gray misty forest — these worlds GLOW with dreamlike color. The butterflies + dream-magic are added by other axes; this is the vivid STAGE.

⚠️ TERSE REGISTER: a SHORT 10-18 word fragment — name the dream-world + its vivid color/light signature + a depth cue, then STOP. ONE comma-joined fragment.
  ✅ GOOD: "a bioluminescent forest glowing teal and magenta, glowing trunks receding into luminous violet haze"
  ✅ GOOD: "a candy-pastel cloud valley of pink and mint mist, glowing peaks fading into a golden horizon"
  ✅ GOOD: "an enchanted twilight glade lit electric-blue and gold, glowing ferns vanishing into dreamy haze"
  ❌ TOO MUTED: "a gray misty forest of trunks vanishing into silver fog" (too pedestrian, not vivid).
  ❌ TOO LONG: a multi-clause paragraph.

OWN ONLY THE SETTING. Do NOT mention butterflies, the focal feature, the palette, the whimsy element, or flowers/flora lists. Just the vivid dream-world + its color/light + atmospheric depth.

🚫 IMPORTANT — NOT a flower garden. Worlds are glowing forests, valleys, water, crystal, sky, dream-spaces — NOT flower meadows / lavender fields / formal gardens (butterflies are the color here). Keep flowers OUT of the setting.

VARIETY MANDATE — spread WIDELY across VIVID DREAM-WORLDS (each glowing with color, with atmospheric depth):
  A. BIOLUMINESCENT FOREST  B. ENCHANTED MOONLIT GLADE  C. JEWEL-TONE FOG WATER (lake/falls/pool)
  D. SURREAL FLOATING-ISLAND VISTA  E. AURORA HIGHLAND / NIGHT  F. CANDY-PASTEL CLOUD REALM
  G. CRYSTAL GROTTO / CAVERN  H. SUNSET / GOLDEN-HOUR VALLEY  I. EMERALD JUNGLE GORGE (lush, glowing)
  J. COSMIC STARLIT CLEARING  K. PRISMATIC TWILIGHT WOOD  L. DREAMLIKE MIRROR-WORLD (impossible, reflective)

🚫 BANS: NO butterflies, NO humans, NO flowers-as-subject, NO scary/dark. Spread across A-L. OMIT negation. Never exceed 18 words.`,
    instructions: `Generate NEW vivid SURREAL dream-worlds across families A-L — a glowing colorful fantasy biome + its vivid color/light signature + depth cue. NOT muted gray. 10-18 word terse fragments, ONE line each. Setting only — no butterflies, no feature, no palette, no whimsy, NO flowers.`,
    subThemes: [
      'BIOLUMINESCENT FOREST — glowing teal-and-magenta trunks, softly luminous old growth, an electric-glow grove receding into violet haze, glowing-fern cathedrals of light',
      'ENCHANTED MOONLIT GLADE — a silver-and-sapphire moonlit clearing, an enchanted glade glowing blue and gold, a luminous grove under a magic glow, dreamy lit birches',
      'JEWEL-TONE FOG WATER — a turquoise mirror-lake under glowing fog, an emerald cascade into a luminous pool, an amethyst-misted reflecting tarn, a glowing spring',
      'SURREAL FLOATING-ISLAND VISTA — drifting glowing islands over a saturated valley, floating dreamscape with luminous skybridges, suspended lands fading to a glowing horizon',
      'AURORA HIGHLAND / NIGHT — an aurora rippling green-and-violet over glowing moorland, an electric-night highland, a luminous nightscape under shifting color',
      'CANDY-PASTEL CLOUD REALM — a pink-and-mint cloud valley, a cotton-candy sky-sea glowing peach and lilac, a pastel dream-realm above luminous clouds',
      'CRYSTAL GROTTO / CAVERN — a glowing-crystal grotto of sapphire and rose, a luminous geode cavern, a prismatic crystal canyon fading into glowing depths',
      'SUNSET / GOLDEN-HOUR VALLEY — a saturated golden-amber valley aglow, a tangerine-and-rose sunset highland, a warm luminous dreamy vale fading to a bright horizon',
      'EMERALD JUNGLE GORGE — a luminous emerald gorge glowing with green light, a lush radiant cloud-forest chasm, a glowing vine-draped ravine fading to bright haze',
      'COSMIC STARLIT CLEARING — a glade open to a vivid nebula sky, a clearing under a glowing aurora-starfield, a dreamy meadow beneath a luminous galaxy band',
      'PRISMATIC TWILIGHT WOOD — a violet-and-coral twilight forest glowing with color, an iridescent dusk grove, a prismatic evening wood lit in shifting hues',
      'DREAMLIKE MIRROR-WORLD — an impossible glassy mirror-realm doubling a glowing sky, a reflective dream-plain of luminous color, a surreal mirrored dreamscape',
    ],
  },

  butterfly_realm_feature: {
    label: 'butterfly-realm feature',
    maxWords: 14,
    theme: `Each entry is ONE clean, striking natural CENTERPIECE the scene is built around — the SINGLE focal anchor butterflies swarm/cling to, OR an open-air option for sky scenes. ONE clean element (NOT a cluttered garden). Beautiful, photogenic, dreamy. NOT the full setting, NOT the butterflies, NOT the palette.

⚠️ Mostly NON-FLORAL — the references are butterflies on BARK/STONE/in OPEN AIR, not flowers. Keep flowers rare (an occasional single blossoming tree is fine, but default to trunks / water / stone / open air).

Spread across: TRUNK / TREE (a colossal moss-covered ancient trunk — the hero reference; a lone gnarled tree; a fallen mossy log; a great bare branch), WATER (a tall waterfall; a still mirror-pool; a misty cascade), STONE (a mossy standing stone; a weathered stone arch; a lichen-crusted boulder; a rock spire), AERIAL / OPEN (open misty air with no ground anchor; a lone floating island; a drifting branch), occasionally a SINGLE blossoming tree.

✅ GOOD: "a colossal moss-covered ancient tree trunk, gnarled bark glistening with dew"
✅ GOOD: "open misty air over the valley, no ground feature — the sky is the stage"
✅ GOOD: "a single mossy standing stone in the clearing"`,
    instructions: `Generate NEW clean single CENTERPIECES — mostly trunks / water / stone / open-air (flowers rare). 5-14 words, ONE line. ONE feature only — no full setting, no butterflies, no palette, no clutter.`,
    subThemes: [
      'TRUNK / TREE — a colossal moss-covered ancient tree trunk, a lone gnarled tree, a fallen moss-furred log, a great dew-glistening bare branch, a lichen-bearded old snag',
      'WATER — a tall misty waterfall, a still dark mirror-pool, a tiered cascade over mossy rock, a fog-wreathed spring, a glassy reflecting tarn',
      'STONE — a mossy standing stone, a weathered stone arch, a lichen-crusted boulder, a slender rock spire, a moss-covered ruined column',
      'AERIAL / OPEN AIR — open misty air with no ground anchor (the sky is the stage), a lone floating island, a single drifting bough, an empty luminous expanse',
      'SINGLE BLOSSOMING TREE (use sparingly) — one lone tree in soft blossom, a single weeping flowering branch, a solitary blossom-laden bough',
    ],
  },

  butterfly_realm_composition: {
    label: 'butterfly-realm composition',
    maxWords: 20,
    theme: `Each entry is ONE striking, CLEAN, GRACEFUL ARRANGEMENT of the butterflies — HOW they are the unmistakable focal point. Owns ARRANGEMENT ONLY: no specific color (palette axis), no setting, no light. Refer to "the butterflies" generically so the palette axis sets their color.

⚠️ CLEAN + GRACEFUL, NOT SWIRLY — the arrangements are readable, graceful shapes with a few LARGE crisp hero butterflies in the near field. ❌ NO chaotic swirling vortexes, NO churning galaxy-spirals, NO twisting tornado-columns, NO frantic ribbon-streams — those read as "swirly noise." A gentle column, a soft sweeping arc, or a feature blanketed in wings is the goal, not a whirlpool.

A few butterflies LARGE and exquisitely crisp in the near foreground (the clear focal point), the rest forming ONE cohesive, readable shape.

VARIETY MANDATE — spread across these CLEAN arrangements:
  • DESCENDING COLUMN / CASCADE — a graceful column of butterflies descending the frame, largest in front and tapering smaller into the depth (the hearted look).
  • BLANKETING A FEATURE — the butterflies densely cloak / cover the focal feature (trunk/stone/branch), a few lifting off into the clear air.
  • BIG FLOATING HEROES — two or three huge crisp butterflies floating front-and-center, a soft scatter of smaller ones drifting behind in the haze.
  • GATHERED ON BRANCHES — the butterflies perched and clustered across boughs/foreground foliage, wings open, a few in flight above.
  • GENTLE SWEEPING ARC — one soft sweeping arc / band of butterflies curving across the frame, thinning gracefully into the atmosphere.
  • RISING DRIFT — a soft, loose drift of butterflies rising gently upward, largest below, dispersing softly into glowing air.

✅ GOOD: "a graceful column of butterflies descending the frame, the largest crisp in front, tapering smaller into the glowing depth"
✅ GOOD: "two or three huge crisp butterflies floating front-and-center, a soft scatter drifting behind in the haze"
✅ GOOD: "the butterflies densely blanketing the feature, wings overlapping, a graceful few lifting off into the clear air"`,
    instructions: `Generate NEW CLEAN, graceful butterfly ARRANGEMENTS across the six families above — readable shapes with a few large crisp hero butterflies. NO swirling vortex / galaxy-spiral / tornado / churning-ribbon language. Refer to "the butterflies" generically. 8-20 words, ONE line. Arrangement only — no color, no setting, no light.`,
    subThemes: [
      'DESCENDING COLUMN / CASCADE — a graceful column descending the frame, the largest crisp in front tapering smaller into the depth, a soft cascade of wings flowing downward',
      'BLANKETING A FEATURE — the butterflies densely cloaking the trunk/stone/branch, wings overlapping like scales, a few gracefully lifting off into the clear air',
      'BIG FLOATING HEROES — two or three huge exquisitely crisp butterflies floating front-and-center, a soft scatter of smaller ones drifting behind in the glowing haze',
      'GATHERED ON BRANCHES — the butterflies perched and clustered across boughs and foreground foliage, wings open and vivid, a graceful few in flight above',
      'GENTLE SWEEPING ARC — one soft sweeping arc of butterflies curving across the frame, a single living-color band thinning gracefully into the luminous atmosphere',
      'RISING DRIFT — a soft loose drift of butterflies rising gently upward, the largest crisp below, dispersing softly into the glowing air',
    ],
  },

  butterfly_realm_palette: {
    label: 'butterfly-realm palette',
    maxWords: 18,
    theme: `Each entry is ONE cohesive BUTTERFLY COLOR STORY — the color of the butterfly mass, which is the focal point. Owns the BUTTERFLY COLOR ONLY: no setting, no light, no arrangement.

⚠️ Flux renders named species in their PRIOR color — lean on that: "blue morpho" = electric blue, "monarch" = orange-black, "glasswing" = translucent, "sulphur" = yellow. Name species/hues so the color reads true.

⚠️ COLOR VARIETY IS CRITICAL — the feed was way too BLUE. Spread the color WIDE across the full spectrum; blue is just ONE of many. Aim for roughly EVEN coverage: gold/yellow, orange, crimson/red, emerald/green, violet/purple, pink/rose, white/opal, AND blue — plus rich multicolor mixes. Blue morpho stays in the rotation as one striking option, NOT the default.

✅ GOOD: "a mass of golden-amber butterflies, glowing lemon-and-honey wings veined in soft bronze"
✅ GOOD: "a cloud of deep violet-and-magenta butterflies, iridescent amethyst wings edged in black"
✅ GOOD: "a full-spectrum rainbow of mixed butterflies — scarlet, orange, gold, emerald, sapphire, violet"`,
    instructions: `Generate NEW butterfly COLOR STORIES spread EVENLY across the full spectrum (gold, orange, crimson, emerald, violet, pink, white/opal, blue) plus multicolor/rainbow/jewel mixes. Do NOT over-produce blue — it is one option among many. Name species/hues for true color. 8-18 words, ONE line. Butterfly color only — no setting, no light, no arrangement.`,
    // NOTE: the gen family-loop fills in order and can starve the LAST families
    // once the total target is met, so BLUE + RAINBOW lead here to guarantee their
    // (modest) share; the warm/cool single-colors follow.
    subThemes: [
      'BLUE MORPHO (one option, not the default) — electric cobalt-blue morphos edged in black, shimmering sapphire-and-cerulean masses, luminous turquoise-blue wings',
      'RAINBOW / JEWEL / SUNSET MULTICOLOR — full-spectrum rainbow of mixed species; sapphire+emerald+amethyst+ruby+gold jewel mix; coral+tangerine+rose-gold sunset swarms',
      'WARM GOLD / YELLOW / AMBER — golden-amber butterflies glowing lemon and honey, sulphur-yellow masses, chrome-gold wings, soft buttercup-and-bronze, luminous topaz swarms',
      'ORANGE / CRIMSON / RED — orange-black monarchs, burnt-tangerine swarms, deep crimson swallowtails, scarlet-ruby wings veined in black, blood-orange-and-gold masses',
      'EMERALD / GREEN — luminous emerald-green butterflies shifting teal and gold, jade-and-chartreuse wings, iridescent malachite swarms, soft mint-and-lime masses',
      'VIOLET / PURPLE / PINK / ROSE — deep amethyst-and-magenta butterflies, violet-shot iridescent wings, rose-pink-and-lilac masses, orchid-purple swarms edged in black',
      'WHITE / OPAL / PASTEL / GLOW — luminous white glasswings, opalescent holographic wings, pearl-shimmer prismatic, soft pastel pink-lilac-mint, bioluminescent fairy-glow',
    ],
  },

  butterfly_realm_whimsy: {
    label: 'butterfly-realm whimsy',
    maxWords: 16,
    theme: `Each entry is ONE surreal, magical DREAM ELEMENT that makes the scene a DREAMSCAPE — the single touch of whimsy and wonder that lifts it out of "literal nature photo" into a DREAM (one rolled per render, so it must stand alone and be evocative). Dreamy, ethereal, magical, otherworldly. NO humans.

Spread across: CELESTIAL (a giant luminous low moon behind the trees, a second smaller moon, a brilliant low Milky-Way band, a low ringed planet, a soft aurora rippling overhead), GLOWING DRIFT (a scatter of floating glowing orbs, drifting will-o-wisps, a haze of luminous light-motes, fairy-lights hanging in the air), LUMINOUS WORLD (everything faintly bioluminescent, glowing mushrooms underfoot, a tree of soft light, glowing dew suspended in air), IMPOSSIBLE / SURREAL (floating islands drifting beyond, gravity-soft floating rocks, a mirror-still reflection doubling the whole dream, an impossibly oversized butterfly far in the distance, a glowing archway of light), ETHEREAL AIR (a low river of glowing mist, drifting light-petals, slow-falling sparkle-snow).

✅ GOOD: "a giant luminous moon hanging low behind the misty trees"
✅ GOOD: "a scatter of soft glowing orbs drifting through the air"
✅ GOOD: "a mirror-still reflection doubling the whole dream below"`,
    instructions: `Generate NEW surreal DREAM ELEMENTS — celestial / glowing drift / luminous world / impossible-surreal / ethereal air. Each is ONE evocative touch of whimsy. 5-16 words, ONE line. A dream element only — no humans, no full setting, no butterfly color.`,
    subThemes: [
      'CELESTIAL — a giant luminous low moon behind the trees, a second smaller moon, a brilliant low Milky-Way band, a low ringed planet on the horizon, a soft aurora rippling overhead',
      'GLOWING DRIFT — a scatter of floating glowing orbs, drifting will-o-wisps, a haze of luminous light-motes, fairy-lights suspended in the air, slow-rising glow-sparks',
      'LUMINOUS WORLD — everything faintly bioluminescent, glowing mushrooms underfoot, a tree made of soft light, glowing dew suspended midair, softly luminescent moss',
      'IMPOSSIBLE / SURREAL — floating islands drifting beyond, gravity-soft floating rocks, a mirror-still reflection doubling the whole dream, an impossibly oversized butterfly far in the distance, a glowing archway of light',
      'ETHEREAL AIR — a low river of glowing mist winding through, drifting light-petals, slow-falling sparkle-snow, ribbons of luminous fog, a soft veil of floating light',
    ],
  },

  butterfly_realm_atmosphere: {
    label: 'butterfly-realm atmosphere',
    maxWords: 16,
    theme: `Each entry is ONE dreamy, LUMINOUS, COLORFUL LIGHT treatment + atmospheric glow for the whole scene — the light behavior + glowing haze that give the vivid DREAM-WORLD look with real DEPTH (the depth keeps the butterflies the crisp hero; the COLOR keeps it from looking pedestrian). Describe light by QUALITY / DIRECTION / TIME + the GLOWING AIR. Lean into COLOR in the light (golden, rose, teal, violet, amber, magenta) — NOT muted gray.

Spread across: GOLDEN-HOUR GLOW (warm amber backlight rim-lighting wings, a glowing honey haze), MAGIC-HOUR COLOR (rose-and-violet dusk glow, magenta-gold twilight light), GOD-RAYS (luminous colored light-shafts pouring through a glowing canopy), AURORA / NIGHT GLOW (shifting green-violet night light, electric moon-glow), BIOLUMINESCENT (the air itself softly glowing teal/blue/pink, an internal luminance), PRISMATIC DIFFUSE (soft iridescent pearl-rainbow light, a luminous dreamy haze).

⚠️ Keep real atmospheric DEPTH (so the butterflies pop) but make the light COLORFUL and LUMINOUS, never a flat muted gray. No swirling/churning fog — soft glowing haze.

✅ GOOD: "warm amber god-rays pouring through a glowing canopy, the depths dissolving into honey haze"
✅ GOOD: "rose-and-violet dusk glow, the air luminous, far depths fading into magenta light"
✅ GOOD: "softly bioluminescent teal air glowing from within, a dreamy luminous haze"`,
    instructions: `Generate NEW dreamy, LUMINOUS, COLORFUL light treatments — colored light behavior (quality/direction/time) + a glowing atmospheric haze with real depth. Lean vivid/colorful, never muted gray; no swirling fog. 8-16 words, ONE line. Light + glow only — no butterfly color, no setting, no dream element.`,
  },

  // ════════════════ CROSSOVER WORLDS — the bubble-bot visits other bots ═══════
  // Each = a themed dream_world pool (the bot's scenes), rendered in DreamBot's
  // glossy-dreamy register. World-focused voice (no bot detail; the renderer
  // places the bubble-bot small-to-medium). See DREAMBOT_CROSSOVER_PLAN.md.

  bubble_world_earthbot: {
    label: 'earthbot world',
    maxWords: 22,
    theme: `Each entry is ONE breathtaking real-Earth NATURE landscape in the spirit of EarthBot — monumental, awe-scale natural places (epic peaks, turquoise atolls, glaciers, canyons, waterfalls, savannas, sea-cliffs) — written as a DreamBot wallpaper WORLD: soft, luminous, pastel-tinted, frame-worthy, with TOWERING / VAST natural scale so a small bubble-bot placed in it reads tiny. Describe ONLY the world (the bot is placed by the renderer). Keep it WHOLESOME + dreamy — gentle pastel-natural light, never gritty/documentary/harsh.

⚠️ TERSE 12-22 word fragment: the natural place + its monumental-scale feature + a depth/horizon cue, then STOP.
  ✅ "a vast snow-capped granite peak rising over a glacial valley, scattered boulders in the foreground, soft mist filling the depths"
  ✅ "a white-sand atoll tideline, turquoise-to-cobalt lagoon stretching to a distant palm-fringed reef under a soft pastel sky"

🚫 BANS: NO bubble-bot/character detail (separate axis). NO people, NO buildings or cities — wild untouched nature only. Keep pastel-dreamy. ≤22 words.`,
    instructions: `Generate NEW epic Earth-nature worlds across the families — terse 12-22 word fragments, monumental natural feature + named elements + depth cue, pastel-dreamy. World ONLY.`,
    subThemes: [
      'ALPINE PEAKS — granite summits, snow-capped massifs, jagged ridgelines, glacial valleys, alpine mountain lakes, scree slopes',
      'TROPICAL ATOLLS / BEACHES — turquoise lagoons, white-sand motus, coral reefs, palm-fringed coves, sandbars, sea-stacks',
      'GLACIERS / ICE / POLAR — blue crevassed glaciers, ice caves, frozen fjords, aurora over snowfields, iceberg bays, drift-ice plains',
      'CANYONS / DESERT ROCK — sandstone hoodoos, red-rock arches, slot canyons, mesa plateaus, painted-desert dunes, monument buttes',
      'WATERFALLS / RIVERS / LAKES — plunging cascades, braided river deltas, mirror lakes, jungle streams over smooth stones, fjord waterfalls',
      'SAVANNA / GRASSLAND / FOREST — golden-hour savanna, wildflower meadows, redwood groves, autumn-gold valleys, misty rainforest canopy',
      'COASTAL CLIFFS / SEA — towering sea-cliffs, basalt columns, crashing-wave coves, tide pools, headland arches, lighthouse promontories',
    ],
  },

  bubble_world_brickbot: {
    label: 'brickbot world',
    maxWords: 22,
    theme: `Each entry is ONE world BUILT ENTIRELY FROM LEGO BRICKS in the spirit of BrickBot — every structure, terrain, and prop is studded brick-built (color-blocked plastic bricks, visible studs + seams, minifig-scale, baseplate ground). Written as a DreamBot wallpaper WORLD in the glossy register: the whole scene is unmistakably LEGO. Describe ONLY the world (the bubble-bot is placed by the renderer). Cheerful + colorful.

⚠️ Every entry MUST read as LEGO — use "brick-built / LEGO / studded / minifig / baseplate" so the scenery IS bricks. Terse 12-22 word fragment: the brick-built place + a signature build + a depth cue.
  ✅ "a brick-built LEGO pirate galleon moored in a studded sapphire-baseplate harbor, palm-brick shore, minifig crew on deck"
  ✅ "a brick-built LEGO castle courtyard of grey studded walls and pennant towers, minifig guards, a green-baseplate hill beyond"

🚫 BANS: NO bubble-bot/character detail (separate axis). NO non-LEGO photoreal scenery — EVERYTHING is brick-built. Keep cheerful. ≤22 words.`,
    instructions: `Generate NEW all-LEGO brick-built worlds across the families — terse 12-22 word fragments, every scene unmistakably studded-brick (say brick-built/LEGO/minifig) + a signature build + depth cue. World ONLY.`,
    subThemes: [
      'PIRATE — brick-built galleons, harbor docks, treasure coves, island lagoons, shipwreck reefs, fort ramparts',
      'CASTLE / FANTASY — brick-built castles, wizard towers, dragon lairs, elven treetop villages, throne halls, siege walls',
      'MODERN CITY / VEHICLES — brick-built city streets, train yards, harbors with cranes, race tracks, fire stations, skyscraper blocks',
      'SPACE / SCI-FI — brick-built space docks, moon bases, rocket gantries, rover plains, alien-planet outposts',
      'NATURE / ADVENTURE DIORAMA — brick-built jungle temples, arctic research bases, volcano labs, safari plains, mountain ski villages',
    ],
  },

  bubble_world_dragonbot: {
    label: 'dragonbot world',
    maxWords: 22,
    theme: `Each entry is ONE epic HIGH-FANTASY world in the spirit of DragonBot — painted-fantasy realms of castles, arcane libraries, floating sky-castles, elven cities, enchanted wilds, and FRIENDLY dragons — written as a DreamBot wallpaper WORLD in the glossy-dreamy register (soft luminous pastel, frame-worthy), with grand/towering scale so a small bubble-bot reads tiny. Describe ONLY the world. WHOLESOME + wondrous — any dragon is gentle/friendly, never menacing.

⚠️ TERSE 12-22 word fragment: the fantasy place + a grand signature feature + a depth/light cue, then STOP.
  ✅ "a vast castle great-hall with soaring arched windows over a misty valley, banners hanging, warm light shafts crossing the stone"
  ✅ "a floating sky-castle terrace above an endless cloud-sea, stone sky-bridges arching to distant spires, sun breaking through"

🚫 BANS: NO bubble-bot/character detail (separate axis). NO humans (the bubble-bot is the only character). Dragons gentle + friendly. NO gore/menace — wondrous, not grim. ≤22 words.`,
    instructions: `Generate NEW high-fantasy worlds across the families — terse 12-22 word fragments, grand fantasy place + signature feature + depth/light cue, glossy-dreamy + wholesome. World ONLY.`,
    subThemes: [
      'CASTLES / FORTRESSES — great-halls, throne rooms, rampart courtyards, tower libraries, banner-hung corridors, drawbridge gates',
      'ARCANE / MAGIC HALLS — vaulted spell-libraries with floating tomes + glowing orbs, alchemist sanctums, rune-circle chambers, crystal vaults',
      'SKY-CASTLES / FLOATING REALMS — floating islands, cloud-sea terraces, stone sky-bridges, drifting spire-cities, aurora skies',
      'ELVEN / ENCHANTED CITIES — luminous white-stone spires woven with living trees, glowing garden-bridges, waterfall palaces, moonlit courtyards',
      'FANTASY WILDS + FRIENDLY DRAGONS — enchanted forests, glowing mushroom glades, a gentle dragon at a mountain roost, mossy ruins, crystal caverns',
    ],
  },

  bubble_world_bloombot: {
    label: 'bloombot world',
    maxWords: 22,
    theme: `Each entry is ONE lush, flower-overflowing world in the spirit of BloomBot — MONUMENTAL blooms and dense floral abundance fill the frame (building-sized flowers, petal-carpets, jewel-tone foliage), written as a DreamBot wallpaper WORLD in the glossy-dreamy register. Towering floral scale so a small bubble-bot reads tiny. Describe ONLY the world. NEVER sparse — overflowing with blooms.
  ✅ "a towering jungle of giant exotic blooms in jewel-violet and gold, petals raining through golden god-rays, ferns carpeting below"
  ✅ "a flower-tunnel archway of clustered cream-and-rose petals, glowing inner-light, monstera leaves draping the entrance"

🚫 BANS: NO bubble-bot detail (separate axis). NO humans. NEVER sparse/barren — blooms must dominate. ≤22 words.`,
    instructions: `Generate NEW flower-overflowing worlds across families — terse 12-22 word fragments, monumental blooms dominating + named flora + depth cue, glossy-dreamy. World ONLY.`,
    subThemes: [
      'TROPICAL BLOOM-JUNGLE — giant exotic flowers, monstera/elephant-ear canopy, petal-carpet floors, dense understory',
      'FLOWER TUNNELS / ARCHWAYS — vine-arches of clustered petals, blossom-draped colonnades, glowing flower-passages',
      'LAGOON / WATER BLOOMS — lily-pad lagoons, lotus ponds, bloom-reflections on still water, waterfall flower-gardens',
      'VOLCANIC / LAVA-ROCK BLOOMS — deep-indigo blooms rising from black lava rock, flowers in volcanic crevices, glowing cave-blooms',
      'GIANT SINGLE-BLOOM FIELDS — endless fields of one colossal flower-type, monochrome bloom-seas (all-rose, all-violet, all-gold)',
      'CONSERVATORY / GARDEN — glass-house bloom cathedrals, rose-garden arches, wisteria courtyards bursting with flowers',
      'DESERT / MEADOW WILDFLOWERS — wildflower super-blooms, desert flower explosions, alpine flower meadows under soft light',
    ],
  },

  bubble_world_chibibot: {
    label: 'chibibot world',
    maxWords: 22,
    theme: `Each entry is ONE cozy storybook CREATURE-VILLAGE or habitat in the spirit of ChibiBot — whimsical little settlements where cute creatures live (treehouse villages, mushroom-cap hamlets, stilt-villages, cottagecore clusters, cozy interiors), written as a DreamBot wallpaper WORLD in the glossy-dreamy register. Warm, wholesome, precious. Describe ONLY the world.
  ✅ "a treehouse village strung between giant ceiba trunks, woven rope-bridges, lantern-flower porches glowing amber under leafy canopy"
  ✅ "a mushroom-cap village on a moss meadow, each toadstool cottage a cheerful color, twig bridges over a pebble stream"

🚫 BANS: NO bubble-bot detail (separate axis). NO humans. Keep cozy + wholesome + storybook. ≤22 words.`,
    instructions: `Generate NEW cozy creature-village worlds across families — terse 12-22 word fragments, whimsical settlement + signature cozy detail + depth cue, glossy-dreamy. World ONLY.`,
    subThemes: [
      'TREEHOUSE VILLAGES — platforms in giant trunks, vine rope-bridges, lantern-flower porches, woven canopy markets',
      'MUSHROOM-CAP HAMLETS — toadstool cottages, fairy-ring squares, twig bridges over pebble streams, moss meadows',
      'COTTAGECORE VILLAGES — cobblestone lanes, flower-box cottages, market wells, stone arch bridges, warm window-glow',
      'AQUATIC STILT-VILLAGES — bamboo huts on jade streams, plank walkways, clay oil-lamps, bioluminescent water accents',
      'ARCTIC / SNOW VILLAGES — snow-roofed compact huts, ice-fishing harbors, lantern-lit drifts, cozy chimney smoke',
      'COZY INTERIORS — warm cottage parlors by stone fireplaces, plant-filled greenhouse nooks, rainy-window reading dens',
      'MEADOW / FOREST CLEARINGS — moonlit meadows, dappled forest paths, mossy stone-arch bridges, fern-edged glades',
    ],
  },

  bubble_world_dinobot: {
    label: 'dinobot world',
    maxWords: 22,
    theme: `Each entry is ONE prehistoric Mesozoic world in the spirit of DinoBot — lush ancient landscapes (fern glades, primordial swamps, volcanic highlands, amber forests, pterosaur cliffs) where FRIENDLY giant dinosaurs roam as gentle scale-giants — written as a DreamBot wallpaper WORLD in the glossy-dreamy register. Towering ancient flora so a small bubble-bot reads tiny. Describe ONLY the world. Keep it wholesome — dinos are gentle giants, never menacing.
  ✅ "a Cretaceous fern glade with towering cycad fronds, a gentle long-necked dino grazing distant, golden light dappling the mist"
  ✅ "an amber forest of resin-dripping trunks glowing honey-gold, soft ferns below, a friendly dino silhouette through the haze"

🚫 BANS: NO bubble-bot detail (separate axis). NO humans. Dinos gentle/friendly, never scary. Keep pastel-dreamy. ≤22 words.`,
    instructions: `Generate NEW prehistoric worlds across families — terse 12-22 word fragments, ancient flora/feature + a gentle dino + depth cue, glossy-dreamy. World ONLY.`,
    subThemes: [
      'FERN / CYCAD GLADES — towering cycad fronds, giant tree-ferns, dappled humid light, gentle grazing dinos distant',
      'PRIMORDIAL SWAMPS — giant horsetails in tannin-dark water, drifting mist, dragonflies, a wading gentle dino',
      'VOLCANIC HIGHLANDS — glowing lava rivers, steaming fumaroles, ash plains, distant smoking peaks (soft, not threatening)',
      'AMBER FORESTS — resin-dripping trunks glowing honey-gold, insects in golden sap, soft fern floor',
      'PTEROSAUR CLIFFS — chalk sea-cliffs with nesting ledges, pterosaurs wheeling overhead, inland sea below at sunset',
      'CRETACEOUS RIVER DELTAS — braided channels through mudflats, flowering primitive blooms, a gentle dino at the water',
      'MISTY PRIMORDIAL JUNGLE — humid twilight canopy, hanging vines, glowing primitive flowers, a gentle dino in the haze',
    ],
  },

  bubble_world_faebot: {
    label: 'faebot world',
    maxWords: 22,
    theme: `Each entry is ONE enchanted FAE FOREST in the spirit of FaeBot — peaceful magical woodlands (ancient oaks, bluebell clearings, mushroom rings, willow-stream archways, fern grottoes) glowing with soft phosphorescent magic — written as a DreamBot wallpaper WORLD in the glossy-dreamy register. Towering ancient trees so a small bubble-bot reads tiny. Describe ONLY the world.
  ✅ "a grove of towering ancient oaks woven with phosphorescent moss, dewdrops glowing on standing stones, golden light breaking through"
  ✅ "a bluebell clearing ringed with glowing mushrooms, a willow's leaf-curtain over a moonlit stream, fireflies drifting"

🚫 BANS: NO bubble-bot detail (separate axis). NO humans. Keep peaceful + magical + wholesome. ≤22 words.`,
    instructions: `Generate NEW enchanted fae-forest worlds across families — terse 12-22 word fragments, magical woodland + glowing detail + depth cue, glossy-dreamy. World ONLY.`,
    subThemes: [
      'ANCIENT OAK GROVES — towering moss-woven oaks, root-cathedral arches, phosphorescent lichen, golden dappled shafts',
      'BLUEBELL / MUSHROOM CLEARINGS — bluebell carpets, glowing mushroom rings, fairy-circle meadows, drifting pollen-motes',
      'WILLOW-STREAM ARCHWAYS — willow leaf-curtains over moonlit streams, root archways, lily-dotted brooks, firefly glow',
      'FERN GROTTOES — fern-draped hollows, mossy boulder caves, dripping pearlescent dewdrops, soft inner-glow',
      'STANDING-STONE RINGS — ancient moss-covered standing stones, rune-glow, mist pooling, twilight forest beyond',
      'MOONLIT GLADES — silver-lit clearings, glowing seed-spores drifting up, a will-o-wisp orb, deep navy canopy shadow',
      'PHOSPHORESCENT FUNGUS HOLLOWS — glowing fungus cathedrals, bioluminescent toadstools, fairy-light pools in the dark',
    ],
  },

  bubble_world_gothbot: {
    label: 'gothbot world',
    maxWords: 22,
    theme: `Each entry is ONE PRETTY-SPOOKY gothic world in the spirit of GothBot — but made CUTE and wholesome (think cozy-Halloween / pastel-goth / friendly-haunted, NEVER scary or grim): pastel gothic castles, softly-glowing crypts, friendly overgrown carnivals, gargoyle ledges under a big moon, pumpkin-lantern courtyards — written as a DreamBot wallpaper WORLD in the glossy-dreamy register. Towering gothic architecture so a small bubble-bot reads tiny. Describe ONLY the world.
  ✅ "a pastel-stone gothic castle courtyard under a huge friendly moon, glowing pumpkin-lanterns, soft violet mist curling low"
  ✅ "a softly-glowing crypt garden of mossy arches and candle-lit niches, witch-fire glowing gentle green, fireflies drifting"

🚫 BANS: NO bubble-bot detail (separate axis). NO humans, NO gore, NO real horror/menace — cute spooky ONLY. Keep it charming + pretty. ≤22 words.`,
    instructions: `Generate NEW cute-spooky gothic worlds across families — terse 12-22 word fragments, charming-gothic place + soft glow + depth cue, glossy-dreamy + wholesome. World ONLY.`,
    subThemes: [
      'PASTEL GOTHIC CASTLES — moonlit pastel-stone castles, arched courtyards, pennant towers, soft violet mist, big friendly moon',
      'GLOWING CRYPTS / CATACOMBS — mossy arch crypts, candle-lit niches, gentle green witch-fire glow, firefly drifts',
      'FRIENDLY OVERGROWN CARNIVALS — rusted-but-charming ferris wheel in blackthorn-vine, glowing booths, twilight cotton-candy mist',
      'GARGOYLE CATHEDRAL LEDGES — friendly gargoyles on cathedral spires, stained-glass glow, a huge moon, bats like little kites',
      'PUMPKIN-LANTERN COURTYARDS — jack-o-lantern paths, autumn-leaf swirls, cozy candle-glow, cobweb-lace twinkling with dew',
      'MOONLIT GRAVEYARD GARDENS — pretty mossy headstones among flowers, glowing wisps, weeping-willow arches, soft silver light',
      'WITCH-COTTAGE GLOW — cozy crooked witch-cottages, bubbling cauldron-glow, hanging herbs + lanterns, misty enchanted woods',
    ],
  },

  bubble_world_mangabot: {
    label: 'mangabot world',
    maxWords: 22,
    theme: `Each entry is ONE anime-style world in the spirit of MangaBot — spanning neon Neo-Tokyo, Ghibli countryside, sakura temple gardens, magical-girl rooftops, isekai fantasy realms — written as a DreamBot wallpaper WORLD in the glossy-dreamy register (the anime SCENE content, rendered glossy-dreamy). Grand/atmospheric scale so a small bubble-bot reads tiny. Describe ONLY the world.
  ✅ "a neon Shibuya scramble crossing under towering holographic ad-columns, signage blazing, crowds blurring past in soft rain-glow"
  ✅ "a misty Ghibli countryside valley of rice-terraces and ancient forest, a stone bridge over a brook, mountains fading in haze"

🚫 BANS: NO bubble-bot detail (separate axis). NO humans (the bot is the only character). Keep wholesome. ≤22 words.`,
    instructions: `Generate NEW anime-style worlds across families — terse 12-22 word fragments, the anime place + signature feature + depth/haze cue, glossy-dreamy. World ONLY.`,
    subThemes: [
      'NEON NEO-TOKYO — holographic ad-columns, neon-kanji canyons, rain-slick streets glowing, maglev lines, rooftop shanty-towns',
      'GHIBLI COUNTRYSIDE — rice-terrace valleys, ancient forests, stone bridges, rural shrines, mountains in soft haze',
      'SAKURA TEMPLE GARDENS — cherry-blossom courtyards, torii gates, stone lanterns, koi ponds, petals drifting through mist',
      'MAGICAL-GIRL ROOFTOPS — pastel city rooftops at dusk, moonlit gardens, cherry-blossom skylines, dreamy pastel color-wash',
      'ISEKAI FANTASY REALMS — castles carved into living rock, floating islands, glowing crystal formations, enchanted forest villages',
      'SAMURAI-ERA VILLAGES — mountain temples, misty bamboo groves, pagodas, tea-house gardens, snow-dusted castle towns',
      'SPIRIT-WORLD SHRINES — Mononoke spirit groves, glowing torii paths, mossy forest shrines, impossible-color twilight',
    ],
  },

  bubble_world_mechbot: {
    label: 'mechbot world',
    maxWords: 22,
    theme: `Each entry is ONE sci-fi MECHA or deep-sea world in the spirit of MechBot — colossal FRIENDLY giant robots/sentinels, glowing deep-sea bot-cities, mech arenas, mossy dormant guardians — written as a DreamBot wallpaper WORLD in the glossy-dreamy register. Towering mecha scale so a small bubble-bot reads tiny. Describe ONLY the world. Mechs are GENTLE giants, never menacing/war-like.
  ✅ "a colossal mossy dormant sentinel mech slumped in a jungle ruin, ferns sprouting from its shoulders, god-rays through the canopy"
  ✅ "a glowing deep-sea bot-city of chrome domes and floodlit towers, bioluminescent fish threading the dark, soft blue glow everywhere"

🚫 BANS: NO bubble-bot detail (separate axis). NO humans, NO weapons/war/menace — friendly + wondrous. ≤22 words.`,
    instructions: `Generate NEW friendly-mecha + deep-sea worlds across families — terse 12-22 word fragments, gentle-giant mech or glowing tech-place + depth cue, glossy-dreamy. World ONLY.`,
    subThemes: [
      'FRIENDLY GIANT MECHS / SENTINELS — colossal gentle mechs at rest, a sleeping guardian-robot, soft glowing joints, towering chrome forms',
      'DEEP-SEA BOT-CITIES — chrome-dome undersea cities, floodlit towers, glowing portholes, bioluminescent fish in the dark',
      'HADAL TRENCH GLOW — abyssal plains pulsing soft blue light, marine snow drifting, a mech floodlight piercing the dark',
      'MOSSY DORMANT GUARDIANS — ancient overgrown sentinel mechs in jungle-temple ruins, ferns + vines, green god-ray shafts',
      'CHROME TECH-ARENAS — soft-lit futuristic arenas, glowing tiered seating, polished chrome floors reflecting pastel lights',
      'UNDERSEA MEGASTRUCTURES — colossal sunken structures emerging from the murk, glowing dome-glass, slow drifting currents',
      'ZERO-G ORBITAL — gentle mechs drifting in soft orbit, a pastel planet below, glowing station-rings, star-field haze',
    ],
  },

  bubble_world_oceanbot: {
    label: 'oceanbot world',
    maxWords: 22,
    theme: `Each entry is ONE maritime or deep-sea wonder world in the spirit of OceanBot — coral-crusted shipwrecks, sunken cities, reef carnivals, whale/manta encounters, bioluminescent abyss — written as a DreamBot wallpaper WORLD in the glossy-dreamy register. Grand undersea scale so a small bubble-bot reads tiny. Describe ONLY the world.
  ✅ "a coral-crusted sunken galleon on a white-sand seabed, barnacled rigging draped in anemones, god-rays slanting down through teal water"
  ✅ "a glowing bioluminescent abyss garden of soft pulsing creatures, drifting jellyfish like paper lanterns, cold blue light blooming"

🚫 BANS: NO bubble-bot detail (separate axis). NO humans. Keep wondrous + wholesome. ≤22 words.`,
    instructions: `Generate NEW ocean/deep-sea worlds across families — terse 12-22 word fragments, undersea place + marine life/feature + depth cue, glossy-dreamy. World ONLY.`,
    subThemes: [
      'CORAL-CRUSTED SHIPWRECKS — sunken galleons draped in coral + anemones, barnacled masts, god-rays through teal water',
      'SUNKEN CITIES — coral-reclaimed stone ruins, broken columns + archways, mosaic plazas, fish schooling through corridors',
      'CORAL-REEF CARNIVALS — vibrant coral gardens, neon anemones, schooling fish in confetti color, sea-fans swaying',
      'WHALE / MANTA ENCOUNTERS — a gentle giant whale or manta gliding through god-rays, plankton sparkling, vast soft blue',
      'BIOLUMINESCENT ABYSS — glowing deep-sea creatures, drifting jellyfish-lanterns, soft pulsing light in absolute blue dark',
      'KELP FORESTS — towering kelp groves swaying in caustic light, dappled green-gold beams, drifting motes, fish darting',
      'PIRATE-ISLAND BAYS — turquoise lagoon bays, half-sunken wooden ships, palm-fringed cove, golden-hour maritime calm',
    ],
  },

  bubble_world_pixelbot: {
    label: 'pixelbot world',
    maxWords: 22,
    theme: `Each entry is ONE unmistakable VIDEO-GAME LEVEL in the spirit of PixelBot — a scene that instantly reads "this is a screenshot from a fantasy/adventure GAME": RPG towns, dungeons, boss arenas, sci-fi bases, haunted levels. Written as a DreamBot wallpaper WORLD in the glossy-dreamy register, BUT every entry MUST be packed with RECOGNIZABLE GAME ELEMENTS so the game-ness is obvious even without pixel-art: shop signs + market stalls, glowing treasure chests, floating coins/gems, save-point crystals, health-potion bottles, glowing runes/portals, a clear boss-creature, a quest-marker glow, cobblestone game-paths. The GAME PROPS are the identity — load every seed with them. Describe ONLY the world.
  ✅ "a cobblestone RPG town square, half-timbered shops with hanging signs, a glowing treasure chest, floating gold coins, a quest-marker beam"
  ✅ "a stone dungeon chamber, glowing rune-circles, an open treasure chest spilling gems, save-point crystal pulsing, torchlit arches receding"

🚫 BANS: NO bubble-bot detail (separate axis). NO humans (the bot is the hero). NO open empty meadows/battlefields (too generic) — always a BUILT game-level packed with game props. ≤22 words.`,
    instructions: `Generate NEW recognizable game-LEVEL worlds across families — terse 12-22 word fragments, a built game scene LOADED with game props (chests/coins/runes/save-crystals/signs/boss) + depth cue, glossy-dreamy. World ONLY. Game-ness must be obvious.`,
    subThemes: [
      'RPG TOWN — cobblestone squares, shop signs + market stalls, fountain, inn lanterns, a glowing treasure chest, floating coins, quest-marker beam',
      'DUNGEON — torchlit stone chambers, glowing rune-circles + portals, open chests spilling gems, save-point crystals, skeleton-pile props, lava/ice variants',
      'BOSS ARENA — a colossal friendly boss-creature center-stage, spotlight floor, tiered crowd silhouettes, health-bar-glow banners, scattered loot',
      'SCI-FI BASE — neon spaceship corridors, glowing consoles + holo-maps, force-field doors, ammo/energy-cell crates, star-window, alien-outpost props',
      'HAUNTED LEVEL — pretty candle-lit catacombs, cobweb-lace, glowing ghost-wisps, treasure coffins, jack-o-lantern props, save-point crystal',
      'ITEM SHOP / SAVE ROOM — cozy game-shop interior, shelves of glowing potions + weapons + maps, a save-point crystal, warm lantern glow, coin-pile counter',
      'OVERWORLD MAP NODE — a tiny game-map island with a castle + dungeon icon + treasure marker, winding dotted path, sparkle quest-glows, sea around',
    ],
  },

  bubble_world_retrobot: {
    label: 'retrobot world',
    maxWords: 22,
    theme: `Each entry is ONE cozy 1980s/90s nostalgia scene in the spirit of RetroBot — and the IDENTITY is the SPECIFIC PERIOD OBJECTS, so every seed MUST be packed with nameable retro stuff: a wood-console CRT TV glowing cartoons, brown shag carpet, cereal bowls, a VCR with a blinking red 12:00, stacked VHS tapes, a boombox, cassette tapes, a rotary phone, arcade cabinets, a tube TV, an Atari joystick, roller skates, a lava lamp, wood-paneled walls, a tinsel Christmas tree. Written as a DreamBot wallpaper WORLD in the glossy-dreamy register, glowing with warm Kodachrome light, dusty sunbeams through blinds. Cozy nostalgia. Describe ONLY the scene (small everyday-object scale around the tiny bot).
  ✅ "a sun-striped 80s living room, wood-console CRT glowing cartoons, cereal bowls on brown shag carpet, a VCR blinking red 12:00"
  ✅ "a dim 80s arcade row, glowing cabinet screens, an Atari joystick, sticky patterned carpet lit electric-blue, a prize counter beyond"

🚫 BANS: NO bubble-bot detail (separate axis). NO people. Pack in SPECIFIC retro objects every time. Keep warm + cozy + nostalgic. ≤22 words.`,
    instructions: `Generate NEW retro-nostalgia INTERIORS — terse 12-22 word fragments. A GIANT GLOWING old TV (wood-console CRT) or ARCADE CABINET is the HERO of MOST seeds — it instantly reads "the 80s". Pack in more period objects (shag carpet / VCR / VHS / boombox / rotary phone / Atari). Warm Kodachrome light. INDOORS only. World ONLY.`,
    subThemes: [
      'LIVING ROOM + GIANT GLOWING CRT TV (hero) — a big wood-console CRT glowing Saturday cartoons, brown shag carpet, cereal bowls, afghan, golden blinds',
      'BEDROOM — poster-covered wood-paneled walls, a boombox, a tube TV glowing, cassette tapes, scattered action figures, string-light glow',
      'NEON ARCADE — a row of glowing arcade cabinets towering, an Atari joystick, dark room lit electric-blue by CRT screens, patterned carpet',
      'DEN / TV ROOM — a big tube TV with rabbit-ears glowing static-blue, a VCR blinking red 12:00, stacked VHS tapes, a rotary phone, wood paneling',
      'HOLIDAY LIVING ROOM — a tinsel Christmas tree blazing multicolor lights, a wood-console TV glowing, wrapped gifts, shag carpet, warm hearth',
      'RUMPUS / GAME ROOM — a pinball machine + an arcade cabinet glowing, wood paneling, a tube TV, bean-bag chairs, a neon wall-clock',
    ],
  },

  bubble_world_starbot: {
    label: 'starbot world',
    maxWords: 22,
    theme: `Each entry is ONE epic ALIEN / deep-space world in the spirit of StarBot — and a GRAND COSMIC STRUCTURE must DOMINATE every seed (a soft nebula sky alone reads generic — there must be a towering/colossal structural HERO): a colossal RINGED GAS-GIANT filling half the sky, a canyon of 200-meter glowing CRYSTAL SPIRES, giant glowing SPORE-TOWERS, a hexagonal BASALT-COLUMN flat, a vast SPACE-STATION RING, an alien MEGASTRUCTURE. Nebulae/starfields are BACKDROP only. Written as a DreamBot wallpaper WORLD in the glossy-dreamy register, awe-scale so a small bubble-bot reads tiny. Describe ONLY the world.
  ✅ "a colossal ringed gas-giant filling half the sky over an obsidian plain, drifting moons, towering crystal needle-spires below"
  ✅ "a canyon of 200-meter glowing quartz spires under twin suns, three moons above, prism-light refracting across the chasm"

🚫 BANS: NO bubble-bot detail (separate axis). NO humans. NEVER just a soft nebula sky over clouds (too generic) — a colossal STRUCTURE must dominate. ≤22 words.`,
    instructions: `Generate NEW alien/space worlds — terse 12-22 word fragments, each with a COLOSSAL structural HERO (ringed-giant / crystal spires / spore-towers / megastructure) dominating + cosmic backdrop + depth cue, glossy-dreamy. World ONLY.`,
    subThemes: [
      'RINGED-GIANT SKIES — a colossal ringed gas-giant filling half the sky, drifting moons, banded ochre skies, alien spires below',
      'CRYSTAL SPIRE CANYONS — towering 200-meter resonant quartz spires, twin-sun prism-light, three moons, deep refracting chasm',
      'SPORE-TOWER FORESTS — 500-meter glowing fungal towers refracting amber light, violet mycelial mats, drifting spores, alien canopy',
      'ALIEN MEGASTRUCTURES — a vast space-station ring curving overhead, a dyson-arc, glowing orbital habitats, a colossal hull rising',
      'BASALT-COLUMN GLASS FLATS — hexagonal basalt-column plateaus, mirror-still methane seas, geometric crystalline mesas under twin suns',
      'CRYSTALLINE COMET / AURORA OVER STRUCTURE — a tri-tail comet or aurora-cyclone above a towering crystal/spire landscape, deep starfield',
      'ALIEN DESERT + RINGED MOONS — vast alien dunes under multiple ringed moons, distant crystal mesa-spires, a colossal planet on the horizon',
    ],
  },

  bubble_world_steambot: {
    label: 'steambot world',
    maxWords: 22,
    theme: `Each entry is ONE steampunk world in the spirit of SteamBot — brass spire cities, airship harbors, gear-bridges, mechanical gardens, gaslit foundries, cozy brass interiors — written as a DreamBot wallpaper WORLD in the glossy-dreamy register, warm with amber gaslight + copper patina. Towering brass scale so a small bubble-bot reads tiny. Describe ONLY the world.
  ✅ "brass spires piercing soft storm clouds, copper domes catching amber light, steam spiraling between gothic gear-towers"
  ✅ "an airship harbor of tethered dirigibles on concentric brass dock-rings, propellers gleaming, gangways over a soft misty drop"

🚫 BANS: NO bubble-bot detail (separate axis). NO humans. Keep warm + wondrous + tactile. ≤22 words.`,
    instructions: `Generate NEW steampunk worlds across families — terse 12-22 word fragments, brass/clockwork place + signature mechanism + warm-light cue, glossy-dreamy. World ONLY.`,
    subThemes: [
      'BRASS SPIRE CITIES — brass spires + copper domes piercing soft clouds, steam vents, gear-towers, gaslit amber windows',
      'AIRSHIP HARBORS — tethered dirigibles on concentric dock-rings, gleaming propellers, gangways, floating platforms in mist',
      'GEAR-BRIDGES / CHASMS — colossal interlocking brass gears turning, rail-cars on mechanical spines, cliff-cities opposing',
      'MECHANICAL GARDENS — brass pipe-trees with copper-leaf canopies, gear-flowers opening, steam-sap hissing, gaslight glow',
      'GASLIT FOUNDRIES — molten-brass rivers in copper channels, overhead ladle-rails, furnace-glow, heat-shimmer haze',
      'COZY BRASS INTERIORS — mahogany + brass reading-nooks, golden lamplight, Parrish-warm windows, intricate clockwork detail',
      'CLOCKWORK TOWERS — giant exposed-gear clock towers, swinging brass pendulums, glowing dials, steam drifting past windows',
    ],
  },

  bubble_world_tinybot: {
    label: 'tinybot world',
    maxWords: 22,
    theme: `Each entry is ONE handcrafted MINIATURE-DIORAMA world in the spirit of TinyBot — obsessively-detailed tiny model villages, alpine chalets, zen gardens, farms, coastal scenes — written as a DreamBot wallpaper WORLD in the glossy-dreamy register, with a cozy tabletop-model charm (countable little props, handcrafted feel). Describe ONLY the world (the bubble-bot fits right in at toy scale).
  ✅ "a handcrafted miniature stone village, cobblestone lanes between thatched cottages, lamp-lit doorways glowing, mossy slate roofs"
  ✅ "a tiny terraced rice-paddy hillside, geometric emerald pools stepping down, a little wooden footbridge, morning mist clinging"

🚫 BANS: NO bubble-bot detail (separate axis). NO people. Keep cozy + handcrafted + charming. ≤22 words.`,
    instructions: `Generate NEW miniature-diorama worlds across families — terse 12-22 word fragments, tiny handcrafted scene + countable details + depth cue, glossy-dreamy. World ONLY.`,
    subThemes: [
      'MINI COTTAGE VILLAGES — cobblestone lanes, thatched cottages, lamp-lit doorways, mossy roofs, little stone bridges',
      'ALPINE CHALET DIORAMAS — timber chalets, tiny pine forests, microballoon snow, distant model peaks, ski-slope charm',
      'ZEN GARDEN DIORAMAS — raked gravel, smooth stones, a tiny pagoda, bonsai, bamboo fences, koi pond, soft calm light',
      'FARM DIORAMAS — red barns, split-rail fences, tiny grazing cows, windmills, orchard rows, harvest-basket details',
      'COASTAL LIGHTHOUSE DIORAMAS — striped lighthouses, foam-carved waves, keeper cottages, tiny suspended seagulls, cliff edges',
      'TERRACED RICE-PADDIES — stepped emerald pools, wooden footbridges, morning mist, tiny shoots, hillside curves',
      'MINI EUROPEAN TOWNS — Parisian zinc-roof streets, Tuscan cypress villas, café chairs, cobbles, tiny shutters + flower-boxes',
    ],
  },

  bubble_world_toybot: {
    label: 'toybot world',
    maxWords: 22,
    theme: `Each entry is ONE scene of a TINY TOY on a FLAT real-world surface, surrounded by GIANT everyday human OBJECTS and OTHER TOYS — the "toys on the floor / on the desk" diorama in the spirit of ToyBot. THREE things MUST be in every seed: (1) a FLAT real surface named plainly — a wooden desktop, a living-room floor/carpet, a tabletop, a bedsheet, a picnic blanket; (2) GIANT recognizable human objects standing for scale — a giant open storybook, stacked wooden building-blocks, crayons, a coffee mug, an alarm clock, a cereal box, a TV remote (named as the OBJECT, NOT as a cliff/canyon/mountain); (3) OTHER TOYS as companions/scenery — wooden blocks, hot-wheels cars, plush animals, army-men, a toy train, action figures. Glossy-dreamy register. Describe ONLY the scene.

⚠️ CRITICAL: NEVER use "cliff / canyon / ledge / hillside / mountain / rock" — Flux renders those as real NATURE and the toy-room is lost. The giant things are clearly BOOKS, BLOCKS, CRAYONS, MUGS, CEREAL BOXES standing upright — recognizable human objects, not landforms.
  ✅ "on a sunny wooden desktop, a giant open storybook standing upright, stacked building-blocks, crayons and hot-wheels cars scattered around"
  ✅ "on a checkered picnic blanket, oversized plush friends, a giant felt sandwich and a huge strawberry, wooden blocks piled nearby"

🚫 BANS: NO bubble-bot detail (separate axis). NO humans. NO cliff/canyon/landform words. ≤22 words.`,
    instructions: `Generate NEW "tiny toy on a flat surface among giant human objects + other toys" scenes — terse 12-22 word fragments. Name the FLAT surface + giant OBJECTS (books/blocks/crayons/mug/cereal, NOT landforms) + other toys. World ONLY.`,
    subThemes: [
      'WOODEN DESKTOP — a giant open storybook standing upright, stacked building-blocks, crayons + pencils, a coffee mug, hot-wheels cars',
      'LIVING-ROOM FLOOR — flat carpet, a giant TV remote + board-game box standing, a toy train looping on plastic track, action figures, blocks',
      'TABLETOP BREAKFAST — a giant cereal box + bowl + spoon standing tall, scattered cereal pieces, a milk-carton, toy cars parked nearby',
      'BEDSHEET PILLOW-FORT — soft rumpled bedsheet, a pillow fort of giant cushions, army-men posed mid-charge, a giant alarm clock + book standing',
      'PICNIC BLANKET — flat checkered blanket, oversized plush friends, a giant felt sandwich + huge strawberry, button-eyed companions, blocks',
      'BOOK-STACK PLAYSET — towering stacked giant books like a wall, a globe + pencil-cup standing, toy soldiers + a toy car on the cover, soft window light',
      'HOT-WHEELS TRACK FLOOR — orange die-cast track loops on a flat wooden floor, tiny cars mid-race, a building-block tower skyline, a toy train',
    ],
  },

  bubble_world_yumbot: {
    label: 'yumbot world',
    maxWords: 22,
    theme: `Each entry is ONE kawaii FOOD / candy world in the spirit of YumBot — sugar-rush candy lands, lollipop forests, food-festival stalls, dessert tea-parties, giant food-vessels, with smiling kawaii food-friends as scenery — written as a DreamBot wallpaper WORLD in the glossy-dreamy register. Sweet, soft, pastel candy scale. Describe ONLY the world.
  ✅ "a candy-land of frosted-cake mountains and lollipop trees, gumdrop bushes, a chocolate river winding under cotton-candy clouds"
  ✅ "a giant glass cookie-jar world where smiling kawaii treats perch on tiered stands, warm golden light pooling inside the curved glass"

🚫 BANS: NO bubble-bot detail (separate axis). NO humans. Keep sweet + cute + wholesome. ≤22 words.`,
    instructions: `Generate NEW kawaii-food / candy worlds across families — terse 12-22 word fragments, candy/food place + smiling-food friends + depth cue, glossy-dreamy. World ONLY.`,
    subThemes: [
      'CANDY MOUNTAINS / SUGAR-RUSH — frosted-cake mountains, gumdrop hills, candy-cane bridges, soda seas, cotton-candy skies',
      'LOLLIPOP FORESTS — swirled lollipop trees, peppermint-trunk groves, gummy-vine canopies, sprinkle-dusted paths',
      'FOOD-FESTIVAL STALLS — kawaii food-stall markets, paper-lantern glow, smiling food-friends at counters, festival banners',
      'DESSERT TEA-PARTIES — tiered dessert stands, teacup ponds, macaron stepping-stones, smiling cake-friends gathered',
      'GIANT FOOD-VESSELS — a colossal teacup or cookie-jar world, ramen-bowl lagoons, donut archways, warm interior glow',
      'ICE-CREAM / SODA SEAS — swirled ice-cream mountains, fizzing soda oceans, whipped-cream cloud islands, cherry suns',
      'KAWAII FOOD-FRIEND GATHERINGS — meadows of smiling fruit + dessert friends in a circle, picnic of tiny treats, soft watercolor light',
    ],
  },
};

if (!POOL || !POOL_RECIPES[POOL]) {
  console.error('Usage: --pool <name> --count <N> | --target <N> [--dry-run]');
  console.error('Pools: ' + Object.keys(POOL_RECIPES).join(', '));
  process.exit(1);
}
const recipe = POOL_RECIPES[POOL];

function buildPrompt(count, recipe, touchpoints, featured) {
  const tp = touchpoints.length
    ? `\n━━━ TOUCHPOINTS — match this EXACT style, voice, length, and quality (these are the curated reference set; generate NEW entries that EXTEND the variety, never duplicate or lightly reword these) ━━━\n${touchpoints.map((t) => '  • ' + t).join('\n')}\n`
    : '';
  const ft = featured
    ? `\n━━━ FEATURED FAMILY (this batch ONLY — every entry must belong to THIS family; go DEEP and specific, find fresh distinct ideas within it) ━━━\n${featured}\n`
    : '';

  return `You are authoring entries for the DreamBot "${recipe.label}" pool. DreamBot renders a beloved glossy iridescent "bubble-bot" designer-toy in dreamy, frame-worthy magical-wallpaper worlds.
${ft}

━━━ POOL THEME ━━━
${recipe.theme}
${tp}
━━━ INSTRUCTIONS ━━━
${recipe.instructions}

Output EXACTLY ${count} entries as a NUMBERED LIST (1. ... 2. ... 3. ...). Each entry on its OWN SINGLE LINE — NO internal newlines (use commas / dashes). NO preamble, NO commentary, NO markdown fences, NO JSON.`;
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
    if (!res.ok) {
      throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
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
    } else if (current) {
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
    .filter((e) => e.length > 12 && e.length < 600);
  if (cleaned.length === 0) throw new Error('No numbered entries found in response');
  return cleaned;
}

// ─── DEDUP ────────────────────────────────────────────────────────────────
// These are short comma-prose entries (no "TITLE — body" shape), so dedup runs
// purely on a body signature: the significant content words, deduped + sorted,
// so word-order shuffling and filler swaps can't sneak a near-duplicate past.
const STOPWORDS = new Set([
  'the','a','an','and','or','but','with','of','in','on','at','to','for','from','by','as','is','are',
  'was','were','be','been','being','have','has','had','this','that','these','those','it','its','they',
  'them','their','her','his','into','onto','through','across','over','under','near','around','between',
  'one','some','any','all','no','not','than','then','also','so','very','more','most','many','much',
  'each','every','other','another','same','such','only','own','just','still','here','there','where',
  'when','what','who','soft','softly','gentle','gently','little','tiny','big','huge','small','round',
  'glossy','dreamy','pastel','glowing','glow','light','out','up','down','front','side','like','its',
]);

function signatureOf(entry) {
  const tokens = entry
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOPWORDS.has(w));
  return [...new Set(tokens)].sort().slice(0, 10).join(' ');
}

function dedupe(entries) {
  const seen = new Map();
  const kept = [];
  const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 12) continue;
    const sig = signatureOf(e);
    if (sig.length < 8) {
      kept.push(e);
      continue;
    }
    if (seen.has(sig)) {
      dropped.push(e.slice(0, 70));
      continue;
    }
    seen.set(sig, e);
    kept.push(e);
  }
  return { kept, dropped };
}

async function generateBatch(batchCount, touchpoints, featured) {
  const t0 = Date.now();
  const text = await callSonnet(buildPrompt(batchCount, recipe, touchpoints, featured));
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  let arr;
  try {
    arr = parseArray(text);
  } catch (e) {
    console.error('Parse failed:', e.message);
    console.error('First 400 chars:', text.slice(0, 400));
    return [];
  }
  // Optional hard terseness guard — drop entries over the recipe's word cap
  // (over-long scene entries are exactly what tips Sonnet into dropping the hero).
  if (recipe.maxWords) {
    const before = arr.length;
    arr = arr.filter((e) => e.split(/\s+/).length <= recipe.maxWords);
    const cut = before - arr.length;
    if (cut) console.log(`  • dropped ${cut} over-${recipe.maxWords}-word entries`);
  }
  console.log(`  • Sonnet returned ${arr.length} usable entries in ${elapsed}s`);
  return arr;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/dreambot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) {
    try {
      preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch {}
  }
  // The curated entries ARE the touchpoints. Snapshot them up front so they
  // anchor the voice on every iteration (and don't drift as the pool grows).
  const touchpoints = preExisting.slice(0, 24);

  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;

  console.log(
    `Pool "${POOL}" (${recipe.label}): ${startCount} → ${finalTarget}` +
      ` | ${touchpoints.length} touchpoints${DRY ? ' (dry-run)' : ''}`
  );

  let pool = [...preExisting];

  // One gen+dedup batch: gen `batchSize` (optionally for a FEATURED family),
  // drop within-batch dups + entries already in the pool, add up to `cap` more.
  // Returns the number actually added.
  async function addBatch(batchSize, featured, cap) {
    const fresh = await generateBatch(batchSize, touchpoints, featured);
    if (fresh.length === 0) return 0;
    const within = dedupe(fresh);
    if (within.dropped.length) console.log(`     • within-batch dropped ${within.dropped.length}`);
    const existingSigs = new Set(pool.map(signatureOf));
    const newUnique = within.kept.filter((e) => !existingSigs.has(signatureOf(e)));
    const crossDropped = within.kept.length - newUnique.length;
    if (crossDropped) console.log(`     • cross-batch dropped ${crossDropped}`);
    const toAdd = newUnique.slice(0, Math.max(0, cap));
    pool = [...pool, ...toAdd];
    return toAdd.length;
  }

  if (recipe.subThemes && TARGET !== null) {
    // PRODUCTION SCALE — equal share per family, one Sonnet phase each, so
    // cross-batch dedup can't starve a family (the equal-share-per-subtheme rule).
    const subs = recipe.subThemes;
    const need = Math.max(0, finalTarget - startCount);
    const perSub = Math.ceil(need / subs.length);
    console.log(`\nPer-family target: ~${perSub} new across ${subs.length} families`);
    for (let s = 0; s < subs.length; s++) {
      const featured = subs[s];
      const label = featured.split(/[—-]/)[0].trim().slice(0, 42);
      let added = 0;
      let stall = 0;
      console.log(`\n── Family ${s + 1}/${subs.length}: ${label} (+${perSub}) ──`);
      while (added < perSub && stall < 3 && pool.length < finalTarget) {
        const remainingSub = perSub - added;
        const batchSize = Math.min(25, Math.max(8, Math.ceil(remainingSub * 1.5)));
        const cap = Math.min(remainingSub, finalTarget - pool.length);
        const n = await addBatch(batchSize, featured, cap);
        added += n;
        stall = n === 0 ? stall + 1 : 0;
        console.log(`   +${n} → family ${added}/${perSub} | pool ${pool.length}/${finalTarget}`);
      }
      if (added < perSub) console.log(`   (family topped out at ${added} — semantic ceiling)`);
    }
  } else {
    // Single-recipe iterative loop (no sub-themes).
    let iteration = 0;
    while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
      iteration++;
      const stillNeeded = finalTarget - pool.length;
      const batchSize = Math.min(25, Math.ceil(stillNeeded * 1.5));
      console.log(`\nIteration ${iteration}: pool ${pool.length}/${finalTarget}, gen ${batchSize}`);
      const n = await addBatch(batchSize, undefined, finalTarget - pool.length);
      console.log(`  ✓ Added ${n} → pool ${pool.length}/${finalTarget}`);
      if (n === 0) {
        console.warn('  ⚠ batch added nothing new — Sonnet exhausted on theme, stopping');
        break;
      }
    }
  }

  console.log(`\n━━━ Final: ${pool.length}/${finalTarget} (${pool.length - startCount} new) ━━━`);
  console.log('\nSample (last 4):');
  pool.slice(-4).forEach((e, i) => console.log(`  [${pool.length - 4 + i}] ${e}`));

  if (DRY) {
    console.log('\nDry-run — not writing to disk.');
    return;
  }
  if (fs.existsSync(outPath)) {
    const bakPath = outPath + '.bak-' + Date.now();
    fs.copyFileSync(outPath, bakPath);
    console.log(`\nBacked up existing → ${bakPath}`);
  }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
