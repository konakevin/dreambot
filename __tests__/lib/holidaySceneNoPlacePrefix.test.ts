/**
 * Holiday scenes never get the "set in <place>," prefix (2026-09-30, LLM_5_5_TUNING.md note).
 *
 * The holiday_scenes row is the locked subject and its brief bans real place names, but the nightly post-process
 * used to prepend "set in <the user's place>," to every non-character scene — so a Halloween skeleton gazebo went to
 * Flux as "set in costa rica, …", an unrelated place in the first-noun slot. The prepend is inline in the nightly
 * handler, so this guard reads the source: the prepend's condition must exclude holiday scenes.
 */
import fs from 'fs';
import path from 'path';

const src = fs.readFileSync(
  path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
  'utf8'
);

describe('nightly location prefix', () => {
  it('is never prepended to a holiday scene', () => {
    const at = src.indexOf('finalPrompt = `set in ${effectiveUserPlace}, ` + finalPrompt;');
    expect(at).toBeGreaterThan(0);
    const condition = src.slice(src.lastIndexOf('if (', at), at);
    expect(condition).toMatch(/!holidayScene\b/);
    expect(condition).toMatch(/!isEmbodiedMedium\b/);
    expect(condition).toMatch(/resolvedComposition !== 'character'/);
  });
});
