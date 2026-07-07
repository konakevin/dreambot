#!/usr/bin/env node
/**
 * Move a promoted path's test renders from AlphaBot to the destination bot.
 *
 * Part of the ALPHABOT.md promotion checklist: once Kevin approves a candidate
 * path, its renders transfer to the destination bot's profile (uploads.user_id
 * reassign — image files don't move, image_url is absolute; service role
 * bypasses the freeze_upload_columns_on_update trigger).
 *
 * AlphaBot captions are "AlphaBot › <target> › <path>", so the path name
 * selects exactly that candidate's renders. Rewrites the caption to the
 * destination's convention afterward is NOT attempted — pass --caption to set
 * a new caption on all moved rows if wanted.
 *
 * Usage:
 *   node scripts/promote-alphabot-renders.js --path <path-name> --to <bot-username> [--dry-run] [--caption "..."]
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const args = process.argv.slice(2);
function arg(name) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
}
const pathName = arg('path');
const toBot = arg('to');
const newCaption = arg('caption');
const dryRun = args.includes('--dry-run');

if (!pathName || !toBot) {
  console.error(
    'Usage: node scripts/promote-alphabot-renders.js --path <path-name> --to <bot-username> [--dry-run] [--caption "..."]'
  );
  process.exit(1);
}

(async () => {
  const { data: alpha } = await sb
    .from('users')
    .select('id')
    .ilike('username', 'alphabot')
    .single();
  const { data: dest } = await sb.from('users').select('id').ilike('username', toBot).single();
  if (!alpha || !dest) {
    console.error(`Account lookup failed (alphabot: ${!!alpha}, ${toBot}: ${!!dest})`);
    process.exit(1);
  }

  // Two caption eras: renders made ON alphabot ("AlphaBot › <target> › <path>",
  // any target) and renders that MOVED here in the 2026-07-07 DreamBot split
  // ("[<path>] ChibiBot"). Match both.
  const { data: rows, error } = await sb
    .from('uploads')
    .select('id, caption, created_at')
    .eq('user_id', alpha.id)
    .or(`caption.ilike.AlphaBot ›%› ${pathName}%,caption.like.[${pathName}] ChibiBot%`);
  if (error) throw error;

  console.log(`${rows.length} render(s) match "${pathName}" → ${toBot}`);
  for (const r of rows) console.log(`  ${r.id}  ${r.caption}`);
  if (dryRun || rows.length === 0) {
    console.log(dryRun ? '(dry run — nothing moved)' : '(nothing to move)');
    return;
  }

  const patch = { user_id: dest.id };
  if (newCaption) patch.caption = newCaption;
  const { error: upErr } = await sb
    .from('uploads')
    .update(patch)
    .in(
      'id',
      rows.map((r) => r.id)
    );
  if (upErr) throw upErr;
  console.log(
    `✅ moved ${rows.length} render(s) to ${toBot} (now PUBLIC — ${toBot} is a public account)`
  );
})();
