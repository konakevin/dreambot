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
    maxWords: 12,
    theme: `Each entry is ONE simple, cute POSE/gesture for the little bubble-bot — serene and charming. NOT the appearance, NOT the scene.

Spread across: sitting serenely with stubby legs out front / sitting cross-legged with paws on knees / standing tall and proud / giving a tiny wave / both stubby arms raised in joy / mid happy little bounce / a small joyful twirl / floating serenely just off the ground / hugging its own knees / peeking with one paw up / gazing up in wonder / reaching toward something off-frame.

✅ GOOD: "sitting serenely with stubby legs out front"
✅ GOOD: "both stubby arms raised in pure joy"
✅ GOOD: "floating serenely just off the ground"`,
    instructions: `Generate distinct cute POSES/gestures. 4-12 words, ONE line. Pose ONLY — no appearance, no scene.`,
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
