/**
 * OFFLINE calibration harness for the render quality gate (run with Deno):
 *   export $(grep "^ANTHROPIC_API_KEY" .env.local | head -1) && \
 *   deno run --allow-net --allow-read --allow-env scripts/eval-quality-gate.ts
 * Imports the REAL module (no prompt/parser copy drift). Fixtures in
 * __tests__/fixtures/quality-gate/ (good-* must all pass; broken-* detection
 * is best-effort — split-pane is the ACCEPTED miss). GATE_MODEL env overrides
 * the judge for A/B runs. Hard rule: any prompt change re-runs this and must
 * hold false-positives at ZERO before deploy (Kevin, 2026-09-03).
 */
// OFFLINE calibration for the quality gate — imports the REAL module (no copy drift).
import {
  buildGatePrompt,
  parseGateResponse,
} from '/Users/kevinmchenry/Development/apps/dreambot/supabase/functions/_shared/qualityGate.ts';
const S = new URL('../__tests__/fixtures/quality-gate/', import.meta.url).pathname;
const KEY = Deno.env.get('ANTHROPIC_API_KEY')!;
const GOOD = [
  'good-cam-01',
  'good-cam-04',
  'good-cam-07',
  'good-sv-03',
  'good-sv-05',
  'good-zf-2',
  'good-mrepro-2',
  'good-pop-v7cafe-1',
];
const BROKEN = ['broken-corrupt-face', 'broken-fused-glasses', 'broken-split-pane'];
async function judge(file: string): Promise<string> {
  const bytes = await Deno.readFile(S + file + '.jpg');
  let bin = '';
  const u8 = new Uint8Array(bytes);
  for (let i = 0; i < u8.length; i += 32768)
    bin += String.fromCharCode(...u8.subarray(i, i + 32768));
  const b64 = btoa(bin);
  const mediaType = u8[0] === 0x89 && u8[1] === 0x50 ? 'image/png' : 'image/jpeg';
  for (let a = 0; a < 3; a++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: Deno.env.get('GATE_MODEL') || 'claude-haiku-4-5-20251001',
        max_tokens: 16,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType, data: b64 } },
              { type: 'text', text: buildGatePrompt() },
            ],
          },
        ],
      }),
    });
    if (res.status === 429 || res.status >= 500) {
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }
    const j = await res.json();
    return j.content?.[0]?.type === 'text' ? j.content[0].text : '';
  }
  return '';
}
let fp = 0,
  fn = 0,
  err = 0;
for (const f of GOOD) {
  try {
    const v = parseGateResponse(await judge(f));
    if (!v) {
      err++;
      console.log(`GOOD ${f}: UNPARSEABLE (fail-open ok)`);
    } else if (!v.pass) {
      fp++;
      console.log(`GOOD ${f}: ❌ FALSE POSITIVE (${v.raw.trim()})`);
    } else console.log(`GOOD ${f}: pass`);
  } catch (e) {
    err++;
    console.log(`GOOD ${f}: err ${(e as Error).message.slice(0, 40)}`);
  }
}
for (const f of BROKEN) {
  try {
    const v = parseGateResponse(await judge(f));
    if (!v) {
      err++;
      console.log(`BROKEN ${f}: UNPARSEABLE`);
    } else if (v.pass) {
      fn++;
      console.log(`BROKEN ${f}: ❌ MISSED (${v.raw.trim()})`);
    } else console.log(`BROKEN ${f}: ✓ caught`);
  } catch (e) {
    err++;
    console.log(`BROKEN ${f}: err`);
  }
}
console.log(
  `\nCALIBRATION: good=${GOOD.length} falsePositives=${fp} | broken=${BROKEN.length} missed=${fn} | unreadable=${err}`
);
