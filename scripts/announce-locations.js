#!/usr/bin/env node
/**
 * announce-locations.js — the "Locations, refreshed" announcement for the Locations rework (1.11.0): the picker
 * grouped by mood, the new tiles (Romantic Escapes places, Dreamscapes, Just for Fun, Game On) and nightly dreams
 * scoped to the places a dreamer picked (SCENARIO_LOCATION_SCOPE.md).
 *
 * Ships DARK (is_active=false) and gated to 1.11.0, the first release with the new picker. The two gates are
 * independent: no client below 1.11.0 can ever see this, whenever is_active flips. Safe to re-run before go-live to
 * refine the copy; it always writes is_active=false. The admin preview (mig 483) shows it on Kevin's own build as
 * soon as it is upserted, which is the way to check it on a device.
 *
 * Go-live is `--golive`, AFTER `node scripts/apply-migration.mjs 628` (the new tiles become visible). It refuses to
 * run until 628 has taken effect, so the sheet can never send people to a picker that doesn't show what it names.
 * Then, like announce-dream-cast.js: stops if anyone but the admin has already seen it, activate_announcement()
 * (deactivates dream-cast-launch, activates this, resets starts_at so `existing_users_only` means everyone who
 * existed at the flip), and clears the admin's own seen row (the 2026-09-09 FarmBot trap: a preview marks it seen
 * and the shows-once rule has no admin exemption).
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const ID = 'locations-launch';
// ?v= is a CACHE BUSTER: expo-image caches by URL. Bump it whenever gen-locations-announcement-hero.js re-uploads.
const HERO =
  'https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/locations-announcement-hero.jpg?v=1';
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const NEW_TILES = ['surreal_dreams', 'just_for_fun', 'game_on'];
const GOLIVE = process.argv.includes('--golive');

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function upsert() {
  const { data, error } = await sb
    .from('announcements')
    .upsert(
      {
        id: ID,
        // A light nudge, not a feature pitch (Kevin 2026-09-30: "hey, the locations screen has changed, and there
        // are a few new locations to check out"). The title is about the screen; the hero's own label already says
        // "new places to dream", so the two don't repeat. No emoji (Kevin: "ditch the icon on the right of the
        // title"). 20 characters, one line (the gradient title wraps past ~23).
        title: 'Locations, refreshed',
        // Paragraph 1 is the nudge. Paragraph 2 teaches the rule that changed: nightly used to draw some scenes from
        // shared pools regardless of a dreamer's picks (SCENARIO_LOCATION_SCOPE.md); now every nightly stays in
        // their places (holidays aside). Stated as how it works, not as a change (Kevin 2026-09-30: many never
        // noticed the drift, so "no more surprise detours" read as news about a problem they didn't have), and the
        // "more you pick" half gives a reason to tap through and add the new places. The blank line renders as a
        // paragraph break in the sheet's body Text.
        body: "The Locations screen has a new look, plus a few new places to check out.\n\nEvery nightly dream is set in one of the places you've picked, so the more you pick, the more variety you'll get.",
        image_url: HERO,
        cta_label: 'Take a look',
        cta_route: '/settings/locations',
        style: 'sheet',
        // Places only shape NIGHTLY dreams (rollDream runs in nightly-dreams and first-dream-render only), and
        // nightly is Pro or trial. A free user would read "your nightly dreams" about dreams they don't get.
        audience: 'pro',
        // The native build number isn't known until 1.11.0 is built; the version floor is the gate (mig 487).
        min_build: null,
        min_app_version: '1.11.0',
        starts_at: new Date().toISOString(), // overwritten by activate_announcement()
        ends_at: null,
        // Same rung as dream-cast-launch, which this replaces at go-live.
        priority: 15,
        is_active: false,
        // A signup after the flip picked places on the new screen already; "new!" would be noise.
        existing_users_only: true,
      },
      { onConflict: 'id' }
    )
    .select();
  if (error) {
    console.error('FAILED:', error);
    process.exit(1);
  }
  console.log('✅ Upserted (DARK, is_active=false, gated to 1.11.0):');
  console.log(JSON.stringify(data[0], null, 2));
}

async function golive() {
  // The sheet names Dreamscapes and Game On; they must be in the picker first (migration 628).
  const { data: tiles, error: tileErr } = await sb
    .from('picker_tiles')
    .select('key, admin_only')
    .in('key', NEW_TILES);
  if (tileErr) {
    console.error('FAILED reading picker_tiles:', tileErr);
    process.exit(1);
  }
  const hidden = (tiles ?? []).filter((t) => t.admin_only).map((t) => t.key);
  if (hidden.length > 0 || (tiles ?? []).length !== NEW_TILES.length) {
    console.error(
      `STOP: tiles still hidden (${hidden.join(', ') || 'missing rows'}). Apply migration 628 first: node scripts/apply-migration.mjs 628`
    );
    process.exit(1);
  }

  const { data: seen, error: seenErr } = await sb
    .from('announcement_seen')
    .select('user_id')
    .eq('announcement_id', ID);
  if (seenErr) {
    console.error('FAILED reading announcement_seen:', seenErr);
    process.exit(1);
  }
  const others = (seen ?? []).filter((r) => r.user_id !== KEVIN);
  if (others.length > 0) {
    console.error(
      `STOP: ${others.length} non-admin user(s) have already seen ${ID}. That means it went live early. Investigate before activating.`
    );
    process.exit(1);
  }

  const { error: rpcErr } = await sb.rpc('activate_announcement', { p_id: ID });
  if (rpcErr) {
    console.error('FAILED activate_announcement:', rpcErr);
    process.exit(1);
  }

  const { error: delErr } = await sb
    .from('announcement_seen')
    .delete()
    .eq('announcement_id', ID)
    .eq('user_id', KEVIN);
  if (delErr) {
    console.error('FAILED clearing the admin seen row:', delErr);
    process.exit(1);
  }

  const { data: live } = await sb
    .from('announcements')
    .select('id,is_active,min_app_version,audience,starts_at,priority')
    .eq('is_active', true);
  console.log('✅ Live. Active announcements (the unique index caps this at 1):');
  console.log(JSON.stringify(live, null, 2));
  console.log(
    '\nAdmin seen row cleared. Force-quit the app (not background) to re-check eligibility.'
  );
}

(GOLIVE ? golive() : upsert()).catch((e) => {
  console.error(e);
  process.exit(1);
});
