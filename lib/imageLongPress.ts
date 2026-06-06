import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { showAlert } from '@/components/CustomAlert';
import { Toast } from '@/components/Toast';
import { UpscaleModal } from '@/components/UpscaleOverlay';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { saveUrlToPhotos } from '@/lib/savePhoto';
import { trackHdDownloadTapped } from '@/lib/analytics';

interface UpscaleResponse {
  status?: 'done' | 'processing';
  image_url_hq?: string;
  error?: string;
  message?: string;
}

/**
 * Ask the server for the HD version (request-upscale / upscale-image).
 * Async contract:
 *   { status: 'done', image_url_hq } — already cached, save now
 *   { status: 'processing' }         — kicked (or joined) an upscale; the user
 *                                      gets a dismissable modal + a notification
 *   { error: 'monthly_cap_reached' } — over the monthly HD cap
 * Returns null on transport error.
 */
async function requestUpscale(uploadId: string): Promise<UpscaleResponse | null> {
  try {
    const { data, error } = await supabase.functions.invoke<UpscaleResponse>('upscale-image', {
      body: { upload_id: uploadId },
    });
    if (error) {
      if (__DEV__) console.warn('[requestUpscale] invoke error', error.message);
      return null;
    }
    return data ?? null;
  } catch (err) {
    if (__DEV__) console.warn('[requestUpscale] threw', err);
    return null;
  }
}

/**
 * Pro HD save. Cached → instant. Else request the upscale: a cache hit saves
 * immediately; otherwise we show the dismissable modal (it auto-saves the
 * moment the HD lands, or the user gets a `download_ready` notification).
 */
async function saveHd(id: string, cachedHqUrl: string | null) {
  trackHdDownloadTapped({ cached: !!cachedHqUrl });
  if (cachedHqUrl) {
    await saveUrlToPhotos(id, cachedHqUrl, true);
    return;
  }
  // Open the modal IMMEDIATELY (in its 'requesting' state) so there's no dead
  // gap while the upscale-image round-trip (~1s) resolves; the copy updates
  // below once we know the outcome. The poll inside the modal starts now too,
  // so a fast cache-hit still auto-saves.
  UpscaleModal.show(id);
  const res = await requestUpscale(id);
  if (res?.status === 'done' && res.image_url_hq) {
    // Raced a cache hit (another requester just finished it) — save + close.
    await saveUrlToPhotos(id, res.image_url_hq, true);
    UpscaleModal.hide();
    return;
  }
  if (res?.status === 'processing') {
    UpscaleModal.setProcessing(id); // poll already running; just update the copy
    return;
  }
  // Failure — tear down the modal and surface why.
  UpscaleModal.hide();
  if (res?.error === 'monthly_cap_reached') {
    Toast.show(res.message ?? "You've hit your monthly HD download limit.", 'close-circle');
    return;
  }
  Toast.show('Couldn’t prepare your HD download — try again.', 'close-circle');
}

interface SaveOpts {
  id: string;
  imageUrl: string;
  /** Cached HD url from the post object — present only when a prior downloader
   *  already upscaled it (then HD is an instant cache hit). */
  imageUrlHq?: string | null;
}
interface LongPressOpts extends SaveOpts {
  onDelete?: () => void;
  onDreamLikeThis?: () => void;
}
type SheetButton = { text: string; style?: 'cancel' | 'destructive'; onPress?: () => void };

/**
 * The two quality options shared by the Download button and the long-press menu:
 *   - Save to Photos — native-res, free for everyone, any post.
 *   - Save in HD     — Pro: cache hit = instant, else on-demand upscale (modal
 *                       auto-saves when ready). Free: routes to the paywall, so
 *                       the download moment doubles as the HD upsell.
 *
 * The ✨ that used to follow "HD" rendered as a broken-glyph placeholder
 * in the CustomAlert button on some iOS font configurations — dropped
 * 2026-06-06. The "(Pro)" suffix on the free-tier variant carries the
 * upsell hint on its own.
 */
function downloadOptionButtons(opts: SaveOpts): SheetButton[] {
  const { isPro } = useAuthStore.getState();
  const cachedHqUrl = isPro ? (opts.imageUrlHq ?? null) : null;
  return [
    { text: 'Save to Photos', onPress: () => saveUrlToPhotos(opts.id, opts.imageUrl, false) },
    {
      text: isPro ? 'Save in HD' : 'Save in HD (Pro)',
      onPress: () => (isPro ? saveHd(opts.id, cachedHqUrl) : router.push('/proStore')),
    },
  ];
}

/**
 * Visible Download button → the quality sheet. Picking "Save in HD" IS the
 * confirm (the cap-warning dialog is gone); the modal opens instantly.
 */
export function openDownloadSheet(opts: SaveOpts) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  showAlert('Download', '', [{ text: 'Cancel', style: 'cancel' }, ...downloadOptionButtons(opts)]);
}

/**
 * Long-press menu = the quality options plus context actions (Dream like this,
 * Delete) for owners/admins. CustomAlert auto-stacks when there are ≠2 buttons
 * and floats Cancel to the bottom.
 */
export function handleImageLongPress(opts: LongPressOpts) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  const buttons: SheetButton[] = [
    { text: 'Cancel', style: 'cancel' },
    ...downloadOptionButtons(opts),
  ];
  if (opts.onDreamLikeThis) {
    buttons.push({ text: 'Dream like this', onPress: opts.onDreamLikeThis });
  }
  if (opts.onDelete) {
    buttons.push({ text: 'Delete', style: 'destructive', onPress: opts.onDelete });
  }
  showAlert(opts.onDelete ? 'Options' : 'Download', '', buttons);
}

/**
 * Auto-save the HD copy after a `download_ready` notification tap. By now the
 * upscale is cached, so saveHd's first server round-trip returns {done} and
 * saves instantly (the modal flashes 'requesting' → 'Saved in HD'). Idempotent
 * and cap-free — upscale-image's cache-hit branch returns before charging.
 */
export function saveReadyHdDownload(uploadId: string) {
  return saveHd(uploadId, null);
}
