/**
 * Authenticated edge-function calls — the ONE place a Supabase edge function is
 * invoked from the client, so a stale access token can never reach the wire.
 *
 * Background: tokens expire after ~1h. The RN auto-refresh timer pauses while
 * the app is backgrounded, so getSession() can hand back an EXPIRED token — and
 * a hand-rolled `fetch` using it gets a 401 (the cast-upload bug). The supabase
 * client refreshes on-demand for its OWN calls (storage/postgrest) and reactively
 * for functions.invoke (on TOKEN_REFRESHED), but neither PROACTIVELY refreshes
 * before a call when the timer was asleep.
 *
 * This module fixes that for good:
 *   • getFreshToken() proactively refreshes an expired / near-expiry token.
 *   • fetchEdge() uses it + retries once on a 401 (raw Response callers).
 *   • invokeEdge() uses it before supabase.functions.invoke ({data,error} callers).
 *
 * Pair with the AppState→startAutoRefresh wiring in lib/supabase.ts (which keeps
 * the timer alive) — together the token is fresh proactively AND on-demand.
 */

import { supabase } from '@/lib/supabase';

// Refresh if the token expires within this window, so a call effectively never
// races expiry (the 401-retry in fetchEdge is the backstop for the rest).
const REFRESH_MARGIN_MS = 60_000;

const FN_BASE = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1`;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Return a guaranteed-fresh access token, proactively refreshing if the current
 * one is expired or within REFRESH_MARGIN_MS of expiry. Returns null (never
 * throws) when there is no session, so callers degrade to the function's own
 * 401 rather than crashing.
 */
export async function getFreshToken(): Promise<string | null> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return null;
    const expiresAtMs = (session.expires_at ?? 0) * 1000;
    if (expiresAtMs - Date.now() < REFRESH_MARGIN_MS) {
      const { data: refreshed } = await supabase.auth.refreshSession();
      return refreshed.session?.access_token ?? session.access_token;
    }
    return session.access_token;
  } catch {
    return null;
  }
}

/**
 * POST to an edge function and return the raw Response — with a guaranteed-fresh
 * token and ONE 401 refresh-retry. Use when the caller needs the HTTP status
 * (e.g. distinguishing 5xx for its own retry).
 */
export async function fetchEdge(
  functionName: string,
  body: unknown,
  init?: Omit<RequestInit, 'body'>
): Promise<Response> {
  const call = (token: string | null) =>
    fetch(`${FN_BASE}/${functionName}`, {
      method: 'POST',
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(ANON_KEY ? { apikey: ANON_KEY } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
      body: JSON.stringify(body),
    });

  let res = await call(await getFreshToken());
  // Backstop: if the token was rejected anyway (clock skew, refresh lag),
  // force a fresh one and retry exactly once.
  if (res.status === 401) {
    const { data: refreshed } = await supabase.auth.refreshSession();
    if (refreshed.session?.access_token) {
      res = await call(refreshed.session.access_token);
    }
  }
  return res;
}

/**
 * supabase.functions.invoke with a guaranteed-fresh token first. Same
 * `{ data, error }` contract as invoke — callers just swap the function name.
 * Proactively refreshing fires TOKEN_REFRESHED, so the functions client sends
 * the fresh token.
 */
export async function invokeEdge<T = unknown>(
  functionName: string,
  options?: Parameters<typeof supabase.functions.invoke>[1]
) {
  await getFreshToken();
  return supabase.functions.invoke<T>(functionName, options);
}
