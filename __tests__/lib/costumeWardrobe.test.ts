/**
 * COSTUME CARDS (Kevin 2026-09-30): a card whose theme is its costume (Wild West, gladiator arena, vampire castle)
 * dresses the cast from its own WARDROBE like an imagined world; every other real place keeps the traveler rule (the
 * race-swap guard, RACE_FIDELITY_PLAN.md). Locks the modes and the nightly wiring.
 */
import * as fs from 'fs';
import * as path from 'path';
import { locationWardrobeMode } from '@engine/costumeWardrobe';

const base = { imagined: false, costumeFlag: undefined, forceCostume: null, hasWardrobe: true };

describe('locationWardrobeMode', () => {
  it('a real place keeps the traveler rule and never sees its WARDROBE (China: national dress)', () => {
    expect(locationWardrobeMode(base)).toEqual({
      useLocationWardrobe: false,
      inWorldAttire: false,
      costume: false,
    });
  });

  it('an imagined world uses its WARDROBE, unchanged by the costume flag', () => {
    expect(locationWardrobeMode({ ...base, imagined: true })).toEqual({
      useLocationWardrobe: true,
      inWorldAttire: true,
      costume: false,
    });
    // Without a WARDROBE an imagined world still drops the traveler rule, as before.
    expect(locationWardrobeMode({ ...base, imagined: true, hasWardrobe: false })).toEqual({
      useLocationWardrobe: false,
      inWorldAttire: true,
      costume: false,
    });
  });

  it('a costume card dresses from its WARDROBE and is stamped', () => {
    expect(locationWardrobeMode({ ...base, costumeFlag: true })).toEqual({
      useLocationWardrobe: true,
      inWorldAttire: true,
      costume: true,
    });
  });

  it('only a literal true counts as the flag', () => {
    expect(locationWardrobeMode({ ...base, costumeFlag: 'true' }).costume).toBe(false);
    expect(locationWardrobeMode({ ...base, costumeFlag: 1 }).costume).toBe(false);
  });

  it('a costume card with no WARDROBE has nothing to wear: traveler path', () => {
    expect(locationWardrobeMode({ ...base, costumeFlag: true, hasWardrobe: false }).costume).toBe(
      false
    );
    expect(
      locationWardrobeMode({ ...base, costumeFlag: true, hasWardrobe: false }).inWorldAttire
    ).toBe(false);
  });

  it('force_costume overrides the card both ways', () => {
    expect(locationWardrobeMode({ ...base, forceCostume: true }).costume).toBe(true);
    expect(locationWardrobeMode({ ...base, costumeFlag: true, forceCostume: false }).costume).toBe(
      false
    );
  });
});

describe('nightly-dreams wiring', () => {
  const src = fs.readFileSync(
    path.join(__dirname, '../../supabase/functions/nightly-dreams/index.ts'),
    'utf8'
  );
  it('reads biome_config.costume next to the imagined marker', () => {
    expect(src).toMatch(/costumeFlag = \(cfg as Record<string, unknown>\)\.costume;/);
  });
  it('the outfit roll, the wardrobe anchor and the traveler rule all follow the helper', () => {
    expect(src).toMatch(/const locationWardrobe = wardrobeMode\.useLocationWardrobe;/);
    expect(src).toMatch(
      /: locationWardrobe && bespokeBiome && bespokeBiome\.WARDROBE\s*\? pickAxis\(bespokeBiome\.WARDROBE\)/
    );
    expect(src).toMatch(
      /realWorldLocation: dualSpecialScene \? false : !wardrobeMode\.inWorldAttire,/
    );
  });
  it('the medium ban stays keyed to imagined, not costume', () => {
    expect(src).toMatch(/const imaginedBiome = imaginedLocation;/);
  });
  it('passes the period only on the costume path, never on a special scene', () => {
    expect(src).toMatch(
      /\.\.\.\(wardrobeMode\.costume && periodDress && !dualSpecialScene \? \{ periodDress \} : \{\}\)/
    );
  });
  it('the couple-degrade solo rebuild names the outfit early, like a nightly solo', () => {
    expect(src).toMatch(
      /outfitEarly:\s*force_solo_outfit_early \?\? engineCfg0\.nightlySoloOutfitEarly/
    );
  });
  it('stamps costume_wardrobe', () => {
    expect(src).toMatch(
      /if \(wardrobeMode\.costume\) fallbackReasons\.push\('costume_wardrobe'\);/
    );
  });
});
