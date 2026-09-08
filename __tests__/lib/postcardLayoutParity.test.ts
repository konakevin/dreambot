/** The Node postcard layout mirror (scripts/lib/postcardLayout.js) must place the overlay exactly where
 *  the edge composite (postcardComposite.ts) does — the cron backfill and the in-isolate path are one look. */
import {
  placeOverlay,
  compositePostcard,
  DEFAULT_POSTCARD_LAYOUT,
} from '@engine/postcardComposite';
import type { PostcardLayout } from '@engine/postcardComposite';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const js = require('../../scripts/lib/postcardLayout.js');

const layouts: PostcardLayout[] = [
  DEFAULT_POSTCARD_LAYOUT,
  { anchor: 'top', widthPct: 0.6, marginPct: 0.08, scrim: true },
  { anchor: 'bottom', widthPct: 1, marginPct: 0, scrim: false },
  { anchor: 'bottom', widthPct: 0.1, marginPct: 0.5, scrim: true }, // clamps
];
const bases = [
  { width: 768, height: 1344 },
  { width: 1440, height: 2560 },
  { width: 1024, height: 1024 },
];
const overlay = { width: 1000, height: 320 };

describe('postcard layout parity (TS edge composite vs Node cron mirror)', () => {
  it.each(bases.flatMap((b) => layouts.map((l) => [b, l] as const)))(
    'placement matches for %j / %j',
    (base, layout) => {
      const size = js.overlaySize(base, overlay, layout);
      const tsPlaced = compositePostcard(
        {
          data: new Uint8Array(base.width * base.height * 4),
          width: base.width,
          height: base.height,
        },
        {
          data: new Uint8Array(overlay.width * overlay.height * 4),
          width: overlay.width,
          height: overlay.height,
        },
        layout
      ).placed;
      expect(size).toEqual({ width: tsPlaced.width, height: tsPlaced.height });
      expect(js.placeOverlay(base, size, layout)).toEqual({ x: tsPlaced.x, y: tsPlaced.y });
      expect(placeOverlay(base, size, layout)).toEqual(js.placeOverlay(base, size, layout));
    }
  );
  it('layoutFromHolidayRow mirrors the edge function defaults', () => {
    expect(js.layoutFromHolidayRow({})).toEqual({
      anchor: 'bottom',
      widthPct: 0.82,
      marginPct: 0.05,
      scrim: true,
    });
    expect(
      js.layoutFromHolidayRow({
        postcard_anchor: 'top',
        postcard_width_pct: 60,
        postcard_margin_pct: 8,
        postcard_scrim: false,
      })
    ).toEqual({ anchor: 'top', widthPct: 0.6, marginPct: 0.08, scrim: false });
  });
  it('scrim multiplier is 1 outside the band + feather, 0.55 inside the band, monotone across the feather', () => {
    const band = { y: 1000, height: 200 };
    const { feather } = js.scrimBand({ width: 10, height: 1344 }, band, 'bottom');
    expect(js.scrimMultiplier(1100, band, 'bottom', feather)).toBeCloseTo(0.55, 5);
    expect(js.scrimMultiplier(band.y - feather - 1, band, 'bottom', feather)).toBe(1);
    const a = js.scrimMultiplier(band.y - Math.round(feather * 0.75), band, 'bottom', feather);
    const b = js.scrimMultiplier(band.y - Math.round(feather * 0.25), band, 'bottom', feather);
    expect(a).toBeGreaterThan(b);
  });
});
