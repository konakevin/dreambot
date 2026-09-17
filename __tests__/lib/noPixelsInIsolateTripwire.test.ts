/**
 * NO_PIXELS_IN_ISOLATE_PLAN.md §5 — the tripwire.
 *
 * Every HTTP 546 on the render functions was "CPU Time exceeded": pixel work (decode to RGBA, JPEG
 * re-encode, atob over provider base64) inside the Edge isolate's fixed 2 s CPU budget. That work now
 * runs on the Fly image-ops service (services/image-ops); the call sites that remain in the isolate are
 * the FAIL-OPEN fallbacks the client drops into when the service is off or errors.
 *
 * This pins the count of those call sites per file. A NEW one anywhere under supabase/functions fails
 * CI: send it to image-ops instead (a `/persist` mode, or a new endpoint). When a phase removes one,
 * LOWER the pin — the numbers only go down.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..', '..', 'supabase', 'functions');
const PIXEL_CALL = /\b(?:decodeImage|encodeJpeg|atob)\(/g;

/** Not pixel work: the codec's own definitions, and a PEM-key atob (DeviceCheck), ~1 KB. */
const NOT_PIXELS = new Set(['_shared/imageCodec.ts', '_shared/deviceCheck.ts']);

/** The in-isolate fallbacks that remain, by file. Lower a number when a phase lands; never raise one. */
const PINNED: Record<string, number> = {
  '_shared/faceSwap.ts': 9, // ensureHttpsImageUrl atob loop, perturbSourceImage, legacy dual split
  '_shared/persistence.ts': 3, // buildDisplayVariant + the aHash helper (nightly dup-detect fallback)
  'holiday-postcard/index.ts': 3, // compositing — phase 4
  'nightly-dreams/index.ts': 1, // dup-detect decode fallback
  'generate-dream/index.ts': 1, // swap-result base64 → bytes
};

function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (p.endsWith('.ts')) out.push(p);
  }
  return out;
}

const actual: Record<string, number> = {};
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (NOT_PIXELS.has(rel)) continue;
  const n = (fs.readFileSync(file, 'utf8').match(PIXEL_CALL) || []).length;
  if (n > 0) actual[rel] = n;
}

describe('no pixels in the isolate — tripwire', () => {
  it('no file outside the pinned set does pixel work', () => {
    const newcomers = Object.keys(actual).filter((f) => !(f in PINNED));
    expect(newcomers.map((f) => `${f}: ${actual[f]} — send it to services/image-ops`)).toEqual([]);
  });

  it.each(Object.entries(PINNED))('%s has exactly %i pixel call sites', (file, pinned) => {
    const n = actual[file] ?? 0;
    if (n > pinned) {
      throw new Error(
        `${file}: ${n} pixel call sites, pinned ${pinned} — a NEW decode/encode/atob in the isolate. ` +
          'Send it to services/image-ops (NO_PIXELS_IN_ISOLATE_PLAN.md).'
      );
    }
    if (n < pinned) {
      throw new Error(
        `${file}: ${n} pixel call sites, pinned ${pinned} — a phase landed; lower the pin in this test.`
      );
    }
    expect(n).toBe(pinned);
  });
});
