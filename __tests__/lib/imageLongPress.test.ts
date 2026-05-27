/**
 * Unit tests for the Pro "Save in HD" long-press decision logic
 * (lib/imageLongPress.ts).
 *
 * This is the CLIENT half of the on-demand upscale contract — how a download
 * tap resolves to an image:
 *   • cached HQ already present       → save it immediately (no server call)
 *   • server says { status: 'done' }  → save the returned HQ url
 *   • server says { status:'processing'} → show the waiting modal (it polls +
 *                                          auto-saves; a secondary requester
 *                                          resolves to the SAME shared image)
 *   • monthly cap / transport error   → user-facing toast, no silent failure
 * Plus the entitlement gating (free vs Pro, owner vs not-owner).
 */

const mockImpactAsync = jest.fn();
const mockRouterPush = jest.fn();
const mockShowAlert = jest.fn();
const mockToastShow = jest.fn();
const mockModalShow = jest.fn();
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
  UpscaleModal: { show: (...a: unknown[]) => mockModalShow(...a), hide: jest.fn() },
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

describe('handleImageLongPress — entitlement gating', () => {
  it('free user on their OWN post saves at original resolution', async () => {
    mockIsPro = false;
    handleImageLongPress({ id: 'p1', imageUrl: 'https://img/orig.jpg', onDelete: jest.fn() });
    expect(mockShowAlert).toHaveBeenCalledWith('Options', '', expect.any(Array));
    await pressAlertButton('Save to Photos');
    // original res = not HD (third arg false), and never calls the server
    expect(mockSaveUrlToPhotos).toHaveBeenCalledWith('p1', 'https://img/orig.jpg', false);
    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it('free user on someone ELSE’s post gets the Pro upsell', () => {
    mockIsPro = false;
    handleImageLongPress({ id: 'p1', imageUrl: 'https://img/orig.jpg' });
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Pro Feature',
      expect.any(String),
      expect.any(Array)
    );
    pressAlertButton('See Pro');
    expect(mockRouterPush).toHaveBeenCalledWith('/proStore');
    expect(mockSaveUrlToPhotos).not.toHaveBeenCalled();
  });

  it('always fires haptic feedback', () => {
    handleImageLongPress({ id: 'p1', imageUrl: 'https://img/orig.jpg' });
    expect(mockImpactAsync).toHaveBeenCalled();
  });
});

describe('saveHd — cache hit (instant resolve, no server call)', () => {
  it('Pro user with a cached HQ saves it immediately and skips the confirm', async () => {
    handleImageLongPress({
      id: 'p1',
      imageUrl: 'https://img/orig.jpg',
      imageUrlHq: 'https://img/hq.png',
    });
    // no "Save in HD" confirm — it's an instant cache hit
    expect(mockShowAlert).not.toHaveBeenCalled();
    // saveHd runs async; let the microtask flush
    await Promise.resolve();
    expect(mockSaveUrlToPhotos).toHaveBeenCalledWith('p1', 'https://img/hq.png', true);
    expect(mockInvoke).not.toHaveBeenCalled();
  });
});

describe('saveHd — on-demand upscale (server resolve)', () => {
  async function triggerHdSave(invokeResult: { data?: unknown; error?: unknown }) {
    mockInvoke.mockResolvedValue(invokeResult);
    handleImageLongPress({ id: 'p9', imageUrl: 'https://img/orig.jpg' });
    expect(mockShowAlert).toHaveBeenCalledWith('Save in HD', expect.any(String), expect.any(Array));
    await pressAlertButton('Save in HD');
  }

  it('status:done → saves the returned HQ url', async () => {
    await triggerHdSave({
      data: { status: 'done', image_url_hq: 'https://img/ready.png' },
      error: null,
    });
    expect(mockInvoke).toHaveBeenCalledWith('upscale-image', { body: { upload_id: 'p9' } });
    expect(mockSaveUrlToPhotos).toHaveBeenCalledWith('p9', 'https://img/ready.png', true);
    expect(mockModalShow).not.toHaveBeenCalled();
  });

  it('status:processing → shows the waiting/poll modal (secondary requester waits)', async () => {
    await triggerHdSave({ data: { status: 'processing' }, error: null });
    expect(mockModalShow).toHaveBeenCalledWith('p9');
    expect(mockSaveUrlToPhotos).not.toHaveBeenCalled();
  });

  it('monthly_cap_reached → shows the cap toast, saves nothing', async () => {
    await triggerHdSave({
      data: { error: 'monthly_cap_reached', message: 'cap hit' },
      error: null,
    });
    expect(mockToastShow).toHaveBeenCalledWith('cap hit', 'close-circle');
    expect(mockSaveUrlToPhotos).not.toHaveBeenCalled();
    expect(mockModalShow).not.toHaveBeenCalled();
  });

  it('transport error → user-facing error toast, never a silent failure', async () => {
    await triggerHdSave({ data: null, error: { message: 'network down' } });
    expect(mockToastShow).toHaveBeenCalledWith(
      expect.stringContaining('Couldn’t prepare your HD download'),
      'close-circle'
    );
    expect(mockSaveUrlToPhotos).not.toHaveBeenCalled();
  });
});
