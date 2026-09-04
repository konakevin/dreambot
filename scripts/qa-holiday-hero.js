#!/usr/bin/env node
/**
 * Render the day-of HERO off-season into Kevin's album (HOLIDAY_DREAMS_PLAN.md §13,
 * mig 457/458). Walks surfaces × registers × axis seeds so we can grade the variants.
 *
 *   node scripts/qa-holiday-hero.js                       # 3 surfaces × 2 registers × 1 seed
 *   node scripts/qa-holiday-hero.js --seeds 3 --round 2   # 18 renders
 *   node scripts/qa-holiday-hero.js --surface dual --register eerie --seeds 2
 *   node scripts/qa-holiday-hero.js --holiday halloween --dry   # print the plan only
 *
 * Captions land as "🎃 HERO <surface> <register> s<seed> R<round>". Every render asserts the
 * response's `hero: true` (the MECHANISM proof, not just the picture). Sequential + pool-
 * headroom gated (CLAUDE.md hard rule: cap heavy render concurrency, gate on headroom).
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { waitForHeadroom } = require('./lib/poolHeadroom');
const SB = 'https://jimftynwrinwenonjrlj.supabase.co';
const U = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const W = process.env.DREAM_QUEUE_WORKER_TOKEN;
const sb = createClient(SB, process.env.SUPABASE_SERVICE_ROLE_KEY);
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const HOLIDAY = arg('holiday', 'halloween');
const ROUND = arg('round', '1');
const SEEDS = Number(arg('seeds', '1'));
const ONLY_SURFACE = arg('surface', null);
const ONLY_REGISTER = arg('register', null);
const DRY = process.argv.includes('--dry');
const EMOJI =
  { halloween: '🎃', fall: '🍂', christmas: '🎄', thanksgiving: '🦃', new_years: '🎉' }[HOLIDAY] ||
  '🎉';

const SURFACES = [
  ['dual', 'couple'],
  ['self', 'self'],
  ['plus_one', 'plus1'],
].filter(([c]) => !ONLY_SURFACE || c === ONLY_SURFACE);
const REGISTERS = ['cozy', 'eerie'].filter((r) => !ONLY_REGISTER || r === ONLY_REGISTER);

(async () => {
  const plan = [];
  for (const [cast, label] of SURFACES)
    for (const reg of REGISTERS)
      for (let s = 1; s <= SEEDS; s++)
        plan.push({ cast, label, reg, seed: `qa-${HOLIDAY}-${reg}-${label}-R${ROUND}-s${s}`, s });
  console.log(`${plan.length} hero render(s) for ${HOLIDAY}${DRY ? ' (dry)' : ''}`);
  if (DRY) {
    for (const p of plan) console.log(`  ${p.label} ${p.reg} s${p.s}`);
    return;
  }
  const out = [];
  let failures = 0;
  for (const p of plan) {
    await waitForHeadroom({ min: 25, label: `hero ${p.label} ${p.reg} s${p.s}` });
    await sb
      .from('ai_generation_budget')
      .delete()
      .eq('user_id', U)
      .eq('date', new Date().toISOString().slice(0, 10));
    let d;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(`${SB}/functions/v1/nightly-dreams`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${W}` },
          body: JSON.stringify({
            user_id: U,
            force_day_of: HOLIDAY,
            force_cast_role: p.cast,
            force_hero_register: p.reg,
            force_hero_seed: p.seed,
          }),
        });
        d = await res.json();
      } catch (e) {
        d = { error: e.message };
      }
      if (d && d.upload_id) break;
      if (d && d.code === 'WORKER_RESOURCE_LIMIT' && attempt < 2) continue;
      break;
    }
    if (!d || !d.upload_id) {
      failures++;
      console.log(`  ✗ ${p.label} ${p.reg} s${p.s}: ${JSON.stringify(d || {}).slice(0, 120)}`);
      continue;
    }
    if (d.hero !== true) failures++;
    const { data: up } = await sb
      .from('uploads')
      .select('dream_medium,holiday')
      .eq('id', d.upload_id)
      .single();
    const caption = `${EMOJI} HERO ${p.label} ${p.reg} s${p.s} R${ROUND}`;
    await sb.from('uploads').update({ caption }).eq('id', d.upload_id);
    // The exact axis picks are in the render's fallback_reasons (holiday_hero:<key>:<surface>:<register>:<picks>).
    const { data: log } = await sb
      .from('ai_generation_log')
      .select('fallback_reasons')
      .eq('upload_id', d.upload_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    const heroReason = (log?.fallback_reasons || []).find((r) =>
      String(r).startsWith('holiday_hero:')
    );
    console.log(
      `  ${d.hero === true ? '✓' : '✗ hero=false'} ${caption} [${up?.dream_medium}|h=${up?.holiday}] ${d.image_url}\n      ${heroReason || '(no holiday_hero reason logged)'}`
    );
    out.push({ caption, url: d.image_url, hero: d.hero, reason: heroReason });
  }
  console.log(
    `\n${out.length - failures}/${plan.length} hero renders OK${failures ? ` · ${failures} FAILED` : ''}`
  );
  console.log(JSON.stringify(out.map((o) => o.url)));
  if (failures) process.exit(1);
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
