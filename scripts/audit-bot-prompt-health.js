#!/usr/bin/env node
/**
 * audit-bot-prompt-health.js — fleet check on the two ways a bot prompt goes
 * wrong WITHOUT anything looking broken. Both were found the hard way on
 * 2026-09-22 and both are invisible in a render log.
 *
 *   1. TRUNCATION. `botEngine.callClaude()` used to write every brief with a
 *      hardcoded `maxTokens: 400`. A brief that ran past it came back
 *      `stop_reason: 'max_tokens'`, cut MID-WORD, and the tail of the prompt —
 *      normally the output-order block carrying the path's closing instructions
 *      — was silently deleted. No log line, no stamp, no failed render. It ran
 *      at 6.7% fleet-wide and 21.4% on FarmBot before anyone noticed.
 *
 *      This detects it WITHOUT needing the stamp, so it works on history: group
 *      each bot's prompts, derive that bot's fixed trailing suffix as the
 *      longest common suffix, strip it, and look at where the model's own text
 *      actually ends. A prompt ending on a hyphen or a dangling function word
 *      ("…the broad wet surface of") was cut off.
 *
 *   2. OVER-LENGTH. A ~600-word prompt renders roughly its FIRST THIRD, and
 *      the dropped content is still IN the prompt — so a content sweep says
 *      everything is fine and you go blame a pool. Fleet median is ~250 words.
 *      FarmBot medians 562 with a 1,080 max, because its path briefs state no
 *      word count at all.
 *
 * IMPORTANT, and the reason this reads emitted prompts rather than source:
 * "does this bot state a word cap" does NOT predict length. 16 of 22 bots state
 * no cap anywhere and most emit perfectly reasonable 210-300 word prompts, while
 * one path that DID carry a "120-150 WORDS" cap emitted 669. Only the emitted
 * count means anything, and the lever that shortens it is deleting template
 * prose and output-order items, not adding a cap.
 *
 * Usage:
 *   node scripts/audit-bot-prompt-health.js              # whole fleet
 *   node scripts/audit-bot-prompt-health.js --bot farmbot
 *   node scripts/audit-bot-prompt-health.js --limit 3000 --samples
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const argv = process.argv.slice(2);
const flag = (n, d = null) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const ONLY_BOT = flag('--bot');
const LIMIT = Number(flag('--limit', 3000));
const SHOW_SAMPLES = argv.includes('--samples');

/** A ~600-word prompt renders its first third; this is the "look at me" line. */
const LONG_WORDS = 350;

/** Words a finished phrase essentially never ends on — so the text was cut off. */
const DANGLING =
  /\b(of|the|a|an|and|with|in|on|at|to|its|their|his|her|from|into|over|under|across|through|for|by|as|that|which|while|where|is|are|was|were|has|have|had|be|been|one|two|three|some|each|every|both|no)$/i;

function longestCommonSuffix(strings) {
  if (strings.length < 2) return '';
  let ref = strings[0];
  for (const s of strings.slice(1)) {
    let i = 0;
    while (i < ref.length && i < s.length && ref[ref.length - 1 - i] === s[s.length - 1 - i]) i++;
    ref = ref.slice(ref.length - i);
    if (!ref) break;
  }
  return ref;
}

const median = (a) => (a.length ? a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)] : 0);
const pct = (n, d) => (d ? ((n / d) * 100).toFixed(1) : '0.0');

async function fetchPrompts(sb) {
  let all = [];
  let from = 0;
  for (;;) {
    let q = sb
      .from('uploads')
      .select('ai_prompt, seed_source, created_at')
      .eq('seed_source->>source', 'bot')
      .not('ai_prompt', 'is', null)
      .order('created_at', { ascending: false }) // STABLE order — PostgREST caps reads at 1000
      .range(from, from + 999);
    if (ONLY_BOT) q = q.eq('seed_source->>bot', ONLY_BOT);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    all = all.concat(data);
    if (data.length < 1000 || all.length >= LIMIT) break;
    from += 1000;
  }
  return all;
}

(async () => {
  const sb = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const rows = await fetchPrompts(sb);
  if (!rows.length) {
    console.log('No bot prompts found.');
    return;
  }

  const byBot = {};
  for (const r of rows) {
    const b = r.seed_source?.bot || '?';
    (byBot[b] = byBot[b] || []).push(r);
  }

  const samples = [];
  const report = [];
  let fleetTrunc = 0;
  let fleetChecked = 0;

  for (const [bot, ups] of Object.entries(byBot)) {
    const prompts = ups.map((u) => String(u.ai_prompt).trim());
    const words = prompts.map((p) => p.split(/\s+/).length);

    // Truncation needs the bot's fixed suffix stripped first. With too few
    // samples the derived suffix is unreliable, so report length only.
    const suffix = longestCommonSuffix(prompts);
    let trunc = 0;
    let checked = 0;
    if (prompts.length >= 3 && suffix.length >= 15) {
      for (let i = 0; i < prompts.length; i++) {
        const mid = prompts[i]
          .slice(0, prompts[i].length - suffix.length)
          .trim()
          .replace(/,$/, '')
          .trim();
        checked++;
        if (/-$/.test(mid) || DANGLING.test(mid)) {
          trunc++;
          if (samples.length < 12) {
            samples.push(`[${bot}/${ups[i].seed_source?.path || '?'}] …${mid.slice(-62)}`);
          }
        }
      }
    }
    fleetTrunc += trunc;
    fleetChecked += checked;

    const sorted = words.slice().sort((a, b) => a - b);
    report.push({
      bot,
      n: words.length,
      med: median(words),
      p90: sorted[Math.floor(sorted.length * 0.9)],
      max: sorted[sorted.length - 1],
      long: words.filter((w) => w > LONG_WORDS).length,
      trunc,
      checked,
    });
  }

  report.sort((a, b) => b.med - a.med);

  console.log(`\nBot prompt health — ${rows.length} renders across ${report.length} bots`);
  console.log(
    `Reference: fleet median is ~250 words. A ~${LONG_WORDS}+ word prompt starts losing its tail;\n` +
      `at ~600 words only the first third renders, and the dropped content is still IN the prompt.\n`
  );
  console.log('bot              n   median   p90    max   >350w        truncated');
  for (const r of report) {
    const lenFlag = r.med > LONG_WORDS ? ' ←── OVER-LENGTH' : r.med > 250 ? ' ← borderline' : '';
    const tr = r.checked ? `${r.trunc}/${r.checked} (${pct(r.trunc, r.checked)}%)` : '(n/a)';
    console.log(
      `${r.bot.padEnd(14)}${String(r.n).padStart(4)}${String(r.med).padStart(8)}` +
        `${String(r.p90).padStart(7)}${String(r.max).padStart(7)}${String(r.long).padStart(7)}` +
        `${tr.padStart(17)}${lenFlag}`
    );
  }

  const allWords = rows.map((r) => String(r.ai_prompt).trim().split(/\s+/).length);
  console.log(
    `\nFLEET  median ${median(allWords)} words | ` +
      `${allWords.filter((w) => w > LONG_WORDS).length}/${allWords.length} ` +
      `(${pct(allWords.filter((w) => w > LONG_WORDS).length, allWords.length)}%) over ${LONG_WORDS} words | ` +
      `truncated ${fleetTrunc}/${fleetChecked} (${pct(fleetTrunc, fleetChecked)}%)`
  );

  if (SHOW_SAMPLES && samples.length) {
    console.log('\nTruncation samples (the model\'s own text, last chars before the fixed suffix):');
    samples.forEach((s) => console.log('  ' + s));
  }

  if (fleetTrunc > 0) {
    console.log(
      `\n⚠️  ${fleetTrunc} truncated prompts. Raise BRIEF_MAX_TOKENS in scripts/lib/botEngine.js,\n` +
        `    or shorten the offending brief. Re-run with --samples to see the cut points.\n` +
        `    New renders also stamp bot_run_log.sonnet_truncated (migration 545).`
    );
  }
  const over = report.filter((r) => r.med > LONG_WORDS);
  if (over.length) {
    console.log(
      `\n⚠️  OVER-LENGTH: ${over.map((r) => `${r.bot} (median ${r.med})`).join(', ')}.\n` +
        `    Most of those prompts' back half is not rendering. The lever is DELETING template\n` +
        `    prose and output-order items — adding a word cap only re-orders the output.`
    );
  }
  process.exit(0);
})().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
