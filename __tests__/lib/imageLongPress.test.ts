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
let mockIsPro = true;

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
jest.mock('@/components/UpscaleOverlay', () => ({
  UpscaleModal: {
    show: (...a: unknown[]) => mockModalShow(...a),
    setProcessing: (...a: unknown[]) => mockModalSetProcessing(...a),
    hide: (...a: unknown[]) => mockModalHide(...a),
  },
}));
jest.mock('@/store/auth', () => ({
  useAuthStore: { getState: () => ({ isPro: mockIsPro }) },
}));
jest.mock('@/lib/savePhoto', () => ({
  saveUrlToPhotos: (...a: unknown[]) => mockSaveUrlToPhotos(...a),
}));
jest.mock('@/lib/supabase', () => ({
  supabase: { functions: { invoke: (...a: unknown[]) => mockInvoke(...a) } },
}));

import { handleImageLongPress } from '@/lib/imageLongPress';

type AlertButton = { text: string; onPress?: () => void };
/** Pull the captured showAlert buttons + invoke a button by its label. */
function pressAlertButton(label: string) {
  const lastCall = mockShowAlert.mock.calls[mockShowAlert.mock.calls.length - 1];
  const buttons = lastCall[2] as AlertButton[];
  const btn = buttons.find((b) => b.text === label);
  if (!btn?.onPress) throw new Error(`no button "${label}"`);
  return btn.onPress();
}

beforeEach(() => {
  jest.clearAllMocks();
  mockIsPro = true;
  mockSaveUrlToPhotos.mockResolvedValue(undefined);
});

describe('handleImageLongPress — quality sheet + entitlement gating', () => {
  it('free user on their OWN post: options menu offers a native save', async () => {
    mockIsPro = false;
    handleImageLongPress({ id: 'p1', imageUrl: 'https://img/orig.jpg', onDelete: jest.fn() });
    // owner/admin → the fuller "Options" menu (save options + Delete)
    expect(mockShowAlert).toHaveBeenCalledWith('Options', '', expect.any(Array));
    await pressAlertButton('Save to Photos');
    // native res = not HD (third arg false), and never calls the server
    expect(mockSaveUrlToPhotos).toHaveBeenCalledWith('p1', 'https://img/orig.jpg', false);
    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it('free user on ANY post can save native res (no Pro block)', async () => {
    mockIsPro = false;
    handleImageLongPress({ id: 'p1', imageUrl: 'https://img/orig.jpg' });
    expect(mockShowAlert).toHaveBeenCalledWith('Download', '', expect.any(Array));
    await pressAlertButton('Save to Photos');
    expect(mockSaveUrlToPhotos).toHaveBeenCalledWith('p1', 'https://img/orig.jpg', false);
    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it('free user: "Save in HD" routes to the paywall (the upsell)', () => {
    mockIsPro = false;
    handleImageLongPress({ id: 'p1', imageUrl: 'https://img/orig.jpg' });
    pressAlertButton('Save in HD (Pro)');
    expect(mockRouterPush).toHaveBeenCalledWith('/proStore');
    expect(mockSaveUrlToPhotos).not.toHaveBeenCalled();
    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it('Pro user can grab a quick native save (no server call, no cap burn)', async () => {
    handleImageLongPress({ id: 'p1', imageUrl: 'https://img/orig.jpg' });
    await pressAlertButton('Save to Photos');
    expect(mockSaveUrlToPhotos).toHaveBeenCalledWith('p1', 'https://img/orig.jpg', false);
    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it('always fires haptic feedback', () => {
    handleImageLongPress({ id: 'p1', imageUrl: 'https://img/orig.jpg' });
    expect(mockImpactAsync).toHaveBeenCalled();
  });
});

describe('saveHd — cache hit (instant resolve, no server call)', () => {
  it('Pro user picks "Save in HD" with a cached HQ → instant save from cache', async () => {
    handleImageLongPress({
      id: 'p1',
      imageUrl: 'https://img/orig.jpg',
      imageUrlHq: 'https://img/hq.png',
    });
    await pressAlertButton('Save in HD');
    expect(mockSaveUrlToPhotos).toHaveBeenCalledWith('p1', 'https://img/hq.png', true);
    expect(mockInvoke).not.toHaveBeenCalled();
  });
});

describe('saveHd — on-demand upscale (server resolve)', () => {
  async function triggerHdSave(invokeResult: { data?: unknown; error?: unknown }) {
    mockInvoke.mockResolvedValue(invokeResult);
    handleImageLongPress({ id: 'p9', imageUrl: 'https://img/orig.jpg' });
    expect(mockShowAlert).toHaveBeenCalledWith('Download', '', expect.any(Array));
    await pressAlertButton('Save in HD');
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

  it('monthly_cap_reached → tears the modal back down and shows the cap toast', async () => {
    await triggerHdSave({
      data: { error: 'monthly_cap_reached', message: 'cap hit' },
      error: null,
    });
    expect(mockModalShow).toHaveBeenCalledWith('p9'); // opened optimistically
    expect(mockModalHide).toHaveBeenCalled(); // then closed once we learn the cap is hit
    expect(mockToastShow).toHaveBeenCalledWith('cap hit', 'close-circle');
    expect(mockSaveUrlToPhotos).not.toHaveBeenCalled();
  });

  it('transport error → tears the modal down + user-facing error toast, never a silent failure', async () => {
    await triggerHdSave({ data: null, error: { message: 'network down' } });
    expect(mockModalHide).toHaveBeenCalled();
    expect(mockToastShow).toHaveBeenCalledWith(
      expect.stringContaining('Couldn’t prepare your HD download'),
      'close-circle'
    );
    expect(mockSaveUrlToPhotos).not.toHaveBeenCalled();
  });
});
