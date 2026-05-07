import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import { File, Paths } from 'expo-file-system';
import { showAlert } from '@/components/CustomAlert';
import { Toast } from '@/components/Toast';

async function saveToPhotos(id: string, imageUrl: string) {
  console.log('[SAVE] start', { id, imageUrl });
  const { status } = await MediaLibrary.requestPermissionsAsync();
  console.log('[SAVE] permission status:', status);
  if (status !== 'granted') {
    showAlert('Permission needed', 'Allow access to save images.');
    return;
  }
  try {
    const urlMatch = imageUrl.match(/\.(\w+)(?:\?[^/]*)?$/);
    const rawExt = (urlMatch?.[1] ?? '').toLowerCase();
    const ext = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'gif'].includes(rawExt) ? rawExt : 'jpg';
    console.log('[SAVE] detected ext:', ext, 'rawExt:', rawExt);

    const dest = new File(Paths.cache, `${id}.${ext}`);
    console.log('[SAVE] cache dest:', dest.uri);

    const downloaded = await File.downloadFileAsync(imageUrl, dest);
    console.log(
      '[SAVE] downloaded uri:',
      downloaded.uri,
      'exists:',
      downloaded.exists,
      'size:',
      downloaded.size
    );

    // iOS PHPhotoLibrary rejects WebP outright ("Asset couldn't be saved
    // to photo library: Unknown error"). Convert webp to PNG (lossless)
    // before saving — preserves the source pixels exactly with no
    // additional compression loss on top of the original webp encode.
    // PNG output is larger (~3-5MB vs the source ~500KB webp) but it's
    // a one-shot user-initiated save, file size is acceptable.
    let saveUri = downloaded.uri;
    if (ext === 'webp') {
      const converted = await ImageManipulator.manipulateAsync(downloaded.uri, [], {
        format: ImageManipulator.SaveFormat.PNG,
      });
      saveUri = converted.uri;
      console.log('[SAVE] webp→png (lossless) converted:', saveUri);
    }

    await MediaLibrary.saveToLibraryAsync(saveUri);
    console.log('[SAVE] saveToLibraryAsync OK');

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Toast.show('Saved to photos', 'checkmark-circle');
  } catch (err) {
    const e = err as Error;
    console.log('[SAVE] FAILED:', e?.message || String(err));
    console.log('[SAVE] stack:', e?.stack || '(no stack)');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Toast.show('Failed to save image', 'close-circle');
  }
}

/**
 * Standard long-press handler for images.
 * - Not your post: straight to save confirmation
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
        onPress: () => {
          showAlert('Save Image', 'Save this dream to your photos?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Save', onPress: () => saveToPhotos(opts.id, opts.imageUrl) },
          ]);
        },
      },
      {
        text: 'Delete',
        style: 'destructive' as const,
        onPress: opts.onDelete!,
      },
    ]);
  } else {
    showAlert('Save Image', 'Save this dream to your photos?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Save', onPress: () => saveToPhotos(opts.id, opts.imageUrl) },
    ]);
  }
}
