#!/usr/bin/env node
/**
 * One-off: render 6 hero-image concepts for the "Introducing FarmBot"
 * announcement (4:3 to match AnnouncementSheet's hero box exactly, no
 * heavy crop). Leans anime-style per Kevin's ask. Reuses existing,
 * already-proven FarmBot scene pools (place-led, wide establishing feel —
 * matches the "fairy-tale-kingdom" wide-scenic precedent from the
 * locations announcement) paired with a FORCED anime look each, instead of
 * a random roll, so each concept is intentionally anime-styled.
 *
 * NOT posted to the feed — announcement-asset candidates, not dream
 * content. Saved locally only.
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { flux, callClaude, download } = require('./lib/botEngine');
const bot = require('./bots/farmbot');

const OUT_DIR = path.join('/tmp', 'farmbot-announcement-hero');
fs.mkdirSync(OUT_DIR, { recursive: true });

const CONCEPTS = [
  {
    name: '01-farmhouse-ghibli',
    path: 'farmhouse-garden',
    look: "Studio Ghibli-style 2D render — soft hand-painted watercolor backgrounds, gentle cel shading, muted natural palette, visible brush texture, warm pastoral storybook calm.",
  },
  {
    name: '02-redbarn-kyoani',
    path: 'red-barn',
    look: "Kyoto Animation look — refined naturalistic character faces with delicate expressive eyes, gentle soft volumetric lighting, clean precise linework, pastel-leaning realistic palette, intimate warmth and meticulous detail.",
  },
  {
    name: '03-cropfields-dreamy',
    path: 'crop-fields',
    look: "Dreamy pastel anime look — airy soft pastel palette, luminous bloom and haze, gentle gradients, glittering light particles, hazy ethereal atmosphere, tender shoujo-soft glow.",
  },
  {
    name: '04-orchard-tv-anime',
    path: 'orchard',
    look: "Contemporary digital TV anime look — crisp clean vector-like linework, flat cel-shading with subtle gradient accents, bright saturated palette, glossy highlights, polished current-season streaming-anime finish.",
  },
  {
    name: '05-duckpond-theatrical',
    path: 'duck-pond',
    look: "Modern theatrical anime look — dramatic warm rim lighting, painterly digital background art, high-contrast cel shading, glowing atmospheric haze, current feature-film anime polish.",
  },
  {
    name: '06-market-bg-painter',
    path: 'market-town-square',
    look: "Anime background-painter look — pure landscape gouache-and-watercolor technique, soft painterly clouds and foliage, glowing directional light, wide environmental scene-painting composition, pure environment-art warmth.",
  },
];

async function main() {
  for (const c of CONCEPTS) {
    console.log(`\n=== ${c.name} (path: ${c.path}) ===`);
    const usedByAxis = {};
    const picker = {
      pickWithRecency: (arr, axisKey) => {
        if (!usedByAxis[axisKey]) usedByAxis[axisKey] = new Set();
        const used = usedByAxis[axisKey];
        let avail = arr.filter((_, i) => !used.has(i));
        if (avail.length === 0) {
          used.clear();
          avail = arr;
        }
        const idx = Math.floor(Math.random() * arr.length);
        used.add(idx);
        return arr[idx];
      },
    };
    const brief = bot.buildBrief({
      path: c.path,
      sharedDNA: { lookRegister: c.look },
      vibeDirective: 'cozy',
      vibeKey: 'cozy',
      picker,
    });
    const { text: middle } = await callClaude({ brief, maxTokens: 400 });
    const finalPrompt = `cozy farm scene, ${bot.mediumStyles.farmbot_cozy_neutral}, ${middle}, ${bot.promptSuffixByMedium.farmbot_cozy_neutral}`;
    const url = await flux({
      prompt: finalPrompt,
      aspectRatio: '4:3',
      model: 'black-forest-labs/flux-1.1-pro-ultra',
    });
    const dest = path.join(OUT_DIR, `${c.name}.jpg`);
    await download(url, dest);
    console.log(`  saved: ${dest}`);
  }
  console.log('\nDone — all 6 concepts saved to', OUT_DIR);
}

main().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});
