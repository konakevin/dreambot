// holiday-postcard — composite a holiday's decorative lettering overlay onto a persisted
// render so it lands like a holiday postcard (migration 459, HOLIDAY_DREAMS_PLAN.md).
//
// Runs as its OWN isolate (CLAUDE.md hard rule: no new pixel work in the render isolate).
// Called synchronously by nightly-dreams right after the render is persisted; the render
// treats any failure as "keep the clean image". Internal-only: requires the service-role
// key as the bearer token (same posture as face-swap-dual).
//
// POST { image_url, holiday }  →  { ok, ms, placed } | { ok:false, error }
//   image_url  the render's PUBLIC storage URL (…/object/public/uploads/<path>); the
//              composited JPEG is uploaded back to the SAME path (upsert) so image_url is
//              unchanged. Uploads are drafted BEFORE the client ever sees them, so no
//              stale-cache risk.
//   holiday    catalog key → postcard_overlay_url + layout from `holidays`.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { decodeImage, encodeJpeg } from '../_shared/imageCodec.ts';
import {
  compositePostcard,
  DEFAULT_POSTCARD_LAYOUT,
  type PostcardLayout,
  type RgbaImage,
} from '../_shared/postcardComposite.ts';
import { timingSafeEqual } from '../_shared/timingSafe.ts';

const overlayCache = new Map<string, RgbaImage>();

/** Max source pixels this isolate composites in-process. Above it the decode + JPEG re-encode
 *  trips the edge resource limit (HTTP 546 — seedream-4's 1440×2560 PNGs, 2026-09-08), so the
 *  request returns `deferred` immediately and the display-variant cron composites with sharp. */
const MAX_INLINE_PIXELS = 2_200_000;

/** Cheap header sniff (PNG IHDR / JPEG SOF) — no decode. null when unknown. */
export function sniffDimensions(buf: Uint8Array): { width: number; height: number } | null {
  if (buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return { width: dv.getUint32(16), height: dv.getUint32(20) };
  }
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = buf[i + 1];
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        i += 2;
        continue;
      }
      const len = dv.getUint16(i + 2);
      const isSof =
        marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isSof) return { height: dv.getUint16(i + 5), width: dv.getUint16(i + 7) };
      i += 2 + len;
    }
  }
  return null;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function loadOverlay(url: string): Promise<RgbaImage> {
  const cached = overlayCache.get(url);
  if (cached) return cached;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`overlay fetch ${res.status}`);
  const decoded = await decodeImage(new Uint8Array(await res.arrayBuffer()));
  overlayCache.set(url, decoded);
  return decoded;
}

Deno.serve(async (req) => {
  const t0 = Date.now();
  // Internal-only: the render (in-isolate service-role key) or ops/QA scripts (the
  // queue worker token) — same posture as refund-stuck-jobs.
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const workerToken = Deno.env.get('DREAM_QUEUE_WORKER_TOKEN') ?? '';
  const auth = req.headers.get('authorization') ?? '';
  const presented = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const authorized =
    presented.length > 0 &&
    ((serviceRoleKey.length > 0 && timingSafeEqual(presented, serviceRoleKey)) ||
      (workerToken.length > 0 && timingSafeEqual(presented, workerToken)));
  if (!authorized) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }
  let body: { image_url?: unknown; holiday?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: 'bad json' }, 400);
  }
  const imageUrl = typeof body.image_url === 'string' ? body.image_url : '';
  const holiday = typeof body.holiday === 'string' ? body.holiday : '';
  const marker = '/storage/v1/object/public/uploads/';
  const idx = imageUrl.indexOf(marker);
  if (!imageUrl || !holiday || idx < 0) {
    return json({ ok: false, error: 'image_url (public uploads URL) + holiday required' }, 400);
  }
  const objectPath = decodeURIComponent(imageUrl.slice(idx + marker.length).split('?')[0]);

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceRoleKey);
  try {
    const { data: row, error } = await supabase
      .from('holidays')
      .select(
        'postcard_overlay_url,postcard_anchor,postcard_width_pct,postcard_margin_pct,postcard_scrim'
      )
      .eq('key', holiday)
      .single();
    if (error || !row) return json({ ok: false, error: `holiday ${holiday} not found` }, 404);
    const overlayUrl = row.postcard_overlay_url as string | null;
    if (!overlayUrl)
      return json({ ok: false, error: 'no postcard artwork for this holiday', skipped: true });

    const layout: PostcardLayout = {
      anchor: row.postcard_anchor === 'top' ? 'top' : 'bottom',
      widthPct: Number(row.postcard_width_pct ?? 82) / 100,
      marginPct: Number(row.postcard_margin_pct ?? 5) / 100,
      scrim: row.postcard_scrim !== false,
    };

    const [overlay, srcRes] = await Promise.all([loadOverlay(overlayUrl), fetch(imageUrl)]);
    if (!srcRes.ok) return json({ ok: false, error: `source fetch ${srcRes.status}` }, 502);
    const srcBytes = new Uint8Array(await srcRes.arrayBuffer());
    const dims = sniffDimensions(srcBytes);
    if (dims && dims.width * dims.height > MAX_INLINE_PIXELS) {
      // Too big for this isolate — hand it to the out-of-process cron (uploads.postcard_pending).
      return json({
        ok: false,
        deferred: true,
        error: `too_large:${dims.width}x${dims.height}`,
        ms: Date.now() - t0,
      });
    }
    const base = await decodeImage(srcBytes);
    const { image, placed } = compositePostcard(base, overlay, layout ?? DEFAULT_POSTCARD_LAYOUT);
    const jpeg = await encodeJpeg(image, 92);

    const { error: upErr } = await supabase.storage
      .from('uploads')
      .upload(objectPath, jpeg, { contentType: 'image/jpeg', upsert: true });
    if (upErr) return json({ ok: false, error: `upload: ${upErr.message}` }, 500);
    return json({ ok: true, ms: Date.now() - t0, placed, path: objectPath });
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});
