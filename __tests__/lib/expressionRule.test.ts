/**
 * Tests for the USER INTENT — EXPRESSION & POSE rule injected into Sonnet briefs.
 *
 * Added 2026-05-02 to honor user-specified facial expressions ("scared",
 * "frowning") AND user-specified actions ("walking", "running", "dancing")
 * in freeform prompts — translating both into physical descriptors and
 * cinematic framing in the Flux render.
 *
 * What we CAN test deterministically:
 *  - The block appears in the brief when (and only when) it should.
 *  - Expression and action override language is present (must defeat the
 *    pre-existing "warm / facing camera / stationary" defaults baked into
 *    other parts of the brief).
 *  - The dual-cast version preserves face-swap-critical constraints (L/R
 *    separation, faces visible at 3/4) even under motion override.
 *  - Both single-cast and dual-cast paths inject the rule.
 *  - Pure-scene (no character) does NOT inject the rule.
 *
 * What we CAN'T test here:
 *  - Whether Sonnet honors the rule (model behavior — needs an integration
 *    test against the live Anthropic API).
 *  - Whether the rendered image actually shows the expression/action.
 *  - Whether face swap survives the new motion poses (cdingram behavior).
 */

import { compilePrompt } from '@engine/promptCompiler';
import type { CompilerInput } from '@engine/promptCompiler';
import type { ResolvedCastMember } from '@engine/castResolver';

function makeCast(overrides?: Partial<ResolvedCastMember>): ResolvedCastMember {
  return {
    role: 'self',
    promptDesc: 'a 35-year-old man with brown hair, blue eyes, athletic build',
    genderLock: 'MALE — this subject is a man. Do NOT feminize.',
    sourcePhotoUrl: 'https://example.com/face.jpg',
    ...overrides,
  };
}

function makePlusOne(overrides?: Partial<ResolvedCastMember>): ResolvedCastMember {
  return {
    role: 'plus_one',
    promptDesc: 'a 33-year-old woman with auburn hair, green eyes',
    genderLock: 'FEMALE — this subject is a woman.',
    sourcePhotoUrl: 'https://example.com/face2.jpg',
    ...overrides,
  };
}

function makeInput(overrides?: Partial<CompilerInput>): CompilerInput {
  return {
    inputType: 'self_insert',
    medium: {
      key: 'watercolor',
      directive: 'Loose watercolor washes. Soft edges. Visible paper texture.',
      fluxFragment: 'watercolor painting, soft washes, pigment bleeds',
      characterRenderMode: 'natural',
      faceSwaps: true,
    },
    vibe: {
      key: 'dreamy',
      directive: 'Soft focus, pastel glow, gentle light.',
    },
    scene: {
      userPrompt: 'put me in a haunted forest',
    },
    cast: [makeCast()],
    composition: {
      type: 'character',
      faceSwapEligible: true,
      shotDirection: 'medium shot, waist up',
      focalAnchor: 'the main character',
    },
    ...overrides,
  };
}

// ── Single-cast path ──

describe('USER INTENT rule — single cast brief', () => {
  it('injects the block when userPrompt + cast are both present', () => {
    const output = compilePrompt(makeInput());
    expect(output.sonnetBrief).toContain('USER INTENT');
    expect(output.sonnetBrief).toContain('EXPRESSION');
    expect(output.sonnetBrief).toContain('ACTION');
  });

  it('uses strong override language so it wins against default cues', () => {
    const output = compilePrompt(makeInput());
    // Each clause (expression / action / hand gesture) has its own OVERRIDES marker
    const overridesCount = (output.sonnetBrief.match(/OVERRIDES/g) || []).length;
    expect(overridesCount).toBeGreaterThanOrEqual(3);
  });

  it('includes the hand gesture clause with shaka spelled out (Flux mis-renders "shaka" otherwise)', () => {
    const output = compilePrompt(makeInput());
    expect(output.sonnetBrief).toContain('HAND GESTURE');
    expect(output.sonnetBrief).toContain('shaka');
    expect(output.sonnetBrief).toContain('FINGER GEOMETRY');
    expect(output.sonnetBrief).toContain('thumb and pinky extended');
    // The bird is explicitly allowed
    expect(output.sonnetBrief).toMatch(/middle finger|the bird/i);
  });

  it('lists representative expression keywords (the dictionary that Sonnet draws from)', () => {
    const output = compilePrompt(makeInput());
    expect(output.sonnetBrief).toContain('scared');
    expect(output.sonnetBrief).toContain('joyful');
    expect(output.sonnetBrief).toContain('sultry');
    // physical descriptor mentioned so Sonnet has the translation hint
    expect(output.sonnetBrief).toMatch(/eyes \/ brows \/ mouth/);
  });

  it('lists representative action keywords (Sonnet does the rest)', () => {
    const output = compilePrompt(makeInput());
    expect(output.sonnetBrief).toContain('walking');
    expect(output.sonnetBrief).toContain('running');
    expect(output.sonnetBrief).toContain('dancing');
    expect(output.sonnetBrief).toContain('sitting');
  });

  it('mandates documentary candid framing for actions, not posed studio', () => {
    const output = compilePrompt(makeInput());
    // singleBriefBuilder (2026-05-30) phrases the candid mandate as
    // 'documentary candid framing' but drops the explicit 'NOT a posed
    // studio' phrase in favor of the more concrete 'tracking 3/4 angle,
    // like a film still' language. Same semantic intent — film-still
    // candid framing rather than posed studio shot.
    expect(output.sonnetBrief).toMatch(/documentary candid/i);
    expect(output.sonnetBrief).toMatch(/NOT a posed studio|like a film still|tracking.*angle/i);
  });

  it('preserves face-visibility floor even under motion override (must remain face-swappable)', () => {
    const output = compilePrompt(makeInput());
    // Single-cast face-swap now routes to singleBriefBuilder (2026-05-30)
    // which uses different wording — same semantic intent. Match against the
    // INTENT rather than the prior generic-compiler wording.
    expect(output.sonnetBrief).toMatch(/3\/4 toward camera/i); // motion clause keeps 3/4 framing
    expect(output.sonnetBrief).toMatch(
      /face still partially visible|face fully visible|eyes.*visible/i
    );
    expect(output.sonnetBrief).toMatch(/never from behind|no full back views|not.*back to camera/i);
  });

  it('does NOT inject the rule when there is no cast (pure scene — no body to pose)', () => {
    const output = compilePrompt(
      makeInput({
        inputType: 'text_directive',
        cast: [],
        composition: {
          type: 'pure_scene',
          faceSwapEligible: false,
          shotDirection: 'wide establishing shot',
          focalAnchor: 'the haunted forest',
        },
      })
    );
    expect(output.sonnetBrief).not.toContain('USER INTENT');
  });

  it('does NOT inject the rule when there is no userPrompt', () => {
    const output = compilePrompt(makeInput({ scene: {} }));
    expect(output.sonnetBrief).not.toContain('USER INTENT');
  });
});

// ── Dual-cast path ──

describe('USER INTENT rule — dual cast brief', () => {
  function makeDualInput(overrides?: Partial<CompilerInput>): CompilerInput {
    return makeInput({
      cast: [makeCast(), makePlusOne()],
      composition: {
        type: 'character',
        faceSwapEligible: true,
        shotDirection: 'medium shot, waist up, both characters',
        focalAnchor: 'the interaction between the characters',
      },
      ...overrides,
    });
  }

  it('injects the block when userPrompt is present', () => {
    const output = compilePrompt(makeDualInput());
    expect(output.sonnetBrief).toContain('USER INTENT');
    expect(output.sonnetBrief).toContain('EXPRESSION');
    expect(output.sonnetBrief).toContain('ACTION');
  });

  it('uses strong override language for expression, action, and hand gesture', () => {
    const output = compilePrompt(makeDualInput());
    const overrides = (output.sonnetBrief.match(/OVERRIDES/g) || []).length;
    expect(overrides).toBeGreaterThanOrEqual(2);
  });

  it('dual brief also includes the hand gesture clause with finger-geometry hint', () => {
    const output = compilePrompt(makeDualInput());
    expect(output.sonnetBrief).toContain('HAND GESTURE');
    expect(output.sonnetBrief).toContain('shaka');
    expect(output.sonnetBrief).toContain('FINGER GEOMETRY');
    expect(output.sonnetBrief).toMatch(/different gestures per character/i);
  });

  it('handles per-character expression assignment for the L/R characters', () => {
    const output = compilePrompt(makeDualInput());
    expect(output.sonnetBrief).toMatch(/different expressions/i);
    expect(output.sonnetBrief).toMatch(/LEFT\/RIGHT/);
  });

  it('preserves the dual L/R face-swap constraint INSIDE the action override (the critical bit)', () => {
    // This is the load-bearing test. When motion is allowed, it MUST NOT
    // collapse the face-swap requirements: characters stay in L/R halves,
    // faces stay 3/4-toward-camera, characters stay synchronized side-by-
    // side (NOT one ahead — that breaks the 55% crop).
    const output = compilePrompt(makeDualInput());
    expect(output.sonnetBrief).toMatch(/L\/R halves/);
    expect(output.sonnetBrief).toMatch(/3\/4 toward camera/i);
    expect(output.sonnetBrief).toMatch(/synchronized parallel motion/i);
    expect(output.sonnetBrief).toMatch(/NOT one ahead/i);
    expect(output.sonnetBrief).toMatch(/never pure profile/i);
    expect(output.sonnetBrief).toMatch(/never from behind/i);
  });

  it('replaces the OLD "Characters are STATIONARY" hard rule with the conditional override', () => {
    // The old rule blanket-banned motion. The new rule says "default
    // STATIONARY UNLESS user specified an action — see ACTION/POSE RULE".
    const output = compilePrompt(makeDualInput());
    expect(output.sonnetBrief).toMatch(/default to STATIONARY/i);
    expect(output.sonnetBrief).toMatch(/UNLESS the user prompt specifies an action/i);
    // Old phrasing is gone
    expect(output.sonnetBrief).not.toMatch(/^Characters are STATIONARY — standing/m);
  });

  it('does NOT inject the rule when there is no userPrompt', () => {
    const output = compilePrompt(makeDualInput({ scene: {} }));
    expect(output.sonnetBrief).not.toContain('USER INTENT');
  });

  it('still uses dualFaceSwap postProcess regardless of intent rule', () => {
    const output = compilePrompt(makeDualInput());
    expect(output.postProcess.dualFaceSwap).toBe(true);
    expect(output.faceSwapSources).toHaveLength(2);
  });
});

// ── Realistic user inputs (the actual bug reports) ──

describe('USER INTENT rule — realistic user prompts', () => {
  it('honors the expression bug example ("scared with a frowny face")', () => {
    const output = compilePrompt(
      makeInput({
        scene: { userPrompt: 'put me in a haunted forest, scared with a frowny face' },
      })
    );
    expect(output.sonnetBrief).toContain('USER INTENT');
    expect(output.sonnetBrief).toContain('scared');
  });

  it('honors the action bug example ("walking down the street")', () => {
    const output = compilePrompt(
      makeInput({
        scene: { userPrompt: 'show me walking down the street' },
      })
    );
    expect(output.sonnetBrief).toContain('USER INTENT');
    expect(output.sonnetBrief).toContain('walking');
    // The action rule must defeat the existing "medium shot waist-up" stationary cue
    expect(output.sonnetBrief).toMatch(/documentary candid/i);
  });

  it('handles combined intent (expression + action in same prompt)', () => {
    // Both rules fire from a single block — Sonnet handles both naturally
    const output = compilePrompt(
      makeInput({
        scene: { userPrompt: 'me running through the rain looking terrified' },
      })
    );
    expect(output.sonnetBrief).toContain('USER INTENT');
    // The single block covers both clauses
    expect(output.sonnetBrief).toContain('EXPRESSION');
    expect(output.sonnetBrief).toContain('ACTION');
  });

  it('the rule fires unconditionally on userPrompt presence (Sonnet decides applicability)', () => {
    // We don't pre-detect in code — too brittle. The block costs ~6 lines
    // when there's no expression/action either; Sonnet just ignores the
    // irrelevant clauses. Cheap and robust.
    const inputs = [
      'a portrait of me at sunset', // no expression, no action
      'me dancing in a meadow', // action only
      'me looking sad at the window', // expression only
      'angry me running through fire', // both
    ];
    for (const prompt of inputs) {
      const output = compilePrompt(makeInput({ scene: { userPrompt: prompt } }));
      expect(output.sonnetBrief).toContain('USER INTENT');
    }
  });
});
