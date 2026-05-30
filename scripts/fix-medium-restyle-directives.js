#!/usr/bin/env node
/**
 * One-shot DB fix for the medium-restyle audit (2026-05-29):
 *
 *   1. hyperreal.kontext_directive is null → restyle currently falls back to
 *      `directive` which is a NATURE-photography directive. User portraits
 *      get turned into nature shots. Write a proper hyperreal-PORTRAIT
 *      restyle directive.
 *
 *   2. None of the active user-pickable kontext_directives carry explicit
 *      gender-lock language. CLAUDE.md's April-2026 Twilight incident
 *      documents the failure mode: Kontext defaults to "young woman in
 *      dress" regardless of input subject when only soft identity language
 *      like "preserve likeness" is present. Append the standard gender-lock
 *      paragraph to every kontext_directive except hyperreal (just
 *      rewritten) and lego (the flux_dev_prompt_template path already
 *      handles gender via "Match gender with hair piece").
 *
 *   3. vinyl uses flux_dev_prompt_template too (same path as lego) — add
 *      a one-line gender-match instruction to its template.
 *
 * No Edge Function redeploy needed — restyle reads from DB on every request.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = Object.fromEntries(
  fs
    .readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', env.SUPABASE_SERVICE_ROLE_KEY);

const HYPERREAL_KONTEXT_DIRECTIVE = `Transform this image into a museum-quality hyperreal editorial photograph in the tradition of Annie Leibovitz, Peter Lindbergh, and Steve McCurry. Skin becomes natural luminous tones with flattering soft lighting and gentle highlight rolloff — features rendered beautifully, never harsh. Hair becomes shaped detail with crisp catchlights. Clothing becomes well-lit fabric with rich tactile texture. Background becomes a beautifully lit environment with saturated true colors pushed just slightly past reality so the world looks more beautiful than it actually is — but believably so, not surreal. The image should feel like a magazine cover photograph with that hint of "too pretty to be real" that comes from perfect timing + perfect light + perfect composition. NOT cartoon, NOT illustration, NOT painted, NOT watercolor, NOT 3D CGI render, NOT video game graphics. CRITICAL — preserve identity: keep the person's exact face, gender, skin tone, age, and core features. Male subjects stay male with masculine features and clothing. Female subjects stay female. NEVER change their gender. NEVER put a male subject in a dress, gown, skirt, corset, or feminine bodice. Keep the exact composition, subjects, and likeness.`;

const GENDER_LOCK_PARAGRAPH = ` CRITICAL — preserve identity: keep the person's exact face, gender, skin tone, age, and core features. Male subjects stay male with masculine features and clothing. Female subjects stay female. NEVER change their gender. NEVER put a male subject in a dress, gown, skirt, corset, or feminine bodice.`;

// Append this short line to vinyl's flux_dev_prompt_template (just above the
// closing "Output ONLY the prompt." line). Mirrors lego's "Match gender with
// hair piece."
const VINYL_GENDER_LINE = `- Match gender exactly to the photo description — male subjects render with masculine Funko features (square jawline, masculine hair piece, masculine clothing); female with feminine. Never change gender.`;

async function main() {
  // Pull every active user-pickable medium so we can audit + decide per row.
  const { data: mediums, error } = await sb
    .from('dream_mediums')
    .select('key,label,kontext_directive,flux_dev_prompt_template')
    .eq('is_active', true)
    .eq('is_bot_only', false)
    .order('sort_order');
  if (error) throw error;

  console.log(`Found ${mediums.length} active user-pickable mediums.\n`);

  let updates = 0;

  for (const m of mediums) {
    // ── hyperreal: full kontext_directive rewrite ──
    if (m.key === 'hyperreal') {
      console.log(`[hyperreal] rewriting kontext_directive (was null)...`);
      const { error: e } = await sb
        .from('dream_mediums')
        .update({ kontext_directive: HYPERREAL_KONTEXT_DIRECTIVE })
        .eq('key', m.key);
      if (e) {
        console.error(`  ✗ failed: ${e.message}`);
        continue;
      }
      console.log(`  ✓ written (${HYPERREAL_KONTEXT_DIRECTIVE.length} chars)`);
      updates++;
      continue;
    }

    // ── lego: skip (flux_dev path, already has "Match gender with hair piece") ──
    if (m.key === 'lego') {
      console.log(`[lego] skipping — flux_dev path, already handles gender.`);
      continue;
    }

    // ── vinyl: amend flux_dev_prompt_template with explicit gender line ──
    if (m.key === 'vinyl') {
      const tpl = m.flux_dev_prompt_template || '';
      if (tpl.includes('Match gender')) {
        console.log(`[vinyl] skipping — flux_dev_prompt_template already has gender line.`);
        continue;
      }
      // Insert just above the "Output ONLY the prompt." closing line.
      const marker = 'Output ONLY the prompt.';
      if (!tpl.includes(marker)) {
        console.error(`[vinyl] could NOT find "${marker}" anchor — skipping to avoid corruption.`);
        continue;
      }
      const updated = tpl.replace(marker, `${VINYL_GENDER_LINE}\n${marker}`);
      console.log(`[vinyl] amending flux_dev_prompt_template with gender line...`);
      const { error: e } = await sb
        .from('dream_mediums')
        .update({ flux_dev_prompt_template: updated })
        .eq('key', m.key);
      if (e) {
        console.error(`  ✗ failed: ${e.message}`);
        continue;
      }
      console.log(`  ✓ amended`);
      updates++;
      continue;
    }

    // ── everything else: append gender-lock to kontext_directive ──
    const kd = m.kontext_directive;
    if (!kd) {
      console.log(`[${m.key}] WARN — no kontext_directive set; skipping. (Already flagged hyperreal; any new occurrence here is a new bug.)`);
      continue;
    }
    if (kd.includes('Male subjects stay male')) {
      console.log(`[${m.key}] already has gender-lock — skipping.`);
      continue;
    }
    const updated = kd.trimEnd() + GENDER_LOCK_PARAGRAPH;
    const { error: e } = await sb
      .from('dream_mediums')
      .update({ kontext_directive: updated })
      .eq('key', m.key);
    if (e) {
      console.error(`[${m.key}] ✗ ${e.message}`);
      continue;
    }
    console.log(`[${m.key}] ✓ gender-lock appended (${kd.length} → ${updated.length} chars)`);
    updates++;
  }

  console.log(`\nDone. ${updates} rows updated.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
