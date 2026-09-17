/**
 * Resolve a Supabase personal access token (sbp_…) for the Management API.
 * Order: SUPABASE_ACCESS_TOKEN env (CI) → .env.local → the logged-in Supabase CLI's macOS keychain entry
 * (local dev). Mirrors scripts/apply-migration.mjs so every Management-API script finds the token the
 * same way. Returns null when none is found — callers decide whether that is fatal.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function fromEnvLocal() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
    const line = raw.split('\n').find((l) => l.startsWith('SUPABASE_ACCESS_TOKEN='));
    return line ? line.slice('SUPABASE_ACCESS_TOKEN='.length).trim().replace(/^"|"$/g, '') : null;
  } catch {
    return null;
  }
}

function fromKeychain() {
  try {
    const raw = execFileSync('security', ['find-generic-password', '-s', 'Supabase CLI', '-w'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const wrap = 'go-keyring-base64:';
    return raw.startsWith(wrap)
      ? Buffer.from(raw.slice(wrap.length), 'base64').toString('utf8')
      : raw;
  } catch {
    return null;
  }
}

function resolveSupabaseAccessToken() {
  for (const tok of [process.env.SUPABASE_ACCESS_TOKEN, fromEnvLocal(), fromKeychain()]) {
    if (tok && tok.startsWith('sbp_')) return tok;
  }
  return null;
}

module.exports = { resolveSupabaseAccessToken };
