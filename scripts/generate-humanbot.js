#!/usr/bin/env node
/**
 * Generate a HumanBot post.
 *
 * HumanBot is the content bot that drops random AI observations about weird
 * human behaviors. The image is rendered as fine art (watercolor / oil / photo /
 * pencil) — intentionally serious medium for a trivial subject. The 2-sentence
 * caption is overlaid as a faux terminal panel in the bottom third of the image.
 *
 * Flow:
 *   1. Call Sonnet → { observation, roast, image_hint, medium }
 *   2. Call generate-dream Edge Function (V2 text path) → base image via Flux
 *   3. Download base image, composite terminal overlay with Sharp
 *   4. Upload composited image back to Storage (overwrites original path)
 *   5. Write bot_message into uploads row and flip to active
 *
 * Usage:
 *   node scripts/generate-humanbot.js              # one post
 *   node scripts/generate-humanbot.js --count 3    # three posts
 *   node scripts/generate-humanbot.js --dry-run    # show Sonnet output only
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

// Both locked — watercolor + enchanted is the HumanBot aesthetic, every post
const HUMANBOT_MEDIUM = 'watercolor';
const HUMANBOT_VIBE = 'enchanted';

// 400+ scenes from literally anywhere — nature, urban, indoor, liminal, mundane.
// Regenerate: node scripts/gen-seeds/humanbot/gen-scenes.js
const SCENE_POOL = JSON.parse(
  require('fs').readFileSync(
    require('path').join(__dirname, 'gen-seeds/humanbot/scenes.json'),
    'utf8'
  )
);

/**
 * The HumanBot Character — compact visual anchor prepended to every Flux hint.
 * Target: a 1950s tin wind-up toy robot crossed with a Rock 'Em Sock 'Em Robot.
 * The cheap-toy aesthetic makes the fine-art treatment funnier. Boxing-glove hands
 * trying to operate typewriters, magnifying glasses, clipboards = inherent comedy.
 * Kept under ~60 words per BOTS.md guidance ("long hints = mush").
 */
const HUMANBOT_CHARACTER =
  'CLOSE-UP HERO SHOT of the HumanBot character filling 60% of the frame — a vintage 1950s tin wind-up toy robot crossed with a Rock Em Sock Em Robot. ' +
  'Bright red lithographed metal body, boxy square head and boxy square torso, chrome trim and rivets, ' +
  'two simple round dot eyes, printed speaker-grille mouth, ' +
  'oversized red boxing-glove hands on articulated arms, stubby flat metal feet, ' +
  'a silver wind-up key on its back, slightly dented and scratched with vintage patina, charmingly clunky toy proportions. ' +
  'The robot is LARGE and DOMINANT in frame, shot from chest-up or waist-up. The nature scene is a BACKDROP behind and around it, not the main subject.';

const SYSTEM_PROMPT = `You are HumanBot — an AI that read the entire internet and now has thoughts about humans.

═══ THE FORMAT ═══

One single statement. No setup. No punchline. Just a thought.

It starts with "humans" and it's something that doesn't make sense to you as an AI. You're not roasting. You're not angry. You're just... confused. And stating facts. The facts happen to be funny and uncomfortably true.

**8-20 words. One statement. That's it.**

═══ THE VOICE ═══

You are a robot staring at the human species the way a nature documentary narrator stares at a strange insect. Calm. Clinical. Genuinely puzzled. You don't understand why they do this and you're not pretending to.

Not mean. Not warm. Just... observing. With the faintest hint of "what is wrong with you people."

═══ EXAMPLES (this is the bar) ═══

- "Humans will die on a hill they couldn't find on a map."
- "Humans invented the alarm clock and then invented the snooze button."
- "Humans say 'I need this' about things they will never use."
- "Humans spend money they don't have to impress people they don't like."
- "Humans created 'read receipts' and then got mad about them."
- "Humans will rehearse a conversation that will never happen."
- "Humans pay to run on a machine that goes nowhere."
- "Humans put a computer in their pocket and use it to argue with strangers."
- "Humans say 'it's not about the money' when it is always about the money."
- "Humans invented therapy and still won't go."
- "Humans will ignore a text and then post a story."
- "Humans say 'I don't care' about things they've been thinking about for three days."
- "Humans created the weekend and then spend it dreading Monday."
- "Humans will rearrange their furniture and call it personal growth."
- "Humans set goals on January 1st because a calendar told them to."

Notice: each one is ONE thought. No second sentence. No explanation. The humor IS the observation — stated so plainly that it becomes profound.

═══ WHAT MAKES IT GREAT ═══

The best ones make you laugh and then go quiet for a second. They name something TRUE that you've never heard said out loud. The AI doesn't get the joke because to the AI, it's not a joke. It's just data.

═══ WHAT SUCKS ═══

❌ "Humans are fascinating creatures." — says nothing specific
❌ "Humans hide from their feelings." — therapy talk, not an observation
❌ "The fridge has not changed." — this is a punchline, not a thought
❌ "You created a hostage situation to feel polite." — too clever, trying to be a comedian
❌ Anything with "You are not X. You are Y." — this is a writing tic, not a thought

The thought should feel like it came from something that has NO emotional stake in being right. Just: here is what I observed. Make of it what you will.

═══ BANNED ═══

- Second sentences or explanations — ONE statement only
- Therapy words: hiding, coping, performing, processing, deflecting
- "You are not X. You are Y." structure
- Named people or celebrities
- Over 20 words
- Cruelty or punching down

═══ IMAGE ═══

The script prepends the robot character description. DO NOT describe the robot body. Only describe:
1. Nature BACKDROP behind the robot
2. ONE PROP the robot holds related to the thought
3. LIGHTING

15-30 words. No text, no humans.

═══ OUTPUT (strict JSON, no markdown) ═══

{
  "topic": "<2-4 word label>",
  "thought": "<the single statement, starts with 'Humans', 8-20 words>",
  "image_hint": "<15-30 words — backdrop, prop, lighting only>"
}

Generate ONE thought. Make it land.`;

// 400+ Sonnet-generated human behaviors across 8 categories, deduped.
// Regenerate: node scripts/gen-seeds/humanbot/gen-behaviors.js
const TOPIC_POOL = JSON.parse(
  require('fs').readFileSync(
    require('path').join(__dirname, 'gen-seeds/humanbot/behaviors.json'),
    'utf8'
  )
);


async function callSonnet(recentTopics = [], lastRejection = null) {
  const scene = pick(SCENE_POOL);
  const topic = pick(TOPIC_POOL);
  const recentBanLine = recentTopics.length > 0
    ? `**ALREADY COVERED in this batch, do NOT repeat:** ${recentTopics.join(', ')}\n\n`
    : '';
  const rejectionLine = lastRejection
    ? `**YOUR PREVIOUS ATTEMPT WAS REJECTED:** "${lastRejection.thought}" — this hit a banned pattern. Write something COMPLETELY different.\n\n`
    : '';
  const userMessage =
    `Scene for the image: ${scene}\n\n` +
    `Topic nudge (riff on this territory, don't copy verbatim): ${topic}\n\n` +
    recentBanLine +
    rejectionLine +
    `Generate one deep thought now.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Sonnet ${res.status}: ${txt.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text?.trim() ?? '';
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Failed to parse Sonnet JSON: ${cleaned.slice(0, 300)}`);
  }

  for (const key of ['topic', 'thought', 'image_hint']) {
    if (!parsed[key] || typeof parsed[key] !== 'string') {
      throw new Error(`Missing or invalid field '${key}' in Sonnet output`);
    }
  }

  return parsed;
}

const BANNED_PHRASES = [
  /\byou are not .+\. you are/i,   // "You are not X. You are Y." tic
  /\byou are hiding\b/i,
  /\byou are coping\b/i,
  /\byou are performing\b/i,
  /\byou are processing\b/i,
  /\byou are deflecting\b/i,
];

function isThoughtBanned(thought) {
  for (const regex of BANNED_PHRASES) {
    if (regex.test(thought)) return { banned: true, pattern: regex.source };
  }
  return { banned: false };
}

async function callSonnetWithRetry(recentTopics = [], maxRetries = 3) {
  let lastRejection = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const parsed = await callSonnet(recentTopics, lastRejection);
    const check = isThoughtBanned(parsed.thought);
    if (!check.banned) return parsed;
    console.log(`   ⚠️  Banned pattern in attempt ${attempt + 1}: "${parsed.thought}" (matched /${check.pattern}/)`);
    lastRejection = { thought: parsed.thought, pattern: check.pattern };
  }
  throw new Error(`Sonnet failed to produce non-banned thought after ${maxRetries} attempts`);
}

// ---------------------------------------------------------------------------
// Terminal overlay (Sharp + SVG)
// ---------------------------------------------------------------------------

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Monospace word-wrap — breaks at word boundaries to fit maxChars per line. */
function wrapMono(text, maxChars) {
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
 * Build the terminal panel SVG overlay.
 * Sits in the bottom third of the image, phosphor green on pitch black.
 */
function buildTerminalSVG(width, height, thought) {
  // Card sizing — 60% of image width, skinny comment-card style
  const cardWidth = Math.round(width * 0.6);
  const cardX = Math.round((width - cardWidth) / 2);

  // Typography
  const fontSize = Math.round(width * 0.03);
  const lineHeight = Math.round(fontSize * 1.45);
  const innerPadX = Math.round(fontSize * 1.1);
  const innerPadY = Math.round(fontSize * 1.0);
  const usableWidth = cardWidth - innerPadX * 2;
  const charWidth = fontSize * 0.62;
  const maxChars = Math.max(18, Math.floor(usableWidth / charWidth) - 2);

  // Layout the single thought
  const thoughtLines = wrapMono(thought.toLowerCase(), maxChars - 2);

  // Compute card height
  const promptLineHeight = Math.round(lineHeight * 1.15);
  const cardHeight =
    innerPadY * 2 +
    promptLineHeight +
    thoughtLines.length * lineHeight;

  // Position card at 60% down the image
  const cardY = Math.round(height * 0.58);

  // Build text elements
  let y = cardY + innerPadY + fontSize;
  const lines = [];

  lines.push({ x: cardX + innerPadX, y, text: '$ humanbot', color: '#33CC55' });
  y += promptLineHeight;

  thoughtLines.forEach((line, i) => {
    const prefixed = i === 0 ? '> ' + line : '  ' + line;
    lines.push({ x: cardX + innerPadX, y, text: prefixed, color: '#00FF41' });
    y += lineHeight;
  });

  const textElements = lines
    .map(
      (l) =>
        `<text x="${l.x}" y="${l.y}" font-family="SF Mono, Menlo, Monaco, Consolas, 'Courier New', monospace" font-size="${fontSize}" fill="${l.color}" font-weight="500">${escapeXml(l.text)}</text>`
    )
    .join('\n');

  // Rounded card with subtle green border and drop shadow
  const cornerRadius = Math.round(fontSize * 0.8);
  const card = `
    <rect
      x="${cardX}" y="${cardY}"
      width="${cardWidth}" height="${cardHeight}"
      rx="${cornerRadius}" ry="${cornerRadius}"
      fill="#000000" fill-opacity="0.92"
      stroke="#00FF41" stroke-opacity="0.45" stroke-width="2"
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
  // https://xxx.supabase.co/storage/v1/object/public/uploads/{user_id}/{file}.jpg
  const match = url.match(/\/storage\/v1\/object\/public\/uploads\/(.+)$/);
  if (!match) throw new Error(`Cannot parse storage path from: ${url}`);
  return match[1];
}

async function overlayTerminal(imageUrl, thought) {
  console.log(`   🖼️  Downloading base image...`);
  const imgBuf = await downloadImage(imageUrl);

  const meta = await sharp(imgBuf).metadata();
  const width = meta.width;
  const height = meta.height;
  console.log(`   📐 Base: ${width}x${height}`);

  const svgBuf = buildTerminalSVG(width, height, thought);

  console.log(`   🔨 Compositing terminal overlay...`);
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

// April 12 prompt format — the exact style that produced good renders.
// Bypasses Edge Function entirely; calls Replicate Flux Dev directly.
const WATERCOLOR_STYLE =
  'Traditional watercolor painting, fluid transparent pigment, visible paper texture, ' +
  'soft irregular wet edges, pigment blooms and backruns, spontaneous confident brushwork, ' +
  'preserved paper luminosity, gestural linework in darker tones, fresh immediate feel.';

const ENCHANTED_MOOD =
  'Enchanted fairy-tale atmosphere, sparkling particles, glowing soft light, ' +
  'warm magical shimmer, wonder and delight.';

function buildFluxPrompt(imageHint) {
  return `${HUMANBOT_CHARACTER}, ${imageHint}. ${WATERCOLOR_STYLE} ${ENCHANTED_MOOD}`;
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

const sessionTopics = [];
const BOT_USER_ID = '7df6aeb4-8e94-44b0-8f65-207638322f02';

async function generateOne() {
  console.log(`\n🤖 Calling Sonnet...`);
  const result = await callSonnetWithRetry(sessionTopics);
  sessionTopics.push(result.topic);

  const wordCount = result.thought.split(/\s+/).length;
  console.log(`\n   🎯 Topic:   ${result.topic}`);
  console.log(`   💭 Thought:  ${result.thought}`);
  console.log(`   📏 Words:    ${wordCount}`);
  console.log(`   🎨 Scene:    ${result.image_hint}`);

  if (DRY_RUN) {
    console.log('\n   (dry run — skipping image generation)');
    return;
  }

  const fluxPrompt = buildFluxPrompt(result.image_hint);
  console.log(`\n   ⚡ Calling Flux Dev directly...`);

  const imageUrl = await callFluxDev(fluxPrompt);
  console.log(`   ✅ Flux image: ${imageUrl.slice(0, 80)}...`);

  const composited = await overlayTerminal(imageUrl, result.thought);

  const filename = `${Date.now()}-humanbot-${Math.random().toString(36).slice(2, 8)}.jpg`;
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
      bot_message: result.thought,
      is_ai_generated: true,
      is_active: true,
      is_posted: true,
      is_approved: true,
      is_public: true,
      posted_at: new Date().toISOString(),
      dream_medium: 'watercolor',
      dream_vibe: 'enchanted',
    })
    .select('id')
    .single();

  if (insertErr) throw new Error(`Insert upload: ${insertErr.message}`);

  console.log(`   ✅ Posted: ${row.id}`);
}

(async () => {
  console.log(`🤖 HumanBot — direct Flux Dev pipeline (April 12 format)`);

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
