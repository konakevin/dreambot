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
 *        node scripts/seed-active-scenarios.js --solo [--append|--wipe-active]
 *        (--solo targets single_scenarios with the solo row set, gender='any')
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

const SOLO_ROWS = [
  {
    scene:
      'racing a go-kart through the final hairpin of a seaside track, hair in the wind, grinning at the camera',
    attire: CASUAL,
  },
  {
    scene: 'swinging hard in a batting cage, bat blurred mid-swing, face toward the camera',
    attire: 'sporty casual clothes',
  },
  {
    scene: 'celebrating a strike at a retro bowling alley mid fist-pump, face toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'scaling a colorful climbing gym wall mid-reach for the next hold, face turned toward the camera',
    attire: 'athletic climbing wear with a harness',
  },
  {
    scene:
      'caught at the top of a trampoline park jump with knees tucked, laughing toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'mid-step on an arcade dance machine with arrows lighting up, laughing toward the camera',
    attire: CASUAL,
  },
  {
    scene: 'riding a mechanical bull mid-buck with one arm high, face still toward the camera',
    attire: 'casual western wear',
  },
  {
    scene:
      'standing at the rail of a hot air balloon basket at sunrise, arms spread wide, face toward the camera',
    attire: 'cozy layered morning clothes',
  },
  {
    scene: 'drawing a bow at an archery target at full draw, face turned toward the camera',
    attire: 'sporty casual clothes with an arm guard',
  },
  {
    scene:
      'shaping spinning clay at a pottery wheel with clay-streaked hands, laughing toward the camera',
    attire: 'an apron over casual clothes',
  },
  {
    scene:
      'flipping a pan over a flaming burner at a cooking class station, face toward the camera',
    attire: 'a chef apron over casual clothes',
  },
  {
    scene:
      'belting the final chorus on a small karaoke stage, free arm flung wide, face toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'mid laser tag sprint through a glowing neon arena, dodging sideways, grinning at the camera',
    attire: 'casual clothes with a glowing laser tag vest',
  },
  {
    scene:
      'skipping a stone across a still lake at dusk, caught mid-release, face toward the camera',
    attire: CASUAL,
  },
  {
    scene: 'hoisting a giant stuffed prize at a carnival ring-toss booth, smiling at the camera',
    attire: CASUAL,
  },
  {
    scene:
      'rolling through a retro roller rink under a disco ball with arms out, face toward the camera',
    attire: 'a retro 70s roller disco outfit',
  },
  {
    scene:
      'flying a giant rainbow kite on a breezy hillside, spool in hand and line taut, face toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'swinging on a rope swing out over a swimming hole, at the top of the arc, laughing toward the camera',
    attire: 'bright swimwear',
  },
  {
    scene:
      'racing down a water park slide in a tube with arms up mid-splashdown, face toward the camera',
    attire: 'bright swimwear',
  },
  {
    scene:
      'gliding on a segway along a waterfront boardwalk, leaning into the turn, face toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'mid-putt on a wild neon mini golf course as the ball drops, celebrating, face toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'riding a ferris wheel at golden hour with arms stretched along the gondola rail, face toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'mid-drop in the front row of a rollercoaster with hands thrown high, face toward the camera',
    attire: CASUAL,
  },
  {
    scene:
      'driving a bumper car through a neon carnival collision, sparks of light around, laughing toward the camera',
    attire: CASUAL,
  },
  {
    scene: 'mid-roll at a skee ball lane under carnival lights, grinning at the camera',
    attire: CASUAL,
  },
  {
    scene:
      'teeing off at a driving range at sunset, club at the top of the follow-through, face toward the camera',
    attire: 'sporty casual clothes',
  },
];

(async () => {
  const args = process.argv.slice(2);
  const solo = args.includes('--solo');
  const mode = args.find((a) => a === '--append' || a === '--wipe-active') ?? '';
  const TABLE = solo ? 'single_scenarios' : 'dual_scenarios';
  const ROWSET = solo ? SOLO_ROWS : ROWS;

  // Lint EVERY row before touching the DB — abort on any violation.
  let bad = 0;
  for (const r of ROWSET) {
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
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('pool', 'active');
  if (count > 0 && mode !== '--append' && mode !== '--wipe-active') {
    console.error(`pool='active' already has ${count} rows. Use --append or --wipe-active.`);
    process.exit(1);
  }
  if (mode === '--wipe-active') {
    // SCOPED delete — active pool only (never goofy/elegant; hard rule).
    const { error } = await sb.from(TABLE).delete().eq('pool', 'active');
    if (error) {
      console.error('wipe failed:', error.message);
      process.exit(1);
    }
    console.log(`wiped ${count} active rows`);
  }

  const { error } = await sb.from(TABLE).insert(
    ROWSET.map((r) => ({
      pool: 'active',
      scene: r.scene,
      attire: r.attire,
      disabled: false,
      ...(solo ? { gender: 'any' } : {}),
    }))
  );
  if (error) {
    console.error('insert failed:', error.message);
    process.exit(1);
  }
  const { count: after } = await sb
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('pool', 'active');
  console.log(
    `✓ ${ROWSET.length} active scenarios inserted into ${TABLE} (pool total: ${after}) — all lint-green.`
  );
})();
