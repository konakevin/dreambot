/**
 * Classify a URL that opened the app (universal link or `dreambot://`), deciding what
 * the root deep-link handler (app/_layout.tsx) may do with it. Pure, so it's tested
 * (__tests__/lib/incomingLink.test.ts).
 *
 * SECURITY (audit 2026-09-27, S7 finding 1). The handler used to consume session tokens
 * from ANY incoming URL: a `token_hash`, a `?code=`, or `#access_token` + `refresh_token`
 * on e.g. https://dreambotapp.com/post/<id> would silently sign this device into whatever
 * account the tokens belonged to. Now exactly one auth shape is accepted, the one the live
 * recovery email produces (Supabase "Reset Password" template, checked 2026-09-27):
 *
 *   https://dreambotapp.com/reset-password?token_hash=<hash>&type=recovery
 *   (or dreambot://reset-password?token_hash=<hash>&type=recovery, the custom-scheme form)
 *
 * Nothing current produces a `?code=` (the client uses the implicit flow; social sign-in
 * uses native ID tokens) or an `#access_token` fragment, so both are ignored everywhere.
 * verifyOtp({ type: 'recovery' }) is also enforced by Supabase: a signup or magic-link
 * token_hash fails as a recovery.
 */

export type IncomingLink =
  | { kind: 'recovery'; tokenHash: string }
  | { kind: 'post'; postId: string; ignoredAuthTokens: boolean }
  | { kind: 'user'; userId: string; ignoredAuthTokens: boolean }
  | { kind: 'none'; ignoredAuthTokens: boolean };

const WEB_HOSTS = new Set(['dreambotapp.com', 'www.dreambotapp.com']);
const APP_SCHEME = 'dreambot';

interface SplitUrl {
  scheme: string;
  host: string;
  /** Path without leading/trailing slashes. */
  path: string;
  query: URLSearchParams;
  fragment: URLSearchParams;
}

/** RFC-3986-shaped split that doesn't depend on the runtime's URL implementation
 *  (custom schemes parse differently across URL polyfills). */
function splitUrl(raw: string): SplitUrl | null {
  const url = raw.trim();
  const sep = url.indexOf('://');
  if (sep <= 0) return null;
  const scheme = url.slice(0, sep).toLowerCase();
  if (!/^[a-z][a-z0-9+.-]*$/.test(scheme)) return null;

  let rest = url.slice(sep + 3);
  const hashAt = rest.indexOf('#');
  const fragment = hashAt >= 0 ? rest.slice(hashAt + 1) : '';
  if (hashAt >= 0) rest = rest.slice(0, hashAt);
  const queryAt = rest.indexOf('?');
  const query = queryAt >= 0 ? rest.slice(queryAt + 1) : '';
  if (queryAt >= 0) rest = rest.slice(0, queryAt);
  const slashAt = rest.indexOf('/');
  const host = (slashAt >= 0 ? rest.slice(0, slashAt) : rest).toLowerCase();
  const path = (slashAt >= 0 ? rest.slice(slashAt + 1) : '').split('/').filter(Boolean).join('/');

  return {
    scheme,
    host,
    path,
    query: new URLSearchParams(query),
    fragment: new URLSearchParams(fragment),
  };
}

function param(u: SplitUrl, key: string): string | null {
  return u.query.get(key) ?? u.fragment.get(key);
}

function hasAuthTokens(u: SplitUrl): boolean {
  return ['token_hash', 'code', 'access_token', 'refresh_token'].some((k) => !!param(u, k));
}

export function classifyIncomingLink(url: string): IncomingLink {
  const u = splitUrl(url);
  if (!u) return { kind: 'none', ignoredAuthTokens: false };

  const isWeb = (u.scheme === 'https' || u.scheme === 'http') && WEB_HOSTS.has(u.host);
  const isApp = u.scheme === APP_SCHEME;
  if (!isWeb && !isApp) return { kind: 'none', ignoredAuthTokens: hasAuthTokens(u) };

  // The in-app route: the web path, or host + path for the custom scheme
  // (dreambot://reset-password → host "reset-password").
  const route = isWeb ? u.path : [u.host, u.path].filter(Boolean).join('/');

  if (route.toLowerCase() === 'reset-password') {
    const tokenHash = param(u, 'token_hash');
    if (tokenHash && param(u, 'type') === 'recovery') return { kind: 'recovery', tokenHash };
    return { kind: 'none', ignoredAuthTokens: hasAuthTokens(u) };
  }

  const ignoredAuthTokens = hasAuthTokens(u);
  // Post / user links are routed here only for the https domain; custom-scheme paths
  // (widget taps: dreambot://photo/<id>) are routed by Expo Router itself.
  if (isWeb) {
    const post = /^(?:post|photo)\/([a-f0-9-]+)$/i.exec(route);
    if (post) return { kind: 'post', postId: post[1], ignoredAuthTokens };
    const user = /^user\/([a-f0-9-]+)$/i.exec(route);
    if (user) return { kind: 'user', userId: user[1], ignoredAuthTokens };
  }
  return { kind: 'none', ignoredAuthTokens };
}
