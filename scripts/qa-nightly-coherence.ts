#!/usr/bin/env -S deno run --allow-read --allow-net --allow-env
/**
 * Nightly coherence QA sweep (Phase 4 of NIGHTLY_DREAM_ARCHITECTURE.md).
 *
 * Runs the REAL scene assembler (assembleScene) across every location card,
 * N times each, and flags cross-biome leakage — a foreground/weather/detail
 * that does not belong in the location's biome (e.g. a 'canal' or 'driftwood'
 * in a desert, a 'glacier' in a café). This is the regression guard for the
 * Phase-2 biome-scope filter: if a future pool/tag change reopens the
 * deer-in-a-café class of bug, this turns red.
 *
 *   deno run --allow-read --allow-net --allow-env scripts/qa-nightly-coherence.ts
 *   deno run ... scripts/qa-nightly-coherence.ts --runs 12 --verbose
 *
 * Exits non-zero if any biome's leak rate exceeds THRESHOLD (CI-friendly).
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { assembleScene, BIOME_BANNED_KEYWORDS } from '../supabase/functions/_shared/sceneEngine.ts';

const env = Object.fromEntries(
  Deno.readTextFileSync(new URL('../.env.local', import.meta.url))
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', env.SUPABASE_SERVICE_ROLE_KEY);

const RUNS = Number(Deno.args.find((a) => a.startsWith('--runs='))?.split('=')[1] ?? 8);
const VERBOSE = Deno.args.includes('--verbose');
const THRESHOLD = 0.05; // max acceptable fraction of runs leaking a foreign token

// Cross-biome incongruity spec — the SAME list the assembler's keyword guard
// uses (imported, so they can't drift). A leak here means a banned term reached
// the assembled scene anyway — from the location's own cinematic_phrases (which
// the pool guard doesn't filter) or a pipeline gap. That's exactly what we want
// to catch.
const BANNED = BIOME_BANNED_KEYWORDS;

const { data: cards } = await sb
  .from('location_cards')
  .select('name,biome,tags,visual_palette,atmosphere,cinematic_phrases,fusion_settings')
  .order('biome');

const calm = {
  peaceful_chaotic: 0.5,
  cute_terrifying: 0.3,
  minimal_maximal: 0.5,
  realistic_surreal: 0.5,
};
const perBiome: Record<string, { runs: number; leaks: number }> = {};
const offenders: string[] = [];

for (const c of cards ?? []) {
  const banned = BANNED[c.biome ?? ''];
  if (!banned) continue; // permissive biome
  const card = {
    tags: c.tags ?? [],
    visual_palette: c.visual_palette ?? [],
    atmosphere: c.atmosphere ?? [],
    cinematic_phrases: c.cinematic_phrases ?? [],
    fusion_settings: c.fusion_settings ?? {},
  };
  const pb = (perBiome[c.biome] = perBiome[c.biome] ?? { runs: 0, leaks: 0 });
  for (let i = 0; i < RUNS; i++) {
    const s = assembleScene({
      renderMode: 'none',
      faceSwapEligible: false,
      compositionMode: 'balanced',
      includeLocation: true,
      includeObject: false,
      userPlace: c.name,
      locationCard: card,
      moodAxis: calm,
      biome: c.biome,
    }).toLowerCase();
    pb.runs++;
    const hit = banned.find((b) => s.includes(b));
    if (hit) {
      pb.leaks++;
      offenders.push(`${c.biome} / ${c.name}: "${hit}"`);
    }
  }
}

console.log(`\n=== Nightly coherence sweep (${RUNS} runs/location) ===`);
let failed = false;
for (const b of Object.keys(perBiome).sort()) {
  const { runs, leaks } = perBiome[b];
  const rate = leaks / runs;
  const bad = rate > THRESHOLD;
  if (bad) failed = true;
  console.log(
    `${bad ? '❌' : '✅'} ${b.padEnd(22)} ${leaks}/${runs} leaked (${(rate * 100).toFixed(1)}%)`
  );
}
if (VERBOSE && offenders.length) {
  console.log('\nOffenders:');
  for (const o of offenders.slice(0, 40)) console.log('  ', o);
}
console.log(
  failed ? '\nFAIL — a biome exceeded the leak threshold.' : '\nPASS — all biomes coherent.'
);
Deno.exit(failed ? 1 : 0);
