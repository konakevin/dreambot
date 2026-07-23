/**
 * lib/dreamSmartModel — the pure decision behind the Create screen's DreamSmart
 * auto-select. These tests lock the exact bugs that shipped to Kevin:
 *   1. swapping AWAY from a model that's still valid for the new style;
 *   2. picking Nano Banana instead of Flux 2 Pro — the model shown FIRST in the
 *      picker for the set;
 *   3. COMMITTED-FORWARD: the model resolves off the CURRENT model, so a later
 *      style never resurrects a pick from turns ago.
 * Plus a client↔server parity lock so the price shown == the price charged.
 */
import { resolveDreamSmartModel } from '@/lib/dreamSmartModel';
// Server coercion — the client target must match it for an out-of-set model.
import { smartDreamSet, coerceSmartDream } from '@engine/smartDream';

const FLUX_11 = 'black-forest-labs/flux-1.1-pro';
const FLUX_2_PRO = 'black-forest-labs/flux-2-pro';
const NANO = 'google/gemini-2-image'; // "Nano Banana"
const FLUX_2_DEV = 'black-forest-labs/flux-2-dev';
const GROK = 'xai/grok-imagine-image';
const GPT2 = 'openai/gpt-image-2';
const FLUX_2_MAX = 'black-forest-labs/flux-2-max';

// Live catalog (mirrors the sparkle tiers). Standard = 1✦, Premium = 2✦+.
const CATALOG = [
  { id: FLUX_11, sparkleCost: 1 },
  { id: FLUX_2_PRO, sparkleCost: 1 },
  { id: NANO, sparkleCost: 1 },
  { id: FLUX_2_DEV, sparkleCost: 1 },
  { id: GROK, sparkleCost: 1 },
  { id: GPT2, sparkleCost: 2 },
  { id: FLUX_2_MAX, sparkleCost: 3 },
];
const costOf = (id: string) => CATALOG.find((m) => m.id === id)?.sparkleCost ?? 1;

// The two real style sets from Kevin's screenshots.
// Comics INCLUDES Grok; its first picker model (flux-1.1-pro is absent) is Flux 2 Pro.
const COMICS = [FLUX_2_PRO, NANO, FLUX_2_DEV, GROK, GPT2];
// Glamour EXCLUDES Grok; flux-1.1-pro leads the set in picker order.
const GLAMOUR = [FLUX_11, GPT2, FLUX_2_MAX];

const on = (currentModel: string, smartModels: string[]) =>
  resolveDreamSmartModel({ currentModel, smartModels, models: CATALOG, dreamSmartOn: true });

describe('resolveDreamSmartModel — keep the pick when valid', () => {
  it('does NOT swap when the pick is in the style set (the Grok-on-Comics bug)', () => {
    expect(on(GROK, COMICS)).toEqual({ effectiveModelId: GROK, swapped: false });
  });
});

describe('resolveDreamSmartModel — swap to the FIRST picker model when dropped', () => {
  it('picks Flux 2 Pro (first shown), NOT Nano Banana, for Comics', () => {
    // currentModel flux-1.1-pro isn't in the Comics set → fallback must be the model
    // shown first in the picker (flux-2-pro), never the smart_dream_default.
    const r = on(FLUX_11, COMICS);
    expect(r.effectiveModelId).toBe(FLUX_2_PRO);
    expect(r.effectiveModelId).not.toBe(NANO);
    expect(r.swapped).toBe(true);
  });

  it('picks Flux 1.1 Pro (first shown) for Glamour', () => {
    expect(on(GROK, GLAMOUR)).toEqual({ effectiveModelId: FLUX_11, swapped: true });
  });

  it('never raises the sparkle cost on a swap', () => {
    const r = on(FLUX_2_MAX, COMICS); // 3✦ pick, absent from Comics → dropped
    expect(r.swapped).toBe(true);
    expect(costOf(r.effectiveModelId)).toBeLessThanOrEqual(costOf(FLUX_2_MAX));
  });
});

describe('committed-forward — no resurrection of an old model (the headline bug)', () => {
  // Model state is a single committed value. The Create screen commits each swap
  // target forward (setSelectedModelId), so resolution ALWAYS reads the CURRENT
  // model — never a preserved original. This models that commit loop across a
  // multi-style journey and proves the model Kevin saw jump back can't happen.
  it('Grok → Glamour commits Flux 1.1 Pro → a later style keeps it, never resurrects Grok', () => {
    let model = GROK; // committed model; reassigned on each swap, exactly like the app

    // Style 1: Glamour drops Grok → commit the swap target forward.
    const glam = resolveDreamSmartModel({
      currentModel: model,
      smartModels: GLAMOUR,
      models: CATALOG,
      dreamSmartOn: true,
    });
    expect(glam.swapped).toBe(true);
    if (glam.swapped) model = glam.effectiveModelId; // COMMIT
    expect(model).toBe(FLUX_11);

    // Style 2: a set that supports Flux 1.1 Pro (every style does post-migration).
    // The current model is Flux 1.1 Pro now — it stays; Grok is NOT resurrected.
    const next = resolveDreamSmartModel({
      currentModel: model,
      smartModels: [FLUX_2_PRO, NANO, GROK, FLUX_11], // includes the committed model
      models: CATALOG,
      dreamSmartOn: true,
    });
    expect(next.swapped).toBe(false);
    expect(next.effectiveModelId).toBe(FLUX_11);
    expect(next.effectiveModelId).not.toBe(GROK); // the bug: it used to jump back
  });
});

describe('"Use [model] anyway" — one-step undo to the model we just replaced', () => {
  // The sheet button restores the model that was just swapped away (the "from")
  // and flips DreamSmart off so it's allowed — a single step back, NOT a revert
  // to a model from turns ago. Modeled as: commit the target, then undo to `from`.
  it('restores the replaced model and it holds with DreamSmart off', () => {
    const from = GROK;
    // Glamour committed Flux 1.1 Pro (the swap target).
    const committed = resolveDreamSmartModel({
      currentModel: from,
      smartModels: GLAMOUR,
      models: CATALOG,
      dreamSmartOn: true,
    });
    expect(committed.effectiveModelId).toBe(FLUX_11);
    // "Use Grok anyway": set model back to `from` + DreamSmart off → Grok holds.
    const undone = resolveDreamSmartModel({
      currentModel: from, // app calls setSelectedModelId(from)
      smartModels: GLAMOUR,
      models: CATALOG,
      dreamSmartOn: false, // + persistDreamSmart(false)
    });
    expect(undone).toEqual({ effectiveModelId: GROK, swapped: false });
  });
});

describe('resolveDreamSmartModel — pure (no leaked state between calls)', () => {
  it('a prior swap target never leaks into the next resolution', () => {
    const currentModel = FLUX_2_MAX;
    resolveDreamSmartModel({
      currentModel,
      smartModels: COMICS,
      models: CATALOG,
      dreamSmartOn: true,
    });
    // Immediately resolving with DreamSmart off yields the current model verbatim.
    expect(
      resolveDreamSmartModel({
        currentModel,
        smartModels: COMICS,
        models: CATALOG,
        dreamSmartOn: false,
      }).effectiveModelId
    ).toBe(FLUX_2_MAX);
  });
});

describe('resolveDreamSmartModel — DreamSmart off / exempt / no set → hands off', () => {
  it('keeps an out-of-set pick when DreamSmart is OFF', () => {
    expect(
      resolveDreamSmartModel({
        currentModel: GROK,
        smartModels: GLAMOUR,
        models: CATALOG,
        dreamSmartOn: false,
      })
    ).toEqual({ effectiveModelId: GROK, swapped: false });
  });

  it('keeps the pick on exempt paths (Direct / restyle / new scene)', () => {
    expect(
      resolveDreamSmartModel({
        currentModel: GROK,
        smartModels: GLAMOUR,
        models: CATALOG,
        dreamSmartOn: true,
        exempt: true,
      })
    ).toEqual({ effectiveModelId: GROK, swapped: false });
  });

  it('keeps the pick when the style has no smart set', () => {
    expect(on(GROK, [])).toEqual({ effectiveModelId: GROK, swapped: false });
  });
});

describe('client ↔ server parity (price shown == price charged)', () => {
  // For an out-of-set pick the client fallback must equal the server coercion.
  const cases: Array<[string, string[]]> = [
    [FLUX_11, COMICS], // → Flux 2 Pro on both
    [GROK, GLAMOUR], // → Flux 1.1 Pro on both
    [FLUX_2_MAX, COMICS],
  ];
  it.each(cases)('resolve(%s) == coerce for the same set', (currentModel, smartModels) => {
    const set = smartDreamSet({ smart_dream_models: smartModels })!;
    const server = coerceSmartDream(currentModel, set, costOf);
    const client = resolveDreamSmartModel({
      currentModel,
      smartModels,
      models: CATALOG,
      dreamSmartOn: true,
    });
    expect(server.coerced).toBe(true);
    expect(client.swapped).toBe(true);
    expect(client.effectiveModelId).toBe(server.model);
  });
});
