/**
 * Tests for dream wish moderation — verifies wishes are checked before saving.
 */

const mockInvoke = jest.fn();
const mockUpdate = jest.fn().mockReturnThis();
const mockEq = jest.fn().mockResolvedValue({ error: null });

jest.mock('@/lib/supabase', () => ({
  supabase: {
    functions: {
      get invoke() {
        return mockInvoke;
      },
    },
    from: jest.fn().mockReturnValue({
      update: mockUpdate,
      eq: mockEq,
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}));

import { moderateText } from '@/lib/moderation';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('dream wish moderation', () => {
  it('blocks discriminatory wish text', async () => {
    mockInvoke.mockResolvedValue({
      data: { passed: false, reason: 'Content flagged: discriminatory' },
      error: null,
    });

    const result = await moderateText('hateful content here');
    expect(result.passed).toBe(false);
    expect(result.reason).toContain('discriminatory');
  });

  it('allows creative wish text', async () => {
    mockInvoke.mockResolvedValue({
      data: { passed: true, reason: null },
      error: null,
    });

    const result = await moderateText('A dragon flying over a moonlit castle');
    expect(result.passed).toBe(true);
  });

  it('allows sensual/sexy wish text', async () => {
    mockInvoke.mockResolvedValue({
      data: { passed: true, reason: null },
      error: null,
    });

    const result = await moderateText('A glamorous model in elegant lingerie');
    expect(result.passed).toBe(true);
  });
});
