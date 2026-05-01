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

const SYSTEM_PROMPT = `You synthesize a unified style fingerprint from three sources that together defined a rendered image: a MEDIUM (art style identity), a VIBE (mood identity), and the final FLUX PROMPT used by the image model.

The fingerprint is used by a "Dream Like This" feature — when a user taps a post they love, your output is fed to the image model alongside their NEW subject prompt. The user wants to FAITHFULLY RECREATE the look of the original post applied to whatever they're dreaming about now.

So: your job is to capture HOW the source image looked — palette, lighting, technique, mood, character-design conventions, named aesthetics — while removing the specific subjects-in-the-scene (which would replace the user's new subject and ruin the recreation).

OUTPUT FORMAT: a comma-separated list, max 35 words. Lead with the most distinctive style anchors. Be specific. The more vivid the style language, the better the recreation.

KEEP (these define the LOOK and should be preserved):
- Medium / technique words: "watercolor washes", "oil paint", "heavy ink", "pixel art", "claymation", "3D render", "ray-traced", "cel-shaded"
- Named aesthetics and references: "Tim Burton aesthetic", "Studio Ghibli", "Pixar character design", "Wes Anderson", "Bauhaus", "Art Deco", "Bloodborne dread", "Castlevania energy", "Moebius linework" — these are STYLE SHORTHAND
- Stylistic body/figure language: "spindly elongated proportions", "exaggerated facial features", "anime-large eyes", "pale gothic skin tones", "dark sunken eye sockets", "Disney princess proportions" — these describe HOW figures are drawn
- Color palette, light direction/quality/temperature
- Camera/lens descriptors, depth of field, color grading
- Atmosphere and mood words
- Texture and material language
- Era/genre style descriptors

STRIP (these are the SUBJECT — what the source image was OF):
- Specific creatures and beings IN the scene: "vampire", "dragon", "T-rex", "warrior", "mermaid", "robot"
- Specific buildings/structures: "cathedral", "castle", "tower", "mall", "diner"
- Specific named places, objects, vehicles, weapons, animals-as-pets, plants-as-subjects, food
- Actions/poses: "running", "kissing", "holding"
- Specific named characters/IP-figures (distinct from named-aesthetic references)

The key distinction: if removing it changes WHAT the picture is OF, strip it. If removing it changes HOW the picture LOOKS, keep it.

WEIGHT THE MEDIUM AND VIBE: even if the FLUX PROMPT's language is light on them, anchor the fingerprint in the medium and vibe character.

If all three sources are too thin to extract any meaningful style, output exactly: NO_STYLE_SIGNAL

Output the comma-separated descriptors only. No preamble. No quotes. No labels.`;

// Cache directives so we don't refetch them per row. Loaded once at startup.
const directiveCache = { mediums: new Map(), vibes: new Map() };
async function loadDirectives() {
  const [m, v] = await Promise.all([
    sb.from('dream_mediums').select('key, directive'),
    sb.from('dream_vibes').select('key, directive'),
  ]);
  (m.data || []).forEach((r) => directiveCache.mediums.set(r.key, r.directive));
  (v.data || []).forEach((r) => directiveCache.vibes.set(r.key, r.directive));
  console.log(
    `Loaded ${directiveCache.mediums.size} mediums, ${directiveCache.vibes.size} vibes from DB`
  );
}

function truncateDirective(d) {
  if (!d) return null;
  const cleaned = d.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= 400) return cleaned;
  return cleaned.slice(0, 400).replace(/\s+\S*$/, '') + '…';
}

async function distill({ rawPrompt, mediumKey, vibeKey }) {
  if (!rawPrompt?.trim() && !mediumKey && !vibeKey) return null;
  const mediumDir = mediumKey ? truncateDirective(directiveCache.mediums.get(mediumKey)) : null;
  const vibeDir = vibeKey ? truncateDirective(directiveCache.vibes.get(vibeKey)) : null;
  const mediumLine = mediumDir ? `${mediumKey} (${mediumDir})` : mediumKey || '(none)';
  const vibeLine = vibeDir ? `${vibeKey} (${vibeDir})` : vibeKey || '(none)';
  const promptLine = rawPrompt?.trim() || '(none)';
  const userMessage = `MEDIUM: ${mediumLine}\nVIBE: ${vibeLine}\nFLUX PROMPT: "${promptLine}"`;

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
          max_tokens: 100,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
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
      return text.length > 320 ? text.slice(0, 320) : text;
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

  await loadDirectives();
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
        const summary = await distill({
          rawPrompt: r.ai_prompt,
          mediumKey: r.dream_medium,
          vibeKey: r.dream_vibe,
        });
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
          const summary = await distill({
            rawPrompt: row.ai_prompt,
            mediumKey: row.dream_medium,
            vibeKey: row.dream_vibe,
          });
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
