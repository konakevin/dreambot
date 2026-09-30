#!/usr/bin/env node
/**
 * Age fidelity audit (AGE_FIDELITY_PLAN.md). Kevin 2026-09-30: michele's 78-year-old +1 rendered ~35 in a nightly solo;
 * "i suspect we need to fix the age of character renders universally - solo, couples, create, nightly".
 *
 * Pulls recent production face-swap renders per surface (nightly / create / redream × solo / couple), reads each
 * person's cast age from the render's own prompt ("NN years old", in prompt order = left to right), asks a vision
 * model for each person's apparent age (left to right), and reports apparent − true by surface, age band and gender.
 *
 *   node scripts/qa-age-fidelity.js [--days 21] [--per 60] [--out ~/.dreambot-qa/age-fidelity] [--dir <images dir>]
 *
 * --dir judges a folder of lab renders instead (file names "<key>-...": ages from --ages key=age[,age] pairs).
 * Offline QA only: images and verdicts stay in the out folder (other users' renders, never committed).
 */
const fs = require('fs');
const path = require('path');
require(path.join(__dirname, '..', 'node_modules', 'dotenv')).config({
  path: path.join(__dirname, '..', '.env.local'),
});
const { createClient } = require(
  path.join(__dirname, '..', 'node_modules', '@supabase/supabase-js')
);
const { callClaude } = require('./lib/anthropic');

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > 0 ? process.argv[i + 1] : d;
};
const DAYS = Number(arg('days', '21'));
const PER = Number(arg('per', '60'));
const OUT = arg('out', path.join(process.env.HOME, '.dreambot-qa', 'age-fidelity'));
const LLM = { override: { model: 'claude-sonnet-5-5' }, routes: {}, stamp: () => {} };

const PROMPT = `Look at the main people in this image (ignore small background figures, statues, paintings or reflections).
For each main person, from left to right, estimate their apparent age in years from the face, skin, hair and build, and their apparent gender.
Answer with JSON only, no other words: {"people":[{"age": <number>, "gender": "man" | "woman"}]}`;

const mediaType = (b) =>
  b[0] === 0x89 ? 'image/png' : b.slice(8, 12).toString() === 'WEBP' ? 'image/webp' : 'image/jpeg';

async function judge(file) {
  const b = fs.readFileSync(file);
  const r = await callClaude({
    job: 'script',
    llm: LLM,
    maxTokens: 300,
    content: [
      {
        type: 'image',
        source: { type: 'base64', media_type: mediaType(b), data: b.toString('base64') },
      },
      { type: 'text', text: PROMPT },
    ],
  });
  const m = r.text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error(`no JSON: ${r.text.slice(0, 80)}`);
  return JSON.parse(m[0]).people || [];
}

async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) await fn(items[i++]);
    })
  );
}

const DECADE_WORDS = {
  twenties: 20,
  thirties: 30,
  forties: 40,
  fifties: 50,
  sixties: 60,
  seventies: 70,
  eighties: 80,
};
/** A decade phrase ("in her early forties", "mid-40s", "in his 60s") → the age it asks for (early 42, mid 45, late 48,
 *  bare 45). Create solos state age this way: Sonnet writes the prompt from the cast description. */
function ageFromDecade(text) {
  const m = (text || '').match(
    /\b(?:(early|mid|late)[- ])?(twenties|thirties|forties|fifties|sixties|seventies|eighties|[2-8]0s)\b/i
  );
  if (!m) return null;
  const base = DECADE_WORDS[m[2].toLowerCase()] ?? Number(m[2].slice(0, 2));
  const step = { early: 2, mid: 5, late: 8 }[(m[1] || '').toLowerCase()] ?? 5;
  return base + step;
}

/** Cast ages in prompt order ("NN years old"); a couple takes the first two, a solo the first. A solo with no
 *  "NN years old" falls back to its first decade phrase. */
function agesFromPrompt(prompt, count) {
  const out = [];
  for (const m of (prompt || '').matchAll(/\b(\d{1,2}) years old\b/g)) {
    out.push(Number(m[1]));
    if (out.length === count) break;
  }
  if (!out.length && count === 1) {
    const d = ageFromDecade(prompt);
    if (d) out.push(d);
  }
  return out;
}

async function pullProduction(sb) {
  const since = new Date(Date.now() - DAYS * 864e5).toISOString();
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb
      .from('ai_generation_log')
      .select('upload_id, job_id, enhanced_prompt, created_at, is_qa')
      .gte('created_at', since)
      .not('upload_id', 'is', null)
      .not('job_id', 'is', null)
      .order('created_at', { ascending: false })
      .range(from, from + 999);
    if (error) throw error;
    rows.push(
      ...data.filter(
        (r) =>
          !r.is_qa &&
          /years old|\b(?:twenties|thirties|forties|fifties|sixties|seventies|[2-8]0s)\b/i.test(
            r.enhanced_prompt || ''
          )
      )
    );
    if (data.length < 1000) break;
  }
  const byJob = new Map();
  const jobIds = [...new Set(rows.map((r) => r.job_id))];
  for (let i = 0; i < jobIds.length; i += 200) {
    const { data } = await sb
      .from('dream_queue')
      .select('id, source')
      .in('id', jobIds.slice(i, i + 200));
    for (const q of data || []) byJob.set(q.id, q.source);
  }
  const byUpload = new Map();
  const upIds = rows.map((r) => r.upload_id);
  for (let i = 0; i < upIds.length; i += 200) {
    const { data } = await sb
      .from('uploads')
      .select('id, face_swap_mode, image_url')
      .in('id', upIds.slice(i, i + 200));
    for (const u of data || []) byUpload.set(u.id, u);
  }
  const buckets = {};
  for (const r of rows) {
    const u = byUpload.get(r.upload_id);
    const source = byJob.get(r.job_id);
    if (!u || !u.image_url || !source || !['single', 'dual'].includes(u.face_swap_mode)) continue;
    const surface = `${source}:${u.face_swap_mode === 'dual' ? 'couple' : 'solo'}`;
    const want = u.face_swap_mode === 'dual' ? 2 : 1;
    const ages = agesFromPrompt(r.enhanced_prompt, want);
    if (ages.length !== want) continue;
    (buckets[surface] ||= []).push({
      surface,
      upload: r.upload_id,
      url: u.image_url,
      ages,
      at: r.created_at,
    });
  }
  const items = [];
  for (const list of Object.values(buckets)) items.push(...list.slice(0, PER));
  return items;
}

const band = (a) => (a < 35 ? '<35' : a < 55 ? '35-54' : '55+');

function report(verdicts) {
  const groups = {};
  const add = (k, d) => (groups[k] ||= []).push(d);
  for (const v of verdicts) {
    if (!v.people || v.people.length !== v.ages.length) continue;
    v.ages.forEach((age, i) => {
      const p = v.people[i];
      if (!p || typeof p.age !== 'number') return;
      const d = p.age - age;
      add(`${v.surface}`, d);
      add(`${v.surface} ${band(age)}`, d);
      add(`${v.surface} ${p.gender || '?'}`, d);
      add(`ALL ${band(age)}`, d);
    });
  }
  const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
  for (const k of Object.keys(groups).sort()) {
    const a = groups[k];
    const young10 = a.filter((d) => d <= -10).length;
    console.log(
      `${k.padEnd(28)} people ${String(a.length).padStart(3)}  median gap ${String(med(a)).padStart(4)} yrs  ` +
        `≥10 yrs too young ${Math.round((100 * young10) / a.length)}%  ≥10 too old ${Math.round((100 * a.filter((d) => d >= 10).length) / a.length)}%`
    );
  }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const cache = path.join(OUT, 'verdicts.jsonl');
  const done = new Map();
  if (fs.existsSync(cache)) {
    for (const l of fs.readFileSync(cache, 'utf8').split('\n').filter(Boolean)) {
      const j = JSON.parse(l);
      done.set(j.key, j);
    }
  }
  let items;
  const dir = arg('dir', null);
  if (dir) {
    const ages = Object.fromEntries(
      (arg('ages', '') || '')
        .split(' ')
        .filter(Boolean)
        .map((p) => [p.split('=')[0], p.split('=')[1].split(',').map(Number)])
    );
    items = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png)$/i.test(f))
      .map((f) => {
        const key = Object.keys(ages).find((k) => f.startsWith(k));
        return key
          ? { surface: `${path.basename(dir)}:${key}`, file: path.join(dir, f), ages: ages[key] }
          : null;
      })
      .filter(Boolean);
  } else {
    const sb = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    items = await pullProduction(sb);
  }
  const verdicts = [];
  await pool(items, 6, async (it) => {
    const key = it.upload || it.file;
    if (done.has(key)) return verdicts.push(done.get(key));
    let file = it.file;
    if (!file) {
      file = path.join(OUT, 'img', `${it.surface.replace(':', '-')}-${it.upload.slice(0, 8)}.jpg`);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      if (!fs.existsSync(file)) {
        const res = await fetch(it.url);
        if (!res.ok) return;
        fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
      }
    }
    try {
      const people = await judge(file);
      const v = { key, surface: it.surface, ages: it.ages, people, file };
      fs.appendFileSync(cache, JSON.stringify(v) + '\n');
      verdicts.push(v);
    } catch (e) {
      console.warn(`skip ${path.basename(file)}: ${e.message}`);
    }
  });
  report(verdicts);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
