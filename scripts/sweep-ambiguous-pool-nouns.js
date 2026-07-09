#!/usr/bin/env node
/**
 * Ambiguous-noun hygiene sweep (Kevin 2026-07-09, the "sleeping giant" render:
 * a classic candid pose said "fake-tiptoeing past sleeping giant" — authored
 * as a comedy metaphor, but Flux LITERALIZED it at London Zoo into a colossal
 * sleeping beast. No intelligence reads the assembled prompt, so figurative /
 * underspecified nouns in pool entries are landmines).
 *
 * Sweeps EVERY pose pool (classic + active, dual + solo) and the active
 * scenario pools through Sonnet in batches: flag entries where a noun is
 * figurative or underspecified enough for an image model to render an
 * unintended literal object; propose a concrete reword that keeps the entry's
 * energy and passes the appropriate lint. Applies to BOTH the DB rows and the
 * code fallback arrays (parity must hold — verify-pool-parity runs at the end).
 *
 * Usage: node scripts/sweep-ambiguous-pool-nouns.js [--dry]
 * Output: scripts/out/ambiguous-noun-sweep.json (full report)
 */

require('dotenv').config({ path: '/Users/kevinmchenry/Development/apps/dreambot/.env.local' });
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');
const { SONNET } = require('./lib/models');
const { lintActivePoseEntry, lintClassicPoseEntry } = require('./lib/posePoolLint');

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const DRY = process.argv.includes('--dry');
const D = 'supabase/functions/_shared/pools/';
const CODE_FILES = [
  D + 'single_actions.ts',
  D + 'dual_actions.ts',
  D + 'single_actions_active.ts',
  D + 'dual_actions_active.ts',
];

async function sonnetJson(prompt) {
  const msg = await client.messages.create({
    model: SONNET,
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });
  let text = msg.content[0].text
    .trim()
    .replace(/^```(json)?/i, '')
    .replace(/```$/, '')
    .trim();
  try {
    return JSON.parse(text);
  } catch {
    const m = text.match(/\[[\s\S]*\]/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {
        return [];
      }
    }
    return [];
  }
}

async function flagBatch(entries, kind) {
  return sonnetJson(`You are auditing short ${kind} entries for an AI image-generation app. These entries get concatenated into a larger prompt with a LOCATION the author never knew — so any FIGURATIVE or UNDERSPECIFIED noun becomes a landmine: the image model renders it literally.

Real failure: "fake-tiptoeing past sleeping giant with exaggerated sneaky hunched posture" — "sleeping giant" was a comedy metaphor, but at a zoo location the model drew a literal colossal sleeping beast.

Flag ONLY entries containing a noun that (a) is figurative/metaphorical, OR (b) names a vague entity ("giant", "monster", "beast", "creature", "someone", "a figure", "invisible X") that the model could render as an unintended object or extra character. Do NOT flag concrete modifiers ("giant jenga tower", "giant stuffed prize" are fine — the noun is concrete).

For each flagged entry, provide a reword that:
- keeps the SAME energy, humor, and body language
- removes or concretizes the ambiguous noun WITHOUT introducing a new entity that could steal the frame (prefer removing: the person's own gesture carries the joke)
- keeps any existing face/separation phrases EXACTLY as they are

Output ONLY a JSON array (empty if nothing flagged): [{"original": "<verbatim>", "problem": "<8 words max>", "reword": "<the fixed entry>"}]

ENTRIES:
${entries.map((e, i) => `${i + 1}. ${e}`).join('\n')}`);
}

(async () => {
  // ── collect every entry with its provenance ──
  const { data: poses } = await sb
    .from('action_poses')
    .select('id,cast_type,pool,text')
    .limit(2000);
  const { data: dualScn } = await sb
    .from('dual_scenarios')
    .select('id,scene')
    .eq('pool', 'active')
    .limit(1000);
  const { data: soloScn } = await sb
    .from('single_scenarios')
    .select('id,scene')
    .eq('pool', 'active')
    .limit(1000);

  const items = [
    ...(poses ?? []).map((r) => ({
      table: 'action_poses',
      id: r.id,
      pool: `${r.cast_type}/${r.pool}`,
      text: r.text,
      col: 'text',
      active: r.pool === 'active',
    })),
    ...(dualScn ?? []).map((r) => ({
      table: 'dual_scenarios',
      id: r.id,
      pool: 'dual/scn-active',
      text: r.scene,
      col: 'scene',
      active: true,
    })),
    ...(soloScn ?? []).map((r) => ({
      table: 'single_scenarios',
      id: r.id,
      pool: 'solo/scn-active',
      text: r.scene,
      col: 'scene',
      active: true,
    })),
  ];
  console.log(
    `sweeping ${items.length} entries (${(poses ?? []).length} poses + ${(dualScn ?? []).length + (soloScn ?? []).length} active scenarios)`
  );

  // ── flag in batches of 80 ──
  const flagged = [];
  for (let i = 0; i < items.length; i += 80) {
    const batch = items.slice(i, i + 80);
    const res = await flagBatch(
      batch.map((b) => b.text),
      i === 0 ? 'pose/scene' : 'pose/scene'
    );
    for (const f of res) {
      const item = batch.find((b) => b.text === f.original);
      if (!item) continue; // Sonnet paraphrased the original — skip, safety first
      const lint = item.active ? lintActivePoseEntry(f.reword) : lintClassicPoseEntry(f.reword);
      if (lint.length) {
        console.log(`  ✗ reword fails lint (${lint[0]}): ${f.reword.slice(0, 60)}`);
        continue;
      }
      flagged.push({ ...item, problem: f.problem, reword: f.reword });
    }
    console.log(`  batch ${i / 80 + 1}: ${flagged.length} total flagged so far`);
  }

  fs.mkdirSync('scripts/out', { recursive: true });
  fs.writeFileSync('scripts/out/ambiguous-noun-sweep.json', JSON.stringify(flagged, null, 2));
  console.log(`\n=== ${flagged.length} entries flagged ===`);
  for (const f of flagged)
    console.log(
      `[${f.pool}] ${f.problem}\n  - ${f.text.slice(0, 90)}\n  + ${f.reword.slice(0, 90)}`
    );

  if (DRY || flagged.length === 0) {
    console.log(DRY ? '(dry run — nothing applied)' : 'nothing to apply');
    return;
  }

  // ── apply: DB rows ──
  for (const f of flagged) {
    const { error } = await sb
      .from(f.table)
      .update({ [f.col]: f.reword })
      .eq('id', f.id);
    if (error) console.error(`DB update failed [${f.table}#${f.id}]: ${error.message}`);
  }
  // ── apply: code fallback arrays (parity) ──
  for (const file of CODE_FILES) {
    let src = fs.readFileSync(file, 'utf8');
    let n = 0;
    for (const f of flagged) {
      const esc = f.text.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      const rew = f.reword.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      if (src.includes(`'${esc}'`)) {
        src = src.replace(`'${esc}'`, `'${rew}'`);
        n++;
      }
    }
    if (n) {
      fs.writeFileSync(file, src);
      console.log(`code: ${file.split('/').pop()} — ${n} entries reworded`);
    }
  }
  console.log(
    '✓ applied to DB + code. Run: node scripts/scan-dual-faceswap-proximity.js && node scripts/verify-pool-parity.js'
  );
})();
