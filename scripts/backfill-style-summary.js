#!/usr/bin/env node
/**
 * backfill-style-summary.js — populate uploads.style_summary for all
 * publicly-viewable posts that don't have one yet.
 *
 * Plan C migration. Calls Haiku once per row to extract a subject-stripped
 * style fingerprint from the existing ai_prompt, then updates the row.
 * Idempotent + resumable — re-running picks up wherever it left off.
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

// ── Config ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN = !args.includes('--execute');
const LIMIT = parseInt(getArg('--limit', ''), 10) || null; // null = all
const BATCH_SIZE = parseInt(getArg('--batch', '5'), 10);
const BATCH_GAP_MS = parseInt(getArg('--gap', '1000'), 10);
const HAIKU_MODEL = 'claude-haiku-4-5-20251001';

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

// ── Distiller (mirrors _shared/styleDistiller.ts) ─────────────────────

const SYSTEM_PROMPT = `You extract pure style descriptors from a Flux AI prompt.

OUTPUT: a comma-separated list of style descriptors. Max 25 words total.

KEEP: color words, palette, light direction/quality/temperature, camera/lens descriptors, medium-and-technique words ("oil paint", "heavy ink", "watercolor washes", "pixel art", "claymation"), atmosphere/mood words ("haunting", "luminous", "moody", "dreamy"), texture words, time-of-day if it's about LIGHT not subject ("golden hour", "blue hour"), abstract era/genre style descriptors ("baroque", "art deco", "noir") IF they describe the technique not the subject.

STRIP COMPLETELY: subjects (people, animals, creatures, objects, vehicles, weapons), body parts, named characters, named places, named IP/franchises (Castlevania, Blade Runner, Bloodborne, Studio Ghibli, etc — convert to generic mood words instead, e.g. "Castlevania" → "gothic horror mood"), specific buildings ("cathedral", "castle", "tower" — DROP unless it's purely architectural style language), clothing items, actions/poses, body language, named tech ("light saber", "iPhone"), specific numbers, named events, pets, dates, anything a camera would see as a "thing" rather than a "quality."

If the prompt is too thin to extract style (e.g., 10 words of pure subject with no style language), output exactly: NO_STYLE_SIGNAL

Do NOT add a preamble. Do NOT wrap in quotes. Output the comma-separated descriptors only.`;

async function distill(rawPrompt) {
  if (!rawPrompt || !rawPrompt.trim()) return null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: HAIKU_MODEL,
          max_tokens: 80,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: rawPrompt }],
        }),
      });
      if (!res.ok) {
        if ([429, 500, 502, 503, 504, 529].includes(res.status) && attempt < 2) {
          await sleep(2000 * (attempt + 1));
          continue;
        }
        return null;
      }
      const data = await res.json();
      const text = (data?.content?.[0]?.text ?? '').trim();
      if (!text || text.startsWith('NO_STYLE_SIGNAL')) return null;
      return text.length > 280 ? text.slice(0, 280) : text;
    } catch (err) {
      if (attempt < 2) {
        await sleep(2000 * (attempt + 1));
        continue;
      }
      return null;
    }
  }
  return null;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log('━━━ backfill-style-summary ━━━');
  console.log(`  DRY_RUN     : ${DRY_RUN}`);
  console.log(`  LIMIT       : ${LIMIT ?? 'all'}`);
  console.log(`  BATCH_SIZE  : ${BATCH_SIZE}`);
  console.log(`  BATCH_GAP_MS: ${BATCH_GAP_MS}`);
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
      .select('id, ai_prompt, created_at')
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
      data.slice(0, 2).forEach((r) =>
        console.log(`  ${r.id.slice(0, 8)} @ ${r.created_at} — "${r.ai_prompt.slice(0, 80)}..."`)
      );
      processed += data.length;
      cursor = data[data.length - 1].created_at;
      if (LIMIT && processed >= LIMIT) break;
      continue;
    }

    const results = await Promise.all(
      data.map(async (row) => {
        try {
          const summary = await distill(row.ai_prompt);
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
