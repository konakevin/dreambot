#!/usr/bin/env node
/**
 * MangaBot camera_framing pool purge — 2026-05-29.
 *
 * Drops back-to-camera entries (over-shoulder / figure-tiny-against-world /
 * silhouette-from-behind / eyes-not-at-camera) from the 4 existing
 * camera_framing pools so future renders don't roll those framings.
 *
 * Per the audit on 2026-05-29: 102 of 800 entries (~12.75%) match the
 * back-to-camera pattern Kevin flagged. The 4 gen-script recipes have
 * also been rewritten to PURGE those framings — so re-running them with
 * `append: true` will backfill the purged slots with clean
 * forward-facing-or-profile entries instead.
 *
 * Usage:
 *   node scripts/bots/mangabot/purge-back-to-camera.js [--dry-run]
 *
 * After running, backfill via:
 *   for f in scripts/gen-seeds/mangabot/gen-{samurai,neo-tokyo,ghibli,isekai}-camera-framing.js; do
 *     node "$f"
 *   done
 */

const fs = require('fs');
const path = require('path');

// "Silhouette" by itself isn't always back-to-camera — a low-angle hero
// shot where the figure is sky-lit can be a valid forward-facing silhouette
// (think Black Panther pose). The patterns below catch the UNAMBIGUOUS
// back-to-camera cases (silhouette + doorway/threshold/crossing-valley/
// lone-warm) and leave ambiguous silhouettes for render-time judgement.
const BACK_TO_CAMERA_RX = new RegExp(
  [
    '\\bover[- ]shoulder\\b',
    '\\bover[- ]the[- ]shoulder\\b',
    '\\bback to (the )?camera\\b',
    '\\bfrom behind\\b',
    '\\bbehind the\\b',
    '\\baway from (the )?camera\\b',
    '\\bfacing away\\b',
    '\\beyes (forward not|NEVER|never) at camera\\b',
    // Silhouette + back-to-camera-defining context only
    '\\bsilhouett(e|ed)\\b.*(against|in (doorway|frame|distance)|inside (doorway|threshold)|at (cellar stairs|threshold|sanctum)|crossing (valley|plain|causeway|bridge|fog)|on (snow|frozen|valley|causeway))',
    '\\b(lone|single) (warm |faint |lonely |solitary )?silhouett(e|ed)\\b',
    // Static + back-to-camera cues
    '\\b(still|motionless|watching|crouched) (figure|samurai|swordsman|silhouette|wanderer|hero|warrior)\\b',
    '\\b(figure|samurai|swordsman) (still|motionless|watching|crouched)\\b',
    // Figure-tiny / world-as-show patterns
    '\\bfigure swallowed\\b',
    '\\ba brushstroke against\\b',
    '\\b(lone|tiny) (figure|samurai|wanderer|hero|party)\\b.*(plain|valley|distant|horizon|sky|world|causeway|reed|fog)',
    '\\bfraction of (the )?frame\\b',
    '\\bworld is the costar\\b',
    '\\bworld enormous and indifferent\\b',
    '\\bfigure (small|tiny) against\\b',
    '\\bbarely visible\\b.*(distant|far|beyond)',
    // Gazing-from-distance back-of-figure pattern
    '\\bgazing (at|across|over)\\b.*(smoldering|ruins|cavern|mirage|fantasy view|fantasy vista|distant)',
  ].join('|'),
  'i'
);

const POOLS = [
  'scripts/bots/mangabot/seeds/samurai_camera_framing.json',
  'scripts/bots/mangabot/seeds/neo_tokyo_camera_framing.json',
  'scripts/bots/mangabot/seeds/ghibli_camera_framing.json',
  'scripts/bots/mangabot/seeds/isekai_camera_framing.json',
];

function main() {
  const dryRun = process.argv.includes('--dry-run');
  const repoRoot = path.resolve(__dirname, '../../..');

  let totalKept = 0;
  let totalDropped = 0;
  for (const rel of POOLS) {
    const abs = path.join(repoRoot, rel);
    const entries = JSON.parse(fs.readFileSync(abs, 'utf8'));
    const kept = [];
    const dropped = [];
    for (const e of entries) {
      if (BACK_TO_CAMERA_RX.test(e)) dropped.push(e);
      else kept.push(e);
    }
    totalKept += kept.length;
    totalDropped += dropped.length;
    console.log(
      `${path.basename(rel, '.json')}: dropping ${dropped.length} / ${entries.length} → ${kept.length} clean entries remain`
    );
    if (dropped.length > 0) {
      console.log('  Sample dropped:');
      dropped.slice(0, 3).forEach((e, i) => console.log(`    [${i + 1}] ${e}`));
    }
    if (!dryRun) {
      // Backup before write.
      const bak = abs + `.bak-${Date.now()}`;
      fs.writeFileSync(bak, fs.readFileSync(abs));
      fs.writeFileSync(abs, JSON.stringify(kept, null, 2));
    }
  }
  console.log(
    `\n${dryRun ? '[DRY-RUN] ' : ''}TOTAL: kept ${totalKept} / dropped ${totalDropped} (of ${totalKept + totalDropped})`
  );
  if (!dryRun) {
    console.log('\nBackfill the dropped slots with the updated forward-facing recipes:');
    console.log(
      '  for f in scripts/gen-seeds/mangabot/gen-{samurai,neo-tokyo,ghibli,isekai}-camera-framing.js; do node "$f"; done'
    );
  }
}

main();
