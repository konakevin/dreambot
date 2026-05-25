import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { showAlert } from '@/components/CustomAlert';
import { Toast } from '@/components/Toast';
import { UpscaleModal } from '@/components/UpscaleOverlay';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { saveUrlToPhotos } from '@/lib/savePhoto';

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
  if (cachedHqUrl) {
    await saveUrlToPhotos(id, cachedHqUrl, true);
    return;
  }
  const res = await requestUpscale(id);
  if (res?.status === 'done' && res.image_url_hq) {
    await saveUrlToPhotos(id, res.image_url_hq, true);
    return;
  }
  if (res?.status === 'processing') {
    UpscaleModal.show(id);
    return;
  }
  if (res?.error === 'monthly_cap_reached') {
    Toast.show(res.message ?? "You've hit your monthly HD download limit.", 'close-circle');
    return;
  }
  Toast.show('Couldn’t prepare your HD download — try again.', 'close-circle');
}

/**
 * Standard long-press handler for images.
 *
 * Gates: ownership/admin (delete affordance) and Pro entitlement (HD save).
 *   - Free user, own post → original-res save.
 *   - Pro user, any post → HD save: instant if cached, else an on-demand
 *     upscale (dismissable "preparing" modal that auto-saves when ready).
 *   - Free user, not own post → Pro upsell.
 *
 * `imageUrlHq` is read from the post object — present only when a prior
 * downloader already upscaled it (then it's an instant cache hit).
 */
export function handleImageLongPress(opts: {
  id: string;
  imageUrl: string;
  imageUrlHq?: string | null;
  onDelete?: () => void;
  onDreamLikeThis?: () => void;
}) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

  const { isPro } = useAuthStore.getState();
  const canDelete = !!opts.onDelete;
  const cachedHqUrl = isPro ? (opts.imageUrlHq ?? null) : null;
  const saveLabel = isPro ? 'Save in HD' : 'Save to Photos';

  const doSave = () =>
    isPro ? saveHd(opts.id, cachedHqUrl) : saveUrlToPhotos(opts.id, opts.imageUrl, false);

  if (canDelete) {
    // Owner or admin — Save + Delete.
    showAlert('Options', '', [
      { text: 'Cancel', style: 'cancel' },
      { text: saveLabel, onPress: doSave },
      { text: 'Delete', style: 'destructive' as const, onPress: opts.onDelete! },
    ]);
    return;
  }

  // Not owner/admin — Pro-only save, or upsell.
  if (isPro) {
    if (cachedHqUrl) {
      // Already upscaled by someone — instant, skip the confirm.
      saveHd(opts.id, cachedHqUrl);
      return;
    }
    // No cache yet — confirm (it counts toward the monthly HD cap), then the
    // modal handles the async wait. No "~30s" promise; it's non-blocking now.
    showAlert('Save in HD', "We'll prepare an HD version and save it to your photos.", [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Save in HD', onPress: () => saveHd(opts.id, null) },
    ]);
    return;
  }

  // Free user, not own post — upsell.
  showAlert(
    'Pro Feature',
    'Saving dreams from other creators is a Pro feature. Subscribe for HD downloads.',
    [
      { text: 'Not now', style: 'cancel' },
      { text: 'See Pro', onPress: () => router.push('/proStore') },
    ]
  );
}
