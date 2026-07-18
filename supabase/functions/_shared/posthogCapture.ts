/**
 * Server-side PostHog capture — the authoritative emitter for events whose
 * "source of truth" is the server, not a client screen: a dream finishing on
 * the queue (even after the user left the app), a purchase granted by the
 * RevenueCat webhook, an HD upscale completing, sparkles charged. Client-side
 * completion events miss these constantly (a dream renders 30-120s later, often
 * after backgrounding — ~83% of `dream_created` never fired). See
 * ANALYTICS_INSTRUMENTATION_PLAN.md.
 *
 * Identity contract: `distinctId` MUST be the Supabase user id — the SAME id the
 * client passes to `identifyUser(userId)` — so server + client events land on
 * ONE PostHog person.
 *
 * Safety: fire-and-await but NEVER throws. A failed analytics POST must never
 * break a render/webhook (mirrors the awaited-but-guarded style_summary distill).
 * No-op when POSTHOG_PROJECT_KEY is unset (mirrors the client's __DEV__ gate), so
 * a preview/unkeyed deploy sends nothing.
 *
 * NOTE (Deno BOOT_ERROR rule): no optional chaining in TOP-LEVEL module
 * expressions in _shared/*.ts. Env reads happen INSIDE the function below.
 */

// The public PostHog project write key (phc_…) — same value shipped in the app
// as EXPO_PUBLIC_POSTHOG_KEY, set as a Supabase edge secret (edge fns can't read
// EXPO_PUBLIC_* vars). /capture/ only accepts this public key; no private key.
const POSTHOG_HOST_DEFAULT = 'https://us.i.posthog.com';

// Supreme admin (Kevin) is opted out of analytics on the CLIENT (posthog.optOut,
// app/_layout.tsx) to keep his heavy in-app testing out of product reports. The
// server has no client opt-out, and the HOURLY queue-smoke canary renders a real
// dream on this account — so without this, it would post a synthetic dream_created
// every hour. Skip server emits for it too, for parity. (Bots don't reach these
// server hooks — they render via scripts/lib/botEngine, not the dream queue.)
const SUPREME_ADMIN_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

/**
 * Deterministic UUID (v5-style, SHA-1) from an arbitrary dedup string such as
 * `dream_created:<jobId>`. Two hard PostHog constraints make this necessary:
 *   1. /capture/ REJECTS the whole request (400, event dropped) if `uuid` is
 *      present but not a valid UUID — so a raw "dream_created:<id>" can't be used.
 *   2. PostHog dedups on `uuid` GLOBALLY (it's the event's primary key) — so the
 *      key must be UNIQUE per (event, entity), or two different events about the
 *      same job (e.g. sparkles_spent + dream_created on one jobId) collide and the
 *      second is silently dropped.
 * Hashing a readable "<event>:<id>" key satisfies both: valid UUID shape, and a
 * distinct value per event+entity, while staying stable across idempotency retries.
 */
async function deterministicUuid(input: string): Promise<string> {
  const digest = new Uint8Array(
    await crypto.subtle.digest('SHA-1', new TextEncoder().encode(input))
  );
  const b = digest.slice(0, 16);
  b[6] = (b[6] & 0x0f) | 0x50; // version 5
  b[8] = (b[8] & 0x3f) | 0x80; // RFC 4122 variant
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

/**
 * Emit one event to PostHog, attributed to `distinctId` (the Supabase user id).
 *
 * @param distinctId  Supabase user id (matches the client's identify id).
 * @param event       snake_case event name (e.g. 'dream_created').
 * @param properties  event props; `environment` + `$lib` are added automatically.
 * @param opts.dedupKey  a readable per-(event,entity) key, e.g.
 *   `dream_created:<jobId>` — hashed to a deterministic `uuid` so an
 *   idempotency-retried render or an at-least-once webhook does NOT double-count.
 */
export async function captureServer(
  distinctId: string,
  event: string,
  properties: Record<string, unknown> = {},
  opts: { dedupKey?: string } = {}
): Promise<void> {
  const key = Deno.env.get('POSTHOG_PROJECT_KEY');
  if (!key || !distinctId || distinctId === SUPREME_ADMIN_ID) return;
  const host = Deno.env.get('POSTHOG_HOST') || POSTHOG_HOST_DEFAULT;

  const body: Record<string, unknown> = {
    api_key: key,
    event,
    distinct_id: distinctId,
    properties: { ...properties, environment: 'production', $lib: 'edge' },
    timestamp: new Date().toISOString(),
  };
  if (opts.dedupKey) {
    body.uuid = await deterministicUuid(opts.dedupKey);
  }

  // Hard timeout: captureServer is awaited inside the render's terminal path
  // (completeQueueJob), so a hung/slow PostHog must never stall the worker. Abort
  // at 3s — a dropped analytics event is fine, a stalled render is not.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(`${host}/capture/`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    // Drain the body so the connection can be reused / closed cleanly.
    await res.text().catch(() => undefined);
    if (!res.ok) {
      console.warn(`[posthog] capture '${event}' HTTP ${res.status}`);
    }
  } catch (e) {
    console.warn(`[posthog] capture '${event}' failed: ${(e as Error).message}`);
  } finally {
    clearTimeout(timer);
  }
}
