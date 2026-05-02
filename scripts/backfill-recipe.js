#!/usr/bin/env node
/**
 * backfill-recipe.js — retroactively populate uploads.recipe for old bot
 * posts so DLT-replay works against any post in the feed (not just newly-
 * rendered ones).
 *
 * Strategy: for each bot post that has NULL recipe, synthesize a sparse
 * recipe by reading the bot's CURRENT config (mediumStyles, promptPrefix,
 * promptSuffix, pools.VIBE_COLOR) + the upload row's dream_medium /
 * dream_vibe / ai_prompt. Load-bearing fields (medium_key, vibe_key,
 * medium_style_override) reproduce; non-recoverable fields (camera,
 * lighting, palette, chaos_block, sensory_block, flux_seed) stay null.
 *
 * DLT-replay locks medium identity from medium_key + medium_style_override.
 * Sparse but functional. Missing atmospheric blocks just mean DLT may not
 * reproduce the source's exact lighting/palette particulars — but the
 * MEDIUM identity reproduces, which is the load-bearing fix.
 *
 * See docs/DLT_BACKFILL_PLAN.md for full algorithm, safety analysis, and
 * acceptance criteria.
 *
 * Safety:
 *   - Dry-run by default; --execute required to write
 *   - Per-row UPDATEs (never bulk SQL); per-row try/catch
 *   - Idempotent (recipe IS NULL filter; never overwrites)
 *   - _backfilled_at marker in every recipe → revert is one SQL statement
 *   - Config-drift detection (skipped by default; opt in via --allow-drift)
 *   - Throttled (default 25/batch, 500ms sleep)
 *   - Scope: only user_id IN (bot user IDs). User posts are NEVER touched.
 *
 * Usage:
 *   node scripts/backfill-recipe.js                              # dry-run all
 *   node scripts/backfill-recipe.js --limit 10                    # dry-run slice
 *   node scripts/backfill-recipe.js --bot cuddlebot               # filter to one bot
 *   node scripts/backfill-recipe.js --execute --limit 5           # write 5 rows
 *   node scripts/backfill-recipe.js --execute                     # full run
 *   node scripts/backfill-recipe.js --execute --allow-drift       # include drifted
 *   node scripts/backfill-recipe.js --execute --batch 25 --gap 500
 *
 * Revert (if needed):
 *   UPDATE uploads SET recipe = NULL WHERE recipe->>'_backfilled_at' IS NOT NULL;
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ── CLI args ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
function getArg(flag, fallback) {
  const idx = args.indexOf(flag);
  if (idx >= 0 && idx + 1 < args.length && !args[idx + 1].startsWith('--')) {
    return args[idx + 1];
  }
  return fallback;
}
const DRY_RUN = !args.includes('--execute');
const LIMIT = parseInt(getArg('--limit', ''), 10) || null;
const FILTER_BOT = getArg('--bot', null);
const ALLOW_DRIFT = args.includes('--allow-drift');
const USERS_ONLY = args.includes('--users-only');
const BATCH_SIZE = parseInt(getArg('--batch', '25'), 10);
const BATCH_GAP_MS = parseInt(getArg('--gap', '500'), 10);

const RECIPE_VERSION = 1;
const BACKFILL_VERSION = '1';
const MIN_CREATED_AT = '2026-04-15'; // skip pre-bot-engine-V2 era

// ── env ──────────────────────────────────────────────────────────────────

function readEnv() {
  try {
    const env = {};
    const text = fs.readFileSync('.env.local', 'utf8');
    for (const line of text.split('\n')) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const ENV = readEnv();
const SUPABASE_URL =
  process.env.SUPABASE_URL || ENV.SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY (in env or .env.local)');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Bot module loader ────────────────────────────────────────────────────

function loadBots() {
  const botsDir = path.resolve(__dirname, 'bots');
  const bots = {};
  if (!fs.existsSync(botsDir)) {
    console.error(`bots dir not found: ${botsDir}`);
    process.exit(1);
  }
  for (const name of fs.readdirSync(botsDir)) {
    const indexPath = path.join(botsDir, name, 'index.js');
    if (!fs.existsSync(indexPath)) continue;
    try {
      // Clear cache so a re-run with edited bot config picks up changes
      delete require.cache[require.resolve(indexPath)];
      const bot = require(indexPath);
      if (!bot || typeof bot !== 'object' || !bot.username) continue;
      bots[bot.username] = { module: bot, dir: name };
    } catch (err) {
      console.warn(`  ⚠️ failed to load bot ${name}: ${err.message}`);
    }
  }
  return bots;
}

// ── Color palette lookup (best-effort from bot's pools.js) ───────────────

function lookupColorPalette(botDir, vibeKey) {
  if (!vibeKey) return '';
  try {
    const poolsPath = path.resolve(__dirname, 'bots', botDir, 'pools.js');
    if (!fs.existsSync(poolsPath)) return '';
    delete require.cache[require.resolve(poolsPath)];
    const pools = require(poolsPath);
    if (pools && pools.VIBE_COLOR && typeof pools.VIBE_COLOR === 'object') {
      return pools.VIBE_COLOR[vibeKey] || '';
    }
    return '';
  } catch {
    return '';
  }
}

// ── Recipe synthesis ─────────────────────────────────────────────────────

function synthesizeRecipe({ row, bot, botDir, modelOverride }) {
  const medium = row.dream_medium;
  const vibe = row.dream_vibe;

  // Re-resolve from CURRENT bot config — same precedence the live engine uses
  const mediumStyleOverride = (bot.mediumStyles && bot.mediumStyles[medium]) || '';
  const promptPrefix =
    (bot.promptPrefixByMedium && bot.promptPrefixByMedium[medium]) || bot.promptPrefix || '';
  const promptSuffix =
    (bot.promptSuffixByMedium && bot.promptSuffixByMedium[medium]) || bot.promptSuffix || '';
  const colorPalette = lookupColorPalette(botDir, vibe);

  // Drift detection — if the current mediumStyleOverride doesn't appear in
  // the original ai_prompt, the bot's config has changed since this post
  // was rendered. Default behavior is to skip the row; --allow-drift opts
  // in and stamps a marker.
  let driftDetected = false;
  if (mediumStyleOverride.length > 30) {
    const probe = mediumStyleOverride.slice(0, 60);
    if (!row.ai_prompt.includes(probe)) {
      driftDetected = true;
    }
  }

  const recipe = {
    version: RECIPE_VERSION,

    // LOOK anchors
    model: modelOverride || 'black-forest-labs/flux-dev',
    flux_seed: null,
    medium_key: medium,
    vibe_key: vibe,
    prompt_prefix: promptPrefix,
    medium_style_override: mediumStyleOverride,
    prompt_suffix: promptSuffix,
    camera: null,
    lighting: '',
    scene_palette: '',
    color_palette: colorPalette,
    chaos_block: null,
    sensory_block: null,
    blow_it_up_block: null,

    // Provenance
    bot_username: bot.username,
    path: null,
    ai_prompt: row.ai_prompt,

    // Backfill markers (enables revert + audit)
    _backfilled_at: new Date().toISOString(),
    _backfill_version: BACKFILL_VERSION,
    ...(driftDetected ? { _backfill_status: 'config_drift' } : {}),
  };

  return { recipe, driftDetected };
}

// ── Main ─────────────────────────────────────────────────────────────────

// ── Sparse user-post recipe synthesis ────────────────────────────────────
// For user-generated posts: no bot config to draw from. We just capture
// the load-bearing fields (medium_key, vibe_key, ai_prompt, model). DLT
// replay will lock medium_key → resolveMediumFromDb pulls the directive
// fresh from dream_mediums at DLT time. Sparse but functional.
function synthesizeUserRecipe({ row, modelOverride }) {
  return {
    version: RECIPE_VERSION,
    model: modelOverride || 'black-forest-labs/flux-dev',
    flux_seed: null,
    medium_key: row.dream_medium,
    vibe_key: row.dream_vibe,
    prompt_prefix: '',
    medium_style_override: '',
    prompt_suffix: '',
    camera: null,
    lighting: '',
    scene_palette: '',
    color_palette: '',
    chaos_block: null,
    sensory_block: null,
    blow_it_up_block: null,
    bot_username: null,
    path: null,
    ai_prompt: row.ai_prompt,
    _backfilled_at: new Date().toISOString(),
    _backfill_version: BACKFILL_VERSION,
    _backfill_source: 'user',
  };
}

async function main() {
  console.log('━━━ DLT recipe backfill ━━━');
  console.log(`  MODE        : ${USERS_ONLY ? 'USER POSTS' : 'BOT POSTS'}`);
  console.log(`  DRY_RUN     : ${DRY_RUN}`);
  console.log(`  LIMIT       : ${LIMIT ?? 'all'}`);
  console.log(`  FILTER_BOT  : ${FILTER_BOT ?? 'all'}`);
  console.log(`  ALLOW_DRIFT : ${ALLOW_DRIFT}`);
  console.log(`  BATCH_SIZE  : ${BATCH_SIZE}`);
  console.log(`  BATCH_GAP_MS: ${BATCH_GAP_MS}`);
  console.log(`  MIN_CREATED : ${MIN_CREATED_AT}`);
  console.log('');

  // Sanity: recipe column exists
  const { error: colErr } = await sb.from('uploads').select('recipe').limit(0);
  if (colErr) {
    console.error('ERROR: uploads.recipe column missing — run migration 144 first');
    console.error(`  detail: ${colErr.message}`);
    process.exit(1);
  }

  // ── USERS-ONLY MODE — sparse synthesis from upload row alone ──────
  // No bot config needed; we just lock medium_key + vibe_key + ai_prompt.
  // resolveMediumFromDb at DLT time pulls the directive fresh from
  // dream_mediums. medium_style_override stays empty (V4 user posts don't
  // use one). Functional for DLT, lower fidelity than bot-side recipes.
  if (USERS_ONLY) {
    console.log('[1/3] Resolving bot user IDs (to EXCLUDE them)...');
    const bots = loadBots();
    const botUsernames = Object.keys(bots);
    const botUserIds = [];
    for (const username of botUsernames) {
      const { data } = await sb
        .from('users')
        .select('id')
        .ilike('username', username)
        .maybeSingle();
      if (data) botUserIds.push(data.id);
    }
    console.log(`  excluding ${botUserIds.length} bot user IDs`);

    console.log('\n[2/3] Counting candidate user posts...');
    let countQ = sb
      .from('uploads')
      .select('id', { count: 'exact', head: true })
      .is('recipe', null)
      .not('ai_prompt', 'is', null)
      .not('dream_medium', 'is', null)
      .not('dream_vibe', 'is', null)
      .eq('is_ai_generated', true);
    if (botUserIds.length > 0) {
      countQ = countQ.not('user_id', 'in', `(${botUserIds.join(',')})`);
    }
    const { count: totalUserCount } = await countQ;
    const todoUserCount = LIMIT ? Math.min(LIMIT, totalUserCount || 0) : totalUserCount || 0;
    console.log(`  ${todoUserCount} user posts to process (total candidates: ${totalUserCount})`);
    if (todoUserCount === 0) {
      console.log('\nNothing to backfill.');
      return;
    }

    console.log(`\n[3/3] ${DRY_RUN ? 'Dry-running' : 'Executing'} user-post backfill (streaming)...`);
    const PAGE_SIZE = 200;
    let uProcessed = 0;
    let uUpdated = 0;
    let uErrored = 0;
    let uDryShown = 0;
    let uCursor = null;
    while (uProcessed < todoUserCount) {
      const remain = todoUserCount - uProcessed;
      const pageSize = Math.min(PAGE_SIZE, remain);
      let q = sb
        .from('uploads')
        .select('id, user_id, dream_medium, dream_vibe, ai_prompt, created_at')
        .is('recipe', null)
        .not('ai_prompt', 'is', null)
        .not('dream_medium', 'is', null)
        .not('dream_vibe', 'is', null)
        .eq('is_ai_generated', true)
        .order('created_at', { ascending: false })
        .limit(pageSize);
      if (botUserIds.length > 0) q = q.not('user_id', 'in', `(${botUserIds.join(',')})`);
      if (uCursor) q = q.lt('created_at', uCursor);
      const { data: page, error: rowErr } = await q;
      if (rowErr) {
        console.error(`uploads query failed: ${rowErr.message}`);
        process.exit(1);
      }
      if (!page || page.length === 0) break;

      for (let i = 0; i < page.length; i += BATCH_SIZE) {
        const batch = page.slice(i, i + BATCH_SIZE);
        for (const row of batch) {
          uProcessed++;
          try {
            const recipe = synthesizeUserRecipe({ row });
            if (DRY_RUN) {
              if (uDryShown < 5) {
                console.log(
                  `\n    ${row.id.slice(0, 8)}  user=${row.user_id.slice(0, 8)}  medium=${row.dream_medium}  vibe=${row.dream_vibe}`
                );
                console.log(`      ai_prompt: ${row.ai_prompt.slice(0, 100)}...`);
                uDryShown++;
              }
              continue;
            }
            const { error: updErr } = await sb
              .from('uploads')
              .update({ recipe })
              .eq('id', row.id);
            if (updErr) {
              console.warn(`  ✗ ${row.id.slice(0, 8)} ${updErr.message}`);
              uErrored++;
            } else {
              uUpdated++;
              if (uUpdated % 100 === 0) {
                process.stdout.write(`\r  ✓ ${uUpdated}/${todoUserCount} updated...`);
              }
            }
          } catch (err) {
            console.warn(`  ✗ ${row.id.slice(0, 8)} ${err.message}`);
            uErrored++;
          }
        }
        if (i + BATCH_SIZE < page.length) await sleep(BATCH_GAP_MS);
      }
      uCursor = page[page.length - 1].created_at;
      if (page.length < pageSize) break;
    }

    console.log('\n\n━━━ DONE (users-only) ━━━');
    console.log(`  Processed: ${uProcessed}`);
    console.log(`  Updated:   ${uUpdated}`);
    console.log(`  Errored:   ${uErrored}`);
    if (DRY_RUN) console.log('\n(Dry-run complete. Re-run with --execute.)');
    else
      console.log(
        `\n  To revert user-side: UPDATE uploads SET recipe = NULL WHERE recipe->>'_backfill_source' = 'user';`
      );
    return;
  }

  // [1/4] Load bots
  console.log('[1/4] Loading bot modules...');
  const bots = loadBots();
  const botUsernames = Object.keys(bots);
  if (botUsernames.length === 0) {
    console.error('No bots found in scripts/bots/*/index.js');
    process.exit(1);
  }
  console.log(`  loaded ${botUsernames.length} bots: ${botUsernames.join(', ')}`);

  // [2/4] Resolve bot user IDs (per-bot ilike — DB stores PascalCase but
  // bot configs use lowercase; .in() is case-sensitive so we look up each
  // bot individually with ilike, matching live botEngine.lookupBotUserId).
  console.log('\n[2/4] Resolving bot user IDs...');
  const userIdToBot = {}; // user_id → { module, dir, username, lookupName }
  const userRows = []; // for FILTER_BOT
  for (const username of botUsernames) {
    const { data, error } = await sb
      .from('users')
      .select('id, username')
      .ilike('username', username)
      .maybeSingle();
    if (error) {
      console.warn(`  ⚠️ users lookup failed for ${username}: ${error.message}`);
      continue;
    }
    if (!data) continue;
    userIdToBot[data.id] = {
      ...bots[username],
      username,
      lookupName: data.username, // PascalCase form from DB
    };
    userRows.push({ id: data.id, username: data.username, lookupName: username });
  }
  console.log(`  matched ${Object.keys(userIdToBot).length} bot users`);

  if (FILTER_BOT) {
    const filterRow = userRows.find(
      (u) => u.lookupName.toLowerCase() === FILTER_BOT.toLowerCase()
    );
    if (!filterRow) {
      console.error(`--bot ${FILTER_BOT} not found in users table`);
      process.exit(1);
    }
    for (const id of Object.keys(userIdToBot)) {
      if (id !== filterRow.id) delete userIdToBot[id];
    }
    console.log(`  filtered to bot: ${FILTER_BOT} (user_id=${filterRow.id})`);
  }
  const targetUserIds = Object.keys(userIdToBot);
  if (targetUserIds.length === 0) {
    console.error('No bot user IDs resolved — nothing to do');
    process.exit(0);
  }

  // [3/4] Pre-flight: count candidates (lightweight) for status display
  console.log('\n[3/4] Counting candidate rows...');
  const { count: totalCount } = await sb
    .from('uploads')
    .select('id', { count: 'exact', head: true })
    .in('user_id', targetUserIds)
    .is('recipe', null)
    .not('ai_prompt', 'is', null)
    .not('dream_medium', 'is', null)
    .not('dream_vibe', 'is', null)
    .gte('created_at', MIN_CREATED_AT);
  const todoCount = LIMIT ? Math.min(LIMIT, totalCount || 0) : totalCount || 0;
  console.log(`  ${todoCount} rows to process (total candidates: ${totalCount})`);

  if (todoCount === 0) {
    console.log('\nNothing to backfill.');
    return;
  }

  // [4/4] Stream-process pages — fetch a page, process it, free it, next page.
  // Avoids holding all rows in memory at once (5000+ rows × bot configs in
  // require.cache → multi-GB heap pressure).
  console.log(`\n[4/4] ${DRY_RUN ? 'Dry-running' : 'Executing'} backfill (streaming)...`);
  const PAGE_SIZE = 200; // smaller pages = lower peak memory
  let processed = 0;
  let updated = 0;
  let skippedDrift = 0;
  let skippedNoOverride = 0;
  let errored = 0;
  const driftSamples = [];
  let drySamplesShown = 0;
  let cursor = null;

  while (processed < todoCount) {
    const remaining = todoCount - processed;
    const pageSize = Math.min(PAGE_SIZE, remaining);
    let q = sb
      .from('uploads')
      .select('id, user_id, dream_medium, dream_vibe, ai_prompt, created_at')
      .in('user_id', targetUserIds)
      .is('recipe', null)
      .not('ai_prompt', 'is', null)
      .not('dream_medium', 'is', null)
      .not('dream_vibe', 'is', null)
      .gte('created_at', MIN_CREATED_AT)
      .order('created_at', { ascending: false })
      .limit(pageSize);
    if (cursor) q = q.lt('created_at', cursor);
    const { data: page, error: rowErr } = await q;
    if (rowErr) {
      console.error(`uploads query failed: ${rowErr.message}`);
      process.exit(1);
    }
    if (!page || page.length === 0) break;

    // Process this page
    for (let i = 0; i < page.length; i += BATCH_SIZE) {
      const batch = page.slice(i, i + BATCH_SIZE);
      for (const row of batch) {
        processed++;
        try {
          const b = userIdToBot[row.user_id];
          if (!b) {
            errored++;
            continue;
          }
          const { recipe, driftDetected } = synthesizeRecipe({
            row,
            bot: b.module,
            botDir: b.dir,
          });
          if (driftDetected) {
            if (driftSamples.length < 5) {
              driftSamples.push({ id: row.id, bot: b.username, medium: row.dream_medium });
            }
            if (!ALLOW_DRIFT) {
              skippedDrift++;
              continue;
            }
          }
          if (!recipe.medium_style_override && !recipe.prompt_prefix) {
            skippedNoOverride++;
            continue;
          }
          // Dry-run: print first 5 samples only, don't write
          if (DRY_RUN) {
            if (drySamplesShown < 5) {
              const trim = (s) => (s && s.length > 100 ? s.slice(0, 100) + '…' : s || '(empty)');
              console.log(
                `\n    ${row.id.slice(0, 8)}  ${b.username}  medium=${row.dream_medium}  vibe=${row.dream_vibe}  drift=${driftDetected}`
              );
              console.log(`      ai_prompt: ${row.ai_prompt.slice(0, 100)}...`);
              console.log(`      medium_style_override: ${trim(recipe.medium_style_override)}`);
              console.log(`      prompt_prefix:         ${trim(recipe.prompt_prefix)}`);
              console.log(`      color_palette:         ${trim(recipe.color_palette)}`);
              drySamplesShown++;
            }
            continue;
          }
          // Execute mode
          const { error: updErr } = await sb
            .from('uploads')
            .update({ recipe })
            .eq('id', row.id);
          if (updErr) {
            console.warn(`  ✗ ${row.id.slice(0, 8)} ${updErr.message}`);
            errored++;
          } else {
            updated++;
            if (updated % 100 === 0) {
              process.stdout.write(`\r  ✓ ${updated}/${todoCount} updated (${skippedDrift} drift skipped, ${errored} err)...`);
            }
          }
        } catch (err) {
          console.warn(`  ✗ ${row.id.slice(0, 8)} ${err.message}`);
          errored++;
        }
      }
      if (i + BATCH_SIZE < page.length) await sleep(BATCH_GAP_MS);
    }

    cursor = page[page.length - 1].created_at;
    if (page.length < pageSize) break;
  }

  console.log('\n\n━━━ DONE ━━━');
  console.log(`  Processed:           ${processed}`);
  console.log(`  Updated:             ${updated}`);
  console.log(`  Skipped (drift):     ${skippedDrift}`);
  console.log(`  Skipped (no anchor): ${skippedNoOverride}`);
  console.log(`  Errored:             ${errored}`);
  if (skippedDrift > 0 && driftSamples.length > 0) {
    console.log(`\n  Drift samples (config-drift detected):`);
    for (const s of driftSamples) {
      console.log(`    ${s.id.slice(0, 8)}  ${s.bot}  medium=${s.medium}`);
    }
    console.log(`  To include them with a 'config_drift' marker, re-run with --allow-drift.`);
  }
  if (DRY_RUN) {
    console.log('\n(Dry-run complete. Re-run with --execute to write.)');
  } else {
    console.log(
      `\n  To revert: UPDATE uploads SET recipe = NULL WHERE recipe->>'_backfilled_at' IS NOT NULL;`
    );
  }
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
