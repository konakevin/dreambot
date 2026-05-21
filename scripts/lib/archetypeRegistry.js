/**
 * Archetype registry — auto-discovers per-bot archetype + template files
 * so each bot can own its archetypes in isolation without contending on a
 * shared central file.
 *
 * Discovery:
 * - Scans `scripts/bots/* /archetypes.js` for archetype definitions
 * - Scans `scripts/bots/* /archetype-templates.js` for template functions
 * - Each per-bot file exports `module.exports = { ARCHETYPE_NAME: {...}, ... }`
 *
 * Returns merged objects. Duplicate names across bots throw a clear
 * collision error at boot — so accidental cross-bot stomp is caught
 * immediately rather than silently breaking renders.
 *
 * History: pre-refactor, all archetypes lived in scripts/lib/archetypes.js
 * + archetype-templates.js. With multiple Claude agents working in parallel,
 * those files became collision hot-spots. This loader lets each bot own
 * its archetypes alongside its paths/pools/seeds.
 *
 * Importers (brief-composer.js etc.) keep requiring `./archetypes` and
 * `./archetype-templates` — those files now re-export from this registry,
 * preserving the old public API.
 */

const fs = require('fs');
const path = require('path');

const BOTS_DIR = path.join(__dirname, '..', 'bots');

function loadFromBots(filename) {
  const merged = {};
  const collisions = [];
  const sources = {}; // name -> bot dir (for collision diagnostics)

  if (!fs.existsSync(BOTS_DIR)) return { merged, collisions };

  const entries = fs.readdirSync(BOTS_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const botDir = entry.name;
    if (botDir.startsWith('.') || botDir.startsWith('_')) continue;

    const filePath = path.join(BOTS_DIR, botDir, filename);
    if (!fs.existsSync(filePath)) continue;

    let mod;
    try {
      mod = require(filePath);
    } catch (e) {
      console.error(`[archetypeRegistry] error loading ${filePath}: ${e.message}`);
      throw e;
    }

    for (const key of Object.keys(mod)) {
      if (key in merged) {
        collisions.push({ name: key, firstBot: sources[key], secondBot: botDir });
      }
      merged[key] = mod[key];
      sources[key] = botDir;
    }
  }

  return { merged, collisions };
}

const { merged: archetypes, collisions: archCollisions } = loadFromBots('archetypes.js');
const { merged: templates, collisions: tmplCollisions } = loadFromBots('archetype-templates.js');

// Also load orphan-archetypes / templates if they exist (rescued during refactor)
const ORPHAN_ARCH = path.join(__dirname, '_orphan-archetypes.js');
const ORPHAN_TMPL = path.join(__dirname, '_orphan-archetype-templates.js');
if (fs.existsSync(ORPHAN_ARCH)) {
  const orphans = require(ORPHAN_ARCH);
  for (const k of Object.keys(orphans)) {
    if (k in archetypes) {
      archCollisions.push({ name: k, firstBot: 'orphan', secondBot: 'bot' });
    } else {
      archetypes[k] = orphans[k];
    }
  }
}
if (fs.existsSync(ORPHAN_TMPL)) {
  const orphans = require(ORPHAN_TMPL);
  for (const k of Object.keys(orphans)) {
    if (k in templates) {
      tmplCollisions.push({ name: k, firstBot: 'orphan', secondBot: 'bot' });
    } else {
      templates[k] = orphans[k];
    }
  }
}

if (archCollisions.length > 0) {
  console.error('[archetypeRegistry] ARCHETYPE NAME COLLISIONS:');
  for (const c of archCollisions) console.error(`  ${c.name} defined in both ${c.firstBot}/ and ${c.secondBot}/`);
  throw new Error(`Duplicate archetype names across bots: ${archCollisions.map(c => c.name).join(', ')}`);
}
if (tmplCollisions.length > 0) {
  console.error('[archetypeRegistry] TEMPLATE NAME COLLISIONS:');
  for (const c of tmplCollisions) console.error(`  ${c.name} defined in both ${c.firstBot}/ and ${c.secondBot}/`);
  throw new Error(`Duplicate template names across bots: ${tmplCollisions.map(c => c.name).join(', ')}`);
}

module.exports = { archetypes, templates };
