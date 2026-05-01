#!/usr/bin/env node
/**
 * One-off harness — vampire-girls-2 with BOTH chaos layer + two-pass Haiku
 * polish active. Runs 5 renders and posts to feed.
 *
 * Pipeline per render:
 *   1. Roll axes (medium / vibe / pool picks)
 *   2. Build brief
 *   3. Roll chaos profile (force enabled, vampire-girls-2 ignored from skipPaths)
 *   4. Append chaos block to brief
 *   5. Sonnet pass 1 — vivid 150-word concept (extended brief)
 *   6. Haiku pass 2 — compress to 65-90 words preserving anchors
 *   7. Wrap with prefix/style/suffix
 *   8. Flux render + post
 *
 * Caption: "vampire-both R<n> #<i>"
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
const { rollChaos, buildChaosBriefBlock } = require('./lib/chaosLayer');
const { extendBriefForConcept, buildPolishBrief } = require('./lib/twoPassPolish');
const bot = require('./bots/gothbot');

const PATH = 'vampire-girls-2';
const COUNT = Number(process.env.COUNT || 5);
const ROUND = Number(process.env.ROUND || 1);
const SKIP_POLISH = process.env.SKIP_POLISH === '1';  // chaos-only mode
const SKIP_CHAOS = process.env.SKIP_CHAOS === '1';    // polish-only mode
const OUT_DIR = `/tmp/gothbot-both-${PATH}-r${ROUND}`;

const VAMPIRE_PRESERVE_PHRASES = [
  'glowing', 'radiating', 'inhuman',
  'heavy', 'dark smoky-eye', 'sharp dark eyeliner',
  'blood-red', 'corpse-pale', 'gothic',
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
  const { data } = await sb.from('dream_mediums').select('flux_fragment').eq('key', mediumKey).maybeSingle();
  return data?.flux_fragment || '';
}

async function main() {
  const sb = getSupabase();
  const userId = await lookupBotUserId(sb, bot.username);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`\n🤖 vampire-girls-2 BOTH (chaos + two-pass) — round ${ROUND}, count ${COUNT}\n`);

  for (let n = 1; n <= COUNT; n++) {
    console.log(`━━━ Render ${n}/${COUNT} ━━━`);

    const medium = resolveMedium({ bot, path: PATH });
    const vibeKey = resolveVibe({ bot, medium, path: PATH });
    const vibeDirective = await fetchVibeDirective(sb, vibeKey);
    const mediumFluxFragment = await fetchMediumFluxFragment(sb, medium);
    const picker = await createPicker({ botName: bot.username, windowDays: 5, sb });
    const sharedDNA = bot.rollSharedDNA
      ? bot.rollSharedDNA({ vibeKey, medium, path: PATH, picker })
      : {};

    let brief = bot.buildBrief({ path: PATH, sharedDNA, vibeDirective, vibeKey, medium, picker });

    // 1. CHAOS — force enabled regardless of bot.chaos.skipPaths (unless SKIP_CHAOS)
    if (!SKIP_CHAOS) {
      const chaosProfile = rollChaos({
        path: PATH,
        botChaos: { enabled: true, skipPaths: [] },
        allowSubjectChaos: false,
      });
      const chaosBlock = buildChaosBriefBlock(chaosProfile);
      if (chaosBlock) {
        brief = brief + chaosBlock;
        console.log(`  🌀 chaos: ${chaosProfile.channelKey} (intensity=${chaosProfile.intensity.toFixed(2)})`);
      } else {
        console.log(`  🌀 chaos: skipped (rolled below threshold)`);
      }
    } else {
      console.log(`  🌀 chaos: SKIPPED (SKIP_CHAOS=1)`);
    }

    // 2-3. Sonnet → Haiku two-pass (or single Sonnet if SKIP_POLISH)
    let middle;
    if (SKIP_POLISH) {
      const sonnet = await callClaude({ brief, maxTokens: 400 });
      middle = sonnet.text;
      console.log(`  ✏️  single-pass Sonnet: ${middle.split(/\s+/).length} words`);
    } else {
      const conceptBrief = extendBriefForConcept(brief, 150);
      const sonnet = await callClaude({ brief: conceptBrief, maxTokens: 600 });
      const concept = sonnet.text;
      console.log(`  📝 concept: ${concept.split(/\s+/).length} words`);

      const polishBrief = buildPolishBrief({
        concept,
        polishedWords: '65-90',
        preservePhrases: VAMPIRE_PRESERVE_PHRASES,
      });
      const haiku = await callClaude({
        brief: polishBrief,
        maxTokens: 400,
        primary: SECONDARY_MODEL,
        secondary: PRIMARY_MODEL,
      });
      middle = haiku.text;
      console.log(`  ✂️  polished: ${middle.split(/\s+/).length} words`);
    }

    // 4. Compose final prompt
    const rawPrefix = (bot.promptPrefixByMedium && bot.promptPrefixByMedium[medium]) || bot.promptPrefix || '';
    const rawSuffix = (bot.promptSuffixByMedium && bot.promptSuffixByMedium[medium]) || bot.promptSuffix || '';
    const prefix = rawPrefix ? `${rawPrefix}, ` : '';
    const suffix = rawSuffix ? `, ${rawSuffix}` : '';
    const mediumStyle = bot.mediumStyles && bot.mediumStyles[medium]
      ? `${bot.mediumStyles[medium]}, `
      : (mediumFluxFragment ? `${mediumFluxFragment}, ` : '');
    const finalPrompt = `${prefix}${mediumStyle}${middle}${suffix}`.replace(/\s+,/g, ',').trim();

    // 5. Pick model from bot's modelByPath
    const modelSpec = bot.modelByPath[PATH];
    let renderModel = typeof modelSpec === 'string' ? modelSpec : 'black-forest-labs/flux-dev';

    // 6. Render + post
    try {
      const url = await flux({ prompt: finalPrompt, aspectRatio: '9:16', model: renderModel });
      const local = `${OUT_DIR}/${String(n).padStart(2, '0')}-both.jpg`;
      await downloadJpg(url, local);
      await postAsBot({
        sb, userId, username: bot.username, localPath: local,
        prompt: finalPrompt, vibeKey, medium,
        caption: `vampire-${SKIP_POLISH ? 'chaos-only' : SKIP_CHAOS ? 'polish-only' : 'both'} R${ROUND} #${n}`,
      });
      console.log(`  ✅ posted`);
    } catch (err) {
      console.error(`  ❌ failed: ${err.message}`);
    }
    console.log('');
  }

  console.log(`━━━ Done. Search feed for "vampire-both R${ROUND}". ━━━\n`);
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
