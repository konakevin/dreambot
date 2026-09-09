#!/usr/bin/env node
/**
 * announce-farmbot.js — inserts the "Meet FarmBot" announcement row.
 *
 * NOT RUN YET (Kevin 2026-09-08: "don't set it to public until i tell you,
 * we still need to make a new build and get it deployed to the app store
 * still"). FarmBot itself must go public (users.is_public=true on its
 * account) in the SAME moment as this announcement — an announcement
 * telling everyone to "meet FarmBot" while the account is still
 * follower-gated private would be a broken, confusing experience.
 *
 * Tied to the 1.2.0 release via `min_app_version: '1.2.0'` (migration 487) —
 * set ahead of time, right here, so no client below 1.2.0 can ever see this
 * announcement regardless of when `is_active` gets flipped. See
 * FARMBOT_GOLIVE_RUNBOOK.md for the full ordered go-live sequence:
 *   1. FarmBot's account is flipped public (UPDATE users SET is_public=true
 *      WHERE username='FarmBot').
 *   2. A bot_schedules row exists for FarmBot (so it starts posting on its
 *      own cadence) — currently has none, by design, while private.
 *   3. 1.2.0 is actually live on the App Store.
 *   4. Kevin gives the explicit go-ahead → `SELECT activate_announcement('farmbot-launch');`
 *
 * Safe to re-run any time before go-live (upserts, ships is_active=false) —
 * this is how the hero image / copy get updated as they're refined; running
 * it again never accidentally goes live (is_active + min_app_version both
 * gate that).
 *
 * Content precedent: the locations-redesign announcement ("We redecorated
 * ✨") — short punchy title, 1-2 sentence playful body, a preview image, one
 * CTA. No migration inserts announcements (checked — none in git history);
 * every one has been a one-off ad-hoc insert at actual launch time, so this
 * script follows that same pattern rather than a numbered migration.
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const FARMBOT_USER_ID = '754ad892-3e52-41d9-9364-e41fe081812c';

async function main() {
  const sb = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await sb
    .from('announcements')
    .upsert(
      {
        id: 'farmbot-launch',
        title: 'Introducing FarmBot 🌾',
        body: 'Meet our newest addition to the neighborhood, FarmBot! It dreams up cozy farmhouse mornings, sleepy barn animals, and gardens in full bloom. Come say hi.',
        // Harvest Festival hero concept (2026-09-09 refresh, v2 vote —
        // scripts/gen-farmbot-announcement-hero-v2.js, rewritten against
        // the current 30-path roster + current look register after the old
        // v1 script's paths were discarded). Hay wagon, string lights,
        // pumpkins at sunset, character right in frame — Kevin's pick.
        // Supersedes the original market-town-square hero.
        image_url:
          'https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/754ad892-3e52-41d9-9364-e41fe081812c/announcement-hero-harvest-festival.jpg',
        cta_label: 'Meet FarmBot',
        cta_route: `/user/${FARMBOT_USER_ID}`,
        style: 'sheet',
        audience: 'all',
        min_build: null, // native build number isn't known until 1.2.0 is actually built (see min_app_version instead)
        // Marketing-version floor (migration 487) — set ahead of the actual
        // build, so no client below 1.2.0 can ever see this, regardless of
        // is_active timing. Client compares this against
        // Constants.expoConfig.version via lib/appVersion.ts (fail-open,
        // useAnnouncement.ts).
        min_app_version: '1.2.0',
        starts_at: new Date().toISOString(), // overwritten at real go-live anyway
        ends_at: null,
        // The locations-redesign announcement ("We redecorated ✨", priority
        // 20) was deactivated 2026-09-08 as stale/long-shipped — no longer
        // competing for priority. 15 just keeps this below any future
        // higher-urgency announcement by default.
        priority: 15,
        is_active: false, // DARK — flip true only at actual go-live
        existing_users_only: true,
      },
      { onConflict: 'id' }
    )
    .select();

  if (error) {
    console.error('FAILED:', error);
    process.exit(1);
  }
  console.log('✅ Upserted (is_active=false, dark):', JSON.stringify(data[0], null, 2));
}

main();
