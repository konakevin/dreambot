/**
 * Tests for promptCompiler — unified brief builder for V2 dream generation.
 *
 * Tests cover compilePrompt(), postProcessPrompt(), sanitizeUserPrompt(),
 * and deriveFocalAnchor().
 */

import {
  compilePrompt,
  postProcessPrompt,
  sanitizeUserPrompt,
  deriveFocalAnchor,
} from '@engine/promptCompiler';
import type { CompilerInput, CompilerOutput } from '@engine/promptCompiler';
import type { ResolvedCastMember } from '@engine/castResolver';

// ── Helpers ──

function makeCast(overrides?: Partial<ResolvedCastMember>): ResolvedCastMember {
  return {
    role: 'self',
    promptDesc: 'a 35-year-old man with brown hair, blue eyes, athletic build',
    genderLock: 'MALE — this subject is a man. Do NOT feminize. No dresses, gowns, skirts.',
    sourcePhotoUrl: 'https://example.com/face.jpg',
    ...overrides,
  };
}

function makeInput(overrides?: Partial<CompilerInput>): CompilerInput {
  return {
    inputType: 'text_directive',
    medium: {
      key: 'watercolor',
      directive:
        'Render everything in loose watercolor washes. Soft edges. Pigment bleeds. Visible paper texture beneath transparent layers.',
      fluxFragment: 'watercolor painting, soft washes, pigment bleeds',
      characterRenderMode: 'natural',
      faceSwaps: false,
    },
    vibe: {
      key: 'dreamy',
      directive: 'Soft focus, pastel glow, floating elements, gentle light.',
    },
    scene: {
      userPrompt: 'a fox sitting on a mossy log in an enchanted forest',
    },
    cast: [],
    composition: {
      type: 'pure_scene',
      faceSwapEligible: false,
      shotDirection: 'wide establishing shot, full environment visible',
      focalAnchor: 'the fox on the mossy log',
    },
    ...overrides,
  };
}

// ── compilePrompt ──

describe('compilePrompt', () => {
  it('self_insert: brief contains CHARACTER section and face lock instructions', () => {
    const cast = [makeCast()];
    const input = makeInput({
      inputType: 'self_insert',
      cast,
      composition: {
        type: 'character',
        faceSwapEligible: true,
        shotDirection: 'medium shot, waist up',
        focalAnchor: 'the main character',
      },
    });

    const output = compilePrompt(input);
    expect(output.sonnetBrief).toContain('CHARACTER');
    expect(output.sonnetBrief).toContain('GENDER');
    expect(output.sonnetBrief).toContain('MALE');
    expect(output.sonnetBrief).toContain('watercolor painting, soft washes');
    expect(output.postProcess.appendFaceLock).toBe(true);
  });

  it('text_directive: brief has NO CHARACTER section, has SCENE section', () => {
    const input = makeInput({ inputType: 'text_directive' });
    const output = compilePrompt(input);
    expect(output.sonnetBrief).toContain('SCENE (SACRED');
    expect(output.sonnetBrief).toContain('a fox sitting on a mossy log');
    expect(output.sonnetBrief).not.toContain('CHARACTER');
  });

  it('style_transfer: brief contains REFERENCE STYLE section with styleReference', () => {
    const input = makeInput({
      inputType: 'style_transfer',
      scene: {
        userPrompt: 'a dragon on a cliff',
        styleReference: 'dark moody oil painting with dramatic chiaroscuro lighting',
      },
    });

    const output = compilePrompt(input);
    expect(output.sonnetBrief).toContain('REFERENCE STYLE');
    expect(output.sonnetBrief).toContain('dark moody oil painting');
    expect(output.sonnetBrief).toContain('Copy VISUAL STYLE, not subject');
  });

  it('includes NEVER INCLUDE section when avoid list is provided', () => {
    const input = makeInput({
      profile: { avoid: ['text', 'watermarks', 'nudity'] },
    });

    const output = compilePrompt(input);
    expect(output.sonnetBrief).toContain('NEVER INCLUDE');
    expect(output.sonnetBrief).toContain('text, watermarks, nudity');
  });

  it('fallbackPrompt starts with fluxFragment', () => {
    const input = makeInput();
    const output = compilePrompt(input);
    expect(output.fallbackPrompt.startsWith('watercolor painting, soft washes')).toBe(true);
    expect(output.fallbackPrompt).toContain('no text, no words');
  });

  it('self_insert with faceSwapEligible + cast returns faceSwapSource URL', () => {
    const cast = [makeCast()];
    const input = makeInput({
      inputType: 'self_insert',
      cast,
      composition: {
        type: 'character',
        faceSwapEligible: true,
        shotDirection: 'medium shot',
        focalAnchor: 'the main character',
      },
    });

    const output = compilePrompt(input);
    expect(output.faceSwapSource).toBe('https://example.com/face.jpg');
  });

  it('text_directive returns null faceSwapSource even with cast', () => {
    const input = makeInput({
      inputType: 'text_directive',
      composition: {
        type: 'pure_scene',
        faceSwapEligible: false,
        shotDirection: 'wide shot',
        focalAnchor: 'the scene',
      },
    });

    const output = compilePrompt(input);
    expect(output.faceSwapSource).toBeNull();
  });

  it('maxTokens is always 200', () => {
    const sceneInput = makeInput();
    expect(compilePrompt(sceneInput).maxTokens).toBe(200);

    const charInput = makeInput({
      cast: [makeCast()],
      composition: {
        type: 'character',
        faceSwapEligible: false,
        shotDirection: 'medium shot',
        focalAnchor: 'the main character',
      },
    });
    expect(compilePrompt(charInput).maxTokens).toBe(200);
  });
});

// ── postProcessPrompt ──

describe('postProcessPrompt', () => {
  it('appends face lock phrase when appendFaceLock is true', () => {
    const result = postProcessPrompt('anime warrior in rain', {
      appendFaceLock: true,
      appendPortraitTags: false,
    });
    expect(result).toContain('front-facing subject facing the camera');
    expect(result).toContain('eyes visible');
  });

  it('appends portrait tags when appendPortraitTags is true', () => {
    const result = postProcessPrompt('watercolor forest scene', {
      appendFaceLock: false,
      appendPortraitTags: true,
    });
    expect(result).toContain('foreground midground background stacked top to bottom');
    expect(result).toContain('layered depth');
  });

  it('does not duplicate portrait tags if already present', () => {
    const prompt = 'scene with foreground midground background already included';
    const result = postProcessPrompt(prompt, {
      appendFaceLock: false,
      appendPortraitTags: true,
    });
    // Count occurrences — should appear exactly once (the original)
    const count = (result.match(/foreground midground background/g) || []).length;
    expect(count).toBe(1);
  });

  it('appends nothing when both flags are false', () => {
    const prompt = 'plain prompt text';
    const result = postProcessPrompt(prompt, {
      appendFaceLock: false,
      appendPortraitTags: false,
    });
    expect(result).toBe('plain prompt text');
  });
});

// ── sanitizeUserPrompt ──

describe('sanitizeUserPrompt', () => {
  it('strips leading/trailing whitespace', () => {
    expect(sanitizeUserPrompt('  hello world  ')).toBe('hello world');
  });

  it('collapses double spaces', () => {
    expect(sanitizeUserPrompt('hello   world   foo')).toBe('hello world foo');
  });

  it('removes curly braces, brackets, angle brackets', () => {
    expect(sanitizeUserPrompt('hello {world} [test] <foo>')).toBe('hello world test foo');
  });

  it('converts newlines to spaces', () => {
    expect(sanitizeUserPrompt('line one\nline two\r\nline three')).toBe(
      'line one line two line three'
    );
  });

  it('truncates to 240 characters', () => {
    const long = 'a'.repeat(300);
    expect(sanitizeUserPrompt(long).length).toBe(240);
  });
});

// ── deriveFocalAnchor ──

describe('deriveFocalAnchor', () => {
  it('returns character-based anchor with single cast member', () => {
    const result = deriveFocalAnchor([makeCast()], {});
    expect(result).toBe('the main character');
  });

  it('returns interaction anchor with multiple cast members', () => {
    const result = deriveFocalAnchor([makeCast(), makeCast({ role: 'plus_one' })], {});
    expect(result).toBe('the interaction between the characters');
  });

  it('returns object anchor when no cast but objectDirective present', () => {
    const result = deriveFocalAnchor([], { objectDirective: 'a glowing crystal orb' });
    expect(result).toBe('the scene object');
  });

  it('returns generic scene anchor when no cast and no object', () => {
    const result = deriveFocalAnchor([], {});
    expect(result).toContain('single dominant visual subject');
  });
});
