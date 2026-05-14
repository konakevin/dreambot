import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import { File, Paths } from 'expo-file-system';
import { router } from 'expo-router';
import { showAlert } from '@/components/CustomAlert';
import { Toast } from '@/components/Toast';
import { useAuthStore } from '@/store/auth';

async function saveToPhotos(id: string, imageUrl: string) {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    showAlert('Permission needed', 'Allow access to save images.');
    return;
  }
  try {
    // Pipeline produces JPG end-to-end. Match cache extension to URL's
    // ext for the rare PNG case (safety-redacted output).
    const urlMatch = imageUrl.match(/\.(\w+)(?:\?[^/]*)?$/);
    const rawExt = (urlMatch?.[1] ?? '').toLowerCase();
    const ext = ['jpg', 'jpeg', 'png'].includes(rawExt) ? rawExt : 'jpg';

    // Clear stale cache file from a prior save attempt — downloadFileAsync
    // throws "Destination already exists" instead of overwriting.
    const dest = new File(Paths.cache, `${id}.${ext}`);
    if (dest.exists) dest.delete();

    const downloaded = await File.downloadFileAsync(imageUrl, dest);

    // Use createAssetAsync (modern PHPhotoLibrary.performChanges API), not
    // saveToLibraryAsync — the latter wraps the legacy
    // UIImageWriteToSavedPhotosAlbum which intermittently fails with
    // "Asset couldn't be saved to photo library: Unknown error" on iOS 18+.
    await MediaLibrary.createAssetAsync(downloaded.uri);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Toast.show('Saved to photos', 'checkmark-circle');
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
    // Own post (or admin) — always unrestricted save + delete
    showAlert('Options', '', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Save to Photos',
        onPress: () => saveToPhotos(opts.id, opts.imageUrl),
      },
      {
        text: 'Delete',
        style: 'destructive' as const,
        onPress: opts.onDelete!,
      },
    ]);
    return;
  }

  // Someone else's content — gate save on Pro entitlement
  const { isPro } = useAuthStore.getState();
  if (isPro) {
    showAlert('Save Image', 'Save this dream to your photos?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Save', onPress: () => saveToPhotos(opts.id, opts.imageUrl) },
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
