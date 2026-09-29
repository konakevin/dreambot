#!/usr/bin/env node
/**
 * Score a 5.5 tuning round (LLM_5_5_TUNING.md): one or more results files from scripts/lab-llm-render-parity.js.
 * Downloads each render, runs the scenery score (scripts/qa-scenery-score.ts, Deno), and prints per model:
 * n, first-try face-swap hold, degrades, scenery median, tallest-face median. Same scoring for every round.
 *
 *   node scripts/qa-llm-round-score.mjs <results.json> [more.json ...] [--couples-only] [--label=R1.1]
 */
import fs from 'fs';
import { Buffer } from 'buffer';
import path from 'path';
import { execFileSync } from 'child_process';

const env = Object.fromEntries(
  fs
    .readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const SRK = env.SUPABASE_SERVICE_ROLE_KEY;
const files = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const COUPLES_ONLY = process.argv.includes('--couples-only');
const label = (process.argv.find((a) => a.startsWith('--label=')) || '--label=round').slice(8);
if (!files.length) throw new Error('usage: qa-llm-round-score.mjs <results.json> …');

const rows = [];
for (const f of files) {
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const r of d.results) {
    if (!r.uploadId || !r.grade) continue;
    if (COUPLES_ONLY && r.cast !== 2) continue;
    rows.push({ file: f, ...r });
  }
}
const dir = path.join(path.dirname(files[0]), `img-${label}`);
fs.mkdirSync(dir, { recursive: true });
const ids = rows.map((r) => r.uploadId);
const urls = {};
for (let i = 0; i < ids.length; i += 50) {
  const res = await fetch(
    `https://jimftynwrinwenonjrlj.supabase.co/rest/v1/uploads?select=id,image_url,image_url_display&id=in.(${ids.slice(i, i + 50).join(',')})`,
    { headers: { apikey: SRK, Authorization: `Bearer ${SRK}` } }
  );
  for (const u of await res.json()) urls[u.id] = u.image_url_display || u.image_url;
}
for (const r of rows) {
  r.img = path.join(dir, `${r.key}-${r.arm}-${r.uploadId.slice(0, 8)}.jpg`);
  if (fs.existsSync(r.img) || !urls[r.uploadId]) continue;
  const b = Buffer.from(await (await fetch(urls[r.uploadId])).arrayBuffer());
  fs.writeFileSync(r.img, b);
}
const deno = fs.existsSync(`${process.env.HOME}/.deno/bin/deno`)
  ? `${process.env.HOME}/.deno/bin/deno`
  : 'deno';
const tsv = execFileSync(
  deno,
  ['run', '-A', new URL('./qa-scenery-score.ts', import.meta.url).pathname, dir],
  {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }
);
const score = {};
for (const line of tsv.trim().split('\n')) {
  const [detail, , , fh, p] = line.split('\t');
  score[p] = { detail: Number(detail), fh: fh === '-' ? null : Number(fh) };
}
const med = (xs) => {
  const s = xs.filter((x) => typeof x === 'number').sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : null;
};
console.log(`${label}: ${rows.length} renders scored (${dir})`);
for (const arm of [...new Set(rows.map((r) => r.arm))]) {
  for (const cast of [2, 1]) {
    const rs = rows.filter((r) => r.arm === arm && r.cast === cast);
    if (!rs.length) continue;
    const held = rs.filter((r) => r.grade.heldFirstTry).length;
    const infra = rs.filter(
      (r) => !r.grade.heldFirstTry && (r.stamps || []).some((x) => /dual_swap_error:.*500/.test(x))
    ).length;
    console.log(
      `  ${arm} ${cast === 2 ? 'couples' : 'solos  '} n=${rs.length}  first-try ${held}/${rs.length} (${infra} Fly 500s)  degraded ${rs.filter((r) => r.grade.degraded).length}  scenery median ${med(rs.map((r) => score[r.img] && score[r.img].detail))?.toFixed(2)}  face median ${med(rs.map((r) => score[r.img] && score[r.img].fh))?.toFixed(3)}`
    );
  }
}
