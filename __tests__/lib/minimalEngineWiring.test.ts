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

/**
 * THE ACTION CHAIN (mig 516 + the 2026-09-13 fallbacks). Three rungs, each covering what the one above cannot:
 *   1. the row's own split action        — 2,691 couple rows
 *   2. the solo scene sentence itself    — 5,483 single rows whose action is not detachable
 *   3. a generated place-fitting beat    — the 260 couple rows that never had an action written
 * Only if all three are absent does the generic anchor apply. Source guards, because this wiring lives in the edge
 * handler; the resolver's own precedence is covered by castActionResolver.test.ts.
 */
describe('every cast dream reaches the model with something to DO', () => {
  it('rung 1: the row action is trimmed off the place text and handed to the resolver', () => {
    expect(strip(SRC)).toContain('dualScenarioAction = rowAction ??');
    expect(strip(SRC)).toContain('scenarioAction: dualScenarioAction');
    // the cut is exact because `action` is a verbatim slice of `scene` — no pattern matching at render time
    expect(strip(SRC)).toContain('s.scene.includes(rowAction) ? s.scene.indexOf(rowAction) : -1');
  });

  it('rung 2: a SOLO active row with no split action passes its scene sentence through, unrewritten', () => {
    expect(strip(SRC)).toContain("kind === 'active' && !isDualFaceSwap ? s.scene : null");
  });

  it('rung 3: with no action at all, a place-fitting beat is generated rather than falling to the anchor', () => {
    expect(strip(SRC)).toContain(
      '(dualActiveScene || soloActiveScene) && !dualScenarioAction && dualSpecialScene'
    );
    expect(strip(SRC)).toContain("fallbackReasons.push('scenario_action:generated')");
  });

  it('rung 3 fails OPEN — a generator outage keeps the old anchor instead of breaking the dream', () => {
    expect(strip(SRC)).toContain("fallbackReasons.push('scenario_action:generate_failed')");
    expect(strip(SRC)).toContain(
      "const beatKey = Deno.env.get('ANTHROPIC_API_KEY'); if (beatKey) {"
    );
  });
});
