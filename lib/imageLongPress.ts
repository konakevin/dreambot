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
 * Fetches the HQ URL for a given upload — runs Real-ESRGAN 4× upscale
 * via the upscale-image Edge Function. Caches the result on the row, so
 * subsequent calls for the same upload short-circuit and return instantly.
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

async function saveToPhotos(id: string, imageUrl: string, upscale: boolean) {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    showAlert('Permission needed', 'Allow access to save images.');
    return;
  }

  // ── HQ pathway (Pro users) ────────────────────────────────────────────
  // Pro users get a 2× Real-ESRGAN HD upscale on every save (own posts
  // or others'). The first request for any given post incurs ~5-10s
  // wait; subsequent requests return instantly thanks to the
  // image_url_hq cache on the uploads row.
  let urlToSave = imageUrl;
  if (upscale) {
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
    Toast.show(upscale ? 'Saved in HD' : 'Saved to photos', 'checkmark-circle');
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
 *     Real-ESRGAN 4× upscale (cached server-side after first request).
 *
 * Free user + not-own post → upsell only (no save).
 * Free user + own post (no Pro) → original-res save unrestricted.
 * Pro user (any post) → 4K upscale save.
 */
export function handleImageLongPress(opts: {
  id: string;
  imageUrl: string;
  onDelete?: () => void;
  onDreamLikeThis?: () => void;
}) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

  const { isPro } = useAuthStore.getState();
  const canDelete = !!opts.onDelete;
  const saveLabel = isPro ? 'Save in HD' : 'Save to Photos';

  if (canDelete) {
    // Owner or admin — show Save + Delete.
    showAlert('Options', '', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: saveLabel,
        onPress: () => saveToPhotos(opts.id, opts.imageUrl, isPro),
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
    showAlert('Save in HD', 'Upscale to HD and save? This usually takes 5-10 seconds.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Save', onPress: () => saveToPhotos(opts.id, opts.imageUrl, true) },
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
