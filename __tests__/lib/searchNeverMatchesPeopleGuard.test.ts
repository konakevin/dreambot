/**
 * Guard: search must NEVER match people's physical characteristics (Kevin 2026-09-26,
 * migration 557).
 *
 * A member's engine prompt describes the real people cast in the dream (age, skin tone,
 * beard, freckles…), and for members `caption` mostly holds engine text too. Migration 557
 * indexes members' dreams only by person-free text (their own description + medium +
 * vibe) via public.member_search_tsv; only BOT authors keep the full prompt (fictional
 * characters). This locks the LATEST definitions of both functions to that shape, so a
 * future "just add ai_prompt back" change fails CI.
 */
import { latestFunctionBody as latestBody } from '../helpers/latestMigration';

describe('search never matches people (migration 557)', () => {
  it('member_search_tsv reads only person-free text', () => {
    const { file, body } = latestBody('member_search_tsv');
    expect({ file, usesPrompt: /ai_prompt/i.test(body) }).toEqual({ file, usesPrompt: false });
    expect({ file, usesCaption: /caption/i.test(body) }).toEqual({ file, usesCaption: false });
  });

  it('the search trigger gives members member_search_tsv and keeps the prompt for bots only', () => {
    const { file, body } = latestBody('uploads_search_tsv_trigger');
    const elseAt = body.search(/\bELSE\b/i);
    expect({ file, hasBotBranch: /is_bot/i.test(body) && elseAt > 0 }).toEqual({
      file,
      hasBotBranch: true,
    });
    const memberBranch = body.slice(elseAt);
    expect({ file, memberUsesSafeText: /member_search_tsv\s*\(/i.test(memberBranch) }).toEqual({
      file,
      memberUsesSafeText: true,
    });
    expect({ file, memberUsesPrompt: /ai_prompt|caption/i.test(memberBranch) }).toEqual({
      file,
      memberUsesPrompt: false,
    });
  });
});
