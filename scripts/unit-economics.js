#!/usr/bin/env node
/**
 * unit-economics.js — what a dream actually costs us, and whether the plans clear it.
 *
 * WHY THIS EXISTS. `ai_generation_log.cost_cents` records the IMAGE MODEL only. Its own
 * header says so: it excludes the Anthropic brief, the face swap and the upscale. So every
 * "what are renders costing us" answer taken from that column alone is low — and the gap is
 * biggest on exactly the dreams we give away, because a nightly dream is a face swap and
 * carries the two largest adders.
 *
 * This prices the WHOLE pipeline per dream, then runs the plans and sparkle packs against
 * it at Apple's 15% Small Business rate.
 *
 *   node scripts/unit-economics.js
 *
 * Every per-dream input below is either measured from production (30d, excluding the QA
 * account) or a published rate. Where a number is an estimate it says so, because the
 * conclusion should never rest on a figure nobody can trace.
 */

// ── MEASURED from production: 30 days, completed, excluding the QA account ──────────
const MEASURED = {
  windowDays: 30,
  renders: 726,
  modelSpendUsd: 38.56,
  activeUsers: 25,
  lanes: {
    // renders → image-model cost only
    nightlySwap: { n: 277, model: 11.1 },
    nightlyScene: { n: 135, model: 6.16 },
    nightlyOther: { n: 18, model: 0.72 },
    create: { n: 296, model: 20.58 },
  },
  // Anthropic brief, measured from the logged text on 726 renders
  sonnetInputChars: 5482,
  sonnetOutputChars: 861,
  sonnetShare: 701 / 726, // 96.5% of renders call Sonnet
};

// ── PUBLISHED rates ────────────────────────────────────────────────────────────────
const RATES = {
  sonnetInPerMTok: 3.0, // Claude Sonnet 4.x
  sonnetOutPerMTok: 15.0,
  haikuInPerMTok: 1.0, // Claude Haiku 4.5
  haikuOutPerMTok: 5.0,
  charsPerToken: 4, // standard English approximation
};

// ── ESTIMATES, flagged as such ─────────────────────────────────────────────────────
const ESTIMATES = {
  // cdingram/face-swap measured at 8.7s median on Replicate, plus sczhou/codeformer
  // restore at ~2s. Replicate bills these by GPU-second at a rate its API does not
  // expose, so this is the repo's long-standing +$0.013 figure, consistent with ~8.7s
  // on an A100-class GPU. VERIFY against the Replicate invoice before leaning on it.
  faceSwapUsd: 0.013,
  // A short nightly bot message. Small, but it is per dream.
  haikuInTok: 500,
  haikuOutTok: 100,
};

const APPLE_CUT = 0.15; // Small Business Program

// ── Plans + packs (source of truth: constants/proPlan.ts, basicPlan.ts, sparklePacks.ts)
const PLANS = [
  { name: 'Dreamer monthly', price: 4.99, months: 1, sparkles: 0, nightlyPerMonth: 30 },
  { name: 'Dreamer yearly', price: 39.99, months: 12, sparkles: 0, nightlyPerMonth: 30 },
  { name: 'Dreamer+ monthly', price: 9.99, months: 1, sparkles: 75, nightlyPerMonth: 30 },
  { name: 'Dreamer+ yearly', price: 99.99, months: 12, sparkles: 900, nightlyPerMonth: 30 },
];
const PACKS = [
  { name: 'Impulse', sparkles: 15, price: 1.99 },
  { name: 'Starter', sparkles: 40, price: 4.99 },
  { name: 'Popular', sparkles: 90, price: 9.99 },
  { name: 'Best Value', sparkles: 200, price: 19.99 },
  { name: 'Whale', sparkles: 550, price: 49.99 },
];

// ── derive ─────────────────────────────────────────────────────────────────────────
const sonnetUsd =
  ((MEASURED.sonnetInputChars / RATES.charsPerToken) * RATES.sonnetInPerMTok) / 1e6 +
  ((MEASURED.sonnetOutputChars / RATES.charsPerToken) * RATES.sonnetOutPerMTok) / 1e6;
const sonnetPerDream = sonnetUsd * MEASURED.sonnetShare;
const haikuUsd =
  (ESTIMATES.haikuInTok * RATES.haikuInPerMTok) / 1e6 +
  (ESTIMATES.haikuOutTok * RATES.haikuOutPerMTok) / 1e6;

const laneCost = (lane, swap) => {
  const model = MEASURED.lanes[lane].model / MEASURED.lanes[lane].n;
  return model + sonnetPerDream + haikuUsd + (swap ? ESTIMATES.faceSwapUsd : 0);
};
const nightlySwapCost = laneCost('nightlySwap', true);
const nightlySceneCost = laneCost('nightlyScene', false);
// Nightly blend across how the two actually occur in production.
const nSwap = MEASURED.lanes.nightlySwap.n;
const nScene = MEASURED.lanes.nightlyScene.n;
const nightlyBlended = (nightlySwapCost * nSwap + nightlySceneCost * nScene) / (nSwap + nScene);
// A CREATE dream: image model + brief, plus the swap on the share that uses one.
const createSwapShare = 0.5; // conservative: half of Create dreams cast a face
const createCost =
  MEASURED.lanes.create.model / MEASURED.lanes.create.n +
  sonnetPerDream +
  ESTIMATES.faceSwapUsd * createSwapShare;

/**
 * WHAT ONE SPARKLE COSTS US — per sparkle CHARGED, not per render.
 *
 * The distinction is the whole ballgame and getting it wrong inverts the answer. A
 * pricier model does not eat margin, because it CHARGES MORE SPARKLES:
 * gemini-3-image-preview costs us $0.130 but bills 5 sparkles ($0.026/sparkle), while
 * flux-1.1-pro costs $0.040 and bills 1 ($0.040/sparkle). Dividing total cost by render
 * COUNT prices every dream as though it were a 1-sparkle dream and overstates the true
 * figure by ~2.4x — which is enough to make the Whale pack look like it loses money.
 *
 * So: sum the real cost, sum the sparkles actually billed for it, divide.
 * Model→sparkle mapping is MODEL_SPARKLE_COSTS in _shared/modelPricing.ts.
 */
const CREATE_MIX = [
  // model, renders, model cost each, sparkles charged
  ['flux-1.1-pro', 158, 0.04, 1],
  ['gemini-3-image-preview', 93, 0.13, 5],
  ['gpt-image-1', 10, 0.07, 3],
  ['seedream-4', 9, 0.03, 1],
  ['flux-2-flex', 9, 0.06, 2],
  ['flux-2-pro', 7, 0.03, 1],
  ['gemini-2-image', 7, 0.04, 1],
  ['flux-2-max', 2, 0.07, 3],
  ['flux-2-dev', 1, 0.03, 1],
];
const adderPerCreate = sonnetPerDream + ESTIMATES.faceSwapUsd * createSwapShare;
const sparklesCharged = CREATE_MIX.reduce((s, [, n, , sp]) => s + n * sp, 0);
const createTrueCost = CREATE_MIX.reduce((s, [, n, c]) => s + n * (c + adderPerCreate), 0);
const costPerSparkle = createTrueCost / sparklesCharged;

const money = (n) => (n < 0 ? '-$' : '$') + Math.abs(n).toFixed(2);
const pct = (n) => (n * 100).toFixed(0) + '%';
const pad = (s, n) => String(s).padEnd(n);

console.log('\n════ WHAT A DREAM COSTS US ════\n');
console.log('  per-call components (measured unless marked):');
console.log(`    Sonnet brief            $${sonnetUsd.toFixed(4)}  (${MEASURED.sonnetInputChars} in / ${MEASURED.sonnetOutputChars} out chars, measured)`);
console.log(`    × ${pct(MEASURED.sonnetShare)} of dreams        $${sonnetPerDream.toFixed(4)}`);
console.log(`    Haiku message           $${haikuUsd.toFixed(4)}  (ESTIMATE)`);
console.log(`    face swap               $${ESTIMATES.faceSwapUsd.toFixed(4)}  (ESTIMATE — 8.7s cdingram + ~2s codeformer)`);
console.log('');
console.log('  per dream, all-in:');
console.log(`    nightly w/ face swap    $${nightlySwapCost.toFixed(4)}   (model $${(MEASURED.lanes.nightlySwap.model / nSwap).toFixed(4)} + $${(nightlySwapCost - MEASURED.lanes.nightlySwap.model / nSwap).toFixed(4)} of other APIs)`);
console.log(`    nightly pure scene      $${nightlySceneCost.toFixed(4)}`);
console.log(`    nightly BLENDED         $${nightlyBlended.toFixed(4)}   ← what a free nightly actually costs`);
console.log(`    create dream            $${createCost.toFixed(4)}  ·  per SPARKLE charged $${costPerSparkle.toFixed(4)}`);
console.log('');
const loggedTotal = MEASURED.modelSpendUsd;
const trueNightly = nightlyBlended * (nSwap + nScene + MEASURED.lanes.nightlyOther.n);
const trueCreate = createTrueCost;
console.log(`  30-day production spend: logged ${money(loggedTotal)} (models only) → TRUE ${money(trueNightly + trueCreate)}`);
console.log(`    the log understates by ${pct((trueNightly + trueCreate) / loggedTotal - 1)} because it counts only the image model`);

console.log('\n════ PLANS, AT APPLE 15% ════\n');
console.log(`  ${pad('plan', 18)}${pad('price', 9)}${pad('net', 9)}${pad('nightly cost', 14)}${pad('sparkle cost', 14)}${pad('profit', 10)}margin`);
for (const p of PLANS) {
  const net = p.price * (1 - APPLE_CUT);
  const nightly = nightlyBlended * p.nightlyPerMonth * p.months;
  const spark = p.sparkles * costPerSparkle;
  const profit = net - nightly - spark;
  console.log(
    `  ${pad(p.name, 18)}${pad(money(p.price), 9)}${pad(money(net), 9)}${pad(money(nightly), 14)}${pad(money(spark), 14)}${pad(money(profit), 10)}${pct(profit / net)}`
  );
}
console.log('\n  (worst case: every bundled sparkle spent AND all 30 nightly dreams taken)');

console.log('\n════ SPARKLE PACKS, AT APPLE 15% ════\n');
console.log(`  ${pad('pack', 13)}${pad('price', 9)}${pad('net', 9)}${pad('cost if all spent', 19)}${pad('profit', 10)}margin`);
for (const k of PACKS) {
  const net = k.price * (1 - APPLE_CUT);
  const cost = k.sparkles * costPerSparkle;
  const profit = net - cost;
  console.log(
    `  ${pad(k.name, 13)}${pad(money(k.price), 9)}${pad(money(net), 9)}${pad(money(cost), 19)}${pad(money(profit), 10)}${pct(profit / net)}`
  );
}

console.log('\n════ THE WHOLE BUSINESS, 30 DAYS ════\n');
const trueSpend = trueNightly + trueCreate;
console.log(`  ${MEASURED.activeUsers} active users · ${MEASURED.renders} renders · TRUE cost ${money(trueSpend)}`);
console.log(`  per active user: ${money(trueSpend / MEASURED.activeUsers)}/month`);
console.log('');
console.log('  Break-even subscribers needed to cover that spend:');
for (const p of PLANS.filter((x) => x.months === 1)) {
  const net = p.price * (1 - APPLE_CUT);
  const nightly = nightlyBlended * p.nightlyPerMonth;
  const spark = p.sparkles * costPerSparkle;
  const profit = net - nightly - spark;
  console.log(`    ${pad(p.name, 18)} ${money(profit)}/mo profit each → ${Math.ceil(trueSpend / profit)} subscribers`);
}
// ── where the business actually stands today ───────────────────────────────────────
const PAYING_PRO = 7; // measured: pro_subscription active + unexpired
const PAYING_BASIC = 0;
const netRevenue = PAYING_PRO * 9.99 * (1 - APPLE_CUT) + PAYING_BASIC * 4.99 * (1 - APPLE_CUT);
console.log('\n  TODAY, on the measured month:');
console.log(`    net subscription revenue   ${money(netRevenue)}   (${PAYING_PRO} Dreamer+, ${PAYING_BASIC} Dreamer, after Apple 15%)`);
console.log(`    variable render cost       ${money(trueSpend)}   (ALL ${MEASURED.activeUsers} active users, incl. the ${MEASURED.activeUsers - PAYING_PRO - PAYING_BASIC} not paying)`);
console.log(`    → variable margin          ${money(netRevenue - trueSpend)}`);
console.log('');
console.log('    Sparkle-pack revenue is NOT counted above — any is upside on top.');
console.log('    The thin number is subscriber COUNT, not unit economics: every plan and');
console.log(`    pack clears its cost comfortably. ${Math.ceil(trueSpend / ((9.99 * (1 - APPLE_CUT)) - nightlyBlended * 30 - 75 * costPerSparkle))} Dreamer+ subscribers covers the whole bill.`);

console.log('\n  NOT included: fixed infra (Supabase compute, Fly face-swap machine, Vercel,');
console.log('  Expo). Those are flat monthly costs that do not scale per dream, and at this');
console.log('  volume they almost certainly exceed the variable cost above.');

// ── SCENARIO: what if every nightly recipient paid for Dreamer? ────────────────────
/**
 * The question this answers (Kevin): if EVERY user who received a nightly dream were a
 * paying Dreamer at $4.99, does the revenue cover ALL the AI we spend on them — image
 * models and every other model call?
 *
 * Measured population, same 30-day window, QA account excluded.
 */
const AUDIT = {
  users: 21, // distinct users who received >=1 nightly dream
  nightlySwap: { n: 277, model: 11.1 },
  nightlyNoSwap: { n: 153, model: 6.88 }, // 17.98 total nightly - 11.10 swap
  create: { n: 271, model: 19.23 }, // the SAME users' Create dreams
};
const auditNightlyCost =
  AUDIT.nightlySwap.n *
    (AUDIT.nightlySwap.model / AUDIT.nightlySwap.n + sonnetPerDream + haikuUsd + ESTIMATES.faceSwapUsd) +
  AUDIT.nightlyNoSwap.n *
    (AUDIT.nightlyNoSwap.model / AUDIT.nightlyNoSwap.n + sonnetPerDream + haikuUsd);
const auditCreateCost =
  AUDIT.create.n * (AUDIT.create.model / AUDIT.create.n + sonnetPerDream + ESTIMATES.faceSwapUsd * createSwapShare);
const auditGross = AUDIT.users * 4.99;
const auditNet = auditGross * (1 - APPLE_CUT);

console.log('\n════ AUDIT: every nightly recipient on Dreamer ($4.99) ════\n');
console.log(`  ${AUDIT.users} users received a nightly dream in the window.\n`);
console.log(`  REVENUE   ${AUDIT.users} × $4.99                 ${money(auditGross)}`);
console.log(`            less Apple 15%                  -${money(auditGross - auditNet)}`);
console.log(`            net                             ${money(auditNet)}`);
console.log('');
console.log(`  AI COST   nightly, face swap (${AUDIT.nightlySwap.n})       ${money(AUDIT.nightlySwap.n * (AUDIT.nightlySwap.model / AUDIT.nightlySwap.n + sonnetPerDream + haikuUsd + ESTIMATES.faceSwapUsd))}`);
console.log(`            nightly, no swap   (${AUDIT.nightlyNoSwap.n})       ${money(AUDIT.nightlyNoSwap.n * (AUDIT.nightlyNoSwap.model / AUDIT.nightlyNoSwap.n + sonnetPerDream + haikuUsd))}`);
console.log(`            nightly subtotal                ${money(auditNightlyCost)}`);
console.log(`            their Create dreams (${AUDIT.create.n})      ${money(auditCreateCost)}`);
console.log(`            ALL AI                          ${money(auditNightlyCost + auditCreateCost)}`);
console.log('');
console.log(`  ► PROFIT, nightly cost only              ${money(auditNet - auditNightlyCost)}   (${pct((auditNet - auditNightlyCost) / auditNet)} margin)`);
console.log(`  ► PROFIT, ALL AI incl. their Create      ${money(auditNet - auditNightlyCost - auditCreateCost)}   (${pct((auditNet - auditNightlyCost - auditCreateCost) / auditNet)} margin)`);
console.log('');
console.log('  The second line is deliberately harsh: Dreamer bundles ZERO sparkles, so');
console.log('  those Create dreams were paid for with purchased sparkles whose revenue is');
console.log('  NOT counted here. Real margin sits at or above the upper line.');
console.log(`  Break-even is ${Math.ceil((auditNightlyCost + auditCreateCost) / (4.99 * (1 - APPLE_CUT)))} Dreamer subscribers against this month's entire AI bill.\n`);
