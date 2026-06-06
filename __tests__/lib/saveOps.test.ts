/**
 * Unit tests for the three "save" lib helpers flagged by the Architect audit
 * as critical-but-untested paths:
 *   - lib/saveVibeProfile.ts  — onboarding's atomic recipe persist.
 *   - lib/dreamSave.ts        — Storage upload + uploads INSERT for new dreams.
 *   - lib/savePhoto.ts        — download URL → camera roll save.
 *
 * Each is a small surface but a regression in any of them breaks an entire
 * user flow silently (recipe save loss, dream-album corruption, photo save
 * failures with no toast).
 */

// ─── supabase mock ────────────────────────────────────────────────────────
// One shared chainable mock the upsert / update / insert / select / eq / single
// callers can compose. Each fn returns `chain` so calls can compose, except
// the terminal ones (upsert, single, .eq with no chained terminal) which
// resolve a Promise the caller awaits.

const mockUpsert = jest.fn();
const mockUpdate = jest.fn();
const mockInsert = jest.fn();
const mockSelect = jest.fn();
const mockSingle = jest.fn();
const mockEq = jest.fn();
const mockFrom = jest.fn();

function resetSupabaseMocks() {
  mockUpsert.mockReset();
  mockUpdate.mockReset();
  mockInsert.mockReset();
  mockSelect.mockReset();
  mockSingle.mockReset();
  mockEq.mockReset();
  mockFrom.mockReset();

  // Default chain wiring: from() returns a builder; method calls chain;
  // terminal calls (upsert / single / eq-as-terminal) await to resolve.
  mockFrom.mockImplementation(() => ({
    upsert: mockUpsert,
    update: mockUpdate,
    insert: mockInsert,
  }));
  mockUpdate.mockImplementation(() => ({ eq: mockEq }));
  mockInsert.mockImplementation(() => ({ select: mockSelect }));
  mockSelect.mockImplementation(() => ({ single: mockSingle }));
  // Defaults: success.
  mockUpsert.mockResolvedValue({ error: null });
  mockEq.mockResolvedValue({ error: null });
  mockSingle.mockResolvedValue({ data: { id: 'mock-upload-id' }, error: null });
}

jest.mock('@/lib/supabase', () => ({
  supabase: {
    get from() {
      return mockFrom;
    },
  },
}));

// ─── dreamApi.persistImage mock ───────────────────────────────────────────
const mockPersistImage = jest.fn();
jest.mock('@/lib/dreamApi', () => ({
  persistImage: (url: string, userId: string) => mockPersistImage(url, userId),
}));

// ─── feed store mock ──────────────────────────────────────────────────────
const mockSetPinnedPost = jest.fn();
jest.mock('@/store/feed', () => ({
  useFeedStore: {
    getState: () => ({ setPinnedPost: mockSetPinnedPost }),
  },
}));

// ─── savePhoto.ts deps: file system, media library, expo-haptics, ui ──────
const mockRequestPermissions = jest.fn();
const mockCreateAsset = jest.fn();
jest.mock('expo-media-library', () => ({
  get requestPermissionsAsync() {
    return mockRequestPermissions;
  },
  get createAssetAsync() {
    return mockCreateAsset;
  },
}));

const mockFileExists = jest.fn();
const mockFileDelete = jest.fn();
const mockDownload = jest.fn();
jest.mock('expo-file-system', () => {
  const FileCtor = jest.fn().mockImplementation(function (this: {
    exists: boolean;
    delete: () => unknown;
  }) {
    Object.defineProperty(this, 'exists', {
      get: () => mockFileExists(),
    });
    this.delete = mockFileDelete;
  });
  // Static method via getter so the resolver runs at usage time — by then the
  // top-level `mockDownload` const has finished initializing (jest hoisting
  // moves the mock factory ABOVE the const declarations).
  Object.defineProperty(FileCtor, 'downloadFileAsync', {
    get: () => mockDownload,
  });
  return { File: FileCtor, Paths: { cache: '/tmp/cache' } };
});

const mockShowAlert = jest.fn();
jest.mock('@/components/CustomAlert', () => ({
  get showAlert() {
    return mockShowAlert;
  },
}));

const mockToastShow = jest.fn();
jest.mock('@/components/Toast', () => ({
  Toast: {
    get show() {
      return mockToastShow;
    },
  },
}));

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  NotificationFeedbackType: { Success: 'success', Error: 'error' },
}));

// ─── imports under test (after mocks are registered) ─────────────────────
import { saveVibeProfile } from '@/lib/saveVibeProfile';
import { saveDream, pinToFeed } from '@/lib/dreamSave';
import { saveUrlToPhotos } from '@/lib/savePhoto';
import type { VibeProfile } from '@/types/vibeProfile';

beforeEach(() => {
  jest.clearAllMocks();
  resetSupabaseMocks();
  mockPersistImage.mockResolvedValue('https://storage.example.com/uploads/user/123.jpg');
});

// ──────────────────────────────────────────────────────────────────────────
describe('saveVibeProfile', () => {
  const userId = 'user-1';
  const profile = {
    moods: {
      peaceful_chaotic: 0.5,
      cute_terrifying: 0.5,
      minimal_maximal: 0.5,
      realistic_surreal: 0.5,
    },
    dream_seeds: { places: ['paris'] },
    dream_cast: [],
  } as unknown as VibeProfile;

  it('upserts user_recipes then flags users.has_ai_recipe', async () => {
    await saveVibeProfile(userId, profile);

    expect(mockFrom).toHaveBeenCalledWith('user_recipes');
    expect(mockUpsert).toHaveBeenCalledTimes(1);
    const [upsertRow, upsertOpts] = mockUpsert.mock.calls[0];
    expect(upsertRow.user_id).toBe(userId);
    expect(upsertRow.onboarding_completed).toBe(true);
    expect(upsertRow.ai_enabled).toBe(true);
    expect(upsertOpts).toEqual({ onConflict: 'user_id' });

    expect(mockFrom).toHaveBeenCalledWith('users');
    expect(mockUpdate).toHaveBeenCalledWith({ has_ai_recipe: true });
    expect(mockEq).toHaveBeenCalledWith('id', userId);
  });

  it('persists a JSON snapshot, not a live ref to the input profile', async () => {
    const live = { ...profile, dream_seeds: { places: ['paris'] } } as unknown as VibeProfile;
    await saveVibeProfile(userId, live);

    const [upsertRow] = mockUpsert.mock.calls[0];
    // Mutate the original — the persisted recipe must not change.
    (live.dream_seeds as { places: string[] }).places.push('rome');
    expect((upsertRow.recipe as { dream_seeds: { places: string[] } }).dream_seeds.places).toEqual([
      'paris',
    ]);
  });

  it('throws when the upsert errors', async () => {
    mockUpsert.mockResolvedValueOnce({ error: { message: 'db down' } });
    await expect(saveVibeProfile(userId, profile)).rejects.toEqual({ message: 'db down' });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('throws when the flag update errors', async () => {
    mockEq.mockResolvedValueOnce({ error: { message: 'users update failed' } });
    await expect(saveVibeProfile(userId, profile)).rejects.toEqual({
      message: 'users update failed',
    });
  });
});

// ──────────────────────────────────────────────────────────────────────────
describe('saveDream', () => {
  const baseOpts = {
    userId: 'user-1',
    tempImageUrl: 'https://replicate.delivery/temp/abc.png',
    prompt: 'a cozy library',
    dreamMedium: 'photography',
    dreamVibe: 'cinematic',
  };

  it('uploads via persistImage when the URL is NOT already in Supabase Storage', async () => {
    await saveDream(baseOpts);
    expect(mockPersistImage).toHaveBeenCalledWith(baseOpts.tempImageUrl, baseOpts.userId);
    expect(mockInsert).toHaveBeenCalledTimes(1);
    const insertedRow = mockInsert.mock.calls[0][0];
    expect(insertedRow.image_url).toBe('https://storage.example.com/uploads/user/123.jpg');
    expect(insertedRow.user_id).toBe(baseOpts.userId);
    expect(insertedRow.is_public).toBe(false);
    expect(insertedRow.dream_medium).toBe('photography');
    expect(insertedRow.dream_vibe).toBe('cinematic');
  });

  it('skips persistImage when the URL is already in Storage', async () => {
    const storageUrl = 'https://abc.supabase.co/storage/v1/object/public/uploads/x.png';
    await saveDream({ ...baseOpts, tempImageUrl: storageUrl });
    expect(mockPersistImage).not.toHaveBeenCalled();
    const insertedRow = mockInsert.mock.calls[0][0];
    expect(insertedRow.image_url).toBe(storageUrl);
  });

  it('short-circuits when an existingUploadId is supplied', async () => {
    const storageUrl = 'https://abc.supabase.co/storage/v1/object/public/uploads/x.png';
    const result = await saveDream({
      ...baseOpts,
      tempImageUrl: storageUrl,
      existingUploadId: 'pre-existing-id',
    });
    expect(result.uploadId).toBe('pre-existing-id');
    expect(result.imageUrl).toBe(storageUrl);
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('truncates captions over 200 chars with an ellipsis', async () => {
    const longPrompt = 'x'.repeat(250);
    await saveDream({ ...baseOpts, prompt: longPrompt });
    const insertedRow = mockInsert.mock.calls[0][0];
    expect(insertedRow.caption.length).toBe(200);
    expect(insertedRow.caption.endsWith('...')).toBe(true);
    // The full prompt still gets stored in ai_prompt for re-roll fidelity.
    expect(insertedRow.ai_prompt).toBe(longPrompt);
  });

  it('throws when the uploads INSERT errors', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'insert failed' } });
    await expect(saveDream(baseOpts)).rejects.toEqual({ message: 'insert failed' });
  });

  it('returns the new uploadId and final imageUrl', async () => {
    mockSingle.mockResolvedValueOnce({ data: { id: 'new-id-xyz' }, error: null });
    const result = await saveDream(baseOpts);
    expect(result).toEqual({
      uploadId: 'new-id-xyz',
      imageUrl: 'https://storage.example.com/uploads/user/123.jpg',
    });
  });
});

// ──────────────────────────────────────────────────────────────────────────
describe('pinToFeed', () => {
  it('forwards the post to feedStore.setPinnedPost with normalized shape', () => {
    pinToFeed({
      id: 'u1',
      userId: 'kevin',
      imageUrl: 'https://example.com/x.png',
      username: 'kevinmc',
      avatarUrl: 'https://example.com/avatar.png',
    });
    expect(mockSetPinnedPost).toHaveBeenCalledTimes(1);
    const arg = mockSetPinnedPost.mock.calls[0][0];
    expect(arg.id).toBe('u1');
    expect(arg.user_id).toBe('kevin');
    expect(arg.image_url).toBe('https://example.com/x.png');
    expect(arg.caption).toBeNull();
    expect(arg.username).toBe('kevinmc');
    expect(arg.avatar_url).toBe('https://example.com/avatar.png');
    expect(arg.comment_count).toBe(0);
    expect(typeof arg.created_at).toBe('string');
  });
});

// ──────────────────────────────────────────────────────────────────────────
describe('saveUrlToPhotos', () => {
  beforeEach(() => {
    mockRequestPermissions.mockResolvedValue({ status: 'granted' });
    mockFileExists.mockReturnValue(false);
    mockDownload.mockResolvedValue({ uri: 'file:///tmp/cache/x.png' });
    mockCreateAsset.mockResolvedValue({});
  });

  it('returns false + alerts when media-library permission is denied', async () => {
    mockRequestPermissions.mockResolvedValueOnce({ status: 'denied' });
    const ok = await saveUrlToPhotos('id-1', 'https://example.com/x.png', false);
    expect(ok).toBe(false);
    expect(mockShowAlert).toHaveBeenCalledWith('Permission needed', 'Allow access to save images.');
    expect(mockDownload).not.toHaveBeenCalled();
  });

  it('downloads + saves + toasts on the happy path (jpg)', async () => {
    const ok = await saveUrlToPhotos('id-1', 'https://example.com/x.jpg', false);
    expect(ok).toBe(true);
    expect(mockDownload).toHaveBeenCalled();
    expect(mockCreateAsset).toHaveBeenCalledWith('file:///tmp/cache/x.png');
    expect(mockToastShow).toHaveBeenCalledWith('Saved to photos', 'checkmark-circle');
  });

  it('shows the HD toast variant when asHd=true', async () => {
    await saveUrlToPhotos('id-2', 'https://example.com/x.png', true);
    expect(mockToastShow).toHaveBeenCalledWith('Saved in HD', 'checkmark-circle');
  });

  it('falls back to png extension when the URL has no recognizable extension', async () => {
    await saveUrlToPhotos('id-3', 'https://example.com/no-ext', false);
    // File constructor is called with `${id}.${ext}` where ext defaults to png.
    expect(mockDownload).toHaveBeenCalled();
  });

  it('clears a stale cached file before downloading', async () => {
    mockFileExists.mockReturnValueOnce(true);
    await saveUrlToPhotos('id-4', 'https://example.com/x.png', false);
    expect(mockFileDelete).toHaveBeenCalled();
  });

  it('returns false and toasts a failure when download throws', async () => {
    mockDownload.mockRejectedValueOnce(new Error('network down'));
    const ok = await saveUrlToPhotos('id-5', 'https://example.com/x.png', false);
    expect(ok).toBe(false);
    expect(mockToastShow).toHaveBeenCalledWith('Failed to save image', 'close-circle');
  });
});
