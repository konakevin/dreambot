#!/usr/bin/env node
/**
 * activity-report.js — who visited the app recently, and what they did.
 *
 * "Visited" = users.last_active_at within the window. The app touches that
 * column via the touch_last_active() RPC on sign-in AND on every app
 * open/foreground (app/_layout.tsx heartbeat), so it's the source of truth for
 * visits — PostHog can't be (client analytics are !__DEV__-gated, so dev/
 * TestFlight sessions never reach it).
 *
 * Per-user activity in the same window: dreams enqueued (create vs nightly),
 * likes, comments, reposts, follows, and sparkles spent (negative ledger).
 * Bots excluded. All reads paginated (PostgREST silently caps at 1000 rows).
 *
 * Usage: node scripts/activity-report.js [hours]   (default 12)
 * Reads SUPABASE_SERVICE_ROLE_KEY + EXPO_PUBLIC_SUPABASE_URL from .env.local.
 */

const fs = require('fs');
const path = require('path');

function readEnvFile() {
  try {
    const lines = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}

const env = readEnvFile();
const URL_ = process.env.EXPO_PUBLIC_SUPABASE_URL || env.EXPO_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) {
  console.error('Missing EXPO_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (.env.local)');
  process.exit(1);
}
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

const hours = Math.max(1, Number(process.argv[2]) || 12);
const since = new Date(Date.now() - hours * 3600 * 1000).toISOString();

// Paginated read — PostgREST silently caps unpaged reads at 1000 rows.
async function pageAll(pathAndQuery) {
  const out = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${URL_}/rest/v1/${pathAndQuery}`, {
      headers: { ...H, Range: `${from}-${from + 999}` },
    });
    if (!res.ok) throw new Error(`${pathAndQuery}: ${res.status} ${await res.text()}`);
    const rows = await res.json();
    out.push(...rows);
    if (rows.length < 1000) return out;
  }
}

const tally = (list, key) => {
  const m = new Map();
  for (const r of list) m.set(r[key], (m.get(r[key]) || 0) + 1);
  return m;
};

(async () => {
  const users = await pageAll(
    `users?select=id,username,display_name,email,last_active_at,created_at,` +
      `pro_subscription,pro_trial_started_at,sparkle_balance` +
      `&is_bot=eq.false&last_active_at=gte.${since}&order=last_active_at.desc`
  );
  if (users.length === 0) {
    console.log(`No users active in the last ${hours}h.`);
    return;
  }
  const inList = `in.(${users.map((u) => u.id).join(',')})`;
  const [queue, likes, comments, follows, reposts, ledger] = await Promise.all([
    pageAll(`dream_queue?select=user_id,source&created_at=gte.${since}&user_id=${inList}`),
    pageAll(`likes?select=user_id&created_at=gte.${since}&user_id=${inList}`),
    pageAll(`comments?select=user_id&created_at=gte.${since}&user_id=${inList}`),
    pageAll(`follows?select=follower_id&created_at=gte.${since}&follower_id=${inList}`),
    pageAll(`post_reposts?select=user_id&created_at=gte.${since}&user_id=${inList}`).catch(
      () => []
    ),
    pageAll(
      `sparkle_ledger?select=user_id,amount&created_at=gte.${since}&user_id=${inList}&amount=lt.0`
    ).catch(() => []),
  ]);

  const createDreams = tally(
    queue.filter((q) => q.source !== 'nightly'),
    'user_id'
  );
  const nightly = tally(
    queue.filter((q) => q.source === 'nightly'),
    'user_id'
  );
  const likeC = tally(likes, 'user_id');
  const commentC = tally(comments, 'user_id');
  const followC = tally(follows, 'follower_id');
  const repostC = tally(reposts, 'user_id');
  const spent = new Map();
  for (const l of ledger) spent.set(l.user_id, (spent.get(l.user_id) || 0) - l.amount);

  const fmt = (d) => new Date(d).toISOString().slice(5, 16).replace('T', ' ');
  const proLabel = (u) =>
    u.pro_subscription ? 'PRO' : u.pro_trial_started_at ? 'trial-started' : 'free';

  console.log(`Users active in the last ${hours}h (since ${since}): ${users.length}\n`);
  for (const u of users) {
    const ageDays = Math.floor((Date.now() - new Date(u.created_at)) / 86400000);
    const acts = [];
    if (createDreams.get(u.id)) acts.push(`${createDreams.get(u.id)} dream(s) created`);
    if (nightly.get(u.id)) acts.push(`${nightly.get(u.id)} nightly`);
    if (likeC.get(u.id)) acts.push(`${likeC.get(u.id)} likes`);
    if (commentC.get(u.id)) acts.push(`${commentC.get(u.id)} comments`);
    if (repostC.get(u.id)) acts.push(`${repostC.get(u.id)} reposts`);
    if (followC.get(u.id)) acts.push(`${followC.get(u.id)} follows`);
    if (spent.get(u.id)) acts.push(`${spent.get(u.id)}✦ spent`);
    console.log(
      `@${u.username ?? '(no username)'} | ${u.display_name ?? ''} | ${u.email ?? ''}\n` +
        `  last active ${fmt(u.last_active_at)} UTC | ${proLabel(u)} | ` +
        `balance ${u.sparkle_balance}✦ | account ${ageDays}d old\n` +
        `  activity: ${acts.length ? acts.join(', ') : 'browsed only (no writes)'}\n`
    );
  }
})();
