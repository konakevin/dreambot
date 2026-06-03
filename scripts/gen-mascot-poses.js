#!/usr/bin/env node
/**
 * gen-mascot-poses — render 10 distinct poses of the DreamBot mascot
 * isolated against pure pitch-black via Sonnet (prompt authoring) →
 * Flux 1.1 Pro Ultra (rendering). Output: assets/images/mascots/
 * pose-1.jpg ... pose-10.jpg @ 512×512 JPG q85 (~60-80 KB each), plus
 * a prompts.json sidecar so we can re-run with the same prompts later.
 *
 * The loading screen rolls a random one of the 10 on mount; black-bg
 * isolation means each pose drops into the dark stage with no visible
 * matte/border seam.
 *
 * Cost: ~10 × $0.06 (Flux Ultra) + ~$0.05 (Sonnet) ≈ $0.70/run.
 * Wall time: ~40-60s (all 10 renders fan out in parallel).
 *
 * Usage:
 *   node scripts/gen-mascot-poses.js
 *
 * Env (from .env.local):
 *   ANTHROPIC_API_KEY
 *   REPLICATE_API_TOKEN
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const sharp = require('sharp');
const { SONNET } = require('./lib/models');

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const REPLICATE_KEY = process.env.REPLICATE_API_TOKEN;
if (!ANTHROPIC_KEY || !REPLICATE_KEY) {
  console.error('Missing ANTHROPIC_API_KEY or REPLICATE_API_TOKEN in .env.local');
  process.exit(1);
}

const FLUX_MODEL = 'black-forest-labs/flux-1.1-pro-ultra';
const POSE_COUNT = 10;
const OUT_DIR = path.join(__dirname, '..', 'assets', 'images', 'mascots');
const OUT_SIZE = 512; // 512×512 JPG q85 → ~60-80KB each

// Locked-in character DNA — pasted verbatim into every Flux prompt so
// the mascot stays recognizable across all 10 renders. Mirrors the
// splash icon (assets/images/splash-icon.png): one-eyed pearl-white
// chibi robot with a thin antenna.
const CHARACTER_DNA = [
  'a tiny adorable chibi robot character',
  'pearlescent off-white smooth rounded plush-like body',
  'stubby cylindrical arms and legs',
  'small silver bolt joints at the shoulders, hips, and ankles',
  'ONE single large oval black-glass visor eye filling most of the face with two bright pinpoint catchlight highlights',
  'no second eye, no mouth, no nose',
  'thin silver antenna with a small glowing warm-amber bead tip on top of the head',
  'soft warm rim light on the silhouette only',
  'kawaii proportions with an oversized head and tiny body',
  'cute 3D Pixar render with subtle micro material texture on the body',
].join(', ');

// Closing fragment — forces strict isolation against true black. The
// first pass through Flux 1.1 Pro Ultra had a strong studio-photography
// prior that drifted three renders (1/3/8) toward white/gray backgrounds
// despite "#000000 background". This version front-loads the negation
// keywords (no studio, no white/gray seamless paper, no softbox) and
// stacks the black-bg phrasing so Flux can't ignore it.
const CLOSING = [
  'completely surrounded by pitch-black RGB(0,0,0) void',
  'jet-black solid black background',
  'product-shot on pure black background',
  'NOT studio photography, NOT white background, NOT gray background, NOT seamless paper, NOT softbox lighting',
  'no clouds, no scenery, no environment, no floor, no walls, no ground shadow',
  'subject floating in pure black emptiness',
  'square 1:1 composition',
  'character centered with comfortable headroom',
].join(', ');

// ── 1. Generate 10 distinct pose prompts via Sonnet ────────────────────────
// We give Sonnet the DNA + closing verbatim and ask it to author 10
// distinct pose/action middle-clauses. Strict JSON output, no markdown,
// no commentary — fail loud on parse error so we never silently render
// a bad batch.
async function generatePosePrompts() {
  const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });
  const userMsg = `
TASK: Author exactly ${POSE_COUNT} Flux 1.1 Pro Ultra prompts for distinct cute mascot poses of a DreamBot character isolated against pure black.

Each prompt MUST be assembled in EXACTLY this shape:
  "${CHARACTER_DNA}, <YOUR_POSE_PHRASE>, ${CLOSING}"

Replace <YOUR_POSE_PHRASE> with one distinct pose/action per prompt. Mix calm and active, mix standing/sitting/floating/lying. Examples of GOOD pose phrases (use these as inspiration, generate DIFFERENT ones):
  - "waving hello with one stubby arm raised high, head tilted slightly"
  - "curled up asleep on its side with three small floating Z's drifting above its head"
  - "sitting cross-legged reading a tiny open book held in both hands"
  - "dancing joyfully with both arms out and one foot lifted mid-step"
  - "hands on hips heroic stance, chin lifted proud"
  - "floating in zero gravity arms outstretched like Superman flying"
  - "thinking pose with one hand pressed to the chin, head tilted curious"
  - "holding a tiny softly glowing warm-amber star in cupped hands close to its chest"
  - "spinning in a happy twirl with both arms out"
  - "hugging itself with both arms wrapped around its own body, eye crinkled with happiness"

Rules:
  • DNA + closing are EXACT — do not paraphrase, do not drop any word.
  • Each pose phrase is unique and clearly different from the others (no two waving variants, etc.).
  • Pose phrases should be 8–20 words, descriptive but not over-stuffed.
  • Output as a JSON array of exactly ${POSE_COUNT} strings. No markdown fences, no commentary, ONLY the JSON array.
`.trim();

  console.log('🧠 Asking Sonnet for 10 pose prompts...');
  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 4000,
    messages: [{ role: 'user', content: userMsg }],
  });
  let text = resp.content[0].text.trim();
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  let prompts;
  try {
    prompts = JSON.parse(text);
  } catch (err) {
    console.error('Sonnet returned non-JSON:\n', text.slice(0, 500));
    throw err;
  }
  if (!Array.isArray(prompts) || prompts.length !== POSE_COUNT) {
    throw new Error(`Expected ${POSE_COUNT} prompts, got ${prompts && prompts.length}`);
  }
  return prompts;
}

// ── 2. Render one prompt via Flux 1.1 Pro Ultra ────────────────────────────
async function renderOne(prompt, index) {
  const tag = `pose-${index}`;
  // Show just the pose middle clause in the log for readability.
  const middle = prompt.slice(CHARACTER_DNA.length + 2);
  const preview = middle.slice(0, 70).replace(/\s+/g, ' ');
  console.log(`🎨 [${tag}] ${preview}…`);

  const createRes = await fetch(
    `https://api.replicate.com/v1/models/${FLUX_MODEL}/predictions`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + REPLICATE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          prompt,
          aspect_ratio: '1:1',
          output_format: 'jpg',
          safety_tolerance: 2,
        },
      }),
    }
  );
  if (!createRes.ok) {
    const t = (await createRes.text()).slice(0, 400);
    throw new Error(`Replicate create ${createRes.status}: ${t}`);
  }
  const created = await createRes.json();
  if (!created.id) throw new Error(`No prediction id: ${JSON.stringify(created)}`);

  // Poll up to 90s (Flux 1.1 Pro Ultra usually finishes in 20-40s).
  let url = null;
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${created.id}`, {
      headers: { Authorization: 'Bearer ' + REPLICATE_KEY },
    });
    const pd = await poll.json();
    if (pd.status === 'succeeded') {
      url = typeof pd.output === 'string' ? pd.output : pd.output && pd.output[0];
      break;
    }
    if (pd.status === 'failed' || pd.status === 'canceled') {
      throw new Error(`Replicate ${pd.status}: ${pd.error || 'no message'}`);
    }
  }
  if (!url) throw new Error('Replicate timed out (90s)');

  // Download + downscale + compress.
  const dl = await fetch(url);
  if (!dl.ok) throw new Error(`Download HTTP ${dl.status}`);
  const buffer = Buffer.from(await dl.arrayBuffer());

  const out = path.join(OUT_DIR, `${tag}.jpg`);
  await sharp(buffer)
    .resize(OUT_SIZE, OUT_SIZE, { fit: 'cover' })
    .jpeg({ quality: 85, progressive: true })
    .toFile(out);

  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(`  ✓ [${tag}] saved (${kb} KB)`);
  return out;
}

// ── 3. Main ────────────────────────────────────────────────────────────────
// Flags:
//   --reroll 1,3,8   Re-render only those pose indices using the
//                    existing prompts.json (pose SEED preserved) but
//                    with the CURRENT CLOSING fragment substituted in.
//                    Use this after a prompt-tightening pass.
const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((s, i, a) => (s.startsWith('--') ? [s.slice(2), a[i + 1] ?? true] : null))
    .filter(Boolean)
);
const rerollIndices = args.reroll
  ? String(args.reroll)
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= POSE_COUNT)
  : null;

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  let prompts;
  if (rerollIndices) {
    // Re-roll: keep the original pose phrases (Sonnet's creative work
    // from the first pass), swap in the current CLOSING + DNA so any
    // tightening lands. We splice the pose seed out of the original
    // prompt by stripping the known DNA + closing.
    const promptsJsonPath = path.join(OUT_DIR, 'prompts.json');
    if (!fs.existsSync(promptsJsonPath)) {
      console.error('No prompts.json on disk — run the full pass first before --reroll.');
      process.exit(1);
    }
    const existing = JSON.parse(fs.readFileSync(promptsJsonPath, 'utf8'));
    prompts = existing.map((full) => {
      // Strip leading DNA + comma, and trailing closing (with any prior
      // closing variant — match on the last common phrase).
      let core = full;
      if (core.startsWith(CHARACTER_DNA + ', ')) {
        core = core.slice(CHARACTER_DNA.length + 2);
      }
      // Strip everything starting from the first occurrence of "isolated against"
      // or "completely surrounded by" (old + new closing markers).
      const cutMarkers = ['isolated against', 'completely surrounded by'];
      let cutIdx = -1;
      for (const m of cutMarkers) {
        const idx = core.indexOf(m);
        if (idx !== -1 && (cutIdx === -1 || idx < cutIdx)) cutIdx = idx;
      }
      if (cutIdx !== -1) core = core.slice(0, cutIdx).replace(/,\s*$/, '');
      // Reassemble with current DNA + closing.
      return `${CHARACTER_DNA}, ${core.trim()}, ${CLOSING}`;
    });
    console.log(`🔁 Re-rolling poses [${rerollIndices.join(', ')}] with tightened closing.`);
  } else {
    prompts = await generatePosePrompts();
    fs.writeFileSync(path.join(OUT_DIR, 'prompts.json'), JSON.stringify(prompts, null, 2));
  }

  const targets = rerollIndices
    ? rerollIndices.map((i) => ({ prompt: prompts[i - 1], index: i }))
    : prompts.map((p, i) => ({ prompt: p, index: i + 1 }));

  console.log(`\nRendering ${targets.length} mascots in parallel...\n`);
  const results = await Promise.allSettled(targets.map((t) => renderOne(t.prompt, t.index)));

  const ok = results.filter((r) => r.status === 'fulfilled').length;
  const bad = results.length - ok;
  console.log(`\n${ok === results.length ? '✅' : '⚠️'} Done: ${ok} ok / ${bad} failed`);
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`  pose-${targets[i].index}: ${r.reason.message}`);
    }
  });

  if (bad > 0) process.exit(1);
})();
