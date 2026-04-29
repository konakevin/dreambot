#!/usr/bin/env node
/**
 * gen-dual-actions.js — Generate dual character action pool entries via Sonnet.
 *
 * Uses existing hand-written entries as exemplars to ensure Sonnet matches
 * the exact format, simplicity, and quality that produces excellent renders.
 *
 * Usage:
 *   node scripts/gen-dual-actions.js --pool companion --count 50
 *   node scripts/gen-dual-actions.js --pool partner --count 50
 */

const fs = require('fs');
const path = require('path');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const envFile = readEnvFile();
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || envFile.ANTHROPIC_API_KEY;
if (!ANTHROPIC_KEY) {
  console.error('Missing ANTHROPIC_API_KEY');
  process.exit(1);
}

const args = process.argv.slice(2);
const POOL = args.find((_, i, a) => a[i - 1] === '--pool') || 'companion';
const COUNT = parseInt(args.find((_, i, a) => a[i - 1] === '--count') ?? '50', 10);
const EXISTING_FILE = args.find((_, i, a) => a[i - 1] === '--existing-file');

const EXISTING_COMPANION = [
  'one leaning on a railing, the other standing a few feet away with arms crossed',
  'one crouching to examine something on the ground, the other standing nearby with one hand on their hip',
  'one sitting on a ledge or step, the other standing beside them with arms crossed',
  'one adjusting their gear or bag, the other standing with hands in pockets',
  'one photographing something with a camera held at chest level, the other standing beside them pointing at something off to the side',
  'both standing still, one with hands at their sides, the other with one hand resting on their hip',
  'one standing at the edge of a drop or overlook, the other a few steps back on safer ground',
  'both looking up at something towering above them from slightly different angles',
  'one kneeling to tie a boot or adjust something, the other standing beside them with hands on hips',
  'one reaching up toward a high object, the other standing nearby with arms folded',
  'one checking a device or instrument, the other standing beside them looking at the same thing',
  'both standing in a wide open space, one with hands on hips, the other shielding their eyes',
  'one examining a detail on a wall with one hand raised, the other standing nearby with arms crossed',
  'both resting against opposite sides of a pillar or structure',
  'one waving or signaling toward something unseen, the other standing with their arms at their sides',
  'one sketching or writing in a notebook, the other standing beside them with a cup in hand',
  'one reaching into a bag or container, the other standing by with hands ready to help',
  'one stretching or rolling their shoulders, the other standing still with arms crossed',
  'one standing with head slightly tilted listening to something, the other standing still beside them',
  'both seated on separate surfaces at slightly different heights, one with legs stretched out, the other with arms on their knees',
  'one leaning against a wall with arms folded, the other standing a few feet away adjusting their jacket',
  'both standing at a balcony railing, one with elbows on the rail, the other standing upright with hands in pockets',
  'one adjusting their hat or sunglasses, the other standing nearby drinking from a cup',
  'one with a hand resting on a post or column, the other standing a few steps away checking a device',
  'both seated on a bench, one with legs crossed, the other leaning forward with elbows on knees',
  'one standing with a bag slung over one shoulder, the other beside them stretching one arm overhead',
  'both standing in waist-deep grass or flowers, one brushing a hand through the plants, the other standing still',
  'one perched on a rock or boulder, the other standing beside it with one hand resting on the stone',
  'one holding a lantern or light source at their side, the other standing nearby with hands in jacket pockets',
  'both standing at a market stall or counter, one examining an object, the other resting an elbow on the surface',
  'one with their hands behind their head stretching, the other standing with arms crossed',
  'both standing under a large tree, one leaning against the trunk, the other standing free with a hand on their chin',
  'both standing at the edge of water, one with hands in pockets, the other bending slightly to look at the surface',
  'one holding something up for the other to see, both standing a couple feet apart',
  'both leaning on opposite ends of the same fence or railing',
  'one standing with their weight on one leg, the other nearby with feet planted and arms crossed',
  'one holding a map or device at chest height, the other standing beside them pointing at something on it',
  'both standing under an archway, one with their back against the pillar, the other with a hand resting on the stone',
  'one sitting on a low wall, the other standing beside them with one foot up on the wall',
  'one shielding their eyes from light, the other standing beside them with arms at their sides',
  'one reading a sign or inscription, the other standing beside them looking at the same sign',
  'one holding something up to inspect it in the light, the other standing nearby with a hand on their chin',
  'both standing at a window, one with their hands on the sill, the other standing beside them arms crossed',
  'one crouching beside an animal or plant, the other standing a few feet away with hands in pockets',
  'both standing on a rooftop or elevated platform, one near the edge, the other a few feet back',
  'one pointing something out low and to the side, the other standing beside them looking where they point',
  'one standing with one hand in their pocket and the other gesturing, the second person standing with both hands in pockets',
  'both standing at the base of a large structure, one looking up with hand shading eyes, the other with arms crossed',
  'one rolling up their sleeves, the other standing beside them with thumbs hooked in their belt',
  'both standing under an awning or shelter, one leaning on a support beam, the other standing free',
];

const EXISTING_PARTNER = [
  'sitting side by side, comfortable silence, one with chin in hand, the other with arms resting on their knees',
  'both holding the same railing or ledge, hands close but not touching',
  'both standing at an overlook, one with elbows on the railing, the other standing close with arms crossed',
  'one with chin resting on their own hand, the other standing beside them',
  'standing near each other at a scenic overlook, one leaning on the railing, the other standing with arms crossed',
  'both laughing at something, caught mid-reaction, standing a couple feet apart',
  'one tucking hair behind their own ear, the other standing beside them',
  'sitting together on a blanket or bench, knees almost touching',
  'one holding an umbrella or shade, the other standing beside them in the shade',
  'both standing close together, one with arms crossed, the other with hands clasped behind their back',
  'one absentmindedly fixing their sleeve, the other standing close',
  'both leaning forward on a railing, elbows on the rail, standing close',
  'sharing a quiet moment, both looking outward, standing close with no words needed',
  'one resting a hand on a railing, the other standing close with their arms loosely crossed',
  'both standing under a tree, one leaning against the trunk, the other standing close with their shoulder almost touching',
  'both standing still, shoulders close, one with hands in pockets, the other with arms loosely at their sides',
  'both sitting on steps, at slightly different heights, shoulders close',
];

async function callSonnet(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Sonnet API error: ${res.status}`);
  const data = await res.json();
  return data.content[0].text;
}

function buildPrompt(pool, count, existing) {
  const poolName = pool === 'companion' ? 'COMPANION (any two people)' : 'PARTNER (romantic couple, comfortable intimacy)';

  const rules = pool === 'companion'
    ? `- Two people who happen to be in the same scene — friends, colleagues, strangers, family
- Natural spatial separation — a few feet apart, different surfaces, different heights
- Each person doing something slightly different with their body
- Props are generic and scene-neutral (bags, cups, devices, railings, walls, rocks)
- NO romantic gestures, NO touching, NO closeness language`
    : `- Romantic couple — comfortable intimacy is fine. Bodies can be close, shoulders can be close. They're together.
- Romantic feel through: shared moments, gentle proximity, matching/mirrored poses, comfortable silence
- "Indie film quiet moment" energy — two people who don't need words
- HEADS / FACES rule (the only hard constraint): each character's head stays on its own side of the frame with a small gap between heads. No head leaning into the other person, no resting head on shoulder, no faces touching.
- BANNED face/head positions (these break the dual face swap):
  * heads touching, faces touching, head on shoulder, head against head
  * leaning head into the other, foreheads pressed together
  * any pose where one face is in front of or covering the other
- ALSO BANNED: kissing, full embrace, faces buried in shoulder/chest
- Body proximity (shoulders, arms, hands) is fine — just keep heads separate
- NO cheesy romance — Hallmark card energy is rejected`;

  return `You are generating body pose descriptions for an AI image generator. These describe what TWO PEOPLE are doing in a scene — body position only.

POOL: ${poolName}

ABSOLUTE RULES (every entry must follow ALL of these):
1. Describe what BOTH characters are doing (left person + right person)
2. BODY POSE ONLY — NEVER describe face direction, eye direction, gaze, or where they look
3. Both characters STATIONARY — no walking, stepping, running, arriving, moving through space
4. Both characters roughly SIDE BY SIDE — not one behind the other, not one far in background
5. Keep heads on separate sides — no leaning heads together, no resting head on shoulder
6. One line per entry, lowercase, no quotes, no numbering
7. 15-25 words per entry — concise and specific
8. Scene-neutral — no specific settings baked in (the scene comes from elsewhere)
9. No face-to-face positioning — they should NOT be turned toward each other

POOL-SPECIFIC RULES:
${rules}

FORMAT — match these exemplars EXACTLY in style, length, and specificity:
${existing.slice(0, 15).map(e => `- ${e}`).join('\n')}

MORE EXEMPLARS (for variety reference):
${existing.slice(15, 30).map(e => `- ${e}`).join('\n')}

DEDUPLICATION — do NOT repeat or rephrase any of these existing entries:
${existing.map(e => `- ${e}`).join('\n')}

Generate exactly ${count} NEW entries. Each must be genuinely different from every existing entry — different verb, different prop, different spatial arrangement. Output ONLY the entries, one per line, no bullets, no numbering, no quotes.`;
}

function extractVerb(entry) {
  const verbs = entry.match(/\b(leaning|sitting|standing|crouching|kneeling|reaching|holding|checking|adjusting|examining|stretching|resting|perched|seated|waving|sketching|reading|pointing|rolling|shielding|brushing|photographing)\b/gi);
  return verbs ? verbs.map(v => v.toLowerCase()) : [];
}

function dedupCheck(newEntries, existing) {
  const issues = [];
  const existingLower = existing.map(e => e.toLowerCase());

  for (let i = 0; i < newEntries.length; i++) {
    const entry = newEntries[i].toLowerCase();

    // Check for near-duplicates against existing
    for (const ex of existingLower) {
      const words1 = new Set(entry.split(/\s+/));
      const words2 = new Set(ex.split(/\s+/));
      const overlap = [...words1].filter(w => words2.has(w) && w.length > 3).length;
      const similarity = overlap / Math.max(words1.size, words2.size);
      if (similarity > 0.6) {
        issues.push({ index: i, entry: newEntries[i], reason: `too similar to existing: "${ex}"`, similarity: (similarity * 100).toFixed(0) + '%' });
      }
    }

    // Check for near-duplicates within new entries
    for (let j = 0; j < i; j++) {
      const other = newEntries[j].toLowerCase();
      const words1 = new Set(entry.split(/\s+/));
      const words2 = new Set(other.split(/\s+/));
      const overlap = [...words1].filter(w => words2.has(w) && w.length > 3).length;
      const similarity = overlap / Math.max(words1.size, words2.size);
      if (similarity > 0.6) {
        issues.push({ index: i, entry: newEntries[i], reason: `too similar to new #${j + 1}: "${newEntries[j]}"`, similarity: (similarity * 100).toFixed(0) + '%' });
      }
    }

    // Rule violations
    if (/walking|stepping|running|arriving|moving|approaching|entering/i.test(entry)) {
      issues.push({ index: i, entry: newEntries[i], reason: 'MOVEMENT verb detected' });
    }
    if (/looking at|gazing|staring|watching|eye contact|locked eyes/i.test(entry)) {
      issues.push({ index: i, entry: newEntries[i], reason: 'FACE DIRECTION detected' });
    }
    if (/facing each other|turned toward|face.to.face/i.test(entry)) {
      issues.push({ index: i, entry: newEntries[i], reason: 'FACE-TO-FACE positioning detected' });
    }
    if (/kissing|hugging|embrace|holding hands|arm around/i.test(entry)) {
      issues.push({ index: i, entry: newEntries[i], reason: 'ROMANTIC CONTACT detected' });
    }
    if (/\bhead on shoulder\b|\bresting head\b|\bhead against head\b|\bheads? touching\b|\bfaces? touching\b|\bforeheads? (pressed )?(together|touching)\b|\bleaning head\b|\bnose to nose\b|\bnoses? touching\b|\bhead pressed\b|\bcheek to cheek\b|\bface buried\b/i.test(entry)) {
      issues.push({ index: i, entry: newEntries[i], reason: 'FACE/HEAD PROXIMITY detected (breaks dual face swap)' });
    }

    const wordCount = entry.split(/\s+/).length;
    if (wordCount > 30) {
      issues.push({ index: i, entry: newEntries[i], reason: `too long (${wordCount} words)` });
    }
    if (wordCount < 8) {
      issues.push({ index: i, entry: newEntries[i], reason: `too short (${wordCount} words)` });
    }
  }

  return issues;
}

(async () => {
  let existing = POOL === 'companion' ? EXISTING_COMPANION : EXISTING_PARTNER;
  if (EXISTING_FILE) {
    try {
      const fileData = JSON.parse(fs.readFileSync(EXISTING_FILE, 'utf8'));
      const fromFile = Array.isArray(fileData) ? fileData : (fileData.entries || []);
      // Merge baked-in exemplars with file entries, dedup
      const merged = new Set([...existing, ...fromFile]);
      existing = Array.from(merged);
      console.log(`📁 Loaded ${fromFile.length} from ${EXISTING_FILE} → merged pool: ${existing.length}`);
    } catch (e) {
      console.error(`Failed to load --existing-file ${EXISTING_FILE}: ${e.message}`);
      process.exit(1);
    }
  }
  console.log(`\n🎯 Generating ${COUNT} ${POOL} actions via Sonnet...`);
  console.log(`   Existing pool: ${existing.length} entries`);

  const prompt = buildPrompt(POOL, COUNT, existing);
  const raw = await callSonnet(prompt);

  const entries = raw
    .split('\n')
    .map(l => l.replace(/^[-•*\d.)\s]+/, '').trim())
    .filter(l => l.length > 10 && !l.startsWith('#') && !l.startsWith('Here'));

  console.log(`\n📋 Sonnet returned ${entries.length} entries\n`);

  // Run dedup/quality checks
  const issues = dedupCheck(entries, existing);

  if (issues.length > 0) {
    console.log(`⚠️  ${issues.length} issues found:\n`);
    const grouped = {};
    for (const iss of issues) {
      if (!grouped[iss.index]) grouped[iss.index] = [];
      grouped[iss.index].push(iss);
    }
    for (const [idx, issList] of Object.entries(grouped)) {
      console.log(`  [${parseInt(idx) + 1}] "${entries[parseInt(idx)]}"`);
      for (const iss of issList) {
        console.log(`      ❌ ${iss.reason}${iss.similarity ? ` (${iss.similarity})` : ''}`);
      }
    }
  }

  const cleanEntries = entries.filter((_, i) => !issues.some(iss => iss.index === i));
  console.log(`\n✅ ${cleanEntries.length} clean entries (${entries.length - cleanEntries.length} removed)\n`);

  // Save to file for review
  const outFile = `/tmp/dual-actions-${POOL}-${COUNT}.json`;
  fs.writeFileSync(outFile, JSON.stringify({ pool: POOL, total: entries.length, clean: cleanEntries.length, removed: entries.length - cleanEntries.length, entries: cleanEntries, rejected: issues.map(i => ({ entry: entries[i.index], reason: i.reason })) }, null, 2));
  console.log(`📁 Saved to ${outFile}`);

  console.log('\n── CLEAN ENTRIES ──\n');
  cleanEntries.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
})();
