#!/usr/bin/env node
/**
 * Dedup SteamBot female hair_color + hairstyles pools.
 *
 * Signature = first 5 significant words (lowercased, stopwords removed).
 * Catches true near-duplicates without collapsing meaningful variations.
 *
 * Drops duplicates within each signature, saves back to disk. Counts the
 * shrink so the operator can rerun the gen script in append mode to
 * backfill to 100.
 */
const fs = require('fs');
const path = require('path');

const STOPWORDS = new Set([
  'a', 'an', 'the', 'with', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for',
  'from', 'by', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'her', 'his', 'their', 'its', 'this', 'that', 'these', 'those',
]);

function signature(entry) {
  const tokens = entry
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !STOPWORDS.has(t));
  return tokens.slice(0, 5).join('|');
}

function dedupPool(filePath, label) {
  const arr = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const seen = new Map();
  const kept = [];
  const dropped = [];
  for (const entry of arr) {
    const sig = signature(entry);
    if (seen.has(sig)) {
      dropped.push({ sig, entry, keptInstead: seen.get(sig) });
      continue;
    }
    seen.set(sig, entry);
    kept.push(entry);
  }
  fs.writeFileSync(filePath, JSON.stringify(kept, null, 2));
  console.log(`\n━━━ ${label} ━━━`);
  console.log(`  before:  ${arr.length}`);
  console.log(`  kept:    ${kept.length}`);
  console.log(`  dropped: ${dropped.length}`);
  if (dropped.length) {
    console.log(`  drops:`);
    dropped.forEach((d) => {
      console.log(`    [${d.sig.slice(0, 60)}]`);
      console.log(`      dropped: "${d.entry.slice(0, 90)}"`);
      console.log(`      kept:    "${d.keptInstead.slice(0, 90)}"`);
    });
  }
  return { before: arr.length, after: kept.length, deficit: 100 - kept.length };
}

const baseDir = path.join(__dirname, 'bots', 'steambot', 'seeds');
const colorRes = dedupPool(
  path.join(baseDir, 'steampunk_women_hair_color.json'),
  'hair_color'
);
const styleRes = dedupPool(
  path.join(baseDir, 'steampunk_women_hairstyles.json'),
  'hairstyles'
);

console.log(`\n━━━ Backfill needed ━━━`);
console.log(`  hair_color: ${colorRes.deficit} new entries needed`);
console.log(`  hairstyles: ${styleRes.deficit} new entries needed`);
