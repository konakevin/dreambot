#!/usr/bin/env node
/**
 * Rotate every bot account's Supabase auth password.
 *
 * Reads:
 *   OLD_BOT_PASSWORD_PREFIX  — the current prefix (used for a sign-in sanity
 *                              check before each rotation; defaults to the
 *                              leaked value `BotAccount2026!!` if unset)
 *   BOT_PASSWORD_PREFIX      — the NEW prefix that bot accounts will be moved to
 *
 * Each bot's email is `bot-{botname}@dreambot.app`. The new password becomes
 * `${BOT_PASSWORD_PREFIX}${botname}`.
 *
 * Usage:
 *   node scripts/rotate-bot-passwords.js --dry-run    # list, change nothing
 *   node scripts/rotate-bot-passwords.js              # rotate, but skip bots
 *                                                     # whose old pw doesn't
 *                                                     # match (safety net)
 *   node scripts/rotate-bot-passwords.js --force      # rotate every bot,
 *                                                     # ignore old-pw mismatch
 *                                                     # (use to bring stragglers
 *                                                     # in line with the standard)
 *
 * After running:
 *   1. Update GitHub Actions secret BOT_PASSWORD_PREFIX to the new value
 *   2. Mark the GitGuardian incident resolved
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OLD_PREFIX = process.env.OLD_BOT_PASSWORD_PREFIX || 'BotAccount2026!!';
const NEW_PREFIX = process.env.BOT_PASSWORD_PREFIX;
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

if (!SERVICE_ROLE) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY missing from .env.local');
  process.exit(1);
}
if (!NEW_PREFIX) {
  console.error('ERROR: BOT_PASSWORD_PREFIX missing from .env.local');
  process.exit(1);
}
if (NEW_PREFIX === OLD_PREFIX) {
  console.error('ERROR: BOT_PASSWORD_PREFIX is identical to OLD_BOT_PASSWORD_PREFIX. Pick a new value.');
  process.exit(1);
}

const sbAdmin = createClient(SUPABASE_URL, SERVICE_ROLE);
const sbAuth = createClient(SUPABASE_URL, SERVICE_ROLE);

// Extract the botname segment from `bot-{botname}@dreambot.app`.
function botnameFromEmail(email) {
  const m = email.match(/^bot-([a-z0-9.-]+)@dreambot\.app$/i);
  return m ? m[1] : null;
}

(async () => {
  console.log(`mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}${FORCE ? ' (FORCE — ignoring old-pw mismatch)' : ''}`);
  console.log(`old prefix length: ${OLD_PREFIX.length}`);
  console.log(`new prefix length: ${NEW_PREFIX.length}`);
  console.log();

  // Page through every auth user, filter for bot emails.
  const bots = [];
  let page = 1;
  while (true) {
    const { data, error } = await sbAdmin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) {
      console.error('listUsers failed:', error.message);
      process.exit(1);
    }
    if (!data?.users || data.users.length === 0) break;
    for (const u of data.users) {
      if (u.email && /^bot-[a-z0-9.-]+@dreambot\.app$/i.test(u.email)) {
        bots.push(u);
      }
    }
    if (data.users.length < 200) break;
    page++;
  }

  if (bots.length === 0) {
    console.log('No bot accounts found.');
    return;
  }

  console.log(`Found ${bots.length} bot account(s):`);
  bots.forEach((b) => console.log(`  - ${b.email}`));
  console.log();

  let ok = 0;
  let signinFail = 0;
  let updateFail = 0;
  // Supabase Auth rate-limits signInWithPassword aggressively. With --force
  // we skip both pre- and post-verification (admin API is authoritative)
  // and pace the loop with a short delay to be safe.
  const DELAY_MS = 1500;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  for (const u of bots) {
    const botname = botnameFromEmail(u.email);
    if (!botname) {
      console.log(`  skip ${u.email} (couldn't parse botname)`);
      continue;
    }
    const oldPw = `${OLD_PREFIX}${botname}`;
    const newPw = `${NEW_PREFIX}${botname}`;

    // Sanity check: confirm we can currently sign in with the OLD password.
    // If we can't, the bot's password is already non-standard. Without
    // --force we skip (don't silently overwrite something rotated by hand).
    // With --force we proceed anyway — useful for bringing stragglers into
    // line with the standard prefix. With --force we also skip the sign-in
    // entirely to avoid Supabase auth rate limits (admin API is the
    // source of truth for the update).
    if (!FORCE) {
      const { error: signinErr } = await sbAuth.auth.signInWithPassword({
        email: u.email,
        password: oldPw,
      });
      if (signinErr) {
        console.log(`  ⚠️  ${botname}: old password didn't work (${signinErr.message}). Skipping (use --force to rotate anyway).`);
        signinFail++;
        await sleep(DELAY_MS);
        continue;
      }
      await sbAuth.auth.signOut();
    }

    if (DRY_RUN) {
      console.log(`  ✓ ${botname}: would rotate (old verified)`);
      ok++;
      continue;
    }

    const { error: updErr } = await sbAdmin.auth.admin.updateUserById(u.id, { password: newPw });
    if (updErr) {
      console.log(`  ✗ ${botname}: update failed (${updErr.message})`);
      updateFail++;
      await sleep(DELAY_MS);
      continue;
    }

    // Post-verification sign-in only when NOT using --force. With --force
    // (which we expect to be the live mode), we trust the admin API and
    // avoid burning rate-limit quota.
    if (!FORCE) {
      const { error: verifyErr } = await sbAuth.auth.signInWithPassword({
        email: u.email,
        password: newPw,
      });
      if (verifyErr) {
        console.log(`  ✗ ${botname}: rotated but new-password verify failed (${verifyErr.message})`);
        updateFail++;
        await sleep(DELAY_MS);
        continue;
      }
      await sbAuth.auth.signOut();
    }

    console.log(`  ✓ ${botname}: rotated`);
    ok++;
    await sleep(DELAY_MS);
  }

  console.log();
  console.log(`Summary: ${ok} ok, ${signinFail} skipped (old-pw mismatch), ${updateFail} failed`);
  if (!DRY_RUN && ok > 0) {
    console.log();
    console.log('NEXT STEPS:');
    console.log('  1. Update GitHub Actions secret BOT_PASSWORD_PREFIX to the new value');
    console.log('  2. Run a quick `node scripts/generate-bot-dreams.js --bot <one>` to confirm the new prefix works in production');
    console.log('  3. Mark the GitGuardian incident resolved');
  }
})();
