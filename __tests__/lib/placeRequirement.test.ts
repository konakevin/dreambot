/**
 * At least one location is required, in onboarding AND Settings (Kevin 2026-09-30: every nightly is set in a
 * place the user chose). The rule is one function; the two places that enforce it outside onboarding are each
 * one deletable line, so the callers are locked here too.
 */
import * as fs from 'fs';
import * as path from 'path';
import { hasRequiredPlaces, MIN_PLACES } from '@/lib/placeRequirement';

const read = (...p: string[]) => fs.readFileSync(path.join(__dirname, '..', '..', ...p), 'utf8');

describe('hasRequiredPlaces', () => {
  it('needs at least one place', () => {
    expect(MIN_PLACES).toBe(1);
    expect(hasRequiredPlaces(['hawaii'])).toBe(true);
    expect(hasRequiredPlaces(['hawaii', 'tokyo'])).toBe(true);
    expect(hasRequiredPlaces([])).toBe(false);
    expect(hasRequiredPlaces(null)).toBe(false);
    expect(hasRequiredPlaces(undefined)).toBe(false);
  });
});

describe('callers', () => {
  it('Settings > Locations never autosaves an empty list', () => {
    expect(read('app', 'settings', 'locations.tsx')).toMatch(
      /useAutoSaveProfile\(\{\s*requirePlace:\s*true\s*\}\)/
    );
    const hook = read('hooks', 'useAutoSaveProfile.ts');
    // Both the debounced save and the unmount save check it.
    expect(hook.match(/if \(!mayPersist\(\)\) return;/g)).toHaveLength(2);
  });

  it('the picker gates onboarding Continue and the Settings back button on the rule, with no way to leave at zero', () => {
    const picker = read('components', 'onboarding', 'LocationPickerStep.tsx');
    expect(picker).toMatch(/const canProceed = hasRequiredPlaces\(places\);/);
    expect(picker).toMatch(/if \(!hasRequiredPlaces\(places\)\) \{\s*showAlert\(/);
    expect(picker).not.toMatch(/Leave anyway/);
  });
});
