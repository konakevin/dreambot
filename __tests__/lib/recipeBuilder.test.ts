/**
 * recipeBuilder.test.ts — Phase 1 unit tests for the DLT recipe builder.
 *
 * Tests both the TS Edge Function version (supabase/functions/_shared/recipeBuilder.ts)
 * and the Node bot-engine version (scripts/lib/recipeBuilder.js) for shape
 * parity. They MUST stay in sync — see docs/DLT_RECIPE_PLAN.md.
 *
 * Phase 1 contract:
 *   - Required fields throw when missing
 *   - Optional fields default to '' for string-typed and null for nullable
 *   - flux_seed normalizes string/number/null
 *   - Both implementations produce byte-identical output for same input
 *   - No cast/scene/subject fields exist (privacy invariant by construction)
 */

import {
  buildRecipe as buildRecipeTs,
  RECIPE_VERSION as TS_VERSION,
} from '../../supabase/functions/_shared/recipeBuilder';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  buildRecipe: buildRecipeJs,
  RECIPE_VERSION: JS_VERSION,
} = require('../../scripts/lib/recipeBuilder');

const MIN_CONTEXT = {
  model: 'black-forest-labs/flux-1.1-pro',
  mediumKey: 'plush_fabric',
  vibeKey: 'cozy',
  aiPrompt: 'a plush fox by a campfire, warm golden lighting, soft fabric texture, no text',
};

const FULL_CONTEXT = {
  ...MIN_CONTEXT,
  fluxSeed: 12345678,
  promptPrefix: 'plush stuffed-animal characters',
  mediumStyleOverride:
    'plush stuffed-animal characters — soft-fabric creatures with visible plush-fiber FUR',
  promptSuffix: 'no text, no watermark',
  camera: 'medium-wide eye-level shot',
  lighting: 'firelight + lantern-glow + golden-hour',
  scenePalette: 'forest campsite at dusk',
  colorPalette: 'amber, rust, cream, deep teal',
  chaosBlock: '\nCHAOS LAYER: silhouette distortion at 0.3 intensity',
  sensoryBlock: '\nSENSORY: warm woodsmoke, distant owl call',
  blowItUpBlock: '\nBLOW IT UP: max every element',
  botUsername: 'cuddlebot',
  path: 'plushie-life',
};

describe('buildRecipe (TS) — required fields', () => {
  it('throws when renderContext missing', () => {
    expect(() => buildRecipeTs(undefined as never)).toThrow();
  });
  it('throws when model missing', () => {
    expect(() => buildRecipeTs({ ...MIN_CONTEXT, model: '' } as never)).toThrow(/model/);
  });
  it('throws when mediumKey missing', () => {
    expect(() => buildRecipeTs({ ...MIN_CONTEXT, mediumKey: '' } as never)).toThrow(/mediumKey/);
  });
  it('throws when vibeKey missing', () => {
    expect(() => buildRecipeTs({ ...MIN_CONTEXT, vibeKey: '' } as never)).toThrow(/vibeKey/);
  });
  it('throws when aiPrompt missing', () => {
    expect(() => buildRecipeTs({ ...MIN_CONTEXT, aiPrompt: '' } as never)).toThrow(/aiPrompt/);
  });
});

describe('buildRecipe (TS) — defaults for missing optionals', () => {
  const r = buildRecipeTs(MIN_CONTEXT);
  it('version = 1', () => expect(r.version).toBe(1));
  it('model preserved', () => expect(r.model).toBe(MIN_CONTEXT.model));
  it('flux_seed = null when missing', () => expect(r.flux_seed).toBeNull());
  it('prompt_prefix = "" when missing', () => expect(r.prompt_prefix).toBe(''));
  it('medium_style_override = "" when missing', () => expect(r.medium_style_override).toBe(''));
  it('prompt_suffix = "" when missing', () => expect(r.prompt_suffix).toBe(''));
  it('camera = null when missing', () => expect(r.camera).toBeNull());
  it('lighting = "" when missing', () => expect(r.lighting).toBe(''));
  it('scene_palette = "" when missing', () => expect(r.scene_palette).toBe(''));
  it('color_palette = "" when missing', () => expect(r.color_palette).toBe(''));
  it('chaos_block = null when missing', () => expect(r.chaos_block).toBeNull());
  it('sensory_block = null when missing', () => expect(r.sensory_block).toBeNull());
  it('blow_it_up_block = null when missing', () => expect(r.blow_it_up_block).toBeNull());
  it('bot_username = null when missing', () => expect(r.bot_username).toBeNull());
  it('path = null when missing', () => expect(r.path).toBeNull());
  it('ai_prompt preserved verbatim', () => expect(r.ai_prompt).toBe(MIN_CONTEXT.aiPrompt));
});

describe('buildRecipe (TS) — full context', () => {
  const r = buildRecipeTs(FULL_CONTEXT);
  it('captures all look anchors', () => {
    expect(r.flux_seed).toBe(12345678);
    expect(r.medium_key).toBe('plush_fabric');
    expect(r.vibe_key).toBe('cozy');
    expect(r.prompt_prefix).toBe(FULL_CONTEXT.promptPrefix);
    expect(r.medium_style_override).toBe(FULL_CONTEXT.mediumStyleOverride);
    expect(r.prompt_suffix).toBe(FULL_CONTEXT.promptSuffix);
    expect(r.camera).toBe(FULL_CONTEXT.camera);
    expect(r.lighting).toBe(FULL_CONTEXT.lighting);
    expect(r.scene_palette).toBe(FULL_CONTEXT.scenePalette);
    expect(r.color_palette).toBe(FULL_CONTEXT.colorPalette);
    expect(r.chaos_block).toBe(FULL_CONTEXT.chaosBlock);
    expect(r.sensory_block).toBe(FULL_CONTEXT.sensoryBlock);
    expect(r.blow_it_up_block).toBe(FULL_CONTEXT.blowItUpBlock);
    expect(r.bot_username).toBe('cuddlebot');
    expect(r.path).toBe('plushie-life');
  });
  it('preserves ai_prompt verbatim', () => {
    expect(r.ai_prompt).toBe(FULL_CONTEXT.aiPrompt);
  });
});

describe('buildRecipe (TS) — flux_seed normalization', () => {
  it('numeric integer passes through', () => {
    const r = buildRecipeTs({ ...MIN_CONTEXT, fluxSeed: 42 });
    expect(r.flux_seed).toBe(42);
  });
  it('numeric float truncates to int', () => {
    const r = buildRecipeTs({ ...MIN_CONTEXT, fluxSeed: 42.7 });
    expect(r.flux_seed).toBe(42);
  });
  it('numeric string parses', () => {
    const r = buildRecipeTs({ ...MIN_CONTEXT, fluxSeed: '12345' });
    expect(r.flux_seed).toBe(12345);
  });
  it('non-numeric string → null', () => {
    const r = buildRecipeTs({ ...MIN_CONTEXT, fluxSeed: 'abc' });
    expect(r.flux_seed).toBeNull();
  });
  it('null → null', () => {
    const r = buildRecipeTs({ ...MIN_CONTEXT, fluxSeed: null });
    expect(r.flux_seed).toBeNull();
  });
  it('Infinity → null', () => {
    const r = buildRecipeTs({ ...MIN_CONTEXT, fluxSeed: Infinity });
    expect(r.flux_seed).toBeNull();
  });
});

describe('buildRecipe (TS) — empty-string optional → null where appropriate', () => {
  it('empty string camera → null', () => {
    const r = buildRecipeTs({ ...MIN_CONTEXT, camera: '' });
    expect(r.camera).toBeNull();
  });
  it('empty string chaos_block → null', () => {
    const r = buildRecipeTs({ ...MIN_CONTEXT, chaosBlock: '' });
    expect(r.chaos_block).toBeNull();
  });
});

describe('buildRecipe — TS/JS parity', () => {
  it('TS and JS RECIPE_VERSION match', () => {
    expect(TS_VERSION).toBe(JS_VERSION);
  });
  it('TS and JS produce byte-identical output for FULL_CONTEXT', () => {
    const tsOut = buildRecipeTs(FULL_CONTEXT);
    const jsOut = buildRecipeJs(FULL_CONTEXT);
    expect(JSON.stringify(jsOut)).toBe(JSON.stringify(tsOut));
  });
  it('TS and JS produce byte-identical output for MIN_CONTEXT', () => {
    const tsOut = buildRecipeTs(MIN_CONTEXT);
    const jsOut = buildRecipeJs(MIN_CONTEXT);
    expect(JSON.stringify(jsOut)).toBe(JSON.stringify(tsOut));
  });
});

describe('buildRecipe — privacy invariant', () => {
  // The privacy guarantee is architectural: there are NO cast/face/scene/
  // subject fields in the recipe schema, so it is impossible for source-cast
  // info to leak into a DLT render. This test asserts the schema shape.
  it('recipe has no cast/face/scene/subject fields', () => {
    const r = buildRecipeTs(FULL_CONTEXT);
    const keys = Object.keys(r);
    const forbidden = [
      'cast',
      'face',
      'subject',
      'scene_text',
      'cast_text',
      'source_cast_role',
      'user_id',
      'photo_url',
      'face_swap',
    ];
    for (const f of forbidden) {
      expect(keys).not.toContain(f);
    }
    // Sanity: known keys are present
    expect(keys).toContain('medium_key');
    expect(keys).toContain('vibe_key');
    expect(keys).toContain('ai_prompt');
  });
});

describe('buildRecipe — snapshot (cuddlebot plushie-life representative)', () => {
  it('matches expected shape', () => {
    const r = buildRecipeTs(FULL_CONTEXT);
    expect(r).toMatchInlineSnapshot(`
{
  "ai_prompt": "a plush fox by a campfire, warm golden lighting, soft fabric texture, no text",
  "blow_it_up_block": "
BLOW IT UP: max every element",
  "bot_username": "cuddlebot",
  "camera": "medium-wide eye-level shot",
  "chaos_block": "
CHAOS LAYER: silhouette distortion at 0.3 intensity",
  "color_palette": "amber, rust, cream, deep teal",
  "flux_seed": 12345678,
  "lighting": "firelight + lantern-glow + golden-hour",
  "medium_key": "plush_fabric",
  "medium_style_override": "plush stuffed-animal characters — soft-fabric creatures with visible plush-fiber FUR",
  "model": "black-forest-labs/flux-1.1-pro",
  "path": "plushie-life",
  "prompt_prefix": "plush stuffed-animal characters",
  "prompt_suffix": "no text, no watermark",
  "scene_palette": "forest campsite at dusk",
  "sensory_block": "
SENSORY: warm woodsmoke, distant owl call",
  "version": 1,
  "vibe_key": "cozy",
}
`);
  });
});
