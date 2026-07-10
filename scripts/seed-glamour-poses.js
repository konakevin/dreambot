#!/usr/bin/env node
/**
 * Seed the curated GLAMOUR pose pool (action_poses pool='glamour', migration
 * 353) — the earnest mall-Glamour-Shots poses paired to glamour_shot_retro
 * scenario seeds via scenario.pose_pool. Hand-curated, NOT generated: the
 * cheese has to be exact (chin-on-fist, over-the-shoulder, hand-framing-face)
 * and every dual entry keeps the heads clearly separated (swap safety).
 *
 * Every entry is gated by lintClassicPoseEntry at insert. Idempotent-ish:
 * refuses to run if the pool already has rows (use --wipe to reseed).
 *
 * Usage: node scripts/seed-glamour-poses.js [--dry] [--wipe]
 */
require('dotenv').config({ path: '/Users/kevinmchenry/Development/apps/dreambot/.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { lintClassicPoseEntry } = require('./lib/posePoolLint');

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const DRY = process.argv.includes('--dry');
const WIPE = process.argv.includes('--wipe');

// Dual: every entry names an explicit head/face separation and both faces to
// camera — the dual swap needs two big cleanly-split frontal faces.
const DUAL_GLAMOUR = [
  'standing back-to-back with arms crossed, a clear gap between their heads, both giving the camera an earnest soap-opera smolder',
  'one seated on a tall stool and the other standing behind it, hands resting on the seated shoulders, faces at clearly different heights, both smiling dreamily at the camera',
  'side by side each resting chin on one fist with elbows propped, a clear gap between their heads, both gazing softly into the lens',
  'angled away from each other toward opposite diagonals with heads well apart, each glancing back over the near shoulder at the camera with dramatic earnestness',
  'one a step in front and the other a step behind and to the side, heads clearly separated, both with hands clasped low and matching dreamy half-smiles at the camera',
  'seated on the studio floor at a slight diagonal with a clear gap between their heads, each leaning on one arm, both gazing up toward the camera with soft glamour smiles',
  'standing side by side with fingers laced under their own chins like matching portrait busts, heads well apart, both with eyes sparkling at the camera',
  'both facing the camera with arms crossed high and chins lifted, a clear gap between their heads, wearing over-serious catalog-model confidence',
  'one resting a straight forearm on the other’s shoulder at full arm’s length, heads clearly separated, both flashing dazzling game-show smiles at the camera',
  'one seated on a white studio bench and the other perched on its backrest, heads at clearly different heights with a gap between them, both gazing wistfully at the camera',
  'standing in a shallow V formation with wind-machine hair, heads well apart, both frozen in a dramatic mid-laugh straight at the camera',
  'each with one hand softly framing their own cheek in the classic glamour pose, standing well apart, both giving the camera wide earnest eyes',
  'one leaning an elbow on the white column prop and the other standing a clear step away with hands on hips, heads well separated, both smiling like a department-store catalog',
  'shoulder to shoulder but with heads tilted apart and a clear gap between their faces, both aiming a closed-lip dreamy smile straight into the lens',
];

const SOLO_GLAMOUR = [
  'chin resting on laced fingers with elbows propped, an earnest dreamy smile straight into the lens',
  'head tilted with one hand softly framing the cheek, eyes wide and sparkling at the camera',
  'glancing back over one shoulder at the camera with a soft closed-lip smolder',
  'arms crossed high with chin lifted, giving the camera over-serious catalog-model confidence',
  'both hands stacked under the chin like a pillow, head tilted, beaming dreamily at the lens',
  'one hand raking through wind-blown hair, eyes locked on the camera in dramatic earnestness',
  'leaning an elbow on the white column prop with cheek resting lightly against knuckles, gazing wistfully into the lens',
  'seated backward on a chair with arms folded on the backrest and chin held high above them, eyes soulfully on the camera',
  'one hand on hip and the other touching the collarbone, chin dipped slightly, eyes up at the camera in full soap-opera drama',
  'holding both jacket lapels with chest proud, aiming a mega-watt game-show smile at the lens',
  'fingertips resting at the temple like a lost-in-thought portrait, gaze drifting theatrically just past the camera',
  'frozen mid hair-flip with the wind machine going, laughing straight into the camera',
  'hands clasped at one shoulder with head tilted toward them, giving the lens wide doe eyes',
  'leaning forward with both forearms on a posing table and fingers interlaced, eyebrows raised in earnest sincerity',
  'one fist under the chin and the opposite hand cupping the elbow in the classic thinker pose, soft smile at the camera',
  'holding a draped white feather boa at shoulder level with the full face visible, eyes twinkling at the lens',
  'shoulders angled away but face turned fully to the camera with chin tucked, smoldering like a paperback-novel cover',
  'hands framing the face on both sides in the ultimate glamour-shot pose with elbows out, giving the camera earnest wide-eyed wonder',
];

(async () => {
  const rows = [
    ...DUAL_GLAMOUR.map((text) => ({ cast_type: 'dual', pool: 'glamour', text })),
    ...SOLO_GLAMOUR.map((text) => ({ cast_type: 'solo', pool: 'glamour', text })),
  ];

  let bad = 0;
  for (const r of rows) {
    const issues = lintClassicPoseEntry(r.text);
    if (issues.length) {
      bad++;
      console.log(`✗ LINT [${r.cast_type}] ${issues[0]}: ${r.text}`);
    }
  }
  if (bad) {
    console.error(`\n${bad} entries fail lint — fix before seeding.`);
    process.exit(1);
  }
  console.log(`lint clean: ${DUAL_GLAMOUR.length} dual + ${SOLO_GLAMOUR.length} solo`);
  if (DRY) return console.log('(dry — nothing inserted)');

  const { count } = await sb
    .from('action_poses')
    .select('id', { count: 'exact', head: true })
    .eq('pool', 'glamour');
  if (count && count > 0) {
    if (!WIPE) {
      console.error(`glamour pool already has ${count} rows — pass --wipe to reseed.`);
      process.exit(1);
    }
    const { error } = await sb.from('action_poses').delete().eq('pool', 'glamour');
    if (error) {
      console.error('wipe failed:', error.message);
      process.exit(1);
    }
    console.log(`wiped ${count} existing glamour rows`);
  }

  const { error } = await sb.from('action_poses').insert(rows);
  if (error) {
    console.error('insert failed:', error.message);
    process.exit(1);
  }
  console.log(
    `✅ inserted ${rows.length} glamour poses (${DUAL_GLAMOUR.length} dual / ${SOLO_GLAMOUR.length} solo)`
  );
})();
