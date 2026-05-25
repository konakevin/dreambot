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
export async function saveUrlToPhotos(id: string, url: string, asHd: boolean): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    showAlert('Permission needed', 'Allow access to save images.');
    return false;
  }
  try {
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
