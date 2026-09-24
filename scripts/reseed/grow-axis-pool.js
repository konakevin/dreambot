#!/usr/bin/env node
/**
 * grow-axis-pool.js — grow an AXIS pool that has no surviving generator.
 *
 * Same machinery as every path generator (lib/seedGenHelper.generatePool: append mode, Sonnet
 * batches, signature dedup against the running pool), with the recipe DERIVED from the pool's own
 * existing entries: the meta-prompt shows Sonnet the whole current pool as the register to match and
 * asks for N more entries that are each a DIFFERENT value of the same axis. Nothing about the
 * originals changes; new entries are appended after them.
 *
 * Usage:
 *   node scripts/reseed/grow-axis-pool.js <bot> <pool_name> --target 100 [--slot "what this axis is"]
 *
 * --slot   one line naming the axis (e.g. "the light in a Victorian brass-and-glass conservatory");
 *          when omitted it is inferred from the pool name.
 */
const fs = require('fs');
const path = require('path');
const { generatePool } = require('../lib/seedGenHelper');

const args = process.argv.slice(2);
const bot = args[0];
const pool = args[1];
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
const TARGET = parseInt(flag('target', '100'), 10);
if (!bot || !pool) {
  console.error(
    'usage: grow-axis-pool.js <bot> <pool_name> --target N [--slot "axis description"]'
  );
  process.exit(2);
}
const outPath = path.join('scripts/bots', bot, 'seeds', pool + '.json');
const existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
const slot = flag('slot', null) || pool.replace(/^[a-z]+_/, '').replace(/_/g, ' ');

const lens = existing.map((e) => String(e).split(/\s+/).length).sort((a, b) => a - b);
const minW = lens[0],
  maxW = lens[lens.length - 1],
  medW = lens[Math.floor(lens.length / 2)];

const metaPrompt = (
  n
) => `You are extending ONE axis pool for a DreamBot image-generation path. The pool is "${pool}" on ${bot}; the axis is: ${slot}.

Below is the ENTIRE current pool. It defines the register exactly: the sentence shape, the length (${minW}-${maxW} words, median ${medW}), the level of detail, the vocabulary, what is described and what is deliberately left out. Match it precisely.

CURRENT POOL (do not repeat, rephrase, or lightly vary any of these):
${existing.map((e, i) => `${i + 1}. ${e}`).join('\n')}

Write ${n} NEW entries for this same axis. Rules:
- Each entry is a genuinely DIFFERENT value of the axis from every entry above AND from the others you write: a different condition, object, event, angle, material or moment, not the same idea in new words.
- Same register as the pool: same length band, same grammatical shape (a fragment if the pool uses fragments, a sentence if it uses sentences), same level of concreteness. No headings, no numbering inside the text, no quotation marks.
- Never open two entries with the same three words. Spread the openings.
- Positive statements only: describe what IS there. No "no ...", "never ...", "without ..." phrasing.
- No people unless the pool above already names people. No text, signage, lettering, logos or watermarks anywhere.
- Stay inside the world the pool implies; do not introduce a different setting, era or medium.

Return ONLY a JSON array of ${n} strings.`;

(async () => {
  const before = existing.length;
  await generatePool({
    outPath,
    total: TARGET,
    batch: 25,
    append: true,
    maxTokens: 8000,
    metaPrompt,
  });
  const after = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  const same = after.slice(0, before).every((e, i) => e === existing[i]);
  console.log(`${bot}/${pool}: ${before} → ${after.length} (originals byte-identical: ${same})`);
  if (!same) process.exit(1);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
