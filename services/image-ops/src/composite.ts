/**
 * composite.ts — the holiday POSTCARD overlay, off the isolate (NO_PIXELS_IN_ISOLATE_PLAN.md phase 4b).
 *
 * The `holiday-postcard` Edge Function used to decode the render AND the overlay to RGBA, composite, and
 * re-encode a JPEG inside its 2 s CPU budget — and had to refuse anything over 2.2 MP (`deferred` → a cron
 * with sharp). Here there is no pixel cap: a 4 MP ultra frame composites inline. The math is the
 * byte-identical copy `postcardComposite.ts` (parity-pinned by the main repo's tests). The isolate keeps
 * the DB read (the `holidays` row) and hands over only URLs + a layout + the object key to overwrite.
 */
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { decodeImage, encodeJpeg } from './imageCodec.ts';
import { compositePostcard, type PostcardLayout, type RgbaImage } from './postcardComposite.ts';
import { MAX_SOURCE_BYTES, PersistError } from './persist.ts';

export interface CompositeRequest {
  /** https URL of the persisted render (public uploads URL). */
  imageUrl: string;
  /** https URL of the transparent overlay PNG (holidays.postcard_overlay_url). */
  overlayUrl: string;
  /** The Storage key to overwrite with the composited JPEG — the render's OWN key, so its URL is unchanged. */
  objectKey: string;
  layout: PostcardLayout;
  traceId?: string;
}

export interface CompositeResult {
  ok: true;
  key: string;
  placed: { x: number; y: number; width: number; height: number };
  width: number;
  height: number;
  ms: {
    fetch: number;
    decode: number;
    encode: number;
    upload: number;
    total: number;
  };
}

const MAX_OVERLAY_BYTES = 10 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 20_000;

export function validateCompositeRequest(body: unknown): CompositeRequest {
  if (!body || typeof body !== 'object') {
    throw new PersistError('bad_request', 400, 'JSON body required');
  }
  const b = body as Record<string, unknown>;
  for (const k of ['imageUrl', 'overlayUrl'] as const) {
    if (typeof b[k] !== 'string' || !/^https:\/\//i.test(b[k] as string)) {
      throw new PersistError('bad_request', 400, `${k} must be https`);
    }
  }
  const key = b.objectKey;
  if (
    typeof key !== 'string' ||
    key.length === 0 ||
    key.length > 300 ||
    key.startsWith('/') ||
    key.includes('..')
  ) {
    throw new PersistError('bad_request', 400, 'objectKey must be a relative Storage key');
  }
  const l = (b.layout && typeof b.layout === 'object' ? b.layout : {}) as Record<string, unknown>;
  const widthPct = Number(l.widthPct);
  const marginPct = Number(l.marginPct);
  if (l.anchor !== 'top' && l.anchor !== 'bottom') {
    throw new PersistError('bad_request', 400, "layout.anchor must be 'top' or 'bottom'");
  }
  if (!(widthPct >= 0.2 && widthPct <= 1)) {
    throw new PersistError('bad_request', 400, 'layout.widthPct must be 0.2..1');
  }
  if (!(marginPct >= 0 && marginPct <= 0.3)) {
    throw new PersistError('bad_request', 400, 'layout.marginPct must be 0..0.3');
  }
  return {
    imageUrl: b.imageUrl as string,
    overlayUrl: b.overlayUrl as string,
    objectKey: key,
    layout: { anchor: l.anchor, widthPct, marginPct, scrim: l.scrim !== false },
    traceId: typeof b.traceId === 'string' ? b.traceId.slice(0, 64) : undefined,
  };
}

async function fetchBytes(
  url: string,
  cap: number,
  what: string,
  fetchImpl: typeof fetch
): Promise<Uint8Array> {
  let res: Response;
  try {
    res = await fetchImpl(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (e) {
    throw new PersistError(
      'source_fetch_failed',
      502,
      `${what} fetch threw: ${(e as Error).message}`
    );
  }
  if (!res.ok) {
    throw new PersistError('source_fetch_failed', 502, `${what} returned ${res.status}`);
  }
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (bytes.length > cap) {
    throw new PersistError('too_large', 413, `${what} is ${bytes.length} bytes`);
  }
  if (bytes.length === 0) {
    throw new PersistError('empty_source', 400, `${what} is empty`);
  }
  return bytes;
}

/** Decoded overlays are reused across requests — one PNG per holiday, decoded once per machine. */
const overlayCache = new Map<string, RgbaImage>();
const OVERLAY_CACHE_MAX = 8;

async function loadOverlay(url: string, fetchImpl: typeof fetch): Promise<RgbaImage> {
  const cached = overlayCache.get(url);
  if (cached) return cached;
  const bytes = await fetchBytes(url, MAX_OVERLAY_BYTES, 'overlay', fetchImpl);
  let decoded: RgbaImage;
  try {
    decoded = await decodeImage(bytes);
  } catch (e) {
    throw new PersistError('decode_failed', 422, `overlay decode failed: ${(e as Error).message}`);
  }
  if (overlayCache.size >= OVERLAY_CACHE_MAX) {
    overlayCache.delete(overlayCache.keys().next().value!);
  }
  overlayCache.set(url, decoded);
  return decoded;
}

export async function composite(
  supabase: SupabaseClient,
  req: CompositeRequest,
  deps: { fetchImpl?: typeof fetch; bucket?: string } = {}
): Promise<CompositeResult> {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const bucket = deps.bucket ?? 'uploads';
  const tStart = Date.now();
  const ms = { fetch: 0, decode: 0, encode: 0, upload: 0, total: 0 };

  const tFetch = Date.now();
  const [overlay, srcBytes] = await Promise.all([
    loadOverlay(req.overlayUrl, fetchImpl),
    fetchBytes(req.imageUrl, MAX_SOURCE_BYTES, 'source', fetchImpl),
  ]);
  ms.fetch = Date.now() - tFetch;

  const tDec = Date.now();
  let base: RgbaImage;
  try {
    base = await decodeImage(srcBytes);
  } catch (e) {
    throw new PersistError('decode_failed', 422, `source decode failed: ${(e as Error).message}`);
  }
  ms.decode = Date.now() - tDec;

  const { image, placed } = compositePostcard(base, overlay, req.layout);

  const tEnc = Date.now();
  const jpeg = await encodeJpeg(image, 92);
  ms.encode = Date.now() - tEnc;

  // Same write the isolate did: overwrite the render's own key, so image_url stays valid.
  const tUp = Date.now();
  const { error } = await supabase.storage
    .from(bucket)
    .upload(req.objectKey, jpeg, { contentType: 'image/jpeg', upsert: true });
  if (error) {
    throw new PersistError('upload_failed', 500, `composite upload failed: ${error.message}`);
  }
  ms.upload = Date.now() - tUp;
  ms.total = Date.now() - tStart;
  return {
    ok: true,
    key: req.objectKey,
    placed,
    width: base.width,
    height: base.height,
    ms,
  };
}
