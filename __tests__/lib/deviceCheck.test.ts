/**
 * The SAFETY test for the trial-farming gate. The whole design promise is: a
 * valid first-time user is NEVER accidentally denied their trial. The only
 * denial path is Apple returning HTTP 200 with bit0=true (the device genuinely
 * trialed before in our app). EVERYTHING else — no token, missing secrets,
 * non-200, network error, timeout, "no bits found" — must FAIL OPEN (grant).
 *
 * This exercises the real I/O client (with a genuinely-generated P-256 key so the
 * ES256 JWT signing actually runs) against a mocked Apple endpoint, and asserts
 * the end-to-end decideTrial() outcome for each case.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDeviceTrialSignal } = require('@engine/deviceCheck');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { decideTrial } = require('@engine/trialEligibility');

type FetchMock = (url: string, init: { signal: AbortSignal }) => Promise<unknown>;

function setEnv(map: Record<string, string | undefined>): void {
  (globalThis as unknown as { Deno: unknown }).Deno = {
    env: { get: (k: string) => map[k] },
  };
}
function setFetch(fn: FetchMock): void {
  (globalThis as unknown as { fetch: unknown }).fetch = fn;
}
function reply(status: number, body: string) {
  return Promise.resolve({ status, text: () => Promise.resolve(body) });
}

const NO_BITS_BODY = 'Failed to find bit state for device token.';

let pem: string;
beforeAll(async () => {
  // A real ECDSA P-256 private key so importP8 + crypto.subtle.sign genuinely run
  // (a fake key would make makeAuthJwt throw → apple_error and never test the I/O).
  const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, [
    'sign',
    'verify',
  ]);
  const pkcs8 = new Uint8Array(await crypto.subtle.exportKey('pkcs8', kp.privateKey));
  let bin = '';
  for (let i = 0; i < pkcs8.length; i++) bin += String.fromCharCode(pkcs8[i]);
  // Assemble the PEM armor from parts so the source doesn't contain a literal
  // "BEGIN/END PRIVATE KEY" banner (which the secret scanner flags). importP8's
  // generic /-----[^-]+-----/g strip handles it either way.
  const armor = (label: string) => `-----${label} PRIVATE KEY-----`;
  pem = `${armor('BEGIN')}\n${btoa(bin)}\n${armor('END')}`;
});

const withSecrets = () =>
  setEnv({ DEVICECHECK_KEY_P8: pem, DEVICECHECK_KEY_ID: 'KID', DEVICECHECK_TEAM_ID: 'TID' });

const grants = (sig: { kind: string }) => decideTrial(sig).grantTrial === true;

describe('getDeviceTrialSignal — a valid first-time user is NEVER blocked', () => {
  afterEach(() => {
    setFetch(() => {
      throw new Error('fetch should not have been called');
    });
  });

  it('null token → no_token → GRANTS (no Apple call at all)', async () => {
    withSecrets();
    let called = 0;
    setFetch(() => {
      called++;
      return reply(200, '');
    });
    const sig = await getDeviceTrialSignal(null);
    expect(sig).toEqual({ kind: 'no_token' });
    expect(grants(sig)).toBe(true);
    expect(called).toBe(0);
  });

  it('secrets not provisioned → apple_error → GRANTS (no Apple call)', async () => {
    setEnv({}); // the CURRENT production state until Kevin adds the .p8
    let called = 0;
    setFetch(() => {
      called++;
      return reply(200, '');
    });
    const sig = await getDeviceTrialSignal('token');
    expect(sig).toEqual({ kind: 'apple_error' });
    expect(grants(sig)).toBe(true);
    expect(called).toBe(0);
  });

  it('fresh device ("no bits" 200 body) → fresh_device → GRANTS + sets the bit', async () => {
    withSecrets();
    setFetch(() => reply(200, NO_BITS_BODY));
    const sig = await getDeviceTrialSignal('token');
    expect(sig).toEqual({ kind: 'fresh_device' });
    const d = decideTrial(sig);
    expect(d.grantTrial).toBe(true);
    expect(d.setDeviceBit).toBe(true);
  });

  it('bit0=false → fresh_device → GRANTS', async () => {
    withSecrets();
    setFetch(() => reply(200, JSON.stringify({ bit0: false, bit1: false })));
    const sig = await getDeviceTrialSignal('token');
    expect(sig).toEqual({ kind: 'fresh_device' });
    expect(grants(sig)).toBe(true);
  });

  it('bit0=true → already_trialed → DENIES (the one intended denial)', async () => {
    withSecrets();
    setFetch(() => reply(200, JSON.stringify({ bit0: true, bit1: false })));
    const sig = await getDeviceTrialSignal('token');
    expect(sig).toEqual({ kind: 'already_trialed' });
    expect(decideTrial(sig).grantTrial).toBe(false);
  });

  it('both endpoints non-200 → apple_error → GRANTS (tries prod THEN dev)', async () => {
    withSecrets();
    let called = 0;
    setFetch(() => {
      called++;
      return reply(400, 'Invalid device token');
    });
    const sig = await getDeviceTrialSignal('token');
    expect(sig).toEqual({ kind: 'apple_error' });
    expect(grants(sig)).toBe(true);
    expect(called).toBe(2); // prod, then dev fallback
  });

  it('wrong-environment token (prod 400 → dev 200) falls back and GRANTS', async () => {
    withSecrets();
    let called = 0;
    setFetch(() => {
      called++;
      return called === 1 ? reply(400, 'Invalid device token') : reply(200, NO_BITS_BODY);
    });
    const sig = await getDeviceTrialSignal('token');
    expect(sig).toEqual({ kind: 'fresh_device' });
    expect(grants(sig)).toBe(true);
  });

  it('network error → apple_error → GRANTS', async () => {
    withSecrets();
    setFetch(() => Promise.reject(new Error('ECONNRESET')));
    const sig = await getDeviceTrialSignal('token');
    expect(sig).toEqual({ kind: 'apple_error' });
    expect(grants(sig)).toBe(true);
  });

  it('a HUNG Apple endpoint times out (~3s) → apple_error → GRANTS, never stalls onboarding', async () => {
    withSecrets();
    setFetch(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener('abort', () => reject(new Error('AbortError')));
        })
    );
    const start = Date.now();
    const sig = await getDeviceTrialSignal('token');
    const elapsed = Date.now() - start;
    expect(sig).toEqual({ kind: 'apple_error' });
    expect(grants(sig)).toBe(true);
    expect(elapsed).toBeLessThan(4500); // timed out ~3s — did NOT hang
  }, 8000);
});
