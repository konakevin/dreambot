#!/usr/bin/env -S deno run --allow-read --allow-net --allow-env --allow-write
/**
 * Scenery score for a set of renders (scripts/lib/sceneryScore.ts, LLM_5_5_TUNING_PLAN.md phase 0).
 *
 *   deno run -A scripts/qa-scenery-score.ts <file-or-dir> [...]      prints one line per image + medians
 *   deno run -A scripts/qa-scenery-score.ts --validate=labels.json    labels: {"<path>": "full"|"plain"|"partial"}
 *
 * --validate reports how often a random "full" image outscores a random "plain" one (the AUC); the plan's bar for
 * trusting the score is ≥ 0.85.
 */
import { sceneryScore, type Scenery } from './lib/sceneryScore.ts';

const args = Deno.args;
const validate = args.find((a) => a.startsWith('--validate='));
const out: Array<{ path: string; s: Scenery }> = [];

async function score(path: string) {
  try {
    out.push({ path, s: await sceneryScore(await Deno.readFile(path)) });
  } catch (e) {
    console.error(`skip ${path}: ${(e as Error).message}`);
  }
}

if (validate) {
  const labels: Record<string, string> = JSON.parse(Deno.readTextFileSync(validate.slice(11)));
  for (const p of Object.keys(labels)) await score(p);
  const by = (l: string) => out.filter((o) => labels[o.path] === l).map((o) => o.s.detail);
  const full = by('full');
  const plain = by('plain');
  let wins = 0;
  for (const f of full) for (const p of plain) wins += f > p ? 1 : f === p ? 0.5 : 0;
  const auc = full.length && plain.length ? wins / (full.length * plain.length) : NaN;
  for (const o of out.sort((a, b) => a.s.detail - b.s.detail)) {
    console.log(
      `${o.s.detail.toFixed(2).padStart(6)}  ${String(labels[o.path]).padEnd(7)}  faces ${o.s.faces}  ${o.path.split('/').slice(-2).join('/')}`
    );
  }
  console.log(
    `\nfull n=${full.length}, plain n=${plain.length}: AUC ${auc.toFixed(3)} (trust at ≥ 0.85)`
  );
} else {
  for (const a of args) {
    try {
      const st = Deno.statSync(a);
      if (st.isDirectory) {
        for (const e of Deno.readDirSync(a))
          if (/\.(jpe?g|png)$/i.test(e.name)) await score(`${a}/${e.name}`);
      } else await score(a);
    } catch (e) {
      console.error(`skip ${a}: ${(e as Error).message}`);
    }
  }
  for (const o of out) {
    console.log(
      `${o.s.detail.toFixed(2)}\t${o.s.busy.toFixed(3)}\t${o.s.faces}\t${o.s.faceHFrac?.toFixed(3) ?? '-'}\t${o.path}`
    );
  }
}
