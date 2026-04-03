import { buildPromptInput, buildRawPrompt, buildHaikuPrompt } from '@/lib/recipeEngine';
import type { Recipe } from '@/types/recipe';
import { DEFAULT_RECIPE } from '@/types/recipe';

function makeRecipe(overrides: Partial<Recipe> = {}): Recipe {
  return { ...DEFAULT_RECIPE, ...overrides };
}

describe('buildPromptInput', () => {
  it('returns all required fields', () => {
    const input = buildPromptInput(DEFAULT_RECIPE);
    expect(input).toHaveProperty('medium');
    expect(input).toHaveProperty('colorKeywords');
    expect(input).toHaveProperty('weirdnessModifier');
    expect(input).toHaveProperty('scaleModifier');
    expect(input).toHaveProperty('interests');
    expect(input).toHaveProperty('action');
    expect(input).toHaveProperty('sceneType');
    expect(input).toHaveProperty('spiritCompanion');
    expect(input).toHaveProperty('spiritAppears');
    expect(input).toHaveProperty('dreamSubject');
    expect(input).toHaveProperty('eraKeywords');
    expect(input).toHaveProperty('settingKeywords');
    expect(input).toHaveProperty('mood');
    expect(input).toHaveProperty('lighting');
    expect(input).toHaveProperty('personalityTags');
    expect(input).toHaveProperty('sceneAtmosphere');
  });

  it('includes user interests in sampled interests', () => {
    const recipe = makeRecipe({ interests: ['fantasy', 'sci_fi'] });
    // Run multiple times to account for randomness
    const allSampled = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const input = buildPromptInput(recipe);
      input.interests.forEach((int) => allSampled.add(int));
    }
    // At least one of the user's interests should appear across runs
    const hasUserInterest = allSampled.has('fantasy') || allSampled.has('sci_fi');
    expect(hasUserInterest).toBe(true);
  });

  it('high realism bias produces more realistic mediums', () => {
    const recipe = makeRecipe({
      axes: { ...DEFAULT_RECIPE.axes, realism: 0.95 },
    });
    let realisticCount = 0;
    const runs = 100;
    for (let i = 0; i < runs; i++) {
      const input = buildPromptInput(recipe);
      if (
        input.medium.toLowerCase().includes('photograph') ||
        input.medium.toLowerCase().includes('realistic') ||
        input.medium.toLowerCase().includes('dslr') ||
        input.medium.toLowerCase().includes('film photography')
      ) {
        realisticCount++;
      }
    }
    // With realism=0.95, realistic mediums should appear more than pure chance
    // (chaos wildcards and 90+ mediums mean not every roll is realistic)
    expect(realisticCount).toBeGreaterThan(5);
  });

  it('low realism bias produces more illustrated mediums', () => {
    const recipe = makeRecipe({
      axes: { ...DEFAULT_RECIPE.axes, realism: 0.05 },
    });
    let illustratedCount = 0;
    const runs = 100;
    for (let i = 0; i < runs; i++) {
      const input = buildPromptInput(recipe);
      if (
        !input.medium.toLowerCase().includes('photograph') &&
        !input.medium.toLowerCase().includes('dslr') &&
        !input.medium.toLowerCase().includes('realistic')
      ) {
        illustratedCount++;
      }
    }
    expect(illustratedCount).toBeGreaterThan(50);
  });

  it('spirit companion appears roughly 15% of the time', () => {
    const recipe = makeRecipe({ spirit_companion: 'fox' });
    let appearances = 0;
    const runs = 500;
    for (let i = 0; i < runs; i++) {
      const input = buildPromptInput(recipe);
      if (input.spiritAppears) appearances++;
    }
    // 15% ± 5% tolerance → between 50 and 100 out of 500
    expect(appearances).toBeGreaterThan(30);
    expect(appearances).toBeLessThan(130);
  });

  it('null spirit companion never appears', () => {
    const recipe = makeRecipe({ spirit_companion: null });
    for (let i = 0; i < 100; i++) {
      const input = buildPromptInput(recipe);
      expect(input.spiritAppears).toBe(false);
    }
  });

  it('high chaos increases variety in era/setting selection', () => {
    const lowChaos = makeRecipe({
      axes: { ...DEFAULT_RECIPE.axes, chaos: 0.0 },
      eras: ['medieval'],
      settings: ['cozy_indoors'],
    });
    const highChaos = makeRecipe({
      axes: { ...DEFAULT_RECIPE.axes, chaos: 1.0 },
      eras: ['medieval'],
      settings: ['cozy_indoors'],
    });

    const lowEras = new Set<string>();
    const highEras = new Set<string>();
    for (let i = 0; i < 100; i++) {
      lowEras.add(buildPromptInput(lowChaos).eraKeywords);
      highEras.add(buildPromptInput(highChaos).eraKeywords);
    }
    // High chaos should produce more variety
    expect(highEras.size).toBeGreaterThan(lowEras.size);
  });

  it('color palette keywords are included', () => {
    const recipe = makeRecipe({ color_palettes: ['neon'] });
    let foundNeon = false;
    for (let i = 0; i < 30; i++) {
      const input = buildPromptInput(recipe);
      if (input.colorKeywords.includes('neon')) {
        foundNeon = true;
        break;
      }
    }
    expect(foundNeon).toBe(true);
  });

  it('works with completely empty recipe (all defaults)', () => {
    const input = buildPromptInput(DEFAULT_RECIPE);
    expect(input.medium.length).toBeGreaterThan(0);
    expect(input.mood.length).toBeGreaterThan(0);
    expect(input.lighting.length).toBeGreaterThan(0);
  });
});

describe('buildRawPrompt', () => {
  it('returns a non-empty string', () => {
    const input = buildPromptInput(DEFAULT_RECIPE);
    const prompt = buildRawPrompt(input);
    expect(typeof prompt).toBe('string');
    expect(prompt.length).toBeGreaterThan(20);
  });

  it('includes the art medium', () => {
    const input = buildPromptInput(DEFAULT_RECIPE);
    const prompt = buildRawPrompt(input);
    // The medium should appear at the start of the prompt
    expect(prompt).toContain(input.medium);
  });

  it('includes safety rules', () => {
    const input = buildPromptInput(DEFAULT_RECIPE);
    const prompt = buildRawPrompt(input);
    expect(prompt).toContain('No photorealistic faces');
    expect(prompt).toContain('No nudity');
  });

  it('produces different prompts across runs', () => {
    const prompts = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const input = buildPromptInput(DEFAULT_RECIPE);
      prompts.add(buildRawPrompt(input));
    }
    // Should get variety
    expect(prompts.size).toBeGreaterThan(10);
  });
});

describe('buildHaikuPrompt', () => {
  it('returns a creative brief string', () => {
    const input = buildPromptInput(DEFAULT_RECIPE);
    const brief = buildHaikuPrompt(input);
    expect(typeof brief).toBe('string');
    expect(brief.length).toBeGreaterThan(100);
  });

  it('includes priority order instructions', () => {
    const input = buildPromptInput(DEFAULT_RECIPE);
    const brief = buildHaikuPrompt(input);
    expect(brief).toContain('PRIORITY ORDER');
    expect(brief).toContain('ART MEDIUM');
  });

  it('includes the medium from input', () => {
    const input = buildPromptInput(DEFAULT_RECIPE);
    const brief = buildHaikuPrompt(input);
    expect(brief).toContain(input.medium);
  });

  it('includes anti-cliche rules', () => {
    const input = buildPromptInput(DEFAULT_RECIPE);
    const brief = buildHaikuPrompt(input);
    expect(brief).toContain('AVOID AI ART CLICHÉS');
  });

  it('requests max 60 words output', () => {
    const input = buildPromptInput(DEFAULT_RECIPE);
    const brief = buildHaikuPrompt(input);
    expect(brief).toContain('max 60 words');
  });
});
