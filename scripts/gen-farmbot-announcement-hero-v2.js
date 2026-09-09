#!/usr/bin/env node
/**
 * v2 — the original gen-farmbot-announcement-hero.js referenced paths from
 * the OLD discarded 22-path roster (farmhouse-garden/red-barn/crop-fields/
 * orchard/duck-pond/market-town-square — none of these exist in
 * bot.pathBuilders anymore) and a 6-entry hand-picked look list that
 * predates the current 5-entry FARMBOT_LOOK_REGISTER. Rewritten against the
 * CURRENT roster + current look register + the current locked model
 * (flux-2-flex only, matching index.js's allowedModels — the old script
 * used flux-1.1-pro-ultra, no longer in FarmBot's approved model list).
 *
 * 5 concepts spanning the now much bigger world (classic village warmth +
 * the new tropical corner), each forced through a different current
 * look-register entry so Kevin gets real stylistic variety to pick from,
 * same as the original 6-concept vote. 4:3 to match AnnouncementSheet's
 * hero box. NOT posted to the feed — saved locally only.
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { flux, callClaude, download } = require('./lib/botEngine');
const bot = require('./bots/farmbot');
const pools = require('./bots/farmbot/pools');

const OUT_DIR = path.join('/tmp', 'farmbot-announcement-hero-v2');
fs.mkdirSync(OUT_DIR, { recursive: true });

const LOOKS = pools.FARMBOT_LOOK_REGISTER;

const CONCEPTS = [
  { name: '01-autumn-village-market', path: 'autumn-village-market', look: LOOKS[0] },
  { name: '02-harvest-festival', path: 'harvest-festival', look: LOOKS[1] },
  { name: '03-pineapple-field-afternoon', path: 'pineapple-field-afternoon', look: LOOKS[2] },
  { name: '04-orchard-afternoon', path: 'orchard-afternoon', look: LOOKS[3] },
  { name: '05-village-street-wandering', path: 'village-street-wandering', look: LOOKS[4] },
];

async function main() {
  for (const c of CONCEPTS) {
    console.log(`\n=== ${c.name} (path: ${c.path}) ===`);
    try {
      const usedByAxis = {};
      const picker = {
        pickWithRecency: (arr, axisKey) => {
          if (!usedByAxis[axisKey]) usedByAxis[axisKey] = new Set();
          const used = usedByAxis[axisKey];
          let avail = arr.filter((_, i) => !used.has(i));
          if (avail.length === 0) {
            used.clear();
            avail = arr;
          }
          const idx = Math.floor(Math.random() * arr.length);
          used.add(idx);
          return arr[idx];
        },
      };
      const brief = bot.buildBrief({
        path: c.path,
        sharedDNA: { lookRegister: c.look },
        vibeDirective: 'cozy',
        vibeKey: 'cozy',
        picker,
      });
      const { text: middle } = await callClaude({ brief, maxTokens: 400 });
      const finalPrompt = `cozy farm scene, ${bot.mediumStyles.farmbot_cozy_neutral}, ${middle}, ${bot.promptSuffixByMedium.farmbot_cozy_neutral}`;
      const url = await flux({
        prompt: finalPrompt,
        aspectRatio: '4:3',
        model: 'black-forest-labs/flux-2-flex',
      });
      const dest = path.join(OUT_DIR, `${c.name}.jpg`);
      await download(url, dest);
      console.log(`  saved: ${dest}`);
    } catch (e) {
      console.error(`  FAILED (${c.name}):`, e.message);
    }
  }
  console.log('\nDone — concepts saved to', OUT_DIR);
}

main().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});
