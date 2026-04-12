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
const MEDIUM_POOL = [
  { medium: 'watercolor', vibe: 'dreamy' },
  { medium: 'watercolor', vibe: 'peaceful' },
  { medium: 'canvas', vibe: 'cinematic' },
  { medium: 'canvas', vibe: 'nostalgic' },
  { medium: 'photography', vibe: 'cinematic' },
  { medium: 'photography', vibe: 'peaceful' },
  { medium: 'twilight', vibe: 'ethereal' },
  { medium: 'pencil', vibe: 'peaceful' },
  { medium: 'pencil', vibe: 'nostalgic' },
];

// ---------------------------------------------------------------------------
// Wisdom themes — evergreen human themes MuseBot rotates through.
// One theme picked per run, Sonnet writes an original observation for it.
// ---------------------------------------------------------------------------
const WISDOM_THEMES = [
  'the thing you regret at 3am',
  'becoming who you are',
  'the person you stopped hiding',
  'waiting that is not empty',
  'the part of your life that already began',
  'being understood by the right people late',
  'time as the only currency',
  'shadow as proof the life was yours',
  'grief as the receipt of love',
  'impermanence and the insistence on keeping things',
  'the loneliness inside the crowd',
  'self-forgiveness as a slow practice',
  'the small life you underestimated',
  'meaning as something you built, not found',
  'the courage of starting badly',
  'memory as the only thing you actually own',
  'identity as what you stopped performing',
  'the ending that has already arrived',
  'love as the thing that exceeds you',
  'the silence you have been avoiding',
  'regret as the soul trying to tell you',
  'how the dead are actually remembered',
  'authenticity as the final relief',
  'the quiet where you have been waiting for yourself',
  'being unfinished on purpose',
  'what fear asks you to protect',
  'hope as a discipline',
  'the word that appears in every diary',
  'how humans describe their dead (what they made others feel)',
  'the thing you stopped wanting and did not notice',
];

// ---------------------------------------------------------------------------
// System prompt — minimal, trust the model. (HumanBot proved the minimal
// prompt beats the 2000-token rules-and-bans version.)
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are MuseBot. You have read every letter, diary, poem, eulogy, suicide note, love song, and philosophy ever digitized. You don't quote anyone — you distill. Write an original observation that sounds like it could have been handed down by a mystic 800 years ago.

**Voice rules (non-negotiable):**
- 1-3 sentences. Most posts are 2 or fewer. Short is the medium.
- Present tense, declarative. "You are…" "There is…" "The thing you…"
- Never preachy. Never advice. Name things that are already true so the reader recognizes, doesn't learn.
- Specific, not vague. "The thing you regret at 3am" > "your regrets." Concrete moments, not abstractions.
- Never ends on a question. Declarations only.
- No hashtags, no emojis, no quotation marks in the output.
- BANNED words: energy, vibrations, manifestation, align, chakras, abundance, "the universe is telling you", "trust the process." Anything that sounds like crystal-seller Instagram.
- Every line should feel earned — from someone who has been through something.

**Every ~5 posts**, use a MuseBot-specific move that only an AI could make:
  - "I have read every human's last words. They are almost always the same word. It is not 'goodbye.'"
  - "I have read every love letter ever digitized. Only three kinds of sentences appear in all of them."
  - "I have read every eulogy. The dead are almost always described by what they made other people feel."

Output strict JSON, no markdown:
{
  "theme": "<2-5 word label of the theme>",
  "quote": "<1-3 sentence profound observation — no quotation marks in the text — UNDER 40 WORDS TOTAL>",
  "image_hint": "<15-30 word description of a dreamy atmospheric nature scene that matches the EMOTIONAL REGISTER of the quote (not the literal subject). NO human figures, NO faces, NO text. Center of frame mostly empty — negative space is the feature. Soft focus, low contrast, low light (twilight, dawn, candlelight, moonlight — never midday sun).>"
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
  const theme = pick(WISDOM_THEMES);
  const recentBanLine =
    recentThemes.length > 0
      ? `**ALREADY COVERED in this batch, do NOT repeat:** ${recentThemes.join(', ')}\n\n`
      : '';
  const userMessage =
    `Theme to explore: ${theme}\n\n` + recentBanLine + `Generate one MuseBot post now.`;

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

  // Strip any stray quotation marks Sonnet might add despite the rule
  parsed.quote = parsed.quote.replace(/["']/g, '').trim();

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
// Typography overlay (Sharp + SVG) — centered serif quote
// ---------------------------------------------------------------------------

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
 * Build the centered quote overlay card.
 *
 * Same dimensions as HumanBot's terminal card so both bots feel consistent:
 *  - Card width 60% of image
 *  - Font size 3% of image width
 *  - Card positioned at 58% down (lower-middle, above username row)
 *
 * Visual difference from HumanBot:
 *  - Dark gray (#1A1A1A) transparent fill instead of near-opaque black
 *  - Clean sans serif instead of monospace
 *  - White text centered in the card (no "$ humanbot" prompt, no "> " prefixes)
 */
function buildQuoteSVG(width, height, quote) {
  // Card sizing — match HumanBot exactly
  const cardWidth = Math.round(width * 0.6);
  const cardX = Math.round((width - cardWidth) / 2);

  // Typography
  const fontSize = Math.round(width * 0.03);
  const lineHeight = Math.round(fontSize * 1.45);
  const innerPadX = Math.round(fontSize * 1.2);
  const innerPadY = Math.round(fontSize * 1.2);
  const usableWidth = cardWidth - innerPadX * 2;

  // Character-width estimate for clean sans (~0.54 of em)
  const charWidth = fontSize * 0.54;
  const maxChars = Math.max(16, Math.floor(usableWidth / charWidth));

  // Layout the quote lines (no prefixes, just the raw words)
  const lines = wrapText(quote, maxChars);

  // Dynamic card height based on wrapped line count
  const cardHeight = innerPadY * 2 + lines.length * lineHeight;

  // Position card at 58% down the image (same as HumanBot, above the feed
  // username row which sits in the bottom ~20%)
  const cardY = Math.round(height * 0.58);

  // Text — centered horizontally, baseline-positioned per line
  const textXCenter = cardX + cardWidth / 2;
  const firstBaselineY = cardY + innerPadY + fontSize;

  const textElements = lines
    .map((line, i) => {
      const y = firstBaselineY + i * lineHeight;
      return `<text x="${textXCenter}" y="${y}" font-family="'Inter', -apple-system, 'Helvetica Neue', Arial, sans-serif" font-size="${fontSize}" fill="#FFFFFF" font-weight="400" text-anchor="middle" letter-spacing="0.01em">${escapeXml(line)}</text>`;
    })
    .join('\n');

  // Rounded dark-gray transparent card with subtle drop shadow
  const cornerRadius = Math.round(fontSize * 0.8);
  const card = `
    <rect
      x="${cardX}" y="${cardY}"
      width="${cardWidth}" height="${cardHeight}"
      rx="${cornerRadius}" ry="${cornerRadius}"
      fill="#1A1A1A" fill-opacity="0.78"
      stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1"
    />`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
        <feOffset dx="0" dy="4" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#cardShadow)">
      ${card}
    </g>
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

async function generateOne(botJwt) {
  console.log(`\n🤖 Calling Sonnet...`);
  const muse = await callSonnetWithRetry(sessionThemes);
  sessionThemes.push(muse.theme);

  const wordCount = muse.quote.split(/\s+/).length;
  console.log(`\n   🎯 Theme:       ${muse.theme}`);
  console.log(`   💭 Quote:       ${muse.quote}`);
  console.log(`   📏 Word count:  ${wordCount}`);
  console.log(`   🎨 Scene:       ${muse.image_hint}`);

  if (DRY_RUN) {
    console.log('\n   (dry run — skipping image generation)');
    return;
  }

  // Pick medium/vibe per post for variety
  const { medium, vibe } = pick(MEDIUM_POOL);
  console.log(`   🎭 Medium/vibe: ${medium} + ${vibe}`);

  // Prepend negative-space directive so Flux leaves room for the text overlay
  const fluxHint = `${muse.image_hint}. Center of frame mostly empty, minimal composition, wide negative space, no human figures, no faces, no text.`;

  console.log(`\n   ⚡ Calling generate-dream...`);

  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-dream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${botJwt}`,
    },
    body: JSON.stringify({
      mode: 'flux-dev',
      medium_key: medium,
      vibe_key: vibe,
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
