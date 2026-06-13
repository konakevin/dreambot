#!/usr/bin/env node
/**
 * fix-dragonbot-human-language.js — surgical de-humanizer for DragonBot
 * character seed pools (2026-06-13).
 *
 * Background: character seeds that described a fantasy being with AGE words
 * ("late-twenties") or "man / woman / male / female / boy / girl" made Flux
 * render a generic modern human in a costume instead of the fantasy race (the
 * "A Gnome illusionist, late-twenties woman" → witch-costume teacher bug).
 *
 * This tool rewrites ONLY the diseased entries in a pool (preserving all the
 * clean, curated ones), via Sonnet, with a per-pool context hint so the
 * rewrite leads with race + non-human anatomy where appropriate. Every
 * rewritten entry is re-validated against the ban regex; any that come back
 * still-dirty are retried once then dropped (logged).
 *
 *   node scripts/fix-dragonbot-human-language.js --pool <name> [--dry]
 *
 * Optional: --ethnic also strips real-world nationality/ethnicity labels from
 * HUMAN character entries (re-cast to fantasy-native), for pools Kevin flagged
 * (cozy_arcane_race). NEVER run on pools shared with the frozen artsy-girl
 * path (FANTASY_RACE / WARRIOR_SKIN / FEMALE_WARRIORS / etc.).
 */

const fs = require('fs');
const path = require('path');
const { SONNET } = require('./lib/models');

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
const env = readEnvFile();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
if (!ANTHROPIC) {
  console.error('ANTHROPIC_API_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : def;
};
const has = (name) => args.includes('--' + name);
const POOL = flag('pool', null);
const DRY = has('dry');
const ETHNIC = has('ethnic');
if (!POOL) {
  console.error(
    'Usage: node scripts/fix-dragonbot-human-language.js --pool <name> [--dry] [--ethnic]'
  );
  process.exit(1);
}

const HUMAN_LANGUAGE_RE =
  /\b(teens?|teenaged?|twenties|thirties|forties|fifties|sixties|seventies|eighties|nineties|year-old|years?\s+old|middle-aged|middle\s+aged|elderly|man|woman|men|women|male|female|boy|girl|lady|ladies|gentleman|gentlemen|person|people|husband|wife)\b/i;
const ETHNIC_RE =
  /\b(Mediterranean|Saharan|Sub-Saharan|Persian|Arabian|Arabic|Bedouin|Nordic|Norse|Scandinavian|Slavic|Celtic|Gaelic|East-Asian|Asian|African|Polynesian|Aztec|Mayan|Incan|Native[- ]American|Mongolian|Japanese|Chinese|Korean|Indian|Egyptian|Turkish|Spanish|Italian|Germanic|Anglo|Saxon|Latino|Hispanic|Caucasian|Indigenous)\b/i;

function isDirty(t) {
  return HUMAN_LANGUAGE_RE.test(t) || (ETHNIC && ETHNIC_RE.test(t));
}

// Per-pool rewrite guidance so the fix leads with the right thing.
const CONTEXT = {
  arcane_caster:
    'Each entry is ONE fantasy SPELLCASTER (the hero). Lead with the fantasy RACE + 2-3 UNMISTAKABLE non-human features (skin/scale/fur + ears/horns/tusks/snout + stature), then class + robes + spell.',
  magic_caster:
    'Each entry is ONE fantasy SPELLCASTER (the hero). Lead with the fantasy RACE + 2-3 UNMISTAKABLE non-human features, then class + robes + spell.',
  fantasy_characters:
    'Each entry is ONE fantasy CHARACTER (the hero). Lead with the fantasy RACE + 2-3 UNMISTAKABLE non-human features (or, for the rare human, a richly specific fantasy look — NO real-world nationality), then garb + detail.',
  male_warriors:
    'Each entry is ONE MALE fantasy WARRIOR (hero). Lead with the fantasy RACE + 2-3 unmistakable non-human features; for a human warrior give richly specific fantasy detail and NO real-world nationality/ethnicity (no "East-Asian", "Mediterranean"). Keep him clearly male via build/beard/role (the path enforces male) but NEVER use the word "male/man". Keep the armor, weapon, scars, pose.',
  cozy_arcane_inhabitant_age:
    'Each entry describes a magical-sanctum INHABITANT by ROLE + DEMEANOR + ACTIVITY. The RACE is chosen by a SEPARATE axis, so do NOT name a race. Convey life-stage ONLY through role + demeanor (apprentice / acolyte / journeyman / adept / scholar / archivist / master + a vivid activity) — NEVER an age word or number. 8-16 words.',
  wiztower_occupant:
    'Each entry is a candid background FIGURE inside a wizard tower. Remove every age word and man/woman/girl/boy. Make the figure either a specific fantasy race (a gnome / halfling / tiefling / dwarf apprentice with one non-human feature) OR a neutral role ("an apprentice", "a robed adept", "a hooded scholar") — NEVER "a young girl" / "an old woman". Keep the action + pose.',
  arclib_occupant:
    'Each entry is a candid background FIGURE inside a vast library. Remove every age word and man/woman/girl/boy. Make the figure a specific fantasy race OR a neutral role ("a librarian", "a robed scholar", "an archivist") — NEVER "an old woman" / "an elderly librarian". Keep the action + scale.',
  dungeon_party:
    'Each entry is a small ADVENTURING PARTY of figures in a dungeon. Remove every age word and man/woman/girl/boy. Give each party member a fantasy race or a neutral class-role ("a scarred swordmaster", "a hooded crossbow-adept", "a barbarian", "a druid") — NEVER "a woman" / "an elderly wizard". Keep the gear + cautious action.',
  necro_subject:
    'Each entry describes the SUBJECT of a necromancer scene (a raised spirit / revenant / bound figure / relic). Remove every age word and man/woman/girl/boy; describe the subject by its supernatural form, not human age/gender.',
  dwarfhold_occupant:
    'Each entry is a DWARF figure in a mountain hold. Dwarf IS the race. Remove every age word and man/woman; convey seniority via beard length/colour + build, never "elderly/young/woman".',
  elvencity_occupant:
    'Each entry is an ELF figure in an elven city. Elf IS the race. Remove every age word and man/woman; convey bearing via features, never "young/old/woman".',
  cozy_arcane_race:
    'Each entry describes a RACE/lineage for a cozy-arcane inhabitant. RE-CAST any real-world-ethnicity HUMAN label (e.g. "Mediterranean Human", "Saharan-Warm-Brown Human", "Northern-Pale Human") into FANTASY-NATIVE variety: keep humans as a lineage but describe them with in-world descriptors (skin tone by material/nature analogy — bronze, umber, sun-warmed, ash-fair — hair, eyes, bearing) and NO real-world nationality/heritage word. Non-human races stay as-is. Remove any age word / man / woman.',
};

const hint = CONTEXT[POOL];
if (!hint) {
  console.error(`No CONTEXT hint defined for pool "${POOL}". Add one before running.`);
  process.exit(1);
}

const outPath = path.resolve(`scripts/bots/dragonbot/seeds/${POOL}.json`);
const raw = JSON.parse(fs.readFileSync(outPath, 'utf8'));
if (!Array.isArray(raw) || typeof raw[0] !== 'string') {
  console.error('Pool is not a flat string array — this tool only handles those.');
  process.exit(1);
}

async function callSonnet(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: SONNET,
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Sonnet ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content[0].text;
}

function parseNumbered(text) {
  const out = [];
  let cur = null;
  for (const line of text
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .split('\n')) {
    const t = line.trim();
    if (!t) continue;
    const m = t.match(/^\s*(\d+)\s*[.):\]]\s*(.+)$/);
    if (m) {
      if (cur) out.push(cur);
      cur = m[2].trim();
    } else if (cur) cur += ' ' + t;
  }
  if (cur) out.push(cur);
  return out.map((e) =>
    e
      .replace(/^["']|["']$/g, '')
      .replace(/^[-•*]\s*/, '')
      .trim()
  );
}

function buildPrompt(entries) {
  return `You are cleaning a DragonBot fantasy seed pool. ${hint}

⛔ ABSOLUTE BANS in your output:
• NO age words or numbers — no "twenties / thirties / forties / fifties / sixties / seventies", no "young / old / elderly / middle-aged / teenage / ancient / X-year-old". Show seniority ONLY through physical signs.
• NO "man / woman / male / female / boy / girl / lady / person." Gender is carried ONLY by role-noun (sorceress / warlord / huntress / warlock) and pronouns.${ETHNIC ? '\n• NO real-world nationality/ethnicity labels (no "Mediterranean / Saharan / Norse / East-Asian / Persian / Bedouin / etc."). Diversify within the fantasy world\'s own native palette.' : ''}

Rewrite EACH numbered entry below to obey those bans while PRESERVING its scene, action, outfit, props, mood and length as closely as possible. Output a NUMBERED list with EXACTLY ${entries.length} entries, in the SAME ORDER, one per line, nothing else.

ENTRIES TO REWRITE:
${entries.map((e, i) => `${i + 1}. ${e}`).join('\n')}`;
}

(async () => {
  const dirtyIdx = raw.map((t, i) => (isDirty(t) ? i : -1)).filter((i) => i >= 0);
  console.log(
    `Pool "${POOL}": ${raw.length} entries, ${dirtyIdx.length} need rewriting${DRY ? ' (dry-run)' : ''}`
  );
  if (dirtyIdx.length === 0) {
    console.log('Nothing to do — pool is already clean.');
    return;
  }

  const dirtyEntries = dirtyIdx.map((i) => raw[i]);
  let rewritten = parseNumbered(await callSonnet(buildPrompt(dirtyEntries)));
  if (rewritten.length !== dirtyEntries.length) {
    console.warn(
      `  ⚠ Sonnet returned ${rewritten.length}, expected ${dirtyEntries.length} — aligning by index`
    );
  }

  // Validate; collect any still-dirty for one retry.
  const finalById = {};
  const stillDirty = [];
  dirtyIdx.forEach((poolIdx, k) => {
    const cand = rewritten[k];
    if (cand && !isDirty(cand)) finalById[poolIdx] = cand;
    else stillDirty.push({ poolIdx, k });
  });

  if (stillDirty.length) {
    console.log(`  • retrying ${stillDirty.length} entries that came back still-dirty / missing`);
    const retryEntries = stillDirty.map((s) => raw[s.poolIdx]);
    const retry = parseNumbered(await callSonnet(buildPrompt(retryEntries)));
    stillDirty.forEach((s, j) => {
      const cand = retry[j];
      if (cand && !isDirty(cand)) finalById[s.poolIdx] = cand;
      else console.warn(`  ⚠ DROPPED (could not clean): ${raw[s.poolIdx].slice(0, 80)}`);
    });
  }

  // Rebuild pool: clean originals kept in place; rewritten swapped in; uncleanable dropped.
  const next = [];
  raw.forEach((t, i) => {
    if (!dirtyIdx.includes(i)) next.push(t);
    else if (finalById[i]) next.push(finalById[i]);
    // else dropped
  });

  const remainingDirty = next.filter(isDirty).length;
  console.log(
    `  ✓ rewrote ${Object.keys(finalById).length}/${dirtyIdx.length} | pool ${raw.length} → ${next.length} | remaining dirty: ${remainingDirty}`
  );
  console.log('\nSample rewrites:');
  dirtyIdx.slice(0, 3).forEach((i) => {
    if (finalById[i]) {
      console.log(`\n  OLD: ${raw[i].slice(0, 130)}`);
      console.log(`  NEW: ${finalById[i].slice(0, 130)}`);
    }
  });

  if (DRY) {
    console.log('\nDry-run — not writing.');
    return;
  }
  fs.copyFileSync(outPath, outPath + '.bak-' + Date.now());
  fs.writeFileSync(outPath, JSON.stringify(next, null, 2));
  console.log(`\n✓ Wrote ${next.length} entries → ${outPath}`);
})();
