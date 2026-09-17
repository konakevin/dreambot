/**
 * SCENE-ONLY vs FACE-SWAP: THE DIVERGENCE (2026-09-14).
 *
 * These two nightly paths were one path until today. They are now deliberately different, because a personless
 * scene has no face to carry and therefore none of the face-swap machinery applies to it. Every divergence below
 * was a decision, not an accident, and each one is easy to collapse back by "simplifying" — so each is locked
 * here with the reason it exists.
 *
 *   axis                     FACE-SWAP (couple / solo)        SCENE-ONLY (pure_scene)
 *   ─────────────────────────────────────────────────────────────────────────────────────────
 *   policy row               couple / solo                    scene
 *   model pool shape         direct-to-primary ~50%           even split across the whole pool
 *   per-look model bans      HONOURED (a swap grade)          IGNORED (no face to grade)
 *   flux-1.1-pro-ultra       BANNED (4MP breaks the swap)     ALLOWED (nothing to break)
 *   downstream 1.2.0 gates   guarded by !minimalModel         guarded by !minimalModel
 */
import fs from 'fs';
import path from 'path';
import { buildStyleContract } from '@engine/nightlyStyle';
import type { NightlyModelPolicy } from '@engine/nightlyModelPolicy';
import type { LookApproval, LookRow } from '@engine/nightlyLooks';

const PRO = 'black-forest-labs/flux-1.1-pro';
const GEMINI = 'google/gemini-2-image';
const GROK = 'xai/grok-imagine-image';
const ULTRA = 'black-forest-labs/flux-1.1-pro-ultra';
const FLEX = 'black-forest-labs/flux-2-flex';
const POOL = [PRO, GEMINI, GROK, ULTRA];

const SRC = fs.readFileSync(
  path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
  'utf8'
);
const strip = (s: string) => s.replace(/\s+/g, ' ');

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
const POLICY: NightlyModelPolicy = {
  couple: { primaryModels: POOL, fallbackModels: [] },
  solo: { primaryModels: POOL, fallbackModels: [] },
  solo_rebuild: { primaryModels: [FLEX], fallbackModels: [] },
  scene: { primaryModels: POOL, fallbackModels: [] },
};
/** 'oil' is graded on every model for solo, then REJECTED on flux — a face-swap judgement. */
const APPROVALS: LookApproval[] = [
  ...POOL.map((m) => ({ lookKey: 'oil', model: m, surface: 'solo' as const, approved: true })),
  // COUPLE keeps every model approved — it is the "generic cast surface" control in these tests.
  ...POOL.map((m) => ({ lookKey: 'oil', model: m, surface: 'couple' as const, approved: true })),
  // ...and SOLO then rejects flux, which is the face-swap judgement scene must ignore.
  { lookKey: 'oil', model: PRO, surface: 'solo', approved: false },
];
const build = (surface: 'scene' | 'solo' | 'couple', v: number) =>
  buildStyleContract({
    surface,
    policy: POLICY,
    modelFromLook: true,
    evenModelSplit: surface === 'scene',
    looks: [look('oil')],
    approvals: APPROVALS,
    rng: () => v,
  });
const modelsOver = (surface: 'scene' | 'solo' | 'couple', n = 400) => {
  const seen = new Set<string>();
  for (let i = 0; i < n; i++) {
    const c = build(surface, (i + 0.5) / n);
    if (c) seen.add(c.model);
  }
  return seen;
};

describe('divergence 1 — per-look model bans are a FACE-SWAP grade', () => {
  it('a cast render honours the rejection', () => {
    expect(modelsOver('solo').has(PRO)).toBe(false);
  });

  it('a scene render ignores it — there is no face for that grade to be about', () => {
    expect(modelsOver('scene').has(PRO)).toBe(true);
  });

  it('the scene pool is therefore the FULL policy row', () => {
    expect(modelsOver('scene').size).toBe(POOL.length);
  });
});

describe('divergence 2 — pool shape', () => {
  it('cast rolls the CONFIGURED weights (the direct-to-primary jump is gone)', () => {
    // Was a hardcoded 50% jump to the first primary. The split now comes from
    // nightly_model_policy.primary_weights, so a cast surface is tuned in the database rather than in
    // TypeScript — see __tests__/lib/modelWeightDeterminism.test.ts.
    const c = build('couple', 0.1)!;
    expect(c.stamps.some((s) => s.startsWith('model_roll:direct:'))).toBe(false);
    expect(c.stamps.some((s) => s.startsWith('model_roll:weighted:'))).toBe(true);
  });

  it('scene splits evenly instead — no model is favoured', () => {
    const counts: Record<string, number> = {};
    const N = 4000;
    for (let i = 0; i < N; i++) {
      const c = build('scene', (i + 0.5) / N);
      if (c) counts[c.model] = (counts[c.model] ?? 0) + 1;
    }
    for (const m of POOL) {
      expect((counts[m] ?? 0) / N).toBeGreaterThan(0.2);
      expect((counts[m] ?? 0) / N).toBeLessThan(0.3);
    }
  });

  it('each path SAYS which shape it used', () => {
    expect(build('scene', 0.3)!.stamps).toContain(`model_roll:even:${POOL.length}`);
    expect(build('scene', 0.3)!.stamps).toContain('scene_ignores_look_model_bans');
    expect(build('couple', 0.3)!.stamps).not.toContain('scene_ignores_look_model_bans');
  });
});

describe('divergence 3 — flux-1.1-pro-ultra is scene-only (source guards)', () => {
  it('ultra is unbanned ONLY for the scene surface', () => {
    // Banned on cast because its 4MP output defeats the dual face-swap detector ~50% of the time
    // (Kevin, 2026-08-28). A personless scene has no swap to break.
    expect(strip(SRC)).toContain(
      "const SCENE_ONLY_UNBANNED: ReadonlySet<string> = new Set([ 'black-forest-labs/flux-1.1-pro-ultra', ]);"
    );
    expect(strip(SRC)).toContain("if (minimalSurface !== 'scene') return base;");
    expect(strip(SRC)).toContain("fallbackReasons.push('scene_model_unban:ultra');");
  });

  it('ultra stays in the global nightly ban list — the lift is scoped, not a removal', () => {
    expect(strip(SRC)).toContain("'black-forest-labs/flux-1.1-pro-ultra',");
  });
});

describe('divergence 4 — scene is its own surface (source guards)', () => {
  it('pure_scene builds a scene contract; epic_tiny stays a cast surface', () => {
    // epic_tiny still carries a cast and can face-swap, so it must NOT take the scene divergences.
    expect(strip(SRC)).toContain(
      "const minimalSurface: 'couple' | 'solo' | 'scene' = preRolledComposition === 'pure_scene' ? 'scene' :"
    );
    expect(strip(SRC)).toContain("evenModelSplit: minimalSurface === 'scene',");
  });

  it('the 1.2.0 scene-composition gate can no longer override the contract', () => {
    // This gate re-picked from a pool built with the CAST ban list and forced every scene render to flux.
    // The ban gate and pin gate beside it already carried !minimalModel; this one was missed.
    expect(strip(SRC)).toContain(
      '!minimalModel && // the looks contract already chose, from the SCENE policy row — do not re-pick over it'
    );
  });

  it('EVERY downstream model reassignment is guarded against the minimal contract', () => {
    // The structural rule: flux-1.1-pro is 1.2.0's universal default, so ANY unguarded downstream gate
    // silently drags the render back to flux. Five reassignment sites; the only one allowed to fire without
    // the guard is the first-dream GPT ban, which nightly never reaches.
    const lines = SRC.split('\n');
    const unguarded: number[] = [];
    lines.forEach((l, i) => {
      if (!/^\s*pickedModel = /.test(l)) return;
      if (/let pickedModel/.test(l)) return;
      const ctx = lines.slice(Math.max(0, i - 30), i).join('\n');
      if (!/!minimalModel/.test(ctx) && !/isFirstDream/.test(ctx)) unguarded.push(i + 1);
    });
    expect(unguarded).toEqual([]);
  });
});
