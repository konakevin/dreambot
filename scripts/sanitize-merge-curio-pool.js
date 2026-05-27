/**
 * One-off: sanitize STEAMPUNK_ANIMATE_CURIOS (200 live clockwork creatures in
 * mid-motion) into framing-NEUTRAL, at-rest, clearly-MECHANICAL automaton
 * subjects, then write them to steampunk_curios.json (the curio pool the
 * steampunk-curio path reads).
 *
 * Why: "mechanical creature mimicking a real living thing + mid-motion pose"
 * makes Flux render a broken REAL animal, not a steampunk automaton (see
 * BOT_SCENE_QUALITY_PLAYBOOK.md → SteamBot lessons). Fix = recast each subject
 * as a STILL, clearly-mechanical brass automaton at rest. NO display/museum
 * framing and NO environment baked in — the path's habitat axis supplies the
 * steampunk SETTING (workshop / conservatory / lab / study / airship interior).
 *
 * Subject is PRESERVED; only the pose + "alive" language are sanitized. Run once:
 *   node scripts/sanitize-merge-curio-pool.js
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

const SEEDS = path.join(__dirname, 'bots', 'steambot', 'seeds');
const ANIMATE_FILE = path.join(SEEDS, 'steampunk_animate_curios.json');
const OUT_FILE = path.join(SEEDS, 'steampunk_curios.json');

async function callSonnet(prompt) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10 * 60 * 1000);
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
    if (!res.ok) throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 200)}`);
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
  return entries
    .map((e) =>
      e
        .replace(/^["']|["']$/g, '')
        .replace(/^[-•*]\s*/, '')
        .trim()
    )
    .filter((e) => e.length > 20 && e.length < 1200);
}

const STOPWORDS = new Set(
  'the a an and or but with of in on at to for from by as is are was were be been being have has had this that these those it its they them their her his into onto through across over under near around between one two three some any all no not than then also so very more most many much each every other another same such only own just still here there where when what who wide tall long high low large small massive huge vast above below beside behind toward within throughout'.split(
    ' '
  )
);
function signatureOf(entry) {
  const tokens = entry
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOPWORDS.has(w))
    .slice(0, 20);
  return [...new Set(tokens)].sort().slice(0, 12).join(' ');
}
function dedupe(entries) {
  const seen = new Set();
  const kept = [];
  let dropped = 0;
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const sig = signatureOf(e);
    if (sig.length >= 10 && seen.has(sig)) {
      dropped++;
      continue;
    }
    seen.add(sig);
    kept.push(e);
  }
  return { kept, dropped };
}

function buildPrompt(batch) {
  const numbered = batch.map((e, i) => `${i + 1}. ${e}`).join('\n');
  return `You are sanitizing pool entries for a steampunk image-generation bot (SteamBot). Each entry describes a clockwork/brass AUTOMATON creature. The current entries describe the creature ALIVE and IN MOTION ("mid-pounce", "mid-step", "wings mid-beat", "breathing", "alive-looking", "eyes tracking prey"). That language makes the image model render a REAL living animal with broken anatomy instead of a crafted metal automaton — a failure we are fixing.

REWRITE each entry as a STILL, clearly-MECHANICAL brass automaton AT REST. Preserve the SUBJECT (the same creature/organism) and its key mechanical detail; change only the pose and remove the "alive" language.

RULES for every rewrite:
- LEAD with the metal automaton identity so it reads as a made object, e.g. "Mechanical fox of brass and copper…", "Clockwork dragonfly of etched brass…". Always name the metal (brass / copper / bronze / silver / oiled steel) up front.
- Make it unmistakably MECHANICAL: keep 2-3 signature mechanical details (articulated brass joints, visible gears/springs/clockwork-heart through a panel, glass or gemstone eyes, riveted/etched metal plating, metal-leaf "fur"/"feathers"). It must read as a crafted automaton, NOT a live animal.
- POSE IS CALM AND STILL — a wound-down automaton at rest: "posed sitting calmly", "perched still", "settled with legs folded", "standing quietly", "curled at rest", "head gently turned". A gentle naturalistic resting pose is fine, but NO dynamic action. REMOVE all of: mid-pounce / mid-leap / mid-step / mid-snap / lunging / striking / hunting / pouncing / leaping / running / "breathing" / "alive-looking" / "could move at any second" / "eyes tracking prey".
- NO display/museum framing — do NOT add pedestal / vitrine / glass case / velvet cushion / spotlight / "displayed on". Just the automaton itself.
- NO environment or scene — do NOT add a room / workshop / forge / nature / background. Describe ONLY the automaton subject; the setting is added separately.
- NO humans, hands, or faces.
- 30-50 words, comma-separated phrases, no title prefix, no internal numbering.

Output a NUMBERED list with EXACTLY ${batch.length} entries, one rewrite per input, in the SAME ORDER. Output ONLY the numbered list.

ENTRIES TO REWRITE:
${numbered}`;
}

async function sanitizeBatch(batch, idx) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const text = await callSonnet(buildPrompt(batch));
      const arr = parseArray(text);
      if (arr.length >= Math.floor(batch.length * 0.6)) return arr;
      console.error(
        `  batch ${idx}: only ${arr.length}/${batch.length} parsed (attempt ${attempt}), retrying`
      );
    } catch (e) {
      console.error(`  batch ${idx} attempt ${attempt} failed: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 2000 * attempt));
  }
  console.error(`  batch ${idx}: GAVE UP after 3 attempts`);
  return [];
}

(async () => {
  const animate = JSON.parse(fs.readFileSync(ANIMATE_FILE, 'utf8'));
  console.log(`Animate (to sanitize): ${animate.length}`);

  const BATCH = 20;
  const batches = [];
  for (let i = 0; i < animate.length; i += BATCH) batches.push(animate.slice(i, i + BATCH));
  console.log(`Sanitizing in ${batches.length} parallel batches of ~${BATCH}…`);

  const results = await Promise.all(batches.map((b, i) => sanitizeBatch(b, i)));
  const sanitized = results.flat();
  console.log(`Sanitized entries returned: ${sanitized.length}`);

  const merged = dedupe(sanitized);
  console.log(`After dedup: ${merged.kept.length} (dropped ${merged.dropped} dupes)`);

  if (fs.existsSync(OUT_FILE)) {
    const bak = OUT_FILE + `.bak-${Date.now()}`;
    fs.copyFileSync(OUT_FILE, bak);
    console.log(`Backed up existing → ${path.basename(bak)}`);
  }
  fs.writeFileSync(OUT_FILE, JSON.stringify(merged.kept, null, 2) + '\n');
  console.log(`Wrote pool → ${path.basename(OUT_FILE)} (${merged.kept.length} entries)`);
  console.log('\nSample sanitized entries:');
  sanitized.slice(0, 5).forEach((e, i) => console.log(`  ${i + 1}. ${e.slice(0, 150)}`));
})();
