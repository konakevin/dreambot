import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
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
    // Match cache-file extension to the actual remote format. After the
    // 2026-05-06 webp pipeline migration, image_url ends in .webp for
    // direct Flux output, .jpg for face-swap output, .png in rare cases.
    const urlMatch = imageUrl.match(/\.(\w+)(?:\?[^/]*)?$/);
    const rawExt = (urlMatch?.[1] ?? '').toLowerCase();
    const ext = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'gif'].includes(rawExt) ? rawExt : 'jpg';

    // Clear stale cache file from a prior save attempt — downloadFileAsync
    // throws "Destination already exists" instead of overwriting.
    const dest = new File(Paths.cache, `${id}.${ext}`);
    if (dest.exists) dest.delete();

    const downloaded = await File.downloadFileAsync(imageUrl, dest);

    // iOS PHPhotoLibrary rejects WebP outright. Convert webp→PNG before
    // saving — PNG is lossless so the saved pixels are bit-for-bit
    // identical to the decoded webp (no second lossy compression).
    let saveUri = downloaded.uri;
    if (ext === 'webp') {
      const converted = await ImageManipulator.manipulateAsync(downloaded.uri, [], {
        format: ImageManipulator.SaveFormat.PNG,
      });
      saveUri = converted.uri;
    }

    await MediaLibrary.saveToLibraryAsync(saveUri);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Toast.show('Saved to photos', 'checkmark-circle');
  } catch {
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
