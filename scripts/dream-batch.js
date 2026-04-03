#!/usr/bin/env node
'use strict';

/**
 * dream-batch.js — Generate a batch of dreams and save results for analysis.
 *
 * Generates N dreams, persists images to Supabase Storage, saves all prompts
 * and metadata to a JSON file that Claude can analyze.
 *
 * Usage:
 *   node scripts/dream-batch.js 10                    # Generate 10 dreams
 *   node scripts/dream-batch.js 20 --persona 2        # 20 dreams as Cottagecore Girl
 *   node scripts/dream-batch.js 5 --download          # Also download images locally
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const envFile = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    if (!process.env[trimmed.slice(0, eq).trim()])
      process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const KEVIN_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const KEVIN_EMAIL = 'konakevin@gmail.com';
const KEVIN_PASS = '01hapanui';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const userClient = createClient(SUPABASE_URL, ANON_KEY);

const args = process.argv.slice(2);
const count = parseInt(args.find(a => !a.startsWith('--')) || '5', 10);
const shouldDownload = args.includes('--download');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (e) => { fs.unlink(dest, () => {}); reject(e); });
  });
}

async function main() {
  console.log(`\n🌙 Generating ${count} dreams...\n`);

  // Auth as Kevin
  const { data: auth, error: authErr } = await userClient.auth.signInWithPassword({
    email: KEVIN_EMAIL,
    password: KEVIN_PASS,
  });
  if (authErr) { console.error('Auth failed:', authErr.message); process.exit(1); }

  // Get Kevin's recipe
  const { data: recipeRow } = await supabase
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', KEVIN_ID)
    .single();

  const results = [];
  const outputDir = path.join(__dirname, 'dream-batch-output');
  if (shouldDownload) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (let i = 0; i < count; i++) {
    const t0 = Date.now();
    process.stdout.write(`  [${i + 1}/${count}] Dreaming...`);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-dream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.session.access_token}`,
          'apikey': ANON_KEY,
        },
        body: JSON.stringify({
          mode: 'flux-dev',
          recipe: recipeRow.recipe,
          persist: true, // Save to storage so URLs don't expire
        }),
      });

      const data = await res.json();
      const elapsed = Date.now() - t0;

      if (!data.image_url) {
        console.log(` ❌ ${data.error || 'no image'} (${elapsed}ms)`);
        continue;
      }

      // Post to uploads so it shows on profile
      await supabase.from('uploads').insert({
        user_id: KEVIN_ID,
        categories: ['art'],
        image_url: data.image_url,
        media_type: 'image',
        caption: null,
        is_ai_generated: true,
        ai_prompt: data.prompt_used,
        is_approved: true,
        is_active: true,
      });

      // Get the log entry
      const { data: logs } = await supabase
        .from('ai_generation_log')
        .select('enhanced_prompt, rolled_axes')
        .eq('user_id', KEVIN_ID)
        .order('created_at', { ascending: false })
        .limit(1);

      const log = logs?.[0];
      const axes = log?.rolled_axes || {};

      const result = {
        index: i + 1,
        image_url: data.image_url,
        prompt: data.prompt_used,
        mode: axes.dreamMode || 'unknown',
        archetype: axes.archetype || 'none',
        model: axes.model || 'unknown',
        medium: axes.medium || 'unknown',
        mood: axes.mood || 'unknown',
        interests: axes.interests || [],
        elapsed_ms: elapsed,
      };

      results.push(result);

      // Download image locally if requested
      if (shouldDownload) {
        const filename = `dream_${String(i + 1).padStart(3, '0')}_${axes.dreamMode || 'unknown'}.jpg`;
        const filepath = path.join(outputDir, filename);
        try {
          await downloadFile(data.image_url, filepath);
          result.local_file = filepath;
        } catch (e) {
          console.log(` (download failed: ${e.message})`);
        }
      }

      console.log(` ✅ ${axes.dreamMode}/${axes.archetype || 'none'} | ${axes.model?.split('/').pop()} | ${elapsed}ms`);

    } catch (e) {
      console.log(` ❌ ${e.message}`);
    }

    // Small delay between generations
    if (i < count - 1) await new Promise(r => setTimeout(r, 1000));
  }

  // Save results
  const outPath = path.join(__dirname, 'dream-batch-results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\n📊 Results saved to ${outPath}`);

  // Summary
  const modes = {};
  const models = {};
  const archetypes = {};
  for (const r of results) {
    modes[r.mode] = (modes[r.mode] || 0) + 1;
    models[r.model] = (models[r.model] || 0) + 1;
    if (r.archetype !== 'none') archetypes[r.archetype] = (archetypes[r.archetype] || 0) + 1;
  }

  console.log(`\n--- SUMMARY (${results.length} dreams) ---`);
  console.log('Modes:', JSON.stringify(modes));
  console.log('Models:', JSON.stringify(models));
  console.log('Top archetypes:', Object.entries(archetypes).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k}(${v})`).join(', '));
  console.log('Avg time:', Math.round(results.reduce((s, r) => s + r.elapsed_ms, 0) / results.length) + 'ms');

  if (shouldDownload) {
    console.log(`\nImages saved to ${outputDir}/`);
  }

  console.log('\n✅ Done!\n');
}

main().catch(console.error);
