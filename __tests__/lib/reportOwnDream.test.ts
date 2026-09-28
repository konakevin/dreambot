/**
 * Reporting your OWN dream (Google Play AI-content policy, App Store 1.2): safety reasons only,
 * the same `reports` insert as any post report (reporter_id = you + upload_id + reason), and the
 * dream stays in your feeds (unlike reporting someone else's post, which hides it).
 */
const mockShowAlert = jest.fn();
const mockInsert = jest.fn();
const mockRemovePostsFromFeeds = jest.fn();
const mockToastShow = jest.fn();

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light' },
  NotificationFeedbackType: { Success: 'success' },
}));
jest.mock('@/components/CustomAlert', () => ({
  showAlert: (...a: unknown[]) => mockShowAlert(...a),
}));
jest.mock('@/components/Toast', () => ({
  Toast: { show: (...a: unknown[]) => mockToastShow(...a) },
}));
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({ insert: (...a: unknown[]) => mockInsert(...a) }),
  },
}));
jest.mock('@/lib/queryClient', () => ({
  queryClient: { invalidateQueries: jest.fn(), setQueriesData: jest.fn() },
}));
jest.mock('@/lib/feedCache', () => ({
  removePostsFromFeeds: (...a: unknown[]) => mockRemovePostsFromFeeds(...a),
}));
jest.mock('@/store/auth', () => ({
  useAuthStore: { getState: () => ({ user: { id: 'me' } }) },
}));

import { ownDreamReportReasons, reportOwnDream } from '@/lib/reportContent';

type Button = { text: string; style?: string; onPress?: () => void };

beforeEach(() => {
  jest.clearAllMocks();
  mockInsert.mockResolvedValue({ error: null });
});

describe('reportOwnDream', () => {
  it('offers safety reasons only (no spam / harassment / likeness for your own result)', () => {
    const reasons = ownDreamReportReasons.map((r) => r.reason);
    expect(reasons).toEqual(['nudity_sexual', 'violence_hate', 'harmful_output', 'inappropriate']);
  });

  it('asks why, then files a report on the dream without hiding it from your feeds', async () => {
    reportOwnDream('dream-1');
    expect(mockShowAlert).toHaveBeenCalledTimes(1);
    const [title, , buttons] = mockShowAlert.mock.calls[0] as [string, string, Button[]];
    expect(title).toBe('Report this dream');
    expect(buttons.map((b) => b.text)).toContain('Offensive or harmful result');
    expect(buttons[buttons.length - 1]).toMatchObject({ text: 'Cancel', style: 'cancel' });

    buttons.find((b) => b.text === 'Offensive or harmful result')!.onPress!();
    await new Promise((r) => setImmediate(r));

    expect(mockInsert).toHaveBeenCalledWith({
      reporter_id: 'me',
      reason: 'harmful_output',
      upload_id: 'dream-1',
    });
    expect(mockRemovePostsFromFeeds).not.toHaveBeenCalled();
    expect(mockToastShow).toHaveBeenCalledWith(
      'Thanks, our team will review this',
      'checkmark-circle'
    );
  });
});
