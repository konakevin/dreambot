/**
 * Integration tests for the cold-start resume ORCHESTRATOR (resumeInFlightDream)
 * + the AsyncStorage marker roundtrip. The pure decision (decideDreamResume) is
 * covered in dreamResume.test.ts + dreamFlowStress.test.ts; this verifies the
 * glue actually wires storage → dream_jobs query → decision → navigation/store.
 */

const mockAsyncStore: Record<string, string> = {};
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(async (k: string, v: string) => {
      mockAsyncStore[k] = v;
    }),
    getItem: jest.fn(async (k: string) => mockAsyncStore[k] ?? null),
    removeItem: jest.fn(async (k: string) => {
      delete mockAsyncStore[k];
    }),
  },
}));

const mockMaybeSingle = jest.fn();
const mockEq = jest.fn((_col?: string, _val?: string) => ({ maybeSingle: mockMaybeSingle }));
const mockSelect = jest.fn((_cols?: string) => ({ eq: mockEq }));
const mockFrom = jest.fn((_table?: string) => ({ select: mockSelect }));
jest.mock('@/lib/supabase', () => ({ supabase: { from: (t: string) => mockFrom(t) } }));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ router: { push: (r: string) => mockPush(r) } }));

const mockAuthState: { user: { id: string } | null } = { user: { id: 'user-1' } };
jest.mock('@/store/auth', () => ({ useAuthStore: { getState: () => mockAuthState } }));

const mockSetActiveJobId = jest.fn();
const mockSetResult = jest.fn();
jest.mock('@/store/dream', () => ({
  useDreamStore: {
    getState: () => ({ setActiveJobId: mockSetActiveJobId, setResult: mockSetResult }),
  },
}));

import { resumeInFlightDream } from '@/lib/dreamResumeStore';
import { markDreamInFlight, clearDreamInFlight, getDreamInFlight } from '@/lib/dreamInFlightMarker';

const KEY = 'dreambot.inFlightDream.v1';
const doneRow = {
  status: 'done',
  upload_id: 'up-1',
  result_image_url: 'https://img/1.jpg',
  result_prompt: 'a dream',
  result_medium: 'photography',
  result_vibe: 'cinematic',
  user_id: 'user-1',
};

beforeEach(() => {
  jest.clearAllMocks();
  for (const k of Object.keys(mockAsyncStore)) delete mockAsyncStore[k];
  mockAuthState.user = { id: 'user-1' };
});

describe('marker roundtrip', () => {
  it('mark → get returns it → clear → get returns null', async () => {
    await markDreamInFlight('job-9');
    const got = await getDreamInFlight();
    expect(got?.jobId).toBe('job-9');
    expect(typeof got?.ts).toBe('number');
    await clearDreamInFlight();
    expect(await getDreamInFlight()).toBeNull();
  });

  it('tolerates malformed storage (returns null, no throw)', async () => {
    mockAsyncStore[KEY] = '{not json';
    expect(await getDreamInFlight()).toBeNull();
    mockAsyncStore[KEY] = JSON.stringify({ jobId: 5, ts: 'x' }); // wrong types
    expect(await getDreamInFlight()).toBeNull();
  });
});

describe('resumeInFlightDream — orchestration', () => {
  it('ignores when there is no marker (no query, no nav)', async () => {
    expect(await resumeInFlightDream()).toBe('ignore');
    expect(mockFrom).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('a finished render → hydrates result, pushes reveal, clears the marker', async () => {
    await markDreamInFlight('job-1');
    mockMaybeSingle.mockResolvedValue({ data: doneRow });

    expect(await resumeInFlightDream()).toBe('reveal');

    expect(mockFrom).toHaveBeenCalledWith('dream_jobs');
    expect(mockEq).toHaveBeenCalledWith('id', 'job-1');
    expect(mockSetResult).toHaveBeenCalledWith(
      expect.objectContaining({ uploadId: 'up-1', imageUrl: 'https://img/1.jpg' })
    );
    expect(mockSetActiveJobId).toHaveBeenCalledWith('job-1');
    expect(mockPush).toHaveBeenCalledWith('/dream/reveal');
    expect(await getDreamInFlight()).toBeNull(); // cleared
  });

  it('still rendering → pushes loading in resume mode, keeps the marker', async () => {
    await markDreamInFlight('job-2');
    mockMaybeSingle.mockResolvedValue({
      data: { ...doneRow, status: 'processing', upload_id: null, result_image_url: null },
    });

    expect(await resumeInFlightDream()).toBe('resumeLoading');

    expect(mockSetActiveJobId).toHaveBeenCalledWith('job-2');
    expect(mockPush).toHaveBeenCalledWith('/dream/loading?resume=1');
    expect(mockSetResult).not.toHaveBeenCalled();
    expect(await getDreamInFlight()).not.toBeNull(); // kept — loading screen polls
  });

  it('a failed render → clears the marker, no navigation (no cold failure card)', async () => {
    await markDreamInFlight('job-3');
    mockMaybeSingle.mockResolvedValue({ data: { ...doneRow, status: 'failed' } });

    expect(await resumeInFlightDream()).toBe('clear');
    expect(mockPush).not.toHaveBeenCalled();
    expect(await getDreamInFlight()).toBeNull();
  });

  it('no dream_jobs row → clears the marker, no navigation', async () => {
    await markDreamInFlight('job-4');
    mockMaybeSingle.mockResolvedValue({ data: null });

    expect(await resumeInFlightDream()).toBe('clear');
    expect(mockPush).not.toHaveBeenCalled();
    expect(await getDreamInFlight()).toBeNull();
  });

  it('a cross-user job → clears the marker, NEVER reveals another user', async () => {
    await markDreamInFlight('job-5');
    mockMaybeSingle.mockResolvedValue({ data: { ...doneRow, user_id: 'someone-else' } });

    expect(await resumeInFlightDream()).toBe('clear');
    expect(mockSetResult).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
    expect(await getDreamInFlight()).toBeNull();
  });

  it('a transient query failure → ignores + KEEPS the marker (retry next launch)', async () => {
    await markDreamInFlight('job-6');
    mockMaybeSingle.mockRejectedValue(new Error('network'));

    expect(await resumeInFlightDream()).toBe('ignore');
    expect(mockPush).not.toHaveBeenCalled();
    expect(await getDreamInFlight()).not.toBeNull(); // NOT cleared — try again later
  });
});
