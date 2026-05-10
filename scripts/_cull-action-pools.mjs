/**
 * Cull problematic entries from dual + single action pools.
 *
 * REJECT (face-swap-unsafe):
 *   1. ASYMMETRIC (dual): "one X, the other Y" / mixed heights / large gaps
 *   2. FACE-AWAY: looking at / watching / gazing / facing the [scenery] / pointing at
 *   3. PROFILE / SIDE: examining / studying / peering / focused-on-object
 *   4. MOTION: walking / climbing / running / leaping / scrambling / vaulting
 *   5. HEAD-DOWN: reading / tracing / sketching with head down / writing
 *
 * KEEP (face-swap-safe):
 *   - Symmetric posture (both standing / both sitting / both leaning)
 *   - Stationary
 *   - Body composed three-quarter or front to camera
 *   - No specific eye-direction calling out away from camera
 */
import fs from 'fs';

const DUAL_FILE = 'supabase/functions/_shared/pools/dual_actions.ts';
const SINGLE_FILE = 'supabase/functions/_shared/pools/single_actions.ts';

function extractPool(content, exportName) {
  const re = new RegExp(`export const ${exportName}: string\\[\\] = \\[([\\s\\S]*?)\\];`, 'm');
  const m = content.match(re);
  if (!m) return [];
  const body = m[1];
  // Match either '...' or "..." string literals on their own line (with trailing comma).
  // Walk line-by-line so we don't get tripped up by apostrophes inside double-quoted strings.
  const entries = [];
  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    // single-quoted: '...',
    let m2 = trimmed.match(/^'((?:[^'\\]|\\.)*)',?$/);
    if (m2) {
      entries.push(m2[1].replace(/\\'/g, "'"));
      continue;
    }
    // double-quoted: "...",
    m2 = trimmed.match(/^"((?:[^"\\]|\\.)*)",?$/);
    if (m2) {
      entries.push(m2[1].replace(/\\"/g, '"'));
    }
  }
  return entries;
}

function quoteEntry(s) {
  // Use single quotes if entry has no apostrophes; double quotes otherwise
  if (!s.includes("'")) return `'${s}'`;
  if (!s.includes('"')) return `"${s}"`;
  return `'${s.replace(/'/g, "\\'")}'`;
}

// ── Asymmetric (dual only) ────────────────────────────────────────────
// Only reject when HEIGHTS actually mismatch or GAP is too large.
// "one X, the other Y" pattern is FINE if both are at same level.
function isAsymmetric(e) {
  const s = e.toLowerCase();
  // Mixed heights: low-verb and high-verb in same entry
  const low = /\b(kneeling|kneels|crouching|crouched|crouches|sitting|seated|sits|squats|squatting|perched|low to the ground|on the ground|on their knees|on one knee)\b/;
  const high = /\b(standing|stands|upright|on (their |both |one )?feet|reaching up|stretching overhead|towering above|on tiptoes)\b/;
  if (low.test(s) && high.test(s)) return true;
  // Big gaps
  if (/\b(few feet (away|back)|few steps back|stepped back|several feet|safer ground|across the way|across the (room|space))\b/.test(s)) return true;
  if (/different heights?/.test(s)) return true;
  // Explicit "one above, one below" patterns
  if (/\bbehind them\b/.test(s) && /\bin front\b/.test(s)) return true;
  return false;
}

// ── Face-away / off-camera focus ───────────────────────────────────────
function isFaceAway(e) {
  const s = e.toLowerCase();
  // Eye direction explicitly away
  if (/\b(looking|gazing|peering|staring|watching|glancing) (at|toward|into|across|down|up|over|out|past|behind|away)\b/.test(s)) {
    return true;
  }
  if (/\b(watching|observing) [a-z]/.test(s)) return true;
  // Facing something off-camera
  if (/\bfacing (the |a |an |out|away|forward toward|toward the)\b/.test(s)) return true;
  // Pointing / gesturing AT something off-camera (allow pointing-at-camera/viewer)
  if (/\bpointing (at|toward|to|out|into|past|away)\b/.test(s) && !/\bpointing (at|toward) (the )?(camera|viewer|lens)\b/.test(s)) return true;
  if (/\bgesturing (at|toward|to|out|into)\b/.test(s)) return true;
  if (/\bsignaling toward\b/.test(s)) return true;
  // Head-down activities
  if (/\b(reading|sketching|writing|drawing|tracing|whittling|braiding|shelling|sorting through|crossword|deadheading|stitching|knitting|wrapping|unpacking|organizing|carving|painting|fixing|repairing|tying|untying)\b/.test(s)) {
    return true;
  }
  // Examining / studying / inspecting (head bent over object)
  if (/\b(examining|inspecting|studying|surveying|checking|consulting|inspecting|adjusting their (hat|sunglasses|sleeve|jacket|gear|bag|backpack|sock|shoe|tie|belt|watch|necklace|bracelet|earring|ring))\b/.test(s)) return true;
  // Head turned away
  if (/\bback (to|towards|turned to) the camera\b/.test(s)) return true;
  if (/\bturned away\b/.test(s)) return true;
  if (/\bbody facing away\b/.test(s)) return true;
  if (/\b(crouching|kneeling) to (examine|look|pick up|tie|adjust|sort|inspect|see|check)\b/.test(s)) return true;
  // Holding props that demand looking AT them
  if (/\b(holding|reading|consulting) a (map|book|menu|notebook|tablet|phone|device|guidebook|brochure|paper|letter)\b/.test(s)) return true;
  if (/\bcamera held\b/.test(s)) return true;
  if (/\bphotographing\b/.test(s)) return true;
  if (/\b(holding|gripping) (a |the )?(stick|branch|tool|pole|fishing rod|net|stick)\b/.test(s)) return true;
  // Activity-with-prop that pulls eyes off camera
  if (/\b(carrying|cradling|cupping|nursing) (a |the )?(small|tiny|baby)\b/.test(s)) return true;
  // Bent-over poses
  if (/\bbending (over|down|forward) (to|for|toward)\b/.test(s)) return true;
  if (/\bhunched (over|down)\b/.test(s)) return true;
  return false;
}

// ── Motion (face-swap unfriendly) ──────────────────────────────────────
function isMotion(e) {
  const s = e.toLowerCase();
  if (/\b(walking|walks|stepping|striding|hiking|jogging|running|leaping|vaulting|scrambling|climbing|scaling|rappelling|cartwheeling|somersaulting|bounding|tiptoeing|tip-toeing|hopping|side-stepping|duck-walking|army-crawling|wading|surfing|skating|sliding|crawling|spinning|twirling|pirouetting|dancing|twisting|turning)\b/.test(s)) {
    return true;
  }
  // 'rolling' is dangerous because of "rolling up sleeves" (stationary). Only catch body-roll motion.
  if (/\brolling (over|down|across|onto|out|through)\b/.test(s)) return true;
  if (/\brolling (shoulders|head|back)\b/.test(s)) return true;
  if (/\bmid-(step|stride|run|leap|jump|chomp|reach|stretch|move|action|motion|spin|turn|twist|fall|rise)\b/.test(s)) return true;
  // Movement through scene
  if (/\b(moving|navigating|traversing|crossing|approaching|departing|arriving|leaving|passing) (through|across|past|over|along|toward|into)\b/.test(s)) return true;
  // Stroll / amble / wander
  if (/\b(strolling|ambling|wandering|meandering)\b/.test(s)) return true;
  return false;
}

function categorize(e, isDual) {
  if (isDual && isAsymmetric(e)) return 'asymmetric';
  if (isFaceAway(e)) return 'face-away';
  if (isMotion(e)) return 'motion';
  return 'keep';
}

function processPool(file, pools, isDual) {
  const src = fs.readFileSync(file, 'utf8');
  const summary = {};
  const newSrc = pools.reduce((accSrc, exportName) => {
    const entries = extractPool(accSrc, exportName);
    const buckets = { keep: [], asymmetric: [], 'face-away': [], motion: [] };
    for (const e of entries) {
      buckets[categorize(e, isDual)].push(e);
    }
    summary[exportName] = {
      total: entries.length,
      kept: buckets.keep.length,
      asymmetric: buckets.asymmetric.length,
      faceAway: buckets['face-away'].length,
      motion: buckets.motion.length,
    };
    const newBody = buckets.keep.map((e) => `  ${quoteEntry(e)},`).join('\n');
    return accSrc.replace(
      new RegExp(`(export const ${exportName}: string\\[\\] = \\[)[\\s\\S]*?(\\];)`, 'm'),
      `$1\n${newBody}\n$2`
    );
  }, src);
  return { summary, newSrc };
}

const dual = processPool(DUAL_FILE, ['DUAL_ACTIONS_COMPANION', 'DUAL_ACTIONS_PARTNER'], true);
const single = processPool(SINGLE_FILE, ['CANDID_ACTIONS', 'PORTRAIT_ACTIONS'], false);

console.log('=== DUAL ===');
for (const [name, s] of Object.entries(dual.summary)) {
  console.log(`${name}: ${s.total} → ${s.kept} (asymmetric: ${s.asymmetric}, face-away: ${s.faceAway}, motion: ${s.motion})`);
}
console.log();
console.log('=== SINGLE ===');
for (const [name, s] of Object.entries(single.summary)) {
  console.log(`${name}: ${s.total} → ${s.kept} (face-away: ${s.faceAway}, motion: ${s.motion})`);
}

if (process.argv.includes('--write')) {
  fs.writeFileSync(DUAL_FILE, dual.newSrc);
  fs.writeFileSync(SINGLE_FILE, single.newSrc);
  console.log('\n✓ Pools updated');
} else {
  console.log('\n(dry-run — pass --write to apply)');
}
