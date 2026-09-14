/**
 * THE LOCKED NIGHTLY ENGINE — "1.2.0 with looks" (Kevin, 2026-09-13).
 *
 * The promise: the 1.2.0 engine builds the dream, and the ONLY things the new system decides are which look and
 * which vibe. These are source guards over `nightly-dreams/index.ts`, because the wiring that keeps that promise
 * lives in an edge function the unit lane cannot execute — the behaviour of the pure modules is covered by
 * nightlyStyle.test.ts, but nothing else proves the render path is actually wired to them. Each assertion below
 * corresponds to one line of the summary Kevin asked me to stand behind.
 */
import fs from 'fs';
import path from 'path';
import { LOOKS_MINIMAL } from '@engine/nightlyLooksPath';
import { PRIMARY_DIRECT_SHARE, LOOKS_ALL_MODELS } from '@engine/nightlyStyle';

const SRC = fs.readFileSync(
  path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
  'utf8'
);
const strip = (s: string) => s.replace(/\s+/g, ' ');

describe('the locked engine is wired the way the summary says', () => {
  it('CLAIM: the 1.2.0 engine builds the dream — the looks path is OFF whenever the minimal state is on', () => {
    expect(LOOKS_MINIMAL).toBe(true);
    // looksPath gates ~25 substitutions (scene mix, location-action share, pose pools, framing, prompt order,
    // identity floors). If it were ever true in the minimal state, those would silently replace 1.2.0's values.
    expect(strip(SRC)).toContain("const looksPath = looksMode === 'on' && !LOOKS_MINIMAL;");
    expect(strip(SRC)).toContain("const looksMinimal = looksMode === 'on' && LOOKS_MINIMAL;");
  });

  it('CLAIM: the new catalogue decides the look and the vibe, by PINNING both into the 1.2.0 flow', () => {
    // The look reaches the engine as its medium (the force_look mechanism 1.2.0 already has), and the vibe is
    // pinned beside it. Anything less and the catalogue would be advisory while the legacy roll still decided.
    expect(strip(SRC)).toContain('await resolveMediumFromDb(contract.look.key)');
    expect(strip(SRC)).toContain('await resolveVibeFromDb(contract.vibe.vibe.key)');
    expect(strip(SRC)).toContain('modelFromLook: true');
  });

  it('CLAIM: the model comes from the contract, not the medium row inherited flux pin', () => {
    expect(strip(SRC)).toContain('if (minimalModel) return minimalModel;');
    expect(strip(SRC)).toContain(
      'faceSwapPrePickedModel || minimalModel || sceneBaseModelResolved'
    );
  });

  it('CLAIM: a failed couple moves model instead of degrading — the rerender consults the chain', () => {
    expect(strip(SRC)).toContain('} else if (looksMinimal && styleContract) {');
    expect(strip(SRC)).toContain('const pick = styleContract.forAttempt(attempt + 1);');
  });

  it('CLAIM: three models, half direct to the primary and half rolled', () => {
    expect(LOOKS_ALL_MODELS).toBe(true);
    expect(PRIMARY_DIRECT_SHARE).toBe(0.5);
  });

  it('the minimal roll never runs behind a QA force_medium, which would fight the pin', () => {
    expect(strip(SRC)).toContain('if (looksMinimal && modelPolicy && !force_medium) {');
  });
});
