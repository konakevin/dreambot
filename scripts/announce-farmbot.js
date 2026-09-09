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
 * Run this ONLY at actual go-live, after:
 *   1. FarmBot's account is flipped public (UPDATE users SET is_public=true
 *      WHERE username='FarmBot').
 *   2. A bot_schedules row exists for FarmBot (so it starts posting on its
 *      own cadence) — currently has none, by design, while private.
 *   3. Kevin gives the explicit go-ahead.
 *
 * Ships with is_active=false so even an accidental early run stays dark —
 * flip it live with:
 *   UPDATE public.announcements SET is_active = true, starts_at = now()
 *   WHERE id = 'farmbot-launch';
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
        // Market-town-square hero concept (Anime background-painter look,
        // cherry-blossom market scene) — Kevin's pick from the 6-concept
        // vote (scripts/gen-farmbot-announcement-hero.js). Has some faint
        // garbled text on background shop signage (the known market-square
        // Flux quirk); Kevin explicitly accepted it as-is, not worth
        // re-rendering over.
        image_url:
          'https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/754ad892-3e52-41d9-9364-e41fe081812c/announcement-hero-market-square.jpg',
        cta_label: 'Meet FarmBot',
        cta_route: `/user/${FARMBOT_USER_ID}`,
        style: 'sheet',
        audience: 'all',
        min_build: null, // no new client code needed — just a DB is_public flip
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
