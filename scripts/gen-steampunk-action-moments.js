#!/usr/bin/env node
/**
 * One-off generator for STEAMPUNK_WOMEN_ACTIONS pool — cinematic peak-action
 * moments for the sexy-steampunk-woman path. Replaces the old dry task-verb
 * pool with sock-blowing moments that stack PRIMARY action + ENVIRONMENTAL
 * REACTION + ACTIVE STAKES.
 *
 * Usage: node scripts/gen-steampunk-action-moments.js --count 30
 *        node scripts/gen-steampunk-action-moments.js --target 100 --batch 25
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { SONNET } = require('./lib/models');

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((s, i, a) => (s.startsWith('--') ? [s.slice(2), a[i + 1] ?? true] : null))
    .filter(Boolean)
);

const OUT = path.resolve(__dirname, 'bots/steambot/seeds/steampunk_women_actions.json');
const TARGET = parseInt(args.target || '0', 10);
const BATCH = parseInt(args.batch || '25', 10);
const COUNT = parseInt(args.count || (TARGET ? '0' : '30'), 10);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const RECIPE = `Generate cinematic peak-action moments for a steampunk woman in a Victorian-industrial fantasy world. Each is ONE comma-separated line, 25-40 words.

EVERY entry must stack 3 elements:
1. PRIMARY ACTION (mid-X verb she's doing)
2. ENVIRONMENTAL REACTION (motion-blur / debris / sparks / steam / glass shatter / cloth whipping / smoke trail / shockwave)
3. ACTIVE STAKES (storm / chase / explosion / collapse / pursuit / boarding action / heist / pursuit / breach / escape)

Genre: Mortal-Engines / BioShock-Infinite / Wild-Wild-West / League-of-Extraordinary-Gentlemen / Treasure-Planet / Howl's-Moving-Castle action-scene cinema.

GOOD examples (note motion + stakes + visible reaction):
- mid-leap from airship rigging hand outstretched for safety-cable, hair and coat streaming horizontal, half-mile drop yawning below, mooring lines snapping
- shoulder-rolling behind brass console as bullets pock the bulkhead, smoke spiraling from her revolver, alarm-klaxons strobing red overhead
- vaulting over fallen mahogany table mid-fistfight, brass knuckles flashing, gas-lamp shattering as her boot clips it, opium-den patrons scattering
- sliding down brass dirigible rope hands-blistering, coat snapping in slipstream, distant cannons booming, deck rushing up to meet her
- diving sideways through stained-glass window mid-burglary, glass exploding outward, copper coat-tails whipping, alarm-bells pealing
- mid-throw of grappling hook across alley chasm, hair whipping, brass hook arcing through fog, pursuers' lanterns bobbing in pursuit
- crouched on locomotive roof at full speed, hand braced on brass smokestack, snow streaming horizontal, telegraph-poles flashing past
- swinging on chandelier across ballroom mid-heist, satin skirts billowing, brass chain creaking, masked patrons gasping below

BAD examples (boring / routine / task-verb — DO NOT generate these):
- adjusting altimeter dial — no motion, no stakes
- restringing clockwork harp — domestic task
- pipetting tincture into vial — quiet lab work
- arranging specimen jars — pure routine
- replacing damaged piston rod — maintenance verb

ABSOLUTE BANS — DO NOT WRITE THESE WORDS:
- sexy, sensual, sultry, seductive, voyeuristic, decolletage, bustier, cleavage, midriff, bare, sheer
- moisture / sweat / lip / flush

Output: ONE moment per line. No numbering. No quotes. No commentary. Just the moments, comma-separated phrases internally.`;

async function generateBatch(n) {
  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `${RECIPE}\n\nGenerate ${n} cinematic peak-action moments now.`,
      },
    ],
  });
  const text = resp.content[0].text;
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !/^[\d#\-\*]/.test(l.slice(0, 2)));
}

function signatureOf(s) {
  // First 4 content words for cheap dedup
  return s
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !['with', 'from', 'into', 'over', 'past', 'hair', 'coat', 'mid'].includes(w))
    .slice(0, 4)
    .join('|');
}

(async () => {
  if (TARGET) {
    let existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : [];
    const sigs = new Set(existing.map(signatureOf));
    console.log(`Appending to existing ${existing.length} — target ${TARGET}`);
    while (existing.length < TARGET) {
      const need = Math.min(BATCH, TARGET - existing.length);
      const batch = await generateBatch(Math.ceil(need * 1.3));
      const fresh = batch.filter((b) => !sigs.has(signatureOf(b)));
      for (const f of fresh) {
        if (existing.length >= TARGET) break;
        existing.push(f);
        sigs.add(signatureOf(f));
      }
      fs.writeFileSync(OUT, JSON.stringify(existing, null, 2));
      console.log(`  ${existing.length}/${TARGET}`);
    }
  } else {
    // Replace mode — overwrite
    const batch = await generateBatch(COUNT);
    const sigs = new Set();
    const deduped = batch.filter((b) => {
      const s = signatureOf(b);
      if (sigs.has(s)) return false;
      sigs.add(s);
      return true;
    });
    fs.writeFileSync(OUT, JSON.stringify(deduped, null, 2));
    console.log(`Wrote ${deduped.length} entries to ${OUT}`);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
