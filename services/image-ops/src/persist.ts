/**
 * persist.ts — ONE call that does everything the isolate used to do with a render's pixels.
 *
 * Today the Supabase Edge isolate fetches the render, decodes the full frame to RGBA in WASM, computes a
 * thumbhash, re-encodes a display JPEG, hashes the bytes for dedup, and — for providers that return
 * base64 — runs an `atob` loop over 5-8 MB. All of that inside a hard 2 s CPU budget. That is every 546.
 *
 * Here it runs on a Fly machine with a real CPU. The contract mirrors what the isolate produced so the
 * caller's persistence code changes shape, not meaning: same Storage paths, same hash algorithms, same
 * best-effort semantics (a failed variant is null, never a failed render).
 *
 * The isolate stays the ONLY writer of database rows. This service writes Storage objects only.
 */
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { decodeBase64 } from 'https://deno.land/std@0.224.0/encoding/base64.ts';
import { decodeImage, encodeJpeg, type DecodedImage } from './imageCodec.ts';
import { computeThumbhash } from './thumbhashGen.ts';
import { aHashFromDecoded, sha256Hex } from './hashes.ts';

export type PersistMode = 'final' | 'temp';

export interface PersistRequest {
  /** An https URL to fetch (Replicate outputs). Exactly one of sourceUrl / sourceBase64. */
  sourceUrl?: string;
  /** Raw base64 (NO data: prefix) — providers that return inline images (gemini / gpt-image / grok). */
  sourceBase64?: string;
  /** Required with sourceBase64; ignored for sourceUrl (the bytes are sniffed either way). */
  mime?: string;
  userId: string;
  /** final = a persisted render (long cache); temp = a swap target / scratch object (short cache). */
  mode: PersistMode;
  /** Deterministic object key → idempotent overwrite (the HQ cache uses this). Final mode only. */
  objectKey?: string;
  /** Which derived artefacts to build. Defaults: final → all on; temp → all off. */
  variants?: { display?: boolean; thumbhash?: boolean; hashes?: boolean };
  traceId?: string;
}

export interface PersistResult {
  url: string;
  displayUrl: string | null;
  thumbhash: string | null;
  sha256: string | null;
  ahash: string | null;
  width: number | null;
  height: number | null;
  bytes: number;
  contentType: string;
  ms: { fetch: number; decode: number; encode: number; upload: number; total: number };
}

export class PersistError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message: string
  ) {
    super(message);
  }
}

/** Hard cap on source bytes. A 4.2 MP PNG from ultra is ~1.5-3 MB; 25 MB is generous and bounds memory. */
export const MAX_SOURCE_BYTES = 25 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 20_000;

export function validateRequest(body: unknown): PersistRequest {
  if (!body || typeof body !== 'object')
    throw new PersistError('bad_request', 400, 'JSON body required');
  const b = body as Record<string, unknown>;
  const hasUrl = typeof b.sourceUrl === 'string' && b.sourceUrl.length > 0;
  const hasB64 = typeof b.sourceBase64 === 'string' && b.sourceBase64.length > 0;
  if (hasUrl === hasB64)
    throw new PersistError(
      'bad_request',
      400,
      'exactly one of sourceUrl / sourceBase64 is required'
    );
  if (hasUrl && !/^https:\/\//i.test(b.sourceUrl as string))
    throw new PersistError('bad_request', 400, 'sourceUrl must be https');
  if (typeof b.userId !== 'string' || !/^[0-9a-f-]{36}$/i.test(b.userId))
    throw new PersistError('bad_request', 400, 'userId must be a uuid');
  if (b.mode !== 'final' && b.mode !== 'temp')
    throw new PersistError('bad_request', 400, "mode must be 'final' or 'temp'");
  if (b.objectKey !== undefined) {
    if (
      typeof b.objectKey !== 'string' ||
      !b.objectKey.startsWith(`${b.userId}/`) ||
      b.objectKey.includes('..')
    )
      throw new PersistError('bad_request', 400, 'objectKey must live under the user prefix');
    if (b.mode !== 'final')
      throw new PersistError('bad_request', 400, 'objectKey is final-mode only');
  }
  const variants =
    b.variants && typeof b.variants === 'object'
      ? (b.variants as PersistRequest['variants'])
      : undefined;
  return {
    sourceUrl: hasUrl ? (b.sourceUrl as string) : undefined,
    sourceBase64: hasB64 ? (b.sourceBase64 as string) : undefined,
    mime: typeof b.mime === 'string' ? b.mime : undefined,
    userId: b.userId as string,
    mode: b.mode as PersistMode,
    objectKey: b.objectKey as string | undefined,
    variants,
    traceId: typeof b.traceId === 'string' ? b.traceId.slice(0, 64) : undefined,
  };
}

/** Sniff the container from magic bytes — never trust the declared mime. */
export function sniff(bytes: Uint8Array): { contentType: string; ext: string } {
  if (
    bytes.length >= 4 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  )
    return { contentType: 'image/png', ext: 'png' };
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return { contentType: 'image/jpeg', ext: 'jpg' };
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  )
    return { contentType: 'image/webp', ext: 'webp' };
  throw new PersistError('unsupported_image', 400, 'bytes are not png / jpeg / webp');
}

export async function loadSource(
  req: PersistRequest,
  fetchImpl: typeof fetch = fetch
): Promise<{ bytes: Uint8Array; contentType: string; ext: string; fetchMs: number }> {
  const t0 = Date.now();
  let bytes: Uint8Array;
  if (req.sourceUrl) {
    let res: Response;
    try {
      res = await fetchImpl(req.sourceUrl, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    } catch (e) {
      throw new PersistError('source_fetch_failed', 502, `fetch threw: ${(e as Error).message}`);
    }
    if (!res.ok)
      throw new PersistError('source_fetch_failed', 502, `source returned ${res.status}`);
    const len = Number(res.headers.get('content-length') ?? '0');
    if (len > MAX_SOURCE_BYTES) throw new PersistError('too_large', 413, `source is ${len} bytes`);
    bytes = new Uint8Array(await res.arrayBuffer());
  } else {
    try {
      bytes = decodeBase64(req.sourceBase64!);
    } catch (e) {
      throw new PersistError('bad_base64', 400, `base64 decode failed: ${(e as Error).message}`);
    }
  }
  if (bytes.length > MAX_SOURCE_BYTES)
    throw new PersistError('too_large', 413, `source is ${bytes.length} bytes`);
  if (bytes.length === 0) throw new PersistError('empty_source', 400, 'source is empty');
  const { contentType, ext } = sniff(bytes);
  return { bytes, contentType, ext, fetchMs: Date.now() - t0 };
}

function rand(): string {
  return Math.random().toString(36).slice(2, 8);
}

/** Storage keys — IDENTICAL to what persistence.ts / faceSwap.ts write today, so nothing downstream moves. */
export function objectKeyFor(
  req: PersistRequest,
  ext: string
): { key: string; cacheControl: string; upsert: boolean } {
  if (req.mode === 'temp')
    return {
      key: `${req.userId}/swap-target-${Date.now()}-${rand()}.${ext}`,
      cacheControl: '300',
      upsert: false,
    };
  if (req.objectKey) return { key: req.objectKey, cacheControl: '2592000', upsert: true };
  return { key: `${req.userId}/${Date.now()}.${ext}`, cacheControl: '2592000', upsert: false };
}

export async function persist(
  supabase: SupabaseClient,
  req: PersistRequest,
  deps: { fetchImpl?: typeof fetch; bucket?: string } = {}
): Promise<PersistResult> {
  const bucket = deps.bucket ?? 'uploads';
  const tStart = Date.now();
  const ms = { fetch: 0, decode: 0, encode: 0, upload: 0, total: 0 };

  const src = await loadSource(req, deps.fetchImpl);
  ms.fetch = src.fetchMs;

  // 1. The original, exactly as received. This is the one write that must succeed.
  const { key, cacheControl, upsert } = objectKeyFor(req, src.ext);
  const tUp = Date.now();
  const { error: upErr } = await supabase.storage
    .from(bucket)
    .upload(key, src.bytes, { contentType: src.contentType, cacheControl, upsert });
  if (upErr)
    throw new PersistError('upload_failed', 500, `original upload failed: ${upErr.message}`);
  const url = supabase.storage.from(bucket).getPublicUrl(key).data.publicUrl;
  ms.upload += Date.now() - tUp;

  const wantDisplay = req.variants?.display ?? req.mode === 'final';
  const wantThumb = req.variants?.thumbhash ?? req.mode === 'final';
  const wantHashes = req.variants?.hashes ?? req.mode === 'final';

  const result: PersistResult = {
    url,
    displayUrl: null,
    thumbhash: null,
    sha256: null,
    ahash: null,
    width: null,
    height: null,
    bytes: src.bytes.length,
    contentType: src.contentType,
    ms,
  };

  if (wantHashes) {
    try {
      result.sha256 = await sha256Hex(src.bytes);
    } catch (_e) {
      result.sha256 = null;
    }
  }

  // 2. Everything below is BEST-EFFORT, exactly like the isolate's buildDisplayVariant: a failure yields
  //    null for that artefact and the render still ships with its original URL.
  if (wantDisplay || wantThumb || wantHashes) {
    let decoded: DecodedImage | null = null;
    const tDec = Date.now();
    try {
      decoded = await decodeImage(src.bytes);
    } catch (e) {
      console.warn(`[image-ops] decode failed (${req.traceId ?? '-'}): ${(e as Error).message}`);
    }
    ms.decode = Date.now() - tDec;
    if (decoded) {
      result.width = decoded.width;
      result.height = decoded.height;
      if (wantThumb) result.thumbhash = computeThumbhash(decoded);
      if (wantHashes) {
        try {
          result.ahash = aHashFromDecoded(decoded);
        } catch (_e) {
          result.ahash = null;
        }
      }
      if (wantDisplay) {
        try {
          const tEnc = Date.now();
          const jpeg = await encodeJpeg(decoded, 80);
          ms.encode = Date.now() - tEnc;
          const dKey = `${req.userId}/${Date.now()}-${rand()}.display.jpg`;
          const tUp2 = Date.now();
          const { error } = await supabase.storage
            .from(bucket)
            .upload(dKey, jpeg, { contentType: 'image/jpeg', cacheControl: '2592000' });
          ms.upload += Date.now() - tUp2;
          if (!error)
            result.displayUrl = supabase.storage.from(bucket).getPublicUrl(dKey).data.publicUrl;
          else
            console.warn(
              `[image-ops] display upload failed (${req.traceId ?? '-'}): ${error.message}`
            );
        } catch (e) {
          console.warn(
            `[image-ops] display encode failed (${req.traceId ?? '-'}): ${(e as Error).message}`
          );
        }
      }
    }
  }

  ms.total = Date.now() - tStart;
  return result;
}
