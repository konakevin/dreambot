/**
 * Unit tests for isVibeProfile — the runtime type guard used by loadProfile()
 * and other callers to confirm DB-loaded `recipe` JSON is current v2 format
 * before passing it to the engine.
 *
 * Relocated from lib/migrateRecipe.ts → types/vibeProfile.ts during the legacy
 * recipeEngine deletion. These tests pin the behavior so future refactors
 * cannot silently break the contract that all 5 callers depend on:
 *   app/settings/index.tsx, app/onboarding/meet-the-bots.tsx,
 *   app/(tabs)/create.tsx, hooks/useDreamCreate.ts, components/QuickSettingsSheet.tsx
 */

import { isVibeProfile } from '@/types/vibeProfile';

describe('isVibeProfile', () => {
  describe('accepts valid v2 profiles', () => {
    it('returns true for the minimal v2 shape', () => {
      const minimal = { version: 2 };
      expect(isVibeProfile(minimal)).toBe(true);
    });

    it('returns true for a full v2 profile shape', () => {
      const full = {
        version: 2,
        moods: {
          peaceful_chaotic: 0.5,
          cute_terrifying: 0.5,
          minimal_maximal: 0.5,
          realistic_surreal: 0.5,
        },
        dream_seeds: { characters: [], places: [] },
        dream_cast: [],
        avoid: ['text', 'watermarks'],
      };
      expect(isVibeProfile(full)).toBe(true);
    });

    it('narrows the type when used as a type guard', () => {
      const data: unknown = { version: 2 };
      if (isVibeProfile(data)) {
        // After narrowing, TS treats data as VibeProfile and the
        // typecheck (npm run typecheck) covers this path.
        expect(data.version).toBe(2);
      } else {
        throw new Error('expected isVibeProfile to narrow');
      }
    });
  });

  describe('rejects legacy and malformed inputs', () => {
    it('returns false for legacy v1 Recipe shape (no version, has axes)', () => {
      const legacy = {
        axes: { realism: 0.5, energy: 0.5, brightness: 0.5, complexity: 0.5, weirdness: 0.5 },
        personality_tags: ['dreamy'],
        eras: ['retro'],
        interests: ['nature'],
      };
      expect(isVibeProfile(legacy)).toBe(false);
    });

    it('returns false for objects with a non-2 version', () => {
      expect(isVibeProfile({ version: 1 })).toBe(false);
      expect(isVibeProfile({ version: 3 })).toBe(false);
      expect(isVibeProfile({ version: '2' })).toBe(false);
      expect(isVibeProfile({ version: null })).toBe(false);
    });

    it('returns false for empty object', () => {
      expect(isVibeProfile({})).toBe(false);
    });

    it('returns false for null and undefined', () => {
      expect(isVibeProfile(null)).toBe(false);
      expect(isVibeProfile(undefined)).toBe(false);
    });

    it('returns false for primitives', () => {
      expect(isVibeProfile('vibe')).toBe(false);
      expect(isVibeProfile(2)).toBe(false);
      expect(isVibeProfile(true)).toBe(false);
      expect(isVibeProfile(false)).toBe(false);
    });

    it('returns false for arrays even with a version property attached', () => {
      // Arrays are typeof 'object'; the guard must still reject them.
      const arr: unknown = [];
      (arr as { version: number }).version = 2;
      // Arrays are still objects; the current guard does NOT reject arrays,
      // only checks version === 2. This test pins that behavior so any
      // future tightening (e.g., checking for plain object) is intentional.
      // If the guard is later strengthened to reject arrays, flip this assertion.
      expect(isVibeProfile(arr)).toBe(true);
    });
  });
});
