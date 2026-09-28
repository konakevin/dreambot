/**
 * "Do you have their permission?" before a +1 photo (lib/castPermission.ts): only for someone
 * else's face, resolves the confirmation time (stored as consent_confirmed_at) or null on
 * Cancel, and can't be dismissed by tapping outside (the upload flow is waiting on it).
 */
const mockShowAlert = jest.fn();
jest.mock('@/components/CustomAlert', () => ({
  showAlert: (...a: unknown[]) => mockShowAlert(...a),
}));

import {
  CAST_PERMISSION_CONFIRM,
  CAST_PERMISSION_TITLE,
  castRoleNeedsPermission,
  confirmCastPermission,
} from '@/lib/castPermission';
import { migrateLegacyPlusOne } from '@/lib/dreamCastRoster';
import { DEFAULT_VIBE_PROFILE, type VibeProfile } from '@/types/vibeProfile';

type Button = { text: string; onPress?: () => void };

beforeEach(() => jest.clearAllMocks());

describe('castRoleNeedsPermission', () => {
  it('asks only for a +1 (not your own photo, not a pet)', () => {
    expect(castRoleNeedsPermission('plus_one')).toBe(true);
    expect(castRoleNeedsPermission('self')).toBe(false);
    expect(castRoleNeedsPermission('pet')).toBe(false);
  });
});

describe('confirmCastPermission', () => {
  it('resolves the confirmation time when the user confirms', async () => {
    const p = confirmCastPermission(() => new Date('2026-09-27T12:00:00Z'));
    const [title, , buttons, opts] = mockShowAlert.mock.calls[0] as [
      string,
      string,
      Button[],
      { dismissible?: boolean },
    ];
    expect(title).toBe(CAST_PERMISSION_TITLE);
    expect(opts).toEqual({ dismissible: false });
    buttons.find((b) => b.text === CAST_PERMISSION_CONFIRM)!.onPress!();
    await expect(p).resolves.toBe('2026-09-27T12:00:00.000Z');
  });

  it('resolves null on Cancel', async () => {
    const p = confirmCastPermission();
    const buttons = mockShowAlert.mock.calls[0][2] as Button[];
    buttons.find((b) => b.text === 'Cancel')!.onPress!();
    await expect(p).resolves.toBeNull();
  });
});

describe('consent_confirmed_at survives the onboarding +1 → roster migration', () => {
  it('carries from the dream_cast +1 to the roster member and back to the mirror', () => {
    const profile: VibeProfile = {
      ...DEFAULT_VIBE_PROFILE,
      dream_cast: [
        {
          role: 'plus_one',
          storage_path: 'u/cast-plus_one-1.jpg',
          description: 'a friend with curly hair and glasses',
          relationship: 'friend',
          consent_confirmed_at: '2026-09-27T12:00:00.000Z',
        },
      ],
    };
    const out = migrateLegacyPlusOne(profile);
    expect(out.partner_library?.[0]?.consent_confirmed_at).toBe('2026-09-27T12:00:00.000Z');
    const mirror = out.dream_cast.find((m) => m.role === 'plus_one');
    expect(mirror?.consent_confirmed_at).toBe('2026-09-27T12:00:00.000Z');
  });
});
