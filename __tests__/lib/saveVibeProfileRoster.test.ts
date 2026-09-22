/**
 * A SAVED PROFILE ALWAYS CARRIES ITS ROSTER.
 *
 * Onboarding writes the +1 straight into `dream_cast` (the render mirror) and never mints
 * a `partner_library` row. migrateLegacyPlusOne exists to seed one, but it ran only inside
 * the STORE's loadProfile — so the roster existed in memory and never reached the
 * database until the user happened to open Settings and change something.
 *
 * Everything that reads the roster from the DB was blind in the meantime: Create's cast
 * picker showed no cast members at all, name matching had no names to match, and the
 * engine's cast_partner_id lookup had nothing to find. Measured on production data
 * 2026-09-22: 13 of 79 recipes had a plus_one and an empty roster (Kevin: "i uploaded a
 * cast pic for myself and my +1 during onboarding, but after that i went into create and
 * this is what it shows me").
 *
 * The photos were never lost — dream_cast had both, with storage paths and descriptions.
 * Only the roster the picker reads was missing, which is why normalising on the WRITE is
 * the fix rather than anything to do with uploads.
 */
import { saveVibeProfile } from '@/lib/saveVibeProfile';
import { DEFAULT_VIBE_PROFILE } from '@/types/vibeProfile';
import type { VibeProfile } from '@/types/vibeProfile';

const mockUpsert = jest.fn(async (_row: { recipe: VibeProfile }, _opts?: unknown) => ({
  error: null,
}));
const mockUpdate = jest.fn(() => ({ eq: async () => ({ error: null }) }));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: (table: string) =>
      table === 'user_recipes' ? { upsert: mockUpsert } : { update: mockUpdate },
  },
}));

beforeEach(() => mockUpsert.mockClear());

/** What was actually written to user_recipes. */
const written = (): VibeProfile => {
  const call = mockUpsert.mock.calls[0];
  if (!call) throw new Error('nothing was written to user_recipes');
  return call[0].recipe;
};

const onboardedProfile = (): VibeProfile => ({
  ...DEFAULT_VIBE_PROFILE,
  dream_cast: [
    { role: 'self', description: 'me', storage_path: 'u/self.jpg' },
    {
      role: 'plus_one',
      description: 'her',
      storage_path: 'u/plus.jpg',
      relationship: 'partner',
      gender: 'female',
      age: 40,
    },
  ],
});

it('seeds the roster from a plus_one that only exists in dream_cast', async () => {
  const profile = onboardedProfile();
  expect(profile.partner_library ?? []).toHaveLength(0);

  await saveVibeProfile('u1', profile);

  const saved = written();
  expect(saved.partner_library).toHaveLength(1);
  expect(saved.partner_library?.[0]).toMatchObject({
    storage_path: 'u/plus.jpg',
    description: 'her',
    relationship: 'partner',
    enabled: true,
  });
  // A roster row nobody points at is invisible to the same readers.
  expect(saved.active_partner_id).toBe(saved.partner_library?.[0].id);
});

it('carries the described fields across, so the seeded member is renderable', async () => {
  await saveVibeProfile('u1', onboardedProfile());
  expect(written().partner_library?.[0]).toMatchObject({ gender: 'female', age: 40 });
});

it('leaves the self member alone', async () => {
  await saveVibeProfile('u1', onboardedProfile());
  const self = written().dream_cast.find((m) => m.role === 'self');
  expect(self).toMatchObject({ storage_path: 'u/self.jpg' });
});

it('is a no-op when the roster already exists', async () => {
  const existing: VibeProfile = {
    ...DEFAULT_VIBE_PROFILE,
    dream_cast: [{ role: 'self', description: 'me' }],
    partner_library: [{ id: 'keep-me', description: 'her', relationship: 'friend' }],
    active_partner_id: 'keep-me',
  };
  await saveVibeProfile('u1', existing);
  expect(written().partner_library).toHaveLength(1);
  expect(written().partner_library?.[0].id).toBe('keep-me');
});

it('does not invent a roster for a solo user', async () => {
  await saveVibeProfile('u1', {
    ...DEFAULT_VIBE_PROFILE,
    dream_cast: [{ role: 'self', description: 'me' }],
  });
  expect(written().partner_library ?? []).toHaveLength(0);
  expect(written().active_partner_id ?? null).toBeNull();
});

it('writes a plain JSON snapshot, not a live store reference', async () => {
  const profile = onboardedProfile();
  await saveVibeProfile('u1', profile);
  expect(written()).not.toBe(profile);
  expect(written().dream_cast).not.toBe(profile.dream_cast);
});
