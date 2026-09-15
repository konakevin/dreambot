#!/usr/bin/env node
/**
 * announce-dream-cast.js — the "bring the whole cast" announcement row.
 *
 * Ships DARK (is_active=false) and version-gated to 1.4.0, the release that carries
 * the new Dream Cast screen. Both gates matter and they are independent: the version
 * floor means no client below 1.4.0 can EVER see this regardless of when is_active
 * gets flipped, so the row can sit in production from today without risk.
 *
 * The feature is a CLIENT change. The nightly engine half has been live since
 * 2026-09-15, but with no shipped client able to write `enabled`, every user falls
 * through the back-compat rule (their one Dream Partner is the only eligible member)
 * and nothing about their dreams changes. So announcing before 1.4.0 is live would
 * point people at a screen they do not have.
 *
 * Safe to re-run any time before go-live: it upserts and always ships is_active=false,
 * which is how the copy gets refined. Running it again never accidentally goes live.
 *
 * Go-live is `--golive`, NOT a manual UPDATE — see DREAM_CAST_GOLIVE_RUNBOOK.md. It
 * calls activate_announcement() (which atomically deactivates whatever is currently
 * live, activates this, and resets starts_at so `existing_users_only` means everyone
 * who existed at the flip) AND clears the admin's own announcement_seen row. That
 * second step is the one that bit us on 2026-09-09: previewing an announcement marks
 * it seen, and the shows-exactly-once rule has no admin exemption, so a preview from
 * days earlier silently eats the real sheet.
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const ID = 'dream-cast-launch';
const HERO =
  'https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/dream-cast-announcement-hero.jpg';
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
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
        // "Now casting" is the real film-world phrase for exactly this change, so the
        // title lands the reveal AND describes it in three words, and the body's first
        // line then explains what it means mechanically. Kept to 21 characters: the
        // gradient title runs ~310pt at size 22, so past ~23 it wraps to two lines and
        // a ta-da headline loses its punch.
        title: 'Now casting: everyone 🎬',
        // Leads with what CHANGED, which is what an existing user needs, then the
        // three actions in order. "Take turns" rather than "randomly": the roll is a
        // round robin, so nobody repeats until everyone switched on has had a turn.
        // Random would mean the same person three nights running, which is precisely
        // what the rotation was built to avoid, so saying it would undersell the
        // feature AND be wrong. "Choose who's in" rather than "set your active cast"
        // because the screen says IN YOUR DREAMS / BACKSTAGE and never "active cast".
        body: "We've changed how nightly dreams pick your +1. Add up to 5 loved ones, choose who's in, and they'll take turns starring alongside you.",
        // The cast-bubble hero, produced by scripts/gen-dream-cast-announcement-hero.js
        // (five cartoon characters in the same circles the roster uses). Named HERE
        // rather than left null, because this script upserts the whole row: leaving it
        // null meant every copy tweak silently wiped the hero that the generator had
        // just published.
        image_url: HERO,
        cta_label: 'Set up your cast',
        cta_route: '/settings/dream-cast',
        style: 'sheet',
        audience: 'all',
        // Native build number is not known until 1.4.0 is actually built; the
        // marketing-version floor below is the gate that matters (migration 487).
        min_build: null,
        min_app_version: '1.4.0',
        starts_at: new Date().toISOString(), // overwritten by activate_announcement()
        ends_at: null,
        // Same rung as farmbot-launch, which this replaces at go-live.
        priority: 15,
        is_active: false,
        // Brand-new signups after the flip never see a "new!" sheet for something
        // that was always in their app.
        existing_users_only: true,
      },
      { onConflict: 'id' }
    )
    .select();
  if (error) {
    console.error('FAILED:', error);
    process.exit(1);
  }
  console.log('✅ Upserted (DARK, is_active=false, gated to 1.4.0):');
  console.log(JSON.stringify(data[0], null, 2));
}

async function golive() {
  // Guard: a nonzero seen-count from anyone but the admin means this row went live
  // prematurely, which is a different problem than a stale preview and must not be
  // papered over by deleting rows.
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

  // The 2026-09-09 incident: every admin preview marks the row seen, and the
  // shows-exactly-once check has NO admin exemption (only the version check does),
  // so without this Kevin sees nothing when he opens the app post-launch.
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
    .select('id,is_active,min_app_version,starts_at,priority')
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
