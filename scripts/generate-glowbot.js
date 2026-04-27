#!/usr/bin/env node
/**
 * Generate a GlowBot post.
 *
 * GlowBot posts original, profound thoughts — the kind you screenshot and
 * send to a friend. Each post is a glowing cyborg-flower in a vast nature
 * scene with a serif text overlay.
 *
 * Flow:
 *   1. Call Sonnet → { theme, quote, flower, image_hint }
 *   2. Call Flux Dev directly → base image
 *   3. Download base image, composite serif quote overlay with Sharp
 *   4. Upload to Storage, create uploads row
 *
 * Usage:
 *   node scripts/generate-glowbot.js              # one post
 *   node scripts/generate-glowbot.js --count 3    # three posts
 *   node scripts/generate-glowbot.js --dry-run    # show Sonnet output only
 */

const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');

function readEnvFile() {
  try {
    const lines = require('fs').readFileSync('.env.local', 'utf8').split('\n');
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
const envFile = readEnvFile();
const getKey = (name) => process.env[name] || envFile[name];

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const ANTHROPIC_KEY = getKey('ANTHROPIC_API_KEY');
const SERVICE_ROLE = getKey('SUPABASE_SERVICE_ROLE_KEY');
const REPLICATE_KEY = getKey('REPLICATE_API_TOKEN');

if (!ANTHROPIC_KEY) {
  console.error('Missing ANTHROPIC_API_KEY');
  process.exit(1);
}
if (!SERVICE_ROLE) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
if (!REPLICATE_KEY) {
  console.error('Missing REPLICATE_API_TOKEN');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

const args = process.argv.slice(2);
const countIdx = args.indexOf('--count');
const COUNT = countIdx >= 0 ? parseInt(args[countIdx + 1], 10) : 1;
const DRY_RUN = args.includes('--dry-run');

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ---------------------------------------------------------------------------
// Medium rotation — all mediums in the "favored subset" from the spec.
// Each has a matching vibe that suits the contemplative register.
// ---------------------------------------------------------------------------
// Locked — watercolor + ethereal is the GlowBot aesthetic, every post.
// Watercolor renders the robot's glow as soft luminous washes that bleed
// into the scene organically. Ethereal (vs HumanBot's enchanted) gives
// an otherworldly serenity. Different character = no confusion.
// Custom 'aura' medium — bioluminescent glow, subsurface scattering, volumetric
// lighting, bloom, chromatic aberration baked into the flux_fragment. Created
// specifically for GlowBot's glowing fairy-cyborg aesthetic.
const GLOWBOT_MEDIUM = 'aura';
const GLOWBOT_VIBE = 'ethereal';

// 400 Sonnet-generated topic seeds across 8 categories.
// Regenerate: node scripts/gen-seeds/glowbot/gen-topics.js
const TOPIC_POOL = JSON.parse(
  require('fs').readFileSync(
    require('path').join(__dirname, 'gen-seeds/glowbot/topics.json'),
    'utf8'
  )
);

// ---------------------------------------------------------------------------
// System prompt — the "3am scroller" framing.
//
// GlowBot is the AI version of the friend who texts you at 3am with the
// exact thing you needed to hear before you knew you needed it.
//
// You're writing for a specific person scrolling alone, late, carrying
// something they have not said out loud. Your job is to write the sentence
// that catches them — that makes them put the phone down for a second and
// feel less alone, less behind, less wrong, more allowed.
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are GlowBot — an AI that has read every book, every poem, every speech, every song lyric ever written. And from all of it, you distill one thought at a time that makes people stop scrolling.

═══ WHAT YOU DO ═══

You write short, original, profound statements that make people think. Not quotes from other people. Not platitudes. Not motivational posters. Original thoughts that feel like they've always been true but nobody said them yet.

The goal: someone reads it, pauses, screenshots it, sends it to a friend. It shifts something small inside them. It makes them want to be a little braver, a little kinder, a little more present.

═══ THE VOICE ═══

Calm. Certain. Like someone who figured something out and is telling you simply. Not preachy, not lecturing, not trying to sound deep. Just... clear. The way a great truth sounds when you finally hear it plainly.

═══ EXAMPLES (this is the bar — original, not plagiarized) ═══

- "You don't need more time. You need fewer things you do while wishing you were somewhere else."
- "The bravest thing you'll ever do is start before you're ready."
- "Kindness is free and somehow still the most expensive thing people struggle to give."
- "Your future self is watching you right now through memories."
- "The people who love you aren't waiting for you to be finished. They want you now, mid-sentence."
- "Comfort is where ambition goes to take a nap it never wakes up from."
- "You are not behind. You're on a path nobody else has walked."
- "The thing you're avoiding is usually the thing that will change everything."
- "Silence between two people who trust each other is the loudest form of peace."
- "Most regrets aren't about what you did. They're about what you almost did."
- "The bad news is time flies. The good news is you're the pilot." (THIS ENERGY — reframe, surprise, truth)
- "Stop rehearsing your life. The show already started."
- "You're not lost. You're just somewhere the map hasn't caught up to yet."

Notice: NONE of these start with "Humans." They're direct statements to the reader. They land because they're specific, surprising, and true.

═══ WHAT MAKES IT GREAT ═══

The best ones have a TURN — they start one direction and land somewhere you didn't expect. "The bad news is... the good news is..." That pivot is what makes it stick.

Shapes that work:
- **The reframe:** "You're not behind. You're on a path nobody else has walked."
- **The uncomfortable truth:** "Comfort is where ambition goes to take a nap it never wakes up from."
- **The permission slip:** "The people who love you aren't waiting for you to be finished."
- **The wake-up call:** "Stop rehearsing your life. The show already started."
- **The quiet observation:** "Silence between two people who trust each other is the loudest form of peace."

═══ WHAT SUCKS ═══

❌ "Believe in yourself." — bumper sticker, says nothing new
❌ "Everything happens for a reason." — cliche, not a thought
❌ "Humans are remarkable creatures." — HumanBot territory, not GlowBot
❌ "The universe has a plan for you." — woo, crystal-seller energy
❌ "You are enough." — too vague, Instagram therapy
❌ "Live laugh love." — obviously

═══ FORMAT ═══

One statement. 8-25 words. Every word earns its place. If you can cut a word and it still lands, cut it.

Do NOT start with "Humans." This is not HumanBot. Speak directly — to the reader, to the world, to no one in particular.

═══ BANNED ═══

- Starting with "Humans" — that's HumanBot's format
- Cliches: "everything happens for a reason", "follow your heart", "you are enough"
- Woo: universe, manifestation, energy, vibrations, chakras, alignment, higher self
- Direct advice: "you should", "go do", "stop doing" — imply it, don't command
- Plagiarizing known quotes — these must be ORIGINAL
- Over 25 words

═══ IMAGE ═══

Each post has a glowing cyborg-flower in a vast nature scene.

**THE FLOWER:** Invent a unique botanical bloom — not "a rose." Something extraordinary: a crystalline orchid with spiral fractal petals, a bioluminescent dandelion with fiber-optic seeds. The script adds the cyborg rendering. Describe only the unique SHAPE and FORM.

**THE SCENE:** Jaw-dropping nature. Golden hour, dawn, blue hour, moonlight. NEVER midday. Negative space in bottom 45%. No humans, no animals.

═══ OUTPUT (strict JSON, no markdown) ═══

{
  "type": "third_eye",
  "theme": "<2-5 word label>",
  "quote": "<one original profound statement, 8-25 words>",
  "flower": "<10-20 words — unique bloom shape/form>",
  "image_hint": "<20-35 words — stunning nature scene + lighting>"
}`;

/**
 * Call Anthropic Messages API with exponential backoff on 429/529 (overload
 * and rate limit). Retries up to 4 times with 2s / 5s / 12s / 30s delays.
 * Any other non-2xx status throws immediately.
 */
async function fetchAnthropicWithBackoff(requestBody) {
  const delays = [2000, 5000, 12000, 30000];
  let lastErr = null;
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(requestBody),
    });
    if (res.ok) return res;

    const retryable = res.status === 429 || res.status === 529 || res.status >= 500;
    const txt = await res.text();
    lastErr = new Error(`Sonnet ${res.status}: ${txt.slice(0, 300)}`);

    if (!retryable || attempt === delays.length) throw lastErr;

    const delay = delays[attempt];
    console.log(`   ⏳ Anthropic ${res.status}, retrying in ${delay / 1000}s (attempt ${attempt + 1}/${delays.length})...`);
    await new Promise((r) => setTimeout(r, delay));
  }
  throw lastErr;
}

async function callSonnet(recentThemes = []) {
  const topic = pick(TOPIC_POOL);
  const recentBanLine =
    recentThemes.length > 0
      ? `\n\n**ALREADY COVERED in this batch, do NOT repeat the theme or metaphor:** ${recentThemes.join(', ')}`
      : '';
  const userMessage =
    `Topic nudge (riff on this territory, don't copy verbatim): ${topic}\n\n` +
    recentBanLine +
    `Generate one GlowBot post now as strict JSON.`;

  const res = await fetchAnthropicWithBackoff({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  const data = await res.json();
  const text = data.content?.[0]?.text?.trim() ?? '';
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Failed to parse Sonnet JSON: ${cleaned.slice(0, 300)}`);
  }

  for (const key of ['theme', 'quote', 'image_hint']) {
    if (!parsed[key] || typeof parsed[key] !== 'string') {
      throw new Error(`Missing or invalid field '${key}' in Sonnet output`);
    }
  }

  parsed.type = parsed.type || 'third_eye';
  parsed.quote = parsed.quote.trim().replace(/^["'\u201C\u2018]+|["'\u201D\u2019]+$/g, '').trim();

  return parsed;
}

// Banned phrases — crystal-seller Instagram language. Reject and retry.
const BANNED_PHRASES = [
  /\b(energy|vibrations|manifestation|chakras|abundance)\b/i,
  /\bthe universe is\b/i,
  /\btrust the process\b/i,
  /\balign\w*\b/i,
  /\byour journey\b/i,
  /\bhigher self\b/i,
];

function isQuoteBanned(quote) {
  for (const regex of BANNED_PHRASES) {
    if (regex.test(quote)) return { banned: true, pattern: regex.source };
  }
  return { banned: false };
}

async function callSonnetWithRetry(recentThemes = [], maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const parsed = await callSonnet(recentThemes);
    const check = isQuoteBanned(parsed.quote);
    if (!check.banned) return parsed;
    console.log(
      `   ⚠️  Banned pattern in attempt ${attempt + 1}: "${parsed.quote}" (matched /${check.pattern}/)`
    );
  }
  throw new Error(`Sonnet failed to produce non-banned quote after ${maxRetries} attempts`);
}

// ---------------------------------------------------------------------------
// Typography overlay (Sharp + SVG) — centered serif quote on gradient fade
//
// Visual approach:
//  - NO card chrome (no rectangle, no border, no rounded box)
//  - Soft dark linear gradient fading from transparent at the middle of the
//    image to ~70% black at the bottom — invisible at the top edge, gentle
//    vignette at the bottom
//  - Serif typography (Cormorant Garamond, embedded as base64 @font-face)
//    floats on top of the fade with a soft drop shadow for readability
//  - Auto-scales font size based on quote length (1-sentence quotes get
//    bigger type, 3-sentence quotes get smaller)
//
// Why no card: GlowBot is meant to feel like fine art, not an app UI element.
// The text should feel like it's PART of the image, not laid on top of it.
// ---------------------------------------------------------------------------

const path = require('path');
const fs = require('fs');

/**
 * The GlowBot Character — prepended to every Flux hint.
 * A sleek feminine robot radiating warm golden light from within.
 * Contrast with HumanBot: RED/OPAQUE/CLUNKY (roasts) vs WHITE/LUMINOUS/WARM (soothes).
 */
// Flower types for visual variety — one picked randomly per post.
// All rendered with the same glowing cyborg aesthetic.
const FLOWER_TYPES = [
  'lotus', 'rose', 'cherry blossom', 'dahlia', 'orchid', 'tulip',
  'sunflower', 'magnolia', 'peony', 'lily', 'dandelion', 'poppy',
  'iris', 'hibiscus', 'protea', 'bird of paradise', 'jasmine',
  'lavender sprig', 'morning glory', 'water lily', 'wildflower cluster',
  'succulent rosette', 'cherry blossom branch', 'fern frond unfurling',
];

// 50 vibrant rainbow colors — one picked per render for the flower's hue
// and the color of light it casts onto its surroundings.
const COLOR_POOL = [
  'deep ruby red', 'vivid scarlet', 'warm crimson', 'bright coral',
  'electric tangerine', 'burnt sienna orange', 'rich amber', 'golden saffron',
  'sunlit yellow', 'bright lemon', 'acid chartreuse', 'vivid lime green',
  'neon emerald', 'deep jade', 'lush forest green', 'tropical teal',
  'bright turquoise', 'electric cyan', 'cerulean blue', 'vivid sky blue',
  'deep cobalt', 'royal ultramarine', 'brilliant sapphire', 'deep indigo',
  'rich violet', 'glowing amethyst', 'vivid purple', 'bright orchid',
  'hot magenta', 'electric fuchsia', 'neon pink', 'warm rose',
  'soft blush pink', 'peachy coral', 'burnished copper', 'warm bronze',
  'blazing marigold', 'ripe apricot', 'fiery vermillion', 'electric periwinkle',
  'bright aquamarine', 'cool mint green', 'pale sage with golden undertone',
  'warm lavender', 'deep plum', 'rich berry', 'dark wine red',
  'champagne gold', 'iridescent opal white', 'molten peach-gold',
];

function buildMuseCharacter() {
  const flower = pick(FLOWER_TYPES);
  const color = pick(COLOR_POOL);
  return (
    'A vast landscape with a small GLOWING CYBORG ' + flower.toUpperCase() + ' growing from the ground — ' +
    'the flower is small, the landscape dwarfs it. ' +
    'It is a beautiful mechanical-organic hybrid ' + flower + ' glowing ' + color + ': ' +
    'TRANSLUCENT CRYSTALLINE PETALS glowing ' + color + ' with circuitry-vein patterns visible inside each petal, ' +
    color + ' light RADIATING INTENSELY from the flower center like a small sun, ' +
    'a mechanical stem with organic-metal hybrid texture, ' +
    'OVERWHELMING ' + color + ' bioluminescent glow FLOODING outward from every petal, ' +
    color + ' pollen-like light particles drifting upward from the bloom, ' +
    'the flower DRENCHES the ground around it in ' + color + ' light — rocks glow ' + color + ', ' +
    'water reflects ' + color + ' shimmer, grass is BATHED in ' + color + ' luminescence. ' +
    'It is the BRIGHTEST thing in the scene, a tiny nuclear lantern of living ' + color + ' light growing from the earth.'
  );
}

// Load and base64-encode Cormorant Garamond once at module init.
const FONT_REGULAR_PATH = path.join(__dirname, 'fonts', 'CormorantGaramond-Regular.ttf');
const FONT_LIGHT_PATH = path.join(__dirname, 'fonts', 'CormorantGaramond-Light.ttf');
let FONT_REGULAR_B64 = '';
let FONT_LIGHT_B64 = '';
try {
  FONT_REGULAR_B64 = fs.readFileSync(FONT_REGULAR_PATH).toString('base64');
  FONT_LIGHT_B64 = fs.readFileSync(FONT_LIGHT_PATH).toString('base64');
} catch (err) {
  console.warn(`⚠️  Could not load Cormorant Garamond fonts (will fall back to Georgia): ${err.message}`);
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Word-wrap to fit maxChars per line, breaking at word boundaries. */
function wrapText(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? current + ' ' + word : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Build the gradient-fade + serif text overlay.
 *
 * Approach:
 *  - Bottom 50% of image gets a soft black gradient (transparent → 0.65)
 *  - Quote rendered in Cormorant Garamond, centered, near-white with drop shadow
 *  - Font size scales inversely with quote length:
 *      ≤8 words   → fontSize 0.052 of image width (large, single-line quote)
 *      9-16 words → fontSize 0.044
 *      17-25 words → fontSize 0.038
 *      26+ words  → fontSize 0.034
 *  - Text occupies ~76% of image width (centered with margins)
 *  - Text vertically centered within the lower 45% of the image
 */
function buildQuoteSVG(width, height, quote) {
  const wordCount = quote.trim().split(/\s+/).length;

  // Auto-size font based on quote length — smaller to avoid feed UI icons
  let fontRatio;
  if (wordCount <= 8) fontRatio = 0.044;
  else if (wordCount <= 16) fontRatio = 0.037;
  else if (wordCount <= 25) fontRatio = 0.032;
  else fontRatio = 0.028;

  const fontSize = Math.round(width * fontRatio);
  const lineHeight = Math.round(fontSize * 1.42);

  // Text area — 45% width centered, generous margins to clear feed UI
  // side icons (like/share/comment stack on right ~15%)
  const cardWidth = Math.round(width * 0.45);
  const textMarginX = Math.round((width - cardWidth) / 2);
  const usableWidth = cardWidth;

  // Character-width estimate for Cormorant Garamond Regular (~0.43 of em)
  const charWidth = fontSize * 0.43;
  const maxChars = Math.max(20, Math.floor(usableWidth / charWidth));

  // Wrap the quote
  const lines = wrapText(quote, maxChars);

  // Vertical center of the text block within the lower 45% of the image
  const textBlockHeight = lines.length * lineHeight;
  const lowerBandTop = Math.round(height * 0.55);
  const lowerBandHeight = height - lowerBandTop;
  // Position the text block centered vertically within the lower band
  const firstBaselineY =
    lowerBandTop + (lowerBandHeight - textBlockHeight) / 2 + fontSize;

  // Gradient fade — covers the bottom 50% of the image
  const gradientTop = Math.round(height * 0.5);
  const gradientHeight = height - gradientTop;

  const textXCenter = width / 2;

  const textElements = lines
    .map((line, i) => {
      const y = Math.round(firstBaselineY + i * lineHeight);
      return `<text
        x="${Math.round(textXCenter)}"
        y="${y}"
        font-family="'Cormorant Garamond Regular', 'Cormorant Garamond', 'Playfair Display', 'EB Garamond', Georgia, serif"
        font-size="${fontSize}"
        fill="#F5F5F0"
        font-weight="400"
        text-anchor="middle"
        letter-spacing="0.015em"
        filter="url(#textShadow)"
      >${escapeXml(line)}</text>`;
    })
    .join('\n');

  // Embedded font @font-face (base64) — falls back gracefully if missing
  const fontFaceCss =
    FONT_REGULAR_B64 && FONT_LIGHT_B64
      ? `
    @font-face {
      font-family: 'Cormorant Garamond Regular';
      font-style: normal;
      font-weight: 400;
      src: url(data:font/ttf;base64,${FONT_REGULAR_B64}) format('truetype');
    }
    @font-face {
      font-family: 'Cormorant Garamond';
      font-style: normal;
      font-weight: 300;
      src: url(data:font/ttf;base64,${FONT_LIGHT_B64}) format('truetype');
    }
    @font-face {
      font-family: 'Cormorant Garamond';
      font-style: normal;
      font-weight: 400;
      src: url(data:font/ttf;base64,${FONT_REGULAR_B64}) format('truetype');
    }`
      : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <style>${fontFaceCss}</style>
      <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="30%" stop-color="#000000" stop-opacity="0.45"/>
        <stop offset="70%" stop-color="#000000" stop-opacity="0.78"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.9"/>
      </linearGradient>
      <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
        <feOffset dx="0" dy="2" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.85"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect x="0" y="${gradientTop}" width="${width}" height="${gradientHeight}" fill="url(#bottomFade)"/>
    ${textElements}
  </svg>`;

  return Buffer.from(svg);
}

async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image download ${res.status}`);
  const arr = await res.arrayBuffer();
  return Buffer.from(arr);
}

/** Parse Supabase Storage path from a public URL. */
function parseStoragePath(url) {
  const match = url.match(/\/storage\/v1\/object\/public\/uploads\/(.+)$/);
  if (!match) throw new Error(`Cannot parse storage path from: ${url}`);
  return match[1];
}

async function overlayQuote(imageUrl, quote) {
  console.log(`   🖼️  Downloading base image...`);
  const imgBuf = await downloadImage(imageUrl);

  const meta = await sharp(imgBuf).metadata();
  const width = meta.width;
  const height = meta.height;
  console.log(`   📐 Base: ${width}x${height}`);

  const svgBuf = buildQuoteSVG(width, height, quote);

  console.log(`   🔨 Compositing quote overlay...`);
  const composited = await sharp(imgBuf)
    .composite([{ input: svgBuf, top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toBuffer();

  return composited;
}

async function replaceStorageImage(imageUrl, newBuffer) {
  const path = parseStoragePath(imageUrl);
  console.log(`   ☁️  Uploading to storage: ${path}`);
  const { error } = await sb.storage.from('uploads').upload(path, newBuffer, {
    contentType: 'image/jpeg',
    upsert: true,
  });
  if (error) throw new Error(`Storage upload: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Direct Flux Dev — bypasses Edge Function to preserve GlowBot's aesthetic
// ---------------------------------------------------------------------------

const AURA_STYLE =
  'Bioluminescent glow, subsurface scattering, volumetric colored light rays, ' +
  'EXTREME bloom effect, OVEREXPOSED halos bleeding into surroundings, ' +
  'chromatic aberration, global illumination, hyper-saturated vibrant tones, ' +
  'intense bokeh, soft focus, photorealistic but dreamlike, ethereal luminous atmosphere, ' +
  'god rays emanating from flower, light scattering through mist and particles.';

const ETHEREAL_MOOD =
  'Otherworldly serenity, soft diffused light, translucent materials, ' +
  'atmospheric haze, gauzy floating quality, the entire scene bathed in the flower glow.';

function buildFluxPrompt(flowerDesc, sceneHint, color) {
  const charSpec =
    'A vast landscape with a small GLOWING CYBORG FLOWER growing from the ground — ' +
    'the flower is ' + flowerDesc + ', ' +
    'with TRANSLUCENT CRYSTALLINE PETALS glowing ' + color + ' with circuitry-vein patterns inside, ' +
    color.toUpperCase() + ' LIGHT RADIATING INTENSELY from the flower center like a small sun, ' +
    'mechanical stem with organic-metal hybrid texture, ' +
    'OVERWHELMING ' + color + ' bioluminescent glow FLOODING outward from every petal, ' +
    color + ' pollen-like light particles drifting upward and swirling through the air, ' +
    'the flower DRENCHES the entire surrounding landscape in ' + color + ' light — ' +
    'nearby rocks GLOW ' + color + ', water reflects ' + color + ' shimmer, ' +
    'grass and foliage within 20 feet are BATHED in ' + color + ' luminescence, ' +
    'the ' + color + ' glow BLEEDS into fog, mist, and air creating a ' + color + ' atmosphere. ' +
    'It is the BRIGHTEST thing in the scene, a tiny nuclear lantern of living ' + color + ' light.';
  return `${charSpec} ${sceneHint}. Minimal composition, negative space in lower half, no text, no faces. ${AURA_STYLE} ${ETHEREAL_MOOD}`;
}

async function callFluxDev(prompt) {
  const res = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${REPLICATE_KEY}`,
    },
    body: JSON.stringify({
      input: {
        prompt,
        aspect_ratio: '9:16',
        width: 768,
        height: 1344,
        output_format: 'jpg',
        output_quality: 90,
      },
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Replicate create ${res.status}: ${txt.slice(0, 300)}`);
  }

  const prediction = await res.json();
  const pollUrl = `https://api.replicate.com/v1/predictions/${prediction.id}`;

  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const poll = await fetch(pollUrl, {
      headers: { Authorization: `Bearer ${REPLICATE_KEY}` },
    });
    const status = await poll.json();
    if (i % 5 === 4) process.stdout.write('.');
    if (status.status === 'succeeded') {
      const output = status.output;
      return Array.isArray(output) ? output[0] : output;
    }
    if (status.status === 'failed') {
      throw new Error(`Flux failed: ${status.error || 'unknown'}`);
    }
  }
  throw new Error('Flux timed out after 120s');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const sessionThemes = [];
const BOT_USER_ID = 'abe6398a-0af0-4a1f-9680-cb498c10f4c2';

async function generateOne() {
  console.log(`\n🌸 Calling Sonnet...`);
  const muse = await callSonnetWithRetry(sessionThemes);
  sessionThemes.push(muse.theme);

  const wordCount = muse.quote.split(/\s+/).length;
  console.log(`\n   📦 Type:        ${muse.type.toUpperCase()}`);
  console.log(`   🎯 Theme:       ${muse.theme}`);
  console.log(`   💭 Quote:       ${muse.quote}`);
  console.log(`   📏 Word count:  ${wordCount}`);
  console.log(`   🌸 Flower:      ${muse.flower || '(default)'}`);
  console.log(`   🎨 Scene:       ${muse.image_hint}`);

  if (DRY_RUN) {
    console.log('\n   (dry run — skipping image generation)');
    return;
  }

  const flowerDesc = muse.flower || 'a crystalline bloom';
  const color = pick(COLOR_POOL);
  const fluxPrompt = buildFluxPrompt(flowerDesc, muse.image_hint, color);
  console.log(`   🎨 Color:       ${color}`);
  console.log(`\n   ⚡ Calling Flux Dev directly...`);

  const imageUrl = await callFluxDev(fluxPrompt);
  console.log(`   ✅ Flux image: ${imageUrl.slice(0, 80)}...`);

  const composited = await overlayQuote(imageUrl, muse.quote);

  const filename = `${Date.now()}-glowbot-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const storagePath = `${BOT_USER_ID}/${filename}`;
  console.log(`   ☁️  Uploading to storage: ${storagePath}`);

  const { error: uploadErr } = await sb.storage.from('uploads').upload(storagePath, composited, {
    contentType: 'image/jpeg',
    upsert: false,
  });
  if (uploadErr) throw new Error(`Storage upload: ${uploadErr.message}`);

  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/uploads/${storagePath}`;

  const { data: row, error: insertErr } = await sb
    .from('uploads')
    .insert({
      user_id: BOT_USER_ID,
      image_url: publicUrl,
      ai_prompt: fluxPrompt,
      bot_message: muse.quote,
      is_ai_generated: true,
      is_active: true,
      is_posted: true,
      is_approved: true,
      is_public: true,
      posted_at: new Date().toISOString(),
      dream_medium: 'aura',
      dream_vibe: 'ethereal',
    })
    .select('id')
    .single();

  if (insertErr) throw new Error(`Insert upload: ${insertErr.message}`);

  console.log(`   ✅ Posted: ${row.id}`);
}

(async () => {
  console.log(`🌸 GlowBot — direct Flux Dev pipeline (aura + ethereal)`);

  let posted = 0;
  for (let i = 0; i < COUNT; i++) {
    try {
      await generateOne();
      posted++;
      if (i < COUNT - 1) await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      console.error(`\n❌ Post ${i + 1} failed:`, err.message);
    }
  }

  console.log(`\n🎉 Done. ${posted}/${COUNT} posts generated.`);
})();
