/**
 * Canonical "upload or take a photo" sheet rows — the SINGLE source of truth so
 * every photo-source sheet (Create dream photo, profile avatar, edit-profile
 * avatar) is identical by construction: same order, labels, and icons.
 *
 * Order: library first (most users pick an existing photo), then camera, then an
 * optional destructive Delete. Labels are sentence case + icons are outline, to
 * match the house style shared by every other PostActionSheet.
 *
 * Feed the result straight to `<PostActionSheet rows={...} />`.
 */
import type { PostActionRow } from '@/lib/imageLongPress';

export function photoSourceRows(opts: {
  /** Open the photo library / gallery. */
  onLibrary: () => void;
  /** Open the camera. */
  onCamera: () => void;
  /** When provided, appends a destructive "Delete photo" row (e.g. avatars). */
  onDelete?: () => void;
}): PostActionRow[] {
  const rows: PostActionRow[] = [
    {
      key: 'library',
      label: 'Choose from library',
      icon: 'images-outline',
      group: 'primary',
      onPress: opts.onLibrary,
    },
    {
      key: 'camera',
      label: 'Take photo',
      icon: 'camera-outline',
      group: 'primary',
      onPress: opts.onCamera,
    },
  ];
  if (opts.onDelete) {
    rows.push({
      key: 'delete',
      label: 'Delete photo',
      icon: 'trash-outline',
      group: 'danger',
      destructive: true,
      onPress: opts.onDelete,
    });
  }
  return rows;
}
