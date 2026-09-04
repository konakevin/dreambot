// postcardComposite.ts — pure RGBA math for the holiday POSTCARD overlay (migration 459).
// NO I/O: takes decoded RGBA images, returns a decoded RGBA image. Runs in the separate
// `holiday-postcard` Edge Function (never in the render isolate — CLAUDE.md hard rule).
//
// The overlay is a transparent PNG (ornate "Happy Halloween" lettering + ornaments). It
// is scaled to `widthPct` of the render's width (aspect preserved), anchored top or
// bottom with `marginPct` breathing room, optionally over a soft dark scrim so the
// lettering stays legible on a bright scene, and alpha-blended (straight alpha).

export interface RgbaImage {
  data: Uint8Array; // RGBA, length = width * height * 4
  width: number;
  height: number;
}

export interface PostcardLayout {
  anchor: 'top' | 'bottom';
  /** overlay width as a fraction of the base width, 0.2..1 */
  widthPct: number;
  /** vertical margin from the anchored edge as a fraction of base height, 0..0.3 */
  marginPct: number;
  /** darken the band behind the overlay so light scenes don't wash the lettering out */
  scrim: boolean;
}

export const DEFAULT_POSTCARD_LAYOUT: PostcardLayout = {
  anchor: 'bottom',
  widthPct: 0.82,
  marginPct: 0.05,
  scrim: true,
};

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** Bilinear resize of an RGBA image (alpha handled like any channel — fine for our PNGs). */
export function resizeBilinear(src: RgbaImage, width: number, height: number): RgbaImage {
  width = Math.max(1, Math.round(width));
  height = Math.max(1, Math.round(height));
  if (width === src.width && height === src.height) return src;
  const out = new Uint8Array(width * height * 4);
  const sx = src.width / width;
  const sy = src.height / height;
  for (let y = 0; y < height; y++) {
    const fy = clamp((y + 0.5) * sy - 0.5, 0, src.height - 1);
    const y0 = Math.floor(fy);
    const y1 = Math.min(y0 + 1, src.height - 1);
    const wy = fy - y0;
    for (let x = 0; x < width; x++) {
      const fx = clamp((x + 0.5) * sx - 0.5, 0, src.width - 1);
      const x0 = Math.floor(fx);
      const x1 = Math.min(x0 + 1, src.width - 1);
      const wx = fx - x0;
      const i00 = (y0 * src.width + x0) * 4;
      const i10 = (y0 * src.width + x1) * 4;
      const i01 = (y1 * src.width + x0) * 4;
      const i11 = (y1 * src.width + x1) * 4;
      const o = (y * width + x) * 4;
      for (let c = 0; c < 4; c++) {
        const top = src.data[i00 + c] * (1 - wx) + src.data[i10 + c] * wx;
        const bot = src.data[i01 + c] * (1 - wx) + src.data[i11 + c] * wx;
        out[o + c] = Math.round(top * (1 - wy) + bot * wy);
      }
    }
  }
  return { data: out, width, height };
}

/** Where the (already-resized) overlay lands on the base image. */
export function placeOverlay(
  base: { width: number; height: number },
  overlay: { width: number; height: number },
  layout: PostcardLayout
): { x: number; y: number } {
  const x = Math.round((base.width - overlay.width) / 2);
  const margin = Math.round(base.height * clamp(layout.marginPct, 0, 0.3));
  const y = layout.anchor === 'top' ? margin : base.height - overlay.height - margin;
  return {
    x: clamp(x, 0, Math.max(0, base.width - overlay.width)),
    y: clamp(y, 0, Math.max(0, base.height - overlay.height)),
  };
}

/**
 * Darken a horizontal band behind the overlay: full strength across the overlay's rows,
 * feathering out over `feather` rows toward the image's interior so it reads as a soft
 * vignette, not a bar. Mutates `base` in place.
 */
export function applyScrim(
  base: RgbaImage,
  band: { y: number; height: number },
  anchor: 'top' | 'bottom',
  strength = 0.45,
  feather?: number
): void {
  const f = feather ?? Math.round(band.height * 0.9);
  const y0 = anchor === 'top' ? 0 : Math.max(0, band.y - f);
  const y1 = anchor === 'top' ? Math.min(base.height, band.y + band.height + f) : base.height;
  for (let y = y0; y < y1; y++) {
    let k: number;
    if (y >= band.y && y < band.y + band.height) k = 1;
    else if (anchor === 'top')
      k = 1 - (y - (band.y + band.height)) / f; // fades downward
    else k = 1 - (band.y - y) / f; // fades upward
    k = clamp(k, 0, 1);
    // smoothstep for a soft edge
    k = k * k * (3 - 2 * k);
    const mul = 1 - strength * k;
    if (mul >= 0.999) continue;
    const row = y * base.width * 4;
    for (let x = 0; x < base.width; x++) {
      const i = row + x * 4;
      base.data[i] = Math.round(base.data[i] * mul);
      base.data[i + 1] = Math.round(base.data[i + 1] * mul);
      base.data[i + 2] = Math.round(base.data[i + 2] * mul);
    }
  }
}

/** Straight-alpha "over" blend of `overlay` onto `base` at (x, y). Mutates `base`. */
export function blendOver(base: RgbaImage, overlay: RgbaImage, x: number, y: number): void {
  for (let oy = 0; oy < overlay.height; oy++) {
    const by = y + oy;
    if (by < 0 || by >= base.height) continue;
    for (let ox = 0; ox < overlay.width; ox++) {
      const bx = x + ox;
      if (bx < 0 || bx >= base.width) continue;
      const oi = (oy * overlay.width + ox) * 4;
      const a = overlay.data[oi + 3] / 255;
      if (a <= 0) continue;
      const bi = (by * base.width + bx) * 4;
      base.data[bi] = Math.round(overlay.data[oi] * a + base.data[bi] * (1 - a));
      base.data[bi + 1] = Math.round(overlay.data[oi + 1] * a + base.data[bi + 1] * (1 - a));
      base.data[bi + 2] = Math.round(overlay.data[oi + 2] * a + base.data[bi + 2] * (1 - a));
      base.data[bi + 3] = 255;
    }
  }
}

/**
 * The whole postcard step: scale the overlay to the layout, scrim (optional), blend.
 * Returns a NEW image (the base is copied first) plus where the overlay landed.
 */
export function compositePostcard(
  base: RgbaImage,
  overlay: RgbaImage,
  layout: PostcardLayout = DEFAULT_POSTCARD_LAYOUT
): { image: RgbaImage; placed: { x: number; y: number; width: number; height: number } } {
  const out: RgbaImage = {
    data: new Uint8Array(base.data),
    width: base.width,
    height: base.height,
  };
  const targetW = Math.round(base.width * clamp(layout.widthPct, 0.2, 1));
  const targetH = Math.round((overlay.height / overlay.width) * targetW);
  const scaled = resizeBilinear(overlay, targetW, targetH);
  const { x, y } = placeOverlay(out, scaled, layout);
  if (layout.scrim) applyScrim(out, { y, height: scaled.height }, layout.anchor);
  blendOver(out, scaled, x, y);
  return { image: out, placed: { x, y, width: scaled.width, height: scaled.height } };
}
