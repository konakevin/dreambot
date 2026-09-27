/**
 * Move and Scale math for a profile picture: a picture under a fixed square frame
 * (drawn as a circle), zoomed and dragged, turned into the square crop that becomes
 * `avatar.jpg`.
 *
 * The crop is baked into the uploaded file on the phone, so every place that shows an
 * avatar (feed, comments, inbox, website) keeps working untouched; nothing about the
 * framing is stored on the server.
 *
 * Model: at zoom 1 the picture just COVERS the frame (its shorter side equals the
 * frame side). `x`/`y` are how far the picture's centre sits from the frame's centre,
 * in points (positive = moved right/down). Offsets are always clamped so the frame
 * never shows past the picture's edge, which means a tall dream at zoom 1 can only
 * move up and down; zooming in opens up sideways room.
 *
 * Every function is a worklet so the gesture handlers can call it on the UI thread.
 */

export interface PictureSize {
  width: number;
  height: number;
}

export interface CropState {
  zoom: number;
  /** Picture centre minus frame centre, in points. */
  x: number;
  y: number;
}

export interface CropRect {
  originX: number;
  originY: number;
  width: number;
  height: number;
}

/** The crop never goes below this many source pixels, so the 512px avatar stays sharp. */
export const AVATAR_MIN_SOURCE_PX = 256;
/** Hard cap even for huge camera photos, so zoom stays a usable gesture. */
export const AVATAR_MAX_ZOOM = 5;
/** The uploaded file's side, in pixels (matches useAvatarUpload's downscale). */
export const AVATAR_OUTPUT_PX = 512;

/** Points per source pixel at zoom 1: the picture's shorter side fills the frame. */
export function baseScale(pic: PictureSize, frame: number): number {
  'worklet';
  return frame / Math.min(pic.width, pic.height);
}

/** Highest zoom that still leaves at least AVATAR_MIN_SOURCE_PX in the crop. */
export function maxZoom(pic: PictureSize): number {
  'worklet';
  const bySharpness = Math.min(pic.width, pic.height) / AVATAR_MIN_SOURCE_PX;
  return Math.max(1, Math.min(AVATAR_MAX_ZOOM, bySharpness));
}

export function clampZoom(pic: PictureSize, zoom: number): number {
  'worklet';
  return Math.min(Math.max(zoom, 1), maxZoom(pic));
}

/** How far the picture can move on each axis at this zoom before the frame shows an edge. */
export function offsetLimits(
  pic: PictureSize,
  frame: number,
  zoom: number
): { x: number; y: number } {
  'worklet';
  const s = baseScale(pic, frame) * zoom;
  return {
    x: Math.max(0, (pic.width * s - frame) / 2),
    y: Math.max(0, (pic.height * s - frame) / 2),
  };
}

/** Zoom and offsets pulled back inside their limits. */
export function clampCrop(pic: PictureSize, frame: number, state: CropState): CropState {
  'worklet';
  const zoom = clampZoom(pic, state.zoom);
  const lim = offsetLimits(pic, frame, zoom);
  return {
    zoom,
    x: Math.min(Math.max(state.x, -lim.x), lim.x),
    y: Math.min(Math.max(state.y, -lim.y), lim.y),
  };
}

/**
 * Starting framing: zoom 1, centred left-right, with the frame's centre at `focusY`
 * (0 = top, 1 = bottom) of the picture. Dreams start a little above the middle, where
 * people usually are; camera and library photos start centred.
 */
export function initialCrop(pic: PictureSize, frame: number, focusY = 0.5): CropState {
  'worklet';
  const s = baseScale(pic, frame);
  return clampCrop(pic, frame, { zoom: 1, x: 0, y: (0.5 - focusY) * pic.height * s });
}

/**
 * One pinch step: zoom by `ratio` around `focal` (a point relative to the frame's
 * centre, in points), so the spot under the fingers stays under the fingers.
 */
export function pinchStep(
  pic: PictureSize,
  frame: number,
  state: CropState,
  ratio: number,
  focal: { x: number; y: number }
): CropState {
  'worklet';
  const zoom = clampZoom(pic, state.zoom * ratio);
  const r = zoom / state.zoom;
  return clampCrop(pic, frame, {
    zoom,
    x: focal.x - (focal.x - state.x) * r,
    y: focal.y - (focal.y - state.y) * r,
  });
}

/** One drag step. */
export function panStep(
  pic: PictureSize,
  frame: number,
  state: CropState,
  dx: number,
  dy: number
): CropState {
  'worklet';
  return clampCrop(pic, frame, { zoom: state.zoom, x: state.x + dx, y: state.y + dy });
}

/** The square, in source pixels, that the frame is showing. Always inside the picture. */
export function cropRect(pic: PictureSize, frame: number, state: CropState): CropRect {
  const c = clampCrop(pic, frame, state);
  const s = baseScale(pic, frame) * c.zoom;
  const side = Math.min(Math.round(frame / s), pic.width, pic.height);
  const cx = pic.width / 2 - c.x / s;
  const cy = pic.height / 2 - c.y / s;
  return {
    originX: Math.min(Math.max(Math.round(cx - side / 2), 0), pic.width - side),
    originY: Math.min(Math.max(Math.round(cy - side / 2), 0), pic.height - side),
    width: side,
    height: side,
  };
}
