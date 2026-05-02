#!/usr/bin/env node
/**
 * backfill-style-summary.js — populate uploads.style_summary for all
 * publicly-viewable posts that don't have one yet.
 *
 * Plan C migration. Uses the shared distiller (scripts/lib/styleDistiller.js,
 * which mirrors supabase/functions/_shared/styleDistiller.ts). Calls Haiku
 * once per row to extract a subject-stripped style fingerprint, then
 * updates the row. Idempotent + resumable.
 *
 * Throttling: processes BATCH_SIZE rows in parallel, then sleeps
 * BATCH_GAP_MS before the next batch. Defaults stay well under
 * Anthropic Tier 2 (4000 RPM = 67 RPS) — about 5 RPS sustained.
 *
 * Scope: rows where (is_posted=true OR is_active=true) AND
 *        style_summary IS NULL AND ai_prompt IS NOT NULL.
 *        Drafts/test posts are skipped per Kevin's spec.
 *
 * Usage:
 *   node scripts/backfill-style-summary.js              # dry-run preview
 *   node scripts/backfill-style-summary.js --execute    # actually update
 *   node scripts/backfill-style-summary.js --execute --limit 50
 *   node scripts/backfill-style-summary.js --execute --batch 5 --gap 1500
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const { distillStyle } = require('./lib/styleDistiller');

// ── Config ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN = !args.includes('--execute');
const LIMIT = parseInt(getArg('--limit', ''), 10) || null; // null = all
const BATCH_SIZE = parseInt(getArg('--batch', '5'), 10);
const BATCH_GAP_MS = parseInt(getArg('--gap', '1000'), 10);

function getArg(flag, fallback) {
  const idx = args.indexOf(flag);
  if (idx >= 0 && idx + 1 < args.length) return args[idx + 1];
  return fallback;
}

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const envFile = readEnvFile();
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || envFile.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || envFile.SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || envFile.ANTHROPIC_API_KEY;

if (!SERVICE_ROLE) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
if (!ANTHROPIC_KEY) {
  console.error('Missing ANTHROPIC_API_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log('━━━ backfill-style-summary ━━━');
  console.log(`  DRY_RUN     : ${DRY_RUN}`);
  console.log(`  LIMIT       : ${LIMIT ?? 'all'}`);
  console.log(`  BATCH_SIZE  : ${BATCH_SIZE}`);
  console.log(`  BATCH_GAP_MS: ${BATCH_GAP_MS}`);
  console.log('  Distiller   : scripts/lib/styleDistiller.js (shared with botEngine)');
  console.log('');

  let processed = 0;
  let updated = 0;
  let nullResults = 0;
  let errors = 0;
  let cursor = null;

  while (true) {
    const remaining = LIMIT ? LIMIT - processed : Infinity;
    if (remaining <= 0) break;
    const batchSize = Math.min(BATCH_SIZE, remaining);

    let q = sb
      .from('uploads')
      .select('id, ai_prompt, dream_medium, dream_vibe, created_at')
      .is('style_summary', null)
      .not('ai_prompt', 'is', null)
      .or('is_posted.eq.true,is_active.eq.true')
      .order('created_at', { ascending: true })
      .limit(batchSize);
    if (cursor) q = q.gt('created_at', cursor);

    const { data, error } = await q;
    if (error) {
      console.error('Query failed:', error.message);
      process.exit(1);
    }
    if (!data || data.length === 0) {
      console.log('\nNo more rows to process.');
      break;
    }

    if (DRY_RUN) {
      console.log(`[dry-run] would process batch of ${data.length}, sample:`);
      for (const r of data.slice(0, 5)) {
        const summary = await distillStyle(
          { rawPrompt: r.ai_prompt, mediumKey: r.dream_medium, vibeKey: r.dream_vibe },
          ANTHROPIC_KEY,
          sb
        );
        console.log(`\n  ${r.id.slice(0, 8)} (${r.dream_medium}/${r.dream_vibe})`);
        console.log(`    PROMPT: ${r.ai_prompt.slice(0, 100)}...`);
        console.log(`    STYLE:  ${summary ?? '(NO_STYLE_SIGNAL)'}`);
        await sleep(BATCH_GAP_MS / data.length);
      }
      processed += data.length;
      cursor = data[data.length - 1].created_at;
      if (LIMIT && processed >= LIMIT) break;
      continue;
    }

    const results = await Promise.all(
      data.map(async (row) => {
        try {
          const summary = await distillStyle(
            { rawPrompt: row.ai_prompt, mediumKey: row.dream_medium, vibeKey: row.dream_vibe },
            ANTHROPIC_KEY,
            sb
          );
          if (summary) {
            const { error: updErr } = await sb
              .from('uploads')
              .update({ style_summary: summary })
              .eq('id', row.id);
            if (updErr) {
              return { id: row.id, status: 'error', err: updErr.message };
            }
            return { id: row.id, status: 'updated', summary };
          }
          return { id: row.id, status: 'null' };
        } catch (err) {
          return { id: row.id, status: 'error', err: err.message };
        }
      })
    );

    for (const r of results) {
      processed++;
      if (r.status === 'updated') {
        updated++;
        console.log(`  ✓ ${r.id.slice(0, 8)} → ${r.summary.slice(0, 90)}`);
      } else if (r.status === 'null') {
        nullResults++;
      } else {
        errors++;
        console.warn(`  ✗ ${r.id.slice(0, 8)} ${r.err}`);
      }
    }
    cursor = data[data.length - 1].created_at;
    console.log(
      `  ── batch done. processed=${processed} updated=${updated} null=${nullResults} err=${errors}`
    );
    await sleep(BATCH_GAP_MS);
  }

  console.log('\n━━━ DONE ━━━');
  console.log(`  Processed:    ${processed}`);
  console.log(`  Updated:      ${updated}`);
  console.log(`  Null/skipped: ${nullResults}`);
  console.log(`  Errors:       ${errors}`);
  if (DRY_RUN) console.log('\n(Re-run with --execute to actually write.)');
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
