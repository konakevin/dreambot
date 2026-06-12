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
    theme: `Each entry is ONE epic deep-space / alien world in the spirit of StarBot — crystal canyons, bioluminescent tide pools, ringed-giant skies, spore forests, nebula vistas, space-opera orbitals — written as a DreamBot wallpaper WORLD in the glossy-dreamy register. Impossible cosmic scale so a small bubble-bot reads tiny. Describe ONLY the world.
  ✅ "twin suns igniting a canyon of 200-meter resonant quartz spires, three moons catching pink-blue light, wind-carved hollows"
  ✅ "a colossal ringed gas-giant filling half the sky over an obsidian plain, drifting moons, soft star-dusted violet space beyond"

🚫 BANS: NO bubble-bot detail (separate axis). NO humans. Keep wondrous + awe-scale. ≤22 words.`,
    instructions: `Generate NEW cosmic / alien worlds across families — terse 12-22 word fragments, awe-scale cosmic place + signature feature + depth cue, glossy-dreamy. World ONLY.`,
    subThemes: [
      'CRYSTAL CANYONS — towering resonant quartz spires, prism-refracting twin-sun light, three moons, wind-carved hollows',
      'BIOLUMINESCENT TIDE POOLS — obsidian-rimmed glowing pools green-to-violet, phosphorescent alien fauna, soft cosmic dusk',
      'RINGED-GIANT SKIES — a colossal ringed gas-giant over an alien plain, drifting moons, banded ochre-cream skies',
      'SPORE FORESTS — 500-meter glowing fungal towers refracting amber light, violet mycelial mats, spores drifting like snow',
      'NEBULA VISTAS — rose-and-lavender nebula clouds, infant-star clusters, comet arcs with tri-color tails, deep starfields',
      'ALIEN GLASS FLATS — hexagonal basalt columns, mirror-still methane seas, geometric crystalline plateaus under twin suns',
      'SPACE-OPERA ORBITALS — gentle drifting starships, glowing ring-habitats, station domes, a pastel planet + nebula backdrop',
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
