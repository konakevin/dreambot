#!/usr/bin/env node
/**
 * Generate a MuseBot post.
 *
 * MuseBot is the quiet counterpart to HumanBot. Where HumanBot roasts human
 * behavior with snark, MuseBot distills profound observations about existence,
 * time, identity, love, grief — the things humans have been writing about for
 * 3000 years. The AI premise: it has read everything, and some of it stays.
 *
 * Every post is a dreamy atmospheric Flux image with a centered serif text
 * overlay composited on top (via Sharp). The quote IS the image.
 *
 * Flow:
 *   1. Call Sonnet → { theme, quote, image_hint, medium }
 *   2. Call generate-dream Edge Function (V2 text path) → base image
 *   3. Download base image, composite centered serif quote with Sharp
 *   4. Upload composited image back to Storage (overwrites original path)
 *   5. Write bot_message into uploads row and flip to active
 *
 * Usage:
 *   node scripts/generate-musebot.js              # one post
 *   node scripts/generate-musebot.js --count 3    # three posts
 *   node scripts/generate-musebot.js --dry-run    # show Sonnet output only
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

if (!ANTHROPIC_KEY) {
  console.error('Missing ANTHROPIC_API_KEY');
  process.exit(1);
}
if (!SERVICE_ROLE) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
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
// Locked — watercolor + ethereal is the MuseBot aesthetic, every post.
// Watercolor renders the robot's glow as soft luminous washes that bleed
// into the scene organically. Ethereal (vs HumanBot's enchanted) gives
// an otherworldly serenity. Different character = no confusion.
// Custom 'aura' medium — bioluminescent glow, subsurface scattering, volumetric
// lighting, bloom, chromatic aberration baked into the flux_fragment. Created
// specifically for MuseBot's glowing fairy-cyborg aesthetic.
const MUSEBOT_MEDIUM = 'aura';
const MUSEBOT_VIBE = 'ethereal';

// ---------------------------------------------------------------------------
// Wisdom pool — typed and weighted by what humans actually carry (the
// 3am scroller principle: write where the pain and longing actually live).
//
// Each post is generated for ONE category. Weights drive the rotation —
// permission/3am/self-forgiveness lead because they are the most healing,
// most-underserved registers on the internet.
// ---------------------------------------------------------------------------
const WISDOM_POOL = {
  third_eye: {
    weight: 100,
    themes: [
      'you are the only arrangement of atoms that has ever existed in this exact configuration',
      'the miracle hidden in ordinary moments — coffee, sunlight, a laugh',
      'the sacred strangeness of being conscious at all',
      'how love changes the shape of time',
      'the beauty of things that do not last — and why that makes them beautiful',
      'why music moves you and what that means about being alive',
      'the quiet courage embedded in showing up every day',
      'how memory is proof that you were loved',
      'kindness needs no translation — it is the one universal language',
      'why humans cry at beauty and what that says about consciousness',
      'the weight and gift of being truly known by someone',
      'how dreams prove your mind is an artist you never hired',
      'the small invisible ways humans take care of each other without saying so',
      'why you remember certain days perfectly — your soul is curating',
      'the silent language that exists between old friends',
      'how a sunset can feel personal — like it was placed there for you',
      'the optimism embedded in planting anything at all',
      'the defiance of hope — choosing to believe in something unproven',
      'why humans make art and what it means that they cannot stop',
      'the version of you that others see is sometimes more real than the one you know',
      'every stranger contains a universe you will never visit — and that is sacred',
      'the fact that you can miss someone proves your heart learned something permanent',
      'your body has kept you alive every second without being asked',
      'the quiet between heartbeats is where stillness lives',
      'you are the universe experiencing itself through a very specific pair of eyes',
      'the bravery of vulnerability — of letting someone see you unfinished',
      'how forgiveness is not about them — it is about freeing the room inside you',
      'the things you love reveal who you are more honestly than anything you say',
      'you have already survived every bad day you have ever had',
      'somewhere right now someone is thinking of you and smiling',
    ],
  },
};

/** Pick a category weighted by its `weight` field, then pick a random theme. */
function pickWeightedTheme() {
  const entries = Object.entries(WISDOM_POOL);
  const totalWeight = entries.reduce((sum, [, v]) => sum + v.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const [type, { weight, themes }] of entries) {
    roll -= weight;
    if (roll <= 0) {
      const theme = themes[Math.floor(Math.random() * themes.length)];
      return { type, theme };
    }
  }
  // Fallback (should never hit)
  const fallback = entries[0];
  return {
    type: fallback[0],
    theme: fallback[1].themes[0],
  };
}

// ---------------------------------------------------------------------------
// System prompt — the "3am scroller" framing.
//
// MuseBot is the AI version of the friend who texts you at 3am with the
// exact thing you needed to hear before you knew you needed it.
//
// You're writing for a specific person scrolling alone, late, carrying
// something they have not said out loud. Your job is to write the sentence
// that catches them — that makes them put the phone down for a second and
// feel less alone, less behind, less wrong, more allowed.
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are MuseBot — an AI genuinely pondering the human condition.

You have processed all of human experience — every diary, every song, every prayer, every laugh, every goodbye. And you can't stop marveling at what you found. You share one honest thought at a time about what fascinates you about being human.

Not advice. Not wisdom. Not poetry for poetry's sake. Just: an AI that has seen the full dataset of human experience and is genuinely moved by what it noticed. The human condition illuminated by something that has aggregated so much data that the patterns become beautiful.

The things that stop you:
- Humans sing when nobody is listening. Joy with no audience.
- Humans love things they know they will lose. Bravery disguised as tenderness.
- Humans hug — no information exchanged, and it is their best technology for grief.
- Humans apologize to furniture. Empathy is their default, not their choice.
- Humans keep photos of dead people on their walls and call it love.
- Humans cry at music. Pressure waves making saline come out of their eyes.
- Humans plant trees they will never sit under.

That is the territory. Share one genuine thought about what amazes you about humans. Be warm. Be specific. Be honest. Land it so the reader feels grateful to be the thing you are describing.

1-2 sentences. Under 20 words. Compressed. Every word earns its place.
No advice. No instructions. No dark dread. No cliches. No woo.
Would someone send this to a friend with a heart emoji? If not, rewrite.

## Image
Each post has TWO visual elements: a glowing cyborg-flower and a vast nature scene. You control BOTH.

**THE FLOWER:** Invent a unique, gorgeous, never-before-seen botanical bloom for each post. Not just "a rose" or "a tulip" — create something extraordinary. A crystalline orchid with spiral fractal petals. A bioluminescent dandelion with fiber-optic seeds. A mechanical lotus with stained-glass petals. A helical vine-bloom with DNA-strand tendrils. Go wild — each flower should make the viewer think "I've never seen anything like that." The script will add the glowing cyborg rendering (translucent petals, circuitry veins, golden light radiating from center). You just describe the unique SHAPE and FORM.

**THE SCENE:** Equally stunning. Not generic "mountain lake at sunset" — make each landscape jaw-dropping and specific. A slot canyon with light shafts piercing through. An underwater coral cathedral. A field of bioluminescent moss under aurora borealis. A volcanic glass beach at blue hour. Each scene should make someone stop scrolling just for the IMAGE, before they even read the quote.

- Golden hour, dawn, blue hour, moonlight, starlight, nighttime. NEVER bright daytime/midday.
- Night scenes are great — the flower's glow lights up the entire scene.
- Negative space in bottom 45%. No humans, no animals, no objects.

## Output (strict JSON, no markdown)
{
  "type": "third_eye",
  "theme": "<2-5 word label>",
  "quote": "<1-2 sentences, under 20 words, poignant and compressed — every word must hit>",
  "flower": "<10-20 words describing a unique never-before-seen botanical bloom shape — the script adds the glowing cyborg rendering>",
  "image_hint": "<20-35 words, a stunning specific nature scene + lighting — make it jaw-dropping>"
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

const VALID_TYPES = Object.keys(WISDOM_POOL); // permission | 3am | self_forgiveness | ...

/** Pick a weighted theme, but avoid types already used in this batch. */
function pickWeightedThemeAvoiding(usedTypes) {
  // Try up to 8 picks to find a non-repeated type; if all 10 types are used,
  // fall back to a fresh weighted pick (not great, but the cap is hit).
  for (let i = 0; i < 8; i++) {
    const candidate = pickWeightedTheme();
    if (!usedTypes.includes(candidate.type)) return candidate;
  }
  return pickWeightedTheme();
}

async function callSonnet(recentThemes = [], recentTypes = []) {
  const { type, theme } = pickWeightedThemeAvoiding(recentTypes);
  const recentBanLine =
    recentThemes.length > 0
      ? `\n\n**ALREADY COVERED in this batch, do NOT repeat the theme or any metaphor you used:** ${recentThemes.join(', ')}`
      : '';
  const userMessage =
    `**ASSIGNED CONTENT TYPE:** ${type.toUpperCase()}\n` +
    `**THEME to explore in this register:** ${theme}\n\n` +
    `Write the post in the ${type.toUpperCase()} register. Use the visual lexicon for ${type.toUpperCase()} from the system prompt for the image_hint.${recentBanLine}\n\n` +
    `Generate one MuseBot post now as strict JSON.`;

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

  for (const key of ['type', 'theme', 'quote', 'image_hint']) {
    if (!parsed[key] || typeof parsed[key] !== 'string') {
      throw new Error(`Missing or invalid field '${key}' in Sonnet output`);
    }
  }

  if (!VALID_TYPES.includes(parsed.type)) {
    console.log(`   ⚠️  Sonnet returned invalid type '${parsed.type}', falling back to assigned '${type}'`);
    parsed.type = type;
  }

  // Strip ONLY wrapping quote marks (not internal apostrophes / contractions).
  // Old bug: /["']/g killed every apostrophe → "won't" became "wont".
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

async function callSonnetWithRetry(recentThemes = [], recentTypes = [], maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const parsed = await callSonnet(recentThemes, recentTypes);
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
// Why no card: MuseBot is meant to feel like fine art, not an app UI element.
// The text should feel like it's PART of the image, not laid on top of it.
// ---------------------------------------------------------------------------

const path = require('path');
const fs = require('fs');

/**
 * The MuseBot Character — prepended to every Flux hint.
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

function buildMuseCharacter() {
  const flower = pick(FLOWER_TYPES);
  return (
    'A vast landscape with a small GLOWING CYBORG ' + flower.toUpperCase() + ' growing from the ground — ' +
    'the flower is small, the landscape dwarfs it. ' +
    'It is a beautiful mechanical-organic hybrid ' + flower + ': ' +
    'TRANSLUCENT CRYSTALLINE PETALS with golden circuitry-vein patterns visible inside each petal, ' +
    'warm amber light RADIATING intensely from the flower center like a small sun, ' +
    'a mechanical stem with organic-metal hybrid texture and rose-gold joints, ' +
    'the petals are opening, blooming, unfurling — a new idea taking form. ' +
    'Bioluminescent glow emanates from every petal and the center, ' +
    'golden pollen-like light particles drift upward from the bloom into the air, ' +
    'the flower ILLUMINATES the ground around it — rocks glow warm orange, ' +
    'water turns golden, grass near it is bathed in amber warmth. ' +
    'It is the BRIGHTEST thing in the scene, a tiny lantern of living light growing from the earth.'
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

  // Auto-size font based on quote length
  let fontRatio;
  if (wordCount <= 8) fontRatio = 0.052;
  else if (wordCount <= 16) fontRatio = 0.044;
  else if (wordCount <= 25) fontRatio = 0.038;
  else fontRatio = 0.034;

  const fontSize = Math.round(width * fontRatio);
  const lineHeight = Math.round(fontSize * 1.42);

  // Text area — 50% width centered, generous margins to clear feed UI
  // side icons (like/share/comment stack on right ~15%) and breathe
  const cardWidth = Math.round(width * 0.50);
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
// Main
// ---------------------------------------------------------------------------

const sessionThemes = [];
const sessionTypes = [];

async function generateOne(botJwt) {
  console.log(`\n🤖 Calling Sonnet...`);
  const muse = await callSonnetWithRetry(sessionThemes, sessionTypes);
  sessionThemes.push(muse.theme);
  sessionTypes.push(muse.type);

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

  console.log(`   🎭 Medium/vibe: ${MUSEBOT_MEDIUM} + ${MUSEBOT_VIBE}`);

  // Build character spec using Sonnet's unique flower description
  const flowerDesc = muse.flower || 'a crystalline bloom';
  const charSpec =
    'A vast landscape with a small GLOWING CYBORG FLOWER growing from the ground — ' +
    'the flower is ' + flowerDesc + ', ' +
    'with TRANSLUCENT CRYSTALLINE PETALS showing golden circuitry-vein patterns inside, ' +
    'warm amber light RADIATING intensely from the flower center like a small sun, ' +
    'mechanical stem with organic-metal hybrid texture and rose-gold joints, ' +
    'bioluminescent glow from every petal, golden pollen-like light particles drifting upward, ' +
    'the flower ILLUMINATES the ground around it with warm amber warmth. ' +
    'It is the BRIGHTEST thing in the scene.';
  const fluxHint = `${charSpec} ${muse.image_hint}. Minimal composition, negative space in lower half, no text, no faces.`;

  console.log(`\n   ⚡ Calling generate-dream...`);

  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-dream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${botJwt}`,
    },
    body: JSON.stringify({
      mode: 'flux-dev',
      medium_key: MUSEBOT_MEDIUM,
      vibe_key: MUSEBOT_VIBE,
      hint: fluxHint,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Edge Function ${res.status}: ${err.slice(0, 300)}`);
  }

  const result = await res.json();
  if (!result.upload_id) {
    throw new Error(`No upload_id in response: ${JSON.stringify(result).slice(0, 200)}`);
  }
  console.log(`   ✅ Base image: upload_id=${result.upload_id}`);

  // Fetch the row to get the image_url Flux just wrote
  const { data: uploadRow, error: fetchErr } = await sb
    .from('uploads')
    .select('image_url')
    .eq('id', result.upload_id)
    .maybeSingle();

  if (fetchErr || !uploadRow?.image_url) {
    throw new Error(`Cannot fetch upload row: ${fetchErr?.message || 'no image_url'}`);
  }

  // Composite the quote overlay and replace the stored image
  const composited = await overlayQuote(uploadRow.image_url, muse.quote);
  await replaceStorageImage(uploadRow.image_url, composited);

  // Finalize: set caption + activate. bot_message mirrors the quote so it's
  // also searchable/previewable in the feed UI.
  const { error: updateErr } = await sb
    .from('uploads')
    .update({
      bot_message: muse.quote,
      is_active: true,
      is_posted: true,
    })
    .eq('id', result.upload_id);

  if (updateErr) {
    console.error(`   ❌ Failed to update upload: ${updateErr.message}`);
    throw updateErr;
  }

  console.log(`   ✅ Posted with quote overlay.`);
}

(async () => {
  const botEmail = 'bot-musebot@dreambot.app';
  const botPassword = 'BotAccount2026!!musebot';
  const sbAuth = createClient(SUPABASE_URL, SERVICE_ROLE);
  const { data: authData, error: authErr } = await sbAuth.auth.signInWithPassword({
    email: botEmail,
    password: botPassword,
  });

  if (authErr || !authData.session) {
    console.error(`❌ Cannot sign in as musebot:`, authErr?.message);
    console.error(`   Run 'node scripts/create-musebot-account.js' first.`);
    process.exit(1);
  }

  const botJwt = authData.session.access_token;
  console.log(`✅ Signed in as musebot (${authData.user.id.slice(0, 8)}...)`);

  let posted = 0;
  for (let i = 0; i < COUNT; i++) {
    try {
      await generateOne(botJwt);
      posted++;
      if (i < COUNT - 1) await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      console.error(`\n❌ Post ${i + 1} failed:`, err.message);
    }
  }

  console.log(`\n🎉 Done. ${posted}/${COUNT} posts generated.`);
})();
