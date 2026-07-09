#!/usr/bin/env node
/**
 * Production scale-up for the four ACTIVE pools (ACTION_POSE_EXPANSION_PLAN.md,
 * owner: "scale all 4 pools up to production").
 *
 * - dual/solo ACTIVE SCENARIOS → dual_scenarios / single_scenarios rows
 *   (pool='active'), appended to the proven MVP rows. One Sonnet call per
 *   sub-theme (equal-share hard rule), ban-list dedup across batches, EVERY
 *   entry passes the active-pool lint before insert, per-sub-theme tally
 *   printed at the end.
 * - dual/solo ACTIVE POSES → JSON at scripts/out/active-poses-{dual,solo}.json
 *   (per QA'd family, biome tags fixed per family). Poses live in code, so
 *   the JSON is injected into the *_active.ts arrays in a follow-up step,
 *   then scanner + tsc + deploy.
 *
 * Usage: node scripts/generate-active-pools.js [--dry]
 */

require('dotenv').config({ path: '/Users/kevinmchenry/Development/apps/dreambot/.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');
const { SONNET } = require('./lib/models');
const { lintActivePoseEntry } = require('./lib/posePoolLint');

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const DRY = process.argv.includes('--dry');

// ── scenario sub-themes (equal share: 25 each × 10 = 250 target per table) ──
const SCENARIO_THEMES = [
  {
    key: 'carnival_rides',
    desc: 'carnival / theme-park rides and midway fun — coasters, bumper cars, ferris wheels, log flumes, fun houses, carnival games',
  },
  {
    key: 'water_action',
    desc: 'water fun — jet skis, paddleboards, water park slides, banana boats, snorkeling at the surface, splash fights, tubing behind a boat',
  },
  {
    key: 'winter_action',
    desc: 'snow and ice fun — skiing, sledding, snowball fights, ice rinks, snow tubing, building snow forts, dog sledding',
  },
  {
    key: 'wheels_racing',
    desc: 'wheels and speed — go-karts, bikes, rollerblades, skateboards, scooters, segways, soapbox derby, drift trikes',
  },
  {
    key: 'arcade_games',
    desc: 'arcades and game halls — dance machines, skee ball, air hockey, claw machines, VR headsets pushed up on the head, pinball, retro arcades',
  },
  {
    key: 'sports_courts',
    desc: 'casual sports — basketball, mini golf, batting cages, bowling, tennis rallies, archery ranges, driving ranges, cornhole, ping pong',
  },
  {
    key: 'adventure_aerial',
    desc: 'adventure and height — ziplines, ropes courses, climbing walls, hot air balloons, giant swings, bungee trampolines, via ferrata',
  },
  {
    key: 'craft_class',
    desc: 'hands-on classes — pottery wheels, cooking classes, paint studios, glassblowing (observing the glow), flower arranging, cocktail classes',
  },
  {
    key: 'performance_dance',
    desc: 'performance energy — karaoke stages, swing/salsa dancing, drumming circles, DJ decks, air guitar, street dance circles',
  },
  {
    key: 'backyard_play',
    desc: 'backyard and park play — water balloon tosses, giant jenga, sack races, slip-n-slides, frisbee, kite flying, rope swings, trampolines',
  },
];

// ── pose families (biomes FIXED per family — only the QA'd families) ────────
const COASTAL = ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'];
const POSE_FAMILIES = [
  {
    key: 'coastal_water',
    biomes: COASTAL,
    n: 8,
    desc: 'beach and surf action — surfing, paddleboarding, splashing in waves, beach sprinting, boogie boards, beach volleyball serves',
  },
  {
    key: 'jetski_boats',
    biomes: [...COASTAL, 'fjord_coastal'],
    n: 6,
    desc: 'powered watercraft — jet skis, small sailboats, motorboat bows, banana boats',
  },
  {
    key: 'snow',
    biomes: ['alpine_mountain', 'arctic_polar'],
    n: 8,
    desc: 'snow sports — skiing, snowboarding, sledding, snowball throws, ice skating, snowshoeing',
  },
  {
    key: 'river_lake',
    biomes: ['fjord_coastal', 'wetland_jungle', 'temperate_forest', 'alpine_mountain'],
    n: 6,
    desc: 'river and lake — kayaks, canoes, stepping stones, rope swings over water, dock jumping',
  },
  {
    key: 'urban_wheels',
    biomes: ['urban_city', ...COASTAL],
    n: 8,
    desc: 'city motion — bikes, rollerblades, skateboards, scooters, running stairs, basketball, street workouts',
  },
  {
    key: 'dance',
    biomes: ['urban_city', 'interior_intimate', 'mediterranean_coastal'],
    n: 6,
    desc: "dance — swing spins, salsa turns, disco moves, twirls under a raised arm (always at arm's length, never cheek to cheek)",
  },
  {
    key: 'interior_play',
    biomes: ['interior_intimate'],
    n: 6,
    desc: 'indoor fun — kitchen cooking action, karaoke, pillow forts, board game victories, painting',
  },
  {
    key: 'trail_ride',
    biomes: ['grassland_savanna', 'temperate_forest', 'desert_arid'],
    n: 6,
    desc: 'trail and open country — horseback riding, trail running, creek hopping, meadow sprints',
  },
  {
    key: 'universal',
    biomes: null,
    n: 6,
    desc: 'anywhere — jumps, spins, high fives, cartwheel energy, celebration leaps',
  },
];

const norm = (t) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

async function sonnetJson(prompt, maxTokens = 4000) {
  const msg = await client.messages.create({
    model: SONNET,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  });
  let text = msg.content[0].text
    .trim()
    .replace(/^```(json)?/i, '')
    .replace(/```$/, '')
    .trim();
  try {
    return JSON.parse(text);
  } catch {
    const m = text.match(/\[[\s\S]*\]/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {
        return [];
      }
    }
    return [];
  }
}

const SHARED_RULES = (who) => `
HARD RULES (a render is rejected if violated — this is a FACE-SWAP ${who} photo, big clear camera-facing face(s) required):
- ${who === 'couple' ? 'BOTH people' : 'The person'} mid-ACTION — verbs, motion, energy. Never posed standing still.
- ${who === 'couple' ? "EVERY entry must include an explicit face phrase like 'both faces toward the camera' / 'both grinning at the camera' / 'both laughing toward the camera'." : "EVERY entry must include an explicit face phrase like 'face toward the camera' / 'grinning at the camera' / 'laughing toward the camera'."}
- ${who === 'couple' ? "The two keep clear SEPARATION — name it ('a lane apart', 'a step apart', 'side by side with a gap'). NEVER cheek-to-cheek, embracing, arms around each other, heads close/touching, or pressed together." : 'The face stays unobstructed.'}
- NO reaching back / pulling someone up. NO clouds of flour/dust/snow/spray at face height. NO helmets, masks, goggles over eyes, or anything covering the face.
- No other prominent people in frame. No children. Tasteful.
- Vary settings and specifics across entries — minimal overlap.`;

async function genScenarios(table, who, tally) {
  const existing = await sb.from(table).select('scene').eq('pool', 'active');
  const seen = new Set((existing.data ?? []).map((r) => norm(r.scene)));
  const rows = [];
  for (const theme of SCENARIO_THEMES) {
    const ban = [...seen].slice(-40).join(' | ');
    const parsed =
      await sonnetJson(`Generate 27 DISTINCT ${who} ACTION-photo scenarios for an AI dream-photo app. CATEGORY: ${theme.desc}

Output ONLY a JSON array of 27 objects, each: {"scene": "...", "attire": "..."}
- scene: 12-24 words — the place + the mid-action moment ${who === 'couple' ? '+ the separation phrase + the both-faces phrase' : '+ the face phrase'}.
- attire: 4-12 words of activity-appropriate clothing (never face-covering gear).
${SHARED_RULES(who)}
${ban ? `\nDo NOT repeat or closely echo: ${ban}` : ''}

Output ONLY the JSON array.`);
    let kept = 0;
    for (const r of parsed) {
      if (!r?.scene || !r?.attire) continue;
      if (seen.has(norm(r.scene))) continue;
      if (lintActivePoseEntry(r.scene).length) continue;
      seen.add(norm(r.scene));
      rows.push({
        pool: 'active',
        scene: r.scene,
        attire: r.attire,
        disabled: false,
        ...(table === 'single_scenarios' ? { gender: 'any' } : {}),
        _theme: theme.key,
      });
      kept++;
      if (kept >= 25) break;
    }
    tally[`${table}:${theme.key}`] = kept;
    console.log(`  ${table} ${theme.key}: ${kept}/25 kept (of ${parsed.length} generated)`);
  }
  if (!DRY && rows.length) {
    const clean = rows.map(({ _theme, ...r }) => r);
    for (let i = 0; i < clean.length; i += 100) {
      const { error } = await sb.from(table).insert(clean.slice(i, i + 100));
      if (error) throw new Error(`${table} insert: ${error.message}`);
    }
  }
  return rows.length;
}

async function genPoses(who, families, tally) {
  const out = [];
  for (const fam of families) {
    const parsed =
      await sonnetJson(`Generate ${fam.n + 3} DISTINCT ${who} ACTION POSES (body language only — no location/scenery, the scene is supplied elsewhere) for an AI dream-photo app. CATEGORY: ${fam.desc}

Output ONLY a JSON array of ${fam.n + 3} strings, each 12-24 words describing the mid-action BODY pose${who === 'couple' ? " of the two people, with an explicit separation phrase (like 'a lane apart' / 'a step apart'), and ENDING with exactly one of: 'both faces toward the camera' / 'both grinning at the camera' / 'both laughing toward the camera'" : ", ENDING with exactly one of: 'face toward the camera' / 'grinning at the camera' / 'laughing toward the camera'"}.
${SHARED_RULES(who)}

Output ONLY the JSON array of strings.`);
    let kept = 0;
    const famOut = [];
    for (const t of parsed) {
      if (typeof t !== 'string') continue;
      if (lintActivePoseEntry(t).length) continue;
      if (out.some((e) => norm(e.text) === norm(t))) continue;
      famOut.push({ text: t, ...(fam.biomes ? { biomes: fam.biomes } : {}) });
      kept++;
      if (kept >= fam.n) break;
    }
    out.push(...famOut);
    tally[`poses_${who}:${fam.key}`] = kept;
    console.log(
      `  poses(${who}) ${fam.key}: ${kept}/${fam.n} kept (of ${parsed.length} generated)`
    );
  }
  return out;
}

(async () => {
  const tally = {};
  fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  const only = (k) =>
    process.argv.includes(`--${k}`) ||
    !process.argv.some((a) => a.startsWith('--') && a !== '--dry');

  let d = 0,
    s = 0,
    dp = [],
    sp = [];
  if (only('scenarios')) {
    console.log('— dual active scenarios');
    d = await genScenarios('dual_scenarios', 'couple', tally);
    console.log('— solo active scenarios');
    s = await genScenarios('single_scenarios', 'solo', tally);
  }
  if (only('dual-poses')) {
    console.log('— dual active poses');
    dp = await genPoses('couple', POSE_FAMILIES, tally);
    fs.writeFileSync(
      path.join(__dirname, 'out', 'active-poses-dual.json'),
      JSON.stringify(dp, null, 2)
    );
  }
  if (only('solo-poses')) {
    console.log('— solo active poses');
    sp = await genPoses('solo', POSE_FAMILIES, tally);
    fs.writeFileSync(
      path.join(__dirname, 'out', 'active-poses-solo.json'),
      JSON.stringify(sp, null, 2)
    );
  }

  console.log('\n=== TALLY (equal-share check) ===');
  for (const [k, v] of Object.entries(tally)) console.log(' ', k.padEnd(40), v);
  console.log(
    `scenario rows inserted: dual +${d}, solo +${s}${DRY ? ' (DRY — nothing inserted)' : ''}`
  );
  console.log(`pose entries written to scripts/out/: dual ${dp.length}, solo ${sp.length}`);
})();
