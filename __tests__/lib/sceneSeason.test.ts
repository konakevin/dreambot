/**
 * Tests for sceneSeason — scene-only nightly L5 season signal.
 *
 * Locks the two safety gates: season-agnostic biomes (tropical/desert/etc.) get
 * NO signal (no autumn leaves on a Hawaiian beach), and only cold biomes get a
 * snowy winter (no snow on the Amalfi coast).
 */

import * as fs from 'fs';
import * as path from 'path';
import { sceneSeasonSignal, seasonForMonth, seasonMonthFor } from '@engine/sceneSeason';

describe('seasonForMonth (northern hemisphere)', () => {
  it('maps months to the right season', () => {
    expect(seasonForMonth(12)).toBe('winter');
    expect(seasonForMonth(1)).toBe('winter');
    expect(seasonForMonth(2)).toBe('winter');
    expect(seasonForMonth(4)).toBe('spring');
    expect(seasonForMonth(7)).toBe('summer');
    expect(seasonForMonth(10)).toBe('autumn');
  });
});

describe('sceneSeasonSignal', () => {
  it('returns null for season-agnostic biomes and unknown/null biomes', () => {
    for (const b of [
      'tropical_coastal',
      'desert_arid',
      'aquatic_underwater',
      'volcanic_geothermal',
      'fantasy_imagined',
      'interior_intimate',
      'wetland_jungle',
    ]) {
      expect(sceneSeasonSignal(b, 10)).toBeNull();
    }
    expect(sceneSeasonSignal(null, 10)).toBeNull();
    expect(sceneSeasonSignal(undefined, 1)).toBeNull();
    expect(sceneSeasonSignal('not_a_biome', 4)).toBeNull();
  });

  it('gives seasonal biomes a season-appropriate signal', () => {
    expect(sceneSeasonSignal('temperate_forest', 10)).toMatch(/autumn|gold|amber|russet/i);
    expect(sceneSeasonSignal('temperate_forest', 4)).toMatch(/spring|blossom|bud/i);
    expect(sceneSeasonSignal('temperate_forest', 7)).toMatch(/summer|lush/i);
  });

  it('SNOW only for cold biomes in winter; milder seasonal biomes get no snow', () => {
    // cold biomes → snow
    expect(sceneSeasonSignal('alpine_mountain', 1)).toMatch(/snow/i);
    expect(sceneSeasonSignal('fjord_coastal', 1)).toMatch(/snow/i);
    expect(sceneSeasonSignal('temperate_forest', 12)).toMatch(/snow/i);
    // mild seasonal biomes → winter, but NO snow mandate
    expect(sceneSeasonSignal('mediterranean_coastal', 1)).toMatch(/winter|frost|bare/i);
    expect(sceneSeasonSignal('mediterranean_coastal', 1)).not.toMatch(/snow/i);
    expect(sceneSeasonSignal('urban_city', 1)).not.toMatch(/snow/i);
  });

  it('zen_garden gets its iconic blossoms in spring and maples in autumn', () => {
    expect(sceneSeasonSignal('zen_garden', 4)).toMatch(/blossom/i);
    expect(sceneSeasonSignal('zen_garden', 10)).toMatch(/maple/i);
  });
});

describe('season lock (mig 610): a one-season card ignores the calendar', () => {
  it('a lock reads its own season in any month; no lock or an unknown one follows the calendar', () => {
    for (const m of [1, 4, 7, 10, 12]) {
      expect(seasonForMonth(seasonMonthFor('spring', m))).toBe('spring');
      expect(seasonForMonth(seasonMonthFor('summer', m))).toBe('summer');
      expect(seasonMonthFor(null, m)).toBe(m);
      expect(seasonMonthFor('toString', m)).toBe(m);
    }
  });

  it('cherry blossoms locked to spring stay in bloom in October; no maples', () => {
    const sig = sceneSeasonSignal('zen_garden', seasonMonthFor('spring', 10));
    expect(sig).toMatch(/blossoms in full bloom/);
    expect(sig).not.toMatch(/maple|fallen leaves/);
  });

  it('romantic_countryside is seasonal, so its summer lock reads lush high summer, never bare branches', () => {
    expect(sceneSeasonSignal('romantic_countryside', seasonMonthFor('summer', 1))).toMatch(
      /high summer/
    );
    expect(sceneSeasonSignal('romantic_countryside', 10)).toMatch(/^autumn/);
  });

  it('nightly-dreams reads the lock from the card and applies it unless QA forces a month', () => {
    const src = fs.readFileSync(
      path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
      'utf8'
    );
    expect(src).toMatch(/\.select\('biome, biome_config, season_lock'\)/);
    expect(src).toMatch(/force_season_month \?\? seasonMonthFor\(seasonLock,/);
  });
});
