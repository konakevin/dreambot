/**
 * LOOKS_MINIMAL is a FIX GRAVEYARD — this guards the three fixes that fell into it.
 *
 * `looksPath = looksMode === 'on' && !LOOKS_MINIMAL` (nightly-dreams/index.ts). LOOKS_MINIMAL is `true`, so
 * looksPath is ALWAYS false in production, and the style contract is built and then thrown away:
 *
 *     } else if (!looksPath) {
 *       fallbackReasons.push(shadowStamp(contract));   // built, stamped, discarded
 *     }
 *
 * So LOOKS_MINIMAL does not mean "a lighter looks engine". It means "take the model pick, discard the looks
 * engine". Anything written inside `looksSlotInputFields` reaches ZERO renders while it is true, and it fails
 * SILENTLY: the render succeeds, the stamps look healthy, only the pixels are wrong.
 *
 * Three fixes have now been found dead in there, each after Kevin reported the symptom the fix was written for:
 *
 *   1. the vibe fragment          reached 0 of 50 nightlies          (found 2026-09-16)
 *   2. lookNeutralFraming         look ignored 78% of the time       (found 2026-09-16)
 *   3. the flux couple order      22/22 duals on the wrong order     (found 2026-09-17)
 *
 * #3 is the one this file was written for. `looksCouplePromptStyle` gives FLUX couples the album's LEGACY
 * order — it was shipped 2026-09-13 in answer to "a lot of these flux couple renders are really close up and
 * together … my last 30 public posts are flux, yet don't have this constraint", and then reached nothing,
 * because it was gated on looksPath. Kevin filed the SAME report four days later.
 *
 * These are source guards, not behaviour tests: the failure mode is a line that never executes, which a unit
 * test of the function itself cannot see (each of these functions passed its own tests while inert).
 */
import fs from 'fs';
import path from 'path';

const NIGHTLY_SRC = fs.readFileSync(
  path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
  'utf8'
);
const LOOKS_SRC = fs.readFileSync(
  path.join(__dirname, '..', '..', 'supabase', 'functions', '_shared', 'nightlyLooksPath.ts'),
  'utf8'
);
const strip = (s: string) => s.replace(/\s+/g, ' ');

describe('the per-model couple ORDER survives LOOKS_MINIMAL', () => {
  it('the minimal path resolves promptStyle from its own model, not from engine_config alone', () => {
    // The regression in one assertion. `looksPath ? looksCouplePromptStyle(looksModel) : <config>` sends every
    // minimal render to the config value — which is one global string and cannot express "flux differs".
    expect(strip(NIGHTLY_SRC)).toContain('? looksCouplePromptStyle(looksModel) : minimalModel');
    expect(strip(NIGHTLY_SRC)).toContain('? looksCouplePromptStyle(minimalModel)');
  });

  it('and engine_config is only the LAST resort, when no model is known', () => {
    const block = NIGHTLY_SRC.match(/promptStyle:\s*\n\s*force_prompt_style \?\?[\s\S]{0,400}?,\n/);
    expect(block).toBeTruthy();
    const b = strip(block![0]);
    // Presence FIRST: without this, a missing call makes indexOf return -1 and every ordering
    // assertion below passes vacuously — which is exactly what happened on the first draft of this test.
    expect(b).toContain('looksCouplePromptStyle(minimalModel)');
    expect(b).toContain('sfaCfgCloser.couplePromptStyle');
    // Order matters: QA flag, then looks path, then minimal's model, then config.
    expect(b.indexOf('force_prompt_style')).toBeLessThan(b.indexOf('looksCouplePromptStyle'));
    expect(b.indexOf('looksCouplePromptStyle(minimalModel)')).toBeLessThan(
      b.indexOf('sfaCfgCloser.couplePromptStyle')
    );
  });

  it('minimalModel is what actually renders, so reading it here is not a guess', () => {
    // If this line stops falling back to minimalModel, the order above would be chosen from a model the
    // render never uses — worse than the bug it replaced, and invisible in the stamps.
    expect(strip(NIGHTLY_SRC)).toContain(
      ': faceSwapPrePickedModel || minimalModel || sceneBaseModelResolved'
    );
  });
});

describe('the flux couple rule itself', () => {
  it('flux couples get the album LEGACY order, everyone else subject_first', () => {
    expect(strip(LOOKS_SRC)).toContain(
      "return model && /flux/i.test(model) ? 'legacy' : 'subject_first'"
    );
  });

  it('gemini and grok are NOT swept into legacy — they measured 40/40 first swaps on subject_first', () => {
    // A blanket `couple_prompt_style = legacy` config flip would have done exactly that. It is the reason
    // this is a per-model function and not a config value.
    const fn = LOOKS_SRC.match(/export function looksCouplePromptStyle[\s\S]*?\n}/);
    expect(fn).toBeTruthy();
    expect(fn![0]).not.toMatch(/gemini|grok/i);
  });
});

describe('the two earlier casualties stay patched forward', () => {
  it('the vibe fragment is carried on the minimal branch', () => {
    // Found 2026-09-16 after reaching 0 of 50 nightlies. Lives in the `looksFields ? {} : {...}` escape hatch.
    expect(strip(NIGHTLY_SRC)).toContain('vibeFragment: looksVibeFragment');
    expect(strip(NIGHTLY_SRC)).toContain('vibeFragmentPosition: looksVibePosition');
  });

  it('lookNeutralFraming is carried on the minimal branch', () => {
    // Found 2026-09-16: the framing boilerplate says "photograph" 3x after naming the look, so a painted look
    // is outvoted in its own prompt. 2/9 -> 7/9 when on.
    expect(strip(NIGHTLY_SRC)).toContain('lookNeutralFraming: true');
  });

  it('all three live in the SAME escape hatch, so the pattern is greppable', () => {
    // Whoever adds the fourth one should find the other three sitting together.
    const hatch = NIGHTLY_SRC.match(/\.\.\.\(looksFields\s*\n?\s*\?\s*\{\}[\s\S]*?\}\),/);
    expect(hatch).toBeTruthy();
    expect(hatch![0]).toContain('vibeFragment');
    expect(hatch![0]).toContain('lookNeutralFraming');
  });
});
