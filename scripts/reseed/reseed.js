#!/usr/bin/env node
/* global __dirname */
/**
 * reseed.js — run one subject-pool repair from its config (the `reseed` skill, RESEED_STATUS.md).
 *
 *   node scripts/reseed/reseed.js <config> --plan                 # groups + slot plan, no LLM
 *   node scripts/reseed/reseed.js <config> --out <dir>            # dry run: proposal.json + report.json
 *   node scripts/reseed/reseed.js <config> --execute --from <dir>/proposal.json
 *   flags: --limit N · --resume <report.json> · --judge-advisory · --check-kept
 *
 * <config> = a file in scripts/reseed/pools/ without the .js, e.g.
 *   bloombot.flower_humming_birds.flower_focal_cluster
 */
const path = require('path');
const { runReseed } = require('./lib/core');

const argv = process.argv.slice(2);
const name = argv[0];
if (!name || name.startsWith('--')) {
  console.error(
    'usage: node scripts/reseed/reseed.js <pool-config> [--plan|--out <dir>|--execute --from <proposal>] …'
  );
  process.exit(1);
}
const cfg = require(path.join(__dirname, 'pools', name));
runReseed(cfg, argv.slice(1)).catch((e) => {
  console.error('ERR', e.message);
  process.exit(1);
});
