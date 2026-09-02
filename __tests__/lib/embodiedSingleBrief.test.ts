/**
 * Embodied single-cast prompt fidelity — routing + sacred-user-prompt locks.
 *
 * The bug (2026-09-02): dream-art (embodied) single-cast renders dropped the
 * user's named companions/objects ("me snuggling my bichon + shih tzu" → just
 * the woman; fairytale even invented a prince). Face-swap singles never did,
 * because buildSingleBrief declares the user prompt SACRED with a 40% scene
 * budget while embodied singles fell to the older character-dominant generic
 * compiler. Controlled test: face-swap kept book/bird/cat, generic embodied
 * dropped bird + cat.
 *
 * These tests lock the fix:
 *   1. ROUTING — embodied single + user prompt → buildEmbodiedSingleBrief;
 *      anime (tag format) and promptless dreams keep their existing paths.
 *   2. BRIEF CONTRACT — sacred block carries the user's words, named elements
 *      are mandatory, no invented people, never rendered ON a screen.
 *   3. The species-preserving prompt clean ("my fluffy cat" → "a fluffy cat")
 *      is locked in selfInsertDetector.test.ts.
 */

import { compilePrompt, usesTagFormat } from '@engine/promptCompiler';
import { buildEmbodiedSingleBrief } from '@engine/embodiedSingleBriefBuilder';
import type { CompilerInput } from '@engine/promptCompiler';
import type { ResolvedCastMember } from '@engine/castResolver';

const SELF: ResolvedCastMember = {
  role: 'self',
  promptDesc: 'a woman in her early 40s with chestnut brown hair and hazel-green eyes',
  genderLock: 'FEMALE — a woman',
  gender: 'female',
  sourcePhotoUrl: 'https://example.com/self.jpg',
  physicalTraits: 'chestnut brown hair, hazel-green eyes, average build',
};

function input(over: Partial<CompilerInput> = {}): CompilerInput {
  return {
    inputType: 'self_insert',
    medium: {
      key: 'fairytale',
      directive: 'Render as a hand-drawn fairytale film.',
      fluxFragment: 'gorgeous hand-drawn 2D fairytale-film animation',
      characterRenderMode: 'embodied',
      faceSwaps: false,
    },
    vibe: { key: 'cozy', directive: 'Warm and comforting.' },
    scene: { userPrompt: 'snuggling a bichon and a shih tzu on the couch watching tv' },
    cast: [SELF],
    composition: {
      type: 'character',
      faceSwapEligible: false,
      shotDirection: 'medium shot',
      focalAnchor: 'the main character',
    },
    ...over,
  };
}

describe('routing — embodied single with a user prompt takes the sacred path', () => {
  it('embodied single + user prompt → sacred brief', () => {
    const out = compilePrompt(input());
    expect(out.sonnetBrief).toContain('USER PROMPT — SACRED');
    expect(out.sonnetBrief).toContain('snuggling a bichon and a shih tzu');
  });

  it('promptless embodied single keeps the generic invent-a-scene flow', () => {
    const out = compilePrompt(input({ scene: {} }));
    expect(out.sonnetBrief).not.toContain('USER PROMPT — SACRED');
  });

  it('anime keeps its danbooru tag format (never a prose sacred brief)', () => {
    const out = compilePrompt(
      input({
        medium: {
          key: 'anime',
          directive: 'Anime.',
          fluxFragment: 'anime illustration',
          characterRenderMode: 'embodied',
          faceSwaps: false,
        },
      })
    );
    expect(out.sonnetBrief).toContain('danbooru');
    expect(out.sonnetBrief).not.toContain('USER PROMPT — SACRED');
    expect(usesTagFormat({ key: 'anime' })).toBe(true);
    expect(usesTagFormat({ key: 'fairytale' })).toBe(false);
  });

  it('natural (face-swap) single still routes to the face-swap brief, not the embodied one', () => {
    const out = compilePrompt(
      input({
        medium: {
          key: 'photography',
          directive: 'A photograph.',
          fluxFragment: 'professional photograph',
          characterRenderMode: 'natural',
          faceSwaps: true,
        },
        composition: {
          type: 'character',
          faceSwapEligible: true,
          shotDirection: 'medium shot',
          focalAnchor: 'the main character',
        },
      })
    );
    // Face-swap brief keeps its detector-safety mandate; embodied brief has none.
    expect(out.sonnetBrief).toContain('EXACTLY ONE PERSON');
    expect(out.postProcess.appendFaceLock).toBe(true);
  });
});

describe("brief contract — the user's words win", () => {
  const out = buildEmbodiedSingleBrief(input());

  it('every named element is mandatory, pets are living animals in the scene', () => {
    expect(out.sonnetBrief).toContain('EVERY ONE of them MUST appear');
    expect(out.sonnetBrief).toMatch(/living animal IN the scene/i);
  });

  it("gives the user's scene a real word budget ahead of the character", () => {
    expect(out.sonnetBrief).toMatch(/THE USER'S SCENE \(40% of words\)/);
  });

  it('forbids invented people (the prince-charming failure) but requires named animals', () => {
    expect(out.sonnetBrief).toContain('Do NOT add any person the user did not mention');
    expect(out.sonnetBrief).toContain('Named ANIMALS are required');
  });

  it('person is IN the scene, never rendered ON a screen (the on-the-TV failure)', () => {
    expect(out.sonnetBrief).toMatch(/NEVER render them as an image ON a screen/i);
  });

  it('keeps the likeness block and the transform-everything style rule', () => {
    expect(out.sonnetBrief).toContain('CHARACTER (self)');
    expect(out.sonnetBrief).toContain('chestnut brown hair');
    expect(out.sonnetBrief).toContain('TRANSFORM EVERYTHING');
  });

  it('no face-swap machinery: no swap source, no face lock append', () => {
    expect(out.faceSwapSource).toBeNull();
    expect(out.postProcess.appendFaceLock).toBe(false);
  });

  it("fallback prompt still carries the user's request verbatim", () => {
    expect(out.fallbackPrompt).toContain('snuggling a bichon and a shih tzu');
  });

  it('rejects non-embodied or multi-cast input (routing safety)', () => {
    expect(() =>
      buildEmbodiedSingleBrief(
        input({
          medium: {
            key: 'photography',
            directive: 'x',
            fluxFragment: 'x',
            characterRenderMode: 'natural',
            faceSwaps: true,
          },
        })
      )
    ).toThrow();
    expect(() => buildEmbodiedSingleBrief(input({ cast: [SELF, SELF] }))).toThrow();
  });
});
