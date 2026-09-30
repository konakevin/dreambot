#!/usr/bin/env node
/**
 * Eye-contact screen (NIGHTLY_EYE_CONTACT_PLAN.md): real nightly prompts re-rendered on flux-1.1-pro DIRECTLY (Replicate,
 * fixed seed per prompt, no face swap, no DB load) with the face / gaze wording changed one way per arm, so a difference
 * between arms comes from the words alone. Judge the output dirs with scripts/qa-gaze-judge.js and scripts/qa-face-yaw.ts.
 *
 *   node scripts/lab-eye-contact-screen.mjs --prompts=prompts.json --out=DIR --arms=base,c1 [--couples=24] [--solos=16]
 *
 * prompts.json: [{ id, mode: 'dual' | 'single', prompt }]. Arms are the named text edits in ARMS below; an arm that does
 * not change a prompt is skipped for it (so it never re-renders the base by accident).
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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
const REP = env.REPLICATE_API_TOKEN;
const arg = (k, d) => {
  const a = process.argv.find((x) => x.startsWith(`--${k}=`));
  return a ? a.slice(k.length + 3) : d;
};

const COUPLE_FACES = 'their faces turned toward the camera';
const SOLO_ANGLE = 'turned naturally toward the viewer at an easy three-quarter angle';
const SOLO_OFF = 'looking toward the camera or gently off into the scene';

/** Named text edits. Each returns the new prompt (or the same text when it does not apply). */
export const ARMS = {
  base: (p) => p,
  // Couples: the closing line names the EYES, in the same place (the framing does not move).
  c1: (p) =>
    p.replace(
      COUPLE_FACES,
      'both looking into the camera with relaxed, natural expressions, their faces turned toward the viewer'
    ),
  // Couples: the gaze rides each person in the foreground sentence.
  c2: (p) => {
    let n = 0;
    return p.replace(/, wearing /g, (m) => (n++ < 2 ? ', looking into the camera, wearing ' : m));
  },
  // Couples, round 3 (c2 cost scenery: paired median 14.6 → 12.8): no camera word, same place.
  c3: (p) => {
    let n = 0;
    return p.replace(/, wearing /g, (m) => (n++ < 2 ? ', looking out at the viewer, wearing ' : m));
  },
  // Couples, round 3: the gaze AFTER each person's wardrobe (later in the sentence than c2).
  c4: (p) => {
    const m = p.match(
      /(In the foreground, on the left, [^;]*?, wearing )([^;]+)(; to (?:her|his|their) right, with a clear gap between their heads, [^.]*?, wearing )([^.]+)(\.)/
    );
    if (!m) return p;
    return p.replace(
      m[0],
      `${m[1]}${m[2]}, looking into the camera${m[3]}${m[4]}, looking into the camera${m[5]}`
    );
  },
  // Round 4 (c2-c4 still cost scenery: "looking into the camera" reads as a posed portrait): candid wording.
  c6: (p) => {
    const m = p.match(
      /(In the foreground, on the left, [^;]*?, wearing )([^;]+)(; to (?:her|his|their) right, with a clear gap between their heads, [^.]*?, wearing )([^.]+)(\.)/
    );
    if (!m) return p;
    return p.replace(
      m[0],
      `${m[1]}${m[2]}, glancing at the camera${m[3]}${m[4]}, glancing at the camera${m[5]}`
    );
  },
  // Round 4: one gaze line right after the beat, before "Behind and around them".
  c8: (p) =>
    p.replace(
      / Behind and around them/,
      ' Both glance at the camera mid-moment. Behind and around them'
    ),
  // Round 5 nulls: does ANY edit lower scenery on these seeds, or only gaze words?
  n1: (p) => p.replace('A three-quarter length two-shot.', 'A three-quarter-length two-shot.'),
  n2: (p) => {
    const m = p.match(
      /(In the foreground, on the left, [^;]*?, wearing )([^;]+)(; to (?:her|his|their) right, with a clear gap between their heads, [^.]*?, wearing )([^.]+)(\.)/
    );
    if (!m) return p;
    return p.replace(m[0], `${m[1]}${m[2]}, in the moment${m[3]}${m[4]}, in the moment${m[5]}`);
  },
  // Round 6: c4 with the closing line's own face words trimmed (the gaze now rides each person), so the prompt keeps
  // its length and the face emphasis does not double.
  c9: (p) =>
    ARMS.c4(p).replace(
      'Both are shown from the knees up, side by side, their faces turned toward the camera, clearly visible and unobstructed, lifelike adult faces with realistic proportions.',
      'Both are shown from the knees up, side by side, clearly visible and unobstructed, lifelike adult faces with realistic proportions.'
    ),
  // Round 6: c4 whose gaze names where they stand ("from within the scene"), re-anchoring the frame to the place.
  c10: (p) => {
    const m = p.match(
      /(In the foreground, on the left, [^;]*?, wearing )([^;]+)(; to (?:her|his|their) right, with a clear gap between their heads, [^.]*?, wearing )([^.]+)(\.)/
    );
    if (!m) return p;
    return p.replace(
      m[0],
      `${m[1]}${m[2]}, looking into the camera${m[3]}${m[4]}, looking into the camera from within the scene${m[5]}`
    );
  },
  // Solos, round 6: the shipped solo gaze (c2 on a solo = after the medium) plus s1's two removals.
  s2: (p) => ARMS.s1(ARMS.c2(p)),
  // Solos: eyes to the camera, no "gently off", no three-quarter head.
  s1: (p) =>
    p
      .replace(SOLO_ANGLE, 'turned naturally toward the viewer, eyes meeting the camera')
      .replace(SOLO_OFF, 'looking into the camera'),
};

function seedFor(id) {
  return (
    parseInt(crypto.createHash('md5').update(String(id)).digest('hex').slice(0, 8), 16) % 1000000
  );
}

async function render(prompt, seed, file) {
  if (fs.existsSync(file)) return { ok: true, cached: true };
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(
      'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${REP}`,
          'Content-Type': 'application/json',
          Prefer: 'wait=60',
        },
        body: JSON.stringify({
          input: {
            prompt,
            aspect_ratio: '9:16',
            num_outputs: 1,
            output_format: 'jpg',
            output_quality: 100,
            seed,
          },
        }),
      }
    );
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 10000));
      continue;
    }
    let pred = await res.json();
    while (pred.status && !['succeeded', 'failed', 'canceled'].includes(pred.status)) {
      await new Promise((r) => setTimeout(r, 2000));
      pred = await (
        await fetch(pred.urls.get, { headers: { Authorization: `Bearer ${REP}` } })
      ).json();
    }
    if (pred.status !== 'succeeded') {
      const err = String(pred.error || pred.detail || pred.status);
      if (/nsfw|flagged/i.test(err)) return { ok: false, err };
      continue;
    }
    const url = Array.isArray(pred.output) ? pred.output[0] : pred.output;
    fs.writeFileSync(file, Buffer.from(await (await fetch(url)).arrayBuffer()));
    return { ok: true };
  }
  return { ok: false, err: 'retries' };
}

async function main() {
  const prompts = JSON.parse(fs.readFileSync(arg('prompts'), 'utf8'));
  const OUT = arg('out');
  const arms = arg('arms', 'base').split(',');
  const couples = prompts.filter((p) => p.mode === 'dual').slice(0, Number(arg('couples', '24')));
  const solos = prompts.filter((p) => p.mode === 'single').slice(0, Number(arg('solos', '16')));
  const jobs = [];
  for (const item of [...couples, ...solos]) {
    const kind = item.mode === 'dual' ? 'couple' : 'solo';
    for (const arm of arms) {
      const fn = ARMS[arm];
      if (!fn) throw new Error(`unknown arm ${arm}`);
      const text = fn(item.prompt);
      if (arm !== 'base' && text === item.prompt) continue;
      const dir = path.join(OUT, `${arm}-${kind}`);
      fs.mkdirSync(dir, { recursive: true });
      jobs.push({
        text,
        seed: seedFor(item.id),
        file: path.join(dir, `${item.id}.jpg`),
        arm,
        kind,
      });
    }
  }
  let next = 0;
  const fails = [];
  await Promise.all(
    [0, 1, 2, 3].map(async () => {
      while (next < jobs.length) {
        const j = jobs[next++];
        const r = await render(j.text, j.seed, j.file);
        if (!r.ok) fails.push(`${j.arm}/${path.basename(j.file)}: ${r.err}`);
      }
    })
  );
  const dirs = [...new Set(jobs.map((j) => path.dirname(j.file)))];
  console.log(
    `rendered ${jobs.length - fails.length}/${jobs.length}; failed: ${fails.join(' | ') || 'none'}`
  );
  console.log(`dirs: ${dirs.join(' ')}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
