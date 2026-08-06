/**
 * deviceCheck — Apple DeviceCheck REST client for the trial-farming gate
 * (TRIAL_FARMING_PREVENTION.md, Anchor A). DeviceCheck gives each physical device
 * 2 server-settable bits that persist across app deletion / account deletion /
 * factory reset (stored on Apple's servers, read/written with our .p8 key). We
 * use bit0 = "this device already consumed its free trial".
 *
 * This module does the I/O; the PURE decision lives in ./trialEligibility.ts.
 * EVERYTHING here is defensive: it NEVER throws — any failure (missing secrets,
 * network, Apple error, bad token) resolves to a fail-open signal so a real new
 * user is never blocked on an attestation gap.
 *
 * Secrets (Supabase edge): DEVICECHECK_KEY_P8 (the .p8 contents), DEVICECHECK_KEY_ID,
 * DEVICECHECK_TEAM_ID. Absent → treated as apple_error (fail open) so the gate is
 * inert until Kevin provisions the key. No top-level `?.` (Deno BOOT_ERROR rule).
 */

import type { DeviceTrialSignal } from './trialEligibility.ts';

const PROD_BASE = 'https://api.devicecheck.apple.com/v1';
const DEV_BASE = 'https://api.development.devicecheck.apple.com/v1';

interface DeviceCheckCfg {
  p8: string;
  keyId: string;
  teamId: string;
}

function readCfg(): DeviceCheckCfg | null {
  const p8 = Deno.env.get('DEVICECHECK_KEY_P8');
  const keyId = Deno.env.get('DEVICECHECK_KEY_ID');
  const teamId = Deno.env.get('DEVICECHECK_TEAM_ID');
  if (!p8 || !keyId || !teamId) return null;
  // The .p8 is often stored with literal "\n" escapes in an env var — restore them.
  return { p8: p8.replace(/\\n/g, '\n'), keyId, teamId };
}

const encoder = new TextEncoder();

function base64UrlFromBytes(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlFromString(s: string): string {
  return base64UrlFromBytes(encoder.encode(s));
}

async function importP8(p8Pem: string): Promise<CryptoKey> {
  // Strip the PEM armor (any "-----BEGIN/END ...-----" line) + all whitespace,
  // leaving the base64 PKCS8 body. The generic pattern also handles variants
  // like "EC PRIVATE KEY".
  const b64 = p8Pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const der = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return await crypto.subtle.importKey(
    'pkcs8',
    der,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );
}

/** A short-lived ES256 JWT authenticating our team to the DeviceCheck API. */
async function makeAuthJwt(cfg: DeviceCheckCfg): Promise<string> {
  const key = await importP8(cfg.p8);
  const header = base64UrlFromString(JSON.stringify({ alg: 'ES256', kid: cfg.keyId }));
  const iat = Math.floor(Date.now() / 1000);
  const payload = base64UrlFromString(JSON.stringify({ iss: cfg.teamId, iat }));
  const signingInput = `${header}.${payload}`;
  const sig = new Uint8Array(
    await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, encoder.encode(signingInput))
  );
  return `${signingInput}.${base64UrlFromBytes(sig)}`;
}

type QueryOutcome =
  | { kind: 'bits'; bit0: boolean; bit1: boolean }
  | { kind: 'not_found' } // valid token, no bits ever set → a fresh device
  | { kind: 'error' };

async function queryOnce(base: string, deviceToken: string, jwt: string): Promise<QueryOutcome> {
  const res = await fetch(`${base}/query_two_bits`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      device_token: deviceToken,
      transaction_id: crypto.randomUUID(),
      timestamp: Date.now(),
    }),
  });
  const text = await res.text();
  if (res.status !== 200) return { kind: 'error' };
  // 200 + JSON with boolean bits → bits are set. 200 + the plain-text
  // "Failed to find bit state for device token." → valid token, never set (fresh).
  try {
    const json = JSON.parse(text);
    if (json && typeof json.bit0 === 'boolean') {
      return { kind: 'bits', bit0: json.bit0, bit1: json.bit1 === true };
    }
  } catch {
    // not JSON → the "no bit state" plain-text body
  }
  return { kind: 'not_found' };
}

/**
 * Query DeviceCheck for this token's trial signal. Tries production first, then
 * the development endpoint (a dev/TestFlight-signed build's token only validates
 * against development). Any hard failure → apple_error (fail open).
 */
export async function getDeviceTrialSignal(deviceToken: string | null): Promise<DeviceTrialSignal> {
  if (!deviceToken) return { kind: 'no_token' };
  const cfg = readCfg();
  if (!cfg) return { kind: 'apple_error' }; // secrets not provisioned yet → inert/fail-open
  try {
    const jwt = await makeAuthJwt(cfg);
    let outcome = await queryOnce(PROD_BASE, deviceToken, jwt);
    if (outcome.kind === 'error') outcome = await queryOnce(DEV_BASE, deviceToken, jwt);
    if (outcome.kind === 'error') return { kind: 'apple_error' };
    if (outcome.kind === 'not_found') return { kind: 'fresh_device' };
    return outcome.bit0 ? { kind: 'already_trialed' } : { kind: 'fresh_device' };
  } catch {
    return { kind: 'apple_error' };
  }
}

async function updateOnce(base: string, deviceToken: string, jwt: string): Promise<boolean> {
  const res = await fetch(`${base}/update_two_bits`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      device_token: deviceToken,
      transaction_id: crypto.randomUUID(),
      timestamp: Date.now(),
      bit0: true, // "this device has consumed its free trial"
      bit1: false, // reserved / unused
    }),
  });
  await res.text();
  return res.status === 200;
}

/**
 * Set bit0 = true on this device (call ONLY after granting a genuine fresh-device
 * trial). Tries production then development. Best-effort: returns false on any
 * failure and never throws — the caller logs it.
 */
export async function setDeviceTrialBit(deviceToken: string): Promise<boolean> {
  const cfg = readCfg();
  if (!cfg) return false;
  try {
    const jwt = await makeAuthJwt(cfg);
    if (await updateOnce(PROD_BASE, deviceToken, jwt)) return true;
    return await updateOnce(DEV_BASE, deviceToken, jwt);
  } catch {
    return false;
  }
}
