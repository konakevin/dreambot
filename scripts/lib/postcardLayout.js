/**
 * postcardLayout.js — Node MIRROR of the placement + scrim math in
 * supabase/functions/_shared/postcardComposite.ts (parity-locked by
 * __tests__/lib/postcardLayoutParity.test.ts). Used by the out-of-process postcard backfill in
 * scripts/backfill-display-variants.js (sharp) so a cron-composited overlay lands exactly where the
 * in-isolate composite would have put it.
 */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/** Overlay size for a base width: widthPct of the base, aspect preserved. */
function overlaySize(base, overlay, layout) {
  const width = Math.round(base.width * clamp(layout.widthPct, 0.2, 1));
  const height = Math.round((overlay.height / overlay.width) * width);
  return { width, height };
}

/** Where the (already-resized) overlay lands on the base image. */
function placeOverlay(base, overlay, layout) {
  const x = Math.round((base.width - overlay.width) / 2);
  const margin = Math.round(base.height * clamp(layout.marginPct, 0, 0.3));
  const y = layout.anchor === 'top' ? margin : base.height - overlay.height - margin;
  return {
    x: clamp(x, 0, Math.max(0, base.width - overlay.width)),
    y: clamp(y, 0, Math.max(0, base.height - overlay.height)),
  };
}

/** The scrim band rows (full strength across the overlay, feathering toward the interior). */
function scrimBand(base, band, anchor, feather) {
  const f = feather == null ? Math.round(band.height * 0.9) : feather;
  const y0 = anchor === 'top' ? 0 : Math.max(0, band.y - f);
  const y1 = anchor === 'top' ? Math.min(base.height, band.y + band.height + f) : base.height;
  return { y0, y1, feather: f };
}

/** Per-row darkening multiplier (1 = untouched) — the exact curve applyScrim uses. */
function scrimMultiplier(y, band, anchor, feather, strength = 0.45) {
  let k;
  if (y >= band.y && y < band.y + band.height) k = 1;
  else if (anchor === 'top') k = 1 - (y - (band.y + band.height)) / feather;
  else k = 1 - (band.y - y) / feather;
  k = clamp(k, 0, 1);
  k = k * k * (3 - 2 * k);
  return 1 - strength * k;
}

function layoutFromHolidayRow(row) {
  return {
    anchor: row.postcard_anchor === 'top' ? 'top' : 'bottom',
    widthPct: Number(row.postcard_width_pct == null ? 82 : row.postcard_width_pct) / 100,
    marginPct: Number(row.postcard_margin_pct == null ? 5 : row.postcard_margin_pct) / 100,
    scrim: row.postcard_scrim !== false,
  };
}

module.exports = { overlaySize, placeOverlay, scrimBand, scrimMultiplier, layoutFromHolidayRow };
