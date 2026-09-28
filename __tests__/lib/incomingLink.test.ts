/**
 * Only the live recovery-email link shape may carry a session into the app
 * (lib/incomingLink.ts; audit 2026-09-27 S7 finding 1: tokens on ANY link used to sign
 * the device into whatever account they belonged to).
 */
import { classifyIncomingLink } from '@/lib/incomingLink';

const POST = '0b5c6f2e-1a2b-4c3d-9e8f-001122334455';
const USER = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

describe('recovery links', () => {
  it('accepts the live email shape (https reset-password + token_hash + type=recovery)', () => {
    expect(
      classifyIncomingLink('https://dreambotapp.com/reset-password?token_hash=abc123&type=recovery')
    ).toEqual({ kind: 'recovery', tokenHash: 'abc123' });
  });

  it('accepts the custom-scheme form and a trailing slash', () => {
    expect(classifyIncomingLink('dreambot://reset-password?token_hash=h1&type=recovery')).toEqual({
      kind: 'recovery',
      tokenHash: 'h1',
    });
    expect(
      classifyIncomingLink(
        'https://www.dreambotapp.com/reset-password/?token_hash=h2&type=recovery'
      )
    ).toEqual({ kind: 'recovery', tokenHash: 'h2' });
  });

  it('refuses a token_hash without type=recovery', () => {
    expect(classifyIncomingLink('https://dreambotapp.com/reset-password?token_hash=abc')).toEqual({
      kind: 'none',
      ignoredAuthTokens: true,
    });
    expect(
      classifyIncomingLink('https://dreambotapp.com/reset-password?token_hash=abc&type=signup')
    ).toEqual({ kind: 'none', ignoredAuthTokens: true });
  });

  it('refuses implicit-flow session tokens even on reset-password', () => {
    expect(
      classifyIncomingLink(
        'https://dreambotapp.com/reset-password#access_token=A&refresh_token=R&type=recovery'
      )
    ).toEqual({ kind: 'none', ignoredAuthTokens: true });
  });

  it('refuses a PKCE ?code= (no current flow produces one)', () => {
    expect(classifyIncomingLink('https://dreambotapp.com/reset-password?code=xyz')).toEqual({
      kind: 'none',
      ignoredAuthTokens: true,
    });
    expect(classifyIncomingLink('dreambot://reset-password?code=xyz')).toEqual({
      kind: 'none',
      ignoredAuthTokens: true,
    });
  });

  it('refuses reset-password on a foreign host', () => {
    expect(
      classifyIncomingLink('https://evil.example/reset-password?token_hash=h&type=recovery')
    ).toEqual({ kind: 'none', ignoredAuthTokens: true });
  });
});

describe('content links never carry a session', () => {
  it('routes a post link and ignores tokens riding on it', () => {
    expect(
      classifyIncomingLink(
        `https://dreambotapp.com/post/${POST}#access_token=A&refresh_token=R&type=recovery`
      )
    ).toEqual({ kind: 'post', postId: POST, ignoredAuthTokens: true });
    expect(
      classifyIncomingLink(`https://dreambotapp.com/photo/${POST}?token_hash=h&type=recovery`)
    ).toEqual({ kind: 'post', postId: POST, ignoredAuthTokens: true });
  });

  it('routes a clean post and user link', () => {
    expect(classifyIncomingLink(`https://dreambotapp.com/post/${POST}`)).toEqual({
      kind: 'post',
      postId: POST,
      ignoredAuthTokens: false,
    });
    expect(classifyIncomingLink(`https://dreambotapp.com/user/${USER}`)).toEqual({
      kind: 'user',
      userId: USER,
      ignoredAuthTokens: false,
    });
  });

  it('leaves custom-scheme content links to Expo Router (widget taps)', () => {
    expect(classifyIncomingLink(`dreambot://photo/${POST}`)).toEqual({
      kind: 'none',
      ignoredAuthTokens: false,
    });
    expect(classifyIncomingLink('dreambot://create')).toEqual({
      kind: 'none',
      ignoredAuthTokens: false,
    });
  });

  it('ignores tokens on any other link', () => {
    expect(classifyIncomingLink('dreambot://anything#access_token=A&refresh_token=R')).toEqual({
      kind: 'none',
      ignoredAuthTokens: true,
    });
    expect(classifyIncomingLink('not a url')).toEqual({ kind: 'none', ignoredAuthTokens: false });
  });
});
