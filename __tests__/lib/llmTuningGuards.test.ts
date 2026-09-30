/**
 * Guards for the Sonnet 5.5 tuning (LLM_5_5_TUNING.md). Two ways it could break silently, with no error anywhere:
 *
 * 1. A REPLACE overlay (llm_prompt_overlays, mig 577) swaps an exact piece of prompt text. If someone edits that text
 *    in the code, the overlay stops applying (it only stamps llm_overlay_miss:<job>:<key>) and 5.5 quietly loses the
 *    fix. Every replace overlay we rely on is listed here with the text it needs; this fails until the overlay's
 *    `find` is updated too.
 * 2. A migration that routes jobs (engine_config.llm_models / llm_preview_models) with a job or model the code does
 *    not know is ignored at runtime (the key is dropped, or the model is stamped llm_config_invalid). Every routing
 *    literal in every migration must name a real job and a model with a profile, with a valid effort.
 */
import fs from 'fs';
import path from 'path';
import { LLM_JOBS, MODEL_PROFILES, parseRouteString } from '@engine/anthropic';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const node = require('../../scripts/lib/anthropic') as { LLM_JOBS: Record<string, unknown> };

const ROOT = path.join(__dirname, '..', '..');
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

/** Replace overlays kept by the tuning rounds. Add a row whenever a replace overlay is kept. */
const REPLACE_OVERLAYS: Array<{ key: string; job: string; file: string; find: string }> = [
  {
    key: 'slots55-r1.1c-wardrobe-12w',
    job: 'nightly_slots',
    file: 'supabase/functions/_shared/characterSlotPrompt.ts',
    find: 'left_wardrobe (8-15 words)',
  },
  {
    key: 'scene55-r3.2-pure-length',
    job: 'nightly_brief',
    file: 'supabase/functions/nightly-dreams/index.ts',
    find: 'Write a Flux AI prompt (50-75 words, comma-separated).',
  },
  {
    key: 'scene55-r3.2-holiday-length',
    job: 'nightly_brief',
    file: 'supabase/functions/nightly-dreams/index.ts',
    find: 'Write a Flux AI prompt (55-80 words, comma-separated).',
  },
];

describe('kept 5.5 replace overlays still find their text', () => {
  for (const o of REPLACE_OVERLAYS) {
    it(`${o.key}: "${o.find}" appears exactly once in ${path.basename(o.file)}`, () => {
      const src = read(o.file);
      expect(src.split(o.find).length - 1).toBe(1);
      expect(Object.keys(LLM_JOBS)).toContain(o.job);
    });
  }
});

describe('every LLM routing literal in the migrations is valid', () => {
  const dir = path.join(ROOT, 'supabase', 'migrations');
  const literals: Array<{ file: string; json: string }> = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.sql'))) {
    const sql = fs.readFileSync(path.join(dir, f), 'utf8').replace(/^\s*--.*$/gm, '');
    const re =
      /llm_(?:preview_)?models\s*(?:=|\|\|)\s*(?:llm_(?:preview_)?models\s*\|\|\s*)?'(\{[\s\S]*?\})'::jsonb/g;
    for (let m = re.exec(sql); m; m = re.exec(sql)) literals.push({ file: f, json: m[1] });
  }

  it('finds the canary migrations (so the parser is actually reading them)', () => {
    const files = new Set(literals.map((l) => l.file));
    for (const f of [
      '576_llm_canary_kevin.sql',
      '579_llm_canary_kevin_create_couples.sql',
      '580_llm_canary_kevin_race_read_sonnet5.sql',
      '582_llm_cast_reads_55_kevin.sql',
      '583_llm_canary_bloombot_judges.sql',
    ]) {
      expect(files).toContain(f);
    }
  });

  it('names only real jobs and models with a profile, with a valid effort', () => {
    const jobs = new Set([...Object.keys(LLM_JOBS), ...Object.keys(node.LLM_JOBS)]);
    const problems: string[] = [];
    for (const { file, json } of literals) {
      const map = JSON.parse(json) as Record<string, unknown>;
      for (const [job, v] of Object.entries(map)) {
        if (!jobs.has(job)) problems.push(`${file}: unknown job ${job}`);
        if (typeof v !== 'string') {
          problems.push(`${file}: ${job} is not a "model[@effort]" string`);
          continue;
        }
        const route = parseRouteString(v);
        if (!route || !Object.prototype.hasOwnProperty.call(MODEL_PROFILES, route.model)) {
          problems.push(`${file}: ${job} → ${v} has no model profile`);
        }
        const effort = v.includes('@') ? v.slice(v.lastIndexOf('@') + 1) : null;
        if (effort && !['low', 'medium', 'high'].includes(effort)) {
          problems.push(`${file}: ${job} → ${v} has an unknown effort`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('the race read is routed to Sonnet 5, never to 5.5 (5.5 declines to infer race)', () => {
    for (const { file, json } of literals) {
      const v = (JSON.parse(json) as Record<string, unknown>).cast_ethnicity;
      if (typeof v !== 'string') continue;
      expect(`${file}: ${v}`).not.toMatch(/claude-sonnet-5-5/);
    }
  });
});
