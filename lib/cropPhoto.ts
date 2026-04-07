/**
 * cropToPortrait — center-crops an image to 9:16 portrait ratio.
 * Used right before sending photos to the AI generation API.
 * Previews show the original aspect ratio; this runs at generation time.
 */

import * as ImageManipulator from 'expo-image-manipulator';

const TARGET_RATIO = 9 / 16;

export async function cropToPortrait(uri: string): Promise<string> {
  const info = await ImageManipulator.manipulateAsync(uri, [], {});
  const w = info.width;
  const h = info.height;
  const currentRatio = w / h;

  let cropAction: ImageManipulator.Action | null = null;

  if (Math.abs(currentRatio - TARGET_RATIO) > 0.01) {
    if (currentRatio > TARGET_RATIO) {
      const newW = Math.round(h * TARGET_RATIO);
      cropAction = {
        crop: { originX: Math.round((w - newW) / 2), originY: 0, width: newW, height: h },
      };
    } else {
      const newH = Math.round(w / TARGET_RATIO);
      cropAction = {
        crop: { originX: 0, originY: Math.round((h - newH) / 2), width: w, height: newH },
      };
    }
  }

  const result = await ImageManipulator.manipulateAsync(uri, cropAction ? [cropAction] : [], {
    compress: 0.8,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: true,
  });

  return result.base64!;
}
