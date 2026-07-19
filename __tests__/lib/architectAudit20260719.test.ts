/**
 * Regression locks for the 2026-07-19 Architect audit fixes. Content assertions
 * (source + migration greps) so a future careless edit can't silently re-open a
 * gap — same discipline as auditHardening20260701 / securityHardening278/281.
 *
 * Covers:
 *  - A6: the new users.allow_downloads column + its column-level grants (378) and
 *    end-to-end plumbing (mapPost, get_feed, upscale-image server enforcement) —
 *    the column is silently invisible/un-writable if a grant is ever dropped, and
 *    the "downloads disabled" server check is unexercised code that a refactor
 *    could quietly break.
 *  - A5: the enqueue-dream refund-after-charge-failure path now LOGS instead of
 *    swallowing (hard rule: never fire-and-forget a critical money RPC silently).
 */
import * as fs from 'fs';
import * as path from 'path';

const REPO = path.join(__dirname, '..', '..');
const read = (rel: string): string => fs.readFileSync(path.join(REPO, rel), 'utf-8');

describe('A6 — allow_downloads (migration 378) column + grants', () => {
  const mig = read('supabase/migrations/378_allow_downloads.sql');

  it('adds the column NOT NULL DEFAULT true (preserves existing behavior)', () => {
    expect(mig).toMatch(/ADD COLUMN IF NOT EXISTS allow_downloads boolean NOT NULL DEFAULT true/);
  });

  it('grants column-level SELECT to anon + authenticated (else invisible to clients)', () => {
    expect(mig).toMatch(
      /GRANT SELECT \(allow_downloads\) ON public\.users TO anon, authenticated;/
    );
  });

  it('grants column-level UPDATE to authenticated (else the settings toggle fails)', () => {
    expect(mig).toMatch(/GRANT UPDATE \(allow_downloads\) ON public\.users TO authenticated;/);
  });

  it('carries allow_downloads through get_feed so every feed row has it', () => {
    // Return-table column + selected next to allow_reposts.
    expect(mig).toMatch(/allow_downloads\s+boolean,/);
    expect(mig).toMatch(/u\.allow_reposts, u\.allow_downloads/);
  });
});

describe('A6 — allow_downloads client + server plumbing', () => {
  it('mapPost selects allow_downloads and defaults it TRUE when absent', () => {
    const src = read('lib/mapPost.ts');
    expect(src).toContain('allow_reposts, allow_downloads'); // in the users!inner embed
    // Both the joined mapper and the flat get_feed mapper default to true.
    const defaults = src.match(/allow_downloads:\s*\([^)]*\)\s*\?\?\s*true/g) ?? [];
    expect(defaults.length).toBeGreaterThanOrEqual(2);
  });

  it('upscale-image rejects non-owner HD when the author disabled downloads', () => {
    const src = read('supabase/functions/upscale-image/index.ts');
    // Only checked for non-owners (owner always keeps HD on their own dream).
    expect(src).toMatch(/if\s*\(!isOwn\)/);
    expect(src).toMatch(/\.select\('allow_downloads'\)/);
    expect(src).toMatch(/allow_downloads === false/);
    expect(src).toContain('downloads_disabled');
  });

  it('DreamCard gates the save actions on allow_downloads (client)', () => {
    const src = read('components/DreamCard.tsx');
    expect(src).toMatch(/allowDownloads:\s*item\.allow_downloads !== false/);
  });

  it('the download action-sheet builder honors the opt-out for non-owners', () => {
    const src = read('lib/imageLongPress.ts');
    expect(src).toMatch(/const canDownload = !!opts\.isOwn \|\| opts\.allowDownloads !== false/);
  });
});

describe('A5 — enqueue-dream no longer swallows a failed post-charge refund', () => {
  const src = read('supabase/functions/enqueue-dream/index.ts');

  it('logs when refund_sparkles fails after a charge (lost-sparkle visibility)', () => {
    // The refund reject handler must log, not be an empty () => {}.
    expect(src).toMatch(/refund_sparkles FAILED after enqueue error/);
  });

  it('logs a failed worker kick instead of silently dropping it', () => {
    expect(src).toMatch(/worker kick failed for job/);
  });
});
