#!/usr/bin/env node
/**
 * Validate the actual byte format of every cast/avatar file in Supabase
 * storage for a user. Sniffs the magic bytes (file header) and reports
 * whether each file truly is what its content-type claims.
 *
 * Why this exists: until 2026-05-30 every cast/avatar upload labelled
 * itself 'image/jpeg' regardless of the actual bytes. Anyone picking
 * from Files app (PNG / WebP / GIF / AVIF / HEIC) uploaded lying bytes.
 * The lib/normalizeImageToJpeg.ts fix transcodes the picker output
 * before upload, so all NEW uploads are guaranteed real JPEG. This
 * script verifies that — and surfaces any legacy lying uploads that
 * pre-date the fix.
 *
 * Usage:
 *   node scripts/validate-cast-photo-formats.js              # Kevin
 *   node scripts/validate-cast-photo-formats.js <user_uuid>  # specific user
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

// Magic-byte signatures. Source: file format specs + ISOBMFF for HEIC/AVIF.
function sniffFormat(buf) {
  if (!buf || buf.length < 16) return 'too-short';
  const u8 = new Uint8Array(buf);
  // JPEG: starts with FFD8FF
  if (u8[0] === 0xff && u8[1] === 0xd8 && u8[2] === 0xff) return 'JPEG';
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (u8[0] === 0x89 && u8[1] === 0x50 && u8[2] === 0x4e && u8[3] === 0x47) return 'PNG';
  // GIF: 'GIF87a' or 'GIF89a'
  if (u8[0] === 0x47 && u8[1] === 0x49 && u8[2] === 0x46) return 'GIF';
  // WebP: 'RIFF' + 4 bytes size + 'WEBP'
  if (
    u8[0] === 0x52 &&
    u8[1] === 0x49 &&
    u8[2] === 0x46 &&
    u8[3] === 0x46 &&
    u8[8] === 0x57 &&
    u8[9] === 0x45 &&
    u8[10] === 0x42 &&
    u8[11] === 0x50
  )
    return 'WebP';
  // HEIC/AVIF: bytes 4-7 = 'ftyp', then brand at bytes 8-11
  if (u8[4] === 0x66 && u8[5] === 0x74 && u8[6] === 0x79 && u8[7] === 0x70) {
    const brand = String.fromCharCode(u8[8], u8[9], u8[10], u8[11]);
    if (brand.startsWith('heic') || brand.startsWith('heix') || brand.startsWith('mif1'))
      return 'HEIC';
    if (brand.startsWith('avif') || brand.startsWith('avis')) return 'AVIF';
    return `ftyp:${brand}`;
  }
  return 'unknown';
}

function isPostFix(createdIso) {
  // Fix landed 2026-05-30 ~05:00 UTC. Files newer than that should ALL be JPEG.
  return new Date(createdIso) > new Date('2026-05-30T05:00:00Z');
}

(async () => {
  const userId = process.argv[2] || KEVIN;
  console.log(`Validating storage files for user: ${userId}\n`);

  // List avatars bucket files for this user (cast + avatar both live there).
  const { data: files, error } = await sb.storage.from('avatars').list(userId, {
    limit: 200,
    sortBy: { column: 'created_at', order: 'desc' },
  });
  if (error) {
    console.error('list failed:', error.message);
    process.exit(1);
  }
  if (!files || files.length === 0) {
    console.log('(no files)');
    return;
  }

  const stats = { jpeg: 0, png: 0, webp: 0, gif: 0, heic: 0, avif: 0, other: 0 };
  const lies = []; // files whose bytes don't match their .jpg label

  console.log('created                 size      bytes-sniffed   pre/post-fix   file');
  console.log('─'.repeat(95));

  for (const f of files) {
    const created = f.created_at || f.updated_at || '?';
    const sizeKb = f.metadata?.size ? Math.round(f.metadata.size / 1024) + 'KB' : '?';
    const { data: pub } = sb.storage.from('avatars').getPublicUrl(`${userId}/${f.name}`);
    let detected = '?';
    try {
      const res = await fetch(pub.publicUrl);
      const buf = Buffer.from(await res.arrayBuffer());
      detected = sniffFormat(buf);
    } catch (e) {
      detected = 'fetch-err';
    }
    const key = detected.toLowerCase();
    if (key in stats) stats[key]++;
    else stats.other++;

    const era = isPostFix(created) ? 'POST-FIX' : 'PRE-FIX ';
    const claimsJpeg = f.name.endsWith('.jpg') || f.name.endsWith('.jpeg');
    const liar = claimsJpeg && detected !== 'JPEG';
    if (liar) lies.push({ file: f.name, created, detected, era });

    const tag = liar ? '⚠ LIE' : detected === 'JPEG' ? '✅' : '  ';
    console.log(
      `${created.slice(0, 19).padEnd(20)}  ${sizeKb.padEnd(8)} ${detected.padEnd(14)} ${era}     ${tag} ${f.name}`
    );
  }

  console.log('\n─'.repeat(95));
  console.log('Totals by sniffed format:');
  for (const [k, v] of Object.entries(stats)) if (v) console.log(`  ${k.padEnd(10)} ${v}`);
  console.log(`\nTotal files: ${files.length}, content-type-lying files: ${lies.length}`);

  if (lies.length) {
    console.log('\n⚠ Files whose bytes do NOT match their .jpg label:');
    for (const l of lies) {
      console.log(
        `  [${l.era}] ${l.detected.padEnd(8)} ${l.file}  (created ${l.created.slice(0, 19)})`
      );
    }
    const postFixLies = lies.filter((l) => l.era === 'POST-FIX');
    if (postFixLies.length) {
      console.log(
        `\n❌ ${postFixLies.length} POST-FIX file(s) are still lying — the normalizeImageToJpeg fix did NOT take effect for them. Investigate.`
      );
    } else {
      console.log(`\n✅ Every POST-FIX file is real JPEG. The lies are all pre-fix legacy.`);
    }
  } else {
    console.log('\n✅ Every file is real JPEG. No content-type lies.');
  }
})();
