/**
 * YumBot bucket-aggregated SCENES production-scale helper (2026-06-07).
 *
 * Canonical pattern from feedback_production_seed_equal_share_per_subtheme:
 * for each sub-theme in a bucket, fire ONE Sonnet call (via generatePool
 * with append:true) sized to the remaining gap for that sub-theme. Dedup
 * losses stay within that sub-theme's slice — every sub-theme converges to
 * the target count regardless of cross-batch dedup behavior.
 *
 * Idempotent: re-runs after partial completion fill only what's missing.
 * Tally at the end verifies every sub-theme hit the target.
 */
const fs = require('fs');
const { generatePool } = require('./seedGenHelper');

/**
 * @param {object} opts
 * @param {string} opts.outPath  path to the scenes JSON file
 * @param {number} opts.perSubTheme  target entries per sub-theme
 * @param {Array<{ tag: string, blurb: string, example: string }>} opts.subThemes
 * @param {(subTheme: object, n: number) => string} opts.buildPrompt
 */
async function generateBucketScenes({ outPath, perSubTheme, subThemes, buildPrompt }) {
  for (const subTheme of subThemes) {
    const pool = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    const existing = pool.filter((e) => (e.tags || []).includes(subTheme.tag)).length;
    const needed = perSubTheme - existing;

    console.log(
      `\n━━━━━ ${subTheme.tag} — existing ${existing}/${perSubTheme}, need ${Math.max(0, needed)} more ━━━━━`
    );
    if (needed <= 0) {
      console.log(`  ✓ already at target, skipping`);
      continue;
    }

    await generatePool({
      outPath,
      append: true,
      total: pool.length + needed,
      batch: Math.min(needed, 50),
      metaPrompt: (n) => buildPrompt(subTheme, n),
    });

    const after = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    const afterCount = after.filter((e) => (e.tags || []).includes(subTheme.tag)).length;
    console.log(`  ✅ ${subTheme.tag} now at ${afterCount}/${perSubTheme}`);
  }

  // Final tally
  const data = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  const counts = {};
  for (const e of data) for (const t of (e.tags || [])) counts[t] = (counts[t] || 0) + 1;
  console.log('\n━━━ FINAL TALLY ━━━');
  console.log('total:', data.length);
  console.log('distribution:', JSON.stringify(counts, null, 2));
  const minCount = Math.min(...Object.values(counts));
  console.log(
    `min sub-theme count: ${minCount} — ${minCount >= perSubTheme ? 'OK ✅' : 'SHORT ❌'}`
  );
}

/**
 * Builds the standard YumBot bucket-aggregated scene Sonnet prompt
 * for ONE sub-theme. Reusable across all 8 YumBot buckets.
 */
function buildYumBotSubThemePrompt({ bucketTitle, bannedNotes, subThemeWordCount = '25-40' }) {
  return ({ tag, blurb, example }, n) => `You are writing ${n} KAWAII ${bucketTitle} SCENES for YumBot's "${tag}" sub-theme. EVERY entry in this call MUST be tagged ["${tag}"] — do not mix sub-themes.

━━━ THE SUB-THEME — ${tag} ━━━

${blurb}

━━━ THE BAR — every entry must produce ━━━

- The kawaii subject(s) for THIS sub-theme — with kawaii face features (smiling eyes / dot-blush / mouth implied).
- The setting reads instantly — anchor a load-bearing element from the sub-theme blurb above.
- A light composition hint (overhead / low hero-up / off-center / 3-quarter / etc.).
- Self-contained — readable as a scene without relying on other axes.
- DIVERSE within the sub-theme — do NOT repeat the same subject + setting combo. Use the blurb variants and stretch the semantic range.

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

Each entry is a JSON object with exactly TWO fields:
{
  "tags": ["${tag}"],
  "description": "<the scene, ${subThemeWordCount} words>"
}

━━━ EXAMPLE ━━━

${example}

━━━ HARD MANDATES ━━━

- EVERY entry tagged ["${tag}"]. NO other tags. NO untagged entries.
- EVERY entry has kawaii face features baked in.
- The setting reads instantly.
- Each "description" is ${subThemeWordCount} words.

━━━ HARD BANS ━━━

- NO photo-realistic register ("photograph" / "DSLR" / "f/2.8").
- NO mood/lighting/palette words inside the description.
- NO sub-theme blending — pure "${tag}" only.
- NO human faces / NO human characters.
- NO repeating exact subject+setting combos from prior entries — stretch the semantic range.
${bannedNotes ? '- ' + bannedNotes : ''}

━━━ OUTPUT ━━━

A JSON array of structured objects. No preamble. No numbering. Plain JSON array only.`;
}

module.exports = { generateBucketScenes, buildYumBotSubThemePrompt };
