/**
 * distill-clean-mediums.js — build the DLT "cleaned medium" mapping.
 *
 * Bot mediums in `dream_mediums` are written for the BOT engine, which
 * generates entire scenes — so their directive/flux_fragment often dictate
 * a CAST / ACTION / SUBJECT / composition. When a user does "Dream Like This"
 * on a bot post, the user supplies their OWN subject; feeding the raw bot
 * directive replaces that subject with the bot's scene (the "cat on a roof"
 * → toy-diorama bug).
 *
 * This distills each bot medium into a STYLE-ONLY descriptor (palette /
 * lighting / technique / materials / named aesthetics — no subject/scene)
 * and stores it in `dlt_clean_mediums`. DLT looks that up and feeds the clean
 * style to the prompt instead of the raw bot directive. The canonical
 * `dream_mediums` rows are NEVER mutated (the bot keeps rendering with them
 * via its bot-local mediumStyles).
 *
 * Usage:
 *   node scripts/distill-clean-mediums.js            # distill ALL is_bot_only → emit migration SQL
 *   node scripts/distill-clean-mediums.js --missing  # only bot mediums lacking a clean row
 *   node scripts/distill-clean-mediums.js --upsert    # write directly to DB (table must exist)
 *   node scripts/distill-clean-mediums.js --key foo   # one medium
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const ANTHROPIC = process.env.ANTHROPIC_API_KEY;
const HAIKU = 'claude-haiku-4-5-20251001';
const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!ANTHROPIC) {
  console.error('ANTHROPIC_API_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const ONLY_MISSING = args.includes('--missing');
const UPSERT = args.includes('--upsert');
const KEY = args.includes('--key') ? args[args.indexOf('--key') + 1] : null;

const SYSTEM = `You distill a bot art-medium definition into a CLEAN, STYLE-ONLY descriptor for the "Dream Like This" feature.

The input medium describes an art style, but it was written for a bot that generates ENTIRE SCENES — so it usually contains language that dictates WHAT appears in the frame (a cast of characters/toys/creatures, a story beat, "action playing out", specific objects, a diorama/scene setup, framing/composition, counts, and "NOT a X" content negations). If that language is reused in Dream Like This, it OVERRIDES the user's own subject and ruins the recreation.

Your job: output ONLY the visual STYLE — palette and color treatment, lighting, rendering technique/finish, material and surface qualities, and any named art aesthetics. KEEP material/technique descriptors even when they name a medium (e.g. "plush fabric", "die-cast chrome", "vinyl", "oil-painted brushwork", "stop-motion practical set", "cel-shaded").

REMOVE everything that dictates content: subjects, characters, a "cast", creatures, story beats, specific objects, scene/diorama/world setups, composition/framing instructions, "NOT a ___" negations, and counts.

OUTPUT: a single comma-separated style phrase, 25-45 words, leading with the most distinctive style anchors. No preamble, no labels, no quotes.`;

async function distill(label, directive, flux) {
  const src = [directive, flux].filter(Boolean).join('\n\n').slice(0, 4000);
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 90000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: HAIKU,
        max_tokens: 300,
        system: SYSTEM,
        messages: [
          { role: 'user', content: `MEDIUM: ${label}\n\n${src}\n\nDistill to a clean style-only phrase.` },
        ],
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Haiku ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    return (data.content?.[0]?.text || '').replace(/\s+/g, ' ').trim();
  } finally {
    clearTimeout(t);
  }
}

const escq = (s) => String(s).replace(/'/g, "''");

(async () => {
  let q = sb.from('dream_mediums').select('key,label,directive,flux_fragment').eq('is_bot_only', true);
  if (KEY) q = sb.from('dream_mediums').select('key,label,directive,flux_fragment').eq('key', KEY);
  const { data: mediums, error } = await q.order('key');
  if (error) {
    console.error('fetch failed:', error.message);
    process.exit(1);
  }

  let existing = new Set();
  if (ONLY_MISSING) {
    const { data: have } = await sb.from('dlt_clean_mediums').select('medium_key');
    existing = new Set((have || []).map((r) => r.medium_key));
  }

  const rows = [];
  for (const m of mediums) {
    if (ONLY_MISSING && existing.has(m.key)) continue;
    process.stdout.write(`distilling ${m.key} ... `);
    let clean = '';
    for (let attempt = 0; attempt < 3 && !clean; attempt++) {
      try {
        clean = await distill(m.label || m.key, m.directive, m.flux_fragment);
      } catch (e) {
        console.log(`(retry ${attempt + 1}: ${e.message.slice(0, 50)})`);
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      }
    }
    if (!clean) {
      console.log('FAILED — skipping');
      continue;
    }
    console.log(`${clean.split(' ').length}w`);
    rows.push({ medium_key: m.key, clean_flux_fragment: clean, clean_directive: clean });
    if (UPSERT) {
      await sb.from('dlt_clean_mediums').upsert(
        { medium_key: m.key, clean_flux_fragment: clean, clean_directive: clean },
        { onConflict: 'medium_key' }
      );
    }
  }

  console.log(`\ndistilled ${rows.length} mediums`);
  fs.writeFileSync('/tmp/clean_medium_rows.json', JSON.stringify(rows, null, 2));

  if (!UPSERT) {
    const values = rows
      .map((r) => `  ('${escq(r.medium_key)}', '${escq(r.clean_flux_fragment)}', '${escq(r.clean_directive)}')`)
      .join(',\n');
    const sql = `-- 181_dlt_clean_mediums.sql
-- DLT "cleaned medium" mapping. Bot mediums in dream_mediums are written for
-- the BOT scene engine (their directive/flux_fragment dictate a cast/scene),
-- which overrides a user's own subject in Dream Like This. This table holds a
-- STYLE-ONLY distilled version per bot medium; DLT looks it up and feeds the
-- clean style to the prompt instead of the raw bot directive. dream_mediums is
-- never mutated. Re-distill / add rows via scripts/distill-clean-mediums.js.

CREATE TABLE IF NOT EXISTS public.dlt_clean_mediums (
  medium_key text PRIMARY KEY REFERENCES public.dream_mediums(key) ON DELETE CASCADE,
  clean_flux_fragment text NOT NULL,
  clean_directive text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: readable by all (DLT resolution); writes via service role / migration only.
ALTER TABLE public.dlt_clean_mediums ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS dlt_clean_mediums_read ON public.dlt_clean_mediums;
CREATE POLICY dlt_clean_mediums_read ON public.dlt_clean_mediums FOR SELECT USING (true);

INSERT INTO public.dlt_clean_mediums (medium_key, clean_flux_fragment, clean_directive)
VALUES
${values}
ON CONFLICT (medium_key) DO UPDATE
  SET clean_flux_fragment = EXCLUDED.clean_flux_fragment,
      clean_directive = EXCLUDED.clean_directive;
`;
    fs.writeFileSync('supabase/migrations/181_dlt_clean_mediums.sql', sql);
    console.log('wrote supabase/migrations/181_dlt_clean_mediums.sql');
  }
})();
