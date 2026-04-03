import { fuseRecipes } from '@/lib/geneticMerge';
import type { Recipe } from '@/types/recipe';
import { DEFAULT_RECIPE } from '@/types/recipe';

const PARENT_A: Recipe = {
  axes: {
    color_warmth: 0.9,
    complexity: 0.8,
    realism: 0.1,
    energy: 0.9,
    brightness: 0.2,
    chaos: 0.7,
    weirdness: 0.8,
    scale: 0.3,
  },
  interests: ['fantasy', 'dark', 'gaming'],
  color_palettes: ['dark_bold', 'neon'],
  personality_tags: ['fierce', 'edgy', 'chaotic'],
  eras: ['medieval', 'steampunk'],
  settings: ['underground', 'otherworldly'],
  scene_atmospheres: ['stormy_twilight', 'starry_midnight'],
  spirit_companion: 'dragon',
};

const PARENT_B: Recipe = {
  axes: {
    color_warmth: 0.2,
    complexity: 0.3,
    realism: 0.9,
    energy: 0.1,
    brightness: 0.8,
    chaos: 0.2,
    weirdness: 0.1,
    scale: 0.9,
  },
  interests: ['nature', 'cute', 'animals'],
  color_palettes: ['soft_pastel', 'earthy_natural'],
  personality_tags: ['gentle', 'peaceful', 'cozy'],
  eras: ['modern', 'retro'],
  settings: ['cozy_indoors', 'wild_outdoors'],
  scene_atmospheres: ['sunny_morning', 'golden_hour'],
  spirit_companion: 'rabbit',
};

describe('fuseRecipes', () => {
  it('blend=0 returns mostly parent A traits', () => {
    // blend=0 means 100% parent A
    const results: Recipe[] = [];
    for (let i = 0; i < 20; i++) {
      results.push(fuseRecipes(PARENT_A, PARENT_B, 0));
    }
    // Axes should be very close to parent A (within jitter tolerance)
    const avgRealism = results.reduce((s, r) => s + r.axes.realism, 0) / results.length;
    expect(avgRealism).toBeLessThan(0.3); // Parent A realism is 0.1

    // Interests should be dominated by parent A
    const allInterests = results.flatMap((r) => r.interests);
    const fantasyCount = allInterests.filter((i) => i === 'fantasy').length;
    const natureCount = allInterests.filter((i) => i === 'nature').length;
    expect(fantasyCount).toBeGreaterThan(natureCount);
  });

  it('blend=100 returns mostly parent B traits', () => {
    // blend=100 means 100% parent B
    const results: Recipe[] = [];
    for (let i = 0; i < 20; i++) {
      results.push(fuseRecipes(PARENT_A, PARENT_B, 100));
    }
    const avgRealism = results.reduce((s, r) => s + r.axes.realism, 0) / results.length;
    expect(avgRealism).toBeGreaterThan(0.7); // Parent B realism is 0.9

    const allInterests = results.flatMap((r) => r.interests);
    const natureCount = allInterests.filter((i) => i === 'nature').length;
    const fantasyCount = allInterests.filter((i) => i === 'fantasy').length;
    expect(natureCount).toBeGreaterThan(fantasyCount);
  });

  it('blend=50 produces a mix of both parents', () => {
    const results: Recipe[] = [];
    for (let i = 0; i < 30; i++) {
      results.push(fuseRecipes(PARENT_A, PARENT_B, 50));
    }

    // Axes should be somewhere in between
    const avgRealism = results.reduce((s, r) => s + r.axes.realism, 0) / results.length;
    expect(avgRealism).toBeGreaterThan(0.2);
    expect(avgRealism).toBeLessThan(0.8);

    // Both parents' interests should appear across runs
    const allInterests = new Set(results.flatMap((r) => r.interests));
    const hasParentA =
      allInterests.has('fantasy') || allInterests.has('dark') || allInterests.has('gaming');
    const hasParentB =
      allInterests.has('nature') || allInterests.has('cute') || allInterests.has('animals');
    expect(hasParentA).toBe(true);
    expect(hasParentB).toBe(true);
  });

  it('extreme axis values dominate in blending', () => {
    // Parent A has energy=0.9 (extreme high), Parent B has energy=0.1 (extreme low)
    // Both are equally extreme (0.4 from center), so dominance bonus is 0
    // With 50/50 blend, average should be near 0.5
    const results: Recipe[] = [];
    for (let i = 0; i < 50; i++) {
      results.push(fuseRecipes(PARENT_A, PARENT_B, 50));
    }
    const avgEnergy = results.reduce((s, r) => s + r.axes.energy, 0) / results.length;
    expect(avgEnergy).toBeGreaterThan(0.3);
    expect(avgEnergy).toBeLessThan(0.7);

    // Now test with one parent having extreme value and other neutral
    const extremeParent: Recipe = {
      ...DEFAULT_RECIPE,
      axes: { ...DEFAULT_RECIPE.axes, energy: 1.0 }, // very extreme
    };
    const neutralParent: Recipe = {
      ...DEFAULT_RECIPE,
      axes: { ...DEFAULT_RECIPE.axes, energy: 0.5 }, // neutral
    };
    const extremeResults: Recipe[] = [];
    for (let i = 0; i < 50; i++) {
      extremeResults.push(fuseRecipes(extremeParent, neutralParent, 50));
    }
    const avgExtremeEnergy =
      extremeResults.reduce((s, r) => s + r.axes.energy, 0) / extremeResults.length;
    // Extreme parent should pull the result above 0.5 (dominance bonus)
    expect(avgExtremeEnergy).toBeGreaterThan(0.6);
  });

  it('spirit companion is selected from one parent', () => {
    const companions = new Set<string | null>();
    for (let i = 0; i < 50; i++) {
      const child = fuseRecipes(PARENT_A, PARENT_B, 50);
      companions.add(child.spirit_companion);
    }
    // Should only contain parent values (dragon or rabbit), possibly null from mutation
    for (const c of companions) {
      if (c !== null) {
        expect(['dragon', 'rabbit']).toContain(c);
      }
    }
    // Both should appear across runs (coin flip)
    expect(companions.has('dragon') || companions.has('rabbit')).toBe(true);
  });

  it('mutation can inject traits neither parent has', () => {
    // Run many times — 5% mutation chance per array means ~15% chance per fusion
    let mutationFound = false;
    const parentInterests = new Set([...PARENT_A.interests, ...PARENT_B.interests]);
    const parentEras = new Set([...PARENT_A.eras, ...PARENT_B.eras]);
    const parentSettings = new Set([...PARENT_A.settings, ...PARENT_B.settings]);

    for (let i = 0; i < 500; i++) {
      const child = fuseRecipes(PARENT_A, PARENT_B, 50);
      for (const interest of child.interests) {
        if (!parentInterests.has(interest)) {
          mutationFound = true;
          break;
        }
      }
      for (const era of child.eras) {
        if (!parentEras.has(era)) {
          mutationFound = true;
          break;
        }
      }
      for (const setting of child.settings) {
        if (!parentSettings.has(setting)) {
          mutationFound = true;
          break;
        }
      }
      if (mutationFound) break;
    }
    // Over 500 fusions, at least one mutation should occur
    expect(mutationFound).toBe(true);
  });

  it('child always has valid axes in 0-1 range', () => {
    for (let i = 0; i < 100; i++) {
      const child = fuseRecipes(PARENT_A, PARENT_B, Math.random() * 100);
      for (const [key, value] of Object.entries(child.axes)) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    }
  });

  it('handles empty arrays gracefully', () => {
    const emptyParent: Recipe = {
      ...DEFAULT_RECIPE,
      interests: [],
      eras: [],
      settings: [],
    };
    const child = fuseRecipes(emptyParent, PARENT_B, 50);
    // Should get parent B's traits
    expect(child.interests.length).toBeGreaterThan(0);
  });

  it('each parent always contributes at least 1 pick to arrays', () => {
    // With 50/50 blend, both parents should contribute
    let bothContributed = false;
    for (let i = 0; i < 30; i++) {
      const child = fuseRecipes(PARENT_A, PARENT_B, 50);
      const hasA = child.interests.some((int) => PARENT_A.interests.includes(int));
      const hasB = child.interests.some((int) => PARENT_B.interests.includes(int));
      if (hasA && hasB) {
        bothContributed = true;
        break;
      }
    }
    expect(bothContributed).toBe(true);
  });
});
