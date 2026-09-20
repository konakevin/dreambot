/**
 * THREE NIGHTLY ROUTING BUGS, FOUND 2026-09-20 while adding per-look model pins (mig 536).
 *
 * 1. THE RETRY ROLL IGNORED THE LOOK'S REJECTIONS. `forAttempt(2)` filtered the policy's fallback row on `bans`
 *    alone, so a look that rejects a FALLBACK model still landed on it. `nightly_rotoscope`/couple rejects
 *    gemini-2-image and the live row is [flux-2-flex 50, gemini-2-image 50], so roughly half its retries
 *    rendered the exact pairing Kevin graded NO — and `lockLook: true` carried the look onto it.
 * 2. THE SOLO MODEL MOVE RENDERED ON THE OLD MODEL. The rung computed a new model, stamped `solo_model_move:`
 *    and set `modelUsedOverride`, then called generateImage with `pickedModel`. The move existed in the stamps
 *    and in ai_generation_log.model_used, and nowhere in the pixels.
 * 3. A NULL CONTRACT LOST ITS REASON. buildStyleContract returns null on an empty look or model pool; its
 *    stamps died with it, so the log held only `looks_minimal:no_contract` and never named the look/surface.
 */
import fs from 'fs';
import path from 'path';
import { buildStyleContract } from '@engine/nightlyStyle';
import type { NightlyModelPolicy } from '@engine/nightlyModelPolicy';
import type { LookApproval, LookRow } from '@engine/nightlyLooks';

const PRO = 'black-forest-labs/flux-1.1-pro';
const GEMINI = 'google/gemini-2-image';
const FLEX = 'black-forest-labs/flux-2-flex';

/** The live shape: flux renders first, the retry is a 50/50 roll between flex and gemini. */
const POLICY: NightlyModelPolicy = {
  couple: {
    primaryModels: [PRO, GEMINI],
    primaryWeights: [100, 0],
    fallbackModels: [FLEX, GEMINI],
    fallbackWeights: [50, 50],
  },
  solo: {
    primaryModels: [PRO, GEMINI],
    primaryWeights: [100, 0],
    fallbackModels: [FLEX, GEMINI],
    fallbackWeights: [50, 50],
  },
  solo_rebuild: { primaryModels: [FLEX], fallbackModels: [] },
  scene: { primaryModels: [GEMINI], fallbackModels: [] },
};

const look = (key: string): LookRow => ({
  key,
  label: key,
  family: 'painted_realism',
  fragment: `${key} scene`,
  swapFragment: `${key} swap`,
  directive: null,
  weight: 1,
  active: true,
  nightlyEnabled: true,
});
const LOOKS = [look('rotoscope')];
const reject = (model: string): LookApproval => ({
  lookKey: 'rotoscope',
  model,
  surface: 'couple',
  approved: false,
});
/** A look only enters the roll when it has at least one APPROVED row for the surface, so every fixture below
 *  carries this and then layers the rejections that matter to the retry. */
const CANDIDATE: LookApproval = {
  lookKey: 'rotoscope',
  model: PRO,
  surface: 'couple',
  approved: true,
};

const build = (approvals: LookApproval[], rngValue: number) =>
  buildStyleContract({
    surface: 'couple',
    policy: POLICY,
    modelFromLook: true,
    lockLook: true,
    looks: LOOKS,
    approvals,
    rng: () => rngValue,
  })!;

describe('bug 1 — the retry roll honours the look’s rejections', () => {
  // Sweep the roll: with both fallbacks live, some rng lands on gemini. With gemini rejected, none may.
  const SWEEP = [0.01, 0.2, 0.4, 0.49, 0.51, 0.7, 0.9, 0.99];

  it('reproduces the old behaviour: with NO rejection the roll does reach gemini', () => {
    const reached = SWEEP.map((r) => build([CANDIDATE], r).forAttempt(2).model);
    expect(reached).toContain(GEMINI);
    expect(reached).toContain(FLEX);
  });

  it('never lands on a fallback model this look rejects', () => {
    for (const r of SWEEP) {
      const pick = build([CANDIDATE, reject(GEMINI)], r).forAttempt(2);
      expect(pick.model).not.toBe(GEMINI);
      expect(pick.model).toBe(FLEX);
    }
  });

  it('keeps the look across the model move (lockLook), which is why the rejection mattered', () => {
    const pick = build([CANDIDATE, reject(GEMINI)], 0.9).forAttempt(2);
    expect(pick.look.key).toBe('rotoscope');
  });

  it('FAILS OPEN when the rejections would empty the row — a re-render must still happen', () => {
    const pick = build([CANDIDATE, reject(GEMINI), reject(FLEX)], 0.5).forAttempt(2);
    expect([FLEX, GEMINI]).toContain(pick.model);
    expect(pick.stamps.some((s) => s.startsWith('fallback_rejected_all:'))).toBe(true);
  });

  it('does not stamp the fail-open escape when a survivor exists', () => {
    const pick = build([CANDIDATE, reject(GEMINI)], 0.5).forAttempt(2);
    expect(pick.stamps.some((s) => s.startsWith('fallback_rejected_all:'))).toBe(false);
    expect(pick.stamps.some((s) => s.endsWith(':fallback_roll'))).toBe(true);
  });

  it('a rejection on the OTHER surface does not touch this roll', () => {
    const soloOnly: LookApproval = {
      lookKey: 'rotoscope',
      model: GEMINI,
      surface: 'solo',
      approved: false,
    };
    const reached = SWEEP.map((r) => build([CANDIDATE, soloOnly], r).forAttempt(2).model);
    expect(reached).toContain(GEMINI);
  });
});

describe('bug 3 — a null contract reports WHY', () => {
  it('names the look and surface when the model pool empties', () => {
    const diagnostics: string[] = [];
    const contract = buildStyleContract({
      surface: 'couple',
      policy: POLICY,
      modelFromLook: true,
      looks: LOOKS,
      // approved on FLEX so the look is a candidate, but every PRIMARY rejected → the model pool empties
      approvals: [{ ...CANDIDATE, model: FLEX }, reject(PRO), reject(GEMINI)],
      diagnostics,
      rng: () => 0.01,
    });
    expect(contract).toBeNull();
    expect(diagnostics).toEqual(['looks_path_no_model:rotoscope:couple']);
  });

  it('is optional — omitting it keeps the old signature working', () => {
    expect(
      buildStyleContract({
        surface: 'couple',
        policy: POLICY,
        modelFromLook: true,
        looks: LOOKS,
        approvals: [{ ...CANDIDATE, model: FLEX }, reject(PRO), reject(GEMINI)],
        rng: () => 0.01,
      })
    ).toBeNull();
  });
});

describe('bug 2 — the solo model move reaches the renderer', () => {
  const SRC = fs.readFileSync(
    path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
    'utf8'
  );

  it('computes soloModel and then actually passes it to generateImage', () => {
    // the rung that moves the model
    expect(SRC).toContain('soloModel = pick.model;');
    // the call that renders it: `soloModel,` must appear as the model argument, and the old `pickedModel,`
    // form must be gone from this block.
    const block = SRC.slice(SRC.indexOf('let soloModel = pickedModel;'));
    const call = block.slice(0, block.indexOf("'png'"));
    expect(call).toContain('soloModel,');
    expect(call).not.toMatch(/\n\s+pickedModel,\s*\n/);
  });
});
