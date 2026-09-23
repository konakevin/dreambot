/**
 * Locks the `prompt_words` stamp on BOTH `bot_run_log` write sites (migration 546).
 *
 * Prompt LENGTH is the strongest single predictor of a render's grade that this
 * project has measured (playbook lesson 54): on one path, 15 renders, same pools
 * and models, the 8 shortest prompts averaged 4.51 and the 7 longest 3.87.
 *
 * Before migration 546 that question could not be asked from history at all:
 *   - a DELIVERED render's full prompt is on `uploads.ai_prompt`, one join away;
 *   - a FAILED render writes NO uploads row, and `prompt_preview` caps at 2000
 *     chars, so every prompt past ~312 words reads as exactly 312.
 * The cap is why "do longer prompts trip the content filter?" was unanswerable
 * for a path whose delivered prompts all run 476-613 words — they all reported
 * the same number.
 *
 * The engine has TWO run-log inserts (the success path and the failure path) and
 * they are ~50 lines apart, so the realistic regression is adding a field to one
 * and forgetting the other — which would silently reintroduce exactly the blind
 * spot this column exists to remove, on the half that matters most. Hence a
 * per-site assertion rather than a single "the string appears somewhere" check.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { countPromptWords } = require('../../scripts/lib/botEngine');

const src = readFileSync(join(__dirname, '../../scripts/lib/botEngine.js'), 'utf8');

/**
 * Each object literal written to `bot_run_log`, identified by the field every
 * one of them carries. Keyed off `prompt_preview` rather than `.insert(` because
 * the two sites are built and inserted in different shapes.
 */
function runLogWriteSites(): string[] {
  return [...src.matchAll(/prompt_preview:[\s\S]{0,400}?sonnet_truncated:/g)].map((m) => m[0]);
}

describe('countPromptWords', () => {
  it('is exported from botEngine', () => {
    expect(typeof countPromptWords).toBe('function');
  });

  it('counts words across any whitespace', () => {
    expect(countPromptWords('a b  c\nd\te')).toBe(5);
  });

  it('returns null rather than 0 for nothing, so a gap reads as unknown', () => {
    // 0 would be a lie — it asserts an empty prompt was emitted. NULL is honest,
    // and the migration's partial index excludes it.
    expect(countPromptWords('')).toBeNull();
    expect(countPromptWords('   \n  ')).toBeNull();
    expect(countPromptWords(undefined)).toBeNull();
    expect(countPromptWords(null)).toBeNull();
  });

  it('does not throw on a non-string', () => {
    expect(() => countPromptWords(12345)).not.toThrow();
    expect(countPromptWords(12345)).toBeNull();
  });
});

describe('bot_run_log writes must stamp prompt_words', () => {
  const sites = runLogWriteSites();

  it('finds both write sites — the success one and the failure one', () => {
    // If this drops to 1, the two inserts were merged or one was rewritten; the
    // per-site checks below would then pass while covering only half the engine.
    expect(sites.length).toBe(2);
  });

  it.each(sites.map((s, i) => [i, s] as [number, string]))(
    'write site #%i stamps prompt_words',
    (_i: number, site: string) => {
      expect(site).toMatch(/prompt_words:\s*countPromptWords\(/);
    }
  );

  it('the failure site keeps the widened 2000-char preview', () => {
    // The word count does not replace the preview: the preview is still the only
    // surviving copy of a failed render's actual text, which is how content
    // failures get diagnosed at all.
    expect(src).toMatch(/prompt_preview:\s*finalPrompt \? finalPrompt\.slice\(0, 2000\) : null/);
  });

  it('migration 546 adds the column the engine writes', () => {
    const mig = readFileSync(
      join(__dirname, '../../supabase/migrations/546_bot_run_log_prompt_words.sql'),
      'utf8'
    );
    expect(mig).toMatch(/ADD COLUMN IF NOT EXISTS prompt_words integer/i);
    expect(mig).toMatch(/bot_run_log/);
  });
});
