/**
 * Profile picture sources + the final crop, for Move and Scale (app/avatarFrame.tsx).
 *
 * Every source (one of your dreams, a library photo, a camera photo) is first turned
 * into a local JPEG with its rotation baked in and its pixel size known, so the crop
 * math in lib/avatarCrop.ts works in real pixels. The cropped square then goes through
 * the existing avatar upload (useAvatarUpload → avatars/<you>/avatar.jpg), which makes
 * it a COPY: a profile picture from a private dream never points at the dream's own
 * file, and it keeps working if the dream is deleted.
 */
import { File, Paths } from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { AVATAR_OUTPUT_PX, type CropRect, type PictureSize } from '@/lib/avatarCrop';

/** Long side of the prepared picture. Enough for a sharp 512px avatar at max zoom. */
const PREP_MAX_PX = 2048;

/** Dreams open with the frame a little above the middle, where people usually are. */
export const DREAM_FOCUS_Y = 0.4;

export type AvatarSourceKind = 'dream' | 'library' | 'camera';

export interface PreparedPicture extends PictureSize {
  uri: string;
}

/**
 * A local, upright JPEG of the picture with its size. Dream URLs are downloaded to
 * the cache first. Camera photos carry their rotation in EXIF, which a crop would
 * otherwise ignore, so the first pass re-encodes (baking it in) before any crop.
 */
export async function prepareAvatarSource(uri: string): Promise<PreparedPicture> {
  let local = uri;
  if (/^https?:\/\//i.test(uri)) {
    const ext = (uri.match(/\.(jpe?g|png|webp)(?:\?|$)/i)?.[1] ?? 'jpg').toLowerCase();
    const dest = new File(Paths.cache, `avatar-source-${Date.now()}.${ext}`);
    const downloaded = await File.downloadFileAsync(uri, dest);
    local = downloaded.uri;
  }
  const upright = await ImageManipulator.manipulateAsync(local, [], {
    format: ImageManipulator.SaveFormat.JPEG,
    compress: 0.92,
  });
  if (Math.max(upright.width, upright.height) <= PREP_MAX_PX) {
    return { uri: upright.uri, width: upright.width, height: upright.height };
  }
  const resize = upright.width >= upright.height ? { width: PREP_MAX_PX } : { height: PREP_MAX_PX };
  const small = await ImageManipulator.manipulateAsync(upright.uri, [{ resize }], {
    format: ImageManipulator.SaveFormat.JPEG,
    compress: 0.92,
  });
  return { uri: small.uri, width: small.width, height: small.height };
}

/** Cut the framed square out of a prepared picture and size it for upload. */
export async function cropAvatar(source: PreparedPicture, rect: CropRect): Promise<string> {
  const out = await ImageManipulator.manipulateAsync(
    source.uri,
    [{ crop: rect }, { resize: { width: AVATAR_OUTPUT_PX } }],
    { format: ImageManipulator.SaveFormat.JPEG, compress: 0.85 }
  );
  return out.uri;
}

/**
 * Link to Move and Scale, as a path string (the same shape as headerPickerHref, so
 * the long-press menus can push it). `fromPicker` = opened from the dream picker, so
 * a save closes both screens.
 */
export function avatarFrameHref(opts: {
  uri: string;
  source: AvatarSourceKind;
  fromPicker?: boolean;
}): `/avatarFrame?${string}` {
  const q: [string, string][] = [
    ['uri', opts.uri],
    ['source', opts.source],
  ];
  if (opts.fromPicker) q.push(['from', 'picker']);
  return `/avatarFrame?${q.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`;
}
