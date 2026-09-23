/**
 * FAILSAFE for the unpaginated `bot_dedup` read (found 2026-09-23).
 *
 * `createPicker` loaded a bot's whole recency set with a single
 * `sb.from('bot_dedup').select(...).eq('bot_name', …)` — no `.range()`, no
 * `.order()`. PostgREST silently caps a read at 1000 rows, so on any bot past
 * that cap the recency set was both TRUNCATED and, with no ordering, arbitrary.
 *
 * The engine's own contract is that "every entry is picked exactly once before
 * any repeats". That guarantee had been inert across most of the fleet, quietly
 * degrading the shuffle-bag to plain random. Measured at the time of the fix:
 *
 *   17 of 19 bots were over the cap, 90,019 rows total
 *   gothbot: 9,154 rows, and the old read exposed only 14 of its 128 AXES
 *            — i.e. 89% of its axes had zero recency data
 *
 * It surfaced on SteamBot `rooftop-telegraph`, where every axis drew a duplicate
 * per 6-render batch and 4 of 6 renders rolled the same look out of a 6-entry
 * pool, because that path's seven brand-new axes were invisible to the read.
 *
 * This is a source-level guard because the fast jest lane has no database. It
 * asserts the two halves that matter, since either one alone still loses rows:
 * the read must PAGE, and it must page on a STABLE order.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const ENGINE_PATH = join(__dirname, '../../scripts/lib/botEngine.js');
const src = readFileSync(ENGINE_PATH, 'utf8');

/**
 * Every `bot_dedup` query in the engine, with enough trailing context to see its
 * modifiers.
 *
 * Line comments are stripped FIRST, and that is not incidental: the query chain
 * carries an explanatory comment, a semicolon inside it ended the match early,
 * and this guard reported a false failure against correct code. A guard that
 * cries wolf gets deleted, so it has to be robust to prose.
 */
function dedupQueries(): string[] {
  const clean = src.replace(/\/\/[^\n]*/g, '');
  return [...clean.matchAll(/\.from\(\s*['"]bot_dedup['"]\s*\)[\s\S]{0,400}?;/g)].map((m) => m[0]);
}

describe('bot_dedup reads must paginate — PostgREST caps at 1000 rows', () => {
  it('the engine still queries bot_dedup at all', () => {
    expect(dedupQueries().length).toBeGreaterThan(0);
  });

  it('has a dedicated paginated loader rather than an inline select', () => {
    expect(src).toMatch(/async function loadDedupRows\s*\(/);
  });

  it('createPicker uses that loader', () => {
    const picker = src.slice(src.indexOf('async function createPicker'));
    expect(picker.slice(0, 600)).toMatch(/loadDedupRows\s*\(/);
  });

  describe('every SELECT against bot_dedup', () => {
    // A write (insert/delete/upsert) needs no pagination; only reads do.
    const selects = dedupQueries().filter((q) => /\.select\(/.test(q) && !/count\s*:/.test(q));

    it('there is at least one select to check', () => {
      expect(selects.length).toBeGreaterThan(0);
    });

    it.each(selects.map((q, i) => [i, q] as [number, string]))(
      'select #%i pages with .range() and orders for a stable boundary',
      (_i: number, q: string) => {
        // .range() is what defeats the 1000-row cap...
        expect(q).toMatch(/\.range\(/);
        // ...and without a deterministic order, rows can repeat or vanish
        // between pages, which silently loses recency data again.
        expect(q).toMatch(/\.order\(/);
      }
    );
  });

  it('the loader actually loops rather than fetching one page', () => {
    const loader = src.slice(src.indexOf('async function loadDedupRows'));
    const body = loader.slice(0, loader.indexOf('\n}\n') + 1);
    // A single .range() with no loop is the same bug with extra steps.
    expect(body).toMatch(/for\s*\(|while\s*\(/);
    // and it must terminate on a short page, not a fixed page count
    expect(body).toMatch(/length\s*<\s*PAGE|length\s*<\s*\d+/);
  });
});
