/**
 * Ratchet: no NEW script calls the Anthropic API directly (LLM_5_5_TUNING.md cleanup, F4; 2026-09-30).
 *
 * 106 offline dev scripts still call api.anthropic.com themselves. 104 read `content[0].text` and send no `thinking`
 * field, so they break on Sonnet 5.5 (it thinks by default and the first block is the thinking) and stay pinned to
 * 4.6 via scripts/lib/models.js until they move to scripts/lib/anthropic.js. They never touch users. This test keeps
 * that list from growing, and makes a migrated script leave the list.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..', '..');
const LIST = JSON.parse(
  fs.readFileSync(path.join(ROOT, '__tests__', 'fixtures', 'rawAnthropicCallers.json'), 'utf8')
) as { safe: string[]; legacy: string[] };
const RAW = /api\.anthropic\.com\/v1\/messages|new Anthropic\(|anthropic\.messages\.create/;

function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(js|mjs|cjs|ts)$/.test(e.name)) out.push(path.relative(ROOT, p));
  }
  return out;
}

const found = walk(path.join(ROOT, 'scripts'))
  .filter((f) => f !== path.join('scripts', 'lib', 'anthropic.js') && !/\/_tmp-[^/]+$/.test(f))
  .filter((f) => RAW.test(fs.readFileSync(path.join(ROOT, f), 'utf8')))
  .sort();
const listed = new Set([...LIST.safe, ...LIST.legacy]);

describe('direct Anthropic callers in scripts/', () => {
  it('no new script calls the API directly (use scripts/lib/anthropic.js)', () => {
    expect(found.filter((f) => !listed.has(f))).toEqual([]);
  });
  it('a script that no longer calls it directly is removed from the list (the list only shrinks)', () => {
    expect([...listed].filter((f) => !found.includes(f))).toEqual([]);
  });
  it('the shared seeding helpers stay 5.5-ready (offlineBody + parseReply)', () => {
    for (const f of LIST.safe) {
      expect(fs.readFileSync(path.join(ROOT, f), 'utf8')).toMatch(
        /offlineBody[\s\S]*parseReply|parseReply[\s\S]*offlineBody/
      );
    }
  });
});
