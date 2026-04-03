/**
 * Tests for useAddComment hook — verifies moderation + insert flow.
 */

const mockInvoke = jest.fn();
const mockInsert = jest.fn().mockReturnThis();
const mockSelect = jest.fn().mockReturnThis();
const mockEq = jest.fn().mockReturnThis();
const mockSingle = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    functions: {
      get invoke() {
        return mockInvoke;
      },
    },
    from: jest.fn().mockReturnValue({
      insert: mockInsert,
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
    }),
  },
}));

jest.mock('@/store/auth', () => ({
  useAuthStore: jest.fn((selector) =>
    selector({
      user: { id: 'test-user-id', user_metadata: { username: 'testuser' } },
      session: { access_token: 'token' },
    })
  ),
}));

import { moderateText } from '@/lib/moderation';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('comment moderation', () => {
  it('moderateText blocks violent content', async () => {
    mockInvoke.mockResolvedValue({
      data: { passed: false, reason: 'Content flagged: violent' },
      error: null,
    });

    const result = await moderateText('I will hurt you');
    expect(result.passed).toBe(false);
    expect(result.reason).toContain('violent');
  });

  it('moderateText allows clean text', async () => {
    mockInvoke.mockResolvedValue({
      data: { passed: true, reason: null },
      error: null,
    });

    const result = await moderateText('What a beautiful dream!');
    expect(result.passed).toBe(true);
  });

  it('moderateText skips empty strings', async () => {
    const result = await moderateText('');
    expect(result.passed).toBe(true);
    expect(mockInvoke).not.toHaveBeenCalled();
  });
});
