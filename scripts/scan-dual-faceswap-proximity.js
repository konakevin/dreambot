#!/usr/bin/env node
/**
 * POST-SEED HOOK — dual face-swap "couple too close" scanner.
 *
 * MANDATORY after seeding/generating ANY dual-character face-swap pose/scene pool.
 * The dual face swap can only place the +1 (partner) face when the render shows
 * TWO cleanly-separated faces. When a seed poses the couple too close together
 * (cheek-to-cheek / standing close / shoulders touching / leaning into each other),
 * Flux renders the two heads adjacent or overlapping → the detector can't split
 * them (`no_dual_split`) → the pipeline degrades to a SELF-ONLY swap and the
 * partner's likeness is silently DROPPED (the "wrong female / wrong partner" bug).
 *
 * This flags every offending entry so it can be reworded to dual-swap-safe
 * positioning: keep the couple natural and side by side, but with a CLEAR GAP
 * between their FACES/HEADS (mirror the PLAYFUL pool's "a clear gap between their
 * heads" + dual_actions.ts header rule "keep heads on separate sides").
 *
 * Usage:  node scripts/scan-dual-faceswap-proximity.js
 * Exit 1 if any violations (so it can gate a seed workflow).
 */
const fs = require('fs');
const path = require('path');

// Dual face-swap pose/scene pools. Add any new dual-cast seed file here.
const POOL_DIR = path.join(__dirname, '..', 'supabase/functions/_shared/pools');
const DUAL_POOL_FILES = fs
  .readdirSync(POOL_DIR)
  .filter((f) => /^dual_.*\.ts$/.test(f))
  .map((f) => path.join(POOL_DIR, f));

// Couple-too-close phrasings that cause overlapping faces (→ no_dual_split).
const VIOLATION =
  /\b(?:standing|sitting|seated|stand|sit|perched|leaning|nestled|huddled)\s+close\b|\bclose\s+(?:together|beside|on\s+a|on\s+the|to\s+each\s+other)\b|\bshoulders?\s+(?:nearly\s+)?touching\b|\bshoulder[-\s]to[-\s]shoulder\b|\bcheek[-\s]to[-\s]cheek\b|\bcheeks?\s+touching\b|\bheads?\s+(?:close|together|touching|nearly\s+touching)\b|\bfaces?\s+(?:close|together|touching|inches\s+apart)\b|\bleaning\s+(?:in|into)\s+(?:each\s+other|one\s+another|the\s+other|close)\b|\bnuzzl|\bnestl|\bhuddl|\bpressed\s+(?:together|against\s+each\s+other)\b|\bforeheads?\s+touching\b|\btemple[-\s]to[-\s]temple\b|\barms?\s+(?:around|round)\s+(?:each\s+other|one\s+another|the\s+other)\b|\bwrapped\s+around\s+each\s+other\b|\bembrac|\bcuddl|\bhugging\b/i;

// Known false positives (proximity to an OBJECT, not the partner).
const ALLOW = /close\s+to\s+(?:a|an|the|it|its)\b|close-up|close\s+attention|\bclosed\b/i;

const violations = [];
for (const file of DUAL_POOL_FILES) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    // only string-literal entries
    if (!/^\s*['"`]/.test(line)) return;
    const stripped = line.replace(ALLOW, '');
    if (VIOLATION.test(stripped)) {
      violations.push({ file: path.basename(file), line: i + 1, text: line.trim() });
    }
  });
}

if (violations.length === 0) {
  console.log('✓ dual face-swap proximity scan: 0 violations — all couple poses are swap-safe.');
  process.exit(0);
}

console.log(
  `✗ dual face-swap proximity scan: ${violations.length} violating entr${violations.length === 1 ? 'y' : 'ies'} (couple too close → faces overlap → +1 dropped).\n` +
    `  Reword each to keep a CLEAR GAP between the two faces/heads, then re-run.\n`
);
const byFile = {};
for (const v of violations) (byFile[v.file] ??= []).push(v);
for (const [f, vs] of Object.entries(byFile)) {
  console.log(`  ${f} (${vs.length}):`);
  for (const v of vs) console.log(`    L${v.line}: ${v.text}`);
}
process.exit(1);
