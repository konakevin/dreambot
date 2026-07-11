import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import { File, Paths } from 'expo-file-system';
import { showAlert } from '@/components/CustomAlert';
import { Toast } from '@/components/Toast';

/**
 * Download an image URL and save it to the camera roll.
 *
 * Shared by the instant-save path (imageLongPress) and the HD-ready path
 * (UpscaleModal auto-save / download_ready notification tap). Pipeline is PNG
 * end-to-end (the HD upscale + most originals); ext is matched to the URL.
 *
 * Returns true on success.
 */
/**
 * Download one image URL into the camera roll. No permission prompt, no toast,
 * no haptic — the caller owns those (so a batch save asks once + summarizes
 * once). Throws on failure. Shared by the single + album save paths below.
 */
async function downloadAndCreateAsset(id: string, url: string): Promise<void> {
  const urlMatch = url.match(/\.(\w+)(?:\?[^/]*)?$/);
  const rawExt = (urlMatch?.[1] ?? '').toLowerCase();
  const ext = ['jpg', 'jpeg', 'png'].includes(rawExt) ? rawExt : 'png';

  // Clear any stale cache file from a prior attempt — downloadFileAsync throws
  // "Destination already exists" instead of overwriting.
  const dest = new File(Paths.cache, `${id}.${ext}`);
  if (dest.exists) dest.delete();

  const downloaded = await File.downloadFileAsync(url, dest);
  // createAssetAsync (modern PHPhotoLibrary API) — saveToLibraryAsync wraps the
  // legacy UIImageWriteToSavedPhotosAlbum which intermittently fails on iOS 18+.
  await MediaLibrary.createAssetAsync(downloaded.uri);
}

export async function saveUrlToPhotos(id: string, url: string, asHd: boolean): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    showAlert('Permission needed', 'Allow access to save images.');
    return false;
  }
  try {
    await downloadAndCreateAsset(id, url);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Toast.show(asHd ? 'Saved in HD' : 'Saved to photos', 'checkmark-circle');
    return true;
  } catch (err) {
    if (__DEV__) console.warn('[saveUrlToPhotos] failed', err);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Toast.show('Failed to save image', 'close-circle');
    return false;
  }
}

/**
 * Save EVERY image in an album to the camera roll (grid album long-press →
 * "Save album to Photos", Kevin 2026-07-11). One permission prompt, sequential
 * downloads (native res, matching the single Save-to-Photos), one summary toast.
 * Partial failures degrade gracefully to "Saved X of N".
 */
export async function saveAlbumToPhotos(albumId: string, urls: string[]): Promise<boolean> {
  if (urls.length === 0) return false;
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    showAlert('Permission needed', 'Allow access to save images.');
    return false;
  }
  const total = urls.length;
  Toast.show(`Saving ${total} photos…`, 'download-outline');
  let saved = 0;
  for (let i = 0; i < urls.length; i++) {
    try {
      await downloadAndCreateAsset(`${albumId}-${i}`, urls[i]);
      saved++;
    } catch (err) {
      if (__DEV__) console.warn('[saveAlbumToPhotos] failed', urls[i], err);
    }
  }
  if (saved === 0) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Toast.show('Failed to save album', 'close-circle');
    return false;
  }
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  Toast.show(
    saved === total ? `Saved ${total} to photos` : `Saved ${saved} of ${total} to photos`,
    'checkmark-circle'
  );
  return true;
}
