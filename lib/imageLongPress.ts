import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import { File, Paths } from 'expo-file-system';
import { router } from 'expo-router';
import { showAlert } from '@/components/CustomAlert';
import { Toast } from '@/components/Toast';
import { UpscaleOverlay } from '@/components/UpscaleOverlay';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';

/**
 * Fetches the HQ URL for a given upload — invokes the upscale-image
 * Edge Function which runs Clarity Upscaler 4× and caches the result
 * on uploads.image_url_hq. Subsequent calls short-circuit instantly.
 *
 * Returns null on failure (caller falls back to the original-res URL).
 */
async function fetchHqUrl(uploadId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke<{
      image_url_hq?: string;
      cached?: boolean;
      error?: string;
    }>('upscale-image', { body: { upload_id: uploadId } });
    if (error) {
      if (__DEV__) console.warn('[fetchHqUrl] invoke error', error.message);
      return null;
    }
    if (!data?.image_url_hq) {
      if (__DEV__) console.warn('[fetchHqUrl] no image_url_hq in response', data);
      return null;
    }
    return data.image_url_hq;
  } catch (err) {
    if (__DEV__) console.warn('[fetchHqUrl] threw', err);
    return null;
  }
}

async function saveToPhotos(
  id: string,
  imageUrl: string,
  upscale: boolean,
  cachedHqUrl: string | null = null
) {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    showAlert('Permission needed', 'Allow access to save images.');
    return;
  }

  // ── HQ pathway (Pro users) ────────────────────────────────────────────
  // Three subcases:
  //   1. Pre-cached HQ (cachedHqUrl provided) — instant save, no overlay
  //   2. Pro + no cache — show overlay, invoke upscale-image, ~25-35s wait
  //   3. Free user — original-res URL, no upscale path
  //
  // Bot posts are pre-upscaled at render time so case 1 covers most
  // bot saves. Pro user creates are pre-upscaled in the background so
  // case 1 also covers most "save your own dream" flows once the
  // background upscale has had a chance to finish.
  let urlToSave = imageUrl;
  if (cachedHqUrl) {
    urlToSave = cachedHqUrl;
  } else if (upscale) {
    UpscaleOverlay.show();
    try {
      const hqUrl = await fetchHqUrl(id);
      if (hqUrl) urlToSave = hqUrl;
      // If upscale fails, we silently fall back to the original-res URL
      // rather than blocking the save entirely.
    } finally {
      UpscaleOverlay.hide();
    }
  }

  try {
    // Pipeline produces JPG end-to-end. Match cache extension to URL's
    // ext for the rare PNG case (safety-redacted output).
    const urlMatch = urlToSave.match(/\.(\w+)(?:\?[^/]*)?$/);
    const rawExt = (urlMatch?.[1] ?? '').toLowerCase();
    const ext = ['jpg', 'jpeg', 'png'].includes(rawExt) ? rawExt : 'jpg';

    // Clear stale cache file from a prior save attempt — downloadFileAsync
    // throws "Destination already exists" instead of overwriting.
    const dest = new File(Paths.cache, `${id}.${ext}`);
    if (dest.exists) dest.delete();

    const downloaded = await File.downloadFileAsync(urlToSave, dest);

    // Use createAssetAsync (modern PHPhotoLibrary.performChanges API), not
    // saveToLibraryAsync — the latter wraps the legacy
    // UIImageWriteToSavedPhotosAlbum which intermittently fails with
    // "Asset couldn't be saved to photo library: Unknown error" on iOS 18+.
    await MediaLibrary.createAssetAsync(downloaded.uri);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Toast.show(upscale ? 'Saved in 4K' : 'Saved to photos', 'checkmark-circle');
  } catch (err) {
    if (__DEV__) console.warn('[saveToPhotos] failed', err);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Toast.show('Failed to save image', 'close-circle');
  }
}

/**
 * Standard long-press handler for images.
 *
 * Two orthogonal gates: ownership/admin (delete affordance) and Pro
 * entitlement (4K upscale).
 *   - `onDelete` set: caller is owner OR admin → shows Delete in menu.
 *   - `isPro`: caller has active Pro subscription → save triggers a
 *     Clarity Upscaler 4× upscale (cached server-side after first request).
 *
 * `imageUrlHq` is read from the post object (DreamPostItem.image_url_hq)
 * — the feed RPC and direct uploads SELECTs already carry it, so we
 * never need a DB roundtrip at long-press time. When present, the
 * cached HQ is used directly (no overlay, no upscale call). When null,
 * Pro users get the "this will take ~30s" confirm + post-tap overlay.
 *
 * Free user + not-own post → upsell only (no save).
 * Free user + own post (no Pro) → original-res save unrestricted.
 * Pro user (any post) → 4K save (instant if cached, else ~30s wait).
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
  const saveLabel = isPro ? 'Save in 4K' : 'Save to Photos';

  if (canDelete) {
    // Owner or admin — show Save + Delete.
    showAlert('Options', '', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: saveLabel,
        onPress: () => saveToPhotos(opts.id, opts.imageUrl, isPro, cachedHqUrl),
      },
      {
        text: 'Delete',
        style: 'destructive' as const,
        onPress: opts.onDelete!,
      },
    ]);
    return;
  }

  // Not owner/admin — Pro-only save with upscale, or upsell.
  if (isPro) {
    // Cached HQ → instant save. Skip the alert entirely; saves a tap
    // and matches the "feels free" UX of pre-upscaled bot posts.
    if (cachedHqUrl) {
      saveToPhotos(opts.id, opts.imageUrl, true, cachedHqUrl);
      return;
    }
    // No cache → show the wait warning.
    showAlert('Save in 4K', 'Upscale to 4K and save? This usually takes 25-35 seconds.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Save', onPress: () => saveToPhotos(opts.id, opts.imageUrl, true, null) },
    ]);
    return;
  }

  // Free user, not own post — show upsell instead of save.
  showAlert(
    'Pro Feature',
    'Saving dreams from other creators is a Pro feature. Subscribe for unlimited HQ downloads.',
    [
      { text: 'Not now', style: 'cancel' },
      { text: 'See Pro', onPress: () => router.push('/proStore') },
    ]
  );
}
