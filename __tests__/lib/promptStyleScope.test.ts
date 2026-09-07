/** The couple prompt ORDER knob is nightly-only: no Create / DLT / first-dream path may pass `promptStyle`
 *  (COUPLE_PROMPT_PARITY_PLAN.md §2). Fails the moment another edge path starts passing it. */
import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..', '..', 'supabase', 'functions');
const ALLOWED = new Set(['_shared/characterSlotPrompt.ts', 'nightly-dreams/index.ts']);

function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.ts')) out.push(p);
  }
  return out;
}

it('promptStyle is only referenced by the slot assembler and the nightly render', () => {
  const hits = walk(ROOT)
    // a PASS is the property form `promptStyle:` (object literal / interface field), not a mention in prose
    .filter((f) => /\bpromptStyle\b\s*\??\s*:/.test(fs.readFileSync(f, 'utf8')))
    .map((f) => path.relative(ROOT, f))
    .filter((f) => !ALLOWED.has(f));
  expect(hits).toEqual([]);
});
