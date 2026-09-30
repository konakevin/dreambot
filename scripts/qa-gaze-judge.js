#!/usr/bin/env node
/**
 * Eye-direction judge for a set of renders (NIGHTLY_EYE_CONTACT_PLAN.md). Kevin 2026-09-30: "our faces and eyes are
 * looking randomly off camera". The head angle has a detector measure (scripts/qa-face-yaw.ts); the eyes do not (YuNet
 * gives no iris points), so this asks a vision model, one call per image, where each main person's head and eyes point.
 *
 *   node scripts/qa-gaze-judge.js [--out judged.jsonl] [--concurrency 6] <label>=<dir>[:<filename-substring>] [...]
 *
 * Prints per label: people judged, eyes on camera %, eyes elsewhere split (off / each other / down), VACANT % (Kevin: "i
 * don't care if characters are looking straight at the camera or not, i just don't want those blank stare, dead eye
 * looks"), heads side-on %.
 * With --out, every verdict is appended as one JSON line and images already in the file are not judged again.
 * Offline QA only (job `script`, Sonnet 4.6 unless --llm-model says otherwise).
 */
const fs = require('fs');
const path = require('path');
require(path.join(__dirname, '..', 'node_modules', 'dotenv')).config({
  path: path.join(__dirname, '..', '.env.local'),
});
const { callClaude, parseLlmOverride, llmOverrideFromArgs } = require('./lib/anthropic');

const override = parseLlmOverride(llmOverrideFromArgs());
const LLM = override ? { override, routes: {}, stamp: () => {} } : null;

const PROMPT = `Look only at the main people in this image (ignore small background figures, statues, paintings or reflections).
For each main person, from left to right, report:
- head: "frontal" (the face points at the viewer, within about 20 degrees), "three_quarter" (clearly turned but both eyes visible) or "profile" (side-on)
- eyes: "camera" (the eyes look straight at the viewer), "off" (they look to the side, up or into the distance), "each_other" (they look at the other main person), "down" (they look down at their hands, an object or the ground), or "unclear"
Be strict about the eyes: "camera" only when the pupils meet the viewer's eyes, as in a portrait making eye contact. Eyes glancing even slightly past the viewer, to one side, are "off".
- life: "alive" (the eyes are focused with a natural, engaged expression: on the viewer, on the other person, or on a thing in the scene they are clearly looking at) or "vacant" (a blank stare: glassy or dead eyes, or eyes aimed off to the side at nothing in particular, a frozen or awkward look)
Answer with JSON only, no other words: {"people":[{"head":"...","eyes":"...","life":"..."}]}`;

function args() {
  const a = process.argv.slice(2);
  const out = { specs: [], out: null, concurrency: 6 };
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--out') out.out = a[++i];
    else if (a[i] === '--concurrency') out.concurrency = Number(a[++i]) || 6;
    else if (a[i] === '--llm-model') i++;
    else if (a[i].includes('=')) out.specs.push(a[i]);
  }
  return out;
}

function listImages(spec) {
  const [label, rest] = [spec.slice(0, spec.indexOf('=')), spec.slice(spec.indexOf('=') + 1)];
  const colon = rest.lastIndexOf(':');
  const dir = colon > 1 ? rest.slice(0, colon) : rest;
  const sub = colon > 1 ? rest.slice(colon + 1) : '';
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && (!sub || f.includes(sub)))
    .sort()
    .map((f) => path.join(dir, f));
  return { label, files };
}

/** From the bytes, not the name: production renders are often PNG or WebP saved as .jpg. */
function mediaType(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50) return 'image/png';
  if (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP')
    return 'image/webp';
  return 'image/jpeg';
}

async function judge(file) {
  const buf = fs.readFileSync(file);
  const data = buf.toString('base64');
  const r = await callClaude({
    job: 'script',
    llm: LLM,
    maxTokens: 300,
    content: [
      { type: 'image', source: { type: 'base64', media_type: mediaType(buf), data } },
      { type: 'text', text: PROMPT },
    ],
  });
  const m = r.text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error(`no JSON: ${r.text.slice(0, 120)}`);
  const people = JSON.parse(m[0]).people;
  if (!Array.isArray(people)) throw new Error('no people array');
  return people.map((p) => ({
    head: String(p.head || ''),
    eyes: String(p.eyes || ''),
    life: String(p.life || ''),
  }));
}

async function pool(items, n, fn) {
  let i = 0;
  const run = async () => {
    while (i < items.length) {
      const k = i++;
      await fn(items[k]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, run));
}

async function main() {
  const opt = args();
  const done = new Map();
  if (opt.out && fs.existsSync(opt.out)) {
    for (const line of fs.readFileSync(opt.out, 'utf8').split('\n').filter(Boolean)) {
      const j = JSON.parse(line);
      done.set(j.file, j.people);
    }
  }
  for (const spec of opt.specs) {
    const { label, files } = listImages(spec);
    const verdicts = [];
    await pool(files, opt.concurrency, async (file) => {
      let people = done.get(file);
      if (!people) {
        try {
          people = await judge(file);
        } catch (e) {
          console.warn(`  skip ${path.basename(file)}: ${e.message}`);
          return;
        }
        done.set(file, people);
        if (opt.out) fs.appendFileSync(opt.out, JSON.stringify({ file, people }) + '\n');
      }
      verdicts.push({ file, people });
    });
    const all = verdicts.flatMap((v) => v.people);
    const n = all.length;
    const pct = (k) => (n ? `${Math.round((100 * k) / n)}%` : '-');
    const eyes = (e) => all.filter((p) => p.eyes === e).length;
    const imagesAllCamera = verdicts.filter(
      (v) => v.people.length && v.people.every((p) => p.eyes === 'camera')
    ).length;
    console.log(
      `${label.padEnd(26)} images ${String(verdicts.length).padStart(3)}  people ${String(n).padStart(3)}  ` +
        `eyes on camera ${pct(eyes('camera'))}  off ${pct(eyes('off'))}  each other ${pct(eyes('each_other'))}  ` +
        `down ${pct(eyes('down'))}  |  VACANT ${pct(all.filter((p) => p.life === 'vacant').length)}  ` +
        `|  heads side-on ${pct(all.filter((p) => p.head === 'profile').length)}  ` +
        `|  images with every person on camera ${verdicts.length ? Math.round((100 * imagesAllCamera) / verdicts.length) : 0}%`
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
