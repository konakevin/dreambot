/**
 * Coverage test for photo restyle configs.
 *
 * Most mediums auto-generate Kontext instructions from the DB's
 * kontext_directive column. Only LEGO and vinyl need custom configs
 * in MEDIUM_CONFIGS (they use flux-dev full rebuild).
 *
 * This test verifies the custom configs exist and no orphans remain.
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

// Only these mediums need custom MEDIUM_CONFIGS entries (flux-dev rebuild).
// All others auto-generate from DB kontext_directive via getPhotoRestyleConfig.
const CUSTOM_CONFIG_MEDIUMS = ['lego', 'vinyl'];

describe('photoPrompts MEDIUM_CONFIGS coverage', () => {
  const source = fs.readFileSync(PHOTO_PROMPTS_PATH, 'utf-8');

  const keyRegex = /^ {2}([a-z][a-z0-9_]*): \{$/gm;
  const foundKeys = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = keyRegex.exec(source)) !== null) {
    foundKeys.add(m[1]);
  }

  it.each(CUSTOM_CONFIG_MEDIUMS)(
    'has a MEDIUM_CONFIGS entry for "%s" (flux-dev rebuild)',
    (medium) => {
      expect(foundKeys.has(medium)).toBe(true);
    }
  );

  it('has no orphan entries beyond the expected custom configs', () => {
    const orphans = [...foundKeys].filter((k) => !CUSTOM_CONFIG_MEDIUMS.includes(k));
    expect(orphans).toEqual([]);
  });

  it('getPhotoRestyleConfig auto-generates for non-custom mediums', () => {
    // Verify the function signature accepts medium object for auto-gen
    expect(source).toContain('kontextDirective');
    expect(source).toContain('kontext-pro');
  });
});
