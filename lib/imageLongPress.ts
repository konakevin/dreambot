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

async function saveToPhotos(id: string, imageUrl: string, isOwnPost: boolean) {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    showAlert('Permission needed', 'Allow access to save images.');
    return;
  }

  // ── HQ pathway (Pro user saving someone else's post) ──────────────────
  // Pro users saving someone else's content get a 4× upscale. The first
  // request for any given post incurs ~15-25s wait; subsequent requests
  // return instantly thanks to the image_url_hq cache.
  //
  // Own-post saves still use the original-res image (Pro is about saving
  // _other people's_ dreams — users always have full access to their own).
  let urlToSave = imageUrl;
  if (!isOwnPost) {
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
    Toast.show(isOwnPost ? 'Saved to photos' : 'Saved in 4K', 'checkmark-circle');
  } catch (err) {
    if (__DEV__) console.warn('[saveToPhotos] failed', err);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Toast.show('Failed to save image', 'close-circle');
  }
}

/**
 * Standard long-press handler for images.
 *
 * Save-to-Photos is gated by ownership + Pro entitlement:
 *   - Your own post (or you're admin) → callers pass `onDelete`. Save is
 *     unrestricted; menu shows Save + Delete.
 *   - Someone else's post (bot or other user) → callers omit `onDelete`.
 *     Save requires `isPro` (active Pro subscription). If not Pro, the
 *     long-press shows an upsell prompt routing to /proStore instead of
 *     saving the image.
 */
export function handleImageLongPress(opts: {
  id: string;
  imageUrl: string;
  onDelete?: () => void;
  onDreamLikeThis?: () => void;
}) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

  if (opts.onDelete) {
    // Own post (or admin) — always unrestricted save + delete.
    // Own-post saves keep the original-res image (no upscale — users
    // already have full access to their own renders).
    showAlert('Options', '', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Save to Photos',
        onPress: () => saveToPhotos(opts.id, opts.imageUrl, true),
      },
      {
        text: 'Delete',
        style: 'destructive' as const,
        onPress: opts.onDelete!,
      },
    ]);
    return;
  }

  // Someone else's content — gate save on Pro entitlement.
  // Pro users get a 4× upscale on first save of any given post; the
  // backend caches it so subsequent saves are instant.
  const { isPro } = useAuthStore.getState();
  if (isPro) {
    showAlert('Save in 4K', 'Upscale to 4K and save? This usually takes 15-25 seconds.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Save', onPress: () => saveToPhotos(opts.id, opts.imageUrl, false) },
    ]);
    return;
  }

  // Free user — show upsell instead of save
  showAlert(
    'Pro Feature',
    'Saving dreams from other creators is a Pro feature. Subscribe for unlimited HQ downloads.',
    [
      { text: 'Not now', style: 'cancel' },
      { text: 'See Pro', onPress: () => router.push('/proStore') },
    ]
  );
}
