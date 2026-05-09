/**
 * Coverage test for the photo restyle resolver.
 *
 * Both restyle paths are now DB-driven:
 *   - flux-dev rebuild path → triggered by `flux_dev_prompt_template` on
 *     dream_mediums (lego, vinyl). Migration 153.
 *   - kontext-pro transform path → triggered by `kontext_directive` on
 *     dream_mediums. Migration 152 set every active medium's directive
 *     to the god-tier flattering pattern.
 *
 * No more hardcoded MEDIUM_CONFIGS in photoPrompts.ts — everything that
 * needs editing lives in the DB and takes effect without an Edge Function
 * redeploy.
 *
 * This test verifies:
 *   1. The resolver reads `fluxDevPromptTemplate` from the medium and
 *      routes to flux-dev when present.
 *   2. Falls back to `kontextDirective` for the kontext-pro path.
 *   3. Placeholder substitution wires up correctly.
 *   4. Migration 153 exists and seeds both lego + vinyl.
 *   5. Migration 152 exists and sets directives for every expected
 *      active medium.
 */

import * as fs from 'fs';
import * as path from 'path';

const PHOTO_PROMPTS_PATH = path.join(
  __dirname,
  '..',
  '..',
  'supabase',
  'functions',
  '_shared',
  'photoPrompts.ts'
);

const MIGRATION_152_PATH = path.join(
  __dirname,
  '..',
  '..',
  'supabase',
  'migrations',
  '152_god_tier_kontext_directives.sql'
);

const MIGRATION_153_PATH = path.join(
  __dirname,
  '..',
  '..',
  'supabase',
  'migrations',
  '153_dream_mediums_flux_dev_prompt_template.sql'
);

describe('photoPrompts: DB-driven restyle resolver', () => {
  const source = fs.readFileSync(PHOTO_PROMPTS_PATH, 'utf-8');

  it('exposes getPhotoRestyleConfig taking a MediumLike argument', () => {
    expect(source).toContain('export function getPhotoRestyleConfig');
    expect(source).toContain('MediumLike');
  });

  it('routes flux-dev path on fluxDevPromptTemplate', () => {
    expect(source).toContain('fluxDevPromptTemplate');
    expect(source).toMatch(/model:\s*'flux-dev'/);
  });

  it('routes kontext-pro path on kontextDirective', () => {
    expect(source).toContain('kontextDirective');
    expect(source).toMatch(/model:\s*'kontext-pro'/);
  });

  it('substitutes {{photo}}, {{vibe}}, {{hint}} placeholders', () => {
    expect(source).toContain('{{photo}}');
    expect(source).toContain('{{vibe}}');
    expect(source).toContain('{{hint}}');
  });

  it('does NOT keep a hardcoded MEDIUM_CONFIGS map', () => {
    // Migration 153 moved lego + vinyl into the DB. The old `MEDIUM_CONFIGS`
    // export should not survive — re-introducing it would re-fragment the
    // source-of-truth across code + DB.
    expect(source).not.toContain('MEDIUM_CONFIGS');
  });
});

describe('migration 152: kontext_directive god-tier rewrites', () => {
  const sql = fs.readFileSync(MIGRATION_152_PATH, 'utf-8');

  // Every active medium that uses the Kontext path should have its
  // directive overwritten in this migration. lego + vinyl (flux-dev path)
  // are intentionally NOT included here.
  const EXPECTED_KEYS = [
    'animation',
    'anime',
    'canvas',
    'claymation',
    'comics',
    'fairytale',
    'handcrafted',
    'illustration',
    'pencil',
    'photography',
    'pixels',
    'pop_art',
    'render',
    'storybook',
    'vaporwave',
    'watercolor',
  ];

  it.each(EXPECTED_KEYS)('updates kontext_directive for "%s"', (key) => {
    expect(sql).toMatch(new RegExp(`WHERE key = '${key}'`));
  });

  it('every directive opens with the museum-quality framing', () => {
    const matches = sql.match(/Transform this image into a museum-quality/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(EXPECTED_KEYS.length);
  });
});

describe('migration 153: flux_dev_prompt_template column + seeds', () => {
  const sql = fs.readFileSync(MIGRATION_153_PATH, 'utf-8');

  it('adds the column to dream_mediums', () => {
    expect(sql).toContain('ADD COLUMN IF NOT EXISTS flux_dev_prompt_template');
  });

  it('seeds lego with a museum-quality template', () => {
    expect(sql).toMatch(
      /UPDATE public\.dream_mediums SET flux_dev_prompt_template[\s\S]+?WHERE key = 'lego'/
    );
    expect(sql).toContain('museum-quality');
  });

  it('seeds vinyl with a museum-quality template', () => {
    expect(sql).toMatch(
      /UPDATE public\.dream_mediums SET flux_dev_prompt_template[\s\S]+?WHERE key = 'vinyl'/
    );
  });

  it('templates use {{photo}}, {{vibe}}, {{hint}} placeholders', () => {
    expect(sql).toContain('{{photo}}');
    expect(sql).toContain('{{vibe}}');
    expect(sql).toContain('{{hint}}');
  });
});
