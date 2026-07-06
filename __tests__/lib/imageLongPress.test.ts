/**
 * Unit tests for the download quality-sheet decision logic
 * (lib/imageLongPress.ts).
 *
 * The sheet offers two options to everyone:
 *   • Save to Photos — native res, free, any post (no server call).
 *   • Save in HD ✨   — Pro: the on-demand upscale contract below.
 *                       Free: routes to the paywall (the upsell).
 *
 * The Pro "Save in HD" resolve path — how it turns into a saved image:
 *   • cached HQ already present       → save it immediately (no server call)
 *   • server says { status: 'done' }  → save the returned HQ url
 *   • server says { status:'processing'} → modal opens immediately, polls +
 *                                          auto-saves; secondary requesters
 *                                          resolve to the SAME shared image
 *   • monthly cap / transport error   → tear the modal down + user-facing toast
 */

const mockImpactAsync = jest.fn();
const mockRouterPush = jest.fn();
const mockShowAlert = jest.fn();
const mockToastShow = jest.fn();
const mockModalShow = jest.fn();
const mockModalSetProcessing = jest.fn();
const mockModalHide = jest.fn();
const mockSaveUrlToPhotos = jest.fn().mockResolvedValue(undefined);
const mockInvoke = jest.fn();
const mockShowPremiumGate = jest.fn();
let mockIsPro = true;
let mockIsBasic = false;

jest.mock('expo-haptics', () => ({
  impactAsync: (...args: unknown[]) => mockImpactAsync(...args),
  ImpactFeedbackStyle: { Heavy: 'heavy' },
}));
jest.mock('expo-router', () => ({ router: { push: (...a: unknown[]) => mockRouterPush(...a) } }));
jest.mock('@/components/CustomAlert', () => ({
  showAlert: (...a: unknown[]) => mockShowAlert(...a),
}));
jest.mock('@/components/Toast', () => ({
  Toast: { show: (...a: unknown[]) => mockToastShow(...a) },
}));
// reportContent pulls in queryClient (native) — stub it; reporting isn't under test here.
jest.mock('@/lib/reportContent', () => ({ reportContent: jest.fn() }));
jest.mock('@/components/UpscaleOverlay', () => ({
  UpscaleModal: {
    show: (...a: unknown[]) => mockModalShow(...a),
    setProcessing: (...a: unknown[]) => mockModalSetProcessing(...a),
    hide: (...a: unknown[]) => mockModalHide(...a),
  },
}));
jest.mock('@/store/auth', () => ({
  useAuthStore: { getState: () => ({ isPro: mockIsPro, isBasic: mockIsBasic }) },
}));
jest.mock('@/lib/savePhoto', () => ({
  saveUrlToPhotos: (...a: unknown[]) => mockSaveUrlToPhotos(...a),
}));
jest.mock('@/lib/supabase', () => ({
  supabase: { functions: { invoke: (...a: unknown[]) => mockInvoke(...a) } },
}));
jest.mock('@/lib/premiumGate', () => ({
  showPremiumGate: (...a: unknown[]) => mockShowPremiumGate(...a),
}));

// 2026-07-05: handleImageLongPress (CustomAlert menu) was retired — grid tiles
// now share the fullscreen card's PostActionSheet. Same decision logic, tested
// through buildPostActionRows (the rows builder both surfaces consume).
import { buildPostActionRows } from '@/lib/imageLongPress';

type Row = { label: string; onPress?: () => void };
/** Find a built row by its label + invoke it. */
function pressRow(rows: Row[], label: string) {
  const row = rows.find((r) => r.label === label);
  if (!row?.onPress) throw new Error(`no row "${label}"`);
  return row.onPress();
}

beforeEach(() => {
  jest.clearAllMocks();
  mockIsPro = true;
  mockIsBasic = false;
  mockSaveUrlToPhotos.mockResolvedValue(undefined);
});

describe('buildPostActionRows — quality rows + entitlement gating', () => {
  it('free user on their OWN post: rows offer a native save (+ Delete)', async () => {
    mockIsPro = false;
    const rows = buildPostActionRows({
      id: 'p1',
      imageUrl: 'https://img/orig.jpg',
      onDelete: jest.fn(),
    });
    expect(rows.some((r) => r.label === 'Delete')).toBe(true);
    await pressRow(rows, 'Save to Photos');
    // native res = not HD (third arg false), and never calls the server
    expect(mockSaveUrlToPhotos).toHaveBeenCalledWith('p1', 'https://img/orig.jpg', false);
    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it('free user on ANY post can save native res (no Pro block); Report offered', async () => {
    mockIsPro = false;
    const rows = buildPostActionRows({ id: 'p1', imageUrl: 'https://img/orig.jpg' });
    expect(rows.some((r) => r.label === 'Report')).toBe(true);
    await pressRow(rows, 'Save to Photos');
    expect(mockSaveUrlToPhotos).toHaveBeenCalledWith('p1', 'https://img/orig.jpg', false);
    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it('free user: "Save in HD (Premium)" opens the premium gate (the upsell)', () => {
    mockIsPro = false;
    const rows = buildPostActionRows({ id: 'p1', imageUrl: 'https://img/orig.jpg' });
    pressRow(rows, 'Save in HD (Premium)');
    expect(mockShowPremiumGate).toHaveBeenCalledWith({ kind: 'hd_premium' });
    expect(mockSaveUrlToPhotos).not.toHaveBeenCalled();
    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it('BASIC user gets the unlocked "Save in HD" (HD is a paid perk of both tiers)', async () => {
    mockIsPro = false;
    mockIsBasic = true;
    const rows = buildPostActionRows({
      id: 'p1',
      imageUrl: 'https://img/orig.jpg',
      imageUrlHq: 'https://img/hq.png',
    });
    // Unlocked label (no "(Pro)" suffix) + saves from cache, not routed to paywall
    await pressRow(rows, 'Save in HD');
    expect(mockRouterPush).not.toHaveBeenCalled();
    expect(mockSaveUrlToPhotos).toHaveBeenCalledWith('p1', 'https://img/hq.png', true);
  });

  it('Pro user can grab a quick native save (no server call, no cap burn)', async () => {
    const rows = buildPostActionRows({ id: 'p1', imageUrl: 'https://img/orig.jpg' });
    await pressRow(rows, 'Save to Photos');
    expect(mockSaveUrlToPhotos).toHaveBeenCalledWith('p1', 'https://img/orig.jpg', false);
    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it('pin row: label flips with isPinned; absent without onTogglePin (migration 330)', () => {
    const onTogglePin = jest.fn();
    const pinned = buildPostActionRows({
      id: 'p1',
      imageUrl: 'https://img/orig.jpg',
      isOwn: true,
      isPinned: true,
      onTogglePin,
    });
    expect(pinned.some((r) => r.label === 'Unpin from profile')).toBe(true);
    const unpinned = buildPostActionRows({
      id: 'p1',
      imageUrl: 'https://img/orig.jpg',
      isOwn: true,
      isPinned: false,
      onTogglePin,
    });
    pressRow(unpinned, 'Pin to profile');
    expect(onTogglePin).toHaveBeenCalled();
    const noToggle = buildPostActionRows({
      id: 'p1',
      imageUrl: 'https://img/orig.jpg',
      isOwn: true,
    });
    expect(noToggle.some((r) => String(r.label).includes('in to profile'))).toBe(false);
  });
});

describe('saveHd — cache hit (instant resolve, no server call)', () => {
  it('Pro user picks "Save in HD" with a cached HQ → instant save from cache', async () => {
    const rows = buildPostActionRows({
      id: 'p1',
      imageUrl: 'https://img/orig.jpg',
      imageUrlHq: 'https://img/hq.png',
    });
    await pressRow(rows, 'Save in HD');
    expect(mockSaveUrlToPhotos).toHaveBeenCalledWith('p1', 'https://img/hq.png', true);
    expect(mockInvoke).not.toHaveBeenCalled();
  });
});

describe('saveHd — on-demand upscale (server resolve)', () => {
  async function triggerHdSave(invokeResult: { data?: unknown; error?: unknown }) {
    mockInvoke.mockResolvedValue(invokeResult);
    const rows = buildPostActionRows({ id: 'p9', imageUrl: 'https://img/orig.jpg' });
    await pressRow(rows, 'Save in HD');
  }

  it('status:done → opens the modal immediately, then saves the raced cache hit + closes', async () => {
    await triggerHdSave({
      data: { status: 'done', image_url_hq: 'https://img/ready.png' },
      error: null,
    });
    expect(mockInvoke).toHaveBeenCalledWith('upscale-image', { body: { upload_id: 'p9' } });
    // modal opens up front (no dead gap) before the request resolves
    expect(mockModalShow).toHaveBeenCalledWith('p9');
    expect(mockSaveUrlToPhotos).toHaveBeenCalledWith('p9', 'https://img/ready.png', true);
    expect(mockModalHide).toHaveBeenCalled();
  });

  it('status:processing → opens the modal immediately, then flips it to processing', async () => {
    await triggerHdSave({ data: { status: 'processing' }, error: null });
    expect(mockModalShow).toHaveBeenCalledWith('p9');
    expect(mockModalSetProcessing).toHaveBeenCalledWith('p9');
    expect(mockSaveUrlToPhotos).not.toHaveBeenCalled();
  });

  it('429 monthly cap (delivered as a FunctionsHttpError) → modal down + HD-cap gate', async () => {
    // supabase-js delivers non-2xx as `error` with the Response on `.context`.
    await triggerHdSave({
      data: null,
      error: {
        message: 'cap',
        context: {
          status: 429,
          json: async () => ({
            error: 'monthly_cap_reached',
            cap: 100,
            tier: 'pro',
            resets_on: 'July 1',
          }),
        },
      },
    });
    expect(mockModalShow).toHaveBeenCalledWith('p9'); // opened optimistically
    expect(mockModalHide).toHaveBeenCalled(); // closed once we learn the cap is hit
    expect(mockShowPremiumGate).toHaveBeenCalledWith({
      kind: 'hd_cap',
      cap: 100,
      resetsOn: 'July 1',
      tier: 'pro',
    });
    expect(mockSaveUrlToPhotos).not.toHaveBeenCalled();
  });

  it('403 lapsed subscription → modal down + HD premium gate (not a "try again" toast)', async () => {
    await triggerHdSave({
      data: null,
      error: { message: 'sub', context: { status: 403, json: async () => ({ error: 'x' }) } },
    });
    expect(mockModalHide).toHaveBeenCalled();
    expect(mockShowPremiumGate).toHaveBeenCalledWith({ kind: 'hd_premium' });
    expect(mockToastShow).not.toHaveBeenCalled();
  });

  it('transport error (no Response context) → modal down + user-facing error toast', async () => {
    await triggerHdSave({ data: null, error: { message: 'network down' } });
    expect(mockModalHide).toHaveBeenCalled();
    expect(mockToastShow).toHaveBeenCalledWith(
      expect.stringContaining('Couldn’t prepare your HD download'),
      'close-circle'
    );
    expect(mockShowPremiumGate).not.toHaveBeenCalled();
    expect(mockSaveUrlToPhotos).not.toHaveBeenCalled();
  });
});
