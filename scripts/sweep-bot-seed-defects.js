#!/usr/bin/env node
/**
 * sweep-bot-seed-defects.js — find seed entries that are KNOWN to render badly.
 *
 * Every family below is a lesson already paid for in BOT_SCENE_QUALITY_PLAYBOOK.md or in one of
 * Kevin's quarantine audits. The playbook's standing warning is that Sonnet RE-DERIVES every
 * banned noun at production scale, so this sweep is mandatory AFTER every scale-up, not once.
 *
 * DIAGNOSTIC ONLY. It never rewrites. A fleet-wide auto-thinner was built once
 * (dedup-spot-pools.mjs) and deliberately demoted to a flagger because both raw token frequency
 * and a Haiku judge over-flagged legitimate dominant themes and would have gutted good pools.
 * The fix path is the surgical harness (fix-earthbot-clouds.js / fix-dragonbot-human-language.js):
 * rewrite ONLY flagged entries, re-validate, retry once, then drop.
 *
 * Families are SCOPED so we do not flag correct usage: "disc" is wrong on a cloud and right on
 * the sun, "perched" is wrong on a fish and right on a bird, posture verbs are wrong in a camera
 * pool and right in an action pool.
 *
 * Usage:
 *   node scripts/sweep-bot-seed-defects.js --wired wiring.json
 *   node scripts/sweep-bot-seed-defects.js --bot tinybot -v
 *   node scripts/sweep-bot-seed-defects.js --family text_prior -v
 *   node scripts/sweep-bot-seed-defects.js --json out.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'bots');
const argv = process.argv.slice(2);
const flag = (n) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
const ONLY = flag('--bot');
const WIRED = flag('--wired');
const FAMILY = flag('--family');
const JSON_OUT = flag('--json');
const VERBOSE = argv.includes('-v') || argv.includes('--verbose');

const SKY = /(sky|cloud|atmosphere|weather|phenomen|air|celestial|aurora)/i;
const LIGHT = /(light|lighting|glow|reflection|luminous|inner_light|moonlight)/i;
const ROCK = /(rock|geolog|stone|cliff|shore|landform|terrain|canyon|mineral|basalt)/i;
const CAMERA = /(camera|framing|composition|vantage|perspective|angle|shot)/i;
const FOREST = /(forest|tree|wood|jungle|grove|canopy)/i;

const FAMILIES = [
  {
    key: 'text_prior',
    why: 'renders readable gibberish lettering (weathervane -> compass rose with N and E)',
    re: /\b(weathervane|weather vane|compass rose|sundial|coat of arms|heraldic crest|nameplate|name plate|price tag|shop sign|storefront sign|signboard|billboard|marquee|chalkboard|blackboard|menu board|printed label|lettered sign|painted sign)\b/i,
  },
  {
    key: 'rigid_object_sky',
    why: 'rigid-object nouns flip a cloud/optical phenomenon into a UFO or a solid prop',
    scope: SKY,
    re: /\b(lenticular disc|lenticular disk|saucer|stacked plates?|metallic (?:sheen|grey|silver)|hovering motionless|suspended motionless|perfectly still disc|halo ring|solid ring)\b/i,
  },
  {
    key: 'light_as_object',
    why: 'light described as a solid shape renders the shape (column of light -> literal pillar)',
    scope: LIGHT,
    re: /\b(column of (?:light|white|reflection)|pillar of (?:light|white)|bar of (?:light|white|silver)|ribbon of (?:light|white|silver)|wall of light|wedge of light|fan of (?:pale )?light|cone of light)\b/i,
  },
  {
    key: 'masonry_in_geology',
    why: 'mason vocabulary renders a brick wall, and masonry brings carved pseudo-text',
    scope: ROCK,
    re: /\b(stacked in (?:thick )?(?:horizontal )?layers|stacked courses|cut faces|keystone|dressed stone|brickwork|coursed)\b/i,
  },
  {
    key: 'posture_verb_in_camera',
    why: 'a camera entry describing the VIEWER’s posture paints a person in that posture',
    scope: CAMERA,
    re: /\b(lying (?:low|flat|down)|sprawled|kneeling|crouching|crouched|perched on|sitting on|standing (?:in|on|at)|from the saddle of)\b/i,
  },
  {
    key: 'framing_macro',
    why: 'framing-as-law entries that subordinate the hero to a body part or texture macro',
    scope: CAMERA,
    re: /\b(extreme close|close-detail|close detail|macro on|polyp macro|glow detail|gripping|knuckles|fingers (?:curled|gripping|wrapped)|dissolving entirely|body dissolv|fills the frame entirely)\b/i,
  },
  {
    key: 'simile_literalized',
    why: 'a simile or borrowed adjective renders the literal object (cloud like a whale -> a whale)',
    re: /\b(shaped like a|curling like a|like a sleeping|as a (?:jewel|gem|bead|coin)|coins of (?:light|sunlight)|feathered streak)\b/i,
  },
  {
    key: 'dullness',
    why: 'the flattest value of every axis: blank sky, bleached light, rows of identical objects',
    re: /\b(overcast sheet|clear dome|featureless (?:sheet|sky|expanse)|flat featureless|bleached (?:white|midday)|minimal shadow|a row of (?:five|six|four|equal)|a line of (?:five|six|four))\b/i,
  },
  {
    key: 'heavy_blur',
    why: 'Kevin quarantine audit 2026-09: a single object in heavy blur with nothing happening',
    bots: ['tinybot', 'toybot', 'bloombot'],
    re: /\b(extreme shallow depth|heavy blur|heavily blurred|blurred into|dissolving into bokeh|out of focus|extreme macro lens)\b/i,
  },
  {
    // brickbot is deliberately EXCLUDED: Kevin reversed the LEGO-Star-Wars ban on 2026-09-22
    // ("the fair use laws for lego and those properties is fine for now"), so pop-culture IP is in
    // scope there. This family is about knockoff-looking toys on the non-LEGO bots.
    key: 'ip_lookalike',
    why: 'Kevin quarantine audit 2026-09: toys that read as trademarked characters (brickbot exempt)',
    bots: ['toybot', 'chibibot', 'yumbot'],
    re: /\b(sackboy|mouse[- ]ear|mickey|minnie|disney|pixar|funko|pop ?mart|care bear|transformers|pokemon|hello kitty|barbie|lego star wars|x-wing|stormtrooper|mandalorian|jedi)\b/i,
  },
  {
    key: 'grim_on_cute_bot',
    why: 'Kevin quarantine audit 2026-09: dark gritty scenes on a bright-and-cute bot',
    bots: ['toybot', 'chibibot', 'yumbot', 'tinybot'],
    re: /\b(gritty|grimdark|blood|gore|corpse|rotting|decaying|menacing|sinister|nightmarish|dread)\b/i,
  },
  {
    key: 'off_genre_trope',
    why: 'Sonnet smuggles adjacent tropes in at scale; each one breaks the bot’s lane',
    bots: ['dragonbot', 'faebot', 'gothbot', 'starbot', 'mangabot'],
    re: /\b(tricorn|flintlock|musket|cutlass|treasure map|powdered wig|frock coat|pegasus|cerberus|cyclops|sphinx|revolver|pistol|cowboy)\b/i,
  },
  {
    key: 'cjk_corruption',
    why: 'stray CJK characters from Sonnet pattern-completion nudge renders East-Asian',
    re: /[　-鿿]/,
  },
  {
    key: 'human_on_nohuman_bot',
    why: 'a positive human noun out-votes any ban on a creatures-only bot',
    bots: ['tinybot', 'chibibot', 'yumbot'],
    re: /\b(a (?:man|woman|boy|girl|person)|shopkeeper|vendor|villagers?|tourists?|crowd of people|human child)\b/i,
  },
];

const ALLOW = /\b(dragonfl|saucer magnolia|solar disc|disc clears|plateau|crest of (?:the )?(?:ridge|hill|wave)|cresting)\b/i;

const textOf = (e) => {
  if (typeof e === 'string') return e;
  if (e && typeof e === 'object') return e.description || e.text || e.entry || e.scene || e.name || '';
  return String(e ?? '');
};

let wiredIndex = null;
if (WIRED) {
  const data = JSON.parse(fs.readFileSync(WIRED, 'utf8'));
  wiredIndex = new Map(data.map((r) => [r.bot, new Set(r.reachable)]));
}

const hits = [];
for (const bot of (ONLY ? [ONLY] : fs.readdirSync(ROOT)).sort()) {
  const seedDir = path.join(ROOT, bot, 'seeds');
  if (!fs.existsSync(seedDir)) continue;
  for (const f of fs.readdirSync(seedDir).sort()) {
    if (!f.endsWith('.json')) continue;
    const pool = f.replace(/\.json$/, '');
    if (wiredIndex && !(wiredIndex.get(bot) || new Set()).has(pool)) continue;
    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(seedDir, f), 'utf8'));
    } catch {
      continue;
    }
    if (!Array.isArray(data)) continue;
    data.forEach((raw, i) => {
      const t = textOf(raw);
      if (!t) return;
      for (const fam of FAMILIES) {
        if (FAMILY && fam.key !== FAMILY) continue;
        if (fam.bots && !fam.bots.includes(bot)) continue;
        if (fam.scope && !fam.scope.test(pool)) continue;
        const m = t.match(fam.re);
        if (!m) continue;
        if (ALLOW.test(m[0])) continue;
        hits.push({ bot, pool, index: i, family: fam.key, token: m[0], text: t.slice(0, 120) });
      }
    });
  }
}

const byFamily = new Map();
const byBot = new Map();
for (const h of hits) {
  byFamily.set(h.family, (byFamily.get(h.family) || 0) + 1);
  byBot.set(h.bot, (byBot.get(h.bot) || 0) + 1);
}
const pad = (s, n) => String(s).padEnd(n);
const num = (s, n) => String(s).padStart(n);

console.log('BY FAMILY');
for (const fam of FAMILIES) {
  const c = byFamily.get(fam.key) || 0;
  if (FAMILY && fam.key !== FAMILY) continue;
  console.log('  ' + pad(fam.key, 24) + num(c, 6) + '   ' + fam.why);
}
console.log('\nBY BOT');
for (const [bot, c] of [...byBot].sort((a, b) => b[1] - a[1])) console.log('  ' + pad(bot, 12) + num(c, 6));
console.log(`\nTOTAL FLAGGED ENTRIES: ${hits.length} (across ${new Set(hits.map((h) => h.bot + '/' + h.pool)).size} pools)`);

const poolCounts = new Map();
for (const h of hits) {
  const k = `${h.bot}/${h.pool}`;
  poolCounts.set(k, (poolCounts.get(k) || 0) + 1);
}
console.log('\nWORST POOLS');
for (const [k, c] of [...poolCounts].sort((a, b) => b[1] - a[1]).slice(0, 20)) console.log('  ' + num(c, 4) + '  ' + k);

if (VERBOSE) {
  console.log('\nSAMPLES (token -> entry)');
  const shown = new Map();
  for (const h of hits) {
    const n = shown.get(h.family) || 0;
    if (n >= 4) continue;
    shown.set(h.family, n + 1);
    console.log(`  [${h.family}] "${h.token}"  ${h.bot}/${h.pool}#${h.index}\n      ${h.text}…`);
  }
}
if (JSON_OUT) {
  fs.writeFileSync(JSON_OUT, JSON.stringify(hits, null, 2));
  console.log(`\nwrote ${JSON_OUT}`);
}
