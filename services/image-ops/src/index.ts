/**
 * dreambot-image-ops — the "no pixels in the isolate" service (NO_PIXELS_IN_ISOLATE_PLAN.md).
 *
 *   GET  /healthz            liveness, no auth
 *   POST /persist            persist a render + build its display variant, thumbhash and dedup hashes;
 *                            modes final | temp | hash | perturb (see persist.ts)
 *   POST /composite          holiday postcard overlay onto a persisted render, overwriting its key (composite.ts)
 *
 * Same operating shape as services/face-swap-dual: Deno on Fly, Bearer token (FLY_AUTH_TOKEN), JSON in
 * and out, every failure a JSON { error, code }. Storage writes use the service role; this service never
 * touches a database row.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { MAX_SOURCE_BYTES, persist, PersistError, validateRequest } from './persist.ts';
import { composite, validateCompositeRequest } from './composite.ts';

const SERVICE = 'image-ops';
const VERSION = '1.2.0';

/** Constant-time string equality — a local copy, this service cannot import across the repo boundary. */
function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

const JSON_HEADERS = { 'Content-Type': 'application/json' };
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });

// base64 inflates 4/3; leave room for the JSON envelope.
const MAX_BODY_BYTES = Math.ceil(MAX_SOURCE_BYTES * (4 / 3)) + 64 * 1024;

const PORT = parseInt(Deno.env.get('PORT') ?? '8000', 10);

Deno.serve({ port: PORT }, async (req) => {
  const url = new URL(req.url);

  if (url.pathname === '/healthz' || url.pathname === '/health') {
    return json(200, { ok: true, service: SERVICE, version: VERSION });
  }

  // ── auth ──
  const expectedToken = Deno.env.get('FLY_AUTH_TOKEN');
  if (!expectedToken) {
    console.error(`[${SERVICE}] FLY_AUTH_TOKEN unset`);
    return json(503, {
      error: 'Service misconfigured: auth token required',
      code: 'misconfigured',
    });
  }
  const authHeader = req.headers.get('authorization') ?? '';
  const presented = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!presented || !timingSafeEqual(presented, expectedToken)) {
    console.warn(
      `[${SERVICE}] 401 path=${url.pathname} presented=${
        presented ? `len${presented.length}` : 'none'
      }`
    );
    return json(401, { error: 'Unauthorized', code: 'unauthorized' });
  }

  if (url.pathname === '/persist') {
    if (req.method !== 'POST') {
      return json(405, { error: 'POST only', code: 'method' });
    }
    const declared = Number(req.headers.get('content-length') ?? '0');
    if (declared > MAX_BODY_BYTES) {
      return json(413, {
        error: `body is ${declared} bytes`,
        code: 'too_large',
      });
    }
    const t0 = Date.now();
    let traceId = '-';
    try {
      const text = await req.text();
      if (text.length > MAX_BODY_BYTES) {
        return json(413, {
          error: `body is ${text.length} bytes`,
          code: 'too_large',
        });
      }
      let body: unknown;
      try {
        body = JSON.parse(text);
      } catch {
        return json(400, { error: 'invalid JSON', code: 'bad_request' });
      }
      const request = validateRequest(body);
      traceId = request.traceId ?? '-';
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      if (!supabaseUrl || !serviceRoleKey) {
        return json(503, {
          error: 'Service misconfigured: SUPABASE_URL / SERVICE_ROLE_KEY',
          code: 'misconfigured',
        });
      }
      const supabase = createClient(supabaseUrl, serviceRoleKey);
      const result = await persist(supabase, request);
      console.log(
        `[${SERVICE}] persist ok trace=${traceId} mode=${request.mode} ${result.width}x${result.height} ${result.bytes}B ` +
          `fetch=${result.ms.fetch} decode=${result.ms.decode} encode=${result.ms.encode} upload=${result.ms.upload} total=${result.ms.total}ms`
      );
      return json(200, result);
    } catch (e) {
      if (e instanceof PersistError) {
        console.warn(`[${SERVICE}] persist ${e.status} ${e.code} trace=${traceId}: ${e.message}`);
        return json(e.status, { error: e.message, code: e.code });
      }
      console.error(
        `[${SERVICE}] persist 500 trace=${traceId} after ${Date.now() - t0}ms: ${
          (e as Error).message
        }`
      );
      return json(500, { error: (e as Error).message, code: 'internal' });
    }
  }

  if (url.pathname === '/composite') {
    if (req.method !== 'POST') return json(405, { error: 'POST only', code: 'method' });
    const t0 = Date.now();
    let traceId = '-';
    try {
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        return json(400, { error: 'invalid JSON', code: 'bad_request' });
      }
      const request = validateCompositeRequest(body);
      traceId = request.traceId ?? '-';
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      if (!supabaseUrl || !serviceRoleKey)
        return json(503, {
          error: 'Service misconfigured: SUPABASE_URL / SERVICE_ROLE_KEY',
          code: 'misconfigured',
        });
      const supabase = createClient(supabaseUrl, serviceRoleKey);
      const result = await composite(supabase, request);
      console.log(
        `[${SERVICE}] composite ok trace=${traceId} ${result.width}x${result.height} placed=${result.placed.width}x${result.placed.height}@${result.placed.x},${result.placed.y} ` +
          `fetch=${result.ms.fetch} decode=${result.ms.decode} encode=${result.ms.encode} upload=${result.ms.upload} total=${result.ms.total}ms`
      );
      return json(200, result);
    } catch (e) {
      if (e instanceof PersistError) {
        console.warn(`[${SERVICE}] composite ${e.status} ${e.code} trace=${traceId}: ${e.message}`);
        return json(e.status, { error: e.message, code: e.code });
      }
      console.error(
        `[${SERVICE}] composite 500 trace=${traceId} after ${Date.now() - t0}ms: ${(e as Error).message}`
      );
      return json(500, { error: (e as Error).message, code: 'internal' });
    }
  }

  return json(404, { error: 'Not found', code: 'not_found' });
});
