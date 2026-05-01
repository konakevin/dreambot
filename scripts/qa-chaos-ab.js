#!/usr/bin/env node
/**
 * Chaos A/B test harness — runs 5 unique GothBot dark-landscape setups,
 * each rendered TWICE: once without chaos, once with the same Sonnet output
 * but chaos phrases appended verbatim to the Flux prompt.
 *
 * Posts alternating so the feed shows A1, B1, A2, B2, ... for side-by-side QA.
 *
 * Caption: "chaos-AB R1 #<n> <NO-CHAOS|CHAOS-ON>" — queryable via uploads.caption.
 *
 * Usage: node scripts/qa-chaos-ab.js
 */

require('dotenv').config({ path: '.env.local' });

const path = require('path');
const fs = require('fs');
const {
  callClaude,
  flux,
  download: _download, // not exported by name; use the inline replicate flow
  createPicker,
  fetchVibeDirective,
  resolveMedium,
  resolveVibe,
  postAsBot,
  lookupBotUserId,
  getSupabase,
} = require('./lib/botEngine');
const { rollChaos } = require('./lib/chaosLayer');
const bot = require('./bots/gothbot');

const PATH = process.env.AB_PATH || 'dark-landscape';
const COUNT = Number(process.env.AB_COUNT || 5);
const ROUND = Number(process.env.AB_ROUND || 1);
const OUT_DIR = `/tmp/gothbot-chaos-ab-${PATH}-r${ROUND}`;

// Inline download (botEngine doesn't export it directly via name)
const https = require('https');
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

  console.log(`\n🤖 GothBot Chaos A/B — path=${PATH} round=${ROUND} count=${COUNT}`);
  console.log(`📁 ${OUT_DIR}\n`);

  // Caption uses path tag so vampire-girls-2 vs dark-landscape are distinguishable
  const captionTag = `chaos-AB-${PATH} R${ROUND}`;

  for (let n = 1; n <= COUNT; n++) {
    console.log(`━━━ Setup ${n}/${COUNT} ━━━`);

    // 1. Roll medium + vibe
    const medium = resolveMedium({ bot, path: PATH });
    const vibeKey = resolveVibe({ bot, medium, path: PATH });
    const vibeDirective = await fetchVibeDirective(sb, vibeKey);
    const mediumFluxFragment = await fetchMediumFluxFragment(sb, medium);
    const picker = await createPicker({ botName: bot.username, windowDays: 5, sb });

    // 2. Roll shared DNA
    const sharedDNA = bot.rollSharedDNA
      ? bot.rollSharedDNA({ vibeKey, medium, path: PATH, picker })
      : {};

    // 3. Build brief
    const brief = bot.buildBrief({
      path: PATH,
      sharedDNA,
      vibeDirective,
      vibeKey,
      medium,
      picker,
    });

    // 4. Sonnet ONCE → both A and B share this middle
    const claude = await callClaude({ brief, maxTokens: 400 });
    let middle = claude.text;

    // Banned-phrase retry (just in case)
    if (bot.bannedPhrases) {
      const lower = (s) => s.toLowerCase();
      let retries = 0;
      while (retries < 2 && bot.bannedPhrases.some((p) => lower(middle).includes(lower(p)))) {
        retries += 1;
        const retry = await callClaude({ brief, maxTokens: 400 });
        middle = retry.text;
      }
    }

    // 5. Roll chaos profile (with the same channels as botEngine sets up)
    //    Force enabled+no skips since this is the experiment
    let chaosProfile;
    if (process.env.AB_FORCE_CHANNEL) {
      // Force a specific channel — used to validate fears like "geometry will warp faces"
      const FORCE = {
        geometry: [
          'architectural geometry subtly impossible when examined closely',
          'parallel lines converge at inconsistent vanishing points',
          'doorways and windows slightly wrong proportions for the walls',
          "structural supports connect at angles that shouldn't bear weight",
          'floor plane tilts imperceptibly between foreground and background',
          'stairs lead in directions that contradict spatial logic',
        ],
      };
      const pool = FORCE[process.env.AB_FORCE_CHANNEL];
      if (!pool) throw new Error(`Unknown AB_FORCE_CHANNEL: ${process.env.AB_FORCE_CHANNEL}`);
      const phrase = pool[Math.floor(Math.random() * pool.length)];
      chaosProfile = {
        intensity: 0.85,
        injections: [phrase],
        channelKey: process.env.AB_FORCE_CHANNEL,
      };
    } else {
      chaosProfile = rollChaos({
        path: PATH,
        botChaos: { enabled: true, skipPaths: [] },
        allowSubjectChaos: false,
      });
      if (chaosProfile.injections.length === 0) {
        const forcedRoll = rollChaos({
          path: PATH,
          botChaos: { enabled: true, skipPaths: [], intensityBias: 0.5 },
          allowSubjectChaos: false,
        });
        chaosProfile.injections = forcedRoll.injections;
        chaosProfile.channelKey = forcedRoll.channelKey;
        chaosProfile.intensity = forcedRoll.intensity;
      }
    }
    const chaosPhrase = chaosProfile.injections.join(', ');

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

    const finalPromptA = `${prefix}${mediumStyle}${middle}${suffix}`.replace(/\s+,/g, ',').trim();
    const finalPromptB = `${prefix}${mediumStyle}${middle}, ${chaosPhrase}${suffix}`
      .replace(/\s+,/g, ',')
      .trim();

    // 7. Pick model — use bot's modelByPath spec for dark-landscape
    const modelSpec = bot.modelByPath[PATH];
    let renderModel;
    if (typeof modelSpec === 'object' && !Array.isArray(modelSpec)) {
      const entries = Object.entries(modelSpec);
      const totalW = entries.reduce((s, [, w]) => s + w, 0);
      let roll = Math.random() * totalW;
      renderModel = entries[entries.length - 1][0];
      for (const [m, w] of entries) {
        roll -= w;
        if (roll <= 0) {
          renderModel = m;
          break;
        }
      }
    } else {
      renderModel = modelSpec;
    }

    console.log(`  vibe=${vibeKey} medium=${medium} model=${renderModel}`);
    console.log(`  chaos: ${chaosProfile.channelKey} → "${chaosPhrase}"`);

    // 8. Render A (no chaos), post with caption
    const renderAndPost = async (label, finalPrompt) => {
      try {
        const url = await flux({ prompt: finalPrompt, aspectRatio: '9:16', model: renderModel });
        const local = `${OUT_DIR}/${String(n).padStart(2, '0')}-${label}.jpg`;
        await downloadJpg(url, local);
        const result = await postAsBot({
          sb,
          userId,
          username: bot.username,
          localPath: local,
          prompt: finalPrompt,
          vibeKey,
          medium,
          caption: `${captionTag} #${n} ${label}`,
        });
        console.log(`  ✅ [${label}] posted: ${result.publicUrl}`);
      } catch (err) {
        console.error(`  ❌ [${label}] failed: ${err.message}`);
      }
    };

    await renderAndPost('NO-CHAOS', finalPromptA);
    await renderAndPost('CHAOS-ON', finalPromptB);
    console.log('');
  }

  console.log(`\n━━━ Done. Search feed for "${captionTag}" or query uploads.caption. ━━━\n`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
