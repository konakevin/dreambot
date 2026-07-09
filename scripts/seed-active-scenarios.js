#!/usr/bin/env node
/**
 * Seed the ACTIVE dual scenario pool (ACTION_POSE_EXPANSION_PLAN.md).
 *
 * Inserts MVP-25-scale rows into dual_scenarios with pool='active' — full
 * action scenes (the "random other" leg of the nightly roll) with the body
 * action embedded in the scene text. Every row passes the active-pool lint
 * (scripts/lib/posePoolLint.js) at insert time: the proximity scanner only
 * sees code files, so DB rows MUST lint here. Aborts on any lint violation.
 *
 * Idempotent-ish: refuses to run if pool='active' already has rows (use
 * --append to add more, --wipe-active to replace — active rows ONLY, scoped
 * by pool per the bot_seeds hard rule).
 *
 * Usage: node scripts/seed-active-scenarios.js [--append|--wipe-active]
 */

require('dotenv').config({ path: '/Users/kevinmchenry/Development/apps/dreambot/.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { lintActivePoseEntry } = require('./lib/posePoolLint');

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CASUAL = 'bright casual everyday clothes';
const ROWS = [
  {
    scene:
      'racing side-by-side go-karts through the final turn of a seaside track, a kart-width apart with hair in the wind, both grinning at the camera',
    attire: CASUAL,
  },
  {
    scene:
      'mid-collision in neon bumper cars at a night carnival, a car-width apart, both laughing toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'in adjacent batting cages mid-swing, bats blurred with motion, both faces toward the camera',
    attire: 'sporty casual clothes',
  },
  {
    scene:
      'celebrating a strike at a retro bowling alley, one mid fist-pump and the other mid-jump a lane apart, both faces toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'mid-putt on a wild neon mini golf course, one lining up the shot and the other celebrating a step away, both faces toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'racing up side-by-side routes on a colorful climbing gym wall, a rope-width apart, both grinning toward the camera',
    attire: 'athletic climbing wear with harnesses',
  },
  {
    scene:
      'riding a ferris wheel at golden hour, seated at opposite ends of the open gondola bench, both faces toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'mid water-balloon toss from several paces apart, the balloon frozen mid-flight between them, both laughing toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'bouncing on side-by-side trampolines caught at the top of their jumps, a lane apart, both faces toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'mid-step on side-by-side arcade dance machine pads with arrows lighting up, both laughing toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'pedaling a giant swan paddle boat across a park lagoon, seated a seat apart, both faces toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'standing at opposite rails of a hot air balloon basket at sunrise, a basket-width apart, both faces toward the camera',
    attire: 'cozy layered morning clothes',
  },
  {
    scene:
      'riding a tandem bicycle down a tree-lined lane, seated front and back, both faces turned toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'drawing bows at side-by-side archery targets, arms steady at full draw, both faces toward the camera',
    attire: 'sporty casual clothes with arm guards',
  },
  {
    scene:
      'at side-by-side pottery wheels with clay-streaked aprons, hands shaping spinning clay, both laughing toward the camera',
    attire: 'aprons over casual clothes',
  },
  {
    scene:
      'flipping pans over flaming burners at a cooking class station, a burner apart, both faces toward the camera',
    attire: 'chef aprons over casual clothes',
  },
  {
    scene:
      'mid laser tag duel in a glowing neon arena, dodging in opposite directions a body-width apart, both grinning at the camera',
    attire: 'casual clothes with glowing laser tag vests',
  },
  {
    scene:
      'skipping stones across a still lake at dusk, one mid-throw and the other counting the skips a step apart, both faces toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'at a carnival ring-toss booth, one mid-toss and the other hoisting a giant stuffed prize, a step apart, both smiling at the camera',
    attire: CASUAL,
  },
  {
    scene:
      'rolling through a retro roller rink under a disco ball, a stride apart with arms out for balance, both faces toward the camera',
    attire: 'retro 70s roller disco outfits',
  },
  {
    scene:
      'flying a giant rainbow kite on a breezy hillside, one holding the spool and the other releasing it skyward a few steps apart, both faces toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'mid-hop in a backyard sack race at full bounce, a lane apart, both laughing toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'pulling a block from a teetering giant jenga tower at a beer garden, one reaching and the other bracing for the fall a step away, both faces toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'mid-roll at side-by-side skee ball lanes under carnival lights, both grinning at the camera',
    attire: CASUAL,
  },
  {
    scene:
      'racing down side-by-side water park slides in separate tubes, arms up mid-splashdown, both faces toward the camera',
    attire: 'bright swimwear',
  },
  {
    scene:
      'gliding on segways along a waterfront boardwalk, a lane apart, both faces toward the camera',
    attire: CASUAL,
  },
];

(async () => {
  const mode = process.argv[2] ?? '';

  // Lint EVERY row before touching the DB — abort on any violation.
  let bad = 0;
  for (const r of ROWS) {
    const problems = lintActivePoseEntry(r.scene);
    if (problems.length) {
      bad++;
      console.error(`✗ ${problems.join('; ')}\n    ${r.scene}`);
    }
  }
  if (bad) {
    console.error(`\n${bad} row(s) failed the active-pool lint — nothing inserted.`);
    process.exit(1);
  }

  const { count } = await sb
    .from('dual_scenarios')
    .select('*', { count: 'exact', head: true })
    .eq('pool', 'active');
  if (count > 0 && mode !== '--append' && mode !== '--wipe-active') {
    console.error(`pool='active' already has ${count} rows. Use --append or --wipe-active.`);
    process.exit(1);
  }
  if (mode === '--wipe-active') {
    // SCOPED delete — active pool only (never goofy/elegant; hard rule).
    const { error } = await sb.from('dual_scenarios').delete().eq('pool', 'active');
    if (error) {
      console.error('wipe failed:', error.message);
      process.exit(1);
    }
    console.log(`wiped ${count} active rows`);
  }

  const { error } = await sb
    .from('dual_scenarios')
    .insert(
      ROWS.map((r) => ({ pool: 'active', scene: r.scene, attire: r.attire, disabled: false }))
    );
  if (error) {
    console.error('insert failed:', error.message);
    process.exit(1);
  }
  const { count: after } = await sb
    .from('dual_scenarios')
    .select('*', { count: 'exact', head: true })
    .eq('pool', 'active');
  console.log(
    `✓ ${ROWS.length} active scenarios inserted (pool total: ${after}) — all lint-green.`
  );
})();
