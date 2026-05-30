#!/usr/bin/env node
/**
 * Embodied medium cast-routing fix (2026-05-29 audit).
 *
 * The face-swap × {self, dual} verification matrix exposed a routing bug
 * in three embodied mediums:
 *
 *   animation, pixels, handcrafted
 *
 * All three had `character_render_mode: 'embodied'` BUT `is_character_only:
 * false`. The scene engine uses is_character_only to decide between the
 * character-composition path (cast person is the main subject) and the
 * scene-composition path (cast may be a scene accent or omitted entirely).
 *
 * Setting embodied=true on a medium classifies it as "medium IS the
 * character's body," but without is_character_only=true the engine still
 * routes to the scene path. Result: handcrafted × self rendered a yarn
 * teddy bear with no human; pixels × self rendered a pixel-art scene with
 * no character; animation × dual rendered the plus_one as a CHILD.
 *
 * The three passing embodied mediums (lego, vinyl, claymation) all carry
 * is_character_only=true. Aligning these three matches that pattern.
 *
 * Two changes per medium, both DB-only (restyle + scene engine read fresh):
 *
 *   1. UPDATE is_character_only = true
 *      Forces the character-composition path so the cast person becomes
 *      the main subject regardless of how the medium directive is written.
 *
 *   2. UPDATE directive — prepend a one-sentence HUMAN CHARACTERS mandate.
 *      Belt-and-suspenders for Sonnet's brief builder: even with the
 *      routing flag flipped, an explicit "render the cast person AS [this
 *      embodied form]" directive prevents the brief from drifting back
 *      into scene-rendering mode.
 *
 * Mirrors how LEGO's directive opens with "HUMAN CHARACTERS are classic
 * LEGO minifigures…" (the canonical pattern).
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

const MANDATES = {
  animation: `HUMAN CHARACTERS are stylized 3D-animated feature-film characters — Pixar/Disney/Dreamworks/Illumination polish — with huge expressive eyes, oversized heads, exaggerated proportions, animated facial expressions that radiate personality, soft subsurface-scattered skin, and impossibly cute features. Always render the main subject(s) AS the central animated character(s) — never as background figures in a scene.`,
  pixels: `HUMAN CHARACTERS are pixel-art sprites — chunky grid-aligned figures with crisp pixel-by-pixel facial features (dot eyes, pixel mouth, pixel hair), confident readable silhouettes, era-appropriate limited palette, and clearly-visible body proportions filling the frame. Always render the main subject(s) AS the central pixel-art character(s), never as tiny background sprites in a wider scene.`,
  handcrafted: `HUMAN CHARACTERS are Sackboy-style knitted burlap dolls — hessian fabric bodies with visible yarn weave, X-stitched seams, big mismatched button eyes with thread crosses, embroidered or zipper mouths, yarn hair, patchwork felt clothing with pinking-shear edges. Always render the main subject(s) AS the central Sackboy doll(s), full-bodied and clearly visible — never as a tiny figure in a craft-world landscape.`,
};

async function main() {
  for (const key of Object.keys(MANDATES)) {
    const { data: m, error } = await sb
      .from('dream_mediums')
      .select('key,directive,is_character_only')
      .eq('key', key)
      .single();
    if (error) {
      console.error(`[${key}] fetch error: ${error.message}`);
      continue;
    }
    const mandate = MANDATES[key];
    let directive = m.directive || '';

    // Idempotent: skip if mandate already present.
    if (directive.includes('HUMAN CHARACTERS are')) {
      console.log(`[${key}] already has HUMAN CHARACTERS mandate — skipping directive edit.`);
    } else {
      directive = `${mandate}\n\n${directive.trimStart()}`;
    }

    const update = {
      is_character_only: true,
      directive,
    };
    const { error: upErr } = await sb.from('dream_mediums').update(update).eq('key', key);
    if (upErr) {
      console.error(`[${key}] update error: ${upErr.message}`);
      continue;
    }
    console.log(
      `[${key}] ✓ is_character_only=true${directive !== m.directive ? ', directive prepended (' + m.directive.length + '→' + directive.length + ' chars)' : ''}`
    );
  }
  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
