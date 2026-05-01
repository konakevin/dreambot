#!/usr/bin/env node
/**
 * Two-pass-polish A/B test harness — runs N unique GothBot vampire-girls-2
 * setups, each rendered TWICE: once with normal single-pass Sonnet, once with
 * Sonnet (vivid 150-word concept) → Haiku (compressed to 65-90 word Flux
 * prompt) two-pass.
 *
 * Posts alternating so the feed shows A1, B1, A2, B2, ... for side-by-side QA.
 * Caption: "twopass-AB R<n> #<i> <SINGLE|TWOPASS>"
 *
 * Usage: node scripts/qa-twopass-ab.js
 *   AB_PATH=vampire-girls-2 (default)
 *   AB_COUNT=5 (default)
 *   AB_ROUND=1 (default)
 */

require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const https = require('https');
const {
  callClaude,
  flux,
  createPicker,
  fetchVibeDirective,
  resolveMedium,
  resolveVibe,
  postAsBot,
  lookupBotUserId,
  getSupabase,
  PRIMARY_MODEL,
  SECONDARY_MODEL,
} = require('./lib/botEngine');
const { extendBriefForConcept, buildPolishBrief } = require('./lib/twoPassPolish');
const bot = require('./bots/gothbot');

const PATH = process.env.AB_PATH || 'vampire-girls-2';
const COUNT = Number(process.env.AB_COUNT || 5);
const ROUND = Number(process.env.AB_ROUND || 1);
const FORCE_MEDIUM = process.env.AB_MEDIUM || null;  // lock medium across all setups
const FORCE_VIBE = process.env.AB_VIBE || null;      // lock vibe across all setups
const FORCE_MODEL = process.env.AB_MODEL || null;    // lock Flux model across all setups
const OUT_DIR = `/tmp/gothbot-twopass-ab-${PATH}-r${ROUND}`;

// Vampire-girls-2 mandatory anchors — preserve through Haiku compression
const VAMPIRE_PRESERVE_PHRASES = [
  'glowing',
  'radiating',
  'inhuman',
  'heavy',
  'dark smoky-eye',
  'sharp dark eyeliner',
  'blood-red',
  'corpse-pale',
  'gothic',
];

function downloadJpg(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => fileStream.close(resolve));
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function fetchMediumFluxFragment(sb, mediumKey) {
  const { data, error } = await sb
    .from('dream_mediums')
    .select('flux_fragment')
    .eq('key', mediumKey)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.flux_fragment || '';
}

async function main() {
  const sb = getSupabase();
  const userId = await lookupBotUserId(sb, bot.username);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`\n🤖 GothBot Two-Pass A/B — path=${PATH} round=${ROUND} count=${COUNT}`);
  console.log(`📁 ${OUT_DIR}\n`);

  const captionTag = `twopass-AB-${PATH} R${ROUND}`;

  for (let n = 1; n <= COUNT; n++) {
    console.log(`━━━ Setup ${n}/${COUNT} ━━━`);

    const medium = FORCE_MEDIUM || resolveMedium({ bot, path: PATH });
    const vibeKey = FORCE_VIBE || resolveVibe({ bot, medium, path: PATH });
    const vibeDirective = await fetchVibeDirective(sb, vibeKey);
    const mediumFluxFragment = await fetchMediumFluxFragment(sb, medium);
    const picker = await createPicker({ botName: bot.username, windowDays: 5, sb });

    const sharedDNA = bot.rollSharedDNA
      ? bot.rollSharedDNA({ vibeKey, medium, path: PATH, picker })
      : {};

    const brief = bot.buildBrief({
      path: PATH, sharedDNA, vibeDirective, vibeKey, medium, picker,
    });

    // Pass A — SINGLE-PASS: normal Sonnet call (65-90 word output)
    const claudeA = await callClaude({ brief, maxTokens: 400 });
    const middleA = claudeA.text;
    console.log(`  [SINGLE-PASS] Sonnet output: ${middleA.split(/\s+/).length} words`);

    // Pass B — TWO-PASS: Sonnet writes 150-word concept, Haiku compresses
    const conceptBrief = extendBriefForConcept(brief, 150);
    const claudeB1 = await callClaude({ brief: conceptBrief, maxTokens: 600 });
    const conceptB = claudeB1.text;
    console.log(`  [TWO-PASS] Sonnet concept: ${conceptB.split(/\s+/).length} words`);

    const polishBrief = buildPolishBrief({
      concept: conceptB,
      polishedWords: '65-90',
      preservePhrases: VAMPIRE_PRESERVE_PHRASES,
    });
    const claudeB2 = await callClaude({
      brief: polishBrief,
      maxTokens: 400,
      primary: SECONDARY_MODEL,  // force Haiku
      secondary: PRIMARY_MODEL,  // fall back to Sonnet if Haiku fails
    });
    const middleB = claudeB2.text;
    console.log(`  [TWO-PASS] Haiku polished: ${middleB.split(/\s+/).length} words`);

    // 6. Compose final prompts (shared prefix/style/suffix logic)
    const rawPrefix =
      (bot.promptPrefixByMedium && bot.promptPrefixByMedium[medium]) || bot.promptPrefix || '';
    const rawSuffix =
      (bot.promptSuffixByMedium && bot.promptSuffixByMedium[medium]) || bot.promptSuffix || '';
    const prefix = rawPrefix ? `${rawPrefix}, ` : '';
    const suffix = rawSuffix ? `, ${rawSuffix}` : '';
    const mediumStyle =
      bot.mediumStyles && bot.mediumStyles[medium]
        ? `${bot.mediumStyles[medium]}, `
        : mediumFluxFragment
        ? `${mediumFluxFragment}, `
        : '';

    const finalPromptA = `${prefix}${mediumStyle}${middleA}${suffix}`.replace(/\s+,/g, ',').trim();
    const finalPromptB = `${prefix}${mediumStyle}${middleB}${suffix}`.replace(/\s+,/g, ',').trim();

    // Pick model — FORCE_MODEL overrides bot's modelByPath if set
    let renderModel;
    if (FORCE_MODEL) {
      renderModel = FORCE_MODEL;
    } else {
      const modelSpec = bot.modelByPath[PATH];
      if (typeof modelSpec === 'object' && !Array.isArray(modelSpec)) {
        const entries = Object.entries(modelSpec);
        const totalW = entries.reduce((s, [, w]) => s + w, 0);
        let roll = Math.random() * totalW;
        renderModel = entries[entries.length - 1][0];
        for (const [m, w] of entries) {
          roll -= w;
          if (roll <= 0) { renderModel = m; break; }
        }
      } else {
        renderModel = modelSpec;
      }
    }

    console.log(`  vibe=${vibeKey} medium=${medium} model=${renderModel}`);

    const renderAndPost = async (label, finalPrompt) => {
      try {
        const url = await flux({ prompt: finalPrompt, aspectRatio: '9:16', model: renderModel });
        const local = `${OUT_DIR}/${String(n).padStart(2, '0')}-${label}.jpg`;
        await downloadJpg(url, local);
        const result = await postAsBot({
          sb, userId, username: bot.username, localPath: local,
          prompt: finalPrompt, vibeKey, medium,
          caption: `${captionTag} #${n} ${label}`,
        });
        console.log(`  ✅ [${label}] posted`);
      } catch (err) {
        console.error(`  ❌ [${label}] failed: ${err.message}`);
      }
    };

    await renderAndPost('SINGLE-PASS', finalPromptA);
    await renderAndPost('TWO-PASS', finalPromptB);
    console.log('');
  }

  console.log(`\n━━━ Done. Search feed for "${captionTag}". ━━━\n`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
