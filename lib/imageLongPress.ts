import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import { File, Paths } from 'expo-file-system';
import { showAlert } from '@/components/CustomAlert';
import { Toast } from '@/components/Toast';

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

    const dest = new File(Paths.cache, `${id}.${ext}`);
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
 * - Not your post: saves immediately (toast confirms)
 * - Your post: Options menu with Save + Delete
 */
export function handleImageLongPress(opts: {
  id: string;
  imageUrl: string;
  onDelete?: () => void;
  onDreamLikeThis?: () => void;
}) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

  if (opts.onDelete) {
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
  } else {
    saveToPhotos(opts.id, opts.imageUrl);
  }
}
