/**
 * Recipe Engine — utility functions.
 */

import type { TaggedOption } from './types';

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickWithChaos<T>(preferred: T[], allOptions: T[], chaos: number): T {
  // chaos 0 = always pick from preferred; chaos 1 = 50/50 preferred vs random
  // Small preferred sets (1-2 items) get a variety bonus to avoid monotony
  const varietyBonus = preferred.length <= 2 ? 0.15 : 0;
  if (preferred.length === 0 || Math.random() < chaos * 0.5 + varietyBonus) {
    return pick(allOptions);
  }
  return pick(preferred);
}

export function rollAxis(value: number): 'high' | 'low' {
  return Math.random() < value ? 'high' : 'low';
}

export function getModifierByValue(modifiers: string[], value: number): string {
  const index = Math.min(modifiers.length - 1, Math.floor(value * modifiers.length));
  return modifiers[index];
}

export function filterPool(
  pool: TaggedOption[],
  rolledAxes: Record<string, 'high' | 'low'>,
  chaos: number = 0.5
): string {
  // Score everything first — we use the scores for both normal and wildcard picks
  const scored = pool.map((opt) => {
    let score = 0;
    if (opt.axes) {
      for (const [axis, val] of Object.entries(opt.axes)) {
        if (rolledAxes[axis] === val) score += 1;
        else score -= 0.5;
      }
    }
    return { text: opt.text, score };
  });
  scored.sort((a, b) => b.score - a.score);

  // Wildcard chance scales with chaos: 10% at chaos=0, 40% at chaos=1
  if (Math.random() < 0.1 + chaos * 0.3) {
    // High chaos (>=0.5): full random from entire pool — anything goes
    // Low chaos (<0.5): pick from top half — surprising but won't clash
    const wildcardPool = chaos >= 0.5 ? scored : scored.slice(0, Math.ceil(scored.length / 2));
    return pick(wildcardPool).text;
  }

  // Normal pick: top 15 scorers — wide enough for real variety across 90+ mediums
  return pick(scored.slice(0, 15)).text;
}
