/**
 * A TRIPWIRE ON THE DORMANT PATH.
 *
 * `LOOKS_MINIMAL = true` forces `looksPath = false`, so every branch gated on `looksPath` (or on
 * `activeStyle`, which is assigned only inside that branch) is DEAD in production. Four correct, tested,
 * shipped fixes have been found in there — each discovered only because Kevin reported the symptom a
 * SECOND time, weeks after the fix "shipped":
 *
 *   vibe fragment          0 of 50 nightlies
 *   lookNeutralFraming     look ignored 78% of the time
 *   looksCouplePromptStyle 0 of 22 duals got the album order
 *   forRebuild()           every rebuilt single ignored the solo primary
 *
 * The danger is that the dormant code reads as the live code: it is newer, better commented, and nothing
 * in the file marks it as unreachable. So the natural place to write a fix is the wrong one.
 *
 * This test cannot tell a good gate from a bad one. What it can do is make ADDING one a deliberate act:
 * the counts below are pinned, so a new `looksPath` / `activeStyle` branch fails CI and whoever added it
 * has to either write the minimal-path counterpart or consciously bump the number. That is the whole
 * point — not prevention, just refusal to let it happen silently.
 *
 * WHEN THIS FAILS, DO NOT JUST BUMP THE NUMBER. Ask: does the live (minimal) path need this behaviour
 * too? If yes, patch it forward into the `...(looksFields ? {} : { ... })` escape hatch, where the other
 * fixes now sit together. Only bump if the branch is genuinely full-path-only.
 *
 * The real fix is to collapse the fork so there is one engine. Until then, this is the alarm.
 */
import fs from 'fs';
import path from 'path';

const SRC = fs.readFileSync(
  path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
  'utf8'
);

/** Occurrences of a bare identifier, ignoring longer names that merely contain it (looksPathBans). */
const countIdent = (src: string, ident: string): number =>
  (src.match(new RegExp(`(?<![A-Za-z0-9_])${ident}(?![A-Za-z0-9_])`, 'g')) || []).length;

describe('the dormant path does not grow without someone noticing', () => {
  it('the number of `looksPath` references is pinned', () => {
    // 33 → 32 on 2026-09-17: the below-floor solo re-render was un-gated (looksMinimalInertFixGuard #4).
    expect(countIdent(SRC, 'looksPath')).toBe(32);
  });

  it('the number of `activeStyle` references is pinned', () => {
    // activeStyle is assigned ONLY inside the full-looks branch, so every read of it is dormant-gated.
    // forRebuild's read was one of these until 2026-09-17; the model is now taken on both paths.
    expect(countIdent(SRC, 'activeStyle')).toBe(29);
  });

  it('LOOKS_MINIMAL is still what switches the path off, so this tripwire still describes reality', () => {
    // If LOOKS_MINIMAL ever goes false, the dormant path becomes live and this whole file is moot —
    // that is a deliberate change, and it should force a read of this comment.
    const LOOKS = fs.readFileSync(
      path.join(__dirname, '..', '..', 'supabase', 'functions', '_shared', 'nightlyLooksPath.ts'),
      'utf8'
    );
    expect(LOOKS).toContain('export const LOOKS_MINIMAL = true;');
    expect(SRC.replace(/\s+/g, ' ')).toContain(
      "const looksPath = looksMode === 'on' && !LOOKS_MINIMAL;"
    );
  });
});

describe('the rebuild model is taken on BOTH paths', () => {
  it('forRebuild is no longer gated on activeStyle', () => {
    // The 2026-09-17 fix. `styleContract` is set under minimal; `activeStyle` is not — so the old
    // `styleContract && activeStyle` guard meant the rebuild silently used engine_config's default and a
    // failed flux couple came back as a flux-2-flex single.
    const s = SRC.replace(/\s+/g, ' ');
    expect(s).toContain('if (styleContract) { const pick = styleContract.forRebuild();');
    // Scoped to the REBUILD site. Two other `styleContract && activeStyle` gates remain and are fine:
    //   ~4503 the couple model-move, which HAS an `else if (looksMinimal && styleContract)` counterpart
    //         (that branch is where the chain_2of2 stamp comes from), and
    //   ~4711 a retry-time vibe reposition, which has NO minimal counterpart — a fifth dormant gate,
    //         known and deliberately left alone rather than fixed without measuring it.
    expect(s).not.toContain('activeStyle) { const pick = styleContract.forRebuild();');
  });

  it('but the LOOK is still only re-picked on the full path — minimal locks it', () => {
    // minimal builds its contract with lockLook: true so the stamps and the pixels agree. Re-picking the
    // look on a rebuild would make the logged look a lie.
    const s = SRC.replace(/\s+/g, ' ');
    expect(s).toContain('if (activeStyle) { rebuildFragment = pick.fragment;');
    expect(s).toContain('lockLook: true');
  });
});
