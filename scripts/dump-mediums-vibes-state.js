/**
 * One-shot dump of the mediums + vibes + model routing state to a markdown
 * reference doc, so we never lose the per-medium routing work if the DB is
 * ever restored to a pre-session backup.
 *
 * Usage:
 *   export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && \
 *     SUPABASE_SERVICE_ROLE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d= -f2) \
 *     node scripts/dump-mediums-vibes-state.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function sqlEscape(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
  if (Array.isArray(v)) {
    return `ARRAY[${v.map((x) => `'${String(x).replace(/'/g, "''")}'`).join(', ')}]::text[]`;
  }
  if (typeof v === 'object') {
    return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(v).replace(/'/g, "''")}'`;
}

function insertStatement(table, row, cols) {
  const vals = cols.map((c) => sqlEscape(row[c])).join(', ');
  return `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${vals});`;
}

(async () => {
  const ts = new Date().toISOString().slice(0, 10);

  const [mediums, vibes, overrides] = await Promise.all([
    sb.from('dream_mediums').select('*').order('sort_order'),
    sb.from('dream_vibes').select('*').order('sort_order'),
    sb.from('model_overrides').select('*'),
  ]);

  if (mediums.error) throw new Error('dream_mediums: ' + mediums.error.message);
  if (vibes.error) throw new Error('dream_vibes: ' + vibes.error.message);
  if (overrides.error) throw new Error('model_overrides: ' + overrides.error.message);

  let md = `# Mediums + Vibes + Model Routing — State Snapshot\n\n`;
  md += `**Captured:** ${ts}\n`;
  md += `**DB:** jimftynwrinwenonjrlj.supabase.co\n`;
  md += `**Source tables:** \`dream_mediums\`, \`dream_vibes\`, \`model_overrides\`\n\n`;
  md += `This doc is the source of truth for the per-medium model routing and vibe finalization work completed on 2026-04-17. If the DB is ever restored to a pre-session backup, reproduce this state using the INSERT statements at the bottom of each section.\n\n`;
  md += `---\n\n`;

  // ── Mediums summary table ─────────────────────────────────────────────
  md += `## Mediums (\`dream_mediums\`) — ${mediums.data.length} rows\n\n`;
  md += `| key | label | active | face_swap | char_only | render_mode | allowed_models |\n`;
  md += `|---|---|---|---|---|---|---|\n`;
  for (const m of mediums.data) {
    const models = (m.allowed_models || []).join('<br>') || '—';
    md += `| \`${m.key}\` | ${m.label} | ${m.is_active ? '✓' : '—'} | ${m.face_swaps ? '✓' : '—'} | ${m.is_character_only ? '✓' : '—'} | ${m.character_render_mode || '—'} | ${models} |\n`;
  }
  md += `\n### Full medium details (directives + flux_fragments)\n\n`;
  for (const m of mediums.data) {
    md += `#### \`${m.key}\` — ${m.label}\n\n`;
    md += `- **active:** ${m.is_active} | **face_swaps:** ${m.face_swaps} | **is_character_only:** ${m.is_character_only}\n`;
    md += `- **character_render_mode:** ${m.character_render_mode || 'null'} | **sort_order:** ${m.sort_order}\n`;
    md += `- **preferred_model:** ${m.preferred_model || 'null'}\n`;
    md += `- **allowed_models:** ${JSON.stringify(m.allowed_models)}\n`;
    md += `- **directive:**\n\n> ${(m.directive || '').replace(/\n/g, '\n> ')}\n\n`;
    md += `- **flux_fragment:**\n\n> ${(m.flux_fragment || '').replace(/\n/g, '\n> ')}\n\n`;
    if (m.kontext_directive) md += `- **kontext_directive:**\n\n> ${m.kontext_directive.replace(/\n/g, '\n> ')}\n\n`;
    if (m.render_base) md += `- **render_base:** ${m.render_base}\n`;
    if (m.engine) md += `- **engine:** ${m.engine}\n`;
    md += `\n`;
  }

  // ── Vibes summary table ───────────────────────────────────────────────
  md += `---\n\n## Vibes (\`dream_vibes\`) — ${vibes.data.length} rows\n\n`;
  md += `| key | label | active | mood_profile |\n`;
  md += `|---|---|---|---|\n`;
  for (const v of vibes.data) {
    const mp = v.mood_profile
      ? `c/t:${v.mood_profile.cute_terrifying} p/c:${v.mood_profile.peaceful_chaotic} m/m:${v.mood_profile.minimal_maximal} r/s:${v.mood_profile.realistic_surreal}`
      : '—';
    md += `| \`${v.key}\` | ${v.label} | ${v.is_active ? '✓' : '—'} | ${mp} |\n`;
  }
  md += `\n### Full vibe details (directives)\n\n`;
  for (const v of vibes.data) {
    md += `#### \`${v.key}\` — ${v.label}\n\n`;
    md += `- **active:** ${v.is_active} | **sort_order:** ${v.sort_order}\n`;
    md += `- **mood_profile:** ${JSON.stringify(v.mood_profile)}\n`;
    md += `- **directive:**\n\n> ${(v.directive || '').replace(/\n/g, '\n> ')}\n\n`;
  }

  // ── Model overrides ───────────────────────────────────────────────────
  md += `---\n\n## Model Overrides (\`model_overrides\`) — ${overrides.data.length} rows\n\n`;
  md += `Per-medium+vibe model routing overrides. When a (medium, vibe) combo matches, this list wins over \`dream_mediums.allowed_models\`.\n\n`;
  md += `| medium | vibe | allowed_models |\n`;
  md += `|---|---|---|\n`;
  for (const o of overrides.data) {
    md += `| \`${o.medium_key}\` | \`${o.vibe_key}\` | ${JSON.stringify(o.allowed_models)} |\n`;
  }

  // ── Reproduction SQL ──────────────────────────────────────────────────
  md += `\n---\n\n## Reproduction SQL\n\nIf this state is ever lost, these INSERT statements reproduce it exactly.\n\n`;

  const mediumCols = [
    'key', 'label', 'directive', 'flux_fragment', 'sort_order', 'is_active',
    'is_character_only', 'face_swaps',
    'is_public', 'character_render_mode', 'preferred_model', 'allowed_models',
    'kontext_directive', 'render_base', 'engine',
  ];
  md += `### \`dream_mediums\`\n\n\`\`\`sql\n-- Wipe + reload\nDELETE FROM dream_mediums;\n`;
  for (const m of mediums.data) md += insertStatement('dream_mediums', m, mediumCols) + '\n';
  md += `\`\`\`\n\n`;

  const vibeCols = ['key', 'label', 'directive', 'sort_order', 'is_active', 'mood_profile'];
  md += `### \`dream_vibes\`\n\n\`\`\`sql\nDELETE FROM dream_vibes;\n`;
  for (const v of vibes.data) md += insertStatement('dream_vibes', v, vibeCols) + '\n';
  md += `\`\`\`\n\n`;

  const overrideCols = ['medium_key', 'vibe_key', 'allowed_models'];
  md += `### \`model_overrides\`\n\n\`\`\`sql\nDELETE FROM model_overrides;\n`;
  for (const o of overrides.data) md += insertStatement('model_overrides', o, overrideCols) + '\n';
  md += `\`\`\`\n`;

  const outPath = path.join(__dirname, '..', 'docs', 'MEDIUMS_VIBES_STATE.md');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, md);
  console.log(`Wrote ${outPath} (${md.length} chars, ${mediums.data.length} mediums, ${vibes.data.length} vibes, ${overrides.data.length} overrides)`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
