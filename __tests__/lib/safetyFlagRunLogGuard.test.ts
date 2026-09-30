/**
 * Locks the run-log row the bot engine writes when a render is safety-flagged and
 * re-rolled (2026-09-30).
 *
 * A flagged prompt first fails flux()'s own same-prompt retries, then runBot
 * re-rolls every pool pick and tries a NEW prompt. When that re-roll succeeds,
 * nothing used to record what tripped the filter: the flagged text was simply
 * discarded, so every safety flag had to be diagnosed by replaying and bisecting
 * (BOT_SCENE_QUALITY_PLAYBOOK.md §3.3). The engine now writes one `bot_run_log`
 * row per flagged roll (status 'skipped', error_stage 'safety_flag', full text
 * in prompt_preview) before re-rolling.
 *
 * The regression this guards: someone tidies the recovery branch back to a bare
 * `nsfwRecoveryAttempt++; continue;`, and flags go silent again with no test
 * noticing, because every render still succeeds.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const src = readFileSync(join(__dirname, '../../scripts/lib/botEngine.js'), 'utf8');

/** The NSFW recovery branch: from its guard to the `continue` that re-rolls. */
function recoveryBranch(): string {
  const start = src.indexOf('if (isNsfw && nsfwRecoveryAttempt < MAX_NSFW_RECOVERY) {');
  expect(start).toBeGreaterThan(-1);
  const end = src.indexOf('continue; // back to top of while', start);
  expect(end).toBeGreaterThan(start);
  return src.slice(start, end);
}

describe('safety-flagged re-rolls are logged, not discarded', () => {
  const branch = recoveryBranch();

  it('writes a bot_run_log row before re-rolling', () => {
    expect(branch).toMatch(/await writeRunLog\(sb, \{/);
  });

  it('tags the row so flags can be queried', () => {
    expect(branch).toMatch(/error_stage: 'safety_flag'/);
    // 'skipped' is an allowed status (migration 123) and is not a failed post.
    expect(branch).toMatch(/status: 'skipped'/);
  });

  it('keeps the flagged prompt text and the model that flagged it', () => {
    expect(branch).toMatch(/prompt_preview: finalPrompt\.slice\(0, \d+\)/);
    expect(branch).toMatch(/model: renderModel/);
    expect(branch).toMatch(/error: flagMsg\.slice\(0, 2000\)/);
  });

  it('does not stamp llm_models (the final row does, so LLM calls are not double-counted)', () => {
    expect(branch).not.toMatch(/llm_models:/);
  });

  it('skips the write on dry runs', () => {
    expect(branch).toMatch(/if \(!dryRun\) \{\s*await writeRunLog/);
  });

  it('still re-rolls after logging', () => {
    expect(branch).toMatch(/nsfwRecoveryAttempt\+\+;\s*$/);
  });
});

describe("the status the row uses is allowed by the table's CHECK", () => {
  it("migration 123 permits 'skipped'", () => {
    const mig = readFileSync(
      join(__dirname, '../../supabase/migrations/123_bot_dedup_and_runlog.sql'),
      'utf8'
    );
    expect(mig).toMatch(/CHECK \(status IN \('ok', 'failed', 'skipped'\)\)/);
  });
});
